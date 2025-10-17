import { type FFIFunction, FFIType } from "bun:ffi";

const LLVMContextSymbols = {
	LLVMContextCreate: {
		args: [],
		returns: /* LLVMContextRef */ FFIType.ptr,
	},
	LLVMContextDispose: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
} as const satisfies Record<string, FFIFunction>;

export { LLVMContextSymbols };
