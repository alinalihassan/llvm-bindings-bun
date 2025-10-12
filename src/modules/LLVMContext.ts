import { ffi } from "@/ffi";
import { assert, type LLVMContextRef } from "@/utils";

export class LLVMContext {
	private _ref: LLVMContextRef;

	constructor(ref?: LLVMContextRef) {
		if (ref) {
			this._ref = ref;
		} else {
			const result = ffi.LLVMContextCreate();
			assert(result !== null, "Failed to create LLVM context");

			this._ref = result;
		}
	}

	/**
	 * Get the underlying LLVM context reference
	 */
	get ref(): LLVMContextRef {
		return this._ref;
	}

	/**
	 * Dispose of the context and free its memory
	 */
	private dispose(): void {
		if (this._ref !== 0 && this._ref !== null) {
			ffi.LLVMContextDispose(this._ref);
			this._ref = null; // Set to null after disposal
		}
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}
