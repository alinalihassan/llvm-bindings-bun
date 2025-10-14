/**
 * LLVM C API Enums - TypeScript definitions
 * Based on the official LLVM C API header
 */

/**
 * LLVM Opcode enumeration
 * Represents the different types of LLVM instructions
 */
export enum LLVMOpcode {
	/* Terminator Instructions */
	Ret = 1,
	Br = 2,
	Switch = 3,
	IndirectBr = 4,
	Invoke = 5,
	/* removed 6 due to API changes */
	Unreachable = 7,
	CallBr = 67,

	/* Standard Unary Operators */
	FNeg = 66,

	/* Standard Binary Operators */
	Add = 8,
	FAdd = 9,
	Sub = 10,
	FSub = 11,
	Mul = 12,
	FMul = 13,
	UDiv = 14,
	SDiv = 15,
	FDiv = 16,
	URem = 17,
	SRem = 18,
	FRem = 19,

	/* Logical Operators */
	Shl = 20,
	LShr = 21,
	AShr = 22,
	And = 23,
	Or = 24,
	Xor = 25,

	/* Memory Operators */
	Alloca = 26,
	Load = 27,
	Store = 28,
	GetElementPtr = 29,

	/* Cast Operators */
	Trunc = 30,
	ZExt = 31,
	SExt = 32,
	FPToUI = 33,
	FPToSI = 34,
	UIToFP = 35,
	SIToFP = 36,
	FPTrunc = 37,
	FPExt = 38,
	PtrToInt = 39,
	PtrToAddr = 69,
	IntToPtr = 40,
	BitCast = 41,
	AddrSpaceCast = 60,

	/* Other Operators */
	ICmp = 42,
	FCmp = 43,
	PHI = 44,
	Call = 45,
	Select = 46,
	UserOp1 = 47,
	UserOp2 = 48,
	VAArg = 49,
	ExtractElement = 50,
	InsertElement = 51,
	ShuffleVector = 52,
	ExtractValue = 53,
	InsertValue = 54,
	Freeze = 68,

	/* Atomic operators */
	Fence = 55,
	AtomicCmpXchg = 56,
	AtomicRMW = 57,

	/* Exception Handling Operators */
	Resume = 58,
	LandingPad = 59,
	CleanupRet = 61,
	CatchRet = 62,
	CatchPad = 63,
	CleanupPad = 64,
	CatchSwitch = 65,
}

export enum LLVMCastKind {
	Trunc = 30,
	ZExt = 31,
	SExt = 32,
	FPToUI = 33,
	FPToSI = 34,
	UIToFP = 35,
	SIToFP = 36,
	FPTrunc = 37,
	FPExt = 38,
	PtrToInt = 39,
	PtrToAddr = 69,
	IntToPtr = 40,
	BitCast = 41,
	AddrSpaceCast = 60,
}

/**
 * LLVM Type Kind enumeration
 * Represents the different types of LLVM types
 */
export enum LLVMTypeKind {
	VoidType = 0 /**< type with no size */,
	HalfType = 1 /**< 16 bit floating point type */,
	FloatType = 2 /**< 32 bit floating point type */,
	DoubleType = 3 /**< 64 bit floating point type */,
	X86_FP80Type = 4 /**< 80 bit floating point type (X87) */,
	FP128Type = 5 /**< 128 bit floating point type (112-bit mantissa)*/,
	PPC_FP128Type = 6 /**< 128 bit floating point type (two 64-bits) */,
	LabelType = 7 /**< Labels */,
	IntegerType = 8 /**< Arbitrary bit width integers */,
	FunctionType = 9 /**< Functions */,
	StructType = 10 /**< Structures */,
	ArrayType = 11 /**< Arrays */,
	PointerType = 12 /**< Pointers */,
	VectorType = 13 /**< Fixed width SIMD vector type */,
	MetadataType = 14 /**< Metadata */,
	/* 15 previously used by LLVMX86_MMXTypeKind */
	TokenType = 16 /**< Tokens */,
	ScalableVectorType = 17 /**< Scalable SIMD vector type */,
	BFloatType = 18 /**< 16 bit brain floating point type */,
	X86_AMXType = 19 /**< X86 AMX */,
	TargetExtType = 20 /**< Target extension type */,
}

/**
 * LLVM Linkage enumeration
 * Represents the different linkage types for global values
 */
export enum LLVMLinkage {
	ExternalLinkage /**< Externally visible function */,
	AvailableExternallyLinkage,
	LinkOnceAnyLinkage /**< Keep one copy of function when linking (inline)*/,
	LinkOnceODRLinkage /**< Same, but only replaced by something equivalent. */,
	LinkOnceODRAutoHideLinkage /**< Obsolete */,
	WeakAnyLinkage /**< Keep one copy of function when linking (weak) */,
	WeakODRLinkage /**< Same, but only replaced by something equivalent. */,
	AppendingLinkage /**< Special purpose, only applies to global arrays */,
	InternalLinkage /**< Rename collisions when linking (static functions) */,
	PrivateLinkage /**< Like Internal, but omit from symbol table */,
	DLLImportLinkage /**< Obsolete */,
	DLLExportLinkage /**< Obsolete */,
	ExternalWeakLinkage /**< ExternalWeak linkage description */,
	GhostLinkage /**< Obsolete */,
	CommonLinkage /**< Tentative definitions */,
	LinkerPrivateLinkage /**< Like Private, but linker removes. */,
	LinkerPrivateWeakLinkage /**< Like LinkerPrivate, but is weak. */,
}

/**
 * LLVM Visibility enumeration
 * Represents the visibility of global values
 */
export enum LLVMVisibility {
	DefaultVisibility /**< The GV is visible */,
	HiddenVisibility /**< The GV is hidden */,
	ProtectedVisibility /**< The GV is protected */,
}

/**
 * LLVM Unnamed Address enumeration
 * Represents the unnamed address property of global values
 */
export enum LLVMUnnamedAddr {
	NoUnnamedAddr /**< Address of the GV is significant. */,
	LocalUnnamedAddr /**< Address of the GV is locally insignificant. */,
	GlobalUnnamedAddr /**< Address of the GV is globally insignificant. */,
}

/**
 * LLVM DLL Storage Class enumeration
 * Represents the DLL storage class for functions
 */
export enum LLVMDLLStorageClass {
	DefaultStorageClass = 0,
	DLLImportStorageClass = 1 /**< Function to be imported from DLL. */,
	DLLExportStorageClass = 2 /**< Function to be accessible from DLL. */,
}

/**
 * LLVM Calling Convention enumeration
 * Represents the different calling conventions
 * Based on LLVM CallingConv namespace
 */
export enum LLVMCallConv {
	/** The default llvm calling convention, compatible with C. This convention
	 * is the only one that supports varargs calls. As with typical C calling
	 * conventions, the callee/caller have to tolerate certain amounts of
	 * prototype mismatch. */
	CCallConv = 0,

	/** Attempts to make calls as fast as possible (e.g. by passing things in
	 * registers). */
	FastCallConv = 8,

	/** Attempts to make code in the caller as efficient as possible under the
	 * assumption that the call is not commonly executed. As such, these calls
	 * often preserve all registers so that the call does not break any live
	 * ranges in the caller side. */
	ColdCallConv = 9,

	/** Used by the Glasgow Haskell Compiler (GHC). */
	GHCCallConv = 10,

	/** Used by the High-Performance Erlang Compiler (HiPE). */
	HiPECallConv = 11,

	/** Used for dynamic register based calls (e.g. stackmap and patchpoint
	 * intrinsics). */
	AnyRegCallConv = 13,

	/** Used for runtime calls that preserves most registers. */
	PreserveMostCallConv = 14,

	/** Used for runtime calls that preserves (almost) all registers. */
	PreserveAllCallConv = 15,

	/** Calling convention for Swift. */
	SwiftCallConv = 16,

	/** Used for access functions. */
	CXXFASTTLSCallConv = 17,

	/** Attemps to make calls as fast as possible while guaranteeing that tail
	 * call optimization can always be performed. */
	TailCallConv = 18,

	/** Special calling convention on Windows for calling the Control Guard
	 * Check ICall funtion. The function takes exactly one argument (address of
	 * the target function) passed in the first argument register, and has no
	 * return value. All register values are preserved. */
	CFGuardCheckCallConv = 19,

	/** This follows the Swift calling convention in how arguments are passed
	 * but guarantees tail calls will be made by making the callee clean up
	 * their stack. */
	SwiftTailCallConv = 20,

	/** Used for runtime calls that preserves none general registers. */
	PreserveNoneCallConv = 21,

	/** This is the start of the target-specific calling conventions, e.g.
	 * fastcall and thiscall on X86. */
	FirstTargetCC = 64,

	/** stdcall is mostly used by the Win32 API. It is basically the same as the
	 * C convention with the difference in that the callee is responsible for
	 * popping the arguments from the stack. */
	X86StdcallCallConv = 64,

	/** 'fast' analog of X86_StdCall. Passes first two arguments in ECX:EDX
	 * registers, others - via stack. Callee is responsible for stack cleaning. */
	X86FastcallCallConv = 65,

	/** ARM Procedure Calling Standard (obsolete, but still used on some
	 * targets). */
	ARMAPCSCallConv = 66,

	/** ARM Architecture Procedure Calling Standard calling convention (aka
	 * EABI). Soft float variant. */
	ARMAAPCSCallConv = 67,

	/** Same as ARM_AAPCS, but uses hard floating point ABI. */
	ARMAAPCSVFPCallConv = 68,

	/** Used for MSP430 interrupt routines. */
	MSP430INTRCallConv = 69,

	/** Similar to X86_StdCall. Passes first argument in ECX, others via stack.
	 * Callee is responsible for stack cleaning. MSVC uses this by default for
	 * methods in its ABI. */
	X86ThisCallCallConv = 70,

	/** Call to a PTX kernel. Passes all arguments in parameter space. */
	PTXKernelCallConv = 71,

	/** Call to a PTX device function. Passes all arguments in register or
	 * parameter space. */
	PTXDeviceCallConv = 72,

	/** Used for SPIR non-kernel device functions. No lowering or expansion of
	 * arguments. Structures are passed as a pointer to a struct with the
	 * byval attribute. Functions can only call SPIR_FUNC and SPIR_KERNEL
	 * functions. Functions can only have zero or one return values. Variable
	 * arguments are not allowed, except for printf. How arguments/return
	 * values are lowered are not specified. Functions are only visible to the
	 * devices. */
	SPIRFUNCCallConv = 75,

	/** Used for SPIR kernel functions. Inherits the restrictions of SPIR_FUNC,
	 * except it cannot have non-void return values, it cannot have variable
	 * arguments, it can also be called by the host or it is externally
	 * visible. */
	SPIRKERNELCallConv = 76,

	/** Used for Intel OpenCL built-ins. */
	IntelOCLBICallConv = 77,

	/** The C convention as specified in the x86-64 supplement to the System V
	 * ABI, used on most non-Windows systems. */
	X8664SysVCallConv = 78,

	/** The C convention as implemented on Windows/x86-64 and AArch64. It
	 * differs from the more common \c X86_64_SysV convention in a number of
	 * ways, most notably in that XMM registers used to pass arguments are
	 * shadowed by GPRs, and vice versa. On AArch64, this is identical to the
	 * normal C (AAPCS) calling convention for normal functions, but floats are
	 * passed in integer registers to variadic functions. */
	Win64CallConv = 79,

	/** MSVC calling convention that passes vectors and vector aggregates in SSE
	 * registers. */
	X86VectorCallCallConv = 80,

	/** Placeholders for HHVM calling conventions (deprecated, removed). */
	DUMMYHHVMCallConv = 81,
	DUMMYHHVMCCallConv = 82,

	/** x86 hardware interrupt context. Callee may take one or two parameters,
	 * where the 1st represents a pointer to hardware context frame and the 2nd
	 * represents hardware error code, the presence of the later depends on the
	 * interrupt vector taken. Valid for both 32- and 64-bit subtargets. */
	X86INTRCallConv = 83,

	/** Used for AVR interrupt routines. */
	AVRINTRCallConv = 84,

	/** Used for AVR signal routines. */
	AVRSIGNALCallConv = 85,

	/** Used for special AVR rtlib functions which have an "optimized"
	 * convention to preserve registers. */
	AVRBUILTINCallConv = 86,

	/** Used for Mesa vertex shaders, or AMDPAL last shader stage before
	 * rasterization (vertex shader if tessellation and geometry are not in
	 * use, or otherwise copy shader if one is needed). */
	AMDGPUVSCallConv = 87,

	/** Used for Mesa/AMDPAL geometry shaders. */
	AMDGPUGSCallConv = 88,

	/** Used for Mesa/AMDPAL pixel shaders. */
	AMDGPUPSCallConv = 89,

	/** Used for Mesa/AMDPAL compute shaders. */
	AMDGPUCSCallConv = 90,

	/** Used for AMDGPU code object kernels. */
	AMDGPUKERNELCallConv = 91,

	/** Register calling convention used for parameters transfer optimization */
	X86RegCallCallConv = 92,

	/** Used for Mesa/AMDPAL hull shaders (= tessellation control shaders). */
	AMDGPUHSCallConv = 93,

	/** Used for special MSP430 rtlib functions which have an "optimized"
	 * convention using additional registers. */
	MSP430BUILTINCallConv = 94,

	/** Used for AMDPAL vertex shader if tessellation is in use. */
	AMDGPULSCallConv = 95,

	/** Used for AMDPAL shader stage before geometry shader if geometry is in
	 * use. So either the domain (= tessellation evaluation) shader if
	 * tessellation is in use, or otherwise the vertex shader. */
	AMDGPUESCallConv = 96,

	/** Used between AArch64 Advanced SIMD functions */
	AArch64VectorCallCallConv = 97,

	/** Used between AArch64 SVE functions */
	AArch64SVEVectorCallCallConv = 98,

	/** For emscripten __invoke_* functions. The first argument is required to
	 * be the function ptr being indirectly called. The remainder matches the
	 * regular calling convention. */
	WASMEmscriptenInvokeCallConv = 99,

	/** Used for AMD graphics targets. */
	AMDGPUGfxCallConv = 100,

	/** Used for M68k interrupt routines. */
	M68kINTRCallConv = 101,

	/** Preserve X0-X13, X19-X29, SP, Z0-Z31, P0-P15. */
	AArch64SMEABISupportRoutinesPreserveMostFromX0CallConv = 102,

	/** Preserve X2-X15, X19-X29, SP, Z0-Z31, P0-P15. */
	AArch64SMEABISupportRoutinesPreserveMostFromX2CallConv = 103,

	/** Used on AMDGPUs to give the middle-end more control over argument
	 * placement. */
	AMDGPUCSChainCallConv = 104,

	/** Used on AMDGPUs to give the middle-end more control over argument
	 * placement. Preserves active lane values for input VGPRs. */
	AMDGPUCSChainPreserveCallConv = 105,

	/** Used for M68k rtd-based CC (similar to X86's stdcall). */
	M68kRTDCallConv = 106,

	/** Used by GraalVM. Two additional registers are reserved. */
	GRAALCallConv = 107,

	/** Calling convention used in the ARM64EC ABI to implement calls between
	 * x64 code and thunks. This is basically the x64 calling convention using
	 * ARM64 register names. The first parameter is mapped to x9. */
	ARM64ECThunkX64CallConv = 108,

	/** Calling convention used in the ARM64EC ABI to implement calls between
	 * ARM64 code and thunks. This is just the ARM64 calling convention,
	 * except that the first parameter is mapped to x9. */
	ARM64ECThunkNativeCallConv = 109,

	/** Calling convention used for RISC-V V-extension. */
	RISCVVectorCallCallConv = 110,

	/** Preserve X1-X15, X19-X29, SP, Z0-Z31, P0-P15. */
	AArch64SMEABISupportRoutinesPreserveMostFromX1CallConv = 111,

	/** Calling convention used for RISC-V V-extension fixed vectors. */
	RISCVLSCall32CallConv = 112,
	RISCVLSCall64CallConv = 113,
	RISCVLSCall128CallConv = 114,
	RISCVLSCall256CallConv = 115,
	RISCVLSCall512CallConv = 116,
	RISCVLSCall1024CallConv = 117,
	RISCVLSCall2048CallConv = 118,
	RISCVLSCall4096CallConv = 119,
	RISCVLSCall8192CallConv = 120,
	RISCVLSCall16384CallConv = 121,
	RISCVLSCall32768CallConv = 122,
	RISCVLSCall65536CallConv = 123,

	/** Calling convention for AMDGPU whole wave functions. */
	AMDGPUGfxWholeWaveCallConv = 124,

	/** Calling convention used for CHERIoT when crossing a protection boundary. */
	CHERIoTCompartmentCallCallConv = 125,

	/** Calling convention used for the callee of CHERIoT_CompartmentCall.
	 * Ignores the first two capability arguments and the first integer
	 * argument, zeroes all unused return registers on return. */
	CHERIoTCompartmentCalleeCallConv = 126,

	/** Calling convention used for CHERIoT for cross-library calls to a
	 * stateless compartment. */
	CHERIoTLibraryCallCallConv = 127,

	/** The highest possible ID. Must be some 2^k - 1. */
	MaxID = 1023,
}

/**
 * LLVM Value Kind enumeration
 * Represents the different kinds of LLVM values
 */
export enum LLVMValueKind {
	ArgumentValueKind,
	BasicBlockValueKind,
	MemoryUseValueKind,
	MemoryDefValueKind,
	MemoryPhiValueKind,

	FunctionValueKind,
	GlobalAliasValueKind,
	GlobalIFuncValueKind,
	GlobalVariableValueKind,
	BlockAddressValueKind,
	ConstantExprValueKind,
	ConstantArrayValueKind,
	ConstantStructValueKind,
	ConstantVectorValueKind,

	UndefValueValueKind,
	ConstantAggregateZeroValueKind,
	ConstantDataArrayValueKind,
	ConstantDataVectorValueKind,
	ConstantIntValueKind,
	ConstantFPValueKind,
	ConstantPointerNullValueKind,
	ConstantTokenNoneValueKind,

	MetadataAsValueValueKind,
	InlineAsmValueKind,

	InstructionValueKind,
	PoisonValueValueKind,
	ConstantTargetNoneValueKind,
	ConstantPtrAuthValueKind,
}

/**
 * LLVM Integer Predicate enumeration
 * Represents the different integer comparison predicates
 */
export enum LLVMIntPredicate {
	IntEQ = 32 /**< equal */,
	IntNE /**< not equal */,
	IntUGT /**< unsigned greater than */,
	IntUGE /**< unsigned greater or equal */,
	IntULT /**< unsigned less than */,
	IntULE /**< unsigned less or equal */,
	IntSGT /**< signed greater than */,
	IntSGE /**< signed greater or equal */,
	IntSLT /**< signed less than */,
	IntSLE /**< signed less or equal */,
}

/**
 * LLVM Real Predicate enumeration
 * Represents the different floating-point comparison predicates
 */
export enum LLVMRealPredicate {
	RealPredicateFalse /**< Always false (always folded) */,
	RealOEQ /**< True if ordered and equal */,
	RealOGT /**< True if ordered and greater than */,
	RealOGE /**< True if ordered and greater than or equal */,
	RealOLT /**< True if ordered and less than */,
	RealOLE /**< True if ordered and less than or equal */,
	RealONE /**< True if ordered and operands are unequal */,
	RealORD /**< True if ordered (no nans) */,
	RealUNO /**< True if unordered: isnan(X) | isnan(Y) */,
	RealUEQ /**< True if unordered or equal */,
	RealUGT /**< True if unordered or greater than */,
	RealUGE /**< True if unordered, greater than, or equal */,
	RealULT /**< True if unordered or less than */,
	RealULE /**< True if unordered, less than, or equal */,
	RealUNE /**< True if unordered or not equal */,
	RealPredicateTrue /**< Always true (always folded) */,
}

/**
 * LLVM Thread Local Mode enumeration
 * Represents the thread-local storage model
 */
export enum LLVMThreadLocalMode {
	NotThreadLocal = 0,
	GeneralDynamicTLSModel,
	LocalDynamicTLSModel,
	InitialExecTLSModel,
	LocalExecTLSModel,
}

/**
 * LLVM Atomic Ordering enumeration
 * Represents the atomic ordering constraints
 */
export enum LLVMAtomicOrdering {
	AtomicOrderingNotAtomic = 0 /**< A load or store which is not atomic */,
	AtomicOrderingUnordered = 1 /**< Lowest level of atomicity, guarantees somewhat sane results, lock free. */,
	AtomicOrderingMonotonic = 2 /**< guarantees that if you take all the operations affecting a specific address, a consistent ordering exists */,
	AtomicOrderingAcquire = 4 /**< Acquire provides a barrier of the sort necessary to acquire a lock to access other memory with normal loads and stores. */,
	AtomicOrderingRelease = 5 /**< Release is similar to Acquire, but with a barrier of the sort necessary to release a lock. */,
	AtomicOrderingAcquireRelease = 6 /**< provides both an Acquire and a Release barrier (for fences and operations which both read and write memory). */,
	AtomicOrderingSequentiallyConsistent = 7 /**< provides Acquire semantics for loads and Release semantics for stores. Additionally, it guarantees that a total ordering exists between all SequentiallyConsistent operations. */,
}

/**
 * LLVM Atomic RMW Binary Operation enumeration
 * Represents the different atomic read-modify-write operations
 */
export enum LLVMAtomicRMWBinOp {
	AtomicRMWBinOpXchg /**< Set the new value and return the one old */,
	AtomicRMWBinOpAdd /**< Add a value and return the old one */,
	AtomicRMWBinOpSub /**< Subtract a value and return the old one */,
	AtomicRMWBinOpAnd /**< And a value and return the old one */,
	AtomicRMWBinOpNand /**< Not-And a value and return the old one */,
	AtomicRMWBinOpOr /**< OR a value and return the old one */,
	AtomicRMWBinOpXor /**< Xor a value and return the old one */,
	AtomicRMWBinOpMax /**< Sets the value if it's greater than the original using a signed comparison and return the old one */,
	AtomicRMWBinOpMin /**< Sets the value if it's Smaller than the original using a signed comparison and return the old one */,
	AtomicRMWBinOpUMax /**< Sets the value if it's greater than the original using an unsigned comparison and return the old one */,
	AtomicRMWBinOpUMin /**< Sets the value if it's greater than the original using an unsigned comparison and return the old one */,
	AtomicRMWBinOpFAdd /**< Add a floating point value and return the old one */,
	AtomicRMWBinOpFSub /**< Subtract a floating point value and return the old one */,
	AtomicRMWBinOpFMax /**< Sets the value if it's greater than the original using an floating point comparison and return the old one */,
	AtomicRMWBinOpFMin /**< Sets the value if it's smaller than the original using an floating point comparison and return the old one */,
	AtomicRMWBinOpUIncWrap /**< Increments the value, wrapping back to zero when incremented above input value */,
	AtomicRMWBinOpUDecWrap /**< Decrements the value, wrapping back to the input value when decremented below zero */,
	AtomicRMWBinOpUSubCond /**<Subtracts the value only if no unsigned overflow */,
	AtomicRMWBinOpUSubSat /**<Subtracts the value, clamping to zero */,
	AtomicRMWBinOpFMaximum /**< Sets the value if it's greater than the original using an floating point comparison and return the old one */,
	AtomicRMWBinOpFMinimum /**< Sets the value if it's smaller than the original using an floating point comparison and return the old one */,
}

/**
 * LLVM Diagnostic Severity enumeration
 * Represents the severity levels of diagnostics
 */
export enum LLVMDiagnosticSeverity {
	DSError,
	DSWarning,
	DSRemark,
	DSNote,
}

/**
 * LLVM Inline Assembly Dialect enumeration
 * Represents the different inline assembly dialects
 */
export enum LLVMInlineAsmDialect {
	InlineAsmDialectATT,
	InlineAsmDialectIntel,
}

/**
 * LLVM Module Flag Behavior enumeration
 * Represents the behavior of module flags during linking
 */
export enum LLVMModuleFlagBehavior {
	/**
	 * Emits an error if two values disagree, otherwise the resulting value is
	 * that of the operands.
	 *
	 * @see Module::ModFlagBehavior::Error
	 */
	ModuleFlagBehaviorError,
	/**
	 * Emits a warning if two values disagree. The result value will be the
	 * operand for the flag from the first module being linked.
	 *
	 * @see Module::ModFlagBehavior::Warning
	 */
	ModuleFlagBehaviorWarning,
	/**
	 * Adds a requirement that another module flag be present and have a
	 * specified value after linking is performed. The value must be a metadata
	 * pair, where the first element of the pair is the ID of the module flag
	 * to be restricted, and the second element of the pair is the value the
	 * module flag should be restricted to. This behavior can be used to
	 * restrict the allowable results (via triggering of an error) of linking
	 * IDs with the **Override** behavior.
	 *
	 * @see Module::ModFlagBehavior::Require
	 */
	ModuleFlagBehaviorRequire,
	/**
	 * Uses the specified value, regardless of the behavior or value of the
	 * other module. If both modules specify **Override**, but the values
	 * differ, an error will be emitted.
	 *
	 * @see Module::ModFlagBehavior::Override
	 */
	ModuleFlagBehaviorOverride,
	/**
	 * Appends the two values, which are required to be metadata nodes.
	 *
	 * @see Module::ModFlagBehavior::Append
	 */
	ModuleFlagBehaviorAppend,
	/**
	 * Appends the two values, which are required to be metadata
	 * nodes. However, duplicate entries in the second list are dropped
	 * during the append operation.
	 *
	 * @see Module::ModFlagBehavior::AppendUnique
	 */
	ModuleFlagBehaviorAppendUnique,
}

/**
 * LLVM Attribute Index constants
 * Special attribute indices for return values and functions
 */
export const LLVMAttributeReturnIndex = 0;
export const LLVMAttributeFunctionIndex = -1;

/**
 * LLVM Tail Call Kind enumeration
 * Represents the tail call optimization kind
 */
export enum LLVMTailCallKind {
	TailCallKindNone = 0,
	TailCallKindTail = 1,
	TailCallKindMustTail = 2,
	TailCallKindNoTail = 3,
}

/**
 * LLVM Fast Math Flags constants
 * Flags for fast math optimizations
 */
export const LLVMFastMathAllowReassoc = 1 << 0;
export const LLVMFastMathNoNaNs = 1 << 1;
export const LLVMFastMathNoInfs = 1 << 2;
export const LLVMFastMathNoSignedZeros = 1 << 3;
export const LLVMFastMathAllowReciprocal = 1 << 4;
export const LLVMFastMathAllowContract = 1 << 5;
export const LLVMFastMathApproxFunc = 1 << 6;
export const LLVMFastMathNone = 0;
export const LLVMFastMathAll =
	LLVMFastMathAllowReassoc |
	LLVMFastMathNoNaNs |
	LLVMFastMathNoInfs |
	LLVMFastMathNoSignedZeros |
	LLVMFastMathAllowReciprocal |
	LLVMFastMathAllowContract |
	LLVMFastMathApproxFunc;

/**
 * LLVM GEP No Wrap Flags constants
 * Flags for getelementptr instruction constraints
 */
export const LLVMGEPFlagInBounds = 1 << 0;
export const LLVMGEPFlagNUSW = 1 << 1;
export const LLVMGEPFlagNUW = 1 << 2;

/**
 * LLVM CmpInst Predicate enumeration
 * Represents the different comparison predicates for CmpInst
 */
export enum LLVMCmpInstPredicate {
	// Invalid predicate (must be first)
	BadICmpPredicate = 0,
	BadFCmpPredicate = 0,

	// Integer comparison predicates
	IntEQ = 32 /**< equal */,
	IntNE /**< not equal */,
	IntUGT /**< unsigned greater than */,
	IntUGE /**< unsigned greater or equal */,
	IntULT /**< unsigned less than */,
	IntULE /**< unsigned less or equal */,
	IntSGT /**< signed greater than */,
	IntSGE /**< signed greater or equal */,
	IntSLT /**< signed less than */,
	IntSLE /**< signed less or equal */,

	// Floating-point comparison predicates
	RealPredicateFalse = 0 /**< Always false (always folded) */,
	RealOEQ = 1 /**< True if ordered and equal */,
	RealOGT = 2 /**< True if ordered and greater than */,
	RealOGE = 3 /**< True if ordered and greater than or equal */,
	RealOLT = 4 /**< True if ordered and less than */,
	RealOLE = 5 /**< True if ordered and less than or equal */,
	RealONE = 6 /**< True if ordered and operands are unequal */,
	RealORD = 7 /**< True if ordered (no nans) */,
	RealUNO = 8 /**< True if unordered: isnan(X) | isnan(Y) */,
	RealUEQ = 9 /**< True if unordered or equal */,
	RealUGT = 10 /**< True if unordered or greater than */,
	RealUGE = 11 /**< True if unordered, greater than, or equal */,
	RealULT = 12 /**< True if unordered or less than */,
	RealULE = 13 /**< True if unordered, less than, or equal */,
	RealUNE = 14 /**< True if unordered or not equal */,
	RealPredicateTrue = 15 /**< Always true (always folded) */,
}

/**
 * LLVM CmpInst Opcode enumeration
 * Represents the different opcodes for comparison instructions
 */
export enum LLVMCmpInstOpcode {
	ICmp = 42 /**< Integer comparison */,
	FCmp = 43 /**< Floating-point comparison */,
}

/**
 * LLVM LinkageTypes enumeration
 * Represents the different linkage types for global values
 * Based on llvm::GlobalValue::LinkageTypes
 */
export enum GlobalValueLinkageTypes {
	ExternalLinkage = 0 /**< Externally visible function */,
	AvailableExternallyLinkage /**< Available for inspection, not emission. */,
	LinkOnceAnyLinkage /**< Keep one copy of function when linking (inline) */,
	LinkOnceODRLinkage /**< Same, but only replaced by something equivalent. */,
	WeakAnyLinkage /**< Keep one copy of named function when linking (weak) */,
	WeakODRLinkage /**< Same, but only replaced by something equivalent. */,
	AppendingLinkage /**< Special purpose, only applies to global arrays */,
	InternalLinkage /**< Rename collisions when linking (static functions). */,
	PrivateLinkage /**< Like Internal, but omit from symbol table. */,
	ExternalWeakLinkage /**< ExternalWeak linkage description. */,
	CommonLinkage /**< Tentative definitions. */,
}

/**
 * LLVM GlobalValue VisibilityTypes enumeration
 * Represents the visibility of global values
 * Based on llvm::GlobalValue::VisibilityTypes
 */
export enum GlobalValueVisibilityTypes {
	DefaultVisibility = 0 /**< The GV is visible */,
	HiddenVisibility /**< The GV is hidden */,
	ProtectedVisibility /**< The GV is protected */,
}

/**
 * LLVM GlobalValue DLLStorageClassTypes enumeration
 * Storage classes of global values for PE targets
 * Based on llvm::GlobalValue::DLLStorageClassTypes
 */
export enum GlobalValueDLLStorageClassTypes {
	DefaultStorageClass = 0,
	DLLImportStorageClass = 1 /**< Function to be imported from DLL */,
	DLLExportStorageClass = 2 /**< Function to be accessible from DLL. */,
}

/**
 * LLVM Pass Pipeline enumeration
 * Represents the different optimization pipelines available in LLVM
 */
export enum PassPipeline {
	// Optimization levels
	NoOptimization = "default<O0>", // No optimizations (just canonicalization)
	BasicOptimization = "default<O1>", // Basic optimizations
	StandardOptimization = "default<O2>", // Standard optimizations
	AggressiveOptimization = "default<O3>", // Aggressive optimizations
	OptimizeForSize = "default<Os>", // Optimize for size
	OptimizeForMinSize = "default<Oz>", // Optimize for minimum size

	// LTO pipelines
	LTOPreLinkO2 = "lto-pre-link<O2>", // Pre-link time LTO pipeline (used by clang -flto)
	LTOO2 = "lto<O2>", // Full link-time optimization pipeline
	ThinLTOPreLinkO2 = "thinlto-pre-link<O2>", // Pre-link ThinLTO
	ThinLTOO2 = "thinlto<O2>", // Full ThinLTO

	// No-op pipelines
	NoOpModule = "no-op-module", // Does nothing (module-level placeholder)
	NoOpFunction = "no-op-function", // Does nothing (function-level placeholder)
}

/**
 * LLVM Code Generation Optimization Level enumeration
 * Represents the different optimization levels for code generation
 */
export enum CodeGenOptLevel {
	None = 0,
	Less = 1,
	Default = 2,
	Aggressive = 3,
}

/**
 * LLVM Relocation Mode enumeration
 * Represents the different relocation modes for code generation
 */
export enum RelocMode {
	Default = 0,
	Static = 1,
	PIC = 2,
	DynamicNoPic = 3,
	ROPI = 4,
	RWPI = 5,
	ROPI_RWPI = 6,
}

/**
 * LLVM Code Model enumeration
 * Represents the different code models for code generation
 */
export enum CodeModel {
	Default = 0,
	JITDefault = 1,
	Tiny = 2,
	Small = 3,
	Kernel = 4,
	Medium = 5,
	Large = 6,
}

/**
 * LLVM Code Generation File Type enumeration
 * Represents the different types of files that can be generated
 */
export enum CodeGenFileType {
	AssemblyFile = 0,
	ObjectFile = 1,
}
