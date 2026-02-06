'use client'

import { useState, useMemo, useCallback } from 'react'
import { cn } from '@clarity-chat/primitives'
import { CodeBlock, MarkdownRenderer } from '@clarity-chat/react'
import {
  ChevronRight,
  ChevronDown,
  Image,
  GitBranch,
  Table2,
  Braces,
} from 'lucide-react'
import type { ArtifactType } from '../../_shared'
import { ARTIFACT_TYPE_ICONS } from './artifact-data'

interface ArtifactRendererProps {
  content: string
  type: ArtifactType
  language?: string
  className?: string
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
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 text-violet-400 text-xs">
        <GitBranch className="h-3.5 w-3.5" />
        <span>
          Mermaid diagram code. Use a Mermaid renderer to visualize this
          diagram.
        </span>
      </div>
      <CodeBlock language="mermaid" showLineNumbers>
        {content}
      </CodeBlock>
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

  const togglePath = useCallback((path: string) => {
    setCollapsedPaths((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }, [])

  const renderJson = useMemo(() => {
    try {
      const parsed = JSON.parse(content)
      return renderJsonValue(parsed, '', 0, collapsedPaths, togglePath)
    } catch {
      // If invalid JSON, show as formatted text
      return <pre className="text-xs text-gray-200 font-mono">{content}</pre>
    }
  }, [content, collapsedPaths, togglePath])

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
        <CodeBlock language={language} showLineNumbers>
          {content}
        </CodeBlock>
      )}
      {type === 'document' && <MarkdownRenderer content={content} />}
      {type === 'html' && <HtmlRenderer content={content} />}
      {type === 'svg' && <SvgRenderer content={content} />}
      {type === 'mermaid' && <MermaidRenderer content={content} />}
      {type === 'table' && <TableRenderer content={content} />}
      {type === 'json' && <JsonRenderer content={content} />}
    </div>
  )
}

export { ARTIFACT_TYPE_ICONS as typeIcons }
