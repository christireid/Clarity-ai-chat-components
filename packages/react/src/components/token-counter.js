'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
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
        return `$${(cost * 100).toFixed(3)}¢`;
    }
    return `$${cost.toFixed(2)}`;
}
/**
 * Production-ready Token Counter component with cost transparency.
 *
 * **Features:**
 * - Real-time token count display
 * - Cost estimation based on token pricing
 * - Visual progress bar with color-coded thresholds
 * - Warning alerts at 80% and 95% usage
 * - Smart pruning suggestions
 * - Responsive sizing (sm, md, lg)
 * - Accessible (ARIA labels, color contrast)
 *
 * **Use Cases:**
 * - Display current conversation token usage
 * - Warn users before hitting context limits
 * - Show estimated API costs in real-time
 * - Suggest context pruning when approaching limits
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TokenCounter
 *   currentTokens={1250}
 *   maxTokens={4096}
 * />
 *
 * // With cost estimation
 * <TokenCounter
 *   currentTokens={3500}
 *   maxTokens={4096}
 *   costPerToken={0.000002} // $0.002 per 1K tokens
 *   showCost={true}
 * />
 *
 * // With warnings and pruning
 * <TokenCounter
 *   currentTokens={3400}
 *   maxTokens={4096}
 *   showWarning={true}
 *   warningThreshold={0.8}
 *   criticalThreshold={0.95}
 *   suggestPruning={true}
 *   onWarning={() => {
 *     console.log('Approaching token limit')
 *   }}
 *   onCritical={() => {
 *     console.log('Critical token limit!')
 *     showPruneDialog()
 *   }}
 *   onPruneSuggested={() => {
 *     pruneOldMessages()
 *   }}
 * />
 *
 * // Small variant for compact UI
 * <TokenCounter
 *   currentTokens={500}
 *   maxTokens={4096}
 *   size="sm"
 *   showBar={false}
 * />
 * ```
 */
export function TokenCounter({ currentTokens, maxTokens, costPerToken, showWarning = true, warningThreshold = 0.8, criticalThreshold = 0.95, showCost = true, showBar = true, onWarning, onCritical, suggestPruning = false, onPruneSuggested, size = 'md', className = '', }) {
    const [hasWarnedOnce, setHasWarnedOnce] = React.useState(false);
    const [hasCriticalOnce, setHasCriticalOnce] = React.useState(false);
    const percentage = Math.min((currentTokens / maxTokens) * 100, 100);
    const isWarning = percentage >= warningThreshold * 100;
    const isCritical = percentage >= criticalThreshold * 100;
    const estimatedCost = costPerToken ? currentTokens * costPerToken : null;
    /**
     * Trigger warning callbacks
     */
    React.useEffect(() => {
        if (showWarning) {
            if (isCritical && !hasCriticalOnce) {
                setHasCriticalOnce(true);
                onCritical?.();
            }
            else if (isWarning && !hasWarnedOnce && !isCritical) {
                setHasWarnedOnce(true);
                onWarning?.();
            }
        }
    }, [isWarning, isCritical, showWarning, hasWarnedOnce, hasCriticalOnce, onWarning, onCritical]);
    // Reset warnings when usage drops
    React.useEffect(() => {
        if (percentage < warningThreshold * 100) {
            setHasWarnedOnce(false);
            setHasCriticalOnce(false);
        }
    }, [percentage, warningThreshold]);
    // Size classes
    const sizeClasses = {
        sm: {
            container: 'text-xs',
            bar: 'h-1',
            icon: 'w-3 h-3',
        },
        md: {
            container: 'text-sm',
            bar: 'h-2',
            icon: 'w-4 h-4',
        },
        lg: {
            container: 'text-base',
            bar: 'h-3',
            icon: 'w-5 h-5',
        },
    };
    // Status color classes
    const getColorClasses = () => {
        if (isCritical) {
            return {
                text: 'text-destructive',
                bg: 'bg-destructive',
                border: 'border-destructive/20',
            };
        }
        if (isWarning) {
            return {
                text: 'text-[hsl(var(--warning))]',
                bg: 'bg-[hsl(var(--warning))]',
                border: 'border-[hsl(var(--warning))]/20',
            };
        }
        return {
            text: 'text-[hsl(var(--success))]',
            bg: 'bg-[hsl(var(--success))]',
            border: 'border-[hsl(var(--success))]/20',
        };
    };
    const colors = getColorClasses();
    const sizes = sizeClasses[size];
    return (_jsxs("div", { className: `flex flex-col gap-2 ${sizes.container} ${className}`, role: "status", "aria-label": `Token usage: ${currentTokens} of ${maxTokens} (${percentage.toFixed(1)}%)`, children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsxs("div", { className: `flex items-center gap-2 font-medium ${colors.text}`, children: [_jsx("svg", { className: sizes.icon, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsxs("span", { children: [formatNumber(currentTokens), " / ", formatNumber(maxTokens), " tokens"] })] }), showCost && estimatedCost !== null && (_jsx("div", { className: "text-muted-foreground font-mono", children: formatCost(estimatedCost) }))] }), showBar && (_jsx("div", { className: "relative w-full bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `${sizes.bar} ${colors.bg} transition-all duration-150 ease-out`, style: { width: `${percentage}%` }, role: "progressbar", "aria-valuenow": currentTokens, "aria-valuemin": 0, "aria-valuemax": maxTokens }) })), _jsxs("div", { className: `text-xs ${colors.text}`, children: [percentage.toFixed(1), "% of context window used"] }), showWarning && isWarning && (_jsxs("div", { className: `flex items-start gap-2 p-3 rounded-lg border ${colors.border} ${colors.bg}/10 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]`, role: "alert", children: [_jsx("svg", { className: `flex-shrink-0 w-5 h-5 ${colors.text}`, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: `font-medium ${colors.text}`, children: isCritical
                                    ? 'Context Limit Nearly Reached'
                                    : 'Approaching Context Limit' }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: isCritical
                                    ? 'The conversation may be truncated soon. Consider pruning older messages.'
                                    : 'You\'re using a large portion of the context window. Older messages may be excluded.' }), suggestPruning && isCritical && onPruneSuggested && (_jsx("button", { onClick: onPruneSuggested, className: `mt-2 text-xs font-medium ${colors.text} hover:underline focus:outline-none transition-opacity hover:opacity-80`, children: "\u2192 Prune old messages to free up space" }))] })] }))] }));
}
//# sourceMappingURL=token-counter.js.map