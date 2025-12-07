'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';
export function ResearchAgent({ name, status, progress }) {
    const getStatusIcon = () => {
        switch (status) {
            case 'completed':
                return _jsx(CheckCircle2, { className: "w-4 h-4 text-green-500" });
            case 'active':
            case 'thinking':
                return _jsx(Loader2, { className: "w-4 h-4 text-blue-500 animate-spin" });
            default:
                return _jsx(Circle, { className: "w-4 h-4 text-gray-400" });
        }
    };
    const getStatusColor = () => {
        switch (status) {
            case 'completed':
                return 'bg-green-500';
            case 'active':
                return 'bg-blue-500';
            case 'thinking':
                return 'bg-purple-500';
            default:
                return 'bg-gray-300';
        }
    };
    return (_jsxs("div", { className: "mb-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [getStatusIcon(), _jsx("span", { className: "text-sm font-medium", children: name })] }), _jsxs("span", { className: "text-xs text-gray-500", children: [progress, "%"] })] }), _jsx("div", { className: "h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden", children: _jsx(motion.div, { className: `h-full ${getStatusColor()}`, initial: { width: 0 }, animate: { width: `${progress}%` }, transition: { duration: 0.5, ease: 'easeOut' } }) })] }));
}
//# sourceMappingURL=ResearchAgent.js.map