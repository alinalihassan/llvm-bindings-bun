import { type FFIFunction, FFIType } from "bun:ffi";

const VectorTypeSymbols = {
	LLVMGetVectorSize: {
		args: [/* VectorTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
} as const satisfies Record<string, FFIFunction>;

export { VectorTypeSymbols };
