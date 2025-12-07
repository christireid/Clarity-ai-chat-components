'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import clsx from 'clsx';
import { motion } from 'framer-motion';
const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.1, 0.25, 1],
            staggerChildren: 0.05,
        },
    },
};
const rowVariants = {
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
export function ApiTable({ title = 'Props', data, className }) {
    return (_jsxs(motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: '-50px' }, variants: containerVariants, className: clsx('my-8 not-prose', className), children: [title && (_jsx(motion.h3, { variants: rowVariants, className: "text-xl font-semibold mb-4", children: title })), _jsx(motion.div, { variants: rowVariants, whileHover: { y: -2, scale: 1.005 }, transition: { duration: 0.2 }, className: "border-2 border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-bg-secondary/50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border", children: "Name" }), _jsx("th", { className: "px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border", children: "Type" }), _jsx("th", { className: "px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border", children: "Default" }), _jsx("th", { className: "px-5 py-3 text-left text-sm font-semibold text-text-primary border-b-2 border-border", children: "Description" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: data.map((prop, index) => (_jsxs(motion.tr, { variants: rowVariants, whileHover: { scale: 1.005, backgroundColor: 'rgba(var(--color-bg-secondary), 0.5)' }, transition: { duration: 0.15 }, className: "group", children: [_jsx("td", { className: "px-5 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(motion.code, { whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: "text-sm font-mono font-semibold text-brand-600 dark:text-brand-400", children: prop.name }), prop.required && (_jsx(motion.span, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.05 + 0.2, type: 'spring', stiffness: 200, damping: 15 }, whileHover: { scale: 1.1 }, className: "text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold border border-red-200 dark:border-red-800", children: "Required" }))] }) }), _jsx("td", { className: "px-5 py-3", children: _jsx(motion.code, { whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: "text-sm font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-lg inline-block", children: prop.type }) }), _jsx("td", { className: "px-5 py-3", children: prop.default ? (_jsx(motion.code, { whileHover: { scale: 1.05 }, transition: { type: 'spring', stiffness: 300, damping: 20 }, className: "text-sm font-mono text-text-secondary bg-muted/50 px-2 py-1 rounded-lg inline-block", children: prop.default })) : (_jsx("span", { className: "text-sm text-text-tertiary", children: "\u2014" })) }), _jsx("td", { className: "px-5 py-3 text-sm text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors", children: prop.description })] }, prop.name))) })] }) }) })] }));
}
//# sourceMappingURL=ApiTable.js.map