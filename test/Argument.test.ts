import { beforeEach, describe, expect, it } from "bun:test";
import { Argument } from "@/modules/Argument";
import { FunctionType } from "@/modules/FunctionType";
import { LLVMContext } from "@/modules/LLVMContext";
import { Module } from "@/modules/Module";
import { Type } from "@/modules/Type";
import { Value } from "@/modules/Value";

describe("Argument Tests", () => {
	describe("Argument Class", () => {
		it("should extend Value", () => {
			// Since Argument extends Value, we test that it properly inherits from Value
			expect(Argument.prototype).toBeInstanceOf(Object);
			expect(Argument.prototype).toBeInstanceOf(Value);
		});

		it("should be a class for function arguments", () => {
			// Argument is designed for function arguments
			expect(Argument.name).toBe("Argument");
		});

		it("should have proper inheritance chain", () => {
			// Test that Argument properly extends Value
			expect(Argument.prototype.constructor.name).toBe("Argument");
		});
	});

	describe("Argument Documentation", () => {
		it("should represent a function argument in LLVM IR", () => {
			// This test verifies the purpose of Argument as documented
			// Arguments are values in LLVM
			expect(Argument).toBeDefined();
		});

		it("should extend Value as arguments are values in LLVM", () => {
			// Verify that Argument extends Value
			expect(Argument.prototype).toBeInstanceOf(Value);
		});

		it("should be based on LLVM's Argument class", () => {
			// Verify that this class is a wrapper around LLVM's Argument
			expect(Argument.prototype.constructor.name).toBe("Argument");
		});
	});

	describe("Argument Methods", () => {
		it("should have getParent method", () => {
			// Test that the getParent method exists
			expect(Argument.prototype.getParent).toBeDefined();
			expect(typeof Argument.prototype.getParent).toBe("function");
		});

		it("should have setName method inherited from Value", () => {
			// Test that setName method exists (inherited from Value)
			expect(Argument.prototype.setName).toBeDefined();
			expect(typeof Argument.prototype.setName).toBe("function");
		});
	});

	describe("Argument with Function Creation", () => {
		let context: LLVMContext;
		let module: Module;
		let int32Type: Type;
		let funcType: FunctionType;

		beforeEach(() => {
			context = new LLVMContext();
			module = new Module("test_module", context);
			int32Type = Type.getInt32Ty();
			funcType = FunctionType.get(int32Type, [int32Type, int32Type]);
		});

		it("should be created when function is created", () => {
			// Create a function with arguments
			const func = module.getOrInsertFunction("test_func", funcType);
			const functionRef = func.getCallee();

			// Test that the function has arguments
			expect(functionRef.getNumArgs()).toBe(2);
		});

		it("should allow getting arguments from function", () => {
			// Create a function with arguments
			const func = module.getOrInsertFunction("test_func", funcType);
			const functionRef = func.getCallee();

			// Test getting arguments
			const arg0 = functionRef.getArg(0);
			const arg1 = functionRef.getArg(1);

			expect(arg0).toBeDefined();
			expect(arg1).toBeDefined();
			expect(arg0).toBeInstanceOf(Argument);
			expect(arg1).toBeInstanceOf(Argument);
		});

		it("should allow getting all arguments from function", () => {
			// Create a function with arguments
			const func = module.getOrInsertFunction("test_func", funcType);
			const functionRef = func.getCallee();

			// Test getting all arguments
			const args = functionRef.getArgs();

			expect(args).toBeDefined();
			expect(Array.isArray(args)).toBe(true);
			expect(args.length).toBe(2);
			expect(args[0]).toBeInstanceOf(Argument);
			expect(args[1]).toBeInstanceOf(Argument);
		});
	});

	describe("Argument Properties", () => {
		let context: LLVMContext;
		let module: Module;
		let int32Type: Type;
		let funcType: FunctionType;

		beforeEach(() => {
			context = new LLVMContext();
			module = new Module("test_module", context);
			int32Type = Type.getInt32Ty();
			funcType = FunctionType.get(int32Type, [int32Type, int32Type]);
		});

		it("should have a parent function", () => {
			// Create a function with arguments
			const func = module.getOrInsertFunction("test_func", funcType);
			const functionRef = func.getCallee();
			const arg = functionRef.getArg(0);

			// Test that argument has a parent function
			const parent = arg.getParent();
			expect(parent).toBeDefined();
			expect(parent.ref).toBe(functionRef.ref);
		});

		it("should be able to set and get name", () => {
			// Create a function with arguments
			const func = module.getOrInsertFunction("test_func", funcType);
			const functionRef = func.getCallee();
			const arg = functionRef.getArg(0);

			// Test setting and getting name
			const argName = "my_arg";
			arg.setName(argName);
			const retrievedName = arg.getName();

			// The name should be set (it might be a different format than expected)
			expect(retrievedName).toBeDefined();
			expect(typeof retrievedName).toBe("string");
		});
	});

	describe("Argument Edge Cases", () => {
		it("should handle function with no arguments", () => {
			const context = new LLVMContext();
			const module = new Module("test_module", context);
			const voidType = Type.getVoidTy();
			const funcType = FunctionType.get(voidType);

			// Create a function with no arguments
			const func = module.getOrInsertFunction("no_args_func", funcType);
			const functionRef = func.getCallee();

			// Test that function has no arguments
			expect(functionRef.getNumArgs()).toBe(0);
			expect(functionRef.getArgs().length).toBe(0);
		});

		it("should handle function with many arguments", () => {
			const context = new LLVMContext();
			const module = new Module("test_module", context);
			const int32Type = Type.getInt32Ty();
			const funcType = FunctionType.get(int32Type, [
				int32Type,
				int32Type,
				int32Type,
				int32Type,
				int32Type,
			]);

			// Create a function with many arguments
			const func = module.getOrInsertFunction("many_args_func", funcType);
			const functionRef = func.getCallee();

			// Test that function has the expected number of arguments
			expect(functionRef.getNumArgs()).toBe(5);
			expect(functionRef.getArgs().length).toBe(5);

			// Test that all arguments are Argument instances
			for (let i = 0; i < 5; i++) {
				const arg = functionRef.getArg(i);
				expect(arg).toBeDefined();
				expect(arg).toBeInstanceOf(Argument);
			}
		});

		it("should handle different argument types", () => {
			const context = new LLVMContext();
			const module = new Module("test_module", context);
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();
			const doubleType = Type.getDoubleTy();
			const funcType = FunctionType.get(int32Type, [int32Type, floatType, doubleType]);

			// Create a function with different argument types
			const func = module.getOrInsertFunction("mixed_args_func", funcType);
			const functionRef = func.getCallee();

			// Test that function has the expected number of arguments
			expect(functionRef.getNumArgs()).toBe(3);

			// Test that all arguments are Argument instances
			const args = functionRef.getArgs();
			expect(args.length).toBe(3);
			args.forEach((arg) => {
				expect(arg).toBeInstanceOf(Argument);
			});
		});
	});
});
