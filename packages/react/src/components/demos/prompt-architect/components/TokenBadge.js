'use client';
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * TokenBadge Component
 *
 * Displays real-time token count with utilization bar.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { formatCost } from '../types';
/**
 * Get status color based on utilization
 */
function getStatusColor(percent) {
    if (percent >= 90) {
        return {
            text: 'text-red-600 dark:text-red-400',
            bar: 'bg-red-500',
            label: 'Critical',
        };
    }
    if (percent >= 70) {
        return {
            text: 'text-yellow-600 dark:text-yellow-400',
            bar: 'bg-yellow-500',
            label: 'Warning',
        };
    }
    return {
        text: 'text-muted-foreground',
        bar: 'bg-primary',
        label: 'OK',
    };
}
/**
 * Format number with K suffix for large numbers
 */
function formatTokenCount(count) {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 10000) {
        return `${(count / 1000).toFixed(0)}K`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
}
/**
 * Token count display with progress bar
 */
export const TokenBadge = React.memo(function TokenBadge({ stats, showBreakdown = false, compact = false, className, }) {
    const { totalTokens, maxTokens, utilizationPercent, systemPromptTokens, userPromptTokens, } = stats;
    const statusColor = getStatusColor(utilizationPercent);
    if (compact) {
        return (_jsxs("div", { className: cn('flex items-center gap-2', className), children: [_jsxs("span", { className: cn('text-xs font-mono', statusColor.text), children: ["~", formatTokenCount(totalTokens)] }), _jsx("div", { className: "w-16 h-1.5 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: cn('h-full transition-all duration-300', statusColor.bar), style: { width: `${Math.min(utilizationPercent, 100)}%` } }) }), _jsxs("span", { className: "text-[10px] font-mono text-muted-foreground", title: `Estimated cost: Input ${formatCost(stats.estimatedInputCost)} + Output ${formatCost(stats.estimatedOutputCost)}`, children: ["~", formatCost(stats.estimatedTotalCost)] })] }));
    }
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Tokens" }), _jsxs("span", { className: cn('text-sm font-mono font-medium', statusColor.text), children: [formatTokenCount(totalTokens), " / ", formatTokenCount(maxTokens)] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: cn('h-full transition-all duration-300', statusColor.bar), style: { width: `${Math.min(utilizationPercent, 100)}%` } }) }), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: statusColor.text, children: statusColor.label }), _jsxs("span", { className: "text-muted-foreground", children: [utilizationPercent.toFixed(1), "% used"] })] }), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "Est. cost" }), _jsxs("span", { className: "font-mono text-green-600 dark:text-green-400", title: `Input: ${formatCost(stats.estimatedInputCost)} | Output: ${formatCost(stats.estimatedOutputCost)}`, children: ["~", formatCost(stats.estimatedTotalCost)] })] }), showBreakdown && (_jsxs("div", { className: "pt-2 border-t border-border space-y-1", children: [_jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "System prompt" }), _jsx("span", { className: "font-mono", children: formatTokenCount(systemPromptTokens) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "User prompt" }), _jsx("span", { className: "font-mono", children: formatTokenCount(userPromptTokens) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "Input cost" }), _jsx("span", { className: "font-mono", children: formatCost(stats.estimatedInputCost) })] }), _jsxs("div", { className: "flex justify-between text-xs", children: [_jsx("span", { className: "text-muted-foreground", children: "Output cost (est.)" }), _jsx("span", { className: "font-mono", children: formatCost(stats.estimatedOutputCost) })] })] }))] }));
});
export default TokenBadge;
//# sourceMappingURL=TokenBadge.js.map