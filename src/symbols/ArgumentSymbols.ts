import { type FFIFunction, FFIType } from "bun:ffi";

const ArgumentSymbols: Record<string, FFIFunction> = {
	LLVMGetParamParent: {
		args: [/* Param: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
};

export { ArgumentSymbols };
