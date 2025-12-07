'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
export function PlaygroundStateInspector({ state = {}, events = [], className, }) {
    const [expanded, setExpanded] = useState(true);
    const [showEvents, setShowEvents] = useState(false);
    const formatValue = (value) => {
        if (typeof value === 'function')
            return '[Function]';
        if (value === null)
            return 'null';
        if (value === undefined)
            return 'undefined';
        if (typeof value === 'object')
            return JSON.stringify(value, null, 2);
        return String(value);
    };
    return (_jsxs("div", { className: clsx('border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className), children: [_jsxs("button", { onClick: () => setExpanded(!expanded), className: "w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 hover:from-purple-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-2", children: [expanded ? (_jsx(ChevronDown, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })) : (_jsx(ChevronRight, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })), _jsx("span", { className: "font-semibold text-sm text-gray-900 dark:text-gray-50", children: "\uD83D\uDD0D State Inspector" })] }), _jsxs("span", { className: "text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full font-medium", children: [Object.keys(state).length, " properties"] })] }), expanded && (_jsxs("div", { className: "bg-white dark:bg-gray-950", children: [_jsxs("div", { className: "flex border-b border-gray-200 dark:border-gray-700", children: [_jsx("button", { onClick: () => setShowEvents(false), className: clsx('flex-1 px-4 py-2 text-sm font-medium transition-colors border-b-2', !showEvents
                                    ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'), children: "State" }), _jsxs("button", { onClick: () => setShowEvents(true), className: clsx('flex-1 px-4 py-2 text-sm font-medium transition-colors border-b-2', showEvents
                                    ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'), children: ["Events (", events.length, ")"] })] }), !showEvents && (_jsx("div", { className: "p-4 space-y-2 max-h-80 overflow-y-auto", children: Object.keys(state).length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic text-center py-8", children: "No state to display" })) : (Object.entries(state).map(([key, value]) => (_jsx("div", { className: "flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("code", { className: "text-sm font-mono font-semibold text-purple-600 dark:text-purple-400", children: key }), _jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: ["(", typeof value, ")"] })] }), _jsx("pre", { className: "text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all", children: formatValue(value) })] }) }, key)))) })), showEvents && (_jsx("div", { className: "p-4 space-y-2 max-h-80 overflow-y-auto", children: events.length === 0 ? (_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400 italic text-center py-8", children: "No events recorded yet. Interact with the component!" })) : (events.slice().reverse().map((event, index) => (_jsx("div", { className: "flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("code", { className: "text-sm font-mono font-semibold text-blue-600 dark:text-blue-400", children: event.name }), _jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: new Date(event.timestamp).toLocaleTimeString() })] }), event.data && (_jsx("pre", { className: "text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all mt-2", children: formatValue(event.data) }))] }) }, index)))) }))] }))] }));
}
//# sourceMappingURL=PlaygroundStateInspector.js.map