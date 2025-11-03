'use client'

import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { useTheme } from 'next-themes'
import { Check, Copy, Terminal } from 'lucide-react'
import clsx from 'clsx'

interface CodeBlockProps {
  code: string
  language: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isDark = theme === 'dark'
  const highlightTheme = isDark ? themes.nightOwl : themes.nightOwlLight

  return (
    <div className={clsx('group relative not-prose my-6 shadow-sm hover:shadow-md transition-all duration-200', className)}>
      {/* Header */}
      {(title || language) && (
        <div className="flex items-center justify-between px-4 py-3 bg-bg-tertiary border-b-2 border-border rounded-t-xl">
          <div className="flex items-center gap-2 text-sm">
            {title ? (
              <>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-text-primary">{title}</span>
              </>
            ) : (
              <span className="font-mono text-xs font-medium text-text-secondary px-2 py-1 bg-muted/50 rounded-lg">{language}</span>
            )}
          </div>
          
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-bg-secondary transition-all duration-200 text-xs font-medium text-text-secondary hover:text-text-primary hover:shadow-sm"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <Highlight theme={highlightTheme} code={code.trim()} language={language}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={clsx(
              highlightClassName,
              'overflow-x-auto p-4 text-sm leading-relaxed border-2 border-border',
              !title && !language && 'rounded-xl',
              (title || language) && 'rounded-b-xl border-t-0'
            )}
            style={{
              ...style,
              backgroundColor: isDark ? '#1a202c' : '#f7fafc',
            }}
          >
            {/* Copy button (no header) */}
            {!title && !language && (
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200 opacity-0 group-hover:opacity-100 hover:shadow-sm"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-text-tertiary" />
                )}
              </button>
            )}

            <code>
              {tokens.map((line, lineIndex) => {
                const lineNumber = lineIndex + 1
                const isHighlighted = highlightLines.includes(lineNumber)
                const lineProps = getLineProps({ line })

                return (
                  <div
                    key={lineIndex}
                    {...lineProps}
                    className={clsx(
                      lineProps.className,
                      isHighlighted && 'bg-brand-500/10 border-l-2 border-brand-500 -ml-4 pl-3',
                      'px-1'
                    )}
                  >
                    {showLineNumbers && (
                      <span className="inline-block w-8 text-right mr-4 text-text-tertiary select-none">
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
