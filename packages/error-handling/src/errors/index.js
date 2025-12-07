/**
 * Base error class for all Clarity Chat errors
 * Provides helpful context, solutions, and documentation links
 */
export class ClarityChatError extends Error {
    code;
    solution;
    docs;
    context;
    constructor(message, options) {
        super(message);
        this.name = 'ClarityChatError';
        this.code = options?.code || 'UNKNOWN_ERROR';
        this.solution = options?.solution;
        this.docs = options?.docs;
        this.context = options?.context;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
    toString() {
        let message = `${this.name} [${this.code}]: ${this.message}`;
        if (this.solution) {
            message += `\n\n💡 Solution: ${this.solution}`;
        }
        if (this.docs) {
            message += `\n\n📚 Documentation: ${this.docs}`;
        }
        if (this.context) {
            message += `\n\n🔍 Context: ${JSON.stringify(this.context, null, 2)}`;
        }
        return message;
    }
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            solution: this.solution,
            docs: this.docs,
            context: this.context,
            stack: this.stack,
        };
    }
}
/**
 * Configuration errors - invalid or missing configuration
 */
export class ConfigurationError extends ClarityChatError {
    constructor(message, options) {
        super(message, options);
        this.name = 'ConfigurationError';
    }
}
/**
 * API errors - HTTP request failures, invalid responses
 */
export class APIError extends ClarityChatError {
    statusCode;
    constructor(message, options) {
        super(message, options);
        this.name = 'APIError';
        this.statusCode = options?.statusCode;
    }
}
/**
 * Authentication errors - missing or invalid credentials
 */
export class AuthenticationError extends ClarityChatError {
    constructor(message, options) {
        super(message, options);
        this.name = 'AuthenticationError';
    }
}
/**
 * Rate limit errors - too many requests
 */
export class RateLimitError extends ClarityChatError {
    retryAfter;
    limit;
    remaining;
    constructor(message, options) {
        super(message, options);
        this.name = 'RateLimitError';
        this.retryAfter = options?.retryAfter;
        this.limit = options?.limit;
        this.remaining = options?.remaining;
    }
}
/**
 * Validation errors - invalid input data
 */
export class ValidationError extends ClarityChatError {
    field;
    value;
    expected;
    constructor(message, options) {
        super(message, options);
        this.name = 'ValidationError';
        this.field = options?.field;
        this.value = options?.value;
        this.expected = options?.expected;
    }
}
/**
 * Stream errors - streaming connection issues
 */
export class StreamError extends ClarityChatError {
    constructor(message, options) {
        super(message, options);
        this.name = 'StreamError';
    }
}
/**
 * Token limit errors - message or context too long
 */
export class TokenLimitError extends ClarityChatError {
    limit;
    actual;
    constructor(message, options) {
        super(message, options);
        this.name = 'TokenLimitError';
        this.limit = options?.limit;
        this.actual = options?.actual;
    }
}
/**
 * Network errors - connection failures
 */
export class NetworkError extends ClarityChatError {
    constructor(message, options) {
        super(message, options);
        this.name = 'NetworkError';
    }
}
/**
 * Timeout errors - request took too long
 */
export class TimeoutError extends ClarityChatError {
    timeout;
    constructor(message, options) {
        super(message, options);
        this.name = 'TimeoutError';
        this.timeout = options?.timeout;
    }
}
/**
 * Component errors - React component lifecycle issues
 */
export class ComponentError extends ClarityChatError {
    componentName;
    constructor(message, options) {
        super(message, options);
        this.name = 'ComponentError';
        this.componentName = options?.componentName;
    }
}
//# sourceMappingURL=index.js.map