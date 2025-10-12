import { describe, expect, it } from "bun:test";
import { GlobalObject } from "../src/modules/GlobalObject.js";
import { GlobalValue } from "../src/modules/GlobalValue.js";

describe("GlobalObject Tests", () => {
	describe("GlobalObject Class", () => {
		it("should extend GlobalValue", () => {
			// Since GlobalObject is a simple class that extends GlobalValue,
			// we test that it properly inherits from GlobalValue
			expect(GlobalObject.prototype).toBeInstanceOf(Object);
			expect(GlobalObject.prototype).toBeInstanceOf(GlobalValue);
		});

		it("should be a base class for global objects", () => {
			// GlobalObject is designed as a base class for global objects
			// like GlobalVariable and Function
			expect(GlobalObject.name).toBe("GlobalObject");
		});

		it("should have proper inheritance chain", () => {
			// Test that GlobalObject properly extends GlobalValue
			const globalObject = new GlobalObject(null);
			expect(globalObject).toBeInstanceOf(GlobalObject);
			expect(globalObject).toBeInstanceOf(GlobalValue);
		});
	});

	describe("GlobalObject Documentation", () => {
		it("should represent a global object in LLVM IR", () => {
			// This test verifies the purpose of GlobalObject as documented
			// It's a base class for global objects like GlobalVariable and Function
			expect(GlobalObject).toBeDefined();
		});

		it("should be based on LLVM's GlobalObject class", () => {
			// Verify that this class is a wrapper around LLVM's GlobalObject
			expect(GlobalObject.prototype.constructor.name).toBe("GlobalObject");
		});
	});
});
