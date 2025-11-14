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
export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
export interface LogEntry {
    level: LogLevel;
    timestamp: Date;
    message: string;
    context?: Record<string, any>;
    duration?: number;
    stack?: string;
}
export interface LoggerOptions {
    level?: LogLevel;
    prefix?: string;
    colors?: boolean;
    timestamps?: boolean;
    context?: Record<string, any>;
}
export declare class Logger {
    private level;
    private prefix;
    private colors;
    private timestamps;
    private context;
    private timers;
    private logs;
    constructor(options?: LoggerOptions);
    /**
     * Log at trace level
     */
    trace(message: string, context?: Record<string, any>): void;
    /**
     * Log at debug level
     */
    debug(message: string, context?: Record<string, any>): void;
    /**
     * Log at info level
     */
    info(message: string, context?: Record<string, any>): void;
    /**
     * Log at warn level
     */
    warn(message: string, context?: Record<string, any>): void;
    /**
     * Log at error level
     */
    error(message: string, error?: Error | Record<string, any>): void;
    /**
     * Start a timer for performance measurement
     */
    time(label: string): void;
    /**
     * End a timer and log the duration
     */
    timeEnd(label: string, level?: LogLevel): number;
    /**
     * Log a group of related messages
     */
    group(title: string, fn: () => void): void;
    /**
     * Create a child logger with additional context
     */
    child(context: Record<string, any>): Logger;
    /**
     * Set log level
     */
    setLevel(level: LogLevel): void;
    /**
     * Get all log entries
     */
    getLogs(): LogEntry[];
    /**
     * Get logs by level
     */
    getLogsByLevel(level: LogLevel): LogEntry[];
    /**
     * Clear all logs
     */
    clear(): void;
    /**
     * Export logs as JSON
     */
    exportLogs(): string;
    /**
     * Core logging method
     */
    private log;
    /**
     * Format log entry for output
     */
    private format;
    /**
     * Format context object
     */
    private formatContext;
    /**
     * Apply color to text
     */
    private colorize;
}
/**
 * Create a new logger instance
 */
export declare function createLogger(options?: LoggerOptions): Logger;
/**
 * Get the default logger instance
 */
export declare function getLogger(): Logger;
/**
 * Convenience functions using default logger
 */
export declare const trace: (message: string, context?: Record<string, any>) => void;
export declare const debug: (message: string, context?: Record<string, any>) => void;
export declare const info: (message: string, context?: Record<string, any>) => void;
export declare const warn: (message: string, context?: Record<string, any>) => void;
export declare const error: (message: string, err?: Error | Record<string, any>) => void;
export declare const time: (label: string) => void;
export declare const timeEnd: (label: string, level?: LogLevel) => number;
//# sourceMappingURL=logger.d.ts.map