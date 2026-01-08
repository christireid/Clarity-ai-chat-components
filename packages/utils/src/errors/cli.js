import { error as logError } from '../logger';
/**
 * CLI Error Classes
 *
 * Errors for command-line interface operations with exit codes
 * and user-friendly formatting.
 */
/**
 * Standard CLI exit codes
 */
export var ExitCode;
(function (ExitCode) {
    /** Successful execution */
    ExitCode[ExitCode["SUCCESS"] = 0] = "SUCCESS";
    /** General error */
    ExitCode[ExitCode["GENERAL_ERROR"] = 1] = "GENERAL_ERROR";
    /** Command misuse (invalid arguments) */
    ExitCode[ExitCode["MISUSE"] = 2] = "MISUSE";
    /** Configuration error */
    ExitCode[ExitCode["CONFIG_ERROR"] = 3] = "CONFIG_ERROR";
    /** Validation error */
    ExitCode[ExitCode["VALIDATION_ERROR"] = 4] = "VALIDATION_ERROR";
    /** Resource not found */
    ExitCode[ExitCode["NOT_FOUND"] = 5] = "NOT_FOUND";
    /** Permission denied */
    ExitCode[ExitCode["PERMISSION_ERROR"] = 6] = "PERMISSION_ERROR";
})(ExitCode || (ExitCode = {}));
/**
 * Base error class for CLI tools
 *
 * Provides structured error handling with exit codes and suggestions
 * for CLI applications.
 *
 * @example
 * ```ts
 * throw new CLIError(
 *   'Invalid option: --foo',
 *   ExitCode.MISUSE,
 *   ['Use --bar instead', 'Run --help for usage info']
 * )
 * ```
 */
export class CLIError extends Error {
    /** CLI exit code */
    code;
    /** Suggestions for fixing the error */
    suggestions;
    /** Optional documentation URL */
    docs;
    constructor(message, code = ExitCode.GENERAL_ERROR, suggestions = [], docs) {
        super(message);
        this.name = 'CLIError';
        this.code = code;
        this.suggestions = suggestions;
        this.docs = docs;
    }
    /**
     * Format error for CLI output
     */
    format() {
        const lines = [];
        lines.push(`\n✖ ${this.name}: ${this.message}`);
        if (this.suggestions.length > 0) {
            lines.push('\n💡 Suggestions:');
            for (const suggestion of this.suggestions) {
                lines.push(`   • ${suggestion}`);
            }
        }
        if (this.docs) {
            lines.push(`\n📚 Documentation: ${this.docs}`);
        }
        lines.push('');
        return lines.join('\n');
    }
    /**
     * Format error as JSON
     */
    toJSON() {
        return {
            error: this.message,
            code: this.code,
            suggestions: this.suggestions,
            docs: this.docs,
        };
    }
}
/**
 * CLI validation error
 */
export class CLIValidationError extends CLIError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.VALIDATION_ERROR, suggestions);
        this.name = 'ValidationError';
    }
}
/**
 * CLI configuration error
 */
export class CLIConfigError extends CLIError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.CONFIG_ERROR, suggestions);
        this.name = 'ConfigError';
    }
}
/**
 * CLI resource not found error
 */
export class CLINotFoundError extends CLIError {
    constructor(resource, suggestions = []) {
        super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions);
        this.name = 'NotFoundError';
    }
}
/**
 * CLI permission error
 */
export class CLIPermissionError extends CLIError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.PERMISSION_ERROR, suggestions);
        this.name = 'PermissionError';
    }
}
/**
 * Handle CLI error and exit the process
 *
 * @param error - Error to handle
 *
 * @example
 * ```ts
 * try {
 *   await runCommand()
 * } catch (error) {
 *   handleCLIError(error)
 * }
 * ```
 */
export function handleCLIError(error) {
    const normalizedError = normalizeToError(error);
    const isJsonMode = typeof process !== 'undefined' &&
        (process.argv?.includes('--output=json') ||
            process.argv?.includes('--json'));
    if (normalizedError instanceof CLIError) {
        if (isJsonMode) {
            logError(JSON.stringify(normalizedError.toJSON()));
        }
        else {
            logError(normalizedError.format());
        }
        if (typeof process !== 'undefined') {
            process.exit(normalizedError.code);
        }
        throw normalizedError; // Fallback for non-Node environments
    }
    // Generic error
    if (isJsonMode) {
        logError(JSON.stringify({
            error: normalizedError.message,
            stack: normalizedError.stack,
        }));
    }
    else {
        logError(`\n✖ Error: ${normalizedError.message}`);
        const showStack = typeof process !== 'undefined' &&
            (process.env?.DEBUG || process.env?.VERBOSE);
        if (showStack && normalizedError.stack) {
            logError('\n' + normalizedError.stack);
        }
        else {
            logError('   Run with --verbose for more details');
        }
        logError('');
    }
    if (typeof process !== 'undefined') {
        process.exit(ExitCode.GENERAL_ERROR);
    }
    throw normalizedError;
}
/**
 * Wrap async CLI function with error handling
 *
 * @param fn - Async function to wrap
 * @returns Wrapped function that handles errors
 *
 * @example
 * ```ts
 * const main = withCLIErrorHandling(async () => {
 *   // Your CLI logic here
 * })
 *
 * main()
 * ```
 */
export function withCLIErrorHandling(fn) {
    return (async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            handleCLIError(error);
        }
    });
}
/**
 * Normalize any value to an Error instance
 */
function normalizeToError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'string') {
        return new Error(error);
    }
    return new Error(String(error));
}
//# sourceMappingURL=cli.js.map