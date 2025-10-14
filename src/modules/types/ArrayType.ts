import { ffi } from "@/ffi";
import { Type } from "@/modules/Type";
import { assert } from "@/utils";

/**
 * Class to represent array types
 */
export class ArrayType extends Type {
	/**
	 * This static method is the primary way of constructing an ArrayType.
	 *
	 * @param elementType The type of elements in the array
	 * @param numElements The number of elements in the array
	 * @returns An ArrayType instance
	 */
	static get(elementType: Type, numElements: number): ArrayType {
		assert(numElements >= 0, "Array length must be non-negative");

		const arrayTypeRef = ffi.LLVMArrayType(elementType.ref, numElements);

		assert(arrayTypeRef !== null, "Failed to create array type");

		return new ArrayType(arrayTypeRef);
	}

	/**
	 * Get the element type of this array.
	 *
	 * @returns The element type
	 */
	getElementType(): Type {
		const elementTypeRef = ffi.LLVMGetElementType(this.ref);
		assert(elementTypeRef !== null, "Failed to get element type from array type");

		return new Type(elementTypeRef);
	}

	/**
	 * Get the number of elements in this array.
	 *
	 * @returns The number of elements
	 */
	getNumElements(): bigint {
		return ffi.LLVMGetArrayLength(this.ref);
	}
}
