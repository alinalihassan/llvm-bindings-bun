import { describe, expect, it } from "bun:test";
import { APFloat } from "@/modules/APFloat";
import { ConstantFP } from "@/modules/ConstantFP";
import { Type } from "@/modules/Type";

describe("ConstantFP Tests", () => {
	describe("ConstantFP Creation", () => {
		it("should create ConstantFP with a number value", () => {
			const value = Math.PI;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.ref).not.toBe(0);
		});

		it("should create ConstantFP with zero", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, 0.0);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP with negative value", () => {
			const value = -Math.E;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP with very small value", () => {
			const value = 1e-10;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP with very large value", () => {
			const value = 1e10;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP with float type", () => {
			const value = 3.14;
			const floatType = Type.getFloatTy();
			const constant = ConstantFP.get(floatType, value);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP with half type", () => {
			const value = 1.5;
			const halfType = Type.getHalfTy();
			const constant = ConstantFP.get(halfType, value);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});
	});

	describe("ConstantFP Creation from APFloat", () => {
		it("should create ConstantFP from APFloat", () => {
			const value = Math.PI;
			const apFloat = new APFloat(value);
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, apFloat);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP from APFloat with zero", () => {
			const apFloat = new APFloat(0.0);
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, apFloat);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP from APFloat with negative value", () => {
			const apFloat = new APFloat(-Math.E);
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, apFloat);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});
	});

	describe("ConstantFP Creation from String", () => {
		it("should create ConstantFP from string", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, "3.14159");

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP from string with zero", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, "0.0");

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP from string with negative value", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, "-2.718");

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should create ConstantFP from string with scientific notation", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, "1.23e-4");

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
		});
	});

	describe("Special Value Creation", () => {
		it("should create NaN constant", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.getNaN(doubleType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isNaN()).toBe(true);
		});

		it("should create NaN constant with float type", () => {
			const floatType = Type.getFloatTy();
			const constant = ConstantFP.getNaN(floatType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isNaN()).toBe(true);
		});

		it("should create zero constant", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.getZero(doubleType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isZero()).toBe(true);
		});

		it("should create negative zero constant", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.getNegativeZero(doubleType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isZero()).toBe(true);
			expect(constant.isNegative()).toBe(true);
		});

		it("should create zero constant with negative flag", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.getZero(doubleType, true);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isZero()).toBe(true);
			expect(constant.isNegative()).toBe(true);
		});

		it("should create infinity constant", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.getInfinity(doubleType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isInfinity()).toBe(true);
		});

		it("should create negative infinity constant", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.getInfinity(doubleType, true);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isInfinity()).toBe(true);
			expect(constant.isNegative()).toBe(true);
		});

		it("should create infinity constant with float type", () => {
			const floatType = Type.getFloatTy();
			const constant = ConstantFP.getInfinity(floatType);

			expect(constant).toBeDefined();
			expect(constant).toBeInstanceOf(ConstantFP);
			expect(constant.isInfinity()).toBe(true);
		});
	});

	describe("Value Retrieval", () => {
		it("should get double value", () => {
			const value = Math.PI;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			const { value: retrievedValue, losesInfo } = constant.getDoubleValue();

			expect(typeof retrievedValue).toBe("number");
			expect(typeof losesInfo).toBe("boolean");
			expect(Math.abs(retrievedValue - value)).toBeLessThan(1e-10);
		});

		it("should get double value with precision loss info", () => {
			const value = 1.0 / 3.0; // This might lose precision
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			const { value: retrievedValue, losesInfo } = constant.getDoubleValue();

			expect(typeof retrievedValue).toBe("number");
			expect(typeof losesInfo).toBe("boolean");
		});

		it("should get APFloat value", () => {
			const value = Math.E;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			const apFloat = constant.getValueAPF();

			expect(apFloat).toBeInstanceOf(APFloat);
			expect(Math.abs(apFloat.getValue() - value)).toBeLessThan(1e-10);
		});

		it("should get APFloat value using getValue alias", () => {
			const value = Math.SQRT2;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			const apFloat = constant.getValue();

			expect(apFloat).toBeInstanceOf(APFloat);
			expect(Math.abs(apFloat.getValue() - value)).toBeLessThan(1e-10);
		});
	});

	describe("Value Checking Methods", () => {
		it("should check if value is zero", () => {
			const doubleType = Type.getDoubleTy();
			const zeroConstant = ConstantFP.get(doubleType, 0.0);
			const nonZeroConstant = ConstantFP.get(doubleType, 1.0);

			expect(zeroConstant.isZero()).toBe(true);
			expect(nonZeroConstant.isZero()).toBe(false);
		});

		it("should check if value is negative", () => {
			const doubleType = Type.getDoubleTy();
			const positiveConstant = ConstantFP.get(doubleType, 1.0);
			const negativeConstant = ConstantFP.get(doubleType, -1.0);
			const negZeroConstant = ConstantFP.getNegativeZero(doubleType);

			expect(positiveConstant.isNegative()).toBe(false);
			expect(negativeConstant.isNegative()).toBe(true);
			expect(negZeroConstant.isNegative()).toBe(true);
		});

		it("should check if value is infinity", () => {
			const doubleType = Type.getDoubleTy();
			const infConstant = ConstantFP.getInfinity(doubleType);
			const negInfConstant = ConstantFP.getInfinity(doubleType, true);
			const finiteConstant = ConstantFP.get(doubleType, 1.0);

			expect(infConstant.isInfinity()).toBe(true);
			expect(negInfConstant.isInfinity()).toBe(true);
			expect(finiteConstant.isInfinity()).toBe(false);
		});

		it("should check if value is NaN", () => {
			const doubleType = Type.getDoubleTy();
			const nanConstant = ConstantFP.getNaN(doubleType);
			const finiteConstant = ConstantFP.get(doubleType, 1.0);

			expect(nanConstant.isNaN()).toBe(true);
			expect(finiteConstant.isNaN()).toBe(false);
		});
	});

	describe("Exact Value Comparison", () => {
		it("should compare exact values with APFloat", () => {
			const value = 1.0;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);
			const apFloat = new APFloat(value);

			expect(constant.isExactlyValue(apFloat)).toBe(true);
		});

		it("should compare exact values with different APFloat", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, 1.0);
			const apFloat = new APFloat(2.0);

			expect(constant.isExactlyValue(apFloat)).toBe(false);
		});

		it("should compare exact values with double", () => {
			const value = 1.0;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant.isExactlyValueDouble(value)).toBe(true);
			expect(constant.isExactlyValueDouble(2.0)).toBe(false);
		});

		it("should handle exact comparison with zero", () => {
			const doubleType = Type.getDoubleTy();
			const zeroConstant = ConstantFP.get(doubleType, 0.0);
			const negZeroConstant = ConstantFP.getNegativeZero(doubleType);

			expect(zeroConstant.isExactlyValueDouble(0.0)).toBe(true);
			expect(negZeroConstant.isExactlyValueDouble(-0.0)).toBe(true);
		});
	});

	describe("Type Information", () => {
		it("should get the correct type", () => {
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, 3.14);

			const retrievedType = constant.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType.isFloatingPointTy()).toBe(true);
		});

		it("should get the correct type for float", () => {
			const floatType = Type.getFloatTy();
			const constant = ConstantFP.get(floatType, 3.14);

			const retrievedType = constant.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType.isFloatingPointTy()).toBe(true);
		});

		it("should get the correct type for half", () => {
			const halfType = Type.getHalfTy();
			const constant = ConstantFP.get(halfType, 1.5);

			const retrievedType = constant.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType.isFloatingPointTy()).toBe(true);
		});
	});

	describe("Edge Cases", () => {
		it("should handle NaN values", () => {
			const nanValue = Number.NaN;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, nanValue);

			expect(constant).toBeDefined();
			expect(constant.isNaN()).toBe(true);
		});

		it("should handle Infinity values", () => {
			const infinityValue = Number.POSITIVE_INFINITY;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, infinityValue);

			expect(constant).toBeDefined();
			expect(constant.isInfinity()).toBe(true);
		});

		it("should handle negative Infinity values", () => {
			const negInfinityValue = Number.NEGATIVE_INFINITY;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, negInfinityValue);

			expect(constant).toBeDefined();
			expect(constant.isInfinity()).toBe(true);
			expect(constant.isNegative()).toBe(true);
		});

		it("should handle very small values", () => {
			const value = Number.MIN_VALUE;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant).toBeDefined();
			expect(constant.isZero()).toBe(false);
		});

		it("should handle very large values", () => {
			const value = Number.MAX_VALUE;
			const doubleType = Type.getDoubleTy();
			const constant = ConstantFP.get(doubleType, value);

			expect(constant).toBeDefined();
			expect(constant.isInfinity()).toBe(false);
		});
	});

	describe("Different Floating Point Types", () => {
		it("should work with all floating point types", () => {
			const value = 1.5;
			const types = [Type.getHalfTy(), Type.getBFloatTy(), Type.getFloatTy(), Type.getDoubleTy()];

			for (const type of types) {
				const constant = ConstantFP.get(type, value);
				expect(constant).toBeDefined();
				expect(constant).toBeInstanceOf(ConstantFP);
			}
		});

		it("should create different constants for different types", () => {
			const value = 1.0;
			const floatType = Type.getFloatTy();
			const doubleType = Type.getDoubleTy();

			const floatConstant = ConstantFP.get(floatType, value);
			const doubleConstant = ConstantFP.get(doubleType, value);

			expect(floatConstant.ref).not.toBe(doubleConstant.ref);
		});
	});

	describe("ConstantFP Documentation", () => {
		it("should represent constant floating point value in LLVM IR", () => {
			const constant = ConstantFP.get(Type.getDoubleTy(), 1.0);
			expect(constant).toBeInstanceOf(ConstantFP);
		});

		it("should be based on LLVM's ConstantFP class", () => {
			// This test verifies the purpose of ConstantFP as documented
			expect(ConstantFP).toBeDefined();
			expect(ConstantFP.name).toBe("ConstantFP");
		});
	});

	describe("Error Handling", () => {
		it("should throw error for non-floating point type", () => {
			const intType = Type.getInt32Ty();

			expect(() => {
				ConstantFP.get(intType, 1.0);
			}).toThrow();
		});

		it("should throw error for invalid input type", () => {
			const doubleType = Type.getDoubleTy();

			expect(() => {
				// biome-ignore lint/suspicious/noExplicitAny: testing invalid input
				ConstantFP.get(doubleType, {} as any);
			}).toThrow("Value must be a number, APFloat, or string");
		});

		it("should create NaN for invalid string format", () => {
			const doubleType = Type.getDoubleTy();

			const result = ConstantFP.get(doubleType, "not a valid number");
			expect(result).toBeDefined();
			expect(result).toBeInstanceOf(ConstantFP);
			expect(result.isNaN()).toBe(true);
		});
	});
});
