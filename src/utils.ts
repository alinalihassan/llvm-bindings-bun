import type { Pointer } from "bun:ffi";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

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
export type LLVMMemoryBufferRef = Pointer | null;
export type LLVMTargetRef = Pointer | null;
export type LLVMTargetDataRef = Pointer | null;

// Helper function to convert string to C string
export function cstring(str: string): Buffer {
	return Buffer.from(`${str}\0`, "utf8");
}

export function assert(condition: boolean, message: string): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

/**
 * Dynamically finds the correct library name by scanning the library directory.
 * This handles different naming conventions across platforms and package managers:
 * - Ubuntu with wget: libclang-21.so.1, libLLVM-21.so.1
 * - Ubuntu with apt: libclang-21.so.1 or libclang.so.1
 * - macOS with brew: libclang.dylib, libLLVM.dylib
 * - Other variations with version numbers
 */
export const findLibraryName = (libDir: string, baseName: string): string => {
	const extension = process.platform === "darwin" ? "dylib" : "so";

	try {
		const files = readdirSync(libDir);

		// Create patterns for the specific library
		const patterns = [
			new RegExp(`^${baseName}\\.so\\.\\d+$`), // libclang.so.1, libLLVM.so.1, etc.
			new RegExp(`^${baseName}-\\d+\\.so\\.\\d+$`), // libclang-21.so.1, libLLVM-21.so.1, etc.
			new RegExp(`^${baseName}\\.dylib$`), // macOS: libclang.dylib, libLLVM.dylib
			new RegExp(`^${baseName}-\\d+\\.dylib$`), // macOS: libclang-21.dylib, libLLVM-21.dylib
		];

		for (const pattern of patterns) {
			const match = files.find((file) => pattern.test(file));
			if (match) {
				return match.replace(/\.(so|dylib).*$/, ""); // Remove extension and version suffix
			}
		}

		// Fallback: try the simple name
		const simpleName = `${baseName}.${extension}`;
		if (files.includes(simpleName)) {
			return baseName;
		}

		throw new Error(
			`No ${baseName} library found in ${libDir}. Available files: ${files.join(", ")}`,
		);
	} catch (err) {
		throw new Error(`Could not scan library directory ${libDir}: ${err}`);
	}
};

export const getLibPath = (libName: string): string => {
	const extension = process.platform === "darwin" ? "dylib" : "so";
	let libDir: string;

	if (process.env.LLVM_LIB_DIR) {
		libDir = process.env.LLVM_LIB_DIR;
		const actualLibName = findLibraryName(libDir, libName);
		return join(libDir, `${actualLibName}.${extension}`);
	} else {
		// Fallback: use llvm-config to determine the library path
		try {
			const result = Bun.spawnSync(["llvm-config", "--libdir"]);
			if (result.exitCode !== 0) throw new Error("llvm-config failed");

			libDir = result.stdout.toString().trim();
		} catch (err) {
			throw new Error(`Could not determine LLVM library path: ${err}`);
		}
	}

	const actualLibName = findLibraryName(libDir, libName);
	const filePath = join(libDir, `${actualLibName}.${extension}`);
	assert(existsSync(filePath), `Library ${actualLibName} not found at ${filePath}`);
	console.log(`Using library ${actualLibName} from ${filePath}`);
	return filePath;
};
