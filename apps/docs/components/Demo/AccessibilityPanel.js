'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, ChevronRight, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
export function AccessibilityPanel({ componentName = 'Component', checks = [], keyboardShortcuts = [], ariaAttributes = {}, className, }) {
    const [expanded, setExpanded] = useState(false);
    const defaultChecks = checks.length > 0 ? checks : [
        {
            name: 'Keyboard Navigation',
            status: 'pass',
            message: 'Fully keyboard accessible',
            wcagLevel: 'A',
        },
        {
            name: 'Screen Reader Support',
            status: 'pass',
            message: 'Proper ARIA labels provided',
            wcagLevel: 'A',
        },
        {
            name: 'Color Contrast',
            status: 'pass',
            message: 'Meets WCAG AAA standards',
            wcagLevel: 'AAA',
        },
        {
            name: 'Focus Management',
            status: 'pass',
            message: 'Clear focus indicators',
            wcagLevel: 'AA',
        },
    ];
    const passCount = defaultChecks.filter((c) => c.status === 'pass').length;
    const warningCount = defaultChecks.filter((c) => c.status === 'warning').length;
    return (_jsxs("div", { className: clsx('border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className), children: [_jsxs("button", { onClick: () => setExpanded(!expanded), className: "w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 hover:from-green-100 hover:to-blue-100 dark:hover:from-gray-700 dark:hover:to-gray-800 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-2", children: [expanded ? (_jsx(ChevronDown, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })) : (_jsx(ChevronRight, { className: "w-4 h-4 text-gray-600 dark:text-gray-400" })), _jsx("span", { className: "font-semibold text-sm text-gray-900 dark:text-gray-50", children: "\u267F Accessibility" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium", children: [passCount, " passing"] }), warningCount > 0 && (_jsxs("span", { className: "text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-medium", children: [warningCount, " warnings"] }))] })] }), expanded && (_jsxs("div", { className: "bg-white dark:bg-gray-950 p-4 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3", children: "Accessibility Checks" }), defaultChecks.map((check, index) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg", children: [check.status === 'pass' && (_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" })), check.status === 'warning' && (_jsx(AlertCircle, { className: "w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" })), check.status === 'info' && (_jsx(Info, { className: "w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" })), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-gray-50", children: check.name }), check.wcagLevel && (_jsxs("span", { className: "text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-mono font-semibold", children: ["WCAG ", check.wcagLevel] }))] }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: check.message })] })] }, index)))] }), keyboardShortcuts.length > 0 && (_jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3", children: "Keyboard Shortcuts" }), _jsx("div", { className: "space-y-2", children: keyboardShortcuts.map((shortcut, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded", children: [_jsx("span", { className: "text-sm text-gray-700 dark:text-gray-300", children: shortcut.action }), _jsx("kbd", { className: "px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded shadow-sm", children: shortcut.key })] }, index))) })] })), Object.keys(ariaAttributes).length > 0 && (_jsxs("div", { className: "pt-4 border-t border-gray-200 dark:border-gray-700", children: [_jsx("h4", { className: "text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3", children: "ARIA Attributes" }), _jsx("div", { className: "space-y-2", children: Object.entries(ariaAttributes).map(([key, value]) => (_jsxs("div", { className: "flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded", children: [_jsx("code", { className: "text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold", children: key }), _jsx("span", { className: "text-xs text-gray-600 dark:text-gray-400", children: "=" }), _jsxs("code", { className: "text-xs font-mono text-gray-700 dark:text-gray-300", children: ["\"", value, "\""] })] }, key))) })] }))] }))] }));
}
//# sourceMappingURL=AccessibilityPanel.js.map