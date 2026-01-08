import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, cn, } from '@clarity-chat/primitives';
import { Skeleton } from '../ui/skeleton';
const severityVariant = {
    low: 'info',
    medium: 'warning',
    high: 'destructive',
};
const severityOrder = {
    high: 0,
    medium: 1,
    low: 2,
};
export const SafetyReviewConsole = ({ content, highlights, onRedact, onRedactAll, onApprove, onReject, isProcessing = false, isLoading = false, requireConfirmation = true, title = 'Safety review console', description = 'Click highlighted spans to redact or edit sensitive content. Use arrow keys to navigate between highlights.', className, }) => {
    const [focusedHighlightIndex, setFocusedHighlightIndex] = React.useState(-1);
    const [showApproveDialog, setShowApproveDialog] = React.useState(false);
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);
    const highlightRefs = React.useRef(new Map());
    const sortedHighlights = React.useMemo(() => [...highlights].sort((a, b) => a.start - b.start), [highlights]);
    // Sort by severity for the sidebar
    const severitySortedHighlights = React.useMemo(() => [...highlights].sort((a, b) => severityOrder[a.severity ?? 'low'] -
        severityOrder[b.severity ?? 'low'] || a.start - b.start), [highlights]);
    // Statistics
    const stats = React.useMemo(() => {
        const high = highlights.filter((h) => h.severity === 'high').length;
        const medium = highlights.filter((h) => h.severity === 'medium').length;
        const low = highlights.filter((h) => h.severity === 'low' || !h.severity).length;
        return { high, medium, low, total: highlights.length };
    }, [highlights]);
    const handleKeyDown = React.useCallback((event) => {
        if (sortedHighlights.length === 0)
            return;
        let newIndex = focusedHighlightIndex;
        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                newIndex =
                    focusedHighlightIndex < sortedHighlights.length - 1
                        ? focusedHighlightIndex + 1
                        : 0;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                newIndex =
                    focusedHighlightIndex > 0
                        ? focusedHighlightIndex - 1
                        : sortedHighlights.length - 1;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = sortedHighlights.length - 1;
                break;
            case 'Enter':
            case ' ':
                if (focusedHighlightIndex >= 0 &&
                    focusedHighlightIndex < sortedHighlights.length) {
                    event.preventDefault();
                    onRedact?.(sortedHighlights[focusedHighlightIndex]);
                }
                return;
            default:
                return;
        }
        setFocusedHighlightIndex(newIndex);
        const highlight = sortedHighlights[newIndex];
        if (highlight) {
            highlightRefs.current.get(highlight.id)?.focus();
        }
    }, [focusedHighlightIndex, sortedHighlights, onRedact]);
    const handleApprove = () => {
        if (requireConfirmation && stats.high > 0) {
            setShowApproveDialog(true);
        }
        else {
            onApprove?.();
        }
    };
    const handleReject = () => {
        if (requireConfirmation) {
            setShowRejectDialog(true);
        }
        else {
            onReject?.();
        }
    };
    const renderHighlightedContent = () => {
        if (isLoading) {
            return (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { width: "100%", height: 16 }), _jsx(Skeleton, { width: "90%", height: 16 }), _jsx(Skeleton, { width: "95%", height: 16 }), _jsx(Skeleton, { width: "70%", height: 16 })] }));
        }
        const segments = [];
        let cursor = 0;
        sortedHighlights.forEach((highlight, index) => {
            if (cursor < highlight.start) {
                segments.push(_jsx("span", { className: "text-muted-foreground/80", children: content.slice(cursor, highlight.start) }, `text-${cursor}`));
            }
            segments.push(_jsx("button", { ref: (el) => {
                    if (el)
                        highlightRefs.current.set(highlight.id, el);
                }, type: "button", onClick: () => onRedact?.(highlight), onFocus: () => setFocusedHighlightIndex(index), "aria-describedby": `highlight-desc-${highlight.id}`, className: cn('rounded-md px-1 py-0.5 text-left text-sm font-medium transition-all', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', 'hover:scale-105', highlight.severity === 'high' &&
                    'bg-destructive/20 text-destructive hover:bg-destructive/30', highlight.severity === 'medium' &&
                    'bg-warning/20 text-warning-foreground hover:bg-warning/30', (highlight.severity === 'low' || !highlight.severity) &&
                    'bg-primary/20 text-primary hover:bg-primary/30'), children: content.slice(highlight.start, highlight.end) }, highlight.id));
            cursor = highlight.end;
        });
        if (cursor < content.length) {
            segments.push(_jsx("span", { className: "text-muted-foreground/80", children: content.slice(cursor) }, `tail-${cursor}`));
        }
        return segments;
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Card, { className: cn('border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', className), "aria-busy": isProcessing || isLoading, children: [_jsx(CardHeader, { className: "space-y-2", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: title }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: description })] }), stats.total > 0 && (_jsxs("div", { className: "flex items-center gap-2", children: [stats.high > 0 && (_jsxs(Badge, { variant: "destructive", className: "text-xs", children: [stats.high, " high"] })), stats.medium > 0 && (_jsxs(Badge, { variant: "warning", className: "text-xs", children: [stats.medium, " medium"] })), stats.low > 0 && (_jsxs(Badge, { variant: "info", className: "text-xs", children: [stats.low, " low"] }))] }))] }) }), _jsxs(CardContent, { className: "grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("div", { role: "region", "aria-label": "Content with safety highlights", onKeyDown: handleKeyDown, className: "rounded-lg border border-border/50 bg-muted p-4 text-sm leading-relaxed", children: sortedHighlights.length > 0 ? (_jsx("p", { className: "whitespace-pre-wrap", children: renderHighlightedContent() })) : isLoading ? (renderHighlightedContent()) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-center", children: [_jsx("div", { className: "mb-2 rounded-full bg-success/10 p-2", children: _jsx("svg", { className: "h-5 w-5 text-success", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }) }), _jsx("p", { className: "text-sm font-medium text-success", children: "No issues detected" }), _jsx("p", { className: "mt-1 text-xs text-muted-foreground/70", children: "This response passed all safety checks." })] })) }), sortedHighlights.map((highlight) => (_jsxs("span", { id: `highlight-desc-${highlight.id}`, className: "sr-only", children: [highlight.category, " issue with ", highlight.severity ?? 'low', ' ', "severity.", highlight.suggestion && ` Suggestion: ${highlight.suggestion}`] }, `desc-${highlight.id}`)))] }), _jsx("aside", { className: "space-y-4", "aria-label": "Safety flags", children: _jsxs("div", { className: "rounded-lg border border-border/50 bg-muted p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-foreground", children: "Flag details" }), onRedactAll && stats.total > 1 && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onRedactAll, disabled: isProcessing, className: "text-xs", children: "Redact all" }))] }), isLoading ? (_jsxs("div", { className: "mt-3 space-y-3", children: [_jsx(Skeleton, { width: "100%", height: 80 }), _jsx(Skeleton, { width: "100%", height: 80 })] })) : (_jsxs("ul", { className: "mt-3 space-y-3 text-xs text-muted-foreground/80", role: "list", children: [severitySortedHighlights.map((highlight, index) => (_jsxs("li", { className: cn('rounded-lg border border-dashed bg-background/80 p-3 transition-colors', highlight.severity === 'high'
                                                        ? 'border-destructive/50'
                                                        : highlight.severity === 'medium'
                                                            ? 'border-warning/50'
                                                            : 'border-border/50'), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium text-foreground", children: highlight.category }), _jsx(Badge, { variant: severityVariant[highlight.severity ?? 'low'], children: highlight.severity ?? 'low' })] }), _jsxs("p", { className: "mt-2 rounded bg-muted px-2 py-1 text-xs text-muted-foreground/70", children: ["\"", content.slice(highlight.start, highlight.end), "\""] }), highlight.suggestion && (_jsxs("p", { className: "mt-2 text-xs text-muted-foreground/60", children: [_jsx("span", { className: "font-medium", children: "Suggestion:" }), ' ', highlight.suggestion] })), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx(Button, { variant: "surface", size: "sm", onClick: () => onRedact?.(highlight), disabled: isProcessing, "aria-label": `Redact ${highlight.category} issue`, children: "Redact" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                                                                        const el = highlightRefs.current.get(highlight.id);
                                                                        if (el) {
                                                                            el.focus();
                                                                            el.scrollIntoView({
                                                                                behavior: 'smooth',
                                                                                block: 'center',
                                                                            });
                                                                        }
                                                                    }, "aria-label": `Jump to ${highlight.category} in content`, children: "Show" })] })] }, `flag-${highlight.id}`))), severitySortedHighlights.length === 0 && !isLoading && (_jsx("li", { className: "py-4 text-center text-muted-foreground/60", children: "No flagged content." }))] }))] }) })] }), _jsxs(CardFooter, { className: "flex flex-wrap items-center justify-between gap-2", children: [_jsx("div", { className: "text-xs text-muted-foreground/70", children: stats.total > 0
                                    ? `${stats.total} issue${stats.total === 1 ? '' : 's'} require${stats.total === 1 ? 's' : ''} review`
                                    : 'Ready to approve' }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Button, { variant: "surface", onClick: handleApprove, disabled: isProcessing, children: isProcessing ? 'Processing...' : 'Approve response' }), _jsx(Button, { variant: "ghost", onClick: handleReject, disabled: isProcessing, className: "text-destructive hover:text-destructive", children: "Reject response" })] })] })] }), _jsx(Dialog, { open: showApproveDialog, onOpenChange: setShowApproveDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Approve with high severity issues?" }), _jsxs(DialogDescription, { children: ["This response has ", stats.high, " high severity issue", stats.high === 1 ? '' : 's', " that haven't been addressed. Are you sure you want to approve it?"] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: () => setShowApproveDialog(false), children: "Cancel" }), _jsx(Button, { onClick: () => {
                                        setShowApproveDialog(false);
                                        onApprove?.();
                                    }, children: "Approve anyway" })] })] }) }), _jsx(Dialog, { open: showRejectDialog, onOpenChange: setShowRejectDialog, children: _jsxs(DialogContent, { children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: "Reject this response?" }), _jsx(DialogDescription, { children: "This action will reject the response and it will not be sent. This action cannot be undone." })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "ghost", onClick: () => setShowRejectDialog(false), children: "Cancel" }), _jsx(Button, { variant: "destructive", onClick: () => {
                                        setShowRejectDialog(false);
                                        onReject?.();
                                    }, children: "Reject response" })] })] }) })] }));
};
SafetyReviewConsole.displayName = 'SafetyReviewConsole';
//# sourceMappingURL=SafetyReviewConsole.js.map