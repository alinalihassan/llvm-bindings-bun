import { type FFIFunction, FFIType } from "bun:ffi";

const ConstantSymbols = {
	LLVMConstNull: {
		args: [/* Type: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMConstAllOnes: {
		args: [/* Type: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetUndef: {
		args: [/* Type: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetPoison: {
		args: [/* Type: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMIsNull: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMConstPointerNull: {
		args: [/* Type: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const satisfies Record<string, FFIFunction>;

export { ConstantSymbols };
