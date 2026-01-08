/**
 * Logger and Progress Indicator Utilities
 *
 * Provides consistent logging, progress bars, and spinners for CLI operations
 */
import { type Ora } from 'ora';
export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error';
interface LoggerOptions {
    verbose?: boolean;
    silent?: boolean;
    timestamps?: boolean;
}
/** Configure global logger options */
export declare function configureLogger(options: Partial<LoggerOptions>): void;
/** Log a message */
export declare function log(message: string, level?: LogLevel): void;
/** Log debug message (only in verbose mode) */
export declare function debug(message: string): void;
/** Log info message */
export declare function info(message: string): void;
/** Log success message */
export declare function success(message: string): void;
/** Log warning message */
export declare function warn(message: string): void;
/** Log error message */
export declare function error(message: string): void;
/** Create a spinner for long-running operations */
export declare function startSpinner(text: string): Ora;
/** Update spinner text */
export declare function updateSpinner(text: string): void;
/** Stop spinner with success */
export declare function succeedSpinner(text?: string): void;
/** Stop spinner with failure */
export declare function failSpinner(text?: string): void;
/** Stop spinner with warning */
export declare function warnSpinner(text?: string): void;
/** Stop spinner without status */
export declare function stopSpinner(): void;
/** Progress tracker for multi-step operations */
export declare class ProgressTracker {
    private total;
    private current;
    private startTime;
    private label;
    private spinner;
    constructor(total: number, label: string);
    /** Start tracking progress */
    start(): void;
    /** Increment progress */
    increment(itemName?: string): void;
    /** Complete progress tracking */
    complete(message?: string): void;
    /** Fail progress tracking */
    fail(message?: string): void;
    /** Get elapsed time in seconds */
    getElapsedTime(): number;
    /** Get current progress */
    getProgress(): {
        current: number;
        total: number;
        percent: number;
    };
}
/** Create a summary box for output */
export declare function printSummary(title: string, items: Array<{
    label: string;
    value: string | number;
    color?: 'green' | 'yellow' | 'red' | 'blue';
}>): void;
/** Format duration for display */
export declare function formatDuration(ms: number): string;
/** Format file size for display */
export declare function formatSize(bytes: number): string;
export {};
//# sourceMappingURL=logger.d.ts.map