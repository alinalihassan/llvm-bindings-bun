import { ffi } from "@/ffi";
import { assert, type LLVMTypeRef } from "@/utils";
import { Type } from "./Type";

/**
 * Class to represent function types
 */
export class FunctionType extends Type {
	/**
	 * This static method is the primary way of constructing a FunctionType.
	 *
	 * @param returnType The return type of the function
	 * @param paramTypes Array of parameter types
	 * @param isVarArg Whether the function takes variable arguments
	 * @returns A FunctionType instance
	 */
	static get(returnType: Type, paramTypes: Type[] = [], isVarArg: boolean = false): FunctionType {
		if (paramTypes.length === 0) {
			const functionTypeRef = ffi.LLVMFunctionType(returnType.ref, null, 0, isVarArg);
			assert(functionTypeRef !== null, "Failed to create function type");

			return new FunctionType(functionTypeRef);
		}

		// Create a buffer to hold the parameter type references
		const paramTypesBuffer = new ArrayBuffer(paramTypes.length * 8); // 8 bytes per pointer
		const paramTypesView = new BigUint64Array(paramTypesBuffer);

		// Fill the buffer with parameter type references
		for (let i = 0; i < paramTypes.length; i++) {
			const paramType = paramTypes[i];

			assert(paramType !== undefined, `Parameter type at index ${i} is undefined`);
			assert(paramType.ref !== null, `Parameter type at index ${i} is null`);

			paramTypesView[i] = BigInt(paramType.ref);
		}

		const functionTypeRef = ffi.LLVMFunctionType(
			returnType.ref,
			paramTypesView,
			paramTypes.length,
			isVarArg,
		);

		assert(functionTypeRef !== null, "Failed to create function type with parameters");

		return new FunctionType(functionTypeRef);
	}

	/**
	 * Check if this function type is variadic.
	 *
	 * @returns True if the function takes variable arguments
	 */
	isVarArg(): boolean {
		return ffi.LLVMIsFunctionVarArg(this.ref);
	}

	/**
	 * Get the return type of this function.
	 *
	 * @returns The return type
	 */
	getReturnType(): Type {
		return new Type(ffi.LLVMGetReturnType(this.ref));
	}

	/**
	 * Get the number of fixed parameters this function type requires.
	 * This does not consider varargs.
	 *
	 * @returns The number of parameters
	 */
	getNumParams(): number {
		return ffi.LLVMCountParamTypes(this.ref);
	}

	/**
	 * Get a parameter type by index.
	 *
	 * @param i The parameter index
	 * @returns The parameter type
	 */
	getParamType(i: number): Type {
		const numParams = this.getNumParams();
		assert(i >= 0 && i < numParams, `Parameter index ${i} out of range (0-${numParams - 1})`);

		// Create a buffer to hold the parameter types
		const paramTypesBuffer = new ArrayBuffer(numParams * 8); // 8 bytes per pointer
		const paramTypesView = new BigUint64Array(paramTypesBuffer);

		// Get all parameter types
		ffi.LLVMGetParamTypes(this.ref, paramTypesView);

		// Get the specific parameter type at index i
		const paramTypeRef = paramTypesView[i];
		assert(paramTypeRef !== null, `Failed to get parameter type at index ${i}`);

		return new Type(Number(paramTypeRef) as LLVMTypeRef);
	}
}
