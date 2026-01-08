/**
 * Structured error handling for docs-sync
 * Provides actionable error messages and proper exit codes
 * Aligned with @clarity-chat/cli error patterns
 */
export declare enum ExitCode {
    SUCCESS = 0,
    GENERAL_ERROR = 1,
    MISUSE = 2,
    CONFIG_ERROR = 3,
    VALIDATION_ERROR = 4,
    NOT_FOUND = 5,
    EXTRACTION_ERROR = 6,
    GENERATION_ERROR = 7,
    GIT_ERROR = 8
}
/**
 * Base error class for docs-sync CLI
 */
export declare class DocsSyncError extends Error {
    readonly code: ExitCode;
    readonly suggestions: string[];
    readonly docs?: string | undefined;
    constructor(message: string, code?: ExitCode, suggestions?: string[], docs?: string | undefined);
}
/**
 * Validation error (config, schema, etc.)
 */
export declare class ValidationError extends DocsSyncError {
    constructor(message: string, suggestions?: string[]);
}
/**
 * Configuration error
 */
export declare class ConfigError extends DocsSyncError {
    constructor(message: string, suggestions?: string[]);
}
/**
 * Resource not found error
 */
export declare class NotFoundError extends DocsSyncError {
    constructor(resource: string, suggestions?: string[]);
}
/**
 * API extraction error
 */
export declare class ExtractionError extends DocsSyncError {
    constructor(message: string, suggestions?: string[]);
}
/**
 * Documentation generation error
 */
export declare class GenerationError extends DocsSyncError {
    constructor(message: string, suggestions?: string[]);
}
/**
 * Git operation error
 */
export declare class GitError extends DocsSyncError {
    constructor(message: string, suggestions?: string[]);
}
/**
 * Format and display error with suggestions
 */
export declare function handleError(error: string | Error | unknown): never;
/**
 * Wrap async function with error handling
 */
export declare function withErrorHandling<T extends (...args: any[]) => Promise<any>>(fn: T): T;
/**
 * Format validation errors for display
 */
export declare function formatValidationErrors(errors: Array<{
    path: string;
    message: string;
    value?: unknown;
}>): string;
//# sourceMappingURL=errors.d.ts.map