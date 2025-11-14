'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { useTheme } from 'next-themes'
import { Check, Copy, Terminal, ExternalLink } from 'lucide-react'
import clsx from 'clsx'

interface EnhancedCodeBlockProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
  filename?: string
  sandboxUrl?: string
  editable?: boolean
  showCopyButton?: boolean
}

export function EnhancedCodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  highlightLines = [],
  className,
  filename,
  sandboxUrl,
  editable = false,
  showCopyButton = true,
}: EnhancedCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [code])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const highlightTheme = useMemo(() => {
    const isDark = theme === 'dark'
    return isDark ? themes.nightOwl : themes.nightOwlLight
  }, [theme])

  const highlightLinesSet = useMemo(() => new Set(highlightLines), [highlightLines])

  return (
    <div
      className={clsx(
        'group relative not-prose my-6 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden border border-border',
        className
      )}
    >
      {/* Enhanced Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-bg-tertiary to-bg-secondary border-b border-border">
        <div className="flex items-center gap-3">
          {filename && (
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-500" />
              <span className="font-mono text-sm font-medium text-text-primary">
                {filename}
              </span>
            </div>
          )}
          {title && !filename && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-brand-500" />
              </div>
              <span className="font-semibold text-text-primary">{title}</span>
            </div>
          )}
          {!title && !filename && (
            <span className="font-mono text-xs font-medium text-text-secondary px-2 py-1 bg-muted/50 rounded-lg">
              {language}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {sandboxUrl && (
            <a
              href={sandboxUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary"
              aria-label="Open in CodeSandbox"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>
          )}
          {showCopyButton && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary hover:shadow-sm"
              aria-label="Copy code"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400 font-semibold">
                    Copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Code */}
      <Highlight theme={highlightTheme} code={code.trim()} language={language}>
        {({
          className: highlightClassName,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={clsx(
              highlightClassName,
              'overflow-x-auto p-4 text-sm leading-relaxed',
              'bg-gradient-to-br from-bg-primary to-bg-secondary'
            )}
            style={{
              ...style,
              backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
            }}
          >
            {!title && !filename && showCopyButton && (
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-sm z-10"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-text-tertiary" />
                )}
              </button>
            )}

            <code className="font-mono">
              {tokens.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1
                const isHighlighted = highlightLinesSet.has(lineNumber)
                const lineProps = getLineProps({ line })

                return (
                  <div
                    key={lineIndex}
                    {...lineProps}
                    className={clsx(
                      lineProps.className,
                      isHighlighted &&
                        'bg-brand-500/10 border-l-4 border-brand-500 -ml-4 pl-3',
                      'px-1 rounded-sm',
                      'hover:bg-bg-tertiary/50 transition-colors'
                    )}
                  >
                    {showLineNumbers && (
                      <span className="inline-block w-10 text-right mr-4 text-text-tertiary select-none font-mono text-xs">
                        {lineNumber}
                      </span>
                    )}
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  </div>
                )
              })}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  )
}
