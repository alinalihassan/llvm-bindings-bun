import { ConstantFP } from "@/modules/constants/ConstantFP";
import type { Type } from "@/modules/Type";

/**
 * Represents an arbitrary precision floating point (APFloat) in LLVM
 * This is a wrapper around LLVM's APFloat functionality for creating constant floating point values
 */
export class APFloat {
	private _value: number;

	/**
	 * Create a new APFloat
	 * @param value The floating point value
	 */
	public constructor(value: number) {
		this._value = value;
	}

	/**
	 * Get the value
	 */
	public getValue(): number {
		return this._value;
	}

	/**
	 * Create a constant floating point from this APFloat
	 * @param floatType The floating point type to use
	 * @returns A constant floating point value
	 */
	public toConstantFP(floatType: Type): ConstantFP {
		return ConstantFP.get(floatType, this);
	}
}
