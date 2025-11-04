/**
 * Reusable SVG Diagram Components
 *
 * Consistent, brand-aligned visual elements for documentation
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from 'framer-motion';
// Color palette from design system
const colors = {
    brand: '#3b82f6',
    brandLight: '#60a5fa',
    brandDark: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: '#6b7280',
    neutralLight: '#d1d5db',
    background: '#f9fafb',
    backgroundDark: '#1f2937',
};
export function BoxNode({ x, y, width, height, label, color = colors.brand, icon, animate = true, delay = 0, }) {
    const Component = animate ? motion.g : 'g';
    return (_jsxs(Component, { initial: animate ? { opacity: 0, y: -10 } : undefined, animate: animate ? { opacity: 1, y: 0 } : undefined, transition: animate ? { delay, duration: 0.3 } : undefined, children: [_jsx("rect", { x: x, y: y, width: width, height: height, rx: "12", fill: "white", stroke: color, strokeWidth: "2", className: "dark:fill-slate-900 transition-colors" }), _jsx("rect", { x: x, y: y, width: width, height: 8, rx: "12", fill: color, opacity: "0.15" }), icon && (_jsx("foreignObject", { x: x + 12, y: y + 16, width: "32", height: "32", children: _jsx("div", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10", children: icon }) })), _jsx("foreignObject", { x: x + (icon ? 52 : 16), y: y + 16, width: width - (icon ? 68 : 32), height: height - 32, children: _jsx("div", { className: "flex items-center h-full", children: _jsx("div", { className: "text-sm font-semibold text-gray-900 dark:text-gray-100", children: label }) }) })] }));
}
export function Arrow({ from, to, color = colors.neutral, dashed = false, animated = true, label, delay = 0, }) {
    const Component = animated ? motion.g : 'g';
    return (_jsxs(Component, { initial: animated ? { opacity: 0 } : undefined, animate: animated ? { opacity: 1 } : undefined, transition: animated ? { delay, duration: 0.3 } : undefined, children: [_jsx("defs", { children: _jsx("marker", { id: `arrowhead-${color.replace('#', '')}`, markerWidth: "10", markerHeight: "10", refX: "9", refY: "3", orient: "auto", markerUnits: "strokeWidth", children: _jsx("path", { d: "M0,0 L0,6 L9,3 z", fill: color }) }) }), _jsx(motion.line, { x1: from.x, y1: from.y, x2: to.x, y2: to.y, stroke: color, strokeWidth: "2", strokeDasharray: dashed ? "5,5" : "0", markerEnd: `url(#arrowhead-${color.replace('#', '')})`, initial: animated ? { pathLength: 0 } : undefined, animate: animated ? { pathLength: 1 } : undefined, transition: animated ? { delay: delay + 0.2, duration: 0.5, ease: 'easeOut' } : undefined }), label && (_jsx("foreignObject", { x: (from.x + to.x) / 2 - 40, y: (from.y + to.y) / 2 - 12, width: "80", height: "24", children: _jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("span", { className: "px-2 py-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded text-xs font-medium", children: label }) }) }))] }));
}
export function IconBadge({ icon, color = colors.brand, size = 'md' }) {
    const sizes = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-lg',
    };
    return (_jsx("div", { className: `${sizes[size]} rounded-xl flex items-center justify-center text-white shadow-lg`, style: {
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        }, children: icon }));
}
export function StepIndicator({ steps, currentStep, orientation = 'horizontal', }) {
    return (_jsx("div", { className: `flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} gap-4`, children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: index * 0.1, type: 'spring' }, className: `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${step.complete || (currentStep && step.number <= currentStep)
                                ? 'bg-brand-500 border-brand-500 text-white'
                                : 'border-gray-300 dark:border-gray-600 text-gray-400'}`, children: step.complete ? '✓' : step.number }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-sm", children: step.label }), step.description && (_jsx("div", { className: "text-xs text-gray-500 dark:text-gray-400", children: step.description }))] })] }), index < steps.length - 1 && orientation === 'horizontal' && (_jsx("div", { className: "flex-1 h-0.5 bg-gray-200 dark:bg-gray-700 min-w-[40px]" })), index < steps.length - 1 && orientation === 'vertical' && (_jsx("div", { className: "w-0.5 h-8 bg-gray-200 dark:bg-gray-700 ml-5" }))] }, step.number))) }));
}
export function FeatureGrid({ features, columns = 3 }) {
    const gridCols = {
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4',
    };
    return (_jsx("div", { className: `grid grid-cols-1 ${gridCols[columns]} gap-6 my-8`, children: features.map((feature, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: index * 0.1 }, className: `p-6 rounded-xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${feature.highlight
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                : 'border-gray-200 dark:border-gray-700'}`, children: [_jsx("div", { className: "mb-4", children: feature.icon }), _jsx("h3", { className: "font-bold text-lg mb-2", children: feature.title }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: feature.description })] }, feature.title))) }));
}
export function ComparisonTable({ headers, rows }) {
    return (_jsx("div", { className: "overflow-x-auto my-8", children: _jsxs("table", { className: "w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl", children: [_jsx("thead", { children: _jsx("tr", { className: "bg-gray-50 dark:bg-gray-800", children: headers.map((header) => (_jsx("th", { className: "px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b-2", children: header }, header))) }) }), _jsx("tbody", { children: rows.map((row, rowIndex) => (_jsxs(motion.tr, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: rowIndex * 0.05 }, className: "border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 font-medium text-sm", children: row.label }), row.values.map((value, valueIndex) => (_jsx("td", { className: "px-6 py-4 text-sm", children: typeof value === 'boolean' ? (value ? (_jsx("span", { className: "text-green-600 dark:text-green-400 text-lg", children: "\u2713" })) : (_jsx("span", { className: "text-gray-300 dark:text-gray-600 text-lg", children: "\u2013" }))) : (value) }, valueIndex)))] }, row.label))) })] }) }));
}
export function FlowStep({ steps, compact = false }) {
    return (_jsx("div", { className: "flex flex-col md:flex-row items-center gap-4 my-8", children: steps.map((step, index) => (_jsxs("div", { className: "flex items-center gap-4 flex-1", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { delay: index * 0.15 }, className: compact ? 'flex items-center gap-3' : 'flex flex-col items-center text-center', children: [step.icon && (_jsx("div", { className: "p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg", children: step.icon })), _jsxs("div", { className: compact ? '' : 'mt-3', children: [_jsx("div", { className: "font-semibold text-sm mb-1", children: step.title }), step.description && (_jsx("div", { className: "text-xs text-gray-600 dark:text-gray-400", children: step.description }))] })] }), index < steps.length - 1 && (_jsx(motion.div, { initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { delay: index * 0.15 + 0.2, duration: 0.3 }, className: "hidden md:block", children: _jsxs("svg", { width: "40", height: "24", viewBox: "0 0 40 24", fill: "none", children: [_jsx("path", { d: "M 0 12 L 32 12", stroke: colors.neutral, strokeWidth: "2", strokeDasharray: "4 4" }), _jsx("path", { d: "M 28 8 L 36 12 L 28 16", fill: colors.neutral })] }) }))] }, index))) }));
}
export function PulsingDot({ color = colors.brand, size = 'md' }) {
    const sizes = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };
    return (_jsxs("div", { className: "relative inline-flex", children: [_jsx(motion.div, { className: `${sizes[size]} rounded-full`, style: { backgroundColor: color }, animate: {
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.8, 1],
                }, transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                } }), _jsx(motion.div, { className: `absolute inset-0 ${sizes[size]} rounded-full`, style: { backgroundColor: color }, animate: {
                    scale: [1, 1.5, 1.8],
                    opacity: [0.6, 0.3, 0],
                }, transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                } })] }));
}
export function HighlightBox({ children, color = 'brand', icon, title }) {
    const colorClasses = {
        brand: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800',
        success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
        warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
        error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    };
    return (_jsxs("div", { className: `p-6 rounded-xl border-2 my-6 ${colorClasses[color]}`, children: [(icon || title) && (_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [icon && _jsx("div", { className: "text-2xl", children: icon }), title && _jsx("h4", { className: "font-bold text-lg", children: title })] })), _jsx("div", { className: "text-sm", children: children })] }));
}
export function AnimatedCounter({ value, duration = 1000, suffix = '', prefix = '', }) {
    return (_jsx(motion.span, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "font-bold text-4xl text-brand-600 dark:text-brand-400", children: _jsxs(motion.span, { initial: { textContent: 0 }, animate: { textContent: value }, transition: { duration: duration / 1000, ease: 'easeOut' }, children: [prefix, value, suffix] }) }));
}
export { colors };
//# sourceMappingURL=DiagramComponents.js.map