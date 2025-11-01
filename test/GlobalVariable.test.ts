import { beforeEach, describe, expect, it } from "bun:test";
import { ConstantInt } from "@/modules/constants/ConstantInt";
import { GlobalValue } from "@/modules/GlobalValue";
import { GlobalVariable } from "@/modules/GlobalVariable";
import { Module } from "@/modules/Module";
import { Type } from "@/modules/Type";

describe("GlobalVariable Tests", () => {
	let module: Module;

	beforeEach(() => {
		module = new Module("test_module");
	});

	describe("GlobalVariable Creation", () => {
		it("should create a basic global variable", () => {
			const globalVar = GlobalVariable.Create(
				module,
				Type.getInt32Ty(),
				false, // not constant
				0, // external linkage
			);

			expect(globalVar).toBeDefined();
			expect(globalVar).toBeInstanceOf(GlobalVariable);
			expect(globalVar).toBeInstanceOf(GlobalValue);
		});

		it("should create a global variable with initializer", () => {
			const initializer = ConstantInt.get(42, Type.getInt32Ty());
			const globalVar = GlobalVariable.Create(
				module,
				Type.getInt32Ty(),
				false,
				0,
				initializer,
				"my_global",
			);

			expect(globalVar).toBeDefined();
			expect(globalVar.hasInitializer()).toBe(true);
			const retrievedInit = globalVar.getInitializer();
			expect(retrievedInit).toBeDefined();
		});

		it("should create a constant global variable", () => {
			const initializer = ConstantInt.get(100, Type.getInt32Ty());
			const globalVar = GlobalVariable.Create(
				module,
				Type.getInt32Ty(),
				true, // constant
				0,
				initializer,
				"my_constant",
			);

			expect(globalVar.isConstant()).toBe(true);
		});

		it("should create a global variable with custom address space", () => {
			const globalVar = GlobalVariable.Create(
				module,
				Type.getInt32Ty(),
				false,
				0,
				null,
				"global_addrspace",
				GlobalVariable.ThreadLocalMode.NotThreadLocal,
				1, // address space 1
			);

			expect(globalVar).toBeDefined();
		});

		it("should create a thread-local global variable", () => {
			const globalVar = GlobalVariable.Create(
				module,
				Type.getInt32Ty(),
				false,
				0,
				null,
				"thread_local_var",
				GlobalVariable.ThreadLocalMode.GeneralDynamicTLSModel,
			);

			expect(globalVar).toBeDefined();
			expect(globalVar.isThreadLocal()).toBe(true);
		});
	});

	describe("GlobalVariable Initializer Management", () => {
		it("should check if global variable has no initializer", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			expect(globalVar.hasInitializer()).toBe(false);
		});

		it("should set and get initializer", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);
			const initializer = ConstantInt.get(123, Type.getInt32Ty());

			globalVar.setInitializer(initializer);

			expect(globalVar.hasInitializer()).toBe(true);
			const retrieved = globalVar.getInitializer();
			expect(retrieved).toBeDefined();
		});

		it("should remove initializer by setting null", () => {
			const initializer = ConstantInt.get(42, Type.getInt32Ty());
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, initializer);

			expect(globalVar.hasInitializer()).toBe(true);

			globalVar.setInitializer(null);

			expect(globalVar.hasInitializer()).toBe(false);
		});
	});

	describe("GlobalVariable Constant Status", () => {
		it("should get and set constant status", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			expect(globalVar.isConstant()).toBe(false);

			globalVar.setConstant(true);
			expect(globalVar.isConstant()).toBe(true);

			globalVar.setConstant(false);
			expect(globalVar.isConstant()).toBe(false);
		});
	});

	describe("GlobalVariable Thread Local", () => {
		it("should get and set thread local status", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			expect(globalVar.isThreadLocal()).toBe(false);

			globalVar.setThreadLocal(true);
			expect(globalVar.isThreadLocal()).toBe(true);
		});

		it("should get and set thread local mode", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			globalVar.setThreadLocalMode(GlobalVariable.ThreadLocalMode.LocalDynamicTLSModel);
			expect(globalVar.getThreadLocalMode()).toBe(
				GlobalVariable.ThreadLocalMode.LocalDynamicTLSModel,
			);
		});
	});

	describe("GlobalVariable Externally Initialized", () => {
		it("should get and set externally initialized status", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			expect(globalVar.isExternallyInitialized()).toBe(false);

			globalVar.setExternallyInitialized(true);
			expect(globalVar.isExternallyInitialized()).toBe(true);
		});

		it("should create externally initialized global variable", () => {
			const globalVar = GlobalVariable.Create(
				module,
				Type.getInt32Ty(),
				false,
				0,
				null,
				"ext_init",
				GlobalVariable.ThreadLocalMode.NotThreadLocal,
				0,
				true, // externally initialized
			);

			expect(globalVar.isExternallyInitialized()).toBe(true);
		});
	});

	describe("GlobalVariable Linkage and Visibility", () => {
		it("should get and set linkage", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			const linkage = globalVar.getLinkage();
			expect(linkage).toBeDefined();

			globalVar.setLinkage(8); // Internal linkage
			expect(globalVar.getLinkage()).toBe(8);
		});

		it("should get and set visibility", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			const visibility = globalVar.getVisibility();
			expect(visibility).toBeDefined();

			globalVar.setVisibility(GlobalValue.VisibilityTypes.HiddenVisibility);
			expect(globalVar.getVisibility()).toBe(GlobalValue.VisibilityTypes.HiddenVisibility);
		});
	});

	describe("GlobalVariable Static Methods", () => {
		it("should get named global from module", () => {
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "my_named_global");

			const found = GlobalVariable.GetNamedGlobal(module, "my_named_global");
			expect(found).toBeDefined();
			expect(found).toBeInstanceOf(GlobalVariable);
		});

		it("should return null for non-existent named global", () => {
			const found = GlobalVariable.GetNamedGlobal(module, "non_existent");
			expect(found).toBeNull();
		});

		it("should get first global from module", () => {
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "first");
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "second");

			const first = GlobalVariable.GetFirstGlobal(module);
			expect(first).toBeDefined();
			expect(first).toBeInstanceOf(GlobalVariable);
		});

		it("should get last global from module", () => {
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "first");
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "second");

			const last = GlobalVariable.GetLastGlobal(module);
			expect(last).toBeDefined();
			expect(last).toBeInstanceOf(GlobalVariable);
		});
	});

	describe("GlobalVariable Navigation", () => {
		it("should navigate through global variables", () => {
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "global1");
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "global2");
			GlobalVariable.Create(module, Type.getInt32Ty(), false, 0, null, "global3");

			const first = GlobalVariable.GetFirstGlobal(module);
			expect(first).toBeDefined();

			const second = first?.getNextGlobal();
			expect(second).toBeDefined();

			const third = second?.getNextGlobal();
			expect(third).toBeDefined();

			const backToSecond = third?.getPreviousGlobal();
			expect(backToSecond).toBeDefined();
		});
	});

	describe("GlobalVariable Alignment", () => {
		it("should get and set alignment", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			globalVar.setAlignment(8);
			const alignment = globalVar.getAlignment();
			expect(alignment).toBe(8);
		});
	});

	describe("GlobalVariable Value Type", () => {
		it("should get value type", () => {
			const globalVar = GlobalVariable.Create(module, Type.getInt32Ty(), false, 0);

			const valueType = globalVar.getValueType();
			expect(valueType).toBeDefined();
			expect(valueType).toBeInstanceOf(Type);
		});
	});
});
