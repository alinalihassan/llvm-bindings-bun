import { ffi } from "@/ffi";
import { ConstantInt } from "@/modules/constants/ConstantInt";
import type { IntegerType } from "@/modules/types/IntegerType";
import { assert } from "@/utils";

/**
 * Represents an arbitrary precision integer (APInt) in LLVM
 * This is a wrapper around LLVM's APInt functionality for creating constant integers
 */
export class APInt {
	private _numBits: number;
	private _value: bigint;
	private _isSigned: boolean;

	/**
	 * Create a new APInt
	 * @param numBits The number of bits for the integer
	 * @param value The integer value (supports bigint for large values beyond Number.MAX_SAFE_INTEGER)
	 * @param isSigned Whether the value should be treated as signed (default: false)
	 */
	public constructor(numBits: number, value: number | bigint, isSigned: boolean = false) {
		this._numBits = numBits;
		this._value = typeof value === "bigint" ? value : BigInt(value);
		this._isSigned = isSigned;
	}

	/**
	 * Get the number of bits
	 */
	public getNumBits(): number {
		return this._numBits;
	}

	/**
	 * Get the value as bigint (preserves full precision)
	 */
	public getValue(): bigint {
		return this._value;
	}

	/**
	 * Get the value as a number (may lose precision for large values beyond Number.MAX_SAFE_INTEGER)
	 */
	public getValueAsNumber(): number {
		return Number(this._value);
	}

	/**
	 * Check if this is signed
	 */
	public isSigned(): boolean {
		return this._isSigned;
	}

	/**
	 * Create a constant integer from this APInt
	 * @param intType The integer type to use
	 * @returns A constant integer value
	 */
	public toConstantInt(intType: IntegerType): ConstantInt {
		// For now, we'll use the simple LLVMConstInt function
		// In a full implementation, we might need to handle arbitrary precision
		const constantRef = ffi.LLVMConstInt(intType.ref, this._value, this._isSigned);
		assert(constantRef !== null, "Failed to create constant integer from APInt");

		return new ConstantInt(constantRef);
	}
}
