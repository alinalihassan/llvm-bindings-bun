import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import { Type } from "@/modules/Type";
import { assert } from "@/utils";

/**
 * Represents an undefined value in LLVM IR
 * UndefValue is a special constant that can have any value
 * Based on LLVM's UndefValue class from Constants.h
 */
export class UndefValue extends Constant {
	/**
	 * Create an undefined value of the specified type.
	 * @param type The type of the undefined value
	 * @returns A new UndefValue instance
	 */
	public static get(type: Type): UndefValue {
		const valueRef = ffi.LLVMGetUndef(type.ref);
		assert(valueRef !== null, "Failed to create undefined value");

		return new UndefValue(valueRef);
	}

	/**
	 * Get the type of this undefined value.
	 * @returns The Type of this value
	 */
	public override getType(): Type {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get undefined value type");

		return new Type(typeRef);
	}
}
