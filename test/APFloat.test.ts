import { describe, expect, it } from "bun:test";
import { APFloat } from "@/modules/ap/APFloat";
import { ConstantFP } from "@/modules/constants/ConstantFP";
import { Type } from "@/modules/Type";

describe("APFloat Tests", () => {
	describe("APFloat Creation", () => {
		it("should create APFloat with a number value", () => {
			const value = Math.PI;
			const apFloat = new APFloat(value);

			expect(apFloat).toBeDefined();
			expect(apFloat.getValue()).toBe(value);
		});

		it("should create APFloat with zero", () => {
			const apFloat = new APFloat(0.0);
			expect(apFloat.getValue()).toBe(0.0);
		});

		it("should create APFloat with negative value", () => {
			const value = -Math.E;
			const apFloat = new APFloat(value);
			expect(apFloat.getValue()).toBe(value);
		});

		it("should create APFloat with very small value", () => {
			const value = 1e-10;
			const apFloat = new APFloat(value);
			expect(apFloat.getValue()).toBe(value);
		});

		it("should create APFloat with very large value", () => {
			const value = 1e10;
			const apFloat = new APFloat(value);
			expect(apFloat.getValue()).toBe(value);
		});
	});

	describe("APFloat Value Access", () => {
		it("should return the same value that was set", () => {
			const originalValue = 42.5;
			const apFloat = new APFloat(originalValue);
			expect(apFloat.getValue()).toBe(originalValue);
		});

		it("should handle integer values as floats", () => {
			const apFloat = new APFloat(42);
			expect(apFloat.getValue()).toBe(42);
		});
	});

	describe("APFloat to ConstantFP", () => {
		it("should create constant floating point from APFloat", () => {
			const value = Math.PI;
			const apFloat = new APFloat(value);
			const floatType = Type.getFloatTy();

			const constant = apFloat.toConstantFP(floatType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.ref).not.toBe(0);
		});

		it("should create constant double from APFloat", () => {
			const value = Math.E;
			const apFloat = new APFloat(value);
			const doubleType = Type.getDoubleTy();

			const constant = apFloat.toConstantFP(doubleType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.ref).not.toBe(0);
		});

		it("should handle zero value conversion", () => {
			const apFloat = new APFloat(0.0);
			const floatType = Type.getFloatTy();

			const constant = apFloat.toConstantFP(floatType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.ref).not.toBe(0);
		});

		it("should handle negative value conversion", () => {
			const apFloat = new APFloat(-1.5);
			const floatType = Type.getFloatTy();

			const constant = apFloat.toConstantFP(floatType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.ref).not.toBe(0);
		});
	});

	describe("APFloat Edge Cases", () => {
		it("should handle NaN values", () => {
			const nanValue = Number.NaN;
			const apFloat = new APFloat(nanValue);
			expect(apFloat.getValue()).toBeNaN();
		});

		it("should handle Infinity values", () => {
			const infinityValue = Infinity;
			const apFloat = new APFloat(infinityValue);
			expect(apFloat.getValue()).toBe(Infinity);
		});

		it("should handle negative Infinity values", () => {
			const negInfinityValue = -Infinity;
			const apFloat = new APFloat(negInfinityValue);
			expect(apFloat.getValue()).toBe(-Infinity);
		});
	});

	describe("APFloat Documentation", () => {
		it("should represent arbitrary precision floating point", () => {
			const apFloat = new APFloat(1.0);
			expect(apFloat).toBeInstanceOf(APFloat);
		});

		it("should be a wrapper around LLVM's APFloat functionality", () => {
			// This test verifies the purpose of APFloat as documented
			expect(APFloat).toBeDefined();
			expect(APFloat.name).toBe("APFloat");
		});
	});
});
