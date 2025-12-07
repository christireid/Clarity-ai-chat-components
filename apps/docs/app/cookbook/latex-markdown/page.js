import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'LaTeX & Markdown Rendering - Cookbook - Clarity Chat',
    description: 'Enhance markdown responses with KaTeX math, syntax highlighting, and secure HTML rendering.',
};
export default function LatexMarkdownCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("span", { className: "docs-badge", children: "Content" }), _jsx("h1", { children: "LaTeX + Markdown Renderer" }), _jsx("p", { className: "docs-lead", children: "Render math-heavy answers, code snippets, and tables with a single component. Perfect for education, scientific, and financial assistants." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "1. Install Dependencies" }), _jsx(CodeBlock, { language: "bash", code: `npm install @clarity-chat/react rehype-katex remark-math highlight.js` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "2. Import Component & Styles" }), _jsx(CodeBlock, { language: "tsx", code: `import { MarkdownRendererEnhanced } from '@clarity-chat/react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "3. Render AI Response" }), _jsx(CodeBlock, { language: "tsx", code: `const mathHeavyReply = \`
## Cost Function

The loss function is defined as:

$$
\\mathcal{L}(\\theta) = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - f_\\theta(x_i))^2
$$

### Code Sample

\`\`\`python
def quadratic(a, b, c, x):
    return a * x**2 + b * x + c
\`\`\`
\`

<MarkdownRendererEnhanced
  content={mathHeavyReply}
  enableMath
  enableHighlight
  showLineNumbers
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "4. Custom Elements" }), _jsx(CodeBlock, { language: "tsx", code: `<MarkdownRendererEnhanced
  content={answer}
  components={{
    a: (props) => (
      <a {...props} className="text-brand-500 hover:underline" target="_blank" rel="noreferrer" />
    ),
    table: (props) => (
      <div className="overflow-x-auto my-4">
        <table {...props} className="min-w-full border-collapse border border-border/60" />
      </div>
    ),
  }}
/>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "5. Handle Math Errors" }), _jsx(Callout, { type: "warning", title: "Graceful Error Handling", children: _jsxs("p", { children: ["Wrap ", _jsx("code", { children: "onMathError" }), " to surface broken LaTeX to the user or log to Sentry. Use", ' ', _jsx("code", { children: "validateLatex" }), " before saving prompts to prevent invalid expressions."] }) }), _jsx(CodeBlock, { language: "tsx", code: `<MarkdownRendererEnhanced
  content={content}
  onMathError={(error, latex) => {
    toast.error('Math failed to render')
    console.warn('Invalid LaTeX', { error, latex })
  }}
/>` })] })] }));
}
//# sourceMappingURL=page.js.map