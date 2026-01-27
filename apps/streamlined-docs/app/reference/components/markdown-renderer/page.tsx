'use client'

/**
 * MarkdownRenderer Component - API Reference Documentation
 *
 * Enhanced markdown rendering with support for syntax highlighting, LaTeX math,
 * Mermaid diagrams, streaming content, and secure HTML sanitization.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Copy,
  Check,
  Code2,
  Sparkles,
  Shield,
  Zap,
  BookOpen,
  AlertTriangle,
  Terminal,
  Binary,
  Database,
  Share2,
  Settings,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import type { TocItem } from '@/components/Docs/TableOfContents'

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [markdownInput, setMarkdownInput] = React.useState(
    `# Enhanced Markdown Demo

Welcome to the **MarkdownRenderer** component showcase.

## Features

- **Syntax highlighting** for code blocks
- LaTeX mathematical formulas (optional)
- Mermaid diagrams (optional)
- Streaming content support
- Secure HTML sanitization

### Code Example

\`\`\`typescript
interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

function ChatMessage({ message }: { message: Message }) {
  return (
    <div className="message">
      {message.content}
    </div>
  )
}
\`\`\`

### Inline Code

Use \`const value = 42\` for inline code snippets.

### Lists

1. First item
2. Second item
   - Nested bullet
   - Another nested item
3. Third item

### Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Syntax Highlighting | ✅ | High |
| LaTeX Support | ⚡ | Medium |
| Mermaid Diagrams | ⚡ | Medium |

### Blockquotes

> This is a blockquote with **bold** and *italic* text.
> It can span multiple lines.

---

Ready to render some markdown?`
  )

  const [isStreaming, setIsStreaming] = React.useState(false)
  const [enableKaTeX, setEnableKaTeX] = React.useState(false)
  const [enableMermaid, setEnableMermaid] = React.useState(false)
  const [enableSyntaxHighlight, setEnableSyntaxHighlight] = React.useState(true)
  const [enableCopyButton, setEnableCopyButton] = React.useState(true)

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enableSyntaxHighlight}
            onChange={(e) => setEnableSyntaxHighlight(e.target.checked)}
            className="rounded"
          />
          Syntax Highlighting
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enableCopyButton}
            onChange={(e) => setEnableCopyButton(e.target.checked)}
            className="rounded"
          />
          Copy Buttons
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enableKaTeX}
            onChange={(e) => setEnableKaTeX(e.target.checked)}
            className="rounded"
          />
          LaTeX (KaTeX)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enableMermaid}
            onChange={(e) => setEnableMermaid(e.target.checked)}
            className="rounded"
          />
          Mermaid Diagrams
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isStreaming}
            onChange={(e) => setIsStreaming(e.target.checked)}
            className="rounded"
          />
          Streaming Mode
        </label>
      </div>

      {/* Input */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium">Markdown Input</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {markdownInput.length} characters
          </span>
        </div>
        <textarea
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="w-full h-64 p-4 bg-background/50 font-mono text-sm resize-none focus:outline-none"
          placeholder="Enter markdown here..."
        />
      </div>

      {/* Output */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium">Rendered Output</span>
          </div>
          {isStreaming && (
            <span className="text-xs text-brand-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
              Streaming
            </span>
          )}
        </div>
        <div className="p-6 bg-background/50 min-h-[300px]">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: markdownInput }} />
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Configuration Preview
            </h4>
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {JSON.stringify(
                {
                  enableSyntaxHighlight,
                  enableCopyButton,
                  enableKaTeX,
                  enableMermaid,
                  isStreaming,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Markdown content to render.',
  },
  {
    name: 'config',
    type: 'EnhancedMarkdownConfig',
    description: 'Configuration options for rendering features.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description: 'Whether content is currently streaming. Shows cursor animation.',
  },
]

const configProps: PropDefinition[] = [
  {
    name: 'enableKaTeX',
    type: 'boolean',
    default: 'false',
    description: 'Enable KaTeX for LaTeX/math rendering.',
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
    description: 'Custom CSS class for the markdown container.',
  },
  {
    name: 'codeTheme',
    type: "'light' | 'dark'",
    default: "'light'",
    description: 'Theme for code blocks.',
  },
  {
    name: 'enableCopyButton',
    type: 'boolean',
    default: 'true',
    description: 'Enable copy buttons on code blocks.',
  },
  {
    name: 'enableLazyRendering',
    type: 'boolean',
    default: 'false',
    description: 'Enable lazy/deferred rendering for performance during streaming.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { MarkdownRenderer } from '@clarity-chat/react'
// Or the explicit name
import { EnhancedMarkdownRenderer } from '@clarity-chat/react'

// Type imports
import type {
  EnhancedMarkdownRendererProps,
  EnhancedMarkdownConfig
} from '@clarity-chat/react'`

const basicUsageCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function MessageDisplay({ message }: { message: string }) {
  return (
    <MarkdownRenderer
      content={message}
    />
  )
}`

const withSyntaxHighlightCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function CodeExample() {
  const markdown = \`
# Code Example

\\\`\\\`\\\`typescript
interface User {
  id: string
  name: string
  email: string
}

function greetUser(user: User) {
  console.log(\\\`Hello, \\\${user.name}!\\\`)
}
\\\`\\\`\\\`
  \`

  return (
    <MarkdownRenderer
      content={markdown}
      config={{
        enableSyntaxHighlight: true,
        codeTheme: 'dark',
        enableCopyButton: true,
      }}
    />
  )
}`

const streamingCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function StreamingResponse({ content, isStreaming }: {
  content: string
  isStreaming: boolean
}) {
  return (
    <MarkdownRenderer
      content={content}
      isStreaming={isStreaming}
      config={{
        enableLazyRendering: true, // Improves streaming performance
        enableSyntaxHighlight: true,
      }}
    />
  )
}`

const mermaidCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function DiagramExample() {
  const markdown = \`
# System Architecture

\\\`\\\`\\\`mermaid
graph TD
    A[Client] -->|HTTP| B[API Gateway]
    B --> C[Auth Service]
    B --> D[Chat Service]
    D --> E[LLM Provider]
\\\`\\\`\\\`
  \`

  return (
    <MarkdownRenderer
      content={markdown}
      config={{
        enableMermaid: true,
        codeTheme: 'dark',
      }}
    />
  )
}

// Note: Mermaid requires the mermaid peer dependency
// npm install mermaid`

const latexCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function MathExample() {
  const markdown = \`
# Mathematical Formulas

Inline math: $E = mc^2$

Block math:

$$
\\\\frac{-b \\\\pm \\\\sqrt{b^2 - 4ac}}{2a}
$$
  \`

  return (
    <MarkdownRenderer
      content={markdown}
      config={{
        enableKaTeX: true,
      }}
    />
  )
}

// Note: KaTeX support is in development
// Currently shows placeholder rendering`

const customStylesCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function StyledMarkdown({ content }: { content: string }) {
  return (
    <MarkdownRenderer
      content={content}
      config={{
        className: 'my-custom-markdown',
        enableSyntaxHighlight: true,
        codeTheme: 'dark',
      }}
    />
  )
}

// Custom CSS (globals.css or component styles)
/*
.my-custom-markdown {
  font-size: 1.1rem;
  line-height: 1.8;
}

.my-custom-markdown h1 {
  color: var(--brand-500);
  margin-bottom: 1rem;
}

.my-custom-markdown code {
  background: var(--muted);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}
*/`

const securityCode = `import { MarkdownRenderer } from '@clarity-chat/react'

function SecureMarkdown({ userContent }: { userContent: string }) {
  // MarkdownRenderer includes built-in security:
  // 1. DOMPurify sanitization for all HTML output
  // 2. Safe code execution (no eval)
  // 3. XSS prevention in syntax highlighting

  return (
    <MarkdownRenderer
      content={userContent}
      config={{
        enableSyntaxHighlight: true,
        // All outputs are sanitized by default
      }}
    />
  )
}

// Security features:
// - XSS prevention via DOMPurify
// - No dangerous HTML tags allowed
// - Script injection blocked
// - Mermaid runs in secure mode`

const typescriptCode = `// Component props
interface EnhancedMarkdownRendererProps {
  /** Markdown content to render */
  content: string
  /** Configuration options */
  config?: EnhancedMarkdownConfig
  /** Is content currently streaming? */
  isStreaming?: boolean
}

// Configuration interface
interface EnhancedMarkdownConfig {
  /** Enable KaTeX for LaTeX/math rendering */
  enableKaTeX?: boolean
  /** Enable Mermaid diagram rendering */
  enableMermaid?: boolean
  /** Enable syntax highlighting */
  enableSyntaxHighlight?: boolean
  /** Custom className for markdown content */
  className?: string
  /** Theme for code blocks */
  codeTheme?: 'light' | 'dark'
  /** Enable copy buttons on code blocks */
  enableCopyButton?: boolean
  /** Enable lazy/deferred rendering for performance during streaming */
  enableLazyRendering?: boolean
}

// Hook for detecting markdown features
function useMarkdownFeatures(content: string): {
  hasMath: boolean
  hasMermaid: boolean
  hasCodeBlocks: boolean
  needsEnhancedRendering: boolean
}

// Usage
import { useMarkdownFeatures } from '@clarity-chat/react'

const features = useMarkdownFeatures(markdownContent)
if (features.needsEnhancedRendering) {
  // Enable advanced features
}`

// ============================================================================
// Peer Dependencies Info Component
// ============================================================================

function PeerDependenciesInfo() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg border border-border/50 bg-card">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Terminal className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Core Dependencies</h4>
            <p className="text-xs text-muted-foreground mt-1">
              Required for basic markdown rendering
            </p>
          </div>
        </div>
        <CodeBlock
          code={`npm install react-markdown remark-gfm rehype-highlight`}
          language="bash"
          showLineNumbers={false}
        />
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>
              <strong>react-markdown</strong> - Core rendering (~50KB)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>
              <strong>remark-gfm</strong> - GitHub Flavored Markdown (~15KB)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>
              <strong>rehype-highlight</strong> - Syntax highlighting (~30KB)
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg border border-border/50 bg-card">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Binary className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              Optional: Mermaid Diagrams
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              For rendering flowcharts and diagrams
            </p>
          </div>
        </div>
        <CodeBlock
          code={`npm install mermaid`}
          language="bash"
          showLineNumbers={false}
        />
        <div className="mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>
              <strong>Large dependency</strong> - ~300KB, only install if needed
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Graceful Degradation
            </h4>
            <p className="text-sm text-muted-foreground">
              If peer dependencies are not installed, MarkdownRenderer
              automatically falls back to plain text rendering with basic
              formatting. This ensures your app doesn't break if dependencies
              are missing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function MarkdownRendererPage() {
  const tableOfContents: TocItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'installation', title: 'Installation' },
    { id: 'demo', title: 'Live Demo' },
    { id: 'basic-usage', title: 'Basic Usage' },
    {
      id: 'props',
      title: 'Props Reference',
      children: [
        { id: 'core-props', title: 'Core Props' },
        { id: 'config-props', title: 'Configuration' },
      ],
    },
    {
      id: 'examples',
      title: 'Examples',
      children: [
        { id: 'example-basic', title: 'Basic Rendering' },
        { id: 'example-syntax', title: 'Syntax Highlighting' },
        { id: 'example-streaming', title: 'Streaming Content' },
        { id: 'example-mermaid', title: 'Mermaid Diagrams' },
        { id: 'example-latex', title: 'LaTeX Math' },
        { id: 'example-styles', title: 'Custom Styles' },
      ],
    },
    { id: 'peer-deps', title: 'Peer Dependencies' },
    { id: 'security', title: 'Security' },
    { id: 'typescript', title: 'TypeScript' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'related', title: 'Related' },
  ]

  return (
    <DocumentationPage
      title="MarkdownRenderer"
      description="Enhanced markdown rendering component with syntax highlighting, LaTeX math support, Mermaid diagrams, streaming content handling, and secure HTML sanitization. Features graceful degradation when peer dependencies are missing."
      icon={FileText}
      badges={[{ label: 'Stable', variant: 'stable' }]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Code2,
          label: 'Syntax Highlighting',
          description: 'Multiple languages supported',
        },
        {
          icon: Shield,
          label: 'Secure',
          description: 'DOMPurify sanitization',
        },
        {
          icon: Sparkles,
          label: 'Streaming Support',
          description: 'Real-time rendering',
        },
        {
          icon: Database,
          label: 'Mermaid Diagrams',
          description: 'Flowcharts & diagrams',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'StreamingText',
          type: 'component',
          description: 'Character-by-character streaming text display',
          href: '/reference/components/streaming-text',
        },
        {
          name: 'CodeBlock',
          type: 'component',
          description: 'Standalone code block with syntax highlighting',
          href: '/reference/components/code-block',
        },
        {
          name: 'StreamingMessage',
          type: 'component',
          description: 'Complete message with streaming support',
          href: '/reference/components/streaming-message',
        },
        {
          name: 'useMarkdownFeatures',
          type: 'hook',
          description: 'Detect markdown features in content',
          href: '/reference/hooks/use-markdown-features',
        },
      ]}
      footerNavigation={[
        {
          label: 'StreamingMessage',
          href: '/reference/components/streaming-message',
          direction: 'previous',
        },
        {
          label: 'CodeBlock',
          href: '/reference/components/code-block',
          direction: 'next',
        },
      ]}
    >
      {/* Overview Section */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            <code>MarkdownRenderer</code> (also exported as{' '}
            <code>EnhancedMarkdownRenderer</code>) provides comprehensive
            markdown rendering with support for GitHub Flavored Markdown (GFM),
            syntax highlighting, mathematical formulas, diagrams, and streaming
            content.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
          <ul className="space-y-2">
            <li>
              <strong>GitHub Flavored Markdown:</strong> Tables, task lists,
              strikethrough, and autolinks
            </li>
            <li>
              <strong>Syntax Highlighting:</strong> Automatic language detection
              and highlighting for code blocks
            </li>
            <li>
              <strong>Copy Buttons:</strong> One-click copy for code blocks with
              visual feedback
            </li>
            <li>
              <strong>Streaming Support:</strong> Real-time rendering during AI
              response streaming
            </li>
            <li>
              <strong>Mermaid Diagrams:</strong> Render flowcharts, sequence
              diagrams, and more (optional)
            </li>
            <li>
              <strong>LaTeX Math:</strong> KaTeX support for mathematical
              formulas (in development)
            </li>
            <li>
              <strong>Security:</strong> DOMPurify sanitization prevents XSS
              attacks
            </li>
            <li>
              <strong>Graceful Degradation:</strong> Falls back to plain text
              when dependencies missing
            </li>
            <li>
              <strong>Custom Components:</strong> Styled tables, lists, and
              blockquotes
            </li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">
            When to Use MarkdownRenderer
          </h4>
          <p>
            Use this component when you need to display rich markdown content,
            especially in AI chat applications where responses may include:
          </p>
          <ul className="space-y-1">
            <li>Code examples with syntax highlighting</li>
            <li>Technical documentation with tables and lists</li>
            <li>Mathematical formulas or scientific notation</li>
            <li>Diagrams and flowcharts</li>
            <li>Streaming AI-generated content</li>
          </ul>
        </div>
      </Section>

      {/* Installation Section */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Install the main package:
          </p>

          <CodeBlock
            code="npm install @clarity-chat/react"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">
            Install peer dependencies for full functionality:
          </p>

          <CodeBlock
            code="npm install react-markdown remark-gfm rehype-highlight"
            language="bash"
            filename="Terminal"
            showDownloadButton={false}
          />

          <p className="text-muted-foreground">Import the component:</p>

          <CodeBlock
            code={importCode}
            language="tsx"
            filename="App.tsx"
            showDownloadButton={false}
          />
        </div>
      </Section>

      {/* Live Demo Section */}
      <Section id="demo" title="Live Demo">
        <p className="text-muted-foreground mb-6">
          Try the MarkdownRenderer component. Edit the markdown input to see
          real-time rendering with various features enabled.
        </p>

        <LiveDemo />
      </Section>

      {/* Basic Usage Section */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The simplest usage requires only the content prop:
          </p>

          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="MessageDisplay.tsx"
          />
        </div>
      </Section>

      {/* Props API Section */}
      <Section id="props" title="Props Reference">
        <SubSection id="core-props" title="Core Props">
          <PropsTable props={coreProps} />
        </SubSection>

        <SubSection id="config-props" title="Configuration">
          <p className="text-sm text-muted-foreground mb-4">
            Configure rendering features via the <code>config</code> prop:
          </p>
          <PropsTable props={configProps} />
        </SubSection>
      </Section>

      {/* Examples Section */}
      <Section id="examples" title="Examples">
        <SubSection id="example-basic" title="Basic Rendering">
          <p className="text-muted-foreground mb-4">
            Simple markdown rendering with default settings:
          </p>
          <CodeBlock
            code={basicUsageCode}
            language="tsx"
            filename="BasicExample.tsx"
          />
        </SubSection>

        <SubSection id="example-syntax" title="Syntax Highlighting">
          <p className="text-muted-foreground mb-4">
            Enable syntax highlighting with copy buttons:
          </p>
          <CodeBlock
            code={withSyntaxHighlightCode}
            language="tsx"
            filename="SyntaxHighlightExample.tsx"
          />
        </SubSection>

        <SubSection id="example-streaming" title="Streaming Content">
          <p className="text-muted-foreground mb-4">
            Handle streaming AI responses with lazy rendering:
          </p>
          <CodeBlock
            code={streamingCode}
            language="tsx"
            filename="StreamingExample.tsx"
          />
        </SubSection>

        <SubSection id="example-mermaid" title="Mermaid Diagrams">
          <p className="text-muted-foreground mb-4">
            Render flowcharts and diagrams with Mermaid:
          </p>
          <CodeBlock
            code={mermaidCode}
            language="tsx"
            filename="MermaidExample.tsx"
          />
        </SubSection>

        <SubSection id="example-latex" title="LaTeX Math">
          <p className="text-muted-foreground mb-4">
            Render mathematical formulas with KaTeX:
          </p>
          <CodeBlock
            code={latexCode}
            language="tsx"
            filename="LatexExample.tsx"
          />
        </SubSection>

        <SubSection id="example-styles" title="Custom Styles">
          <p className="text-muted-foreground mb-4">
            Apply custom styling to markdown content:
          </p>
          <CodeBlock
            code={customStylesCode}
            language="tsx"
            filename="CustomStylesExample.tsx"
          />
        </SubSection>
      </Section>

      {/* Peer Dependencies Section */}
      <Section id="peer-deps" title="Peer Dependencies">
        <p className="text-muted-foreground mb-6">
          MarkdownRenderer uses optional peer dependencies for enhanced
          functionality. The component works without them, falling back to plain
          text rendering.
        </p>

        <PeerDependenciesInfo />
      </Section>

      {/* Security Section */}
      <Section id="security" title="Security">
        <div className="space-y-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              MarkdownRenderer includes built-in security measures to prevent
              XSS attacks and other vulnerabilities when rendering user-generated
              or AI-generated content.
            </p>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  DOMPurify Integration
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  All HTML output is sanitized
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>XSS Prevention:</strong> All user content is sanitized
                  before rendering
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Script Injection Blocked:</strong> Malicious scripts
                  are stripped from content
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Safe Code Execution:</strong> No eval() or dangerous
                  functions
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Mermaid Security:</strong> Diagrams run in secure mode
                  with error suppression
                </span>
              </li>
            </ul>
          </div>

          <CodeBlock
            code={securityCode}
            language="tsx"
            filename="SecureMarkdown.tsx"
          />

          <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Security Best Practices
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Always use MarkdownRenderer for user-generated content</li>
                  <li>Never disable security features in production</li>
                  <li>Keep peer dependencies updated for latest security patches</li>
                  <li>Monitor content for suspicious patterns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* TypeScript Section */}
      <Section id="typescript" title="TypeScript">
        <p className="text-muted-foreground mb-4">
          Full type definitions for MarkdownRenderer and related utilities:
        </p>
        <CodeBlock
          code={typescriptCode}
          language="tsx"
          filename="types.ts"
          showLineNumbers
        />
      </Section>

      {/* Accessibility Section */}
      <Section id="accessibility" title="Accessibility">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h4 className="text-lg font-semibold mt-6 mb-3">WCAG 2.1 AA Compliance</h4>
          <p>
            MarkdownRenderer follows accessibility best practices to ensure
            content is readable by all users.
          </p>

          <h4 className="text-lg font-semibold mt-6 mb-3">Semantic HTML</h4>
          <ul className="space-y-2">
            <li>Proper heading hierarchy (h1-h6)</li>
            <li>Semantic lists (ul, ol) with correct nesting</li>
            <li>Tables with proper thead/tbody structure</li>
            <li>Blockquotes with appropriate markup</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Code Blocks</h4>
          <ul className="space-y-2">
            <li>
              Copy buttons include <code>aria-label</code> for screen readers
            </li>
            <li>
              Code blocks use <code>role="region"</code> with descriptive labels
            </li>
            <li>Syntax highlighting maintains sufficient color contrast</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Streaming Content</h4>
          <ul className="space-y-2">
            <li>
              Streaming cursor uses <code>aria-hidden="true"</code> to prevent
              announcement noise
            </li>
            <li>
              Content updates are announced via <code>aria-live</code> regions
            </li>
            <li>Loading states include descriptive labels</li>
          </ul>

          <h4 className="text-lg font-semibold mt-6 mb-3">Keyboard Navigation</h4>
          <ul className="space-y-2">
            <li>Copy buttons are keyboard accessible (Tab, Enter, Space)</li>
            <li>Links in content are focusable with clear focus indicators</li>
            <li>No keyboard traps in complex content</li>
          </ul>
        </div>
      </Section>

      {/* Troubleshooting Section */}
      <Section id="troubleshooting" title="Troubleshooting">
        <div className="space-y-6">
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Markdown not rendering
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Ensure peer dependencies are installed:{' '}
                    <code>react-markdown remark-gfm rehype-highlight</code>
                  </li>
                  <li>Check browser console for import errors</li>
                  <li>
                    Component falls back to plain text if dependencies are missing
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Syntax highlighting not working
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Verify <code>rehype-highlight</code> is installed
                  </li>
                  <li>
                    Check that <code>enableSyntaxHighlight</code> is true
                    (default)
                  </li>
                  <li>
                    Some languages may not be supported, falling back to plain
                    text
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Mermaid diagrams not rendering
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Install mermaid: <code>npm install mermaid</code>
                  </li>
                  <li>
                    Enable in config: <code>enableMermaid: true</code>
                  </li>
                  <li>Check syntax of mermaid diagram code</li>
                  <li>Errors are suppressed; check console for warnings</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Performance issues with streaming
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Enable lazy rendering: <code>enableLazyRendering: true</code>
                  </li>
                  <li>
                    Consider disabling heavy features during streaming (Mermaid,
                    KaTeX)
                  </li>
                  <li>Use debouncing for rapid content updates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Copy button not appearing
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>
                    Verify <code>enableCopyButton: true</code> (default)
                  </li>
                  <li>Copy button only appears on code blocks, not inline code</li>
                  <li>Button appears on hover for desktop, always visible on mobile</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
