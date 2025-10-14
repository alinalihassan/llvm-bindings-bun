import { ffi } from "@/ffi";
import { assert, cstring, type LLVMValueRef } from "@/utils";
import { APFloat } from "./APFloat";
import { Constant } from "./Constant";
import { Type } from "./Type";

/**
 * Represents a constant floating point value in LLVM IR
 * Based on LLVM's ConstantFP class from Constants.h
 */
export class ConstantFP extends Constant {
	private _originalValue?: number;

	constructor(ref: LLVMValueRef, originalValue?: number) {
		super(ref);
		this._originalValue = originalValue;
	}

	/**
	 * Create a ConstantFP with the specified value and type.
	 * @param type The floating point type
	 * @param value The floating point value (number, APFloat, or string)
	 * @returns A new ConstantFP instance
	 */
	public static get(type: Type, value: number): ConstantFP;
	public static get(type: Type, value: APFloat): ConstantFP;
	public static get(type: Type, value: string): ConstantFP;
	public static get(type: Type, value: number | APFloat | string): ConstantFP {
		assert(type.isFloatingPointTy(), "Type must be a floating point type");

		if (typeof value === "number") {
			const constantRef = ffi.LLVMConstReal(type.ref, value);
			assert(constantRef !== null, "Failed to create constant floating point");
			return new ConstantFP(constantRef, value);
		} else if (value instanceof APFloat) {
			return ConstantFP.get(type, value.getValue());
		} else if (typeof value === "string") {
			const constantRef = ffi.LLVMConstRealOfString(type.ref, cstring(value));
			assert(constantRef !== null, "Failed to create constant floating point from string");

			// Parse the string to get the original value for special value detection
			const originalValue = parseFloat(value);
			return new ConstantFP(constantRef, originalValue);
		} else {
			throw new Error("Value must be a number, APFloat, or string");
		}
	}

	/**
	 * Create a NaN constant of the specified type.
	 * @param type The floating point type
	 * @returns A new ConstantFP instance representing NaN
	 */
	public static getNaN(type: Type): ConstantFP {
		assert(type.isFloatingPointTy(), "Type must be a floating point type");

		// Use JavaScript's NaN value with LLVMConstReal
		return ConstantFP.get(type, Number.NaN);
	}

	/**
	 * Create a zero constant of the specified type.
	 * @param type The floating point type
	 * @param negative Whether to create negative zero (default: false)
	 * @returns A new ConstantFP instance representing zero
	 */
	public static getZero(type: Type, negative: boolean = false): ConstantFP {
		assert(type.isFloatingPointTy(), "Type must be a floating point type");

		// Use JavaScript's zero values with LLVMConstReal
		return ConstantFP.get(type, negative ? -0.0 : 0.0);
	}

	/**
	 * Create a negative zero constant of the specified type.
	 * @param type The floating point type
	 * @returns A new ConstantFP instance representing negative zero
	 */
	public static getNegativeZero(type: Type): ConstantFP {
		return ConstantFP.getZero(type, true);
	}

	/**
	 * Create an infinity constant of the specified type.
	 * @param type The floating point type
	 * @param negative Whether to create negative infinity (default: false)
	 * @returns A new ConstantFP instance representing infinity
	 */
	public static getInfinity(type: Type, negative: boolean = false): ConstantFP {
		assert(type.isFloatingPointTy(), "Type must be a floating point type");

		// Use JavaScript's infinity values with LLVMConstReal
		return ConstantFP.get(type, negative ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY);
	}

	/**
	 * Get the double value for this floating point constant.
	 * @returns The double value and whether precision was lost
	 */
	public getDoubleValue(): { value: number; losesInfo: boolean } {
		const losesInfoBuffer = new ArrayBuffer(1);
		const losesInfoView = new Uint8Array(losesInfoBuffer);

		const value = ffi.LLVMConstRealGetDouble(this.ref, losesInfoView);
		const losesInfo = losesInfoView[0] !== 0;

		return { value, losesInfo };
	}

	/**
	 * Get the APFloat value for this constant.
	 * @returns The APFloat value
	 */
	public getValueAPF(): APFloat {
		const { value } = this.getDoubleValue();
		return new APFloat(value);
	}

	/**
	 * Get the APFloat value for this constant (alias for getValueAPF).
	 * @returns The APFloat value
	 */
	public getValue(): APFloat {
		return this.getValueAPF();
	}

	/**
	 * Check if this constant is zero (positive or negative zero).
	 * @returns True if the value is zero
	 */
	public isZero(): boolean {
		if (this._originalValue !== undefined) {
			return this._originalValue === 0.0 || Object.is(this._originalValue, -0.0);
		}
		const { value } = this.getDoubleValue();
		return value === 0.0 || value === -0.0;
	}

	/**
	 * Check if this constant is negative.
	 * @returns True if the sign bit is set
	 */
	public isNegative(): boolean {
		if (this._originalValue !== undefined) {
			return this._originalValue < 0.0 || Object.is(this._originalValue, -0.0);
		}
		const { value } = this.getDoubleValue();
		return value < 0.0 || Object.is(value, -0.0);
	}

	/**
	 * Check if this constant is infinity.
	 * @returns True if the value is infinity
	 */
	public isInfinity(): boolean {
		if (this._originalValue !== undefined) {
			return !Number.isFinite(this._originalValue) && !Number.isNaN(this._originalValue);
		}
		const { value } = this.getDoubleValue();
		return !Number.isFinite(value) && !Number.isNaN(value);
	}

	/**
	 * Check if this constant is NaN (Not a Number).
	 * @returns True if the value is NaN
	 */
	public isNaN(): boolean {
		if (this._originalValue !== undefined) {
			return Number.isNaN(this._originalValue);
		}
		const { value } = this.getDoubleValue();
		return Number.isNaN(value);
	}

	/**
	 * Check if this constant has exactly the same value as the given APFloat.
	 * @param value The APFloat to compare against
	 * @returns True if the values are exactly equal
	 */
	public isExactlyValue(value: APFloat): boolean {
		const otherDouble = value.getValue();

		// Use original value if available for exact comparison
		if (this._originalValue !== undefined) {
			return Object.is(this._originalValue, otherDouble);
		}

		const thisValue = this.getValueAPF();
		const thisDouble = thisValue.getValue();

		// Use Object.is for exact bit-for-bit comparison
		return Object.is(thisDouble, otherDouble);
	}

	/**
	 * Check if this constant has exactly the same value as the given double.
	 * @param value The double to compare against
	 * @returns True if the values are exactly equal
	 */
	public isExactlyValueDouble(value: number): boolean {
		// Use original value if available for exact comparison
		if (this._originalValue !== undefined) {
			return Object.is(this._originalValue, value);
		}

		const { value: thisValue } = this.getDoubleValue();

		// Use Object.is for exact bit-for-bit comparison
		return Object.is(thisValue, value);
	}

	/**
	 * Get the type of this constant floating point.
	 * @returns The Type of this constant
	 */
	public override getType(): Type {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get constant floating point type");

		return new Type(typeRef);
	}
}
