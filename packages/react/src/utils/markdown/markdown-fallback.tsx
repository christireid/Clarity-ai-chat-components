/**
 * Markdown Fallback Utilities
 *
 * PEER DEPENDENCY: react-markdown, remark-gfm, and rehype-highlight are optional peer dependencies
 * - If not installed, markdown will render as formatted plain text
 * - Install with: npm install react-markdown remark-gfm rehype-highlight
 * - Supports graceful degradation with accessible plain text fallback
 *
 * This module provides:
 * - Detection of react-markdown availability
 * - Fallback plain text renderer with basic formatting
 * - WCAG-compliant accessible rendering
 * - Clear messaging about optional dependencies
 */

'use client'

import * as React from 'react'
import { logger } from '@clarity-chat/utils/logger'
import { cn } from '@clarity-chat/primitives'
import { sanitizeMarkdownHtml, escapeHtml } from './sanitize'

/**
 * Lazy-loaded react-markdown modules
 * These will be null if the packages are not installed
 */
let ReactMarkdown: typeof import('react-markdown').default | null = null
let remarkGfm: typeof import('remark-gfm').default | null = null
let rehypeHighlight: typeof import('rehype-highlight').default | null = null

let markdownLoadAttempted = false
let markdownLoadPromise: Promise<boolean> | null = null

/**
 * Attempt to load react-markdown and related plugins
 * Returns true if successful, false if packages not available
 */
export async function loadMarkdownDependencies(): Promise<boolean> {
  if (markdownLoadAttempted) {
    return ReactMarkdown !== null
  }

  // Avoid multiple concurrent loads
  if (markdownLoadPromise) {
    return markdownLoadPromise
  }

  markdownLoadPromise = (async () => {
    try {
      // Try to import react-markdown
      const reactMarkdownModule = await import('react-markdown')
      ReactMarkdown = reactMarkdownModule.default

      // Try to import remark-gfm (GitHub Flavored Markdown)
      try {
        const remarkGfmModule = await import('remark-gfm')
        remarkGfm = remarkGfmModule.default
      } catch {
        logger.info(
          'remark-gfm not available, GitHub Flavored Markdown disabled'
        )
      }

      // Try to import rehype-highlight (syntax highlighting)
      try {
        const rehypeHighlightModule = await import('rehype-highlight')
        rehypeHighlight = rehypeHighlightModule.default
      } catch {
        logger.info(
          'rehype-highlight not available, syntax highlighting disabled'
        )
      }

      markdownLoadAttempted = true
      return true
    } catch (error) {
      // Graceful degradation: react-markdown is optional
      logger.info(
        'react-markdown not available (install with: npm install react-markdown remark-gfm rehype-highlight), using plain text fallback',
        error
      )
      markdownLoadAttempted = true
      markdownLoadPromise = null
      return false
    }
  })()

  return markdownLoadPromise
}

/**
 * Get loaded markdown dependencies
 */
export function getMarkdownDependencies() {
  return {
    ReactMarkdown,
    remarkGfm,
    rehypeHighlight,
    isAvailable: ReactMarkdown !== null,
  }
}

/**
 * Props for plain text markdown fallback renderer
 */
export interface PlainTextMarkdownProps {
  content: string
  className?: string
  showFallbackMessage?: boolean
}

/**
 * Plain text markdown renderer with basic formatting
 * Used when react-markdown is not available
 *
 * Provides:
 * - Preserves code blocks with proper formatting
 * - Converts headers to semantic HTML
 * - Maintains line breaks and paragraphs
 * - Handles lists (ordered and unordered)
 * - Preserves links
 * - WCAG-compliant accessible structure
 */
export function PlainTextMarkdown({
  content,
  className,
  showFallbackMessage = true,
}: PlainTextMarkdownProps) {
  const formattedContent = React.useMemo(() => {
    return formatPlainTextMarkdown(content)
  }, [content])

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:font-semibold',
        'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-muted prose-pre:border prose-pre:p-4 prose-pre:rounded-lg',
        className
      )}
    >
      {showFallbackMessage && (
        <div
          className="mb-4 p-3 bg-muted/50 border border-border rounded-lg text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
        >
          <strong className="font-semibold">Note:</strong> Enhanced markdown
          rendering is unavailable. Install{' '}
          <code className="bg-background px-1 py-0.5 rounded text-xs">
            react-markdown
          </code>{' '}
          for full markdown support.
        </div>
      )}
      <div
        className="markdown-fallback"
        dangerouslySetInnerHTML={{
          __html: sanitizeMarkdownHtml(formattedContent),
        }}
      />
    </div>
  )
}

/**
 * Format plain text with basic markdown-like structure
 * Returns sanitized HTML with semantic elements
 */
function formatPlainTextMarkdown(content: string): string {
  if (!content) return ''

  const lines = content.split('\n')
  const elements: string[] = []
  let inCodeBlock = false
  let codeBlockLines: string[] = []
  let codeBlockLanguage = ''
  let inList = false
  let listItems: string[] = []
  let listType: 'ul' | 'ol' = 'ul'

  const flushList = () => {
    if (inList && listItems.length > 0) {
      const listTag = listType === 'ul' ? 'ul' : 'ol'
      elements.push(`<${listTag} class="my-2 pl-6">`)
      listItems.forEach((item) => {
        // Process inline formatting in list items
        const processedItem = processInlineFormatting(item)
        elements.push(`<li>${processedItem}</li>`)
      })
      elements.push(`</${listTag}>`)
      listItems = []
      inList = false
    }
  }

  const processInlineFormatting = (text: string): string => {
    let processed = text

    // Handle inline code first (to avoid processing markdown inside code)
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
    )

    // Handle links
    processed = processed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">$1</a>'
    )

    // Handle bold (before italic to handle ** before *)
    processed = processed.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    )

    // Handle italic
    processed = processed.replace(
      /(?<!\*)\*([^*]+)\*(?!\*)/g,
      '<em class="italic">$1</em>'
    )

    return processed
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Handle code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        const codeContent = codeBlockLines.join('\n')
        elements.push(
          `<pre class="overflow-x-auto"><code class="language-${escapeHtml(codeBlockLanguage)}">${escapeHtml(codeContent)}</code></pre>`
        )
        codeBlockLines = []
        codeBlockLanguage = ''
        inCodeBlock = false
      } else {
        // Start code block
        flushList()
        codeBlockLanguage = trimmed.slice(3).trim() || 'text'
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBlockLines.push(line)
      continue
    }

    // Handle headers
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
    if (headerMatch) {
      flushList()
      const level = headerMatch[1].length
      const text = headerMatch[2]
      elements.push(
        `<h${level} class="font-semibold mt-4 mb-2">${escapeHtml(text)}</h${level}>`
      )
      continue
    }

    // Handle unordered lists
    const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/)
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList()
        inList = true
        listType = 'ul'
      }
      listItems.push(ulMatch[1])
      continue
    }

    // Handle ordered lists
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/)
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList()
        inList = true
        listType = 'ol'
      }
      listItems.push(olMatch[1])
      continue
    }

    // If we were in a list and hit a non-list line, flush the list
    if (inList && !ulMatch && !olMatch) {
      flushList()
    }

    // Handle empty lines as paragraph breaks
    if (trimmed === '') {
      if (elements.length > 0 && elements[elements.length - 1] !== '<br>') {
        elements.push('<br>')
      }
      continue
    }

    // Regular text line with inline formatting
    if (!inList) {
      const processedLine = processInlineFormatting(escapeHtml(line))
      elements.push(`<p class="my-2">${processedLine}</p>`)
    }
  }

  // Flush any remaining list
  flushList()

  return elements.join('')
}

/**
 * Escape HTML to prevent XSS
 * Note: This is a basic implementation for text content only
 * For production, consider using a library like DOMPurify
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

/**
 * Hook to detect if react-markdown is available
 * Loads dependencies on mount if not already loaded
 */
export function useMarkdownAvailability() {
  const [isAvailable, setIsAvailable] = React.useState<boolean | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    loadMarkdownDependencies().then((available) => {
      setIsAvailable(available)
      setIsLoading(false)
    })
  }, [])

  return {
    isAvailable,
    isLoading,
    ReactMarkdown,
    remarkGfm,
    rehypeHighlight,
  }
}
