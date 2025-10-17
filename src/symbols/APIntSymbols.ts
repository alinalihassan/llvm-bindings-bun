import { type FFIFunction, FFIType } from "bun:ffi";

const APIntSymbols: Record<string, FFIFunction> = {
	LLVMConstIntOfArbitraryPrecision: {
		args: [
			/* IntTy: LLVMTypeRef */ FFIType.ptr,
			/* NumWords: unsigned */ FFIType.u32,
			/* Words: const uint64_t * */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMConstInt: {
		args: [
			/* IntTy: LLVMTypeRef */ FFIType.ptr,
			/* N: uint64_t */ FFIType.u64,
			/* SignExtend: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
};

export { APIntSymbols };
