import { dlopen } from "bun:ffi";
import { existsSync } from "node:fs";
import { join } from "node:path";
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
import { assert } from "./utils";

const getLibPath = (libName: string): string => {
	const extension = process.platform === "darwin" ? "dylib" : "so";

	if (process.env.LLVM_LIB_DIR) {
		return join(process.env.LLVM_LIB_DIR, `${libName}.${extension}`);
	}

	try {
		const result = Bun.spawnSync(["llvm-config", "--libdir"]);
		if (result.exitCode !== 0) throw new Error("llvm-config failed");

		const libDir = result.stdout.toString().trim();
		const filePath = join(libDir, `${libName}.${extension}`);

		assert(existsSync(filePath), `Library ${libName} not found at ${filePath}`);

		return filePath;
	} catch (err) {
		throw new Error(`Could not determine LLVM library path: ${err}`);
	}
};

const llvmFfi = dlopen(getLibPath("libLLVM-C"), {
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
