import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
const resultStyles = {
    success: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20',
    failure: 'bg-red-500/10 text-red-600 border border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
};
function formatTimestamp(value, timezone) {
    const date = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) {
        return value.toString();
    }
    return date.toLocaleString(undefined, {
        hour12: false,
        timeZone: timezone,
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}
export function AuditLogViewer({ logs, className, timezone, onEntryClick, emptyState, title = 'Audit Log', }) {
    if (!logs.length) {
        return (_jsx("div", { className: cn('rounded-lg border border-dashed border-muted-foreground/20 bg-card/50 p-6 text-center text-sm text-muted-foreground', className), children: emptyState ?? 'No audit events recorded yet.' }));
    }
    return (_jsxs("div", { className: cn('rounded-lg border border-border/50 bg-card shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]', className), children: [_jsx("div", { className: "flex items-center justify-between border-b border-border/80 px-4 py-3", children: _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: title }), _jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [logs.length, " event", logs.length === 1 ? '' : 's'] })] }) }), _jsx("div", { className: "max-h-80 overflow-y-auto", children: _jsx("ul", { className: "divide-y divide-border/70", children: logs.map((entry) => {
                        const badgeClass = entry.result && resultStyles[entry.result.toLowerCase()]
                            ? resultStyles[entry.result.toLowerCase()]
                            : 'bg-muted text-muted-foreground border border-border/70';
                        return (_jsx("li", { className: cn('px-4 py-3 transition-colors', onEntryClick && 'cursor-pointer hover:bg-muted/40 focus:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-inset'), onClick: () => onEntryClick?.(entry), onKeyDown: (e) => {
                                if (onEntryClick && (e.key === 'Enter' || e.key === ' ')) {
                                    e.preventDefault();
                                    onEntryClick(entry);
                                }
                            }, role: onEntryClick ? 'button' : undefined, tabIndex: onEntryClick ? 0 : undefined, "aria-label": onEntryClick ? `View details for ${entry.action} by ${entry.user}` : undefined, children: _jsxs("div", { className: "flex flex-wrap items-start gap-3", children: [_jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("p", { className: "truncate text-sm font-medium text-foreground", children: entry.action }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatTimestamp(entry.timestamp, timezone) })] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "font-medium text-foreground", children: entry.user }), entry.resource ? (_jsxs("span", { className: "ml-1 text-muted-foreground/80", children: ["\u2022 ", entry.resource] })) : null] }), entry.metadata ? (_jsx("dl", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/90", children: Object.entries(entry.metadata).map(([key, value]) => (_jsxs("div", { className: "flex gap-1", children: [_jsxs("dt", { className: "font-medium text-foreground/80", children: [key, ":"] }), _jsx("dd", { className: "truncate text-muted-foreground", children: String(value) })] }, key))) })) : null] }), entry.result ? (_jsx("span", { className: cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize', badgeClass), children: entry.result })) : null] }) }, entry.id));
                    }) }) })] }));
}
//# sourceMappingURL=audit-log-viewer.js.map