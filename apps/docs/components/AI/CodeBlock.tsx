'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Copy, Terminal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import Prism from 'prismjs'

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
  const codeRef = useRef<HTMLElement>(null)

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  const lines = code.split('\n')
  const highlightedLines = highlightedCode.split('\n')

  return (
    <div
      className={cn(
        'rounded-lg border border-border overflow-hidden',
        'bg-muted/50',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          {filename ? (
            <span className="text-sm font-medium">{filename}</span>
          ) : (
            <span className="text-sm text-muted-foreground">{language}</span>
          )}
        </div>

        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
            'transition-all duration-200',
            copied
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
              : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
          )}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Code */}
      <div className="relative overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code
            ref={codeRef}
            className={cn('block', `language-${language}`)}
          >
            {showLineNumbers ? (
              <div className="grid" style={{ gridTemplateColumns: 'auto 1fr' }}>
                {lines.map((line, index) => {
                  const lineNumber = index + 1
                  const isHighlighted = highlightLines.includes(lineNumber)
                  const highlightedLine = highlightedLines[index] || line

                  return (
                    <div
                      key={index}
                      className={cn(
                        'contents',
                        isHighlighted && 'bg-primary/5'
                      )}
                    >
                      {/* Line number */}
                      <span
                        className={cn(
                          'select-none pr-4 text-muted-foreground/50',
                          'text-right tabular-nums',
                          isHighlighted && 'text-primary/70 font-semibold'
                        )}
                      >
                        {lineNumber}
                      </span>

                      {/* Code line with syntax highlighting */}
                      <span
                        className={cn(
                          isHighlighted &&
                            'bg-primary/5 border-l-2 border-primary pl-2 -ml-2'
                        )}
                        dangerouslySetInnerHTML={{ __html: highlightedLine || '\n' }}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: highlightedCode || code }} />
            )}
          </code>
        </pre>
      </div>
    </div>
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
  const blocks: Array<{ type: 'code' | 'text'; content: string; language?: string }> = []
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
