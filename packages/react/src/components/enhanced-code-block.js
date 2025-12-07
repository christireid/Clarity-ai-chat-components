'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from 'react';
import { Button, cn } from '@clarity-chat/primitives';
import { CopyButton } from './copy-button';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
export function EnhancedCodeBlock({ code, language = 'text', showLineNumbers = true, enableFolding = true, initiallyFolded = false, theme = 'dark', maxHeight = 20, showCopyButton = true, className, filename, highlightLines = [], startLineNumber = 1, }) {
    const [isFolded, setIsFolded] = React.useState(initiallyFolded);
    const [hoveredLine, setHoveredLine] = React.useState(null);
    const lines = code.split('\n');
    const shouldFold = enableFolding && lines.length > maxHeight;
    const displayLines = isFolded && shouldFold ? lines.slice(0, maxHeight) : lines;
    // Detect language from code if not provided
    const detectedLanguage = React.useMemo(() => {
        if (language && language !== 'text')
            return language;
        // Simple language detection based on common patterns
        if (code.includes('function') && code.includes('=>'))
            return 'javascript';
        if (code.includes('def ') && code.includes('import '))
            return 'python';
        if (code.includes('interface') || code.includes('type '))
            return 'typescript';
        if (code.includes('class ') && code.includes('public '))
            return 'java';
        if (code.includes('<?php'))
            return 'php';
        if (code.includes('def ') && !code.includes('import '))
            return 'ruby';
        return 'text';
    }, [code, language]);
    const handleToggleFold = () => {
        setIsFolded(!isFolded);
    };
    const getLineClassName = (lineNumber) => {
        return cn('px-4 py-0.5 text-sm font-mono', highlightLines.includes(lineNumber) && 'bg-yellow-500/20', hoveredLine === lineNumber && 'bg-muted/50');
    };
    return (_jsxs("div", { className: cn('relative rounded-lg border overflow-hidden', theme === 'dark' && 'bg-[#1e1e1e] border-border', theme === 'light' && 'bg-[#ffffff] border-border', className), children: [(filename || showCopyButton || shouldFold) && (_jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-b bg-muted/30", children: [_jsxs("div", { className: "flex items-center gap-2", children: [filename && (_jsx("span", { className: "text-xs font-medium text-muted-foreground", children: filename })), detectedLanguage && detectedLanguage !== 'text' && (_jsx("span", { className: "text-xs px-2 py-0.5 rounded bg-background text-muted-foreground", children: detectedLanguage }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [shouldFold && (_jsx(Button, { variant: "ghost", size: "sm", onClick: handleToggleFold, className: "h-7 text-xs", children: isFolded ? (_jsxs(_Fragment, { children: [_jsx(ChevronDownIcon, { className: "h-3 w-3 mr-1" }), "Show ", lines.length - maxHeight, " more lines"] })) : (_jsxs(_Fragment, { children: [_jsx(ChevronUpIcon, { className: "h-3 w-3 mr-1" }), "Show less"] })) })), showCopyButton && (_jsx(CopyButton, { text: code, iconOnly: true, className: "h-7 w-7" }))] })] })), _jsx("div", { className: "relative overflow-x-auto", children: _jsx("pre", { className: cn('m-0 p-0', theme === 'dark' && 'text-[#d4d4d4]', theme === 'light' && 'text-[#24292e]'), children: _jsx("code", { className: cn('block', `language-${detectedLanguage}`), children: showLineNumbers ? (_jsxs("div", { className: "flex", children: [_jsx("div", { className: cn('select-none text-right pr-4 py-2 text-xs', theme === 'dark' ? 'text-[#858585]' : 'text-[#6a737d]', 'border-r border-border/50 bg-muted/20'), children: displayLines.map((_, index) => {
                                        const lineNumber = startLineNumber + index;
                                        return (_jsx("div", { className: "leading-relaxed", onMouseEnter: () => setHoveredLine(lineNumber), onMouseLeave: () => setHoveredLine(null), children: lineNumber }, index));
                                    }) }), _jsx("div", { className: "flex-1 min-w-0", children: displayLines.map((line, index) => {
                                        const lineNumber = startLineNumber + index;
                                        return (_jsxs("div", { className: getLineClassName(lineNumber), onMouseEnter: () => setHoveredLine(lineNumber), onMouseLeave: () => setHoveredLine(null), children: [line || '\u00A0', " "] }, index));
                                    }) })] })) : (_jsx("div", { className: "px-4 py-2", children: displayLines.map((line, index) => (_jsx("div", { className: getLineClassName(startLineNumber + index), children: line || '\u00A0' }, index))) })) }) }) }), isFolded && shouldFold && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" }))] }));
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