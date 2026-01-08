'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
const initialMetrics = {
    renderCount: 0,
    lastRenderTime: 0,
    lastRenderDuration: 0,
    averageRenderDuration: 0,
    fetchCount: 0,
    averageFetchDuration: 0,
    lastFetchDuration: 0,
    mountDuration: 0,
    firstContentfulPaint: null,
    peakMemoryMB: null,
};
/**
 * Hook for monitoring dashboard performance.
 *
 * Tracks render counts, fetch timing, and memory usage.
 * Provides callbacks for slow operation detection.
 *
 * @example
 * ```tsx
 * function AnalyticsDashboard() {
 *   const { metrics, startFetchTiming, getSummary } = useDashboardPerformance({
 *     dashboardId: 'analytics',
 *     slowRenderThreshold: 16, // 60fps target
 *     onSlowRender: (duration) => {
 *       console.warn(`Slow render: ${duration}ms`)
 *     },
 *   })
 *
 *   const fetchData = async () => {
 *     const endTiming = startFetchTiming()
 *     try {
 *       const data = await api.getData()
 *       return data
 *     } finally {
 *       endTiming()
 *     }
 *   }
 *
 *   // In dev tools or debug panel
 *   console.log(getSummary())
 *
 *   return <Dashboard />
 * }
 * ```
 */
export function useDashboardPerformance(options) {
    const { dashboardId, debug = false, onMetricsUpdate, slowRenderThreshold = 16, // 60fps target
    slowFetchThreshold = 1000, // 1 second
    onSlowRender, onSlowFetch, } = options;
    const [metrics, setMetrics] = React.useState(() => ({ ...initialMetrics }));
    const mountTimeRef = React.useRef(Date.now());
    const renderStartRef = React.useRef(0);
    const totalRenderDurationRef = React.useRef(0);
    const totalFetchDurationRef = React.useRef(0);
    const marksRef = React.useRef(new Map());
    const log = React.useCallback((message, ...args) => {
        if (debug) {
            console.log(`[DashboardPerf:${dashboardId}] ${message}`, ...args);
        }
    }, [debug, dashboardId]);
    // Track render timing
    React.useLayoutEffect(() => {
        renderStartRef.current = performance.now();
    });
    React.useEffect(() => {
        const renderDuration = performance.now() - renderStartRef.current;
        totalRenderDurationRef.current += renderDuration;
        setMetrics((prev) => {
            const newRenderCount = prev.renderCount + 1;
            const newMetrics = {
                ...prev,
                renderCount: newRenderCount,
                lastRenderTime: Date.now(),
                lastRenderDuration: renderDuration,
                averageRenderDuration: totalRenderDurationRef.current / newRenderCount,
                mountDuration: Date.now() - mountTimeRef.current,
            };
            // Check for slow render
            if (renderDuration > slowRenderThreshold) {
                log(`Slow render detected: ${renderDuration.toFixed(2)}ms`);
                onSlowRender?.(renderDuration);
            }
            onMetricsUpdate?.(newMetrics);
            return newMetrics;
        });
    });
    // Track memory usage (if available)
    React.useEffect(() => {
        const updateMemory = () => {
            if ('memory' in performance) {
                const memory = performance.memory;
                const memoryMB = memory.usedJSHeapSize / (1024 * 1024);
                setMetrics((prev) => {
                    if (prev.peakMemoryMB === null || memoryMB > prev.peakMemoryMB) {
                        return { ...prev, peakMemoryMB: memoryMB };
                    }
                    return prev;
                });
            }
        };
        updateMemory();
        const interval = setInterval(updateMemory, 5000);
        return () => clearInterval(interval);
    }, []);
    const startFetchTiming = React.useCallback(() => {
        const startTime = performance.now();
        log('Fetch started');
        return () => {
            const duration = performance.now() - startTime;
            totalFetchDurationRef.current += duration;
            setMetrics((prev) => {
                const newFetchCount = prev.fetchCount + 1;
                const newMetrics = {
                    ...prev,
                    fetchCount: newFetchCount,
                    lastFetchDuration: duration,
                    averageFetchDuration: totalFetchDurationRef.current / newFetchCount,
                    firstContentfulPaint: prev.firstContentfulPaint === null
                        ? Date.now() - mountTimeRef.current
                        : prev.firstContentfulPaint,
                };
                log(`Fetch completed in ${duration.toFixed(2)}ms`);
                // Check for slow fetch
                if (duration > slowFetchThreshold) {
                    log(`Slow fetch detected: ${duration.toFixed(2)}ms`);
                    onSlowFetch?.(duration);
                }
                onMetricsUpdate?.(newMetrics);
                return newMetrics;
            });
        };
    }, [log, slowFetchThreshold, onSlowFetch, onMetricsUpdate]);
    const mark = React.useCallback((name) => {
        const fullName = `${dashboardId}:${name}`;
        marksRef.current.set(fullName, performance.now());
        log(`Mark: ${name}`);
    }, [dashboardId, log]);
    const measure = React.useCallback((name, startMark, endMark) => {
        const startFullName = `${dashboardId}:${startMark}`;
        const endFullName = endMark ? `${dashboardId}:${endMark}` : null;
        const startTime = marksRef.current.get(startFullName);
        if (startTime === undefined) {
            log(`Mark not found: ${startMark}`);
            return null;
        }
        const endTime = endFullName
            ? marksRef.current.get(endFullName)
            : performance.now();
        if (endTime === undefined) {
            log(`Mark not found: ${endMark}`);
            return null;
        }
        const duration = endTime - startTime;
        log(`Measure ${name}: ${duration.toFixed(2)}ms`);
        return duration;
    }, [dashboardId, log]);
    const reset = React.useCallback(() => {
        mountTimeRef.current = Date.now();
        totalRenderDurationRef.current = 0;
        totalFetchDurationRef.current = 0;
        marksRef.current.clear();
        setMetrics({ ...initialMetrics });
        log('Metrics reset');
    }, [log]);
    const exportMetrics = React.useCallback(() => {
        return JSON.stringify({
            dashboardId,
            timestamp: new Date().toISOString(),
            metrics,
        }, null, 2);
    }, [dashboardId, metrics]);
    const getSummary = React.useCallback(() => {
        const lines = [
            `Dashboard Performance: ${dashboardId}`,
            `------------------------`,
            `Renders: ${metrics.renderCount}`,
            `Avg Render: ${metrics.averageRenderDuration.toFixed(2)}ms`,
            `Fetches: ${metrics.fetchCount}`,
            `Avg Fetch: ${metrics.averageFetchDuration.toFixed(2)}ms`,
            `FCP: ${metrics.firstContentfulPaint?.toFixed(0) ?? 'N/A'}ms`,
            `Uptime: ${(metrics.mountDuration / 1000).toFixed(1)}s`,
        ];
        if (metrics.peakMemoryMB !== null) {
            lines.push(`Peak Memory: ${metrics.peakMemoryMB.toFixed(2)}MB`);
        }
        return lines.join('\n');
    }, [dashboardId, metrics]);
    return {
        metrics,
        startFetchTiming,
        mark,
        measure,
        reset,
        exportMetrics,
        getSummary,
    };
}
const PerformanceContext = React.createContext(null);
/**
 * Provider for dashboard performance monitoring
 */
export function DashboardPerformanceProvider({ children, }) {
    const metricsRef = React.useRef(new Map());
    const registerDashboard = React.useCallback((id) => {
        if (!metricsRef.current.has(id)) {
            metricsRef.current.set(id, { ...initialMetrics });
        }
    }, []);
    const unregisterDashboard = React.useCallback((id) => {
        metricsRef.current.delete(id);
    }, []);
    const getMetrics = React.useCallback((id) => {
        return metricsRef.current.get(id) ?? null;
    }, []);
    const getAllMetrics = React.useCallback(() => {
        const result = {};
        metricsRef.current.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }, []);
    const value = React.useMemo(() => ({
        registerDashboard,
        unregisterDashboard,
        getMetrics,
        getAllMetrics,
    }), [registerDashboard, unregisterDashboard, getMetrics, getAllMetrics]);
    return (_jsx(PerformanceContext.Provider, { value: value, children: children }));
}
/**
 * Hook to access dashboard performance context
 */
export function usePerformanceContext() {
    const context = React.useContext(PerformanceContext);
    if (!context) {
        throw new Error('usePerformanceContext must be used within DashboardPerformanceProvider');
    }
    return context;
}
//# sourceMappingURL=use-dashboard-performance.js.map