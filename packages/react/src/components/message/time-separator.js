'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@clarity-chat/primitives';
/**
 * TimeSeparator - Time/date divider for message lists
 *
 * Displays a horizontal line with centered text to separate messages
 * by time periods (e.g., "Today", "Yesterday", "Last Week").
 *
 * **Features:**
 * - Smooth fade-in animation
 * - Sticky positioning option
 * - Semantic markup with proper ARIA
 *
 * @param props - TimeSeparator configuration
 * @param props.children - Text to display in the separator
 * @param props.className - Optional CSS class name
 *
 * @example
 * ```tsx
 * <TimeSeparator>Today</TimeSeparator>
 * <Message ... />
 * <Message ... />
 * <TimeSeparator>Yesterday</TimeSeparator>
 * <Message ... />
 * ```
 */
export function TimeSeparator({ children, className }) {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, transition: {
            // Framer Motion 12: Spring entrance for time separator
            type: 'spring',
            damping: 20,
            stiffness: 280,
        }, className: cn('relative flex items-center justify-center py-4', className), role: "separator", "aria-label": `Messages from ${children}`, children: [_jsx("div", { className: "flex-1 h-px bg-gradient-to-r from-transparent via-border to-border" }), _jsx(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: {
                    // Framer Motion 12: Spring scale for badge
                    type: 'spring',
                    damping: 18,
                    stiffness: 300,
                    delay: 0.1,
                }, className: cn('px-4 py-1.5 mx-4', 'text-xs font-bold uppercase tracking-wider', 'text-muted-foreground/90', 'bg-muted/60 backdrop-blur-md', 'border border-border/40', 'rounded-full shadow-md'), children: children }), _jsx("div", { className: "flex-1 h-px bg-gradient-to-l from-transparent via-border to-border" })] }));
}
TimeSeparator.displayName = 'TimeSeparator';
//# sourceMappingURL=time-separator.js.map