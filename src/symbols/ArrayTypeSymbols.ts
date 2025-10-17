import { type FFIFunction, FFIType } from "bun:ffi";

const ArrayTypeSymbols = {
	LLVMArrayType: {
		args: [/* ElementType: LLVMTypeRef */ FFIType.ptr, /* ElementCount: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetElementType: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetArrayLength: {
		args: [/* ArrayTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* uint64_t */ FFIType.u64,
	},
} as const satisfies Record<string, FFIFunction>;

export { ArrayTypeSymbols };
