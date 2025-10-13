import { LLVMContext } from "@/modules/LLVMContext";

// FFI missing symbols are not shown in proper tests, so we'll just create a dummy module to test the FFI.
new LLVMContext();
