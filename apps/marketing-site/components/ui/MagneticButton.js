'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/lib/animations';
// Simple magnetic effect hook
function useMagnetic(options = { strength: 0.15 }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const handleMouseMove = useCallback((e) => {
        if (!ref.current)
            return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        setPosition({
            x: distX * options.strength,
            y: distY * options.strength,
        });
    }, [options.strength]);
    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);
    return { ref, position, handleMouseMove, handleMouseLeave };
}
export default function MagneticButton({ children, href, className = '', variant = 'primary', onClick, icon, }) {
    const { ref, position, handleMouseMove, handleMouseLeave } = useMagnetic({
        strength: 0.15,
    });
    const variants = {
        primary: 'bg-gradient-to-r from-clarity-500 to-cosmic-500 text-white shadow-lg shadow-clarity-500/20 hover:shadow-clarity-400/30 border-none',
        secondary: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
        ghost: 'text-gray-300 hover:text-white hover:bg-transparent',
    };
    const baseClasses = cn('relative flex items-center justify-center gap-2 px-6 py-6 rounded-xl font-semibold overflow-hidden h-auto', variants[variant], className);
    const content = (_jsxs(_Fragment, { children: [variant === 'primary' && (_jsx("div", { className: "absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" })), _jsxs("span", { className: "relative z-10 flex items-center gap-2", children: [children, icon] })] }));
    return (_jsx(motion.div, { ref: ref, onMouseMove: handleMouseMove, onMouseLeave: handleMouseLeave, animate: { x: position.x, y: position.y }, transition: { type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }, className: "inline-block", children: href ? (_jsx(Link, { href: href, className: baseClasses, children: content })) : (_jsx("button", { onClick: onClick, className: baseClasses, children: content })) }));
}
//# sourceMappingURL=MagneticButton.js.map