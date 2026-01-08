/**
 * Internal Helper Functions
 *
 * @internal
 * These utilities are for internal use only and are not part of the public API.
 * They provide common functionality used across the library.
 */
/**
 * Debounce a function
 */
export function debounce(fn, delay) {
    let timeoutId = null;
    return function debounced(...args) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = null;
        }, delay);
    };
}
/**
 * Throttle a function
 */
export function throttle(fn, limit) {
    let inThrottle = false;
    return function throttled(...args) {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
/**
 * Generate a unique ID
 */
export function generateId(prefix = '') {
    const random = Math.random().toString(36).substring(2, 11);
    const timestamp = Date.now().toString(36);
    return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}
/**
 * Deep clone an object
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item));
    }
    const cloned = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}
/**
 * Deep merge objects
 */
export function deepMerge(target, ...sources) {
    if (!sources.length)
        return target;
    const source = sources.shift();
    if (source === undefined)
        return target;
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key];
            const targetValue = target[key];
            if (typeof sourceValue === 'object' &&
                sourceValue !== null &&
                !Array.isArray(sourceValue) &&
                typeof targetValue === 'object' &&
                targetValue !== null &&
                !Array.isArray(targetValue)) {
                target[key] = deepMerge({ ...targetValue }, sourceValue);
            }
            else {
                target[key] = sourceValue;
            }
        }
    }
    return deepMerge(target, ...sources);
}
/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Sleep for a specified duration
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retry an async operation with exponential backoff
 */
export async function retry(fn, options = {}) {
    const { maxAttempts = 3, baseDelay = 1000, maxDelay = 30000, shouldRetry = () => true, } = options;
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            if (attempt === maxAttempts || !shouldRetry(error)) {
                throw error;
            }
            const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
            await sleep(delay);
        }
    }
    throw lastError;
}
/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
/**
 * Memoize a function with a single argument
 */
export function memoize(fn) {
    const cache = new Map();
    return (arg) => {
        if (cache.has(arg)) {
            return cache.get(arg);
        }
        const result = fn(arg);
        cache.set(arg, result);
        return result;
    };
}
/**
 * Create a cancellable promise
 */
export function cancellable(promise) {
    let isCancelled = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((value) => {
            if (!isCancelled) {
                resolve(value);
            }
        }, (error) => {
            if (!isCancelled) {
                reject(error);
            }
        });
    });
    return {
        promise: wrappedPromise,
        cancel: () => {
            isCancelled = true;
        },
    };
}
/**
 * Check if code is running in a browser environment
 */
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
/**
 * Check if code is running in a server environment
 */
export const isServer = !isBrowser;
/**
 * Format a date/timestamp as relative time (e.g., "2h ago", "Just now")
 */
export function formatRelativeTime(date) {
    if (!date)
        return '';
    const timestamp = date instanceof Date ? date.getTime() : date;
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days}d ago`;
    if (hours > 0)
        return `${hours}h ago`;
    if (minutes > 0)
        return `${minutes}m ago`;
    return 'Just now';
}
/**
 * Alias for formatBytes - formats file size in human-readable format
 */
export const formatFileSize = formatBytes;
/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncate(str, maxLength) {
    if (str.length <= maxLength)
        return str;
    return str.slice(0, maxLength - 3) + '...';
}
/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
    if (total === 0)
        return 0;
    return Math.round((value / total) * 100);
}
//# sourceMappingURL=helpers.js.map