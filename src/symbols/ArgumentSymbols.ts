import { FFIType } from "bun:ffi";

const ArgumentSymbols = {
	LLVMGetParamParent: {
		args: [/* Param: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const;

export { ArgumentSymbols };
