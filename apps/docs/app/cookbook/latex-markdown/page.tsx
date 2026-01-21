import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'LaTeX & Markdown Rendering - Cookbook - Clarity Chat',
  description:
    'Enhance markdown responses with KaTeX math, syntax highlighting, and secure HTML rendering.',
}

export default function LatexMarkdownCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <span className="docs-badge">Content</span>
        <h1>LaTeX + Markdown Renderer</h1>
        <p className="docs-lead">
          Render math-heavy answers, code snippets, and tables with a single
          component. Perfect for education, scientific, and financial
          assistants.
        </p>
      </div>

      <section className="docs-section">
        <h2>1. Install Dependencies</h2>
        <CodeBlock
          language="bash"
          code={`npm install @clarity-chat/react rehype-katex remark-math highlight.js`}
        />
      </section>

      <section className="docs-section">
        <h2>2. Import Component & Styles</h2>
        <CodeBlock
          language="tsx"
          code={`import { EnhancedMarkdownRenderer } from '@clarity-chat/react'
import 'katex/dist/katex.min.css'`}
        />
      </section>

      <section className="docs-section">
        <h2>3. Render AI Response</h2>
        <CodeBlock
          language="tsx"
          code={`const mathHeavyReply = \`
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

<EnhancedMarkdownRenderer
  content={mathHeavyReply}
  config={{
    enableKaTeX: true,
    enableSyntaxHighlight: true,
    codeTheme: 'dark'
  }}
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>4. Custom Elements</h2>
        <CodeBlock
          language="tsx"
          code={`<EnhancedMarkdownRenderer
  content={answer}
  config={{
    enableKaTeX: true,
    enableSyntaxHighlight: true,
    // Custom styling via className
    className: 'my-markdown-content'
  }}
/>

// For custom link styling, wrap the component:
<div className="markdown-wrapper">
  <EnhancedMarkdownRenderer
    content={answer}
    config={{ enableKaTeX: true }}
  />
  <style jsx>{\`
    .markdown-wrapper :global(a) {
      @apply text-brand-500 hover:underline;
    }
    .markdown-wrapper :global(table) {
      @apply overflow-x-auto my-4 min-w-full border-collapse border border-border/60;
    }
  \`}</style>
</div>`}
        />
      </section>

      <section className="docs-section">
        <h2>5. Handle Math Errors</h2>
        <Callout type="warning" title="Graceful Error Handling">
          <p>
            Wrap <code>onMathError</code> to surface broken LaTeX to the user or
            log to Sentry. Use <code>validateLatex</code> before saving prompts
            to prevent invalid expressions.
          </p>
        </Callout>
        <CodeBlock
          language="tsx"
          code={`<EnhancedMarkdownRenderer
  content={content}
  config={{
    enableKaTeX: true,
    // Math errors are automatically handled with error boundaries
    // and logged via analytics
  }}
/>`}
        />
      </section>
    </div>
  )
}
