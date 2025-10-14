import { beforeEach, describe, expect, it } from "bun:test";
import { FunctionCallee } from "@/modules/FunctionCallee";
import { Module } from "@/modules/Module";
import { Type } from "@/modules/Type";
import { FunctionType } from "@/modules/types/FunctionType";

describe("FunctionCallee Tests", () => {
	describe("FunctionCallee Creation", () => {
		it("should create FunctionCallee with function type and callee", () => {
			const module = new Module("test_module");
			const int32Type = Type.getInt32Ty();
			const funcType = FunctionType.get(int32Type);
			const funcCallee = module.getOrInsertFunction("test_func", funcType);

			expect(funcCallee).toBeDefined();
			expect(funcCallee.getFunctionType()).toBe(funcType);
		});

		it("should create FunctionCallee with void function type", () => {
			const module = new Module("test_module");
			const voidType = Type.getVoidTy();
			const funcType = FunctionType.get(voidType);
			const functionCallee = module.getOrInsertFunction("void_func", funcType);

			expect(functionCallee).toBeDefined();
			expect(functionCallee.getFunctionType()).toBe(funcType);
		});

		it("should create FunctionCallee with function type that has parameters", () => {
			const module = new Module("test_module");
			const int32Type = Type.getInt32Ty();
			const funcType = FunctionType.get(int32Type, [int32Type, int32Type]);
			const functionCallee = module.getOrInsertFunction("add_func", funcType);

			expect(functionCallee).toBeDefined();
			expect(functionCallee.getFunctionType()).toBe(funcType);
			expect(functionCallee.getCallee()).toBeDefined();
		});
	});

	describe("FunctionCallee Accessors", () => {
		let module: Module;
		let int32Type: Type;
		let funcType: FunctionType;
		let functionCallee: FunctionCallee;

		beforeEach(() => {
			module = new Module("test_module");
			int32Type = Type.getInt32Ty();
			funcType = FunctionType.get(int32Type);
			functionCallee = module.getOrInsertFunction("test_func", funcType);
		});

		it("should return the correct function type", () => {
			const returnedType = functionCallee.getFunctionType();

			expect(returnedType).toBe(funcType);
			expect(returnedType).toBeDefined();
		});

		it("should return the correct callee", () => {
			const returnedCallee = functionCallee.getCallee();

			expect(returnedCallee).toBeDefined();
			expect(returnedCallee).not.toBe(0);
		});

		it("should maintain references to original objects", () => {
			// Verify that the references are maintained
			expect(functionCallee.getFunctionType()).toBe(funcType);
			expect(functionCallee.getCallee()).toBeDefined();
		});
	});

	describe("FunctionCallee with Different Function Types", () => {
		let module: Module;

		beforeEach(() => {
			module = new Module("test_module");
		});

		it("should work with float function type", () => {
			const floatType = Type.getFloatTy();
			const funcType = FunctionType.get(floatType);
			const functionCallee = module.getOrInsertFunction("float_func", funcType);

			expect(functionCallee.getFunctionType()).toBe(funcType);
			expect(functionCallee.getCallee()).toBeDefined();
		});

		it("should work with double function type", () => {
			const doubleType = Type.getDoubleTy();
			const funcType = FunctionType.get(doubleType);
			const functionCallee = module.getOrInsertFunction("double_func", funcType);

			expect(functionCallee.getFunctionType()).toBe(funcType);
			expect(functionCallee.getCallee()).toBeDefined();
		});

		it("should work with function type having multiple parameters", () => {
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();
			const funcType = FunctionType.get(int32Type, [int32Type, floatType, int32Type]);
			const functionCallee = module.getOrInsertFunction("multi_param_func", funcType);

			expect(functionCallee.getFunctionType()).toBe(funcType);
			expect(functionCallee.getCallee()).toBeDefined();
		});
	});

	describe("FunctionCallee Documentation", () => {
		it("should be a container for FunctionType+Callee pair", () => {
			const module = new Module("test_module");
			const int32Type = Type.getInt32Ty();
			const funcType = FunctionType.get(int32Type);
			const functionCallee = module.getOrInsertFunction("doc_test_func", funcType);

			// Verify it contains both function type and callee
			expect(functionCallee.getFunctionType()).toBeDefined();
			expect(functionCallee.getCallee()).toBeDefined();
		});

		it("should assist in replacing PointerType::getElementType() usage", () => {
			// This test verifies the purpose of FunctionCallee as documented
			// It's designed to help with the opaque pointer types project
			expect(FunctionCallee).toBeDefined();
			expect(FunctionCallee.name).toBe("FunctionCallee");
		});

		it("should be passable as a single entity", () => {
			const module = new Module("test_module");
			const int32Type = Type.getInt32Ty();
			const funcType = FunctionType.get(int32Type);
			const functionCallee = module.getOrInsertFunction("entity_test_func", funcType);

			// Test that it can be passed around as a single entity
			const processFunctionCallee = (fc: FunctionCallee) => {
				expect(fc.getFunctionType()).toBeDefined();
				expect(fc.getCallee()).toBeDefined();
				return fc;
			};

			const processed = processFunctionCallee(functionCallee);
			expect(processed).toBe(functionCallee);
		});
	});
});
