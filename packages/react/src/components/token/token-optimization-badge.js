import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Token Optimization Badge Component
 *
 * Compact badge showing token savings and optimization status.
 * Perfect for headers, toolbars, or compact UIs.
 */
import * as React from 'react';
import {} from '../../hooks/token/use-token-optimization';
import { cn } from '@clarity-chat/primitives';
/**
 * Format number with commas
 */
function formatNumber(num) {
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}k`;
    }
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
 * Token Optimization Badge component
 *
 * @example
 * ```tsx
 * const { stats } = useTokenOptimization({ enableCaching: true })
 *
 * <TokenOptimizationBadge stats={stats} showCost={true} />
 * ```
 */
export function TokenOptimizationBadge({ stats, showCost = false, className, size = 'md', }) {
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };
    return (_jsxs("div", { className: cn('inline-flex items-center gap-2.5 rounded-full border border-border/40 bg-muted/60 shadow-sm px-3 py-1.5', sizeClasses[size], className), children: [_jsx("svg", { className: "h-4 w-4 text-success", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" }) }), _jsxs("span", { className: "font-semibold text-success", children: [formatNumber(stats.tokensSaved), " saved"] }), showCost && stats.costSavings > 0 && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-muted-foreground/90", children: "\u2022" }), _jsx("span", { className: "text-muted-foreground/90", children: formatCost(stats.costSavings) })] }))] }));
}
//# sourceMappingURL=token-optimization-badge.js.map