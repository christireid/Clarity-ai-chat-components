/**
 * Structured logging utility for MCP server
 *
 * Uses console.error for stdio transport compatibility
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel["DEBUG"] = "debug";
    LogLevel["INFO"] = "info";
    LogLevel["WARN"] = "warn";
    LogLevel["ERROR"] = "error";
})(LogLevel || (LogLevel = {}));
class Logger {
    requestId;
    setRequestId(requestId) {
        this.requestId = requestId;
    }
    clearRequestId() {
        this.requestId = undefined;
    }
    log(level, message, error, metadata) {
        const entry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            ...(this.requestId && { requestId: this.requestId }),
            ...(error && { error: error.message, stack: error.stack }),
            ...(metadata && { metadata })
        };
        // Use console.error for stdio transport (stderr)
        console.error(JSON.stringify(entry));
    }
    debug(message, metadata) {
        this.log(LogLevel.DEBUG, message, undefined, metadata);
    }
    info(message, metadata) {
        this.log(LogLevel.INFO, message, undefined, metadata);
    }
    warn(message, metadata) {
        this.log(LogLevel.WARN, message, undefined, metadata);
    }
    error(message, error, metadata) {
        this.log(LogLevel.ERROR, message, error, metadata);
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map