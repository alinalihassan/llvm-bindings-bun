import { FFIType } from "bun:ffi";

export const ClangSymbols = {
	// Index functions
	clang_createIndex: {
		args: [FFIType.i32, FFIType.i32],
		returns: FFIType.ptr,
	},

	clang_disposeIndex: {
		args: [FFIType.ptr],
		returns: FFIType.void,
	},

	// Translation unit functions
	clang_parseTranslationUnit: {
		args: [
			FFIType.ptr,
			FFIType.ptr,
			FFIType.ptr,
			FFIType.i32,
			FFIType.ptr,
			FFIType.i32,
			FFIType.i32,
		],
		returns: FFIType.ptr,
	},

	clang_disposeTranslationUnit: {
		args: [FFIType.ptr],
		returns: FFIType.void,
	},

	// Diagnostic functions
	clang_getNumDiagnostics: {
		args: [FFIType.ptr],
		returns: FFIType.i32,
	},

	clang_getDiagnostic: {
		args: [FFIType.ptr, FFIType.i32],
		returns: FFIType.ptr,
	},

	clang_getDiagnosticSeverity: {
		args: [FFIType.ptr],
		returns: FFIType.i32,
	},

	clang_getDiagnosticSpelling: {
		args: [FFIType.ptr],
		returns: FFIType.ptr,
	},

	clang_disposeDiagnostic: {
		args: [FFIType.ptr],
		returns: FFIType.void,
	},

	// String functions
	clang_getCString: {
		args: [FFIType.ptr],
		returns: FFIType.ptr,
	},

	clang_disposeString: {
		args: [FFIType.ptr],
		returns: FFIType.void,
	},
} as const;
