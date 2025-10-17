import { type FFIFunction, FFIType } from "bun:ffi";

export const ClangSymbols: Record<string, FFIFunction> = {
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
};
