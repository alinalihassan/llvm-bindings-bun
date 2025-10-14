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
	private _value: number;
	private _isSigned: boolean;

	/**
	 * Create a new APInt
	 * @param numBits The number of bits for the integer
	 * @param value The integer value
	 * @param isSigned Whether the value should be treated as signed (default: false)
	 */
	public constructor(numBits: number, value: number, isSigned: boolean = false) {
		this._numBits = numBits;
		this._value = value;
		this._isSigned = isSigned;
	}

	/**
	 * Get the number of bits
	 */
	public getNumBits(): number {
		return this._numBits;
	}

	/**
	 * Get the value
	 */
	public getValue(): number {
		return this._value;
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
		const constantRef = ffi.LLVMConstInt(intType.ref, BigInt(this._value), this._isSigned);
		assert(constantRef !== null, "Failed to create constant integer from APInt");

		return new ConstantInt(constantRef);
	}
}
