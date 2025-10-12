import { ffi } from "@/ffi";
import { assert } from "@/utils";
import { Type } from "./Type";

/**
 * Class to represent integer types. Note that this class is also used to
 * represent the built-in integer types: Int1Ty, Int8Ty, Int16Ty, Int32Ty and Int64Ty.
 */
export class IntegerType extends Type {
	/**
	 * Minimum number of bits that can be specified
	 */
	static readonly MIN_INT_BITS = 1;

	/**
	 * Maximum number of bits that can be specified
	 * Note that bit width is stored in the Type classes SubclassData field
	 * which has 24 bits. SelectionDAG type legalization can require a
	 * power of 2 IntegerType, so limit to the largest representable power
	 * of 2, 8388608.
	 */
	static readonly MAX_INT_BITS = 1 << 23;

	/**
	 * This static method is the primary way of constructing an IntegerType.
	 * If an IntegerType with the same NumBits value was previously instantiated,
	 * that instance will be returned. Otherwise a new one will be created. Only
	 * one instance with a given NumBits value is ever created.
	 *
	 * @param numBits The number of bits for the integer type
	 * @returns An IntegerType instance
	 */
	static get(_context: unknown, numBits: number): IntegerType {
		assert(
			numBits >= IntegerType.MIN_INT_BITS && numBits <= IntegerType.MAX_INT_BITS,
			`Invalid bit width: ${numBits}. Must be between ${IntegerType.MIN_INT_BITS} and ${IntegerType.MAX_INT_BITS}`,
		);

		switch (numBits) {
			case 1:
				return new IntegerType(Type.getInt1Ty().ref);
			case 8:
				return new IntegerType(Type.getInt8Ty().ref);
			case 16:
				return new IntegerType(Type.getInt16Ty().ref);
			case 32:
				return new IntegerType(Type.getInt32Ty().ref);
			case 64:
				return new IntegerType(Type.getInt64Ty().ref);
			default:
				return new IntegerType(ffi.symbols.LLVMIntType(numBits));
		}
	}

	/**
	 * Returns type twice as wide the input type.
	 *
	 * @returns An IntegerType with twice the bit width
	 */
	getExtendedType(): IntegerType {
		return new IntegerType(ffi.symbols.LLVMIntType(this.getBitWidth() * 2));
	}

	/**
	 * Get the number of bits in this IntegerType
	 *
	 * @returns The bit width of the integer type
	 */
	getBitWidth(): number {
		return ffi.symbols.LLVMGetIntTypeWidth(this.ref);
	}

	/**
	 * Return a bitmask with ones set for all of the bits that can be set by an
	 * unsigned version of this type. This is 0xFF for i8, 0xFFFF for i16, etc.
	 *
	 * @returns A bit mask for this type
	 */
	getBitMask(): bigint {
		const bitWidth = this.getBitWidth();
		return (1n << BigInt(bitWidth)) - 1n;
	}

	/**
	 * Return a uint64_t with just the most significant bit set (the sign bit, if
	 * the value is treated as a signed number).
	 *
	 * @returns The sign bit mask
	 */
	getSignBit(): bigint {
		const bitWidth = this.getBitWidth();
		return 1n << BigInt(bitWidth - 1);
	}
}
