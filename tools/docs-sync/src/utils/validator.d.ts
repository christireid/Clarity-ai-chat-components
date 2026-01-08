/**
 * Configuration Validator
 *
 * Validates docs-sync configuration using Zod
 * Aligned with @clarity-chat/cli validation patterns
 */
import { z } from 'zod';
import type { DocsSyncConfig } from '../types/index.js';
/** Schema for package configuration */
export declare const PackageConfigSchema: z.ZodObject<{
    name: z.ZodString;
    path: z.ZodString;
    entryPoints: z.ZodArray<z.ZodString, "many">;
    docsPath: z.ZodString;
    generateComponentDocs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    generateHookDocs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    generateTypeDocs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    includePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    excludePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    path: string;
    entryPoints: string[];
    docsPath: string;
    generateComponentDocs: boolean;
    generateHookDocs: boolean;
    generateTypeDocs: boolean;
    includePatterns?: string[] | undefined;
    excludePatterns?: string[] | undefined;
}, {
    name: string;
    path: string;
    entryPoints: string[];
    docsPath: string;
    generateComponentDocs?: boolean | undefined;
    generateHookDocs?: boolean | undefined;
    generateTypeDocs?: boolean | undefined;
    includePatterns?: string[] | undefined;
    excludePatterns?: string[] | undefined;
}>;
/** Schema for changelog configuration */
export declare const ChangelogConfigSchema: z.ZodObject<{
    outputPath: z.ZodString;
    types: z.ZodArray<z.ZodString, "many">;
    includeBreaking: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    types: string[];
    outputPath: string;
    includeBreaking: boolean;
}, {
    types: string[];
    outputPath: string;
    includeBreaking?: boolean | undefined;
}>;
/** Schema for CI configuration */
export declare const CIConfigSchema: z.ZodObject<{
    botName: z.ZodString;
    botEmail: z.ZodString;
    commitPrefix: z.ZodString;
    createPR: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    botName: string;
    botEmail: string;
    commitPrefix: string;
    createPR: boolean;
}, {
    botName: string;
    botEmail: string;
    commitPrefix: string;
    createPR?: boolean | undefined;
}>;
/** Full configuration schema */
export declare const DocsSyncConfigSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    rootDir: z.ZodOptional<z.ZodString>;
    docsDir: z.ZodString;
    apiDataDir: z.ZodString;
    cacheDir: z.ZodString;
    packages: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        path: z.ZodString;
        entryPoints: z.ZodArray<z.ZodString, "many">;
        docsPath: z.ZodString;
        generateComponentDocs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        generateHookDocs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        generateTypeDocs: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        includePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        excludePatterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        path: string;
        entryPoints: string[];
        docsPath: string;
        generateComponentDocs: boolean;
        generateHookDocs: boolean;
        generateTypeDocs: boolean;
        includePatterns?: string[] | undefined;
        excludePatterns?: string[] | undefined;
    }, {
        name: string;
        path: string;
        entryPoints: string[];
        docsPath: string;
        generateComponentDocs?: boolean | undefined;
        generateHookDocs?: boolean | undefined;
        generateTypeDocs?: boolean | undefined;
        includePatterns?: string[] | undefined;
        excludePatterns?: string[] | undefined;
    }>, "many">;
    docsRelevantPatterns: z.ZodArray<z.ZodString, "many">;
    excludePatterns: z.ZodArray<z.ZodString, "many">;
    templatesDir: z.ZodOptional<z.ZodString>;
    repository: z.ZodOptional<z.ZodString>;
    baseUrl: z.ZodOptional<z.ZodString>;
    changelog: z.ZodObject<{
        outputPath: z.ZodString;
        types: z.ZodArray<z.ZodString, "many">;
        includeBreaking: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        types: string[];
        outputPath: string;
        includeBreaking: boolean;
    }, {
        types: string[];
        outputPath: string;
        includeBreaking?: boolean | undefined;
    }>;
    ci: z.ZodObject<{
        botName: z.ZodString;
        botEmail: z.ZodString;
        commitPrefix: z.ZodString;
        createPR: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, "strip", z.ZodTypeAny, {
        botName: string;
        botEmail: string;
        commitPrefix: string;
        createPR: boolean;
    }, {
        botName: string;
        botEmail: string;
        commitPrefix: string;
        createPR?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    packages: {
        name: string;
        path: string;
        entryPoints: string[];
        docsPath: string;
        generateComponentDocs: boolean;
        generateHookDocs: boolean;
        generateTypeDocs: boolean;
        includePatterns?: string[] | undefined;
        excludePatterns?: string[] | undefined;
    }[];
    version: 1;
    cacheDir: string;
    ci: {
        botName: string;
        botEmail: string;
        commitPrefix: string;
        createPR: boolean;
    };
    excludePatterns: string[];
    docsDir: string;
    apiDataDir: string;
    docsRelevantPatterns: string[];
    changelog: {
        types: string[];
        outputPath: string;
        includeBreaking: boolean;
    };
    repository?: string | undefined;
    rootDir?: string | undefined;
    templatesDir?: string | undefined;
    baseUrl?: string | undefined;
}, {
    packages: {
        name: string;
        path: string;
        entryPoints: string[];
        docsPath: string;
        generateComponentDocs?: boolean | undefined;
        generateHookDocs?: boolean | undefined;
        generateTypeDocs?: boolean | undefined;
        includePatterns?: string[] | undefined;
        excludePatterns?: string[] | undefined;
    }[];
    version: 1;
    cacheDir: string;
    ci: {
        botName: string;
        botEmail: string;
        commitPrefix: string;
        createPR?: boolean | undefined;
    };
    excludePatterns: string[];
    docsDir: string;
    apiDataDir: string;
    docsRelevantPatterns: string[];
    changelog: {
        types: string[];
        outputPath: string;
        includeBreaking?: boolean | undefined;
    };
    repository?: string | undefined;
    rootDir?: string | undefined;
    templatesDir?: string | undefined;
    baseUrl?: string | undefined;
}>;
/** Validation result */
export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
/** Validation error */
export interface ValidationError {
    path: string;
    message: string;
    value?: unknown;
}
/** Validate full configuration */
export declare function validateDocsSyncConfig(config: unknown): ValidationResult;
/** Validate package configuration */
export declare function validatePackageConfig(pkg: unknown): ValidationResult;
/** Get the JSON schema for external use (generated from Zod) */
export declare function getConfigSchema(): object;
/** Semantic validation beyond schema */
export declare function validateConfigSemantics(config: DocsSyncConfig): ValidationError[];
/** Full validation with schema and semantics */
export declare function validateConfigFull(config: unknown): ValidationResult;
/** Format validation errors for display */
export declare function formatValidationErrors(errors: ValidationError[]): string;
/**
 * Validate and parse input with Zod schema
 * Aligned with @clarity-chat/cli validation patterns
 */
export declare function validate<T extends z.ZodTypeAny>(schema: T, data: unknown, errorMessage?: string): z.infer<T>;
//# sourceMappingURL=validator.d.ts.map