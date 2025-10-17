import { type FFIFunction, FFIType } from "bun:ffi";

const ConstantIntSymbols: Record<string, FFIFunction> = {
	LLVMConstInt: {
		args: [
			/* IntTy: LLVMTypeRef */ FFIType.ptr,
			/* N: uint64_t */ FFIType.u64,
			/* SignExtend: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
};

export { ConstantIntSymbols };
