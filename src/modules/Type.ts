import { ffi } from "@/ffi";
import { assert, type LLVMTypeRef } from "@/utils";
import { LLVMTypeKind } from "./Enum";
import type { FunctionType } from "./FunctionType";
import type { IntegerType } from "./IntegerType";
import { LLVMContext } from "./LLVMContext";
import type { PointerType } from "./PointerType";
import { TypeSize } from "./TypeSize";

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
		return new Type(ffi.LLVMVoidType());
	}

	/**
	 * Static method to get int1 type
	 */
	static getInt1Ty(): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMInt1Type());
	}

	/**
	 * Static method to get int8 type
	 */
	static getInt8Ty(): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMInt8Type());
	}

	/**
	 * Static method to get int16 type
	 */
	static getInt16Ty(): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMInt16Type());
	}

	/**
	 * Static method to get int32 type
	 */
	static getInt32Ty(): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMInt32Type());
	}

	/**
	 * Static method to get int64 type
	 */
	static getInt64Ty(): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMInt64Type());
	}

	/**
	 * Static method to get int128 type
	 */
	static getInt128Ty(): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMInt128Type());
	}
	/**
	 * Static method to get intN type
	 */
	static getIntNTy(numBits: number): IntegerType {
		const { IntegerType } = require("./IntegerType");
		return new IntegerType(ffi.LLVMIntType(numBits));
	}

	/**
	 * Static method to get half type
	 */
	static getHalfTy(): Type {
		return new Type(ffi.LLVMHalfType());
	}

	/**
	 * Static method to get bfloat type
	 */
	static getBFloatTy(): Type {
		return new Type(ffi.LLVMBFloatType());
	}

	/**
	 * Static method to get float type
	 */
	static getFloatTy(): Type {
		return new Type(ffi.LLVMFloatType());
	}

	/**
	 * Static method to get double type
	 */
	static getDoubleTy(): Type {
		return new Type(ffi.LLVMDoubleType());
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
			const functionTypeRef = ffi.LLVMFunctionType(returnType.ref, null, 0, isVarArg);
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

		const functionTypeRef = ffi.LLVMFunctionType(
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

		return new Type(ffi.LLVMStructType(elementTypesView, elementTypes.length, isPacked));
	}

	/**
	 * Static method to create an array type
	 */
	static getArrayType(elementType: Type, numElements: number): Type {
		return new Type(ffi.LLVMArrayType(elementType.ref, numElements));
	}

	/**
	 * Static method to create a vector type
	 */
	static getVectorType(elementType: Type, numElements: number, isScalable: boolean = false): Type {
		if (isScalable) {
			return new Type(ffi.LLVMScalableVectorType(elementType.ref, numElements));
		} else {
			return new Type(ffi.LLVMVectorType(elementType.ref, numElements, false));
		}
	}

	/**
	 * Type inquiry methods - based on LLVM C++ Type.h implementation
	 */

	/**
	 * Get the type kind (TypeID) for this type
	 */
	getTypeKind(): number {
		return ffi.LLVMGetTypeKind(this.ref);
	}

	/**
	 * Whether the type has a known size.
	 *
	 * Things that don't have a size are abstract types, labels, and void.a
	 */
	isSized(): boolean {
		return ffi.LLVMTypeIsSized(this.ref);
	}

	/**
	 * Obtain the context to which this type instance is associated.
	 */
	getContext(): LLVMContext {
		return new LLVMContext(ffi.LLVMGetTypeContext(this.ref));
	}

	/**
	 * Dump the type to the stderr
	 */
	dump(): void {
		ffi.LLVMDumpType(this.ref);
	}

	/**
	 * Print the type to a string
	 */
	toString(): string {
		return ffi.LLVMPrintTypeToString(this.ref).toString();
	}

	/**
	 * Check if this type is a void type
	 */
	isVoidTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.VoidType;
	}

	/**
	 * Check if this type is an integer type
	 */
	isIntegerTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.IntegerType;
	}

	/**
	 * Check if this type is a function type
	 */
	isFunctionTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.FunctionType;
	}

	/**
	 * Check if this type is a struct type
	 */
	isStructTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.StructType;
	}

	/**
	 * Check if this type is an array type
	 */
	isArrayTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.ArrayType;
	}

	/**
	 * Check if this type is a pointer type
	 */
	isPointerTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.PointerType;
	}

	/**
	 * Check if this type is a vector type (fixed or scalable)
	 */
	isVectorTy(): boolean {
		const kind = this.getTypeKind();
		return kind === LLVMTypeKind.VectorType || kind === LLVMTypeKind.ScalableVectorType;
	}

	/**
	 * Check if this type is a floating point type
	 */
	isFloatingPointTy(): boolean {
		const kind = this.getTypeKind();
		return (
			kind === LLVMTypeKind.HalfType ||
			kind === LLVMTypeKind.FloatType ||
			kind === LLVMTypeKind.DoubleType ||
			kind === LLVMTypeKind.X86_FP80Type ||
			kind === LLVMTypeKind.FP128Type ||
			kind === LLVMTypeKind.PPC_FP128Type ||
			kind === LLVMTypeKind.BFloatType
		);
	}

	isHalfTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.HalfType;
	}

	isBFloatTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.BFloatType;
	}

	is16BitFPTy(): boolean {
		return (
			this.getTypeKind() === LLVMTypeKind.HalfType || this.getTypeKind() === LLVMTypeKind.BFloatType
		);
	}

	isFloatTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.FloatType;
	}

	isDoubleTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.DoubleType;
	}

	isX86_FP80Ty(): boolean {
		return this.getTypeKind() === LLVMTypeKind.X86_FP80Type;
	}

	isFP128Ty(): boolean {
		return this.getTypeKind() === LLVMTypeKind.FP128Type;
	}

	isPPC_FP128Ty(): boolean {
		return this.getTypeKind() === LLVMTypeKind.PPC_FP128Type;
	}

	isLabelTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.LabelType;
	}

	isMetadataTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.MetadataType;
	}

	isTokenTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.TokenType;
	}

	isX86_AMXTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.X86_AMXType;
	}

	isTargetExtTy(): boolean {
		return this.getTypeKind() === LLVMTypeKind.TargetExtType;
	}

	/**
	 * Return true if this is a well-behaved IEEE-like type, which has a IEEE
	 * compatible layout, and does not have non-IEEE values, such as x86_fp80's
	 * unnormal values.
	 */
	isIEEELikeFPTy(): boolean {
		const kind = this.getTypeKind();
		return (
			kind === LLVMTypeKind.DoubleType ||
			kind === LLVMTypeKind.FloatType ||
			kind === LLVMTypeKind.HalfType ||
			kind === LLVMTypeKind.BFloatType ||
			kind === LLVMTypeKind.FP128Type
		);
	}

	/**
	 * Returns true if this is a floating-point type that is an unevaluated sum
	 * of multiple floating-point units.
	 * An example of such a type is ppc_fp128, also known as double-double, which
	 * consists of two IEEE 754 doubles.
	 */
	isMultiUnitFPType(): boolean {
		return this.getTypeKind() === LLVMTypeKind.PPC_FP128Type;
	}

	/**
	 * Get a pointer type pointing to this type
	 */
	getPointerTo(addressSpace: number = 0): PointerType {
		return new Type(ffi.LLVMPointerType(this.ref, addressSpace)) as PointerType;
	}

	getScalarType(): Type {
		if (this.isVectorTy()) {
			const { VectorType } = require("./VectorType");
			return new VectorType(this.ref).getElementType();
		}
		return this;
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
			this.getTypeKind() === LLVMTypeKind.X86_AMXType ||
			this.getTypeKind() === LLVMTypeKind.TargetExtType
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

	getPrimitiveSizeInBits(): TypeSize {
		switch (this.getTypeKind()) {
			case LLVMTypeKind.HalfType:
				return TypeSize.getFixed(16);
			case LLVMTypeKind.BFloatType:
				return TypeSize.getFixed(16);
			case LLVMTypeKind.FloatType:
				return TypeSize.getFixed(32);
			case LLVMTypeKind.DoubleType:
				return TypeSize.getFixed(64);
			case LLVMTypeKind.X86_FP80Type:
				return TypeSize.getFixed(80);
			case LLVMTypeKind.FP128Type:
				return TypeSize.getFixed(128);
			case LLVMTypeKind.PPC_FP128Type:
				return TypeSize.getFixed(128);
			case LLVMTypeKind.X86_AMXType:
				return TypeSize.getFixed(8192);
			case LLVMTypeKind.IntegerType: {
				const { IntegerType } = require("./IntegerType");
				return TypeSize.getFixed(new IntegerType(this.ref).getBitWidth());
			}
			case LLVMTypeKind.VectorType:
			case LLVMTypeKind.ScalableVectorType: {
				// const vectorType = this as unknown as VectorType;
				// const elementCount = vectorType.getElementCount();
				// const elementTypeSize = vectorType.getElementType().getPrimitiveSizeInBits();
				// TODO: Not implemented yet, depends on ElementCount, fixed vs scalable
				throw new Error("Not implemented");
			}
			default:
				return TypeSize.getFixed(0);
		}
	}
}
