import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import type { GlobalValueVisibilityTypes } from "@/modules/Enum";
import { LLVMThreadLocalMode } from "@/modules/Enum";
import { GlobalObject } from "@/modules/GlobalObject";
import type { Module } from "@/modules/Module";
import type { Type } from "@/modules/Type";
import { assert, cstring } from "@/utils";

/**
 * Represents a global variable in LLVM IR
 * Based on LLVM's GlobalVariable class from GlobalVariable.h
 * Global variables are constant pointers that refer to hunks of space that are
 * allocated by either the VM, or by the linker in a static compiler.
 */
export class GlobalVariable extends GlobalObject {
	/**
	 * Thread Local Mode enumeration
	 * Specifies the thread local storage model for a global variable
	 */
	public static readonly ThreadLocalMode = LLVMThreadLocalMode;
	/**
	 * Constructor for creating a global variable with a parent module.
	 * Matches the C++ API: GlobalVariable(Module &M, Type *Ty, bool isConstant, LinkageTypes Linkage, ...)
	 * @param module The parent module
	 * @param type The type of the global variable
	 * @param isConstant Whether this is a constant global variable
	 * @param linkage The linkage type (from GlobalValue.LinkageTypes)
	 * @param initializer The initializer constant (can be null)
	 * @param name Optional name for the global variable (default: "")
	 * @param threadLocalMode Optional thread local mode (default: NotThreadLocal)
	 * @param addressSpace Optional address space (default: 0)
	 * @param isExternallyInitialized Optional externally initialized flag (default: false)
	 */
	public static Create(
		module: Module,
		type: Type,
		isConstant: boolean,
		linkage: number,
		initializer: Constant | null = null,
		name: string = "",
		threadLocalMode: LLVMThreadLocalMode = LLVMThreadLocalMode.NotThreadLocal,
		addressSpace: number = 0,
		isExternallyInitialized: boolean = false,
	) {
		assert(module.ref !== null, "Module cannot be null for GlobalVariable constructor");
		assert(type.ref !== null, "Type cannot be null for GlobalVariable constructor");

		// Create the global variable
		const globalVarRef =
			addressSpace !== 0
				? ffi.LLVMAddGlobalInAddressSpace(module.ref, type.ref, cstring(name), addressSpace)
				: ffi.LLVMAddGlobal(module.ref, type.ref, cstring(name));
		assert(globalVarRef !== null, "Failed to create global variable");

		// Set the constant flag
		ffi.LLVMSetGlobalConstant(globalVarRef, isConstant);

		// Set the linkage
		ffi.LLVMSetLinkage(globalVarRef, linkage);

		// Set thread local mode if not NotThreadLocal
		if (threadLocalMode !== LLVMThreadLocalMode.NotThreadLocal) {
			ffi.LLVMSetThreadLocalMode(globalVarRef, threadLocalMode);
		}

		// Set externally initialized flag
		if (isExternallyInitialized) {
			ffi.LLVMSetExternallyInitialized(globalVarRef, true);
		}

		// Set the initializer if provided
		if (initializer && initializer.ref !== null) {
			ffi.LLVMSetInitializer(globalVarRef, initializer.ref);
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Get a named global variable from a module.
	 * @param module The module to search in
	 * @param name The name of the global variable
	 * @returns The global variable, or null if not found
	 */
	public static GetNamedGlobal(module: Module, name: string): GlobalVariable | null {
		assert(module.ref !== null, "Module cannot be null");

		const globalVarRef = ffi.LLVMGetNamedGlobal(module.ref, cstring(name));
		if (globalVarRef === null) {
			return null;
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Get a named global variable from a module with explicit length.
	 * @param module The module to search in
	 * @param name The name of the global variable
	 * @param length The length of the name
	 * @returns The global variable, or null if not found
	 */
	public static GetNamedGlobalWithLength(
		module: Module,
		name: string,
		length: number,
	): GlobalVariable | null {
		assert(module.ref !== null, "Module cannot be null");

		const globalVarRef = ffi.LLVMGetNamedGlobalWithLength(module.ref, cstring(name), length);
		if (globalVarRef === null) {
			return null;
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Get the first global variable in a module.
	 * @param module The module to get the first global from
	 * @returns The first global variable, or null if the module has no globals
	 */
	public static GetFirstGlobal(module: Module): GlobalVariable | null {
		assert(module.ref !== null, "Module cannot be null");

		const globalVarRef = ffi.LLVMGetFirstGlobal(module.ref);
		if (globalVarRef === null) {
			return null;
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Get the last global variable in a module.
	 * @param module The module to get the last global from
	 * @returns The last global variable, or null if the module has no globals
	 */
	public static GetLastGlobal(module: Module): GlobalVariable | null {
		assert(module.ref !== null, "Module cannot be null");

		const globalVarRef = ffi.LLVMGetLastGlobal(module.ref);
		if (globalVarRef === null) {
			return null;
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Set the initializer for this global variable.
	 * Sets the initializer for this global variable, removing any existing initializer if initVal is null.
	 * The initializer must have the type getValueType() if non-null.
	 * @param initVal The initializer constant (can be null to remove initializer)
	 */
	public setInitializer(initVal: Constant | null): void {
		if (initVal === null || initVal.ref === null) {
			// Remove initializer by setting to null
			ffi.LLVMSetInitializer(this.ref, null);
		} else {
			ffi.LLVMSetInitializer(this.ref, initVal.ref);
		}
	}

	/**
	 * Remove this global variable from its parent module.
	 * This method unlinks 'this' from the containing module, but does not delete it.
	 * TODO: We don't have an unlink method in the C API, so we need to use LLVMDeleteGlobal instead.
	 */
	public removeFromParent(): void {
		ffi.LLVMDeleteGlobal(this.ref);
	}

	/**
	 * Erase this global variable from its parent module and delete it.
	 * This method unlinks 'this' from the containing module and deletes it.
	 */
	public eraseFromParent(): void {
		ffi.LLVMDeleteGlobal(this.ref);
	}

	/**
	 * Check if this global variable has an initializer.
	 * Definitions have initializers, declarations don't.
	 * @returns True if this global variable has an initializer
	 */
	public hasInitializer(): boolean {
		const initRef = ffi.LLVMGetInitializer(this.ref);
		return initRef !== null;
	}

	/**
	 * Get the initializer for this global variable.
	 * It is illegal to call this method if the global is external (has no initializer).
	 * Use hasInitializer() to check first.
	 * @returns The initializer constant
	 */
	public getInitializer(): Constant {
		const initRef = ffi.LLVMGetInitializer(this.ref);
		assert(
			initRef !== null,
			"Global variable doesn't have initializer - use hasInitializer() to check first",
		);

		return new Constant(initRef);
	}

	/**
	 * Check if this global variable is constant.
	 * @returns True if this is a constant global variable
	 */
	public override isConstant(): boolean {
		return ffi.LLVMIsGlobalConstant(this.ref);
	}

	/**
	 * Set whether this global variable is constant.
	 * @param isConstant Whether this should be a constant global variable
	 */
	public setConstant(isConstant: boolean): void {
		ffi.LLVMSetGlobalConstant(this.ref, isConstant);
	}

	/**
	 * Get the linkage of this global variable.
	 * @returns The linkage type
	 */
	public getLinkage(): number {
		return ffi.LLVMGetLinkage(this.ref);
	}

	/**
	 * Set the linkage of this global variable.
	 * @param linkage The linkage type (from GlobalValue.LinkageTypes)
	 */
	public setLinkage(linkage: number): void {
		ffi.LLVMSetLinkage(this.ref, linkage);
	}

	/**
	 * Get the visibility of this global variable.
	 * @returns The visibility type
	 */
	public getVisibility(): number {
		return ffi.LLVMGetVisibility(this.ref);
	}

	/**
	 * Set the visibility of this global variable.
	 * @param visibility The visibility type (from GlobalValueVisibilityTypes)
	 */
	public setVisibility(visibility: GlobalValueVisibilityTypes): void {
		ffi.LLVMSetVisibility(this.ref, visibility);
	}

	/**
	 * Get the next global variable in the module.
	 * @returns The next global variable, or null if this is the last one
	 */
	public getNextGlobal(): GlobalVariable | null {
		const nextRef = ffi.LLVMGetNextGlobal(this.ref);
		if (nextRef === null) {
			return null;
		}

		return new GlobalVariable(nextRef);
	}

	/**
	 * Get the previous global variable in the module.
	 * @returns The previous global variable, or null if this is the first one
	 */
	public getPreviousGlobal(): GlobalVariable | null {
		const prevRef = ffi.LLVMGetPreviousGlobal(this.ref);
		if (prevRef === null) {
			return null;
		}

		return new GlobalVariable(prevRef);
	}

	/**
	 * Check if this global variable is thread local.
	 * @returns True if this is a thread local global variable
	 */
	public isThreadLocal(): boolean {
		return ffi.LLVMIsThreadLocal(this.ref);
	}

	/**
	 * Set whether this global variable is thread local.
	 * @param isThreadLocal Whether this should be a thread local global variable
	 */
	public setThreadLocal(isThreadLocal: boolean): void {
		ffi.LLVMSetThreadLocal(this.ref, isThreadLocal);
	}

	/**
	 * Get the thread local mode of this global variable.
	 * @returns The thread local mode (from GlobalVariable.ThreadLocalMode)
	 */
	public getThreadLocalMode(): LLVMThreadLocalMode {
		return ffi.LLVMGetThreadLocalMode(this.ref);
	}

	/**
	 * Set the thread local mode of this global variable.
	 * @param mode The thread local mode (from GlobalVariable.ThreadLocalMode)
	 */
	public setThreadLocalMode(mode: LLVMThreadLocalMode): void {
		ffi.LLVMSetThreadLocalMode(this.ref, mode);
	}

	/**
	 * Check if this global variable is externally initialized.
	 * An externally initialized global variable is not explicitly initialized by this module.
	 * @returns True if this global variable is externally initialized
	 */
	public isExternallyInitialized(): boolean {
		return ffi.LLVMIsExternallyInitialized(this.ref);
	}

	/**
	 * Set whether this global variable is externally initialized.
	 * @param isExtInit Whether this global variable is externally initialized
	 */
	public setExternallyInitialized(isExtInit: boolean): void {
		ffi.LLVMSetExternallyInitialized(this.ref, isExtInit);
	}
}
