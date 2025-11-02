import type { Pointer } from "bun:ffi";
import { ffi } from "@/ffi";
import type { LLVMContext } from "@/modules/LLVMContext";
import { Value } from "@/modules/Value";
import type { LLVMMetadataRef } from "@/utils";
import { assert, cstring } from "@/utils";

/**
 * Represents metadata in LLVM IR
 * Metadata is used for debugging information, optimization hints, and other annotations
 */
export class Metadata {
	private _ref: LLVMMetadataRef;

	/** @internal */
	public constructor(ref: LLVMMetadataRef) {
		this._ref = ref;
	}

	/**
	 * Get the underlying LLVM Metadata reference
	 */
	get ref(): LLVMMetadataRef {
		return this._ref;
	}

	//===--------------------------------------------------------------------===//
	// Static Factory Methods
	//===--------------------------------------------------------------------===//

	/**
	 * Create an MDString (metadata string) value
	 * @param context The LLVM context
	 * @param str The string value
	 * @returns A new Metadata instance representing the string
	 */
	static createMDString(context: LLVMContext, str: string): Metadata {
		const mdRef = ffi.LLVMMDStringInContext2(context.ref, cstring(str), str.length);
		assert(mdRef !== null, "Failed to create MDString");
		return new Metadata(mdRef);
	}

	/**
	 * Create an MDNode with the given array of metadata operands
	 * @param context The LLVM context
	 * @param operands Array of Metadata operands
	 * @returns A new Metadata instance representing the node
	 */
	static createMDNode(context: LLVMContext, operands: Metadata[]): Metadata {
		const operandRefs = new BigUint64Array(operands.length);
		for (let i = 0; i < operands.length; i++) {
			operandRefs[i] = BigInt(operands[i]!.ref as unknown as number);
		}

		const mdRef = ffi.LLVMMDNodeInContext2(context.ref, operandRefs, operands.length);
		assert(mdRef !== null, "Failed to create MDNode");
		return new Metadata(mdRef);
	}

	/**
	 * Create metadata from a Value
	 * @param value The value to convert to metadata
	 * @returns A new Metadata instance
	 */
	static fromValue(value: Value): Metadata {
		const mdRef = ffi.LLVMValueAsMetadata(value.ref);
		assert(mdRef !== null, "Failed to create metadata from value");
		return new Metadata(mdRef);
	}

	//===--------------------------------------------------------------------===//
	// Instance Methods
	//===--------------------------------------------------------------------===//

	/**
	 * Convert this metadata to a Value
	 * @param context The LLVM context
	 * @returns A Value representation of this metadata
	 */
	toValue(context: LLVMContext): Value {
		const valueRef = ffi.LLVMMetadataAsValue(context.ref, this._ref);
		assert(valueRef !== null, "Failed to convert metadata to value");
		return new Value(valueRef);
	}

	/**
	 * Get the string from an MDString value
	 * @param context The LLVM context (needed to convert to value first)
	 * @returns The string content, or null if not an MDString
	 */
	getString(context: LLVMContext): string | null {
		try {
			const value = this.toValue(context);
			const lengthBuffer = new Uint32Array(1);
			const strPtr = ffi.LLVMGetMDString(value.ref, lengthBuffer);
			return strPtr ? strPtr.toString() : null;
		} catch {
			return null;
		}
	}

	/**
	 * Get the number of operands in an MDNode
	 * @param context The LLVM context (needed to convert to value first)
	 * @returns The number of operands
	 */
	getNumOperands(context: LLVMContext): number {
		const value = this.toValue(context);
		return ffi.LLVMGetMDNodeNumOperands(value.ref);
	}

	/**
	 * Get the operands from an MDNode
	 * @param context The LLVM context (needed to convert to value first)
	 * @returns Array of Value operands
	 */
	getOperands(context: LLVMContext): Value[] {
		const value = this.toValue(context);
		const numOperands = ffi.LLVMGetMDNodeNumOperands(value.ref);

		if (numOperands === 0) {
			return [];
		}

		const destBuffer = new BigUint64Array(numOperands);
		ffi.LLVMGetMDNodeOperands(value.ref, destBuffer);

		const operands: Value[] = [];
		for (let i = 0; i < numOperands; i++) {
			const valueRef = Number(destBuffer[i]) as unknown as Pointer;
			operands.push(new Value(valueRef));
		}

		return operands;
	}

	/**
	 * Replace an operand at a specific index in an MDNode
	 * @param context The LLVM context
	 * @param index The index of the operand to replace
	 * @param replacement The replacement metadata
	 */
	replaceOperandWith(context: LLVMContext, index: number, replacement: Metadata): void {
		const value = this.toValue(context);
		ffi.LLVMReplaceMDNodeOperandWith(value.ref, index, replacement.ref);
	}
}
