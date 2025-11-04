'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import { Check, Copy, Terminal } from 'lucide-react';
import clsx from 'clsx';
export function CodeBlock({ code, language, title, showLineNumbers = false, highlightLines = [], className, }) {
    const [copied, setCopied] = useState(false);
    const { theme } = useTheme();
    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const isDark = theme === 'dark';
    const highlightTheme = isDark ? themes.nightOwl : themes.nightOwlLight;
    return (_jsxs("div", { className: clsx('group relative not-prose my-6 shadow-sm hover:shadow-md transition-all duration-200', className), children: [(title || language) && (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b-2 border-border rounded-t-xl", children: [_jsx("div", { className: "flex items-center gap-2 text-sm", children: title ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: _jsx(Terminal, { className: "w-4 h-4 text-primary" }) }), _jsx("span", { className: "font-semibold text-text-primary", children: title })] })) : (_jsx("span", { className: "font-mono text-xs font-medium text-text-secondary px-2 py-1 bg-muted/50 rounded-lg", children: language })) }), _jsx("button", { onClick: copyToClipboard, className: "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary hover:shadow-sm", "aria-label": "Copy code", children: copied ? (_jsxs(_Fragment, { children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), _jsx("span", { className: "text-green-600 dark:text-green-400 font-semibold", children: "Copied!" })] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "w-4 h-4" }), _jsx("span", { children: "Copy" })] })) })] })), _jsx(Highlight, { theme: highlightTheme, code: code.trim(), language: language, children: ({ className: highlightClassName, style, tokens, getLineProps, getTokenProps, }) => (_jsxs("pre", { className: clsx(highlightClassName, 'overflow-x-auto p-4 text-sm leading-relaxed border-2 border-border', !title && !language && 'rounded-xl', (title || language) && 'rounded-b-xl border-t-0'), style: {
                        ...style,
                        backgroundColor: isDark ? '#1a202c' : '#f7fafc',
                    }, children: [!title && !language && (_jsx("button", { onClick: copyToClipboard, className: "absolute top-3 right-3 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-sm", "aria-label": "Copy code", children: copied ? (_jsx(Check, { className: "w-4 h-4 text-green-500" })) : (_jsx(Copy, { className: "w-4 h-4 text-text-tertiary" })) })), _jsx("code", { children: tokens.map((line, lineIndex) => {
                                const lineNumber = lineIndex + 1;
                                const isHighlighted = highlightLines.includes(lineNumber);
                                const lineProps = getLineProps({ line });
                                return (_jsxs("div", { ...lineProps, className: clsx(lineProps.className, isHighlighted &&
                                        'bg-brand-500/10 border-l-2 border-brand-500 -ml-4 pl-3', 'px-1'), children: [showLineNumbers && (_jsx("span", { className: "inline-block w-8 text-right mr-4 text-text-tertiary select-none", children: lineNumber })), line.map((token, tokenIndex) => (_jsx("span", { ...getTokenProps({ token }) }, tokenIndex)))] }, lineIndex));
                            }) })] })) })] }));
}
//# sourceMappingURL=CodeBlock.js.map