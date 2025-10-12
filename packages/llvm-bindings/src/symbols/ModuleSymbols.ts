import { FFIType } from "bun:ffi";

const ModuleSymbols = {
	LLVMModuleCreateWithName: {
		args: [/* ModuleID: const char * */ FFIType.cstring],
		returns: /* LLVMModuleRef */ FFIType.ptr,
	},
	LLVMModuleCreateWithNameInContext: {
		args: [
			/* ModuleID: const char * */ FFIType.cstring,
			/* C: LLVMContextRef */ FFIType.ptr,
		],
		returns: /* LLVMModuleRef */ FFIType.ptr,
	},
	LLVMDisposeModule: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMPrintModuleToString: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* char * */ FFIType.cstring,
	},
	LLVMGetModuleIdentifier: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr, /* Len: size_t * */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMSetModuleIdentifier: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Ident: const char * */ FFIType.cstring,
			/* Len: unsigned */ FFIType.u32,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetSourceFileName: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr, /* Len: size_t * */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMSetSourceFileName: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* Len: size_t */ FFIType.u64,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetDataLayoutStr: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMSetDataLayout: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Triple: const char * */ FFIType.cstring,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetTarget: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMSetTarget: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Triple: const char * */ FFIType.cstring,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetNamedFunction: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetFirstFunction: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNamedGlobal: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetFirstGlobal: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMAddModuleFlag: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* LLVMModuleFlagBehavior Behavior */ FFIType.u32,
			/* Key: const char * */ FFIType.cstring,
			/* size_t KeyLen */ FFIType.u64,
			/* Val: LLVMMetadataRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
} as const;

export { ModuleSymbols };
