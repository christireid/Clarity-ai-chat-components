'use client'

/**
 * CodeBlock - Docs App Wrapper
 *
 * This is a thin wrapper around the unified CodeBlock from @clarity-chat/react.
 * It adapts the docs-specific API (code prop) to the unified component (children prop).
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

import { CodeBlock as UnifiedCodeBlock, type CodeBlockProps as UnifiedCodeBlockProps } from '@clarity-chat/react'

/**
 * Props for the docs CodeBlock wrapper
 * Uses 'code' prop for backwards compatibility with existing docs
 */
export interface CodeBlockProps {
  /** The code content to display */
  code: string
  /** Programming language for syntax highlighting */
  language: string
  /** Title/filename to display in header */
  title?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Lines to highlight (array of line numbers) */
  highlightLines?: number[]
  /** Additional CSS class */
  className?: string
}

/**
 * CodeBlock component for documentation pages
 *
 * This wrapper maintains backwards compatibility with the docs-specific API
 * while using the production-ready unified CodeBlock component.
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   code="const x = 1;"
 *   language="typescript"
 *   showLineNumbers
 * />
 * ```
 */
export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  // Convert array-based highlightLines to string format
  const highlightLinesString = highlightLines.length > 0
    ? highlightLines.join(',')
    : undefined

  return (
    <UnifiedCodeBlock
      language={language}
      title={title}
      showLineNumbers={showLineNumbers}
      highlightLines={highlightLinesString}
      showCopyButton
      showDownloadButton
      enableKeyboardShortcuts
      className={className}
    >
      {code}
    </UnifiedCodeBlock>
  )
}

// Re-export types from unified component for advanced usage
export type { UnifiedCodeBlockProps as AdvancedCodeBlockProps }
