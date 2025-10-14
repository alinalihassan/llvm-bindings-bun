import { FFIType } from "bun:ffi";

const ConstantArraySymbols = {
	LLVMConstArray2: {
		args: [
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Vals: LLVMValueRef * */ FFIType.ptr,
			/* Length: unsigned */ FFIType.u32,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const;

export { ConstantArraySymbols };
