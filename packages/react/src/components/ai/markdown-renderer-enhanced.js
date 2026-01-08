/**
 * Enhanced Markdown Renderer with LaTeX/Math Support
 *
 * Extends the existing markdown renderer to support LaTeX mathematical
 * expressions using KaTeX.
 *
 * @blueprint Feature 1.6 - LaTeX/Math Rendering
 * @priority MEDIUM
 * @status NEW - Enhancement based on blueprint analysis
 */
'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { cn } from '@clarity-chat/primitives';
import { CopyButton } from '../message/copy-button';
import { DownloadIcon, WrapTextIcon } from '../ui/icons';
import { CodeWindowHeader } from '../code/CodeWindowHeader';
import { MarkdownCodeBlock } from '../message/markdown-code-block';
// Import KaTeX CSS
import 'katex/dist/katex.min.css';
// ============================================================================
// Custom Components
// ============================================================================
/**
 * Recursively extracts text content from React nodes.
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
function CodeBlock({ inline, className, children, showLineNumbers = false, enableCopy = true, ...props }) {
    const [wrapText, setWrapText] = useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    // Extract clean text for copy/download
    const codeText = useMemo(() => extractTextFromNode(children).replace(/\n$/, ''), [children]);
    if (inline) {
        return (_jsx("code", { className: cn('px-1.5 py-0.5 rounded-md bg-muted text-sm font-mono text-pink-500 dark:text-pink-400', className), ...props, children: children }));
    }
    const lineCount = codeText.split('\n').length;
    return (_jsxs("div", { className: "relative group my-6 rounded-xl overflow-hidden border border-border shadow-sm", children: [_jsx(CodeWindowHeader, { codeString: codeText, language: language, wrapText: wrapText, onToggleWrap: () => setWrapText(!wrapText), showCopyButton: enableCopy, theme: "dark" // Always dark for code blocks in this renderer
             }), _jsx("div", { className: "relative bg-[#1e1e1e] dark:bg-[#1e1e1e] bg-slate-950", children: _jsxs("div", { className: "flex", children: [showLineNumbers && (_jsx("div", { className: "flex-none py-4 px-3 text-right select-none border-r border-white/10 bg-white/5 text-[#858585] text-xs font-mono min-w-[3rem]", children: Array.from({ length: lineCount }).map((_, i) => (_jsx("div", { className: "leading-6 h-6", children: i + 1 }, i))) })), _jsx("pre", { className: cn('!m-0 !p-4 !bg-transparent overflow-x-auto flex-1 font-fira-code', wrapText ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'), children: _jsx(MarkdownCodeBlock, { className: className, style: { lineHeight: '1.5rem', fontSize: '14px' }, children: children }) })] }) })] }));
}
/**
 * Enhanced math block with error handling
 */
function MathBlock({ value, onError, }) {
    const [hasError, setHasError] = React.useState(false);
    React.useEffect(() => {
        setHasError(false);
    }, [value]);
    if (hasError) {
        return (_jsxs("div", { className: "my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded", children: [_jsx("div", { className: "text-sm font-semibold text-red-800 dark:text-red-200 mb-2", children: "LaTeX Rendering Error" }), _jsx("code", { className: "text-xs text-red-600 dark:text-red-300 font-mono", children: value })] }));
    }
    return (_jsx("div", { className: "math-block my-4 overflow-x-auto", onError: (e) => {
            const error = new Error('LaTeX rendering failed');
            setHasError(true);
            onError?.(error, value);
        } }));
}
// ============================================================================
// Main Component
// ============================================================================
export function MarkdownRendererEnhanced({ content, enableMath = true, enableHighlight = true, enableGFM = true, allowHtml = false, components: customComponents, className, showLineNumbers = false, enableCodeCopy = true, onMathError, }) {
    // Build remark plugins list
    const remarkPlugins = useMemo(() => {
        const plugins = [];
        if (enableGFM)
            plugins.push(remarkGfm);
        if (enableMath)
            plugins.push(remarkMath);
        return plugins;
    }, [enableGFM, enableMath]);
    // Build rehype plugins list
    const rehypePlugins = useMemo(() => {
        const plugins = [];
        if (allowHtml)
            plugins.push(rehypeRaw);
        if (enableMath)
            plugins.push(rehypeKatex);
        // Removed rehypeHighlight to avoid conflicts
        return plugins;
    }, [allowHtml, enableMath]);
    // Custom component overrides
    const components = useMemo(() => ({
        code: ({ className, children, inline, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : undefined;
            if (inline || !language) {
                return (_jsx("code", { className: cn('px-1.5 py-0.5 rounded-md bg-muted text-sm font-mono text-pink-500 dark:text-pink-400', className), ...props, children: children }));
            }
            return (_jsx(CodeBlock, { className: className, showLineNumbers: showLineNumbers, enableCopy: enableCodeCopy, children: children }));
        },
        // Table styling
        table: ({ children, ...props }) => (_jsx("div", { className: "overflow-x-auto my-6 rounded-lg border border-border shadow-sm", children: _jsx("table", { className: "min-w-full divide-y divide-border bg-card", ...props, children: children }) })),
        thead: ({ children, ...props }) => (_jsx("thead", { className: "bg-muted/50", ...props, children: children })),
        th: ({ children, ...props }) => (_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", ...props, children: children })),
        td: ({ children, ...props }) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-card-foreground border-t border-border/50", ...props, children: children })),
        // Link styling
        a: ({ children, href, ...props }) => (_jsx("a", { href: href, className: "font-medium text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary transition-all", target: href?.startsWith('http') ? '_blank' : undefined, rel: href?.startsWith('http') ? 'noopener noreferrer' : undefined, ...props, children: children })),
        // Blockquote styling
        blockquote: ({ children, ...props }) => (_jsx("blockquote", { className: "border-l-4 border-primary/30 pl-4 my-6 italic text-muted-foreground bg-muted/20 py-2 rounded-r-lg", ...props, children: children })),
        // Heading styling
        h1: ({ children, ...props }) => (_jsx("h1", { className: "text-3xl font-bold mt-8 mb-4 tracking-tight text-foreground border-b pb-2 border-border", ...props, children: children })),
        h2: ({ children, ...props }) => (_jsx("h2", { className: "text-2xl font-bold mt-8 mb-4 tracking-tight text-foreground", ...props, children: children })),
        h3: ({ children, ...props }) => (_jsx("h3", { className: "text-xl font-semibold mt-6 mb-3 tracking-tight text-foreground", ...props, children: children })),
        // List styling
        ul: ({ children, ...props }) => (_jsx("ul", { className: "list-disc list-outside ml-6 my-4 text-foreground/90 space-y-1", ...props, children: children })),
        ol: ({ children, ...props }) => (_jsx("ol", { className: "list-decimal list-outside ml-6 my-4 text-foreground/90 space-y-1", ...props, children: children })),
        li: ({ children, ...props }) => (_jsx("li", { className: "pl-1", ...props, children: children })),
        // Horizontal Rule
        hr: ({ ...props }) => (_jsx("hr", { className: "my-8 border-border", ...props })),
        ...customComponents,
    }), [showLineNumbers, enableCodeCopy, customComponents]);
    return (_jsx("div", { className: cn('markdown-content prose dark:prose-invert max-w-none', className), children: _jsx(ReactMarkdown, { remarkPlugins: remarkPlugins, rehypePlugins: rehypePlugins, components: components, children: content }) }));
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Validates LaTeX syntax before rendering
 */
export function validateLatex(latex) {
    // Basic validation - check for common issues
    const issues = [];
    // Check for unmatched braces
    const openBraces = (latex.match(/{/g) || []).length;
    const closeBraces = (latex.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
        issues.push('Unmatched braces');
    }
    // Check for unmatched dollar signs
    const dollarSigns = (latex.match(/\$/g) || []).length;
    if (dollarSigns % 2 !== 0) {
        issues.push('Unmatched dollar signs');
    }
    return {
        valid: issues.length === 0,
        error: issues.length > 0 ? issues.join(', ') : undefined,
    };
}
/**
 * Extracts all math expressions from markdown content
 */
export function extractMathExpressions(content) {
    const inline = [];
    const block = [];
    // Extract inline math ($...$)
    const inlineRegex = /\$(?!\$)(.*?)\$/g;
    let match;
    while ((match = inlineRegex.exec(content)) !== null) {
        const mathContent = match[1];
        if (mathContent)
            inline.push(mathContent);
    }
    // Extract block math ($$...$$)
    const blockRegex = /\$\$(.*?)\$\$/gs;
    while ((match = blockRegex.exec(content)) !== null) {
        const mathContent = match[1];
        if (mathContent)
            block.push(mathContent);
    }
    return { inline, block };
}
/**
 * Preview LaTeX rendering
 */
export function previewLatex(latex) {
    // This would use KaTeX to render to string
    // For now, return placeholder
    return `[Math: ${latex.substring(0, 50)}...]`;
}
// ============================================================================
// Example Usage
// ============================================================================
export const MATH_EXAMPLES = {
    inline: 'The equation $E = mc^2$ is famous.',
    block: `
The quadratic formula is:

$$
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$
`,
    complex: `
# Mathematical Examples

## Calculus

The derivative of $f(x) = x^2$ is:

$$
f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h} = 2x
$$

## Linear Algebra

Matrix multiplication:

$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
\\begin{bmatrix}
e & f \\\\
g & h
\\end{bmatrix}
=
\\begin{bmatrix}
ae + bg & af + bh \\\\
ce + dg & cf + dh
\\end{bmatrix}
$$

## Statistics

The normal distribution:

$$
f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}\\left(\\frac{x-\\mu}{\\sigma}\\right)^2}
$$
`,
};
export default MarkdownRendererEnhanced;
//# sourceMappingURL=markdown-renderer-enhanced.js.map