'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
import { useReducedMotion } from '@clarity-chat/primitives';
import { DURATION_SECONDS } from '../../animations/constants';
/**
 * Common model pricing presets
 */
export const MODEL_PRICING_PRESETS = {
    'gpt-4o': {
        modelId: 'gpt-4o',
        inputCostPer1K: 0.005,
        outputCostPer1K: 0.015,
    },
    'gpt-4o-mini': {
        modelId: 'gpt-4o-mini',
        inputCostPer1K: 0.00015,
        outputCostPer1K: 0.0006,
    },
    'gpt-4-turbo': {
        modelId: 'gpt-4-turbo',
        inputCostPer1K: 0.01,
        outputCostPer1K: 0.03,
    },
    'claude-3-opus': {
        modelId: 'claude-3-opus',
        inputCostPer1K: 0.015,
        outputCostPer1K: 0.075,
    },
    'claude-3-sonnet': {
        modelId: 'claude-3-sonnet',
        inputCostPer1K: 0.003,
        outputCostPer1K: 0.015,
    },
    'claude-3-haiku': {
        modelId: 'claude-3-haiku',
        inputCostPer1K: 0.00025,
        outputCostPer1K: 0.00125,
    },
    'gemini-pro': {
        modelId: 'gemini-pro',
        inputCostPer1K: 0.00025,
        outputCostPer1K: 0.0005,
    },
    'gemini-1.5-pro': {
        modelId: 'gemini-1.5-pro',
        inputCostPer1K: 0.00125,
        outputCostPer1K: 0.005,
    },
};
/**
 * Format token count with animation-friendly display
 */
function formatTokens(count) {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toLocaleString();
}
/**
 * Calculate cost from token usage and pricing
 */
function calculateCost(usage, pricing) {
    const inputCost = (usage.promptTokens / 1000) * pricing.inputCostPer1K;
    const outputCost = (usage.completionTokens / 1000) * pricing.outputCostPer1K;
    return inputCost + outputCost;
}
/**
 * Format cost in dollars
 */
function formatCost(cost) {
    if (cost < 0.001) {
        return `<$0.001`;
    }
    if (cost < 0.01) {
        return `$${cost.toFixed(4)}`;
    }
    return `$${cost.toFixed(3)}`;
}
/**
 * TokenUsageMeter - Real-time token usage display for streaming responses
 *
 * Shows live token consumption during AI streaming with optional cost estimation.
 * Perfect for cost-conscious AI applications that need transparency.
 *
 * **Features:**
 * - Real-time token count animation
 * - Input/output token breakdown
 * - Cost estimation with model pricing
 * - Multiple display variants
 * - Reduced motion support
 * - Accessible ARIA labels
 *
 * @example
 * ```tsx
 * // Basic usage during streaming
 * <TokenUsageMeter
 *   usage={{ promptTokens: 150, completionTokens: 47, totalTokens: 197 }}
 *   isStreaming={true}
 * />
 *
 * // With cost estimation
 * <TokenUsageMeter
 *   usage={tokenUsage}
 *   pricing={MODEL_PRICING_PRESETS['gpt-4o']}
 *   showCost={true}
 * />
 *
 * // Inline variant for headers
 * <TokenUsageMeter
 *   usage={usage}
 *   variant="inline"
 *   compact={true}
 * />
 * ```
 */
export function TokenUsageMeter({ usage, isStreaming = false, pricing, showCost = true, showBreakdown = true, compact = false, className, variant = 'detailed', }) {
    const prefersReducedMotion = useReducedMotion();
    // Calculate cost if pricing is provided
    const cost = usage && pricing ? calculateCost(usage, pricing) : null;
    // Animation config
    const animationConfig = prefersReducedMotion
        ? { duration: 0 }
        : { type: 'spring', damping: 20, stiffness: 300 };
    if (!usage) {
        return null;
    }
    // Inline variant - minimal display
    if (variant === 'inline') {
        return (_jsxs("div", { className: cn('inline-flex items-center gap-2 text-xs text-muted-foreground font-mono', className), role: "status", "aria-label": `Token usage: ${usage.totalTokens} tokens`, children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(TokenIcon, { className: "w-3 h-3" }), _jsx(AnimatePresence, { mode: "popLayout", children: _jsx(motion.span, { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 5 }, transition: animationConfig, children: formatTokens(usage.totalTokens) }, usage.totalTokens) })] }), showCost && cost !== null && (_jsx("span", { className: "text-muted-foreground/60", children: formatCost(cost) })), isStreaming && (_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }))] }));
    }
    // Minimal variant
    if (variant === 'minimal') {
        return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: cn('flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50 border border-border/50', compact && 'px-2 py-1', className), role: "status", "aria-label": `Token usage: ${usage.totalTokens} total tokens`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TokenIcon, { className: cn('text-muted-foreground', compact ? 'w-3 h-3' : 'w-4 h-4') }), _jsxs("div", { className: cn('font-mono', compact ? 'text-xs' : 'text-sm'), children: [_jsx(AnimatePresence, { mode: "popLayout", children: _jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "font-medium", children: formatTokens(usage.totalTokens) }, usage.totalTokens) }), _jsx("span", { className: "text-muted-foreground ml-1", children: "tokens" })] })] }), showCost && cost !== null && (_jsx("div", { className: cn('font-mono text-muted-foreground', compact ? 'text-xs' : 'text-sm'), children: formatCost(cost) })), isStreaming && (_jsx(motion.div, { animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: DURATION_SECONDS.slower }, className: "w-2 h-2 rounded-full bg-green-500" }))] }));
    }
    // Detailed variant (default)
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: animationConfig, className: cn('flex flex-col gap-2 p-4 rounded-xl bg-muted/30 border border-border/50', compact && 'p-3 gap-1.5', className), role: "status", "aria-label": `Token usage: ${usage.promptTokens} input, ${usage.completionTokens} output, ${usage.totalTokens} total`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TokenIcon, { className: cn('text-muted-foreground', compact ? 'w-4 h-4' : 'w-5 h-5') }), _jsx("span", { className: cn('font-medium', compact ? 'text-sm' : 'text-base'), children: "Token Usage" }), isStreaming && (_jsx(motion.span, { animate: { opacity: [1, 0.5, 1] }, transition: {
                                    repeat: Infinity,
                                    duration: DURATION_SECONDS.slower,
                                }, className: "text-xs text-green-600 dark:text-green-400 font-medium", children: "Live" }))] }), showCost && cost !== null && (_jsx("div", { className: cn('font-mono font-medium', compact ? 'text-sm' : 'text-base'), children: formatCost(cost) }))] }), showBreakdown && (_jsxs("div", { className: cn('grid grid-cols-3 gap-3', compact && 'gap-2'), children: [_jsx(TokenStat, { label: "Input", value: usage.promptTokens, color: "blue", compact: compact, prefersReducedMotion: prefersReducedMotion }), _jsx(TokenStat, { label: "Output", value: usage.completionTokens, color: "green", compact: compact, prefersReducedMotion: prefersReducedMotion }), _jsx(TokenStat, { label: "Total", value: usage.totalTokens, color: "purple", compact: compact, prefersReducedMotion: prefersReducedMotion })] })), pricing && (_jsxs("div", { className: cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm'), children: ["Model: ", pricing.modelId] }))] }));
}
/**
 * Token statistic display
 */
function TokenStat({ label, value, color, compact, prefersReducedMotion, }) {
    const colorClasses = {
        blue: 'text-blue-600 dark:text-blue-400',
        green: 'text-green-600 dark:text-green-400',
        purple: 'text-purple-600 dark:text-purple-400',
    };
    return (_jsxs("div", { className: cn('flex flex-col', compact && 'gap-0'), children: [_jsx("span", { className: cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm'), children: label }), _jsx(AnimatePresence, { mode: "popLayout", children: _jsx(motion.span, { initial: prefersReducedMotion ? false : { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 }, exit: prefersReducedMotion ? undefined : { opacity: 0, y: 5 }, transition: { duration: DURATION_SECONDS.fast }, className: cn('font-mono font-semibold', compact ? 'text-sm' : 'text-lg', colorClasses[color]), children: formatTokens(value) }, value) })] }));
}
/**
 * Token icon SVG
 */
function TokenIcon({ className }) {
    return (_jsx("svg", { className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }));
}
TokenUsageMeter.displayName = 'TokenUsageMeter';
//# sourceMappingURL=token-usage-meter.js.map