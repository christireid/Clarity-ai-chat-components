'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, X } from 'lucide-react';
export function AlertPanel({ type, title, message, onDismiss }) {
    const styles = {
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    };
    return (_jsxs("div", { className: `${styles[type]} border rounded-lg p-4 mb-6 flex items-start justify-between`, children: [_jsxs("div", { className: "flex items-start space-x-3", children: [_jsx(AlertTriangle, { className: `w-5 h-5 mt-0.5 ${type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                            type === 'error' ? 'text-red-600 dark:text-red-400' :
                                'text-blue-600 dark:text-blue-400'}` }), _jsxs("div", { children: [_jsx("h3", { className: `font-semibold ${type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                                    type === 'error' ? 'text-red-800 dark:text-red-200' :
                                        'text-blue-800 dark:text-blue-200'}`, children: title }), _jsx("p", { className: `text-sm mt-1 ${type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                                    type === 'error' ? 'text-red-700 dark:text-red-300' :
                                        'text-blue-700 dark:text-blue-300'}`, children: message })] })] }), _jsx("button", { onClick: onDismiss, className: "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300", children: _jsx(X, { className: "w-5 h-5" }) })] }));
}
//# sourceMappingURL=AlertPanel.js.map