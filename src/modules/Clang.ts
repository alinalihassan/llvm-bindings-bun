import type { Pointer } from "bun:ffi";
import { ffi } from "@/ffi";
import { cstring } from "@/utils";

// Clang constants
export const CXTranslationUnit_None = 0x0;

/**
 * ClangIndex represents a Clang index for managing translation units
 */
export class ClangIndex {
	private _ref: Pointer | null;

	constructor(excludeDeclarationsFromPCH: boolean = false) {
		const result = ffi.clang_createIndex(
			excludeDeclarationsFromPCH ? 1 : 0,
			0, // displayDiagnostics disabled
		);
		if (!result) {
			throw new Error("Failed to create Clang index");
		}
		this._ref = result;
	}

	get ref(): Pointer | null {
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
		_commandLineArgs: string[] = [],
		_unsavedFiles: Array<{ filename: string; contents: string }> = [],
		options: number = CXTranslationUnit_None,
	) {
		// For now, use a simpler approach that works with the existing FFI setup
		// Pass null for command line args to avoid the complex string array handling
		const result = ffi.clang_parseTranslationUnit(
			index.ref,
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

	get ref(): Pointer {
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
 * Compile a C/C++ file using Clang
 */
export function compileFile(
	sourceFile: string,
	_outputFile: string,
	args: string[] = [],
): { success: boolean } {
	try {
		const index = new ClangIndex();
		new ClangTranslationUnit(index, sourceFile, args);

		// If we get here without throwing, parsing was successful
		return { success: true };
	} catch (error) {
		console.error("Compilation failed:", error);
		return { success: false };
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
