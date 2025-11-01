import { type FFIFunction, FFIType } from "bun:ffi";

const GlobalValueSymbols = {
	LLVMGlobalGetValueType: {
		args: [/* GlobalVal: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetGlobalParent: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMModuleRef */ FFIType.ptr,
	},
} as const satisfies Record<string, FFIFunction>;

export { GlobalValueSymbols };
