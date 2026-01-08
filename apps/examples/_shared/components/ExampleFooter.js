import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export function ExampleFooter({ title, subtitle = 'Clarity Chat Components', docsLink = '#', githubLink = '#', variant = 'light', }) {
    const isDark = variant === 'dark';
    return (_jsx("footer", { className: `border-t mt-8 ${isDark
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/80 border-slate-200'}`, children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: `flex items-center justify-between text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`, children: [_jsxs("p", { children: [title, " \u2022 ", subtitle] }), _jsxs("div", { className: "flex gap-4", children: [_jsx("a", { href: docsLink, className: `transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`, children: "Documentation" }), _jsx("a", { href: githubLink, className: `transition-colors ${isDark ? 'hover:text-white' : 'hover:text-slate-900'}`, children: "GitHub" })] })] }) }) }));
}
export default ExampleFooter;
//# sourceMappingURL=ExampleFooter.js.map