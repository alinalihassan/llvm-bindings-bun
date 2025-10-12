import { FunctionCallee } from "./src";
import { BasicBlock } from "./src/modules/BasicBlock";
import { GlobalValueLinkageTypes } from "./src/modules/Enum";
import { LLVMFunction } from "./src/modules/Function";
import { FunctionType } from "./src/modules/FunctionType";
import { IntegerType } from "./src/modules/IntegerType";
import { IRBuilder } from "./src/modules/IRBuilder";
import { LLVMContext } from "./src/modules/LLVMContext";
import { Module } from "./src/modules/Module";

// Create LLVM context
const context = new LLVMContext();

// Create a module
const module = new Module("test_module", context.ref);

// Create IR builder
const builder = new IRBuilder(context);

// Create function type: int add(int a, int b)
const int32Type = IntegerType.get(context, 32);
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
const mainFunctionType = FunctionType.get(IntegerType.get(context, 32), [], false);
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

// Compile to executable
const success = await module.compileToExecutable("test_executable", undefined, "generic", "", [
	"-std=c99",
	"-Wall",
]);

if (success) {
	console.log("✅ Compilation successful!");

	// Run the executable
	const proc = Bun.spawnSync(["./test_executable"], {
		stdout: "pipe",
		stderr: "pipe",
	});

	console.log(`🎯 The add(5, 3) function returned: ${proc.exitCode}`);
} else {
	console.log("❌ Compilation failed!");
}
