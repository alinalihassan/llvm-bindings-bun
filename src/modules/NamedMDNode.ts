import { ffi } from "@/ffi";
import type { LLVMNamedMDNodeRef } from "@/utils";
import { assert } from "@/utils";

/**
 * Represents a named metadata node in LLVM IR
 * Named metadata nodes are used to attach metadata to a module
 */
export class NamedMDNode {
	private _ref: LLVMNamedMDNodeRef;

	/** @internal */
	public constructor(ref: LLVMNamedMDNodeRef) {
		this._ref = ref;
	}

	/**
	 * Get the underlying LLVM NamedMDNode reference
	 */
	get ref(): LLVMNamedMDNodeRef {
		return this._ref;
	}

	/**
	 * Get the name of this named metadata node
	 * @returns The name of the named metadata node
	 */
	public getName(): string {
		const lengthBuffer = new Uint32Array(1);
		const namePtr = ffi.LLVMGetNamedMetadataName(this._ref, lengthBuffer);
		assert(namePtr !== null, "Failed to get named metadata name");

		return namePtr.toString();
	}

	/**
	 * Get the next named metadata node in the module
	 * @returns The next named metadata node, or null if this is the last one
	 */
	public getNext(): NamedMDNode | null {
		const nextRef = ffi.LLVMGetNextNamedMetadata(this._ref);
		return nextRef ? new NamedMDNode(nextRef) : null;
	}

	/**
	 * Get the previous named metadata node in the module
	 * @returns The previous named metadata node, or null if this is the first one
	 */
	public getPrevious(): NamedMDNode | null {
		const prevRef = ffi.LLVMGetPreviousNamedMetadata(this._ref);
		return prevRef ? new NamedMDNode(prevRef) : null;
	}
}
