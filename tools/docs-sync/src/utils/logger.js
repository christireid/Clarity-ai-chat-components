/**
 * Logger and Progress Indicator Utilities
 *
 * Provides consistent logging, progress bars, and spinners for CLI operations
 */
import pc from 'picocolors';
import ora, {} from 'ora';
const DEFAULT_OPTIONS = {
    verbose: false,
    silent: false,
    timestamps: true,
};
let globalOptions = { ...DEFAULT_OPTIONS };
let currentSpinner = null;
/** Configure global logger options */
export function configureLogger(options) {
    globalOptions = { ...globalOptions, ...options };
}
/** Get current timestamp string */
function getTimestamp() {
    return new Date().toISOString().split('T')[1]?.slice(0, 8) ?? '';
}
/** Format a log message */
function formatMessage(message, level) {
    const timestamp = globalOptions.timestamps ? `[${getTimestamp()}] ` : '';
    const icons = {
        debug: '🔍',
        info: 'ℹ',
        success: '✓',
        warn: '⚠',
        error: '✗',
    };
    const colors = {
        debug: pc.gray,
        info: pc.blue,
        success: pc.green,
        warn: pc.yellow,
        error: pc.red,
    };
    const icon = icons[level];
    const color = colors[level];
    return color(`${timestamp}${icon} ${message}`);
}
/** Log a message */
export function log(message, level = 'info') {
    if (globalOptions.silent)
        return;
    if (level === 'debug' && !globalOptions.verbose)
        return;
    // Stop spinner temporarily if active
    if (currentSpinner) {
        currentSpinner.stop();
    }
    console.log(formatMessage(message, level));
    // Resume spinner if it was active
    if (currentSpinner) {
        currentSpinner.start();
    }
}
/** Log debug message (only in verbose mode) */
export function debug(message) {
    log(message, 'debug');
}
/** Log info message */
export function info(message) {
    log(message, 'info');
}
/** Log success message */
export function success(message) {
    log(message, 'success');
}
/** Log warning message */
export function warn(message) {
    log(message, 'warn');
}
/** Log error message */
export function error(message) {
    log(message, 'error');
}
/** Create a spinner for long-running operations */
export function startSpinner(text) {
    if (globalOptions.silent) {
        return ora({ text, isSilent: true });
    }
    // Stop any existing spinner
    if (currentSpinner) {
        currentSpinner.stop();
    }
    currentSpinner = ora({
        text,
        color: 'cyan',
        spinner: 'dots',
    }).start();
    return currentSpinner;
}
/** Update spinner text */
export function updateSpinner(text) {
    if (currentSpinner) {
        currentSpinner.text = text;
    }
}
/** Stop spinner with success */
export function succeedSpinner(text) {
    if (currentSpinner) {
        currentSpinner.succeed(text);
        currentSpinner = null;
    }
}
/** Stop spinner with failure */
export function failSpinner(text) {
    if (currentSpinner) {
        currentSpinner.fail(text);
        currentSpinner = null;
    }
}
/** Stop spinner with warning */
export function warnSpinner(text) {
    if (currentSpinner) {
        currentSpinner.warn(text);
        currentSpinner = null;
    }
}
/** Stop spinner without status */
export function stopSpinner() {
    if (currentSpinner) {
        currentSpinner.stop();
        currentSpinner = null;
    }
}
/** Progress tracker for multi-step operations */
export class ProgressTracker {
    total;
    current;
    startTime;
    label;
    spinner = null;
    constructor(total, label) {
        this.total = total;
        this.current = 0;
        this.label = label;
        this.startTime = Date.now();
    }
    /** Start tracking progress */
    start() {
        if (!globalOptions.silent) {
            this.spinner = startSpinner(`${this.label} (0/${this.total})`);
        }
    }
    /** Increment progress */
    increment(itemName) {
        this.current++;
        const percent = Math.round((this.current / this.total) * 100);
        const text = itemName
            ? `${this.label} (${this.current}/${this.total}) - ${itemName}`
            : `${this.label} (${this.current}/${this.total}) ${percent}%`;
        if (this.spinner) {
            this.spinner.text = text;
        }
    }
    /** Complete progress tracking */
    complete(message) {
        const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
        const finalMessage = message ?? `${this.label} completed (${this.total} items in ${duration}s)`;
        if (this.spinner) {
            this.spinner.succeed(finalMessage);
            this.spinner = null;
            currentSpinner = null;
        }
    }
    /** Fail progress tracking */
    fail(message) {
        const finalMessage = message ?? `${this.label} failed at ${this.current}/${this.total}`;
        if (this.spinner) {
            this.spinner.fail(finalMessage);
            this.spinner = null;
            currentSpinner = null;
        }
    }
    /** Get elapsed time in seconds */
    getElapsedTime() {
        return (Date.now() - this.startTime) / 1000;
    }
    /** Get current progress */
    getProgress() {
        return {
            current: this.current,
            total: this.total,
            percent: Math.round((this.current / this.total) * 100),
        };
    }
}
/** Create a summary box for output */
export function printSummary(title, items) {
    if (globalOptions.silent)
        return;
    const width = 50;
    const line = '═'.repeat(width);
    console.log('');
    console.log(line);
    console.log(pc.bold(title));
    console.log(line);
    for (const item of items) {
        const colorFn = item.color ? pc[item.color] : (s) => s;
        console.log(`${item.label}: ${colorFn(String(item.value))}`);
    }
    console.log(line);
}
/** Format duration for display */
export function formatDuration(ms) {
    if (ms < 1000) {
        return `${ms}ms`;
    }
    if (ms < 60000) {
        return `${(ms / 1000).toFixed(2)}s`;
    }
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}
/** Format file size for display */
export function formatSize(bytes) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
//# sourceMappingURL=logger.js.map