'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * DebugView Component
 *
 * Toggle between template, compiled, and raw JSON views.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { generateDiff } from '../utils/template-compiler';
import { CopyButton } from './CopyButton';
/**
 * View mode tabs
 */
const VIEW_MODES = [
    { mode: 'template', label: 'Template' },
    { mode: 'compiled', label: 'Compiled' },
    { mode: 'raw', label: 'Raw JSON' },
];
/**
 * Render diff segments with highlighting
 */
const DiffRenderer = React.memo(function DiffRenderer({ template, values, }) {
    const segments = React.useMemo(() => generateDiff(template, values), [template, values]);
    return (_jsx("div", { className: "font-mono text-sm whitespace-pre-wrap break-words", children: segments.map((segment, index) => {
            if (segment.type === 'value') {
                return (_jsx("span", { className: "bg-green-500/20 text-green-700 dark:text-green-300 rounded px-0.5", title: `Variable: ${segment.variableName}`, children: segment.content }, index));
            }
            if (segment.type === 'variable') {
                return (_jsx("span", { className: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded px-0.5", children: segment.content }, index));
            }
            return _jsx("span", { children: segment.content }, index);
        }) }));
});
/**
 * Debug view with mode switcher
 */
export const DebugView = React.memo(function DebugView({ mode, onModeChange, systemPromptTemplate, userPromptTemplate, compiledSystemPrompt, compiledUserPrompt, variableValues, messagesArray, className, }) {
    // Memoize JSON string to avoid recalculation on every render
    const messagesJson = React.useMemo(() => JSON.stringify(messagesArray, null, 2), [messagesArray]);
    return (_jsxs("div", { className: cn('space-y-4', className), children: [_jsx("div", { className: "flex items-center gap-1 p-1 bg-muted rounded-lg", children: VIEW_MODES.map(({ mode: m, label }) => (_jsx("button", { type: "button", onClick: () => onModeChange(m), className: cn('flex-1 px-3 py-1.5 text-xs font-medium rounded-md', 'transition-colors duration-200', mode === m
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'), children: label }, m))) }), _jsxs("div", { className: "space-y-4 max-h-[500px] overflow-auto", children: [mode === 'template' && (_jsxs(_Fragment, { children: [systemPromptTemplate && (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase", children: "System Prompt Template" }), _jsx("div", { className: "p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50", children: _jsx("pre", { className: "font-mono text-sm whitespace-pre-wrap break-words text-foreground", children: systemPromptTemplate }) })] })), userPromptTemplate && (_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase", children: "User Prompt Template" }), _jsx("div", { className: "p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50", children: _jsx("pre", { className: "font-mono text-sm whitespace-pre-wrap break-words text-foreground", children: userPromptTemplate }) })] }))] })), mode === 'compiled' && (_jsxs(_Fragment, { children: [compiledSystemPrompt && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase", children: "Compiled System Prompt" }), _jsx(CopyButton, { text: compiledSystemPrompt, label: "Copy system prompt" })] }), _jsx("div", { className: "p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50", children: _jsx(DiffRenderer, { template: systemPromptTemplate, values: variableValues }) })] })), compiledUserPrompt && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase", children: "Compiled User Prompt" }), _jsx(CopyButton, { text: compiledUserPrompt, label: "Copy user prompt" })] }), _jsx("div", { className: "p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50", children: _jsx(DiffRenderer, { template: userPromptTemplate, values: variableValues }) })] }))] })), mode === 'raw' && (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase", children: "API Messages Array" }), _jsx(CopyButton, { text: messagesJson, label: "Copy JSON" })] }), _jsx("div", { className: "p-3 rounded-lg bg-muted/50 border border-border overflow-auto", children: _jsx("pre", { className: "font-mono text-xs text-foreground", children: messagesJson }) })] }))] })] }));
});
export default DebugView;
//# sourceMappingURL=DebugView.js.map