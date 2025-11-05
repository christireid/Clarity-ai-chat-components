import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, ScrollArea, cn, } from '@clarity-chat/primitives';
export const UsageDashboard = React.memo(function UsageDashboard({ balance, stats, limits = [], onPurchaseCredits, className, }) {
    const usagePercentage = (balance.used / balance.total) * 100;
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
    return (_jsxs(Card, { className: cn('h-full flex flex-col', className), children: [_jsx(CardHeader, { children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Usage Dashboard", isLowBalance && (_jsx(Badge, { variant: "destructive", className: "animate-pulse", children: "Low Balance" }))] }), _jsx(CardDescription, { children: "Track your usage and manage credits" })] }), onPurchaseCredits && (_jsx(Button, { onClick: onPurchaseCredits, size: "sm", children: "\uD83D\uDCB3 Buy Credits" }))] }) }), _jsx(CardContent, { className: "flex-1 overflow-hidden", children: _jsx(ScrollArea, { className: "h-full", children: _jsxs("div", { className: "space-y-6 pb-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-sm font-semibold", children: "Credit Balance" }), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-2xl font-bold", children: formatNumber(balance.available) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["of ", formatNumber(balance.total), " credits"] })] })] }), _jsx("div", { className: "relative h-3 bg-muted rounded-full overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${usagePercentage}%` }, transition: { duration: 0.8, ease: 'easeOut' }, className: cn('h-full rounded-full', isLowBalance ? 'bg-destructive' : 'bg-primary') }) }), _jsxs("div", { className: "flex items-center justify-between mt-2 text-xs text-muted-foreground", children: [_jsxs("span", { children: [formatNumber(balance.used), " used"] }), _jsxs("span", { children: [usagePercentage.toFixed(1), "%"] })] }), balance.nextRefillDate && (_jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [balance.autoRefill ? '🔄 Auto-refill' : 'Next refill', " on", ' ', balance.nextRefillDate.toLocaleDateString()] }))] }), _jsxs("div", { children: [_jsxs("h3", { className: "text-sm font-semibold mb-3", children: ["Usage This ", stats.period] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: Object.keys(stats.metrics).map((key) => {
                                            const value = stats.metrics[key];
                                            const limit = limits.find((l) => l.metric === key);
                                            const percentage = limit
                                                ? (limit.current / limit.limit) * 100
                                                : 0;
                                            const isNearLimit = percentage > 80;
                                            return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: cn('p-4 rounded-lg border', isNearLimit &&
                                                    'border-[hsl(var(--warning))]/50 bg-[hsl(var(--warning))]/5'), children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "text-2xl", children: metricIcons[key] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs text-muted-foreground truncate", children: metricLabels[key] }), _jsx("p", { className: "text-xl font-bold", children: formatNumber(value) })] })] }), limit && (_jsxs("div", { children: [_jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: cn('h-full rounded-full transition-all duration-200', isNearLimit
                                                                        ? 'bg-[hsl(var(--warning))]'
                                                                        : 'bg-primary'), style: {
                                                                        width: `${Math.min(percentage, 100)}%`,
                                                                    } }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [formatNumber(limit.current), " /", ' ', formatNumber(limit.limit), isNearLimit && ' ⚠️'] })] }))] }, key));
                                        }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold mb-3", children: "Cost Breakdown" }), _jsxs("div", { className: "space-y-2", children: [stats.costs.breakdown.map((item, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.05 }, className: "flex items-center justify-between p-3 rounded-lg bg-muted/50", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", children: item.category }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [formatNumber(item.quantity), " \u00D7", ' ', formatCurrency(item.unitPrice)] })] }), _jsx("p", { className: "text-sm font-bold", children: formatCurrency(item.amount) })] }, index))), _jsxs("div", { className: "flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20", children: [_jsx("p", { className: "text-sm font-bold", children: "Total" }), _jsx("p", { className: "text-lg font-bold", children: formatCurrency(stats.costs.total) })] })] })] }), limits.some((l) => (l.current / l.limit) * 100 > 80) && (_jsxs("div", { className: "p-4 bg-[hsl(var(--warning))]/10 border border-[hsl(var(--warning))]/20 rounded-lg shadow-sm", children: [_jsx("h4", { className: "text-sm font-semibold mb-2 flex items-center gap-2", children: "\u26A0\uFE0F Approaching Limits" }), _jsx("ul", { className: "text-xs space-y-1 text-muted-foreground", children: limits
                                            .filter((l) => (l.current / l.limit) * 100 > 80)
                                            .map((limit) => (_jsxs("li", { children: ["\u2022 ", metricLabels[limit.metric], ":", ' ', formatNumber(limit.current), " /", ' ', formatNumber(limit.limit), " (", ((limit.current / limit.limit) * 100).toFixed(0), "%)"] }, limit.metric))) }), _jsxs("p", { className: "text-xs mt-2", children: ["Resets on ", limits[0]?.resetDate.toLocaleDateString()] })] })), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "p-3 rounded-lg bg-muted/50 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Period" }), _jsx("p", { className: "text-sm font-semibold capitalize", children: stats.period })] }), _jsxs("div", { className: "p-3 rounded-lg bg-muted/50 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Start Date" }), _jsx("p", { className: "text-sm font-semibold", children: stats.startDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                }) })] }), _jsxs("div", { className: "p-3 rounded-lg bg-muted/50 text-center", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "End Date" }), _jsx("p", { className: "text-sm font-semibold", children: stats.endDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                }) })] })] }), _jsxs("div", { className: "p-4 bg-muted/50 rounded-lg", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", children: "\uD83D\uDCA1 Tips to Save Credits" }), _jsxs("ul", { className: "text-xs space-y-1 text-muted-foreground", children: [_jsx("li", { children: "\u2022 Use shorter prompts for simple questions" }), _jsx("li", { children: "\u2022 Enable context management to reduce redundant queries" }), _jsx("li", { children: "\u2022 Batch similar questions together" }), _jsx("li", { children: "\u2022 Use the prompt library for efficient templates" })] })] })] }) }) })] }));
});
UsageDashboard.displayName = 'UsageDashboard';
//# sourceMappingURL=usage-dashboard.js.map