import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { ApiTable } from '@/components/Demo/ApiTable';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'MarkdownRendererEnhanced',
    description: 'Render markdown with GitHub-flavored syntax, syntax highlighting, and LaTeX math support.',
};
const props = [
    { name: 'content', type: 'string', required: true, description: 'Markdown source string.' },
    { name: 'enableMath', type: 'boolean', default: 'true', description: 'Enable LaTeX/KaTeX rendering for inline and block math.' },
    { name: 'enableHighlight', type: 'boolean', default: 'true', description: 'Syntax highlighting for code blocks via highlight.js.' },
    { name: 'enableGFM', type: 'boolean', default: 'true', description: 'Enable GitHub Flavored Markdown extensions (tables, strikethrough, task lists).' },
    { name: 'allowHtml', type: 'boolean', default: 'false', description: 'Allow raw HTML in markdown (sanitise externally before enabling).' },
    { name: 'components', type: 'Record<string, React.ComponentType>', description: 'Override rendered elements (e.g., links, headings).' },
    { name: 'className', type: 'string', description: 'Custom class for the wrapper element.' },
    { name: 'showLineNumbers', type: 'boolean', default: 'false', description: 'Display line numbers beside code blocks.' },
    { name: 'enableCodeCopy', type: 'boolean', default: 'true', description: 'Show copy-to-clipboard button on code blocks.' },
    { name: 'onMathError', type: '(error: Error, latex: string) => void', description: 'Callback invoked if KaTeX fails to render a math expression.' },
];
const utilityRows = [
    { name: 'validateLatex(latex)', type: '{ valid: boolean; error?: string }', description: 'Detect unmatched braces/dollar signs before rendering.' },
    { name: 'extractMathExpressions(content)', type: '{ inline: string[]; block: string[] }', description: 'Pull inline and block math expressions from markdown.' },
    { name: 'previewLatex(latex)', type: 'string', description: 'Generate short preview string (placeholder implementation).' },
    { name: 'MATH_EXAMPLES', type: '{ inline: string; block: string; complex: string }', description: 'Starter snippets for demos and testing.' },
];
export default function MarkdownRendererEnhancedPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "MarkdownRendererEnhanced" }), _jsx("p", { className: "lead", children: "Render rich markdown with KaTeX math, syntax highlighting, GitHub-flavored features, copy buttons, and custom component overrides\u2014ideal for technical chat responses and RAG outputs." }), _jsx(Callout, { type: "tip", children: _jsxs("p", { children: ["Import ", _jsx("code", { children: "'katex/dist/katex.min.css'" }), " and your highlight.js theme at app start (already handled when you import the component from ", _jsx("code", { children: "@clarity-chat/react" }), ")."] }) }), _jsx("h2", { id: "import", children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import { MarkdownRendererEnhanced } from '@clarity-chat/react'
import 'katex/dist/katex.min.css'` }), _jsx("h2", { id: "usage", children: "Usage" }), _jsx(CodeBlock, { language: "tsx", title: "Render AI response", code: `import { MarkdownRendererEnhanced } from '@clarity-chat/react'

const content = \`
# Technical Analysis

The quadratic formula is:
\$\$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\$\$

\`\`

export function Response() {
  return (
    <MarkdownRendererEnhanced
      content={content}
      enableMath
      enableHighlight
      showLineNumbers
    />
  )
}` }), _jsx("h2", { id: "custom-components", children: "Custom Components" }), _jsx(CodeBlock, { language: "tsx", code: `<MarkdownRendererEnhanced
  content={content}
  components={{
    a: (props) => (
      <a {...props} className="text-brand-500 hover:underline" target="_blank" rel="noreferrer" />
    ),
    h2: (props) => <h2 {...props} className="mt-8 text-2xl font-semibold" />,
  }}
/>` }), _jsx("h2", { id: "copy-button", children: "Copy Button & Line Numbers" }), _jsx("p", { children: "Enable both features to create docs-style code snippets with header badges. Copy buttons respect clipboard permissions and show success feedback for two seconds." }), _jsx("h2", { id: "math-error-handling", children: "Math Error Handling" }), _jsx(CodeBlock, { language: "tsx", code: `<MarkdownRendererEnhanced
  content={content}
  onMathError={(error, latex) => {
    logger.warn('LaTeX failed to render', { error, latex })
  }}
/>` }), _jsx("h2", { id: "utilities", children: "Utilities" }), _jsx(ApiTable, { data: utilityRows }), _jsx("h2", { id: "props", children: "Props" }), _jsx(ApiTable, { data: props }), _jsx(Pagination, { prev: { href: '/reference/components/conversation-branch-visualizer', title: 'ConversationBranchVisualizer' }, next: { href: '/reference/components/export-dialog', title: 'ExportDialog' } })] }));
}
//# sourceMappingURL=page.js.map