import { ffi } from "@/ffi";
import type { LLVMContextRef, LLVMModuleRef, LLVMValueRef } from "@/utils";
import { cstring } from "@/utils";
import { GlobalValueLinkageTypes } from "./Enum";
import { LLVMFunction } from "./Function";
import { FunctionCallee } from "./FunctionCallee";
import type { FunctionType } from "./FunctionType";
import { GlobalVariable } from "./GlobalVariable";
import type { Value } from "./Value";

export class Module {
	private _ref: LLVMModuleRef;

	constructor(moduleID: string, context?: LLVMContextRef) {
		if (context) {
			this._ref = ffi.symbols.LLVMModuleCreateWithNameInContext(cstring(moduleID), context);
		} else {
			this._ref = ffi.symbols.LLVMModuleCreateWithName(cstring(moduleID));
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
		return ffi.symbols.LLVMGetModuleIdentifier(this._ref, new Uint8Array(0)).toString();
	}

	/**
	 * Set the module identifier.
	 */
	setModuleIdentifier(moduleID: string): void {
		ffi.symbols.LLVMSetModuleIdentifier(this._ref, cstring(moduleID), moduleID.length);
	}

	/**
	 * Get the module's original source file name.
	 *
	 * When compiling from bitcode, this is taken from a bitcode record where it was recorded.
	 * For other compiles it is the same as the ModuleID, which would contain the source file name.
	 */
	getSourceFileName(): string {
		return ffi.symbols.LLVMGetSourceFileName(this._ref, new Uint8Array(0)).toString();
	}

	/**
	 * Set the module's original source file name.
	 */
	setSourceFileName(sourceFileName: string): void {
		ffi.symbols.LLVMSetSourceFileName(this._ref, cstring(sourceFileName), sourceFileName.length);
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
		return ffi.symbols.LLVMGetDataLayoutStr(this._ref).toString();
	}

	/**
	 * Set the data layout.
	 */
	setDataLayout(desc: string): void {
		ffi.symbols.LLVMSetDataLayout(this._ref, cstring(desc));
	}

	/**
	 * Get the target triple
	 */
	getTargetTriple(): string {
		return ffi.symbols.LLVMGetTarget(this._ref).toString();
	}

	/**
	 * Set the target triple
	 */
	setTargetTriple(triple: string): void {
		ffi.symbols.LLVMSetTarget(this._ref, cstring(triple));
	}

	/**
	 * Get a function by name
	 */
	getFunction(name: string): LLVMFunction | null {
		const funcRef = ffi.symbols.LLVMGetNamedFunction(this._ref, cstring(name));
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
		const globalVarRef = ffi.symbols.LLVMGetNamedGlobal(this._ref, cstring(name));
		return globalVarRef ? new GlobalVariable(globalVarRef) : null;
	}

	/**
	 * Add a module flag
	 */
	addModuleFlag(behavior: number, key: string, value: LLVMValueRef): void {
		ffi.symbols.LLVMAddModuleFlag(this._ref, behavior, cstring(key), key.length, value);
	}

	/**
	 * Check if the module is empty
	 */
	empty(): boolean {
		const firstFunc = ffi.symbols.LLVMGetFirstFunction(this._ref);
		const firstGlobal = ffi.symbols.LLVMGetFirstGlobal(this._ref);
		return !firstFunc && !firstGlobal;
	}

	/**
	 * Print the module to a string
	 */
	print(): string {
		return ffi.symbols.LLVMPrintModuleToString(this._ref).toString();
	}

	/**
	 * Dispose of the module and free its memory
	 */
	private dispose(): void {
		ffi.symbols.LLVMDisposeModule(this._ref);
		this._ref = null;
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}
