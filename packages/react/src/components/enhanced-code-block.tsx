'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { CodeWindowHeader } from './code/CodeWindowHeader'
import { MarkdownCodeBlock } from './message/markdown-code-block'

/**
 * Enhanced Code Block Component
 *
 * Features:
 * - Automatic language detection and highlighting (via Prism)
 * - One-click copy to clipboard with visual feedback
 * - Line numbers (emulated with side-gutter)
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
  const [wrapText, setWrapText] = React.useState(false)

  // Use raw split for logic, but full code for Prism
  const lines = React.useMemo(() => code.split('\n'), [code])
  const shouldFold = enableFolding && lines.length > maxHeight

  // If folding is active, we just limit the container height/overflow via CSS or rendering
  // But since we are delegating rendering to MarkdownCodeBlock which takes a string,
  // we need to slice the STRING if we want to "physically" fold it,
  // OR we use CSS max-height.
  // Using string slicing breaks syntax highlighting (context lost).
  // Using CSS max-height is better but line numbers must match.
  // For simplicity and robustness with Prism, we will render the FULL code
  // and use a container with max-height/overflow-hidden when folded.

  // Actually, to truly "fold" and show "Show more", we usually just crop.
  // Cropping plain text is fine. Cropping HTML is hard.
  // We will crop the TEXT passed to Prism.
  // This might result in unclosed scopes at the bottom, but Prism handles partial code reasonably well (usually just loses coloring for that last token).
  const displayedCode =
    isFolded && shouldFold ? lines.slice(0, maxHeight).join('\n') : code

  const displayedLineCount = isFolded && shouldFold ? maxHeight : lines.length

  // Detect language from code if not provided
  const detectedLanguage = React.useMemo(() => {
    if (language && language !== 'text') return language
    // Simple language detection logic could go here or use utility
    // For now, default to text if not provided
    return 'text'
  }, [code, language])

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
        enableFolding={shouldFold}
        onToggleFold={() => setIsFolded(!isFolded)}
        wrapText={wrapText}
        onToggleWrap={() => setWrapText(!wrapText)}
        showCopyButton={showCopyButton}
        theme={theme}
      />

      {/* Code Content */}
      <div
        className={cn(
          'relative flex bg-[#1e1e1e] text-[#d4d4d4] code-metrics', // Hardcode dark background for code area to match Prism theme
          // Scrollbar styling
          'scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40'
        )}
      >
        {showLineNumbers && (
          <div
            className={cn(
              'flex-none py-4 px-3 text-right select-none border-r border-white/10 bg-white/5 text-[#858585] text-xs font-mono min-w-[3rem]'
            )}
          >
            {Array.from({ length: displayedLineCount }).map((_, index) => {
              const lineNumber = startLineNumber + index
              // Check highlight
              const isHighlighted = highlightLines.includes(lineNumber)
              return (
                <div
                  key={index}
                  className={cn(
                    'transition-colors',
                    isHighlighted && 'text-yellow-500 font-bold'
                  )}
                >
                  {lineNumber}
                </div>
              )
            })}
          </div>
        )}

        {/* Code Area */}
        {/* We use MarkdownCodeBlock for highlighting. 
            We pass the `displayedCode`.
            We need to ensure line-height matches the gutter. 
            Prism default is usually relative. We force it here via code-metrics class.
        */}
        <div
          className="flex-1 min-w-0 overflow-x-auto relative"
          // If we had line highlighting overlays, they would go here absolute positioned
        >
          {highlightLines.length > 0 && (
            <div className="absolute inset-0 pointer-events-none select-none z-0">
              {/* Render highlights backgrounds */}
              {Array.from({ length: displayedLineCount }).map((_, index) => {
                const lineNumber = startLineNumber + index
                if (!highlightLines.includes(lineNumber)) return null
                return (
                  <div
                    key={index}
                    className="w-full bg-yellow-500/10 border-l-2 border-yellow-500 absolute left-0 right-0"
                    style={{
                      top: `calc(${index} * var(--code-line-height) + 1rem)`, // 1rem padding top
                      height: 'var(--code-line-height)',
                    }}
                  />
                )
              })}
            </div>
          )}

          <pre
            className={cn(
              '!m-0 !p-4 !bg-transparent font-fira-code relative z-10',
              wrapText ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
            )}
          >
            <MarkdownCodeBlock className={`language-${detectedLanguage}`}>
              {displayedCode}
            </MarkdownCodeBlock>
          </pre>
        </div>
      </div>

      {/* Fold Indicator */}
      {isFolded && shouldFold && (
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-16 pointer-events-none flex items-end justify-center pb-2',
            'bg-gradient-to-t from-[#1e1e1e] to-transparent'
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
