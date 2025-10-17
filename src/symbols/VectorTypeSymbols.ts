import { type FFIFunction, FFIType } from "bun:ffi";

const VectorTypeSymbols: Record<string, FFIFunction> = {
	LLVMGetVectorSize: {
		args: [/* VectorTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
};

export { VectorTypeSymbols };
