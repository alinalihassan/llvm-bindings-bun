import { type FFIFunction, FFIType } from "bun:ffi";

const PassBuilderSymbols: Record<string, FFIFunction> = {
	LLVMRunPasses: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Passes: const char * */ FFIType.cstring,
			/* TM: LLVMTargetMachineRef */ FFIType.ptr,
			/* Options: LLVMPassBuilderOptionsRef */ FFIType.ptr,
		],
		returns: /* LLVMErrorRef */ FFIType.ptr,
	},
	LLVMRunPassesOnFunction: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Passes: const char * */ FFIType.cstring,
			/* TM: LLVMTargetMachineRef */ FFIType.ptr,
			/* Options: LLVMPassBuilderOptionsRef */ FFIType.ptr,
		],
		returns: /* LLVMErrorRef */ FFIType.ptr,
	},
	LLVMCreatePassBuilderOptions: {
		args: [],
		returns: /* LLVMPassBuilderOptionsRef */ FFIType.ptr,
	},
	LLVMPassBuilderOptionsSetVerifyEach: {
		args: [
			/* Options: LLVMPassBuilderOptionsRef */ FFIType.ptr,
			/* VerifyEach: LLVMBool */ FFIType.i32,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMPassBuilderOptionsSetDebugLogging: {
		args: [
			/* Options: LLVMPassBuilderOptionsRef */ FFIType.ptr,
			/* DebugLogging: LLVMBool */ FFIType.i32,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMDisposePassBuilderOptions: {
		args: [/* Options: LLVMPassBuilderOptionsRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
};

export { PassBuilderSymbols };
