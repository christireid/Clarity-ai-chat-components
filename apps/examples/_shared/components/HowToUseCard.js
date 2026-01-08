import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export function HowToUseCard({ title = '💡 How to Use', children, variant = 'light', }) {
    const isDark = variant === 'dark';
    return (_jsxs("div", { className: `rounded-lg border p-4 mb-6 ${isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white border-slate-200'}`, children: [_jsx("h2", { className: `text-base font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`, children: title }), _jsx("div", { className: `text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`, children: children })] }));
}
export default HowToUseCard;
//# sourceMappingURL=HowToUseCard.js.map