import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'MarkdownRendererEnhanced',
  description:
    'Render markdown with GitHub-flavored syntax, syntax highlighting, and LaTeX math support.',
}

const props = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Markdown source string.',
  },
  {
    name: 'enableMath',
    type: 'boolean',
    default: 'true',
    description: 'Enable LaTeX/KaTeX rendering for inline and block math.',
  },
  {
    name: 'enableHighlight',
    type: 'boolean',
    default: 'true',
    description: 'Syntax highlighting for code blocks via highlight.js.',
  },
  {
    name: 'enableGFM',
    type: 'boolean',
    default: 'true',
    description:
      'Enable GitHub Flavored Markdown extensions (tables, strikethrough, task lists).',
  },
  {
    name: 'allowHtml',
    type: 'boolean',
    default: 'false',
    description:
      'Allow raw HTML in markdown (sanitise externally before enabling).',
  },
  {
    name: 'components',
    type: 'Record<string, React.ComponentType>',
    description: 'Override rendered elements (e.g., links, headings).',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom class for the wrapper element.',
  },
  {
    name: 'showLineNumbers',
    type: 'boolean',
    default: 'false',
    description: 'Display line numbers beside code blocks.',
  },
  {
    name: 'enableCodeCopy',
    type: 'boolean',
    default: 'true',
    description: 'Show copy-to-clipboard button on code blocks.',
  },
  {
    name: 'onMathError',
    type: '(error: Error, latex: string) => void',
    description: 'Callback invoked if KaTeX fails to render a math expression.',
  },
]

const utilityRows = [
  {
    name: 'validateLatex(latex)',
    type: '{ valid: boolean; error?: string }',
    description: 'Detect unmatched braces/dollar signs before rendering.',
  },
  {
    name: 'extractMathExpressions(content)',
    type: '{ inline: string[]; block: string[] }',
    description: 'Pull inline and block math expressions from markdown.',
  },
  {
    name: 'previewLatex(latex)',
    type: 'string',
    description: 'Generate short preview string (placeholder implementation).',
  },
  {
    name: 'MATH_EXAMPLES',
    type: '{ inline: string; block: string; complex: string }',
    description: 'Starter snippets for demos and testing.',
  },
]

export default function MarkdownRendererEnhancedPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>MarkdownRendererEnhanced</h1>
      <p className="lead">
        Render rich markdown with KaTeX math, syntax highlighting,
        GitHub-flavored features, copy buttons, and custom component
        overrides—ideal for technical chat responses and RAG outputs.
      </p>

      <Callout type="tip">
        <p>
          Import <code>'katex/dist/katex.min.css'</code> and your highlight.js
          theme at app start (already handled when you import the component from{' '}
          <code>@clarity-chat/react</code>).
        </p>
      </Callout>

      <h2 id="import">Import</h2>
      <CodeBlock
        language="tsx"
        code={`import { MarkdownRendererEnhanced } from '@clarity-chat/react/internal'
import 'katex/dist/katex.min.css'`}
      />

      <h2 id="usage">Usage</h2>
      <CodeBlock
        language="tsx"
        title="Render AI response"
        code={`import { MarkdownRendererEnhanced } from '@clarity-chat/react/internal'

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
}`}
      />

      <h2 id="custom-components">Custom Components</h2>
      <CodeBlock
        language="tsx"
        code={`<MarkdownRendererEnhanced
  content={content}
  components={{
    a: (props) => (
      <a {...props} className="text-brand-500 hover:underline" target="_blank" rel="noreferrer" />
    ),
    h2: (props) => <h2 {...props} className="mt-8 text-2xl font-semibold" />,
  }}
/>`}
      />

      <h2 id="copy-button">Copy Button &amp; Line Numbers</h2>
      <p>
        Enable both features to create docs-style code snippets with header
        badges. Copy buttons respect clipboard permissions and show success
        feedback for two seconds.
      </p>

      <h2 id="math-error-handling">Math Error Handling</h2>
      <CodeBlock
        language="tsx"
        code={`<MarkdownRendererEnhanced
  content={content}
  onMathError={(error, latex) => {
    logger.warn('LaTeX failed to render', { error, latex })
  }}
/>`}
      />

      <h2 id="utilities">Utilities</h2>
      <ApiTable data={utilityRows} />

      <h2 id="props">Props</h2>
      <ApiTable data={props} />

      <Pagination
        prev={{
          href: '/reference/components/conversation-branch-visualizer',
          title: 'ConversationBranchVisualizer',
        }}
        next={{
          href: '/reference/components/export-dialog',
          title: 'ExportDialog',
        }}
      />
    </>
  )
}
