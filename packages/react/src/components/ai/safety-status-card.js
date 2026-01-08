import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle, CardDescription, Button, cn, } from '@clarity-chat/primitives';
import { AlertTriangleIcon, ShieldCheckIcon, ShieldCloseIcon, } from '../ui/icons';
const statusIcon = {
    pass: _jsx(ShieldCheckIcon, { size: 16, className: "text-success" }),
    warn: _jsx(AlertTriangleIcon, { size: 16, className: "text-warning" }),
    fail: _jsx(ShieldCloseIcon, { size: 16, className: "text-destructive" }),
};
const statusBadge = {
    pass: 'success',
    warn: 'warning',
    fail: 'destructive',
};
const statusLabel = {
    pass: 'Cleared',
    warn: 'Review recommended',
    fail: 'Blocked',
};
const defaultTitle = 'Safety guardrails';
const defaultSubtitle = 'Monitor policy checks on the latest model response before returning it to end-users.';
export const SafetyStatusCard = ({ checks, lastReviewedAt, onReviewPolicy, onAcknowledge, className, title = defaultTitle, subtitle = defaultSubtitle, }) => {
    const totalFails = checks.filter((check) => check.status === 'fail').length;
    const totalWarnings = checks.filter((check) => check.status === 'warn').length;
    const overallStatus = totalFails > 0 ? 'fail' : totalWarnings > 0 ? 'warn' : 'pass';
    const reviewedLabel = lastReviewedAt
        ? `Last reviewed ${lastReviewedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
        : 'Awaiting review';
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_20px_48px_rgba(15,23,42,0.18)]', className), children: [_jsxs(CardHeader, { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-lg font-semibold text-foreground", children: [statusIcon[overallStatus], title] }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: subtitle })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: statusBadge[overallStatus], children: statusLabel[overallStatus] }), onReviewPolicy && (_jsx(Button, { variant: "ghost", size: "sm", onClick: onReviewPolicy, children: "Review policy" }))] })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-lg border border-border/50 bg-muted p-4 text-xs font-medium text-muted-foreground/80", children: [_jsxs("span", { children: ["Checks: ", checks.length] }), _jsxs("span", { children: ["Warnings: ", totalWarnings] }), _jsxs("span", { children: ["Failures: ", totalFails] }), _jsx("span", { children: reviewedLabel })] }), _jsx("ul", { className: "space-y-3", children: checks.map((check) => (_jsxs("li", { className: "flex flex-col gap-2 rounded-lg border border-border/50 bg-muted p-4 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [statusIcon[check.status], check.label] }), _jsx(Badge, { variant: statusBadge[check.status], className: "text-[11px]", children: statusLabel[check.status] })] }), check.detail && (_jsx("p", { className: "text-sm text-muted-foreground/85", children: check.detail })), check.remediation && (_jsx("div", { className: "rounded-lg border border-dashed border-border/50 bg-background/60 p-3 text-xs text-muted-foreground/80", children: check.remediation })), onAcknowledge && check.status !== 'pass' && (_jsx("div", { className: "flex gap-2", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => onAcknowledge(check), className: "text-muted-foreground hover:text-primary", children: "Acknowledge resolution" }) }))] }, check.id))) })] })] }));
};
SafetyStatusCard.displayName = 'SafetyStatusCard';
//# sourceMappingURL=safety-status-card.js.map