/**
 * Performance Monitoring Dashboard
 *
 * Visual dashboard for performance metrics
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useRenderPerformance } from '../hooks/use-performance';
// Stub hook for memory usage (not available in all browsers)
function useMemoryUsage() {
    return {
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
    };
}
/**
 * Performance Dashboard Component
 *
 * Real-time performance monitoring UI
 *
 * @example
 * ```tsx
 * <PerformanceDashboard
 *   detailed
 *   updateInterval={1000}
 * />
 * ```
 */
export function PerformanceDashboard({ detailed = false, updateInterval = 2000, className, }) {
    const performanceMetrics = useRenderPerformance('PerformanceDashboard');
    const memoryInfo = useMemoryUsage();
    const [metrics, setMetrics] = React.useState([]);
    React.useEffect(() => {
        const updateMetrics = () => {
            const newMetrics = [];
            // Render performance
            newMetrics.push({
                name: 'Render Count',
                value: performanceMetrics.renderCount,
                status: 'good',
            });
            newMetrics.push({
                name: 'Last Render',
                value: performanceMetrics.lastRenderTime.toFixed(2),
                unit: 'ms',
                status: performanceMetrics.lastRenderTime > 16 ? 'warning' : 'good',
            });
            newMetrics.push({
                name: 'Average Render',
                value: performanceMetrics.averageRenderTime.toFixed(2),
                unit: 'ms',
                status: performanceMetrics.averageRenderTime > 16 ? 'warning' : 'good',
            });
            // Memory usage
            if (memoryInfo) {
                newMetrics.push({
                    name: 'Memory Used',
                    value: formatBytes(memoryInfo.usedJSHeapSize),
                    status: memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8 ? 'warning' : 'good',
                });
                if (detailed) {
                    newMetrics.push({
                        name: 'Total Memory',
                        value: formatBytes(memoryInfo.totalJSHeapSize),
                        status: 'good',
                    });
                    newMetrics.push({
                        name: 'Memory Limit',
                        value: formatBytes(memoryInfo.jsHeapSizeLimit),
                        status: 'good',
                    });
                }
            }
            // Page load metrics (if available)
            if (performance.timing && detailed) {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                newMetrics.push({
                    name: 'Page Load',
                    value: loadTime > 0 ? (loadTime / 1000).toFixed(2) : 'N/A',
                    unit: 's',
                    status: loadTime > 3000 ? 'warning' : 'good',
                });
            }
            setMetrics(newMetrics);
        };
        updateMetrics();
        const interval = setInterval(updateMetrics, updateInterval);
        return () => clearInterval(interval);
    }, [performanceMetrics, memoryInfo, detailed, updateInterval]);
    return (_jsxs("div", { className: `performance-dashboard p-4 rounded-lg border border-border bg-card ${className || ''}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Performance Metrics" }), _jsxs("div", { className: "flex gap-2 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[hsl(var(--success))]" }), "Good"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[hsl(var(--warning))]" }), "Warning"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-destructive" }), "Poor"] })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: metrics.map(metric => (_jsxs("div", { className: "p-3 rounded-lg border border-border/50 bg-muted/30 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] transition-all duration-150 ease-out", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: metric.name }), _jsx("span", { className: `w-2 h-2 rounded-full ${metric.status === 'good'
                                        ? 'bg-[hsl(var(--success))]'
                                        : metric.status === 'warning'
                                            ? 'bg-[hsl(var(--warning))]'
                                            : 'bg-destructive'}` })] }), _jsxs("div", { className: "text-2xl font-bold text-foreground", children: [metric.value, metric.unit && _jsx("span", { className: "text-sm ml-1 text-muted-foreground", children: metric.unit })] })] }, metric.name))) }), detailed && (_jsx("div", { className: "mt-4 p-3 rounded-md bg-muted text-xs", children: _jsx("p", { className: "text-muted-foreground", children: "\uD83D\uDCA1 Tip: Keep render times below 16ms for 60fps. Monitor memory usage to prevent leaks." }) }))] }));
}
/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
/**
 * Compact Performance Badge
 *
 * Small performance indicator for corners
 */
export function PerformanceBadge({ className }) {
    const performanceMetrics = useRenderPerformance('PerformanceBadge');
    const memoryInfo = useMemoryUsage();
    const status = React.useMemo(() => {
        if (performanceMetrics.lastRenderTime > 50)
            return 'poor';
        if (performanceMetrics.lastRenderTime > 16)
            return 'warning';
        if (memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9)
            return 'poor';
        if (memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.7)
            return 'warning';
        return 'good';
    }, [performanceMetrics.lastRenderTime, memoryInfo]);
    return (_jsxs("div", { className: `performance-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border/50 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] transition-all duration-150 ease-out hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] ${status === 'good'
            ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20'
            : status === 'warning'
                ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'} ${className || ''}`, title: `Last render: ${performanceMetrics.lastRenderTime.toFixed(2)}ms`, children: [_jsx("span", { className: `w-2 h-2 rounded-full ${status === 'good' ? 'bg-[hsl(var(--success))]' : status === 'warning' ? 'bg-[hsl(var(--warning))]' : 'bg-destructive'}` }), performanceMetrics.lastRenderTime.toFixed(1), "ms"] }));
}
//# sourceMappingURL=performance-dashboard.js.map