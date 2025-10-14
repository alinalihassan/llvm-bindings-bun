import { ffi } from "@/ffi";
import { Type } from "@/modules/Type";
import { assert, type LLVMTypeRef } from "@/utils";

/**
 * Base class of all SIMD vector types.
 */
export class VectorType extends Type {
	private _isScalable: boolean;

	private constructor(ref: LLVMTypeRef, isScalable: boolean = false) {
		super(ref);
		this._isScalable = isScalable;
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
			return new VectorType(ffi.LLVMScalableVectorType(elementType.ref, numElements), scalable);
		} else {
			return new VectorType(ffi.LLVMVectorType(elementType.ref, numElements, false), scalable);
		}
	}

	/**
	 * Get the element type of this vector.
	 *
	 * @returns The element type
	 */
	getElementType(): Type {
		const elementTypeRef = ffi.LLVMGetElementType(this.ref);
		assert(elementTypeRef !== null, "Failed to get element type from vector type");

		return new Type(elementTypeRef);
	}

	/**
	 * Get the number of elements in this vector.
	 *
	 * @returns The number of elements
	 */
	getNumElements(): number {
		return ffi.LLVMGetVectorSize(this.ref);
	}

	/**
	 * Check if this vector is scalable.
	 *
	 * @returns True if the vector is scalable
	 */
	isScalable(): boolean {
		return this._isScalable;
	}
}
