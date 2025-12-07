'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
/**
 * Token Optimization Dashboard Component
 *
 * Displays comprehensive token optimization metrics and savings.
 *
 * @example
 * ```tsx
 * <TokenOptimizationDashboard
 *   metrics={{
 *     totalTokens: 50000,
 *     tokensSaved: 15000,
 *     costSaved: 0.45,
 *     breakdown: {
 *       promptCompression: { tokens: 4000, percent: 27 },
 *       caching: { hits: 120, savings: 5000 },
 *       modelRouting: { savings: 3000, percent: 40 },
 *       responseLimiting: { tokens: 2000, percent: 15 },
 *       batching: { requests: 50, savings: 800 },
 *       throttling: { callsSaved: 200 },
 *       referencing: { bytesSaved: 50000, percent: 60 },
 *     },
 *     savingsPercent: 30,
 *   }}
 *   showBreakdown={true}
 * />
 * ```
 */
export function TokenOptimizationDashboard({ metrics, showBreakdown = true, realTime = false, refreshInterval = 5000, costPerToken: _costPerToken = 0.000002, className = '', onClick, }) {
    const [displayMetrics, setDisplayMetrics] = React.useState(metrics);
    // Real-time updates
    React.useEffect(() => {
        if (!realTime) {
            setDisplayMetrics(metrics);
            return;
        }
        const interval = setInterval(() => {
            setDisplayMetrics(metrics);
        }, refreshInterval);
        return () => clearInterval(interval);
    }, [metrics, realTime, refreshInterval]);
    const formatNumber = (num) => num.toLocaleString();
    const formatCost = (cost) => {
        if (cost < 0.01)
            return `$${(cost * 100).toFixed(3)}¢`;
        return `$${cost.toFixed(2)}`;
    };
    return (_jsxs("div", { className: `p-6 bg-card rounded-lg border border-border/50 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] ${className}`, onClick: onClick, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Token Optimization" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Real-time savings and efficiency metrics" })] }), realTime && (_jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }), "Live"] }))] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-success/10 border border-success/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-success", children: formatNumber(displayMetrics.tokensSaved) }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Tokens Saved" }), _jsxs("div", { className: "text-xs text-success mt-2", children: [displayMetrics.savingsPercent.toFixed(1), "% reduction"] })] }), _jsxs("div", { className: "p-4 bg-primary/10 border border-primary/20 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-primary", children: formatCost(displayMetrics.costSaved) }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Cost Saved" }), _jsxs("div", { className: "text-xs text-primary mt-2", children: ["Per ", formatNumber(displayMetrics.totalTokens), " tokens"] })] }), _jsxs("div", { className: "p-4 bg-muted border border-border rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-foreground", children: formatNumber(displayMetrics.totalTokens) }), _jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Total Tokens" }), _jsx("div", { className: "text-xs text-muted-foreground mt-2", children: "Processed in session" })] })] }), showBreakdown && (_jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-medium text-foreground mb-3", children: "Optimization Breakdown" }), displayMetrics.breakdown.promptCompression.tokens > 0 && (_jsx(OptimizationItem, { label: "Prompt Compression", value: formatNumber(displayMetrics.breakdown.promptCompression.tokens), percent: displayMetrics.breakdown.promptCompression.percent, icon: "\u2702\uFE0F", description: "Shortened prompts while preserving meaning" })), displayMetrics.breakdown.caching.hits > 0 && (_jsx(OptimizationItem, { label: "Smart Caching", value: formatNumber(displayMetrics.breakdown.caching.savings), percent: (displayMetrics.breakdown.caching.savings /
                            displayMetrics.totalTokens) *
                            100, icon: "\uD83D\uDCBE", description: `${displayMetrics.breakdown.caching.hits} cache hits` })), displayMetrics.breakdown.modelRouting.savings > 0 && (_jsx(OptimizationItem, { label: "Model Routing", value: formatNumber(displayMetrics.breakdown.modelRouting.savings), percent: displayMetrics.breakdown.modelRouting.percent, icon: "\uD83C\uDFAF", description: "Used cheaper models for simple queries" })), displayMetrics.breakdown.responseLimiting.tokens > 0 && (_jsx(OptimizationItem, { label: "Response Limiting", value: formatNumber(displayMetrics.breakdown.responseLimiting.tokens), percent: displayMetrics.breakdown.responseLimiting.percent, icon: "\u2728", description: "Enforced concise responses" })), displayMetrics.breakdown.batching.requests > 0 && (_jsx(OptimizationItem, { label: "Request Batching", value: formatNumber(displayMetrics.breakdown.batching.savings), percent: (displayMetrics.breakdown.batching.savings /
                            displayMetrics.totalTokens) *
                            100, icon: "\uD83D\uDCE6", description: `${displayMetrics.breakdown.batching.requests} requests batched` })), displayMetrics.breakdown.throttling.callsSaved > 0 && (_jsx(OptimizationItem, { label: "Smart Throttling", value: `${displayMetrics.breakdown.throttling.callsSaved} calls`, percent: 0, icon: "\u23F1\uFE0F", description: "Prevented unnecessary API calls" })), displayMetrics.breakdown.referencing.bytesSaved > 0 && (_jsx(OptimizationItem, { label: "Reference Handling", value: `${(displayMetrics.breakdown.referencing.bytesSaved / 1024).toFixed(1)} KB`, percent: displayMetrics.breakdown.referencing.percent, icon: "\uD83D\uDD17", description: "Used references instead of full data" }))] })), _jsx("div", { className: "mt-6 pt-4 border-t border-border", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Average savings per request" }), _jsxs("span", { className: "font-medium text-foreground", children: [displayMetrics.savingsPercent.toFixed(1), "%"] })] }) })] }));
}
function OptimizationItem({ label, value, percent, icon, description, }) {
    return (_jsxs("div", { className: "flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors", children: [_jsx("div", { className: "text-2xl", children: icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-medium text-foreground", children: label }), _jsx("span", { className: "text-sm font-semibold text-success", children: value })] }), _jsx("div", { className: "text-xs text-muted-foreground", children: description }), percent > 0 && (_jsx("div", { className: "mt-2", children: _jsx("div", { className: "h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-success transition-all duration-500", style: { width: `${Math.min(percent, 100)}%` } }) }) }))] })] }));
}
/**
 * Compact version for minimal UI (internal component)
 * Reserved for future use
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function TokenOptimizationCompactBadge({ tokensSaved, savingsPercent, className = '', }) {
    return (_jsxs("div", { className: `inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full ${className}`, children: [_jsx("svg", { className: "w-4 h-4 text-success", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }), _jsxs("span", { className: "text-sm font-medium text-success", children: [tokensSaved.toLocaleString(), " tokens saved (", savingsPercent.toFixed(1), "%)"] })] }));
}
//# sourceMappingURL=token-optimization-dashboard.js.map