import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export function ExampleHeader({ title, subtitle, icon, backLink = '/', backLabel = '← Back to Docs', actions, variant = 'light', }) {
    const isDark = variant === 'dark';
    return (_jsx("header", { className: `sticky top-0 z-50 border-b backdrop-blur-sm ${isDark
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/80 border-slate-200 shadow-sm'}`, children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [icon && (_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center", children: icon })), _jsxs("div", { children: [_jsx("h1", { className: `text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`, children: title }), subtitle && (_jsx("p", { className: `text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`, children: subtitle }))] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [actions, _jsx("a", { href: backLink, className: `px-3 py-1.5 text-sm transition-colors ${isDark
                                    ? 'text-slate-400 hover:text-white'
                                    : 'text-slate-600 hover:text-slate-900'}`, children: backLabel })] })] }) }) }));
}
export default ExampleHeader;
//# sourceMappingURL=ExampleHeader.js.map