import { FFIType } from "bun:ffi";

const GlobalValueSymbols = {
	LLVMGlobalGetValueType: {
		args: [/* GlobalVal: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
} as const;

export { GlobalValueSymbols };
