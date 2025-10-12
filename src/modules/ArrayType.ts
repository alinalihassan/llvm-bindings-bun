import { ffi } from "@/ffi";
import { assert, type LLVMTypeRef } from "@/utils";
import { Type } from "./Type";

/**
 * Class to represent array types
 */
export class ArrayType extends Type {
	private constructor(ref: LLVMTypeRef) {
		super(ref);
	}

	/**
	 * This static method is the primary way of constructing an ArrayType.
	 *
	 * @param elementType The type of elements in the array
	 * @param numElements The number of elements in the array
	 * @returns An ArrayType instance
	 */
	static get(elementType: Type, numElements: number): ArrayType {
		assert(numElements >= 0, "Array length must be non-negative");

		const arrayTypeRef = ffi.symbols.LLVMArrayType(elementType.ref, numElements);

		assert(arrayTypeRef !== null, "Failed to create array type");

		return new ArrayType(arrayTypeRef);
	}

	/**
	 * Get the element type of this array.
	 *
	 * @returns The element type
	 */
	getElementType(): Type {
		const elementTypeRef = ffi.symbols.LLVMGetElementType(this.ref);
		assert(elementTypeRef !== null, "Failed to get element type from array type");

		return new Type(elementTypeRef);
	}

	/**
	 * Get the number of elements in this array.
	 *
	 * @returns The number of elements
	 */
	getNumElements(): bigint {
		return ffi.symbols.LLVMGetArrayLength(this.ref);
	}

	/**
	 * Methods for support type inquiry through isa, cast, and dyn_cast.
	 *
	 * @param type The type to check
	 * @returns True if the type is an ArrayType
	 */
	static isArrayType(type: Type): boolean {
		return type.isArrayTy();
	}
}
