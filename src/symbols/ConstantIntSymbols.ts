import { type FFIFunction, FFIType } from "bun:ffi";

const ConstantIntSymbols = {
	LLVMConstInt: {
		args: [
			/* IntTy: LLVMTypeRef */ FFIType.ptr,
			/* N: uint64_t */ FFIType.u64,
			/* SignExtend: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const satisfies Record<string, FFIFunction>;

export { ConstantIntSymbols };
