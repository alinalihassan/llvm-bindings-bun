import { ffi } from "@/ffi";
import { Type } from "@/modules/Type";
import type { LLVMValueRef } from "@/utils";
import { assert, cstring } from "@/utils";

/**
 * Base class for all LLVM values
 * Represents any value computed by a program in LLVM IR
 */
export class Value {
	protected _ref: LLVMValueRef;

	/** @internal */
	public constructor(ref: LLVMValueRef) {
		this._ref = ref;
	}

	/**
	 * Get the underlying LLVM value reference
	 */
	get ref(): LLVMValueRef {
		return this._ref;
	}

	/**
	 * Get the type of this value
	 */
	public getType(): Type {
		const typeRef = ffi.LLVMTypeOf(this._ref);
		assert(typeRef !== null, "Failed to get value type");

		return new Type(typeRef);
	}

	/**
	 * Check if this value has a name
	 */
	public hasName(): boolean {
		const namePtr = ffi.LLVMGetValueName(this._ref);
		return namePtr !== null;
	}

	/**
	 * Get the name of this value
	 * Returns empty string if the value has no name
	 */
	public getName(): string {
		const namePtr = ffi.LLVMGetValueName(this._ref);
		assert(namePtr !== null, "Failed to get value name");

		return namePtr.toString();
	}

	/**
	 * Set the name of this value
	 */
	public setName(name: string): void {
		ffi.LLVMSetValueName(this._ref, cstring(name));
	}

	/**
	 * Delete this value from LLVM
	 * Note: This should be called carefully as it can invalidate other references
	 */
	public deleteValue(): void {
		ffi.LLVMDeleteInstruction(this._ref);
		this._ref = null;
	}

	/**
	 * Replace all uses of this value with another value
	 */
	public replaceAllUsesWith(newValue: Value): void {
		assert(newValue._ref !== null, "Cannot replace uses with null value");

		ffi.LLVMReplaceAllUsesWith(this._ref, newValue._ref);
	}

	//===--------------------------------------------------------------------===//
	// Debug Location Methods
	//===--------------------------------------------------------------------===//

	/**
	 * Get the directory of the debug location for this value
	 * @returns The directory path, or empty string if no debug location
	 */
	public getDebugLocDirectory(): string {
		const lengthBuffer = new Uint32Array(1);
		const dirPtr = ffi.LLVMGetDebugLocDirectory(this._ref, lengthBuffer);
		return dirPtr ? dirPtr.toString() : "";
	}

	/**
	 * Get the filename of the debug location for this value
	 * @returns The filename, or empty string if no debug location
	 */
	public getDebugLocFilename(): string {
		const lengthBuffer = new Uint32Array(1);
		const filenamePtr = ffi.LLVMGetDebugLocFilename(this._ref, lengthBuffer);
		return filenamePtr ? filenamePtr.toString() : "";
	}

	/**
	 * Get the line number of the debug location for this value
	 * @returns The line number, or 0 if no debug location
	 */
	public getDebugLocLine(): number {
		return ffi.LLVMGetDebugLocLine(this._ref);
	}

	/**
	 * Get the column number of the debug location for this value
	 * @returns The column number, or 0 if no debug location
	 */
	public getDebugLocColumn(): number {
		return ffi.LLVMGetDebugLocColumn(this._ref);
	}
}
