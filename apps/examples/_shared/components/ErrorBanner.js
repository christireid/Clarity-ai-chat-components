import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export function ErrorBanner({ message, onDismiss, variant = 'light', }) {
    const isDark = variant === 'dark';
    return (_jsxs("div", { className: `mb-4 p-4 rounded-lg flex items-center gap-3 ${isDark
            ? 'bg-red-500/10 border border-red-500/30'
            : 'bg-red-50 border border-red-200'}`, children: [_jsx("span", { children: "\u26A0\uFE0F" }), _jsx("p", { className: `text-sm flex-1 ${isDark ? 'text-red-400' : 'text-red-700'}`, children: message }), onDismiss && (_jsx("button", { onClick: onDismiss, className: `text-sm font-medium ${isDark
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-red-700 hover:text-red-900'}`, children: "Dismiss" }))] }));
}
export default ErrorBanner;
//# sourceMappingURL=ErrorBanner.js.map