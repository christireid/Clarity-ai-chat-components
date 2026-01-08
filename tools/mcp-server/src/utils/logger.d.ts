/**
 * Structured logging utility for MCP server
 *
 * Uses console.error for stdio transport compatibility
 */
export declare enum LogLevel {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
declare class Logger {
    private requestId?;
    setRequestId(requestId: string): void;
    clearRequestId(): void;
    private log;
    debug(message: string, metadata?: Record<string, unknown>): void;
    info(message: string, metadata?: Record<string, unknown>): void;
    warn(message: string, metadata?: Record<string, unknown>): void;
    error(message: string, error?: Error, metadata?: Record<string, unknown>): void;
}
export declare const logger: Logger;
export {};
//# sourceMappingURL=logger.d.ts.map