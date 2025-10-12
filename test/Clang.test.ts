import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import {
	ClangDiagnostic,
	ClangIndex,
	ClangTranslationUnit,
	CXDiagnostic_Error,
	CXDiagnostic_Fatal,
	CXTranslationUnit_None,
	compileFile,
	linkExecutable,
} from "../src/modules/Clang.js";

describe("Clang API", () => {
	const testDir = "/tmp/clang-test";
	const testSourceFile = join(testDir, "test.c");
	const testObjectFile = join(testDir, "test.o");
	const testExecutable = join(testDir, "test");

	beforeAll(() => {
		// Create test directory
		try {
			mkdirSync(testDir, { recursive: true });
		} catch (e) {
			// Directory might already exist
		}
	});

	afterAll(() => {
		// Clean up test files
		try {
			if (existsSync(testSourceFile)) unlinkSync(testSourceFile);
			if (existsSync(testObjectFile)) unlinkSync(testObjectFile);
			if (existsSync(testExecutable)) unlinkSync(testExecutable);
			if (existsSync(testDir)) rmdirSync(testDir);
		} catch (e) {
			// Ignore cleanup errors
		}
	});

	test("should create and dispose ClangIndex", () => {
		const index = new ClangIndex();
		expect(index.getPtr()).not.toBe(0);
		index.dispose();
	});

	test("should create and dispose ClangTranslationUnit", () => {
		// Create a simple C source file
		const sourceCode = `
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`;
		writeFileSync(testSourceFile, sourceCode);

		const index = new ClangIndex();
		const translationUnit = new ClangTranslationUnit(
			index,
			testSourceFile,
			["-c"], // Compile to object file
			[],
			CXTranslationUnit_None,
		);

		expect(translationUnit.getPtr()).not.toBe(0);

		translationUnit.dispose();
		index.dispose();
	});

	test("should handle compilation errors", () => {
		// Create a C source file with syntax errors
		const sourceCode = `
#include <stdio.h>

int main() {
    printf("Hello, World!\\n")
    return 0;
}
`;
		writeFileSync(testSourceFile, sourceCode);

		const index = new ClangIndex();
		const translationUnit = new ClangTranslationUnit(
			index,
			testSourceFile,
			["-c"],
			[],
			CXTranslationUnit_None,
		);

		const diagnostics = translationUnit.getDiagnostics();
		expect(diagnostics.length).toBeGreaterThan(0);

		// Check that we have error diagnostics
		const hasErrors = diagnostics.some(
			(d) => d.getSeverity() === CXDiagnostic_Error || d.getSeverity() === CXDiagnostic_Fatal,
		);
		expect(hasErrors).toBe(true);

		// Check diagnostic content
		const errorMessages = diagnostics.map((d) => d.getSpelling());
		expect(errorMessages.some((msg) => msg.includes("expected"))).toBe(true);

		translationUnit.dispose();
		index.dispose();
	});

	test("should compile valid C code", () => {
		// Create a valid C source file
		const sourceCode = `
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
`;
		writeFileSync(testSourceFile, sourceCode);

		const result = compileFile(testSourceFile, testObjectFile, ["-c"]);

		expect(result.success).toBe(true);
		expect(result.diagnostics.length).toBe(0);
	});

	test("should report compilation errors", () => {
		// Create a C source file with errors
		const sourceCode = `
#include <stdio.h>

int main() {
    printf("Hello, World!\\n")
    return 0;
}
`;
		writeFileSync(testSourceFile, sourceCode);

		const result = compileFile(testSourceFile, testObjectFile, ["-c"]);

		expect(result.success).toBe(false);
		expect(result.diagnostics.length).toBeGreaterThan(0);

		const hasErrors = result.diagnostics.some(
			(d) => d.getSeverity() === CXDiagnostic_Error || d.getSeverity() === CXDiagnostic_Fatal,
		);
		expect(hasErrors).toBe(true);
	});

	test("should handle diagnostic severity levels", () => {
		// Create a C source file with warnings
		const sourceCode = `
#include <stdio.h>

int main() {
    int unused = 42;
    printf("Hello, World!\\n");
    return 0;
}
`;
		writeFileSync(testSourceFile, sourceCode);

		const result = compileFile(testSourceFile, testObjectFile, ["-c", "-Wunused-variable"]);

		// Should succeed but may have warnings
		expect(result.diagnostics.length).toBeGreaterThanOrEqual(0);

		// Check severity strings
		result.diagnostics.forEach((diagnostic) => {
			const severity = diagnostic.getSeverity();
			const severityString = diagnostic.getSeverityString();
			expect(severityString).toMatch(/^(Ignored|Note|Warning|Error|Fatal|Unknown)$/);
		});
	});

	test("should handle multiple source files", () => {
		// Create multiple C source files
		const mainSource = `
#include <stdio.h>
#include "helper.h"

int main() {
    printf("Result: %d\\n", add(5, 3));
    return 0;
}
`;

		const helperSource = `
int add(int a, int b) {
    return a + b;
}
`;

		const helperHeader = `
#ifndef HELPER_H
#define HELPER_H
int add(int a, int b);
#endif
`;

		const mainFile = join(testDir, "main.c");
		const helperFile = join(testDir, "helper.c");
		const helperHeaderFile = join(testDir, "helper.h");

		writeFileSync(mainFile, mainSource);
		writeFileSync(helperFile, helperSource);
		writeFileSync(helperHeaderFile, helperHeader);

		// Compile main file
		const mainResult = compileFile(mainFile, join(testDir, "main.o"), ["-c", "-I" + testDir]);
		expect(mainResult.success).toBe(true);

		// Compile helper file
		const helperResult = compileFile(helperFile, join(testDir, "helper.o"), ["-c"]);
		expect(helperResult.success).toBe(true);

		// Clean up
		unlinkSync(mainFile);
		unlinkSync(helperFile);
		unlinkSync(helperHeaderFile);
		unlinkSync(join(testDir, "main.o"));
		unlinkSync(join(testDir, "helper.o"));
	});
});
