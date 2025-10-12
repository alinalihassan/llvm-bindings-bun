import { FFIType } from "bun:ffi";

const APIntSymbols = {
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
	LLVMConstReal: {
		args: [/* RealTy: LLVMTypeRef */ FFIType.ptr, /* N: double */ FFIType.f64],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const;

export { APIntSymbols };
