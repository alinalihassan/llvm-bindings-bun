import { ffi } from "@/ffi";
import { APInt } from "@/modules/ap/APInt";
import { Constant } from "@/modules/Constant";
import { IntegerType } from "@/modules/types/IntegerType";
import { assert } from "@/utils";

/**
 * Represents a constant integer value in LLVM IR
 * Based on LLVM's ConstantInt class from Constants.h
 */
export class ConstantInt extends Constant {
	/**
	 * Create a ConstantInt or Constant with the specified parameters.
	 * @param contextOrType The LLVM context or type
	 * @param value The APInt or number value
	 * @param isSigned Whether the value should be treated as signed (default: true)
	 * @returns A new ConstantInt or Constant instance
	 */
	public static get(
		value: number | APInt,
		type?: IntegerType,
		isSigned: boolean = true,
	): ConstantInt {
		assert(typeof value === "number" || value instanceof APInt, "Invalid value type");

		if (typeof value === "number") {
			if (type === undefined) {
				type = IntegerType.getInt64Ty();
			}
			return new ConstantInt(ffi.LLVMConstInt(type.ref, value, isSigned));
		} else if (value instanceof APInt) {
			if (type === undefined) {
				type = IntegerType.get(value.getNumBits());
			}

			return new ConstantInt(value.toConstantInt(type).ref);
		} else {
			assert(false, "Failed to create constant integer");
		}
	}

	/**
	 * Create a constant integer representing true (1).
	 * @returns A new ConstantInt instance representing true
	 */
	public static getTrue(): ConstantInt {
		return ConstantInt.get(1);
	}

	/**
	 * Create a constant integer representing false (0).
	 * @returns A new ConstantInt instance representing false
	 */
	public static getFalse(): ConstantInt {
		return ConstantInt.get(0);
	}

	/**
	 * Create a boolean value as a constant integer.
	 * @param value The boolean value
	 * @returns A new ConstantInt instance representing the boolean value
	 */
	public static getBool(value: boolean): ConstantInt {
		return ConstantInt.get(value ? 1 : 0);
	}

	/**
	 * Get the type of this constant integer.
	 * @returns The IntegerType of this constant
	 */
	public override getType(): IntegerType {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get constant integer type");

		return new IntegerType(typeRef);
	}
}
