'use client'

import { useState, useMemo } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  FileCode,
  FileText,
  Globe,
  Image,
  GitBranch,
  Table2,
  Braces,
  ChevronRight,
  ChevronDown,
} from 'lucide-react'
import type { ArtifactType } from '../../_shared'

interface ArtifactRendererProps {
  content: string
  type: ArtifactType
  language?: string
  className?: string
}

const languageColors: Record<string, string> = {
  typescript: 'text-blue-400',
  tsx: 'text-blue-400',
  javascript: 'text-yellow-400',
  jsx: 'text-yellow-400',
  python: 'text-green-400',
  html: 'text-red-400',
  css: 'text-purple-400',
  json: 'text-yellow-300',
  markdown: 'text-gray-400',
  mermaid: 'text-violet-400',
  svg: 'text-emerald-400',
}

const typeIcons: Record<ArtifactType, React.ReactNode> = {
  code: <FileCode className="h-3.5 w-3.5" />,
  document: <FileText className="h-3.5 w-3.5" />,
  html: <Globe className="h-3.5 w-3.5" />,
  svg: <Image className="h-3.5 w-3.5" />,
  mermaid: <GitBranch className="h-3.5 w-3.5" />,
  table: <Table2 className="h-3.5 w-3.5" />,
  json: <Braces className="h-3.5 w-3.5" />,
}

// Simple syntax highlighting for code
function highlightCode(line: string): React.ReactNode {
  const parts = line.split(
    /(\b(?:import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|async|await|new|try|catch|throw|switch|case|default|break|continue|typeof|instanceof|void|null|undefined|true|false)\b|(?:["'`])(?:(?=(?:\\?))\\.)*?(?:["'`])|\/\/.*$)/g
  )

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (
          /^(import|export|from|const|let|var|function|return|if|else|for|while|class|interface|type|extends|implements|async|await|new|try|catch|throw|switch|case|default|break|continue|typeof|instanceof|void)$/.test(
            part
          )
        ) {
          return (
            <span key={i} className="text-purple-400">
              {part}
            </span>
          )
        }
        if (/^(null|undefined|true|false)$/.test(part)) {
          return (
            <span key={i} className="text-orange-400">
              {part}
            </span>
          )
        }
        if (/^["'`]/.test(part)) {
          return (
            <span key={i} className="text-green-400">
              {part}
            </span>
          )
        }
        if (/^\/\//.test(part)) {
          return (
            <span key={i} className="text-gray-500 italic">
              {part}
            </span>
          )
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

// Render code artifact
function CodeRenderer({
  content,
  language,
}: {
  content: string
  language?: string
}) {
  const lines = content.split('\n')
  return (
    <div className="rounded-xl overflow-hidden bg-[#1e1e2e] border border-white/5">
      {/* Language badge */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-white/5">
        <FileCode
          className={cn(
            'h-3.5 w-3.5',
            languageColors[language || ''] || 'text-gray-400'
          )}
        />
        <span className="text-xs text-gray-400 font-mono">
          {language || 'code'}
        </span>
        <span className="text-[10px] text-gray-600 ml-auto">
          {lines.length} lines
        </span>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="select-none text-gray-600 text-right pr-4 w-10 shrink-0 font-mono text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span className="text-gray-200 font-mono text-xs leading-relaxed flex-1">
                  {highlightCode(line)}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  )
}

// Simple markdown renderer
function DocumentRenderer({ content }: { content: string }) {
  const rendered = useMemo(() => {
    const lines = content.split('\n')
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeBlockContent: string[] = []
    let codeBlockLang = ''
    let inList = false
    let listItems: string[] = []
    let listType: 'ul' | 'ol' = 'ul'

    const flushList = () => {
      if (listItems.length > 0) {
        const Tag = listType
        elements.push(
          <Tag
            key={`list-${elements.length}`}
            className={cn(
              'my-2 space-y-1',
              listType === 'ul' ? 'list-disc pl-6' : 'list-decimal pl-6'
            )}
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-sm text-foreground/80">
                {renderInline(item)}
              </li>
            ))}
          </Tag>
        )
        listItems = []
        inList = false
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushList()
          elements.push(
            <div
              key={`code-${i}`}
              className="my-3 rounded-lg overflow-hidden bg-[#1e1e2e] border border-white/5"
            >
              {codeBlockLang && (
                <div className="px-3 py-1.5 bg-[#181825] border-b border-white/5 text-[10px] text-gray-500 font-mono">
                  {codeBlockLang}
                </div>
              )}
              <pre className="p-3 text-xs text-gray-200 font-mono overflow-x-auto leading-relaxed">
                {codeBlockContent.join('\n')}
              </pre>
            </div>
          )
          codeBlockContent = []
          codeBlockLang = ''
          inCodeBlock = false
        } else {
          flushList()
          inCodeBlock = true
          codeBlockLang = line.slice(3).trim()
        }
        continue
      }

      if (inCodeBlock) {
        codeBlockContent.push(line)
        continue
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList()
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-2xl font-bold mt-6 mb-3 text-foreground"
          >
            {renderInline(line.slice(2))}
          </h1>
        )
        continue
      }
      if (line.startsWith('## ')) {
        flushList()
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xl font-semibold mt-5 mb-2 text-foreground"
          >
            {renderInline(line.slice(3))}
          </h2>
        )
        continue
      }
      if (line.startsWith('### ')) {
        flushList()
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-lg font-semibold mt-4 mb-2 text-foreground"
          >
            {renderInline(line.slice(4))}
          </h3>
        )
        continue
      }
      if (line.startsWith('#### ')) {
        flushList()
        elements.push(
          <h4
            key={`h4-${i}`}
            className="text-base font-semibold mt-3 mb-1 text-foreground"
          >
            {renderInline(line.slice(5))}
          </h4>
        )
        continue
      }

      // Horizontal rule
      if (/^---+$/.test(line.trim())) {
        flushList()
        elements.push(
          <hr key={`hr-${i}`} className="my-4 border-t border-border/50" />
        )
        continue
      }

      // Unordered list
      if (/^[-*]\s/.test(line.trim())) {
        if (!inList || listType !== 'ul') {
          flushList()
          inList = true
          listType = 'ul'
        }
        listItems.push(line.trim().slice(2))
        continue
      }

      // Ordered list
      if (/^\d+\.\s/.test(line.trim())) {
        if (!inList || listType !== 'ol') {
          flushList()
          inList = true
          listType = 'ol'
        }
        listItems.push(line.trim().replace(/^\d+\.\s/, ''))
        continue
      }

      // Table (simple)
      if (line.includes('|') && line.trim().startsWith('|')) {
        flushList()
        // Gather table rows
        const tableRows: string[] = [line]
        let j = i + 1
        while (
          j < lines.length &&
          lines[j].includes('|') &&
          lines[j].trim().startsWith('|')
        ) {
          tableRows.push(lines[j])
          j++
        }
        i = j - 1

        const parsedRows = tableRows
          .filter((r) => !/^[|\s:-]+$/.test(r))
          .map((r) =>
            r
              .split('|')
              .map((c) => c.trim())
              .filter(Boolean)
          )

        if (parsedRows.length > 0) {
          elements.push(
            <div
              key={`table-${i}`}
              className="my-3 overflow-x-auto rounded-lg border border-border/50"
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    {parsedRows[0].map((cell, ci) => (
                      <th
                        key={ci}
                        className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground border-b border-border/50"
                      >
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(1).map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-border/30 last:border-0"
                    >
                      {row.map((cell, ci) => (
                        <td key={ci} className="px-3 py-2 text-foreground/80">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
        continue
      }

      // Empty line
      if (line.trim() === '') {
        flushList()
        continue
      }

      // Paragraph
      flushList()
      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm text-foreground/80 my-1.5 leading-relaxed"
        >
          {renderInline(line)}
        </p>
      )
    }

    flushList()
    return elements
  }, [content])

  return <div className="p-5 space-y-0">{rendered}</div>
}

// Inline markdown rendering
function renderInline(text: string): React.ReactNode {
  // Process inline code, bold, italic, links
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Inline code
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono text-primary"
        >
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // Bold
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/)
    if (boldMatch) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {boldMatch[1]}
        </strong>
      )
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Italic
    const italicMatch = remaining.match(/^\*(.+?)\*/)
    if (italicMatch) {
      parts.push(
        <em key={key++} className="italic">
          {italicMatch[1]}
        </em>
      )
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Links
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      parts.push(
        <a
          key={key++}
          href={linkMatch[2]}
          className="text-primary underline hover:text-primary/80"
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // Plain text - take characters until we hit a special character
    const nextSpecial = remaining.search(/[`*\[]/)
    if (nextSpecial === -1) {
      parts.push(<span key={key++}>{remaining}</span>)
      break
    } else if (nextSpecial === 0) {
      // Current char is special but didn't match any pattern, just take it literally
      parts.push(<span key={key++}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    } else {
      parts.push(<span key={key++}>{remaining.slice(0, nextSpecial)}</span>)
      remaining = remaining.slice(nextSpecial)
    }
  }

  return <>{parts}</>
}

// HTML renderer - uses sandboxed iframe to prevent XSS from artifact content
function HtmlRenderer({ content }: { content: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border/50">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[10px] text-muted-foreground ml-2 font-mono">
          preview
        </span>
      </div>
      <iframe
        srcDoc={content}
        sandbox=""
        className="bg-white min-h-[200px] w-full border-0"
        title="HTML Preview"
      />
    </div>
  )
}

// SVG renderer - uses sandboxed iframe to prevent XSS from SVG content
function SvgRenderer({ content }: { content: string }) {
  const svgDoc = `<!DOCTYPE html><html><body style="display:flex;align-items:center;justify-content:center;min-height:200px;margin:0;padding:24px">${content}</body></html>`
  return (
    <div className="rounded-xl overflow-hidden border border-border/50">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
        <Image className="h-3 w-3 text-emerald-400" />
        <span className="text-[10px] text-muted-foreground font-mono">
          SVG Preview
        </span>
      </div>
      <iframe
        srcDoc={svgDoc}
        sandbox=""
        className="bg-white min-h-[200px] w-full border-0"
        title="SVG Preview"
      />
    </div>
  )
}

// Mermaid renderer (shows code with note)
function MermaidRenderer({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 text-xs">
        <GitBranch className="h-3.5 w-3.5" />
        <span>
          Mermaid diagram code. Use a Mermaid renderer to visualize this
          diagram.
        </span>
      </div>
      <div className="rounded-xl overflow-hidden bg-[#1e1e2e] border border-white/5">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-white/5">
          <GitBranch className="h-3.5 w-3.5 text-violet-400" />
          <span className="text-xs text-gray-400 font-mono">mermaid</span>
        </div>
        <pre className="p-4 text-xs text-gray-200 font-mono overflow-x-auto leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-gray-600 text-right pr-4 w-10 shrink-0">
                {i + 1}
              </span>
              <span className="flex-1">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

// Table renderer - uses sandboxed iframe to prevent XSS from table content
function TableRenderer({ content }: { content: string }) {
  const tableDoc = `<!DOCTYPE html><html><body style="margin:0;background:#0f172a;overflow-x:auto">${content}</body></html>`
  return (
    <div className="rounded-xl overflow-hidden border border-border/50">
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 border-b border-border/50">
        <Table2 className="h-3 w-3 text-blue-400" />
        <span className="text-[10px] text-muted-foreground font-mono">
          Data Table
        </span>
      </div>
      <iframe
        srcDoc={tableDoc}
        sandbox=""
        className="overflow-x-auto min-h-[150px] w-full border-0"
        title="Table Preview"
      />
    </div>
  )
}

// JSON renderer with collapse/expand
function JsonRenderer({ content }: { content: string }) {
  const [collapsedPaths, setCollapsedPaths] = useState<Set<string>>(new Set())

  const togglePath = (path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderJson = useMemo(() => {
    try {
      const parsed = JSON.parse(content)
      return renderJsonValue(parsed, '', 0, collapsedPaths, togglePath)
    } catch {
      // If invalid JSON, show as formatted text
      return <pre className="text-xs text-gray-200 font-mono">{content}</pre>
    }
  }, [content, collapsedPaths])

  return (
    <div className="rounded-xl overflow-hidden bg-[#1e1e2e] border border-white/5">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#181825] border-b border-white/5">
        <Braces className="h-3.5 w-3.5 text-yellow-300" />
        <span className="text-xs text-gray-400 font-mono">JSON</span>
      </div>
      <div className="p-4 overflow-x-auto font-mono text-xs leading-relaxed">
        {renderJson}
      </div>
    </div>
  )
}

function renderJsonValue(
  value: unknown,
  path: string,
  indent: number,
  collapsed: Set<string>,
  onToggle: (path: string) => void
): React.ReactNode {
  const pad = '  '.repeat(indent)
  const innerPad = '  '.repeat(indent + 1)

  if (value === null) return <span className="text-orange-400">null</span>
  if (typeof value === 'boolean')
    return <span className="text-orange-400">{value ? 'true' : 'false'}</span>
  if (typeof value === 'number')
    return <span className="text-cyan-400">{value}</span>
  if (typeof value === 'string')
    return <span className="text-green-400">&quot;{value}&quot;</span>

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400">[]</span>
    const isCollapsed = collapsed.has(path)
    return (
      <span>
        <button
          onClick={() => onToggle(path)}
          className="inline-flex items-center text-gray-500 hover:text-gray-300"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        <span className="text-gray-400">[</span>
        {isCollapsed ? (
          <span className="text-gray-500"> {value.length} items </span>
        ) : (
          <>
            {'\n'}
            {value.map((item, i) => (
              <span key={i}>
                {innerPad}
                {renderJsonValue(
                  item,
                  `${path}[${i}]`,
                  indent + 1,
                  collapsed,
                  onToggle
                )}
                {i < value.length - 1 ? (
                  <span className="text-gray-400">,</span>
                ) : null}
                {'\n'}
              </span>
            ))}
            {pad}
          </>
        )}
        <span className="text-gray-400">]</span>
      </span>
    )
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0)
      return <span className="text-gray-400">{'{}'}</span>
    const isCollapsed = collapsed.has(path)
    return (
      <span>
        <button
          onClick={() => onToggle(path)}
          className="inline-flex items-center text-gray-500 hover:text-gray-300"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
        <span className="text-gray-400">{'{'}</span>
        {isCollapsed ? (
          <span className="text-gray-500"> {entries.length} keys </span>
        ) : (
          <>
            {'\n'}
            {entries.map(([key, val], i) => (
              <span key={key}>
                {innerPad}
                <span className="text-purple-400">&quot;{key}&quot;</span>
                <span className="text-gray-400">: </span>
                {renderJsonValue(
                  val,
                  `${path}.${key}`,
                  indent + 1,
                  collapsed,
                  onToggle
                )}
                {i < entries.length - 1 ? (
                  <span className="text-gray-400">,</span>
                ) : null}
                {'\n'}
              </span>
            ))}
            {pad}
          </>
        )}
        <span className="text-gray-400">{'}'}</span>
      </span>
    )
  }

  return <span>{String(value)}</span>
}

export function ArtifactRenderer({
  content,
  type,
  language,
  className,
}: ArtifactRendererProps) {
  return (
    <div className={cn('w-full', className)}>
      {type === 'code' && (
        <CodeRenderer content={content} language={language} />
      )}
      {type === 'document' && <DocumentRenderer content={content} />}
      {type === 'html' && <HtmlRenderer content={content} />}
      {type === 'svg' && <SvgRenderer content={content} />}
      {type === 'mermaid' && <MermaidRenderer content={content} />}
      {type === 'table' && <TableRenderer content={content} />}
      {type === 'json' && <JsonRenderer content={content} />}
    </div>
  )
}

export { typeIcons }
