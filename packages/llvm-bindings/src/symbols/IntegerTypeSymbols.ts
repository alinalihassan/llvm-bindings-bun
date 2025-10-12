import { FFIType } from "bun:ffi";

const IntegerTypeSymbols = {
	LLVMGetIntTypeWidth: {
		args: [/* IntegerTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
} as const;

export { IntegerTypeSymbols };
