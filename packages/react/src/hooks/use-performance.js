/**
 * Performance Monitoring Utilities
 *
 * Hooks and utilities for monitoring and optimizing component performance.
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Hook to monitor component render performance
 */
export function useRenderPerformance(componentName) {
    const renderCount = React.useRef(0);
    const renderTimes = React.useRef([]);
    const startTime = React.useRef(0);
    // Mark render start (guard for SSR)
    startTime.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
    // Mark render end and calculate metrics
    React.useEffect(() => {
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const renderTime = endTime - startTime.current;
        renderCount.current += 1;
        renderTimes.current.push(renderTime);
        // Keep only last 100 renders
        if (renderTimes.current.length > 100) {
            renderTimes.current.shift();
        }
        // Log slow renders in development
        if (process.env['NODE_ENV'] === 'development' && renderTime > 16) {
            console.warn(`[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (${renderCount.current} renders)`);
        }
    });
    const averageRenderTime = renderTimes.current.length > 0
        ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
        : 0;
    return {
        renderCount: renderCount.current,
        renderTime: startTime.current,
        lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
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
    startTime.current = typeof performance !== 'undefined' ? performance.now() : Date.now();
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
        loaderRef.current()
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (typeof window === 'undefined' || process.env['NODE_ENV'] !== 'development') {
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