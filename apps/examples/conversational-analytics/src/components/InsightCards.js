'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
export function InsightCards({ insights }) {
    return (_jsx("div", { className: "space-y-2", children: insights.map((insight, idx) => (_jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: idx * 0.1 }, className: "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800", children: _jsxs("div", { className: "flex items-start space-x-2", children: [_jsx(Lightbulb, { className: "w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" }), _jsx("p", { className: "text-sm text-gray-700 dark:text-gray-300", children: insight.text })] }) }, insight.id))) }));
}
//# sourceMappingURL=InsightCards.js.map