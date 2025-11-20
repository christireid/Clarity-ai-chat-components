'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import { CopyButton } from '../copy-button'

// Dynamic import of Prism to handle cases where it's not available
let Prism: any = null
let prismLoaded = false

// Lazy load Prism only when needed
async function loadPrism() {
  if (prismLoaded) return Prism

  try {
    const prismModule = await import('prismjs')
    Prism = prismModule.default

    // Load language support
    await Promise.all([
      import('prismjs/components/prism-typescript'),
      import('prismjs/components/prism-javascript'),
      import('prismjs/components/prism-jsx'),
      import('prismjs/components/prism-tsx'),
      import('prismjs/components/prism-json'),
      import('prismjs/components/prism-bash'),
      import('prismjs/components/prism-css'),
      import('prismjs/components/prism-markdown'),
      import('prismjs/components/prism-python'),
    ])

    prismLoaded = true
    return Prism
  } catch (error) {
    console.warn('Prism.js not available, syntax highlighting disabled:', error)
    return null
  }
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

  if (React.isValidElement(children) && children.props.children) {
    return getTextContent(children.props.children)
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
    const language = match ? match[1] : 'typescript'

    // Extract text content from React children
    const codeString = getTextContent(children).replace(/\n$/, '')

    // Highlight code with Prism (lazy loaded)
    useEffect(() => {
      if (!inline && codeString) {
        loadPrism().then((prism) => {
          if (prism && prism.languages) {
            try {
              const grammar = prism.languages[language] || prism.languages.typescript
              const highlighted = prism.highlight(codeString, grammar, language)
              setHighlightedCode(highlighted)
            } catch (error) {
              console.error('Prism highlighting error:', error)
              setHighlightedCode(codeString)
            }
          } else {
            // Fallback to plain code if Prism is not available
            setHighlightedCode(codeString)
          }
        }).catch((error) => {
          console.warn('Failed to load Prism:', error)
          setHighlightedCode(codeString)
        })
      }
    }, [codeString, language, inline])

    if (inline) {
      return (
        <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono" {...rest}>
          {children}
        </code>
      )
    }

    return (
      <div className="relative group/code my-4">
        <pre className={cn(
          'relative overflow-x-auto',
          'bg-muted/50 border border-border rounded-lg',
          'p-4',
          className
        )}>
          <code
            className={cn('block text-sm font-mono', className)}
            dangerouslySetInnerHTML={{ __html: highlightedCode || codeString }}
            {...rest}
          />
        </pre>
        <CopyButton
          text={codeString}
          className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity"
        />
      </div>
    )
  }
)

MarkdownCodeBlock.displayName = 'MarkdownCodeBlock'
