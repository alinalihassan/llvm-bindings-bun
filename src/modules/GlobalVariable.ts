import { ffi } from "@/ffi";
import { assert, cstring } from "@/utils";
import { Constant } from "./Constant";
import { GlobalObject } from "./GlobalObject";
import type { Module } from "./Module";
import type { Type } from "./Type";

/**
 * Represents a global variable in LLVM IR
 * Based on LLVM's GlobalVariable class from GlobalVariable.h
 * Global variables are constant pointers that refer to hunks of space that are
 * allocated by either the VM, or by the linker in a static compiler.
 */
export class GlobalVariable extends GlobalObject {
	/**
	 * Constructor for creating a global variable with a parent module.
	 * @param module The parent module
	 * @param type The type of the global variable
	 * @param isConstant Whether this is a constant global variable
	 * @param linkage The linkage type (from GlobalValue.LinkageTypes)
	 * @param initializer The initializer constant (can be null)
	 * @param name Optional name for the global variable
	 */
	public static Create(
		module: Module,
		type: Type,
		isConstant: boolean,
		linkage: number,
		initializer: Constant | null,
		name?: string,
	) {
		assert(module.ref !== null, "Module cannot be null for GlobalVariable constructor");
		assert(type.ref !== null, "Type cannot be null for GlobalVariable constructor");

		// Create the global variable
		const globalVarRef = ffi.LLVMAddGlobal(module.ref, type.ref, cstring(name || ""));
		assert(globalVarRef !== null, "Failed to create global variable");

		// Set the constant flag
		ffi.LLVMSetGlobalConstant(globalVarRef, isConstant);

		// Set the linkage
		ffi.LLVMSetLinkage(globalVarRef, linkage);

		// Set the initializer if provided
		if (initializer && initializer.ref !== null) {
			ffi.LLVMSetInitializer(globalVarRef, initializer.ref);
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Set the initializer for this global variable.
	 * @param initVal The initializer constant (can be null to remove initializer)
	 */
	public setInitializer(initVal: Constant | null): void {
		assert(
			initVal !== null && initVal.ref !== null,
			"Initializer constant and reference cannot be null",
		);

		ffi.LLVMSetInitializer(this.ref, initVal.ref);
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
	 * Get the initializer for this global variable.
	 * @returns The initializer constant, or null if no initializer
	 */
	public getInitializer(): Constant | null {
		const initRef = ffi.LLVMGetInitializer(this.ref);
		assert(initRef !== null, "Failed to get initializer");

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
	 * @param visibility The visibility type (from GlobalValue.VisibilityTypes)
	 */
	public setVisibility(visibility: number): void {
		ffi.LLVMSetVisibility(this.ref, visibility);
	}
}
