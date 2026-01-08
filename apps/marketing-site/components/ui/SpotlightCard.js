'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';
export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(14, 165, 233, 0.15)', // Clarity-500 equivalent
 }) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    function handleMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }
    return (_jsxs("div", { className: cn('group relative border border-white/10 bg-surface-900 overflow-hidden rounded-xl', className), onMouseMove: handleMouseMove, children: [_jsx(motion.div, { className: "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100", style: {
                    background: useMotionTemplate `
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
                } }), _jsx("div", { className: "relative h-full", children: children })] }));
}
//# sourceMappingURL=SpotlightCard.js.map