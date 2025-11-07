/**
 * Budget Pie Chart - 50/30/20 Rule
 *
 * Interactive visualization of budget allocation
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
import { useState } from 'react';
import { DollarSign, Home, ShoppingCart, PiggyBank } from 'lucide-react';
export function BudgetPieChart({ monthlyIncome = 5000 }) {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const segments = [
        {
            id: 'needs',
            label: 'Needs',
            percentage: 50,
            amount: monthlyIncome * 0.5,
            color: '#3b82f6',
            icon: _jsx(Home, { className: "w-5 h-5" }),
            examples: ['Rent', 'Utilities', 'Groceries', 'Insurance'],
        },
        {
            id: 'wants',
            label: 'Wants',
            percentage: 30,
            amount: monthlyIncome * 0.3,
            color: '#8b5cf6',
            icon: _jsx(ShoppingCart, { className: "w-5 h-5" }),
            examples: ['Dining', 'Entertainment', 'Shopping', 'Hobbies'],
        },
        {
            id: 'savings',
            label: 'Savings',
            percentage: 20,
            amount: monthlyIncome * 0.2,
            color: '#10b981',
            icon: _jsx(PiggyBank, { className: "w-5 h-5" }),
            examples: ['Emergency Fund', 'Retirement', 'Investments'],
        },
    ];
    // Calculate SVG pie chart paths
    let cumulativePercentage = 0;
    const radius = 100;
    const centerX = 120;
    const centerY = 120;
    const getCoordinatesForPercent = (percent) => {
        const x = centerX + radius * Math.cos(2 * Math.PI * percent);
        const y = centerY + radius * Math.sin(2 * Math.PI * percent);
        return { x, y };
    };
    const getPieSlicePath = (startPercent, percent) => {
        const start = getCoordinatesForPercent(startPercent - 0.25); // Start at top
        const end = getCoordinatesForPercent(startPercent + percent - 0.25);
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };
    return (_jsx("div", { className: "not-prose my-12", children: _jsxs("div", { className: "bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-950 p-8 rounded-2xl border-2 border-slate-200 dark:border-slate-700", children: [_jsx("h3", { className: "text-2xl font-bold mb-6 text-center", children: _jsx("span", { className: "bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent", children: "50/30/20 Budget Rule" }) }), _jsxs("div", { className: "flex flex-col lg:flex-row items-center justify-center gap-12", children: [_jsx("div", { className: "relative", children: _jsxs("svg", { width: "240", height: "240", viewBox: "0 0 240 240", className: "drop-shadow-xl", children: [segments.map((segment, index) => {
                                        const startPercent = cumulativePercentage;
                                        cumulativePercentage += segment.percentage / 100;
                                        return (_jsx(motion.path, { d: getPieSlicePath(startPercent, segment.percentage / 100), fill: segment.color, initial: { opacity: 0, scale: 0 }, animate: {
                                                opacity: hoveredSegment === segment.id || !hoveredSegment ? 1 : 0.3,
                                                scale: hoveredSegment === segment.id ? 1.05 : 1,
                                            }, transition: {
                                                delay: index * 0.2,
                                                type: 'spring',
                                                stiffness: 200,
                                            }, onMouseEnter: () => setHoveredSegment(segment.id), onMouseLeave: () => setHoveredSegment(null), className: "cursor-pointer drop-shadow-lg" }, segment.id));
                                    }), _jsx("circle", { cx: centerX, cy: centerY, r: "50", fill: "white", className: "dark:fill-slate-800" }), _jsxs("text", { x: centerX, y: centerY - 10, textAnchor: "middle", className: "fill-gray-900 dark:fill-gray-100 font-bold text-xl", children: ["$", monthlyIncome.toLocaleString()] }), _jsx("text", { x: centerX, y: centerY + 10, textAnchor: "middle", className: "fill-gray-600 dark:fill-gray-400 text-xs", children: "/month" })] }) }), _jsx("div", { className: "space-y-4 min-w-[280px]", children: segments.map((segment, index) => (_jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.2 + 0.5 }, onMouseEnter: () => setHoveredSegment(segment.id), onMouseLeave: () => setHoveredSegment(null), className: `p-4 rounded-xl border-2 cursor-pointer transition-all ${hoveredSegment === segment.id
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20 shadow-lg scale-105'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-brand-300'}`, children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow", style: { backgroundColor: segment.color }, children: segment.icon }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "font-bold text-sm", children: segment.label }), _jsxs("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: [segment.percentage, "% \u2022 $", segment.amount.toLocaleString()] })] })] }), _jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: segment.examples.map((example) => (_jsx("span", { className: "px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs", children: example }, example))) })] }, segment.id))) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 1.2 }, className: "mt-8 p-4 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-sm", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(DollarSign, { className: "w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-blue-900 dark:text-blue-100 mb-1", children: "\uD83D\uDCA1 Pro Tip" }), _jsx("div", { className: "text-blue-800 dark:text-blue-200", children: "Start with needs (50%), then allocate wants (30%), and always save 20%. Adjust percentages based on your situation, but keep savings a priority." })] })] }) })] }) }));
}
//# sourceMappingURL=BudgetPieChart.js.map