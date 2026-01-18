import * as React from 'react'
import {
  CodeBlock as UnifiedCodeBlock,
  type CodeBlockProps as UnifiedCodeBlockProps,
} from '@clarity-chat/react'

// Type assertion helper for CodeBlock to handle monorepo type resolution
const TypedUnifiedCodeBlock =
  UnifiedCodeBlock as React.ComponentType<UnifiedCodeBlockProps>

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
 */
export function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers: showLineNumbersProp,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  // Smart line numbers:
  // 1. Respect explicit prop if provided
  // 2. Hide for terminal/shell/text
  // 3. Hide for very short snippets (<= 3 lines) unless it's a code file
  const isTerminal = [
    'bash',
    'sh',
    'shell',
    'zsh',
    'terminal',
    'cmd',
    'powershell',
  ].includes(language.toLowerCase())
  const lineCount = code.trim().split('\n').length

  const showLineNumbers = showLineNumbersProp ?? (!isTerminal && lineCount > 3)

  // Convert array-based highlightLines to string format
  const highlightLinesString =
    highlightLines.length > 0 ? highlightLines.join(',') : undefined

  return (
    <TypedUnifiedCodeBlock
      language={language}
      title={title}
      showLineNumbers={showLineNumbers}
      highlightLines={highlightLinesString}
      showCopyButton
      className={className}
      theme="night-owl"
    >
      {code}
    </TypedUnifiedCodeBlock>
  )
}

// Type for advanced usage
export type AdvancedCodeBlockProps = CodeBlockProps
