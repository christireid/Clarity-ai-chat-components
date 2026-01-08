'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { logger } from '@clarity-chat/utils/logger';
import * as React from 'react';
import { codeToHtml } from 'shiki';
import { cn } from '../../utils/cn';
import { parseLineRanges, escapeHtml, normalizeLanguage, detectLanguage, countLines, } from './utils';
import { sanitizeCodeHtml } from '../../utils/security/sanitize-html';
import { CODE_THEMES, DEFAULT_DARK_THEME } from './themes';
import { LineNumbers } from './LineNumbers';
import { CodeBlockHeader } from './CodeBlockHeader';
import { CodeBlockCopyButton } from './CodeBlockCopyButton';
import { ChevronDownIcon, ChevronUpIcon } from '../ui/icons';
/**
 * Get Shiki theme from theme name
 */
function getShikiTheme(theme) {
    if (theme in CODE_THEMES) {
        return CODE_THEMES[theme].shikiTheme;
    }
    return theme;
}
/**
 * CodeBlock Component
 *
 * World-class code display component with Shiki-powered syntax highlighting.
 *
 * Features:
 * - Shiki syntax highlighting (VS Code engine)
 * - 15+ popular themes (Material, Night Owl, GitHub, etc.)
 * - Line numbers (toggleable)
 * - Line highlighting with ranges
 * - Diff visualization (added/removed lines)
 * - Animated copy button with feedback
 * - Expand/collapse for long blocks
 * - Premium fonts with ligature support
 * - WCAG 2.1 AA accessible
 * - Keyboard navigable
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="typescript"
 *   theme="github-dark"
 *   title="example.ts"
 *   showLineNumbers
 *   highlightLines="2,5-7"
 * >
 * {`const greeting = "Hello, World!"
 * logger.debug(greeting)`}
 * </CodeBlock>
 * ```
 */
export const CodeBlock = React.memo(function CodeBlock({ children, language: rawLanguage, theme = DEFAULT_DARK_THEME, showLineNumbers = false, startingLineNumber = 1, highlightLines, addedLines, removedLines, title, showCopyButton = true, showLanguageBadge = true, maxHeight, wordWrap = false, fontFamily = 'fira-code', enableLigatures = true, className, onCopy, autoDetectLanguage = true, }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [highlightedHtml, setHighlightedHtml] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const codeRef = React.useRef(null);
    // Normalize code content
    const code = React.useMemo(() => children.trim(), [children]);
    const lineCount = React.useMemo(() => countLines(code), [code]);
    // Determine language
    const language = React.useMemo(() => {
        if (rawLanguage) {
            return normalizeLanguage(rawLanguage);
        }
        if (autoDetectLanguage) {
            return detectLanguage(code);
        }
        return 'text';
    }, [rawLanguage, code, autoDetectLanguage]);
    // Parse highlight ranges
    const highlightedLineSet = React.useMemo(() => parseLineRanges(highlightLines), [highlightLines]);
    const addedLineSet = React.useMemo(() => parseLineRanges(addedLines), [addedLines]);
    const removedLineSet = React.useMemo(() => parseLineRanges(removedLines), [removedLines]);
    // Get Shiki theme
    const shikiTheme = React.useMemo(() => getShikiTheme(theme), [theme]);
    // Highlight code with Shiki
    React.useEffect(() => {
        let cancelled = false;
        async function highlight() {
            setIsLoading(true);
            setError(null);
            try {
                const html = await codeToHtml(code, {
                    lang: language,
                    theme: shikiTheme,
                    transformers: [
                        {
                            line(node, line) {
                                // Add data attribute for line number
                                node.properties = node.properties || {};
                                node.properties['data-line'] = line;
                                // Add highlighting classes
                                const classList = ['code-line'];
                                if (highlightedLineSet.has(line)) {
                                    classList.push('highlighted');
                                }
                                if (addedLineSet.has(line)) {
                                    classList.push('diff-add');
                                }
                                if (removedLineSet.has(line)) {
                                    classList.push('diff-remove');
                                }
                                node.properties.class = classList.join(' ');
                            },
                        },
                    ],
                });
                if (!cancelled) {
                    setHighlightedHtml(html);
                    setIsLoading(false);
                }
            }
            catch (err) {
                logger.error('Shiki highlighting failed:', err);
                if (!cancelled) {
                    setError(err instanceof Error ? err : new Error('Highlighting failed'));
                    // Fallback to plain text
                    setHighlightedHtml(`<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`);
                    setIsLoading(false);
                }
            }
        }
        highlight();
        return () => {
            cancelled = true;
        };
    }, [
        code,
        language,
        shikiTheme,
        highlightedLineSet,
        addedLineSet,
        removedLineSet,
    ]);
    // Font classes
    const fontClass = {
        'fira-code': 'font-fira-code',
        'jetbrains-mono': 'font-jetbrains-mono',
        'source-code-pro': 'font-source-code-pro',
        system: 'font-mono',
    }[fontFamily];
    // Determine if we should show expand/collapse
    const shouldShowExpand = maxHeight && lineCount > 10;
    // Get theme type for styling
    const themeType = theme in CODE_THEMES ? CODE_THEMES[theme].type : 'dark';
    return (_jsxs("div", { className: cn('code-block group relative rounded-lg border overflow-hidden', 'border-border bg-card', themeType === 'dark' && 'dark', className), "data-theme": theme, "data-language": language, children: [_jsx(CodeBlockHeader, { title: title, language: language, showLanguageBadge: showLanguageBadge, children: showCopyButton && (_jsx(CodeBlockCopyButton, { content: code, onCopy: onCopy, className: cn('opacity-0 group-hover:opacity-100', 'focus-visible:opacity-100', 'transition-opacity duration-200') })) }), _jsxs("div", { ref: codeRef, className: cn('relative overflow-auto', maxHeight && !isExpanded && 'overflow-hidden'), style: maxHeight && !isExpanded ? { maxHeight } : undefined, children: [_jsxs("div", { className: "flex", children: [showLineNumbers && (_jsx(LineNumbers, { count: lineCount, startFrom: startingLineNumber, highlightedLines: highlightedLineSet, addedLines: addedLineSet, removedLines: removedLineSet })), _jsx("div", { className: cn('flex-1 p-4 overflow-x-auto', 'text-sm leading-relaxed', fontClass, enableLigatures && 'font-ligatures', wordWrap && 'whitespace-pre-wrap break-words', isLoading && 'animate-pulse'), tabIndex: 0, role: "region", "aria-label": `Code block${title ? `: ${title}` : ''}${language !== 'text' ? ` (${language})` : ''}`, 
                                // SECURITY: Sanitize HTML output from syntax highlighter to prevent XSS
                                dangerouslySetInnerHTML: {
                                    __html: sanitizeCodeHtml(highlightedHtml),
                                } })] }), shouldShowExpand && !isExpanded && (_jsx("div", { className: cn('absolute bottom-0 left-0 right-0 h-16', 'bg-gradient-to-t from-card to-transparent', 'pointer-events-none'), "aria-hidden": "true" }))] }), shouldShowExpand && (_jsx("button", { type: "button", onClick: () => setIsExpanded(!isExpanded), className: cn('w-full py-2 px-4', 'flex items-center justify-center gap-1', 'text-sm text-muted-foreground', 'hover:text-foreground hover:bg-muted/50', 'transition-colors duration-200', 'border-t border-border/50', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset'), "aria-expanded": isExpanded, "aria-controls": "code-content", children: isExpanded ? (_jsxs(_Fragment, { children: [_jsx(ChevronUpIcon, { className: "h-4 w-4", size: 16 }), _jsx("span", { children: "Show less" })] })) : (_jsxs(_Fragment, { children: [_jsx(ChevronDownIcon, { className: "h-4 w-4", size: 16 }), _jsxs("span", { children: ["Show all ", lineCount, " lines"] })] })) })), error && process.env.NODE_ENV === 'development' && (_jsx("div", { className: "absolute top-0 right-0 p-1", children: _jsx("span", { className: "text-xs text-red-500", title: error.message, children: "\u26A0" }) }))] }));
});
CodeBlock.displayName = 'CodeBlock';
export default CodeBlock;
//# sourceMappingURL=CodeBlock.js.map