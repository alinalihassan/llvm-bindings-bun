import { type FFIFunction, FFIType } from "bun:ffi";

const GlobalValueSymbols: Record<string, FFIFunction> = {
	LLVMGlobalGetValueType: {
		args: [/* GlobalVal: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
};

export { GlobalValueSymbols };
