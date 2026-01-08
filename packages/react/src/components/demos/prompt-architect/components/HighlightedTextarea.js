'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * HighlightedTextarea Component
 *
 * A textarea with syntax highlighting for {{ variables }}.
 * Uses overlay technique: hidden textarea for input + visible div for display.
 */
import * as React from 'react';
import { cn } from '../../../../utils/cn';
import { getTemplateSegments } from '../utils/variable-parser';
/**
 * Textarea with syntax highlighting for template variables
 */
export function HighlightedTextarea({ value, onChange, placeholder, minHeight = 120, maxHeight = 400, disabled = false, className, id, ariaLabel, }) {
    const textareaRef = React.useRef(null);
    const highlightRef = React.useRef(null);
    // Sync scroll between textarea and highlight overlay
    const handleScroll = React.useCallback(() => {
        if (textareaRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop;
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    }, []);
    // Auto-resize textarea
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
        }
    }, [value, minHeight, maxHeight]);
    // Render highlighted content
    const highlightedContent = React.useMemo(() => {
        if (!value)
            return null;
        const segments = getTemplateSegments(value);
        return segments.map((segment, index) => {
            if (segment.type === 'variable') {
                return (_jsx("span", { className: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded px-0.5", children: segment.content }, index));
            }
            return _jsx("span", { children: segment.content }, index);
        });
    }, [value]);
    return (_jsxs("div", { className: cn('relative', className), children: [_jsxs("div", { ref: highlightRef, className: cn('absolute inset-0 pointer-events-none overflow-hidden', 'whitespace-pre-wrap break-words', 'font-mono text-sm leading-relaxed', 'p-3 text-foreground', 
                // Match textarea styling exactly
                'border border-transparent rounded-lg'), style: {
                    minHeight,
                    maxHeight,
                }, "aria-hidden": "true", children: [highlightedContent, !value && placeholder && (_jsx("span", { className: "text-muted-foreground/50", children: placeholder }))] }), _jsx("textarea", { ref: textareaRef, id: id, value: value, onChange: (e) => onChange(e.target.value), onScroll: handleScroll, placeholder: "", disabled: disabled, "aria-label": ariaLabel, className: cn('relative w-full resize-none', 'font-mono text-sm leading-relaxed', 'p-3 rounded-lg', 'bg-transparent text-transparent caret-foreground', 'border border-border', 'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary', 'disabled:opacity-50 disabled:cursor-not-allowed', 'transition-colors duration-200'), style: {
                    minHeight,
                    maxHeight,
                    // Ensure the textarea text is invisible but caret is visible
                    WebkitTextFillColor: 'transparent',
                } })] }));
}
export default HighlightedTextarea;
//# sourceMappingURL=HighlightedTextarea.js.map