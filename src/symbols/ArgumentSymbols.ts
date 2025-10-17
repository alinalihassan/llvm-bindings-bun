import { type FFIFunction, FFIType } from "bun:ffi";

const ArgumentSymbols = {
	LLVMGetParamParent: {
		args: [/* Param: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const satisfies Record<string, FFIFunction>;

export { ArgumentSymbols };
