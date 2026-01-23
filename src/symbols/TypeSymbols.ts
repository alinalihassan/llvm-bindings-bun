import { type FFIFunction, FFIType } from "bun:ffi";

const TypeSymbols = {
	// Global context type functions
	LLVMInt1Type: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt8Type: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt16Type: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt32Type: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt64Type: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt128Type: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMIntType: {
		args: [/* NumBits: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMHalfType: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMBFloatType: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMFloatType: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMDoubleType: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMVoidType: {
		args: [],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	// Context-aware type functions
	LLVMInt1TypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt8TypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt16TypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt32TypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt64TypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMInt128TypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMIntTypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr, /* NumBits: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMHalfTypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMBFloatTypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMFloatTypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMDoubleTypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMVoidTypeInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMPointerType: {
		args: [/* ElementType: LLVMTypeRef */ FFIType.ptr, /* AddressSpace: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMFunctionType: {
		args: [
			/* ReturnType: LLVMTypeRef */ FFIType.ptr,
			/* ParamTypes: LLVMTypeRef * */ FFIType.ptr,
			/* ParamCount: unsigned */ FFIType.u32,
			/* IsVarArg: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMStructType: {
		args: [
			/* ElementTypes: LLVMTypeRef * */ FFIType.ptr,
			/* ElementCount: unsigned */ FFIType.u32,
			/* Packed: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMArrayType: {
		args: [/* ElementType: LLVMTypeRef */ FFIType.ptr, /* ElementCount: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMVectorType: {
		args: [
			/* ElementType: LLVMTypeRef */ FFIType.ptr,
			/* ElementCount: unsigned */ FFIType.u32,
			/* Scalable: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMScalableVectorType: {
		args: [/* ElementType: LLVMTypeRef */ FFIType.ptr, /* ElementCount: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetTypeKind: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMTypeKind */ FFIType.u32,
	},
	LLVMTypeIsSized: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetTypeContext: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMContextRef */ FFIType.ptr,
	},
	LLVMDumpType: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMPrintTypeToString: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* char * */ FFIType.cstring,
	},
	LLVMGetNumContainedTypes: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
} as const satisfies Record<string, FFIFunction>;

export { TypeSymbols };
