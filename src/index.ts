import { APFloat } from "./modules/APFloat";
import { APInt } from "./modules/APInt";
import { Argument } from "./modules/Argument";
import { ArrayType } from "./modules/ArrayType";
import { BasicBlock } from "./modules/BasicBlock";
import {
	ClangIndex,
	ClangTranslationUnit,
	CXTranslationUnit_None,
	compileFile,
	linkExecutable,
} from "./modules/Clang";
import { Constant } from "./modules/Constant";
import { ConstantFP } from "./modules/ConstantFP";
import { ConstantInt } from "./modules/ConstantInt";
import { PassPipeline } from "./modules/Enum";
import { LLVMFunction } from "./modules/Function";
import { FunctionCallee } from "./modules/FunctionCallee";
import { FunctionType } from "./modules/FunctionType";
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
import { IntegerType } from "./modules/IntegerType";
import { IRBuilder } from "./modules/IRBuilder";
import { LLVMContext } from "./modules/LLVMContext";
import { Module } from "./modules/Module";
import { PassBuilder } from "./modules/PassBuilder";
import { PointerType } from "./modules/PointerType";
import { StructType } from "./modules/StructType";
import { Target } from "./modules/Target";
import { TargetMachine } from "./modules/TargetMachine";
import { Type } from "./modules/Type";
import { TypeSize } from "./modules/TypeSize";
import { User } from "./modules/User";
import { Value } from "./modules/Value";
import { VectorType } from "./modules/VectorType";

// Create the umbrella llvm object
const llvm = {
	// Core classes
	LLVMContext: LLVMContext,
	Module: Module,
	PassBuilder: PassBuilder,
	PassPipeline: PassPipeline,
	Target: Target,
	TargetMachine: TargetMachine,
	Type: Type,
	TypeSize: TypeSize,
	Value: Value,
	User: User,
	Instruction: Instruction,
	Constant: Constant,
	ConstantFP: ConstantFP,
	ConstantInt: ConstantInt,
	GlobalValue: GlobalValue,
	GlobalObject: GlobalObject,
	GlobalVariable: GlobalVariable,
	Function: LLVMFunction,
	Argument: Argument,
	BasicBlock: BasicBlock,
	IRBuilder: IRBuilder,

	// Instruction classes
	AllocaInst: AllocaInst,
	LoadInst: LoadInst,
	StoreInst: StoreInst,
	FenceInst: FenceInst,
	AtomicCmpXchgInst: AtomicCmpXchgInst,
	AtomicRMWInst: AtomicRMWInst,
	GetElementPtrInst: GetElementPtrInst,
	ICmpInst: ICmpInst,
	FCmpInst: FCmpInst,
	CallInst: CallInst,
	SelectInst: SelectInst,
	VAArgInst: VAArgInst,
	ExtractElementInst: ExtractElementInst,
	InsertElementInst: InsertElementInst,
	ShuffleVectorInst: ShuffleVectorInst,
	ExtractValueInst: ExtractValueInst,
	InsertValueInst: InsertValueInst,
	PHINode: PHINode,
	LandingPadInst: LandingPadInst,
	ReturnInst: ReturnInst,
	BranchInst: BranchInst,
	SwitchInst: SwitchInst,
	IndirectBrInst: IndirectBrInst,
	InvokeInst: InvokeInst,
	CallBrInst: CallBrInst,
	ResumeInst: ResumeInst,
	CatchSwitchInst: CatchSwitchInst,
	CleanupPadInst: CleanupPadInst,
	CatchPadInst: CatchPadInst,
	CatchReturnInst: CatchReturnInst,
	CleanupReturnInst: CleanupReturnInst,
	UnreachableInst: UnreachableInst,
	TruncInst: TruncInst,
	ZExtInst: ZExtInst,
	SExtInst: SExtInst,
	FPTruncInst: FPTruncInst,
	FPExtInst: FPExtInst,
	UIToFPInst: UIToFPInst,
	SIToFPInst: SIToFPInst,
	FPToUIInst: FPToUIInst,
	FPToSIInst: FPToSIInst,
	IntToPtrInst: IntToPtrInst,
	PtrToIntInst: PtrToIntInst,
	BitCastInst: BitCastInst,
	AddrSpaceCastInst: AddrSpaceCastInst,
	FreezeInst: FreezeInst,

	// Arbitrary precision classes
	APInt: APInt,
	APFloat: APFloat,

	// Derived types
	IntegerType: IntegerType,
	FunctionType: FunctionType,
	VectorType: VectorType,
	ArrayType: ArrayType,
	StructType: StructType,
	PointerType: PointerType,
	FunctionCallee: FunctionCallee,

	// Convenience methods for creating instances
	createContext: () => new LLVMContext(),
	createModule: (name: string, context?: LLVMContext) => new Module(name, context),
} as const;

// Create the clang object
const clang = {
	ClangIndex: ClangIndex,
	ClangTranslationUnit: ClangTranslationUnit,
	compileFile: compileFile,
	linkExecutable: linkExecutable,

	// Constants
	CXTranslationUnit_None: CXTranslationUnit_None,
} as const;

// Exports
export * from "@/modules/APFloat";
export * from "@/modules/APInt";
export * from "@/modules/Argument";
export * from "@/modules/ArrayType";
export * from "@/modules/BasicBlock";
export * from "@/modules/Clang";
export * from "@/modules/Constant";
export * from "@/modules/ConstantFP";
export * from "@/modules/ConstantInt";
export * from "@/modules/Enum";
export * from "@/modules/Function";
export * from "@/modules/FunctionCallee";
export * from "@/modules/FunctionType";
export * from "@/modules/GlobalObject";
export * from "@/modules/GlobalValue";
export * from "@/modules/GlobalVariable";
export * from "@/modules/Instruction";
export * from "@/modules/Instructions";
export * from "@/modules/IntegerType";
export * from "@/modules/IRBuilder";
export * from "@/modules/LLVMContext";
export * from "@/modules/Module";
export * from "@/modules/PassBuilder";
export * from "@/modules/PointerType";
export * from "@/modules/StructType";
export * from "@/modules/Target";
export * from "@/modules/TargetMachine";
export * from "@/modules/Type";
export * from "@/modules/TypeSize";
export * from "@/modules/User";
export * from "@/modules/Value";
export * from "@/modules/VectorType";

export { llvm, clang };
export default llvm;
