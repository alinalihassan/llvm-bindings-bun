import { ffi } from "@/ffi";
import type { LLVMContext } from "@/modules/LLVMContext";
import { Type } from "@/modules/Type";
import { assert } from "@/utils";

/**
 * Class to represent pointer types
 */
export class PointerType extends Type {
	/**
	 * Creates an opaque pointer type in the given context.
	 *
	 * In LLVM 15+, all pointers are opaque and don't have element types.
	 * This is the primary way to create pointer types.
	 *
	 * @param context The LLVM context
	 * @param addressSpace The address space (default: 0)
	 * @returns A PointerType instance
	 */
	static get(context: LLVMContext, addressSpace: number = 0): PointerType {
		assert(addressSpace >= 0, "Address space must be non-negative");

		const pointerTypeRef = ffi.LLVMPointerTypeInContext(context.ref, addressSpace);

		assert(pointerTypeRef !== null, "Failed to create pointer type");

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
