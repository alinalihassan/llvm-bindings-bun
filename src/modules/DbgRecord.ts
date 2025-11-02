import { ffi } from "@/ffi";
import type { LLVMDbgRecordRef } from "@/utils";
import { assert } from "@/utils";

/**
 * Represents a debug record in LLVM IR
 * Debug records are used to attach debugging information to instructions
 */
export class DbgRecord {
	private _ref: LLVMDbgRecordRef;

	/** @internal */
	public constructor(ref: LLVMDbgRecordRef) {
		this._ref = ref;
	}

	/**
	 * Get the underlying LLVM DbgRecord reference
	 */
	get ref(): LLVMDbgRecordRef {
		return this._ref;
	}

	/**
	 * Get a string representation of this debug record
	 * @returns A string representation of the debug record
	 */
	toString(): string {
		const strPtr = ffi.LLVMPrintDbgRecordToString(this._ref);
		assert(strPtr !== null, "Failed to print DbgRecord to string");

		const result = strPtr.toString();

		// Free the string allocated by LLVM
		ffi.LLVMDisposeMessage(strPtr);

		return result;
	}
}
