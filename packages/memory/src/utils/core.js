/**
 * Clarity Memory - Core Utility Functions
 *
 * Basic utility functions.
 */
/**
 * Check if a value is a non-empty string
 */
export function isNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0;
}
/**
 * Check if a value is a valid number
 */
export function isValidNumber(value) {
    return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
}
/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
/**
 * Deep merge two objects
 */
export function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] !== undefined) {
            if (typeof source[key] === 'object' &&
                source[key] !== null &&
                !Array.isArray(source[key]) &&
                typeof target[key] === 'object' &&
                target[key] !== null &&
                !Array.isArray(target[key])) {
                result[key] = deepMerge(target[key], source[key]);
            }
            else {
                result[key] = source[key];
            }
        }
    }
    return result;
}
/**
 * Generate a random ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Retry a function with exponential backoff
 */
export async function retry(fn, options = {}) {
    const { maxAttempts = 3, initialDelay = 1000, maxDelay = 10000, factor = 2, } = options;
    let lastError;
    let delay = initialDelay;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            if (attempt < maxAttempts) {
                await sleep(delay);
                delay = Math.min(delay * factor, maxDelay);
            }
        }
    }
    throw lastError || new Error('Retry failed');
}
/**
 * Debounce a function
 */
export function debounce(fn, delay) {
    let timeoutId = null;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}
/**
 * Throttle a function
 */
export function throttle(fn, delay) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            fn(...args);
        }
    };
}
/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a, b) {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same length');
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    const denominator = Math.sqrt(normA) * Math.sqrt(normB);
    if (denominator === 0) {
        return 0;
    }
    return dotProduct / denominator;
}
/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 *
 * This is the standard token estimation ratio used across the codebase.
 * For model-specific estimation, see @clarity/react/utils/tokenization/estimator
 */
export function estimateTokens(text) {
    return Math.ceil(text.length / 4);
}
/**
 * Truncate text to a maximum token count
 */
export function truncateToTokens(text, maxTokens) {
    const maxChars = maxTokens * 4;
    if (text.length <= maxChars) {
        return text;
    }
    return text.substring(0, maxChars).trim();
}
/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes) {
    if (bytes === 0)
        return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
/**
 * Check if code is running in browser
 */
export function isBrowser() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}
/**
 * Check if code is running in Node.js
 */
export function isNode() {
    return typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
}
//# sourceMappingURL=core.js.map