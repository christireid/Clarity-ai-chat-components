/**
 * Performance Profiler Panel Component
 * Premium performance monitoring with visual metrics and charts
 * React 19 component using useOptimistic for real-time metrics
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
// Helper function for formatting
function formatDuration(ms) {
    if (ms < 1)
        return `${(ms * 1000).toFixed(2)}µs`;
    if (ms < 1000)
        return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}
import { useProfiler } from '../hooks/use-profiler';
import { ZapIcon, ClockIcon, TrendingUpIcon, TrendingDownIcon, TrashIcon, ActivityIcon, ChevronDownIcon, MemoryIcon, ArrowUpDownIcon, } from './icons';
/**
 * Performance Profiler Panel Component
 * Displays real-time performance metrics with visual charts
 */
export function ProfilerPanel({ className, showThresholds = true, warningThreshold = 100, errorThreshold = 500, enableGrouping = true, sortOrder = 'duration', }) {
    const { metrics, enabled, summary, setEnabled, clear } = useProfiler();
    const [expandedMetric, setExpandedMetric] = React.useState(null);
    const [currentSortOrder, setCurrentSortOrder] = React.useState(sortOrder);
    // Calculate max duration for scaling bars
    const maxDuration = React.useMemo(() => {
        const completedMetrics = metrics.filter((m) => m.duration !== undefined);
        if (completedMetrics.length === 0)
            return 100;
        return Math.max(...completedMetrics.map((m) => m.duration || 0));
    }, [metrics]);
    // Sort metrics based on current order
    const sortedMetrics = React.useMemo(() => {
        const completedMetrics = metrics.filter((m) => m.duration !== undefined);
        return [...completedMetrics].sort((a, b) => {
            switch (currentSortOrder) {
                case 'duration':
                    return (b.duration || 0) - (a.duration || 0);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'time':
                    return b.startTime - a.startTime;
                default:
                    return 0;
            }
        });
    }, [metrics, currentSortOrder]);
    // Get performance level based on duration
    const getPerformanceLevel = (duration) => {
        if (duration >= errorThreshold)
            return 'critical';
        if (duration >= warningThreshold)
            return 'warning';
        return 'good';
    };
    // Toggle metric expansion
    const toggleMetric = (name) => {
        setExpandedMetric((prev) => (prev === name ? null : name));
    };
    // Cycle through sort orders
    const cycleSortOrder = () => {
        setCurrentSortOrder((prev) => {
            switch (prev) {
                case 'duration':
                    return 'name';
                case 'name':
                    return 'time';
                case 'time':
                    return 'duration';
                default:
                    return 'duration';
            }
        });
    };
    return (_jsxs("div", { className: `profiler-panel ${className || ''}`, "data-testid": "profiler-panel", children: [_jsxs("header", { className: "profiler-header", children: [_jsxs("h2", { children: [_jsx(ZapIcon, { size: "lg" }), "Performance Profiler"] }), _jsxs("div", { className: "profiler-controls", children: [_jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked), "aria-label": "Enable profiler" }), _jsx("span", { className: "toggle-track", "aria-hidden": "true" }), _jsx("span", { className: "toggle-label", children: "Enabled" })] }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: clear, "aria-label": "Clear metrics", title: "Clear all metrics", children: _jsx(TrashIcon, {}) })] })] }), summary.totalOperations > 0 && (_jsxs("div", { className: "profiler-summary", role: "region", "aria-label": "Performance summary", children: [_jsxs("div", { className: "summary-item", children: [_jsx("div", { className: "summary-icon", children: _jsx(ActivityIcon, { size: "xl" }) }), _jsxs("div", { className: "summary-content", children: [_jsx("span", { className: "summary-label", children: "Operations" }), _jsx("span", { className: "summary-value", children: summary.totalOperations })] })] }), _jsxs("div", { className: "summary-item", children: [_jsx("div", { className: "summary-icon", children: _jsx(ClockIcon, {}) }), _jsxs("div", { className: "summary-content", children: [_jsx("span", { className: "summary-label", children: "Total Time" }), _jsx("span", { className: "summary-value", children: formatDuration(summary.totalDuration) })] })] }), _jsxs("div", { className: "summary-item", children: [_jsx("div", { className: "summary-icon", children: _jsx(TrendingUpIcon, {}) }), _jsxs("div", { className: "summary-content", children: [_jsx("span", { className: "summary-label", children: "Average" }), _jsx("span", { className: "summary-value", children: formatDuration(summary.avgDuration) })] })] }), summary.slowestOperation && (_jsxs("div", { className: "summary-item highlight-slow", children: [_jsx("div", { className: "summary-icon", children: _jsx(TrendingDownIcon, {}) }), _jsxs("div", { className: "summary-content", children: [_jsx("span", { className: "summary-label", children: "Slowest" }), _jsxs("span", { className: "summary-value", children: [summary.slowestOperation.name, _jsx("span", { className: "summary-detail", children: formatDuration(summary.slowestOperation.duration || 0) })] })] })] })), summary.fastestOperation && (_jsxs("div", { className: "summary-item highlight-fast", children: [_jsx("div", { className: "summary-icon", children: _jsx(ZapIcon, {}) }), _jsxs("div", { className: "summary-content", children: [_jsx("span", { className: "summary-label", children: "Fastest" }), _jsxs("span", { className: "summary-value", children: [summary.fastestOperation.name, _jsx("span", { className: "summary-detail", children: formatDuration(summary.fastestOperation.duration || 0) })] })] })] }))] })), showThresholds && sortedMetrics.length > 0 && (_jsxs("div", { className: "profiler-legend", role: "region", "aria-label": "Performance thresholds", children: [_jsxs("div", { className: "legend-item good", children: [_jsx("span", { className: "legend-dot" }), _jsxs("span", { children: ["Good (<", warningThreshold, "ms)"] })] }), _jsxs("div", { className: "legend-item warning", children: [_jsx("span", { className: "legend-dot" }), _jsxs("span", { children: ["Warning (", warningThreshold, "-", errorThreshold, "ms)"] })] }), _jsxs("div", { className: "legend-item critical", children: [_jsx("span", { className: "legend-dot" }), _jsxs("span", { children: ["Critical (>", errorThreshold, "ms)"] })] })] })), sortedMetrics.length > 0 && (_jsxs("div", { className: "profiler-toolbar", children: [_jsxs("button", { className: "dt-btn dt-btn-ghost dt-btn-sm", onClick: cycleSortOrder, "aria-label": `Sort by ${currentSortOrder}`, children: [_jsx(ArrowUpDownIcon, { size: "sm" }), _jsxs("span", { children: ["Sort: ", currentSortOrder] })] }), _jsxs("span", { className: "metrics-count", children: [sortedMetrics.length, " operation", sortedMetrics.length !== 1 ? 's' : ''] })] })), _jsx("div", { className: "profiler-metrics", role: "list", "aria-label": "Performance metrics", children: sortedMetrics.length === 0 ? (_jsx(EmptyState, {})) : (_jsx("div", { className: "metrics-list", children: sortedMetrics.map((metric) => (_jsx(MetricItem, { metric: metric, maxDuration: maxDuration, performanceLevel: getPerformanceLevel(metric.duration || 0), expanded: expandedMetric === metric.name, onToggle: () => toggleMetric(metric.name) }, metric.name))) })) })] }));
}
/**
 * Empty state component
 */
function EmptyState() {
    return (_jsxs("div", { className: "empty-state", role: "status", children: [_jsx("div", { className: "empty-state-icon", "aria-hidden": "true", children: _jsx(ActivityIcon, { size: "xl" }) }), _jsx("h3", { className: "empty-state-title", children: "No metrics recorded" }), _jsx("p", { className: "empty-state-description", children: "Performance metrics will appear here as operations are profiled. Make sure the profiler is enabled." })] }));
}
function MetricItem({ metric, maxDuration, performanceLevel, expanded, onToggle, }) {
    const barWidth = Math.min(100, ((metric.duration || 0) / maxDuration) * 100);
    return (_jsxs("article", { className: `metric-item ${performanceLevel} ${expanded ? 'expanded' : ''}`, role: "listitem", children: [_jsxs("div", { className: "metric-header", onClick: onToggle, onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggle();
                    }
                }, role: "button", tabIndex: 0, "aria-expanded": expanded, children: [_jsxs("div", { className: "metric-info", children: [_jsx("span", { className: "metric-name", children: metric.name }), _jsx("span", { className: `metric-duration ${performanceLevel}`, children: formatDuration(metric.duration || 0) })] }), metric.memoryDelta && (_jsxs("div", { className: "metric-memory", "aria-label": `Memory change: ${formatMemory(metric.memoryDelta.heapUsed)}`, children: [_jsx(MemoryIcon, {}), _jsx("span", { children: formatMemory(metric.memoryDelta.heapUsed) })] })), _jsx("span", { className: "expand-icon", "aria-hidden": "true", children: _jsx(ChevronDownIcon, {}) })] }), _jsx("div", { className: "metric-bar-container", children: _jsx("div", { className: "metric-bar", role: "progressbar", "aria-valuenow": barWidth, "aria-valuemin": 0, "aria-valuemax": 100, children: _jsx("div", { className: `metric-bar-fill ${performanceLevel}`, style: { width: `${barWidth}%` } }) }) }), expanded && (_jsxs("div", { className: "metric-details", role: "region", "aria-label": "Metric details", children: [_jsxs("dl", { className: "metric-details-list", children: [_jsxs("div", { className: "detail-item", children: [_jsx("dt", { children: "Start Time" }), _jsx("dd", { children: new Date(metric.startTime).toLocaleTimeString() })] }), metric.endTime && (_jsxs("div", { className: "detail-item", children: [_jsx("dt", { children: "End Time" }), _jsx("dd", { children: new Date(metric.endTime).toLocaleTimeString() })] })), metric.duration !== undefined && (_jsxs("div", { className: "detail-item", children: [_jsx("dt", { children: "Duration" }), _jsxs("dd", { className: "highlight", children: [metric.duration.toFixed(3), "ms"] })] })), metric.memoryDelta && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "detail-item", children: [_jsx("dt", { children: "Heap Used" }), _jsx("dd", { children: formatMemory(metric.memoryDelta.heapUsed) })] }), _jsxs("div", { className: "detail-item", children: [_jsx("dt", { children: "Heap Total" }), _jsx("dd", { children: formatMemory(metric.memoryDelta.heapTotal) })] }), _jsxs("div", { className: "detail-item", children: [_jsx("dt", { children: "External" }), _jsx("dd", { children: formatMemory(metric.memoryDelta.external) })] })] })), metric.custom && Object.keys(metric.custom).length > 0 && (_jsxs("div", { className: "detail-item full-width", children: [_jsx("dt", { children: "Custom Data" }), _jsx("dd", { children: _jsx("pre", { className: "code-block", children: _jsx("code", { children: JSON.stringify(metric.custom, null, 2) }) }) })] }))] }), metric.duration !== undefined && (_jsxs("div", { className: "performance-breakdown", children: [_jsx("h5", { children: "Performance Analysis" }), _jsxs("div", { className: "breakdown-chart", children: [_jsxs("div", { className: "breakdown-item", children: [_jsx("span", { className: "breakdown-label", children: "Execution Time" }), _jsx("div", { className: "breakdown-bar", children: _jsx("div", { className: `breakdown-fill ${performanceLevel}`, style: { width: `${barWidth}%` } }) }), _jsxs("span", { className: "breakdown-value", children: [metric.duration.toFixed(1), "ms"] })] }), metric.memoryDelta && metric.memoryDelta.heapUsed > 0 && (_jsxs("div", { className: "breakdown-item", children: [_jsx("span", { className: "breakdown-label", children: "Memory Impact" }), _jsx("div", { className: "breakdown-bar", children: _jsx("div", { className: "breakdown-fill memory", style: {
                                                        width: `${Math.min(100, (metric.memoryDelta.heapUsed / 1024 / 1024) * 10)}%`,
                                                    } }) }), _jsx("span", { className: "breakdown-value", children: formatMemory(metric.memoryDelta.heapUsed) })] }))] })] }))] }))] }));
}
/**
 * Format memory for display
 */
function formatMemory(bytes) {
    const absBytes = Math.abs(bytes);
    const sign = bytes < 0 ? '-' : '+';
    if (absBytes < 1024)
        return `${sign}${absBytes}B`;
    if (absBytes < 1024 * 1024)
        return `${sign}${(absBytes / 1024).toFixed(1)}KB`;
    return `${sign}${(absBytes / 1024 / 1024).toFixed(2)}MB`;
}
//# sourceMappingURL=profiler-panel.js.map