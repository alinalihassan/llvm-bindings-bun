import { ffi } from "@/ffi";
import type { LLVMBasicBlockRef, LLVMBuilderRef, LLVMValueRef } from "@/utils";
import { assert, cstring } from "@/utils";
import { APInt } from "./APInt";
import { BasicBlock } from "./BasicBlock";
import { ConstantInt } from "./ConstantInt";
import { LLVMCastKind, LLVMCmpInstPredicate } from "./Enum";
import type { LLVMFunction } from "./Function";
import type { FunctionCallee } from "./FunctionCallee";
import type { FunctionType } from "./FunctionType";
import { GlobalVariable } from "./GlobalVariable";
import type { Instruction } from "./Instruction";
import {
	AllocaInst,
	BranchInst,
	CallInst,
	ExtractValueInst,
	FCmpInst,
	ICmpInst,
	IndirectBrInst,
	InsertValueInst,
	InvokeInst,
	LandingPadInst,
	LoadInst,
	PHINode,
	ResumeInst,
	ReturnInst,
	SelectInst,
	StoreInst,
	SwitchInst,
	UnreachableInst,
} from "./Instructions";
import type { IntegerType } from "./IntegerType";
import type { LLVMContext } from "./LLVMContext";
import type { PointerType } from "./PointerType";
import { Type } from "./Type";
import { Value } from "./Value";

/**
 * InsertPoint class to save and restore insertion points
 */
export class InsertPoint {
	constructor(
		public readonly basicBlock: BasicBlock | null,
		public readonly instruction: Instruction | null,
	) {}
}

/**
 * IRBuilder class for creating LLVM instructions
 * Based on LLVM's IRBuilder class from IRBuilder.h
 * This provides a convenient way to create LLVM instructions with a consistent interface.
 */
export class IRBuilder {
	public readonly ref: LLVMBuilderRef;
	public readonly context: LLVMContext;

	public constructor(context: LLVMContext) {
		this.context = context;
		this.ref = ffi.LLVMCreateBuilderInContext(context.ref);
		ffi.LLVMPositionBuilderAtEnd(this.ref, context.ref);
	}

	//===--------------------------------------------------------------------===//
	// Builder configuration methods
	//===--------------------------------------------------------------------===//

	/**
	 * Clear the insertion point: created instructions will not be
	 * inserted into a block.
	 */
	public ClearInsertionPoint(): void {
		ffi.LLVMClearInsertionPosition(this.ref);
	}

	/**
	 * Get the current insertion block
	 * @returns The current insertion block, or null if none
	 */
	public GetInsertBlock(): BasicBlock | null {
		const bbRef: LLVMBasicBlockRef = ffi.LLVMGetInsertBlock(this.ref);

		return bbRef ? new BasicBlock(bbRef) : null;
	}

	/**
	 * Set the insertion point to the end of the specified basic block
	 * @param basicBlock The basic block to insert into
	 */
	public SetInsertPoint(basicBlock: BasicBlock): void;
	/**
	 * Set the insertion point to before the specified instruction
	 * @param inst The instruction to insert before
	 */
	public SetInsertPoint(inst: Instruction): void;
	public SetInsertPoint(basicBlockOrInst: BasicBlock | Instruction): void {
		if (basicBlockOrInst instanceof BasicBlock) {
			ffi.LLVMPositionBuilderAtEnd(this.ref, basicBlockOrInst.ref);
		} else {
			ffi.LLVMPositionBuilderBefore(this.ref, basicBlockOrInst.ref);
		}
	}

	/**
	 * Save the current insertion point
	 * @returns The current insertion point
	 */
	public saveIP(): InsertPoint {
		// TODO: Get current instruction position
		throw new Error(
			"IRBuilder.saveIP not implemented yet - need to get current instruction position",
		);
		// return new InsertPoint(this.GetInsertBlock(), null);
	}

	/**
	 * Save the current insertion point and clear it
	 * @returns The saved insertion point
	 */
	public saveAndClearIP(): InsertPoint {
		const ip = this.saveIP();
		this.ClearInsertionPoint();
		return ip;
	}

	/**
	 * Restore a previously saved insertion point
	 * @param ip The insertion point to restore
	 */
	public restoreIP(ip: InsertPoint): void {
		if (ip.basicBlock) {
			this.SetInsertPoint(ip.basicBlock);
		} else if (ip.instruction) {
			this.SetInsertPoint(ip.instruction);
		} else {
			this.ClearInsertionPoint();
		}
	}

	//===--------------------------------------------------------------------===//
	// Miscellaneous creation methods.
	//===--------------------------------------------------------------------===//

	/**
	 * Create a global string
	 * @param str The string value
	 * @param name Optional name for the global
	 * @param addrSpace Optional address space
	 * @param module Optional module to add to
	 * @returns The global variable
	 */
	public CreateGlobalString(str: string, name?: string): GlobalVariable {
		const globalVarRef = ffi.LLVMBuildGlobalString(
			this.ref,
			cstring(str),
			name ? cstring(name) : null,
		);

		if (globalVarRef === null) {
			throw new Error("Failed to create global string");
		}

		return new GlobalVariable(globalVarRef);
	}

	/**
	 * Get a constant integer with boolean value
	 * @param value The boolean value
	 * @returns The constant integer
	 */
	public getInt1(value: boolean): ConstantInt {
		return ConstantInt.get(this.context, new APInt(1, value ? 1 : 0, value));
	}

	/**
	 * Get true constant
	 * @returns The true constant
	 */
	public getTrue(): ConstantInt {
		return this.getInt1(true);
	}

	/**
	 * Get false constant
	 * @returns The false constant
	 */
	public getFalse(): ConstantInt {
		return this.getInt1(false);
	}

	/**
	 * Get a constant 8-bit integer
	 * @param value The integer value
	 * @returns The constant integer
	 */
	public getInt8(value: number): ConstantInt {
		return ConstantInt.get(this.context, new APInt(8, value, true));
	}

	/**
	 * Get a constant 16-bit integer
	 * @param value The integer value
	 * @returns The constant integer
	 */
	public getInt16(value: number): ConstantInt {
		return ConstantInt.get(this.context, new APInt(16, value, true));
	}

	/**
	 * Get a constant 32-bit integer
	 * @param value The integer value
	 * @returns The constant integer
	 */
	public getInt32(value: number): ConstantInt {
		return ConstantInt.get(this.context, new APInt(32, value, true));
	}

	/**
	 * Get a constant 64-bit integer
	 * @param value The integer value
	 * @returns The constant integer
	 */
	public getInt64(value: number): ConstantInt {
		return ConstantInt.get(this.context, new APInt(64, value, true));
	}

	/**
	 * Get a constant integer with specified number of bits
	 * @param numBits The number of bits
	 * @param value The integer value
	 * @returns The constant integer
	 */
	public getIntN(numBits: number, value: number): ConstantInt {
		return ConstantInt.get(this.context, new APInt(numBits, value, true));
	}

	/**
	 * Get a constant integer from APInt
	 * @param value The APInt value
	 * @returns The constant integer
	 */
	public getInt(value: APInt): ConstantInt {
		return ConstantInt.get(this.context, value);
	}

	//===--------------------------------------------------------------------===//
	// Type creation methods
	//===--------------------------------------------------------------------===//

	/**
	 * Get 1-bit integer type
	 * @returns The integer type
	 */
	public getInt1Ty(): IntegerType {
		return Type.getInt1Ty();
	}

	/**
	 * Get 8-bit integer type
	 * @returns The integer type
	 */
	public getInt8Ty(): IntegerType {
		return Type.getInt8Ty();
	}

	/**
	 * Get 16-bit integer type
	 * @returns The integer type
	 */
	public getInt16Ty(): IntegerType {
		return Type.getInt16Ty();
	}

	/**
	 * Get 32-bit integer type
	 * @returns The integer type
	 */
	public getInt32Ty(): IntegerType {
		return Type.getInt32Ty();
	}

	/**
	 * Get 64-bit integer type
	 * @returns The integer type
	 */
	public getInt64Ty(): IntegerType {
		return Type.getInt64Ty();
	}

	/**
	 * Get 128-bit integer type
	 * @returns The integer type
	 */
	public getInt128Ty(): IntegerType {
		return Type.getInt128Ty();
	}

	/**
	 * Get integer type with specified number of bits
	 * @param numBits The number of bits
	 * @returns The integer type
	 */
	public getIntNTy(numBits: number): IntegerType {
		return Type.getIntNTy(numBits);
	}

	/**
	 * Get half precision floating-point type
	 * @returns The type
	 */
	public getHalfTy(): Type {
		return Type.getHalfTy();
	}

	/**
	 * Get bfloat16 floating-point type
	 * @returns The type
	 */
	public getBFloatTy(): Type {
		return Type.getBFloatTy();
	}

	/**
	 * Get single precision floating-point type
	 * @returns The type
	 */
	public getFloatTy(): Type {
		return Type.getFloatTy();
	}

	/**
	 * Get double precision floating-point type
	 * @returns The type
	 */
	public getDoubleTy(): Type {
		return Type.getDoubleTy();
	}

	/**
	 * Get void type
	 * @returns The type
	 */
	public getVoidTy(): Type {
		return Type.getVoidTy();
	}

	/**
	 * Get pointer to 8-bit integer type
	 * @param addrSpace Optional address space
	 * @returns The pointer type
	 */
	public getInt8PtrTy(addrSpace?: number): PointerType {
		const int8Type = Type.getInt8Ty();
		return int8Type.getPointerTo(addrSpace || 0);
	}

	/**
	 * Get integer pointer type
	 * @param _dataLayout The data layout
	 * @param addrSpace Optional address space
	 * @returns The integer type
	 */
	public getIntPtrTy(_dataLayout: unknown, addrSpace?: number): IntegerType {
		// TODO: Not implemented yet - need to implement based on data layout
		throw new Error(
			"IRBuilder.getIntPtrTy not implemented yet - need to implement based on data layout",
		);
	}

	//===--------------------------------------------------------------------===//
	// Instruction creation methods: Terminators
	//===--------------------------------------------------------------------===//

	/**
	 * Create a return void instruction
	 * @returns The return instruction
	 */
	public CreateRetVoid(): ReturnInst {
		const valueRef = ffi.LLVMBuildRetVoid(this.ref);
		if (valueRef === null) {
			throw new Error("Failed to create return void instruction");
		}

		return new ReturnInst(valueRef);
	}

	/**
	 * Create a return instruction with value
	 * @param value The value to return
	 * @returns The return instruction
	 */
	public CreateRet(value: Value): ReturnInst {
		const valueRef = ffi.LLVMBuildRet(this.ref, value.ref);
		if (valueRef === null) {
			throw new Error("Failed to create return instruction");
		}

		return new ReturnInst(valueRef);
	}

	/**
	 * Create an unconditional branch instruction
	 * @param destBB The destination basic block
	 * @returns The branch instruction
	 */
	public CreateBr(destBB: BasicBlock): BranchInst {
		const valueRef = ffi.LLVMBuildBr(this.ref, destBB.ref);
		if (valueRef === null) {
			throw new Error("Failed to create branch instruction");
		}

		return new BranchInst(valueRef);
	}

	/**
	 * Create a conditional branch instruction
	 * @param cond The condition
	 * @param thenBB The then basic block
	 * @param elseBB The else basic block
	 * @returns The branch instruction
	 */
	public CreateCondBr(cond: Value, thenBB: BasicBlock, elseBB: BasicBlock): BranchInst {
		const valueRef = ffi.LLVMBuildCondBr(this.ref, cond.ref, thenBB.ref, elseBB.ref);
		if (valueRef === null) {
			throw new Error("Failed to create conditional branch instruction");
		}

		return new BranchInst(valueRef);
	}

	/**
	 * Create a switch instruction
	 * @param value The switch value
	 * @param dest The default destination
	 * @param numCases Optional number of cases
	 * @returns The switch instruction
	 */
	public CreateSwitch(value: Value, dest: BasicBlock, numCases?: number): SwitchInst {
		const valueRef = ffi.LLVMBuildSwitch(this.ref, value.ref, dest.ref, numCases || 0);
		if (valueRef === null) {
			throw new Error("Failed to create switch instruction");
		}

		return new SwitchInst(valueRef);
	}

	/**
	 * Create an indirect branch instruction
	 * @param addr The address to branch to
	 * @param numDests Optional number of destinations
	 * @returns The indirect branch instruction
	 */
	public CreateIndirectBr(addr: Value, numDests?: number): IndirectBrInst {
		const valueRef = ffi.LLVMBuildIndirectBr(this.ref, addr.ref, numDests || 0);
		if (valueRef === null) {
			throw new Error("Failed to create indirect branch instruction");
		}

		return new IndirectBrInst(valueRef);
	}

	/**
	 * Create an invoke instruction
	 * @param callee The function to invoke
	 * @param normalDest The normal destination basic block
	 * @param unwindDest The unwind destination basic block
	 * @param argsOrName Optional arguments array or name string
	 * @param name Optional name string
	 * @returns The invoke instruction
	 */
	public CreateInvoke(
		functionType: FunctionType,
		_function: LLVMFunction,
		args: Value[],
		thenBB: BasicBlock,
		catchBB: BasicBlock,
		_name: string,
	): InvokeInst {
		const argsBuffer = new ArrayBuffer(args.length * 8);
		const argsView = new BigUint64Array(argsBuffer);
		for (let i = 0; i < args.length; i++) {
			// TODO: This is a hack to get the type reference
			// biome-ignore lint: TODO
			argsView[i] = BigInt(args[i]!.ref as any);
		}

		const valueRef = ffi.LLVMBuildInvoke2(
			this.ref,
			functionType.ref,
			_function.ref,
			argsView,
			args.length,
			thenBB.ref,
			catchBB.ref,
			cstring(_name),
		);
		if (valueRef === null) {
			throw new Error("Failed to create invoke instruction");
		}

		return new InvokeInst(valueRef);
	}

	/**
	 * Create a resume instruction
	 * @param exn The exception value
	 * @returns The resume instruction
	 */
	public CreateResume(exn: Value): ResumeInst {
		const valueRef = ffi.LLVMBuildResume(this.ref, exn.ref);
		if (valueRef === null) {
			throw new Error("Failed to create resume instruction");
		}

		return new ResumeInst(valueRef);
	}

	/**
	 * Create an unreachable instruction
	 * @returns The unreachable instruction
	 */
	public CreateUnreachable(): UnreachableInst {
		const valueRef = ffi.LLVMBuildUnreachable(this.ref);
		if (valueRef === null) {
			throw new Error("Failed to create unreachable instruction");
		}

		return new UnreachableInst(valueRef);
	}

	//===--------------------------------------------------------------------===//
	// Instruction creation methods: Binary Operators
	//===--------------------------------------------------------------------===//

	/**
	 * Create an add instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateAdd(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildAdd(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create add instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a floating-point add instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFAdd(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildFAdd(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create floating-point add instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a subtract instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSub(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildSub(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create subtract instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a floating-point subtract instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFSub(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildFSub(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create floating-point subtract instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a multiply instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateMul(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildMul(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create multiply instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a floating-point multiply instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFMul(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildFMul(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create floating-point multiply instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a signed divide instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSDiv(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildSDiv(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create signed divide instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an unsigned divide instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateUDiv(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildUDiv(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create unsigned divide instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a floating-point divide instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFDiv(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildFDiv(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create floating-point divide instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a signed remainder instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSRem(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildSRem(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create signed remainder instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an unsigned remainder instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateURem(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildURem(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create unsigned remainder instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a floating-point remainder instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFRem(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildFRem(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create floating-point remainder instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an AND instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateAnd(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildAnd(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create AND instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an OR instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateOr(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildOr(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create OR instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an XOR instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateXor(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildXor(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create XOR instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a left shift instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateShl(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildShl(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create left shift instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an arithmetic right shift instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateAShr(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildAShr(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create arithmetic right shift instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a logical right shift instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateLShr(lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildLShr(this.ref, lhs.ref, rhs.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create logical right shift instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a negation instruction
	 * @param value The value to negate
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateNeg(value: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildNeg(this.ref, value.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create negation instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a floating-point negation instruction
	 * @param value The value to negate
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFNeg(value: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildFNeg(this.ref, value.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create floating-point negation instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a NOT instruction
	 * @param value The value to negate
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateNot(value: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildNot(this.ref, value.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create NOT instruction");
		}

		return new Value(valueRef);
	}

	//===--------------------------------------------------------------------===//
	// Instruction creation methods: Memory Instructions
	//===--------------------------------------------------------------------===//

	/**
	 * Create an alloca instruction
	 * @param type The type to allocate
	 * @param arraySize Optional array size
	 * @param name Optional name
	 * @returns The alloca instruction
	 */
	public CreateAlloca(type: Type, arraySize?: Value | null, name?: string): AllocaInst {
		let valueRef: LLVMValueRef;
		if (arraySize) {
			valueRef = ffi.LLVMBuildArrayAlloca(
				this.ref,
				type.ref,
				arraySize.ref,
				name ? cstring(name) : null,
			);
		} else {
			valueRef = ffi.LLVMBuildAlloca(this.ref, type.ref, name ? cstring(name) : null);
		}
		if (valueRef === null) {
			throw new Error("Failed to create alloca instruction");
		}

		return new AllocaInst(valueRef);
	}

	/**
	 * Create a load instruction
	 * @param type The type to load
	 * @param ptr The pointer to load from
	 * @param name Optional name
	 * @returns The load instruction
	 */
	public CreateLoad(type: Type, ptr: Value, name?: string): LoadInst {
		const valueRef = ffi.LLVMBuildLoad2(this.ref, type.ref, ptr.ref, name ? cstring(name) : null);
		if (valueRef === null) {
			throw new Error("Failed to create load instruction");
		}

		return new LoadInst(valueRef);
	}

	/**
	 * Create a store instruction
	 * @param value The value to store
	 * @param ptr The pointer to store to
	 * @returns The store instruction
	 */
	public CreateStore(value: Value, ptr: Value): StoreInst {
		const valueRef = ffi.LLVMBuildStore(this.ref, value.ref, ptr.ref);
		if (valueRef === null) {
			throw new Error("Failed to create store instruction");
		}

		return new StoreInst(valueRef);
	}

	/**
	 * Create a getelementptr instruction (multiple overloads)
	 */
	public CreateGEP(type: Type, ptr: Value, idxList: Value[], name?: string): Value;
	public CreateGEP(type: Type, ptr: Value, idx: Value, name?: string): Value;
	public CreateGEP(type: Type, ptr: Value, idxOrList: Value | Value[], name?: string): Value {
		let indices: Value[];
		if (Array.isArray(idxOrList)) {
			indices = idxOrList;
		} else {
			indices = [idxOrList];
		}

		// Convert Value[] to LLVMValueRef[]
		const indexRefs = new BigUint64Array(indices.length);
		for (let i = 0; i < indices.length; i++) {
			// TODO: Cleanup cast
			// biome-ignore lint: TODO
			indexRefs[i] = BigInt(indices[i]!.ref as any);
		}

		const valueRef = ffi.LLVMBuildGEP2(
			this.ref,
			type.ref,
			ptr.ref,
			indexRefs,
			indices.length,
			name ? cstring(name) : null,
		);

		if (valueRef === null) {
			throw new Error("Failed to create GEP instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create an in-bounds getelementptr instruction (multiple overloads)
	 */
	public CreateInBoundsGEP(type: Type, ptr: Value, idxList: Value[], name?: string): Value {
		// Convert Value[] to LLVMValueRef[]
		const indexRefs = new BigUint64Array(idxList.length);
		for (let i = 0; i < idxList.length; i++) {
			// TODO: Cleanup cast
			// biome-ignore lint: TODO
			indexRefs[i] = BigInt(idxList[i]!.ref as any);
		}

		const valueRef = ffi.LLVMBuildInBoundsGEP2(
			this.ref,
			type.ref,
			ptr.ref,
			indexRefs,
			idxList.length,
			cstring(name || ""),
		);

		if (valueRef === null) {
			throw new Error("Failed to create in-bounds GEP instruction");
		}

		return new Value(valueRef);
	}

	//===--------------------------------------------------------------------===//
	// Instruction creation methods: Cast/Conversion Operators
	//===--------------------------------------------------------------------===//

	/**
	 * Create a truncate instruction
	 * @param value The value to truncate
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateTrunc(value: Value, destType: Type, name?: string): Value {
		const valueRef = ffi.LLVMBuildTrunc(
			this.ref,
			value.ref,
			destType.ref,
			name ? cstring(name) : null,
		);
		if (valueRef === null) {
			throw new Error("Failed to create truncate instruction");
		}

		return new Value(valueRef);
	}

	/**
	 * Create a zero extend instruction
	 * @param value The value to extend
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateZExt(value: Value, destType: Type, name?: string): Value {
		const valueRef = ffi.LLVMBuildZExt(
			this.ref,
			value.ref,
			destType.ref,
			name ? cstring(name) : null,
		);
		if (valueRef === null) {
			throw new Error("Failed to create zero extend instruction");
		}

		return new Value(valueRef);
	}

	public CreateCast(castKind: LLVMCastKind, value: Value, destType: Type, name?: string): Value {
		// TODO: Check if types are the same
		// TODO: Check for folding constant at compile time

		const valueRef = ffi.LLVMBuildCast(
			this.ref,
			castKind,
			value.ref,
			destType.ref,
			cstring(name ?? ""),
		);
		assert(valueRef !== null, "Failed to create cast instruction");

		return new Value(valueRef);
	}

	/**
	 * Create a sign extend instruction
	 * @param value The value to extend
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSExt(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.SExt, value, destType, name);
	}

	/**
	 * Create a zero extend or truncate instruction
	 * @param value The value to extend or truncate
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateZExtOrTrunc(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.ZExt, value, destType, name);
	}

	/**
	 * Create a sign extend or truncate instruction
	 * @param value The value to extend or truncate
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSExtOrTrunc(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateSExtOrTrunc not implemented yet");
	}

	/**
	 * Create a floating-point to unsigned integer instruction
	 * @param value The value to convert
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFPToUI(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.FPToUI, value, destType, name);
	}

	/**
	 * Create a floating-point to signed integer instruction
	 * @param value The value to convert
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFPToSI(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.FPToSI, value, destType, name);
	}

	/**
	 * Create an unsigned integer to floating-point instruction
	 * @param value The value to convert
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateUIToFP(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.UIToFP, value, destType, name);
	}

	/**
	 * Create a signed integer to floating-point instruction
	 * @param value The value to convert
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSIToFP(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.SIToFP, value, destType, name);
	}

	/**
	 * Create a floating-point truncate instruction
	 * @param value The value to truncate
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFPTrunc(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.FPTrunc, value, destType, name);
	}

	/**
	 * Create a floating-point extend instruction
	 * @param value The value to extend
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFPExt(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.FPExt, value, destType, name);
	}

	/**
	 * Create a pointer to integer instruction
	 * @param value The value to convert
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreatePtrToInt(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.PtrToInt, value, destType, name);
	}

	/**
	 * Create an integer to pointer instruction
	 * @param value The value to convert
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateIntToPtr(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.IntToPtr, value, destType, name);
	}

	/**
	 * Create a bit cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateBitCast(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.BitCast, value, destType, name);
	}

	/**
	 * Create an address space cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateAddrSpaceCast(value: Value, destType: Type, name?: string): Value {
		return this.CreateCast(LLVMCastKind.AddrSpaceCast, value, destType, name);
	}

	/**
	 * Create a zero extend or bit cast instruction
	 * @param value The value to extend or cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateZExtOrBitCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateZExtOrBitCast not implemented yet");
	}

	/**
	 * Create a sign extend or bit cast instruction
	 * @param value The value to extend or cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSExtOrBitCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateSExtOrBitCast not implemented yet");
	}

	/**
	 * Create a truncate or bit cast instruction
	 * @param value The value to truncate or cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateTruncOrBitCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateTruncOrBitCast not implemented yet");
	}

	/**
	 * Create a pointer cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreatePointerCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreatePointerCast not implemented yet");
	}

	/**
	 * Create a pointer bit cast or address space cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreatePointerBitCastOrAddrSpaceCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreatePointerBitCastOrAddrSpaceCast not implemented yet");
	}

	/**
	 * Create an integer cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param isSigned Whether to use signed or unsigned cast
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateIntCast(value: Value, destType: Type, isSigned: boolean, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateIntCast not implemented yet");
	}

	/**
	 * Create a bit or pointer cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateBitOrPointerCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateBitOrPointerCast not implemented yet");
	}

	/**
	 * Create a floating-point cast instruction
	 * @param value The value to cast
	 * @param destType The destination type
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFPCast(value: Value, destType: Type, name?: string): Value {
		// TODO: Need to implement getScalarSizeInBits for Types
		throw new Error("IRBuilder.CreateFPCast not implemented yet");
	}

	//===--------------------------------------------------------------------===//
	// Instruction creation methods: Compare Instructions
	//===--------------------------------------------------------------------===//

	/**
	 * Create a boolean comparison instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmp(predicate: LLVMCmpInstPredicate, lhs: Value, rhs: Value, name?: string): Value {
		// TODO: Need to implement constant compile-time folding
		const valueRef = ffi.LLVMBuildICmp(
			this.ref,
			predicate,
			lhs.ref,
			rhs.ref,
			name ? cstring(name) : null,
		);
		assert(valueRef !== null, "Failed to create integer comparison instruction");

		return new ICmpInst(valueRef, predicate, lhs, rhs, name);
	}

	/**
	 * Create a boolean comparison instruction
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmp(predicate: LLVMCmpInstPredicate, lhs: Value, rhs: Value, name?: string): Value {
		// TODO: Need to implement constant compile-time folding
		const valueRef = ffi.LLVMBuildFCmp(
			this.ref,
			predicate,
			lhs.ref,
			rhs.ref,
			name ? cstring(name) : null,
		);
		assert(valueRef !== null, "Failed to create floating-point comparison instruction");

		return new FCmpInst(valueRef, predicate, lhs, rhs, name);
	}

	/**
	 * Create an integer equality comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpEQ(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntEQ, lhs, rhs, name);
	}

	/**
	 * Create an integer inequality comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpNE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntNE, lhs, rhs, name);
	}

	/**
	 * Create a signed integer greater than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpSGE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntSGE, lhs, rhs, name);
	}

	/**
	 * Create a signed integer greater than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpSGT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntSGT, lhs, rhs, name);
	}

	/**
	 * Create a signed integer less than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpSLE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntSLE, lhs, rhs, name);
	}

	/**
	 * Create a signed integer less than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpSLT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntSLT, lhs, rhs, name);
	}

	/**
	 * Create an unsigned integer greater than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpUGE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntUGE, lhs, rhs, name);
	}

	/**
	 * Create an unsigned integer greater than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpUGT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntUGT, lhs, rhs, name);
	}

	/**
	 * Create an unsigned integer less than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpULE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntULE, lhs, rhs, name);
	}

	/**
	 * Create an unsigned integer less than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateICmpULT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateICmp(LLVMCmpInstPredicate.IntULT, lhs, rhs, name);
	}

	/**
	 * Create a floating-point ordered equality comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpOEQ(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealOEQ, lhs, rhs, name);
	}

	/**
	 * Create a floating-point ordered inequality comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpONE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealONE, lhs, rhs, name);
	}

	/**
	 * Create a floating-point ordered greater than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpOGE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealOGE, lhs, rhs, name);
	}

	/**
	 * Create a floating-point ordered greater than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpOGT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealOGT, lhs, rhs, name);
	}

	/**
	 * Create a floating-point ordered less than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpOLE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealOLE, lhs, rhs, name);
	}

	/**
	 * Create a floating-point ordered less than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpOLT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealOLT, lhs, rhs, name);
	}

	/**
	 * Create a floating-point unordered equality comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpUEQ(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealUEQ, lhs, rhs, name);
	}

	/**
	 * Create a floating-point unordered inequality comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpUNE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealUNE, lhs, rhs, name);
	}

	/**
	 * Create a floating-point unordered greater than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpUGE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealUGE, lhs, rhs, name);
	}

	/**
	 * Create a floating-point unordered greater than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpUGT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealUGT, lhs, rhs, name);
	}

	/**
	 * Create a floating-point unordered less than or equal comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpULE(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealULE, lhs, rhs, name);
	}

	/**
	 * Create a floating-point unordered less than comparison
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateFCmpULT(lhs: Value, rhs: Value, name?: string): Value {
		return this.CreateFCmp(LLVMCmpInstPredicate.RealULT, lhs, rhs, name);
	}

	//===--------------------------------------------------------------------===//
	// Instruction creation methods: Other Instructions
	//===--------------------------------------------------------------------===//

	/**
	 * Create a PHI node
	 * @param type The type of the PHI node
	 * @param numReservedValues Number of reserved values
	 * @param name Optional name
	 * @returns The PHI node
	 */
	public CreatePHI(type: Type, numReservedValues: number, name?: string): PHINode {
		// TODO: More work needed
		const valueRef = ffi.LLVMBuildPhi(this.ref, type.ref, cstring(name ?? ""));
		assert(valueRef !== null, "Failed to create PHI node");

		return new PHINode(valueRef);
	}

	/**
	 * Create a call instruction
	 * @param callee The function to call
	 * @param argsOrName Optional arguments array or name string
	 * @param name Optional name string
	 * @returns The call instruction
	 */
	public CreateCall(callee: FunctionCallee, args?: Value[], name?: string): CallInst {
		assert(callee.getFunctionType().ref !== null, "Function type reference cannot be null");
		assert(args !== undefined, "Arguments array cannot be undefined");
		assert(args.length > 0, "Arguments array cannot be empty");

		const argsBuffer = new ArrayBuffer(args.length * 8);
		const argsView = new BigUint64Array(argsBuffer);
		for (let i = 0; i < args.length; i++) {
			// TODO: This is a hack to get the type reference
			// biome-ignore lint: TODO
			argsView[i] = BigInt(args[i]!.ref as any);
		}

		const valueRef = ffi.LLVMBuildCall2(
			this.ref,
			callee.getFunctionType().ref,
			callee.getCallee().ref,
			argsView,
			args.length,
			cstring(name ?? ""),
		);

		assert(valueRef !== null, "Failed to create call instruction");

		return new CallInst(valueRef);
	}

	/**
	 * Create a select instruction
	 * @param cond The condition
	 * @param trueValue The true value
	 * @param falseValue The false value
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateSelect(cond: Value, trueValue: Value, falseValue: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildSelect(
			this.ref,
			cond.ref,
			trueValue.ref,
			falseValue.ref,
			cstring(name ?? ""),
		);
		assert(valueRef !== null, "Failed to create select instruction");

		return new SelectInst(valueRef);
	}

	/**
	 * Create an extract value instruction
	 * @param agg The aggregate value
	 * @param idxs The indices
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateExtractValue(agg: Value, idxs: number[], name?: string): Value {
		const valueRef = ffi.LLVMBuildExtractValue(this.ref, agg.ref, idxs.length, cstring(name ?? ""));
		assert(valueRef !== null, "Failed to create extract value instruction");

		return new ExtractValueInst(valueRef);
	}

	/**
	 * Create an insert value instruction
	 * @param agg The aggregate value
	 * @param value The value to insert
	 * @param idxs The indices
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateInsertValue(agg: Value, value: Value, idxs: number[], name?: string): Value {
		const valueRef = ffi.LLVMBuildInsertValue(
			this.ref,
			agg.ref,
			value.ref,
			idxs.length,
			cstring(name ?? ""),
		);
		assert(valueRef !== null, "Failed to create insert value instruction");

		return new InsertValueInst(valueRef);
	}

	/**
	 * Create a landing pad instruction
	 * @param type The type of the landing pad
	 * @param numClauses Number of clauses
	 * @param name Optional name
	 * @returns The landing pad instruction
	 */
	public CreateLandingPad(type: Type, numClauses: number, name?: string): LandingPadInst {
		const valueRef = ffi.LLVMBuildLandingPad(
			this.ref,
			type.ref,
			null, // TODO: Need to add persistent function?
			numClauses,
			cstring(name ?? ""),
		);

		assert(valueRef !== null, "Failed to create landing pad instruction");

		return new LandingPadInst(valueRef);
	}

	//===--------------------------------------------------------------------===//
	// Utility creation methods
	//===--------------------------------------------------------------------===//

	/**
	 * Create an is null comparison
	 * @param value The value to check
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateIsNull(value: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildIsNull(this.ref, value.ref, cstring(name ?? ""));
		assert(valueRef !== null, "Failed to create is null comparison");

		return new Value(valueRef);
	}

	/**
	 * Create an is not null comparison
	 * @param value The value to check
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreateIsNotNull(value: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildIsNotNull(this.ref, value.ref, name ? cstring(name) : null);

		assert(valueRef !== null, "Failed to create is not null comparison");

		return new Value(valueRef);
	}

	/**
	 * Create a pointer difference instruction
	 * @param elemType The element type
	 * @param lhs Left hand side
	 * @param rhs Right hand side
	 * @param name Optional name
	 * @returns The result value
	 */
	public CreatePtrDiff(elemType: Type, lhs: Value, rhs: Value, name?: string): Value {
		const valueRef = ffi.LLVMBuildPtrDiff2(
			this.ref,
			elemType.ref,
			lhs.ref,
			rhs.ref,
			name ? cstring(name) : null,
		);
		assert(valueRef !== null, "Failed to create pointer difference instruction");

		return new Value(valueRef);
	}
}
