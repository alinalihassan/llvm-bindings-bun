import { type FFIFunction, FFIType } from "bun:ffi";

const FunctionTypeSymbols = {
	LLVMFunctionType: {
		args: [
			/* ReturnType: LLVMTypeRef */ FFIType.ptr,
			/* ParamTypes: LLVMTypeRef * */ FFIType.ptr,
			/* ParamCount: unsigned */ FFIType.u32,
			/* IsVarArg: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMIsFunctionVarArg: {
		args: [/* FunctionTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetReturnType: {
		args: [/* FunctionTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMCountParamTypes: {
		args: [/* FunctionTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetParamTypes: {
		args: [/* FunctionTy: LLVMTypeRef */ FFIType.ptr, /* Dest: LLVMTypeRef * */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
} as const satisfies Record<string, FFIFunction>;

export { FunctionTypeSymbols };
