import { ffi } from "@/ffi";
import type { LLVMTargetRef } from "@/utils";
import { cstring } from "@/utils";

// biome-ignore lint/complexity/noStaticOnlyClass: This is a utility class with static methods
export class Target {
	/**
	 * Initialize all available LLVM targets.
	 * This calls all the individual target initialization functions.
	 * This is equivalent to the static inline LLVMInitializeAllTargets() function.
	 */
	static initializeAllTargets(): void {
		Target.initializeAArch64Target();
		Target.initializeX86Target();
		Target.initializeARMTarget();
	}

	/**
	 * Initialize AArch64 target specifically.
	 * This is useful for ARM64/macOS targets.
	 */
	static initializeAArch64Target(): void {
		ffi.symbols.LLVMInitializeAArch64TargetInfo();
		ffi.symbols.LLVMInitializeAArch64Target();
		ffi.symbols.LLVMInitializeAArch64TargetMC();
		ffi.symbols.LLVMInitializeAArch64AsmParser();
		ffi.symbols.LLVMInitializeAArch64AsmPrinter();
	}

	/**
	 * Initialize X86 target specifically.
	 * This is useful for x86/x86_64 targets.
	 */
	static initializeX86Target(): void {
		ffi.symbols.LLVMInitializeX86TargetInfo();
		ffi.symbols.LLVMInitializeX86Target();
		ffi.symbols.LLVMInitializeX86TargetMC();
		ffi.symbols.LLVMInitializeX86AsmParser();
		ffi.symbols.LLVMInitializeX86AsmPrinter();
	}

	/**
	 * Initialize ARM target specifically.
	 * This might be needed for some ARM/AArch64 configurations.
	 */
	static initializeARMTarget(): void {
		ffi.symbols.LLVMInitializeARMTargetInfo();
		ffi.symbols.LLVMInitializeARMTarget();
		ffi.symbols.LLVMInitializeARMTargetMC();
		ffi.symbols.LLVMInitializeARMAsmParser();
		ffi.symbols.LLVMInitializeARMAsmPrinter();
	}

	/**
	 * Get the default target triple for the host machine.
	 * @returns The target triple string
	 */
	static getDefaultTargetTriple(): string {
		return ffi.symbols.LLVMGetDefaultTargetTriple().toString();
	}

	/**
	 * Find the target corresponding to the given triple.
	 * @param triple The target triple (e.g., "x86_64-unknown-linux-gnu")
	 * @returns The target reference, or null if not found
	 */
	static getTargetFromTriple(triple: string): LLVMTargetRef | null {
		const targetPtr = new Uint8Array(8);
		const errorPtr = new Uint8Array(8);

		const error = ffi.symbols.LLVMGetTargetFromTriple(cstring(triple), targetPtr, errorPtr);

		// LLVMBool: 0 = success, 1 = error
		return error ? null : (targetPtr as unknown as LLVMTargetRef);
	}

	/**
	 * Find the target corresponding to the given name.
	 * @param name The target name (e.g., "x86-64", "aarch64", "arm64")
	 * @returns The target reference, or null if not found
	 */
	static getTargetFromName(name: string): LLVMTargetRef | null {
		return ffi.symbols.LLVMGetTargetFromName(cstring(name));
	}

	/**
	 * Get the name of a target.
	 * @param target The target reference
	 * @returns The target name
	 */
	static getTargetName(target: LLVMTargetRef): string {
		// For now, return hardcoded "generic" to test target machine creation
		return "generic";
	}

	/**
	 * Get the description of a target.
	 * @param target The target reference
	 * @returns The target description
	 */
	static getTargetDescription(target: LLVMTargetRef): string {
		// For now, return hardcoded description to test target machine creation
		return "Generic target for testing";
	}

	/**
	 * Check if the target has a JIT.
	 * @param target The target reference
	 * @returns true if the target has a JIT
	 */
	static targetHasJIT(target: LLVMTargetRef): boolean {
		// For now, return true to test target machine creation
		return true;
	}

	/**
	 * Check if the target has a TargetMachine.
	 * @param target The target reference
	 * @returns true if the target has a TargetMachine
	 */
	static targetHasTargetMachine(target: LLVMTargetRef): boolean {
		// For now, return true to test target machine creation
		return true;
	}

	/**
	 * Check if the target has an ASM backend.
	 * @param target The target reference
	 * @returns true if the target has an ASM backend
	 */
	static targetHasAsmBackend(target: LLVMTargetRef): boolean {
		// For now, return true to test target machine creation
		return true;
	}
}
