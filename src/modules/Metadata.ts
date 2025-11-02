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
	private _isTemporary: boolean;

	/** @internal */
	public constructor(ref: LLVMMetadataRef, isTemporary = false) {
		this._ref = ref;
		this._isTemporary = isTemporary;
	}

	/**
	 * Get the underlying LLVM Metadata reference
	 */
	get ref(): LLVMMetadataRef {
		return this._ref;
	}

	/**
	 * Check if this is a temporary metadata node
	 */
	get isTemporary(): boolean {
		return this._isTemporary;
	}

	//===--------------------------------------------------------------------===//
	// Static Factory Methods
	//===--------------------------------------------------------------------===//

	/**
	 * Get the metadata kind ID for a given metadata kind name in a context
	 * Note: Returns a number that may be outside the LLVMMetadataKind enum for custom kinds.
	 * Cast to LLVMMetadataKind if needed: `getMDKindID(ctx, "custom") as LLVMMetadataKind`
	 * @param context The LLVM context
	 * @param name The name of the metadata kind (e.g., "dbg", "tbaa", "prof")
	 * @returns The metadata kind ID (number)
	 */
	static getMDKindID(context: LLVMContext, name: string): number {
		return ffi.LLVMGetMDKindIDInContext(context.ref, cstring(name), name.length);
	}

	/**
	 * Get the global metadata kind ID for a given metadata kind name
	 * Note: Returns a number that may be outside the LLVMMetadataKind enum for custom kinds.
	 * Cast to LLVMMetadataKind if needed: `getMDKindIDGlobal("custom") as LLVMMetadataKind`
	 * @param name The name of the metadata kind (e.g., "dbg", "tbaa", "prof")
	 * @returns The metadata kind ID (number)
	 */
	static getMDKindIDGlobal(name: string): number {
		return ffi.LLVMGetMDKindID(cstring(name), name.length);
	}

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
			const operand = operands[i];
			assert(operand !== undefined, `Operand at index ${i} is undefined`);
			operandRefs[i] = BigInt(operand.ref as unknown as number);
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

	/**
	 * Create a temporary MDNode that can be mutated
	 * Useful when building debug info that has forward references
	 * @param context The LLVM context
	 * @param operands Array of Metadata operands
	 * @returns A new temporary Metadata instance (must call dispose() when done)
	 */
	static createTemporaryMDNode(context: LLVMContext, operands: Metadata[]): Metadata {
		const operandRefs = new BigUint64Array(operands.length);
		for (let i = 0; i < operands.length; i++) {
			const operand = operands[i];
			assert(operand !== undefined, `Operand at index ${i} is undefined`);
			operandRefs[i] = BigInt(operand.ref as unknown as number);
		}

		const mdRef = ffi.LLVMTemporaryMDNode(context.ref, operandRefs, operands.length);
		assert(mdRef !== null, "Failed to create temporary MDNode");
		return new Metadata(mdRef, true); // Mark as temporary
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

	/**
	 * Dispose of a temporary metadata node
	 *
	 * ⚠️ IMPORTANT:
	 * - ONLY call on nodes created with createTemporaryMDNode()
	 * - Calling dispose() on non-temporary metadata is a no-op (safe)
	 * - Calling dispose() multiple times is safe (no-op after first call)
	 */
	dispose(): void {
		// Only dispose if this is a temporary node and hasn't been disposed yet
		if (this._ref && this._isTemporary) {
			ffi.LLVMDisposeTemporaryMDNode(this._ref);
			this._ref = null; // Prevent double-free
		}

		// Non-temporary metadata: no-op (context owns the memory)
	}

	/**
	 * Check if this metadata is an MDNode
	 * @param context The LLVM context
	 * @returns true if this is an MDNode
	 */
	isMDNode(context: LLVMContext): boolean {
		try {
			const value = this.toValue(context);
			const result = ffi.LLVMIsAMDNode(value.ref);
			return result !== null;
		} catch {
			return false;
		}
	}

	/**
	 * Check if this metadata is an MDString
	 * @param context The LLVM context
	 * @returns true if this is an MDString
	 */
	isMDString(context: LLVMContext): boolean {
		try {
			const value = this.toValue(context);
			const result = ffi.LLVMIsAMDString(value.ref);
			return result !== null;
		} catch {
			return false;
		}
	}
}
