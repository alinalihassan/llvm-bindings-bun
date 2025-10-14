import { GlobalValue } from "@/modules/GlobalValue";

/**
 * Represents a global object in LLVM IR
 * Based on LLVM's GlobalObject class
 * This is a base class for global objects like GlobalVariable and Function
 */
export class GlobalObject extends GlobalValue {}
