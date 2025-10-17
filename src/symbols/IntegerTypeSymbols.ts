import { type FFIFunction, FFIType } from "bun:ffi";

const IntegerTypeSymbols: Record<string, FFIFunction> = {
	LLVMGetIntTypeWidth: {
		args: [/* IntegerTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
};

export { IntegerTypeSymbols };
