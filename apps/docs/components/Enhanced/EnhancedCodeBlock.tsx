'use client'

/**
 * EnhancedCodeBlock - Docs App Wrapper
 *
 * This is a thin wrapper around the unified CodeBlock from @clarity-chat/react.
 * It provides enhanced features like sandbox URLs while using the unified component.
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
import { CodeBlock as UnifiedCodeBlock, type CodeBlockProps as UnifiedCodeBlockProps } from '@clarity-chat/react'
import { ExternalLink } from 'lucide-react'

// Type assertion helper for CodeBlock to handle monorepo type resolution
const TypedUnifiedCodeBlock = UnifiedCodeBlock as React.ComponentType<UnifiedCodeBlockProps>

/**
 * Props for the enhanced CodeBlock wrapper
 */
export interface EnhancedCodeBlockProps {
  /** The code content to display */
  code: string
  /** Programming language for syntax highlighting */
  language: string
  /** Title to display in header */
  title?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Lines to highlight (array of line numbers) */
  highlightLines?: number[]
  /** Additional CSS class */
  className?: string
  /** Filename to display (alternative to title) */
  filename?: string
  /** URL to open code in sandbox (CodeSandbox, StackBlitz, etc.) */
  sandboxUrl?: string
  /** Enable code editing (placeholder for future feature) */
  editable?: boolean
  /** Show copy button */
  showCopyButton?: boolean
}

/**
 * EnhancedCodeBlock component for documentation pages
 *
 * Extends the unified CodeBlock with additional features like sandbox links.
 *
 * @example
 * ```tsx
 * <EnhancedCodeBlock
 *   code="const x = 1;"
 *   language="typescript"
 *   filename="example.ts"
 *   sandboxUrl="https://codesandbox.io/..."
 *   showLineNumbers
 * />
 * ```
 */
export function EnhancedCodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  highlightLines = [],
  className,
  filename,
  sandboxUrl,
  editable = false,
  showCopyButton = true,
}: EnhancedCodeBlockProps) {
  // Convert array-based highlightLines to string format
  const highlightLinesString = highlightLines.length > 0
    ? highlightLines.join(',')
    : undefined

  // Use filename as title if provided
  const displayTitle = filename || title

  return (
    <div className="relative group">
      {/* Sandbox link (if provided) */}
      {sandboxUrl && (
        <div className="absolute top-2 right-2 z-10">
          <a
            href={sandboxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/80 backdrop-blur-sm hover:bg-muted transition-all duration-200 text-xs font-medium text-muted-foreground hover:text-foreground"
            aria-label="Open in CodeSandbox"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open</span>
          </a>
        </div>
      )}

      <TypedUnifiedCodeBlock
        language={language}
        title={displayTitle}
        showLineNumbers={showLineNumbers}
        highlightLines={highlightLinesString}
        showCopyButton={showCopyButton}
        showDownloadButton
        enableKeyboardShortcuts
        filename={filename}
        className={className}
      >
        {code}
      </TypedUnifiedCodeBlock>
    </div>
  )
}
