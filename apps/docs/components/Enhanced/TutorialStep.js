'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckCircle2, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
export function TutorialStep({ step, title, completed = false, children, nextStepHref, nextStepTitle, }) {
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-50px' }, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }, className: "relative", children: [_jsxs("div", { className: "flex items-start gap-4 mb-6", children: [_jsx(motion.div, { animate: {
                            backgroundColor: completed
                                ? 'rgb(var(--color-brand-500))'
                                : 'rgb(var(--color-bg-secondary))',
                            borderColor: completed
                                ? 'rgb(var(--color-brand-500))'
                                : 'rgb(var(--color-border))',
                            scale: completed ? [1, 1.1, 1] : 1,
                        }, transition: {
                            duration: 0.3,
                            scale: { duration: 0.5, type: 'spring', stiffness: 200, damping: 15 },
                        }, whileHover: { scale: 1.05 }, className: clsx('flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0', completed ? 'text-white' : 'text-text-secondary'), children: _jsx(AnimatePresence, { mode: "wait", children: completed ? (_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 180 }, transition: { type: 'spring', stiffness: 200, damping: 15 }, children: _jsx(CheckCircle2, { className: "w-5 h-5" }) }, "check")) : (_jsx(motion.span, { initial: { scale: 0, rotate: 180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -180 }, transition: { type: 'spring', stiffness: 200, damping: 15 }, className: "font-semibold", children: step }, "number")) }) }), _jsx(motion.div, { initial: { opacity: 0, x: -10 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { duration: 0.3, delay: 0.1 }, className: "flex-1", children: _jsx("h3", { className: clsx('text-xl font-semibold mb-2', completed ? 'text-text-secondary line-through' : 'text-text-primary'), children: title }) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.3, delay: 0.2 }, className: "ml-14 mb-8", children: children }), nextStepHref && nextStepTitle && (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.3, delay: 0.3 }, className: "ml-14 mb-8 pt-6 border-t border-border", children: _jsxs(motion.a, { href: nextStepHref, whileHover: { scale: 1.02, x: 4 }, whileTap: { scale: 0.98 }, className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-medium transition-colors", children: [_jsxs("span", { children: ["Next: ", nextStepTitle] }), _jsx(motion.div, { whileHover: { x: 3 }, transition: { duration: 0.2 }, children: _jsx(ArrowRight, { className: "w-4 h-4" }) })] }) }))] }));
}
//# sourceMappingURL=TutorialStep.js.map