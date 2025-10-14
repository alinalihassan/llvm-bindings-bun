import { beforeEach, describe, expect, it } from "bun:test";
import { LLVMTypeKind } from "@/modules/Enum";
import { Type } from "@/modules/Type";

describe("Type", () => {
	describe("Basic Type Creation", () => {
		it("should create void type", () => {
			const voidType = Type.getVoidTy();
			expect(voidType).toBeDefined();
			expect(voidType.ref).not.toBe(0);
			expect(voidType.isVoidTy()).toBe(true);
		});

		it("should create int1 type", () => {
			const int1Type = Type.getInt1Ty();
			expect(int1Type).toBeDefined();
			expect(int1Type.ref).not.toBe(0);
			expect(int1Type.isIntegerTy()).toBe(true);
		});

		it("should create int8 type", () => {
			const int8Type = Type.getInt8Ty();
			expect(int8Type).toBeDefined();
			expect(int8Type.ref).not.toBe(0);
			expect(int8Type.isIntegerTy()).toBe(true);
		});

		it("should create int16 type", () => {
			const int16Type = Type.getInt16Ty();
			expect(int16Type).toBeDefined();
			expect(int16Type.ref).not.toBe(0);
			expect(int16Type.isIntegerTy()).toBe(true);
		});

		it("should create int32 type", () => {
			const int32Type = Type.getInt32Ty();
			expect(int32Type).toBeDefined();
			expect(int32Type.ref).not.toBe(0);
			expect(int32Type.isIntegerTy()).toBe(true);
		});

		it("should create int64 type", () => {
			const int64Type = Type.getInt64Ty();
			expect(int64Type).toBeDefined();
			expect(int64Type.ref).not.toBe(0);
			expect(int64Type.isIntegerTy()).toBe(true);
		});

		it("should create int128 type", () => {
			const int128Type = Type.getInt128Ty();
			expect(int128Type).toBeDefined();
			expect(int128Type.ref).not.toBe(0);
			expect(int128Type.isIntegerTy()).toBe(true);
		});

		it("should create intN type", () => {
			const intNType = Type.getIntNTy(24);
			expect(intNType).toBeDefined();
			expect(intNType.ref).not.toBe(0);
			expect(intNType.isIntegerTy()).toBe(true);
		});

		it("should create half type", () => {
			const halfType = Type.getHalfTy();
			expect(halfType).toBeDefined();
			expect(halfType.ref).not.toBe(0);
			expect(halfType.isFloatingPointTy()).toBe(true);
		});

		it("should create bfloat type", () => {
			const bfloatType = Type.getBFloatTy();
			expect(bfloatType).toBeDefined();
			expect(bfloatType.ref).not.toBe(0);
			expect(bfloatType.isFloatingPointTy()).toBe(true);
		});

		it("should create float type", () => {
			const floatType = Type.getFloatTy();
			expect(floatType).toBeDefined();
			expect(floatType.ref).not.toBe(0);
			expect(floatType.isFloatingPointTy()).toBe(true);
		});

		it("should create double type", () => {
			const doubleType = Type.getDoubleTy();
			expect(doubleType).toBeDefined();
			expect(doubleType.ref).not.toBe(0);
			expect(doubleType.isFloatingPointTy()).toBe(true);
		});

		it("should create different instances for each basic type", () => {
			const voidType = Type.getVoidTy();
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();

			expect(voidType.ref).not.toBe(int32Type.ref);
			expect(int32Type.ref).not.toBe(floatType.ref);
			expect(voidType.ref).not.toBe(floatType.ref);
		});
	});

	describe("Type Kind and Inquiry Methods", () => {
		it("should return correct type kind for void type", () => {
			const voidType = Type.getVoidTy();
			expect(voidType.getTypeKind()).toBe(LLVMTypeKind.VoidType);
		});

		it("should return correct type kind for integer types", () => {
			const int32Type = Type.getInt32Ty();
			expect(int32Type.getTypeKind()).toBe(LLVMTypeKind.IntegerType);
		});

		it("should return correct type kind for floating point types", () => {
			const floatType = Type.getFloatTy();
			expect(floatType.getTypeKind()).toBe(LLVMTypeKind.FloatType);

			const doubleType = Type.getDoubleTy();
			expect(doubleType.getTypeKind()).toBe(LLVMTypeKind.DoubleType);
		});

		it("should check if type is sized", () => {
			const voidType = Type.getVoidTy();
			expect(voidType.isSized()).toBe(false);

			const int32Type = Type.getInt32Ty();
			expect(int32Type.isSized()).toBe(true);

			const floatType = Type.getFloatTy();
			expect(floatType.isSized()).toBe(true);
		});

		it("should check if type is single value type", () => {
			const voidType = Type.getVoidTy();
			expect(voidType.isSingleValueType()).toBe(false);

			const int32Type = Type.getInt32Ty();
			expect(int32Type.isSingleValueType()).toBe(true);

			const floatType = Type.getFloatTy();
			expect(floatType.isSingleValueType()).toBe(true);
		});

		it("should check if type is aggregate type", () => {
			const int32Type = Type.getInt32Ty();
			expect(int32Type.isAggregateType()).toBe(false);

			const arrayType = Type.getArrayType(int32Type, 5);
			expect(arrayType.isAggregateType()).toBe(true);

			const structType = Type.getStructType([int32Type]);
			expect(structType.isAggregateType()).toBe(true);
		});

		it("should get type context", () => {
			const int32Type = Type.getInt32Ty();
			const context = int32Type.getContext();
			expect(context).toBeDefined();
			expect(context.ref).not.toBe(0);
		});

		it("should print type to string", () => {
			const int32Type = Type.getInt32Ty();
			const typeString = int32Type.toString();
			expect(typeString).toBeDefined();
			expect(typeof typeString).toBe("string");
			expect(typeString.length).toBeGreaterThan(0);
		});
	});

	describe("Pointer Type Creation", () => {
		let int32Type: Type;

		beforeEach(() => {
			int32Type = Type.getInt32Ty();
		});

		it("should create pointer type with default address space", () => {
			const pointerType = int32Type.getPointerTo();

			expect(pointerType).toBeDefined();
			expect(pointerType.ref).not.toBe(0);
			expect(pointerType.ref).not.toBe(int32Type.ref);
			expect(pointerType.isPointerTy()).toBe(true);
		});

		it("should create pointer type with custom address space", () => {
			const pointerType = int32Type.getPointerTo(1);

			expect(pointerType).toBeDefined();
			expect(pointerType.ref).not.toBe(0);
			expect(pointerType.ref).not.toBe(int32Type.ref);
			expect(pointerType.isPointerTy()).toBe(true);
		});

		it("should create different pointer types for different address spaces", () => {
			const pointerType0 = int32Type.getPointerTo(0);
			const pointerType1 = int32Type.getPointerTo(1);

			expect(pointerType0.ref).not.toBe(pointerType1.ref);
		});

		it("should create pointer to pointer", () => {
			const pointerType = int32Type.getPointerTo();
			const pointerToPointer = pointerType.getPointerTo();

			expect(pointerToPointer).toBeDefined();
			expect(pointerToPointer.isPointerTy()).toBe(true);
		});
	});

	describe("Function Type Creation", () => {
		it("should create function type with no parameters", () => {
			const returnType = Type.getInt32Ty();
			const funcType = Type.getFunctionType(returnType);

			expect(funcType).toBeDefined();
			expect(funcType.ref).not.toBe(0);
			expect(funcType.ref).not.toBe(returnType.ref);
			expect(funcType.isFunctionTy()).toBe(true);
		});

		it("should create function type with parameters", () => {
			const returnType = Type.getInt32Ty();
			const paramTypes = [Type.getFloatTy(), Type.getDoubleTy()];
			const funcType = Type.getFunctionType(returnType, paramTypes);

			expect(funcType).toBeDefined();
			expect(funcType.ref).not.toBe(0);
			expect(funcType.isFunctionTy()).toBe(true);
		});

		it("should create function type with vararg", () => {
			const returnType = Type.getInt32Ty();
			const funcType = Type.getFunctionType(returnType, [], true);

			expect(funcType).toBeDefined();
			expect(funcType.ref).not.toBe(0);
			expect(funcType.isFunctionTy()).toBe(true);
		});

		it("should create different function types for different return types", () => {
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();

			const funcType1 = Type.getFunctionType(int32Type);
			const funcType2 = Type.getFunctionType(floatType);

			expect(funcType1.ref).not.toBe(funcType2.ref);
		});

		it("should create function type with void return", () => {
			const voidType = Type.getVoidTy();
			const funcType = Type.getFunctionType(voidType);

			expect(funcType).toBeDefined();
			expect(funcType.isFunctionTy()).toBe(true);
		});
	});

	describe("Struct Type Creation", () => {
		it("should create struct type with no elements", () => {
			const structType = Type.getStructType([]);

			expect(structType).toBeDefined();
			expect(structType.ref).not.toBe(0);
			expect(structType.isStructTy()).toBe(true);
		});

		it("should create struct type with elements", () => {
			const elementTypes = [Type.getInt32Ty(), Type.getFloatTy()];
			const structType = Type.getStructType(elementTypes);

			expect(structType).toBeDefined();
			expect(structType.ref).not.toBe(0);
			expect(structType.isStructTy()).toBe(true);
		});

		it("should create packed struct type", () => {
			const structType = Type.getStructType([], true);

			expect(structType).toBeDefined();
			expect(structType.ref).not.toBe(0);
			expect(structType.isStructTy()).toBe(true);
		});

		it("should create different struct types for packed vs unpacked", () => {
			const unpackedStruct = Type.getStructType([], false);
			const packedStruct = Type.getStructType([], true);

			expect(unpackedStruct.ref).not.toBe(packedStruct.ref);
		});

		it("should create complex struct type", () => {
			const elementTypes = [
				Type.getInt32Ty(),
				Type.getFloatTy(),
				Type.getArrayType(Type.getInt8Ty(), 10),
				Type.getInt32Ty().getPointerTo(),
			];
			const structType = Type.getStructType(elementTypes);

			expect(structType).toBeDefined();
			expect(structType.isStructTy()).toBe(true);
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
			expect(arrayType.ref).not.toBe(0);
			expect(arrayType.ref).not.toBe(int32Type.ref);
			expect(arrayType.isArrayTy()).toBe(true);
		});

		it("should create array type with multiple elements", () => {
			const arrayType = Type.getArrayType(int32Type, 10);

			expect(arrayType).toBeDefined();
			expect(arrayType.ref).not.toBe(0);
			expect(arrayType.isArrayTy()).toBe(true);
		});

		it("should create different array types for different sizes", () => {
			const arrayType1 = Type.getArrayType(int32Type, 5);
			const arrayType2 = Type.getArrayType(int32Type, 10);

			expect(arrayType1.ref).not.toBe(arrayType2.ref);
		});

		it("should create different array types for different element types", () => {
			const floatType = Type.getFloatTy();

			const intArrayType = Type.getArrayType(int32Type, 5);
			const floatArrayType = Type.getArrayType(floatType, 5);

			expect(intArrayType.ref).not.toBe(floatArrayType.ref);
		});

		it("should create array of arrays", () => {
			const innerArray = Type.getArrayType(int32Type, 5);
			const outerArray = Type.getArrayType(innerArray, 3);

			expect(outerArray).toBeDefined();
			expect(outerArray.isArrayTy()).toBe(true);
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
			expect(vectorType.ref).not.toBe(0);
			expect(vectorType.ref).not.toBe(int32Type.ref);
			expect(vectorType.isVectorTy()).toBe(true);
		});

		it("should create scalable vector type", () => {
			const vectorType = Type.getVectorType(int32Type, 4, true);

			expect(vectorType).toBeDefined();
			expect(vectorType.ref).not.toBe(0);
			expect(vectorType.isVectorTy()).toBe(true);
		});

		it("should create different vector types for fixed vs scalable", () => {
			const fixedVector = Type.getVectorType(int32Type, 4, false);
			const scalableVector = Type.getVectorType(int32Type, 4, true);

			expect(fixedVector.ref).not.toBe(scalableVector.ref);
		});

		it("should create different vector types for different sizes", () => {
			const vectorType1 = Type.getVectorType(int32Type, 4);
			const vectorType2 = Type.getVectorType(int32Type, 8);

			expect(vectorType1.ref).not.toBe(vectorType2.ref);
		});

		it("should create different vector types for different element types", () => {
			const floatType = Type.getFloatTy();

			const intVectorType = Type.getVectorType(int32Type, 4);
			const floatVectorType = Type.getVectorType(floatType, 4);

			expect(intVectorType.ref).not.toBe(floatVectorType.ref);
		});

		it("should create vector of vectors", () => {
			const innerVector = Type.getVectorType(int32Type, 4);
			const outerVector = Type.getVectorType(innerVector, 2);

			expect(outerVector).toBeDefined();
			expect(outerVector.isVectorTy()).toBe(true);
		});
	});

	describe("Type Instance Methods", () => {
		let int32Type: Type;

		beforeEach(() => {
			int32Type = Type.getInt32Ty();
		});

		it("should return the correct reference", () => {
			expect(int32Type.ref).toBeDefined();
			expect(int32Type.ref).not.toBe(0);
		});

		it("should create pointer type from instance", () => {
			const pointerType = int32Type.getPointerTo();

			expect(pointerType).toBeDefined();
			expect(pointerType.ref).not.toBe(0);
			expect(pointerType.ref).not.toBe(int32Type.ref);
		});

		it("should dump type to stderr", () => {
			expect(() => {
				int32Type.dump();
			}).not.toThrow();
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

	describe("Type Combinations", () => {
		it("should create complex nested types", () => {
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();

			// Create a struct with array and pointer members
			const arrayType = Type.getArrayType(int32Type, 10);
			const pointerType = floatType.getPointerTo();
			const structType = Type.getStructType([int32Type, arrayType, pointerType]);

			expect(structType).toBeDefined();
			expect(structType.isStructTy()).toBe(true);
		});

		it("should create function with complex parameter types", () => {
			const int32Type = Type.getInt32Ty();
			const floatType = Type.getFloatTy();

			const paramTypes = [
				int32Type,
				floatType,
				Type.getArrayType(int32Type, 5),
				int32Type.getPointerTo(),
			];
			const funcType = Type.getFunctionType(int32Type, paramTypes);

			expect(funcType).toBeDefined();
			expect(funcType.isFunctionTy()).toBe(true);
		});

		it("should create pointer to function", () => {
			const int32Type = Type.getInt32Ty();
			const funcType = Type.getFunctionType(int32Type);
			const pointerToFunc = funcType.getPointerTo();

			expect(pointerToFunc).toBeDefined();
			expect(pointerToFunc.isPointerTy()).toBe(true);
		});
	});

	describe("Type Edge Cases", () => {
		it("should handle zero-sized arrays", () => {
			const int32Type = Type.getInt32Ty();
			const zeroArray = Type.getArrayType(int32Type, 0);

			expect(zeroArray).toBeDefined();
			expect(zeroArray.isArrayTy()).toBe(true);
		});

		it("should handle large array sizes", () => {
			const int8Type = Type.getInt8Ty();
			const largeArray = Type.getArrayType(int8Type, 1000000);

			expect(largeArray).toBeDefined();
			expect(largeArray.isArrayTy()).toBe(true);
		});

		it("should handle large vector sizes", () => {
			const int8Type = Type.getInt8Ty();
			const largeVector = Type.getVectorType(int8Type, 64);

			expect(largeVector).toBeDefined();
			expect(largeVector.isVectorTy()).toBe(true);
		});

		it("should handle multiple address spaces", () => {
			const int32Type = Type.getInt32Ty();
			const pointers = [
				int32Type.getPointerTo(0),
				int32Type.getPointerTo(1),
				int32Type.getPointerTo(2),
				int32Type.getPointerTo(10),
			];

			// All should be different
			for (let i = 0; i < pointers.length; i++) {
				for (let j = i + 1; j < pointers.length; j++) {
					const pointer1 = pointers[i];
					const pointer2 = pointers[j];
					if (pointer1 && pointer2) {
						expect(pointer1.ref).not.toBe(pointer2.ref);
					}
				}
			}
		});
	});
});
