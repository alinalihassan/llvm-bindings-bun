import { FFIType } from "bun:ffi";

const PointerTypeSymbols = {
	LLVMPointerType: {
		args: [/* ElementType: LLVMTypeRef */ FFIType.ptr, /* AddressSpace: unsigned */ FFIType.u32],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetElementType: {
		args: [/* Ty: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetPointerAddressSpace: {
		args: [/* PointerTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
} as const;

export { PointerTypeSymbols };
