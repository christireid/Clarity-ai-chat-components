/**
 * Custom error classes for MCP server
 */
export declare enum ErrorCode {
    VALIDATION_ERROR = 400,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500,
    PERMISSION_DENIED = 403
}
export declare class MCPError extends Error {
    code: ErrorCode;
    details?: Record<string, any> | undefined;
    constructor(code: ErrorCode, message: string, details?: Record<string, any> | undefined);
}
export declare class ValidationError extends MCPError {
    constructor(message: string, details?: Record<string, any>);
}
export declare class NotFoundError extends MCPError {
    constructor(resource: string, identifier?: string);
}
export declare class PermissionError extends MCPError {
    constructor(message: string, details?: Record<string, any>);
}
/**
 * Format error for MCP response
 */
export declare function formatErrorResponse(error: unknown): {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError: boolean;
};
//# sourceMappingURL=errors.d.ts.map