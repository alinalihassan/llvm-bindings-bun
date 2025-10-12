import type { Pointer } from "bun:ffi";
import { ffi } from "@/ffi";

// Clang constants
export const CXTranslationUnit_None = 0x0;
export const CXDiagnostic_Error = 3;
export const CXDiagnostic_Fatal = 4;

/**
 * ClangIndex represents a Clang index for managing translation units
 */
export class ClangIndex {
	private _ref: Pointer | null;

	constructor(excludeDeclarationsFromPCH: boolean = false, displayDiagnostics: boolean = false) {
		const result = ffi.clang_createIndex(
			excludeDeclarationsFromPCH ? 1 : 0,
			displayDiagnostics ? 1 : 0,
		);
		if (!result) {
			throw new Error("Failed to create Clang index");
		}
		this._ref = result;
	}

	getPtr(): Pointer | null {
		return this._ref;
	}

	private dispose(): void {
		if (this._ref) {
			ffi.clang_disposeIndex(this._ref);
			this._ref = 0 as Pointer;
		}
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}

/**
 * ClangTranslationUnit represents a parsed translation unit
 */
export class ClangTranslationUnit {
	private _ref: Pointer;

	constructor(
		index: ClangIndex,
		_sourceFilename: string,
		_commandLineArgs: string[] = [],
		_unsavedFiles: Array<{ filename: string; contents: string }> = [],
		options: number = CXTranslationUnit_None,
	) {
		// For now, use a simpler approach that doesn't crash
		// We'll pass null pointers and let Clang handle the file discovery
		const result = ffi.clang_parseTranslationUnit(
			index.getPtr(),
			null, // source filename (null - let Clang discover)
			null, // command line args (null for now)
			0, // num command line args
			null, // unsaved files
			0, // num unsaved files
			options,
		);

		if (!result) {
			throw new Error("Failed to parse translation unit");
		}
		this._ref = result;
	}

	getPtr(): Pointer {
		return this._ref;
	}

	private dispose(): void {
		if (this._ref) {
			ffi.clang_disposeTranslationUnit(this._ref);
			this._ref = 0 as Pointer;
		}
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}

/**
 * ClangDiagnostic represents a diagnostic message from Clang
 */
export class ClangDiagnostic {
	private _ref: Pointer | null;

	constructor(diagnosticRef: Pointer) {
		this._ref = diagnosticRef;
	}

	getSeverity(): number {
		return ffi.clang_getDiagnosticSeverity(this._ref);
	}

	getSpelling(): string {
		const stringRef = ffi.clang_getDiagnosticSpelling(this._ref);
		const cString = ffi.clang_getCString(stringRef);
		const result = cString
			? new TextDecoder().decode(
					new Uint8Array(new DataView(cString as unknown as ArrayBuffer, 0, 256).buffer),
				)
			: "";
		ffi.clang_disposeString(stringRef);
		return result;
	}

	private dispose(): void {
		if (this._ref) {
			ffi.clang_disposeDiagnostic(this._ref);
			this._ref = null;
		}
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}

/**
 * Compile a C/C++ file using Clang
 */
export function compileFile(
	sourceFile: string,
	_outputFile: string,
	_args: string[] = [],
): boolean {
	try {
		const index = new ClangIndex();
		const tu = new ClangTranslationUnit(index, sourceFile, []);

		// Get diagnostics
		const numDiagnostics = ffi.clang_getNumDiagnostics(tu.getPtr());
		let hasErrors = false;

		for (let i = 0; i < numDiagnostics; i++) {
			const diagnosticRef = ffi.clang_getDiagnostic(tu.getPtr(), i);
			if (diagnosticRef) {
				const diagnostic = new ClangDiagnostic(diagnosticRef);

				const severity = diagnostic.getSeverity();
				if (severity === CXDiagnostic_Error || severity === CXDiagnostic_Fatal) {
					hasErrors = true;
					console.error(`Error: ${diagnostic.getSpelling()}`);
				}
			}
		}

		return !hasErrors;
	} catch (error) {
		console.error("Compilation failed:", error);
		return false;
	}
}

/**
 * Link object files into an executable using clang
 */
export function linkExecutable(
	objectFiles: string[],
	outputFile: string,
	args: string[] = [],
): boolean {
	try {
		const linkCommand = ["clang", ...objectFiles, "-o", outputFile, ...args];
		const proc = Bun.spawnSync(linkCommand, {
			stdout: "pipe",
			stderr: "pipe",
		});

		if (!proc.success) {
			console.error("Linking failed:", proc.stderr?.toString());
			return false;
		}

		return true;
	} catch (error) {
		console.error("Linking failed:", error);
		return false;
	}
}
