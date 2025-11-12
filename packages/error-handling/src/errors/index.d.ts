/**
 * Base error class for all Clarity Chat errors
 * Provides helpful context, solutions, and documentation links
 */
export declare class ClarityChatError extends Error {
    readonly code: string;
    readonly solution?: string;
    readonly docs?: string;
    readonly context?: Record<string, any>;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
    });
    toString(): string;
    toJSON(): {
        name: string;
        code: string;
        message: string;
        solution: string | undefined;
        docs: string | undefined;
        context: Record<string, any> | undefined;
        stack: string | undefined;
    };
}
/**
 * Configuration errors - invalid or missing configuration
 */
export declare class ConfigurationError extends ClarityChatError {
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
    });
}
/**
 * API errors - HTTP request failures, invalid responses
 */
export declare class APIError extends ClarityChatError {
    readonly statusCode?: number;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
        statusCode?: number;
    });
}
/**
 * Authentication errors - missing or invalid credentials
 */
export declare class AuthenticationError extends ClarityChatError {
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
    });
}
/**
 * Rate limit errors - too many requests
 */
export declare class RateLimitError extends ClarityChatError {
    readonly retryAfter?: number;
    readonly limit?: number;
    readonly remaining?: number;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
        retryAfter?: number;
        limit?: number;
        remaining?: number;
    });
}
/**
 * Validation errors - invalid input data
 */
export declare class ValidationError extends ClarityChatError {
    readonly field?: string;
    readonly value?: any;
    readonly expected?: string;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
        field?: string;
        value?: any;
        expected?: string;
    });
}
/**
 * Stream errors - streaming connection issues
 */
export declare class StreamError extends ClarityChatError {
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
    });
}
/**
 * Token limit errors - message or context too long
 */
export declare class TokenLimitError extends ClarityChatError {
    readonly limit?: number;
    readonly actual?: number;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
        limit?: number;
        actual?: number;
    });
}
/**
 * Network errors - connection failures
 */
export declare class NetworkError extends ClarityChatError {
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
    });
}
/**
 * Timeout errors - request took too long
 */
export declare class TimeoutError extends ClarityChatError {
    readonly timeout?: number;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
        timeout?: number;
    });
}
/**
 * Component errors - React component lifecycle issues
 */
export declare class ComponentError extends ClarityChatError {
    readonly componentName?: string;
    constructor(message: string, options?: {
        code?: string;
        solution?: string;
        docs?: string;
        context?: Record<string, any>;
        componentName?: string;
    });
}
//# sourceMappingURL=index.d.ts.map