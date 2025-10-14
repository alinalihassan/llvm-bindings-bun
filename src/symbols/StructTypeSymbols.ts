import { FFIType } from "bun:ffi";

const StructTypeSymbols = {
	LLVMStructType: {
		args: [
			/* ElementTypes: LLVMTypeRef * */ FFIType.ptr,
			/* ElementCount: unsigned */ FFIType.u32,
			/* Packed: LLVMBool */ FFIType.bool,
		],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMStructGetTypeAtIndex: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr, /* i: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMCountStructElementTypes: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetStructElementTypes: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr, /* Dest: LLVMTypeRef * */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMIsPackedStruct: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMIsOpaqueStruct: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMIsLiteralStruct: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetStructName: {
		args: [/* StructTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
} as const;

export { StructTypeSymbols };
