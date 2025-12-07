'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import { Check, Copy, Terminal, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@clarity-chat/react';
export function EnhancedCodeBlock({ code, language, title, showLineNumbers = false, highlightLines = [], className, filename, sandboxUrl, editable = false, showCopyButton = true, }) {
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const timeoutRef = useRef(null);
    const { success, error: showError } = useToast();
    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            success('Code copied to clipboard');
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            console.error('Failed to copy:', error);
            showError('Failed to copy code');
        }
    }, [code, success, showError]);
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    const highlightTheme = useMemo(() => {
        const isDark = theme === 'dark';
        return isDark ? themes.nightOwl : themes.nightOwlLight;
    }, [theme]);
    const highlightLinesSet = useMemo(() => new Set(highlightLines), [highlightLines]);
    return (_jsxs("div", { className: clsx('group relative not-prose my-6 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden border border-border', className), children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-gradient-to-r from-bg-tertiary to-bg-secondary border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-3", children: [filename && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Terminal, { className: "w-4 h-4 text-brand-500" }), _jsx("span", { className: "font-mono text-sm font-medium text-text-primary", children: filename })] })), title && !filename && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center", children: _jsx(Terminal, { className: "w-4 h-4 text-brand-500" }) }), _jsx("span", { className: "font-semibold text-text-primary", children: title })] })), !title && !filename && (_jsx("span", { className: "font-mono text-xs font-medium text-text-secondary px-2 py-1 bg-muted/50 rounded-lg", children: language }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [sandboxUrl && (_jsxs("a", { href: sandboxUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary", "aria-label": "Open in CodeSandbox", children: [_jsx(ExternalLink, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Open" })] })), showCopyButton && (_jsx("button", { onClick: copyToClipboard, className: "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary hover:shadow-sm", "aria-label": "Copy code", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), _jsx("span", { className: "text-green-600 dark:text-green-400 font-semibold", children: "Copied!" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-4 h-4" }), _jsx("span", { children: "Copy" })] })) }))] })] }), _jsx(Highlight, { theme: highlightTheme, code: code.trim(), language: language, children: ({ className: highlightClassName, style, tokens, getLineProps, getTokenProps, }) => (_jsxs("pre", { className: clsx(highlightClassName, 'overflow-x-auto p-4 text-sm leading-relaxed', 'bg-gradient-to-br from-bg-primary to-bg-secondary'), style: {
                        ...style,
                        backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    }, children: [!title && !filename && showCopyButton && (_jsx("button", { onClick: copyToClipboard, className: "absolute top-3 right-3 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-sm z-10", "aria-label": "Copy code", children: copied ? (_jsx(Check, { className: "w-4 h-4 text-green-500" })) : (_jsx(Copy, { className: "w-4 h-4 text-text-tertiary" })) })), _jsx("code", { className: "font-mono", children: tokens.map((line, lineIndex) => {
                                const lineNumber = lineIndex + 1;
                                const isHighlighted = highlightLinesSet.has(lineNumber);
                                const lineProps = getLineProps({ line });
                                return (_jsxs("div", { ...lineProps, className: clsx(lineProps.className, isHighlighted &&
                                        'bg-brand-500/10 border-l-4 border-brand-500 -ml-4 pl-3', 'px-1 rounded-sm', 'hover:bg-bg-tertiary/50 transition-colors'), children: [showLineNumbers && (_jsx("span", { className: "inline-block w-10 text-right mr-4 text-text-tertiary select-none font-mono text-xs", children: lineNumber })), line.map((token, tokenIndex) => (_jsx("span", { ...getTokenProps({ token }) }, tokenIndex)))] }, lineIndex));
                            }) })] })) })] }));
}
//# sourceMappingURL=EnhancedCodeBlock.js.map