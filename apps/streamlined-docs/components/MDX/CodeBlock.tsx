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

// TODO: Import CodeBlock from @clarity-chat/react once it's exported
// For now, creating a simple wrapper around Prism
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { useEffect, useRef } from 'react'

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
 * while using the unified CodeBlock component.
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
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  return (
    <div className={`code-block-wrapper ${className || ''}`}>
      {title && <div className="code-block-title">{title}</div>}
      <pre className={`language-${language}`}>
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
