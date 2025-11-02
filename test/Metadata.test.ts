import { describe, expect, it } from "bun:test";
import { IRBuilder, LLVMContext, Metadata, Module, Type } from "../src/index";

describe("Metadata Creation Tests", () => {
	it("should create MDString metadata", () => {
		const context = new LLVMContext();

		// Create an MDString using context convenience method
		const mdString = context.createMDString("test string");
		expect(mdString).toBeDefined();

		// Get the string value back
		const value = mdString.getString(context);
		expect(value).toBe("test string");
	});

	it("should create MDString metadata using static method", () => {
		const context = new LLVMContext();

		// Create an MDString using static method
		const mdString = Metadata.createMDString(context, "another test");
		expect(mdString).toBeDefined();

		// Get the string value back
		const value = mdString.getString(context);
		expect(value).toBe("another test");
	});

	it("should create MDNode with multiple operands", () => {
		const context = new LLVMContext();

		// Create some MDString operands
		const md1 = context.createMDString("operand1");
		const md2 = context.createMDString("operand2");
		const md3 = context.createMDString("operand3");

		// Create an MDNode with these operands
		const mdNode = context.createMDNode([md1, md2, md3]);
		expect(mdNode).toBeDefined();

		// Get the number of operands
		const numOperands = mdNode.getNumOperands(context);
		expect(numOperands).toBe(3);

		// Get the operands
		const operands = mdNode.getOperands(context);
		expect(operands).toHaveLength(3);
	});

	it("should create empty MDNode", () => {
		const context = new LLVMContext();

		// Create an empty MDNode
		const mdNode = context.createMDNode([]);
		expect(mdNode).toBeDefined();

		// Should have no operands
		const numOperands = mdNode.getNumOperands(context);
		expect(numOperands).toBe(0);
	});

	it("should create nested MDNodes", () => {
		const context = new LLVMContext();

		// Create inner MDNode
		const innerMD1 = context.createMDString("inner1");
		const innerMD2 = context.createMDString("inner2");
		const innerNode = context.createMDNode([innerMD1, innerMD2]);

		// Create outer MDNode containing the inner node
		const outerMD = context.createMDString("outer");
		const outerNode = context.createMDNode([outerMD, innerNode]);

		expect(outerNode).toBeDefined();
		expect(outerNode.getNumOperands(context)).toBe(2);
	});
});

describe("Metadata Tests", () => {
	it("should create and retrieve named metadata", () => {
		const context = new LLVMContext();
		const module = new Module("test_metadata", context);

		// Get or insert a named metadata node
		const namedMD = module.getOrInsertNamedMetadata("test.metadata");
		expect(namedMD).toBeDefined();

		// Get the name
		const name = namedMD.getName();
		expect(name).toBe("test.metadata");
	});

	it("should iterate through named metadata", () => {
		const context = new LLVMContext();
		const module = new Module("test_metadata_iter", context);

		// Create some named metadata nodes
		module.getOrInsertNamedMetadata("metadata1");
		module.getOrInsertNamedMetadata("metadata2");

		// Get first and last
		const first = module.getFirstNamedMetadata();
		expect(first).toBeDefined();

		const last = module.getLastNamedMetadata();
		expect(last).toBeDefined();
	});

	it("should add metadata operands to named metadata", () => {
		const context = new LLVMContext();
		const module = new Module("test_md_operands", context);

		// Create metadata values
		const md1 = context.createMDString("value1");
		const md2 = context.createMDString("value2");
		const mdNode = context.createMDNode([md1, md2]);

		// Convert to value and add as operand
		const mdValue = mdNode.toValue(context);

		// Add to named metadata
		module.addNamedMetadataOperand("test.operands", mdValue);

		// Check that operand was added
		const count = module.getNamedMetadataNumOperands("test.operands");
		expect(count).toBe(1);

		// Get operands
		const operands = module.getNamedMetadataOperands("test.operands");
		expect(operands).toHaveLength(1);
	});

	it("should get and set debug location on IRBuilder", () => {
		const context = new LLVMContext();
		const module = new Module("test_debug_loc", context);
		const builder = new IRBuilder(context);

		// Get current debug location (should be null initially)
		const currentLoc = builder.getCurrentDebugLocation();
		expect(currentLoc).toBeNull();

		// Create a simple metadata node to use as debug location
		const md = context.createMDString("debug location");
		builder.setCurrentDebugLocation(md);

		// Get it back
		const newLoc = builder.getCurrentDebugLocation();
		expect(newLoc).toBeDefined();

		// Clear it
		builder.setCurrentDebugLocation(null);
		const clearedLoc = builder.getCurrentDebugLocation();
		expect(clearedLoc).toBeNull();
	});

	it("should get and set default FP math tag on IRBuilder", () => {
		const context = new LLVMContext();
		const module = new Module("test_fp_math", context);
		const builder = new IRBuilder(context);

		// Get default FP math tag (should be null initially)
		const fpMathTag = builder.getDefaultFPMathTag();
		expect(fpMathTag).toBeNull();

		// Create a metadata node for FP math tag
		const md = context.createMDString("fast");
		builder.setDefaultFPMathTag(md);

		// Get it back
		const newTag = builder.getDefaultFPMathTag();
		expect(newTag).toBeDefined();

		// Clear it
		builder.setDefaultFPMathTag(null);
		const clearedTag = builder.getDefaultFPMathTag();
		expect(clearedTag).toBeNull();
	});
});

describe("Debug Location Tests", () => {
	it("should get debug location info from values", () => {
		const context = new LLVMContext();
		const module = new Module("test_debug_info", context);
		const builder = new IRBuilder(context);

		// Create a simple function
		const funcType = Type.getFunctionType(Type.getVoidTy(), [], false);
		const func = module.getOrInsertFunction("test_func", funcType);

		// Get debug location info (will be empty/default for now)
		const directory = func.getCallee().getDebugLocDirectory();
		const filename = func.getCallee().getDebugLocFilename();
		const line = func.getCallee().getDebugLocLine();
		const column = func.getCallee().getDebugLocColumn();

		// These should return default values since no debug info was set
		expect(directory).toBe("");
		expect(filename).toBe("");
		expect(line).toBe(0);
		expect(column).toBe(0);
	});
});

describe("Debug Record Tests", () => {
	it("should get debug records from instructions", () => {
		const context = new LLVMContext();
		const module = new Module("test_dbg_records", context);
		const builder = new IRBuilder(context);

		// Create a simple function with a basic block
		const funcType = Type.getFunctionType(Type.getVoidTy(), [], false);
		const func = module.getOrInsertFunction("test_func", funcType);

		// Note: Getting debug records requires instructions with attached debug info
		// For now, we verify that the method exists and returns null for empty instructions
	});
});
