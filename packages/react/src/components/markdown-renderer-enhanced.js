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
import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { cn } from '@clarity-chat/primitives';
// Import KaTeX CSS
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';
// ============================================================================
// Custom Components
// ============================================================================
/**
 * Enhanced code block with copy button and line numbers
 */
function CodeBlock({ inline, className, children, showLineNumbers = false, enableCopy = true, ...props }) {
    const [copied, setCopied] = React.useState(false);
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error('Failed to copy code:', err);
        }
    };
    if (inline) {
        return (_jsx("code", { className: cn('px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono', className), ...props, children: children }));
    }
    const lines = code.split('\n');
    return (_jsxs("div", { className: "relative group my-4", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg", children: [language && (_jsx("span", { className: "text-xs font-semibold text-gray-300 uppercase", children: language })), enableCopy && (_jsx("button", { onClick: handleCopy, className: cn('px-3 py-1 text-xs font-medium rounded transition-colors', copied
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'), "aria-label": "Copy code", children: copied ? '✓ Copied!' : 'Copy' }))] }), _jsx("pre", { className: "!mt-0 !rounded-t-none overflow-x-auto", children: _jsx("code", { className: className, ...props, children: showLineNumbers ? (_jsx("table", { className: "w-full", children: _jsx("tbody", { children: lines.map((line, i) => (_jsxs("tr", { children: [_jsx("td", { className: "pr-4 text-right text-gray-500 select-none border-r border-gray-700", children: i + 1 }), _jsx("td", { className: "pl-4", children: line || '\n' })] }, i))) }) })) : (children) }) })] }));
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
        if (enableHighlight)
            plugins.push(rehypeHighlight);
        if (enableMath)
            plugins.push(rehypeKatex);
        return plugins;
    }, [allowHtml, enableHighlight, enableMath]);
    // Custom component overrides
    const components = useMemo(() => ({
        code: (props) => (_jsx(CodeBlock, { ...props, showLineNumbers: showLineNumbers, enableCopy: enableCodeCopy })),
        // Table styling
        table: ({ children, ...props }) => (_jsx("div", { className: "overflow-x-auto my-4", children: _jsx("table", { className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700", ...props, children: children }) })),
        thead: ({ children, ...props }) => (_jsx("thead", { className: "bg-gray-50 dark:bg-gray-800", ...props, children: children })),
        th: ({ children, ...props }) => (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", ...props, children: children })),
        td: ({ children, ...props }) => (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100", ...props, children: children })),
        // Link styling
        a: ({ children, href, ...props }) => (_jsx("a", { href: href, className: "text-blue-600 dark:text-blue-400 hover:underline", target: href?.startsWith('http') ? '_blank' : undefined, rel: href?.startsWith('http') ? 'noopener noreferrer' : undefined, ...props, children: children })),
        // Blockquote styling
        blockquote: ({ children, ...props }) => (_jsx("blockquote", { className: "border-l-4 border-gray-300 dark:border-gray-700 pl-4 my-4 italic text-gray-700 dark:text-gray-300", ...props, children: children })),
        // Heading IDs for anchor links
        h1: ({ children, ...props }) => (_jsx("h1", { className: "text-3xl font-bold mt-6 mb-4", ...props, children: children })),
        h2: ({ children, ...props }) => (_jsx("h2", { className: "text-2xl font-bold mt-5 mb-3", ...props, children: children })),
        h3: ({ children, ...props }) => (_jsx("h3", { className: "text-xl font-bold mt-4 mb-2", ...props, children: children })),
        // Merge custom components
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