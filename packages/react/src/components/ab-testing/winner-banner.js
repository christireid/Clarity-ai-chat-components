'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, Button, } from '@clarity-chat/primitives';
import {} from './use-statistical-significance';
/**
 * Format percentage value
 */
function formatPercent(value) {
    return `${(value * 100).toFixed(2)}%`;
}
/**
 * Banner component displaying winner detection and recommendation.
 *
 * @example
 * ```tsx
 * {winner && (
 *   <WinnerBanner
 *     variantName={winner.variant.name}
 *     conversionRate={winner.metrics.conversionRate}
 *     significance={winner.significance}
 *     isDeclared={!!experiment.winner}
 *     onDeclareWinner={() => handleDeclareWinner(winner.variant.id)}
 *   />
 * )}
 * ```
 */
export function WinnerBanner({ variantName, conversionRate, significance, isDeclared = false, onDeclareWinner, className, }) {
    return (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: className, children: _jsxs(Card, { className: "border-green-500 bg-green-50 dark:bg-green-950", children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx("span", { role: "img", "aria-label": "Trophy", children: "\uD83C\uDFC6" }), ' ', "Winner Detected"] }) }), _jsxs(CardContent, { children: [_jsxs("p", { className: "text-sm mb-2", children: [_jsx("strong", { children: variantName }), " is performing significantly better with ", formatPercent(conversionRate), " conversion rate (", significance.effectSize.toFixed(1), "% improvement)"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["p-value: ", significance.pValue.toFixed(4), " (", formatPercent(significance.confidenceLevel), " confidence)"] }), !isDeclared && onDeclareWinner && (_jsx(Button, { size: "sm", className: "mt-3", onClick: onDeclareWinner, children: "Declare Winner" }))] })] }) }));
}
WinnerBanner.displayName = 'WinnerBanner';
//# sourceMappingURL=winner-banner.js.map