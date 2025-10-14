import { dlopen } from "bun:ffi";
import { APIntSymbols } from "./symbols/APIntSymbols";
import { ArgumentSymbols } from "./symbols/ArgumentSymbols";
import { ArrayTypeSymbols } from "./symbols/ArrayTypeSymbols";
import { BasicBlockSymbols } from "./symbols/BasicBlockSymbols";
import { ClangSymbols } from "./symbols/ClangSymbols";
import { ConstantArraySymbols } from "./symbols/ConstantArraySymbols";
import { ConstantFPSymbols } from "./symbols/ConstantFPSymbols";
import { ConstantIntSymbols } from "./symbols/ConstantIntSymbols";
import { ConstantStructSymbols } from "./symbols/ConstantStructSymbols";
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
import { VectorTypeSymbols } from "./symbols/VectorTypeSymbols";
import { getLibPath } from "./utils";

// Use LLVM-C on Windows, libLLVM on Unix-like systems
const llvmLibName = process.platform === "win32" ? "LLVM-C" : "libLLVM";
const llvmFfi = dlopen(getLibPath(llvmLibName), {
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
	...ConstantArraySymbols,
	...ConstantStructSymbols,
	...GlobalValueSymbols,
	...GlobalVariableSymbols,
	...APIntSymbols,
	...PassBuilderSymbols,
	...TargetSymbols,
	...TargetMachineSymbols,
	...VectorTypeSymbols,
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
