import { ffi } from "@/ffi";
import { assert } from "@/utils";
import { Value } from "./Value";

/**
 * Represents a User in LLVM IR
 * A User is a Value that can have operands (other Values)
 * This includes instructions, constants, and other values that use other values
 */
export class User extends Value {
	/**
	 * Get the operand at the specified index
	 * @param i The index of the operand to retrieve
	 * @returns The Value at the specified operand index
	 */
	public getOperand(i: number): Value {
		const operandRef = ffi.symbols.LLVMGetOperand(this.ref, i);
		assert(operandRef !== null, `Failed to get operand at index ${i}`);

		return new Value(operandRef);
	}

	/**
	 * Set the operand at the specified index to the given value
	 * @param i The index of the operand to set
	 * @param value The Value to set as the operand
	 */
	public setOperand(i: number, value: Value): void {
		assert(value.ref !== null, "Cannot set operand to null value");

		ffi.symbols.LLVMSetOperand(this.ref, i, value.ref);
	}

	/**
	 * Get the number of operands this User has
	 * @returns The number of operands
	 */
	public getNumOperands(): number {
		return ffi.symbols.LLVMGetNumOperands(this.ref);
	}
}
