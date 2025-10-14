import { describe, expect, it } from "bun:test";
import { TypeSize } from "@/modules/TypeSize";

describe("TypeSize", () => {
	describe("Factory Methods", () => {
		it("should create fixed TypeSize", () => {
			const size = TypeSize.getFixed(32);
			expect(size.getFixedValue()).toBe(32);
			expect(size.isFixed()).toBe(true);
			expect(size.isScalable()).toBe(false);
		});

		it("should create scalable TypeSize", () => {
			const size = TypeSize.getScalable(16);
			expect(size.getFixedValue()).toBe(16);
			expect(size.isFixed()).toBe(false);
			expect(size.isScalable()).toBe(true);
		});

		it("should create TypeSize with both components", () => {
			const size = TypeSize.get(8, 4);
			expect(size.getFixedValue()).toBe(8);
			expect(size.isScalable()).toBe(true);
		});
	});

	describe("Basic Properties", () => {
		it("should handle zero values", () => {
			const zero = TypeSize.getFixed(0);
			expect(zero.isZero()).toBe(true);
			expect(zero.isNonZero()).toBe(false);
			expect(zero.valueOf()).toBe(false);
		});

		it("should handle non-zero values", () => {
			const nonZero = TypeSize.getFixed(64);
			expect(nonZero.isZero()).toBe(false);
			expect(nonZero.isNonZero()).toBe(true);
			expect(nonZero.valueOf()).toBe(true);
		});

		it("should check if value is even", () => {
			const even = TypeSize.getFixed(32);
			const odd = TypeSize.getFixed(31);
			expect(even.isKnownEven()).toBe(true);
			expect(odd.isKnownEven()).toBe(false);
		});

		it("should check multiples", () => {
			const size = TypeSize.getFixed(64);
			expect(size.isKnownMultipleOf(8)).toBe(true);
			expect(size.isKnownMultipleOf(7)).toBe(false);
			expect(size.isKnownMultipleOf(0)).toBe(false);
		});
	});

	describe("Arithmetic Operations", () => {
		it("should add fixed sizes", () => {
			const a = TypeSize.getFixed(32);
			const b = TypeSize.getFixed(16);
			const result = a.add(b);
			expect(result.getFixedValue()).toBe(48);
			expect(result.isFixed()).toBe(true);
		});

		it("should add scalable sizes", () => {
			const a = TypeSize.getScalable(8);
			const b = TypeSize.getScalable(4);
			const result = a.add(b);
			expect(result.getFixedValue()).toBe(12);
			expect(result.isScalable()).toBe(true);
		});

		it("should subtract fixed sizes", () => {
			const a = TypeSize.getFixed(32);
			const b = TypeSize.getFixed(16);
			const result = a.subtract(b);
			expect(result.getFixedValue()).toBe(16);
			expect(result.isFixed()).toBe(true);
		});

		it("should multiply by scalar", () => {
			const size = TypeSize.getFixed(16);
			const result = size.multiply(2);
			expect(result.getFixedValue()).toBe(32);
			expect(result.isFixed()).toBe(true);
		});

		it("should divide by scalar", () => {
			const size = TypeSize.getFixed(64);
			const result = size.divide(8);
			expect(result.getFixedValue()).toBe(8);
			expect(result.isFixed()).toBe(true);
		});

		it("should negate", () => {
			const size = TypeSize.getFixed(32);
			const result = size.negate();
			expect(result.getFixedValue()).toBe(-32);
			expect(result.isFixed()).toBe(true);
		});

		it("should throw error when adding incompatible sizes", () => {
			const fixed = TypeSize.getFixed(32);
			const scalable = TypeSize.getScalable(16);
			expect(() => fixed.add(scalable)).toThrow("Cannot add incompatible TypeSize values");
		});

		it("should throw error when dividing by zero", () => {
			const size = TypeSize.getFixed(32);
			expect(() => size.divide(0)).toThrow("Cannot divide by zero");
		});
	});

	describe("Comparisons", () => {
		it("should compare fixed sizes", () => {
			const a = TypeSize.getFixed(32);
			const b = TypeSize.getFixed(16);
			const c = TypeSize.getFixed(32);

			expect(a.isKnownLessThan(b)).toBe(false);
			expect(b.isKnownLessThan(a)).toBe(true);
			expect(a.isKnownGreaterThan(b)).toBe(true);
			expect(b.isKnownGreaterThan(a)).toBe(false);
			expect(a.equals(c)).toBe(true);
			expect(a.equals(b)).toBe(false);
		});

		it("should not compare scalable sizes", () => {
			const scalable = TypeSize.getScalable(16);
			const fixed = TypeSize.getFixed(16);

			expect(scalable.isKnownLessThan(fixed)).toBe(false);
			expect(scalable.isKnownGreaterThan(fixed)).toBe(false);
		});
	});

	describe("String Representations", () => {
		it("should convert fixed size to string", () => {
			const size = TypeSize.getFixed(32);
			expect(size.toString()).toBe("32");
		});

		it("should convert scalable size to string", () => {
			const size = TypeSize.getScalable(16);
			expect(size.toString()).toBe("16 * vscale");
		});
	});

	describe("Multiple Operations", () => {
		it("should check if TypeSize is multiple of another TypeSize", () => {
			const a = TypeSize.getFixed(64);
			const b = TypeSize.getFixed(8);
			const c = TypeSize.getFixed(7);

			expect(a.isKnownMultipleOfTypeSize(b)).toBe(true);
			expect(a.isKnownMultipleOfTypeSize(c)).toBe(false);
		});

		it("should handle complex arithmetic", () => {
			const a = TypeSize.getFixed(32);
			const b = TypeSize.getFixed(16);
			const result = a.add(b).multiply(2).divide(4);

			expect(result.getFixedValue()).toBe(24);
			expect(result.isFixed()).toBe(true);
		});
	});
});
