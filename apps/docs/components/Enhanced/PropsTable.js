'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, Copy } from 'lucide-react';
import { useState, useCallback } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
const tableVariants = {
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
export function PropsTable({ props, title = 'Props', className }) {
    const [copiedProp, setCopiedProp] = useState(null);
    const copyToClipboard = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedProp(text);
            setTimeout(() => setCopiedProp(null), 2000);
        }
        catch (error) {
            console.error('Failed to copy:', error);
        }
    }, []);
    if (props.length === 0) {
        return null;
    }
    return (_jsxs(motion.div, { initial: "hidden", whileInView: "show", viewport: { once: true, margin: '-50px' }, variants: tableVariants, className: clsx('my-8', className), children: [title && (_jsx(motion.h3, { initial: { opacity: 0, y: -10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.3 }, className: "text-2xl font-bold mb-4 text-text-primary", children: title })), _jsx(motion.div, { variants: rowVariants, className: "overflow-x-auto rounded-lg border border-border", children: _jsxs("table", { className: "w-full border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-bg-secondary border-b border-border", children: [_jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Name" }), _jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Type" }), _jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Default" }), _jsx("th", { className: "text-left p-4 font-semibold text-text-primary", children: "Description" })] }) }), _jsx("tbody", { children: props.map((prop, index) => (_jsxs(motion.tr, { variants: rowVariants, whileHover: {
                                    backgroundColor: 'rgba(var(--color-bg-secondary-rgb, 241 245 249) / 0.5)',
                                    scale: 1.002,
                                    transition: { duration: 0.2 },
                                }, className: clsx('border-b border-border last:border-b-0', 'transition-colors group', prop.deprecated && 'opacity-60'), children: [_jsx("td", { className: "p-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(motion.code, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, className: "text-sm font-mono font-semibold text-text-primary bg-bg-tertiary px-2 py-1 rounded", children: prop.name }), prop.required && (_jsx(motion.span, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.1 }, transition: { type: 'spring', stiffness: 200, damping: 15 }, className: "text-xs font-medium text-red-500 dark:text-red-400 px-2 py-0.5 bg-red-500/10 rounded-full", children: "required" })), prop.deprecated && (_jsx(motion.span, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, whileHover: { scale: 1.1 }, transition: { type: 'spring', stiffness: 200, damping: 15 }, className: "text-xs font-medium text-orange-500 dark:text-orange-400 px-2 py-0.5 bg-orange-500/10 rounded-full", children: "deprecated" })), _jsx(motion.button, { onClick: () => copyToClipboard(prop.name), whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "ml-auto p-1 rounded hover:bg-bg-tertiary transition-colors opacity-0 group-hover:opacity-100", "aria-label": `Copy ${prop.name}`, children: _jsx(AnimatePresence, { mode: "wait", children: copiedProp === prop.name ? (_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 180 }, transition: { duration: 0.2 }, children: _jsx(Check, { className: "w-3 h-3 text-green-500" }) }, "check")) : (_jsx(motion.div, { initial: { scale: 0, rotate: 180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -180 }, transition: { duration: 0.2 }, children: _jsx(Copy, { className: "w-3 h-3 text-text-secondary" }) }, "copy")) }) })] }) }), _jsx("td", { className: "p-4", children: _jsx("code", { className: "text-sm font-mono text-brand-500 dark:text-brand-400", children: prop.type }) }), _jsx("td", { className: "p-4", children: prop.default ? (_jsx(motion.code, { whileHover: { scale: 1.05 }, transition: { duration: 0.2 }, className: "text-sm font-mono text-text-secondary bg-bg-tertiary px-2 py-1 rounded inline-block", children: prop.default })) : (_jsx("span", { className: "text-text-tertiary", children: "\u2014" })) }), _jsx("td", { className: "p-4", children: _jsxs("div", { className: "text-sm text-text-secondary", children: [_jsx(AnimatePresence, { children: prop.deprecated && prop.deprecatedMessage && (_jsx(motion.div, { initial: { opacity: 0, height: 0, marginBottom: 0 }, animate: { opacity: 1, height: 'auto', marginBottom: 8 }, exit: { opacity: 0, height: 0, marginBottom: 0 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: "overflow-hidden", children: _jsxs("div", { className: "p-2 bg-orange-500/10 border border-orange-500/20 rounded text-orange-600 dark:text-orange-400", children: [_jsx("strong", { children: "Deprecated:" }), " ", prop.deprecatedMessage] }) })) }), prop.description || _jsx("span", { className: "text-text-tertiary", children: "\u2014" })] }) })] }, prop.name))) })] }) })] }));
}
//# sourceMappingURL=PropsTable.js.map