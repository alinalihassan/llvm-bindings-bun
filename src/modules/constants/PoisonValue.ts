import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import { Type } from "@/modules/Type";
import { assert } from "@/utils";

/**
 * Represents a poison value in LLVM IR
 * PoisonValue is a special constant that propagates through operations
 * It represents a value that may be undefined and should not be used
 * Based on LLVM's PoisonValue class from Constants.h
 */
export class PoisonValue extends Constant {
	/**
	 * Create a poison value of the specified type.
	 * @param type The type of the poison value
	 * @returns A new PoisonValue instance
	 */
	public static get(type: Type): PoisonValue {
		const valueRef = ffi.LLVMGetPoison(type.ref);
		assert(valueRef !== null, "Failed to create poison value");

		return new PoisonValue(valueRef);
	}

	/**
	 * Get the type of this poison value.
	 * @returns The Type of this value
	 */
	public override getType(): Type {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get poison value type");

		return new Type(typeRef);
	}
}
