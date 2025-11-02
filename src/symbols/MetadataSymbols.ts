import { type FFIFunction, FFIType } from "bun:ffi";

const MetadataSymbols = {
	LLVMGetDebugLocDirectory: {
		args: [
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* Length: unsigned * */ FFIType.ptr,
		],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMGetDebugLocFilename: {
		args: [
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* Length: unsigned * */ FFIType.ptr,
		],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMGetDebugLocLine: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetDebugLocColumn: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMAddMetadataToInst: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Inst: LLVMValueRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMBuilderGetDefaultFPMathTag: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* LLVMMetadataRef */ FFIType.ptr,
	},
	LLVMBuilderSetDefaultFPMathTag: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* FPMathTag: LLVMMetadataRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetCurrentDebugLocation2: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* LLVMMetadataRef */ FFIType.ptr,
	},
	LLVMSetCurrentDebugLocation2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Loc: LLVMMetadataRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	// Metadata creation and manipulation
	LLVMMDStringInContext2: {
		args: [
			/* C: LLVMContextRef */ FFIType.ptr,
			/* Str: const char * */ FFIType.cstring,
			/* SLen: size_t */ FFIType.u64,
		],
		returns: /* LLVMMetadataRef */ FFIType.ptr,
	},
	LLVMMDNodeInContext2: {
		args: [
			/* C: LLVMContextRef */ FFIType.ptr,
			/* MDs: LLVMMetadataRef * */ FFIType.ptr,
			/* Count: size_t */ FFIType.u64,
		],
		returns: /* LLVMMetadataRef */ FFIType.ptr,
	},
	LLVMMetadataAsValue: {
		args: [
			/* C: LLVMContextRef */ FFIType.ptr,
			/* MD: LLVMMetadataRef */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMValueAsMetadata: {
		args: [/* Val: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMMetadataRef */ FFIType.ptr,
	},
	LLVMGetMDString: {
		args: [
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Length: unsigned * */ FFIType.ptr,
		],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMGetMDNodeNumOperands: {
		args: [/* V: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetMDNodeOperands: {
		args: [
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Dest: LLVMValueRef * */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMReplaceMDNodeOperandWith: {
		args: [
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Index: unsigned */ FFIType.u32,
			/* Replacement: LLVMMetadataRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
} as const satisfies Record<string, FFIFunction>;

export { MetadataSymbols };
