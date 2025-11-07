import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, cn, } from '@clarity-chat/primitives';
import { SkeletonText } from './skeleton';
const scopeLabel = {
    session: 'This conversation',
    thread: 'Current thread',
    global: 'Global memory',
};
const scopeVariant = {
    session: 'info',
    thread: 'warning',
    global: 'success',
};
const defaultTitle = 'Conversation memory';
const defaultSubtitle = 'Inspect what the assistant has stored so you can prune, promote, or debug contextual memory.';
export const MemoryInspector = ({ memories, isLoading = false, onRemove, onPromote, onRefresh, className, title = defaultTitle, subtitle = defaultSubtitle, showHeaderActions = true, }) => {
    const formatRelative = (date) => {
        const diffMs = Date.now() - date.getTime();
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        if (diffMinutes < 1)
            return 'moments ago';
        if (diffMinutes < 60)
            return `${diffMinutes}m ago`;
        const diffHours = Math.round(diffMinutes / 60);
        if (diffHours < 24)
            return `${diffHours}h ago`;
        const diffDays = Math.round(diffHours / 24);
        return `${diffDays}d ago`;
    };
    const grouped = React.useMemo(() => {
        return memories.reduce((acc, item) => {
            acc[item.scope] = [...acc[item.scope], item];
            return acc;
        }, { session: [], thread: [], global: [] });
    }, [memories]);
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_26px_56px_rgba(15,23,42,0.18)]', className), children: [_jsxs(CardHeader, { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: title }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: subtitle })] }), showHeaderActions && (_jsx("div", { className: "flex items-center gap-2", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: onRefresh, disabled: isLoading, className: "text-muted-foreground hover:text-primary", children: "Refresh" }) }))] }), _jsxs(CardContent, { className: "space-y-6", children: [isLoading && (_jsxs("div", { className: "space-y-4", children: [_jsx(SkeletonText, { lines: 2 }), _jsx(SkeletonText, { lines: 2 }), _jsx(SkeletonText, { lines: 2 })] })), !isLoading && memories.length === 0 && (_jsx("div", { className: "rounded-2xl border border-dashed border-border/60 bg-[hsl(var(--surface-muted))] p-6 text-center text-sm text-muted-foreground", children: "No memories captured yet. Engage with the assistant to seed persistent context." })), !isLoading && memories.length > 0 && (Object.keys(grouped)
                        .filter((scope) => grouped[scope].length > 0)
                        .map((scope) => (_jsxs("section", { className: "space-y-3", children: [_jsxs("header", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: scopeVariant[scope], children: scopeLabel[scope] }), _jsxs("span", { className: "text-xs font-medium text-muted-foreground/70", children: [grouped[scope].length, " item", grouped[scope].length > 1 ? 's' : ''] })] }), _jsx("ul", { className: "space-y-3", children: grouped[scope].map((memory) => (_jsx("li", { className: "rounded-2xl border border-border/50 bg-[hsl(var(--surface-muted))] p-4 shadow-[0_12px_28px_rgba(15,23,42,0.12)]", children: _jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1 space-y-2", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsx("span", { className: "text-sm font-semibold text-foreground", children: memory.label }), memory.tokens !== undefined && (_jsxs(Badge, { variant: "outline", className: "text-[11px]", children: [memory.tokens, " tokens"] })), memory.confidence !== undefined && (_jsxs(Badge, { variant: memory.confidence >= 0.7 ? 'success' : memory.confidence >= 0.4 ? 'warning' : 'destructive', children: ["Confidence ", (memory.confidence * 100).toFixed(0), "%"] }))] }), _jsx("p", { className: "text-sm text-muted-foreground/85 whitespace-pre-wrap", children: memory.value })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 text-xs text-muted-foreground/70", children: [_jsxs("span", { children: ["Updated ", formatRelative(memory.lastUpdated)] }), memory.source && _jsxs("span", { children: ["Source: ", memory.source] }), _jsxs("div", { className: "flex gap-2", children: [onPromote && scope !== 'global' && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onPromote(memory), className: "text-muted-foreground hover:text-primary", children: "Promote" })), onRemove && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onRemove(memory), className: "text-destructive hover:text-destructive", children: "Remove" }))] })] })] }) }, memory.id))) })] }, scope))))] })] }));
};
MemoryInspector.displayName = 'MemoryInspector';
//# sourceMappingURL=memory-inspector.js.map