'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'
import { normalizeLanguage, escapeHtml } from './utils'
import { sanitizeCodeHtml } from '../../utils/sanitize-html'
import { CODE_THEMES, type CodeThemeName, DEFAULT_DARK_THEME } from './themes'
import { CodeBlockHeader } from './CodeBlockHeader'
import { CodeBlockCopyButton } from './CodeBlockCopyButton'

// Lazy import shiki to avoid blocking
let codeToHtml: typeof import('shiki').codeToHtml | null = null
let shikiLoadPromise: Promise<void> | null = null

async function loadShiki() {
  if (codeToHtml) return
  if (shikiLoadPromise) {
    await shikiLoadPromise
    return
  }
  shikiLoadPromise = (async () => {
    const shiki = await import('shiki')
    codeToHtml = shiki.codeToHtml
  })()
  await shikiLoadPromise
}

/**
 * StreamingCodeBlock Component Props
 */
export interface StreamingCodeBlockProps {
  /** Streaming code content */
  code: string
  /** Whether currently streaming */
  isStreaming?: boolean
  /** Programming language */
  language?: string
  /** Color theme */
  theme?: CodeThemeName
  /** Show copy button (disabled during streaming) */
  showCopyButton?: boolean
  /** Title/filename */
  title?: string
  /** Additional CSS class */
  className?: string
  /** Callback when code is copied */
  onCopy?: () => void
  /** Maximum height for scrolling */
  maxHeight?: number
}

/**
 * StreamingCodeBlock Component
 *
 * Code block optimized for streaming AI responses.
 *
 * Features:
 * - Throttled syntax highlighting during streaming
 * - Auto-scroll to bottom during active streaming
 * - Streaming cursor indicator
 * - Disabled copy during streaming
 * - Final highlight pass when stream completes
 *
 * @example
 * ```tsx
 * <StreamingCodeBlock
 *   code={streamingCode}
 *   isStreaming={isGenerating}
 *   language="python"
 *   theme="github-dark"
 * />
 * ```
 */
export const StreamingCodeBlock = React.memo<StreamingCodeBlockProps>(
  function StreamingCodeBlock({
    code,
    isStreaming = false,
    language: rawLanguage = 'text',
    theme = DEFAULT_DARK_THEME,
    showCopyButton = true,
    title,
    className,
    onCopy,
    maxHeight = 400,
  }) {
    const [highlightedHtml, setHighlightedHtml] = React.useState<string>('')
    const [isHighlighting, setIsHighlighting] = React.useState(false)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const highlightTimeoutRef = React.useRef<ReturnType<
      typeof setTimeout
    > | null>(null)
    const lastHighlightedCodeRef = React.useRef<string>('')

    const language = React.useMemo(
      () => normalizeLanguage(rawLanguage),
      [rawLanguage]
    )

    const shikiTheme = React.useMemo(() => {
      if (theme in CODE_THEMES) {
        return CODE_THEMES[theme].shikiTheme
      }
      return theme
    }, [theme])

    // Throttled highlighting
    const highlightCode = React.useCallback(
      async (codeToHighlight: string) => {
        // Skip if already highlighted this code
        if (codeToHighlight === lastHighlightedCodeRef.current) return
        lastHighlightedCodeRef.current = codeToHighlight

        try {
          await loadShiki()
          if (!codeToHtml) {
            // Fallback to plain text
            setHighlightedHtml(`<code>${escapeHtml(codeToHighlight)}</code>`)
            return
          }

          setIsHighlighting(true)
          const html = await codeToHtml(codeToHighlight, {
            lang: language as import('shiki').BundledLanguage,
            theme: shikiTheme,
          })
          setHighlightedHtml(html)
        } catch (err) {
          logger.logger.error('Shiki streaming highlight failed:', err)
          setHighlightedHtml(`<code>${escapeHtml(codeToHighlight)}</code>`)
        } finally {
          setIsHighlighting(false)
        }
      },
      [language, shikiTheme]
    )

    // Effect: Throttle highlighting during streaming
    React.useEffect(() => {
      if (!code) {
        setHighlightedHtml('')
        lastHighlightedCodeRef.current = ''
        return
      }

      // Clear any pending timeout
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current)
      }

      if (isStreaming) {
        // During streaming: throttle to every 150ms
        highlightTimeoutRef.current = setTimeout(() => {
          highlightCode(code)
        }, 150)
      } else {
        // Stream complete: immediate highlight
        highlightCode(code)
      }

      return () => {
        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current)
        }
      }
    }, [code, isStreaming, highlightCode])

    // Effect: Auto-scroll to bottom during streaming
    React.useEffect(() => {
      if (isStreaming && contentRef.current) {
        contentRef.current.scrollTop = contentRef.current.scrollHeight
      }
    }, [code, isStreaming])

    // Get theme type for styling
    const themeType = theme in CODE_THEMES ? CODE_THEMES[theme].type : 'dark'

    return (
      <div
        className={cn(
          'code-block streaming-code-block group relative rounded-lg border overflow-hidden',
          'border-border bg-card',
          themeType === 'dark' && 'dark',
          className
        )}
        data-theme={theme}
        data-language={language}
        data-streaming={isStreaming}
      >
        {/* Header */}
        <CodeBlockHeader
          title={title}
          language={language}
          showLanguageBadge
          actions={
            isStreaming && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                </span>
                <span>Streaming...</span>
              </span>
            )
          }
        >
          {showCopyButton && (
            <CodeBlockCopyButton
              content={code}
              onCopy={onCopy}
              disabled={isStreaming}
              className={cn(
                'opacity-0 group-hover:opacity-100',
                'focus-visible:opacity-100',
                'transition-opacity duration-200',
                isStreaming && 'opacity-50 cursor-not-allowed'
              )}
            />
          )}
        </CodeBlockHeader>

        {/* Code Content */}
        <div
          ref={contentRef}
          className={cn(
            'p-4 overflow-auto',
            'text-sm leading-relaxed font-mono',
            'font-fira-code font-ligatures',
            isHighlighting && 'opacity-80'
          )}
          style={{ maxHeight }}
          tabIndex={0}
          role="region"
          aria-label={`Code block${title ? `: ${title}` : ''}${isStreaming ? ' (streaming)' : ''}`}
        >
          <div
            className="whitespace-pre-wrap break-words"
            // SECURITY: Sanitize HTML output from syntax highlighter to prevent XSS
            dangerouslySetInnerHTML={{
              __html: sanitizeCodeHtml(highlightedHtml || escapeHtml(code)),
            }}
          />

          {/* Streaming cursor */}
          {isStreaming && (
            <span
              className={cn(
                'inline-block w-2 h-5 ml-0.5',
                'bg-primary animate-pulse',
                'align-text-bottom'
              )}
              aria-hidden="true"
            />
          )}
        </div>
      </div>
    )
  }
)

StreamingCodeBlock.displayName = 'StreamingCodeBlock'

export default StreamingCodeBlock
