import { describe, expect, test } from "bun:test";
import { Enums, FunctionType, LLVMContext, LLVMFunction, Module, Type } from "@/index";

describe("Function Attributes", () => {
	test("should add alwaysinline attribute", () => {
		const context = new LLVMContext();
		const module = new Module("test_module", context);

		// Create a simple function
		const i32Type = Type.getInt32Ty();
		const functionType = FunctionType.get(i32Type, [], false);
		const func = LLVMFunction.Create(
			functionType,
			Enums.GlobalValueLinkageTypes.ExternalLinkage,
			"test_func",
			module,
		);

		// Add alwaysinline attribute
		func.addAttribute(Enums.AttributeKind.AlwaysInline);

		// Check the IR contains the attribute
		const ir = module.print();
		expect(ir).toContain("alwaysinline");

		// Check attribute count
		expect(func.getAttributeCount()).toBeGreaterThan(0);

		// Clean up
		module.dispose();
		context.dispose();
	});

	test("should add noinline attribute", () => {
		const context = new LLVMContext();
		const module = new Module("test_module", context);

		// Create a simple function
		const i32Type = Type.getInt32Ty();
		const functionType = FunctionType.get(i32Type, [], false);
		const func = LLVMFunction.Create(
			functionType,
			Enums.GlobalValueLinkageTypes.ExternalLinkage,
			"test_func",
			module,
		);

		// Add noinline attribute
		func.addAttribute(Enums.AttributeKind.NoInline);

		// Check the IR contains the attribute
		const ir = module.print();
		expect(ir).toContain("noinline");

		// Clean up
		module.dispose();
		context.dispose();
	});

	test("should add multiple attributes", () => {
		const context = new LLVMContext();
		const module = new Module("test_module", context);

		// Create a simple function
		const i32Type = Type.getInt32Ty();
		const functionType = FunctionType.get(i32Type, [], false);
		const func = LLVMFunction.Create(
			functionType,
			Enums.GlobalValueLinkageTypes.ExternalLinkage,
			"test_func",
			module,
		);

		// Add multiple attributes
		func.addAttribute(Enums.AttributeKind.AlwaysInline);
		func.addAttribute(Enums.AttributeKind.NoUnwind);
		func.addAttribute(Enums.AttributeKind.WillReturn);

		// Check all attributes are present in IR
		const ir = module.print();
		expect(ir).toContain("alwaysinline");
		expect(ir).toContain("nounwind");
		expect(ir).toContain("willreturn");

		// Check attribute count
		expect(func.getAttributeCount()).toBeGreaterThanOrEqual(3);

		// Clean up
		module.dispose();
		context.dispose();
	});

	test("should add optnone and noinline together", () => {
		const context = new LLVMContext();
		const module = new Module("test_module", context);

		// Create a simple function
		const i32Type = Type.getInt32Ty();
		const functionType = FunctionType.get(i32Type, [], false);
		const func = LLVMFunction.Create(
			functionType,
			Enums.GlobalValueLinkageTypes.ExternalLinkage,
			"test_func",
			module,
		);

		// Add optnone and noinline (optnone requires noinline)
		func.addAttribute(Enums.AttributeKind.OptimizeNone);
		func.addAttribute(Enums.AttributeKind.NoInline);

		// Check both attributes are present in IR
		const ir = module.print();
		expect(ir).toContain("optnone");
		expect(ir).toContain("noinline");

		// Clean up
		module.dispose();
		context.dispose();
	});
});
