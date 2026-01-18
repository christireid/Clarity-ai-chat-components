/**
 * Formatting Utilities
 *
 * Consistent formatting functions for bytes, duration, numbers, and percentages.
 * These are the canonical implementations used across all Clarity Chat packages.
 *
 * @module @clarity-chat/utils/format
 *
 * @example
 * ```ts
 * import { formatBytes, formatDuration, formatNumber } from '@clarity-chat/utils/format'
 *
 * formatBytes(1536) // "1.5 KB"
 * formatDuration(90000) // "1m 30s"
 * formatNumber(1234567) // "1,234,567"
 * ```
 */
/**
 * Format bytes to human-readable string
 *
 * @param bytes - Number of bytes to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Human-readable string (e.g., "1.5 KB", "2.3 MB")
 *
 * @example
 * ```ts
 * formatBytes(1024) // "1 KB"
 * formatBytes(1536) // "1.5 KB"
 * formatBytes(0) // "0 B"
 * formatBytes(1024 * 1024 * 2.5) // "2.5 MB"
 * ```
 */
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}
/**
 * Alias for formatBytes for convenience
 *
 * @param bytes - Number of bytes to format
 * @returns Human-readable string
 *
 * @example
 * ```ts
 * formatSize(1536) // "1.5 KB"
 * ```
 */
export const formatSize = formatBytes;
/**
 * Format a numeric delta with arrow indicator
 *
 * @param current - Current value
 * @param previous - Previous value to compare against
 * @param unit - Optional unit suffix
 * @returns Formatted string with delta indicator (e.g., "100 (↑ +10)")
 *
 * @example
 * ```ts
 * formatDelta(110, 100) // "110 (↑ +10)"
 * formatDelta(90, 100) // "90 (↓ -10)"
 * formatDelta(100, 100) // "100 (no change)"
 * formatDelta(110, 100, ' items') // "110 items (↑ +10)"
 * ```
 */
export function formatDelta(current, previous, unit = '') {
    const delta = current - previous;
    if (delta === 0)
        return `${current.toLocaleString()}${unit} (no change)`;
    const arrow = delta > 0 ? '↑' : '↓';
    const sign = delta > 0 ? '+' : '';
    return `${current.toLocaleString()}${unit} (${arrow} ${sign}${delta.toLocaleString()})`;
}
/**
 * Format duration in milliseconds to human-readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Human-readable duration (e.g., "1.5s", "250ms", "2m 30s")
 *
 * @example
 * ```ts
 * formatDuration(500) // "500ms"
 * formatDuration(1500) // "1.5s"
 * formatDuration(90000) // "1m 30s"
 * formatDuration(3600000) // "60m 0s"
 * ```
 */
export function formatDuration(ms) {
    if (ms < 1000)
        return `${ms}ms`;
    if (ms < 60000)
        return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.round((ms % 60000) / 1000);
    if (seconds === 0)
        return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
}
/**
 * Format a number with locale-aware separators
 *
 * @param num - Number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234.5678, { maximumFractionDigits: 2 }) // "1,234.57"
 * formatNumber(0.5, { style: 'percent' }) // "50%"
 * ```
 */
export function formatNumber(num, options) {
    return num.toLocaleString(undefined, options);
}
/**
 * Format a percentage value
 *
 * @param value - Value (0-100 or 0-1 depending on isDecimal)
 * @param decimals - Number of decimal places (default: 1)
 * @param isDecimal - If true, treats value as 0-1 range (default: false)
 * @returns Formatted percentage string
 *
 * @example
 * ```ts
 * formatPercent(75.5) // "75.5%"
 * formatPercent(0.755, 1, true) // "75.5%"
 * formatPercent(100, 0) // "100%"
 * ```
 */
export function formatPercent(value, decimals = 1, isDecimal = false) {
    const pct = isDecimal ? value * 100 : value;
    return `${pct.toFixed(decimals)}%`;
}
/**
 * Format a date relative to now (e.g., "2 hours ago", "in 3 days")
 *
 * @param date - Date to format
 * @param now - Reference date (defaults to current time)
 * @returns Human-readable relative time string
 *
 * @example
 * ```ts
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() + 86400000)) // "in 1 day"
 * ```
 */
export function formatRelativeTime(date, now = new Date()) {
    const diffMs = date.getTime() - now.getTime();
    const absDiffMs = Math.abs(diffMs);
    const isFuture = diffMs > 0;
    const seconds = Math.floor(absDiffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    let value;
    let unit;
    if (days > 0) {
        value = days;
        unit = days === 1 ? 'day' : 'days';
    }
    else if (hours > 0) {
        value = hours;
        unit = hours === 1 ? 'hour' : 'hours';
    }
    else if (minutes > 0) {
        value = minutes;
        unit = minutes === 1 ? 'minute' : 'minutes';
    }
    else {
        value = seconds;
        unit = seconds === 1 ? 'second' : 'seconds';
    }
    return isFuture ? `in ${value} ${unit}` : `${value} ${unit} ago`;
}
/**
 * Truncate a string to a maximum length with ellipsis
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length including ellipsis
 * @param ellipsis - Ellipsis string (default: "...")
 * @returns Truncated string
 *
 * @example
 * ```ts
 * truncate("Hello World", 8) // "Hello..."
 * truncate("Hi", 10) // "Hi"
 * truncate("Hello World", 8, "…") // "Hello W…"
 * ```
 */
export function truncate(str, maxLength, ellipsis = '...') {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}
//# sourceMappingURL=index.js.map