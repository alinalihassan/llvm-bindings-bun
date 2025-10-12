import { FFIType } from "bun:ffi";

const InstructionsSymbols = {
	LLVMGetAlignment: {
		args: [/* Value: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMSetAlignment: {
		args: [/* Value: LLVMValueRef */ FFIType.ptr, /* Alignment: unsigned */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	// BranchInst functions
	LLVMIsConditional: {
		args: [/* Branch: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetCondition: {
		args: [/* Branch: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMSetCondition: {
		args: [/* Branch: LLVMValueRef */ FFIType.ptr, /* Condition: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMGetAllocatedType: {
		args: [/* Alloca: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
} as const;

export { InstructionsSymbols };
