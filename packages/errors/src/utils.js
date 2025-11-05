/**
 * Utility functions for error handling
 */
import { ClarityError } from './base-error';
/**
 * Format error for display
 */
export function formatError(error) {
    if (error instanceof ClarityError) {
        return error.toTerminalString();
    }
    return `\n❌ Error: ${error.message}\n\n${error.stack}\n`;
}
/**
 * Log error to console with formatting
 */
export function logError(error) {
    if (error instanceof ClarityError) {
        console.error(error.toTerminalString());
    }
    else {
        console.error('\n❌ Unexpected Error:', error.message);
        console.error('\nStack trace:');
        console.error(error.stack);
        console.error('');
    }
}
/**
 * Handle error with appropriate response
 */
export function handleError(error) {
    if (error instanceof ClarityError) {
        const statusCode = getStatusCode(error.code);
        return {
            statusCode,
            body: error.toJSON()
        };
    }
    // Unknown error
    return {
        statusCode: 500,
        body: {
            code: 'INTERNAL_ERROR',
            message: 'An unexpected error occurred',
            technicalMessage: error.message
        }
    };
}
/**
 * Map error codes to HTTP status codes
 */
function getStatusCode(errorCode) {
    const statusCodes = {
        // Client errors (400-499)
        'VALIDATION_ERROR': 400,
        'INVALID_INPUT': 400,
        'MISSING_FIELD': 400,
        'TYPE_MISMATCH': 400,
        'INVALID_CONFIG': 400,
        // Authentication/Authorization (401-403)
        'API_KEY_MISSING': 401,
        'API_AUTHENTICATION_FAILED': 401,
        // Not found (404)
        'FILE_NOT_FOUND': 404,
        'DEPENDENCY_MISSING': 404,
        // Rate limiting (429)
        'API_RATE_LIMIT': 429,
        // Server errors (500-599)
        'API_NETWORK_ERROR': 503,
        'API_RESPONSE_ERROR': 502,
        'PORT_IN_USE': 500,
        'ENV_VAR_MISSING': 500
    };
    return statusCodes[errorCode] || 500;
}
/**
 * Create error handler middleware for Next.js API routes
 */
export function createErrorHandler() {
    return function errorHandler(handler) {
        return async (req, res) => {
            try {
                return await handler(req, res);
            }
            catch (error) {
                const { statusCode, body } = handleError(error);
                // Log error for debugging
                logError(error);
                // Send error response
                res.status(statusCode).json(body);
            }
        };
    };
}
/**
 * Wrap async functions with error handling
 */
export function withErrorHandling(fn, errorHandler) {
    return (async (...args) => {
        try {
            return await fn(...args);
        }
        catch (error) {
            if (errorHandler) {
                errorHandler(error);
            }
            else {
                logError(error);
            }
            throw error;
        }
    });
}
/**
 * Assert condition and throw descriptive error if false
 */
export function assert(condition, error) {
    if (!condition) {
        if (typeof error === 'string') {
            throw new Error(error);
        }
        throw error;
    }
}
/**
 * Try-catch wrapper that returns [error, result] tuple
 */
export async function tryCatch(fn) {
    try {
        const result = await fn();
        return [null, result];
    }
    catch (error) {
        return [error, null];
    }
}
//# sourceMappingURL=utils.js.map