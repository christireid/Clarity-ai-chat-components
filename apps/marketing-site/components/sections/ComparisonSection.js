'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Check, X, ArrowRight, ChevronRight } from 'lucide-react';
import { durations } from '@/lib/constants';
import { useReducedMotion } from '@/lib/animations';
const comparisonData = [
    {
        feature: 'Time to First Feature',
        clarity: 'Hours',
        custom: 'Weeks',
        highlight: true,
    },
    {
        feature: 'Components Included',
        clarity: '170+',
        custom: 'Build each one',
        highlight: true,
    },
    {
        feature: 'Provider Switching',
        clarity: 'One prop change',
        custom: 'Refactor required',
        highlight: false,
    },
    {
        feature: 'Streaming Support',
        clarity: 'Built-in',
        custom: 'Manual implementation',
        highlight: false,
    },
    {
        feature: 'TypeScript',
        clarity: '100% Strict',
        custom: 'Varies',
        highlight: false,
    },
    {
        feature: 'Token Tracking',
        clarity: 'Built-in dashboard',
        custom: 'Build it yourself',
        highlight: true,
    },
];
export default function ComparisonSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });
    return (_jsxs("section", { className: "relative py-24 bg-surface-950 overflow-hidden", children: [_jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-clarity-500/5 rounded-full blur-3xl pointer-events-none" }), _jsxs("div", { className: "relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("h2", { className: "text-3xl font-bold text-white mb-4", children: ["Don't Reinvent the", ' ', _jsx("span", { className: "gradient-text", children: "Chat Interface" })] }), _jsx("p", { className: "text-gray-400", children: "Building a production-grade chat UI is harder than it looks. We've done the heavy lifting." })] }), _jsxs(motion.div, { ref: ref, initial: { opacity: 0, y: 30 }, animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }, transition: { duration: durations.slow }, className: "rounded-2xl border border-white/10 bg-surface-900/50 backdrop-blur-sm overflow-hidden", children: [_jsxs("div", { className: "grid grid-cols-3 border-b border-white/10 bg-surface-900/80", children: [_jsx("div", { className: "p-6 text-sm font-semibold text-gray-400", children: "Feature" }), _jsxs("div", { className: "p-6 text-lg font-bold text-white bg-clarity-500/5 border-x border-white/5 flex items-center justify-center gap-2", children: ["Clarity Chat", _jsx("span", { className: "px-2 py-0.5 rounded-full bg-clarity-500 text-white text-[10px] uppercase tracking-wider", children: "Pro" })] }), _jsx("div", { className: "p-6 text-lg font-semibold text-gray-500 flex items-center justify-center", children: "Building In-House" })] }), comparisonData.map((row, i) => (_jsxs("div", { className: `grid grid-cols-3 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors ${row.highlight ? 'bg-white/[0.02]' : ''}`, children: [_jsx("div", { className: "p-5 flex items-center text-sm font-medium text-gray-300 pl-8", children: row.feature }), _jsx("div", { className: "p-5 flex items-center justify-center border-x border-white/5 bg-clarity-500/[0.02]", children: row.highlight ? (_jsxs("span", { className: "text-clarity-400 font-bold flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4" }), " ", row.clarity] })) : (_jsxs("span", { className: "text-white flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4 text-gray-500" }), " ", row.clarity] })) }), _jsx("div", { className: "p-5 flex items-center justify-center text-gray-500", children: row.custom.includes('Month') || row.custom.includes('$') ? (_jsxs("span", { className: "text-red-400/80 flex items-center gap-2", children: [_jsx(X, { className: "w-4 h-4" }), " ", row.custom] })) : (_jsxs("span", { className: "flex items-center gap-2", children: [_jsx(ChevronRight, { className: "w-4 h-4 opacity-50" }), " ", row.custom] })) })] }, row.feature)))] }), _jsxs("div", { className: "mt-12 text-center", children: [_jsx("p", { className: "text-sm text-gray-400 mb-4", children: "Building production-grade AI chat from scratch typically requires 2-3 engineers for 2+ months. That's $45,000+ in development costs before you ship a single feature." }), _jsx("div", { className: "text-xs text-gray-500 font-mono uppercase tracking-widest", children: "Based on industry average developer rates" })] })] })] }));
}
//# sourceMappingURL=ComparisonSection.js.map