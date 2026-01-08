'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '@clarity-chat/primitives';
import { CodeWindowHeader } from '../code/CodeWindowHeader';
import { MarkdownCodeBlock } from '../message/markdown-code-block';
export function EnhancedCodeBlock({ code, language = 'text', showLineNumbers = true, enableFolding = true, initiallyFolded = false, theme = 'dark', maxHeight = 20, showCopyButton = true, className, filename, highlightLines = [], startLineNumber = 1, }) {
    const [isFolded, setIsFolded] = React.useState(initiallyFolded);
    const [wrapText, setWrapText] = React.useState(false);
    // Use raw split for logic, but full code for Prism
    const lines = React.useMemo(() => code.split('\n'), [code]);
    const shouldFold = enableFolding && lines.length > maxHeight;
    // If folding is active, we just limit the container height/overflow via CSS or rendering
    // But since we are delegating rendering to MarkdownCodeBlock which takes a string,
    // we need to slice the STRING if we want to "physically" fold it,
    // OR we use CSS max-height.
    // Using string slicing breaks syntax highlighting (context lost).
    // Using CSS max-height is better but line numbers must match.
    // For simplicity and robustness with Prism, we will render the FULL code
    // and use a container with max-height/overflow-hidden when folded.
    // Actually, to truly "fold" and show "Show more", we usually just crop.
    // Cropping plain text is fine. Cropping HTML is hard.
    // We will crop the TEXT passed to Prism.
    // This might result in unclosed scopes at the bottom, but Prism handles partial code reasonably well (usually just loses coloring for that last token).
    const displayedCode = isFolded && shouldFold ? lines.slice(0, maxHeight).join('\n') : code;
    const displayedLineCount = isFolded && shouldFold ? maxHeight : lines.length;
    // Detect language from code if not provided
    const detectedLanguage = React.useMemo(() => {
        if (language && language !== 'text')
            return language;
        // Simple language detection logic could go here or use utility
        // For now, default to text if not provided
        return 'text';
    }, [code, language]);
    return (_jsxs("div", { className: cn('relative rounded-xl border shadow-sm overflow-hidden group/code-block my-4', theme === 'dark' && 'bg-[#1e1e1e] border-[#333]', theme === 'light' && 'bg-[#ffffff] border-gray-200', className), children: [_jsx(CodeWindowHeader, { codeString: code, language: detectedLanguage, filename: filename, isFolded: isFolded, enableFolding: shouldFold, onToggleFold: () => setIsFolded(!isFolded), wrapText: wrapText, onToggleWrap: () => setWrapText(!wrapText), showCopyButton: showCopyButton, theme: theme }), _jsxs("div", { className: cn('relative flex bg-[#1e1e1e] text-[#d4d4d4] code-metrics', // Hardcode dark background for code area to match Prism theme
                // Scrollbar styling
                'scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40'), children: [showLineNumbers && (_jsx("div", { className: cn('flex-none py-4 px-3 text-right select-none border-r border-white/10 bg-white/5 text-[#858585] text-xs font-mono min-w-[3rem]'), children: Array.from({ length: displayedLineCount }).map((_, index) => {
                            const lineNumber = startLineNumber + index;
                            // Check highlight
                            const isHighlighted = highlightLines.includes(lineNumber);
                            return (_jsx("div", { className: cn('transition-colors', isHighlighted && 'text-yellow-500 font-bold'), children: lineNumber }, index));
                        }) })), _jsxs("div", { className: "flex-1 min-w-0 overflow-x-auto relative", children: [highlightLines.length > 0 && (_jsx("div", { className: "absolute inset-0 pointer-events-none select-none z-0", children: Array.from({ length: displayedLineCount }).map((_, index) => {
                                    const lineNumber = startLineNumber + index;
                                    if (!highlightLines.includes(lineNumber))
                                        return null;
                                    return (_jsx("div", { className: "w-full bg-yellow-500/10 border-l-2 border-yellow-500 absolute left-0 right-0", style: {
                                            top: `calc(${index} * var(--code-line-height) + 1rem)`, // 1rem padding top
                                            height: 'var(--code-line-height)',
                                        } }, index));
                                }) })), _jsx("pre", { className: cn('!m-0 !p-4 !bg-transparent font-fira-code relative z-10', wrapText ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'), children: _jsx(MarkdownCodeBlock, { className: `language-${detectedLanguage}`, children: displayedCode }) })] })] }), isFolded && shouldFold && (_jsx("div", { className: cn('absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex items-end justify-center pb-2', 'bg-gradient-to-t from-[#1e1e1e] to-transparent'), children: _jsxs("span", { className: "text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm", children: [lines.length - maxHeight, " more lines..."] }) }))] }));
}
EnhancedCodeBlock.displayName = 'EnhancedCodeBlock';
export function useCodeBlockConfig(options = {}) {
    const { defaultLanguage = 'text', defaultTheme = 'dark', defaultShowLineNumbers = true, defaultEnableFolding = true, defaultMaxHeight = 20, } = options;
    return {
        language: defaultLanguage,
        theme: defaultTheme,
        showLineNumbers: defaultShowLineNumbers,
        enableFolding: defaultEnableFolding,
        maxHeight: defaultMaxHeight,
    };
}
//# sourceMappingURL=enhanced-code-block.js.map