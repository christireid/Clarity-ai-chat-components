/**
 * Code Block Component
 *
 * A minimal, standalone code block component with copy button and line numbers.
 * This template is designed for scaffolding and doesn't require external dependencies.
 *
 * For production use with syntax highlighting, use the CodeBlock from @clarity-chat/react:
 * import { CodeBlock } from '@clarity-chat/react'
 *
 * Features:
 * - Copy to clipboard
 * - Line numbers (toggleable)
 * - Download code
 * - Expand/collapse for long blocks
 * - Keyboard shortcuts
 */

import React, { useState, useCallback, useEffect, useRef } from 'react'

interface CodeBlockProps {
  /** The code content to display */
  code: string
  /** Programming language (for display only in this template) */
  language?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Show copy button */
  showCopyButton?: boolean
  /** Show download button */
  showDownloadButton?: boolean
  /** Title/filename to display */
  title?: string
  /** Additional CSS class */
  className?: string
  /** Maximum height before showing expand button (in lines) */
  maxLines?: number
  /** Enable keyboard shortcuts */
  enableKeyboardShortcuts?: boolean
}

export function CodeBlock({
  code,
  language = 'text',
  showLineNumbers = true,
  showCopyButton = true,
  showDownloadButton = false,
  title,
  className = '',
  maxLines = 20,
  enableKeyboardShortcuts = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lines = code.split('\n')
  const isTallCodeBlock = lines.length > maxLines

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = title || `code.${language === 'text' ? 'txt' : language}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Failed to download code:', err)
    }
  }, [code, title, language])

  // Keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboardShortcuts) return

    const handleKeyDown = (e: KeyboardEvent) => {
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

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-lg bg-gray-900 text-gray-100 ${className}`}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
    >
      {/* Header */}
      {(title || language || showCopyButton || showDownloadButton) && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2">
            {title && (
              <span className="text-sm font-medium text-gray-300">{title}</span>
            )}
            {language && language !== 'text' && (
              <span className="px-2 py-0.5 text-xs bg-gray-700 rounded text-gray-400">
                {language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showDownloadButton && (
              <button
                onClick={handleDownload}
                className="p-1.5 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
                aria-label="Download code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
            {showCopyButton && (
              <button
                onClick={handleCopy}
                className="px-2 py-1 text-xs text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
                aria-label={copied ? 'Copied!' : 'Copy code'}
              >
                {copied ? (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code content */}
      <div
        className="overflow-x-auto relative"
        style={isTallCodeBlock && !isExpanded ? { maxHeight: `${maxLines * 1.5}em` } : undefined}
      >
        <pre className="p-4 text-sm font-mono">
          <code>
            {lines.map((line, index) => (
              <div key={index} className="flex">
                {showLineNumbers && (
                  <span className="inline-block w-8 pr-4 text-right text-gray-500 select-none">
                    {index + 1}
                  </span>
                )}
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </code>
        </pre>

        {/* Gradient fade for collapsed code blocks */}
        {isTallCodeBlock && !isExpanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgb(17, 24, 39), transparent)',
            }}
          />
        )}
      </div>

      {/* Expand/Collapse button */}
      {isTallCodeBlock && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-xs text-gray-400 hover:text-white bg-gray-800 border-t border-gray-700 flex items-center justify-center gap-1"
        >
          {isExpanded ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Show less
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show all {lines.length} lines
            </>
          )}
        </button>
      )}
    </div>
  )
}
