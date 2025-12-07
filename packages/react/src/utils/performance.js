/**
 * Performance utilities for chat hooks
 */
/**
 * Throttle function calls - ensures function is called at most once per wait period
 *
 * @template T - Function type to throttle
 * @param {T} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {(...args: Parameters<T>) => void} Throttled function
 * @example
 * ```ts
 * const throttledScroll = throttle(() => console.log('scrolled'), 100)
 * window.addEventListener('scroll', throttledScroll)
 * ```
 */
export function throttle(func, wait) {
    let timeout = null;
    let lastCall = 0;
    return function throttled(...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        if (timeSinceLastCall >= wait) {
            lastCall = now;
            func(...args);
        }
        else {
            // Clear existing timeout to prevent multiple pending calls
            if (timeout) {
                clearTimeout(timeout);
            }
            const remainingTime = wait - timeSinceLastCall;
            // Ensure remainingTime is positive (should always be, but safety check)
            timeout = setTimeout(() => {
                lastCall = Date.now();
                func(...args);
                timeout = null;
            }, Math.max(0, remainingTime));
        }
    };
}
/**
 * Debounce function calls - delays execution until after wait time has elapsed
 * since the last call
 *
 * @template T - Function type to debounce
 * @param {T} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {(...args: Parameters<T>) => void} Debounced function with optional cancel method
 * @example
 * ```ts
 * const debouncedSearch = debounce((query) => searchAPI(query), 300)
 * input.addEventListener('input', (e) => debouncedSearch(e.target.value))
 * ```
 */
export function debounce(func, wait) {
    let timeout = null;
    const debounced = function debounced(...args) {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
            timeout = null;
        }, wait);
    };
    // Add cancel method for cleanup
    debounced.cancel = () => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
    };
    return debounced;
}
/**
 * Batch function calls
 */
export class Batcher {
    processor;
    batchSize;
    batchTimeout;
    batch = [];
    timeout = null;
    constructor(processor, batchSize = 10, batchTimeout = 100) {
        this.processor = processor;
        this.batchSize = batchSize;
        this.batchTimeout = batchTimeout;
    }
    add(item) {
        this.batch.push(item);
        if (this.batch.length >= this.batchSize) {
            this.flush();
        }
        else {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            this.timeout = setTimeout(() => {
                this.flush();
            }, this.batchTimeout);
        }
    }
    flush() {
        if (this.batch.length > 0) {
            this.processor([...this.batch]);
            this.batch = [];
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}
/**
 * Measure performance for synchronous functions
 *
 * @param name - Label for the performance measurement
 * @param fn - Synchronous function to measure
 * @returns Result of the function and duration in milliseconds
 * @example
 * ```ts
 * const result = measurePerformance('heavy-computation', () => {
 *   return processLargeArray(data)
 * })
 * ```
 */
export function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    if (typeof window !== 'undefined' && window.__PERF_LOGGING__) {
        console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    }
    return result;
}
/**
 * Measure performance for asynchronous functions
 *
 * @param name - Label for the performance measurement
 * @param fn - Async function to measure
 * @returns Promise that resolves to function result and duration
 * @example
 * ```ts
 * const result = await measurePerformanceAsync('api-call', async () => {
 *   return await fetch('/api/data').then(r => r.json())
 * })
 * ```
 */
export async function measurePerformanceAsync(name, fn) {
    const start = performance.now();
    try {
        const result = await fn();
        const end = performance.now();
        const duration = end - start;
        if (typeof window !== 'undefined' && window.__PERF_LOGGING__) {
            console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        }
        return result;
    }
    catch (error) {
        const end = performance.now();
        const duration = end - start;
        if (typeof window !== 'undefined' && window.__PERF_LOGGING__) {
            console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms (failed)`);
        }
        throw error;
    }
}
/**
 * Measure performance and return both result and duration
 *
 * @param name - Label for the performance measurement
 * @param fn - Async function to measure
 * @returns Promise with result and duration
 * @example
 * ```ts
 * const { result, duration } = await measureWithResult('fetch-users', async () => {
 *   return await getUsers()
 * })
 *
 * if (duration > 1000) {
 *   console.warn('Slow query detected')
 * }
 * ```
 */
export async function measureWithResult(name, fn) {
    const start = performance.now();
    try {
        const result = await fn();
        const duration = performance.now() - start;
        if (typeof window !== 'undefined' && window.__PERF_LOGGING__) {
            console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
        }
        return { result, duration };
    }
    catch (error) {
        const duration = performance.now() - start;
        if (typeof window !== 'undefined' && window.__PERF_LOGGING__) {
            console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms (failed)`);
        }
        throw error;
    }
}
/**
 * Create a performance monitor
 */
export class PerformanceMonitor {
    metrics = new Map();
    start(label) {
        const start = performance.now();
        return () => {
            const duration = performance.now() - start;
            const existing = this.metrics.get(label) || [];
            existing.push(duration);
            this.metrics.set(label, existing);
        };
    }
    getMetrics(label) {
        const values = this.metrics.get(label) || [];
        if (values.length === 0) {
            return { avg: 0, min: 0, max: 0, count: 0 };
        }
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);
        return { avg, min, max, count: values.length };
    }
    reset(label) {
        if (label) {
            this.metrics.delete(label);
        }
        else {
            this.metrics.clear();
        }
    }
    getReport() {
        const report = {};
        for (const [label] of this.metrics) {
            report[label] = this.getMetrics(label);
        }
        return report;
    }
}
/**
 * Lazy load content
 */
export function lazyLoad(loader, timeout = 5000) {
    return Promise.race([
        loader(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Lazy load timeout')), timeout)),
    ]);
}
/**
 * Optimize large arrays
 */
export function optimizeArray(array, maxSize = 1000) {
    if (array.length <= maxSize) {
        return array;
    }
    // Keep first and last items, sample middle
    const keepFirst = Math.floor(maxSize * 0.2);
    const keepLast = Math.floor(maxSize * 0.2);
    const sampleSize = maxSize - keepFirst - keepLast;
    const first = array.slice(0, keepFirst);
    const last = array.slice(-keepLast);
    const middle = array.slice(keepFirst, -keepLast);
    // Sample middle section
    const step = Math.ceil(middle.length / sampleSize);
    const sampled = middle.filter((_, index) => index % step === 0).slice(0, sampleSize);
    return [...first, ...sampled, ...last];
}
//# sourceMappingURL=performance.js.map