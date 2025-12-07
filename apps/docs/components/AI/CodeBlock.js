'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Copy, Terminal, Download, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@clarity-chat/react';
import Prism from 'prismjs';
// Import language support
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
export function CodeBlock({ code, language = 'typescript', filename, showLineNumbers = false, highlightLines = [], className, }) {
    const [copied, setCopied] = useState(false);
    const [highlightedCode, setHighlightedCode] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const codeRef = useRef(null);
    const containerRef = useRef(null);
    const toast = useToast();
    // Highlight code with Prism
    useEffect(() => {
        try {
            const grammar = Prism.languages[language] || Prism.languages.typescript;
            const highlighted = Prism.highlight(code, grammar, language);
            setHighlightedCode(highlighted);
        }
        catch (error) {
            console.error('Prism highlighting error:', error);
            setHighlightedCode(code);
        }
    }, [code, language]);
    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            toast.success('Code copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
        catch (error) {
            console.error('Failed to copy code:', error);
            toast.error('Failed to copy code');
        }
    }, [code, toast]);
    const handleDownload = useCallback(() => {
        try {
            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || `code.${language}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('Code downloaded');
        }
        catch (error) {
            console.error('Failed to download code:', error);
            toast.error('Failed to download code');
        }
    }, [code, filename, language, toast]);
    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);
    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!containerRef.current?.contains(document.activeElement))
                return;
            // Cmd/Ctrl+Shift+C to copy
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
                e.preventDefault();
                handleCopy();
            }
            // Cmd/Ctrl+Shift+D to download
            else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
                e.preventDefault();
                handleDownload();
            }
            // Cmd/Ctrl+Shift+E to toggle expand
            else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
                e.preventDefault();
                toggleExpanded();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleCopy, handleDownload, toggleExpanded]);
    const lines = code.split('\n');
    const highlightedLines = highlightedCode.split('\n');
    const isTallCodeBlock = lines.length > 20;
    return (_jsxs(motion.div, { ref: containerRef, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: cn('rounded-lg border border-border overflow-hidden', 'bg-muted/50 shadow-sm hover:shadow-md transition-shadow duration-200', className), tabIndex: 0, children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, transition: { delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }, children: _jsx(Terminal, { className: "w-4 h-4 text-muted-foreground" }) }), filename ? (_jsx("span", { className: "text-sm font-medium", children: filename })) : (_jsx("span", { className: "text-sm text-muted-foreground", children: language }))] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(motion.button, { onClick: handleCopy, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: cn('flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium', 'transition-all duration-200', copied
                                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                    : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'), "aria-label": "Copy code (\u2318\u21E7C)", children: _jsx(AnimatePresence, { mode: "wait", children: copied ? (_jsxs(motion.div, { initial: { scale: 0, rotate: -180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 180 }, className: "flex items-center gap-1.5", children: [_jsx(Check, { className: "w-3 h-3" }), _jsx("span", { children: "Copied!" })] }, "check")) : (_jsxs(motion.div, { initial: { scale: 0, rotate: 180 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -180 }, className: "flex items-center gap-1.5", children: [_jsx(Copy, { className: "w-3 h-3" }), _jsx("span", { children: "Copy" })] }, "copy")) }) }), _jsx(motion.button, { onClick: handleDownload, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground", "aria-label": "Download code (\u2318\u21E7D)", children: _jsx(Download, { className: "w-3.5 h-3.5" }) }), isTallCodeBlock && (_jsx(motion.button, { onClick: toggleExpanded, whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground", "aria-label": isExpanded ? 'Collapse code (⌘⇧E)' : 'Expand code (⌘⇧E)', children: _jsx(AnimatePresence, { mode: "wait", children: isExpanded ? (_jsx(motion.div, { initial: { scale: 0, rotate: -90 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: 90 }, children: _jsx(Minimize2, { className: "w-3.5 h-3.5" }) }, "minimize")) : (_jsx(motion.div, { initial: { scale: 0, rotate: 90 }, animate: { scale: 1, rotate: 0 }, exit: { scale: 0, rotate: -90 }, children: _jsx(Maximize2, { className: "w-3.5 h-3.5" }) }, "maximize")) }) }))] })] }), _jsxs(motion.div, { animate: {
                    maxHeight: isExpanded ? 'none' : isTallCodeBlock ? '500px' : 'none',
                }, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, className: cn('relative overflow-x-auto', isTallCodeBlock && !isExpanded && 'overflow-y-hidden'), children: [_jsx("pre", { className: "p-4 text-sm leading-relaxed", children: _jsx("code", { ref: codeRef, className: cn('block', `language-${language}`), children: showLineNumbers ? (_jsx("div", { className: "grid", style: { gridTemplateColumns: 'auto 1fr' }, children: lines.map((line, index) => {
                                    const lineNumber = index + 1;
                                    const isHighlighted = highlightLines.includes(lineNumber);
                                    const highlightedLine = highlightedLines[index] || line;
                                    return (_jsxs(motion.div, { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.005, duration: 0.2 }, className: cn('contents', isHighlighted && 'bg-primary/5'), children: [_jsx("span", { className: cn('select-none pr-4 text-muted-foreground/50', 'text-right tabular-nums', isHighlighted && 'text-primary/70 font-semibold'), children: lineNumber }), _jsx("span", { className: cn('transition-colors duration-150 hover:bg-white/5 dark:hover:bg-black/10', isHighlighted &&
                                                    'bg-primary/5 border-l-2 border-primary pl-2 -ml-2'), dangerouslySetInnerHTML: { __html: highlightedLine || '\n' } })] }, index));
                                }) })) : (_jsx("span", { dangerouslySetInnerHTML: { __html: highlightedCode || code } })) }) }), isTallCodeBlock && !isExpanded && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-muted/80 to-transparent pointer-events-none" }))] })] }));
}
/**
 * Inline code snippet
 */
export function InlineCode({ children, className, }) {
    return (_jsx("code", { className: cn('px-1.5 py-0.5 rounded', 'bg-muted text-foreground', 'font-mono text-sm', 'border border-border', className), children: children }));
}
/**
 * Parse markdown code blocks from text
 */
export function parseCodeBlocks(text) {
    const blocks = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
        // Add text before code block
        if (match.index > lastIndex) {
            const textContent = text.slice(lastIndex, match.index);
            if (textContent.trim()) {
                blocks.push({ type: 'text', content: textContent });
            }
        }
        // Add code block
        blocks.push({
            type: 'code',
            content: match[2].trim(),
            language: match[1] || 'typescript',
        });
        lastIndex = match.index + match[0].length;
    }
    // Add remaining text
    if (lastIndex < text.length) {
        const textContent = text.slice(lastIndex);
        if (textContent.trim()) {
            blocks.push({ type: 'text', content: textContent });
        }
    }
    return blocks;
}
/**
 * Render text with code blocks
 */
export function RenderWithCodeBlocks({ content, className, }) {
    const blocks = parseCodeBlocks(content);
    if (blocks.length === 0) {
        return _jsx("div", { className: className, children: content });
    }
    return (_jsx("div", { className: cn('space-y-4', className), children: blocks.map((block, index) => {
            if (block.type === 'code') {
                return (_jsx(CodeBlock, { code: block.content, language: block.language }, index));
            }
            // Render text with inline code support
            return (_jsx("div", { className: "prose prose-sm dark:prose-invert max-w-none", dangerouslySetInnerHTML: {
                    __html: renderInlineCode(block.content),
                } }, index));
        }) }));
}
/**
 * Render inline code snippets in text
 */
function renderInlineCode(text) {
    return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
}
/**
 * Get language display name
 */
export function getLanguageDisplayName(lang) {
    const names = {
        ts: 'TypeScript',
        tsx: 'TypeScript (JSX)',
        js: 'JavaScript',
        jsx: 'JavaScript (JSX)',
        py: 'Python',
        python: 'Python',
        rs: 'Rust',
        rust: 'Rust',
        go: 'Go',
        java: 'Java',
        cpp: 'C++',
        c: 'C',
        cs: 'C#',
        rb: 'Ruby',
        php: 'PHP',
        swift: 'Swift',
        kt: 'Kotlin',
        sql: 'SQL',
        sh: 'Shell',
        bash: 'Bash',
        yml: 'YAML',
        yaml: 'YAML',
        json: 'JSON',
        xml: 'XML',
        html: 'HTML',
        css: 'CSS',
        scss: 'SCSS',
        md: 'Markdown',
        mdx: 'MDX',
    };
    return names[lang.toLowerCase()] || lang.toUpperCase();
}
//# sourceMappingURL=CodeBlock.js.map