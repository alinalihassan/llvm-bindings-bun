import { ffi } from "@/ffi";
import { assert } from "@/utils";
import type { Type } from "./Type";
import { User } from "./User";
import { Value } from "./Value";

/**
 * Represents a Constant in LLVM IR
 * A Constant is a User that represents an immutable value at runtime
 * This includes integers, floating point values, arrays, structures, etc.
 */
export class Constant extends User {
	/**
	 * Create a null constant of the specified type
	 * @param type The type for the null constant
	 * @returns A null constant of the specified type
	 */
	public static getNullValue(type: Type): Constant {
		const constantRef = ffi.LLVMConstNull(type.ref);
		assert(constantRef !== null, "Failed to create null constant");

		return new Constant(constantRef);
	}

	/**
	 * Create an all-ones constant of the specified type
	 * @param type The type for the all-ones constant
	 * @returns An all-ones constant of the specified type
	 */
	public static getAllOnesValue(type: Type): Constant {
		const constantRef = ffi.LLVMConstAllOnes(type.ref);
		assert(constantRef !== null, "Failed to create all-ones constant");

		return new Constant(constantRef);
	}

	/**
	 * Check if this constant is a null value
	 * @returns True if this is a null constant
	 */
	public isNullValue(): boolean {
		return ffi.LLVMIsNull(this.ref);
	}

	// TODO: Implement UndefValue class
	public getUndefValue(): Value {
		const valueRef = ffi.LLVMGetUndef(this.ref);
		assert(valueRef !== null, "Failed to get undef value");

		return new Value(valueRef);
	}

	// TODO: Implement PoisonValue class
	public getPoisonValue(): Value {
		const valueRef = ffi.LLVMGetPoison(this.ref);
		assert(valueRef !== null, "Failed to get poison value");

		return new Value(valueRef);
	}

	public getPointerNullValue(): Value {
		const valueRef = ffi.LLVMConstPointerNull(this.ref);
		assert(valueRef !== null, "Failed to get pointer null value");

		return new Value(valueRef);
	}
}
