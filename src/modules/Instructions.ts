import { ffi } from "@/ffi";
import type { BasicBlock } from "@/modules/BasicBlock";
import type { Constant } from "@/modules/Constant";
import type { ConstantInt } from "@/modules/constants/ConstantInt";
import { LLVMCmpInstOpcode, LLVMCmpInstPredicate } from "@/modules/Enum";
import { Instruction } from "@/modules/Instruction";
import { Type } from "@/modules/Type";
import { Value } from "@/modules/Value";
import { assert, type LLVMValueRef } from "@/utils";

/**
 * AllocaInst - Allocate memory on the stack
 * Based on LLVM's AllocaInst class
 */
export class AllocaInst extends Instruction {
	public getAlignment(): number {
		return ffi.LLVMGetAlignment(this.ref);
	}

	public setAlignment(alignment: number): void {
		ffi.LLVMSetAlignment(this.ref, alignment);
	}

	public getAllocatedType(): Type {
		const allocatedTypeRef = ffi.LLVMGetAllocatedType(this.ref);
		assert(allocatedTypeRef !== null, "Failed to get allocated type");

		return new Type(allocatedTypeRef);
	}

	/**
	 * Get the number of elements allocated. For a simple allocation of a single
	 * element, this will return a constant 1 value.
	 * @returns The number of elements allocated
	 */
	public getArraySize(): Value {
		return this.getOperand(0);
	}
}

/**
 * LoadInst - Load a value from memory
 * Based on LLVM's LoadInst class
 */
export class LoadInst extends Instruction {
	public getAlignment(): number {
		return ffi.LLVMGetAlignment(this.ref);
	}

	public setAlignment(alignment: number): void {
		ffi.LLVMSetAlignment(this.ref, alignment);
	}
}

/**
 * StoreInst - Store a value to memory
 * Based on LLVM's StoreInst class
 */
export class StoreInst extends Instruction {
	public getAlignment(): number {
		return ffi.LLVMGetAlignment(this.ref);
	}

	public setAlignment(alignment: number): void {
		ffi.LLVMSetAlignment(this.ref, alignment);
	}

	public getValueOperand(): Value {
		return this.getOperand(0);
	}

	public getPointerOperand(): Value {
		return this.getOperand(1);
	}

	public getPointerOperandType(): Type {
		return this.getOperand(1).getType();
	}
}

/**
 * FenceInst - Memory fence instruction
 * Based on LLVM's FenceInst class
 */
export class FenceInst extends Instruction {}

/**
 * AtomicCmpXchgInst - Atomic compare and exchange instruction
 * Based on LLVM's AtomicCmpXchgInst class
 */
export class AtomicCmpXchgInst extends Instruction {
	public getAlignment(): number {
		return ffi.LLVMGetAlignment(this.ref);
	}

	public setAlignment(alignment: number): void {
		ffi.LLVMSetAlignment(this.ref, alignment);
	}
}

/**
 * AtomicRMWInst - Atomic read-modify-write instruction
 * Based on LLVM's AtomicRMWInst class
 */
export class AtomicRMWInst extends Instruction {
	public getAlignment(): number {
		return ffi.LLVMGetAlignment(this.ref);
	}

	public setAlignment(alignment: number): void {
		ffi.LLVMSetAlignment(this.ref, alignment);
	}
}

/**
 * GetElementPtrInst - Get element pointer instruction
 * Based on LLVM's GetElementPtrInst class
 */
export class GetElementPtrInst extends Instruction {}

/**
 * CmpInst - Comparison instruction
 * Based on LLVM's CmpInst class
 * This is the base class for ICmpInst and FCmpInst
 */
export class CmpInst extends Instruction {
	protected predicate: LLVMCmpInstPredicate;
	protected lhs: Value;
	protected rhs: Value;
	protected name?: string;

	public constructor(
		valueRef: LLVMValueRef,
		predicate: LLVMCmpInstPredicate,
		lhs: Value,
		rhs: Value,
		name?: string,
	) {
		super(valueRef);
		this.predicate = predicate;
		this.lhs = lhs;
		this.rhs = rhs;
		this.name = name;
	}

	/**
	 * Get the predicate of this comparison instruction.
	 * @returns The comparison predicate
	 */
	public getPredicate(): LLVMCmpInstPredicate {
		return this.predicate;
	}

	/**
	 * Get the integer comparison predicate.
	 * This method should only be called on ICmpInst.
	 * @returns The integer comparison predicate
	 */
	public getICmpPredicate(): LLVMCmpInstPredicate {
		const predicateRef = ffi.LLVMGetICmpPredicate(this.ref);
		assert(predicateRef !== null, "Failed to get integer comparison predicate");
		return predicateRef as LLVMCmpInstPredicate;
	}

	/**
	 * Get the floating-point comparison predicate.
	 * This method should only be called on FCmpInst.
	 * @returns The floating-point comparison predicate
	 */
	public getFCmpPredicate(): LLVMCmpInstPredicate {
		const predicateRef = ffi.LLVMGetFCmpPredicate(this.ref);
		assert(predicateRef !== null, "Failed to get floating-point comparison predicate");
		return predicateRef as LLVMCmpInstPredicate;
	}

	/**
	 * Get the left-hand side operand.
	 * @returns The LHS operand
	 */
	public getLHS(): Value {
		return this.lhs;
	}

	/**
	 * Get the right-hand side operand.
	 * @returns The RHS operand
	 */
	public getRHS(): Value {
		return this.rhs;
	}

	/**
	 * Check if this is an integer comparison instruction.
	 * @returns True if this is an ICmpInst
	 */
	public isICmpInst(): boolean {
		return this.getOpcode() === LLVMCmpInstOpcode.ICmp;
	}

	/**
	 * Check if this is a floating-point comparison instruction.
	 * @returns True if this is an FCmpInst
	 */
	public isFCmpInst(): boolean {
		return this.getOpcode() === LLVMCmpInstOpcode.FCmp;
	}

	/**
	 * Check if the comparison is commutative.
	 * @returns True if the comparison is commutative
	 */
	public isCommutative(): boolean {
		const predicate = this.getPredicate();
		// Most comparison predicates are commutative
		if (this.isICmpInst()) {
			return (
				predicate !== LLVMCmpInstPredicate.IntSGT &&
				predicate !== LLVMCmpInstPredicate.IntSGE &&
				predicate !== LLVMCmpInstPredicate.IntSLT &&
				predicate !== LLVMCmpInstPredicate.IntSLE
			);
		} else if (this.isFCmpInst()) {
			return (
				predicate !== LLVMCmpInstPredicate.RealOGT &&
				predicate !== LLVMCmpInstPredicate.RealOGE &&
				predicate !== LLVMCmpInstPredicate.RealOLT &&
				predicate !== LLVMCmpInstPredicate.RealOLE
			);
		}
		return false;
	}

	/**
	 * Get the swapped predicate (for commutative operations).
	 * @returns The swapped predicate
	 */
	public getSwappedPredicate(): LLVMCmpInstPredicate {
		const predicate = this.getPredicate();

		// Handle integer predicates
		if (this.isICmpInst()) {
			switch (predicate) {
				case LLVMCmpInstPredicate.IntEQ:
				case LLVMCmpInstPredicate.IntNE:
					return predicate; // These are already commutative
				case LLVMCmpInstPredicate.IntUGT:
					return LLVMCmpInstPredicate.IntULT;
				case LLVMCmpInstPredicate.IntUGE:
					return LLVMCmpInstPredicate.IntULE;
				case LLVMCmpInstPredicate.IntULT:
					return LLVMCmpInstPredicate.IntUGT;
				case LLVMCmpInstPredicate.IntULE:
					return LLVMCmpInstPredicate.IntUGE;
				case LLVMCmpInstPredicate.IntSGT:
					return LLVMCmpInstPredicate.IntSLT;
				case LLVMCmpInstPredicate.IntSGE:
					return LLVMCmpInstPredicate.IntSLE;
				case LLVMCmpInstPredicate.IntSLT:
					return LLVMCmpInstPredicate.IntSGT;
				case LLVMCmpInstPredicate.IntSLE:
					return LLVMCmpInstPredicate.IntSGE;
			}
		}

		// Handle floating-point predicates
		if (this.isFCmpInst()) {
			switch (predicate) {
				case LLVMCmpInstPredicate.RealOEQ:
				case LLVMCmpInstPredicate.RealONE:
				case LLVMCmpInstPredicate.RealUEQ:
				case LLVMCmpInstPredicate.RealUNE:
					return predicate; // These are already commutative
				case LLVMCmpInstPredicate.RealOGT:
					return LLVMCmpInstPredicate.RealOLT;
				case LLVMCmpInstPredicate.RealOGE:
					return LLVMCmpInstPredicate.RealOLE;
				case LLVMCmpInstPredicate.RealOLT:
					return LLVMCmpInstPredicate.RealOGT;
				case LLVMCmpInstPredicate.RealOLE:
					return LLVMCmpInstPredicate.RealOGE;
				case LLVMCmpInstPredicate.RealUGT:
					return LLVMCmpInstPredicate.RealULT;
				case LLVMCmpInstPredicate.RealUGE:
					return LLVMCmpInstPredicate.RealULE;
				case LLVMCmpInstPredicate.RealULT:
					return LLVMCmpInstPredicate.RealUGT;
				case LLVMCmpInstPredicate.RealULE:
					return LLVMCmpInstPredicate.RealUGE;
			}
		}

		return predicate; // Return original if no swap needed
	}

	/**
	 * Check if this is a signed integer comparison.
	 * @returns True if this is a signed integer comparison
	 */
	public isSigned(): boolean {
		const predicate = this.getPredicate();
		return (
			predicate === LLVMCmpInstPredicate.IntSGT ||
			predicate === LLVMCmpInstPredicate.IntSGE ||
			predicate === LLVMCmpInstPredicate.IntSLT ||
			predicate === LLVMCmpInstPredicate.IntSLE
		);
	}

	/**
	 * Check if this is an unsigned integer comparison.
	 * @returns True if this is an unsigned integer comparison
	 */
	public isUnsigned(): boolean {
		const predicate = this.getPredicate();
		return (
			predicate === LLVMCmpInstPredicate.IntUGT ||
			predicate === LLVMCmpInstPredicate.IntUGE ||
			predicate === LLVMCmpInstPredicate.IntULT ||
			predicate === LLVMCmpInstPredicate.IntULE
		);
	}

	/**
	 * Check if this is an equality comparison.
	 * @returns True if this is an equality comparison
	 */
	public isEquality(): boolean {
		const predicate = this.getPredicate();
		return (
			predicate === LLVMCmpInstPredicate.IntEQ ||
			predicate === LLVMCmpInstPredicate.IntNE ||
			predicate === LLVMCmpInstPredicate.RealOEQ ||
			predicate === LLVMCmpInstPredicate.RealONE ||
			predicate === LLVMCmpInstPredicate.RealUEQ ||
			predicate === LLVMCmpInstPredicate.RealUNE
		);
	}

	/**
	 * Check if this is an ordered floating-point comparison.
	 * @returns True if this is an ordered floating-point comparison
	 */
	public isOrdered(): boolean {
		const predicate = this.getPredicate();
		return (
			predicate === LLVMCmpInstPredicate.RealOEQ ||
			predicate === LLVMCmpInstPredicate.RealOGT ||
			predicate === LLVMCmpInstPredicate.RealOGE ||
			predicate === LLVMCmpInstPredicate.RealOLT ||
			predicate === LLVMCmpInstPredicate.RealOLE ||
			predicate === LLVMCmpInstPredicate.RealONE ||
			predicate === LLVMCmpInstPredicate.RealORD
		);
	}

	/**
	 * Check if this is an unordered floating-point comparison.
	 * @returns True if this is an unordered floating-point comparison
	 */
	public isUnordered(): boolean {
		const predicate = this.getPredicate();
		return (
			predicate === LLVMCmpInstPredicate.RealUNO ||
			predicate === LLVMCmpInstPredicate.RealUEQ ||
			predicate === LLVMCmpInstPredicate.RealUGT ||
			predicate === LLVMCmpInstPredicate.RealUGE ||
			predicate === LLVMCmpInstPredicate.RealULT ||
			predicate === LLVMCmpInstPredicate.RealULE ||
			predicate === LLVMCmpInstPredicate.RealUNE
		);
	}
}

/**
 * ICmpInst - Integer comparison instruction
 * Based on LLVM's ICmpInst class
 */
export class ICmpInst extends CmpInst {
	/**
	 * Obtain the predicate of an instruction.
	 *
	 * This is only valid for instructions that correspond to llvm::ICmpInst.
	 * @returns The integer comparison predicate
	 */
	public override getICmpPredicate(): LLVMCmpInstPredicate {
		// Use the stored predicate if available, otherwise get from FFI
		if (this.predicate !== undefined) {
			return this.predicate;
		}
		const predicateRef = ffi.LLVMGetICmpPredicate(this.ref);
		assert(predicateRef !== null, "Failed to get integer comparison predicate");

		return predicateRef as LLVMCmpInstPredicate;
	}

	/**
	 * Get whether or not an icmp instruction has the samesign flag.
	 *
	 * This is only valid for instructions that correspond to llvm::ICmpInst.
	 * @returns True if the integer comparison instruction has the same sign
	 */
	public getICmpSameSign(): boolean {
		const sameSignRef = ffi.LLVMGetICmpSameSign(this.ref);
		assert(sameSignRef !== null, "Failed to get integer comparison same sign");

		return sameSignRef;
	}

	/**
	 * Set the samesign flag on an icmp instruction.
	 *
	 * This is only valid for instructions that correspond to llvm::ICmpInst.
	 */
	public setICmpSameSign(sameSign: boolean): void {
		ffi.LLVMSetICmpSameSign(this.ref, sameSign);
	}

	/**
	 * Check if this is an integer comparison instruction.
	 * @returns Always true for ICmpInst
	 */
	public override isICmpInst(): boolean {
		return true;
	}

	/**
	 * Check if this is a floating-point comparison instruction.
	 * @returns Always false for ICmpInst
	 */
	public override isFCmpInst(): boolean {
		return false;
	}

	/**
	 * Get the predicate of this comparison instruction.
	 * @returns The integer comparison predicate
	 */
	public override getPredicate(): LLVMCmpInstPredicate {
		return this.getICmpPredicate();
	}
}

/**
 * FCmpInst - Floating-point comparison instruction
 * Based on LLVM's FCmpInst class
 */
export class FCmpInst extends CmpInst {
	/**
	 * Get the floating-point comparison predicate for this instruction.
	 * @returns The floating-point comparison predicate
	 */
	public override getFCmpPredicate(): LLVMCmpInstPredicate {
		// Use the stored predicate if available, otherwise get from FFI
		if (this.predicate !== undefined) {
			return this.predicate;
		}
		const predicateRef = ffi.LLVMGetFCmpPredicate(this.ref);
		assert(predicateRef !== null, "Failed to get floating-point comparison predicate");

		return predicateRef as LLVMCmpInstPredicate;
	}

	/**
	 * Check if this is an integer comparison instruction.
	 * @returns Always false for FCmpInst
	 */
	public override isICmpInst(): boolean {
		return false;
	}

	/**
	 * Check if this is a floating-point comparison instruction.
	 * @returns Always true for FCmpInst
	 */
	public override isFCmpInst(): boolean {
		return true;
	}

	/**
	 * Get the predicate of this comparison instruction.
	 * @returns The floating-point comparison predicate
	 */
	public override getPredicate(): LLVMCmpInstPredicate {
		return this.getFCmpPredicate();
	}
}

/**
 * CallInst - Function call instruction
 * Based on LLVM's CallInst class
 */
export class CallInst extends Instruction {}

/**
 * SelectInst - Select instruction (conditional value selection)
 * Based on LLVM's SelectInst class
 */
export class SelectInst extends Instruction {
	public getCondition(): Value {
		return this.getOperand(0);
	}

	public getTrueValue(): Value {
		return this.getOperand(1);
	}

	public getFalseValue(): Value {
		return this.getOperand(2);
	}

	public setCondition(value: Value): void {
		this.setOperand(0, value);
	}

	public setTrueValue(value: Value): void {
		this.setOperand(1, value);
	}

	public setFalseValue(value: Value): void {
		this.setOperand(2, value);
	}
}

/**
 * VAArgInst - Variable argument instruction
 * Based on LLVM's VAArgInst class
 */
export class VAArgInst extends Instruction {}

/**
 * ExtractElementInst - Extract element from vector instruction
 * Based on LLVM's ExtractElementInst class
 */
export class ExtractElementInst extends Instruction {}

/**
 * InsertElementInst - Insert element into vector instruction
 * Based on LLVM's InsertElementInst class
 */
export class InsertElementInst extends Instruction {}

/**
 * ShuffleVectorInst - Shuffle vector instruction
 * Based on LLVM's ShuffleVectorInst class
 */
export class ShuffleVectorInst extends Instruction {}

/**
 * ExtractValueInst - Extract value from aggregate instruction
 * Based on LLVM's ExtractValueInst class
 */
export class ExtractValueInst extends Instruction {}

/**
 * InsertValueInst - Insert value into aggregate instruction
 * Based on LLVM's InsertValueInst class
 */
export class InsertValueInst extends Instruction {}

/**
 * PHINode - PHI node instruction
 * Based on LLVM's PHINode class
 */
export class PHINode extends Instruction {
	public addIncoming(_value: Value, _basicBlock: BasicBlock): void {
		// TODO: Not implemented yet, needs more User API changes
		throw new Error("PHINode.addIncoming not implemented yet");
	}
}

/**
 * LandingPadInst - Landing pad instruction for exception handling
 * Based on LLVM's LandingPadInst class
 */
export class LandingPadInst extends Instruction {
	public setCleanup(_value: boolean): void {
		// TODO: Not implemented yet, needs more User API changes
		throw new Error("LandingPadInst.setCleanup not implemented yet");
	}

	public addClause(_clauseVal: Constant): void {
		// TODO: Not implemented yet, needs more User API changes
		throw new Error("LandingPadInst.addClause not implemented yet");
	}
}

/**
 * ReturnInst - Return instruction
 * Based on LLVM's ReturnInst class
 */
export class ReturnInst extends Instruction {
	public getReturnValue(): Value {
		return this.getNumOperands() > 0 ? this.getOperand(0) : new Value(null);
	}
}

/**
 * BranchInst - Branch instruction
 * Based on LLVM's BranchInst class
 */
export class BranchInst extends Instruction {
	public isUnconditional(): boolean {
		// C++ only checks for operand count
		// return this.getNumOperands() === 3;
		return !this.isConditional();
	}

	public isConditional(): boolean {
		// C++ only checks for operand count
		// return this.getNumOperands() === 3;
		const conditionalRef = ffi.LLVMIsConditional(this.ref);
		assert(conditionalRef !== null, "Failed to check if branch instruction is conditional");

		return conditionalRef;
	}

	public getCondition(): Value {
		const conditionRef = ffi.LLVMGetCondition(this.ref);
		assert(conditionRef !== null, "Failed to get branch instruction condition");

		return new Value(conditionRef);
	}
}

/**
 * SwitchInst - Switch instruction
 * Based on LLVM's SwitchInst class
 * TODO: Implement this
 */
export class SwitchInst extends Instruction {
	public addCase(_onVal: ConstantInt, _dest: BasicBlock): void {
		// TODO: Not implemented yet, needs more User API changes
		throw new Error("SwitchInst.addCase not implemented yet");
	}
}

/**
 * IndirectBrInst - Indirect branch instruction
 * Based on LLVM's IndirectBrInst class
 */
export class IndirectBrInst extends Instruction {}

/**
 * InvokeInst - Invoke instruction
 * Based on LLVM's InvokeInst class
 */
export class InvokeInst extends Instruction {}

/**
 * CallBrInst - Call branch instruction
 * Based on LLVM's CallBrInst class
 */
export class CallBrInst extends Instruction {}

/**
 * ResumeInst - Resume instruction for exception handling
 * Based on LLVM's ResumeInst class
 */
export class ResumeInst extends Instruction {}

/**
 * CatchSwitchInst - Catch switch instruction
 * Based on LLVM's CatchSwitchInst class
 */
export class CatchSwitchInst extends Instruction {}

/**
 * CleanupPadInst - Cleanup pad instruction
 * Based on LLVM's CleanupPadInst class
 */
export class CleanupPadInst extends Instruction {}

/**
 * CatchPadInst - Catch pad instruction
 * Based on LLVM's CatchPadInst class
 */
export class CatchPadInst extends Instruction {
	/**
	 * Get the parent catchswitch instruction of a catchpad instruction.
	 * This only works on llvm::CatchPadInst instructions.
	 * @returns The parent catchswitch instruction
	 */
	public getParentCatchSwitch(): CatchSwitchInst {
		const catchSwitchRef = ffi.LLVMGetParentCatchSwitch(this.ref);
		assert(catchSwitchRef !== null, "Failed to get parent catchswitch instruction");

		return new CatchSwitchInst(catchSwitchRef);
	}

	/**
	 * Set the parent catchswitch instruction of a catchpad instruction.
	 * This only works on llvm::CatchPadInst instructions.
	 * @param catchSwitch The catchswitch instruction to set as parent
	 */
	public setParentCatchSwitch(catchSwitch: CatchSwitchInst): void {
		assert(catchSwitch.ref !== null, "Catch Switch instruction cannot be null");
		ffi.LLVMSetParentCatchSwitch(this.ref, catchSwitch.ref);
	}
}

/**
 * CatchReturnInst - Catch return instruction
 * Based on LLVM's CatchReturnInst class
 */
export class CatchReturnInst extends Instruction {}

/**
 * CleanupReturnInst - Cleanup return instruction
 * Based on LLVM's CleanupReturnInst class
 */
export class CleanupReturnInst extends Instruction {}

/**
 * UnreachableInst - Unreachable instruction
 * Based on LLVM's UnreachableInst class
 */
export class UnreachableInst extends Instruction {}

/**
 * TruncInst - Truncate instruction
 * Based on LLVM's TruncInst class
 */
export class TruncInst extends Instruction {}

/**
 * ZExtInst - Zero extend instruction
 * Based on LLVM's ZExtInst class
 */
export class ZExtInst extends Instruction {}

/**
 * SExtInst - Sign extend instruction
 * Based on LLVM's SExtInst class
 */
export class SExtInst extends Instruction {}

/**
 * FPTruncInst - Floating-point truncate instruction
 * Based on LLVM's FPTruncInst class
 */
export class FPTruncInst extends Instruction {}

/**
 * FPExtInst - Floating-point extend instruction
 * Based on LLVM's FPExtInst class
 */
export class FPExtInst extends Instruction {}

/**
 * UIToFPInst - Unsigned integer to floating-point instruction
 * Based on LLVM's UIToFPInst class
 */
export class UIToFPInst extends Instruction {}

/**
 * SIToFPInst - Signed integer to floating-point instruction
 * Based on LLVM's SIToFPInst class
 */
export class SIToFPInst extends Instruction {}

/**
 * FPToUIInst - Floating-point to unsigned integer instruction
 * Based on LLVM's FPToUIInst class
 */
export class FPToUIInst extends Instruction {}

/**
 * FPToSIInst - Floating-point to signed integer instruction
 * Based on LLVM's FPToSIInst class
 */
export class FPToSIInst extends Instruction {}

/**
 * PtrToAddrInst - Pointer to address instruction
 * Based on LLVM's PtrToAddrInst class
 */
export class PtrToAddrInst extends Instruction {}

/**
 * IntToPtrInst - Integer to pointer instruction
 * Based on LLVM's IntToPtrInst class
 */
export class IntToPtrInst extends Instruction {}

/**
 * PtrToIntInst - Pointer to integer instruction
 * Based on LLVM's PtrToIntInst class
 */
export class PtrToIntInst extends Instruction {}

/**
 * BitCastInst - Bit cast instruction
 * Based on LLVM's BitCastInst class
 */
export class BitCastInst extends Instruction {}

/**
 * AddrSpaceCastInst - Address space cast instruction
 * Based on LLVM's AddrSpaceCastInst class
 */
export class AddrSpaceCastInst extends Instruction {}

/**
 * FreezeInst - Freeze instruction
 * Based on LLVM's FreezeInst class
 */
export class FreezeInst extends Instruction {}
