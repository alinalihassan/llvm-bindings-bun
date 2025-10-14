import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import { assert } from "@/utils";
import { StructType } from "../types/StructType";

export class ConstantStruct extends Constant {
	public static get(type: StructType, values: Constant[]): ConstantStruct {
		const valuesRef = values.map((value) => value.ref);
		const argsBuffer = new ArrayBuffer(valuesRef.length * 8);
		const argsView = new BigUint64Array(argsBuffer);
		for (let i = 0; i < valuesRef.length; i++) {
			const val = valuesRef[i];
			assert(val !== undefined && val !== null, "Value reference is null");
			// biome-ignore lint/suspicious/noExplicitAny: LLVM pointer values need to be cast to BigInt
			argsView[i] = BigInt(val as any);
		}

		const constantRef = ffi.LLVMConstStruct(argsView, values.length, type.isPacked());
		assert(constantRef !== null, "Failed to create constant struct");
		return new ConstantStruct(constantRef);
	}

	public override getType(): StructType {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get constant struct type");
		return new StructType(typeRef);
	}
}
