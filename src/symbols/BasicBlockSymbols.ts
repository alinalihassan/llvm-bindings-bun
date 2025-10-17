import { type FFIFunction, FFIType } from "bun:ffi";

const BasicBlockSymbols: Record<string, FFIFunction> = {
	// BasicBlock creation and management
	LLVMCreateBasicBlockInContext: {
		args: [/* Context: LLVMContextRef */ FFIType.ptr, /* Name: const char* */ FFIType.ptr],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMAppendBasicBlockInContext: {
		args: [
			/* Context: LLVMContextRef */ FFIType.ptr,
			/* Fn: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMInsertBasicBlockInContext: {
		args: [
			/* Context: LLVMContextRef */ FFIType.ptr,
			/* BB: LLVMBasicBlockRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMDeleteBasicBlock: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMRemoveBasicBlockFromParent: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMMoveBasicBlockBefore: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr, /* MovePos: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMMoveBasicBlockAfter: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr, /* MovePos: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},

	// BasicBlock properties
	LLVMGetBasicBlockParent: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetBasicBlockTerminator: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetFirstInstruction: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetLastInstruction: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// BasicBlock iteration
	LLVMGetNextBasicBlock: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMGetPreviousBasicBlock: {
		args: [/* BB: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
};

export { BasicBlockSymbols };
