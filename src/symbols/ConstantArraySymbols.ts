import { type FFIFunction, FFIType } from "bun:ffi";

const ConstantArraySymbols: Record<string, FFIFunction> = {
	LLVMConstArray2: {
		args: [
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Vals: LLVMValueRef * */ FFIType.ptr,
			/* Length: unsigned */ FFIType.u32,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
};

export { ConstantArraySymbols };
