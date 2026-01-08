import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Console Panel Component
 *
 * A beautifully designed console output viewer with:
 * - Filter by log level
 * - Copy individual entries or all logs
 * - Collapsible entries with syntax highlighting
 * - Auto-scroll with smart behavior
 * - Smooth animations
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronUp, AlertCircle, Info, AlertTriangle, Copy, Check, Filter, } from 'lucide-react';
import { copyToClipboard, cn } from '../utils';
// Level configuration
const levelConfig = {
    log: {
        icon: Terminal,
        label: 'Log',
        iconColor: 'text-gray-500 dark:text-gray-400',
        bgColor: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50',
        badgeColor: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
    },
    info: {
        icon: Info,
        label: 'Info',
        iconColor: 'text-blue-500 dark:text-blue-400',
        bgColor: 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20',
        badgeColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    },
    warn: {
        icon: AlertTriangle,
        label: 'Warning',
        iconColor: 'text-amber-500 dark:text-amber-400',
        bgColor: 'bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20',
        badgeColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    },
    error: {
        icon: AlertCircle,
        label: 'Error',
        iconColor: 'text-rose-500 dark:text-rose-400',
        bgColor: 'bg-rose-50/50 dark:bg-rose-900/10 hover:bg-rose-50 dark:hover:bg-rose-900/20',
        badgeColor: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    },
};
// Filter button component
function FilterButton({ level, count, isActive, onClick, }) {
    const config = levelConfig[level];
    return (_jsxs("button", { onClick: onClick, className: cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200', isActive
            ? config?.badgeColor ||
                'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'), "aria-pressed": isActive, children: [level === 'all' ? 'All' : config?.label, count > 0 && (_jsx("span", { className: cn('min-w-[18px] h-[18px] px-1 rounded-full text-[10px] flex items-center justify-center', isActive ? 'bg-white/30' : 'bg-gray-200 dark:bg-gray-600'), children: count > 99 ? '99+' : count }))] }));
}
// Single console entry component
function ConsoleEntry({ entry, onCopy, }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);
    const config = levelConfig[entry.level];
    const Icon = config.icon;
    const hasLongContent = entry.message.length > 200 ||
        entry.message.includes('\n') ||
        (entry.args && entry.args.length > 0);
    const handleCopy = useCallback(() => {
        const fullText = entry.args
            ? `${entry.message} ${entry.args.join(' ')}`
            : entry.message;
        onCopy(fullText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [entry, onCopy]);
    const formatValue = (value) => {
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            }
            catch {
                return String(value);
            }
        }
        return String(value);
    };
    return (_jsxs("div", { className: cn('group relative flex items-start gap-3 px-4 py-3', 'border-b border-gray-100 dark:border-gray-800 last:border-0', 'transition-colors duration-150', config.bgColor), children: [_jsx(Icon, { className: cn('w-4 h-4 flex-shrink-0 mt-0.5', config.iconColor), "aria-hidden": "true" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("pre", { className: cn('text-sm font-mono whitespace-pre-wrap break-words', entry.level === 'error' && 'text-rose-600 dark:text-rose-400', entry.level === 'warn' && 'text-amber-600 dark:text-amber-400', entry.level === 'info' && 'text-blue-600 dark:text-blue-400', entry.level === 'log' && 'text-gray-700 dark:text-gray-300', !isExpanded && hasLongContent && 'line-clamp-3'), children: entry.message }), entry.args &&
                        entry.args.length > 0 &&
                        (isExpanded || !hasLongContent) && (_jsx("div", { className: "mt-2 space-y-1", children: entry.args.map((arg, i) => (_jsx("pre", { className: "text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-x-auto", children: formatValue(arg) }, i))) })), hasLongContent && (_jsx("button", { onClick: () => setIsExpanded(!isExpanded), className: "mt-2 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors", children: isExpanded ? (_jsxs(_Fragment, { children: [_jsx(ChevronUp, { className: "w-3 h-3" }), "Show less"] })) : (_jsxs(_Fragment, { children: [_jsx(ChevronDown, { className: "w-3 h-3" }), "Show more"] })) }))] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500 tabular-nums", children: entry.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }) }), _jsx("button", { onClick: handleCopy, className: cn('opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all duration-150', copied
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'), title: "Copy entry", children: copied ? (_jsx(Check, { className: "w-3 h-3" })) : (_jsx(Copy, { className: "w-3 h-3" })) })] })] }));
}
// Main Console Panel
export function ConsolePanel({ entries, onClear, maxHeight = '250px', className = '', }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [filter, setFilter] = useState('all');
    const [copiedAll, setCopiedAll] = useState(false);
    const scrollRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);
    // Auto-scroll to bottom when new entries are added
    useEffect(() => {
        if (autoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [entries, autoScroll]);
    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
            setAutoScroll(isAtBottom);
        }
    }, []);
    const filteredEntries = entries.filter((entry) => filter === 'all' || entry.level === filter);
    const counts = {
        all: entries.length,
        log: entries.filter((e) => e.level === 'log').length,
        info: entries.filter((e) => e.level === 'info').length,
        warn: entries.filter((e) => e.level === 'warn').length,
        error: entries.filter((e) => e.level === 'error').length,
    };
    const handleCopyEntry = useCallback(async (text) => {
        await copyToClipboard(text);
    }, []);
    const handleCopyAll = useCallback(async () => {
        const text = filteredEntries
            .map((e) => {
            const timestamp = e.timestamp.toLocaleTimeString();
            const args = e.args ? ' ' + e.args.join(' ') : '';
            return `[${timestamp}] [${e.level.toUpperCase()}] ${e.message}${args}`;
        })
            .join('\n');
        const success = await copyToClipboard(text);
        if (success) {
            setCopiedAll(true);
            setTimeout(() => setCopiedAll(false), 2000);
        }
    }, [filteredEntries]);
    return (_jsxs("div", { className: cn('panel overflow-hidden relative', className), role: "region", "aria-label": "Console output", children: [_jsxs("div", { className: "panel-header", children: [_jsxs("button", { onClick: () => setIsCollapsed(!isCollapsed), className: "flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors", "aria-expanded": !isCollapsed, "aria-label": isCollapsed ? 'Expand console' : 'Collapse console', children: [_jsx(Terminal, { className: "w-4 h-4", "aria-hidden": "true" }), _jsx("span", { children: "Console" }), counts.all > 0 && (_jsx("span", { className: "badge badge-neutral", children: counts.all })), counts.error > 0 && (_jsxs("span", { className: "badge badge-error animate-pulse", children: [counts.error, " error", counts.error !== 1 ? 's' : ''] })), _jsx("span", { className: cn('text-gray-400 transition-transform duration-200', isCollapsed ? '-rotate-90' : 'rotate-0'), children: _jsx(ChevronDown, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [!isCollapsed && filteredEntries.length > 0 && (_jsx("button", { onClick: handleCopyAll, className: cn('p-1.5 rounded-lg transition-all duration-150', copiedAll
                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'), title: "Copy all logs", "aria-label": "Copy all logs", children: copiedAll ? (_jsx(Check, { className: "w-4 h-4" })) : (_jsx(Copy, { className: "w-4 h-4" })) })), _jsx("button", { onClick: onClear, className: "p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-150", title: "Clear console", "aria-label": "Clear console", children: _jsx(Trash2, { className: "w-4 h-4", "aria-hidden": "true" }) })] })] }), !isCollapsed && entries.length > 0 && (_jsxs("div", { className: "flex items-center gap-1 px-3 py-2 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700", children: [_jsx(Filter, { className: "w-3 h-3 text-gray-400 mr-1" }), ['all', 'log', 'info', 'warn', 'error'].map((level) => (_jsx(FilterButton, { level: level, count: counts[level], isActive: filter === level, onClick: () => setFilter(level) }, level)))] })), !isCollapsed && (_jsx("div", { ref: scrollRef, onScroll: handleScroll, className: "overflow-y-auto", style: { maxHeight }, role: "log", "aria-live": "polite", "aria-label": "Console output", children: filteredEntries.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3", children: _jsx(Terminal, { className: "w-6 h-6 text-gray-400" }) }), _jsx("p", { className: "text-sm font-medium text-gray-600 dark:text-gray-400", children: entries.length === 0
                                ? 'No console output yet'
                                : `No ${filter} messages` }), _jsx("p", { className: "text-xs text-gray-400 dark:text-gray-500 mt-1", children: entries.length === 0
                                ? 'Run your code to see logs here'
                                : 'Try selecting a different filter' })] })) : (_jsx("div", { className: "animate-fade-in", children: filteredEntries.map((entry) => (_jsx(ConsoleEntry, { entry: entry, onCopy: handleCopyEntry }, entry.id))) })) })), !isCollapsed && !autoScroll && filteredEntries.length > 0 && (_jsxs("button", { onClick: () => {
                    setAutoScroll(true);
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                    }
                }, className: "absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500 text-white text-xs font-medium shadow-lg hover:bg-indigo-600 transition-colors animate-bounce-subtle", children: [_jsx(ChevronDown, { className: "w-3 h-3" }), "New logs"] }))] }));
}
export default ConsolePanel;
//# sourceMappingURL=ConsolePanel.js.map