import { ffi } from "@/ffi";
import type { LLVMBasicBlockRef } from "@/utils";
import { assert, cstring } from "@/utils";
import { LLVMFunction } from "./Function";
import { Instruction } from "./Instruction";
import type { LLVMContext } from "./LLVMContext";
import { Value } from "./Value";

/**
 * Represents a basic block in LLVM IR
 * Based on LLVM's BasicBlock class from BasicBlock.h
 * A basic block is a container of instructions that execute sequentially.
 * Basic blocks are Values because they are referenced by instructions such as branches.
 */
export class BasicBlock extends Value {
	/**
	 * Create a new basic block.
	 * @param context The LLVM context
	 * @param name Optional name for the basic block
	 * @param parent Optional parent function
	 * @param insertBefore Optional basic block to insert before
	 * @returns A new BasicBlock instance
	 */
	public static Create(
		context: LLVMContext,
		name?: string,
		parent?: LLVMFunction,
		insertBefore?: BasicBlock,
	): BasicBlock {
		let ref: LLVMBasicBlockRef;

		if (parent && insertBefore) {
			// Insert before a specific basic block
			ref = ffi.symbols.LLVMInsertBasicBlockInContext(
				context.ref,
				insertBefore.ref,
				cstring(name ?? ""),
			);
		} else if (parent) {
			// Insert at the end of the function
			ref = ffi.symbols.LLVMAppendBasicBlockInContext(context.ref, parent.ref, cstring(name ?? ""));
		} else {
			// Create standalone basic block
			ref = ffi.symbols.LLVMCreateBasicBlockInContext(context.ref, cstring(name ?? ""));
		}

		assert(ref !== null, "Failed to create basic block");

		return new BasicBlock(ref);
	}

	/**
	 * Get the parent function of this basic block.
	 * @returns The parent function, or null if not in a function
	 */
	public getParent(): LLVMFunction | null {
		const parentRef = ffi.symbols.LLVMGetBasicBlockParent(this.ref);
		assert(parentRef !== null, "Failed to get basic block parent");

		return new LLVMFunction(parentRef);
	}

	/**
	 * Get the terminator instruction of this basic block.
	 * @returns The terminator instruction, or null if no terminator
	 */
	public getTerminator(): Instruction | null {
		const terminatorRef = ffi.symbols.LLVMGetBasicBlockTerminator(this.ref);

		return terminatorRef ? new Instruction(terminatorRef) : null;
	}

	/**
	 * Get the first non-PHI instruction in this basic block.
	 * @returns The first non-PHI instruction, or null if none
	 */
	public getFirstNonPHI(): Instruction | null {
		// TODO: Not implemented yet - need to iterate through instructions
		throw new Error("BasicBlock.getFirstNonPHI not implemented yet");
	}

	/**
	 * Insert this basic block into a function.
	 * @param parent The parent function
	 * @param insertBefore Optional basic block to insert before
	 */
	public insertInto(parent: LLVMFunction, insertBefore?: BasicBlock): void {
		assert(parent !== null, "Parent function cannot be null");
		if (insertBefore) {
			assert(insertBefore !== null, "Insert before basic block cannot be null");
			ffi.symbols.LLVMMoveBasicBlockBefore(this.ref, insertBefore.ref);
		} else {
			// Insert at the end of the function
			ffi.symbols.LLVMMoveBasicBlockAfter(this.ref, parent.ref);
		}
	}

	/**
	 * Unlink this basic block from its parent function, but do not delete it.
	 */
	public removeFromParent(): void {
		ffi.symbols.LLVMRemoveBasicBlockFromParent(this.ref);
	}

	/**
	 * Erase this basic block from its parent function and delete it.
	 */
	public eraseFromParent(): void {
		ffi.symbols.LLVMDeleteBasicBlock(this.ref);
	}

	/**
	 * Delete this basic block.
	 * This is an alias for eraseFromParent() for convenience.
	 */
	public deleteSelf(): void {
		this.eraseFromParent();
	}

	/**
	 * Get the first instruction in this basic block.
	 * @returns The first instruction, or null if empty
	 */
	public getFirstInstruction(): Instruction | null {
		const firstRef = ffi.symbols.LLVMGetFirstInstruction(this.ref);

		return firstRef ? new Instruction(firstRef) : null;
	}

	/**
	 * Get the last instruction in this basic block.
	 * @returns The last instruction, or null if empty
	 */
	public getLastInstruction(): Instruction | null {
		const lastRef = ffi.symbols.LLVMGetLastInstruction(this.ref);

		return lastRef ? new Instruction(lastRef) : null;
	}

	/**
	 * Get the next basic block in the function.
	 * @returns The next basic block, or null if this is the last one
	 */
	public getNextBasicBlock(): BasicBlock | null {
		const nextRef = ffi.symbols.LLVMGetNextBasicBlock(this.ref);

		return nextRef ? new BasicBlock(nextRef) : null;
	}

	/**
	 * Get the previous basic block in the function.
	 * @returns The previous basic block, or null if this is the first one
	 */
	public getPreviousBasicBlock(): BasicBlock | null {
		const prevRef = ffi.symbols.LLVMGetPreviousBasicBlock(this.ref);

		return prevRef ? new BasicBlock(prevRef) : null;
	}
}
