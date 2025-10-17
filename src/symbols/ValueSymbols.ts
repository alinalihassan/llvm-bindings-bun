import { type FFIFunction, FFIType } from "bun:ffi";

const ValueSymbols: Record<string, FFIFunction> = {
	LLVMTypeOf: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetValueName: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.ptr,
	},
	LLVMSetValueName: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr, /* Name: const char * */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMDeleteInstruction: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMReplaceAllUsesWith: {
		args: [/* OldVal: LLVMValueRef */ FFIType.ptr, /* NewVal: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
};

export { ValueSymbols };
