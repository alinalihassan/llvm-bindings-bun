import { ffi } from "@/ffi";
import { assert } from "@/utils";
import { BasicBlock } from "./BasicBlock";
import type { LLVMFunction } from "./Function";
import type { Module } from "./Module";
import { User } from "./User";

/**
 * Represents an instruction in LLVM IR
 * Based on LLVM's Instruction class from Instruction.h
 * This is the base class for all of the LLVM instructions.
 */
export class Instruction extends User {
	/**
	 * Get the parent basic block of this instruction.
	 * @returns The parent basic block, or null if not in a basic block
	 */
	public getParent(): BasicBlock {
		const parentRef = ffi.symbols.LLVMGetInstructionParent(this.ref);
		assert(parentRef !== null, "Failed to get instruction parent");

		return new BasicBlock(parentRef);
	}

	/**
	 * Get the module that contains this instruction.
	 * @returns The parent module, or null if not in a module
	 */
	public getModule(): Module | null {
		// TODO: Not implemented yet - need to traverse up to module
		throw new Error("Instruction.getModule not implemented yet");
	}

	/**
	 * Get the function that contains this instruction.
	 * @returns The parent function, or null if not in a function
	 */
	public getFunction(): LLVMFunction | null {
		// TODO: Not implemented yet - need to traverse up to function
		throw new Error("Instruction.getFunction not implemented yet");
	}

	/**
	 * Get the opcode of this instruction.
	 * @returns The opcode
	 */
	public getOpcode(): number {
		return ffi.symbols.LLVMGetInstructionOpcode(this.ref);
	}

	/**
	 * Get the next instruction in the same basic block.
	 * @returns The next instruction, or null if this is the last instruction
	 */
	public getNextInstruction(): Instruction | null {
		const nextRef = ffi.symbols.LLVMGetNextInstruction(this.ref);
		if (nextRef === null) {
			return null;
		}

		return new Instruction(nextRef);
	}

	/**
	 * Get the previous instruction in the same basic block.
	 * @returns The previous instruction, or null if this is the first instruction
	 */
	public getPreviousInstruction(): Instruction | null {
		const prevRef = ffi.symbols.LLVMGetPreviousInstruction(this.ref);
		if (prevRef === null) {
			return null;
		}

		return new Instruction(prevRef);
	}

	/**
	 * Remove an instruction.
	 *
	 * The instruction specified is removed from its containing building
	 * block but is kept alive.
	 */
	public removeFromParent(): void {
		ffi.symbols.LLVMInstructionRemoveFromParent(this.ref);
	}

	/**
	 * Remove and delete an instruction.
	 *
	 * The instruction specified is removed from its containing building
	 * block and then deleted.
	 */
	public eraseFromParent(): void {
		ffi.symbols.LLVMInstructionEraseFromParent(this.ref);
	}

	/**
	 * Delete an instruction.
	 *
	 * The instruction specified is deleted. It must have previously been
	 * removed from its containing building block.
	 */
	public deleteFromParent(): void {
		ffi.symbols.LLVMDeleteInstruction(this.ref);
	}

	/**
	 * Clone this instruction.
	 * @returns A clone of this instruction
	 */
	public clone(): Instruction {
		const cloneRef = ffi.symbols.LLVMInstructionClone(this.ref);
		assert(cloneRef !== null, "Failed to clone instruction");

		return new Instruction(cloneRef);
	}

	/**
	 * Get the number of successor basic blocks.
	 * @returns The number of successors
	 */
	public getNumSuccessors(): number {
		const numSuccessorsRef = ffi.symbols.LLVMGetNumSuccessors(this.ref);
		assert(numSuccessorsRef !== null, "Failed to get number of successors");

		return numSuccessorsRef;
	}

	/**
	 * Get a successor basic block by index.
	 * @param index The index of the successor
	 * @returns The successor basic block
	 */
	public getSuccessor(i: number): BasicBlock {
		const successorRef = ffi.symbols.LLVMGetSuccessor(this.ref, i);
		assert(successorRef !== null, `Failed to get successor at index ${i}`);

		return new BasicBlock(successorRef);
	}

	/**
	 * Set a successor basic block by index.
	 * @param index The index of the successor
	 * @param successor The successor basic block
	 */
	public setSuccessor(i: number, successor: BasicBlock): void {
		ffi.symbols.LLVMSetSuccessor(this.ref, i, successor.ref);
	}

	/**
	 * Determine whether an instruction is a terminator. This routine is named to
	 * be compatible with historical functions that did this by querying the
	 * underlying C++ type.
	 */
	public isTerminator(): boolean {
		const terminatorRef = ffi.symbols.LLVMIsATerminatorInst(this.ref);
		assert(terminatorRef !== null, "Failed to check if instruction is a terminator");

		return terminatorRef;
	}
}
