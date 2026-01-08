/**
 * API Inspector Panel Component
 * Premium API call monitoring with filtering, search, and export
 * React 19 component using useOptimistic for real-time updates
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { useAPIInspector } from '../hooks/use-api-inspector';
import { SearchIcon, DownloadIcon, CopyIcon, CheckIcon, ChevronDownIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon, TrashIcon, InboxIcon, } from './icons';
/**
 * API Inspector Panel Component
 * Premium API call monitoring with real-time updates
 */
export function APIInspectorPanel({ className, maxLogs = 100, autoScroll = true, showToolbar = true, enableExport = true, }) {
    const { logs, enabled, verbose, stats, setEnabled, setVerbose, clearLogs } = useAPIInspector();
    // Local state for filtering and search
    const [searchQuery, setSearchQuery] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all');
    const [providerFilter, setProviderFilter] = React.useState('all');
    const [copiedId, setCopiedId] = React.useState(null);
    const logsContainerRef = React.useRef(null);
    // Filter and search logs
    const filteredLogs = React.useMemo(() => {
        let result = logs.slice(-maxLogs);
        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter((log) => {
                if (statusFilter === 'error')
                    return log.error;
                if (statusFilter === 'completed')
                    return !log.error && log.timing.endTime;
                if (statusFilter === 'pending')
                    return !log.timing.endTime;
                return true;
            });
        }
        // Apply provider filter
        if (providerFilter !== 'all') {
            result = result.filter((log) => log.provider.toLowerCase() === providerFilter.toLowerCase());
        }
        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((log) => log.provider.toLowerCase().includes(query) ||
                log.model.toLowerCase().includes(query) ||
                log.endpoint.toLowerCase().includes(query) ||
                log.id.toLowerCase().includes(query));
        }
        return result;
    }, [logs, maxLogs, statusFilter, providerFilter, searchQuery]);
    // Auto-scroll to latest
    React.useEffect(() => {
        if (autoScroll && logsContainerRef.current) {
            logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
        }
    }, [logs.length, autoScroll]);
    // Export logs to JSON
    const handleExport = React.useCallback(() => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            stats,
            logs: filteredLogs,
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-inspector-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [filteredLogs, stats]);
    // Copy log to clipboard
    const handleCopyLog = React.useCallback(async (log) => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(log, null, 2));
            setCopiedId(log.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
        catch (err) {
            console.error('Failed to copy:', err);
        }
    }, []);
    return (_jsxs("div", { className: `api-inspector-panel ${className || ''}`, "data-testid": "api-inspector-panel", children: [_jsxs("header", { className: "api-inspector-header", children: [_jsxs("h2", { children: [_jsx("span", { className: "sr-only", children: "API" }), "API Inspector"] }), _jsxs("div", { className: "api-inspector-controls", children: [_jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: enabled, onChange: (e) => setEnabled(e.target.checked), "aria-label": "Enable API inspector" }), _jsx("span", { className: "toggle-track", "aria-hidden": "true" }), _jsx("span", { className: "toggle-label", children: "Enabled" })] }), _jsxs("label", { className: "toggle-switch", children: [_jsx("input", { type: "checkbox", checked: verbose, onChange: (e) => setVerbose(e.target.checked), "aria-label": "Enable verbose mode" }), _jsx("span", { className: "toggle-track", "aria-hidden": "true" }), _jsx("span", { className: "toggle-label", children: "Verbose" })] }), _jsx("button", { className: "dt-btn dt-btn-ghost dt-btn-icon", onClick: clearLogs, "aria-label": "Clear all logs", title: "Clear logs", children: _jsx(TrashIcon, {}) })] })] }), _jsxs("div", { className: "api-inspector-stats", role: "region", "aria-label": "API call statistics", children: [_jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Calls" }), _jsx("span", { className: "stat-value", children: stats.totalCalls })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Completed" }), _jsx("span", { className: "stat-value highlight", children: stats.completedCalls })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Errors" }), _jsx("span", { className: `stat-value ${stats.errorCalls > 0 ? 'error' : ''}`, children: stats.errorCalls })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Avg Response" }), _jsxs("span", { className: "stat-value", children: [stats.averageResponseTime.toFixed(0), "ms"] })] }), _jsxs("div", { className: "stat", children: [_jsx("span", { className: "stat-label", children: "Total Tokens" }), _jsx("span", { className: "stat-value", children: stats.totalUsage.totalTokens.toLocaleString() })] })] }), showToolbar && (_jsxs("div", { className: "api-inspector-toolbar", role: "toolbar", "aria-label": "Filter and search controls", children: [_jsxs("div", { className: "search-input-wrapper", children: [_jsx("span", { className: "search-icon", "aria-hidden": "true", children: _jsx(SearchIcon, {}) }), _jsx("input", { type: "search", className: "search-input", placeholder: "Search by provider, model, endpoint...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), "aria-label": "Search logs" })] }), _jsx("div", { className: "filter-group", role: "group", "aria-label": "Status filter", children: ['all', 'completed', 'pending', 'error'].map((status) => (_jsx("button", { className: `filter-button ${statusFilter === status ? 'active' : ''}`, onClick: () => setStatusFilter(status), "aria-pressed": statusFilter === status, children: status === 'all'
                                ? 'All'
                                : status.charAt(0).toUpperCase() + status.slice(1) }, status))) }), _jsx("div", { className: "filter-group", role: "group", "aria-label": "Provider filter", children: ['all', 'openai', 'anthropic', 'google'].map((provider) => (_jsx("button", { className: `filter-button ${providerFilter === provider ? 'active' : ''}`, onClick: () => setProviderFilter(provider), "aria-pressed": providerFilter === provider, children: provider === 'all'
                                ? 'All'
                                : provider.charAt(0).toUpperCase() + provider.slice(1) }, provider))) }), enableExport && filteredLogs.length > 0 && (_jsxs("button", { className: "dt-btn dt-btn-ghost", onClick: handleExport, "aria-label": "Export logs to JSON", children: [_jsx(DownloadIcon, {}), _jsx("span", { children: "Export" })] }))] })), _jsx("div", { ref: logsContainerRef, className: "api-inspector-logs", role: "log", "aria-label": "API call logs", "aria-live": "polite", children: filteredLogs.length === 0 ? (_jsx(EmptyState, { hasFilters: searchQuery !== '' ||
                        statusFilter !== 'all' ||
                        providerFilter !== 'all' })) : (_jsx("div", { className: "logs-list", children: filteredLogs.map((log) => (_jsx(APICallLogItem, { log: log, verbose: verbose, onCopy: handleCopyLog, isCopied: copiedId === log.id }, log.id))) })) }), filteredLogs.length > 0 && (_jsx("div", { className: "api-inspector-footer", children: _jsxs("span", { className: "results-count", children: ["Showing ", filteredLogs.length, " of ", logs.length, " logs"] }) }))] }));
}
/**
 * Empty state component
 */
function EmptyState({ hasFilters }) {
    return (_jsxs("div", { className: "empty-state", role: "status", children: [_jsx("div", { className: "empty-state-icon", "aria-hidden": "true", children: _jsx(InboxIcon, { size: "xl" }) }), _jsx("h3", { className: "empty-state-title", children: hasFilters ? 'No matching logs' : 'No API calls yet' }), _jsx("p", { className: "empty-state-description", children: hasFilters
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : 'API calls will appear here as they happen. Make sure the inspector is enabled.' })] }));
}
function APICallLogItem({ log, verbose, onCopy, isCopied, }) {
    const [expanded, setExpanded] = React.useState(false);
    const status = log.error
        ? 'error'
        : log.timing.endTime
            ? 'completed'
            : 'pending';
    const statusIcon = {
        error: _jsx(AlertCircleIcon, {}),
        completed: _jsx(CheckCircleIcon, {}),
        pending: _jsx(ClockIcon, {}),
    }[status];
    const providerClass = log.provider.toLowerCase();
    return (_jsxs("article", { className: `api-call-log ${status} ${expanded ? 'expanded' : ''}`, "aria-label": `${log.provider} API call to ${log.endpoint}`, children: [_jsxs("div", { className: "log-header", onClick: () => setExpanded(!expanded), onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setExpanded(!expanded);
                    }
                }, role: "button", tabIndex: 0, "aria-expanded": expanded, "aria-controls": `log-details-${log.id}`, children: [_jsxs("div", { className: "log-info", children: [_jsx("span", { className: `log-provider ${providerClass}`, "aria-label": `Provider: ${log.provider}`, children: log.provider }), _jsx("span", { className: "log-model", "aria-label": `Model: ${log.model}`, children: log.model }), _jsx("span", { className: "log-endpoint", "aria-label": `Endpoint: ${log.endpoint}`, children: log.endpoint })] }), _jsxs("div", { className: "log-metrics", children: [log.timing.duration !== undefined && (_jsxs("span", { className: "log-duration", "aria-label": `Duration: ${log.timing.duration.toFixed(0)} milliseconds`, children: [log.timing.duration.toFixed(0), "ms"] })), log.usage && (_jsxs("span", { className: "log-tokens", "aria-label": `Tokens: ${log.usage.totalTokens}`, children: [log.usage.totalTokens.toLocaleString(), " tokens"] })), _jsx("span", { className: `log-status ${status}`, "aria-label": `Status: ${status}`, children: statusIcon }), _jsx("span", { className: "expand-icon", "aria-hidden": "true", children: _jsx(ChevronDownIcon, {}) })] })] }), expanded && (_jsxs("div", { id: `log-details-${log.id}`, className: "log-details", role: "region", "aria-label": "Log details", children: [_jsxs("section", { className: "log-section", children: [_jsxs("header", { className: "log-section-header", children: [_jsx("h4", { children: "Timing" }), _jsxs("button", { className: "dt-btn dt-btn-ghost dt-btn-sm", onClick: (e) => {
                                            e.stopPropagation();
                                            onCopy(log);
                                        }, "aria-label": isCopied ? 'Copied!' : 'Copy log to clipboard', children: [isCopied ? _jsx(CheckIcon, {}) : _jsx(CopyIcon, {}), _jsx("span", { children: isCopied ? 'Copied!' : 'Copy' })] })] }), _jsxs("dl", { className: "timing-details", children: [_jsxs("div", { className: "timing-item", children: [_jsx("dt", { children: "Start Time" }), _jsx("dd", { children: new Date(log.timing.startTime).toLocaleTimeString() })] }), log.timing.endTime && (_jsxs("div", { className: "timing-item", children: [_jsx("dt", { children: "End Time" }), _jsx("dd", { children: new Date(log.timing.endTime).toLocaleTimeString() })] })), log.timing.ttfb !== undefined && (_jsxs("div", { className: "timing-item", children: [_jsx("dt", { children: "Time to First Byte" }), _jsxs("dd", { children: [log.timing.ttfb.toFixed(0), "ms"] })] })), log.timing.duration !== undefined && (_jsxs("div", { className: "timing-item", children: [_jsx("dt", { children: "Total Duration" }), _jsxs("dd", { children: [log.timing.duration.toFixed(2), "ms"] })] }))] })] }), log.usage && (_jsxs("section", { className: "log-section", children: [_jsx("h4", { children: "Token Usage" }), _jsxs("dl", { className: "usage-details", children: [_jsxs("div", { className: "usage-item", children: [_jsx("dt", { children: "Prompt Tokens" }), _jsx("dd", { children: log.usage.promptTokens.toLocaleString() })] }), _jsxs("div", { className: "usage-item", children: [_jsx("dt", { children: "Completion Tokens" }), _jsx("dd", { children: log.usage.completionTokens.toLocaleString() })] }), _jsxs("div", { className: "usage-item", children: [_jsx("dt", { children: "Total Tokens" }), _jsx("dd", { className: "highlight", children: log.usage.totalTokens.toLocaleString() })] })] })] })), verbose && (_jsxs(_Fragment, { children: [_jsxs("section", { className: "log-section", children: [_jsx("h4", { children: "Request" }), _jsx("pre", { className: "code-block", children: _jsx("code", { children: JSON.stringify(log.request, null, 2) }) })] }), log.response && (_jsxs("section", { className: "log-section", children: [_jsx("h4", { children: "Response" }), _jsx("pre", { className: "code-block", children: _jsx("code", { children: JSON.stringify(log.response, null, 2) }) })] }))] })), log.error && (_jsxs("section", { className: "log-section error", children: [_jsx("h4", { children: "Error" }), _jsxs("div", { className: "error-details", children: [_jsx("p", { className: "error-message", children: log.error.message }), log.error.code && (_jsxs("p", { className: "error-code", children: ["Code: ", log.error.code] }))] })] }))] }))] }));
}
//# sourceMappingURL=api-inspector-panel.js.map