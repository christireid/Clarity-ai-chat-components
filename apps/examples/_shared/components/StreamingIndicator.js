import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { TypingIndicator } from './TypingIndicator';
export function StreamingIndicator({ message = 'Streaming response...', onCancel, variant = 'light', }) {
    const isDark = variant === 'dark';
    return (_jsxs("div", { className: `mb-4 px-4 py-3 rounded-lg flex items-center justify-between ${isDark
            ? 'bg-blue-500/10 border border-blue-500/30'
            : 'bg-blue-50 border border-blue-200'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(TypingIndicator, { color: isDark ? 'bg-blue-400' : 'bg-blue-500' }), _jsx("span", { className: `text-sm ${isDark ? 'text-blue-400' : 'text-blue-700'}`, children: message })] }), onCancel && (_jsx("button", { onClick: onCancel, className: `px-3 py-1 text-sm rounded transition-colors ${isDark
                    ? 'bg-slate-700 text-white hover:bg-slate-600'
                    : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'}`, children: "Stop" }))] }));
}
export default StreamingIndicator;
//# sourceMappingURL=StreamingIndicator.js.map