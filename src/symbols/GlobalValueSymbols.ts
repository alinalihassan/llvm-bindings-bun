import { type FFIFunction, FFIType } from "bun:ffi";

const GlobalValueSymbols = {
	LLVMGlobalGetValueType: {
		args: [/* GlobalVal: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
} as const satisfies Record<string, FFIFunction>;

export { GlobalValueSymbols };
