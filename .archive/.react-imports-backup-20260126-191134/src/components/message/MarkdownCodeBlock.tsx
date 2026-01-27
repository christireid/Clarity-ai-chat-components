'use client'

import { logger } from '@clarity-chat/utils/logger'

import React, { useEffect, useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import { sanitizeCodeHtml } from '../../utils/security/sanitize-html'

/**
 * Dynamic import of Prism to handle cases where it's not available
 *
 * PEER DEPENDENCY: prismjs is an optional peer dependency
 * - If not installed, code blocks will render without syntax highlighting
 * - Install with: npm install prismjs
 * - Supports graceful degradation with plain text fallback
 */
let Prism: typeof import('prismjs') | null = null
let prismLoaded = false
let prismLoadPromise: Promise<typeof import('prismjs') | null> | null = null

// Lazy load Prism only when needed
async function loadPrism(): Promise<typeof import('prismjs') | null> {
  if (prismLoaded) return Prism

  // Avoid multiple concurrent loads
  if (prismLoadPromise) return prismLoadPromise

  prismLoadPromise = (async () => {
    try {
      // Import prismjs core first
      const prismModule = await import('prismjs')
      Prism = prismModule.default || prismModule

      // Set Prism as a global for language component compatibility
      // Language components like prism-tsx expect window.Prism to exist
      if (typeof window !== 'undefined') {
        ;(window as unknown as { Prism: typeof import('prismjs') }).Prism =
          Prism
      }

      // Load language support sequentially to ensure dependencies are met
      // typescript and javascript must load before jsx/tsx
      await import('prismjs/components/prism-javascript')
      await import('prismjs/components/prism-typescript')
      await import('prismjs/components/prism-jsx')
      await import('prismjs/components/prism-tsx')

      // Load other languages in parallel
      await Promise.all([
        import('prismjs/components/prism-json'),
        import('prismjs/components/prism-bash'),
        import('prismjs/components/prism-css'),
        import('prismjs/components/prism-markdown'),
        import('prismjs/components/prism-python'),
      ])

      prismLoaded = true
      return Prism
    } catch (error) {
      // Graceful degradation: prismjs is optional
      // Code will render as plain text without syntax highlighting
      logger.warn(
        'Prism.js not available (install with: npm install prismjs), syntax highlighting disabled:',
        error
      )
      prismLoadPromise = null
      return null
    }
  })()

  return prismLoadPromise
}

// Helper function to extract text content from React children
function getTextContent(children: React.ReactNode): string {
  if (typeof children === 'string') {
    return children
  }

  if (typeof children === 'number') {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map(getTextContent).join('')
  }

  if (React.isValidElement(children)) {
    const childProps = children.props as { children?: React.ReactNode }
    if (childProps.children) {
      return getTextContent(childProps.children)
    }
  }

  return ''
}

export interface MarkdownCodeBlockProps {
  inline?: boolean
  className?: string
  children?: React.ReactNode
  [key: string]: unknown
}

/**
 * Code block component for markdown rendering with syntax highlighting
 * Extracted from Message component for better organization
 */
export const MarkdownCodeBlock = React.memo<MarkdownCodeBlockProps>(
  ({ inline, className, children, ...rest }) => {
    const [highlightedCode, setHighlightedCode] = useState('')

    // Extract language from className (format: language-xxx)
    const match = /language-(\w+)/.exec(className || '')
    const language: string = match?.[1] ?? 'typescript'

    // Extract text content from React children
    const codeString = getTextContent(children).replace(/\n$/, '')

    // Highlight code with Prism (lazy loaded)
    useEffect(() => {
      if (!inline && codeString) {
        loadPrism()
          .then((prism) => {
            if (prism && prism.languages) {
              try {
                const grammar =
                  prism.languages[language] || prism.languages['typescript']
                if (!grammar) {
                  setHighlightedCode(codeString)
                  return
                }
                const highlighted = prism.highlight(
                  codeString,
                  grammar,
                  language
                )
                setHighlightedCode(highlighted)
              } catch (error) {
                logger.error('Prism highlighting error:', error)
                setHighlightedCode(codeString)
              }
            } else {
              // Fallback to plain code if Prism is not available
              setHighlightedCode(codeString)
            }
          })
          .catch((error) => {
            logger.warn('Failed to load Prism:', error)
            setHighlightedCode(codeString)
          })
      }
    }, [codeString, language, inline])

    if (inline) {
      return (
        <code
          className="bg-muted px-1 py-0.5 rounded text-sm font-mono"
          {...rest}
        >
          {children}
        </code>
      )
    }

    // For block code, just render the code element
    // The wrapping structure (div/pre) is handled by the pre component in message.tsx
    return (
      <code
        className={cn('block font-mono code-metrics', className)} // Enforce metrics
        // SECURITY: Sanitize HTML output from syntax highlighter to prevent XSS
        dangerouslySetInnerHTML={{
          __html: sanitizeCodeHtml(highlightedCode || codeString),
        }}
        data-code-string={codeString}
        {...rest}
      />
    )
  }
)

MarkdownCodeBlock.displayName = 'MarkdownCodeBlock'
