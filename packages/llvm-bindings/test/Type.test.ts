import { beforeEach, describe, expect, it } from "bun:test";
import { Type } from "../src/modules/Type.js";

describe("Type", () => {
	describe("Basic Type Creation", () => {
		it("should create void type", () => {
			const voidType = Type.getVoidTy();
			expect(voidType).toBeDefined();
			expect(voidType).not.toBe(0);
		});

		it("should create int1 type", () => {
			const int1Type = Type.getInt1Ty();
			expect(int1Type).toBeDefined();
			expect(int1Type).not.toBe(0);
		});

		it("should create int8 type", () => {
			const int8Type = Type.getInt8Ty();
			expect(int8Type).toBeDefined();
			expect(int8Type).not.toBe(0);
		});

		it("should create int16 type", () => {
			const int16Type = Type.getInt16Ty();
			expect(int16Type).toBeDefined();
			expect(int16Type).not.toBe(0);
		});

		it("should create int32 type", () => {
			const int32Type = Type.getInt32Ty();
			expect(int32Type).toBeDefined();
			expect(int32Type).not.toBe(0);
		});

		it("should create int64 type", () => {
			const int64Type = Type.getInt64Ty();
			expect(int64Type).toBeDefined();
			expect(int64Type).not.toBe(0);
		});

		it("should create float type", () => {
			const floatType = Type.getFloatTy();
			expect(floatType).toBeDefined();
			expect(floatType).not.toBe(0);
		});

		it("should create double type", () => {
			const doubleType = Type.getDoubleTy();
			expect(doubleType).toBeDefined();
			expect(doubleType).not.toBe(0);
		});

		it("should create different instances for each basic type", () => {
			const voidType = Type.getVoidTy();
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();

			expect(voidType).not.toBe(int32Type);
			expect(int32Type).not.toBe(floatType);
			expect(voidType).not.toBe(floatType);
		});
	});

	describe("Pointer Type Creation", () => {
		let int32Type: Type;

		beforeEach(() => {
			int32Type = Type.getInt32Ty();
		});

		it("should create pointer type with default address space", () => {
			const type = Type.getInt32Ty();
			const pointerType = type.getPointerTo();

			expect(pointerType).toBeDefined();
			expect(pointerType).not.toBe(0);
			expect(pointerType).not.toBe(int32Type);
		});

		it("should create pointer type with custom address space", () => {
			const type = Type.getInt32Ty();
			const pointerType = type.getPointerTo(1);

			expect(pointerType).toBeDefined();
			expect(pointerType).not.toBe(0);
			expect(pointerType).not.toBe(int32Type);
		});

		it("should create different pointer types for different address spaces", () => {
			const type = Type.getInt32Ty();
			const pointerType0 = type.getPointerTo(0);
			const pointerType1 = type.getPointerTo(1);

			expect(pointerType0).not.toBe(pointerType1);
		});
	});

	describe("Function Type Creation", () => {
		it("should create function type with no parameters", () => {
			const returnType = Type.getInt32Ty();
			const funcType = Type.getFunctionType(returnType);

			expect(funcType).toBeDefined();
			expect(funcType).not.toBe(0);
			expect(funcType).not.toBe(returnType);
		});

		it("should create function type with vararg", () => {
			const returnType = Type.getInt32Ty();
			const funcType = Type.getFunctionType(returnType, [], true);

			expect(funcType).toBeDefined();
			expect(funcType).not.toBe(0);
		});

		it("should create different function types for different return types", () => {
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();

			const funcType1 = Type.getFunctionType(int32Type);
			const funcType2 = Type.getFunctionType(floatType);

			expect(funcType1).not.toBe(funcType2);
		});
	});

	describe("Struct Type Creation", () => {
		it("should create struct type with no elements", () => {
			const structType = Type.getStructType([]);

			expect(structType).toBeDefined();
			expect(structType).not.toBe(0);
		});

		it("should create packed struct type", () => {
			const structType = Type.getStructType([], true);

			expect(structType).toBeDefined();
			expect(structType).not.toBe(0);
		});

		it("should create different struct types for packed vs unpacked", () => {
			const unpackedStruct = Type.getStructType([], false);
			const packedStruct = Type.getStructType([], true);

			expect(unpackedStruct).not.toBe(packedStruct);
		});
	});

	describe("Array Type Creation", () => {
		let int32Type: Type;

		beforeEach(() => {
			int32Type = Type.getInt32Ty();
		});

		it("should create array type with single element", () => {
			const arrayType = Type.getArrayType(int32Type, 1);

			expect(arrayType).toBeDefined();
			expect(arrayType).not.toBe(0);
			expect(arrayType).not.toBe(int32Type);
		});

		it("should create array type with multiple elements", () => {
			const arrayType = Type.getArrayType(int32Type, 10);

			expect(arrayType).toBeDefined();
			expect(arrayType).not.toBe(0);
		});

		it("should create different array types for different sizes", () => {
			const arrayType1 = Type.getArrayType(int32Type, 5);
			const arrayType2 = Type.getArrayType(int32Type, 10);

			expect(arrayType1).not.toBe(arrayType2);
		});

		it("should create different array types for different element types", () => {
			const floatType = Type.getFloatTy();

			const intArrayType = Type.getArrayType(int32Type, 5);
			const floatArrayType = Type.getArrayType(floatType, 5);

			expect(intArrayType).not.toBe(floatArrayType);
		});
	});

	describe("Vector Type Creation", () => {
		let int32Type: Type;

		beforeEach(() => {
			int32Type = Type.getInt32Ty();
		});

		it("should create fixed vector type", () => {
			const vectorType = Type.getVectorType(int32Type, 4);

			expect(vectorType).toBeDefined();
			expect(vectorType).not.toBe(0);
			expect(vectorType).not.toBe(int32Type);
		});

		it("should create scalable vector type", () => {
			const vectorType = Type.getVectorType(int32Type, 4, true);

			expect(vectorType).toBeDefined();
			expect(vectorType).not.toBe(0);
		});

		it("should create different vector types for fixed vs scalable", () => {
			const fixedVector = Type.getVectorType(int32Type, 4, false);
			const scalableVector = Type.getVectorType(int32Type, 4, true);

			expect(fixedVector).not.toBe(scalableVector);
		});

		it("should create different vector types for different sizes", () => {
			const vectorType1 = Type.getVectorType(int32Type, 4);
			const vectorType2 = Type.getVectorType(int32Type, 8);

			expect(vectorType1).not.toBe(vectorType2);
		});

		it("should create different vector types for different element types", () => {
			const floatType = Type.getFloatTy();

			const intVectorType = Type.getVectorType(int32Type, 4);
			const floatVectorType = Type.getVectorType(floatType, 4);

			expect(intVectorType).not.toBe(floatVectorType);
		});
	});

	describe("Type Instance Methods", () => {
		let int32Type: Type;
		let typeInstance: Type;

		beforeEach(() => {
			int32Type = Type.getInt32Ty();
			typeInstance = int32Type;
		});

		it("should return the correct reference", () => {
			expect(typeInstance.ref).toBe(int32Type.ref);
		});

		it("should create pointer type from instance", () => {
			const pointerType = typeInstance.getPointerTo();

			expect(pointerType).toBeDefined();
			expect(pointerType).not.toBe(0);
			expect(pointerType).not.toBe(int32Type);
		});
	});

	describe("Type Consistency", () => {
		it("should return the same type reference for multiple calls to basic types", () => {
			const voidType1 = Type.getVoidTy();
			const voidType2 = Type.getVoidTy();

			expect(voidType1.ref).toBe(voidType2.ref);

			const int32Type1 = Type.getInt32Ty();
			const int32Type2 = Type.getInt32Ty();

			expect(int32Type1.ref).toBe(int32Type2.ref);
		});

		it("should create consistent complex types", () => {
			const int32Type = Type.getInt32Ty();

			// Create the same array type twice
			const arrayType1 = Type.getArrayType(int32Type, 5);
			const arrayType2 = Type.getArrayType(int32Type, 5);

			expect(arrayType1.ref).toBe(arrayType2.ref);

			// Create the same vector type twice
			const vectorType1 = Type.getVectorType(int32Type, 4);
			const vectorType2 = Type.getVectorType(int32Type, 4);

			expect(vectorType1.ref).toBe(vectorType2.ref);
		});
	});
});
