'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, cn, } from '@clarity-chat/primitives';
import {} from './use-statistical-significance';
import { DashboardProgress } from '../ui/dashboard-progress';
/**
 * Format percentage value
 */
function formatPercent(value) {
    return `${(value * 100).toFixed(2)}%`;
}
/**
 * Format duration in ms to human readable
 */
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
}
/**
 * Card component for displaying a variant in an A/B test comparison.
 *
 * @example
 * ```tsx
 * <VariantCard
 *   id="variant-a"
 *   name="With Suggestions"
 *   description="Chat input with AI suggestions"
 *   isControl={false}
 *   isWinner={true}
 *   metrics={variantMetrics}
 *   significance={significanceResult}
 *   showStatistics
 * />
 * ```
 */
export function VariantCard({ id, name, description, isControl = false, isWinner = false, metrics, rank, minSampleSize = 100, significance, showStatistics = true, animationDelay = 0, className, }) {
    return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: animationDelay }, children: _jsxs(Card, { className: cn(isWinner && 'border-green-500', className), children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [name, isControl && (_jsx(Badge, { variant: "outline", className: "text-xs", children: "Control" })), isWinner && (_jsx(Badge, { variant: "success", className: "text-xs", children: "Winner" }))] }), description && (_jsx(CardDescription, { className: "text-xs mt-1", children: description }))] }), rank !== undefined && _jsx(Badge, { variant: "outline", children: rank })] }) }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Conversion Rate" }), _jsx("div", { className: "text-2xl font-bold", children: formatPercent(metrics.conversionRate) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metrics.conversions, " / ", metrics.impressions] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Avg Engagement" }), _jsx("div", { className: "text-2xl font-bold", children: formatDuration(metrics.avgEngagementTime) }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [metrics.users, " users"] })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1", children: [_jsx("span", { children: "Sample Size" }), _jsxs("span", { children: [metrics.impressions, " / ", minSampleSize] })] }), _jsx(DashboardProgress, { value: (metrics.impressions / minSampleSize) * 100, size: "sm", "aria-label": `Sample size progress: ${metrics.impressions} of ${minSampleSize} required` })] }), _jsxs("div", { className: "grid grid-cols-2 gap-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Bounce Rate" }), _jsx("span", { children: formatPercent(metrics.bounceRate) })] }), metrics.revenue !== undefined && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Revenue" }), _jsxs("span", { children: ["$", metrics.revenue.toFixed(2)] })] }))] }), showStatistics && significance && (_jsx("div", { className: "pt-2 border-t", children: _jsxs("div", { className: "text-xs space-y-1", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "vs Control" }), _jsx(Badge, { variant: significance.isSignificant ? 'success' : 'secondary', className: "text-xs", children: significance.isSignificant
                                                        ? 'Significant'
                                                        : 'Not Significant' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Effect Size" }), _jsxs("span", { className: cn('font-medium', significance.effectSize > 0
                                                        ? 'text-green-700 dark:text-green-400'
                                                        : 'text-red-700 dark:text-red-400'), "aria-label": `Effect size: ${significance.effectSize > 0 ? 'positive' : 'negative'} ${Math.abs(significance.effectSize).toFixed(1)} percent`, children: [significance.effectSize > 0 ? '+' : '', significance.effectSize.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "p-value" }), _jsx("span", { children: significance.pValue.toFixed(4) })] })] }) }))] }) })] }) }));
}
VariantCard.displayName = 'VariantCard';
//# sourceMappingURL=variant-card.js.map