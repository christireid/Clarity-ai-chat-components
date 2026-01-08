'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import ReactMarkdown, {} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@clarity-chat/primitives';
import { CopyButton } from './copy-button';
import { MarkdownCodeBlock } from './markdown-code-block';
import { CodeWindowHeader } from '../code/CodeWindowHeader';
// ============================================================================
// Utility: Extract text from React nodes
// ============================================================================
/**
 * Recursively extracts text content from React nodes.
 * Used to get code string for copy functionality.
 */
function extractTextFromNode(node) {
    if (typeof node === 'string')
        return node;
    if (typeof node === 'number')
        return String(node);
    if (Array.isArray(node))
        return node.map(extractTextFromNode).join('');
    if (React.isValidElement(node)) {
        const nodeProps = node.props;
        if (nodeProps?.children) {
            return extractTextFromNode(nodeProps.children);
        }
    }
    return '';
}
function PreBlock({ children, ...props }) {
    const [wrapText, setWrapText] = React.useState(false);
    // Extract code string from the code element for copy/download
    const codeInfo = React.useMemo(() => {
        let text = '';
        let language = '';
        React.Children.forEach(children, (child) => {
            if (React.isValidElement(child) && child.props) {
                const childProps = child.props;
                // Extract language from className if possible
                const className = childProps.className || '';
                const match = /language-(\w+)/.exec(className);
                if (match)
                    language = match[1];
                text = childProps['data-code-string'] || '';
                if (!text && childProps.children) {
                    text = extractTextFromNode(childProps.children);
                }
            }
        });
        return { text: text.replace(/\n$/, ''), language };
    }, [children]);
    return (_jsxs("div", { className: "relative group/code my-6 rounded-xl border border-border shadow-sm overflow-hidden bg-[#1e1e1e]", children: [_jsx(CodeWindowHeader, { codeString: codeInfo.text, language: codeInfo.language, wrapText: wrapText, onToggleWrap: () => setWrapText(!wrapText), showCopyButton: !!codeInfo.text, theme: "dark" }), _jsx("pre", { className: cn('relative overflow-x-auto !m-0 !p-4 !bg-transparent font-fira-code', wrapText ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'), ...props, children: children })] }));
}
// ============================================================================
// Hook: useMarkdownPlugins
// ============================================================================
/**
 * Returns memoized remark and rehype plugin arrays for react-markdown.
 */
export function useMarkdownPlugins() {
    const remarkPlugins = React.useMemo(() => [remarkGfm], []);
    // Removed rehype-highlight to prevent duplicate highlighting
    // Prism (MarkdownCodeBlock) handles syntax highlighting client-side
    const rehypePlugins = React.useMemo(() => [], []);
    return { remarkPlugins, rehypePlugins };
}
// ============================================================================
// Hook: useMarkdownComponents
// ============================================================================
/**
 * Returns memoized custom component overrides for react-markdown.
 */
export function useMarkdownComponents() {
    return React.useMemo(() => {
        // Create wrapper for memoized code component
        const CodeWrapper = (props) => {
            return _jsx(MarkdownCodeBlock, { ...props });
        };
        return {
            code: CodeWrapper,
            // Custom pre handler
            pre: (props) => _jsx(PreBlock, { ...props }),
            // Paragraphs
            p: ({ children, ...props }) => (_jsx("div", { className: "mb-4 leading-relaxed", ...props, children: children })),
            // Table components
            table: ({ children, ...props }) => (_jsx("div", { className: "overflow-x-auto my-6 rounded-lg border border-border shadow-sm", children: _jsx("table", { className: "min-w-full table-auto border-collapse divide-y divide-border bg-card", ...props, children: children }) })),
            thead: ({ children, ...props }) => (_jsx("thead", { className: "bg-muted/50", ...props, children: children })),
            tbody: ({ children, ...props }) => (_jsx("tbody", { className: "bg-background divide-y divide-border", ...props, children: children })),
            th: ({ children, ...props }) => (_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", ...props, children: children })),
            td: ({ children, ...props }) => (_jsx("td", { className: "px-6 py-4 text-sm border-t border-border/50 text-card-foreground", ...props, children: children })),
            tr: ({ children, ...props }) => (_jsx("tr", { className: "hover:bg-muted/50 transition-colors", ...props, children: children })),
            // Blockquotes
            blockquote: ({ children, ...props }) => (_jsx("blockquote", { className: "border-l-4 border-primary/30 pl-4 my-6 italic text-muted-foreground bg-muted/20 py-2 rounded-r-lg", ...props, children: children })),
            // Links
            a: ({ children, href, ...props }) => (_jsx("a", { href: href, className: "font-medium text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-all", target: href?.startsWith('http') ? '_blank' : undefined, rel: href?.startsWith('http') ? 'noopener noreferrer' : undefined, ...props, children: children })),
        };
    }, []);
}
// ============================================================================
// Component: MessageMarkdownRenderer
// ============================================================================
export function MessageMarkdownRenderer({ content, isStreaming = false, className, }) {
    const { remarkPlugins, rehypePlugins } = useMarkdownPlugins();
    const components = useMarkdownComponents();
    return (_jsxs("div", { className: cn(isStreaming && 'clarity-streaming-text', className), children: [_jsx(ReactMarkdown, { remarkPlugins: remarkPlugins, rehypePlugins: rehypePlugins, components: components, children: content }), isStreaming && (_jsx("span", { "aria-hidden": "true", className: "clarity-streaming-cursor" }))] }));
}
MessageMarkdownRenderer.displayName = 'MessageMarkdownRenderer';
//# sourceMappingURL=markdown-renderer.js.map