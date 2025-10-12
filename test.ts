import { existsSync } from "fs";
import { FunctionCallee } from "./src";
import { BasicBlock } from "./src/modules/BasicBlock";
import { GlobalValueLinkageTypes } from "./src/modules/Enum";
import { LLVMFunction } from "./src/modules/Function";
import { FunctionType } from "./src/modules/FunctionType";
import { IntegerType } from "./src/modules/IntegerType";
import { IRBuilder } from "./src/modules/IRBuilder";
import { LLVMContext } from "./src/modules/LLVMContext";
import { Module } from "./src/modules/Module";
import { Target } from "./src/modules/Target";
import { CodeGenFileType, TargetMachine } from "./src/modules/TargetMachine";

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

// Test LLVMTargetMachineEmitToFile for object file compilation
console.log("\n=== Testing LLVMTargetMachineEmitToFile ===");

// Initialize LLVM targets before using them
console.log("Initializing LLVM targets...");
try {
	Target.initializeAllTargets();
	console.log("✅ All targets initialized successfully");
} catch (initError) {
	console.log(`❌ Failed to initialize all targets: ${initError}`);
	console.log("Trying individual target initialization...");
	try {
		Target.initializeAArch64Target();
		console.log("✅ AArch64 target initialized successfully");
	} catch (aarch64Error) {
		console.log(`❌ Failed to initialize AArch64 target: ${aarch64Error}`);
		try {
			Target.initializeX86Target();
			console.log("✅ X86 target initialized successfully");
		} catch (x86Error) {
			console.log(`❌ Failed to initialize X86 target: ${x86Error}`);
		}
	}
}

try {
	// Get default target triple
	const defaultTriple = Target.getDefaultTargetTriple();
	console.log(`Default target triple: ${defaultTriple}`);

	// Try to get target from triple
	const target = Target.getTargetFromTriple(defaultTriple);
	if (!target) {
		console.log("❌ Failed to get target from triple");
	} else {
		console.log(`✅ Target found: ${Target.getTargetName(target)}`);
		console.log(`Target description: ${Target.getTargetDescription(target)}`);
		console.log(`Has JIT: ${Target.targetHasJIT(target)}`);
		console.log(`Has TargetMachine: ${Target.targetHasTargetMachine(target)}`);
		console.log(`Has ASM backend: ${Target.targetHasAsmBackend(target)}`);

		// Try to create target machine
		try {
			const targetMachine = new TargetMachine(target, defaultTriple, "generic", "");
			console.log("✅ TargetMachine created successfully");

			// Test LLVMTargetMachineEmitToFile for object file
			console.log("\n--- Testing LLVMTargetMachineEmitToFile for Object File ---");
			const objectFileSuccess = targetMachine.emitToFile(
				module.ref,
				"test_object.o",
				CodeGenFileType.ObjectFile,
			);
			console.log(
				`LLVMTargetMachineEmitToFile (Object): ${objectFileSuccess ? "✅ SUCCESS" : "❌ FAILED"}`,
			);

			// Test LLVMTargetMachineEmitToFile for assembly file
			console.log("\n--- Testing LLVMTargetMachineEmitToFile for Assembly File ---");
			const assemblyFileSuccess = targetMachine.emitToFile(
				module.ref,
				"test_assembly.s",
				CodeGenFileType.AssemblyFile,
			);
			console.log(
				`LLVMTargetMachineEmitToFile (Assembly): ${assemblyFileSuccess ? "✅ SUCCESS" : "❌ FAILED"}`,
			);

			// Test LLVMTargetMachineEmitToMemoryBuffer
			console.log("\n--- Testing LLVMTargetMachineEmitToMemoryBuffer ---");
			const memoryBuffer = targetMachine.emitToMemoryBuffer(module.ref, CodeGenFileType.ObjectFile);
			console.log(
				`LLVMTargetMachineEmitToMemoryBuffer: ${memoryBuffer ? "✅ SUCCESS" : "❌ FAILED"}`,
			);

			// Clean up
			targetMachine.dispose();
			console.log("✅ TargetMachine disposed successfully");
		} catch (targetMachineError) {
			console.log(`❌ Failed to create TargetMachine: ${targetMachineError}`);
		}
	}
} catch (error) {
	console.log(`❌ Error in target testing: ${error}`);
}

console.log("\n=== File Check ===");
console.log(`test_object.o exists: ${existsSync("test_object.o") ? "✅ YES" : "❌ NO"}`);
console.log(`test_assembly.s exists: ${existsSync("test_assembly.s") ? "✅ YES" : "❌ NO"}`);

if (existsSync("test_object.o")) {
	const fs = require("fs");
	const stats = fs.statSync("test_object.o");
	console.log(`test_object.o size: ${stats.size} bytes`);
}

if (existsSync("test_assembly.s")) {
	const fs = require("fs");
	const stats = fs.statSync("test_assembly.s");
	console.log(`test_assembly.s size: ${stats.size} bytes`);
}
