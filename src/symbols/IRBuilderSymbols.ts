import { type FFIFunction, FFIType } from "bun:ffi";

const IRBuilderSymbols = {
	// IRBuilder creation and management
	LLVMCreateBuilder: {
		args: [],
		returns: /* LLVMBuilderRef */ FFIType.ptr,
	},
	LLVMCreateBuilderInContext: {
		args: [/* C: LLVMContextRef */ FFIType.ptr],
		returns: /* LLVMBuilderRef */ FFIType.ptr,
	},
	LLVMDisposeBuilder: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},

	// IRBuilder insertion point management
	LLVMPositionBuilder: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Block: LLVMBasicBlockRef */ FFIType.ptr,
			/* Instr: LLVMValueRef */ FFIType.ptr,
		],
		returns: /* void */ FFIType.void,
	},
	LLVMPositionBuilderBefore: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr, /* Instr: LLVMValueRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMPositionBuilderAtEnd: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr, /* Block: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},
	LLVMGetInsertBlock: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* LLVMBasicBlockRef */ FFIType.ptr,
	},
	LLVMClearInsertionPosition: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* void */ FFIType.void,
	},

	// Terminator instructions
	LLVMBuildRetVoid: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildRet: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr, /* V: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildBr: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr, /* Dest: LLVMBasicBlockRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildCondBr: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* If: LLVMValueRef */ FFIType.ptr,
			/* Then: LLVMBasicBlockRef */ FFIType.ptr,
			/* Else: LLVMBasicBlockRef */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSwitch: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Else: LLVMBasicBlockRef */ FFIType.ptr,
			/* NumCases: unsigned */ FFIType.u32,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildIndirectBr: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Addr: LLVMValueRef */ FFIType.ptr,
			/* NumDests: unsigned */ FFIType.u32,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildInvoke2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Fn: LLVMValueRef */ FFIType.ptr,
			/* Args: LLVMValueRef* */ FFIType.ptr,
			/* NumArgs: unsigned */ FFIType.u32,
			/* Then: LLVMBasicBlockRef */ FFIType.ptr,
			/* Catch: LLVMBasicBlockRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildResume: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr, /* Exn: LLVMValueRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildUnreachable: {
		args: [/* Builder: LLVMBuilderRef */ FFIType.ptr],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Binary operators
	LLVMBuildAdd: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFAdd: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSub: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFSub: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildMul: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFMul: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildUDiv: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSDiv: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFDiv: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildURem: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSRem: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFRem: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildAnd: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildOr: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildXor: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildShl: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildLShr: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildAShr: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildNeg: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFNeg: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildNot: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* V: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Memory instructions
	LLVMBuildAlloca: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildArrayAlloca: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildLoad2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* PointerVal: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildStore: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* Ptr: LLVMValueRef */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildGEP2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Pointer: LLVMValueRef */ FFIType.ptr,
			/* Indices: LLVMValueRef* */ FFIType.ptr,
			/* NumIndices: unsigned */ FFIType.u32,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildInBoundsGEP2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Pointer: LLVMValueRef */ FFIType.ptr,
			/* Indices: LLVMValueRef* */ FFIType.ptr,
			/* NumIndices: unsigned */ FFIType.u32,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Cast instructions
	LLVMBuildCast: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* CastKind: LLVMCastKind */ FFIType.u32,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildTrunc: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildZExt: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSExt: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFPToUI: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFPToSI: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildUIToFP: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSIToFP: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFPTrunc: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFPExt: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildPtrToInt: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildIntToPtr: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildBitCast: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildAddrSpaceCast: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* DestTy: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Comparison instructions
	LLVMBuildICmp: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Pred: LLVMIntPredicate */ FFIType.u32,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildFCmp: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Pred: LLVMRealPredicate */ FFIType.u32,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Other instructions
	LLVMBuildPhi: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildCall2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* Fn: LLVMValueRef */ FFIType.ptr,
			/* Args: LLVMValueRef* */ FFIType.ptr,
			/* NumArgs: unsigned */ FFIType.u32,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildSelect: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* If: LLVMValueRef */ FFIType.ptr,
			/* Then: LLVMValueRef */ FFIType.ptr,
			/* Else: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildExtractValue: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* AggVal: LLVMValueRef */ FFIType.ptr,
			/* Index: unsigned */ FFIType.u32,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildInsertValue: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* AggVal: LLVMValueRef */ FFIType.ptr,
			/* EltVal: LLVMValueRef */ FFIType.ptr,
			/* Index: unsigned */ FFIType.u32,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildLandingPad: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Ty: LLVMTypeRef */ FFIType.ptr,
			/* PersFn: LLVMValueRef */ FFIType.ptr,
			/* NumClauses: unsigned */ FFIType.u32,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Utility functions
	LLVMBuildIsNull: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildIsNotNull: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Val: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
	LLVMBuildPtrDiff2: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* ElemTy: LLVMTypeRef */ FFIType.ptr,
			/* LHS: LLVMValueRef */ FFIType.ptr,
			/* RHS: LLVMValueRef */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},

	// Global string functions
	LLVMBuildGlobalString: {
		args: [
			/* Builder: LLVMBuilderRef */ FFIType.ptr,
			/* Str: const char* */ FFIType.ptr,
			/* Name: const char* */ FFIType.ptr,
		],
		returns: /* LLVMValueRef */ FFIType.ptr,
	},
} as const satisfies Record<string, FFIFunction>;

export { IRBuilderSymbols };
