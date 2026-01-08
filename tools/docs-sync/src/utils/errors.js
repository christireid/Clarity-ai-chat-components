/**
 * Structured error handling for docs-sync
 * Provides actionable error messages and proper exit codes
 * Aligned with @clarity-chat/cli error patterns
 */
import pc from 'picocolors';
export var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["SUCCESS"] = 0] = "SUCCESS";
    ExitCode[ExitCode["GENERAL_ERROR"] = 1] = "GENERAL_ERROR";
    ExitCode[ExitCode["MISUSE"] = 2] = "MISUSE";
    ExitCode[ExitCode["CONFIG_ERROR"] = 3] = "CONFIG_ERROR";
    ExitCode[ExitCode["VALIDATION_ERROR"] = 4] = "VALIDATION_ERROR";
    ExitCode[ExitCode["NOT_FOUND"] = 5] = "NOT_FOUND";
    ExitCode[ExitCode["EXTRACTION_ERROR"] = 6] = "EXTRACTION_ERROR";
    ExitCode[ExitCode["GENERATION_ERROR"] = 7] = "GENERATION_ERROR";
    ExitCode[ExitCode["GIT_ERROR"] = 8] = "GIT_ERROR";
})(ExitCode || (ExitCode = {}));
/**
 * Base error class for docs-sync CLI
 */
export class DocsSyncError extends Error {
    code;
    suggestions;
    docs;
    constructor(message, code = ExitCode.GENERAL_ERROR, suggestions = [], docs) {
        super(message);
        this.code = code;
        this.suggestions = suggestions;
        this.docs = docs;
        this.name = 'DocsSyncError';
    }
}
/**
 * Validation error (config, schema, etc.)
 */
export class ValidationError extends DocsSyncError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.VALIDATION_ERROR, suggestions);
        this.name = 'ValidationError';
    }
}
/**
 * Configuration error
 */
export class ConfigError extends DocsSyncError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.CONFIG_ERROR, suggestions.length > 0
            ? suggestions
            : [
                'Check your .docs-sync.json configuration',
                'Run: pnpm docs-sync init --force to regenerate config',
            ]);
        this.name = 'ConfigError';
    }
}
/**
 * Resource not found error
 */
export class NotFoundError extends DocsSyncError {
    constructor(resource, suggestions = []) {
        super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions);
        this.name = 'NotFoundError';
    }
}
/**
 * API extraction error
 */
export class ExtractionError extends DocsSyncError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.EXTRACTION_ERROR, suggestions.length > 0
            ? suggestions
            : [
                'Check that the TypeScript files are valid',
                'Verify entry points in your config',
                'Run with --verbose for more details',
            ]);
        this.name = 'ExtractionError';
    }
}
/**
 * Documentation generation error
 */
export class GenerationError extends DocsSyncError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.GENERATION_ERROR, suggestions.length > 0
            ? suggestions
            : [
                'Check output directory permissions',
                'Verify the docs directory exists',
                'Run with --dry-run to preview changes',
            ]);
        this.name = 'GenerationError';
    }
}
/**
 * Git operation error
 */
export class GitError extends DocsSyncError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.GIT_ERROR, suggestions.length > 0
            ? suggestions
            : [
                'Ensure you are in a git repository',
                'Check that the commits/refs exist',
                'Verify git is installed and accessible',
            ]);
        this.name = 'GitError';
    }
}
/**
 * Normalize any error to Error instance
 */
function normalizeError(error) {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'string') {
        return new Error(error);
    }
    return new Error(String(error));
}
/**
 * Format and display error with suggestions
 */
export function handleError(error) {
    const normalizedError = normalizeError(error);
    // Check for JSON output mode
    const isJsonMode = process.argv.includes('--output=json') || process.argv.includes('--json');
    if (normalizedError instanceof DocsSyncError) {
        if (isJsonMode) {
            console.error(JSON.stringify({
                error: normalizedError.message,
                code: normalizedError.code,
                suggestions: normalizedError.suggestions,
                docs: normalizedError.docs,
            }));
        }
        else {
            console.error('');
            console.error(pc.bold(pc.red(`✖ ${normalizedError.name}: ${normalizedError.message}`)));
            if (normalizedError.suggestions.length > 0) {
                console.error('');
                console.error(pc.bold(pc.yellow('💡 Suggestions:')));
                for (const suggestion of normalizedError.suggestions) {
                    console.error(pc.gray(`   • ${suggestion}`));
                }
            }
            if (normalizedError.docs) {
                console.error('');
                console.error(pc.bold(pc.blue('📚 Documentation: ')) +
                    pc.underline(pc.cyan(normalizedError.docs)));
            }
            console.error('');
        }
        process.exit(normalizedError.code);
    }
    // Generic error
    if (isJsonMode) {
        console.error(JSON.stringify({
            error: normalizedError.message,
            stack: normalizedError.stack,
        }));
    }
    else {
        console.error('');
        console.error(pc.bold(pc.red(`✖ Error: ${normalizedError.message}`)));
        if (process.env.DEBUG || process.env.VERBOSE) {
            if (normalizedError.stack) {
                console.error('');
                console.error(pc.gray(normalizedError.stack));
            }
        }
        else {
            console.error(pc.gray('   Run with --verbose for more details'));
        }
        console.error('');
    }
    process.exit(ExitCode.GENERAL_ERROR);
}
/**
 * Wrap async function with error handling
 */
export function withErrorHandling(fn) {
    return (async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            handleError(error);
        }
    });
}
/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors) {
    if (errors.length === 0)
        return '';
    const lines = [pc.bold(pc.red('Configuration validation failed:')), ''];
    for (const err of errors) {
        lines.push(`  ${pc.red('✖')} ${pc.cyan(err.path)}: ${err.message}`);
        if (err.value !== undefined) {
            lines.push(`    Value: ${pc.gray(JSON.stringify(err.value))}`);
        }
    }
    return lines.join('\n');
}
//# sourceMappingURL=errors.js.map