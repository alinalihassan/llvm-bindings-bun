import type { LLVMFunction } from "./Function";
import type { FunctionType } from "./FunctionType";

/**
 * A handy container for a FunctionType+Callee-pointer pair, which can be
 * passed around as a single entity. This assists in replacing the use of
 * PointerType::getElementType() to access the function's type, since that's
 * slated for removal as part of the [opaque pointer types] project.
 */
export class FunctionCallee {
	private _functionType: FunctionType;
	private _callee: LLVMFunction;

	/**
	 * Construct a FunctionCallee from a function type and callee value.
	 *
	 * @param functionType The function type
	 * @param callee The callee value (function pointer)
	 */
	constructor(functionType: FunctionType, callee: LLVMFunction) {
		this._functionType = functionType;
		this._callee = callee;
	}

	/**
	 * Get the function type.
	 *
	 * @returns The function type
	 */
	getFunctionType(): FunctionType {
		return this._functionType;
	}

	/**
	 * Get the callee value.
	 *
	 * @returns The callee value
	 */
	getCallee(): LLVMFunction {
		return this._callee;
	}
}
