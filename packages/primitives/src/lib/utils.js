/**
 * Enhanced Primitives Utilities
 * Extended utilities for enterprise features while maintaining backward compatibility
 */
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
/**
 * Utility function to merge Tailwind CSS classes
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
/**
 * Format date to relative time (e.g., "2 hours ago")
 * Accepts Date objects, ISO strings, or timestamps
 */
export function formatRelativeTime(date) {
    if (!date)
        return '';
    // Convert to Date if needed
    let dateObj;
    if (date instanceof Date) {
        dateObj = date;
    }
    else if (typeof date === 'string' || typeof date === 'number') {
        dateObj = new Date(date);
    }
    else {
        return '';
    }
    // Check for invalid date
    if (isNaN(dateObj.getTime())) {
        return '';
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    if (diffInSeconds < 60)
        return 'just now';
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return dateObj.toLocaleDateString();
}
/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback for older browsers or non-secure contexts
        if (typeof document !== 'undefined') {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand ? document.execCommand('copy') : false;
            document.body.removeChild(textarea);
            return success;
        }
        return false;
    }
    catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
/**
 * Generate unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength - 3) + '...';
}
/**
 * Format file size
 * Enhanced version with better precision and consistency
 */
export function formatFileSize(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
/**
 * Format bytes to human readable string
 * Alias for formatFileSize for consistency across codebase
 */
export function formatBytes(bytes) {
    return formatFileSize(bytes);
}
/**
 * Format timestamp to ISO string
 */
export function formatTimestamp(date) {
    return date.toISOString();
}
/**
 * Calculate percentage
 */
export function calculatePercentage(part, total, decimals = 2) {
    if (total === 0)
        return 0;
    return parseFloat(((part / total) * 100).toFixed(decimals));
}
/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Debounce function
 */
export function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(prefix, extension) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}-${timestamp}.${extension}`;
}
/**
 * Parse file size string (e.g., "1.5 MB") to bytes
 */
export function parseFileSize(sizeStr) {
    const units = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
        TB: 1024 * 1024 * 1024 * 1024
    };
    const match = sizeStr.trim().match(/^(\d+(?:\.\d+)?)\s*([KMGT]?B)$/i);
    if (!match)
        throw new Error(`Invalid file size format: ${sizeStr}`);
    const size = match[1];
    const unit = match[2];
    if (!size || !unit)
        throw new Error(`Invalid file size format: ${sizeStr}`);
    return parseFloat(size) * units[unit.toUpperCase()];
}
/**
 * Deep merge objects
 */
export function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        const sourceValue = source[key];
        if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
            const targetValue = result[key];
            result[key] = deepMerge(targetValue ?? {}, sourceValue);
        }
        else {
            result[key] = sourceValue;
        }
    }
    return result;
}
/**
 * Validate configuration against schema
 */
export function validateConfig(config, schema) {
    try {
        return schema.validate(config);
    }
    catch (error) {
        throw new Error(`Configuration validation failed: ${error}`);
    }
}
/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 */
export function isEmpty(value) {
    if (value == null)
        return true;
    if (typeof value === 'string')
        return value.trim() === '';
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
}
/**
 * Get file extension from filename
 */
export function getFileExtension(filename) {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}
/**
 * Check if running in browser environment
 */
export function isBrowser() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}
/**
 * Check if running in Node.js environment
 */
export function isNode() {
    // Check for Node.js environment without relying on @types/node
    return (typeof globalThis !== 'undefined' &&
        typeof globalThis.process?.versions?.node === 'string');
}
/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse(jsonString, fallback) {
    try {
        return JSON.parse(jsonString);
    }
    catch {
        return fallback;
    }
}
/**
 * Format number with commas
 */
export function formatNumber(num) {
    return num.toLocaleString();
}
/**
 * Generate random string
 */
export function randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
/**
 * Sleep/delay function
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry function with exponential backoff
 */
export async function retry(fn, retries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (i < retries - 1) {
                await sleep(delay * Math.pow(2, i));
            }
        }
    }
    throw lastError;
}
/**
 * Memoize function
 */
export function memoize(fn, keyFn) {
    const cache = new Map();
    return ((...args) => {
        const key = keyFn ? keyFn(...args) : JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    });
}
/**
 * Throttle function
 */
export function throttle(func, wait) {
    let timeout = null;
    let previous = 0;
    return ((...args) => {
        const now = Date.now();
        const remaining = wait - (now - previous);
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            return func(...args);
        }
        else if (!timeout) {
            timeout = setTimeout(() => {
                previous = Date.now();
                timeout = null;
                func(...args);
            }, remaining);
        }
    });
}
/**
 * Escape HTML special characters
 */
export function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}
/**
 * Unescape HTML special characters
 */
export function unescapeHtml(html) {
    const map = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return html.replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => map[m] ?? m);
}
/**
 * Convert string to kebab-case
 */
export function kebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/**
 * Convert string to camelCase
 */
export function camelCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
        .replace(/^(.)/, (char) => char.toLowerCase());
}
/**
 * Convert string to PascalCase
 */
export function pascalCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
        .replace(/^(.)/, (char) => char.toUpperCase());
}
/**
 * Convert string to snake_case
 */
export function snakeCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase();
}
/**
 * Check if string is valid JSON
 */
export function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Get nested object value safely
 */
export function getNestedValue(obj, path, defaultValue) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : defaultValue;
    }, obj);
}
/**
 * Set nested object value safely
 */
export function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;
    for (const key of keys) {
        if (!current[key] || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }
    current[lastKey] = value;
    return obj;
}
/**
 * Remove duplicates from array
 */
export function unique(array) {
    return [...new Set(array)];
}
/**
 * Remove duplicates from array by key
 */
export function uniqueBy(array, key) {
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}
/**
 * Group array items by key
 */
export function groupBy(array, key) {
    return array.reduce((groups, item) => {
        const group = String(item[key]);
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(item);
        return groups;
    }, {});
}
/**
 * Sort array by key
 */
export function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal)
            return order === 'asc' ? -1 : 1;
        if (aVal > bVal)
            return order === 'asc' ? 1 : -1;
        return 0;
    });
}
/**
 * Chunk array into smaller arrays
 */
export function chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}
/**
 * Flatten nested arrays
 */
export function flatten(array) {
    return array.reduce((flat, item) => {
        return flat.concat(Array.isArray(item) ? flatten(item) : item);
    }, []);
}
/**
 * Pick properties from object
 */
export function pick(obj, keys) {
    const result = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
/**
 * Omit properties from object
 */
export function omit(obj, keys) {
    const result = { ...obj };
    for (const key of keys) {
        delete result[key];
    }
    return result;
}
/**
 * Check if object has property
 */
export function hasProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
/**
 * Get object keys
 */
export function keys(obj) {
    return Object.keys(obj);
}
/**
 * Get object values
 */
export function values(obj) {
    return Object.values(obj);
}
/**
 * Get object entries
 */
export function entries(obj) {
    return Object.entries(obj);
}
/**
 * Check if value is object
 */
export function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
/**
 * Check if value is array
 */
export function isArray(value) {
    return Array.isArray(value);
}
/**
 * Check if value is string
 */
export function isString(value) {
    return typeof value === 'string';
}
/**
 * Check if value is number
 */
export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
}
/**
 * Check if value is boolean
 */
export function isBoolean(value) {
    return typeof value === 'boolean';
}
/**
 * Check if value is function
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function isFunction(value) {
    return typeof value === 'function';
}
/**
 * Check if value is null
 */
export function isNull(value) {
    return value === null;
}
/**
 * Check if value is undefined
 */
export function isUndefined(value) {
    return value === undefined;
}
/**
 * Check if value is null or undefined
 */
export function isNil(value) {
    return value == null;
}
/**
 * Check if value is truthy
 */
export function isTruthy(value) {
    return Boolean(value);
}
/**
 * Check if value is falsy
 */
export function isFalsy(value) {
    return !value;
}
/**
 * Check if value is not empty
 */
export function isNotEmpty(value) {
    return !isEmpty(value);
}
/**
 * Check if value is equal (deep comparison for objects)
 */
export function isEqual(a, b) {
    if (a === b)
        return true;
    if (a == null || b == null)
        return false;
    if (typeof a !== typeof b)
        return false;
    if (typeof a !== 'object')
        return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length)
        return false;
    for (const key of keysA) {
        if (!keysB.includes(key))
            return false;
        if (!isEqual(a[key], b[key]))
            return false;
    }
    return true;
}
/**
 * Check if value is not equal
 */
export function isNotEqual(a, b) {
    return !isEqual(a, b);
}
/**
 * Check if value is in range
 */
export function isInRange(value, min, max) {
    return value >= min && value <= max;
}
/**
 * Check if value is out of range
 */
export function isOutOfRange(value, min, max) {
    return !isInRange(value, min, max);
}
/**
 * Check if value is positive
 */
export function isPositive(value) {
    return value > 0;
}
/**
 * Check if value is negative
 */
export function isNegative(value) {
    return value < 0;
}
/**
 * Check if value is zero
 */
export function isZero(value) {
    return value === 0;
}
/**
 * Check if value is even
 */
export function isEven(value) {
    return value % 2 === 0;
}
/**
 * Check if value is odd
 */
export function isOdd(value) {
    return value % 2 !== 0;
}
/**
 * Check if value is finite
 */
export function isFinite(value) {
    return Number.isFinite(value);
}
/**
 * Check if value is infinite
 */
export function isInfinite(value) {
    return !Number.isFinite(value);
}
/**
 * Check if value is NaN
 */
export function isNaN(value) {
    return Number.isNaN(value);
}
/**
 * Check if value is not NaN
 */
export function isNotNaN(value) {
    return !Number.isNaN(value);
}
/**
 * Check if value is integer
 */
export function isInteger(value) {
    return Number.isInteger(value);
}
/**
 * Check if value is float
 */
export function isFloat(value) {
    return !Number.isInteger(value);
}
/**
 * Check if value is safe integer
 */
export function isSafeInteger(value) {
    return Number.isSafeInteger(value);
}
/**
 * Check if value is not safe integer
 */
export function isNotSafeInteger(value) {
    return !Number.isSafeInteger(value);
}
/**
 * Check if value is positive integer
 */
export function isPositiveInteger(value) {
    return isPositive(value) && isInteger(value);
}
/**
 * Check if value is negative integer
 */
export function isNegativeInteger(value) {
    return isNegative(value) && isInteger(value);
}
/**
 * Check if value is positive float
 */
export function isPositiveFloat(value) {
    return isPositive(value) && isFloat(value);
}
/**
 * Check if value is negative float
 */
export function isNegativeFloat(value) {
    return isNegative(value) && isFloat(value);
}
/**
 * Check if value is in array
 */
export function includes(array, value) {
    return array.includes(value);
}
/**
 * Check if value is not in array
 */
export function excludes(array, value) {
    return !array.includes(value);
}
/**
 * Find first match in array
 */
export function find(array, predicate) {
    return array.find(predicate);
}
/**
 * Find all matches in array
 */
export function filter(array, predicate) {
    return array.filter(predicate);
}
/**
 * Check if any item matches predicate
 */
export function some(array, predicate) {
    return array.some(predicate);
}
/**
 * Check if all items match predicate
 */
export function every(array, predicate) {
    return array.every(predicate);
}
/**
 * Check if array includes any of the values
 */
export function includesAny(array, values) {
    return values.some(value => array.includes(value));
}
/**
 * Check if array includes all of the values
 */
export function includesAll(array, values) {
    return values.every(value => array.includes(value));
}
/**
 * Check if array excludes all of the values
 */
export function excludesAll(array, values) {
    return values.every(value => !array.includes(value));
}
/**
 * Check if string includes substring
 */
export function includesSubstring(str, substring) {
    return str.includes(substring);
}
/**
 * Check if string excludes substring
 */
export function excludesSubstring(str, substring) {
    return !str.includes(substring);
}
/**
 * Check if string starts with substring
 */
export function startsWith(str, substring) {
    return str.startsWith(substring);
}
/**
 * Check if string ends with substring
 */
export function endsWith(str, substring) {
    return str.endsWith(substring);
}
/**
 * Check if string matches regex
 */
export function matches(str, regex) {
    return regex.test(str);
}
/**
 * Check if string does not match regex
 */
export function notMatches(str, regex) {
    return !regex.test(str);
}
/**
 * Check if string is email
 */
export function isEmail(str) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(str);
}
/**
 * Check if string is URL
 */
export function isUrl(str) {
    try {
        new URL(str);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Check if string is numeric
 */
export function isNumeric(str) {
    return !isNaN(Number(str));
}
/**
 * Check if string is alphabetic
 */
export function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}
/**
 * Check if string is alphanumeric
 */
export function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
/**
 * Check if string is hexadecimal
 */
export function isHexadecimal(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}
/**
 * Check if string is base64
 */
export function isBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(str) && str.length % 4 === 0;
}
/**
 * Check if string is JSON
 */
export function isJsonString(str) {
    try {
        JSON.parse(str);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Check if string is UUID
 */
export function isUuid(str) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
}
/**
 * Check if string is IP address
 */
export function isIpAddress(str) {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv4Regex.test(str) || ipv6Regex.test(str);
}
/**
 * Check if string is port number
 */
export function isPortNumber(str) {
    const port = Number(str);
    return isInteger(port) && port >= 1 && port <= 65535;
}
/**
 * Check if string is date
 */
export function isDateString(str) {
    return !isNaN(Date.parse(str));
}
/**
 * Check if string is time
 */
export function isTimeString(str) {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(str);
}
/**
 * Check if string is color
 */
export function isColorString(str) {
    const colorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$|^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$|^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$|^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$|^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/;
    return colorRegex.test(str);
}
/**
 * Check if string is CSS unit
 */
export function isCssUnit(str) {
    const cssUnitRegex = /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|vmin|vmax|ex|ch|cm|mm|in|pt|pc|fr)$/;
    return cssUnitRegex.test(str);
}
/**
 * Check if string is HTML tag
 */
export function isHtmlTag(str) {
    const htmlTags = [
        'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
    ];
    return htmlTags.includes(str.toLowerCase());
}
/**
 * Check if string is SVG tag
 */
export function isSvgTag(str) {
    const svgTags = [
        'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'text', 'tspan', 'tref', 'textPath', 'defs', 'clipPath', 'mask', 'pattern', 'image', 'switch', 'foreignObject', 'use', 'symbol', 'marker', 'linearGradient', 'radialGradient', 'stop', 'animate', 'animateMotion', 'animateTransform', 'set', 'metadata', 'title', 'desc'
    ];
    return svgTags.includes(str.toLowerCase());
}
/**
 * Check if string is MathML tag
 */
export function isMathmlTag(str) {
    const mathmlTags = [
        'math', 'maction', 'maligngroup', 'malignmark', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mlongdiv', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mscarries', 'mscarry', 'msgroup', 'msline', 'mspace', 'msqrt', 'msrow', 'mstack', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'semantics', 'annotation', 'annotation-xml'
    ];
    return mathmlTags.includes(str.toLowerCase());
}
/**
 * Check if string is ARIA attribute
 */
export function isAriaAttribute(str) {
    return str.startsWith('aria-');
}
/**
 * Check if string is data attribute
 */
export function isDataAttribute(str) {
    return str.startsWith('data-');
}
/**
 * Check if string is role attribute
 */
export function isRoleAttribute(str) {
    return str === 'role';
}
/**
 * Check if string is event attribute
 */
export function isEventAttribute(str) {
    return str.startsWith('on');
}
/**
 * Check if string is style attribute
 */
export function isStyleAttribute(str) {
    return str === 'style';
}
/**
 * Check if string is class attribute
 */
export function isClassAttribute(str) {
    return str === 'class';
}
/**
 * Check if string is id attribute
 */
export function isIdAttribute(str) {
    return str === 'id';
}
/**
 * Check if string is href attribute
 */
export function isHrefAttribute(str) {
    return str === 'href';
}
/**
 * Check if string is src attribute
 */
export function isSrcAttribute(str) {
    return str === 'src';
}
/**
 * Check if string is alt attribute
 */
export function isAltAttribute(str) {
    return str === 'alt';
}
/**
 * Check if string is title attribute
 */
export function isTitleAttribute(str) {
    return str === 'title';
}
/**
 * Check if string is value attribute
 */
export function isValueAttribute(str) {
    return str === 'value';
}
/**
 * Check if string is name attribute
 */
export function isNameAttribute(str) {
    return str === 'name';
}
/**
 * Check if string is type attribute
 */
export function isTypeAttribute(str) {
    return str === 'type';
}
/**
 * Check if string is placeholder attribute
 */
export function isPlaceholderAttribute(str) {
    return str === 'placeholder';
}
/**
 * Check if string is disabled attribute
 */
export function isDisabledAttribute(str) {
    return str === 'disabled';
}
/**
 * Check if string is readonly attribute
 */
export function isReadonlyAttribute(str) {
    return str === 'readonly';
}
/**
 * Check if string is required attribute
 */
export function isRequiredAttribute(str) {
    return str === 'required';
}
/**
 * Check if string is checked attribute
 */
export function isCheckedAttribute(str) {
    return str === 'checked';
}
/**
 * Check if string is selected attribute
 */
export function isSelectedAttribute(str) {
    return str === 'selected';
}
/**
 * Check if string is multiple attribute
 */
export function isMultipleAttribute(str) {
    return str === 'multiple';
}
/**
 * Check if string is accept attribute
 */
export function isAcceptAttribute(str) {
    return str === 'accept';
}
/**
 * Check if string is autocomplete attribute
 */
export function isAutocompleteAttribute(str) {
    return str === 'autocomplete';
}
/**
 * Check if string is autofocus attribute
 */
export function isAutofocusAttribute(str) {
    return str === 'autofocus';
}
/**
 * Check if string is form attribute
 */
export function isFormAttribute(str) {
    return str === 'form';
}
/**
 * Check if string is formaction attribute
 */
export function isFormactionAttribute(str) {
    return str === 'formaction';
}
/**
 * Check if string is formenctype attribute
 */
export function isFormenctypeAttribute(str) {
    return str === 'formenctype';
}
/**
 * Check if string is formmethod attribute
 */
export function isFormmethodAttribute(str) {
    return str === 'formmethod';
}
/**
 * Check if string is formnovalidate attribute
 */
export function isFormnovalidateAttribute(str) {
    return str === 'formnovalidate';
}
/**
 * Check if string is formtarget attribute
 */
export function isFormtargetAttribute(str) {
    return str === 'formtarget';
}
/**
 * Check if string is height attribute
 */
export function isHeightAttribute(str) {
    return str === 'height';
}
/**
 * Check if string is width attribute
 */
export function isWidthAttribute(str) {
    return str === 'width';
}
/**
 * Check if string is max attribute
 */
export function isMaxAttribute(str) {
    return str === 'max';
}
/**
 * Check if string is maxlength attribute
 */
export function isMaxlengthAttribute(str) {
    return str === 'maxlength';
}
/**
 * Check if string is min attribute
 */
export function isMinAttribute(str) {
    return str === 'min';
}
/**
 * Check if string is minlength attribute
 */
export function isMinlengthAttribute(str) {
    return str === 'minlength';
}
/**
 * Check if string is pattern attribute
 */
export function isPatternAttribute(str) {
    return str === 'pattern';
}
/**
 * Check if string is step attribute
 */
export function isStepAttribute(str) {
    return str === 'step';
}
/**
 * Check if string is wrap attribute
 */
export function isWrapAttribute(str) {
    return str === 'wrap';
}
/**
 * Check if string is contenteditable attribute
 */
export function isContenteditableAttribute(str) {
    return str === 'contenteditable';
}
/**
 * Check if string is draggable attribute
 */
export function isDraggableAttribute(str) {
    return str === 'draggable';
}
/**
 * Check if string is hidden attribute
 */
export function isHiddenAttribute(str) {
    return str === 'hidden';
}
/**
 * Check if string is spellcheck attribute
 */
export function isSpellcheckAttribute(str) {
    return str === 'spellcheck';
}
/**
 * Check if string is translate attribute
 */
export function isTranslateAttribute(str) {
    return str === 'translate';
}
/**
 * Check if string is accesskey attribute
 */
export function isAccesskeyAttribute(str) {
    return str === 'accesskey';
}
/**
 * Check if string is dir attribute
 */
export function isDirAttribute(str) {
    return str === 'dir';
}
/**
 * Check if string is lang attribute
 */
export function isLangAttribute(str) {
    return str === 'lang';
}
/**
 * Check if string is tabindex attribute
 */
export function isTabindexAttribute(str) {
    return str === 'tabindex';
}
/**
 * Check if string is XML name
 */
export function isXmlName(str) {
    const xmlNameRegex = /^[a-zA-Z_:][a-zA-Z0-9_:.-]*$/;
    return xmlNameRegex.test(str);
}
/**
 * Check if string is XML NCName
 */
export function isXmlNcname(str) {
    const xmlNcnameRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;
    return xmlNcnameRegex.test(str);
}
/**
 * Check if string is XML QName
 */
export function isXmlQname(str) {
    const xmlQnameRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*(:[a-zA-Z_][a-zA-Z0-9_.-]*)?$/;
    return xmlQnameRegex.test(str);
}
/**
 * Check if string is XML NMTOKEN
 */
export function isXmlNmtoken(str) {
    const xmlNmtokenRegex = /^[a-zA-Z0-9_.-]+$/;
    return xmlNmtokenRegex.test(str);
}
/**
 * Check if string is XML NMTOKENS
 */
export function isXmlNmtokens(str) {
    const xmlNmtokensRegex = /^[a-zA-Z0-9_.-\s]+$/;
    return xmlNmtokensRegex.test(str);
}
/**
 * Check if string is XML ID
 */
export function isXmlId(str) {
    const xmlIdRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;
    return xmlIdRegex.test(str);
}
/**
 * Check if string is XML IDREF
 */
export function isXmlIdref(str) {
    const xmlIdrefRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;
    return xmlIdrefRegex.test(str);
}
/**
 * Check if string is XML IDREFS
 */
export function isXmlIdrefs(str) {
    const xmlIdrefsRegex = /^[a-zA-Z_][a-zA-Z0-9_.-\s]+$/;
    return xmlIdrefsRegex.test(str);
}
/**
 * Check if string is XML ENTITY
 */
export function isXmlEntity(str) {
    const xmlEntityRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;
    return xmlEntityRegex.test(str);
}
/**
 * Check if string is XML ENTITIES
 */
export function isXmlEntities(str) {
    const xmlEntitiesRegex = /^[a-zA-Z_][a-zA-Z0-9_.-\s]+$/;
    return xmlEntitiesRegex.test(str);
}
/**
 * Check if string is XML NOTATION
 */
export function isXmlNotation(str) {
    const xmlNotationRegex = /^[a-zA-Z_][a-zA-Z0-9_.-]*$/;
    return xmlNotationRegex.test(str);
}
//# sourceMappingURL=utils.js.map