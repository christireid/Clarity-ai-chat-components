'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Check,
  Copy,
  Terminal,
  Download,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Prism from 'prismjs'
import {
  fadeInUp,
  buttonAnimation,
  springs,
  confettiParticles,
  durations,
} from '@/lib/animations'
import { toast, toastMessages } from '@/lib/toast'

// Import language support
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'

export interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  className?: string
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedCode, setHighlightedCode] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set())
  const codeRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse URL hash for line highlighting (#L10-L15)
  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#L')) {
      const match = hash.match(/#L(\d+)(?:-L(\d+))?/)
      if (match) {
        const start = parseInt(match[1])
        const end = match[2] ? parseInt(match[2]) : start
        const lines = Array.from(
          { length: end - start + 1 },
          (_, i) => start + i
        )
        setSelectedLines(new Set(lines))

        // Scroll to first selected line after a short delay
        setTimeout(() => {
          const lineElement = containerRef.current?.querySelector(
            `[data-line-number="${start}"]`
          )
          if (lineElement) {
            lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }, 100)
      }
    }
  }, [])

  // Highlight code with Prism
  useEffect(() => {
    try {
      const grammar = Prism.languages[language] || Prism.languages.typescript
      const highlighted = Prism.highlight(code, grammar, language)
      setHighlightedCode(highlighted)
    } catch (error) {
      console.error('Prism highlighting error:', error)
      setHighlightedCode(code)
    }
  }, [code, language])

  const handleCopy = useCallback(async () => {
    try {
      let textToCopy = code

      // If lines are selected, copy only selected lines
      if (selectedLines.size > 0) {
        const lines = code.split('\n')
        const sortedLines = Array.from(selectedLines).sort((a, b) => a - b)
        textToCopy = sortedLines.map((lineNum) => lines[lineNum - 1]).join('\n')
      }

      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)

      if (selectedLines.size > 0) {
        toast.success(
          `Copied ${selectedLines.size} line${selectedLines.size > 1 ? 's' : ''}`,
          {
            description: 'Selected lines copied to clipboard',
          }
        )
      } else {
        toast.success(toastMessages.copied)
      }

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
      toast.error(toastMessages.copyFailed, {
        action: {
          label: 'Try again',
          onClick: () => handleCopy(),
        },
      })
    }
  }, [code, selectedLines])

  const handleDownload = useCallback(() => {
    try {
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `code.${language}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Downloaded ${filename || `code.${language}`}`)
    } catch (error) {
      console.error('Failed to download code:', error)
      toast.error('Failed to download code', {
        action: {
          label: 'Retry',
          onClick: () => handleDownload(),
        },
      })
    }
  }, [code, filename, language])

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev)
  }, [])

  // Handle line selection
  const handleLineClick = useCallback(
    (lineNumber: number, event: React.MouseEvent) => {
      event.preventDefault()

      setSelectedLines((prev) => {
        const newSelection = new Set(prev)

        if (event.shiftKey && newSelection.size > 0) {
          // Range selection
          const lines = Array.from(newSelection)
          const min = Math.min(...lines, lineNumber)
          const max = Math.max(...lines, lineNumber)

          // Clear and add range
          newSelection.clear()
          for (let i = min; i <= max; i++) {
            newSelection.add(i)
          }
        } else if (event.metaKey || event.ctrlKey) {
          // Toggle individual line
          if (newSelection.has(lineNumber)) {
            newSelection.delete(lineNumber)
          } else {
            newSelection.add(lineNumber)
          }
        } else {
          // Single selection (replace)
          newSelection.clear()
          newSelection.add(lineNumber)
        }

        // Update URL hash
        updateUrlHash(newSelection)

        return newSelection
      })
    },
    []
  )

  // Update URL hash based on selection
  const updateUrlHash = useCallback((lines: Set<number>) => {
    if (lines.size === 0) {
      // Clear hash if no selection
      if (window.location.hash.startsWith('#L')) {
        history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        )
      }
      return
    }

    const sortedLines = Array.from(lines).sort((a, b) => a - b)

    // Check if it's a continuous range
    let isRange = true
    for (let i = 1; i < sortedLines.length; i++) {
      if (sortedLines[i] !== sortedLines[i - 1] + 1) {
        isRange = false
        break
      }
    }

    // Create hash
    let hash
    if (isRange && sortedLines.length > 1) {
      hash = `#L${sortedLines[0]}-L${sortedLines[sortedLines.length - 1]}`
    } else if (sortedLines.length === 1) {
      hash = `#L${sortedLines[0]}`
    } else {
      // Multiple non-continuous lines - just use first and last
      hash = `#L${sortedLines[0]}-L${sortedLines[sortedLines.length - 1]}`
    }

    history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search + hash
    )
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      // Cmd/Ctrl+A to select all lines
      if ((e.metaKey || e.ctrlKey) && e.key === 'a' && showLineNumbers) {
        e.preventDefault()
        const allLines = new Set(
          Array.from({ length: lines.length }, (_, i) => i + 1)
        )
        setSelectedLines(allLines)
        updateUrlHash(allLines)
      }
      // Escape to clear selection
      else if (e.key === 'Escape' && selectedLines.size > 0) {
        e.preventDefault()
        setSelectedLines(new Set())
        updateUrlHash(new Set())
      }
      // Cmd/Ctrl+Shift+C to copy (or Cmd/Ctrl+C for selected lines)
      else if (
        (e.metaKey || e.ctrlKey) &&
        e.key === 'c' &&
        (e.shiftKey || selectedLines.size > 0)
      ) {
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
        toggleExpanded()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    handleCopy,
    handleDownload,
    toggleExpanded,
    selectedLines,
    showLineNumbers,
    lines.length,
    updateUrlHash,
  ])

  const lines = code.split('\n')
  const highlightedLines = highlightedCode.split('\n')
  const isTallCodeBlock = lines.length > 20

  return (
    <motion.div
      ref={containerRef}
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={springs.smooth}
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        'bg-muted/50 shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, ...springs.bouncy }}
          >
            <Terminal className="w-4 h-4 text-muted-foreground" />
          </motion.div>
          {filename ? (
            <span className="text-sm font-medium">{filename}</span>
          ) : (
            <span className="text-sm text-muted-foreground">{language}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Copy button */}
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
              'transition-all duration-200',
              copied
                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
            )}
            aria-label="Copy code (⌘⇧C)"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Download button */}
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground"
            aria-label="Download code (⌘⇧D)"
          >
            <Download className="w-3.5 h-3.5" />
          </motion.button>

          {/* Expand/Collapse button (only for tall code blocks) */}
          {isTallCodeBlock && (
            <motion.button
              onClick={toggleExpanded}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-accent-foreground"
              aria-label={
                isExpanded ? 'Collapse code (⌘⇧E)' : 'Expand code (⌘⇧E)'
              }
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="minimize"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="maximize"
                    initial={{ scale: 0, rotate: 90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -90 }}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      </div>

      {/* Code */}
      <motion.div
        animate={{
          maxHeight: isExpanded ? 'none' : isTallCodeBlock ? '500px' : 'none',
        }}
        transition={{
          duration: durations.moderate,
          ease: [0.25, 0.1, 0.25, 1],
        }}
        className={cn(
          'relative overflow-x-auto',
          isTallCodeBlock && !isExpanded && 'overflow-y-hidden'
        )}
      >
        <pre className="p-4 text-sm leading-relaxed">
          <code ref={codeRef} className={cn('block', `language-${language}`)}>
            {showLineNumbers ? (
              <div className="grid" style={{ gridTemplateColumns: 'auto 1fr' }}>
                {lines.map((line, index) => {
                  const lineNumber = index + 1
                  const isHighlighted = highlightLines.includes(lineNumber)
                  const highlightedLine = highlightedLines[index] || line

                  const isSelected = selectedLines.has(lineNumber)

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.005,
                        duration: durations.normal,
                      }}
                      className={cn(
                        'contents group/line',
                        (isHighlighted || isSelected) && 'bg-primary/5'
                      )}
                      data-line-number={lineNumber}
                    >
                      {/* Line number - clickable */}
                      <span
                        onClick={(e) => handleLineClick(lineNumber, e)}
                        className={cn(
                          'select-none pr-4 text-muted-foreground/50',
                          'text-right tabular-nums cursor-pointer',
                          'hover:text-primary transition-colors',
                          'group-hover/line:bg-accent/30',
                          isHighlighted && 'text-primary/70 font-semibold',
                          isSelected && 'text-primary font-bold bg-primary/10'
                        )}
                        title="Click to select line. Cmd/Ctrl+Click for multi-select. Shift+Click for range."
                      >
                        {lineNumber}
                      </span>

                      {/* Code line with syntax highlighting */}
                      <span
                        onClick={(e) => handleLineClick(lineNumber, e)}
                        className={cn(
                          'transition-colors duration-150 cursor-pointer',
                          'hover:bg-accent/20 group-hover/line:bg-accent/10',
                          isHighlighted &&
                            'bg-primary/5 border-l-2 border-primary pl-2 -ml-2',
                          isSelected &&
                            'bg-brand-500/10 border-l-4 border-brand-500 pl-3 -ml-3 font-medium'
                        )}
                        dangerouslySetInnerHTML={{
                          __html: highlightedLine || '\n',
                        }}
                      />
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <span
                dangerouslySetInnerHTML={{ __html: highlightedCode || code }}
              />
            )}
          </code>
        </pre>

        {/* Gradient fade for collapsed code blocks */}
        {isTallCodeBlock && !isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-muted/80 to-transparent pointer-events-none"
          />
        )}
      </motion.div>
    </motion.div>
  )
}

/**
 * Inline code snippet
 */
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <code
      className={cn(
        'px-1.5 py-0.5 rounded',
        'bg-muted text-foreground',
        'font-mono text-sm',
        'border border-border',
        className
      )}
    >
      {children}
    </code>
  )
}

/**
 * Parse markdown code blocks from text
 */
export function parseCodeBlocks(text: string): Array<{
  type: 'code' | 'text'
  content: string
  language?: string
}> {
  const blocks: Array<{
    type: 'code' | 'text'
    content: string
    language?: string
  }> = []
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = text.slice(lastIndex, match.index)
      if (textContent.trim()) {
        blocks.push({ type: 'text', content: textContent })
      }
    }

    // Add code block
    blocks.push({
      type: 'code',
      content: match[2].trim(),
      language: match[1] || 'typescript',
    })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textContent = text.slice(lastIndex)
    if (textContent.trim()) {
      blocks.push({ type: 'text', content: textContent })
    }
  }

  return blocks
}

/**
 * Render text with code blocks
 */
export function RenderWithCodeBlocks({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const blocks = parseCodeBlocks(content)

  if (blocks.length === 0) {
    return <div className={className}>{content}</div>
  }

  return (
    <div className={cn('space-y-4', className)}>
      {blocks.map((block, index) => {
        if (block.type === 'code') {
          return (
            <CodeBlock
              key={index}
              code={block.content}
              language={block.language}
            />
          )
        }

        // Render text with inline code support
        return (
          <div
            key={index}
            className="prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html: renderInlineCode(block.content),
            }}
          />
        )
      })}
    </div>
  )
}

/**
 * Render inline code snippets in text
 */
function renderInlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
}

/**
 * Get language display name
 */
export function getLanguageDisplayName(lang: string): string {
  const names: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript (JSX)',
    js: 'JavaScript',
    jsx: 'JavaScript (JSX)',
    py: 'Python',
    python: 'Python',
    rs: 'Rust',
    rust: 'Rust',
    go: 'Go',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    cs: 'C#',
    rb: 'Ruby',
    php: 'PHP',
    swift: 'Swift',
    kt: 'Kotlin',
    sql: 'SQL',
    sh: 'Shell',
    bash: 'Bash',
    yml: 'YAML',
    yaml: 'YAML',
    json: 'JSON',
    xml: 'XML',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    md: 'Markdown',
    mdx: 'MDX',
  }

  return names[lang.toLowerCase()] || lang.toUpperCase()
}
