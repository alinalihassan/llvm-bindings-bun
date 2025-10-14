import { FFIType } from "bun:ffi";

const ConstantStructSymbols = {
	LLVMConstStruct: {
		args: [
			/* ConstantVals: LLVMValueRef */ FFIType.ptr,
			/* Count: unsigned */ FFIType.u32,
			/* Packed: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const;

export { ConstantStructSymbols };
