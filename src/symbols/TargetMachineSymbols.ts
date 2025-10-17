import { type FFIFunction, FFIType } from "bun:ffi";

const TargetMachineSymbols: Record<string, FFIFunction> = {
	LLVMCreateTargetMachine: {
		args: [
			/* T: LLVMTargetRef */ FFIType.ptr,
			/* Triple: const char * */ FFIType.cstring,
			/* CPU: const char * */ FFIType.cstring,
			/* Features: const char * */ FFIType.cstring,
			/* Level: LLVMCodeGenOptLevel */ FFIType.u32,
			/* Reloc: LLVMRelocMode */ FFIType.u32,
			/* CodeModel: LLVMCodeModel */ FFIType.u32,
		],
		returns: /* LLVMTargetMachineRef */ FFIType.ptr,
	},
	LLVMDisposeTargetMachine: {
		args: [/* T: LLVMTargetMachineRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMCreateTargetDataLayout: {
		args: [/* T: LLVMTargetMachineRef */ FFIType.ptr],
		returns: /* LLVMTargetDataRef */ FFIType.ptr,
	},
	LLVMTargetMachineEmitToFile: {
		args: [
			/* T: LLVMTargetMachineRef */ FFIType.ptr,
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Filename: const char * */ FFIType.cstring,
			/* codegen: LLVMCodeGenFileType */ FFIType.u32,
			/* ErrorMessage: char ** */ FFIType.ptr,
		],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMTargetMachineEmitToMemoryBuffer: {
		args: [
			/* T: LLVMTargetMachineRef */ FFIType.ptr,
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* codegen: LLVMCodeGenFileType */ FFIType.u32,
			/* ErrorMessage: char ** */ FFIType.ptr,
			/* OutMemBuf: LLVMMemoryBufferRef * */ FFIType.ptr,
		],
		returns: /* LLVMBool */ FFIType.bool,
	},
};

export { TargetMachineSymbols };
