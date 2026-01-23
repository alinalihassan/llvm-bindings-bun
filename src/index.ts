/**
 * LLVM Bindings for TypeScript - A lightweight TypeScript binding for LLVM using Bun's FFI
 *
 * This module provides high-level TypeScript bindings for the LLVM C API, making it easy to
 * create JIT compilers and code generators. It handles memory management automatically and
 * provides a more idiomatic TypeScript API compared to raw LLVM C bindings.
 *
 * @example
 * ```typescript
 * import { LLVMContext, Module, IRBuilder, IntegerType, FunctionType } from "llvm-bindings-bun";
 *
 * const context = new LLVMContext();
 * const module = new Module("example", context);
 * const builder = new IRBuilder(context);
 * const int32 = IntegerType.getInt32Ty();
 * // ... create and build IR
 * ```
 */

import { Argument } from "./modules/Argument";
import { APFloat } from "./modules/ap/APFloat";
import { APInt } from "./modules/ap/APInt";
import { BasicBlock } from "./modules/BasicBlock";
import {
	ClangIndex,
	ClangTranslationUnit,
	CXTranslationUnit_None,
	compileFile,
	linkExecutable,
} from "./modules/Clang";
import { Constant } from "./modules/Constant";
import { ConstantArray } from "./modules/constants/ConstantArray";
import { ConstantFP } from "./modules/constants/ConstantFP";
import { ConstantInt } from "./modules/constants/ConstantInt";
import { ConstantPointerNull } from "./modules/constants/ConstantPointerNull";
import { ConstantStruct } from "./modules/constants/ConstantStruct";
import { PoisonValue } from "./modules/constants/PoisonValue";
import { UndefValue } from "./modules/constants/UndefValue";
import { DbgRecord } from "./modules/DbgRecord";
import * as Enums from "./modules/Enum";
import { LLVMFunction } from "./modules/Function";
import { FunctionCallee } from "./modules/FunctionCallee";
import { GlobalObject } from "./modules/GlobalObject";
import { GlobalValue } from "./modules/GlobalValue";
import { GlobalVariable } from "./modules/GlobalVariable";
import { Instruction } from "./modules/Instruction";
import {
	AddrSpaceCastInst,
	AllocaInst,
	AtomicCmpXchgInst,
	AtomicRMWInst,
	BitCastInst,
	BranchInst,
	CallBrInst,
	CallInst,
	CatchPadInst,
	CatchReturnInst,
	CatchSwitchInst,
	CleanupPadInst,
	CleanupReturnInst,
	ExtractElementInst,
	ExtractValueInst,
	FCmpInst,
	FenceInst,
	FPExtInst,
	FPToSIInst,
	FPToUIInst,
	FPTruncInst,
	FreezeInst,
	GetElementPtrInst,
	ICmpInst,
	IndirectBrInst,
	InsertElementInst,
	InsertValueInst,
	IntToPtrInst,
	InvokeInst,
	LandingPadInst,
	LoadInst,
	PHINode,
	PtrToIntInst,
	ResumeInst,
	ReturnInst,
	SExtInst,
	SelectInst,
	ShuffleVectorInst,
	SIToFPInst,
	StoreInst,
	SwitchInst,
	TruncInst,
	UIToFPInst,
	UnreachableInst,
	VAArgInst,
	ZExtInst,
} from "./modules/Instructions";
import { IRBuilder } from "./modules/IRBuilder";
import { LLVMContext } from "./modules/LLVMContext";
import { Metadata } from "./modules/Metadata";
import { Module } from "./modules/Module";
import { NamedMDNode } from "./modules/NamedMDNode";
import { PassBuilder } from "./modules/PassBuilder";
import { Target } from "./modules/Target";
import { TargetMachine } from "./modules/TargetMachine";
import { Type } from "./modules/Type";
import { TypeSize } from "./modules/TypeSize";
import { ArrayType } from "./modules/types/ArrayType";
import { FunctionType } from "./modules/types/FunctionType";
import { IntegerType } from "./modules/types/IntegerType";
import { PointerType } from "./modules/types/PointerType";
import { StructType } from "./modules/types/StructType";
import { VectorType } from "./modules/types/VectorType";
import { User } from "./modules/User";
import { Value } from "./modules/Value";

/**
 * Main LLVM Bindings Module
 *
 * Core exports for building LLVM IR:
 * - {@link LLVMContext} - LLVM execution context
 * - {@link Module} - Container for all IR
 * - {@link IRBuilder} - Helper for creating IR instructions
 * - {@link LLVMFunction} - Represents an LLVM function
 * - {@link BasicBlock} - Basic block within a function
 *
 * Type system exports:
 * - {@link IntegerType}, {@link ArrayType}, {@link StructType}, {@link VectorType}, {@link PointerType}
 *
 * Instruction exports for IR construction (60+ instruction types)
 *
 * For more information, see the README and examples in the repository.
 */
// Export all classes as named exports (so they work as both values and types)
export {
	// Core classes
	LLVMContext,
	Module,
	IRBuilder,
	PassBuilder,
	Target,
	TargetMachine,
	Type,
	TypeSize,
	Value,
	User,
	Instruction,
	Constant,
	GlobalValue,
	GlobalObject,
	GlobalVariable,
	LLVMFunction,
	Argument,
	FunctionCallee,
	BasicBlock,
	Enums,
	// Metadata and Debug Support
	Metadata,
	NamedMDNode,
	DbgRecord,
	// Constants
	ConstantArray,
	ConstantFP,
	ConstantInt,
	ConstantPointerNull,
	ConstantStruct,
	PoisonValue,
	UndefValue,
	// Instructions
	AllocaInst,
	LoadInst,
	StoreInst,
	FenceInst,
	AtomicCmpXchgInst,
	AtomicRMWInst,
	GetElementPtrInst,
	ICmpInst,
	FCmpInst,
	CallInst,
	SelectInst,
	VAArgInst,
	ExtractElementInst,
	InsertElementInst,
	ShuffleVectorInst,
	ExtractValueInst,
	InsertValueInst,
	PHINode,
	LandingPadInst,
	ReturnInst,
	BranchInst,
	SwitchInst,
	IndirectBrInst,
	InvokeInst,
	CallBrInst,
	ResumeInst,
	CatchSwitchInst,
	CleanupPadInst,
	CatchPadInst,
	CatchReturnInst,
	CleanupReturnInst,
	UnreachableInst,
	TruncInst,
	ZExtInst,
	SExtInst,
	FPTruncInst,
	FPExtInst,
	UIToFPInst,
	SIToFPInst,
	FPToUIInst,
	FPToSIInst,
	IntToPtrInst,
	PtrToIntInst,
	BitCastInst,
	AddrSpaceCastInst,
	FreezeInst,
	// AP classes
	APInt,
	APFloat,
	// Types
	IntegerType,
	FunctionType,
	VectorType,
	ArrayType,
	StructType,
	PointerType,
	// Clang
	ClangIndex,
	ClangTranslationUnit,
	compileFile,
	linkExecutable,
	CXTranslationUnit_None,
};
