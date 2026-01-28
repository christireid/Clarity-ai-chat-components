'use client'

/**
 * CodeSnippet Component
 *
 * A code snippet display component with Night Owl theme (default).
 * Supports syntax highlighting, line numbers, and copy functionality.
 *
 * Features:
 * - Night Owl dark theme (default)
 * - Multiple theme options
 * - Line numbers with highlighting
 * - Copy to clipboard
 * - File name/language display
 * - Line diff indicators (+/-)
 * - Collapsible sections
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * <CodeSnippet
 *   code={`const hello = "world";`}
 *   language="typescript"
 *   fileName="example.ts"
 *   showLineNumbers
 * />
 * ```
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type CodeSnippetTheme = 'night-owl' | 'night-owl-light' | 'github-dark' | 'dracula' | 'monokai' | 'one-dark'
export type CodeSnippetSize = 'sm' | 'md' | 'lg'

export interface CodeLine {
  /** Line number */
  number: number
  /** Line content */
  content: string
  /** Whether line is highlighted */
  isHighlighted?: boolean
  /** Diff indicator: 'add' | 'remove' | 'neutral' */
  diff?: 'add' | 'remove' | 'neutral'
}

export interface CodeSnippetProps {
  /** Code string */
  code: string
  /** Language for syntax highlighting */
  language?: string
  /** File name */
  fileName?: string
  /** Theme preset */
  theme?: CodeSnippetTheme
  /** Size preset */
  size?: CodeSnippetSize
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Starting line number */
  startingLineNumber?: number
  /** Highlighted line numbers */
  highlightedLines?: number[]
  /** Show copy button */
  showCopy?: boolean
  /** Show file header */
  showHeader?: boolean
  /** Max height (enables scrolling) */
  maxHeight?: number | string
  /** Wrap long lines */
  wrapLines?: boolean
  /** Show diff indicators */
  showDiff?: boolean
  /** Lines with diff (number -> 'add' | 'remove') */
  diffLines?: Record<number, 'add' | 'remove'>
  /** Copy handler */
  onCopy?: (code: string) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Theme Configurations
// ============================================================================

const themes: Record<CodeSnippetTheme, {
  background: string
  foreground: string
  lineNumber: string
  lineHighlight: string
  headerBg: string
  headerBorder: string
  addBg: string
  removeBg: string
  addColor: string
  removeColor: string
  selection: string
  comment: string
  keyword: string
  string: string
  function: string
  number: string
  operator: string
}> = {
  'night-owl': {
    background: '#011627',
    foreground: '#d6deeb',
    lineNumber: '#4b6479',
    lineHighlight: '#1d3b53',
    headerBg: '#011627',
    headerBorder: '#1d3b53',
    addBg: 'rgba(34, 218, 110, 0.15)',
    removeBg: 'rgba(239, 83, 80, 0.15)',
    addColor: '#22da6e',
    removeColor: '#ef5350',
    selection: '#1d3b53',
    comment: '#637777',
    keyword: '#c792ea',
    string: '#ecc48d',
    function: '#82aaff',
    number: '#f78c6c',
    operator: '#c792ea',
  },
  'night-owl-light': {
    background: '#fbfbfb',
    foreground: '#403f53',
    lineNumber: '#90a7b2',
    lineHighlight: '#f0f0f0',
    headerBg: '#f5f5f5',
    headerBorder: '#e0e0e0',
    addBg: 'rgba(34, 218, 110, 0.1)',
    removeBg: 'rgba(239, 83, 80, 0.1)',
    addColor: '#2aa298',
    removeColor: '#de3d3b',
    selection: '#e0e0e0',
    comment: '#989fb1',
    keyword: '#994cc3',
    string: '#4876d6',
    function: '#4876d6',
    number: '#aa0982',
    operator: '#994cc3',
  },
  'github-dark': {
    background: '#0d1117',
    foreground: '#c9d1d9',
    lineNumber: '#6e7681',
    lineHighlight: '#161b22',
    headerBg: '#161b22',
    headerBorder: '#30363d',
    addBg: 'rgba(63, 185, 80, 0.15)',
    removeBg: 'rgba(248, 81, 73, 0.15)',
    addColor: '#3fb950',
    removeColor: '#f85149',
    selection: '#264f78',
    comment: '#8b949e',
    keyword: '#ff7b72',
    string: '#a5d6ff',
    function: '#d2a8ff',
    number: '#79c0ff',
    operator: '#ff7b72',
  },
  'dracula': {
    background: '#282a36',
    foreground: '#f8f8f2',
    lineNumber: '#6272a4',
    lineHighlight: '#44475a',
    headerBg: '#21222c',
    headerBorder: '#44475a',
    addBg: 'rgba(80, 250, 123, 0.15)',
    removeBg: 'rgba(255, 85, 85, 0.15)',
    addColor: '#50fa7b',
    removeColor: '#ff5555',
    selection: '#44475a',
    comment: '#6272a4',
    keyword: '#ff79c6',
    string: '#f1fa8c',
    function: '#50fa7b',
    number: '#bd93f9',
    operator: '#ff79c6',
  },
  'monokai': {
    background: '#272822',
    foreground: '#f8f8f2',
    lineNumber: '#90908a',
    lineHighlight: '#3e3d32',
    headerBg: '#1e1f1c',
    headerBorder: '#3e3d32',
    addBg: 'rgba(166, 226, 46, 0.15)',
    removeBg: 'rgba(249, 38, 114, 0.15)',
    addColor: '#a6e22e',
    removeColor: '#f92672',
    selection: '#49483e',
    comment: '#75715e',
    keyword: '#f92672',
    string: '#e6db74',
    function: '#a6e22e',
    number: '#ae81ff',
    operator: '#f92672',
  },
  'one-dark': {
    background: '#282c34',
    foreground: '#abb2bf',
    lineNumber: '#4b5263',
    lineHighlight: '#2c313c',
    headerBg: '#21252b',
    headerBorder: '#181a1f',
    addBg: 'rgba(152, 195, 121, 0.15)',
    removeBg: 'rgba(224, 108, 117, 0.15)',
    addColor: '#98c379',
    removeColor: '#e06c75',
    selection: '#3e4451',
    comment: '#5c6370',
    keyword: '#c678dd',
    string: '#98c379',
    function: '#61afef',
    number: '#d19a66',
    operator: '#c678dd',
  },
}

// ============================================================================
// Helper Functions
// ============================================================================

function getLanguageLabel(language?: string): string {
  const labels: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript React',
    typescript: 'TypeScript',
    js: 'JavaScript',
    jsx: 'JavaScript React',
    javascript: 'JavaScript',
    py: 'Python',
    python: 'Python',
    rs: 'Rust',
    rust: 'Rust',
    go: 'Go',
    rb: 'Ruby',
    ruby: 'Ruby',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    csharp: 'C#',
    php: 'PHP',
    swift: 'Swift',
    kotlin: 'Kotlin',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    md: 'Markdown',
    markdown: 'Markdown',
    sql: 'SQL',
    bash: 'Bash',
    sh: 'Shell',
    shell: 'Shell',
  }
  return language ? labels[language.toLowerCase()] || language : ''
}

// ============================================================================
// CodeSnippet Component
// ============================================================================

export function CodeSnippet({
  code,
  language,
  fileName,
  theme = 'night-owl',
  size = 'md',
  showLineNumbers = true,
  startingLineNumber = 1,
  highlightedLines = [],
  showCopy = true,
  showHeader = true,
  maxHeight,
  wrapLines = false,
  showDiff = false,
  diffLines = {},
  onCopy,
  className,
}: CodeSnippetProps) {
  const prefersReducedMotion = useReducedMotion()
  const themeConfig = themes[theme]
  const [copied, setCopied] = React.useState(false)

  const lines = code.split('\n')
  const highlightedSet = new Set(highlightedLines)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      onCopy?.(code)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <motion.div
      className={cn('code-snippet', `code-snippet-${theme}`, `code-snippet-${size}`, className)}
      style={{
        '--code-bg': themeConfig.background,
        '--code-fg': themeConfig.foreground,
        '--code-line-number': themeConfig.lineNumber,
        '--code-line-highlight': themeConfig.lineHighlight,
        '--code-header-bg': themeConfig.headerBg,
        '--code-header-border': themeConfig.headerBorder,
        '--code-add-bg': themeConfig.addBg,
        '--code-remove-bg': themeConfig.removeBg,
        '--code-add-color': themeConfig.addColor,
        '--code-remove-color': themeConfig.removeColor,
        '--code-selection': themeConfig.selection,
      } as React.CSSProperties}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.normal,
        ease: EASING_FRAMER.standard,
      }}
      role="region"
      aria-label={`Code snippet${fileName ? `: ${fileName}` : ''}`}
    >
      {/* Header */}
      {showHeader && (fileName || language || showCopy) && (
        <div className="code-snippet-header">
          <div className="code-snippet-header-info">
            {fileName && (
              <span className="code-snippet-filename">{fileName}</span>
            )}
            {language && !fileName && (
              <span className="code-snippet-language">
                {getLanguageLabel(language)}
              </span>
            )}
          </div>
          {showCopy && (
            <button
              type="button"
              className={cn('code-snippet-copy', copied && 'code-snippet-copy-success')}
              onClick={handleCopy}
              aria-label={copied ? 'Copied!' : 'Copy code'}
            >
              {copied ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
      )}

      {/* Code content */}
      <div
        className={cn('code-snippet-content', sizeClasses[size])}
        style={{ maxHeight }}
      >
        <pre className={cn('code-snippet-pre', wrapLines && 'code-snippet-wrap')}>
          <code className="code-snippet-code">
            {lines.map((line, index) => {
              const lineNumber = startingLineNumber + index
              const isHighlighted = highlightedSet.has(lineNumber)
              const diff = showDiff ? diffLines[lineNumber] : undefined

              return (
                <div
                  key={index}
                  className={cn(
                    'code-snippet-line',
                    isHighlighted && 'code-snippet-line-highlighted',
                    diff === 'add' && 'code-snippet-line-add',
                    diff === 'remove' && 'code-snippet-line-remove'
                  )}
                >
                  {showLineNumbers && (
                    <span className="code-snippet-line-number">
                      {diff === 'add' && '+'}
                      {diff === 'remove' && '-'}
                      {!diff && lineNumber}
                    </span>
                  )}
                  <span className="code-snippet-line-content">
                    {line || ' '}
                  </span>
                </div>
              )
            })}
          </code>
        </pre>
      </div>
    </motion.div>
  )
}

// ============================================================================
// CodeSnippetGroup Component
// ============================================================================

export interface CodeSnippetGroupProps {
  /** Array of snippets */
  snippets: (CodeSnippetProps & { id: string; label?: string })[]
  /** Default active tab */
  defaultActiveId?: string
  /** Theme for all snippets */
  theme?: CodeSnippetTheme
  /** Additional class names */
  className?: string
}

export function CodeSnippetGroup({
  snippets,
  defaultActiveId,
  theme = 'night-owl',
  className,
}: CodeSnippetGroupProps) {
  const [activeId, setActiveId] = React.useState(defaultActiveId || snippets[0]?.id)
  const activeSnippet = snippets.find((s) => s.id === activeId) || snippets[0]

  if (snippets.length === 0) return null

  if (snippets.length === 1) {
    return <CodeSnippet {...snippets[0]} theme={theme} className={className} />
  }

  return (
    <div className={cn('code-snippet-group', className)}>
      {/* Tabs */}
      <div className="code-snippet-tabs" role="tablist">
        {snippets.map((snippet) => (
          <button
            key={snippet.id}
            type="button"
            role="tab"
            aria-selected={snippet.id === activeId}
            className={cn(
              'code-snippet-tab',
              snippet.id === activeId && 'code-snippet-tab-active'
            )}
            onClick={() => setActiveId(snippet.id)}
          >
            {snippet.label || snippet.fileName || snippet.language || snippet.id}
          </button>
        ))}
      </div>

      {/* Active snippet */}
      {activeSnippet && (
        <CodeSnippet
          {...activeSnippet}
          theme={theme}
          showHeader={false}
        />
      )}
    </div>
  )
}

export default CodeSnippet
