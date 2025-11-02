import { type FFIFunction, FFIType } from "bun:ffi";

const NamedMDNodeSymbols = {
	LLVMGetFirstNamedMetadata: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMNamedMDNodeRef */ FFIType.ptr,
	},
	LLVMGetLastNamedMetadata: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMNamedMDNodeRef */ FFIType.ptr,
	},
	LLVMGetNextNamedMetadata: {
		args: [/* NamedMDNode: LLVMNamedMDNodeRef */ FFIType.ptr],
		returns: /* LLVMNamedMDNodeRef */ FFIType.ptr,
	},
	LLVMGetPreviousNamedMetadata: {
		args: [/* NamedMDNode: LLVMNamedMDNodeRef */ FFIType.ptr],
		returns: /* LLVMNamedMDNodeRef */ FFIType.ptr,
	},
	LLVMGetNamedMetadata: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* NameLen: size_t */ FFIType.u64,
		],
		returns: /* LLVMNamedMDNodeRef */ FFIType.ptr,
	},
	LLVMGetOrInsertNamedMetadata: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* NameLen: size_t */ FFIType.u64,
		],
		returns: /* LLVMNamedMDNodeRef */ FFIType.ptr,
	},
	LLVMGetNamedMetadataName: {
		args: [/* NamedMD: LLVMNamedMDNodeRef */ FFIType.ptr, /* NameLen: size_t * */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMGetNamedMetadataNumOperands: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr, /* Name: const char * */ FFIType.cstring],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetNamedMetadataOperands: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* Dest: LLVMValueRef * */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMAddNamedMetadataOperand: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* Val: LLVMValueRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
} as const satisfies Record<string, FFIFunction>;

export { NamedMDNodeSymbols };
