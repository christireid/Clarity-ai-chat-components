/**
 * TypeScript compiler API utilities
 */
import ts from 'typescript';
/** Default compiler options for API extraction */
export declare const DEFAULT_COMPILER_OPTIONS: ts.CompilerOptions;
/** Create a TypeScript program */
export declare function createProgram(entryPoints: string[], options?: ts.CompilerOptions): ts.Program;
/** Check if a source file is from external library */
export declare function isExternalLibrary(sourceFile: ts.SourceFile): boolean;
/** Check if a node has export modifier */
export declare function isExported(node: ts.Node): boolean;
/** Check if a node is a default export */
export declare function isDefaultExport(node: ts.Node): boolean;
/** Get the name of an exported declaration */
export declare function getExportName(node: ts.Node): string | null;
/** Get JSDoc comment for a node */
export declare function getJSDocComment(node: ts.Node): string;
/** Get JSDoc tags for a node */
export declare function getJSDocTags(node: ts.Node): Map<string, string>;
/** Get @param JSDoc tags */
export declare function getJSDocParams(node: ts.Node): Map<string, string>;
/** Get @returns JSDoc tag */
export declare function getJSDocReturns(node: ts.Node): string | null;
/** Get @example JSDoc tags */
export declare function getJSDocExamples(node: ts.Node): string[];
/** Get type string from a type */
export declare function getTypeString(type: ts.Type, checker: ts.TypeChecker): string;
/** Get signature string for a function/method */
export declare function getSignatureString(signature: ts.Signature, checker: ts.TypeChecker): string;
/** Check if a type is a React component */
export declare function isReactComponent(type: ts.Type, checker: ts.TypeChecker): boolean;
/** Check if a name is a React hook */
export declare function isHookName(name: string): boolean;
/** Get properties from an interface/type */
export declare function getTypeProperties(type: ts.Type, checker: ts.TypeChecker): Array<{
    name: string;
    type: string;
    optional: boolean;
    documentation: string;
}>;
/** Get function parameters */
export declare function getFunctionParameters(signature: ts.Signature, checker: ts.TypeChecker): Array<{
    name: string;
    type: string;
    optional: boolean;
    defaultValue?: string;
}>;
/** Get return type of a signature */
export declare function getReturnType(signature: ts.Signature, checker: ts.TypeChecker): string;
/** Find all exported symbols from a source file */
export declare function getExportedSymbols(sourceFile: ts.SourceFile, checker: ts.TypeChecker): ts.Symbol[];
/** Get the line number of a node */
export declare function getLineNumber(node: ts.Node, sourceFile: ts.SourceFile): number;
/** Format type for display, simplifying common patterns */
export declare function formatTypeForDisplay(type: string): string;
//# sourceMappingURL=typescript.d.ts.map