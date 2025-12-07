'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
            staggerChildren: 0.08,
        },
    },
};
const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};
export function YouWillLearn({ items }) {
    return (_jsxs(motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: '-50px' }, variants: containerVariants, className: "my-8 p-6 rounded-xl bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/20", children: [_jsxs(motion.h3, { initial: { opacity: 0, y: -10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.3 }, className: "text-lg font-semibold mb-4 text-text-primary flex items-center gap-2", children: [_jsx(motion.div, { whileHover: { scale: 1.1, rotate: 10 }, transition: { type: 'spring', stiffness: 300, damping: 15 }, children: _jsx(CheckCircle2, { className: "w-5 h-5 text-brand-500" }) }), "You will learn"] }), _jsx("ul", { className: "space-y-2", children: items.map((item, index) => (_jsxs(motion.li, { variants: itemVariants, whileHover: { x: 4 }, transition: { duration: 0.2 }, className: "flex items-start gap-2 text-text-secondary", children: [_jsx(motion.div, { whileHover: { scale: 1.15, rotate: 360 }, transition: { type: 'spring', stiffness: 200, damping: 15 }, children: _jsx(CheckCircle2, { className: "w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" }) }), _jsx("span", { children: item })] }, index))) })] }));
}
//# sourceMappingURL=YouWillLearn.js.map