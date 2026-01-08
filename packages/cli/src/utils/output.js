/**
 * Output formatting utilities
 * Supports multiple output modes: human-readable, JSON, quiet, verbose
 */
import pc from 'picocolors';
import { getLogger } from './logger.js';
const logger = getLogger('output');
export var OutputMode;
(function (OutputMode) {
    OutputMode["HUMAN"] = "human";
    OutputMode["JSON"] = "json";
    OutputMode["QUIET"] = "quiet";
    OutputMode["VERBOSE"] = "verbose";
})(OutputMode || (OutputMode = {}));
let currentMode = OutputMode.HUMAN;
let isQuiet = false;
let isVerbose = false;
let isJson = false;
/**
 * Initialize output mode from environment or flags
 */
export function initOutputMode(options) {
    isJson = options.json || false;
    isQuiet = options.quiet || false;
    isVerbose = options.verbose || false;
    if (isJson) {
        currentMode = OutputMode.JSON;
    }
    else if (isQuiet) {
        currentMode = OutputMode.QUIET;
    }
    else if (isVerbose) {
        currentMode = OutputMode.VERBOSE;
    }
    else {
        currentMode = OutputMode.HUMAN;
    }
}
/**
 * Check if output should be suppressed
 */
export function shouldOutput(level = 'info') {
    if (isQuiet && level !== 'error')
        return false;
    if (level === 'debug' && !isVerbose && !process.env.DEBUG)
        return false;
    return true;
}
/**
 * Output formatted message
 */
export function output(message, level = 'info') {
    if (!shouldOutput(level))
        return;
    if (isJson) {
        const json = {
            level,
            message,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(json));
        return;
    }
    const colors = {
        info: pc.blue,
        warn: pc.yellow,
        error: pc.red,
        debug: pc.magenta,
    };
    const icons = {
        info: 'ℹ',
        warn: '⚠',
        error: '✖',
        debug: '🐛',
    };
    const color = colors[level] || pc.white;
    const icon = icons[level] || '•';
    console.log(color(`${icon} ${message}`));
}
/**
 * Output JSON data
 */
export function outputJson(data) {
    if (isJson || currentMode === OutputMode.JSON) {
        console.log(JSON.stringify(data, null, 2));
    }
    else {
        // Format as table or list for human-readable
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                console.log(pc.cyan(`${index + 1}.`), item);
            });
        }
        else if (typeof data === 'object') {
            Object.entries(data).forEach(([key, value]) => {
                console.log(pc.cyan(`${key}:`), value);
            });
        }
        else {
            console.log(data);
        }
    }
}
/**
 * Output table
 */
export function outputTable(headers, rows, options = {}) {
    if (isJson) {
        const data = rows.map((row) => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
        outputJson(data);
        return;
    }
    // Simple table formatting
    const maxWidths = headers.map((header, i) => {
        const headerWidth = header.length;
        const maxRowWidth = Math.max(...rows.map((row) => String(row[i] || '').length));
        return Math.max(headerWidth, maxRowWidth);
    });
    // Header
    const headerRow = headers
        .map((header, i) => pc.bold(pc.cyan(header.padEnd(maxWidths[i]))))
        .join(' | ');
    if (options.border) {
        console.log(pc.gray('─'.repeat(headerRow.length)));
    }
    console.log(headerRow);
    if (options.border) {
        console.log(pc.gray('─'.repeat(headerRow.length)));
    }
    // Rows
    rows.forEach((row) => {
        const rowStr = row
            .map((cell, i) => String(cell || '').padEnd(maxWidths[i]))
            .join(' | ');
        console.log(rowStr);
    });
    if (options.border) {
        console.log(pc.gray('─'.repeat(headerRow.length)));
    }
}
/**
 * Output success message
 */
export function success(message) {
    if (!shouldOutput('info'))
        return;
    if (isJson) {
        const json = {
            level: 'success',
            message,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(json));
        return;
    }
    console.log(pc.green(`✔ ${message}`));
}
/**
 * Output info message
 */
export function info(message) {
    output(message, 'info');
}
/**
 * Output warning message
 */
export function warn(message) {
    output(message, 'warn');
}
/**
 * Output error message
 */
export function error(message) {
    output(message, 'error');
}
/**
 * Output debug message
 */
export function debug(message, data) {
    if (shouldOutput('debug')) {
        if (isJson) {
            outputJson({ level: 'debug', message, data });
        }
        else {
            console.log(message, data);
        }
    }
}
//# sourceMappingURL=output.js.map