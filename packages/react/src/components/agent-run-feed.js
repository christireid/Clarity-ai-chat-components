'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, CardDescription, cn, } from '@clarity-chat/primitives';
import { SparklesIcon, LoaderIcon, CheckIcon, XIcon } from './icons';
const statusIcon = {
    pending: _jsx(LoaderIcon, { size: 16, className: "animate-spin text-muted-foreground" }),
    running: _jsx(SparklesIcon, { size: 16, className: "text-primary animate-pulse" }),
    succeeded: _jsx(CheckIcon, { size: 16, className: "text-success" }),
    failed: _jsx(XIcon, { size: 16, className: "text-destructive" }),
};
const statusBadge = {
    pending: 'info',
    running: 'info',
    succeeded: 'success',
    failed: 'destructive',
};
const statusLabel = {
    pending: 'Queued',
    running: 'In progress',
    succeeded: 'Completed',
    failed: 'Failed',
};
const defaultTitle = 'Agent execution feed';
const defaultSubtitle = 'Observe how the orchestrator called tools, merged evidence, and delivered the final answer.';
export const AgentRunFeed = ({ steps, onRetry, onOpenLogs, className, title = defaultTitle, subtitle = defaultSubtitle, }) => {
    const sortedSteps = React.useMemo(() => [...steps].sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime()), [steps]);
    const formatDuration = (step) => {
        if (!step.completedAt)
            return undefined;
        const diffMs = step.completedAt.getTime() - step.startedAt.getTime();
        return `${(diffMs / 1000).toFixed(2)}s`;
    };
    return (_jsxs(Card, { className: cn('border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', className), children: [_jsx(CardHeader, { className: "space-y-3", children: _jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: title }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: subtitle })] }) }), _jsx(CardContent, { children: _jsx("ol", { className: "space-y-4", children: _jsx(AnimatePresence, { initial: false, children: sortedSteps.map((step) => (_jsxs(motion.li, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] }, className: "rounded-lg border border-border/50 bg-muted p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]", children: [_jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-inner", children: statusIcon[step.status] }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-semibold text-foreground", children: step.title }), _jsxs("span", { className: "text-xs text-muted-foreground/70", children: ["Started ", step.startedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: statusBadge[step.status], children: statusLabel[step.status] }), step.tool && (_jsxs(Badge, { variant: "outline", className: "text-[11px]", children: ["Tool \u2022 ", step.tool] })), formatDuration(step) && (_jsx(Badge, { variant: "subtle", className: "text-[11px]", children: formatDuration(step) }))] })] }), step.detail && (_jsx("p", { className: "mt-3 text-sm text-muted-foreground/85 whitespace-pre-wrap", children: step.detail })), step.outputPreview && (_jsx("div", { className: "mt-3 rounded-lg border border-dashed border-border/50 bg-background/70 p-3 text-xs text-muted-foreground/80", children: step.outputPreview })), _jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [onOpenLogs && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => onOpenLogs(step), children: "View logs" })), step.status === 'failed' && onRetry && (_jsx(Button, { variant: "surface", size: "sm", onClick: () => onRetry(step), children: "Retry step" }))] })] }, step.id))) }) }) })] }));
};
AgentRunFeed.displayName = 'AgentRunFeed';
//# sourceMappingURL=agent-run-feed.js.map