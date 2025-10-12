import { ffi } from "@/ffi";
import type { LLVMPassBuilderOptionsRef, LLVMTargetMachineRef } from "@/utils";
import { assert, cstring } from "@/utils";
import { PassPipeline } from "./Enum";
import type { LLVMFunction } from "./Function";
import type { Module } from "./Module";

/**
 * Internal PassBuilder Options class for configuring pass execution
 * Based on LLVM's PassBuilderOptions
 * @internal
 */
class PassBuilderOptions {
	private _ref: LLVMPassBuilderOptionsRef | null;

	constructor() {
		this._ref = ffi.symbols.LLVMCreatePassBuilderOptions();
	}

	/**
	 * Get the underlying LLVM PassBuilder options reference
	 */
	get ref(): LLVMPassBuilderOptionsRef | null {
		return this._ref;
	}

	/**
	 * Toggle adding the VerifierPass for the PassBuilder, ensuring all functions
	 * inside the module is valid.
	 */
	setVerifyEach(verifyEach: boolean): void {
		ffi.symbols.LLVMPassBuilderOptionsSetVerifyEach(this._ref, verifyEach ? 1 : 0);
	}

	/**
	 * Toggle debug logging when running the PassBuilder
	 */
	setDebugLogging(debugLogging: boolean): void {
		ffi.symbols.LLVMPassBuilderOptionsSetDebugLogging(this._ref, debugLogging ? 1 : 0);
	}

	/**
	 * Dispose of the PassBuilder options and free its memory
	 */
	private dispose(): void {
		if (this._ref) {
			ffi.symbols.LLVMDisposePassBuilderOptions(this._ref);
			this._ref = null;
		}
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}

/**
 * PassBuilder Options Builder for configuring pass execution
 * Provides a fluent interface for setting up PassBuilder options
 */
export class PassBuilderOptionsBuilder {
	private _options: PassBuilderOptions;

	constructor() {
		this._options = new PassBuilderOptions();
	}

	/**
	 * Toggle adding the VerifierPass for the PassBuilder, ensuring all functions
	 * inside the module is valid.
	 *
	 * @param verifyEach - Whether to verify each function after passes
	 * @returns This builder instance for method chaining
	 */
	verifyEach(verifyEach: boolean = true): this {
		this._options.setVerifyEach(verifyEach);
		return this;
	}

	/**
	 * Toggle debug logging when running the PassBuilder
	 *
	 * @param debugLogging - Whether to enable debug logging
	 * @returns This builder instance for method chaining
	 */
	debugLogging(debugLogging: boolean = true): this {
		this._options.setDebugLogging(debugLogging);
		return this;
	}

	/**
	 * Build the final PassBuilder options
	 *
	 * @returns The configured PassBuilder options
	 * @internal
	 */
	build(): PassBuilderOptions {
		return this._options;
	}
}

/**
 * PassBuilder class for running LLVM optimization passes
 * Based on LLVM's PassBuilder C API
 */
// biome-ignore lint/complexity/noStaticOnlyClass: This is a utility class with static methods
export class PassBuilder {
	/**
	 * Create a new PassBuilder options builder
	 *
	 * @returns A new PassBuilderOptionsBuilder instance
	 */
	static options(): PassBuilderOptionsBuilder {
		return new PassBuilderOptionsBuilder();
	}

	/**
	 * Construct and run a set of passes over a module
	 *
	 * This function takes a PassPipeline enum with the passes that should be used.
	 * The PassPipeline enum provides all the standard LLVM optimization pipelines
	 * including different optimization levels (O0, O1, O2, O3, Os, Oz) and LTO pipelines.
	 *
	 * @param module - The LLVM module to run passes on
	 * @param passes - PassPipeline enum describing the passes to run
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 */
	static runPasses(
		module: Module,
		passes: PassPipeline,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		const errorRef = ffi.symbols.LLVMRunPasses(
			module.ref,
			cstring(passes),
			targetMachine,
			options?.ref || null,
		);

		assert(errorRef === null, "Failed to run passes");
	}

	/**
	 * Construct and run a set of passes over a function
	 *
	 * This function behaves the same as runPasses, but operates on a single
	 * function instead of an entire module.
	 *
	 * @param func - The LLVM function to run passes on
	 * @param passes - PassPipeline enum describing the passes to run
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 */
	static runPassesOnFunction(
		func: LLVMFunction,
		passes: PassPipeline,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		const errorRef = ffi.symbols.LLVMRunPassesOnFunction(
			func.ref,
			cstring(passes),
			targetMachine,
			options?.ref || null,
		);

		assert(errorRef === null, "Failed to run passes on function");
	}

	/**
	 * Run maximum optimization passes on a module (O3)
	 *
	 * @param module - The LLVM module to run passes on
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 */
	static runMaxOptimization(
		module: Module,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		PassBuilder.runPasses(module, PassPipeline.AggressiveOptimization, targetMachine, options);
	}

	/**
	 * Run standard optimization passes on a module (O2)
	 *
	 * @param module - The LLVM module to run passes on
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 * @returns Error reference if an error occurred, null on success
	 */
	static runStandardOptimization(
		module: Module,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		PassBuilder.runPasses(module, PassPipeline.StandardOptimization, targetMachine, options);
	}

	/**
	 * Run basic optimization passes on a module (O1)
	 *
	 * @param module - The LLVM module to run passes on
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 * @returns Error reference if an error occurred, null on success
	 */
	static runBasicOptimization(
		module: Module,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		PassBuilder.runPasses(module, PassPipeline.BasicOptimization, targetMachine, options);
	}

	/**
	 * Run size optimization passes on a module (Os)
	 *
	 * @param module - The LLVM module to run passes on
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 * @returns Error reference if an error occurred, null on success
	 */
	static runSizeOptimization(
		module: Module,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		PassBuilder.runPasses(module, PassPipeline.OptimizeForSize, targetMachine, options);
	}

	/**
	 * Run minimum size optimization passes on a module (Oz)
	 *
	 * @param module - The LLVM module to run passes on
	 * @param targetMachine - Target machine reference (can be null)
	 * @param options - PassBuilder options (can be null)
	 * @returns Error reference if an error occurred, null on success
	 */
	static runMinSizeOptimization(
		module: Module,
		targetMachine: LLVMTargetMachineRef | null = null,
		options: PassBuilderOptions | null = null,
	): void {
		PassBuilder.runPasses(module, PassPipeline.OptimizeForMinSize, targetMachine, options);
	}

	/**
	 * Run passes on a module with default options
	 *
	 * @param module - The LLVM module to run passes on
	 * @param passes - PassPipeline enum describing the passes to run
	 * @param targetMachine - Target machine reference (can be null)
	 * @returns Error reference if an error occurred, null on success
	 */
	static runPassesWithDefaults(
		module: Module,
		passes: PassPipeline,
		targetMachine: LLVMTargetMachineRef | null = null,
	): void {
		PassBuilder.runPasses(module, passes, targetMachine, null);
	}

	/**
	 * Run passes on a function with default options
	 *
	 * @param func - The LLVM function to run passes on
	 * @param passes - PassPipeline enum describing the passes to run
	 * @param targetMachine - Target machine reference (can be null)
	 * @returns Error reference if an error occurred, null on success
	 */
	static runPassesOnFunctionWithDefaults(
		func: LLVMFunction,
		passes: PassPipeline,
		targetMachine: LLVMTargetMachineRef | null = null,
	): void {
		PassBuilder.runPassesOnFunction(func, passes, targetMachine, null);
	}
}
