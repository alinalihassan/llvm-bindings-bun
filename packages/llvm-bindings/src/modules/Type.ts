import { ffi } from "@/ffi";
import { assert, type LLVMTypeRef } from "@/utils";
import { LLVMTypeKind } from "./Enum";
import type { FunctionType } from "./FunctionType";
import type { IntegerType } from "./IntegerType";
import { LLVMContext } from "./LLVMContext";

export class Type {
	protected _ref: LLVMTypeRef;

	constructor(ref: LLVMTypeRef) {
		this._ref = ref;
	}

	/**
	 * Get the underlying LLVM type reference
	 */
	get ref(): LLVMTypeRef {
		return this._ref;
	}

	/**
	 * Static method to get void type
	 */
	static getVoidTy(): Type {
		return new Type(ffi.symbols.LLVMVoidType());
	}

	/**
	 * Static method to get int1 type
	 */
	static getInt1Ty(): IntegerType {
		return new Type(ffi.symbols.LLVMInt1Type()) as IntegerType;
	}

	/**
	 * Static method to get int8 type
	 */
	static getInt8Ty(): IntegerType {
		return new Type(ffi.symbols.LLVMInt8Type()) as IntegerType;
	}

	/**
	 * Static method to get int16 type
	 */
	static getInt16Ty(): IntegerType {
		return new Type(ffi.symbols.LLVMInt16Type()) as IntegerType;
	}

	/**
	 * Static method to get int32 type
	 */
	static getInt32Ty(): IntegerType {
		return new Type(ffi.symbols.LLVMInt32Type()) as IntegerType;
	}

	/**
	 * Static method to get int64 type
	 */
	static getInt64Ty(): IntegerType {
		return new Type(ffi.symbols.LLVMInt64Type()) as IntegerType;
	}

	/**
	 * Static method to get int128 type
	 */
	static getInt128Ty(): IntegerType {
		return new Type(ffi.symbols.LLVMInt128Type()) as IntegerType;
	}
	/**
	 * Static method to get intN type
	 */
	static getIntNTy(numBits: number): IntegerType {
		return new Type(ffi.symbols.LLVMIntType(numBits)) as IntegerType;
	}

	/**
	 * Static method to get half type
	 */
	static getHalfTy(): Type {
		return new Type(ffi.symbols.LLVMHalfType());
	}

	/**
	 * Static method to get bfloat type
	 */
	static getBFloatTy(): Type {
		return new Type(ffi.symbols.LLVMBFloatType());
	}

	/**
	 * Static method to get float type
	 */
	static getFloatTy(): Type {
		return new Type(ffi.symbols.LLVMFloatType());
	}

	/**
	 * Static method to get double type
	 */
	static getDoubleTy(): Type {
		return new Type(ffi.symbols.LLVMDoubleType());
	}

	/**
	 * Static method to create a function type
	 */
	static getFunctionType(
		returnType: Type,
		paramTypes: Type[] = [],
		isVarArg: boolean = false,
	): FunctionType {
		if (paramTypes.length === 0) {
			const functionTypeRef = ffi.symbols.LLVMFunctionType(returnType.ref, null, 0, isVarArg);
			assert(functionTypeRef !== null, "Failed to create function type");

			return new Type(functionTypeRef) as FunctionType;
		}

		const paramTypesBuffer = new ArrayBuffer(paramTypes.length * 8);
		const paramTypesView = new BigUint64Array(paramTypesBuffer);

		for (let i = 0; i < paramTypes.length; i++) {
			// TODO: This is a hack to get the type reference
			// biome-ignore lint: TODO
			paramTypesView[i] = BigInt(paramTypes[i]!.ref as any);
		}

		const functionTypeRef = ffi.symbols.LLVMFunctionType(
			returnType.ref,
			paramTypesView,
			paramTypes.length,
			isVarArg,
		);

		assert(functionTypeRef !== null, "Failed to create function type");

		return new Type(functionTypeRef) as FunctionType;
	}

	/**
	 * Static method to create a struct type
	 */
	static getStructType(elementTypes: Type[], isPacked: boolean = false): Type {
		const elementTypesBuffer = new ArrayBuffer(elementTypes.length * 8);
		const elementTypesView = new BigUint64Array(elementTypesBuffer);

		for (let i = 0; i < elementTypes.length; i++) {
			// TODO: This is a hack to get the type reference
			// biome-ignore lint: TODO
			elementTypesView[i] = BigInt(elementTypes[i]!.ref as any);
		}

		return new Type(ffi.symbols.LLVMStructType(elementTypesView, elementTypes.length, isPacked));
	}

	/**
	 * Static method to create an array type
	 */
	static getArrayType(elementType: Type, numElements: number): Type {
		return new Type(ffi.symbols.LLVMArrayType(elementType.ref, numElements));
	}

	/**
	 * Static method to create a vector type
	 */
	static getVectorType(elementType: Type, numElements: number, isScalable: boolean = false): Type {
		if (isScalable) {
			return new Type(ffi.symbols.LLVMScalableVectorType(elementType.ref, numElements));
		} else {
			return new Type(ffi.symbols.LLVMVectorType(elementType.ref, numElements, false));
		}
	}

	/**
	 * Type inquiry methods - based on LLVM C++ Type.h implementation
	 */

	/**
	 * Get the type kind (TypeID) for this type
	 */
	getTypeKind(): number {
		return ffi.symbols.LLVMGetTypeKind(this.ref);
	}

	/**
	 * Whether the type has a known size.
	 *
	 * Things that don't have a size are abstract types, labels, and void.a
	 */
	isSized(): boolean {
		return ffi.symbols.LLVMTypeIsSized(this.ref);
	}

	/**
	 * Obtain the context to which this type instance is associated.
	 */
	getContext(): LLVMContext {
		return new LLVMContext(ffi.symbols.LLVMGetTypeContext(this.ref));
	}

	/**
	 * Dump the type to the stderr
	 */
	dump(): void {
		ffi.symbols.LLVMDumpType(this.ref);
	}

	/**
	 * Print the type to a string
	 */
	toString(): string {
		return ffi.symbols.LLVMPrintTypeToString(this.ref).toString();
	}

	/**
	 * Check if this type is a void type
	 */
	isVoidTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.VoidTypeKind;
	}

	/**
	 * Check if this type is an integer type
	 */
	isIntegerTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.IntegerTypeKind;
	}

	/**
	 * Check if this type is a function type
	 */
	isFunctionTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.FunctionTypeKind;
	}

	/**
	 * Check if this type is a struct type
	 */
	isStructTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.StructTypeKind;
	}

	/**
	 * Check if this type is an array type
	 */
	isArrayTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.ArrayTypeKind;
	}

	/**
	 * Check if this type is a pointer type
	 */
	isPointerTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.PointerTypeKind;
	}

	/**
	 * Check if this type is a vector type (fixed or scalable)
	 */
	isVectorTy(): boolean {
		const kind = this.getTypeKind();
		return kind === LLVMTypeKind.VectorTypeKind || kind === LLVMTypeKind.ScalableVectorTypeKind;
	}

	/**
	 * Check if this type is a floating point type
	 */
	isFloatingPointTy(): boolean {
		const kind = this.getTypeKind();
		return (
			kind === LLVMTypeKind.HalfTypeKind ||
			kind === LLVMTypeKind.FloatTypeKind ||
			kind === LLVMTypeKind.DoubleTypeKind ||
			kind === LLVMTypeKind.X86_FP80TypeKind ||
			kind === LLVMTypeKind.FP128TypeKind ||
			kind === LLVMTypeKind.PPC_FP128TypeKind ||
			kind === LLVMTypeKind.BFloatTypeKind
		);
	}

	/**
	 * Get a pointer type pointing to this type
	 */
	getPointerTo(addressSpace: number = 0): Type {
		return new Type(ffi.symbols.LLVMPointerType(this.ref, addressSpace));
	}

	/**
	 * Return true if the type is a valid type for a register in codegen. This
	 * includes all first-class types except struct and array types.
	 */
	isSingleValueType(): boolean {
		return (
			this.isFloatingPointTy() ||
			this.isIntegerTy() ||
			this.isPointerTy() ||
			this.isVectorTy() ||
			this.getTypeKind() === LLVMTypeKind.X86_AMXTypeKind ||
			this.getTypeKind() === LLVMTypeKind.TargetExtTypeKind
		);
	}

	/**
	 * Return true if the type is an aggregate type. This means it is valid as
	 * the first operand of an insertvalue or extractvalue instruction. This
	 * includes struct and array types, but does not include vector types.
	 */
	isAggregateType(): boolean {
		return this.isStructTy() || this.isArrayTy();
	}
}
