import type { Pointer } from "bun:ffi";
import { ffi } from "@/ffi";
import { cstring } from "@/utils";

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
		sourceFilename: string,
		commandLineArgs: string[] = [],
		_unsavedFiles: Array<{ filename: string; contents: string }> = [],
		options: number = CXTranslationUnit_None,
	) {
		// For now, use a simpler approach that works with the existing FFI setup
		// Pass null for command line args to avoid the complex string array handling
		const result = ffi.clang_parseTranslationUnit(
			index.getPtr(),
			cstring(sourceFilename),
			null, // command line args (simplified for now)
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

	getDiagnostics(): ClangDiagnostic[] {
		const numDiagnostics = ffi.clang_getNumDiagnostics(this._ref);
		const diagnostics: ClangDiagnostic[] = [];

		for (let i = 0; i < numDiagnostics; i++) {
			const diagnosticRef = ffi.clang_getDiagnostic(this._ref, i);
			if (diagnosticRef) {
				diagnostics.push(new ClangDiagnostic(diagnosticRef));
			}
		}

		return diagnostics;
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

		// Convert C string to JavaScript string
		let result = "";
		if (cString) {
			// Use Bun's built-in string conversion for C strings
			try {
				// Try to convert the pointer to a string directly
				result = new TextDecoder().decode(
					new Uint8Array(cString as unknown as ArrayBuffer, 0, 1024),
				);
				// Remove null terminator and any trailing garbage
				const nullIndex = result.indexOf("\0");
				if (nullIndex !== -1) {
					result = result.substring(0, nullIndex);
				}
			} catch (e) {
				// Fallback: return a generic message
				result = "Compilation diagnostic";
			}
		}

		ffi.clang_disposeString(stringRef);
		return result;
	}

	getSeverityString(): string {
		const severity = this.getSeverity();

		// Map severity numbers to strings based on Clang's CXDiagnosticSeverity enum
		switch (severity) {
			case 0:
				return "Ignored";
			case 1:
				return "Note";
			case 2:
				return "Warning";
			case 3:
				return "Error";
			case 4:
				return "Fatal";
			default:
				return "Unknown";
		}
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
	args: string[] = [],
): { success: boolean; diagnostics: ClangDiagnostic[] } {
	try {
		const index = new ClangIndex();
		const tu = new ClangTranslationUnit(index, sourceFile, args);

		// Get diagnostics
		const diagnostics = tu.getDiagnostics();
		let hasErrors = false;

		for (const diagnostic of diagnostics) {
			const severity = diagnostic.getSeverity();
			if (severity === CXDiagnostic_Error || severity === CXDiagnostic_Fatal) {
				hasErrors = true;
				console.error(`Error: ${diagnostic.getSpelling()}`);
			}
		}

		return { success: !hasErrors, diagnostics };
	} catch (error) {
		console.error("Compilation failed:", error);
		return { success: false, diagnostics: [] };
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
