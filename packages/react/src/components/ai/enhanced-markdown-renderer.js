'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
// rehypeHighlight is now loaded async (react-markdown v10 feature)
import remarkGfm from 'remark-gfm';
import { cn } from '@clarity-chat/primitives';
export const EnhancedMarkdownRenderer = React.memo(function EnhancedMarkdownRenderer({ content, config = {}, isStreaming = false, }) {
    const { enableKaTeX = false, enableMermaid = false, enableSyntaxHighlight = true, className, codeTheme = 'light', } = config;
    const containerRef = React.useRef(null);
    const mermaidInitialized = React.useRef(false);
    // Initialize Mermaid after component mounts
    React.useEffect(() => {
        if (enableMermaid && !mermaidInitialized.current && typeof window !== 'undefined') {
            // Dynamically import mermaid only if needed
            // mermaid is an optional peer dependency
            import('mermaid').then((mermaid) => {
                mermaid.default.initialize({
                    startOnLoad: false,
                    theme: codeTheme === 'dark' ? 'dark' : 'default',
                    securityLevel: 'loose',
                    // Mermaid v11: Suppress error rendering to avoid inserting 'Syntax error' message to DOM
                    // This allows us to handle errors gracefully in our UI
                    suppressErrorRendering: true,
                });
                mermaidInitialized.current = true;
                // Render any existing mermaid diagrams
                if (containerRef.current) {
                    mermaid.default.run({
                        nodes: containerRef.current.querySelectorAll('.language-mermaid'),
                    });
                }
            }).catch((err) => {
                console.warn('Failed to load Mermaid:', err);
            });
        }
    }, [enableMermaid, codeTheme]);
    // Render Mermaid diagrams after content updates
    // Mermaid v11: Improved error handling with suppressErrorRendering
    React.useEffect(() => {
        if (enableMermaid && mermaidInitialized.current && containerRef.current) {
            // mermaid is an optional peer dependency
            import('mermaid').then((mermaid) => {
                const mermaidElements = containerRef.current?.querySelectorAll('.language-mermaid');
                if (mermaidElements && mermaidElements.length > 0) {
                    try {
                        mermaid.default.run({
                            nodes: Array.from(mermaidElements),
                        });
                    }
                    catch (error) {
                        // With suppressErrorRendering: true, errors won't be inserted into DOM
                        // We can handle them gracefully here
                        console.warn('Mermaid rendering error (handled gracefully):', error);
                    }
                }
            }).catch(() => {
                // Silently fail if mermaid not available
            });
        }
    }, [content, enableMermaid]);
    // Build rehype plugins list
    // react-markdown v10 supports async plugins - use async loading for heavy plugins
    const rehypePlugins = [];
    if (enableSyntaxHighlight) {
        // Async plugin loading for rehypeHighlight (heavy dependency)
        // Improves initial bundle size by deferring syntax highlighter loading
        rehypePlugins.push(async () => {
            const { default: rehypeHighlight } = await import('rehype-highlight');
            return rehypeHighlight;
        });
    }
    // Add KaTeX plugin if enabled
    if (enableKaTeX) {
        rehypePlugins.push([
            // We'll use a custom plugin for KaTeX
            () => {
                return (tree) => {
                    // Transform math nodes for KaTeX rendering
                    // This is a placeholder - actual implementation would use
                    // rehype-katex or similar
                    return tree;
                };
            },
        ]);
    }
    return (_jsxs("div", { ref: containerRef, className: cn('prose prose-sm max-w-none', 'prose-headings:font-semibold', 'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded', 'prose-pre:bg-muted prose-pre:border', codeTheme === 'dark' && 'prose-invert', isStreaming && 'animate-pulse', className), children: [_jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: rehypePlugins, components: {
                    // Custom code block rendering for Mermaid
                    code({ node: _node, inline: _inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const language = match ? match[1] : '';
                        const codeString = String(children).replace(/\n$/, '');
                        if (language === 'mermaid' && enableMermaid) {
                            return (_jsx("div", { className: "mermaid-container my-4 p-4 bg-muted rounded-lg overflow-x-auto", children: _jsx("pre", { className: "language-mermaid m-0 bg-transparent", children: _jsx("code", { className: "language-mermaid", children: codeString }) }) }));
                        }
                        return (_jsx("code", { className: className, ...props, children: children }));
                    },
                    // Custom math rendering for KaTeX
                    p({ children, ...props }) {
                        // Check if paragraph contains math delimiters
                        const content = React.Children.toArray(children).join('');
                        if (enableKaTeX && (content.includes('$$') || content.includes('\\('))) {
                            // Would render with KaTeX here
                            // For now, return standard paragraph
                        }
                        return _jsx("p", { ...props, children: children });
                    },
                    // Table styling
                    table: ({ children, ...props }) => (_jsx("div", { className: "overflow-x-auto my-4 w-full", children: _jsx("table", { className: "min-w-full table-auto border-collapse divide-y divide-border", ...props, children: children }) })),
                    thead: ({ children, ...props }) => (_jsx("thead", { className: "bg-muted", ...props, children: children })),
                    tbody: ({ children, ...props }) => (_jsx("tbody", { className: "bg-background divide-y divide-border", ...props, children: children })),
                    th: ({ children, ...props }) => (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border", ...props, children: children })),
                    td: ({ children, ...props }) => (_jsx("td", { className: "px-6 py-4 text-sm border border-border", ...props, children: children })),
                    tr: ({ children, ...props }) => (_jsx("tr", { className: "hover:bg-muted/50 transition-colors", ...props, children: children })),
                }, children: content }), enableKaTeX && (_jsx("link", { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css", crossOrigin: "anonymous" }))] }));
});
/**
 * Hook to detect if content contains math or diagrams
 */
export function useMarkdownFeatures(content) {
    return React.useMemo(() => {
        const hasMath = /(\$\$|\\\(|\\\[|\\begin\{)/.test(content);
        const hasMermaid = /```mermaid|```\s*mermaid/.test(content);
        const hasCodeBlocks = /```/.test(content);
        return {
            hasMath,
            hasMermaid,
            hasCodeBlocks,
            needsEnhancedRendering: hasMath || hasMermaid,
        };
    }, [content]);
}
//# sourceMappingURL=enhanced-markdown-renderer.js.map