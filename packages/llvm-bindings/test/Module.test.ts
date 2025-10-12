import { beforeEach, describe, expect, it } from "bun:test";
import { LLVMContext } from "../src/modules/LLVMContext.js";
import { Module } from "../src/modules/Module.js";
import { Type } from "../src/modules/Type.js";
import type { LLVMContextRef } from "../src/utils.js";

describe("Module Tests", () => {
	let context: LLVMContext;
	let contextRef: LLVMContextRef;

	beforeEach(() => {
		context = new LLVMContext();
		contextRef = context.ref;
	});

	describe("Module Creation", () => {
		it("should create module with name only", () => {
			const module = new Module("test_module");

			expect(module).toBeDefined();
			expect(module.ref).toBeDefined();
			expect(module.ref).not.toBe(0);
		});

		it("should create module with name and context", () => {
			const module = new Module("test_module", contextRef);

			expect(module).toBeDefined();
			expect(module.ref).toBeDefined();
			expect(module.ref).not.toBe(0);
		});

		it("should create different modules with different names", () => {
			const module1 = new Module("module1");
			const module2 = new Module("module2");

			expect(module1.ref).not.toBe(module2.ref);
		});
	});

	describe("Module Properties", () => {
		let module: Module;

		beforeEach(() => {
			module = new Module("test_module");
		});

		it("should get module identifier", () => {
			const identifier = module.getModuleIdentifier();
			expect(identifier).toBeDefined();
			expect(typeof identifier).toBe("string");
		});

		it("should set and get module identifier", () => {
			const newId = "new_module_id";
			module.setModuleIdentifier(newId);
			const retrievedId = module.getModuleIdentifier();
			expect(retrievedId).toBe(newId);
		});

		it("should get source file name", () => {
			const sourceFileName = module.getSourceFileName();
			expect(sourceFileName).toBeDefined();
			expect(typeof sourceFileName).toBe("string");
		});

		it("should set and get source file name", () => {
			const newFileName = "test.ll";
			module.setSourceFileName(newFileName);
			const retrievedFileName = module.getSourceFileName();
			expect(retrievedFileName).toBe(newFileName);
		});

		it("should get target triple", () => {
			const targetTriple = module.getTargetTriple();
			expect(targetTriple).toBeDefined();
			expect(typeof targetTriple).toBe("string");
		});

		it("should set and get target triple", () => {
			const newTriple = "x86_64-apple-macosx";
			module.setTargetTriple(newTriple);
			const retrievedTriple = module.getTargetTriple();
			expect(retrievedTriple).toBe(newTriple);
		});

		it("should get data layout string", () => {
			const dataLayout = module.getDataLayoutStr();
			expect(dataLayout).toBeDefined();
			expect(typeof dataLayout).toBe("string");
		});

		it("should set and get data layout", () => {
			const newLayout = "e-m:o-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128";
			module.setDataLayout(newLayout);
			const retrievedLayout = module.getDataLayoutStr();
			expect(retrievedLayout).toBe(newLayout);
		});
	});

	describe("Function Operations", () => {
		let module: Module;
		let int32Type: Type;
		let funcType: Type;

		beforeEach(() => {
			module = new Module("test_module");
			int32Type = Type.getInt32Ty();
			funcType = Type.getFunctionType(int32Type);
		});

		it("should add function to module", () => {
			const func = module.getOrInsertFunction("test_func", funcType);

			expect(func).toBeDefined();
			expect(func).not.toBe(0);
		});

		it("should get function by name", () => {
			const funcName = "test_func";
			module.getOrInsertFunction(funcName, funcType);
			const retrievedFunc = module.getFunction(funcName);

			expect(retrievedFunc).toBeDefined();
			expect(retrievedFunc).not.toBe(0);
		});

		it("should return null for non-existent function", () => {
			const nonExistentFunc = module.getFunction("non_existent");
			expect(nonExistentFunc).toBeNull();
		});

		it("should get first function in module", () => {
			// Initially no functions
			let firstFunc = module.getFunction("first_func");
			expect(firstFunc).toBeNull();

			// Add a function
			module.getOrInsertFunction("first_func", funcType);
			firstFunc = module.getFunction("first_func");
			expect(firstFunc).toBeDefined();
			expect(firstFunc).not.toBe(0);
		});

		it("should get next function in iteration", () => {
			// Add multiple functions
			module.getOrInsertFunction("func1", funcType);
			module.getOrInsertFunction("func2", funcType);

			const firstFunc = module.getFunction("func1");
			expect(firstFunc).toBeDefined();

			const nextFunc = module.getFunction("func2");
			expect(nextFunc).toBeDefined();
			expect(nextFunc).not.toBe(firstFunc);
		});

		it("should create different functions with different names", () => {
			module.getOrInsertFunction("func1", funcType);
			module.getOrInsertFunction("func2", funcType);

			const func1 = module.getFunction("func1");
			const func2 = module.getFunction("func2");

			expect(func1).not.toBe(func2);
		});
	});

	describe("Global Variable Operations", () => {
		let module: Module;

		beforeEach(() => {
			module = new Module("test_module");
		});

		it("should return null for non-existent global variable", () => {
			const nonExistentGlobal = module.getGlobalVariable("non_existent");
			expect(nonExistentGlobal).toBeNull();
		});

		it("should get first global variable in module", () => {
			// Initially no global variables
			const firstGlobal = module.getFirstGlobal();
			expect(firstGlobal).toBeNull();
		});

		it("should get next global variable in iteration", () => {
			// Initially no global variables, so next should be null
			const firstGlobal = module.getFirstGlobal();
			expect(firstGlobal).toBeNull();

			if (firstGlobal) {
				const nextGlobal = module.getNextGlobal(firstGlobal);
				expect(nextGlobal).toBeNull();
			}
		});
	});

	describe("Module Utilities", () => {
		let module: Module;

		beforeEach(() => {
			module = new Module("test_module");
		});

		it("should check if module is empty initially", () => {
			const isEmpty = module.empty();
			expect(isEmpty).toBe(true);
		});

		it("should not be empty after adding function", () => {
			const int32Type = Type.getInt32Ty();
			const funcType = Type.getFunctionType(int32Type);
			module.getOrInsertFunction("test_func", funcType);

			const isEmpty = module.empty();
			expect(isEmpty).toBe(false);
		});

		it("should print module to string", () => {
			const irString = module.print();

			expect(irString).toBeDefined();
			expect(typeof irString).toBe("string");
			expect(irString.length).toBeGreaterThan(0);
		});

		it("should print module with functions", () => {
			const int32Type = Type.getInt32Ty();
			const funcType = Type.getFunctionType(int32Type);
			module.getOrInsertFunction("test_func", funcType);

			const irString = module.print();

			expect(irString).toBeDefined();
			expect(typeof irString).toBe("string");
			expect(irString.length).toBeGreaterThan(0);
			expect(irString).toContain("test_func");
		});

		it("should dispose module", () => {
			expect(() => {
				module.dispose();
			}).not.toThrow();
		});

		it("should handle disposal with Symbol.dispose", () => {
			const moduleToDispose = new Module("dispose_test");

			expect(() => {
				moduleToDispose[Symbol.dispose]();
			}).not.toThrow();
		});
	});

	describe("Module Integration", () => {
		let module: Module;
		let int32Type: LLVMTypeRef;
		let voidType: LLVMTypeRef;

		beforeEach(() => {
			module = new Module("integration_test");
			int32Type = Type.getInt32Ty();
			voidType = Type.getVoidTy();
		});

		it("should create complete module with multiple functions", () => {
			const funcType1 = Type.getFunctionType(int32Type);
			const funcType2 = Type.getFunctionType(voidType);

			const func1 = module.getOrInsertFunction("add", funcType1);
			const func2 = module.getOrInsertFunction("main", funcType2);

			expect(func1).toBeDefined();
			expect(func2).toBeDefined();
			expect(func1).not.toBe(func2);

			// Test retrieval
			const retrievedFunc1 = module.getFunction("add");
			const retrievedFunc2 = module.getFunction("main");

			expect(retrievedFunc1).toBeDefined();
			expect(retrievedFunc2).toBeDefined();
		});

		it("should iterate through all functions", () => {
			const funcType = Type.getFunctionType(int32Type);

			module.getOrInsertFunction("func1", funcType);
			module.getOrInsertFunction("func2", funcType);
			module.getOrInsertFunction("func3", funcType);

			const firstFunc = module.getFirstFunction();
			expect(firstFunc).toBeDefined();

			const secondFunc = module.getNextFunction(firstFunc as any);
			expect(secondFunc).toBeDefined();

			const thirdFunc = module.getNextFunction(secondFunc as any);
			expect(thirdFunc).toBeDefined();

			const fourthFunc = module.getNextFunction(thirdFunc as any);
			expect(fourthFunc).toBeNull();
		});

		it("should maintain module properties across operations", () => {
			// Set properties
			module.setModuleIdentifier("integration_module");
			module.setSourceFileName("integration.ll");
			module.setTargetTriple("x86_64-unknown-linux-gnu");
			module.setDataLayout(
				"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128",
			);

			// Add functions
			const funcType = Type.getFunctionType(int32Type);
			module.getOrInsertFunction("test_func", funcType);

			// Verify properties are still set
			expect(module.getModuleIdentifier()).toBe("integration_module");
			expect(module.getSourceFileName()).toBe("integration.ll");
			expect(module.getTargetTriple()).toBe("x86_64-unknown-linux-gnu");
			expect(module.getDataLayoutStr()).toBe(
				"e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128",
			);

			// Verify function exists
			const func = module.getFunction("test_func");
			expect(func).toBeDefined();
		});
	});
});
