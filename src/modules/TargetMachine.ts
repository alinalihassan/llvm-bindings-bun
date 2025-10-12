import { ffi } from "@/ffi";
import type {
	LLVMMemoryBufferRef,
	LLVMModuleRef,
	LLVMTargetDataRef,
	LLVMTargetMachineRef,
	LLVMTargetRef,
} from "@/utils";
import { cstring } from "@/utils";

export enum CodeGenOptLevel {
	None = 0,
	Less = 1,
	Default = 2,
	Aggressive = 3,
}

export enum RelocMode {
	Default = 0,
	Static = 1,
	PIC = 2,
	DynamicNoPic = 3,
	ROPI = 4,
	RWPI = 5,
	ROPI_RWPI = 6,
}

export enum CodeModel {
	Default = 0,
	JITDefault = 1,
	Tiny = 2,
	Small = 3,
	Kernel = 4,
	Medium = 5,
	Large = 6,
}

export enum CodeGenFileType {
	AssemblyFile = 0,
	ObjectFile = 1,
}

export class TargetMachine {
	private _ref: LLVMTargetMachineRef;

	constructor(
		target: LLVMTargetRef,
		triple: string,
		cpu: string = "generic",
		features: string = "",
		optLevel: CodeGenOptLevel = CodeGenOptLevel.Default,
		relocMode: RelocMode = RelocMode.Default,
		codeModel: CodeModel = CodeModel.Default,
	) {
		this._ref = ffi.symbols.LLVMCreateTargetMachine(
			target,
			cstring(triple),
			cstring(cpu),
			cstring(features),
			optLevel,
			relocMode,
			codeModel,
		);

		if (!this._ref) {
			throw new Error("Failed to create target machine");
		}
	}

	/**
	 * Get the underlying LLVM target machine reference
	 */
	get ref(): LLVMTargetMachineRef {
		return this._ref;
	}

	/**
	 * Dispose of the target machine and free its memory
	 */
	dispose(): void {
		if (this._ref) {
			ffi.symbols.LLVMDisposeTargetMachine(this._ref);
			this._ref = null;
		}
	}

	/**
	 * Emit the module to a file.
	 * @param module The module to compile
	 * @param filename The output filename
	 * @param fileType The type of file to emit (assembly or object)
	 * @returns true on success, false on error
	 */
	emitToFile(module: LLVMModuleRef, filename: string, fileType: CodeGenFileType): boolean {
		const errorPtr = new Uint8Array(8);
		const success = ffi.symbols.LLVMTargetMachineEmitToFile(
			this._ref,
			module,
			cstring(filename),
			fileType,
			errorPtr,
		);
		return success;
	}

	/**
	 * Emit the module to a memory buffer.
	 * @param module The module to compile
	 * @param fileType The type of file to emit (assembly or object)
	 * @returns Memory buffer containing the compiled code, or null on error
	 */
	emitToMemoryBuffer(module: LLVMModuleRef, fileType: CodeGenFileType): LLVMMemoryBufferRef | null {
		const errorPtr = new Uint8Array(8);
		const bufferPtr = new Uint8Array(8);
		const success = ffi.symbols.LLVMTargetMachineEmitToMemoryBuffer(
			this._ref,
			module,
			fileType,
			errorPtr,
			bufferPtr,
		);
		return success ? (bufferPtr as unknown as LLVMMemoryBufferRef) : null;
	}

	/**
	 * Create a data layout for this target machine.
	 * @returns The data layout reference
	 */
	createDataLayout(): LLVMTargetDataRef | null {
		return ffi.symbols.LLVMCreateTargetDataLayout(this._ref);
	}

	/**
	 * Cleanup when the object is garbage collected
	 */
	[Symbol.dispose](): void {
		this.dispose();
	}
}
