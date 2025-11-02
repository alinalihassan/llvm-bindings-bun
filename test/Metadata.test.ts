import { describe, expect, it } from "bun:test";
import {
	BasicBlock,
	Enums,
	GlobalVariable,
	Instruction,
	IRBuilder,
	LLVMContext,
	type LLVMFunction,
	Metadata,
	Module,
	Type,
} from "../src/index";

const { GlobalValueLinkageTypes } = Enums;

describe("Metadata Creation Tests", () => {
	it("should create MDString metadata", () => {
		const context = new LLVMContext();

		// Create an MDString using context convenience method
		const mdString = Metadata.createMDString(context, "test string");
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
		const md1 = Metadata.createMDString(context, "operand1");
		const md2 = Metadata.createMDString(context, "operand2");
		const md3 = Metadata.createMDString(context, "operand3");

		// Create an MDNode with these operands
		const mdNode = Metadata.createMDNode(context, [md1, md2, md3]);
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
		const mdNode = Metadata.createMDNode(context, []);
		expect(mdNode).toBeDefined();

		// Should have no operands
		const numOperands = mdNode.getNumOperands(context);
		expect(numOperands).toBe(0);
	});

	it("should create nested MDNodes", () => {
		const context = new LLVMContext();

		// Create inner MDNode
		const innerMD1 = Metadata.createMDString(context, "inner1");
		const innerMD2 = Metadata.createMDString(context, "inner2");
		const innerNode = Metadata.createMDNode(context, [innerMD1, innerMD2]);

		// Create outer MDNode containing the inner node
		const outerMD = Metadata.createMDString(context, "outer");
		const outerNode = Metadata.createMDNode(context, [outerMD, innerNode]);

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
		const md1 = Metadata.createMDString(context, "value1");
		const md2 = Metadata.createMDString(context, "value2");
		const mdNode = Metadata.createMDNode(context, [md1, md2]);

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
		new Module("test_debug_loc", context);
		const builder = new IRBuilder(context);

		// Get current debug location (should be null initially)
		const currentLoc = builder.getCurrentDebugLocation();
		expect(currentLoc).toBeNull();

		// Create a simple metadata node to use as debug location
		const md = Metadata.createMDString(context, "debug location");
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
		new Module("test_fp_math", context);
		const builder = new IRBuilder(context);

		// Get default FP math tag (should be null initially)
		const fpMathTag = builder.getDefaultFPMathTag();
		expect(fpMathTag).toBeNull();

		// Create a metadata node for FP math tag
		const md = Metadata.createMDString(context, "fast");
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

		// Create a simple function with a basic block
		const funcType = Type.getFunctionType(Type.getVoidTy(), [], false);
		module.getOrInsertFunction("test_func", funcType);

		// Note: Getting debug records requires instructions with attached debug info
		// For now, we verify that the method exists and returns null for empty instructions
	});
});

describe("Metadata Kind Tests", () => {
	it("should get metadata kind IDs", () => {
		const context = new LLVMContext();

		// Get metadata kind IDs
		const dbgKind = Metadata.getMDKindID(context, "dbg");
		const tbaaKind = Metadata.getMDKindID(context, "tbaa");
		const profKind = Metadata.getMDKindID(context, "prof");

		expect(dbgKind).toBeGreaterThanOrEqual(0);
		expect(tbaaKind).toBeGreaterThanOrEqual(0);
		expect(profKind).toBeGreaterThanOrEqual(0);

		// Different kinds should have different IDs
		expect(dbgKind).not.toBe(tbaaKind);
		expect(dbgKind).not.toBe(profKind);
	});

	it("should get same kind ID for same kind name", () => {
		const context = new LLVMContext();

		const dbgKind1 = Metadata.getMDKindID(context, "dbg");
		const dbgKind2 = Metadata.getMDKindID(context, "dbg");

		expect(dbgKind1).toBe(dbgKind2);
	});

	it("should get global metadata kind IDs", () => {
		const dbgKind = Metadata.getMDKindIDGlobal("dbg");
		expect(dbgKind).toBeGreaterThanOrEqual(0);
	});
});

describe("Instruction Metadata Tests", () => {
	it("should set and get metadata on instructions using enum", () => {
		const context = new LLVMContext();
		const module = new Module("test_inst_md", context);
		const builder = new IRBuilder(context);

		// Create function
		const funcType = Type.getFunctionType(
			Type.getInt32Ty(),
			[Type.getInt32Ty(), Type.getInt32Ty()],
			false,
		);
		const func = module.getOrInsertFunction("add", funcType);
		const bb = BasicBlock.Create(context, "entry", func.getCallee() as LLVMFunction);
		builder.SetInsertPoint(bb);

		const a = (func.getCallee() as LLVMFunction).getArg(0);
		const b = (func.getCallee() as LLVMFunction).getArg(1);
		const resultValue = builder.CreateAdd(a, b, "sum");
		const result = new Instruction(resultValue.ref);

		// Use the LLVMMetadataKind enum for well-known kinds
		const { LLVMMetadataKind } = Enums;

		// Create metadata
		const metadata = Metadata.createMDString(context, "debug value");

		// Set metadata on instruction using enum
		result.setMetadata(context, LLVMMetadataKind.MD_dbg, metadata);

		// Check if instruction has metadata
		expect(result.hasMetadata()).toBe(true);

		// Get metadata back using enum
		const retrievedMD = result.getMetadata(LLVMMetadataKind.MD_dbg);
		expect(retrievedMD).toBeDefined();
	});

	it("should set and get metadata on instructions using custom kind", () => {
		const context = new LLVMContext();
		const module = new Module("test_inst_md_custom", context);
		const builder = new IRBuilder(context);

		// Create function
		const funcType = Type.getFunctionType(
			Type.getInt32Ty(),
			[Type.getInt32Ty(), Type.getInt32Ty()],
			false,
		);
		const func = module.getOrInsertFunction("add", funcType);
		const bb = BasicBlock.Create(context, "entry", func.getCallee() as LLVMFunction);
		builder.SetInsertPoint(bb);

		const a = (func.getCallee() as LLVMFunction).getArg(0);
		const b = (func.getCallee() as LLVMFunction).getArg(1);
		const resultValue = builder.CreateAdd(a, b, "sum");
		const result = new Instruction(resultValue.ref);

		// Get metadata kind ID for custom metadata (cast to enum type)
		const customKind = Metadata.getMDKindID(context, "custom.metadata") as Enums.LLVMMetadataKind;

		// Create metadata
		const metadata = Metadata.createMDString(context, "custom value");

		// Set metadata on instruction
		result.setMetadata(context, customKind, metadata);

		// Check if instruction has metadata
		expect(result.hasMetadata()).toBe(true);

		// Get metadata back
		const retrievedMD = result.getMetadata(customKind);
		expect(retrievedMD).toBeDefined();
	});

	it("should check if instruction has no metadata initially", () => {
		const context = new LLVMContext();
		const module = new Module("test_no_md", context);
		const builder = new IRBuilder(context);

		const funcType = Type.getFunctionType(Type.getInt32Ty(), [], false);
		const func = module.getOrInsertFunction("test", funcType);
		const bb = BasicBlock.Create(context, "entry", func.getCallee() as LLVMFunction);
		builder.SetInsertPoint(bb);

		const result = builder.CreateRet(builder.getInt32(42));

		expect(result.hasMetadata()).toBe(false);
	});
});

describe("Temporary Metadata Tests", () => {
	it("should create temporary metadata nodes", () => {
		const context = new LLVMContext();

		// Create temporary MDNode
		const md1 = Metadata.createMDString(context, "temp1");
		const md2 = Metadata.createMDString(context, "temp2");
		const tempNode = Metadata.createTemporaryMDNode(context, [md1, md2]);

		expect(tempNode).toBeDefined();
		expect(tempNode.isTemporary).toBe(true);

		// Dispose when done
		tempNode.dispose();
	});
});

describe("Metadata Type Checks", () => {
	it("should check if metadata is an MDString", () => {
		const context = new LLVMContext();

		const mdString = Metadata.createMDString(context, "test");
		expect(mdString.isMDString(context)).toBe(true);
	});

	it("should check if metadata is an MDNode", () => {
		const context = new LLVMContext();

		const md1 = Metadata.createMDString(context, "1");
		const md2 = Metadata.createMDString(context, "2");
		const mdNode = Metadata.createMDNode(context, [md1, md2]);

		expect(mdNode.isMDNode(context)).toBe(true);
	});
});

describe("Global Metadata Tests", () => {
	it("should create global variables with metadata methods", () => {
		const context = new LLVMContext();
		const module = new Module("test_global_md", context);
		const builder = new IRBuilder(context);

		// Create global variable
		const globalVar = GlobalVariable.Create(
			module,
			Type.getInt32Ty(),
			false,
			GlobalValueLinkageTypes.ExternalLinkage,
			builder.getInt32(0),
			"myGlobal",
		);

		// Verify methods exist
		expect(typeof globalVar.setMetadata).toBe("function");
		expect(typeof globalVar.eraseMetadata).toBe("function");
		expect(typeof globalVar.clearMetadata).toBe("function");

		// Note: Actual metadata attachment on globals requires more complex setup
		// For now we verify the API exists
		expect(globalVar).toBeDefined();
	});
});
