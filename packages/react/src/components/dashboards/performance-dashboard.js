'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Performance Monitoring Dashboard
 *
 * Visual dashboard for performance metrics
 */
import * as React from 'react';
import { useRenderPerformance } from '../../hooks/performance/use-performance';
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
export function PerformanceDashboard({ detailed = false, updateInterval = 2000, className, isLoading = false, error = null, showExport = false, onExport, }) {
    const performanceMetrics = useRenderPerformance('PerformanceDashboard');
    const memoryInfo = useMemoryUsage();
    const [metrics, setMetrics] = React.useState([]);
    const sessionStartRef = React.useRef(Date.now());
    /**
     * Export metrics as JSON file download
     */
    const handleExport = React.useCallback((format = 'json') => {
        const exportData = {
            timestamp: new Date().toISOString(),
            metrics: metrics.map((m) => ({
                name: m.name,
                value: m.value,
                unit: m.unit,
                status: m.status,
            })),
            sessionDuration: Date.now() - sessionStartRef.current,
        };
        // Call onExport callback if provided
        onExport?.(exportData);
        // Generate and download file
        let content;
        let mimeType;
        let extension;
        if (format === 'csv') {
            const headers = ['Metric', 'Value', 'Unit', 'Status'];
            const rows = metrics.map((m) => [
                m.name,
                String(m.value),
                m.unit || '',
                m.status || '',
            ]);
            content = [
                `# Performance Metrics Export`,
                `# Timestamp: ${exportData.timestamp}`,
                `# Session Duration: ${Math.round(exportData.sessionDuration / 1000)}s`,
                '',
                headers.join(','),
                ...rows.map((r) => r.join(',')),
            ].join('\n');
            mimeType = 'text/csv';
            extension = 'csv';
        }
        else {
            content = JSON.stringify(exportData, null, 2);
            mimeType = 'application/json';
            extension = 'json';
        }
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `performance-metrics-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [metrics, onExport]);
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
                    status: memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8
                        ? 'warning'
                        : 'good',
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
            // Page load metrics (if available) - use modern Navigation Timing API
            if (detailed && typeof performance !== 'undefined') {
                let loadTime = -1;
                // Modern API: Performance Navigation Timing Level 2
                const navigationEntries = performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                    const navEntry = navigationEntries[0];
                    loadTime = navEntry.loadEventEnd - navEntry.startTime;
                }
                // Fallback: deprecated timing API (for older browsers)
                else if (performance.timing) {
                    const timing = performance.timing;
                    loadTime = timing.loadEventEnd - timing.navigationStart;
                }
                if (loadTime >= 0) {
                    newMetrics.push({
                        name: 'Page Load',
                        value: loadTime > 0 ? (loadTime / 1000).toFixed(2) : 'N/A',
                        unit: 's',
                        status: loadTime > 3000 ? 'warning' : 'good',
                    });
                }
            }
            setMetrics(newMetrics);
        };
        updateMetrics();
        const interval = setInterval(updateMetrics, updateInterval);
        return () => clearInterval(interval);
    }, [performanceMetrics, memoryInfo, detailed, updateInterval]);
    // Loading state
    if (isLoading) {
        return (_jsxs("div", { className: `performance-dashboard p-4 rounded-lg border border-border bg-card ${className || ''}`, role: "status", "aria-label": "Loading Performance Dashboard", "aria-busy": "true", children: [_jsxs("div", { className: "animate-pulse", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "h-6 w-40 bg-muted rounded" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3].map((i) => (_jsx("div", { className: "h-4 w-16 bg-muted/60 rounded" }, i))) })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [1, 2, 3, 4].map((i) => (_jsxs("div", { className: "p-3 rounded-lg border border-border/50 bg-muted/30", children: [_jsx("div", { className: "h-4 w-20 bg-muted rounded mb-2" }), _jsx("div", { className: "h-8 w-16 bg-muted rounded" })] }, i))) })] }), _jsx("span", { className: "sr-only", children: "Loading performance metrics..." })] }));
    }
    // Error state
    if (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return (_jsx("div", { className: `performance-dashboard p-4 rounded-lg border border-destructive/30 bg-card ${className || ''}`, role: "alert", "aria-live": "assertive", children: _jsxs("div", { className: "flex flex-col items-center justify-center gap-3 text-center py-6", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10", children: _jsx("svg", { className: "h-5 w-5 text-destructive", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Failed to load performance metrics" }), _jsx("p", { className: "text-xs text-muted-foreground", children: errorMessage })] })] }) }));
    }
    return (_jsxs("div", { className: `performance-dashboard p-4 rounded-lg border border-border bg-card ${className || ''}`, role: "region", "aria-label": "Performance Metrics Dashboard", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Performance Metrics" }), _jsxs("div", { className: "flex items-center gap-4", children: [showExport && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsxs("button", { type: "button", onClick: () => handleExport('json'), className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50", "aria-label": "Export metrics as JSON", children: [_jsx("svg", { className: "h-3.5 w-3.5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) }), "JSON"] }), _jsx("button", { type: "button", onClick: () => handleExport('csv'), className: "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring/50", "aria-label": "Export metrics as CSV", children: "CSV" })] })), _jsxs("div", { className: "flex gap-2 text-xs text-muted-foreground", role: "legend", "aria-label": "Status indicator legend", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[hsl(var(--success))]", "aria-hidden": "true" }), "Good"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-[hsl(var(--warning))]", "aria-hidden": "true" }), "Warning"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-destructive", "aria-hidden": "true" }), "Poor"] })] })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", role: "list", "aria-label": "Performance metrics list", children: metrics.map((metric) => (_jsxs("div", { className: "p-3 rounded-lg border border-border/50 bg-muted/30 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] transition-all duration-150 ease-out", role: "listitem", "aria-label": `${metric.name}: ${metric.value}${metric.unit || ''}, status ${metric.status}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: metric.name }), _jsx("span", { className: `w-2 h-2 rounded-full ${metric.status === 'good'
                                        ? 'bg-[hsl(var(--success))]'
                                        : metric.status === 'warning'
                                            ? 'bg-[hsl(var(--warning))]'
                                            : 'bg-destructive'}`, role: "img", "aria-label": `Status: ${metric.status}` })] }), _jsxs("div", { className: "text-2xl font-bold text-foreground", children: [metric.value, metric.unit && (_jsx("span", { className: "text-sm ml-1 text-muted-foreground", children: metric.unit }))] })] }, metric.name))) }), detailed && (_jsx("div", { className: "mt-4 p-3 rounded-md bg-muted text-xs", children: _jsx("p", { className: "text-muted-foreground", children: "\uD83D\uDCA1 Tip: Keep render times below 16ms for 60fps. Monitor memory usage to prevent leaks." }) }))] }));
}
/**
 * Performance Badge - shows current render performance status
 */
function formatBytes(bytes) {
    if (bytes <= 0 || !Number.isFinite(bytes))
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}
/**
 * Compact Performance Badge
 *
 * Small performance indicator for corners
 */
PerformanceDashboard.displayName = 'PerformanceDashboard';
export function PerformanceBadge({ className }) {
    const performanceMetrics = useRenderPerformance('PerformanceBadge');
    const memoryInfo = useMemoryUsage();
    const status = React.useMemo(() => {
        if (performanceMetrics.lastRenderTime > 50)
            return 'poor';
        if (performanceMetrics.lastRenderTime > 16)
            return 'warning';
        if (memoryInfo &&
            memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9)
            return 'poor';
        if (memoryInfo &&
            memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.7)
            return 'warning';
        return 'good';
    }, [performanceMetrics.lastRenderTime, memoryInfo]);
    return (_jsxs("div", { className: `performance-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border/50 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] transition-all duration-150 ease-out hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] ${status === 'good'
            ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20'
            : status === 'warning'
                ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20'
                : 'bg-destructive/10 text-destructive border-destructive/20'} ${className || ''}`, title: `Last render: ${performanceMetrics.lastRenderTime.toFixed(2)}ms`, role: "status", "aria-label": `Performance status: ${status}, last render ${performanceMetrics.lastRenderTime.toFixed(1)} milliseconds`, children: [_jsx("span", { className: `w-2 h-2 rounded-full ${status === 'good'
                    ? 'bg-[hsl(var(--success))]'
                    : status === 'warning'
                        ? 'bg-[hsl(var(--warning))]'
                        : 'bg-destructive'}`, "aria-hidden": "true" }), performanceMetrics.lastRenderTime.toFixed(1), "ms"] }));
}
PerformanceBadge.displayName = 'PerformanceBadge';
//# sourceMappingURL=performance-dashboard.js.map