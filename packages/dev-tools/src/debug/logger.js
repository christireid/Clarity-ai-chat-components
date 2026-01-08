/**
 * Enhanced logger with multiple levels and formatting
 *
 * Provides:
 * - Multiple log levels (trace, debug, info, warn, error)
 * - Colored output for terminal
 * - Structured logging with context
 * - Performance timing
 * - Log filtering
 *
 */
import { infoBox, warningBox, errorBox, successBox } from '../ui/box';
import { keyValueTable } from '../ui/table';
import chalk from 'chalk';
const LOG_LEVELS = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};
const LEVEL_COLORS = {
    trace: '\x1b[90m', // Gray
    debug: '\x1b[36m', // Cyan
    info: '\x1b[32m', // Green
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
};
const ICONS = {
    trace: '🔍',
    debug: '🐛',
    info: 'ℹ',
    warn: '⚠',
    error: '✗',
};
let globalLogLevel = 'info';
let globalContext = {};
// Map our log levels (already string-compatible)
const mapToUtilsLevel = (level) => {
    switch (level) {
        case 'trace':
        case 'debug':
            return 'debug';
        case 'info':
            return 'info';
        case 'warn':
            return 'warn';
        case 'error':
            return 'error';
        default:
            return 'info';
    }
};
// Compatibility wrapper for legacy code
export class Logger {
    namespace;
    level;
    colors;
    timestamps;
    context;
    constructor(namespace = 'app', options = {}) {
        this.namespace = namespace;
        this.level = options.level || globalLogLevel;
        this.colors = options.colors ?? true;
        this.timestamps = options.timestamps ?? true;
        this.context = { ...globalContext, ...options.context };
    }
    shouldLog(level) {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
    }
    formatPrefix(level) {
        const parts = [];
        if (this.timestamps) {
            parts.push(chalk.gray(`[${new Date().toISOString()}]`));
        }
        parts.push(chalk.gray(`[${this.namespace}]`));
        if (this.colors) {
            parts.push(`${LEVEL_COLORS[level]}${ICONS[level]}\x1b[0m`);
        }
        else {
            parts.push(`[${level.toUpperCase()}]`);
        }
        return parts.join(' ');
    }
    log(level, message, context) {
        if (!this.shouldLog(level))
            return;
        const logContext = { ...this.context, ...context };
        const fullMessage = this.formatPrefix(level) + ' ' + message;
        switch (level) {
            case 'trace':
            case 'debug':
                console.debug(fullMessage, logContext);
                break;
            case 'info':
                console.info(fullMessage, logContext);
                break;
            case 'warn':
                console.warn(fullMessage, logContext);
                break;
            case 'error':
                console.error(fullMessage, logContext);
                break;
        }
    }
    trace(message, context) {
        this.log('trace', message, context);
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, context) {
        this.log('error', message, context);
    }
    setLevel(level) {
        this.level = level;
    }
    getLevel() {
        return this.level;
    }
    // Performance timing
    time(label) {
        console.time(label);
    }
    timeEnd(label) {
        console.timeEnd(label);
    }
    // Group logging
    group(label) {
        console.group(label);
    }
    groupEnd() {
        console.groupEnd();
    }
    // Log filtering
    filter(predicate) {
        // This is a no-op for compatibility - the new logger doesn't support filtering
        console.warn('Log filtering is not supported in the new logger');
    }
    // Get all logs
    getLogs(level) {
        // This is a no-op for compatibility - the new logger doesn't support log retrieval
        console.warn('Log retrieval is not supported in the new logger');
        return [];
    }
    // Export logs
    exportLogs(options) {
        // This is a no-op for compatibility
        console.warn('Log export is not supported in the new logger');
    }
}
// Factory functions for backward compatibility
export function createLogger(options = {}) {
    return new Logger('app', options);
}
export function getLogger(namespace = 'app') {
    return new Logger(namespace);
}
// Global configuration
export function setGlobalLogLevel(level) {
    globalLogLevel = level;
}
export function setGlobalContext(context) {
    globalContext = context;
}
// UI helpers
export function logInfoBox(message, context) {
    console.info(message, context);
    if (context) {
        console.log(infoBox(message, JSON.stringify(context)));
    }
}
export function logWarningBox(message, context) {
    console.warn(message, context);
    console.log(warningBox(message, context ? JSON.stringify(context) : undefined));
}
export function logErrorBox(message, context) {
    console.error(message, context);
    console.log(errorBox(message, context ? JSON.stringify(context) : undefined));
}
export function logSuccessBox(message, context) {
    console.info(message, context);
    console.log(successBox(message, context ? JSON.stringify(context) : undefined));
}
export function logKeyValue(data, title) {
    console.info(title || 'Key-Value Data', data);
    console.log(keyValueTable(data));
}
// Re-export the standard utils logger for new code
export default {
    Logger,
    createLogger,
    getLogger,
    setGlobalLogLevel,
    setGlobalContext,
};
//# sourceMappingURL=logger.js.map