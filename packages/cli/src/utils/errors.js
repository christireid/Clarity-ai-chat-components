/**
 * Enhanced error handling utilities for CLI
 * Provides actionable error messages and proper exit codes
 */
import chalk from 'chalk';
import boxen from 'boxen';
import { getLogger } from './logger.js';
const logger = getLogger('errors');
export var ExitCode;
(function (ExitCode) {
    ExitCode[ExitCode["SUCCESS"] = 0] = "SUCCESS";
    ExitCode[ExitCode["GENERAL_ERROR"] = 1] = "GENERAL_ERROR";
    ExitCode[ExitCode["MISUSE"] = 2] = "MISUSE";
    ExitCode[ExitCode["CONFIG_ERROR"] = 3] = "CONFIG_ERROR";
    ExitCode[ExitCode["VALIDATION_ERROR"] = 4] = "VALIDATION_ERROR";
    ExitCode[ExitCode["NOT_FOUND"] = 5] = "NOT_FOUND";
    ExitCode[ExitCode["PERMISSION_ERROR"] = 6] = "PERMISSION_ERROR";
})(ExitCode || (ExitCode = {}));
export class CLIError extends Error {
    code;
    suggestions;
    docs;
    constructor(message, code = ExitCode.GENERAL_ERROR, suggestions = [], docs) {
        super(message);
        this.code = code;
        this.suggestions = suggestions;
        this.docs = docs;
        this.name = 'CLIError';
    }
}
export class ValidationError extends CLIError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.VALIDATION_ERROR, suggestions);
        this.name = 'ValidationError';
    }
}
export class NotFoundError extends CLIError {
    constructor(resource, suggestions = []) {
        super(`Not found: ${resource}`, ExitCode.NOT_FOUND, suggestions);
        this.name = 'NotFoundError';
    }
}
export class ConfigError extends CLIError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.CONFIG_ERROR, suggestions);
        this.name = 'ConfigError';
    }
}
export class PermissionError extends CLIError {
    constructor(message, suggestions = []) {
        super(message, ExitCode.PERMISSION_ERROR, suggestions);
        this.name = 'PermissionError';
    }
}
/**
 * Normalize error to Error instance
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
    // Don't show beautiful error UI in JSON mode
    const isJsonMode = process.argv.includes('--json');
    if (normalizedError instanceof CLIError) {
        if (!isJsonMode) {
            console.error('\n');
            const errorBox = boxen(chalk.red.bold(normalizedError.message) +
                (normalizedError.suggestions.length > 0
                    ? '\n\n' + chalk.yellow.bold('💡 Suggestions:\n') +
                        normalizedError.suggestions.map(s => chalk.gray('  • ') + s).join('\n')
                    : '') +
                (normalizedError.docs
                    ? '\n\n' + chalk.blue.bold('📚 Documentation: ') + chalk.cyan.underline(normalizedError.docs)
                    : ''), {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'red',
                title: '❌ Error',
                titleAlignment: 'center',
            });
            console.error(errorBox);
        }
        else {
            console.error(JSON.stringify({
                error: normalizedError.message,
                code: normalizedError.code,
                suggestions: normalizedError.suggestions,
                docs: normalizedError.docs,
            }));
        }
        logger.error(normalizedError);
        process.exit(normalizedError.code);
    }
    if (normalizedError instanceof Error) {
        if (!isJsonMode) {
            console.error('\n');
            const errorBox = boxen(chalk.red.bold('Unexpected Error:') + '\n\n' + chalk.red(normalizedError.message) +
                (process.env.DEBUG || process.env.VERBOSE && normalizedError.stack
                    ? '\n\n' + chalk.gray(normalizedError.stack)
                    : '\n\n' + chalk.gray('Run with --debug for more details')), {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'red',
                title: '❌ Error',
                titleAlignment: 'center',
            });
            console.error(errorBox);
        }
        else {
            console.error(JSON.stringify({
                error: normalizedError.message,
                stack: normalizedError.stack,
            }));
        }
        logger.error(normalizedError);
        process.exit(ExitCode.GENERAL_ERROR);
    }
    if (!isJsonMode) {
        console.error('\n');
        console.error(boxen(chalk.red.bold('Unknown Error'), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'red',
            title: '❌ Error',
            titleAlignment: 'center',
        }));
    }
    logger.error('Unknown error', normalizedError);
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
//# sourceMappingURL=errors.js.map