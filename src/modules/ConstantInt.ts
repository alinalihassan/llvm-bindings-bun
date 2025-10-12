import { ffi } from "@/ffi";
import { assert } from "@/utils";
import { APInt } from "./APInt";
import { Constant } from "./Constant";
import { IntegerType } from "./IntegerType";
import type { LLVMContext } from "./LLVMContext";

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
		context: LLVMContext,
		value: number | APInt,
		isSigned: boolean = true,
	): ConstantInt {
		assert(typeof value === "number" || value instanceof APInt, "Invalid value type");

		if (typeof value === "number") {
			return new ConstantInt(ffi.symbols.LLVMConstInt(context.ref, value, isSigned));
		} else if (value instanceof APInt) {
			return new ConstantInt(value.toConstantInt(IntegerType.get(context, value.getNumBits())).ref);
		} else {
			assert(false, "Failed to create constant integer");
		}
	}

	/**
	 * Create a constant integer representing true (1).
	 * @param _context The LLVM context
	 * @returns A new ConstantInt instance representing true
	 */
	public static getTrue(_context: LLVMContext): ConstantInt {
		return ConstantInt.get(_context, 1);
	}

	/**
	 * Create a constant integer representing false (0).
	 * @param _context The LLVM context
	 * @returns A new ConstantInt instance representing false
	 */
	public static getFalse(_context: LLVMContext): ConstantInt {
		return ConstantInt.get(_context, 0);
	}

	/**
	 * Get the type of this constant integer.
	 * @returns The IntegerType of this constant
	 */
	public override getType(): IntegerType {
		const typeRef = ffi.symbols.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get constant integer type");

		return new IntegerType(typeRef);
	}
}
