import { ffi } from "@/ffi";
import { assert, type LLVMValueRef } from "@/utils";
import { LLVMFunction } from "./Function";
import type { Type } from "./Type";
import { Value } from "./Value";

/**
 * Represents a function argument in LLVM IR
 * Extends Value as arguments are values in LLVM
 */
export class Argument extends Value {
	/**
	 * Create a new Argument instance
	 * Note: In LLVM, arguments are typically created when creating functions,
	 * not directly. This constructor is mainly for wrapping existing argument references.
	 */
	public constructor(
		ref: LLVMValueRef,
		_type?: Type,
		name?: string,
		_func?: LLVMFunction,
		_argNo?: number,
	) {
		super(ref);

		// If name is provided, set it
		if (name !== undefined) {
			this.setName(name);
		}
	}

	/**
	 * Get the parent function of this argument
	 */
	public getParent(): LLVMFunction {
		const parentRef = ffi.symbols.LLVMGetParamParent(this._ref);

		assert(parentRef !== null, "Failed to get argument parent function");

		return new LLVMFunction(parentRef);
	}
}
