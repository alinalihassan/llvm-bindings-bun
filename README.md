# LLVM Bindings for TypeScript

A lightweight LLVM TypeScript binding for writing JIT compilers and code generators, built with Bun's FFI and inspired by [llvmlite](https://github.com/numba/llvmlite).

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

### Install Dependencies

```bash
bun install
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
  LLVMContext,
  Module,
  IRBuilder,
  IntegerType,
  FunctionType,
  LLVMFunction,
  BasicBlock,
  GlobalValueLinkageTypes,
  FunctionCallee
} from "./src";

// Module creates a context by default
const module = new Module("example");
const builder = new IRBuilder(context);

// Create function type: int add(int a, int b)
const functionType = FunctionType.get(Type.getInt32Ty(), [Type.getInt32Ty(), Type.getInt32Ty()], false);

// Create the add function
const addFunction = LLVMFunction.Create(
  functionType,
  GlobalValueLinkageTypes.ExternalLinkage,
  "add",
  module
);

// Create function body
const entryBlock = BasicBlock.Create(context, "entry", addFunction);
builder.SetInsertPoint(entryBlock);

// Get function arguments and create add instruction
const a = addFunction.getArg(0);
const b = addFunction.getArg(1);
const result = builder.CreateAdd(a, b, "result");
builder.CreateRet(result);

// Print the generated LLVM IR
console.log(module.print());
```

## Testing

Run the test suite:

```bash
# Run all tests
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
