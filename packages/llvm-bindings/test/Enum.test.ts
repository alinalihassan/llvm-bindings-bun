import { describe, expect, it } from "bun:test";
import {
	LLVMAtomicOrdering,
	LLVMAttributeFunctionIndex,
	LLVMAttributeReturnIndex,
	LLVMCallConv,
	LLVMFastMathAll,
	LLVMFastMathAllowReassoc,
	LLVMFastMathNoInfs,
	LLVMFastMathNoNaNs,
	LLVMGEPFlagInBounds,
	LLVMLinkage,
	LLVMModuleFlagBehavior,
	LLVMOpcode,
	LLVMTypeKind,
	LLVMVisibility,
} from "../src/modules/Enum.js";

describe("LLVM Enums", () => {
	describe("LLVMOpcode", () => {
		it("should have correct values for basic operations", () => {
			expect(LLVMOpcode.Ret).toBe(1);
			expect(LLVMOpcode.Br).toBe(2);
			expect(LLVMOpcode.Add).toBe(8);
			expect(LLVMOpcode.Sub).toBe(10);
			expect(LLVMOpcode.Mul).toBe(12);
		});

		it("should have correct values for memory operations", () => {
			expect(LLVMOpcode.Alloca).toBe(26);
			expect(LLVMOpcode.Load).toBe(27);
			expect(LLVMOpcode.Store).toBe(28);
		});

		it("should have correct values for cast operations", () => {
			expect(LLVMOpcode.Trunc).toBe(30);
			expect(LLVMOpcode.ZExt).toBe(31);
			expect(LLVMOpcode.SExt).toBe(32);
		});
	});

	describe("LLVMTypeKind", () => {
		it("should have correct values for basic types", () => {
			expect(LLVMTypeKind.VoidTypeKind).toBe(0);
			expect(LLVMTypeKind.HalfTypeKind).toBe(1);
			expect(LLVMTypeKind.FloatTypeKind).toBe(2);
			expect(LLVMTypeKind.DoubleTypeKind).toBe(3);
		});

		it("should have correct values for complex types", () => {
			expect(LLVMTypeKind.IntegerTypeKind).toBe(8);
			expect(LLVMTypeKind.FunctionTypeKind).toBe(9);
			expect(LLVMTypeKind.StructTypeKind).toBe(10);
			expect(LLVMTypeKind.ArrayTypeKind).toBe(11);
		});
	});

	describe("LLVMLinkage", () => {
		it("should have correct values for linkage types", () => {
			expect(LLVMLinkage.ExternalLinkage).toBe(0);
			expect(LLVMLinkage.AvailableExternallyLinkage).toBe(1);
			expect(LLVMLinkage.LinkOnceAnyLinkage).toBe(2);
		});
	});

	describe("LLVMVisibility", () => {
		it("should have correct values for visibility types", () => {
			expect(LLVMVisibility.DefaultVisibility).toBe(0);
			expect(LLVMVisibility.HiddenVisibility).toBe(1);
			expect(LLVMVisibility.ProtectedVisibility).toBe(2);
		});
	});

	describe("LLVMCallConv", () => {
		it("should have correct values for calling conventions", () => {
			expect(LLVMCallConv.CCallConv).toBe(0);
			expect(LLVMCallConv.FastCallConv).toBe(8);
			expect(LLVMCallConv.ColdCallConv).toBe(9);
		});
	});

	describe("LLVMAtomicOrdering", () => {
		it("should have correct values for atomic ordering", () => {
			expect(LLVMAtomicOrdering.AtomicOrderingNotAtomic).toBe(0);
			expect(LLVMAtomicOrdering.AtomicOrderingUnordered).toBe(1);
			expect(LLVMAtomicOrdering.AtomicOrderingMonotonic).toBe(2);
		});
	});

	describe("LLVMModuleFlagBehavior", () => {
		it("should have correct values for module flag behavior", () => {
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorError).toBe(0);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorWarning).toBe(1);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorRequire).toBe(2);
		});
	});

	describe("Constants", () => {
		it("should have correct values for attribute indices", () => {
			expect(LLVMAttributeReturnIndex).toBe(0);
			expect(LLVMAttributeFunctionIndex).toBe(-1);
		});

		it("should have correct values for fast math flags", () => {
			expect(LLVMFastMathAllowReassoc).toBe(1);
			expect(LLVMFastMathNoNaNs).toBe(2);
			expect(LLVMFastMathAll).toBe(127); // All flags combined
		});

		it("should have correct values for GEP flags", () => {
			expect(LLVMGEPFlagInBounds).toBe(1);
		});
	});

	describe("Enum Usage", () => {
		it("should allow using enums in switch statements", () => {
			const opcode = LLVMOpcode.Add;
			let result = "";

			switch (+opcode) {
				case LLVMOpcode.Add:
					result = "addition";
					break;
				case LLVMOpcode.Sub:
					result = "subtraction";
					break;
				default:
					result = "unknown";
			}

			expect(result).toBe("addition");
		});

		it("should allow combining flags", () => {
			const fastMathFlags = LLVMFastMathAllowReassoc | LLVMFastMathNoNaNs;
			expect(fastMathFlags).toBe(3); // 1 | 2 = 3
		});

		it("should allow checking flag presence", () => {
			const flags = LLVMFastMathAllowReassoc | LLVMFastMathNoNaNs;
			expect(flags & LLVMFastMathAllowReassoc).toBeTruthy();
			expect(flags & LLVMFastMathNoNaNs).toBeTruthy();
			expect(flags & LLVMFastMathNoInfs).toBeFalsy();
		});
	});
});
