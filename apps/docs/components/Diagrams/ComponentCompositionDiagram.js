/**
 * Component Composition Diagram
 *
 * Shows how components compose together
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
export function ComponentCompositionDiagram({ components }) {
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-xl font-bold mb-6 text-center", children: "Component Composition" }), _jsx("div", { className: "flex flex-col items-center gap-6", children: components.map((component, index) => (_jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.15 }, className: "flex items-start gap-4", children: [_jsx("div", { className: "flex items-center gap-2", children: index > 0 && (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("div", { className: "w-px h-6 bg-slate-300 dark:bg-slate-600" }), _jsx("div", { className: "w-4 h-px bg-slate-300 dark:bg-slate-600" })] })) }), _jsxs("div", { className: "flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-lg", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-mono text-xs font-bold", children: "</>" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-mono font-bold text-sm text-blue-600 dark:text-blue-400", children: component.name }), _jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: component.description })] })] }), component.children && component.children.length > 0 && (_jsx("div", { className: "mt-3 pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-2", children: component.children.map((child, childIndex) => (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.15 + (childIndex + 1) * 0.08 }, className: "text-xs font-mono text-gray-700 dark:text-gray-300", children: [_jsx("span", { className: "text-purple-600 dark:text-purple-400", children: "\u2514\u2500" }), " ", child] }, child))) }))] })] }), index < components.length - 1 && (_jsx("div", { className: "ml-6 my-2", children: _jsx("svg", { width: "24", height: "24", viewBox: "0 0 24 24", children: _jsx("path", { d: "M 12 0 L 12 24", stroke: "#cbd5e1", strokeWidth: "2", strokeDasharray: "3 3" }) }) }))] }, component.name))) })] }) }));
}
// Default ChatWindow composition example
export function ChatWindowComposition() {
    return (_jsx(ComponentCompositionDiagram, { components: [
            {
                name: 'ChatWindow',
                description: 'Main container',
                children: ['MessageList', 'ThinkingIndicator', 'ChatInput'],
            },
            {
                name: 'MessageList',
                description: 'Message display area',
                children: ['Message (repeated)', 'ScrollArea', 'EmptyState'],
            },
            {
                name: 'Message',
                description: 'Individual message',
                children: ['Avatar', 'Content', 'Actions (CopyButton, Feedback)'],
            },
            {
                name: 'ChatInput',
                description: 'User input',
                children: ['Textarea', 'Button', 'CharCounter'],
            },
        ] }));
}
//# sourceMappingURL=ComponentCompositionDiagram.js.map