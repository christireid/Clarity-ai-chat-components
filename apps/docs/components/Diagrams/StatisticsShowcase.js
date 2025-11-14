/**
 * Statistics Showcase
 *
 * Animated statistics display with counters
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
function AnimatedNumber({ value, suffix = '', prefix = '' }) {
    const ref = useRef(null);
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => Math.round(latest));
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    useEffect(() => {
        if (isInView) {
            const controls = animate(motionValue, value, {
                duration: 2,
                ease: 'easeOut',
            });
            return controls.stop;
        }
    }, [isInView, motionValue, value]);
    return (_jsxs(motion.span, { ref: ref, className: "tabular-nums", children: [prefix, _jsx(motion.span, { children: rounded }), suffix] }));
}
export function StatisticsShowcase({ stats, title, columns = 3 }) {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    };
    return (_jsxs("div", { className: "not-prose my-12", children: [title && (_jsx("h3", { className: "text-3xl font-bold mb-8 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: title }) })), _jsx("div", { className: `grid grid-cols-1 ${gridCols[columns]} gap-8`, children: stats.map((stat, index) => (_jsx(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.1, type: 'spring', stiffness: 100 }, className: "relative", children: _jsxs("div", { className: "p-8 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300", children: [_jsx("div", { className: `text-5xl font-bold mb-3 ${stat.color || 'text-blue-600 dark:text-blue-400'}`, children: _jsx(AnimatedNumber, { value: stat.value, prefix: stat.prefix, suffix: stat.suffix }) }), _jsx("div", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: stat.label }), stat.description && (_jsx("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: stat.description })), _jsx(motion.div, { className: "absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl", animate: {
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 0.8, 0.5],
                                }, transition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                } })] }) }, stat.label))) })] }));
}
// Predefined stats showcases
export function LibraryStats() {
    return (_jsx(StatisticsShowcase, { title: "By The Numbers", stats: [
            {
                value: 70,
                suffix: '+',
                label: 'Components',
                description: 'Production-ready UI components',
                color: 'text-blue-600 dark:text-blue-400',
            },
            {
                value: 30,
                suffix: '+',
                label: 'React Hooks',
                description: 'Powerful state management',
                color: 'text-purple-600 dark:text-purple-400',
            },
            {
                value: 150,
                suffix: '+',
                label: 'Animations',
                description: 'Smooth Framer Motion effects',
                color: 'text-green-600 dark:text-green-400',
            },
            {
                value: 95,
                suffix: '%',
                label: 'Accessible',
                description: 'WCAG 2.1 AA compliant',
                color: 'text-orange-600 dark:text-orange-400',
            },
            {
                value: 12,
                suffix: '',
                label: 'Industry Demos',
                description: 'Real-world examples',
                color: 'text-pink-600 dark:text-pink-400',
            },
            {
                value: 100,
                suffix: '%',
                label: 'TypeScript',
                description: 'Full type safety',
                color: 'text-cyan-600 dark:text-cyan-400',
            },
        ], columns: 3 }));
}
export function PerformanceStats() {
    return (_jsx(StatisticsShowcase, { title: "Performance Metrics", stats: [
            {
                value: 90,
                suffix: '%',
                label: 'Fewer Re-renders',
                description: 'After React.memo optimization',
                color: 'text-green-600 dark:text-green-400',
            },
            {
                value: 5,
                suffix: 'x',
                label: 'Faster',
                description: 'Render performance improvement',
                color: 'text-blue-600 dark:text-blue-400',
            },
            {
                value: 0,
                suffix: '',
                label: 'Memory Leaks',
                description: 'All effects properly cleaned',
                color: 'text-purple-600 dark:text-purple-400',
            },
            {
                value: 60,
                suffix: ' FPS',
                label: 'Smooth Animations',
                description: 'GPU-accelerated',
                color: 'text-orange-600 dark:text-orange-400',
            },
        ], columns: 4 }));
}
//# sourceMappingURL=StatisticsShowcase.js.map