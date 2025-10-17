import { type FFIFunction, FFIType } from "bun:ffi";

const LLVMContextSymbols: Record<string, FFIFunction> = {
	LLVMContextCreate: {
		args: [],
		returns: /* LLVMContextRef */ FFIType.ptr,
	},
	LLVMContextDispose: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
};

export { LLVMContextSymbols };
