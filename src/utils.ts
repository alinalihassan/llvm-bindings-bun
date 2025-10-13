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
 * Dynamically finds the correct library filename by scanning the library directory.
 * This handles different naming conventions across platforms and package managers:
 * - Ubuntu with wget: libclang-21.so.1, libLLVM-21.so.1
 * - Ubuntu with apt: libclang-21.so.1 or libclang.so.1
 * - macOS with brew: libclang.dylib, libLLVM.dylib
 * - Windows: LLVM-C.dll, libclang.dll
 * - Other variations with version numbers
 */
export const findLibraryName = (libDir: string, baseName: string): string => {
	let extension: string;
	let patterns: RegExp[];

	if (process.platform === "win32") {
		extension = "dll";
		// Windows patterns - DLL files are typically in bin directory, not lib
		patterns = [
			new RegExp(`^${baseName}\\.dll$`), // LLVM-C.dll, libclang.dll
			new RegExp(`^${baseName}-\\d+\\.dll$`), // LLVM-C-21.dll, libclang-21.dll
		];
	} else if (process.platform === "darwin") {
		extension = "dylib";
		patterns = [
			new RegExp(`^${baseName}\\.dylib$`), // libclang.dylib, libLLVM.dylib
			new RegExp(`^${baseName}-\\d+\\.dylib$`), // libclang-21.dylib, libLLVM-21.dylib
		];
	} else {
		extension = "so";
		patterns = [
			new RegExp(`^${baseName}\\.so\\.\\d+$`), // libclang.so.1, libLLVM.so.1, etc.
			new RegExp(`^${baseName}-\\d+\\.so\\.\\d+$`), // libclang-21.so.1, libLLVM-21.so.1, etc.
		];
	}

	try {
		const files = readdirSync(libDir);

		for (const pattern of patterns) {
			const match = files.find((file) => pattern.test(file));
			if (match) {
				return match; // Return the actual filename that exists
			}
		}

		// Fallback: try the simple name
		const simpleName = `${baseName}.${extension}`;
		if (files.includes(simpleName)) {
			return simpleName;
		}

		throw new Error(
			`No ${baseName} library found in ${libDir}. Available files: ${files.join(", ")}`,
		);
	} catch (err) {
		throw new Error(`Could not scan library directory ${libDir}: ${err}`);
	}
};

export const getLibPath = (libName: string): string => {
	let libDir: string | undefined;

	if (process.env.LLVM_LIB_DIR) {
		libDir = process.env.LLVM_LIB_DIR;
	} else if (process.platform === "win32") {
		// Windows: DLL files are typically in the bin directory
		const possiblePaths = [
			"C:\\Program Files\\LLVM\\bin",
			"C:\\Program Files (x86)\\LLVM\\bin",
			process.env.LLVM_PATH ? join(process.env.LLVM_PATH, "bin") : null,
		].filter(Boolean) as string[];

		for (const path of possiblePaths) {
			if (existsSync(path)) {
				libDir = path;
				break;
			}
		}

		if (!libDir) {
			throw new Error(
				`Could not find LLVM bin directory. Tried: ${possiblePaths.join(", ")}. ` +
					`Please set LLVM_LIB_DIR environment variable to the directory containing ${libName}.dll`,
			);
		}
	} else {
		// Unix-like systems: use llvm-config to determine the library path
		try {
			const result = Bun.spawnSync(["llvm-config", "--libdir"]);
			if (result.exitCode !== 0) throw new Error("llvm-config failed");

			libDir = result.stdout.toString().trim();
		} catch (err) {
			throw new Error(`Could not determine LLVM library path: ${err}`);
		}
	}

	assert(!!libDir, "Library directory not determined");

	const actualLibName = findLibraryName(libDir, libName);
	const filePath = join(libDir, actualLibName);

	assert(existsSync(filePath), `Library ${actualLibName} not found at ${filePath}`);

	return filePath;
};
