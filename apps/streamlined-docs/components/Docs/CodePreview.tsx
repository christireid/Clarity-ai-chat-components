'use client'

import * as React from 'react'
import { useState, useCallback } from 'react'
import { Copy, Check, FileCode, Terminal } from 'lucide-react'
import { useClipboard } from '@clarity-chat/react'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

interface CodePreviewProps {
  /** The code to display */
  code: string
  /** Language for syntax highlighting */
  language?:
    | 'tsx'
    | 'jsx'
    | 'typescript'
    | 'javascript'
    | 'bash'
    | 'json'
    | 'css'
  /** Optional title/filename */
  title?: string
  /** Show line numbers */
  showLineNumbers?: boolean
  /** Custom className */
  className?: string
  /** Whether code is collapsible */
  collapsible?: boolean
  /** Initial collapsed state */
  defaultCollapsed?: boolean
  /** Max height before scrolling */
  maxHeight?: string
  /** Highlight specific lines (1-indexed) */
  highlightLines?: number[]
}

// ============================================================================
// Syntax Highlighting
// ============================================================================

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function highlightLine(line: string, language: string): string {
  let escaped = escapeHtml(line)

  if (language === 'bash') {
    // Bash highlighting
    escaped = escaped.replace(
      /^(\s*)(#.*)$/gm,
      '$1<span class="text-[#6a9955] italic">$2</span>'
    )
    escaped = escaped.replace(
      /\b(npm|npx|pnpm|yarn|bun|git|cd|mkdir|rm|cp|mv|echo|export|source)\b/g,
      '<span class="text-[#569cd6]">$1</span>'
    )
    escaped = escaped.replace(
      /(\$\w+|\$\{\w+\})/g,
      '<span class="text-[#9cdcfe]">$1</span>'
    )
    return escaped
  }

  if (language === 'json') {
    // JSON highlighting
    escaped = escaped.replace(
      /("[\w-]+")(\s*:)/g,
      '<span class="text-[#9cdcfe]">$1</span>$2'
    )
    escaped = escaped.replace(
      /:(\s*)(".*?")/g,
      ':$1<span class="text-[#ce9178]">$2</span>'
    )
    escaped = escaped.replace(
      /:\s*(\d+)/g,
      ': <span class="text-[#b5cea8]">$1</span>'
    )
    escaped = escaped.replace(
      /:\s*(true|false|null)/g,
      ': <span class="text-[#569cd6]">$1</span>'
    )
    return escaped
  }

  if (language === 'css') {
    // CSS highlighting
    escaped = escaped.replace(
      /(\/\*[\s\S]*?\*\/)/g,
      '<span class="text-[#6a9955] italic">$1</span>'
    )
    escaped = escaped.replace(
      /([.#]?[\w-]+)(\s*\{)/g,
      '<span class="text-[#d7ba7d]">$1</span>$2'
    )
    escaped = escaped.replace(
      /([\w-]+)(\s*:)/g,
      '<span class="text-[#9cdcfe]">$1</span>$2'
    )
    return escaped
  }

  // TypeScript/JavaScript/JSX/TSX highlighting
  // Comments
  escaped = escaped.replace(
    /(\/\/.*)$/gm,
    '<span class="text-[#6a9955] italic">$1</span>'
  )

  // Strings (must be before other replacements)
  escaped = escaped.replace(
    /(`[^`]*`)/g,
    '<span class="text-[#ce9178]">$1</span>'
  )
  escaped = escaped.replace(
    /("[^"]*")/g,
    '<span class="text-[#ce9178]">$1</span>'
  )
  escaped = escaped.replace(
    /('[^']*')/g,
    '<span class="text-[#ce9178]">$1</span>'
  )

  // Keywords
  escaped = escaped.replace(
    /\b(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|new|this|async|await|try|catch|throw|typeof|instanceof|default|as|type|interface|enum|implements|private|public|protected|readonly|static|abstract|declare|namespace|module)\b/g,
    '<span class="text-[#569cd6]">$1</span>'
  )

  // Booleans/null/undefined
  escaped = escaped.replace(
    /\b(true|false|null|undefined|void|never|any|unknown|string|number|boolean|object)\b/g,
    '<span class="text-[#569cd6]">$1</span>'
  )

  // Numbers
  escaped = escaped.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-[#b5cea8]">$1</span>'
  )

  // JSX tags - component names (PascalCase)
  escaped = escaped.replace(/(&lt;\/?)([\w]+)/g, (match, bracket, tag) => {
    const color = /^[A-Z]/.test(tag) ? '#4ec9b0' : '#569cd6'
    return `${bracket}<span class="text-[${color}]">${tag}</span>`
  })

  // Function calls
  escaped = escaped.replace(
    /\b(\w+)(\s*\()/g,
    '<span class="text-[#dcdcaa]">$1</span>$2'
  )

  return escaped
}

// ============================================================================
// Main CodePreview Component
// ============================================================================

export function CodePreview({
  code,
  language = 'tsx',
  title,
  showLineNumbers = true,
  className,
  collapsible = false,
  defaultCollapsed = false,
  maxHeight = '400px',
  highlightLines = [],
}: CodePreviewProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const { copy, copied } = useClipboard({ timeout: 2000 })

  const handleCopy = useCallback(() => {
    copy(code)
  }, [copy, code])

  const lines = code.trim().split('\n')
  const lineCount = lines.length

  const getLanguageIcon = () => {
    if (language === 'bash') return <Terminal className="w-4 h-4" />
    return <FileCode className="w-4 h-4" />
  }

  const getLanguageLabel = () => {
    const labels: Record<string, string> = {
      tsx: 'TypeScript React',
      jsx: 'JavaScript React',
      typescript: 'TypeScript',
      javascript: 'JavaScript',
      bash: 'Terminal',
      json: 'JSON',
      css: 'CSS',
    }
    return labels[language] || language
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {getLanguageIcon()}
          <span>{title || getLanguageLabel()}</span>
          {lineCount > 1 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {lineCount} lines
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            >
              {isCollapsed ? 'Expand' : 'Collapse'}
            </button>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      {!isCollapsed && (
        <div className="overflow-auto bg-[#1e1e1e]" style={{ maxHeight }}>
          <pre className="p-4 text-sm font-mono text-[#d4d4d4]">
            <code className="table w-full">
              {lines.map((line, i) => {
                const lineNumber = i + 1
                const isHighlighted = highlightLines.includes(lineNumber)

                return (
                  <div
                    key={i}
                    className={cn(
                      'table-row',
                      isHighlighted && 'bg-yellow-500/10'
                    )}
                  >
                    {showLineNumbers && (
                      <span
                        className={cn(
                          'table-cell pr-4 text-right select-none w-[3ch]',
                          isHighlighted ? 'text-yellow-500' : 'text-gray-500'
                        )}
                      >
                        {lineNumber}
                      </span>
                    )}
                    <span
                      className="table-cell"
                      dangerouslySetInnerHTML={{
                        __html: highlightLine(line, language) || '&nbsp;',
                      }}
                    />
                  </div>
                )
              })}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// Inline Code Component
// ============================================================================

interface InlineCodeProps {
  children: React.ReactNode
  className?: string
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-gray-100 dark:bg-gray-800 px-[0.3rem] py-[0.2rem] font-mono text-sm text-gray-900 dark:text-gray-100',
        className
      )}
    >
      {children}
    </code>
  )
}

// ============================================================================
// Code Tabs Component (for multiple files)
// ============================================================================

interface CodeFile {
  name: string
  code: string
  language?: CodePreviewProps['language']
}

interface CodeTabsProps {
  files: CodeFile[]
  className?: string
  showLineNumbers?: boolean
  maxHeight?: string
}

export function CodeTabs({
  files,
  className,
  showLineNumbers = true,
  maxHeight = '400px',
}: CodeTabsProps) {
  const [activeFile, setActiveFile] = useState(files[0]?.name || '')
  const { copy, copied } = useClipboard({ timeout: 2000 })

  const activeFileData = files.find((f) => f.name === activeFile) || files[0]

  const handleCopy = useCallback(() => {
    if (activeFileData) {
      copy(activeFileData.code)
    }
  }, [copy, activeFileData])

  if (files.length === 0) return null

  return (
    <div
      className={cn(
        'relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden',
        className
      )}
    >
      {/* File Tabs */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          {files.map((file) => (
            <button
              key={file.name}
              onClick={() => setActiveFile(file.name)}
              className={cn(
                'px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeFile === file.name
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400 bg-white dark:bg-gray-900'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              {file.name}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center rounded-md p-2 mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Code Content */}
      {activeFileData && (
        <div className="overflow-auto bg-[#1e1e1e]" style={{ maxHeight }}>
          <pre className="p-4 text-sm font-mono text-[#d4d4d4]">
            <code className="table w-full">
              {activeFileData.code
                .trim()
                .split('\n')
                .map((line, i) => (
                  <div key={i} className="table-row">
                    {showLineNumbers && (
                      <span className="table-cell pr-4 text-right text-gray-500 select-none w-[3ch]">
                        {i + 1}
                      </span>
                    )}
                    <span
                      className="table-cell"
                      dangerouslySetInnerHTML={{
                        __html:
                          highlightLine(
                            line,
                            activeFileData.language || 'tsx'
                          ) || '&nbsp;',
                      }}
                    />
                  </div>
                ))}
            </code>
          </pre>
        </div>
      )}
    </div>
  )
}
