'use client';
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import { Check, Copy, Terminal, Download, Maximize2, Minimize2 } from 'lucide-react';
import clsx from 'clsx';
import { useToast } from '@clarity-chat/react';
import { motion, AnimatePresence } from 'framer-motion';
export function CodeBlock({ code, language, title, showLineNumbers = false, highlightLines = [], className, }) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { theme } = useTheme();
    const timeoutRef = useRef(null);
    const toast = useToast();
    const codeBlockRef = useRef(null);
    // Wrapped in useCallback to prevent recreation
    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('Code copied to clipboard');
            // Clear existing timeout if any
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            toast.error('Failed to copy code');
        }
    }, [code, toast]);
    // Download code as file
    const downloadCode = useCallback(() => {
        try {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `code.${language}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Code downloaded');
        }
        catch (error) {
            toast.error('Failed to download code');
        }
    }, [code, language, toast]);
    // Toggle expanded state
    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);
    // Keyboard shortcuts (Cmd/Ctrl+Shift+C to copy when focused)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!codeBlockRef.current?.contains(document.activeElement))
                return;
            // Cmd/Ctrl+Shift+C to copy
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
                e.preventDefault();
                copyToClipboard();
            }
            // Cmd/Ctrl+Shift+D to download
            else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
                e.preventDefault();
                downloadCode();
            }
            // Cmd/Ctrl+Shift+E to toggle expand
            else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
                e.preventDefault();
                toggleExpanded();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [copyToClipboard, downloadCode, toggleExpanded]);
    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);
    // Memoize theme selection to prevent recalculation
    const highlightTheme = useMemo(() => {
        const isDark = theme === 'dark';
        return isDark ? themes.nightOwl : themes.nightOwlLight;
    }, [theme]);
    // Memoize highlight lines set for O(1) lookups
    const highlightLinesSet = useMemo(() => new Set(highlightLines), [highlightLines]);
    // Check if code block is tall (more than 20 lines)
    const isTallCodeBlock = useMemo(() => {
        return code.split('\n').length > 20;
    }, [code]);
    return (_jsxs(motion.div, { ref: codeBlockRef, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }, className: clsx('group relative not-prose my-6 shadow-sm hover:shadow-md transition-shadow duration-200', className), tabIndex: 0, children: [(title || language) && (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b-2 border-border rounded-t-xl", children: [_jsx("div", { className: "flex items-center gap-2 text-sm", children: title ? (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }, className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center", children: _jsx(Terminal, { className: "w-4 h-4 text-primary" }) }), _jsx("span", { className: "font-semibold text-text-primary", children: title })] })) : (_jsx("span", { className: "font-mono text-xs font-medium text-text-secondary px-2 py-1 bg-muted/50 rounded-lg", children: language })) }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(motion.button, { onClick: copyToClipboard, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary hover:shadow-sm", "aria-label": "Copy code (\u2318\u21E7C)", children: _jsx(AnimatePresence, { mode: "wait", children: copied ? (_jsxs(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 180 }, className: "flex items-center gap-2", children: [_jsx(Check, { className: "w-4 h-4 text-green-500" }), _jsx("span", { className: "text-green-600 dark:text-green-400 font-semibold", children: "Copied!" })] }, "copied")) : (_jsxs(motion.div, { initial: { scale: 0, rotate: 180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -180 }, className: "flex items-center gap-2", children: [_jsx(Copy, { className: "w-4 h-4" }), _jsx("span", { children: "Copy" })] }, "copy")) }) }), _jsx(motion.button, { onClick: downloadCode, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-2 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-text-secondary hover:text-text-primary", "aria-label": "Download code (\u2318\u21E7D)", children: _jsx(Download, { className: "w-4 h-4" }) }), isTallCodeBlock && (_jsx(motion.button, { onClick: toggleExpanded, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-2 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-text-secondary hover:text-text-primary", "aria-label": isExpanded ? 'Collapse code (⌘⇧E)' : 'Expand code (⌘⇧E)', children: _jsx(AnimatePresence, { mode: "wait", children: isExpanded ? (_jsx(motion.div, { initial: { scale: 0, rotate: -90 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 90 }, children: _jsx(Minimize2, { className: "w-4 h-4" }) }, "minimize")) : (_jsx(motion.div, { initial: { scale: 0, rotate: 90 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -90 }, children: _jsx(Maximize2, { className: "w-4 h-4" }) }, "maximize")) }) }))] })] })), _jsx(Highlight, { theme: highlightTheme, code: code.trim(), language: language, children: ({ className: highlightClassName, style, tokens, getLineProps, getTokenProps, }) => (_jsxs(motion.pre, { animate: {
                        maxHeight: isExpanded ? 'none' : isTallCodeBlock ? '600px' : 'none',
                    }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: clsx(highlightClassName, 'overflow-x-auto p-8 text-sm leading-loose border-2 border-border relative', !title && !language && 'rounded-xl', (title || language) && 'rounded-b-xl border-t-0', isTallCodeBlock && !isExpanded && 'overflow-y-hidden'), style: {
                        ...style,
                        backgroundColor: theme === 'dark' ? '#1a202c' : '#f7fafc',
                    }, children: [!title && !language && (_jsxs("div", { className: "absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [_jsx(motion.button, { onClick: copyToClipboard, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 hover:shadow-sm", "aria-label": "Copy code (\u2318\u21E7C)", children: _jsx(AnimatePresence, { mode: "wait", children: copied ? (_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 180 }, children: _jsx(Check, { className: "w-4 h-4 text-green-500" }) }, "copied")) : (_jsx(motion.div, { initial: { scale: 0, rotate: 180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -180 }, children: _jsx(Copy, { className: "w-4 h-4 text-text-tertiary" }) }, "copy")) }) }), _jsx(motion.button, { onClick: downloadCode, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 hover:shadow-sm", "aria-label": "Download code (\u2318\u21E7D)", children: _jsx(Download, { className: "w-4 h-4 text-text-tertiary" }) }), isTallCodeBlock && (_jsx(motion.button, { onClick: toggleExpanded, whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 hover:shadow-sm", "aria-label": isExpanded ? 'Collapse code (⌘⇧E)' : 'Expand code (⌘⇧E)', children: _jsx(AnimatePresence, { mode: "wait", children: isExpanded ? (_jsx(motion.div, { initial: { scale: 0, rotate: -90 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 90 }, children: _jsx(Minimize2, { className: "w-4 h-4 text-text-tertiary" }) }, "minimize")) : (_jsx(motion.div, { initial: { scale: 0, rotate: 90 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -90 }, children: _jsx(Maximize2, { className: "w-4 h-4 text-text-tertiary" }) }, "maximize")) }) }))] })), _jsx("code", { children: tokens.map((line, lineIndex) => {
                                const lineNumber = lineIndex + 1;
                                const isHighlighted = highlightLinesSet.has(lineNumber);
                                const lineProps = getLineProps({ line });
                                return (_jsxs(motion.div, { ...lineProps, initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, transition: { delay: lineIndex * 0.005, duration: 0.2 }, className: clsx(lineProps.className, isHighlighted &&
                                        'bg-brand-500/10 border-l-2 border-brand-500 -ml-8 pl-6', 'px-3 py-0.5 transition-colors duration-150 hover:bg-white/5 dark:hover:bg-black/10'), children: [showLineNumbers && (_jsx("span", { className: "inline-block w-8 text-right mr-4 text-text-tertiary select-none font-mono text-xs", children: lineNumber })), line.map((token, tokenIndex) => (_jsx("span", { ...getTokenProps({ token }) }, tokenIndex)))] }, lineIndex));
                            }) }), isTallCodeBlock && !isExpanded && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary dark:from-[#1a202c] to-transparent pointer-events-none" }))] })) })] }));
}
//# sourceMappingURL=CodeBlock.js.map