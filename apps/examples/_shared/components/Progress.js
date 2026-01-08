import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
};
export function Progress({ value, max = 100, color = 'bg-blue-500', bgColor = 'bg-slate-200', height = 'md', showLabel = false, }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    return (_jsxs("div", { className: "w-full", children: [_jsx("div", { className: `w-full ${bgColor} rounded-full ${heightClasses[height]}`, children: _jsx("div", { className: `${color} ${heightClasses[height]} rounded-full transition-all duration-300`, style: { width: `${percentage}%` } }) }), showLabel && (_jsxs("div", { className: "flex justify-between text-xs text-slate-500 mt-1", children: [_jsx("span", { children: value.toLocaleString() }), _jsx("span", { children: max.toLocaleString() })] }))] }));
}
export default Progress;
//# sourceMappingURL=Progress.js.map