import { dlopen, FFIType } from "bun:ffi";
import { APIntSymbols } from "./symbols/APIntSymbols";
import { ArgumentSymbols } from "./symbols/ArgumentSymbols";
import { ArrayTypeSymbols } from "./symbols/ArrayTypeSymbols";
import { BasicBlockSymbols } from "./symbols/BasicBlockSymbols";
import { ConstantIntSymbols } from "./symbols/ConstantIntSymbols";
import { ConstantSymbols } from "./symbols/ConstantSymbols";
import { FunctionSymbols } from "./symbols/FunctionSymbols";
import { FunctionTypeSymbols } from "./symbols/FunctionTypeSymbols";
import { GlobalValueSymbols } from "./symbols/GlobalValueSymbols";
import { GlobalVariableSymbols } from "./symbols/GlobalVariableSymbols";
import { InstructionSymbols } from "./symbols/InstructionSymbols";
import { InstructionsSymbols } from "./symbols/InstructionsSymbols";
import { IntegerTypeSymbols } from "./symbols/IntegerTypeSymbols";
import { IRBuilderSymbols } from "./symbols/IRBuilderSymbols";
import { LLVMContextSymbols } from "./symbols/LLVMContextSymbols";
import { ModuleSymbols } from "./symbols/ModuleSymbols";
import { PointerTypeSymbols } from "./symbols/PointerTypeSymbols";
import { StructTypeSymbols } from "./symbols/StructTypeSymbols";
import { TypeSymbols } from "./symbols/TypeSymbols";
import { UserSymbols } from "./symbols/UserSymbols";
import { ValueSymbols } from "./symbols/ValueSymbols";

const ffi = dlopen("/opt/homebrew/Cellar/llvm/21.1.2/lib/libLLVM-C.dylib", {
	...LLVMContextSymbols,
	...ModuleSymbols,
	...TypeSymbols,
	...FunctionTypeSymbols,
	...FunctionSymbols,
	...ArrayTypeSymbols,
	...StructTypeSymbols,
	...PointerTypeSymbols,
	...IntegerTypeSymbols,
	...ValueSymbols,
	...ArgumentSymbols,
	...UserSymbols,
	...InstructionSymbols,
	...InstructionsSymbols,
	...BasicBlockSymbols,
	...IRBuilderSymbols,
	...ConstantSymbols,
	...ConstantIntSymbols,
	...GlobalValueSymbols,
	...GlobalVariableSymbols,
	...APIntSymbols,

	LLVMGetModuleInlineAsm: {
		args: [FFIType.ptr, FFIType.ptr, FFIType.ptr],
		returns: FFIType.void,
	},
});

export { ffi };
