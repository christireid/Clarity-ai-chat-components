'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * PromptEditor Component
 *
 * A labeled editor section with syntax-highlighted textarea and token count.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { HighlightedTextarea } from './HighlightedTextarea';
/**
 * Prompt editor with label and token count
 */
export const PromptEditor = React.memo(function PromptEditor({ label, value, onChange, tokenCount, placeholder, minHeight = 120, maxHeight = 300, disabled = false, className, }) {
    const editorId = React.useId();
    return (_jsxs("div", { className: cn('space-y-2', className), children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { htmlFor: editorId, className: "text-sm font-medium text-foreground", children: label }), _jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: ["~", tokenCount.toLocaleString(), " tokens"] })] }), _jsx("div", { className: cn('rounded-lg border border-border bg-muted/30', 'transition-colors duration-200', 'hover:border-border/80', 'focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20'), children: _jsx(HighlightedTextarea, { id: editorId, value: value, onChange: onChange, placeholder: placeholder, minHeight: minHeight, maxHeight: maxHeight, disabled: disabled, ariaLabel: label, className: "border-0 focus-within:ring-0" }) }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Use", ' ', _jsx("code", { className: "px-1 py-0.5 bg-muted rounded text-cyan-600 dark:text-cyan-400", children: '{{ variable }}' }), ' ', "syntax for dynamic values"] })] }));
});
export default PromptEditor;
//# sourceMappingURL=PromptEditor.js.map