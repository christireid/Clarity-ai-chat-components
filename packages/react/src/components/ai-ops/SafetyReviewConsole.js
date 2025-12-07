import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, Textarea, cn, } from '@clarity-chat/primitives';
const severityVariant = {
    low: 'info',
    medium: 'warning',
    high: 'destructive',
};
export const SafetyReviewConsole = ({ content, highlights, onRedact, onApprove, onReject, className, }) => {
    const sortedHighlights = React.useMemo(() => [...highlights].sort((a, b) => a.start - b.start), [highlights]);
    const renderHighlightedContent = () => {
        const segments = [];
        let cursor = 0;
        sortedHighlights.forEach((highlight) => {
            if (cursor < highlight.start) {
                segments.push(_jsx("span", { className: "text-muted-foreground/80", children: content.slice(cursor, highlight.start) }, `text-${cursor}`));
            }
            segments.push(_jsx("button", { type: "button", onClick: () => onRedact?.(highlight), className: cn('rounded-md px-1 py-0.5 text-left text-sm font-medium transition-colors', highlight.severity === 'high' && 'bg-destructive/10 text-destructive', highlight.severity === 'medium' && 'bg-warning/10 text-warning-foreground', highlight.severity === 'low' && 'bg-primary/10 text-primary'), children: content.slice(highlight.start, highlight.end) }, highlight.id));
            cursor = highlight.end;
        });
        if (cursor < content.length) {
            segments.push(_jsx("span", { className: "text-muted-foreground/80", children: content.slice(cursor) }, `tail-${cursor}`));
        }
        return segments;
    };
    return (_jsxs(Card, { className: cn('border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', className), children: [_jsxs(CardHeader, { className: "space-y-2", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: "Safety review console" }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: "Click highlighted spans to redact or edit sensitive content." })] }), _jsxs(CardContent, { className: "grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "rounded-lg border border-border/50 bg-muted p-4 text-sm leading-relaxed", children: sortedHighlights.length > 0 ? (_jsx("p", { className: "space-x-1 whitespace-pre-wrap", children: renderHighlightedContent() })) : (_jsx("p", { className: "text-muted-foreground/80", children: "No issues detected for this response." })) }), _jsx(Textarea, { "aria-label": "Redacted content", value: content, readOnly: true, className: "min-h-[140px] resize-y bg-background/60" })] }), _jsx("aside", { className: "space-y-4", children: _jsxs("div", { className: "rounded-lg border border-border/50 bg-muted p-4", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Flag details" }), _jsxs("ul", { className: "mt-3 space-y-3 text-xs text-muted-foreground/80", children: [sortedHighlights.map((highlight) => (_jsxs("li", { className: "rounded-lg border border-dashed border-border/50 bg-background/80 p-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium text-foreground", children: highlight.category }), _jsx(Badge, { variant: severityVariant[highlight.severity ?? 'low'], children: highlight.severity ?? 'low' })] }), _jsxs("p", { className: "mt-2 text-xs text-muted-foreground/70", children: ["\u201C", content.slice(highlight.start, highlight.end), "\u201D"] }), highlight.suggestion && (_jsx("p", { className: "mt-2 text-xs text-muted-foreground/60", children: highlight.suggestion })), _jsx("div", { className: "mt-2 flex gap-2", children: _jsx(Button, { variant: "surface", size: "sm", onClick: () => onRedact?.(highlight), children: "Redact" }) })] }, `flag-${highlight.id}`))), sortedHighlights.length === 0 && (_jsx("li", { children: "No flagged content." }))] })] }) })] }), _jsxs(CardFooter, { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: "surface", onClick: onApprove, children: "Approve response" }), _jsx(Button, { variant: "ghost", onClick: onReject, className: "text-destructive hover:text-destructive", children: "Reject response" })] })] }));
};
SafetyReviewConsole.displayName = 'SafetyReviewConsole';
//# sourceMappingURL=SafetyReviewConsole.js.map