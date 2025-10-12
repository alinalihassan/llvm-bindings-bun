import { FFIType } from "bun:ffi";

const TargetSymbols = {
	LLVMGetDefaultTargetTriple: {
		args: [],
		returns: /* char * */ FFIType.cstring,
	},
	LLVMGetTargetFromTriple: {
		args: [
			/* Triple: const char * */ FFIType.cstring,
			/* T: LLVMTargetRef * */ FFIType.ptr,
			/* ErrorMessage: char ** */ FFIType.ptr,
		],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetTargetFromName: {
		args: [/* Name: const char * */ FFIType.cstring],
		returns: /* LLVMTargetRef */ FFIType.ptr,
	},
	LLVMGetTargetName: {
		args: [/* T: LLVMTargetRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMGetTargetDescription: {
		args: [/* T: LLVMTargetRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMTargetHasJIT: {
		args: [/* T: LLVMTargetRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMTargetHasTargetMachine: {
		args: [/* T: LLVMTargetRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMTargetHasAsmBackend: {
		args: [/* T: LLVMTargetRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},

	// AArch64 target initialization functions
	LLVMInitializeAArch64TargetInfo: { args: [], returns: FFIType.void },
	LLVMInitializeAArch64Target: { args: [], returns: FFIType.void },
	LLVMInitializeAArch64TargetMC: { args: [], returns: FFIType.void },
	LLVMInitializeAArch64AsmParser: { args: [], returns: FFIType.void },
	LLVMInitializeAArch64AsmPrinter: { args: [], returns: FFIType.void },

	// X86 target initialization functions
	LLVMInitializeX86TargetInfo: { args: [], returns: FFIType.void },
	LLVMInitializeX86Target: { args: [], returns: FFIType.void },
	LLVMInitializeX86TargetMC: { args: [], returns: FFIType.void },
	LLVMInitializeX86AsmParser: { args: [], returns: FFIType.void },
	LLVMInitializeX86AsmPrinter: { args: [], returns: FFIType.void },

	// ARM target initialization functions (might be needed for AArch64)
	LLVMInitializeARMTargetInfo: { args: [], returns: FFIType.void },
	LLVMInitializeARMTarget: { args: [], returns: FFIType.void },
	LLVMInitializeARMTargetMC: { args: [], returns: FFIType.void },
	LLVMInitializeARMAsmParser: { args: [], returns: FFIType.void },
	LLVMInitializeARMAsmPrinter: { args: [], returns: FFIType.void },
} as const;

export { TargetSymbols };
