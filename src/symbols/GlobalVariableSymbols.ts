import { type FFIFunction, FFIType } from "bun:ffi";

const GlobalVariableSymbols: Record<string, FFIFunction> = {
	LLVMAddGlobal: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMAddGlobalInAddressSpace: {
		args: [
			/* M: LLVMModuleRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char * */ FFIType.cstring,
			/* AddressSpace: unsigned */ FFIType.u32,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNamedGlobal: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr, /* Name: const char * */ FFIType.cstring],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetFirstGlobal: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetLastGlobal: {
		args: [/* M: LLVMModuleRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetNextGlobal: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMGetPreviousGlobal: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMDeleteGlobal: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMGetInitializer: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMSetInitializer: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr, /* ConstantVal: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMIsGlobalConstant: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMBool */ FFIType.bool,
	},
	LLVMSetGlobalConstant: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr, /* IsConstant: LLVMBool */ FFIType.bool],
		returns: /* void */ FFIType.void,
	},
	LLVMGetLinkage: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMLinkage */ FFIType.u32,
	},
	LLVMSetLinkage: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr, /* Linkage: LLVMLinkage */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
	LLVMGetVisibility: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMVisibility */ FFIType.u32,
	},
	LLVMSetVisibility: {
		args: [/* GlobalVar: LLVMValueRef */ FFIType.ptr, /* Viz: LLVMVisibility */ FFIType.u32],
		returns: /* void */ FFIType.void,
	},
};

export { GlobalVariableSymbols };
