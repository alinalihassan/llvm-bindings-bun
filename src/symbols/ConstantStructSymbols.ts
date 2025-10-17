import { type FFIFunction, FFIType } from "bun:ffi";

const ConstantStructSymbols: Record<string, FFIFunction> = {
	LLVMConstStruct: {
		args: [
			/* ConstantVals: LLVMValueRef */ FFIType.ptr,
			/* Count: unsigned */ FFIType.u32,
			/* Packed: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
};

export { ConstantStructSymbols };
