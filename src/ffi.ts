import { dlopen } from "bun:ffi";
import { APIntSymbols } from "./symbols/APIntSymbols";
import { ArgumentSymbols } from "./symbols/ArgumentSymbols";
import { ArrayTypeSymbols } from "./symbols/ArrayTypeSymbols";
import { BasicBlockSymbols } from "./symbols/BasicBlockSymbols";
import { ClangSymbols } from "./symbols/ClangSymbols";
import { ConstantFPSymbols } from "./symbols/ConstantFPSymbols";
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
import { PassBuilderSymbols } from "./symbols/PassBuilderSymbols";
import { PointerTypeSymbols } from "./symbols/PointerTypeSymbols";
import { StructTypeSymbols } from "./symbols/StructTypeSymbols";
import { TargetMachineSymbols } from "./symbols/TargetMachineSymbols";
import { TargetSymbols } from "./symbols/TargetSymbols";
import { TypeSymbols } from "./symbols/TypeSymbols";
import { UserSymbols } from "./symbols/UserSymbols";
import { ValueSymbols } from "./symbols/ValueSymbols";
import { getLibPath } from "./utils";

// TODO: Change to libLLVM-C, but some platforms/intstallers (e.g. Linux) don't have it.
const llvmFfi = dlopen(getLibPath("libLLVM"), {
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
	...ConstantFPSymbols,
	...ConstantIntSymbols,
	...GlobalValueSymbols,
	...GlobalVariableSymbols,
	...APIntSymbols,
	...PassBuilderSymbols,
	...TargetSymbols,
	...TargetMachineSymbols,
});

const clangFfi = dlopen(getLibPath("libclang"), {
	...ClangSymbols,
});

// Combine both FFI objects
const ffi = {
	...llvmFfi.symbols,
	...clangFfi.symbols,
};

export { ffi };
