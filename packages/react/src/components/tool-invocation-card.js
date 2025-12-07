/**
 * Tool Invocation Card Component
 *
 * Displays function/tool calls with approval flow and result visualization
 *
 * @example
 * ```tsx
 * <ToolInvocationCard
 *   toolCall={toolCall}
 *   status="pending"
 *   requiresApproval
 *   onApprove={handleApprove}
 *   onReject={handleReject}
 * />
 * ```
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, Button, Badge, cn } from '@clarity-chat/primitives';
const getStatusBadgeVariant = (status) => {
    switch (status) {
        case 'pending':
            return 'warning';
        case 'approved':
        case 'executing':
            return 'info';
        case 'success':
            return 'success';
        case 'error':
            return 'destructive';
        default:
            return 'secondary';
    }
};
const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'Awaiting approval';
        case 'approved':
            return 'Approved';
        case 'rejected':
            return 'Rejected';
        case 'executing':
            return 'Executing...';
        case 'success':
            return 'Completed';
        case 'error':
            return 'Failed';
        default:
            return 'Unknown';
    }
};
export function ToolInvocationCard({ toolCall, status = 'pending', result, error, requiresApproval = false, onApprove, onReject, onRetry, formatArguments = true, expandableResult = true, className = '' }) {
    const [isResultExpanded, setIsResultExpanded] = React.useState(false);
    const [isArgsExpanded, setIsArgsExpanded] = React.useState(false);
    const parseArguments = () => {
        try {
            const parsed = JSON.parse(toolCall.function.arguments);
            return formatArguments ? JSON.stringify(parsed, null, 2) : toolCall.function.arguments;
        }
        catch {
            return toolCall.function.arguments;
        }
    };
    const formatResult = () => {
        if (error)
            return error;
        if (typeof result === 'string')
            return result;
        try {
            return JSON.stringify(result, null, 2);
        }
        catch {
            return String(result);
        }
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 }, className: className, children: _jsxs(Card, { className: "relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 ease-out", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3.5 flex-1 min-w-0", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" }) }) }), _jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [_jsxs("div", { className: "flex items-center gap-2.5 flex-wrap", children: [_jsx("h4", { className: "font-bold text-base text-foreground truncate", children: toolCall.function.name }), _jsx(Badge, { variant: getStatusBadgeVariant(status), pulse: status === 'executing', children: getStatusLabel(status) })] }), _jsx("p", { className: "text-xs text-muted-foreground/90", children: "Tool Invocation" })] })] }), requiresApproval && status === 'pending' && (_jsxs("div", { className: "flex gap-2.5 shrink-0", children: [onApprove && (_jsxs(Button, { size: "sm", onClick: () => onApprove(toolCall), className: "gap-1.5", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }), "Approve"] })), onReject && (_jsxs(Button, { size: "sm", variant: "outline", onClick: () => onReject(toolCall), className: "gap-1.5", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }), "Reject"] }))] }))] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2.5", children: [_jsxs("button", { onClick: () => setIsArgsExpanded(!isArgsExpanded), className: "flex w-full items-center justify-between text-xs font-medium text-muted-foreground hover:text-foreground transition-colors", children: [_jsx("span", { children: "Arguments" }), _jsx("svg", { className: cn('h-4 w-4 transition-transform duration-150 ease-out', isArgsExpanded && 'rotate-180'), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), _jsx(AnimatePresence, { children: isArgsExpanded && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden", children: _jsx("pre", { className: "rounded-lg border bg-muted/50 p-3 text-xs overflow-x-auto", children: _jsx("code", { className: "text-foreground font-mono", children: parseArguments() }) }) })) })] }), (result || error) && (_jsx("div", { className: "space-y-2.5 border-t pt-4", children: expandableResult ? (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => setIsResultExpanded(!isResultExpanded), className: "flex w-full items-center justify-between text-sm font-medium hover:text-primary transition-colors", children: [_jsx("span", { className: "flex items-center gap-2.5", children: error ? (_jsxs(_Fragment, { children: [_jsx("svg", { className: "h-4 w-4 text-destructive", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Error Details"] })) : (_jsxs(_Fragment, { children: [_jsx("svg", { className: "h-4 w-4 text-success", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), "Result"] })) }), _jsx("svg", { className: cn('h-4 w-4 transition-transform duration-150 ease-out', isResultExpanded && 'rotate-180'), fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] }), _jsx(AnimatePresence, { children: isResultExpanded && (_jsxs(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, transition: { duration: 0.2 }, className: "overflow-hidden space-y-3.5", children: [_jsx("pre", { className: cn('rounded-lg border p-3 text-sm overflow-x-auto', error ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50'), children: _jsx("code", { className: cn('font-mono', error ? 'text-destructive' : 'text-foreground'), children: formatResult() }) }), error && onRetry && (_jsxs(Button, { size: "sm", variant: "destructive", onClick: () => onRetry(toolCall), className: "gap-1.5", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), "Retry"] }))] })) })] })) : (_jsxs("div", { className: "space-y-3.5", children: [_jsx("pre", { className: cn('rounded-lg border p-3 text-sm overflow-x-auto', error ? 'bg-destructive/10 border-destructive/30' : 'bg-muted/50'), children: _jsx("code", { className: cn('font-mono', error ? 'text-destructive' : 'text-foreground'), children: formatResult() }) }), error && onRetry && (_jsxs(Button, { size: "sm", variant: "destructive", onClick: () => onRetry(toolCall), className: "gap-1.5", children: [_jsx("svg", { className: "h-4 w-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" }) }), "Retry"] }))] })) }))] })] }) }));
}
//# sourceMappingURL=tool-invocation-card.js.map