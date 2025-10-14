import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import { Type } from "@/modules/Type";
import type { PointerType } from "@/modules/types/PointerType";
import { assert } from "@/utils";

/**
 * Represents a global value in LLVM IR
 * Based on LLVM's GlobalValue class from GlobalValue.h
 * This is a common base class for all globally definable objects like GlobalVariable, GlobalAlias, and Function
 */
export class GlobalValue extends Constant {
	/**
	 * An enumeration for the kinds of linkage for global values.
	 * Based on LLVM's LinkageTypes enum
	 */
	public static readonly LinkageTypes = {
		ExternalLinkage: 0, ///< Externally visible function
		AvailableExternallyLinkage: 1, ///< Available for inspection, not emission
		LinkOnceAnyLinkage: 2, ///< Keep one copy of function when linking (inline)
		LinkOnceODRLinkage: 3, ///< Same, but only replaced by something equivalent
		WeakAnyLinkage: 4, ///< Keep one copy of named function when linking (weak)
		WeakODRLinkage: 5, ///< Same, but only replaced by something equivalent
		AppendingLinkage: 6, ///< Special purpose, only applies to global arrays
		InternalLinkage: 7, ///< Rename collisions when linking (static functions)
		PrivateLinkage: 8, ///< Like Internal, but omit from symbol table
		ExternalWeakLinkage: 9, ///< ExternalWeak linkage description
		CommonLinkage: 10, ///< Tentative definitions
	} as const;

	/**
	 * An enumeration for the kinds of visibility of global values.
	 * Based on LLVM's VisibilityTypes enum
	 */
	public static readonly VisibilityTypes = {
		DefaultVisibility: 0, ///< The GV is visible
		HiddenVisibility: 1, ///< The GV is hidden
		ProtectedVisibility: 2, ///< The GV is protected
	} as const;

	/**
	 * Get the type of this global value.
	 * (Duplicated from Value as requested by the user for explicit API)
	 * @returns The PointerType of this global value
	 */
	public override getType(): PointerType {
		return super.getType() as PointerType;
	}

	/**
	 * Get the value type of this global value.
	 * This returns the type of the value that this global value points to.
	 * @returns The Type of the value this global value points to
	 */
	public getValueType(): Type {
		const typeRef = ffi.LLVMGlobalGetValueType(this.ref);
		assert(typeRef !== null, "Failed to get global value type");

		return new Type(typeRef);
	}

	public getAlignment(): number {
		return ffi.LLVMGetAlignment(this.ref);
	}

	public setAlignment(alignment: number): void {
		ffi.LLVMSetAlignment(this.ref, alignment);
	}
}
