import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, cn, } from '@clarity-chat/primitives';
import { Skeleton } from '../ui/skeleton';
const formatUsage = (used, total) => {
    if (total === 0)
        return '0%';
    const pct = Math.min(100, Math.round((used / total) * 100));
    return `${pct}%`;
};
const UsageSkeleton = () => (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { width: 80, height: 14 }), _jsx(Skeleton, { width: 100, height: 14 })] }), _jsx(Skeleton, { width: "100%", height: 8, rounded: "full" }), _jsx(Skeleton, { width: "70%", height: 12 })] }));
const DetailsSkeleton = () => (_jsxs("div", { className: "space-y-3 rounded-lg border border-border/50 bg-muted p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { width: 60, height: 14 }), _jsx(Skeleton, { width: 80, height: 14 })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Skeleton, { width: 80, height: 14 }), _jsx(Skeleton, { width: 100, height: 14 })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { width: 100, height: 32 }), _jsx(Skeleton, { width: 100, height: 32 })] })] }));
export const AuthTenantDashboard = ({ organizationName, planName, planBadge, planBadgeVariant = 'default', renewalDate, billingPeriod, seatUsage, apiUsage, actions = [], onContactSales, isLoading = false, warningThreshold = 80, criticalThreshold = 95, className, }) => {
    const usagePct = seatUsage.total === 0
        ? 0
        : Math.min(100, (seatUsage.used / seatUsage.total) * 100);
    const isAtCapacity = seatUsage.used >= seatUsage.total;
    const isCritical = usagePct >= criticalThreshold;
    const isWarning = usagePct >= warningThreshold && !isCritical;
    const getProgressBarColor = () => {
        if (isAtCapacity || isCritical)
            return 'bg-destructive';
        if (isWarning)
            return 'bg-warning';
        return 'bg-primary';
    };
    const getUsageMessage = () => {
        if (isAtCapacity) {
            return 'All seats allocated. Upgrade or reassign to invite more teammates.';
        }
        if (isCritical) {
            return `Only ${seatUsage.total - seatUsage.used} seat${seatUsage.total - seatUsage.used === 1 ? '' : 's'} remaining. Consider upgrading soon.`;
        }
        if (isWarning) {
            return `Approaching seat limit. ${seatUsage.total - seatUsage.used} seats available.`;
        }
        return 'Invite more teammates to collaborate with the AI assistant.';
    };
    const badgeVariantMap = {
        default: 'info',
        success: 'success',
        warning: 'warning',
        destructive: 'destructive',
    };
    return (_jsxs(Card, { className: cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-sm', className), "aria-busy": isLoading, children: [_jsx(CardHeader, { className: "space-y-3", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx("div", { children: isLoading ? (_jsxs("div", { className: "space-y-2", children: [_jsx(Skeleton, { width: 200, height: 24 }), _jsx(Skeleton, { width: 240, height: 14 })] })) : (_jsxs(_Fragment, { children: [_jsx(CardTitle, { className: "text-lg font-semibold text-foreground", children: organizationName }), _jsx(CardDescription, { className: "text-sm text-muted-foreground/80", children: "Manage seats, plan limits, and upgrades." })] })) }), isLoading ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Skeleton, { width: 60, height: 20 }), _jsx(Skeleton, { width: 100, height: 16 })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: badgeVariantMap[planBadgeVariant], className: "uppercase tracking-wide", children: planBadge ?? 'Active' }), _jsx("span", { className: "text-sm font-medium text-foreground", children: planName }), billingPeriod && (_jsxs("span", { className: "text-xs text-muted-foreground/60", children: ["(", billingPeriod, ")"] }))] }))] }) }), _jsxs(CardContent, { className: "grid gap-6 md:grid-cols-2", children: [isLoading ? (_jsx(UsageSkeleton, {})) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground/80", children: [_jsx("span", { id: "seat-usage-label", children: seatUsage.label || 'Seats used' }), _jsxs("span", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "tabular-nums", children: [seatUsage.used, "/", seatUsage.total] }), _jsx("span", { className: "text-muted-foreground/60", children: "\u2022" }), _jsx("span", { className: cn('tabular-nums', isCritical && 'font-medium text-destructive', isWarning && !isCritical && 'font-medium text-warning'), children: formatUsage(seatUsage.used, seatUsage.total) })] })] }), _jsx("div", { role: "progressbar", "aria-labelledby": "seat-usage-label", "aria-valuemin": 0, "aria-valuemax": seatUsage.total, "aria-valuenow": seatUsage.used, "aria-valuetext": `${seatUsage.used} of ${seatUsage.total} seats used`, className: "relative h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-muted))]", children: _jsx("div", { className: cn('h-full rounded-full transition-all duration-300 ease-out', getProgressBarColor()), style: { width: `${usagePct}%` } }) }), _jsx("p", { className: cn('text-xs', isAtCapacity || isCritical
                                    ? 'text-destructive'
                                    : isWarning
                                        ? 'text-warning-foreground'
                                        : 'text-muted-foreground/70'), children: getUsageMessage() })] })), isLoading ? (_jsx(DetailsSkeleton, {})) : (_jsxs("div", { className: "space-y-3 rounded-lg border border-border/50 bg-muted p-4", children: [_jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground/80", children: [_jsx("span", { children: "Renewal" }), _jsx("span", { className: "font-medium text-foreground", children: renewalDate ?? (_jsx("span", { className: "text-muted-foreground/60", children: "Not set" })) })] }), apiUsage && (_jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground/80", children: [_jsx("span", { children: apiUsage.label }), _jsx("span", { className: cn('font-semibold', apiUsage.percentage !== undefined &&
                                            apiUsage.percentage >= criticalThreshold
                                            ? 'text-destructive'
                                            : apiUsage.percentage !== undefined &&
                                                apiUsage.percentage >= warningThreshold
                                                ? 'text-warning'
                                                : 'text-foreground'), children: apiUsage.value })] })), actions.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: actions.map((action) => (_jsx(Button, { variant: action.variant === 'primary'
                                        ? 'default'
                                        : action.variant === 'destructive'
                                            ? 'destructive'
                                            : 'surface', size: "sm", onClick: action.onClick, children: action.label }, action.id))) }))] }))] }), _jsxs(CardFooter, { className: "text-xs text-muted-foreground/70", children: [_jsx("span", { children: "Need custom terms or higher limits?" }), onContactSales ? (_jsxs(Button, { variant: "link", size: "sm", className: "h-auto p-0 pl-1 text-xs text-primary", onClick: onContactSales, children: ["Contact enterprise sales", _jsx("svg", { className: "ml-0.5 h-3 w-3", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", "aria-hidden": "true", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14 5l7 7m0 0l-7 7m7-7H3" }) })] })) : (_jsx("span", { className: "pl-1 text-primary", children: "Contact enterprise sales" }))] })] }));
};
AuthTenantDashboard.displayName = 'AuthTenantDashboard';
//# sourceMappingURL=AuthTenantDashboard.js.map