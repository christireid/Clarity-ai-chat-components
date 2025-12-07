/**
 * Enhanced logger with multiple levels and formatting
 *
 * Provides:
 * - Multiple log levels (trace, debug, info, warn, error)
 * - Colored output for terminal
 * - Structured logging with context
 * - Performance timing
 * - Log filtering
 */
import { infoBox } from '../ui/box';
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
    error: '\x1b[31m' // Red
};
const LEVEL_ICONS = {
    trace: '🔍',
    debug: '🐛',
    info: 'ℹ️',
    warn: '⚠️',
    error: '❌'
};
const RESET_COLOR = '\x1b[0m';
export class Logger {
    level;
    prefix;
    colors;
    timestamps;
    context;
    timers = new Map();
    logs = [];
    constructor(options = {}) {
        this.level = options.level || 'info';
        this.prefix = options.prefix || '';
        this.colors = options.colors ?? process.stdout.isTTY;
        this.timestamps = options.timestamps ?? true;
        this.context = options.context || {};
    }
    /**
     * Log at trace level
     */
    trace(message, context) {
        this.log('trace', message, context);
    }
    /**
     * Log at debug level
     */
    debug(message, context) {
        this.log('debug', message, context);
    }
    /**
     * Log at info level
     */
    info(message, context) {
        this.log('info', message, context);
    }
    /**
     * Log at warn level
     */
    warn(message, context) {
        this.log('warn', message, context);
    }
    /**
     * Log at error level
     */
    error(message, error) {
        const context = error instanceof Error
            ? { error: error.message, stack: error.stack }
            : error;
        this.log('error', message, context);
    }
    /**
     * Start a timer for performance measurement
     */
    time(label) {
        this.timers.set(label, performance.now());
    }
    /**
     * End a timer and log the duration
     */
    timeEnd(label, level = 'debug') {
        const startTime = this.timers.get(label);
        if (!startTime) {
            this.warn(`Timer "${label}" does not exist`);
            return 0;
        }
        const duration = performance.now() - startTime;
        this.timers.delete(label);
        this.log(level, `${label} completed`, { duration: `${duration.toFixed(2)}ms` });
        return duration;
    }
    /**
     * Log a group of related messages with beautiful formatting
     */
    group(title, fn) {
        const messages = [];
        const originalLog = this.log.bind(this);
        // Create a wrapper that captures messages
        const groupLog = (level, message, context) => {
            messages.push(message);
            originalLog(level, message, context);
        };
        // Temporarily replace the log method
        const savedLog = this.log;
        this.log = groupLog;
        try {
            fn();
        }
        finally {
            // Restore original log method
            ;
            this.log = savedLog;
            // Display group summary
            const groupContent = messages.length > 0
                ? messages.map((msg, i) => `${i + 1}. ${msg}`).join('\n')
                : 'No messages';
            console.log();
            console.log(infoBox(groupContent, `📦 ${title}`));
            console.log();
        }
    }
    /**
     * Create a child logger with additional context
     */
    child(context) {
        return new Logger({
            level: this.level,
            prefix: this.prefix,
            colors: this.colors,
            timestamps: this.timestamps,
            context: { ...this.context, ...context }
        });
    }
    /**
     * Set log level
     */
    setLevel(level) {
        this.level = level;
    }
    /**
     * Get all log entries
     */
    getLogs() {
        return [...this.logs];
    }
    /**
     * Get logs by level
     */
    getLogsByLevel(level) {
        return this.logs.filter(log => log.level === level);
    }
    /**
     * Clear all logs
     */
    clear() {
        this.logs = [];
    }
    /**
     * Export logs as JSON with beautiful summary
     */
    exportLogs() {
        const summary = {
            'Total Logs': chalk.cyan(this.logs.length.toString()),
            'Trace': chalk.gray(this.getLogsByLevel('trace').length.toString()),
            'Debug': chalk.cyan(this.getLogsByLevel('debug').length.toString()),
            'Info': chalk.green(this.getLogsByLevel('info').length.toString()),
            'Warn': chalk.yellow(this.getLogsByLevel('warn').length.toString()),
            'Error': chalk.red(this.getLogsByLevel('error').length.toString()),
        };
        console.log();
        console.log(infoBox(keyValueTable(summary), '📋 Log Summary'));
        console.log();
        return JSON.stringify(this.logs, null, 2);
    }
    /**
     * Core logging method
     */
    log(level, message, context) {
        // Check if this level should be logged
        if (LOG_LEVELS[level] < LOG_LEVELS[this.level]) {
            return;
        }
        const entry = {
            level,
            timestamp: new Date(),
            message,
            context: { ...this.context, ...context }
        };
        // Store log entry
        this.logs.push(entry);
        // Format and output
        const formatted = this.format(entry);
        const output = level === 'error' ? console.error : console.log;
        output(formatted);
    }
    /**
     * Format log entry for output with enhanced formatting
     */
    format(entry) {
        const parts = [];
        // Timestamp
        if (this.timestamps) {
            const time = entry.timestamp.toISOString().split('T')[1].slice(0, -1);
            parts.push(this.colorize(`[${time}]`, 'trace'));
        }
        // Level icon and name with better spacing
        const icon = LEVEL_ICONS[entry.level];
        const levelText = entry.level.toUpperCase().padEnd(5);
        parts.push(this.colorize(`${icon} ${levelText}`, entry.level));
        // Prefix
        if (this.prefix) {
            parts.push(this.prefix);
        }
        // Message with enhanced colorization
        const messageColor = this.colors
            ? (entry.level === 'error' ? chalk.red
                : entry.level === 'warn' ? chalk.yellow
                    : entry.level === 'info' ? chalk.green
                        : entry.level === 'debug' ? chalk.cyan
                            : chalk.gray)
            : (text) => text;
        parts.push(messageColor(entry.message));
        // Context with better formatting
        if (entry.context && Object.keys(entry.context).length > 0) {
            const contextStr = this.formatContext(entry.context);
            parts.push(this.colorize(`  ${contextStr}`, 'trace'));
        }
        return parts.join(' ');
    }
    /**
     * Format context object
     */
    formatContext(context) {
        const entries = Object.entries(context).map(([key, value]) => {
            if (typeof value === 'object') {
                return `${key}=${JSON.stringify(value)}`;
            }
            return `${key}=${value}`;
        });
        return `{${entries.join(', ')}}`;
    }
    /**
     * Apply color to text
     */
    colorize(text, level) {
        if (!this.colors)
            return text;
        return `${LEVEL_COLORS[level]}${text}${RESET_COLOR}`;
    }
}
/**
 * Create a new logger instance
 */
export function createLogger(options) {
    return new Logger(options);
}
// Default logger instance
let defaultLogger = null;
/**
 * Get the default logger instance
 */
export function getLogger() {
    if (!defaultLogger) {
        defaultLogger = new Logger({
            level: process.env.LOG_LEVEL || 'info'
        });
    }
    return defaultLogger;
}
/**
 * Convenience functions using default logger
 */
export const trace = (message, context) => getLogger().trace(message, context);
export const debug = (message, context) => getLogger().debug(message, context);
export const info = (message, context) => getLogger().info(message, context);
export const warn = (message, context) => getLogger().warn(message, context);
export const error = (message, err) => getLogger().error(message, err);
export const time = (label) => getLogger().time(label);
export const timeEnd = (label, level) => getLogger().timeEnd(label, level);
//# sourceMappingURL=logger.js.map