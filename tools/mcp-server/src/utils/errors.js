/**
 * Custom error classes for MCP server
 */
export var ErrorCode;
(function (ErrorCode) {
    ErrorCode[ErrorCode["VALIDATION_ERROR"] = 400] = "VALIDATION_ERROR";
    ErrorCode[ErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    ErrorCode[ErrorCode["INTERNAL_ERROR"] = 500] = "INTERNAL_ERROR";
    ErrorCode[ErrorCode["PERMISSION_DENIED"] = 403] = "PERMISSION_DENIED";
})(ErrorCode || (ErrorCode = {}));
export class MCPError extends Error {
    code;
    details;
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'MCPError';
        Object.setPrototypeOf(this, MCPError.prototype);
    }
}
export class ValidationError extends MCPError {
    constructor(message, details) {
        super(ErrorCode.VALIDATION_ERROR, message, details);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
export class NotFoundError extends MCPError {
    constructor(resource, identifier) {
        const message = identifier
            ? `${resource} not found: ${identifier}`
            : `${resource} not found`;
        super(ErrorCode.NOT_FOUND, message, { resource, identifier });
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export class PermissionError extends MCPError {
    constructor(message, details) {
        super(ErrorCode.PERMISSION_DENIED, message, details);
        this.name = 'PermissionError';
        Object.setPrototypeOf(this, PermissionError.prototype);
    }
}
/**
 * Format error for MCP response
 */
export function formatErrorResponse(error) {
    if (error instanceof MCPError) {
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        success: false,
                        error: {
                            code: error.code,
                            message: error.message,
                            ...(error.details && { details: error.details })
                        }
                    }, null, 2)
                }
            ],
            isError: true
        };
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    success: false,
                    error: {
                        code: ErrorCode.INTERNAL_ERROR,
                        message: 'Internal server error'
                    }
                }, null, 2)
            }
        ],
        isError: true
    };
}
//# sourceMappingURL=errors.js.map