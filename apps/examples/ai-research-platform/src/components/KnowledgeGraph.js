'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Network } from 'lucide-react';
export function KnowledgeGraph({ nodes, edges }) {
    // Simple force-directed layout simulation
    const positions = useMemo(() => {
        const pos = {};
        const centerX = 400;
        const centerY = 300;
        const radius = 150;
        nodes.forEach((node, idx) => {
            const angle = (idx / nodes.length) * Math.PI * 2;
            pos[node.id] = {
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
            };
        });
        return pos;
    }, [nodes]);
    return (_jsxs("div", { className: "h-full bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8", children: [_jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Network, { className: "w-6 h-6 mr-2 text-purple-600" }), _jsx("h2", { className: "text-2xl font-bold", children: "Knowledge Graph" })] }), _jsx("div", { className: "relative h-[calc(100%-80px)]", children: _jsxs("svg", { className: "w-full h-full", children: [edges.map((edge, idx) => {
                            const source = positions[edge.source];
                            const target = positions[edge.target];
                            if (!source || !target)
                                return null;
                            return (_jsx(motion.line, { x1: source.x, y1: source.y, x2: target.x, y2: target.y, stroke: "#6366f1", strokeWidth: edge.strength * 3, opacity: 0.3, initial: { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: 0.5, delay: idx * 0.1 } }, idx));
                        }), nodes.map((node, idx) => {
                            const pos = positions[node.id];
                            if (!pos)
                                return null;
                            return (_jsxs("g", { children: [_jsx(motion.circle, { cx: pos.x, cy: pos.y, r: 30, fill: node.type === 'concept'
                                            ? '#6366f1'
                                            : node.type === 'document'
                                                ? '#8b5cf6'
                                                : '#ec4899', initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: idx * 0.1, type: 'spring' } }), _jsx(motion.text, { x: pos.x, y: pos.y + 50, textAnchor: "middle", className: "text-sm font-medium fill-gray-700 dark:fill-gray-300", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: idx * 0.1 + 0.3 }, children: node.label })] }, node.id));
                        })] }) })] }));
}
//# sourceMappingURL=KnowledgeGraph.js.map