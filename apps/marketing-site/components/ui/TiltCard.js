'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
export default function TiltCard({ children, className = '', gradient }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
    function onMouseMove({ currentTarget, clientX, clientY }) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }
    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);
    const brightness = useTransform(mouseY, [-0.5, 0.5], [1.1, 0.9]);
    return (_jsxs(motion.div, { ref: ref, onMouseMove: onMouseMove, onMouseLeave: onMouseLeave, style: {
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
        }, className: `relative perspective-1000 ${className}`, children: [_jsx(motion.div, { style: {
                    filter: `brightness(${brightness})`,
                    transform: 'translateZ(20px)',
                }, className: "h-full w-full", children: children }), _jsx(motion.div, { style: {
                    opacity: useTransform(mouseY, [-0.5, 0.5], [0, 0.1]),
                    background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)`
                }, className: "absolute inset-0 rounded-2xl pointer-events-none" })] }));
}
//# sourceMappingURL=TiltCard.js.map