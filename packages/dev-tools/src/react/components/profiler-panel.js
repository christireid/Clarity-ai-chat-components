/**
 * Performance Profiler Panel Component
 * React 19 component using useOptimistic for real-time metrics
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { useProfiler } from '../hooks/use-profiler';
/**
 * Performance Profiler Panel Component
 * Displays real-time performance metrics with optimistic updates
 */
export function ProfilerPanel({ className }) {
    const { metrics, enabled, summary, setEnabled, clear, } = useProfiler();
    return (_jsxs("div", { className: className, "data-testid": "profiler-panel", children: [_jsxs("div", { className: "profiler-header", children: [_jsx("h2", { children: "Performance Profiler" }), _jsxs("div", { className: "profiler-controls", children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked) }), "Enabled"] }), _jsx("button", { onClick: clear, children: "Clear" })] })] }), summary.totalOperations > 0 && (_jsxs("div", { className: "profiler-summary", children: [_jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Total Operations:" }), _jsx("span", { className: "summary-value", children: summary.totalOperations })] }), _jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Total Duration:" }), _jsxs("span", { className: "summary-value", children: [summary.totalDuration.toFixed(2), "ms"] })] }), _jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Average Duration:" }), _jsxs("span", { className: "summary-value", children: [summary.avgDuration.toFixed(2), "ms"] })] }), summary.slowestOperation && (_jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Slowest:" }), _jsxs("span", { className: "summary-value", children: [summary.slowestOperation.name, " (", summary.slowestOperation.duration?.toFixed(2), "ms)"] })] })), summary.fastestOperation && (_jsxs("div", { className: "summary-item", children: [_jsx("span", { className: "summary-label", children: "Fastest:" }), _jsxs("span", { className: "summary-value", children: [summary.fastestOperation.name, " (", summary.fastestOperation.duration?.toFixed(2), "ms)"] })] }))] })), _jsx("div", { className: "profiler-metrics", children: metrics.length === 0 ? (_jsx("div", { className: "empty-state", children: "No metrics recorded yet" })) : (_jsx("div", { className: "metrics-list", children: metrics
                        .filter(m => m.duration !== undefined)
                        .sort((a, b) => (b.duration || 0) - (a.duration || 0))
                        .map((metric) => (_jsx(MetricItem, { metric: metric }, metric.name))) })) })] }));
}
function MetricItem({ metric }) {
    const [expanded, setExpanded] = React.useState(false);
    return (_jsxs("div", { className: "metric-item", children: [_jsxs("div", { className: "metric-header", onClick: () => setExpanded(!expanded), children: [_jsxs("div", { className: "metric-info", children: [_jsx("span", { className: "metric-name", children: metric.name }), metric.duration && (_jsxs("span", { className: "metric-duration", children: [metric.duration.toFixed(2), "ms"] }))] }), metric.memoryDelta && (_jsxs("div", { className: "metric-memory", children: [(metric.memoryDelta.heapUsed / 1024 / 1024).toFixed(2), " MB"] }))] }), expanded && (_jsxs("div", { className: "metric-details", children: [_jsxs("div", { className: "detail-item", children: [_jsx("span", { children: "Start Time:" }), _jsx("span", { children: new Date(metric.startTime).toLocaleTimeString() })] }), metric.endTime && (_jsxs("div", { className: "detail-item", children: [_jsx("span", { children: "End Time:" }), _jsx("span", { children: new Date(metric.endTime).toLocaleTimeString() })] })), metric.memoryDelta && (_jsxs("div", { className: "detail-item", children: [_jsx("span", { children: "Memory Delta:" }), _jsxs("span", { children: ["Heap: ", (metric.memoryDelta.heapUsed / 1024 / 1024).toFixed(2), " MB"] })] })), metric.custom && (_jsxs("div", { className: "detail-item", children: [_jsx("span", { children: "Custom:" }), _jsx("pre", { children: JSON.stringify(metric.custom, null, 2) })] }))] }))] }));
}
//# sourceMappingURL=profiler-panel.js.map