import { FFIType } from "bun:ffi";

const ConstantFPSymbols = {
	LLVMConstReal: {
		args: [/* RealTy: LLVMTypeRef */ FFIType.ptr, /* N: double */ FFIType.f64],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMConstRealGetDouble: {
		args: [/* ConstantVal: LLVMValueRef */ FFIType.ptr, /* losesInfo: LLVMBool * */ FFIType.ptr],
		returns: /* double */ FFIType.f64,
	},
	LLVMConstRealOfString: {
		args: [/* RealTy: LLVMTypeRef */ FFIType.ptr, /* Text: const char * */ FFIType.cstring],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const;

export { ConstantFPSymbols };
