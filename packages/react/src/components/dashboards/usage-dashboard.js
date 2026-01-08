import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, ScrollArea, cn, } from '@clarity-chat/primitives';
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants';
/**
 * Usage Dashboard Component
 *
 * Displays comprehensive usage statistics including credit balance,
 * usage metrics, cost breakdowns, and limit warnings.
 *
 * @example
 * ```tsx
 * <UsageDashboard
 *   balance={{ total: 10000, used: 3000, available: 7000 }}
 *   stats={{
 *     period: 'month',
 *     startDate: new Date(),
 *     endDate: new Date(),
 *     metrics: { messagesCount: 150, tokensUsed: 25000 },
 *     costs: { total: 15.50, breakdown: [] }
 *   }}
 *   limits={[{ metric: 'tokensUsed', current: 25000, limit: 100000 }]}
 *   onPurchaseCredits={() => navigate('/billing')}
 * />
 * ```
 */
export function UsageDashboard({ balance, stats, limits = [], onPurchaseCredits, className, }) {
    const usagePercentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;
    const isLowBalance = usagePercentage > 80;
    const formatNumber = (num) => {
        if (num >= 1000000)
            return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000)
            return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };
    const metricIcons = {
        messagesCount: '💬',
        tokensUsed: '🔤',
        filesUploaded: '📁',
        exportsGenerated: '📥',
        storageUsed: '💾',
        apiCalls: '🔌',
    };
    const metricLabels = {
        messagesCount: 'Messages',
        tokensUsed: 'Tokens',
        filesUploaded: 'Files',
        exportsGenerated: 'Exports',
        storageUsed: 'Storage (MB)',
        apiCalls: 'API Calls',
    };
    return (_jsxs(Card, { className: cn('h-full flex flex-col', className), role: "region", "aria-label": "Usage Dashboard", children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2 text-foreground", children: ["Usage Dashboard", isLowBalance && (_jsx(Badge, { variant: "destructive", pulse: true, children: "Low Balance" }))] }), _jsx(CardDescription, { className: "text-muted-foreground/80", children: "Track your usage and manage credits" })] }), onPurchaseCredits && (_jsx(Button, { onClick: onPurchaseCredits, size: "sm", children: "\uD83D\uDCB3 Buy Credits" }))] }) }), _jsx(CardContent, { className: "flex-1 overflow-hidden", children: _jsx(ScrollArea, { className: "h-full", children: _jsxs("div", { className: "space-y-6 pb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Credit Balance" }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-2xl font-bold", children: formatNumber(balance.available) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["of ", formatNumber(balance.total), " credits"] })] })] }), _jsx("div", { className: "relative h-3 bg-muted/30 rounded-full overflow-hidden shadow-inner", role: "progressbar", "aria-label": "Credit usage", "aria-valuenow": Math.round(usagePercentage), "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuetext": `${formatNumber(balance.used)} of ${formatNumber(balance.total)} credits used (${usagePercentage.toFixed(1)}%)`, children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${usagePercentage}%` }, transition: {
                                                // Framer Motion 12: Spring progress fill
                                                type: 'spring',
                                                damping: 28,
                                                stiffness: 200,
                                            }, className: cn('h-full rounded-full', isLowBalance
                                                ? 'bg-gradient-to-r from-red-500 to-destructive'
                                                : 'bg-gradient-to-r from-primary/80 to-primary') }) }), _jsxs("div", { className: "flex items-center justify-between mt-2 text-xs text-muted-foreground", children: [_jsxs("span", { children: [formatNumber(balance.used), " used"] }), _jsxs("span", { children: [usagePercentage.toFixed(1), "%"] })] }), balance.nextRefillDate && (_jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [balance.autoRefill ? '🔄 Auto-refill' : 'Next refill', " on", ' ', balance.nextRefillDate.toLocaleDateString()] }))] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-semibold mb-3", children: ["Usage This ", stats.period] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: Object.keys(stats.metrics).map((key, index) => {
                                            const value = stats.metrics[key];
                                            const limit = limits.find((l) => l.metric === key);
                                            const percentage = limit
                                                ? (limit.current / limit.limit) * 100
                                                : 0;
                                            const isNearLimit = percentage > 80;
                                            // Use index directly instead of O(n) indexOf lookups
                                            const baseDelay = index * 0.05;
                                            return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, transition: {
                                                    delay: baseDelay,
                                                    duration: DURATION_SECONDS.normal,
                                                    ease: EASING_FRAMER.sharp,
                                                }, className: cn('p-4 rounded-xl border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow duration-200', isNearLimit &&
                                                    'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20'), children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx(motion.span, { className: "text-2xl", initial: { scale: 0 }, animate: { scale: 1 }, transition: {
                                                                    delay: baseDelay + 0.1,
                                                                    type: 'spring',
                                                                    stiffness: 500,
                                                                    damping: 30,
                                                                }, children: metricIcons[key] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs text-muted-foreground/80 truncate", children: metricLabels[key] }), _jsx("p", { className: "text-xl font-bold text-foreground", children: formatNumber(value) })] })] }), limit && (_jsxs("div", { children: [_jsx("div", { className: "h-1.5 bg-muted/30 rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: {
                                                                        width: `${Math.min(percentage, 100)}%`,
                                                                    }, transition: {
                                                                        // Framer Motion 12: Staggered metric bars
                                                                        type: 'spring',
                                                                        damping: 30,
                                                                        stiffness: 220,
                                                                        delay: baseDelay + 0.2,
                                                                    }, className: cn('h-full rounded-full', isNearLimit
                                                                        ? 'bg-gradient-to-r from-amber-500/80 to-amber-500'
                                                                        : 'bg-gradient-to-r from-primary/80 to-primary') }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [formatNumber(limit.current), " /", ' ', formatNumber(limit.limit), isNearLimit && ' ⚠️'] })] }))] }, key));
                                        }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Cost Breakdown" }), _jsxs("div", { className: "space-y-2", children: [stats.costs.breakdown.map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20, scale: 0.95 }, animate: { opacity: 1, x: 0, scale: 1 }, transition: {
                                                    delay: index * 0.05,
                                                    duration: DURATION_SECONDS.normal,
                                                    ease: EASING_FRAMER.sharp,
                                                }, className: "flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors duration-200", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: item.category }), _jsxs("p", { className: "text-xs text-muted-foreground/80", children: [formatNumber(item.quantity), " \u00D7", ' ', formatCurrency(item.unitPrice)] })] }), _jsx("p", { className: "text-sm font-bold", children: formatCurrency(item.amount) })] }, index))), _jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)]", children: [_jsx("p", { className: "text-sm font-bold", children: "Total" }), _jsx("p", { className: "text-lg font-bold", children: formatCurrency(stats.costs.total) })] })] })] }), limits.some((l) => (l.current / l.limit) * 100 > 80) && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: {
                                    duration: DURATION_SECONDS.normal,
                                    ease: EASING_FRAMER.sharp,
                                }, className: "p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-xl shadow-[0_2px_8px_rgba(245,158,11,0.1)]", children: [_jsx("h4", { className: "text-sm font-semibold mb-2 flex items-center gap-2", children: "\u26A0\uFE0F Approaching Limits" }), _jsx("ul", { className: "text-xs space-y-1 text-muted-foreground", children: limits
                                            .filter((l) => (l.current / l.limit) * 100 > 80)
                                            .map((limit) => (_jsxs("li", { children: ["\u2022 ", metricLabels[limit.metric], ":", ' ', formatNumber(limit.current), " /", ' ', formatNumber(limit.limit), " (", ((limit.current / limit.limit) * 100).toFixed(0), "%)"] }, limit.metric))) }), limits[0]?.resetDate && (_jsxs("p", { className: "text-xs mt-2 text-muted-foreground/80", children: ["Resets on ", limits[0].resetDate.toLocaleDateString()] }))] })), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "p-3 rounded-lg bg-muted/50 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Period" }), _jsx("p", { className: "text-sm font-semibold capitalize", children: stats.period })] }), _jsxs("div", { className: "p-3 rounded-lg bg-muted/50 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Start Date" }), _jsx("p", { className: "text-sm font-semibold", children: stats.startDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                }) })] }), _jsxs("div", { className: "p-3 rounded-lg bg-muted/50 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "End Date" }), _jsx("p", { className: "text-sm font-semibold", children: stats.endDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                }) })] })] }), _jsxs("div", { className: "p-4 bg-muted/50 rounded-lg", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "\uD83D\uDCA1 Tips to Save Credits" }), _jsxs("ul", { className: "text-xs space-y-1 text-muted-foreground", children: [_jsx("li", { children: "\u2022 Use shorter prompts for simple questions" }), _jsx("li", { children: "\u2022 Enable context management to reduce redundant queries" }), _jsx("li", { children: "\u2022 Batch similar questions together" }), _jsx("li", { children: "\u2022 Use the prompt library for efficient templates" })] })] })] }) }) })] }));
}
UsageDashboard.displayName = 'UsageDashboard';
//# sourceMappingURL=usage-dashboard.js.map