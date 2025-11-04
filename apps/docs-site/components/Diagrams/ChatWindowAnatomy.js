/**
 * ChatWindow Anatomy Diagram
 *
 * Interactive labeled diagram showing ChatWindow component parts
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useState } from 'react';
export function ChatWindowAnatomy() {
    const [hoveredPart, setHoveredPart] = useState(null);
    const parts = [
        {
            id: 'header',
            label: 'Header',
            description: 'Title, subtitle, actions',
            color: 'blue',
            coords: { x: 20, y: 20, width: 560, height: 60 },
        },
        {
            id: 'messagelist',
            label: 'MessageList',
            description: 'Scrollable message container',
            color: 'purple',
            coords: { x: 20, y: 90, width: 560, height: 280 },
        },
        {
            id: 'thinking',
            label: 'ThinkingIndicator',
            description: 'AI status display',
            color: 'green',
            coords: { x: 20, y: 380, width: 560, height: 40 },
        },
        {
            id: 'input',
            label: 'ChatInput',
            description: 'User message input',
            color: 'orange',
            coords: { x: 20, y: 430, width: 560, height: 70 },
        },
    ];
    const getColor = (color, opacity = '500') => {
        const colors = {
            blue: `rgb(59 130 246 / ${opacity === '500' ? '1' : '0.1'})`,
            purple: `rgb(139 92 246 / ${opacity === '500' ? '1' : '0.1'})`,
            green: `rgb(16 185 129 / ${opacity === '500' ? '1' : '0.1'})`,
            orange: `rgb(249 115 22 / ${opacity === '500' ? '1' : '0.1'})`,
        };
        return colors[color];
    };
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent", children: "ChatWindow Component Anatomy" }) }), _jsx("p", { className: "text-center text-sm text-gray-600 dark:text-gray-400 mb-8", children: "Hover over parts to learn more" }), _jsxs("div", { className: "flex flex-col lg:flex-row gap-8 items-center", children: [_jsx("div", { className: "flex-1 flex justify-center", children: _jsxs("svg", { width: "600", height: "520", viewBox: "0 0 600 520", className: "max-w-full h-auto", children: [_jsx("rect", { x: "10", y: "10", width: "580", height: "500", rx: "16", fill: "white", stroke: "#e5e7eb", strokeWidth: "2", className: "dark:fill-slate-800 dark:stroke-slate-600" }), parts.map((part, index) => (_jsxs("g", { children: [_jsx(motion.rect, { ...part.coords, rx: "8", fill: getColor(part.color, '100'), stroke: getColor(part.color), strokeWidth: hoveredPart === part.id ? '3' : '2', strokeDasharray: hoveredPart === part.id ? '0' : '5 5', initial: { opacity: 0 }, animate: { opacity: hoveredPart === part.id ? 1 : 0.6 }, transition: { duration: 0.2 }, onMouseEnter: () => setHoveredPart(part.id), onMouseLeave: () => setHoveredPart(null), className: "cursor-pointer" }), _jsx(motion.text, { x: part.coords.x + part.coords.width / 2, y: part.coords.y + part.coords.height / 2, textAnchor: "middle", className: "fill-gray-700 dark:fill-gray-300 font-semibold text-sm pointer-events-none", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: index * 0.1 }, children: part.label }), _jsxs(motion.g, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: index * 0.1 + 0.2, type: 'spring' }, children: [_jsx("circle", { cx: part.coords.x + part.coords.width - 15, cy: part.coords.y + 15, r: "12", fill: getColor(part.color), className: "drop-shadow" }), _jsx("text", { x: part.coords.x + part.coords.width - 15, y: part.coords.y + 20, textAnchor: "middle", className: "fill-white font-bold text-xs", children: index + 1 })] })] }, part.id)))] }) }), _jsx("div", { className: "lg:w-64 space-y-3", children: parts.map((part, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.1 + 0.5 }, onMouseEnter: () => setHoveredPart(part.id), onMouseLeave: () => setHoveredPart(null), className: `p-4 rounded-xl border-2 cursor-pointer transition-all ${hoveredPart === part.id
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 shadow-lg scale-105'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow", style: { backgroundColor: getColor(part.color) }, children: index + 1 }), _jsx("div", { className: "font-bold text-sm", children: part.label })] }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: part.description })] }, part.id))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1 }, className: "mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700", children: [_jsx("h4", { className: "font-bold mb-4 text-sm", children: "Key Props" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-3 text-xs", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-blue-500", children: "\u2022" }), _jsxs("div", { children: [_jsx("code", { className: "font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded", children: "messages" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400 ml-2", children: "Array of messages" })] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-purple-500", children: "\u2022" }), _jsxs("div", { children: [_jsx("code", { className: "font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded", children: "onSendMessage" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400 ml-2", children: "Send handler" })] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-green-500", children: "\u2022" }), _jsxs("div", { children: [_jsx("code", { className: "font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded", children: "aiStatus" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400 ml-2", children: "AI state" })] })] }), _jsxs("div", { className: "flex items-start gap-2", children: [_jsx("span", { className: "text-orange-500", children: "\u2022" }), _jsxs("div", { children: [_jsx("code", { className: "font-mono bg-slate-100 dark:bg-slate-900 px-1 rounded", children: "isLoading" }), _jsx("span", { className: "text-gray-600 dark:text-gray-400 ml-2", children: "Loading state" })] })] })] })] })] }) }));
}
//# sourceMappingURL=ChatWindowAnatomy.js.map