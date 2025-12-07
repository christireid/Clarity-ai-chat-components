/**
 * API Inspector Panel Component
 * React 19 component using useOptimistic for real-time updates
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { useAPIInspector } from '../hooks/use-api-inspector';
/**
 * API Inspector Panel Component
 * Displays real-time API call logs with optimistic updates
 */
export function APIInspectorPanel({ className, maxLogs = 100 }) {
    const { logs, enabled, verbose, stats, setEnabled, setVerbose, clearLogs, } = useAPIInspector();
    const displayLogs = React.useMemo(() => {
        return logs.slice(-maxLogs);
    }, [logs, maxLogs]);
    return (_jsxs("div", { className: className, "data-testid": "api-inspector-panel", children: [_jsxs("div", { className: "api-inspector-header", children: [_jsx("h2", { children: "API Inspector" }), _jsxs("div", { className: "api-inspector-controls", children: [_jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked) }), "Enabled"] }), _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: verbose, onChange: (e) => setVerbose(e.target.checked) }), "Verbose"] }), _jsx("button", { onClick: clearLogs, children: "Clear" })] })] }), _jsxs("div", { className: "api-inspector-stats", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Calls:" }), _jsx("span", { className: "stat-value", children: stats.totalCalls })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Completed:" }), _jsx("span", { className: "stat-value", children: stats.completedCalls })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Errors:" }), _jsx("span", { className: "stat-value", children: stats.errorCalls })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Avg Response:" }), _jsxs("span", { className: "stat-value", children: [stats.averageResponseTime.toFixed(2), "ms"] })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Tokens:" }), _jsx("span", { className: "stat-value", children: stats.totalUsage.totalTokens })] })] }), _jsx("div", { className: "api-inspector-logs", children: displayLogs.length === 0 ? (_jsx("div", { className: "empty-state", children: "No API calls logged yet" })) : (_jsx("div", { className: "logs-list", children: displayLogs.map((log) => (_jsx(APICallLogItem, { log: log, verbose: verbose }, log.id))) })) })] }));
}
function APICallLogItem({ log, verbose }) {
    const [expanded, setExpanded] = React.useState(false);
    return (_jsxs("div", { className: `api-call-log ${log.error ? 'error' : ''}`, children: [_jsxs("div", { className: "log-header", onClick: () => setExpanded(!expanded), children: [_jsxs("div", { className: "log-info", children: [_jsx("span", { className: "log-provider", children: log.provider }), _jsx("span", { className: "log-model", children: log.model }), _jsx("span", { className: "log-endpoint", children: log.endpoint })] }), _jsxs("div", { className: "log-metrics", children: [log.timing.duration && (_jsxs("span", { className: "log-duration", children: [log.timing.duration.toFixed(2), "ms"] })), log.usage && (_jsxs("span", { className: "log-tokens", children: [log.usage.totalTokens, " tokens"] })), log.error && _jsx("span", { className: "log-error", children: "\u274C" })] })] }), expanded && (_jsx("div", { className: "log-details", children: verbose && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "log-section", children: [_jsx("h4", { children: "Request" }), _jsx("pre", { children: JSON.stringify(log.request, null, 2) })] }), log.response && (_jsxs("div", { className: "log-section", children: [_jsx("h4", { children: "Response" }), _jsx("pre", { children: JSON.stringify(log.response, null, 2) })] })), log.error && (_jsxs("div", { className: "log-section error", children: [_jsx("h4", { children: "Error" }), _jsx("pre", { children: log.error.message })] }))] })) }))] }));
}
//# sourceMappingURL=api-inspector-panel.js.map