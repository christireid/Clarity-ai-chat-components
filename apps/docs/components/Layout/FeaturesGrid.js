'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
export function FeaturesGrid({ features }) {
    return (_jsx(motion.div, { variants: container, initial: "hidden", whileInView: "show", viewport: { once: true, margin: '-100px' }, className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: features.map((feature, index) => (_jsxs(motion.div, { variants: item, className: "group relative p-6 rounded-xl border border-border bg-bg-primary hover:border-brand-500/50 transition-all hover:shadow-lg", children: [_jsx("div", { className: "flex items-center justify-center w-12 h-12 rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-110 transition-transform", children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold mb-2 text-text-primary", children: feature.title }), _jsx("p", { className: "text-text-secondary leading-relaxed", children: feature.description }), _jsx("div", { className: "absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" })] }, index))) }));
}
//# sourceMappingURL=FeaturesGrid.js.map