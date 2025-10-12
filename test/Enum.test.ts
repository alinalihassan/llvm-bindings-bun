import { describe, expect, it } from "bun:test";
import {
	GlobalValueDLLStorageClassTypes,
	GlobalValueLinkageTypes,
	GlobalValueVisibilityTypes,
	LLVMAtomicOrdering,
	LLVMAttributeFunctionIndex,
	LLVMAttributeReturnIndex,
	LLVMCallConv,
	LLVMCastKind,
	LLVMCmpInstOpcode,
	LLVMCmpInstPredicate,
	LLVMDiagnosticSeverity,
	LLVMFastMathAll,
	LLVMFastMathAllowContract,
	LLVMFastMathAllowReassoc,
	LLVMFastMathAllowReciprocal,
	LLVMFastMathApproxFunc,
	LLVMFastMathNoInfs,
	LLVMFastMathNoNaNs,
	LLVMFastMathNone,
	LLVMFastMathNoSignedZeros,
	LLVMGEPFlagInBounds,
	LLVMGEPFlagNUSW,
	LLVMGEPFlagNUW,
	LLVMInlineAsmDialect,
	LLVMIntPredicate,
	LLVMLinkage,
	LLVMModuleFlagBehavior,
	LLVMOpcode,
	LLVMRealPredicate,
	LLVMTailCallKind,
	LLVMThreadLocalMode,
	LLVMTypeKind,
	LLVMUnnamedAddr,
	LLVMValueKind,
	LLVMVisibility,
} from "@/modules/Enum";

describe("LLVM Enums", () => {
	describe("LLVMOpcode", () => {
		it("should have correct values for terminator instructions", () => {
			expect(LLVMOpcode.Ret).toBe(1);
			expect(LLVMOpcode.Br).toBe(2);
			expect(LLVMOpcode.Switch).toBe(3);
			expect(LLVMOpcode.IndirectBr).toBe(4);
			expect(LLVMOpcode.Invoke).toBe(5);
			expect(LLVMOpcode.Unreachable).toBe(7);
			expect(LLVMOpcode.CallBr).toBe(67);
		});

		it("should have correct values for binary operations", () => {
			expect(LLVMOpcode.Add).toBe(8);
			expect(LLVMOpcode.FAdd).toBe(9);
			expect(LLVMOpcode.Sub).toBe(10);
			expect(LLVMOpcode.FSub).toBe(11);
			expect(LLVMOpcode.Mul).toBe(12);
			expect(LLVMOpcode.FMul).toBe(13);
		});

		it("should have correct values for memory operations", () => {
			expect(LLVMOpcode.Alloca).toBe(26);
			expect(LLVMOpcode.Load).toBe(27);
			expect(LLVMOpcode.Store).toBe(28);
			expect(LLVMOpcode.GetElementPtr).toBe(29);
		});

		it("should have correct values for cast operations", () => {
			expect(LLVMOpcode.Trunc).toBe(30);
			expect(LLVMOpcode.ZExt).toBe(31);
			expect(LLVMOpcode.SExt).toBe(32);
			expect(LLVMOpcode.FPToUI).toBe(33);
			expect(LLVMOpcode.FPToSI).toBe(34);
			expect(LLVMOpcode.BitCast).toBe(41);
		});

		it("should have correct values for comparison operations", () => {
			expect(LLVMOpcode.ICmp).toBe(42);
			expect(LLVMOpcode.FCmp).toBe(43);
		});

		it("should have correct values for call operations", () => {
			expect(LLVMOpcode.Call).toBe(45);
		});
	});

	describe("LLVMTypeKind", () => {
		it("should have correct values for basic types", () => {
			expect(LLVMTypeKind.VoidTypeKind).toBe(0);
			expect(LLVMTypeKind.HalfTypeKind).toBe(1);
			expect(LLVMTypeKind.FloatTypeKind).toBe(2);
			expect(LLVMTypeKind.DoubleTypeKind).toBe(3);
			expect(LLVMTypeKind.X86_FP80TypeKind).toBe(4);
			expect(LLVMTypeKind.FP128TypeKind).toBe(5);
			expect(LLVMTypeKind.PPC_FP128TypeKind).toBe(6);
		});

		it("should have correct values for complex types", () => {
			expect(LLVMTypeKind.LabelTypeKind).toBe(7);
			expect(LLVMTypeKind.IntegerTypeKind).toBe(8);
			expect(LLVMTypeKind.FunctionTypeKind).toBe(9);
			expect(LLVMTypeKind.StructTypeKind).toBe(10);
			expect(LLVMTypeKind.ArrayTypeKind).toBe(11);
			expect(LLVMTypeKind.PointerTypeKind).toBe(12);
			expect(LLVMTypeKind.VectorTypeKind).toBe(13);
			expect(LLVMTypeKind.MetadataTypeKind).toBe(14);
		});

		it("should have correct values for advanced types", () => {
			expect(LLVMTypeKind.TokenTypeKind).toBe(16);
			expect(LLVMTypeKind.ScalableVectorTypeKind).toBe(17);
			expect(LLVMTypeKind.BFloatTypeKind).toBe(18);
			expect(LLVMTypeKind.X86_AMXTypeKind).toBe(19);
			expect(LLVMTypeKind.TargetExtTypeKind).toBe(20);
		});
	});

	describe("LLVMLinkage", () => {
		it("should have correct values for linkage types", () => {
			expect(LLVMLinkage.ExternalLinkage).toBe(0);
			expect(LLVMLinkage.AvailableExternallyLinkage).toBe(1);
			expect(LLVMLinkage.LinkOnceAnyLinkage).toBe(2);
			expect(LLVMLinkage.LinkOnceODRLinkage).toBe(3);
			expect(LLVMLinkage.LinkOnceODRAutoHideLinkage).toBe(4);
			expect(LLVMLinkage.WeakAnyLinkage).toBe(5);
			expect(LLVMLinkage.WeakODRLinkage).toBe(6);
			expect(LLVMLinkage.AppendingLinkage).toBe(7);
			expect(LLVMLinkage.InternalLinkage).toBe(8);
			expect(LLVMLinkage.PrivateLinkage).toBe(9);
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
		it("should have correct values for basic calling conventions", () => {
			expect(LLVMCallConv.CCallConv).toBe(0);
			expect(LLVMCallConv.FastCallConv).toBe(8);
			expect(LLVMCallConv.ColdCallConv).toBe(9);
			expect(LLVMCallConv.GHCCallConv).toBe(10);
			expect(LLVMCallConv.HiPECallConv).toBe(11);
		});

		it("should have correct values for platform-specific calling conventions", () => {
			expect(LLVMCallConv.X86StdcallCallConv).toBe(64);
			expect(LLVMCallConv.X86FastcallCallConv).toBe(65);
			expect(LLVMCallConv.ARMAPCSCallConv).toBe(66);
			expect(LLVMCallConv.ARMAAPCSCallConv).toBe(67);
			expect(LLVMCallConv.X86ThisCallCallConv).toBe(70);
		});

		it("should have correct max ID", () => {
			expect(LLVMCallConv.MaxID).toBe(1023);
		});
	});

	describe("LLVMAtomicOrdering", () => {
		it("should have correct values for atomic ordering", () => {
			expect(LLVMAtomicOrdering.AtomicOrderingNotAtomic).toBe(0);
			expect(LLVMAtomicOrdering.AtomicOrderingUnordered).toBe(1);
			expect(LLVMAtomicOrdering.AtomicOrderingMonotonic).toBe(2);
			expect(LLVMAtomicOrdering.AtomicOrderingAcquire).toBe(4);
			expect(LLVMAtomicOrdering.AtomicOrderingRelease).toBe(5);
			expect(LLVMAtomicOrdering.AtomicOrderingAcquireRelease).toBe(6);
			expect(LLVMAtomicOrdering.AtomicOrderingSequentiallyConsistent).toBe(7);
		});
	});

	describe("LLVMModuleFlagBehavior", () => {
		it("should have correct values for module flag behavior", () => {
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorError).toBe(0);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorWarning).toBe(1);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorRequire).toBe(2);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorOverride).toBe(3);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorAppend).toBe(4);
			expect(LLVMModuleFlagBehavior.ModuleFlagBehaviorAppendUnique).toBe(5);
		});
	});

	describe("LLVMValueKind", () => {
		it("should have correct values for value kinds", () => {
			expect(LLVMValueKind.ArgumentValueKind).toBe(0);
			expect(LLVMValueKind.BasicBlockValueKind).toBe(1);
			expect(LLVMValueKind.MemoryUseValueKind).toBe(2);
			expect(LLVMValueKind.MemoryDefValueKind).toBe(3);
			expect(LLVMValueKind.MemoryPhiValueKind).toBe(4);
			expect(LLVMValueKind.FunctionValueKind).toBe(5);
			expect(LLVMValueKind.GlobalAliasValueKind).toBe(6);
			expect(LLVMValueKind.GlobalIFuncValueKind).toBe(7);
			expect(LLVMValueKind.GlobalVariableValueKind).toBe(8);
			expect(LLVMValueKind.BlockAddressValueKind).toBe(9);
			expect(LLVMValueKind.ConstantExprValueKind).toBe(10);
			expect(LLVMValueKind.ConstantArrayValueKind).toBe(11);
			expect(LLVMValueKind.ConstantStructValueKind).toBe(12);
			expect(LLVMValueKind.ConstantVectorValueKind).toBe(13);
			expect(LLVMValueKind.UndefValueValueKind).toBe(14);
			expect(LLVMValueKind.ConstantAggregateZeroValueKind).toBe(15);
			expect(LLVMValueKind.ConstantDataArrayValueKind).toBe(16);
			expect(LLVMValueKind.ConstantDataVectorValueKind).toBe(17);
			expect(LLVMValueKind.ConstantIntValueKind).toBe(18);
			expect(LLVMValueKind.ConstantFPValueKind).toBe(19);
			expect(LLVMValueKind.ConstantPointerNullValueKind).toBe(20);
			expect(LLVMValueKind.ConstantTokenNoneValueKind).toBe(21);
			expect(LLVMValueKind.MetadataAsValueValueKind).toBe(22);
			expect(LLVMValueKind.InlineAsmValueKind).toBe(23);
			expect(LLVMValueKind.InstructionValueKind).toBe(24);
		});
	});

	describe("LLVMIntPredicate", () => {
		it("should have correct values for integer predicates", () => {
			expect(LLVMIntPredicate.IntEQ).toBe(32);
			expect(LLVMIntPredicate.IntNE).toBe(33);
			expect(LLVMIntPredicate.IntUGT).toBe(34);
			expect(LLVMIntPredicate.IntUGE).toBe(35);
			expect(LLVMIntPredicate.IntULT).toBe(36);
			expect(LLVMIntPredicate.IntULE).toBe(37);
			expect(LLVMIntPredicate.IntSGT).toBe(38);
			expect(LLVMIntPredicate.IntSGE).toBe(39);
			expect(LLVMIntPredicate.IntSLT).toBe(40);
			expect(LLVMIntPredicate.IntSLE).toBe(41);
		});
	});

	describe("LLVMRealPredicate", () => {
		it("should have correct values for real predicates", () => {
			expect(LLVMRealPredicate.RealPredicateFalse).toBe(0);
			expect(LLVMRealPredicate.RealOEQ).toBe(1);
			expect(LLVMRealPredicate.RealOGT).toBe(2);
			expect(LLVMRealPredicate.RealOGE).toBe(3);
			expect(LLVMRealPredicate.RealOLT).toBe(4);
			expect(LLVMRealPredicate.RealOLE).toBe(5);
			expect(LLVMRealPredicate.RealONE).toBe(6);
			expect(LLVMRealPredicate.RealORD).toBe(7);
			expect(LLVMRealPredicate.RealUNO).toBe(8);
			expect(LLVMRealPredicate.RealUEQ).toBe(9);
			expect(LLVMRealPredicate.RealUGT).toBe(10);
			expect(LLVMRealPredicate.RealUGE).toBe(11);
			expect(LLVMRealPredicate.RealULT).toBe(12);
			expect(LLVMRealPredicate.RealULE).toBe(13);
			expect(LLVMRealPredicate.RealUNE).toBe(14);
			expect(LLVMRealPredicate.RealPredicateTrue).toBe(15);
		});
	});

	describe("LLVMThreadLocalMode", () => {
		it("should have correct values for thread local modes", () => {
			expect(LLVMThreadLocalMode.NotThreadLocal).toBe(0);
			expect(LLVMThreadLocalMode.GeneralDynamicTLSModel).toBe(1);
			expect(LLVMThreadLocalMode.LocalDynamicTLSModel).toBe(2);
			expect(LLVMThreadLocalMode.InitialExecTLSModel).toBe(3);
			expect(LLVMThreadLocalMode.LocalExecTLSModel).toBe(4);
		});
	});

	describe("LLVMTailCallKind", () => {
		it("should have correct values for tail call kinds", () => {
			expect(LLVMTailCallKind.TailCallKindNone).toBe(0);
			expect(LLVMTailCallKind.TailCallKindTail).toBe(1);
			expect(LLVMTailCallKind.TailCallKindMustTail).toBe(2);
			expect(LLVMTailCallKind.TailCallKindNoTail).toBe(3);
		});
	});

	describe("LLVMUnnamedAddr", () => {
		it("should have correct values for unnamed address", () => {
			expect(LLVMUnnamedAddr.NoUnnamedAddr).toBe(0);
			expect(LLVMUnnamedAddr.LocalUnnamedAddr).toBe(1);
			expect(LLVMUnnamedAddr.GlobalUnnamedAddr).toBe(2);
		});
	});

	describe("LLVMInlineAsmDialect", () => {
		it("should have correct values for inline assembly dialects", () => {
			expect(LLVMInlineAsmDialect.InlineAsmDialectATT).toBe(0);
			expect(LLVMInlineAsmDialect.InlineAsmDialectIntel).toBe(1);
		});
	});

	describe("LLVMCastKind", () => {
		it("should have correct values for cast kinds", () => {
			expect(LLVMCastKind.Trunc).toBe(30);
			expect(LLVMCastKind.ZExt).toBe(31);
			expect(LLVMCastKind.SExt).toBe(32);
			expect(LLVMCastKind.FPToUI).toBe(33);
			expect(LLVMCastKind.FPToSI).toBe(34);
			expect(LLVMCastKind.BitCast).toBe(41);
			expect(LLVMCastKind.AddrSpaceCast).toBe(60);
		});
	});

	describe("LLVMCmpInstOpcode", () => {
		it("should have correct values for comparison instruction opcodes", () => {
			expect(LLVMCmpInstOpcode.ICmp).toBe(42);
			expect(LLVMCmpInstOpcode.FCmp).toBe(43);
		});
	});

	describe("LLVMCmpInstPredicate", () => {
		it("should have correct values for comparison predicates", () => {
			expect(LLVMCmpInstPredicate.BadICmpPredicate).toBe(0);
			expect(LLVMCmpInstPredicate.BadFCmpPredicate).toBe(0);
			expect(LLVMCmpInstPredicate.IntEQ).toBe(32);
			expect(LLVMCmpInstPredicate.RealOEQ).toBe(1);
			expect(LLVMCmpInstPredicate.RealPredicateTrue).toBe(15);
		});
	});

	describe("LLVMDiagnosticSeverity", () => {
		it("should have correct values for diagnostic severity", () => {
			expect(LLVMDiagnosticSeverity.DSError).toBe(0);
			expect(LLVMDiagnosticSeverity.DSWarning).toBe(1);
			expect(LLVMDiagnosticSeverity.DSRemark).toBe(2);
			expect(LLVMDiagnosticSeverity.DSNote).toBe(3);
		});
	});

	describe("GlobalValueLinkageTypes", () => {
		it("should have correct values for global value linkage types", () => {
			expect(GlobalValueLinkageTypes.ExternalLinkage).toBe(0);
			expect(GlobalValueLinkageTypes.AvailableExternallyLinkage).toBe(1);
			expect(GlobalValueLinkageTypes.LinkOnceAnyLinkage).toBe(2);
			expect(GlobalValueLinkageTypes.LinkOnceODRLinkage).toBe(3);
			expect(GlobalValueLinkageTypes.WeakAnyLinkage).toBe(4);
			expect(GlobalValueLinkageTypes.WeakODRLinkage).toBe(5);
			expect(GlobalValueLinkageTypes.AppendingLinkage).toBe(6);
			expect(GlobalValueLinkageTypes.InternalLinkage).toBe(7);
			expect(GlobalValueLinkageTypes.PrivateLinkage).toBe(8);
			expect(GlobalValueLinkageTypes.ExternalWeakLinkage).toBe(9);
			expect(GlobalValueLinkageTypes.CommonLinkage).toBe(10);
		});
	});

	describe("GlobalValueVisibilityTypes", () => {
		it("should have correct values for global value visibility types", () => {
			expect(GlobalValueVisibilityTypes.DefaultVisibility).toBe(0);
			expect(GlobalValueVisibilityTypes.HiddenVisibility).toBe(1);
			expect(GlobalValueVisibilityTypes.ProtectedVisibility).toBe(2);
		});
	});

	describe("GlobalValueDLLStorageClassTypes", () => {
		it("should have correct values for DLL storage class types", () => {
			expect(GlobalValueDLLStorageClassTypes.DefaultStorageClass).toBe(0);
			expect(GlobalValueDLLStorageClassTypes.DLLImportStorageClass).toBe(1);
			expect(GlobalValueDLLStorageClassTypes.DLLExportStorageClass).toBe(2);
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
			expect(LLVMFastMathNoInfs).toBe(4);
			expect(LLVMFastMathNoSignedZeros).toBe(8);
			expect(LLVMFastMathAllowReciprocal).toBe(16);
			expect(LLVMFastMathAllowContract).toBe(32);
			expect(LLVMFastMathApproxFunc).toBe(64);
			expect(LLVMFastMathNone).toBe(0);
			expect(LLVMFastMathAll).toBe(127); // All flags combined
		});

		it("should have correct values for GEP flags", () => {
			expect(LLVMGEPFlagInBounds).toBe(1);
			expect(LLVMGEPFlagNUSW).toBe(2);
			expect(LLVMGEPFlagNUW).toBe(4);
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

		it("should allow combining fast math flags", () => {
			const fastMathFlags = LLVMFastMathAllowReassoc | LLVMFastMathNoNaNs;
			expect(fastMathFlags).toBe(3); // 1 | 2 = 3
		});

		it("should allow checking flag presence", () => {
			const flags = LLVMFastMathAllowReassoc | LLVMFastMathNoNaNs;
			expect(flags & LLVMFastMathAllowReassoc).toBeTruthy();
			expect(flags & LLVMFastMathNoNaNs).toBeTruthy();
			expect(flags & LLVMFastMathNoInfs).toBeFalsy();
		});

		it("should allow combining GEP flags", () => {
			const gepFlags = LLVMGEPFlagInBounds | LLVMGEPFlagNUW;
			expect(gepFlags).toBe(5); // 1 | 4 = 5
		});

		it("should work with type kind checks", () => {
			const voidKind = LLVMTypeKind.VoidTypeKind;
			const intKind = LLVMTypeKind.IntegerTypeKind;

			expect(voidKind).toBe(0);
			expect(intKind).toBe(8);
			expect(voidKind).not.toBe(intKind);
		});

		it("should work with atomic ordering comparisons", () => {
			const notAtomic = LLVMAtomicOrdering.AtomicOrderingNotAtomic;
			const monotonic = LLVMAtomicOrdering.AtomicOrderingMonotonic;

			expect(notAtomic < monotonic).toBe(true);
			expect(monotonic > notAtomic).toBe(true);
		});
	});
});
