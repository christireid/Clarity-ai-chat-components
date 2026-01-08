import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Token Optimization Panel Component
 *
 * Displays real-time token optimization statistics and controls.
 * Shows savings, cache performance, and optimization metrics.
 */
import * as React from 'react';
import { useTokenOptimization, } from '../../hooks/token/use-token-optimization';
import { cn } from '@clarity-chat/primitives';
/**
 * Format number with commas
 */
function formatNumber(num) {
    return num.toLocaleString();
}
/**
 * Format cost in dollars
 */
function formatCost(cost) {
    if (cost < 0.01) {
        return `$${(cost * 1000).toFixed(2)}`;
    }
    return `$${cost.toFixed(2)}`;
}
/**
 * Token Optimization Panel component
 *
 * @example
 * ```tsx
 * const { stats } = useTokenOptimization({ enableCaching: true })
 *
 * <TokenOptimizationPanel
 *   stats={stats}
 *   showDetails={true}
 *   showCacheStats={true}
 * />
 * ```
 */
export function TokenOptimizationPanel({ stats, showDetails = true, showCacheStats = true, showRoutingStats = true, className, size = 'md', }) {
    const cacheHitRate = stats.cacheHits + stats.cacheMisses > 0
        ? (stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100
        : 0;
    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
    };
    return (_jsxs("div", { className: cn('rounded-lg border border-border/60 bg-card p-4 shadow-[0_1px_3px_rgba(15,23,42,0.1)]', sizeClasses[size], className), children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold", children: "Token Optimization" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-success font-medium", children: [formatNumber(stats.tokensSaved), " tokens saved"] }), stats.costSavings > 0 && (_jsxs("span", { className: "text-muted-foreground", children: ["(", formatCost(stats.costSavings), ")"] }))] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground text-xs", children: "Tokens Saved" }), _jsx("div", { className: "text-lg font-semibold text-success", children: formatNumber(stats.tokensSaved) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [stats.percentageSaved.toFixed(1), "% reduction"] })] }), showCacheStats && (_jsxs("div", { children: [_jsx("div", { className: "text-muted-foreground text-xs", children: "Cache Hit Rate" }), _jsxs("div", { className: "text-lg font-semibold", children: [cacheHitRate.toFixed(1), "%"] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [stats.cacheHits, " hits / ", stats.cacheMisses, " misses"] })] }))] }), showDetails && (_jsxs("div", { className: "space-y-2 border-t pt-4", children: [showCacheStats && stats.cacheHits + stats.cacheMisses > 0 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Cache Performance" }), _jsxs("span", { className: "font-medium", children: [stats.cacheHits, " / ", stats.cacheHits + stats.cacheMisses, " hits"] })] })), stats.requestsThrottled > 0 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Requests Throttled" }), _jsx("span", { className: "font-medium", children: stats.requestsThrottled })] })), showRoutingStats &&
                        stats.simpleModelRoutes + stats.complexModelRoutes > 0 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Model Routing" }), _jsxs("span", { className: "font-medium", children: [stats.simpleModelRoutes, " simple / ", stats.complexModelRoutes, ' ', "complex"] })] })), stats.costSavings > 0 && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Cost Savings" }), _jsx("span", { className: "font-medium text-success", children: formatCost(stats.costSavings) })] }))] }))] }));
}
//# sourceMappingURL=token-optimization-panel.js.map