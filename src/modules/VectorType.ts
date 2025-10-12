import { ffi } from "@/ffi";
import type { LLVMTypeRef } from "@/utils";
import { Type } from "./Type";

/**
 * Base class of all SIMD vector types.
 */
export class VectorType extends Type {
	private constructor(ref: LLVMTypeRef) {
		super(ref);
	}

	/**
	 * This static method is the primary way to construct a VectorType.
	 *
	 * @param elementType The type of each element in the vector
	 * @param numElements The number of elements in the vector
	 * @param scalable Whether the vector is scalable (SVE-style)
	 * @returns A VectorType instance
	 */
	static get(elementType: Type, numElements: number, scalable: boolean = false): VectorType {
		if (scalable) {
			return new VectorType(ffi.LLVMScalableVectorType(elementType.ref, numElements));
		} else {
			return new VectorType(ffi.LLVMVectorType(elementType.ref, numElements, false));
		}
	}

	/**
	 * Create a VectorType with the same element type as another vector but different size.
	 *
	 * @param elementType The type of each element in the vector
	 * @param other Another vector type to copy element type from
	 * @returns A VectorType instance
	 */
	static getWithElementType(_elementType: Type, _other: VectorType): VectorType {
		// This would need to get the element count from the other vector
		// TODO: Not implemented yet
		throw new Error("getWithElementType not yet implemented - requires element count extraction");
	}

	/**
	 * Return true if the specified type is valid as an element type.
	 *
	 * @param elemTy The type to validate
	 * @returns True if the type is valid as an element type
	 */
	static isValidElementType(_elemTy: Type): boolean {
		// TODO: Not implemented yet
		throw new Error("isValidElementType not yet implemented - requires element type validation");
	}

	/**
	 * Get the element type of this vector.
	 *
	 * @returns The element type
	 */
	getElementType(): Type {
		// TODO: Not implemented yet
		throw new Error("getElementType not yet implemented - requires LLVMGetElementType");
	}

	/**
	 * Get the number of elements in this vector.
	 *
	 * @returns The number of elements
	 */
	getElementCount(): number {
		// TODO: Not implemented yet
		throw new Error("getElementCount not yet implemented - requires LLVMGetVectorSize");
	}

	/**
	 * Check if this vector is scalable.
	 *
	 * @returns True if the vector is scalable
	 */
	isScalable(): boolean {
		// TODO: Not implemented yet
		throw new Error("isScalable not yet implemented - requires LLVMIsScalableVector");
	}

	/**
	 * This static method gets a VectorType with the same number of elements as the input type,
	 * but with the element type changed to an integer type of the same bitwidth.
	 *
	 * @param vTy The input vector type
	 * @returns A VectorType with integer elements
	 */
	static getInteger(_vTy: VectorType): VectorType {
		// TODO: Not implemented yet
		throw new Error("getInteger not yet implemented - requires element type extraction");
	}

	/**
	 * This static method is like getInteger except that the element types are twice as wide as the elements
	 * in the input vector type. The input vector type must have an integer or floating point element type.
	 *
	 * @param vTy The input vector type
	 * @returns A VectorType with extended element types
	 */
	static getExtendedElementVectorType(_vTy: VectorType): VectorType {
		// TODO: Not implemented yet
		throw new Error(
			"getExtendedElementVectorType not yet implemented - requires element type extension",
		);
	}

	/**
	 * This static method is like getInteger except that the element types are half as wide as the elements
	 * in the input vector type. The input vector type must have an integer or floating point element type.
	 *
	 * @param vTy The input vector type
	 * @returns A VectorType with truncated element types
	 */
	static getTruncatedElementVectorType(_vTy: VectorType): VectorType {
		// TODO: Not implemented yet
		throw new Error(
			"getTruncatedElementVectorType not yet implemented - requires element type truncation",
		);
	}

	/**
	 * This static method returns a VectorType with half as many elements as the input type and the same element type.
	 *
	 * @param vTy The input vector type
	 * @returns A VectorType with half the elements
	 */
	static getHalfElementsVectorType(_vTy: VectorType): VectorType {
		// TODO: Not implemented yet
		throw new Error(
			"getHalfElementsVectorType not yet implemented - requires element count manipulation",
		);
	}

	/**
	 * This static method returns a VectorType with twice as many elements as the input type and the same element type.
	 *
	 * @param vTy The input vector type
	 * @returns A VectorType with double the elements
	 */
	static getDoubleElementsVectorType(_vTy: VectorType): VectorType {
		// TODO: Not implemented yet
		throw new Error(
			"getDoubleElementsVectorType not yet implemented - requires element count manipulation",
		);
	}

	/**
	 * Methods for support type inquiry through isa, cast, and dyn_cast.
	 *
	 * @param type The type to check
	 * @returns True if the type is a VectorType
	 */
	static isVectorType(type: Type): boolean {
		return type.isVectorTy();
	}
}
