import { FFIType } from "bun:ffi";

const InstructionSymbols = {
	LLVMGetInstructionParent: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMGetNextInstruction: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetPreviousInstruction: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMInstructionRemoveFromParent: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMInstructionEraseFromParent: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMDeleteInstruction: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMGetInstructionOpcode: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetICmpPredicate: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetICmpSameSign: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMSetICmpSameSign: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr, /* SameSign: LLVMBool */ FFIType.bool],
		returns: /* void */ FFIType.void,
	},
	LLVMGetFCmpPredicate: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMInstructionClone: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNumSuccessors: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetSuccessor: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr, /* i: unsigned */ FFIType.u32],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMSetSuccessor: {
		args: [
			/* Term: LLVMValueRef */ FFIType.ptr,
			/* i: unsigned */ FFIType.u32,
			/* block: LLVMBasicBlockRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMIsATerminatorInst: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetParentCatchSwitch: {
		args: [/* CatchPad: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMSetParentCatchSwitch: {
		args: [/* CatchPad: LLVMValueRef */ FFIType.ptr, /* CatchSwitch: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
} as const;

export { InstructionSymbols };
