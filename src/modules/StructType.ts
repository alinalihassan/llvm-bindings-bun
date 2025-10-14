import { ffi } from "@/ffi";
import { assert, type LLVMTypeRef } from "@/utils";
import { Type } from "./Type";

/**
 * Class to represent struct types
 */
export class StructType extends Type {
	/**
	 * This static method is the primary way of constructing a StructType.
	 *
	 * @param elementTypes Array of element types
	 * @param isPacked Whether the struct is packed
	 * @returns A StructType instance
	 */
	static get(elementTypes: Type[], isPacked: boolean = false): StructType {
		if (elementTypes.length === 0) {
			// Create a buffer to hold empty element types
			const elementTypesBuffer = new ArrayBuffer(0);
			const elementTypesView = new BigUint64Array(elementTypesBuffer);

			const structTypeRef = ffi.LLVMStructType(elementTypesView, 0, isPacked);
			assert(structTypeRef !== null, "Failed to create struct type");

			return new StructType(structTypeRef);
		}

		// Create a buffer to hold the element type references
		const elementTypesBuffer = new ArrayBuffer(elementTypes.length * 8); // 8 bytes per pointer
		const elementTypesView = new BigUint64Array(elementTypesBuffer);

		// Fill the buffer with element type references
		for (let i = 0; i < elementTypes.length; i++) {
			const elementType = elementTypes[i];

			assert(elementType !== undefined, `Element type at index ${i} is undefined`);
			assert(elementType.ref !== null, `Element type at index ${i} is null`);

			elementTypesView[i] = BigInt(elementType.ref);
		}

		const structTypeRef = ffi.LLVMStructType(elementTypesView, elementTypes.length, isPacked);

		assert(structTypeRef !== null, "Failed to create struct type with elements");

		return new StructType(structTypeRef);
	}

	/**
	 * Get the number of elements in this struct.
	 *
	 * @returns The number of elements
	 */
	getNumElements(): number {
		return ffi.LLVMCountStructElementTypes(this.ref);
	}

	/**
	 * Get the name of this struct.
	 *
	 * @returns The name of the struct
	 */
	getName(): string {
		const namePtr = ffi.LLVMGetStructName(this.ref);
		assert(namePtr !== null, "Failed to get struct name");

		return namePtr.toString();
	}

	/**
	 * Get an element type by index.
	 *
	 * @param i The element index
	 * @returns The element type
	 */
	getElementType(i: number): Type {
		const numElements = this.getNumElements();
		assert(i >= 0 && i < numElements, `Element index ${i} out of range (0-${numElements - 1})`);

		const elementTypeRef = ffi.LLVMStructGetTypeAtIndex(this.ref, i);
		assert(elementTypeRef !== null, `Failed to get element type at index ${i}`);

		return new Type(elementTypeRef);
	}

	/**
	 * Get all element types of this struct.
	 *
	 * @returns Array of element types
	 */
	getElementTypes(): Type[] {
		const numElements = this.getNumElements();
		if (numElements === 0) {
			return [];
		}

		// Create a buffer to hold the element types
		const elementTypesBuffer = new ArrayBuffer(numElements * 8); // 8 bytes per pointer
		const elementTypesView = new BigUint64Array(elementTypesBuffer);

		// Get all element types
		ffi.LLVMGetStructElementTypes(this.ref, elementTypesView);

		// Convert to Type array
		const elementTypes: Type[] = [];
		for (let i = 0; i < numElements; i++) {
			const elementTypeRef = elementTypesView[i];
			assert(elementTypeRef !== null, `Failed to get element type at index ${i}`);
			elementTypes.push(new Type(Number(elementTypeRef) as LLVMTypeRef));
		}

		return elementTypes;
	}

	/**
	 * Check if this struct is packed.
	 *
	 * @returns True if the struct is packed
	 */
	isPacked(): boolean {
		return ffi.LLVMIsPackedStruct(this.ref);
	}

	/**
	 * Check if this struct is opaque.
	 *
	 * @returns True if the struct is opaque
	 */
	isOpaque(): boolean {
		return ffi.LLVMIsOpaqueStruct(this.ref);
	}

	/**
	 * Check if this struct is literal.
	 *
	 * @returns True if the struct is literal
	 */
	isLiteral(): boolean {
		return ffi.LLVMIsLiteralStruct(this.ref);
	}

	/**
	 * Methods for support type inquiry through isa, cast, and dyn_cast.
	 *
	 * @param type The type to check
	 * @returns True if the type is a StructType
	 */
	static isStructType(type: Type): boolean {
		return type.isStructTy();
	}
}
