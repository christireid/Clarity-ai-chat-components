/**
 * Enhanced Error Handling System for MCP Server
 *
 * Provides comprehensive error classes with recovery suggestions,
 * helpful tips, and user-friendly formatting.
 *
 * @module utils/errors
 */
export declare enum ErrorCode {
    VALIDATION_ERROR = 400,
    UNAUTHORIZED = 401,
    PERMISSION_DENIED = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    PAYLOAD_TOO_LARGE = 413,
    RATE_LIMITED = 429,
    INTERNAL_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    SERVICE_UNAVAILABLE = 503,
    TIMEOUT = 504,
    PLUGIN_ERROR = 1001,
    CONFIGURATION_ERROR = 1002,
    DEPENDENCY_ERROR = 1003
}
export interface RecoverySuggestion {
    /** Short action title */
    action: string;
    /** Detailed description */
    description: string;
    /** Example command or code */
    example?: string;
    /** Documentation link */
    docsUrl?: string;
}
export interface ErrorContext {
    /** Request ID for tracing */
    requestId?: string;
    /** Operation that failed */
    operation?: string;
    /** Resource being accessed */
    resource?: string;
    /** Additional metadata */
    metadata?: Record<string, unknown>;
    /** Stack trace (in development) */
    stack?: string;
}
/**
 * Enhanced MCP Error with recovery suggestions
 */
export declare class MCPError extends Error {
    readonly code: ErrorCode;
    readonly details?: Record<string, unknown> | undefined;
    readonly context?: ErrorContext | undefined;
    readonly timestamp: string;
    readonly suggestions: RecoverySuggestion[];
    constructor(code: ErrorCode, message: string, details?: Record<string, unknown> | undefined, context?: ErrorContext | undefined, suggestions?: RecoverySuggestion[]);
    /**
     * Add a recovery suggestion
     */
    addSuggestion(suggestion: RecoverySuggestion): this;
    /**
     * Get user-friendly error message
     */
    toUserMessage(): string;
    /**
     * Convert to JSON for API response
     */
    toJSON(): Record<string, unknown>;
}
/**
 * Validation Error - for invalid input
 */
export declare class ValidationError extends MCPError {
    constructor(message: string, details?: Record<string, unknown>, context?: ErrorContext);
    /**
     * Create validation error for missing field
     */
    static missingField(field: string, context?: ErrorContext): ValidationError;
    /**
     * Create validation error for invalid type
     */
    static invalidType(field: string, expected: string, received: string, context?: ErrorContext): ValidationError;
    /**
     * Create validation error for invalid enum value
     */
    static invalidEnum(field: string, validValues: string[], received: string, context?: ErrorContext): ValidationError;
}
/**
 * Not Found Error - for missing resources
 */
export declare class NotFoundError extends MCPError {
    readonly resource: string;
    readonly identifier?: string;
    constructor(resource: string, identifier?: string, context?: ErrorContext, suggestions?: RecoverySuggestion[]);
    /**
     * Create with similar items suggestion
     */
    static withSuggestions(resource: string, identifier: string, similarItems: string[], context?: ErrorContext): NotFoundError;
}
/**
 * Permission Error - for access denied
 */
export declare class PermissionError extends MCPError {
    constructor(message: string, details?: Record<string, unknown>, context?: ErrorContext);
}
/**
 * Rate Limit Error - for too many requests
 */
export declare class RateLimitError extends MCPError {
    readonly retryAfterMs: number;
    readonly limit: number;
    readonly remaining: number;
    constructor(retryAfterMs: number, limit: number, remaining: number, context?: ErrorContext);
}
/**
 * Configuration Error - for invalid configuration
 */
export declare class ConfigurationError extends MCPError {
    constructor(message: string, details?: Record<string, unknown>, context?: ErrorContext);
}
/**
 * Plugin Error - for plugin-related issues
 */
export declare class PluginError extends MCPError {
    readonly pluginId: string;
    constructor(pluginId: string, message: string, details?: Record<string, unknown>, context?: ErrorContext);
}
/**
 * Timeout Error - for operations that take too long
 */
export declare class TimeoutError extends MCPError {
    readonly timeoutMs: number;
    constructor(operation: string, timeoutMs: number, context?: ErrorContext);
}
/**
 * Format error for MCP response with enhanced details
 */
export declare function formatErrorResponse(error: unknown): {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError: boolean;
};
/**
 * Wrap an async function with error handling
 */
export declare function withErrorHandling<T>(operation: () => Promise<T>, context?: ErrorContext): Promise<T>;
/**
 * Create a user-friendly error message
 */
export declare function createFriendlyMessage(error: unknown): string;
/**
 * Check if an error is retryable
 */
export declare function isRetryableError(error: unknown): boolean;
/**
 * Get retry delay for an error (in ms)
 */
export declare function getRetryDelay(error: unknown): number;
//# sourceMappingURL=errors.d.ts.map