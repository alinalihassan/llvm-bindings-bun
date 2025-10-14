import { ffi } from "@/ffi";
import { Argument } from "@/modules/Argument";
import { Constant } from "@/modules/Constant";
import type { GlobalValueLinkageTypes } from "@/modules/Enum";
import { GlobalObject } from "@/modules/GlobalObject";
import type { Module } from "@/modules/Module";
import { Type } from "@/modules/Type";
import type { FunctionType } from "@/modules/types/FunctionType";
import { assert, cstring, type LLVMValueRef } from "@/utils";

/**
 * Represents a function in LLVM IR
 * Based on LLVM's Function class from Function.h
 * A function basically consists of a list of basic blocks, a list of arguments, and a symbol table.
 */
export class LLVMFunction extends GlobalObject {
	/**
	 * Create a new function.
	 * @param funcType The function type
	 * @param linkage The linkage type (from GlobalValue.LinkageTypes)
	 * @param name Optional name for the function
	 * @param module Optional parent module
	 * @returns A new Function instance
	 */
	public static Create(
		funcType: FunctionType,
		linkage: GlobalValueLinkageTypes,
		name: string,
		module: Module,
	): LLVMFunction {
		assert(module?.ref !== null, "Module reference cannot be null");
		assert(funcType.ref !== null, "FunctionType reference cannot be null");

		// Create the function
		const funcRef = ffi.LLVMAddFunction(module.ref, cstring(name), funcType.ref);
		assert(funcRef !== null, "Failed to create function");

		// Set the linkage
		ffi.LLVMSetLinkage(funcRef, linkage);

		return new LLVMFunction(funcRef);
	}

	/**
	 * Get the number of arguments this function takes.
	 * @returns The number of arguments
	 */
	public getNumArgs(): number {
		return ffi.LLVMCountParams(this.ref);
	}

	/**
	 * Get the argument at the specified index.
	 * @param i The argument index
	 * @returns The argument at index i
	 */
	public getArg(i: number): Argument {
		const argRef = ffi.LLVMGetParam(this.ref, i);
		assert(argRef !== null, `Failed to get argument at index ${i}`);

		return new Argument(argRef);
	}

	public getArgs(): Argument[] {
		const argsBuffer = new ArrayBuffer(this.getNumArgs() * 8); // 8 bytes per pointer
		const argsView = new BigUint64Array(argsBuffer);

		ffi.LLVMGetParams(this.ref, argsView);

		const args: Argument[] = [];
		for (let i = 0; i < this.getNumArgs(); i++) {
			const argRef = argsView[i] as unknown as LLVMValueRef;
			assert(argRef !== null, `Failed to get argument at index ${i}`);

			args.push(new Argument(argRef));
		}

		return args;
	}

	/**
	 * Get the return type of this function.
	 * @returns The return type
	 */
	public getReturnType(): Type {
		return new Type(ffi.LLVMGetReturnType(this.getType().ref));
	}

	/**
	 * Check if this function has a personality function.
	 * @returns True if this function has a personality function
	 */
	public hasPersonalityFn(): boolean {
		return ffi.LLVMHasPersonalityFn(this.ref);
	}

	/**
	 * Get the personality function for this function.
	 * @returns The personality function
	 */
	public getPersonalityFn(): Constant {
		return new Constant(ffi.LLVMGetPersonalityFn(this.ref));
	}

	/**
	 * Set the personality function for this function.
	 * @param personalityFn The personality function constant
	 */
	public setPersonalityFn(personalityFn: Constant): void {
		ffi.LLVMSetPersonalityFn(this.ref, personalityFn.ref);
	}

	/**
	 * Get the calling convention of this function.
	 * @returns The calling convention
	 */
	public getCallingConv(): number {
		return ffi.LLVMGetFunctionCallConv(this.ref);
	}

	/**
	 * Set the calling convention of this function.
	 * @param cc The calling convention
	 */
	public setCallingConv(cc: number): void {
		ffi.LLVMSetFunctionCallConv(this.ref, cc);
	}

	/**
	 * Get the garbage collector name for this function.
	 * @returns The garbage collector name
	 */
	public getGC(): string | null {
		const gc = ffi.LLVMGetGC(this.ref);
		return gc ? gc.toString() : null;
	}

	/**
	 * Set the garbage collector name for this function.
	 * @param name The garbage collector name
	 */
	public setGC(name: string): void {
		ffi.LLVMSetGC(this.ref, cstring(name));
	}

	public delete(): void {
		ffi.LLVMDeleteFunction(this.ref);
	}
}
