'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, cn, } from '@clarity-chat/primitives';
/**
 * Card component for displaying an experiment in a list.
 *
 * @example
 * ```tsx
 * <ExperimentCard
 *   id="exp-1"
 *   name="Chat Input Enhancement"
 *   description="Testing new input UI"
 *   status="running"
 *   variantCount={3}
 *   hasWinner={false}
 *   isSelected={selectedId === 'exp-1'}
 *   onSelect={() => setSelectedId('exp-1')}
 * />
 * ```
 */
export function ExperimentCard({ id, name, description, status, variantCount, hasWinner = false, isSelected = false, onSelect, className, }) {
    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onSelect?.();
        }
    };
    return (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 }, children: _jsxs(Card, { className: cn('cursor-pointer transition-colors', 'focus:outline-none focus:ring-2 focus:ring-ring/40 focus:ring-offset-1', isSelected && 'border-primary', className), onClick: onSelect, onKeyDown: handleKeyDown, role: "button", tabIndex: 0, "aria-label": `Select experiment ${name}`, "aria-pressed": isSelected, children: [_jsx(CardHeader, { className: "pb-3", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx(CardTitle, { className: "text-base", children: name }), description && (_jsx(CardDescription, { className: "text-xs mt-1", children: description }))] }), _jsx(Badge, { variant: status === 'running'
                                    ? 'default'
                                    : status === 'completed'
                                        ? 'secondary'
                                        : 'outline', children: status })] }) }), _jsx(CardContent, { className: "pt-0", children: _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground", children: [variantCount, " variant", variantCount !== 1 ? 's' : ''] }), hasWinner && (_jsx(Badge, { variant: "success", className: "text-xs", children: "Winner found" }))] }) })] }) }));
}
ExperimentCard.displayName = 'ExperimentCard';
//# sourceMappingURL=experiment-card.js.map