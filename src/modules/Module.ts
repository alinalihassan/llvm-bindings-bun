import { unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ffi } from "@/ffi";
import type { LLVMMemoryBufferRef, LLVMModuleRef, LLVMValueRef } from "@/utils";
import { cstring } from "@/utils";
import { CodeGenFileType, GlobalValueLinkageTypes } from "./Enum";
import { LLVMFunction } from "./Function";
import { FunctionCallee } from "./FunctionCallee";
import type { FunctionType } from "./FunctionType";
import { GlobalVariable } from "./GlobalVariable";
import type { LLVMContext } from "./LLVMContext";
import { Target } from "./Target";
import { TargetMachine } from "./TargetMachine";
import type { Value } from "./Value";

export class Module {
	private _ref: LLVMModuleRef;

	constructor(moduleID: string, context?: LLVMContext) {
		if (context) {
			this._ref = ffi.LLVMModuleCreateWithNameInContext(cstring(moduleID), context.ref);
		} else {
			this._ref = ffi.LLVMModuleCreateWithName(cstring(moduleID));
		}
	}

	/**
	 * Get the underlying LLVM module reference
	 */
	get ref(): LLVMModuleRef {
		return this._ref;
	}

	/**
	 * Get the module identifier which is, essentially, the name of the module.
	 */
	getModuleIdentifier(): string {
		return ffi.LLVMGetModuleIdentifier(this._ref, new Uint8Array(0)).toString();
	}

	/**
	 * Set the module identifier.
	 */
	setModuleIdentifier(moduleID: string): void {
		ffi.LLVMSetModuleIdentifier(this._ref, cstring(moduleID), moduleID.length);
	}

	/**
	 * Get the module's original source file name.
	 *
	 * When compiling from bitcode, this is taken from a bitcode record where it was recorded.
	 * For other compiles it is the same as the ModuleID, which would contain the source file name.
	 */
	getSourceFileName(): string {
		return ffi.LLVMGetSourceFileName(this._ref, new Uint8Array(0)).toString();
	}

	/**
	 * Set the module's original source file name.
	 */
	setSourceFileName(sourceFileName: string): void {
		ffi.LLVMSetSourceFileName(this._ref, cstring(sourceFileName), sourceFileName.length);
	}

	/**
	 * Get a short "name" for the module.
	 *
	 * This is useful for debugging or logging.
	 * It is essentially a convenience wrapper around {@link getModuleIdentifier}.
	 */
	getName(): string {
		return this.getModuleIdentifier();
	}

	/**
	 * Get the data layout string for the module's target platform.
	 *
	 * This is equivalent to {@link getDataLayout}.getStringRepresentation().
	 * {@link getDataLayout} is deprecated, use {@link getDataLayoutStr} instead.
	 */
	getDataLayoutStr(): string {
		return ffi.LLVMGetDataLayoutStr(this._ref).toString();
	}

	/**
	 * Set the data layout.
	 */
	setDataLayout(desc: string): void {
		ffi.LLVMSetDataLayout(this._ref, cstring(desc));
	}

	/**
	 * Get the target triple
	 */
	getTargetTriple(): string {
		return ffi.LLVMGetTarget(this._ref).toString();
	}

	/**
	 * Set the target triple
	 */
	setTargetTriple(triple: string): void {
		ffi.LLVMSetTarget(this._ref, cstring(triple));
	}

	/**
	 * Get a function by name
	 */
	getFunction(name: string): LLVMFunction | null {
		const funcRef = ffi.LLVMGetNamedFunction(this._ref, cstring(name));
		return funcRef ? new LLVMFunction(funcRef) : null;
	}

	/**
	 * Get or insert a function by name
	 */
	getOrInsertFunction(name: string, funcType: FunctionType, args: Value[] = []): FunctionCallee {
		let func = this.getFunction(name);

		if (func !== null) {
			return new FunctionCallee(funcType, func);
		}

		func = LLVMFunction.Create(funcType, GlobalValueLinkageTypes.ExternalLinkage, name, this);

		// Set argument names if provided
		if (args.length > 0) {
			const numArgs = func.getNumArgs();
			const numNamesToSet = Math.min(args.length, numArgs);

			for (let i = 0; i < numNamesToSet; i++) {
				const arg = func.getArg(i);
				const argName = arg.getName();
				if (argName) {
					arg.setName(argName);
				}
			}
		}

		return new FunctionCallee(funcType, func);
	}

	/**
	 * Look up the specified global variable in the module symbol table.
	 *
	 * If it does not exist, return null. If AllowInternal is set to true, this function will return types that have InternalLinkage. By default, these types are not returned.
	 */
	getGlobalVariable(name: string): GlobalVariable | null {
		const globalVarRef = ffi.LLVMGetNamedGlobal(this._ref, cstring(name));
		return globalVarRef ? new GlobalVariable(globalVarRef) : null;
	}

	/**
	 * Links the source module into this module. The source module is destroyed.
	 *
	 * @param sourceModule The module to link into this module
	 * @returns true if an error occurred, false otherwise
	 */
	linkModule(sourceModule: Module): boolean {
		const error = ffi.LLVMLinkModules2(this._ref, sourceModule._ref);
		// The source module is destroyed by LLVMLinkModules2, so we should mark it as disposed
		// to prevent double disposal
		sourceModule._ref = null;
		return error;
	}

	/**
	 * Add a module flag
	 */
	addModuleFlag(behavior: number, key: string, value: LLVMValueRef): void {
		ffi.LLVMAddModuleFlag(this._ref, behavior, cstring(key), key.length, value);
	}

	/**
	 * Check if the module is empty
	 */
	empty(): boolean {
		const firstFunc = ffi.LLVMGetFirstFunction(this._ref);
		const firstGlobal = ffi.LLVMGetFirstGlobal(this._ref);
		return !firstFunc && !firstGlobal;
	}

	/**
	 * Print the module to a string
	 */
	print(): string {
		return ffi.LLVMPrintModuleToString(this._ref).toString();
	}

	/**
	 * Writes the module to the specified file path as bitcode.
	 * @param path The file path to write to
	 * @returns 0 on success, non-zero on error
	 */
	writeToFile(path: string): number {
		return ffi.LLVMWriteBitcodeToFile(this._ref, cstring(path));
	}

	/**
	 * Writes the module to a memory buffer as bitcode.
	 * This method is for internal use only.
	 * @returns A memory buffer containing the bitcode, or null on error
	 */

	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: Might be useful in the future
	private writeToMemoryBuffer(): LLVMMemoryBufferRef {
		return ffi.LLVMWriteBitcodeToMemoryBuffer(this._ref);
	}

	/**
	 * Get the default target triple for the host machine.
	 * @returns The target triple string
	 */
	static getDefaultTargetTriple(): string {
		return Target.getDefaultTargetTriple();
	}

	/**
	 * Compile the module to an object file.
	 * @param outputPath The path where the object file should be written
	 * @param targetTriple Optional target triple (defaults to host triple)
	 * @param cpu Optional CPU target (defaults to "generic")
	 * @param features Optional CPU features (defaults to "")
	 * @returns true on success, false on error
	 */
	compileToObjectFile(
		outputPath: string,
		targetTriple?: string,
		cpu: string = "generic",
		features: string = "",
	): boolean {
		try {
			Target.initializeAllTargets();

			// Use provided triple or default
			const triple = targetTriple || Target.getDefaultTargetTriple();

			// Get target from triple
			const target = Target.getTargetFromTriple(triple);
			if (!target) {
				return true; // Error
			}

			// Create target machine
			const targetMachine = new TargetMachine(target, triple, cpu, features);

			// Emit object file
			return targetMachine.emitToFile(this._ref, outputPath, CodeGenFileType.ObjectFile);
		} catch {
			return true; // Error
		}
	}

	/**
	 * Compile the module to assembly code.
	 * @param outputPath The path where the assembly file should be written
	 * @param targetTriple Optional target triple (defaults to host triple)
	 * @param cpu Optional CPU target (defaults to "generic")
	 * @param features Optional CPU features (defaults to "")
	 * @returns false on success (no error), true on error
	 */
	compileToAssembly(
		outputPath: string,
		targetTriple?: string,
		cpu: string = "generic",
		features: string = "",
	): boolean {
		try {
			Target.initializeAllTargets();

			// Use provided triple or default
			const triple = targetTriple || Target.getDefaultTargetTriple();

			// Get target from triple
			const target = Target.getTargetFromTriple(triple);
			if (!target) {
				return true; // Error
			}

			// Create target machine
			const targetMachine = new TargetMachine(target, triple, cpu, features);

			// Emit assembly file
			return targetMachine.emitToFile(this._ref, outputPath, CodeGenFileType.AssemblyFile);
		} catch {
			return true; // Error
		}
	}

	/**
	 * Compile the module to a memory buffer containing object code.
	 * @param targetTriple Optional target triple (defaults to host triple)
	 * @param cpu Optional CPU target (defaults to "generic")
	 * @param features Optional CPU features (defaults to "")
	 * @returns Memory buffer containing object code, or null on error
	 */
	compileToMemoryBuffer(
		targetTriple?: string,
		cpu: string = "generic",
		features: string = "",
	): LLVMMemoryBufferRef | null {
		try {
			Target.initializeAllTargets();

			// Use provided triple or default
			const triple = targetTriple || Target.getDefaultTargetTriple();

			// Get target from triple
			const target = Target.getTargetFromTriple(triple);
			if (!target) {
				return null;
			}

			// Create target machine
			const targetMachine = new TargetMachine(target, triple, cpu, features);

			// Emit to memory buffer
			return targetMachine.emitToMemoryBuffer(this._ref, CodeGenFileType.ObjectFile);
		} catch {
			return null;
		}
	}

	/**
	 * Compile the module to an executable file.
	 * This method first compiles the module to an object file, then uses clang to link it into an executable.
	 * @param outputPath The path where the executable should be written
	 * @param targetTriple Optional target triple (defaults to host triple)
	 * @param cpu Optional CPU target (defaults to "generic")
	 * @param features Optional CPU features (defaults to "")
	 * @param clangArgs Optional additional arguments to pass to clang during linking
	 * @returns Promise<boolean> - true on success, false on error
	 */
	async compileToExecutable(
		outputPath: string,
		targetTriple?: string,
		cpu: string = "generic",
		features: string = "",
		clangArgs: string[] = [],
	): Promise<boolean> {
		try {
			Target.initializeAllTargets();

			// Generate a temporary object file path
			const objectPath = `${outputPath.replace(/\.[^/.]+$/, "")}.o`;

			// Compile to object file
			const objectCompileError = this.compileToObjectFile(objectPath, targetTriple, cpu, features);
			if (objectCompileError) {
				return false; // objectCompileError is true when there's an error
			}

			// Use clang to link the object file into an executable (force overwrite)
			const linkCommand = ["clang", objectPath, "-o", outputPath, ...clangArgs];

			// Add platform-specific linking flags
			if (process.platform === "darwin") {
				linkCommand.push("-L", "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib");
				linkCommand.push("-lSystem");
			} else if (process.platform === "win32") {
				// Windows-specific linking flags
				linkCommand.push("-lkernel32", "-luser32", "-lmsvcrt");
			}

			const proc = Bun.spawnSync(linkCommand, {
				stdout: "pipe",
				stderr: "pipe",
			});

			// Clean up the temporary object file
			try {
				unlinkSync(objectPath);
			} catch {
				// Ignore cleanup errors
			}

			return proc.success;
		} catch {
			return false;
		}
	}

	/**
	 * Run the module - the most barebones way to execute any app.
	 * Compiles to a temporary executable and runs it, returning the result.
	 * @param functionName The name of the function to execute (defaults to "main")
	 * @returns Promise<number | null> - The result of the function, or null if execution failed
	 */
	async run(_: string = "main"): Promise<number | null> {
		// TODO: Run an actual JIT here instead of compiling to an executable
		try {
			// Create a temporary executable with cross-platform temp directory
			const tempExecutable = join(
				tmpdir(),
				`llvm_run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${process.platform === "win32" ? ".exe" : ""}`,
			);

			// Compile the module to an executable
			const success = await this.compileToExecutable(tempExecutable);
			if (!success) {
				return null;
			}

			// Run the executable and get the result
			const proc = Bun.spawnSync([tempExecutable], {
				stdout: "pipe",
				stderr: "pipe",
			});

			// Clean up the temporary executable
			try {
				unlinkSync(tempExecutable);
			} catch {
				// Ignore cleanup errors
			}

			// The result is the exit code
			return proc.exitCode;
		} catch {
			return null;
		}
	}

	/**
	 * Dispose of the module and free its memory
	 */
	private dispose(): void {
		ffi.LLVMDisposeModule(this._ref);
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}
