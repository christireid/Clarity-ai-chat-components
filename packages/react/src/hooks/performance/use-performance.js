/**
 * Performance Monitoring Utilities
 *
 * Hooks and utilities for monitoring and optimizing component performance.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Numeric circular buffer for O(1) operations on fixed-size number arrays.
 * Used to store render times without O(n) shift operations.
 *
 * Note: This is intentionally NOT generic to ensure type-safety for sum().
 * Using a specific numeric type prevents accidental misuse with non-numeric values.
 */
class NumericCircularBuffer {
    buffer;
    head = 0;
    count = 0;
    capacity;
    constructor(capacity) {
        // Validate capacity to prevent divide-by-zero and undefined behavior
        if (!Number.isInteger(capacity) || capacity < 1) {
            throw new Error(`NumericCircularBuffer: capacity must be a positive integer, got ${capacity}`);
        }
        this.capacity = capacity;
        this.buffer = new Array(capacity);
    }
    push(item) {
        this.buffer[this.head] = item;
        this.head = (this.head + 1) % this.capacity;
        if (this.count < this.capacity) {
            this.count++;
        }
    }
    toArray() {
        if (this.count === 0)
            return [];
        if (this.count < this.capacity) {
            return this.buffer.slice(0, this.count);
        }
        // Return items in order: oldest to newest
        return [...this.buffer.slice(this.head), ...this.buffer.slice(0, this.head)];
    }
    get length() {
        return this.count;
    }
    get last() {
        if (this.count === 0)
            return undefined;
        const lastIndex = (this.head - 1 + this.capacity) % this.capacity;
        return this.buffer[lastIndex];
    }
    sum() {
        if (this.count === 0)
            return 0;
        let total = 0;
        for (let i = 0; i < this.count; i++) {
            const index = (this.head - this.count + i + this.capacity) % this.capacity;
            total += this.buffer[index];
        }
        return total;
    }
}
/**
 * Hook to monitor component render performance
 * Uses circular buffer for O(1) render time tracking instead of O(n) array.shift()
 */
export function useRenderPerformance(componentName) {
    const renderCount = React.useRef(0);
    // Use circular buffer instead of array.shift() for O(1) performance
    const renderTimes = React.useRef(new NumericCircularBuffer(100));
    const startTime = React.useRef(0);
    // Mark render start (guard for SSR)
    startTime.current =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
    // Mark render end and calculate metrics
    React.useEffect(() => {
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const renderTime = endTime - startTime.current;
        renderCount.current += 1;
        // O(1) push operation with automatic overflow handling
        renderTimes.current.push(renderTime);
        // Log slow renders in development
        if (process.env['NODE_ENV'] === 'development' && renderTime > 16) {
            console.warn(`[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (${renderCount.current} renders)`);
        }
    });
    const bufferLength = renderTimes.current.length;
    const averageRenderTime = bufferLength > 0 ? renderTimes.current.sum() / bufferLength : 0;
    return {
        renderCount: renderCount.current,
        renderTime: startTime.current,
        lastRenderTime: renderTimes.current.last || 0,
        averageRenderTime,
    };
}
/**
 * Hook to track why component re-rendered
 */
export function useWhyDidYouUpdate(name, props) {
    const previousProps = React.useRef(undefined);
    React.useEffect(() => {
        if (previousProps.current) {
            const allKeys = Object.keys({ ...previousProps.current, ...props });
            const changedProps = {};
            allKeys.forEach((key) => {
                if (previousProps.current[key] !== props[key]) {
                    changedProps[key] = {
                        from: previousProps.current[key],
                        to: props[key],
                    };
                }
            });
            if (Object.keys(changedProps).length > 0) {
                console.log('[WhyDidYouUpdate]', name, changedProps);
            }
        }
        previousProps.current = props;
    });
}
/**
 * Hook to measure component mount time
 */
export function useMountTime(componentName) {
    React.useEffect(() => {
        const mountTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        return () => {
            const unmountTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
            const lifetime = unmountTime - mountTime;
            if (process.env['NODE_ENV'] === 'development') {
                console.log(`[Mount Time] ${componentName} was mounted for ${lifetime.toFixed(2)}ms`);
            }
        };
    }, [componentName]);
}
/**
 * Hook to detect slow renders
 */
export function useSlowRenderDetection(threshold = 16, onSlowRender) {
    const startTime = React.useRef(0);
    startTime.current =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
    React.useEffect(() => {
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const renderTime = endTime - startTime.current;
        if (renderTime > threshold) {
            onSlowRender?.(renderTime);
        }
    });
}
export const PerformanceReport = ({ metrics, threshold = 16, }) => {
    if (process.env['NODE_ENV'] !== 'development')
        return null;
    const isSlowRender = metrics.lastRenderTime > threshold;
    const isSlowAverage = metrics.averageRenderTime > threshold;
    return (_jsxs("div", { className: "fixed bottom-4 left-4 p-3 rounded-lg bg-background border border-border/60 shadow-[0_10px_24px_rgba(15,23,42,0.12)] text-xs font-mono space-y-1 z-50 backdrop-blur-sm", children: [_jsx("div", { className: "font-semibold text-foreground", children: "Performance Metrics" }), _jsxs("div", { className: "text-muted-foreground", children: ["Renders: ", metrics.renderCount] }), _jsxs("div", { className: isSlowRender ? 'text-destructive' : 'text-muted-foreground', children: ["Last: ", metrics.lastRenderTime.toFixed(2), "ms", isSlowRender && ' ⚠️'] }), _jsxs("div", { className: isSlowAverage ? 'text-warning' : 'text-muted-foreground', children: ["Avg: ", metrics.averageRenderTime.toFixed(2), "ms", isSlowAverage && ' ⚠️'] })] }));
};
/**
 * Hook for lazy loading components
 */
export function useLazyLoad(loader, deps = []) {
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    // Store loader in ref to avoid dependency issues
    const loaderRef = React.useRef(loader);
    React.useLayoutEffect(() => {
        loaderRef.current = loader;
    }, [loader]);
    React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);
        loaderRef
            .current()
            .then((result) => {
            if (!cancelled) {
                setData(result);
                setLoading(false);
            }
        })
            .catch((err) => {
            if (!cancelled) {
                setError(err instanceof Error ? err : new Error(String(err)));
                setLoading(false);
            }
        });
        return () => {
            cancelled = true;
        };
    }, deps); // Loader accessed via ref
    return { data, loading, error };
}
/**
 * Hook to debounce expensive operations
 */
export function useDebouncePerformance(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}
/**
 * Hook to throttle expensive operations
 */
export function useThrottlePerformance(value, limit = 100) {
    const [throttledValue, setThrottledValue] = React.useState(value);
    const lastRan = React.useRef(Date.now());
    const timeoutRef = React.useRef(undefined);
    React.useEffect(() => {
        const now = Date.now();
        const timeSinceLastRun = now - lastRan.current;
        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        // If enough time has passed, update immediately
        if (timeSinceLastRun >= limit) {
            setThrottledValue(value);
            lastRan.current = now;
        }
        else {
            // Schedule update for remaining time
            const remainingTime = limit - timeSinceLastRun;
            timeoutRef.current = setTimeout(() => {
                setThrottledValue(value);
                lastRan.current = Date.now();
                timeoutRef.current = undefined;
            }, Math.max(0, remainingTime));
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, limit]);
    return throttledValue;
}
/**
 * Memory leak detector
 * WARNING: Modifying global prototypes can cause issues. Use with caution and only in development.
 * Consider using React DevTools Profiler for production-safe memory analysis.
 */
export function useMemoryLeakDetector(componentName) {
    React.useEffect(() => {
        if (typeof window === 'undefined' ||
            process.env['NODE_ENV'] !== 'development') {
            return;
        }
        const listeners = [];
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
        // Override addEventListener (only in dev)
        EventTarget.prototype.addEventListener = function (type, listener, options) {
            listeners.push({ type, listener, target: this });
            return originalAddEventListener.call(this, type, listener, options);
        };
        // Check for leaks on unmount
        return () => {
            EventTarget.prototype.addEventListener = originalAddEventListener;
            EventTarget.prototype.removeEventListener = originalRemoveEventListener;
            if (listeners.length > 0) {
                console.warn(`[Memory Leak] ${componentName} may have ${listeners.length} unremoved event listeners:`, listeners.map((l) => l.type));
            }
        };
    }, [componentName]);
}
//# sourceMappingURL=use-performance.js.map