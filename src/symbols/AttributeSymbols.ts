import { type FFIFunction, FFIType } from "bun:ffi";

const AttributeSymbols = {
	LLVMCreateEnumAttribute: {
		args: [
			/* C: LLVMContextRef */ FFIType.ptr,
			/* KindID: unsigned */ FFIType.u32,
			/* Val: uint64_t */ FFIType.u64,
		],
		returns: /* LLVMAttributeRef */ FFIType.ptr,
	},
	LLVMGetEnumAttributeKind: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetEnumAttributeValue: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr],
		returns: /* uint64_t */ FFIType.u64,
	},
	LLVMCreateTypeAttribute: {
		args: [
			/* C: LLVMContextRef */ FFIType.ptr,
			/* KindID: unsigned */ FFIType.u32,
			/* type_ref: LLVMTypeRef */ FFIType.ptr,
		],
		returns: /* LLVMAttributeRef */ FFIType.ptr,
	},
	LLVMGetTypeAttributeValue: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMCreateStringAttribute: {
		args: [
			/* C: LLVMContextRef */ FFIType.ptr,
			/* K: const char * */ FFIType.cstring,
			/* KLength: unsigned */ FFIType.u32,
			/* V: const char * */ FFIType.cstring,
			/* VLength: unsigned */ FFIType.u32,
		],
		returns: /* LLVMAttributeRef */ FFIType.ptr,
	},
	LLVMGetStringAttributeKind: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr, /* Length: unsigned * */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMGetStringAttributeValue: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr, /* Length: unsigned * */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMIsEnumAttribute: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMIsStringAttribute: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMIsTypeAttribute: {
		args: [/* A: LLVMAttributeRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetEnumAttributeKindForName: {
		args: [/* Name: const char * */ FFIType.cstring, /* SLen: size_t */ FFIType.u64],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetLastEnumAttributeKind: {
		args: [],
		returns: /* unsigned */ FFIType.u32,
	},
} as const satisfies Record<string, FFIFunction>;

export { AttributeSymbols };
