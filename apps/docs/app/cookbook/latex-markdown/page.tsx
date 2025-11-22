import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'LaTeX & Markdown Rendering - Cookbook - Clarity Chat',
  description: 'Enhance markdown responses with KaTeX math, syntax highlighting, and secure HTML rendering.',
}

export default function LatexMarkdownCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <span className="docs-badge">Content</span>
        <h1>LaTeX + Markdown Renderer</h1>
        <p className="docs-lead">
          Render math-heavy answers, code snippets, and tables with a single component. Perfect for education,
          scientific, and financial assistants.
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
          code={`import { MarkdownRendererEnhanced } from '@clarity-chat/react'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/github-dark.css'`}
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

<MarkdownRendererEnhanced
  content={mathHeavyReply}
  enableMath
  enableHighlight
  showLineNumbers
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>4. Custom Elements</h2>
        <CodeBlock
          language="tsx"
          code={`<MarkdownRendererEnhanced
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
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>5. Handle Math Errors</h2>
        <Callout type="warning" title="Graceful Error Handling">
          <p>
            Wrap <code>onMathError</code> to surface broken LaTeX to the user or log to Sentry. Use{' '}
            <code>validateLatex</code> before saving prompts to prevent invalid expressions.
          </p>
        </Callout>
        <CodeBlock
          language="tsx"
          code={`<MarkdownRendererEnhanced
  content={content}
  onMathError={(error, latex) => {
    toast.error('Math failed to render')
    console.warn('Invalid LaTeX', { error, latex })
  }}
/>`}
        />
      </section>
    </div>
  )
}
