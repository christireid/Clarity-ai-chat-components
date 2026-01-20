'use client'

import { logger } from '@clarity-chat/utils/logger'

import * as React from 'react'
import { codeToHtml, type BundledLanguage, type BundledTheme } from 'shiki'
import { cn } from '../../utils/cn'
import {
  parseLineRanges,
  escapeHtml,
  normalizeLanguage,
  detectLanguage,
  countLines,
  getLanguageDisplayName,
} from './utils'
import { sanitizeCodeHtml } from '../../utils/security/sanitize-html'
import { CODE_THEMES, type CodeThemeName, DEFAULT_DARK_THEME } from './themes'
import { LineNumbers } from './LineNumbers'
import { CodeBlockHeader } from './CodeBlockHeader'
import { CodeBlockCopyButton } from './CodeBlockCopyButton'
import { ChevronDownIcon, ChevronUpIcon, DownloadIcon } from '../ui/icons'

/**
 * Font family options
 */
export type CodeFontFamily =
  | 'fira-code'
  | 'jetbrains-mono'
  | 'source-code-pro'
  | 'system'

/**
 * CodeBlock Component Props
 */
export interface CodeBlockProps {
  /** The code content to display */
  children: string
  /** Programming language for syntax highlighting */
  language?: string
  /** Color theme (from predefined themes or custom Shiki theme) */
  theme?: CodeThemeName | BundledTheme
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Starting line number (default: 1) */
  startingLineNumber?: number
  /** Lines to highlight (e.g., "2,5-7,10") */
  highlightLines?: string
  /** Lines marked as added (diff) */
  addedLines?: string
  /** Lines marked as removed (diff) */
  removedLines?: string
  /** Title/filename to display in header */
  title?: string
  /** Show copy button (default: true) */
  showCopyButton?: boolean
  /** Show language badge in header */
  showLanguageBadge?: boolean
  /** Maximum height before showing expand button (in px) */
  maxHeight?: number
  /** Enable word wrap */
  wordWrap?: boolean
  /** Font family */
  fontFamily?: CodeFontFamily
  /** Enable font ligatures (default: true) */
  enableLigatures?: boolean
  /** Additional CSS class */
  className?: string
  /** Callback when code is copied */
  onCopy?: () => void
  /** Auto-detect language if not provided */
  autoDetectLanguage?: boolean
  /** Show download button */
  showDownloadButton?: boolean
  /** Callback when code is downloaded */
  onDownload?: () => void
  /** Enable keyboard shortcuts (Cmd+Shift+C to copy, Cmd+Shift+D to download) */
  enableKeyboardShortcuts?: boolean
  /** Filename for download (defaults to code.{language}) */
  filename?: string
}

/**
 * Get Shiki theme from theme name
 */
function getShikiTheme(theme: CodeThemeName | BundledTheme): BundledTheme {
  if (theme in CODE_THEMES) {
    return CODE_THEMES[theme as CodeThemeName].shikiTheme
  }
  return theme as BundledTheme
}

/**
 * CodeBlock Component
 *
 * World-class code display component with Shiki-powered syntax highlighting.
 *
 * Features:
 * - Shiki syntax highlighting (VS Code engine)
 * - 15+ popular themes (Material, Night Owl, GitHub, etc.)
 * - Line numbers (toggleable)
 * - Line highlighting with ranges
 * - Diff visualization (added/removed lines)
 * - Animated copy button with feedback
 * - Expand/collapse for long blocks
 * - Premium fonts with ligature support
 * - WCAG 2.1 AA accessible
 * - Keyboard navigable
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="typescript"
 *   theme="github-dark"
 *   title="example.ts"
 *   showLineNumbers
 *   highlightLines="2,5-7"
 * >
 * {`const greeting = "Hello, World!"
 * logger.debug(greeting)`}
 * </CodeBlock>
 * ```
 */
export const CodeBlock = React.memo<CodeBlockProps>(function CodeBlock({
  children,
  language: rawLanguage,
  theme = DEFAULT_DARK_THEME,
  showLineNumbers = false,
  startingLineNumber = 1,
  highlightLines,
  addedLines,
  removedLines,
  title,
  showCopyButton = true,
  showLanguageBadge = true,
  maxHeight,
  wordWrap = false,
  fontFamily = 'fira-code',
  enableLigatures = true,
  className,
  onCopy,
  autoDetectLanguage = true,
  showDownloadButton = false,
  onDownload,
  enableKeyboardShortcuts = false,
  filename,
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [highlightedHtml, setHighlightedHtml] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)
  const codeRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Normalize code content
  const code = React.useMemo(() => children.trim(), [children])
  const lineCount = React.useMemo(() => countLines(code), [code])

  // Determine language
  const language = React.useMemo(() => {
    if (rawLanguage) {
      return normalizeLanguage(rawLanguage)
    }
    if (autoDetectLanguage) {
      return detectLanguage(code)
    }
    return 'text'
  }, [rawLanguage, code, autoDetectLanguage])

  // Parse highlight ranges
  const highlightedLineSet = React.useMemo(
    () => parseLineRanges(highlightLines),
    [highlightLines]
  )
  const addedLineSet = React.useMemo(
    () => parseLineRanges(addedLines),
    [addedLines]
  )
  const removedLineSet = React.useMemo(
    () => parseLineRanges(removedLines),
    [removedLines]
  )

  // Get Shiki theme
  const shikiTheme = React.useMemo(() => getShikiTheme(theme), [theme])

  // Download code as file
  const handleDownload = React.useCallback(() => {
    try {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `code.${language === 'text' ? 'txt' : language}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onDownload?.()
    } catch (err) {
      logger.error('Failed to download code:', err)
    }
  }, [code, filename, language, onDownload])

  // Copy to clipboard (for keyboard shortcut)
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      onCopy?.()
    } catch (err) {
      logger.error('Failed to copy code:', err)
    }
  }, [code, onCopy])

  // Keyboard shortcuts
  React.useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focused within this code block
      if (!containerRef.current?.contains(document.activeElement)) return

      // Cmd/Ctrl+Shift+C to copy
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'c') {
        e.preventDefault()
        handleCopy()
      }
      // Cmd/Ctrl+Shift+D to download
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'd') {
        e.preventDefault()
        handleDownload()
      }
      // Cmd/Ctrl+Shift+E to toggle expand
      else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'e') {
        e.preventDefault()
        setIsExpanded((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enableKeyboardShortcuts, handleCopy, handleDownload])

  // Highlight code with Shiki
  React.useEffect(() => {
    let cancelled = false

    async function highlight() {
      setIsLoading(true)
      setError(null)

      try {
        const html = await codeToHtml(code, {
          lang: language as BundledLanguage,
          theme: shikiTheme,
          transformers: [
            {
              line(node, line) {
                // Add data attribute for line number
                node.properties = node.properties || {}
                node.properties['data-line'] = line

                // Add highlighting classes
                const classList: string[] = ['code-line']

                if (highlightedLineSet.has(line)) {
                  classList.push('highlighted')
                }
                if (addedLineSet.has(line)) {
                  classList.push('diff-add')
                }
                if (removedLineSet.has(line)) {
                  classList.push('diff-remove')
                }

                node.properties.class = classList.join(' ')
              },
            },
          ],
        })

        if (!cancelled) {
          setHighlightedHtml(html)
          setIsLoading(false)
        }
      } catch (err) {
        logger.error('Shiki highlighting failed:', err)
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error('Highlighting failed')
          )
          // Fallback to plain text
          setHighlightedHtml(
            `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`
          )
          setIsLoading(false)
        }
      }
    }

    highlight()
    return () => {
      cancelled = true
    }
  }, [
    code,
    language,
    shikiTheme,
    highlightedLineSet,
    addedLineSet,
    removedLineSet,
  ])

  // Font classes
  const fontClass = {
    'fira-code': 'font-fira-code',
    'jetbrains-mono': 'font-jetbrains-mono',
    'source-code-pro': 'font-source-code-pro',
    system: 'font-mono',
  }[fontFamily]

  // Determine if we should show expand/collapse
  const shouldShowExpand = maxHeight && lineCount > 10

  // Get theme type for styling
  const themeType =
    theme in CODE_THEMES ? CODE_THEMES[theme as CodeThemeName].type : 'dark'

  return (
    <div
      ref={containerRef}
      className={cn(
        'code-block group relative rounded-xl overflow-hidden',
        'border border-white/[0.08]',
        'bg-[#011627]', // Night Owl background

        // Multi-layer shadow system for depth (Raycast-inspired)
        'shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.25),0_8px_16px_rgba(0,0,0,0.2)]',

        // Premium hover glow effect (indigo accent)
        'transition-shadow duration-300 ease-out',
        'hover:shadow-[0_2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.25),0_8px_16px_rgba(0,0,0,0.2),0_0_30px_rgba(129,140,248,0.15),0_0_60px_rgba(129,140,248,0.08)]',

        themeType === 'dark' && 'dark',
        className
      )}
      data-theme={theme}
      data-language={language}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
    >
      {/* Header */}
      <CodeBlockHeader
        title={title}
        language={language}
        showLanguageBadge={showLanguageBadge}
      >
        <div className="flex items-center gap-1">
          {showDownloadButton && (
            <button
              type="button"
              onClick={handleDownload}
              className={cn(
                'p-2 rounded-md',
                'hover:bg-muted/80',
                'text-muted-foreground hover:text-foreground',
                'opacity-0 group-hover:opacity-100',
                'focus-visible:opacity-100',
                'transition-all duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              )}
              aria-label={`Download code${enableKeyboardShortcuts ? ' (Cmd+Shift+D)' : ''}`}
              title={`Download${enableKeyboardShortcuts ? ' (Cmd+Shift+D)' : ''}`}
            >
              <DownloadIcon className="h-4 w-4" size={16} />
            </button>
          )}
          {showCopyButton && (
            <CodeBlockCopyButton
              content={code}
              onCopy={onCopy}
              className={cn(
                'opacity-0 group-hover:opacity-100',
                'focus-visible:opacity-100',
                'transition-opacity duration-200'
              )}
              aria-label={enableKeyboardShortcuts ? 'Copy code (Cmd+Shift+C)' : undefined}
            />
          )}
        </div>
      </CodeBlockHeader>

      {/* Code Content */}
      <div
        ref={codeRef}
        className={cn(
          'relative overflow-auto',
          maxHeight && !isExpanded && 'overflow-hidden'
        )}
        style={maxHeight && !isExpanded ? { maxHeight } : undefined}
      >
        <div className="flex">
          {/* Line Numbers */}
          {showLineNumbers && (
            <LineNumbers
              count={lineCount}
              startFrom={startingLineNumber}
              highlightedLines={highlightedLineSet}
              addedLines={addedLineSet}
              removedLines={removedLineSet}
            />
          )}

          {/* Code */}
          <div
            className={cn(
              'flex-1 p-4 overflow-x-auto',
              'text-sm leading-relaxed',
              fontClass,
              enableLigatures && 'font-ligatures',
              wordWrap && 'whitespace-pre-wrap break-words',
              isLoading && 'animate-pulse'
            )}
            tabIndex={0}
            role="region"
            aria-label={`Code block${title ? `: ${title}` : ''}${language !== 'text' ? ` (${language})` : ''}`}
            // SECURITY: Sanitize HTML output from syntax highlighter to prevent XSS
            dangerouslySetInnerHTML={{
              __html: sanitizeCodeHtml(highlightedHtml),
            }}
          />
        </div>

        {/* Collapse Gradient Overlay */}
        {shouldShowExpand && !isExpanded && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-16',
              'bg-gradient-to-t from-[#011627] to-transparent',
              'pointer-events-none'
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Expand/Collapse Button */}
      {shouldShowExpand && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'w-full py-2 px-4',
            'flex items-center justify-center gap-1',
            'text-sm text-neutral-400',
            'hover:text-neutral-200 hover:bg-white/[0.04]',
            'transition-colors duration-200',
            'border-t border-white/[0.06]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-inset'
          )}
          aria-expanded={isExpanded}
          aria-controls="code-content"
        >
          {isExpanded ? (
            <>
              <ChevronUpIcon className="h-4 w-4" size={16} />
              <span>Show less</span>
            </>
          ) : (
            <>
              <ChevronDownIcon className="h-4 w-4" size={16} />
              <span>Show all {lineCount} lines</span>
            </>
          )}
        </button>
      )}

      {/* Error indicator (hidden, for debugging) */}
      {error && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-0 right-0 p-1">
          <span className="text-xs text-red-500" title={error.message}>
            ⚠
          </span>
        </div>
      )}
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'

export default CodeBlock
