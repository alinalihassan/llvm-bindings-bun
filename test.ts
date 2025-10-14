import { FunctionCallee, PassBuilder } from "./src";
import { BasicBlock } from "./src/modules/BasicBlock";
import { GlobalValueLinkageTypes } from "./src/modules/Enum";
import { LLVMFunction } from "./src/modules/Function";
import { IRBuilder } from "./src/modules/IRBuilder";
import { LLVMContext } from "./src/modules/LLVMContext";
import { Module } from "./src/modules/Module";
import { FunctionType } from "./src/modules/types/FunctionType";
import { IntegerType } from "./src/modules/types/IntegerType";

// Create LLVM context
const context = new LLVMContext();

// Create a module
const module = new Module("test_module", context);

// Create IR builder
const builder = new IRBuilder(context);

// Create function type: int add(int a, int b)
const int32Type = IntegerType.getInt32Ty();
const functionType = FunctionType.get(int32Type, [int32Type, int32Type], false);

// Create the add function
const addFunction = LLVMFunction.Create(
	functionType,
	GlobalValueLinkageTypes.ExternalLinkage,
	"add",
	module,
);

// Create a basic block for the function body
const entryBlock = BasicBlock.Create(context, "entry", addFunction);

// Set the insertion point to the entry block
builder.SetInsertPoint(entryBlock);

// Get the function arguments
const a = addFunction.getArg(0); // First argument
const b = addFunction.getArg(1); // Second argument

// Create the add instruction: result = a + b
const result = builder.CreateAdd(a, b, "result");

// Create return instruction
builder.CreateRet(result);

// Create a main function that calls the add function
const mainFunctionType = FunctionType.get(IntegerType.getInt32Ty(), [], false);
const mainFunction = LLVMFunction.Create(
	mainFunctionType,
	GlobalValueLinkageTypes.ExternalLinkage,
	"main",
	module,
);

// Create a basic block for the main function
const mainEntryBlock = BasicBlock.Create(context, "entry", mainFunction);

// Set the insertion point to the main function's entry block
builder.SetInsertPoint(mainEntryBlock);

// Create constants for the function call arguments
const arg1 = builder.getInt32(5);
const arg2 = builder.getInt32(3);

const functionCallee = new FunctionCallee(functionType, addFunction);

// Call the add function
const callResult = builder.CreateCall(functionCallee, [arg1, arg2], "call_result");

// Return the result
builder.CreateRet(callResult);

// Run the passes using the new enum-only API
// PassBuilder.runMaxOptimization(module);

console.log("Generated LLVM IR:");
console.log(module.print());

PassBuilder.runMaxOptimization(module);

module.compileToExecutable("test");
