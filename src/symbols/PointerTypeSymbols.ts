import { type FFIFunction, FFIType } from "bun:ffi";

const PointerTypeSymbols: Record<string, FFIFunction> = {
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
	LLVMPointerTypeIsOpaque: {
		args: [/* PointerTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
};

export { PointerTypeSymbols };
