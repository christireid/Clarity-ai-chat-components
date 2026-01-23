import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'EnhancedMarkdownRenderer (formerly MarkdownRendererEnhanced)',
  description:
    'Render rich markdown with KaTeX math, syntax highlighting, Mermaid diagrams, error boundaries, and performance monitoring. This component has been renamed from MarkdownRendererEnhanced.',
}

const props = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Markdown source string to render.',
  },
  {
    name: 'config',
    type: 'EnhancedMarkdownConfig',
    description: 'Configuration object for rendering features.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description: 'Indicates if content is currently streaming (affects performance optimizations).',
  },
]

const configProps = [
  {
    name: 'enableKaTeX',
    type: 'boolean',
    default: 'false',
    description: 'Enable LaTeX/KaTeX rendering for mathematical formulas.',
  },
  {
    name: 'enableMermaid',
    type: 'boolean',
    default: 'false',
    description: 'Enable Mermaid diagram rendering.',
  },
  {
    name: 'enableSyntaxHighlight',
    type: 'boolean',
    default: 'true',
    description: 'Enable syntax highlighting for code blocks.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom CSS class for the markdown content.',
  },
  {
    name: 'codeTheme',
    type: "'light' | 'dark'",
    default: "'light'",
    description: 'Theme for code syntax highlighting.',
  },
]

const hookRows = [
  {
    name: 'useMarkdownFeatures(content)',
    type: '{ hasMath: boolean; hasMermaid: boolean; hasCodeBlocks: boolean; needsEnhancedRendering: boolean }',
    description: 'Detect what features are present in markdown content.',
  },
]

export default function MarkdownRendererEnhancedPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>EnhancedMarkdownRenderer</h1>

      <Callout type="warning">
        <p>
          <strong>Component Renamed:</strong> This component was previously named
          <code>MarkdownRendererEnhanced</code> but has been renamed to
          <code>EnhancedMarkdownRenderer</code> for consistency. The old name is deprecated.
        </p>
      </Callout>

      <p className="lead">
        A comprehensive markdown renderer with built-in error boundaries,
        performance monitoring, analytics tracking, and support for LaTeX math,
        Mermaid diagrams, and syntax highlighting—perfect for AI chat interfaces
        and technical documentation.
      </p>

      <Callout type="info">
        <p>
          This component includes automatic error boundaries, performance monitoring,
          and analytics tracking out of the box for production-ready reliability.
        </p>
      </Callout>

      <Callout type="tip">
        <p>
          Import <code>'katex/dist/katex.min.css'</code> for math rendering support
          (automatically handled when importing from <code>@clarity-chat/react</code>).
        </p>
      </Callout>

      <h2 id="import">Import</h2>
      <CodeBlock
        language="tsx"
        code={`import { EnhancedMarkdownRenderer } from '@clarity-chat/react'
import 'katex/dist/katex.min.css' // For math rendering`}
      />

      <h2 id="usage">Basic Usage</h2>
      <CodeBlock
        language="tsx"
        title="Render markdown content"
        code={`import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

const content = \`
# Welcome to AI Chat

This is **bold** and *italic* text.

## Math Support

The quadratic formula: \$\$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}\$\$

## Code Highlighting

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

## Mermaid Diagrams

\`\`\`mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
\`\`\`
\`

export function ChatMessage() {
  return (
    <EnhancedMarkdownRenderer
      content={content}
      config={{
        enableKaTeX: true,
        enableMermaid: true,
        enableSyntaxHighlight: true,
        codeTheme: 'light'
      }}
    />
  )
}`}
      />

      <h2 id="streaming">Streaming Content</h2>
      <p>
        The component optimizes for streaming content with performance monitoring
        and smooth rendering updates.
      </p>
      <CodeBlock
        language="tsx"
        code={`<EnhancedMarkdownRenderer
  content={streamingContent}
  config={{
    enableKaTeX: true,
    enableSyntaxHighlight: true,
  }}
  isStreaming={true}
/>`}
      />

      <h2 id="features">Feature Configuration</h2>
      <p>
        Configure individual features through the <code>config</code> prop:
      </p>
      <CodeBlock
        language="tsx"
        code={`<EnhancedMarkdownRenderer
  content={content}
  config={{
    enableKaTeX: true,        // LaTeX math rendering
    enableMermaid: true,      // Mermaid diagrams
    enableSyntaxHighlight: true, // Code syntax highlighting
    codeTheme: 'dark',        // Code theme
    className: 'custom-markdown' // Custom CSS class
  }}
/>`}
      />

      <h2 id="error-handling">Built-in Error Handling</h2>
      <p>
        The component includes automatic error boundaries and graceful fallbacks:
      </p>
      <CodeBlock
        language="tsx"
        code={`// Errors are automatically caught and displayed with retry options
<EnhancedMarkdownRenderer
  content={potentiallyUnsafeContent}
  config={{ enableKaTeX: true }}
/>

// The component will show an error message if rendering fails
// and provide options to retry or report the issue`}
      />

      <h2 id="performance">Performance Monitoring</h2>
      <p>
        Automatic performance tracking for render times and memory usage:
      </p>
      <CodeBlock
        language="tsx"
        code={`// Performance metrics are automatically collected
// Use the PerformanceDashboard to view analytics
import { PerformanceDashboard } from '@clarity-chat/react'

<PerformanceDashboard />
`}
      />

      <h2 id="analytics">Analytics Integration</h2>
      <p>
        Component usage and interaction analytics are automatically tracked:
      </p>
      <CodeBlock
        language="tsx"
        code={`// Analytics are enabled by default
// Wrap your app with AnalyticsProvider for custom configuration
import { AnalyticsProvider } from '@clarity-chat/react'

<AnalyticsProvider config={{ enabled: true, sampleRate: 1.0 }}>
  <EnhancedMarkdownRenderer content={content} />
</AnalyticsProvider>
`}
      />

      <h2 id="hooks">Related Hooks</h2>
      <ApiTable data={hookRows} />

      <h2 id="props">Props</h2>
      <ApiTable data={props} />

      <h2 id="config">Configuration Options</h2>
      <ApiTable data={configProps} />

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
