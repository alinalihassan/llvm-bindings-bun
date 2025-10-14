import { ffi } from "@/ffi";
import { Constant } from "@/modules/Constant";
import { assert } from "@/utils";
import { PointerType } from "../types/PointerType";

export class ConstantPointerNull extends Constant {
	public static get(type: PointerType): ConstantPointerNull {
		const constantRef = ffi.LLVMConstPointerNull(type.ref);
		assert(constantRef !== null, "Failed to create constant pointer null");
		return new ConstantPointerNull(constantRef);
	}

	public override getType(): PointerType {
		const typeRef = ffi.LLVMTypeOf(this.ref);
		assert(typeRef !== null, "Failed to get constant pointer null type");
		return new PointerType(typeRef);
	}
}
