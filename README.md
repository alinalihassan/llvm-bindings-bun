# LLVM Bindings for TypeScript

A lightweight LLVM TypeScript binding for writing JIT compilers and code generators, built with Bun's FFI and inspired by [llvmlite](https://github.com/numba/llvmlite).

> **⚠️ Development Status**
>
> This project is in **active development** and is **not considered stable for production use**.
>
> - **Pre-1.0 Status**: The API is subject to breaking changes without notice
> - **Breaking Changes**: Expect breaking changes between releases
>
> Use at your own risk in production environments. We recommend pinning to specific versions and thoroughly testing before upgrading.

## Key Features

- **TypeScript-first**: Full TypeScript support with comprehensive type definitions
- **Bun FFI**: Uses Bun's native FFI for efficient C library binding
- **LLVM C API**: Built on the stable LLVM C API (not the frequently-changing C++ API)
- **Memory Management**: Automatic memory management for LLVM references
- **Module Compilation**: Compile LLVM modules to object files and executables
- **Comprehensive Coverage**: Planning to support most LLVM IR operations, types, and instructions
- **No JS/TS dependencies**: No external dependencies other than Bun and LLVM installed on system.

## Installation

### Prerequisites

- [Bun](https://bun.sh)
- LLVM development libraries (version 21.x.x)

### Install LLVM

**macOS (using Homebrew):**
```bash
brew install llvm@21
```

**Ubuntu/Debian:**
```bash
sudo apt-get install llvm-21-dev
```

**Arch Linux:**
```bash
sudo pacman -S llvm21
```

### Installation

```bash
bun add llvm-bindings-bun
```

### Environment Variables

If LLVM is not automatically detected on your system, you can specify the LLVM library directory:

```bash
export LLVM_LIB_DIR=/path/to/llvm/lib
```

This is particularly useful for:
- Custom LLVM installations
- Non-standard LLVM paths
- Systems where LLVM is installed in a non-default location

## Quick Start

Here's a simple example that creates an LLVM function to add two integers:

```typescript
import {
  BasicBlock,
  Enums,
  FunctionCallee,
  FunctionType,
  IntegerType,
  IRBuilder,
  LLVMContext,
  LLVMFunction,
  Module,
  PassBuilder,
} from "llvm-bindings-bun";

const { GlobalValueLinkageTypes, PassPipeline } = Enums;

// Create LLVM context
const context = new LLVMContext();

// Create a module
const module = new Module("example", context);

// Create IR builder
const builder = new IRBuilder(context);

// Create function type: int add(int a, int b)
const int32Type = IntegerType.getInt32Ty();
const functionType = FunctionType.get(int32Type, [int32Type, int32Type], false);

// Create the add function
const addFunction = LLVMFunction.Create(
  functionType,
  GlobalValueLinkageTypes.ExternalLinkage,
  "add",
  module
);

// Create a basic block for the function body
const entryBlock = BasicBlock.Create(context, "entry", addFunction);

// Set the insertion point to the entry block
builder.SetInsertPoint(entryBlock);

// Get the function arguments
const a = addFunction.getArg(0); // First argument
const b = addFunction.getArg(1); // Second argument

// Create the add instruction: result = a + b
const result = builder.CreateAdd(a, b, "result");

// Create return instruction
builder.CreateRet(result);

// Print the generated LLVM IR
console.log("Generated LLVM IR:");
console.log(module.print());

// Run optimization passes on the module
PassBuilder.runPasses(module, PassPipeline.AggressiveOptimization);
// Equivalent to:
// PassBuilder.runMaxOptimization(module);

console.log("\n\nOptimized LLVM IR:");
console.log(module.print());

// Compile to executable
module.compileToExecutable("test");
```

## Testing

Run the test suite:

```bash
bun test
```

## Building and Compilation

The library can compile LLVM modules to various formats:

```typescript
// Compile to object file
const success = module.compileToObjectFile("output.o");

// Compile to assembly
const success = module.compileToAssembly("output.s");

// Get compiled binary as memory buffer
const buffer = module.compileToMemoryBuffer();

// Compile to an executable binary
const success = module.compileToExecutable("binary")

// Run Module in JIT
module.run()

// Write module to file
module.writeToFile("module.bc");
```


## Compatibility

- **LLVM Version**: 21.x.x
- **TypeScript**: 5.x
- **Bun**: 1.x
- **Platforms**: macOS, Linux, Windows (with appropriate LLVM installation)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by [llvmlite](https://github.com/numba/llvmlite) for Python
- Built with [Bun](https://bun.sh) FFI
- Uses the [LLVM](https://llvm.org) C API
