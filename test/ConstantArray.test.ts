import { describe, expect, it } from "bun:test";
import { ConstantArray } from "@/modules/constants/ConstantArray";
import { ConstantFP } from "@/modules/constants/ConstantFP";
import { ConstantInt } from "@/modules/constants/ConstantInt";
import { Type } from "@/modules/Type";
import { ArrayType } from "@/modules/types/ArrayType";

describe("ConstantArray Tests", () => {
	describe("ConstantArray Creation", () => {
		it("should create ConstantArray with integer constants", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 3);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType),
			];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
			expect(constantArray.ref).not.toBe(0);
		});

		it("should create ConstantArray with floating point constants", () => {
			const floatType = Type.getFloatTy();
			const arrayType = ArrayType.get(floatType, 2);
			const values = [ConstantFP.get(floatType, 1.5), ConstantFP.get(floatType, 2.5)];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
			expect(constantArray.ref).not.toBe(0);
		});

		it("should create ConstantArray with integer constants", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 2);
			const values = [ConstantInt.get(42, intType), ConstantInt.get(84, intType)];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should create ConstantArray with single element", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 1);
			const values = [ConstantInt.get(100, intType)];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should create ConstantArray with zero elements", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 0);
			const values: ConstantInt[] = [];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should create ConstantArray with boolean constants", () => {
			const boolType = Type.getInt1Ty();
			const arrayType = ArrayType.get(boolType, 2);
			const values = [ConstantInt.getTrue(), ConstantInt.getFalse()];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});
	});

	describe("Type Information", () => {
		it("should get the correct array type", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 3);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType),
			];

			const constantArray = ConstantArray.get(arrayType, values);
			const retrievedType = constantArray.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType).toBeInstanceOf(ArrayType);
			expect(retrievedType.getElementType().ref).toBe(intType.ref);
			expect(retrievedType.getNumElements()).toBe(3n);
		});

		it("should get the correct type for different element types", () => {
			const floatType = Type.getFloatTy();
			const arrayType = ArrayType.get(floatType, 2);
			const values = [ConstantFP.get(floatType, 1.0), ConstantFP.get(floatType, 2.0)];

			const constantArray = ConstantArray.get(arrayType, values);
			const retrievedType = constantArray.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType).toBeInstanceOf(ArrayType);
			expect(retrievedType.getElementType().ref).toBe(floatType.ref);
			expect(retrievedType.getNumElements()).toBe(2n);
		});

		it("should get the correct type for boolean array", () => {
			const boolType = Type.getInt1Ty();
			const arrayType = ArrayType.get(boolType, 4);
			const values = [
				ConstantInt.getTrue(),
				ConstantInt.getFalse(),
				ConstantInt.getTrue(),
				ConstantInt.getFalse(),
			];

			const constantArray = ConstantArray.get(arrayType, values);
			const retrievedType = constantArray.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType).toBeInstanceOf(ArrayType);
			expect(retrievedType.getElementType().isIntegerTy()).toBe(true);
			expect(retrievedType.getNumElements()).toBe(4n);
		});
	});

	describe("Different Array Sizes", () => {
		it("should create arrays of different sizes", () => {
			const intType = Type.getInt32Ty();
			const sizes = [1, 2, 3];

			for (const size of sizes) {
				const arrayType = ArrayType.get(intType, size);
				const values = Array.from({ length: size }, (_, i) => ConstantInt.get(i + 1, intType));

				const constantArray = ConstantArray.get(arrayType, values);

				expect(constantArray).toBeDefined();
				expect(constantArray).toBeInstanceOf(ConstantArray);
				expect(constantArray.getType().getNumElements()).toBe(BigInt(size));
			}
		});

		it("should create medium array", () => {
			const intType = Type.getInt8Ty();
			const arrayType = ArrayType.get(intType, 10);
			const values = Array.from({ length: 10 }, (_, i) => ConstantInt.get(i % 256, intType));

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
			expect(constantArray.getType().getNumElements()).toBe(10n);
		});
	});

	describe("Different Element Types", () => {
		it("should create arrays with different integer types", () => {
			const types = [Type.getInt8Ty(), Type.getInt16Ty(), Type.getInt32Ty(), Type.getInt64Ty()];

			for (const intType of types) {
				const arrayType = ArrayType.get(intType, 2);
				const values = [ConstantInt.get(1, intType), ConstantInt.get(2, intType)];

				const constantArray = ConstantArray.get(arrayType, values);

				expect(constantArray).toBeDefined();
				expect(constantArray).toBeInstanceOf(ConstantArray);
				expect(constantArray.getType().getElementType().ref).toBe(intType.ref);
			}
		});

		it("should create arrays with different floating point types", () => {
			const types = [Type.getFloatTy(), Type.getDoubleTy()];

			for (const floatType of types) {
				const arrayType = ArrayType.get(floatType, 2);
				const values = [ConstantFP.get(floatType, 1.5), ConstantFP.get(floatType, 2.5)];

				const constantArray = ConstantArray.get(arrayType, values);

				expect(constantArray).toBeDefined();
				expect(constantArray).toBeInstanceOf(ConstantArray);
				expect(constantArray.getType().getElementType().ref).toBe(floatType.ref);
			}
		});
	});

	describe("Edge Cases", () => {
		it("should handle array with all zero values", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 3);
			const values = [
				ConstantInt.get(0, intType),
				ConstantInt.get(0, intType),
				ConstantInt.get(0, intType),
			];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should handle array with negative values", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 3);
			const values = [
				ConstantInt.get(-1, intType),
				ConstantInt.get(-2, intType),
				ConstantInt.get(-3, intType),
			];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should handle array with floating point zero values", () => {
			const floatType = Type.getFloatTy();
			const arrayType = ArrayType.get(floatType, 2);
			const values = [ConstantFP.getZero(floatType), ConstantFP.getZero(floatType)];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should handle array with special floating point values", () => {
			const floatType = Type.getFloatTy();
			const arrayType = ArrayType.get(floatType, 3);
			const values = [
				ConstantFP.getInfinity(floatType),
				ConstantFP.getNaN(floatType),
				ConstantFP.get(floatType, 1.0),
			];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});
	});

	describe("ConstantArray Documentation", () => {
		it("should represent constant array value in LLVM IR", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 2);
			const values = [ConstantInt.get(1, intType), ConstantInt.get(2, intType)];

			const constantArray = ConstantArray.get(arrayType, values);
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});

		it("should be based on LLVM's ConstantArray class", () => {
			// This test verifies the purpose of ConstantArray as documented
			expect(ConstantArray).toBeDefined();
			expect(ConstantArray.name).toBe("ConstantArray");
		});
	});

	describe("Error Handling", () => {
		it("should handle valid constant array creation", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 1);
			const values = [ConstantInt.get(1, intType)];

			// This test verifies that normal creation works
			const constantArray = ConstantArray.get(arrayType, values);
			expect(constantArray).toBeDefined();
			expect(constantArray).toBeInstanceOf(ConstantArray);
		});
	});

	describe("Array Type Validation", () => {
		it("should work with array type that matches element count", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 3);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType),
			];

			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			expect(constantArray.getType().getNumElements()).toBe(3n);
		});

		it("should work with array type that has different element count", () => {
			const intType = Type.getInt32Ty();
			const arrayType = ArrayType.get(intType, 2);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType), // More values than array size
			];

			// This should still work as the array type defines the structure
			const constantArray = ConstantArray.get(arrayType, values);

			expect(constantArray).toBeDefined();
			// The actual array size is determined by the number of values provided
			expect(constantArray.getType().getNumElements()).toBe(3n);
		});
	});
});
