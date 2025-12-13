'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { CodeWindowHeader } from './code/CodeWindowHeader'

/**
 * Enhanced Code Block Component
 * 
 * Features:
 * - Automatic language detection and highlighting
 * - One-click copy to clipboard with visual feedback
 * - Line numbers
 * - Code folding
 * - Word wrap toggle
 * - Download code as file
 * - Mac-like window controls (visual)
 * - Custom themes
 * 
 * @example
 * ```tsx
 * <EnhancedCodeBlock
 *   code={codeString}
 *   language="typescript"
 *   showLineNumbers
 *   enableFolding
 *   theme="dark"
 * />
 * ```
 */
export interface EnhancedCodeBlockProps {
  /** Code content to display */
  code: string
  /** Programming language */
  language?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Enable code folding */
  enableFolding?: boolean
  /** Initial folded state */
  initiallyFolded?: boolean
  /** Custom theme */
  theme?: 'light' | 'dark' | 'auto'
  /** Maximum height before folding (in lines) */
  maxHeight?: number
  /** Show copy button */
  showCopyButton?: boolean
  /** Custom className */
  className?: string
  /** Filename (optional) */
  filename?: string
  /** Enable line highlighting */
  highlightLines?: number[]
  /** Starting line number */
  startLineNumber?: number
}

export function EnhancedCodeBlock({
  code,
  language = 'text',
  showLineNumbers = true,
  enableFolding = true,
  initiallyFolded = false,
  theme = 'dark',
  maxHeight = 20,
  showCopyButton = true,
  className,
  filename,
  highlightLines = [],
  startLineNumber = 1,
}: EnhancedCodeBlockProps) {
  const [isFolded, setIsFolded] = React.useState(initiallyFolded)
  const [hoveredLine, setHoveredLine] = React.useState<number | null>(null)
  const [wrapText, setWrapText] = React.useState(false)

  const lines = code.split('\n')
  const shouldFold = enableFolding && lines.length > maxHeight
  const displayLines = isFolded && shouldFold ? lines.slice(0, maxHeight) : lines

  // Detect language from code if not provided
  const detectedLanguage = React.useMemo(() => {
    if (language && language !== 'text') return language

    // Simple language detection based on common patterns
    if (code.includes('function') && code.includes('=>')) return 'javascript'
    if (code.includes('def ') && code.includes('import ')) return 'python'
    if (code.includes('interface') || code.includes('type ')) return 'typescript'
    if (code.includes('class ') && code.includes('public ')) return 'java'
    if (code.includes('<?php')) return 'php'
    if (code.includes('def ') && !code.includes('import ')) return 'ruby'
    if (code.includes('package main') && code.includes('func ')) return 'go'
    if (code.includes('use std::')) return 'rust'

    return 'text'
  }, [code, language])

  const handleToggleFold = () => {
    setIsFolded(!isFolded)
  }

  const getLineClassName = (lineNumber: number) => {
    return cn(
      'px-4 py-0.5 text-sm font-mono transition-colors duration-150',
      highlightLines.includes(lineNumber) && 'bg-yellow-500/10 border-l-2 border-yellow-500',
      hoveredLine === lineNumber && !highlightLines.includes(lineNumber) && 'bg-muted/30'
    )
  }

  return (
    <div
      className={cn(
        'relative rounded-xl border shadow-sm overflow-hidden group/code-block my-4',
        theme === 'dark' && 'bg-[#1e1e1e] border-[#333]',
        theme === 'light' && 'bg-[#ffffff] border-gray-200',
        className
      )}
    >
      <CodeWindowHeader 
        codeString={code}
        language={detectedLanguage}
        filename={filename}
        isFolded={isFolded}
        enableFolding={shouldFold} // Only show fold button if it should fold
        onToggleFold={handleToggleFold}
        wrapText={wrapText}
        onToggleWrap={() => setWrapText(!wrapText)}
        showCopyButton={showCopyButton}
        theme={theme}
      />

      {/* Code Content */}
      <div className={cn(
        "relative",
        // Scrollbar styling class would be added here via global CSS or Tailwind plugin
        "scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40"
      )}>
        <pre
          className={cn(
            'm-0 p-0 font-fira-code', // Using the font defined in CSS
            theme === 'dark' && 'text-[#d4d4d4]',
            theme === 'light' && 'text-[#24292e]',
            'overflow-x-auto'
          )}
        >
          <code className={cn(
            'block', 
            `language-${detectedLanguage}`,
            wrapText ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
          )}>
            {showLineNumbers ? (
              <div className="flex min-w-full">
                {/* Line Numbers */}
                <div
                  className={cn(
                    'select-none text-right pr-4 pl-4 py-3 text-xs font-mono sticky left-0 z-10',
                    theme === 'dark' ? 'text-[#858585] bg-[#1e1e1e]' : 'text-[#6a737d] bg-white',
                    'border-r border-border/50'
                  )}
                >
                  {displayLines.map((_, index) => {
                    const lineNumber = startLineNumber + index
                    return (
                      <div
                        key={index}
                        className="leading-relaxed opacity-60"
                        style={{ height: '1.5rem' }} // Fixed line height for alignment
                      >
                        {lineNumber}
                      </div>
                    )
                  })}
                </div>

                {/* Code Lines */}
                <div className="flex-1 min-w-0 py-3">
                  {displayLines.map((line, index) => {
                    const lineNumber = startLineNumber + index
                    return (
                      <div
                        key={index}
                        className={getLineClassName(lineNumber)}
                        onMouseEnter={() => setHoveredLine(lineNumber)}
                        onMouseLeave={() => setHoveredLine(null)}
                        style={{ minHeight: '1.5rem', lineHeight: '1.5rem' }}
                      >
                        {line || '\u00A0'}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="px-4 py-3">
                {displayLines.map((line, index) => (
                  <div
                    key={index}
                    className={getLineClassName(startLineNumber + index)}
                    style={{ minHeight: '1.5rem', lineHeight: '1.5rem' }}
                  >
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            )}
          </code>
        </pre>
      </div>

      {/* Fold Indicator */}
      {isFolded && shouldFold && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex items-end justify-center pb-2",
            theme === 'dark' 
              ? "bg-gradient-to-t from-[#1e1e1e] to-transparent" 
              : "bg-gradient-to-t from-white to-transparent"
          )}
        >
          <span className="text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full border shadow-sm backdrop-blur-sm">
            {lines.length - maxHeight} more lines...
          </span>
        </div>
      )}
    </div>
  )
}

EnhancedCodeBlock.displayName = 'EnhancedCodeBlock'

/**
 * Hook for code block configuration
 */
export interface UseCodeBlockConfigOptions {
  /** Default language */
  defaultLanguage?: string
  /** Default theme */
  defaultTheme?: 'light' | 'dark' | 'auto'
  /** Show line numbers by default */
  defaultShowLineNumbers?: boolean
  /** Enable folding by default */
  defaultEnableFolding?: boolean
  /** Maximum height before folding */
  defaultMaxHeight?: number
}

export function useCodeBlockConfig(options: UseCodeBlockConfigOptions = {}) {
  const {
    defaultLanguage = 'text',
    defaultTheme = 'dark',
    defaultShowLineNumbers = true,
    defaultEnableFolding = true,
    defaultMaxHeight = 20,
  } = options

  return {
    language: defaultLanguage,
    theme: defaultTheme,
    showLineNumbers: defaultShowLineNumbers,
    enableFolding: defaultEnableFolding,
    maxHeight: defaultMaxHeight,
  }
}
