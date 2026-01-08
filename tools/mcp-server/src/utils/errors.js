/**
 * Enhanced Error Handling System for MCP Server
 *
 * Provides comprehensive error classes with recovery suggestions,
 * helpful tips, and user-friendly formatting.
 *
 * @module utils/errors
 */
// =============================================================================
// Error Codes
// =============================================================================
export var ErrorCode;
(function (ErrorCode) {
    // Client Errors (4xx)
    ErrorCode[ErrorCode["VALIDATION_ERROR"] = 400] = "VALIDATION_ERROR";
    ErrorCode[ErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    ErrorCode[ErrorCode["PERMISSION_DENIED"] = 403] = "PERMISSION_DENIED";
    ErrorCode[ErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCode[ErrorCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    ErrorCode[ErrorCode["CONFLICT"] = 409] = "CONFLICT";
    ErrorCode[ErrorCode["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
    ErrorCode[ErrorCode["RATE_LIMITED"] = 429] = "RATE_LIMITED";
    // Server Errors (5xx)
    ErrorCode[ErrorCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ErrorCode[ErrorCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    ErrorCode[ErrorCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    ErrorCode[ErrorCode["TIMEOUT"] = 504] = "TIMEOUT";
    // Custom Errors (1xxx)
    ErrorCode[ErrorCode["PLUGIN_ERROR"] = 1001] = "PLUGIN_ERROR";
    ErrorCode[ErrorCode["CONFIGURATION_ERROR"] = 1002] = "CONFIGURATION_ERROR";
    ErrorCode[ErrorCode["DEPENDENCY_ERROR"] = 1003] = "DEPENDENCY_ERROR";
})(ErrorCode || (ErrorCode = {}));
// =============================================================================
// Base Error Class
// =============================================================================
/**
 * Enhanced MCP Error with recovery suggestions
 */
export class MCPError extends Error {
    code;
    details;
    context;
    timestamp;
    suggestions;
    constructor(code, message, details, context, suggestions) {
        super(message);
        this.code = code;
        this.details = details;
        this.context = context;
        this.name = 'MCPError';
        this.timestamp = new Date().toISOString();
        this.suggestions = suggestions || [];
        Object.setPrototypeOf(this, MCPError.prototype);
    }
    /**
     * Add a recovery suggestion
     */
    addSuggestion(suggestion) {
        this.suggestions.push(suggestion);
        return this;
    }
    /**
     * Get user-friendly error message
     */
    toUserMessage() {
        let message = this.message;
        if (this.suggestions.length > 0) {
            message += '\n\nSuggested actions:';
            for (const suggestion of this.suggestions) {
                message += `\n• ${suggestion.action}: ${suggestion.description}`;
                if (suggestion.example) {
                    message += `\n  Example: ${suggestion.example}`;
                }
            }
        }
        return message;
    }
    /**
     * Convert to JSON for API response
     */
    toJSON() {
        return {
            success: false,
            error: {
                code: this.code,
                name: this.name,
                message: this.message,
                timestamp: this.timestamp,
                ...(this.details && { details: this.details }),
                ...(this.context && { context: this.context }),
                ...(this.suggestions.length > 0 && { suggestions: this.suggestions }),
            },
        };
    }
}
// =============================================================================
// Specific Error Classes
// =============================================================================
/**
 * Validation Error - for invalid input
 */
export class ValidationError extends MCPError {
    constructor(message, details, context) {
        super(ErrorCode.VALIDATION_ERROR, message, details, context, [
            {
                action: 'Check input format',
                description: 'Verify that all required fields are provided and have valid values',
            },
            {
                action: 'Review documentation',
                description: 'Check the tool/resource documentation for expected input format',
                docsUrl: 'clarity://docs/api-reference',
            },
        ]);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
    /**
     * Create validation error for missing field
     */
    static missingField(field, context) {
        return new ValidationError(`Missing required field: ${field}`, { field, type: 'missing' }, context).addSuggestion({
            action: 'Add required field',
            description: `Include the "${field}" field in your request`,
            example: `{ "${field}": "value" }`,
        });
    }
    /**
     * Create validation error for invalid type
     */
    static invalidType(field, expected, received, context) {
        return new ValidationError(`Invalid type for field "${field}": expected ${expected}, got ${received}`, { field, expected, received, type: 'type_mismatch' }, context).addSuggestion({
            action: 'Fix field type',
            description: `Change "${field}" to be of type ${expected}`,
            example: expected === 'string'
                ? `"${field}": "text"`
                : `"${field}": ${expected === 'number' ? '123' : expected === 'boolean' ? 'true' : '[]'}`,
        });
    }
    /**
     * Create validation error for invalid enum value
     */
    static invalidEnum(field, validValues, received, context) {
        return new ValidationError(`Invalid value for "${field}": "${received}". Valid values: ${validValues.join(', ')}`, { field, validValues, received, type: 'invalid_enum' }, context).addSuggestion({
            action: 'Use valid value',
            description: `Choose one of: ${validValues.join(', ')}`,
            example: `"${field}": "${validValues[0]}"`,
        });
    }
}
/**
 * Not Found Error - for missing resources
 */
export class NotFoundError extends MCPError {
    resource;
    identifier;
    constructor(resource, identifier, context, suggestions) {
        const message = identifier
            ? `${resource} not found: ${identifier}`
            : `${resource} not found`;
        const defaultSuggestions = [
            {
                action: 'Verify identifier',
                description: `Check that the ${resource.toLowerCase()} name/ID is spelled correctly`,
            },
            {
                action: 'List available options',
                description: `Use a discovery tool to find available ${resource.toLowerCase()}s`,
            },
        ];
        super(ErrorCode.NOT_FOUND, message, { resource, identifier }, context, suggestions || defaultSuggestions);
        this.name = 'NotFoundError';
        this.resource = resource;
        this.identifier = identifier;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    /**
     * Create with similar items suggestion
     */
    static withSuggestions(resource, identifier, similarItems, context) {
        const suggestions = [];
        if (similarItems.length > 0) {
            suggestions.push({
                action: 'Did you mean?',
                description: `Similar ${resource.toLowerCase()}s: ${similarItems.join(', ')}`,
                example: similarItems[0],
            });
        }
        suggestions.push({
            action: 'Search for options',
            description: `Use clarity_discover_components or clarity_discover_hooks to search`,
            example: `clarity_discover_components({ query: "${identifier.substring(0, 5)}" })`,
        });
        return new NotFoundError(resource, identifier, context, suggestions);
    }
}
/**
 * Permission Error - for access denied
 */
export class PermissionError extends MCPError {
    constructor(message, details, context) {
        super(ErrorCode.PERMISSION_DENIED, message, details, context, [
            {
                action: 'Check permissions',
                description: 'Verify you have the required permissions for this operation',
            },
            {
                action: 'Check path validity',
                description: 'Ensure the path is within allowed directories',
            },
        ]);
        this.name = 'PermissionError';
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}
/**
 * Rate Limit Error - for too many requests
 */
export class RateLimitError extends MCPError {
    retryAfterMs;
    limit;
    remaining;
    constructor(retryAfterMs, limit, remaining, context) {
        super(ErrorCode.RATE_LIMITED, `Rate limit exceeded. Please retry after ${Math.ceil(retryAfterMs / 1000)} seconds.`, { retryAfterMs, limit, remaining }, context, [
            {
                action: 'Wait and retry',
                description: `Wait ${Math.ceil(retryAfterMs / 1000)} seconds before retrying`,
            },
            {
                action: 'Reduce request frequency',
                description: `Current limit: ${limit} requests per window`,
            },
            {
                action: 'Use batch operations',
                description: 'Combine multiple operations into single requests where possible',
            },
        ]);
        this.name = 'RateLimitError';
        this.retryAfterMs = retryAfterMs;
        this.limit = limit;
        this.remaining = remaining;
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
/**
 * Configuration Error - for invalid configuration
 */
export class ConfigurationError extends MCPError {
    constructor(message, details, context) {
        super(ErrorCode.CONFIGURATION_ERROR, message, details, context, [
            {
                action: 'Check configuration',
                description: 'Review your configuration file for errors',
            },
            {
                action: 'Use validate_config',
                description: 'Run the validate_config tool to identify issues',
                example: 'validate_config({ projectPath: "./your-project" })',
            },
        ]);
        this.name = 'ConfigurationError';
        Object.setPrototypeOf(this, ConfigurationError.prototype);
    }
}
/**
 * Plugin Error - for plugin-related issues
 */
export class PluginError extends MCPError {
    pluginId;
    constructor(pluginId, message, details, context) {
        super(ErrorCode.PLUGIN_ERROR, `Plugin "${pluginId}": ${message}`, { pluginId, ...details }, context, [
            {
                action: 'Check plugin status',
                description: 'Verify the plugin is properly registered and enabled',
                example: `list_plugins()`,
            },
            {
                action: 'Reinstall plugin',
                description: 'Try unregistering and re-registering the plugin',
            },
        ]);
        this.name = 'PluginError';
        this.pluginId = pluginId;
        Object.setPrototypeOf(this, PluginError.prototype);
    }
}
/**
 * Timeout Error - for operations that take too long
 */
export class TimeoutError extends MCPError {
    timeoutMs;
    constructor(operation, timeoutMs, context) {
        super(ErrorCode.TIMEOUT, `Operation "${operation}" timed out after ${timeoutMs}ms`, { operation, timeoutMs }, context, [
            {
                action: 'Retry the operation',
                description: 'The operation may succeed on a subsequent attempt',
            },
            {
                action: 'Reduce complexity',
                description: 'Try breaking down the operation into smaller parts',
            },
        ]);
        this.name = 'TimeoutError';
        this.timeoutMs = timeoutMs;
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
// =============================================================================
// Error Formatting
// =============================================================================
/**
 * Format error for MCP response with enhanced details
 */
export function formatErrorResponse(error) {
    if (error instanceof MCPError) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(error.toJSON(), null, 2),
                },
            ],
            isError: true,
        };
    }
    // Handle rate limit errors from rate-limiter module
    if (error instanceof Error && error.name === 'RateLimitError') {
        const rateLimitError = error;
        const mcpError = new RateLimitError(rateLimitError.retryAfterMs ?? 60000, rateLimitError.limit ?? 100, rateLimitError.remaining ?? 0);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(mcpError.toJSON(), null, 2),
                },
            ],
            isError: true,
        };
    }
    // Handle standard errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const genericError = new MCPError(ErrorCode.INTERNAL_ERROR, errorMessage, undefined, undefined, [
        {
            action: 'Report the issue',
            description: 'If this persists, report it with the error details',
            docsUrl: 'https://github.com/clarity-chat/mcp-server/issues',
        },
    ]);
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(genericError.toJSON(), null, 2),
            },
        ],
        isError: true,
    };
}
// =============================================================================
// Error Helpers
// =============================================================================
/**
 * Wrap an async function with error handling
 */
export async function withErrorHandling(operation, context) {
    try {
        return await operation();
    }
    catch (error) {
        if (error instanceof MCPError) {
            throw error;
        }
        // Wrap unknown errors
        throw new MCPError(ErrorCode.INTERNAL_ERROR, error instanceof Error ? error.message : 'Unknown error', { originalError: String(error) }, context);
    }
}
/**
 * Create a user-friendly error message
 */
export function createFriendlyMessage(error) {
    if (error instanceof MCPError) {
        return error.toUserMessage();
    }
    if (error instanceof Error) {
        return `An error occurred: ${error.message}`;
    }
    return 'An unexpected error occurred. Please try again.';
}
/**
 * Check if an error is retryable
 */
export function isRetryableError(error) {
    if (error instanceof MCPError) {
        return [
            ErrorCode.RATE_LIMITED,
            ErrorCode.SERVICE_UNAVAILABLE,
            ErrorCode.TIMEOUT,
        ].includes(error.code);
    }
    return false;
}
/**
 * Get retry delay for an error (in ms)
 */
export function getRetryDelay(error) {
    if (error instanceof RateLimitError) {
        return error.retryAfterMs;
    }
    if (error instanceof TimeoutError) {
        return 1000; // 1 second default
    }
    if (error instanceof MCPError &&
        error.code === ErrorCode.SERVICE_UNAVAILABLE) {
        return 5000; // 5 seconds for service unavailable
    }
    return 0;
}
//# sourceMappingURL=errors.js.map