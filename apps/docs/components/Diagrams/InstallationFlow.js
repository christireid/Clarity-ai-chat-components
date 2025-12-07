/**
 * Installation Flow Diagram
 *
 * Step-by-step installation visualization
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { Package, Download, FileCode, Rocket } from 'lucide-react';
export function InstallationFlow() {
    const steps = [
        {
            number: 1,
            icon: _jsx(Package, { className: "w-6 h-6" }),
            title: 'Install Package',
            command: 'npm install @clarity-chat/react',
            color: 'from-blue-500 to-blue-600',
            time: '~30s',
        },
        {
            number: 2,
            icon: _jsx(Download, { className: "w-6 h-6" }),
            title: 'Import Components',
            command: "import { ChatWindow } from '@clarity-chat/react'",
            color: 'from-purple-500 to-purple-600',
            time: '~10s',
        },
        {
            number: 3,
            icon: _jsx(FileCode, { className: "w-6 h-6" }),
            title: 'Configure',
            command: 'Add to your React app',
            color: 'from-green-500 to-green-600',
            time: '~20s',
        },
        {
            number: 4,
            icon: _jsx(Rocket, { className: "w-6 h-6" }),
            title: 'Start Building',
            command: 'npm run dev',
            color: 'from-orange-500 to-orange-600',
            time: '~5s',
        },
    ];
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-2 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent", children: "Installation in 4 Simple Steps" }) }), _jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 mb-8", children: "Get started in under 2 minutes" }), _jsx("div", { className: "space-y-6", children: steps.map((step, index) => (_jsxs("div", { children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.15 }, className: "flex items-start gap-4", children: [_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: index * 0.15 + 0.1, type: 'spring' }, className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center shadow-lg`, children: step.icon }), _jsx("div", { className: "text-xs font-bold text-gray-500 dark:text-gray-400", children: step.time })] }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: `w-7 h-7 rounded-lg bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-bold text-sm shadow`, children: step.number }), _jsx("h4", { className: "font-bold text-lg", children: step.title })] }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.15 + 0.2 }, className: "bg-slate-900 dark:bg-slate-950 p-4 rounded-xl border border-slate-700 font-mono text-sm text-green-400 shadow-inner", children: _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: "text-gray-500", children: "$" }), _jsx(motion.span, { initial: { width: 0 }, animate: { width: 'auto' }, transition: { delay: index * 0.15 + 0.4, duration: 0.6 }, className: "overflow-hidden whitespace-nowrap", children: step.command })] }) })] })] }), index < steps.length - 1 && (_jsx(motion.div, { initial: { scaleY: 0 }, animate: { scaleY: 1 }, transition: { delay: index * 0.15 + 0.5, duration: 0.2 }, className: "ml-8 my-3", children: _jsxs("svg", { width: "24", height: "32", viewBox: "0 0 24 32", children: [_jsx("path", { d: "M 12 0 L 12 28", stroke: "#9ca3af", strokeWidth: "2", strokeDasharray: "4 4" }), _jsx("path", { d: "M 8 24 L 12 32 L 16 24", fill: "#9ca3af" })] }) }))] }, step.number))) }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 1, type: 'spring' }, className: "mt-8 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-xl text-white text-center", children: [_jsx("div", { className: "text-4xl font-bold mb-2", children: "~65 seconds" }), _jsx("div", { className: "text-green-100", children: "Total installation time" }), _jsx("div", { className: "mt-4 text-sm text-green-50", children: "\u26A1 One of the fastest setups in the React ecosystem" })] })] }) }));
}
//# sourceMappingURL=InstallationFlow.js.map