import { type FFIFunction, FFIType } from "bun:ffi";

const DbgRecordSymbols = {
	LLVMGetFirstDbgRecord: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMDbgRecordRef */ FFIType.ptr,
	},
	LLVMGetLastDbgRecord: {
		args: [/* Inst: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMDbgRecordRef */ FFIType.ptr,
	},
	LLVMPrintDbgRecordToString: {
		args: [/* Record: LLVMDbgRecordRef */ FFIType.ptr],
		returns: /* char * */ FFIType.cstring,
	},
} as const satisfies Record<string, FFIFunction>;

export { DbgRecordSymbols };
