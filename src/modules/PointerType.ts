import { ffi } from "@/ffi";
import { assert } from "@/utils";
import { Type } from "./Type";

/**
 * Class to represent pointer types
 */
export class PointerType extends Type {
	/**
	 * This static method is the primary way of constructing a PointerType.
	 *
	 * @param elementType The type that the pointer points to
	 * @param addressSpace The address space (default: 0)
	 * @returns A PointerType instance
	 */
	static get(elementType: Type, addressSpace: number = 0): PointerType {
		if (addressSpace < 0) {
			throw new Error("Address space must be non-negative");
		}

		const pointerTypeRef = ffi.LLVMPointerType(elementType.ref, addressSpace);
		if (pointerTypeRef === null) {
			throw new Error("Failed to create pointer type");
		}

		return new PointerType(pointerTypeRef);
	}

	/**
	 * Get the element type that this pointer points to.
	 *
	 * @returns The element type
	 */
	getElementType(): Type {
		const elementTypeRef = ffi.LLVMGetElementType(this.ref);
		assert(elementTypeRef !== null, "Failed to get element type from pointer type");

		return new Type(elementTypeRef);
	}

	/**
	 * Get the address space of this pointer.
	 *
	 * @returns The address space
	 */
	getAddressSpace(): number {
		return ffi.LLVMGetPointerAddressSpace(this.ref);
	}

	/**
	 * Check if this pointer type is opaque.
	 *
	 * @returns True if the pointer type is opaque
	 */
	isOpaque(): boolean {
		return ffi.LLVMPointerTypeIsOpaque(this.ref);
	}
}
