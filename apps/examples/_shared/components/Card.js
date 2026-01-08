import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export function Card({ children, className = '', variant = 'light', }) {
    const isDark = variant === 'dark';
    return (_jsx("div", { className: `rounded-xl border shadow-sm ${isDark
            ? 'bg-slate-800/50 border-slate-700/50'
            : 'bg-white border-slate-200'} ${className}`, children: children }));
}
export default Card;
//# sourceMappingURL=Card.js.map