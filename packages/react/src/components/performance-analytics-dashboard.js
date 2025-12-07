'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, cn, } from '@clarity-chat/primitives';
/**
 * Hook to collect performance metrics
 */
function usePerformanceMetrics(updateInterval = 1000) {
    const [metrics, setMetrics] = React.useState({
        webVitals: [],
        componentMetrics: [],
        networkMetrics: [],
        timestamp: Date.now(),
    });
    // Collect Web Vitals
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        // Check if web-vitals is available
        const collectWebVitals = async () => {
            try {
                // Use Performance Observer API for basic metrics
                if ('PerformanceObserver' in window) {
                    // Largest Contentful Paint (LCP)
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        if (lastEntry) {
                            const value = lastEntry.renderTime || lastEntry.loadTime;
                            setMetrics((prev) => ({
                                ...prev,
                                webVitals: [
                                    ...prev.webVitals.filter((v) => v.name !== 'LCP'),
                                    {
                                        name: 'LCP',
                                        value,
                                        rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor',
                                        delta: 0,
                                    },
                                ],
                            }));
                        }
                    });
                    try {
                        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                    }
                    catch {
                        // LCP not supported
                    }
                    // First Input Delay (FID) / Interaction to Next Paint (INP)
                    const fidObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                            if (entry.processingStart) {
                                const value = entry.processingStart - entry.startTime;
                                setMetrics((prev) => ({
                                    ...prev,
                                    webVitals: [
                                        ...prev.webVitals.filter((v) => v.name !== 'FID'),
                                        {
                                            name: 'FID',
                                            value,
                                            rating: value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor',
                                            delta: 0,
                                        },
                                    ],
                                }));
                            }
                        });
                    });
                    try {
                        fidObserver.observe({ type: 'first-input', buffered: true });
                    }
                    catch {
                        // FID not supported
                    }
                    // First Contentful Paint (FCP)
                    const fcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach((entry) => {
                            setMetrics((prev) => ({
                                ...prev,
                                webVitals: [
                                    ...prev.webVitals.filter((v) => v.name !== 'FCP'),
                                    {
                                        name: 'FCP',
                                        value: entry.startTime,
                                        rating: entry.startTime < 1800
                                            ? 'good'
                                            : entry.startTime < 3000
                                                ? 'needs-improvement'
                                                : 'poor',
                                        delta: 0,
                                    },
                                ],
                            }));
                        });
                    });
                    try {
                        fcpObserver.observe({ type: 'paint', buffered: true });
                    }
                    catch {
                        // FCP not supported
                    }
                    return () => {
                        lcpObserver.disconnect();
                        fidObserver.disconnect();
                        fcpObserver.disconnect();
                    };
                }
            }
            catch (error) {
                console.warn('Failed to collect Web Vitals:', error);
            }
        };
        collectWebVitals();
    }, []);
    // Collect memory usage
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const interval = setInterval(() => {
            if ('memory' in performance) {
                const memory = performance.memory;
                setMetrics((prev) => ({
                    ...prev,
                    memoryUsage: {
                        used: memory.usedJSHeapSize,
                        total: memory.totalJSHeapSize,
                        limit: memory.jsHeapSizeLimit,
                    },
                    timestamp: Date.now(),
                }));
            }
        }, updateInterval);
        return () => clearInterval(interval);
    }, [updateInterval]);
    // Collect FPS
    React.useEffect(() => {
        if (typeof window === 'undefined')
            return;
        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId;
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                setMetrics((prev) => ({ ...prev, fps }));
                frameCount = 0;
                lastTime = currentTime;
            }
            animationFrameId = requestAnimationFrame(measureFPS);
        };
        animationFrameId = requestAnimationFrame(measureFPS);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);
    return metrics;
}
/**
 * PerformanceAnalyticsDashboard Component
 *
 * Displays comprehensive performance analytics including:
 * - Web Vitals (LCP, FID, CLS, etc.)
 * - Component render metrics
 * - Network performance
 * - Memory usage
 * - FPS counter
 *
 * @example
 * ```tsx
 * <PerformanceAnalyticsDashboard
 *   updateInterval={1000}
 *   showWebVitals
 *   showComponentMetrics
 *   showMemoryUsage
 *   showFPS
 *   onDataUpdate={(data) => {
 *     console.log('Performance:', data)
 *   }}
 * />
 * ```
 */
export function PerformanceAnalyticsDashboard({ data: externalData, updateInterval = 1000, showWebVitals = true, showComponentMetrics = true, showNetworkMetrics = false, showMemoryUsage = true, showFPS = true, onDataUpdate, compact = false, className, }) {
    const collectedMetrics = usePerformanceMetrics(updateInterval);
    const data = externalData || collectedMetrics;
    React.useEffect(() => {
        onDataUpdate?.(data);
    }, [data, onDataUpdate]);
    /**
     * Format bytes to human-readable format
     */
    const formatBytes = (bytes) => {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };
    /**
     * Get rating color
     */
    const getRatingColor = (rating) => {
        switch (rating) {
            case 'good':
                return 'text-green-500';
            case 'needs-improvement':
                return 'text-yellow-500';
            case 'poor':
                return 'text-red-500';
        }
    };
    /**
     * Get rating badge variant
     */
    const getRatingVariant = (rating) => {
        switch (rating) {
            case 'good':
                return 'success';
            case 'needs-improvement':
                return 'warning';
            case 'poor':
                return 'destructive';
        }
    };
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsx(Card, { className: "shadow-sm", children: _jsx(CardHeader, { children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 10V3L4 14h7v7l9-11h-7z" }) }) }), _jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: "Performance Analytics" }), _jsx(CardDescription, { className: "text-xs", children: "Real-time performance monitoring" })] })] }), showFPS && data.fps !== undefined && (_jsxs(Badge, { variant: data.fps >= 50 ? 'success' : data.fps >= 30 ? 'warning' : 'destructive', children: [data.fps, " FPS"] }))] }) }) }), showWebVitals && data.webVitals.length > 0 && (_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Core Web Vitals" }) }), _jsx(CardContent, { children: _jsx("div", { className: cn('grid gap-4', compact ? 'grid-cols-2' : 'grid-cols-3'), children: data.webVitals.map((vital) => (_jsxs(motion.div, { className: "flex flex-col items-center rounded-lg border p-4", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: [_jsx("div", { className: "text-xs font-medium text-muted-foreground mb-1", children: vital.name }), _jsx("div", { className: cn('text-2xl font-bold mb-2', getRatingColor(vital.rating)), children: vital.name === 'CLS'
                                            ? vital.value.toFixed(3)
                                            : `${Math.round(vital.value)}ms` }), _jsx(Badge, { variant: getRatingVariant(vital.rating), className: "text-xs", children: vital.rating })] }, vital.name))) }) })] })), showComponentMetrics && data.componentMetrics.length > 0 && (_jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-sm", children: "Component Performance" }), _jsxs(CardDescription, { className: "text-xs", children: [data.componentMetrics.length, " components tracked"] })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: data.componentMetrics.slice(0, compact ? 3 : 5).map((metric) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm font-medium", children: metric.name }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metric.renderCount, " renders \u2022 avg ", metric.averageRenderTime.toFixed(2), "ms"] })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Badge, { variant: metric.averageRenderTime < 16
                                                ? 'success'
                                                : metric.averageRenderTime < 50
                                                    ? 'warning'
                                                    : 'destructive', className: "text-xs", children: [metric.lastRenderTime.toFixed(1), "ms"] }) })] }, metric.name))) }) })] })), showMemoryUsage && data.memoryUsage && (_jsxs(Card, { className: "shadow-sm", children: [_jsx(CardHeader, { children: _jsx(CardTitle, { className: "text-sm", children: "Memory Usage" }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Used" }), _jsx("span", { className: "text-sm font-medium", children: formatBytes(data.memoryUsage.used) })] }), _jsx("div", { className: "h-2 w-full rounded-full bg-muted overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-primary", initial: { width: 0 }, animate: {
                                            width: `${(data.memoryUsage.used / data.memoryUsage.limit) * 100}%`,
                                        }, transition: { duration: 0.5 } }) }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: ["Total: ", formatBytes(data.memoryUsage.total)] }), _jsxs("span", { children: ["Limit: ", formatBytes(data.memoryUsage.limit)] })] })] }) })] })), showNetworkMetrics && data.networkMetrics.length > 0 && (_jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-sm", children: "Network Performance" }), _jsxs(CardDescription, { className: "text-xs", children: [data.networkMetrics.length, " requests tracked"] })] }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-2", children: data.networkMetrics.slice(0, compact ? 3 : 5).map((metric, index) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border p-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm font-medium truncate", children: metric.url }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metric.method, " \u2022 ", formatBytes(metric.size)] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Badge, { variant: metric.status >= 200 && metric.status < 300 ? 'success' : 'destructive', className: "text-xs", children: metric.status }), _jsxs(Badge, { variant: "secondary", className: "text-xs", children: [metric.duration.toFixed(0), "ms"] })] })] }, index))) }) })] }))] }));
}
PerformanceAnalyticsDashboard.displayName = 'PerformanceAnalyticsDashboard';
//# sourceMappingURL=performance-analytics-dashboard.js.map