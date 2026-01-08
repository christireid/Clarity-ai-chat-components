/**
 * Enhanced structured logging utility
 * Supports log levels, structured output, and request tracking
 *
 */
import pc from 'picocolors';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
let globalLogLevel = process.env.DEBUG
    ? LogLevel.DEBUG
    : LogLevel.INFO;
let requestId = null;
/**
 * Set global log level
 */
export function setGlobalLogLevel(level) {
    globalLogLevel = level;
}
/**
 * Set request ID for tracing
 */
export function setRequestId(id) {
    requestId = id;
}
/**
 * Get request ID
 */
export function getRequestId() {
    return requestId;
}
/**
 * Format log entry as JSON (for structured logging)
 */
function formatLogEntry(entry) {
    return JSON.stringify({
        ...entry,
        error: entry.error
            ? {
                message: entry.error.message,
                stack: entry.error.stack,
                name: entry.error.name,
            }
            : undefined,
    });
}
/**
 * Create logger instance
 *
 */
export function getLogger(namespace, level = globalLogLevel) {
    let instanceLevel = level;
    const shouldLog = (logLevel) => {
        return logLevel >= instanceLevel && logLevel >= globalLogLevel;
    };
    const formatPrefix = (icon, color) => {
        const parts = [pc.gray(`[${namespace}]`), color(icon)];
        if (requestId) {
            parts.push(pc.gray(`[${requestId.slice(0, 8)}]`));
        }
        return parts.join(' ');
    };
    return {
        info: (message, ...args) => {
            if (!shouldLog(LogLevel.INFO))
                return;
            const entry = {
                timestamp: new Date().toISOString(),
                level: LogLevel.INFO,
                namespace,
                message,
                data: args.length > 0 ? args : undefined,
            };
            if (process.env.JSON_LOGS) {
                console.info(formatLogEntry(entry));
            }
            else {
                console.info(formatPrefix('ℹ', pc.blue), message, ...args);
            }
        },
        warn: (message, ...args) => {
            if (!shouldLog(LogLevel.WARN))
                return;
            const entry = {
                timestamp: new Date().toISOString(),
                level: LogLevel.WARN,
                namespace,
                message,
                data: args.length > 0 ? args : undefined,
            };
            if (process.env.JSON_LOGS) {
                console.warn(formatLogEntry(entry));
            }
            else {
                console.warn(formatPrefix('⚠', pc.yellow), message, ...args);
            }
        },
        error: (message, ...args) => {
            if (!shouldLog(LogLevel.ERROR))
                return;
            const error = message instanceof Error ? message : undefined;
            const errorMessage = error
                ? error.message
                : typeof message === 'string'
                    ? message
                    : String(message);
            const entry = {
                timestamp: new Date().toISOString(),
                level: LogLevel.ERROR,
                namespace,
                message: errorMessage,
                data: args.length > 0 ? args : undefined,
                error,
            };
            if (process.env.JSON_LOGS) {
                console.error(formatLogEntry(entry));
            }
            else {
                console.error(formatPrefix('✖', pc.red), errorMessage, ...args);
                if (error &&
                    'stack' in error &&
                    error.stack &&
                    (process.env.DEBUG || process.env.VERBOSE)) {
                    console.error(pc.gray(String(error.stack)));
                }
            }
        },
        success: (message, ...args) => {
            if (!shouldLog(LogLevel.INFO))
                return;
            const entry = {
                timestamp: new Date().toISOString(),
                level: LogLevel.INFO,
                namespace,
                message: String(message),
                data: args.length > 0 ? args : undefined,
            };
            if (process.env.JSON_LOGS) {
                console.info(formatLogEntry(entry));
            }
            else {
                console.info(formatPrefix('✔', pc.green), message, ...args);
            }
        },
        debug: (message, ...args) => {
            if (!shouldLog(LogLevel.DEBUG))
                return;
            const entry = {
                timestamp: new Date().toISOString(),
                level: LogLevel.DEBUG,
                namespace,
                message,
                data: args.length > 0 ? args : undefined,
            };
            if (process.env.JSON_LOGS) {
                console.debug(formatLogEntry(entry));
            }
            else {
                console.debug(formatPrefix('🐛', pc.magenta), message, ...args);
            }
        },
        setLevel: (level) => {
            instanceLevel = level;
        },
        getLevel: () => instanceLevel,
    };
}
export default {
    LogLevel,
    getLogger,
    setGlobalLogLevel,
    setRequestId,
    getRequestId,
};
//# sourceMappingURL=logger.js.map