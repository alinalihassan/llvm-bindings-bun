import { type FFIFunction, FFIType } from "bun:ffi";

const FunctionSymbols = {
	LLVMAddFunction: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* FunctionTy: LLVMTypeRef */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNamedFunction: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr, /* Name: const char * */ FFIType.cstring],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetFirstFunction: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetLastFunction: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNextFunction: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetPreviousFunction: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMDeleteFunction: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMGetIntrinsicID: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetFunctionCallConv: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMSetFunctionCallConv: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr, /* CC: unsigned */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	LLVMGetGC: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* const char * */ FFIType.cstring,
	},
	LLVMSetGC: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr, /* Name: const char * */ FFIType.cstring],
		returns: /* void */ FFIType.void,
	},
	LLVMGetReturnType: {
		args: [/* FunctionTy: LLVMTypeRef */ FFIType.ptr],
		returns: /* LLVMTypeRef */ FFIType.ptr,
	},
	LLVMHasPersonalityFn: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMGetPersonalityFn: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMSetPersonalityFn: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr, /* PersonalityFn: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMCountParams: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetParam: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr, /* Index: unsigned */ FFIType.u32],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetParams: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr, /* Params: LLVMValueRef * */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMGetParamParent: {
		args: [/* Arg: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetFirstParam: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetLastParam: {
		args: [/* Fn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNextParam: {
		args: [/* Arg: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetPreviousParam: {
		args: [/* Arg: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMAddAttributeAtIndex: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Idx: LLVMAttributeIndex */ FFIType.u32,
			/* A: LLVMAttributeRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetAttributeCountAtIndex: {
		args: [/* F: LLVMValueRef */ FFIType.ptr, /* Idx: LLVMAttributeIndex */ FFIType.u32],
		returns: /* unsigned */ FFIType.u32,
	},
	LLVMGetAttributesAtIndex: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Idx: LLVMAttributeIndex */ FFIType.u32,
			/* Attrs: LLVMAttributeRef * */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMGetEnumAttributeAtIndex: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Idx: LLVMAttributeIndex */ FFIType.u32,
			/* KindID: LLVMAttributeKind */ FFIType.u32,
		],
		returns: /* LLVMAttributeRef */ FFIType.ptr,
	},
	LLVMGetStringAttributeAtIndex: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Idx: LLVMAttributeIndex */ FFIType.u32,
			/* K: const char * */ FFIType.cstring,
			/* KLen: unsigned */ FFIType.u32,
		],
		returns: /* LLVMAttributeRef */ FFIType.ptr,
	},
	LLVMRemoveEnumAttributeAtIndex: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Idx: LLVMAttributeIndex */ FFIType.u32,
			/* KindID: LLVMAttributeKind */ FFIType.u32,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMRemoveStringAttributeAtIndex: {
		args: [
			/* F: LLVMValueRef */ FFIType.ptr,
			/* Idx: LLVMAttributeIndex */ FFIType.u32,
			/* K: const char * */ FFIType.cstring,
			/* KLen: unsigned */ FFIType.u32,
		],
		returns: /* void */ FFIType.void,
	},
} as const satisfies Record<string, FFIFunction>;

export { FunctionSymbols };
