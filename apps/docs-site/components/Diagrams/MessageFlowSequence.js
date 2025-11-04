/**
 * Message Flow Sequence Diagram
 *
 * Shows the complete message lifecycle with optimistic updates
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { User, Server, Database } from 'lucide-react';
export function MessageFlowSequence() {
    const steps = [
        {
            from: 'user',
            to: 'client',
            label: '1. User types message',
            description: 'Input event',
            delay: 0,
        },
        {
            from: 'client',
            to: 'ui',
            label: '2. Optimistic update',
            description: 'Show immediately',
            delay: 0.3,
        },
        {
            from: 'client',
            to: 'server',
            label: '3. Send to API',
            description: 'HTTP/WebSocket',
            delay: 0.6,
        },
        {
            from: 'server',
            to: 'client',
            label: '4. Stream response',
            description: 'Token-by-token',
            delay: 0.9,
        },
        {
            from: 'client',
            to: 'db',
            label: '5. Persist',
            description: 'Save to storage',
            delay: 1.2,
        },
        {
            from: 'db',
            to: 'client',
            label: '6. Confirm',
            description: 'Success callback',
            delay: 1.5,
        },
    ];
    const actors = [
        {
            id: 'user',
            icon: _jsx(User, { className: "w-6 h-6" }),
            label: 'User',
            color: 'from-blue-500 to-blue-600',
            x: 80,
        },
        {
            id: 'client',
            icon: _jsx("span", { className: "text-xl", children: "\u269B\uFE0F" }),
            label: 'React State',
            color: 'from-purple-500 to-purple-600',
            x: 220,
        },
        {
            id: 'ui',
            icon: _jsx("span", { className: "text-xl", children: "\uD83D\uDCAC" }),
            label: 'UI',
            color: 'from-green-500 to-green-600',
            x: 360,
        },
        {
            id: 'server',
            icon: _jsx(Server, { className: "w-6 h-6" }),
            label: 'API',
            color: 'from-orange-500 to-orange-600',
            x: 500,
        },
        {
            id: 'db',
            icon: _jsx(Database, { className: "w-6 h-6" }),
            label: 'Storage',
            color: 'from-pink-500 to-pink-600',
            x: 640,
        },
    ];
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-x-auto", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent", children: "Message Lifecycle" }) }), _jsxs("svg", { width: "720", height: "500", viewBox: "0 0 720 500", className: "mx-auto", children: [actors.map((actor, index) => (_jsxs("g", { children: [_jsxs(motion.g, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, children: [_jsx("defs", { children: _jsx("linearGradient", { id: `gradient-${actor.id}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: _jsx("stop", { offset: "0%", stopColor: actor.color.split(' ')[0].replace('from-', '#') }) }) }), _jsx("rect", { x: actor.x - 30, y: "20", width: "60", height: "60", rx: "12", className: "fill-white dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600", strokeWidth: "2" }), _jsx("foreignObject", { x: actor.x - 24, y: "32", width: "48", height: "36", children: _jsx("div", { className: "w-full h-full flex items-center justify-center", children: actor.icon }) })] }), _jsx("text", { x: actor.x, y: "105", textAnchor: "middle", className: "fill-gray-900 dark:fill-gray-100 font-semibold text-xs", children: actor.label }), _jsx(motion.line, { x1: actor.x, y1: "115", x2: actor.x, y2: "470", stroke: "#d1d5db", strokeWidth: "2", strokeDasharray: "5 5", initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: index * 0.1 + 0.2, duration: 0.5 } })] }, actor.id))), steps.map((step, index) => {
                            const fromActor = actors.find((a) => a.id === step.from);
                            const toActor = actors.find((a) => a.id === step.to);
                            if (!fromActor || !toActor)
                                return null;
                            const y = 150 + index * 50;
                            const isReturn = fromActor.x > toActor.x;
                            return (_jsxs("g", { children: [_jsx(motion.line, { x1: fromActor.x + (isReturn ? -10 : 10), y1: y, x2: toActor.x + (isReturn ? 10 : -10), y2: y, stroke: "#3b82f6", strokeWidth: "2", markerEnd: "url(#arrowhead)", initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { delay: step.delay, duration: 0.4 } }), _jsx(motion.foreignObject, { x: (fromActor.x + toActor.x) / 2 - 70, y: y - 30, width: "140", height: "24", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: step.delay + 0.2 }, children: _jsx("div", { className: "bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 rounded-lg px-2 py-1 text-xs font-semibold text-center shadow-sm", children: step.label }) }), _jsx(motion.text, { x: (fromActor.x + toActor.x) / 2, y: y + 18, textAnchor: "middle", className: "fill-gray-600 dark:fill-gray-400 text-xs", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: step.delay + 0.3 }, children: step.description })] }, index));
                        }), _jsx("defs", { children: _jsx("marker", { id: "arrowhead", markerWidth: "10", markerHeight: "10", refX: "9", refY: "3", orient: "auto", children: _jsx("polygon", { points: "0 0, 10 3, 0 6", fill: "#3b82f6" }) }) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 2 }, className: "mt-8 grid md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600 mb-1", children: "Step 2" }), _jsx("div", { className: "text-sm text-blue-800 dark:text-blue-200", children: "Optimistic UI" }), _jsx("div", { className: "text-xs text-blue-600 dark:text-blue-400 mt-1", children: "Instant feedback" })] }), _jsxs("div", { className: "p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600 mb-1", children: "Step 4" }), _jsx("div", { className: "text-sm text-purple-800 dark:text-purple-200", children: "Streaming" }), _jsx("div", { className: "text-xs text-purple-600 dark:text-purple-400 mt-1", children: "Real-time tokens" })] }), _jsxs("div", { className: "p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800 text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600 mb-1", children: "Step 6" }), _jsx("div", { className: "text-sm text-green-800 dark:text-green-200", children: "Persistence" }), _jsx("div", { className: "text-xs text-green-600 dark:text-green-400 mt-1", children: "Reliable storage" })] })] })] }) }));
}
//# sourceMappingURL=MessageFlowSequence.js.map