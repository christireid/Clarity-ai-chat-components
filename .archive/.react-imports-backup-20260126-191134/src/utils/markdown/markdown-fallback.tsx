/**
 * Markdown Fallback Utilities
 *
 * Provides graceful degradation when react-markdown peer dependency is missing.
 * Dynamically loads markdown dependencies and provides plain text fallback.
 */

'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { logger } from '@clarity-chat/utils/logger'
import { sanitizeMarkdownHtml } from './sanitize'

/**
 * Markdown dependencies state
 */
interface MarkdownDependencies {
  isAvailable: boolean
  ReactMarkdown: React.ComponentType<any> | null
  remarkGfm: any | null
  rehypeHighlight: any | null
}

let markdownDependencies: MarkdownDependencies = {
  isAvailable: false,
  ReactMarkdown: null,
  remarkGfm: null,
  rehypeHighlight: null,
}

let loadingPromise: Promise<boolean> | null = null

/**
 * Dynamically load markdown dependencies
 */
export async function loadMarkdownDependencies(): Promise<boolean> {
  // Return cached result if already loaded
  if (markdownDependencies.isAvailable) {
    return true
  }

  // Return existing loading promise if already loading
  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = (async () => {
    try {
      // Try loading react-markdown
      const reactMarkdownModule = await import('react-markdown')
      const remarkGfmModule = await import('remark-gfm')
      const rehypeHighlightModule = await import('rehype-highlight')

      markdownDependencies = {
        isAvailable: true,
        ReactMarkdown: reactMarkdownModule.default,
        remarkGfm: remarkGfmModule.default,
        rehypeHighlight: rehypeHighlightModule.default,
      }

      logger.info('Markdown dependencies loaded successfully')
      return true
    } catch (error) {
      logger.info(
        'react-markdown not available, using plain text fallback. Install with: npm install react-markdown remark-gfm rehype-highlight'
      )
      markdownDependencies = {
        isAvailable: false,
        ReactMarkdown: null,
        remarkGfm: null,
        rehypeHighlight: null,
      }
      return false
    } finally {
      loadingPromise = null
    }
  })()

  return loadingPromise
}

/**
 * Get current markdown dependencies state
 */
export function getMarkdownDependencies(): MarkdownDependencies {
  return { ...markdownDependencies }
}

/**
 * Hook to check markdown availability
 */
export function useMarkdownAvailability() {
  const [state, setState] = useState<MarkdownDependencies & { isLoading: boolean }>({
    ...markdownDependencies,
    isLoading: !markdownDependencies.isAvailable,
  })

  useEffect(() => {
    if (!markdownDependencies.isAvailable) {
      loadMarkdownDependencies().then((isAvailable) => {
        setState({
          ...markdownDependencies,
          isLoading: false,
        })
      })
    }
  }, [])

  return state
}

/**
 * Format markdown as plain text with basic styling
 */
export function formatMarkdownAsPlainText(content: string): string {
  return content
    // Headers
    .replace(/^#{1,6}\s+(.+)$/gm, '<strong>$1</strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Links - preserve href
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br/>')
}

/**
 * Plain text markdown component props
 */
export interface PlainTextMarkdownProps {
  content: string
  showFallbackMessage?: boolean
  className?: string
}

/**
 * Plain text markdown fallback component
 * Used when react-markdown is not available
 */
export const PlainTextMarkdown: React.FC<PlainTextMarkdownProps> = ({
  content,
  showFallbackMessage = true,
  className = '',
}) => {
  const formattedContent = formatMarkdownAsPlainText(content)
  const sanitizedContent = sanitizeMarkdownHtml(formattedContent)

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {showFallbackMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-2 text-sm text-muted-foreground"
        >
          <strong>Note:</strong> Enhanced markdown rendering is unavailable. Install{' '}
          <code>react-markdown</code> for full markdown support.
        </div>
      )}
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        aria-label="Markdown content (plain text mode)"
      />
    </div>
  )
}

PlainTextMarkdown.displayName = 'PlainTextMarkdown'
