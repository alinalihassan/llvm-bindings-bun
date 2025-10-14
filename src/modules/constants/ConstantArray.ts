import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import { ArrayType } from "@/modules/types/ArrayType";
import { assert } from "@/utils";

export class ConstantArray extends Constant {
	public static get(type: ArrayType, values: Constant[]): ConstantArray {
		const valuesRef = values.map((value) => value.ref);
		const argsBuffer = new ArrayBuffer(valuesRef.length * 8);
		const argsView = new BigUint64Array(argsBuffer);
		for (let i = 0; i < valuesRef.length; i++) {
			const val = valuesRef[i];
			assert(val !== undefined && val !== null, "Value reference is null");
			// biome-ignore lint/suspicious/noExplicitAny: LLVM pointer values need to be cast to BigInt
			argsView[i] = BigInt(val as any);
		}

		const constantRef = ffi.LLVMConstArray2(type.ref, argsView, values.length);
		assert(constantRef !== null, "Failed to create constant array");
		return new ConstantArray(constantRef);
	}

	public override getType(): ArrayType {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get constant array type");
		return new ArrayType(typeRef);
	}
}
