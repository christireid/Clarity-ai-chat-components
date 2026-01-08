/**
 * Unified Logger
 *
 * Structured logging utility with log levels, namespaces, and request tracking.
 * Supports both pretty-printed and JSON output formats.
 *
 *
 * @example
 * ```ts
 *
 * const logger = getLogger('my-module')
 * logger.info('Starting process')
 * logger.error('Something went wrong', { detail: 'info' })
 * logger.debug('Debug info') // Only shown when DEBUG=true
 * ```
 */
/**
 * Log level enum for filtering output
 */
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
const DEFAULT_OPTIONS = {
    verbose: false,
    silent: false,
    timestamps: false,
    jsonOutput: false,
};
let globalOptions = { ...DEFAULT_OPTIONS };
let globalLogLevel = typeof process !== 'undefined' && process.env?.DEBUG
    ? LogLevel.DEBUG
    : LogLevel.INFO;
let requestId = null;
/**
 * Configure global logger options
 *
 * @param options - Logger options to merge with defaults
 *
 * @example
 * ```ts
 * configureLogger({ verbose: true, timestamps: true })
 * ```
 */
export function configureLogger(options) {
    globalOptions = { ...globalOptions, ...options };
    if (options.verbose) {
        globalLogLevel = LogLevel.DEBUG;
    }
}
/**
 * Set global log level
 *
 * @param level - Minimum log level to display
 */
export function setGlobalLogLevel(level) {
    globalLogLevel = level;
}
/**
 * Set request ID for distributed tracing
 *
 * @param id - Request ID or null to clear
 */
export function setRequestId(id) {
    requestId = id;
}
/**
 * Get current request ID
 */
export function getRequestId() {
    return requestId;
}
/**
 * Get current timestamp string (HH:MM:SS)
 */
function getTimestamp() {
    return new Date().toISOString().split('T')[1]?.slice(0, 8) ?? '';
}
/**
 * Format log entry as JSON
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
 * Log icons for each level
 */
const LOG_ICONS = {
    debug: '🔍',
    info: 'ℹ',
    success: '✓',
    warn: '⚠',
    error: '✗',
};
/**
 * Create a namespaced logger instance
 *
 * @param namespace - Logger namespace (shown in output)
 * @param level - Initial log level (defaults to global level)
 * @returns Logger instance
 *
 * @example
 * ```ts
 * const logger = getLogger('api-client')
 * logger.info('Making request', { url: '/api/data' })
 * logger.error(new Error('Request failed'))
 * ```
 */
export function getLogger(namespace, level = globalLogLevel) {
    let instanceLevel = level;
    const shouldLog = (logLevel) => {
        if (globalOptions.silent)
            return false;
        return logLevel >= instanceLevel && logLevel >= globalLogLevel;
    };
    const formatPrefix = (icon) => {
        const parts = [];
        if (globalOptions.timestamps) {
            parts.push(`[${getTimestamp()}]`);
        }
        parts.push(`[${namespace}]`);
        parts.push(icon);
        if (requestId) {
            parts.push(`[${requestId.slice(0, 8)}]`);
        }
        return parts.join(' ');
    };
    const logMessage = (levelKey, logLevel, message, args, error) => {
        if (!shouldLog(logLevel))
            return;
        const entry = {
            timestamp: new Date().toISOString(),
            level: logLevel,
            namespace,
            message,
            data: args.length > 0 ? args : undefined,
            error,
        };
        const consoleFn = logLevel === LogLevel.ERROR
            ? console.error
            : logLevel === LogLevel.WARN
                ? console.warn
                : console.log;
        const isJsonMode = globalOptions.jsonOutput ||
            (typeof process !== 'undefined' && process.env?.JSON_LOGS);
        if (isJsonMode) {
            consoleFn(formatLogEntry(entry));
        }
        else {
            consoleFn(formatPrefix(LOG_ICONS[levelKey]), message, ...args);
            if (error?.stack &&
                (globalOptions.verbose || logLevel === LogLevel.ERROR)) {
                console.error(error.stack);
            }
        }
    };
    return {
        info: (message, ...args) => {
            logMessage('info', LogLevel.INFO, message, args);
        },
        warn: (message, ...args) => {
            logMessage('warn', LogLevel.WARN, message, args);
        },
        error: (message, ...args) => {
            const error = message instanceof Error ? message : undefined;
            const errorMessage = error
                ? error.message
                : typeof message === 'string'
                    ? message
                    : String(message);
            logMessage('error', LogLevel.ERROR, errorMessage, args, error);
        },
        success: (message, ...args) => {
            logMessage('success', LogLevel.INFO, message, args);
        },
        debug: (message, ...args) => {
            logMessage('debug', LogLevel.DEBUG, message, args);
        },
        setLevel: (level) => {
            instanceLevel = level;
        },
        getLevel: () => instanceLevel,
    };
}
// Create default logger instance
const defaultLogger = getLogger('app');
/**
 * Default logger instance - convenience export for simple usage
 */
export const logger = defaultLogger;
/**
 * Log an info message using the default logger
 */
export const info = (message, ...args) => defaultLogger.info(message, ...args);
/**
 * Log a warning using the default logger
 */
export const warn = (message, ...args) => defaultLogger.warn(message, ...args);
/**
 * Log an error using the default logger
 */
export const error = (message, ...args) => defaultLogger.error(message, ...args);
/**
 * Log a success message using the default logger
 */
export const success = (message, ...args) => defaultLogger.success(message, ...args);
/**
 * Log a debug message using the default logger
 */
export const debug = (message, ...args) => defaultLogger.debug(message, ...args);
//# sourceMappingURL=index.js.map