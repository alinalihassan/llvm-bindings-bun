import { ffi } from "@/ffi";
import type { LLVMValueRef } from "@/utils";
import { assert, cstring } from "@/utils";
import { Type } from "./Type";

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
}
