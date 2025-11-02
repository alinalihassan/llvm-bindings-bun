import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import type { LLVMMetadataKind } from "@/modules/Enum";
import type { Metadata } from "@/modules/Metadata";
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

	//===--------------------------------------------------------------------===//
	// Global Metadata Methods
	//===--------------------------------------------------------------------===//

	/**
	 * Set metadata on this global value
	 * @param kindID The metadata kind ID (use LLVMMetadataKind enum)
	 * @param metadata The metadata to attach
	 */
	public setMetadata(kindID: LLVMMetadataKind, metadata: Metadata): void {
		ffi.LLVMGlobalSetMetadata(this.ref, kindID, metadata.ref);
	}

	/**
	 * Erase metadata of a specific kind from this global value
	 * @param kindID The metadata kind ID to erase (use LLVMMetadataKind enum)
	 */
	public eraseMetadata(kindID: LLVMMetadataKind): void {
		ffi.LLVMGlobalEraseMetadata(this.ref, kindID);
	}

	/**
	 * Clear all metadata from this global value
	 */
	public clearMetadata(): void {
		ffi.LLVMGlobalClearMetadata(this.ref);
	}
}
