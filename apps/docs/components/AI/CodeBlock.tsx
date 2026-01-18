'use client'

/**
 * CodeBlock - AI Assistant Wrapper
 *
 * This is a thin wrapper around the unified CodeBlock from @clarity-chat/react.
 * It provides the same API as the original AI/CodeBlock for backwards compatibility.
 *
 * Features inherited from unified component:
 * - Shiki syntax highlighting (VS Code engine)
 * - 15+ popular themes
 * - Line numbers and highlighting
 * - Diff visualization
 * - Copy and download buttons
 * - Expand/collapse for long blocks
 * - Keyboard shortcuts
 * - WCAG 2.1 AA accessible
 */

import * as React from 'react'
import {
  CodeBlock as UnifiedCodeBlock,
  type CodeBlockProps as UnifiedCodeBlockProps,
  parseCodeBlocks as parseCodeBlocksUtil,
} from '@clarity-chat/react'
import { cn } from '@/lib/utils'

// Type assertion helper for CodeBlock to handle monorepo type resolution
const TypedUnifiedCodeBlock = UnifiedCodeBlock as React.ComponentType<UnifiedCodeBlockProps>

/**
 * Parsed code block structure
 */
export interface ParsedCodeBlock {
  type: 'code' | 'text'
  content: string
  language?: string
  startLine?: number
  endLine?: number
}

/**
 * Props for the AI CodeBlock wrapper
 */
export interface CodeBlockProps {
  /** The code content to display */
  code: string
  /** Programming language for syntax highlighting */
  language?: string
  /** Filename to display in header */
  filename?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Lines to highlight (array of line numbers) */
  highlightLines?: number[]
  /** Additional CSS class */
  className?: string
}

/**
 * CodeBlock component for AI assistant responses
 *
 * This wrapper maintains backwards compatibility with the AI-specific API
 * while using the production-ready unified CodeBlock component.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code="const x = 1;"
 *   language="typescript"
 *   filename="example.ts"
 *   showLineNumbers
 * />
 * ```
 */
export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  // Convert array-based highlightLines to string format
  const highlightLinesString = highlightLines.length > 0
    ? highlightLines.join(',')
    : undefined

  return (
    <TypedUnifiedCodeBlock
      language={language}
      title={filename}
      showLineNumbers={showLineNumbers}
      highlightLines={highlightLinesString}
      showCopyButton
      showDownloadButton
      enableKeyboardShortcuts
      filename={filename}
      className={className}
    >
      {code}
    </TypedUnifiedCodeBlock>
  )
}

/**
 * Inline code snippet component
 */
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <code
      className={cn(
        'px-1.5 py-0.5 rounded',
        'bg-muted text-foreground',
        'font-mono text-sm',
        'border border-border',
        className
      )}
    >
      {children}
    </code>
  )
}

/**
 * Parse markdown code blocks from text
 * Re-exported from unified component for convenience
 */
export function parseCodeBlocks(text: string): ParsedCodeBlock[] {
  return parseCodeBlocksUtil(text) as ParsedCodeBlock[]
}

/**
 * Render text with code blocks
 */
export function RenderWithCodeBlocks({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const blocks = parseCodeBlocks(content)

  if (blocks.length === 0) {
    return <div className={className}>{content}</div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      {blocks.map((block, index) => {
        if (block.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={block.content}
              language={block.language}
            />
          )
        }

        // Render text with inline code support
        return (
          <div
            key={index}
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderInlineCode(block.content),
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * Render inline code snippets in text
 */
function renderInlineCode(text: string): string {
  // Simple HTML escaping for security
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  return escaped.replace(
    /`([^`]+)`/g,
    '<code class="inline-code">$1</code>'
  )
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(lang: string): string {
  const names: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript (JSX)',
    js: 'JavaScript',
    jsx: 'JavaScript (JSX)',
    py: 'Python',
    python: 'Python',
    rs: 'Rust',
    rust: 'Rust',
    go: 'Go',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    rb: 'Ruby',
    php: 'PHP',
    swift: 'Swift',
    kt: 'Kotlin',
    sql: 'SQL',
    sh: 'Shell',
    bash: 'Bash',
    yml: 'YAML',
    yaml: 'YAML',
    json: 'JSON',
    xml: 'XML',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    md: 'Markdown',
    mdx: 'MDX',
  }

  return names[lang.toLowerCase()] || lang.toUpperCase()
}

// ParsedCodeBlock is already exported via the interface declaration above
