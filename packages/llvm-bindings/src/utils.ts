import type { Pointer } from "bun:ffi";

// LLVM-specific type aliases - these are all opaque pointers in the C API
// In Bun FFI, pointers are represented as numbers, but we use the Pointer type for clarity
// Many LLVM functions can return null pointers (0), so we make them nullable
// However, some types like LLVMContext and Module are typically non-null once created
export type LLVMContextRef = Pointer | null;
export type LLVMModuleRef = Pointer | null;
export type LLVMTypeRef = Pointer | null;
export type LLVMValueRef = Pointer | null;
export type LLVMBasicBlockRef = Pointer | null;
export type LLVMBuilderRef = Pointer | null;
export type LLVMFunctionRef = Pointer | null;
export type LLVMGlobalVariableRef = Pointer | null;
export type LLVMConstantRef = Pointer | null;
export type LLVMInstructionRef = Pointer | null;
export type LLVMPassBuilderOptionsRef = Pointer | null;
export type LLVMTargetMachineRef = Pointer | null;
export type LLVMErrorRef = Pointer | null;

// Helper function to convert string to C string
export function cstring(str: string): Buffer {
	return Buffer.from(`${str}\0`, "utf8");
}

export function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}
