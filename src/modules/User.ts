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
		const operandRef = ffi.LLVMGetOperand(this.ref, i);
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

		ffi.LLVMSetOperand(this.ref, i, value.ref);
	}

	/**
	 * Get the number of operands this User has
	 * @returns The number of operands
	 */
	public getNumOperands(): number {
		return ffi.LLVMGetNumOperands(this.ref);
	}

	/**
	 * Replace all uses of one value with another value
	 * @param from The value to replace
	 * @param to The value to replace with
	 * @returns True if any replacements were made
	 */
	public replaceUsesOfWith(from: Value, to: Value): boolean {
		assert(from.ref !== null, "Cannot replace with null 'from' value");
		assert(to.ref !== null, "Cannot replace with null 'to' value");

		if (from.ref === to.ref) {
			return false; // No change needed
		}

		// Check if this is a constant - constants cannot have their uses replaced
		// This is a safety check based on the LLVM implementation
		assert(this.isConstant(), "Cannot call replaceUsesOfWith on a constant!");

		let changed = false;
		const numOperands = this.getNumOperands();

		for (let i = 0; i < numOperands; i++) {
			const operand = this.getOperand(i);
			if (operand.ref === from.ref) {
				this.setOperand(i, to);
				changed = true;
			}
		}

		return changed;
	}

	/**
	 * Check if this User is a constant
	 * @returns True if the User is a constant
	 */
	public isConstant(): boolean {
		return ffi.LLVMIsConstant(this.ref) !== 0;
	}
}
