'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, cn } from '@clarity-chat/primitives';
import { getStatusColor, formatTokenUsage, estimateTokenCost, } from '../../hooks/token/use-token-budget-monitor';
import { DURATION_SECONDS as durations } from '../../animations/constants';
/**
 * Maps status to Tailwind color classes
 */
const statusColorMap = {
    safe: {
        bg: 'bg-green-500',
        text: 'text-green-600 dark:text-green-400',
    },
    warning: {
        bg: 'bg-yellow-500',
        text: 'text-yellow-600 dark:text-yellow-400',
    },
    critical: {
        bg: 'bg-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
    },
    exceeded: {
        bg: 'bg-red-500',
        text: 'text-red-600 dark:text-red-400',
    },
};
/**
 * Size configurations
 */
const sizeConfig = {
    sm: {
        height: 'h-1.5',
        text: 'text-xs',
        padding: 'p-2',
        gap: 'gap-1.5',
    },
    md: {
        height: 'h-2',
        text: 'text-sm',
        padding: 'p-3',
        gap: 'gap-2',
    },
    lg: {
        height: 'h-3',
        text: 'text-base',
        padding: 'p-4',
        gap: 'gap-3',
    },
};
/**
 * TokenBudgetBar Component
 *
 * Visual progress bar showing current token budget utilization with
 * color-coded status states (green → yellow → orange → red).
 *
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { usage, isCalculating } = useTokenBudgetMonitor({
 *     maxInputTokens: 128000,
 *   })
 *
 *   return (
 *     <div>
 *       <TokenBudgetBar
 *         usage={usage}
 *         isCalculating={isCalculating}
 *         showTooltip
 *       />
 *       <input ... />
 *     </div>
 *   )
 * }
 * ```
 */
export function TokenBudgetBar({ usage, isCalculating = false, showTooltip = true, showLabel = true, size = 'md', compact = false, className, onClick, animated = true, model, showCost = false, ariaLabel = 'Token Budget', id, }) {
    const [showDetails, setShowDetails] = React.useState(false);
    const containerRef = React.useRef(null);
    const tooltipId = id ? `${id}-tooltip` : React.useId();
    const statusId = id ? `${id}-status` : React.useId();
    const colors = statusColorMap[usage.status];
    const sizeStyles = sizeConfig[size];
    // Calculate cost estimate if model is provided
    const costEstimate = React.useMemo(() => {
        if (!model || !showCost)
            return null;
        return estimateTokenCost(usage, model);
    }, [model, showCost, usage]);
    // Calculate visual width - cap at 100% for the bar but show exceeded state
    const barWidthPercent = Math.min(usage.utilizationPercent, 100);
    // Determine if we should show the exceeded overflow indicator
    const showExceeded = usage.exceededPercent > 0;
    // Generate accessible status description
    const statusDescription = React.useMemo(() => {
        const percentage = usage.utilizationPercent.toFixed(0);
        const currentFormatted = usage.current.toLocaleString();
        const maxFormatted = usage.effectiveMax.toLocaleString();
        const availableFormatted = usage.available.toLocaleString();
        let statusText = '';
        switch (usage.status) {
            case 'exceeded':
                statusText = `Budget exceeded by ${usage.exceededPercent.toFixed(1)}%. `;
                break;
            case 'critical':
                statusText = 'Critical: approaching token limit. ';
                break;
            case 'warning':
                statusText = 'Warning: token usage is high. ';
                break;
            default:
                statusText = '';
        }
        return `${statusText}${percentage}% used. ${currentFormatted} of ${maxFormatted} tokens. ${availableFormatted} available.`;
    }, [usage]);
    // Keyboard handler for interactive elements
    const handleKeyDown = React.useCallback((event) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            onClick();
        }
        if (showTooltip && event.key === 'Escape' && showDetails) {
            setShowDetails(false);
        }
    }, [onClick, showTooltip, showDetails]);
    // Focus/blur handlers for tooltip
    const handleFocus = React.useCallback(() => {
        if (showTooltip)
            setShowDetails(true);
    }, [showTooltip]);
    const handleBlur = React.useCallback((event) => {
        // Only close if focus leaves the container entirely
        if (showTooltip &&
            containerRef.current &&
            !containerRef.current.contains(event.relatedTarget)) {
            setShowDetails(false);
        }
    }, [showTooltip]);
    const BarContent = (_jsxs("div", { role: "progressbar", "aria-valuenow": usage.current, "aria-valuemin": 0, "aria-valuemax": usage.effectiveMax, "aria-label": ariaLabel, "aria-describedby": statusId, className: cn('relative w-full rounded-full bg-muted overflow-hidden', sizeStyles.height), children: [animated ? (_jsx(motion.div, { className: cn('absolute inset-y-0 left-0 rounded-full', colors.bg, showExceeded && 'animate-pulse'), initial: { width: 0 }, animate: { width: `${barWidthPercent}%` }, transition: { duration: durations.moderate, ease: 'easeOut' }, "aria-hidden": "true" })) : (_jsx("div", { className: cn('absolute inset-y-0 left-0 rounded-full transition-all duration-300', colors.bg, showExceeded && 'animate-pulse'), style: { width: `${barWidthPercent}%` }, "aria-hidden": "true" })), isCalculating && (_jsx(motion.div, { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent", animate: { x: ['-100%', '100%'] }, transition: {
                    duration: durations.slower,
                    repeat: Infinity,
                    ease: 'linear',
                }, "aria-hidden": "true" }))] }));
    // Compact mode - just the bar
    if (compact) {
        return (_jsxs("div", { className: cn('w-full', className), onClick: onClick, onKeyDown: onClick ? handleKeyDown : undefined, tabIndex: onClick ? 0 : undefined, role: onClick ? 'button' : undefined, "aria-label": onClick ? `${ariaLabel}. Click to manage budget.` : undefined, children: [BarContent, _jsx("span", { id: statusId, className: "sr-only", children: statusDescription })] }));
    }
    const content = (_jsxs("div", { ref: containerRef, className: cn('flex flex-col w-full', sizeStyles.gap, onClick &&
            'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md', className), onClick: onClick, onKeyDown: handleKeyDown, onMouseEnter: () => showTooltip && setShowDetails(true), onMouseLeave: () => showTooltip && setShowDetails(false), onFocus: handleFocus, onBlur: handleBlur, tabIndex: onClick || showTooltip ? 0 : undefined, role: onClick ? 'button' : undefined, "aria-expanded": showTooltip ? showDetails : undefined, "aria-describedby": showDetails ? tooltipId : statusId, children: [showLabel && (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: cn('flex items-center', sizeStyles.gap), children: [_jsx("span", { className: cn('font-medium', sizeStyles.text, colors.text), "aria-live": "polite", children: formatTokenUsage(usage) }), isCalculating && (_jsx(motion.span, { className: cn('text-muted-foreground', sizeStyles.text), initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: "Calculating..." }))] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [costEstimate && (_jsxs("span", { className: cn('font-mono text-muted-foreground', sizeStyles.text), children: ["~", costEstimate.formattedCost] })), usage.status !== 'safe' && (_jsx(Badge, { variant: usage.status === 'exceeded'
                                    ? 'destructive'
                                    : usage.status === 'critical'
                                        ? 'warning'
                                        : 'secondary', className: sizeStyles.text, children: usage.status === 'exceeded'
                                    ? 'Over Budget'
                                    : usage.status === 'critical'
                                        ? 'Critical'
                                        : 'Warning' }))] })] })), BarContent, showExceeded && showLabel && (_jsxs(motion.div, { className: cn('flex items-center', sizeStyles.gap), initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, role: "alert", "aria-live": "assertive", children: [_jsxs("span", { className: cn('text-red-600 dark:text-red-400 font-medium', sizeStyles.text), children: [usage.exceededPercent.toFixed(1), "% over budget"] }), _jsx("span", { className: cn('text-muted-foreground', sizeStyles.text), children: "\u2014 Consider trimming context" })] })), _jsx("span", { id: statusId, className: "sr-only", children: statusDescription })] }));
    if (!showTooltip) {
        return content;
    }
    return (_jsxs("div", { className: "relative", children: [content, _jsx(AnimatePresence, { children: showDetails && (_jsx(motion.div, { id: tooltipId, role: "tooltip", initial: { opacity: 0, y: 4, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 4, scale: 0.95 }, transition: { duration: durations.fast }, className: "absolute left-0 right-0 z-50 mt-2 rounded-lg border bg-popover p-3 shadow-lg", children: _jsxs("div", { className: "space-y-2 text-sm", children: [_jsx("div", { className: "font-semibold", id: `${tooltipId}-title`, children: "Token Budget Details" }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-muted-foreground", children: [_jsx("span", { children: "Current:" }), _jsx("span", { className: "text-right font-mono", children: usage.current.toLocaleString() }), _jsx("span", { children: "Max (Input):" }), _jsx("span", { className: "text-right font-mono", children: usage.max.toLocaleString() }), _jsx("span", { children: "Reserved (Output):" }), _jsx("span", { className: "text-right font-mono", children: usage.reservedForOutput.toLocaleString() }), _jsx("span", { children: "Effective Max:" }), _jsx("span", { className: "text-right font-mono", children: usage.effectiveMax.toLocaleString() }), _jsx("span", { children: "Available:" }), _jsx("span", { className: cn('text-right font-mono', usage.available <= 0 && 'text-red-500'), children: usage.available.toLocaleString() })] }), costEstimate && (_jsxs("div", { className: "border-t pt-2 mt-2", children: [_jsx("div", { className: "font-semibold mb-1", children: "Estimated Cost" }), _jsxs("div", { className: "grid grid-cols-2 gap-1 text-muted-foreground", children: [_jsxs("span", { children: ["Input (", usage.current.toLocaleString(), "):"] }), _jsxs("span", { className: "text-right font-mono", children: ["$", costEstimate.inputCost.toFixed(4)] }), _jsx("span", { children: "Output (reserved):" }), _jsxs("span", { className: "text-right font-mono", children: ["$", costEstimate.estimatedOutputCost.toFixed(4)] }), _jsx("span", { className: "font-medium", children: "Total:" }), _jsx("span", { className: "text-right font-mono font-medium", children: costEstimate.formattedCost })] })] })), usage.status !== 'safe' && (_jsx("div", { className: "border-t pt-2", children: _jsxs("div", { className: "text-xs text-muted-foreground", children: [usage.status === 'exceeded' &&
                                            'Budget exceeded. Trim older messages to continue.', usage.status === 'critical' &&
                                            'Approaching limit. Consider trimming context.', usage.status === 'warning' &&
                                            'Monitor usage. Budget filling up.'] }) }))] }) })) })] }));
}
TokenBudgetBar.displayName = 'TokenBudgetBar';
/**
 * Compact inline token indicator for space-constrained UIs
 */
export function TokenBudgetIndicator({ usage, className, ariaLabel = 'Token usage', }) {
    const colors = statusColorMap[usage.status];
    const percentage = usage.utilizationPercent.toFixed(0);
    // Generate status-aware accessible description
    const statusText = usage.status === 'exceeded'
        ? 'exceeded'
        : usage.status === 'critical'
            ? 'critical'
            : usage.status === 'warning'
                ? 'high'
                : 'normal';
    return (_jsxs("div", { className: cn('inline-flex items-center gap-1.5', className), role: "status", "aria-label": `${ariaLabel}: ${percentage}% used, ${statusText}`, children: [_jsx("div", { className: cn('h-2 w-2 rounded-full', colors.bg), "aria-hidden": "true" }), _jsxs("span", { className: cn('text-xs font-mono', colors.text), children: [usage.utilizationPercent.toFixed(0), "%"] })] }));
}
TokenBudgetIndicator.displayName = 'TokenBudgetIndicator';
//# sourceMappingURL=token-budget-bar.js.map