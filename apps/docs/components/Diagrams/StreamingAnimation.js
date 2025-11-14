/**
 * Streaming Animation
 *
 * Real-time visualization of token-by-token streaming
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Zap, Cloud } from 'lucide-react';
export function StreamingAnimation() {
    const fullText = "Hello! I'm streaming this response token by token...";
    const [displayedText, setDisplayedText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    useEffect(() => {
        let interval;
        if (isStreaming && displayedText.length < fullText.length) {
            interval = setInterval(() => {
                setDisplayedText((prev) => {
                    if (prev.length >= fullText.length) {
                        setIsStreaming(false);
                        return prev;
                    }
                    return fullText.slice(0, prev.length + 1);
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [isStreaming, displayedText]);
    const startStreaming = () => {
        setDisplayedText('');
        setIsStreaming(true);
    };
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent", children: "Real-Time Streaming" }) }), _jsxs("div", { className: "grid md:grid-cols-[1fr_auto_2fr] gap-6 items-center", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "flex flex-col items-center", children: [_jsx("div", { className: "w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-xl", children: _jsx(Cloud, { className: "w-10 h-10" }) }), _jsx("div", { className: "mt-3 font-semibold text-sm", children: "OpenAI API" }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: "Generating" }), isStreaming && (_jsx(motion.div, { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, className: "mt-2", children: _jsxs("div", { className: "flex gap-1", children: [_jsx(motion.div, { className: "w-2 h-2 bg-green-500 rounded-full", animate: { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }, transition: { duration: 1, repeat: Infinity } }), _jsx(motion.div, { className: "w-2 h-2 bg-green-500 rounded-full", animate: { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }, transition: { duration: 1, repeat: Infinity, delay: 0.2 } }), _jsx(motion.div, { className: "w-2 h-2 bg-green-500 rounded-full", animate: { scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }, transition: { duration: 1, repeat: Infinity, delay: 0.4 } })] }) }))] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsxs(motion.svg, { width: "120", height: "60", viewBox: "0 0 120 60", className: "overflow-visible", children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "stream-gradient", x1: "0%", y1: "0%", x2: "100%", y2: "0%", children: [_jsx("stop", { offset: "0%", stopColor: "#10b981", stopOpacity: "0.3" }), _jsx("stop", { offset: "100%", stopColor: "#10b981", stopOpacity: "0.8" })] }) }), _jsx("path", { d: "M 10 30 L 100 30", stroke: "url(#stream-gradient)", strokeWidth: "3", strokeLinecap: "round" }), _jsx("path", { d: "M 96 26 L 108 30 L 96 34", fill: "#10b981", opacity: "0.8" }), _jsx(AnimatePresence, { children: isStreaming && (_jsx(_Fragment, { children: [0, 1, 2].map((i) => (_jsx(motion.circle, { r: "4", fill: "#10b981", initial: { cx: 10, cy: 30, opacity: 0 }, animate: {
                                                        cx: 100,
                                                        cy: 30,
                                                        opacity: [0, 1, 1, 0],
                                                    }, transition: {
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        delay: i * 0.5,
                                                        ease: 'linear',
                                                    } }, i))) })) })] }), _jsx("div", { className: "text-xs font-medium text-green-600 dark:text-green-400", children: isStreaming ? 'Streaming...' : 'SSE/WebSocket' })] }), _jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.2 }, className: "flex flex-col", children: [_jsxs("div", { className: "p-6 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg min-h-[140px]", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-xs font-bold", children: "AI" }), _jsx("div", { className: "font-semibold text-sm", children: "Assistant" })] }), _jsxs("div", { className: "text-sm text-gray-700 dark:text-gray-300 min-h-[60px]", children: [displayedText, isStreaming && (_jsx(motion.span, { className: "inline-block w-1.5 h-4 bg-blue-600 ml-0.5", animate: { opacity: [1, 0, 1] }, transition: { duration: 0.8, repeat: Infinity } }))] })] }), _jsx("div", { className: "mt-3 text-center text-xs text-gray-600 dark:text-gray-400", children: "User sees tokens instantly" })] })] }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("button", { onClick: startStreaming, disabled: isStreaming, className: "px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all flex items-center gap-2", children: [_jsx(Zap, { className: "w-5 h-5" }), isStreaming ? 'Streaming...' : 'Play Demo'] }) }), _jsx("div", { className: "mt-8 grid grid-cols-1 md:grid-cols-3 gap-4", children: [
                        { label: 'Instant feedback', value: '< 100ms', color: 'text-blue-600' },
                        { label: 'No waiting', value: '0s delay', color: 'text-green-600' },
                        { label: 'Better UX', value: '+40%', color: 'text-purple-600' },
                    ].map((stat, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 2.2 + index * 0.1 }, className: "text-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700", children: [_jsx("div", { className: `text-2xl font-bold ${stat.color} mb-1`, children: stat.value }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: stat.label })] }, stat.label))) })] }) }));
}
//# sourceMappingURL=StreamingAnimation.js.map