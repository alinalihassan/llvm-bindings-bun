import { FFIType } from "bun:ffi";

const UserSymbols = {
	LLVMGetOperand: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr, /* Index: unsigned */ FFIType.u32],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMSetOperand: {
		args: [
			/* User: LLVMValueRef */ FFIType.ptr,
			/* Index: unsigned */ FFIType.u32,
			/* Val: LLVMValueRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetNumOperands: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMIsConstant: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.i32,
	},
} as const;

export { UserSymbols };
