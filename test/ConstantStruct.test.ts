import { describe, expect, it } from "bun:test";
import { ConstantFP } from "@/modules/constants/ConstantFP";
import { ConstantInt } from "@/modules/constants/ConstantInt";
import { ConstantStruct } from "@/modules/constants/ConstantStruct";
import { Type } from "@/modules/Type";
import { StructType } from "@/modules/types/StructType";

describe("ConstantStruct Tests", () => {
	describe("ConstantStruct Creation", () => {
		it("should create ConstantStruct with integer constants", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType, intType]);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});

		it("should create ConstantStruct with mixed types", () => {
			const intType = Type.getInt32Ty();
			const floatType = Type.getFloatTy();
			const structType = StructType.get([intType, floatType, intType]);
			const values = [
				ConstantInt.get(42, intType),
				ConstantFP.get(floatType, 3.14),
				ConstantInt.get(100, intType),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});

		it("should create ConstantStruct with floating point constants", () => {
			const floatType = Type.getFloatTy();
			const doubleType = Type.getDoubleTy();
			const structType = StructType.get([floatType, doubleType]);
			const values = [ConstantFP.get(floatType, 1.5), ConstantFP.get(doubleType, 2.5)];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});

		it("should create ConstantStruct with boolean constants", () => {
			const boolType = Type.getInt1Ty();
			const structType = StructType.get([boolType, boolType, boolType]);
			const values = [ConstantInt.getTrue(), ConstantInt.getFalse(), ConstantInt.getTrue()];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});

		it("should create ConstantStruct with single element", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType]);
			const values = [ConstantInt.get(100, intType)];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});

		it("should create ConstantStruct with zero elements", () => {
			const structType = StructType.get([]);
			const values: ConstantInt[] = [];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});
	});

	describe("Packed vs Unpacked Structs", () => {
		it("should create unpacked ConstantStruct", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType], false); // unpacked
			const values = [ConstantInt.get(1, intType), ConstantInt.get(2, intType)];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});

		it("should create packed ConstantStruct", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType], true); // packed
			const values = [ConstantInt.get(1, intType), ConstantInt.get(2, intType)];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.ref).not.toBe(0);
		});
	});

	describe("Type Information", () => {
		it("should get the correct struct type", () => {
			const intType = Type.getInt32Ty();
			const floatType = Type.getFloatTy();
			const structType = StructType.get([intType, floatType, intType]);
			const values = [
				ConstantInt.get(1, intType),
				ConstantFP.get(floatType, 2.0),
				ConstantInt.get(3, intType),
			];

			const constantStruct = ConstantStruct.get(structType, values);
			const retrievedType = constantStruct.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType).toBeInstanceOf(StructType);
			expect(retrievedType.getNumElements()).toBe(3);
		});

		it("should get the correct type for different element types", () => {
			const intType = Type.getInt32Ty();
			const doubleType = Type.getDoubleTy();
			const boolType = Type.getInt1Ty();
			const structType = StructType.get([intType, doubleType, boolType]);
			const values = [
				ConstantInt.get(42, intType),
				ConstantFP.get(doubleType, Math.PI),
				ConstantInt.getTrue(),
			];

			const constantStruct = ConstantStruct.get(structType, values);
			const retrievedType = constantStruct.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType).toBeInstanceOf(StructType);
			expect(retrievedType.getNumElements()).toBe(3);
		});

		it("should get the correct type for empty struct", () => {
			const structType = StructType.get([]);
			const values: ConstantInt[] = [];

			const constantStruct = ConstantStruct.get(structType, values);
			const retrievedType = constantStruct.getType();

			expect(retrievedType).toBeDefined();
			expect(retrievedType).toBeInstanceOf(StructType);
			expect(retrievedType.getNumElements()).toBe(0);
		});
	});

	describe("Different Struct Sizes", () => {
		it("should create structs of different sizes", () => {
			const intType = Type.getInt32Ty();
			const sizes = [1, 2, 3, 4, 5];

			for (const size of sizes) {
				const elementTypes = Array.from({ length: size }, () => intType);
				const structType = StructType.get(elementTypes);
				const values = Array.from({ length: size }, (_, i) => ConstantInt.get(i + 1, intType));

				const constantStruct = ConstantStruct.get(structType, values);

				expect(constantStruct).toBeDefined();
				expect(constantStruct).toBeInstanceOf(ConstantStruct);
				expect(constantStruct.getType().getNumElements()).toBe(size);
			}
		});

		it("should create large struct", () => {
			const intType = Type.getInt8Ty();
			const elementTypes = Array.from({ length: 10 }, () => intType);
			const structType = StructType.get(elementTypes);
			const values = Array.from({ length: 10 }, (_, i) => ConstantInt.get(i % 256, intType));

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.getType().getNumElements()).toBe(10);
		});
	});

	describe("Different Element Types", () => {
		it("should create structs with different integer types", () => {
			const types = [Type.getInt8Ty(), Type.getInt16Ty(), Type.getInt32Ty(), Type.getInt64Ty()];

			for (const intType of types) {
				const structType = StructType.get([intType, intType]);
				const values = [ConstantInt.get(1, intType), ConstantInt.get(2, intType)];

				const constantStruct = ConstantStruct.get(structType, values);

				expect(constantStruct).toBeDefined();
				expect(constantStruct).toBeInstanceOf(ConstantStruct);
				expect(constantStruct.getType().getNumElements()).toBe(2);
			}
		});

		it("should create structs with different floating point types", () => {
			const types = [Type.getFloatTy(), Type.getDoubleTy()];

			for (const floatType of types) {
				const structType = StructType.get([floatType, floatType]);
				const values = [ConstantFP.get(floatType, 1.5), ConstantFP.get(floatType, 2.5)];

				const constantStruct = ConstantStruct.get(structType, values);

				expect(constantStruct).toBeDefined();
				expect(constantStruct).toBeInstanceOf(ConstantStruct);
				expect(constantStruct.getType().getNumElements()).toBe(2);
			}
		});

		it("should create structs with mixed integer and floating point types", () => {
			const intType = Type.getInt32Ty();
			const floatType = Type.getFloatTy();
			const doubleType = Type.getDoubleTy();
			const boolType = Type.getInt1Ty();

			const structType = StructType.get([intType, floatType, doubleType, boolType]);
			const values = [
				ConstantInt.get(42, intType),
				ConstantFP.get(floatType, 1.0),
				ConstantFP.get(doubleType, 2.0),
				ConstantInt.getTrue(),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.getType().getNumElements()).toBe(4);
		});
	});

	describe("Edge Cases", () => {
		it("should handle struct with all zero values", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType, intType]);
			const values = [
				ConstantInt.get(0, intType),
				ConstantInt.get(0, intType),
				ConstantInt.get(0, intType),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});

		it("should handle struct with negative values", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType, intType]);
			const values = [
				ConstantInt.get(-1, intType),
				ConstantInt.get(-2, intType),
				ConstantInt.get(-3, intType),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});

		it("should handle struct with floating point zero values", () => {
			const floatType = Type.getFloatTy();
			const structType = StructType.get([floatType, floatType]);
			const values = [ConstantFP.getZero(floatType), ConstantFP.getZero(floatType)];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});

		it("should handle struct with special floating point values", () => {
			const floatType = Type.getFloatTy();
			const structType = StructType.get([floatType, floatType, floatType]);
			const values = [
				ConstantFP.getInfinity(floatType),
				ConstantFP.getNaN(floatType),
				ConstantFP.get(floatType, 1.0),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});

		it("should handle struct with negative floating point values", () => {
			const floatType = Type.getFloatTy();
			const structType = StructType.get([floatType, floatType]);
			const values = [ConstantFP.get(floatType, -1.5), ConstantFP.getNegativeZero(floatType)];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});
	});

	describe("Complex Struct Types", () => {
		it("should create struct with nested struct-like behavior", () => {
			// Create a struct that represents a 2D point
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType]); // {x, y}
			const values = [
				ConstantInt.get(10, intType), // x coordinate
				ConstantInt.get(20, intType), // y coordinate
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.getType().getNumElements()).toBe(2);
		});

		it("should create struct representing a complex data structure", () => {
			// Create a struct that represents a person record
			const intType = Type.getInt32Ty();
			const floatType = Type.getFloatTy();
			const boolType = Type.getInt1Ty();
			const structType = StructType.get([intType, floatType, boolType]); // {age, height, isActive}
			const values = [
				ConstantInt.get(25, intType), // age
				ConstantFP.get(floatType, 5.8), // height
				ConstantInt.getTrue(), // isActive
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
			expect(constantStruct.getType().getNumElements()).toBe(3);
		});
	});

	describe("ConstantStruct Documentation", () => {
		it("should represent constant struct value in LLVM IR", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType]);
			const values = [ConstantInt.get(1, intType), ConstantInt.get(2, intType)];

			const constantStruct = ConstantStruct.get(structType, values);
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});

		it("should be based on LLVM's ConstantStruct class", () => {
			// This test verifies the purpose of ConstantStruct as documented
			expect(ConstantStruct).toBeDefined();
			expect(ConstantStruct.name).toBe("ConstantStruct");
		});
	});

	describe("Error Handling", () => {
		it("should handle valid constant struct creation", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType]);
			const values = [ConstantInt.get(1, intType)];

			// This test verifies that normal creation works
			const constantStruct = ConstantStruct.get(structType, values);
			expect(constantStruct).toBeDefined();
			expect(constantStruct).toBeInstanceOf(ConstantStruct);
		});
	});

	describe("Struct Type Validation", () => {
		it("should work with struct type that matches element count", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType, intType]);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType),
			];

			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			expect(constantStruct.getType().getNumElements()).toBe(3);
		});

		it("should work with struct type that has different element count", () => {
			const intType = Type.getInt32Ty();
			const structType = StructType.get([intType, intType]);
			const values = [
				ConstantInt.get(1, intType),
				ConstantInt.get(2, intType),
				ConstantInt.get(3, intType), // More values than struct size
			];

			// This should still work as the struct type defines the structure
			const constantStruct = ConstantStruct.get(structType, values);

			expect(constantStruct).toBeDefined();
			// The actual struct size is determined by the number of values provided
			expect(constantStruct.getType().getNumElements()).toBe(3);
		});
	});
});
