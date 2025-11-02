import { type FFIFunction, FFIType } from "bun:ffi";

const GlobalValueSymbols = {
	LLVMGetGlobalParent: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMModuleRef */ FFIType.ptr,
	},
	LLVMGlobalGetValueType: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMGetLinkage: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMLinkage */ FFIType.u32,
	},
	LLVMSetLinkage: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr, /* Linkage: LLVMLinkage */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	LLVMGetVisibility: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMVisibility */ FFIType.u32,
	},
	LLVMSetVisibility: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr, /* Viz: LLVMVisibility */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	LLVMGetSection: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMSetSection: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr, /* Section: const char * */ FFIType.cstring],
		returns: /* void */ FFIType.void,
	},
	LLVMGetUnnamedAddress: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMUnnamedAddr */ FFIType.u32,
	},
	LLVMSetUnnamedAddress: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr, /* UnnamedAddr: LLVMUnnamedAddr */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	LLVMGetAlignment: {
		args: [/* V: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMSetAlignment: {
		args: [/* V: LLVMValueRef */ FFIType.ptr, /* Bytes: unsigned */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	// Global metadata
	LLVMGlobalSetMetadata: {
		args: [
			/* Global: LLVMValueRef */ FFIType.ptr,
			/* Kind: unsigned */ FFIType.u32,
			/* MD: LLVMMetadataRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGlobalEraseMetadata: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr, /* Kind: unsigned */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	LLVMGlobalClearMetadata: {
		args: [/* Global: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
} as const satisfies Record<string, FFIFunction>;

export { GlobalValueSymbols };
