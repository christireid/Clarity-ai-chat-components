import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DURATION_SECONDS as durations } from '../../animations/constants';
const CONFETTI_COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'];
/**
 * Confetti animation component for positive feedback
 * Extracted from Message component for better organization
 */
export const ConfettiAnimation = React.memo(({ show, particleCount = 8 }) => {
    return (_jsx(AnimatePresence, { children: show && (_jsx(_Fragment, { children: Array.from({ length: particleCount }).map((_, i) => (_jsx(motion.div, { initial: {
                    opacity: 1,
                    scale: 0,
                    x: 0,
                    y: 0,
                }, animate: {
                    opacity: 0,
                    scale: 1,
                    x: Math.cos((i * Math.PI * 2) / particleCount) * 30,
                    y: Math.sin((i * Math.PI * 2) / particleCount) * 30,
                }, exit: { opacity: 0 }, transition: { duration: durations.slower, ease: 'easeOut' }, className: "absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none", style: {
                    backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
                }, "aria-hidden": "true" }, i))) })) }));
});
ConfettiAnimation.displayName = 'ConfettiAnimation';
//# sourceMappingURL=confetti-animation.js.map