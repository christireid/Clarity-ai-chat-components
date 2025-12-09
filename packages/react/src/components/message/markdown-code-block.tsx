'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@clarity-chat/primitives'

// Dynamic import of Prism to handle cases where it's not available
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error prismjs language components may not have type declarations
      await import('prismjs/components/prism-javascript')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error prismjs language components may not have type declarations
      await import('prismjs/components/prism-typescript')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error prismjs language components may not have type declarations
      await import('prismjs/components/prism-jsx')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error prismjs language components may not have type declarations
      await import('prismjs/components/prism-tsx')

      // Load other languages in parallel
      await Promise.all([
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error prismjs language components may not have type declarations
        import('prismjs/components/prism-json'),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error prismjs language components may not have type declarations
        import('prismjs/components/prism-bash'),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error prismjs language components may not have type declarations
        import('prismjs/components/prism-css'),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error prismjs language components may not have type declarations
        import('prismjs/components/prism-markdown'),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error prismjs language components may not have type declarations
        import('prismjs/components/prism-python'),
      ])

      prismLoaded = true
      return Prism
    } catch (error) {
      console.warn(
        'Prism.js not available, syntax highlighting disabled:',
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
                console.error('Prism highlighting error:', error)
                setHighlightedCode(codeString)
              }
            } else {
              // Fallback to plain code if Prism is not available
              setHighlightedCode(codeString)
            }
          })
          .catch((error) => {
            console.warn('Failed to load Prism:', error)
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
        className={cn('block text-sm font-mono', className)}
        dangerouslySetInnerHTML={{ __html: highlightedCode || codeString }}
        data-code-string={codeString}
        {...rest}
      />
    )
  }
)

MarkdownCodeBlock.displayName = 'MarkdownCodeBlock'
