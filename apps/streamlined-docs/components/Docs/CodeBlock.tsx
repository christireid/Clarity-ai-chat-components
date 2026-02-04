'use client'

/**
 * CodeBlock - Enhanced syntax highlighted code block with copy functionality
 *
 * Features:
 * - Syntax highlighting via Shiki/Prism
 * - Copy to clipboard button
 * - Download code as file
 * - Line numbers (optional)
 * - Line highlighting (optional)
 * - Language badge
 * - File name display
 * - Dark mode support
 * - Fully accessible
 * - Responsive design
 */

import * as React from 'react'
import { Check, Copy, Download, Code2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  normalizeLanguage,
  getLanguageDisplayName,
} from '@/lib/syntax-highlighter'

export interface CodeBlockProps {
  /** Code content */
  code: string
  /** Programming language */
  language: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Lines to highlight (1-indexed) */
  highlightLines?: number[]
  /** File name */
  filename?: string
  /** Additional CSS classes */
  className?: string
  /** Maximum height before scroll */
  maxHeight?: string
  /** Show copy button */
  showCopyButton?: boolean
  /** Show download button */
  showDownloadButton?: boolean
  /**
   * Pre-highlighted HTML (from server-side Shiki rendering)
   * If provided, this will be rendered directly with Night Owl theme
   */
  highlightedHtml?: string
}

export function CodeBlock({
  code,
  language,
  showLineNumbers = false,
  highlightLines = [],
  filename,
  className,
  maxHeight = '600px',
  showCopyButton = true,
  showDownloadButton = true,
  highlightedHtml,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }, [code])

  const handleDownload = React.useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [code, filename, language])

  const lines = code.split('\n')

  const normalizedLanguage = normalizeLanguage(language)
  const displayLanguage = getLanguageDisplayName(language)

  return (
    <div
      className={cn(
        'group relative rounded-lg border overflow-hidden',
        // Night Owl theme background (#011627)
        'bg-[#011627] border-[#1d3b53]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#01111d] border-b border-[#1d3b53]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#637777]" aria-hidden="true" />
          {filename && (
            <span className="text-sm font-medium text-[#d6deeb]">
              {filename}
            </span>
          )}
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0b2942] text-[#82aaff]">
            {displayLanguage}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                'hover:bg-[#0b2942]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82aaff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011627]'
              )}
              aria-label="Copy code to clipboard"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: durations.normal }}
                    viewport={{ once: true }}
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: durations.normal }}
                    viewport={{ once: true }}
                  >
                    <Copy className="w-4 h-4 text-[#637777]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}

          {showDownloadButton && (
            <button
              onClick={handleDownload}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                'hover:bg-[#0b2942]',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#82aaff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#011627]'
              )}
              aria-label="Download code as file"
            >
              <Download className="w-4 h-4 text-[#637777]" />
            </button>
          )}
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight }}>
        {highlightedHtml ? (
          // Render Shiki-highlighted HTML with Night Owl theme
          <div
            className="shiki-code-block"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            // Night Owl theme is already included in the HTML from Shiki
            style={{
              fontSize: '0.875rem',
              lineHeight: '1.5',
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            }}
          />
        ) : (
          // Fallback: Plain text with Night Owl colors
          <pre className="p-4 text-sm font-mono leading-relaxed">
            <code className="text-[#d6deeb]">
              {lines.map((line, index) => {
                const lineNumber = index + 1
                const isHighlighted = highlightLines.includes(lineNumber)

                return (
                  <div
                    key={index}
                    className={cn(
                      'block',
                      isHighlighted &&
                        'bg-[#82aaff]/10 -mx-4 px-4 border-l-2 border-[#82aaff]'
                    )}
                  >
                    {showLineNumbers && (
                      <span className="inline-block w-8 text-right mr-4 text-[#5f7e97] select-none">
                        {lineNumber}
                      </span>
                    )}
                    <span>{line || ' '}</span>
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </div>

      {/* Footer with line count */}
      <div className="px-4 py-1.5 bg-[#01111d] border-t border-[#1d3b53]">
        <p className="text-xs text-[#637777]">
          {lines.length} {lines.length === 1 ? 'line' : 'lines'}
        </p>
      </div>
    </div>
  )
}

/**
 * InlineCode - Inline code snippet
 */
export interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'px-1.5 py-0.5 rounded text-sm font-mono',
        'bg-neutral-100 dark:bg-neutral-800',
        'text-neutral-900 dark:text-neutral-100',
        'border border-neutral-200 dark:border-neutral-700',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}
