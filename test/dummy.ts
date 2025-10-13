// import { LLVMContext } from "@/modules/LLVMContext";

import { getLibPath } from "@/utils";

// FFI missing symbols are not shown in proper tests, so we'll just create a dummy module to test the FFI.
// new LLVMContext();
console.log(getLibPath("libclang"));
