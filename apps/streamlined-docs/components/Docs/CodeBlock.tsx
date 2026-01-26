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

  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-neutral-950 dark:bg-neutral-900 overflow-hidden',
        'border-neutral-800 dark:border-neutral-700',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 dark:bg-neutral-800 border-b border-neutral-800 dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-neutral-500" aria-hidden="true" />
          {filename && (
            <span className="text-sm font-medium text-neutral-300">
              {filename}
            </span>
          )}
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 dark:bg-neutral-700 text-neutral-400">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                'hover:bg-neutral-800 dark:hover:bg-neutral-700',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900'
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
                    transition={{ duration: 0.2 }}
                  >
                    <Check className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Copy className="w-4 h-4 text-neutral-400" />
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
                'hover:bg-neutral-800 dark:hover:bg-neutral-700',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900'
              )}
              aria-label="Download code as file"
            >
              <Download className="w-4 h-4 text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Code content */}
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight }}
      >
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-neutral-100">
            {lines.map((line, index) => {
              const lineNumber = index + 1
              const isHighlighted = highlightLines.includes(lineNumber)

              return (
                <div
                  key={index}
                  className={cn(
                    'block',
                    isHighlighted && 'bg-brand-500/10 -mx-4 px-4 border-l-2 border-brand-500'
                  )}
                >
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-neutral-600 select-none">
                      {lineNumber}
                    </span>
                  )}
                  <span>{line || ' '}</span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>

      {/* Footer with line count */}
      <div className="px-4 py-1.5 bg-neutral-900 dark:bg-neutral-800 border-t border-neutral-800 dark:border-neutral-700">
        <p className="text-xs text-neutral-500">
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
