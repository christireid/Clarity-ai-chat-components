'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Search,
  Code,
  Link,
  Calculator,
  Image,
  BarChart3,
  ChevronDown,
  Loader2,
  Check,
  AlertCircle,
  Clock,
  Wrench,
} from 'lucide-react'
import { type ToolExecution } from '../../../_shared'

interface ToolCardsProps {
  tools: ToolExecution[]
  className?: string
}

const toolMeta: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  web_search: {
    icon: Search,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Web Search',
  },
  code_interpreter: {
    icon: Code,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: 'Code Interpreter',
  },
  url_reader: {
    icon: Link,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    label: 'URL Reader',
  },
  calculator: {
    icon: Calculator,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: 'Calculator',
  },
  image_analyzer: {
    icon: Image,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    label: 'Image Analyzer',
  },
  data_visualizer: {
    icon: BarChart3,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
    label: 'Data Visualizer',
  },
  image_search: {
    icon: Image,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    label: 'Image Search',
  },
  run_python: {
    icon: Code,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    label: 'Run Python',
  },
  run_javascript: {
    icon: Code,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    label: 'Run JavaScript',
  },
  query_db: {
    icon: Search,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: 'Query Database',
  },
  read_file: {
    icon: Link,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    label: 'Read File',
  },
  list_dir: {
    icon: Link,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10',
    label: 'List Directory',
  },
}

const defaultToolMeta = {
  icon: Wrench,
  color: 'text-gray-500',
  bgColor: 'bg-gray-500/10',
  label: 'Tool',
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3 text-muted-foreground" />,
  running: <Loader2 className="h-3 w-3 animate-spin text-blue-500" />,
  completed: <Check className="h-3 w-3 text-green-500" />,
  error: <AlertCircle className="h-3 w-3 text-red-500" />,
}

function ToolCard({ tool }: { tool: ToolExecution }) {
  const [expanded, setExpanded] = useState(false)
  const meta = toolMeta[tool.name] || defaultToolMeta
  const IconComponent = meta.icon

  return (
    <div className={cn(
      'rounded-lg border transition-all overflow-hidden',
      tool.status === 'running' && 'ring-1 ring-blue-500/20',
      tool.status === 'error' && 'ring-1 ring-red-500/20',
    )}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2.5 w-full px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        <div className={cn('w-6 h-6 rounded-md flex items-center justify-center shrink-0', meta.bgColor)}>
          <IconComponent className={cn('h-3.5 w-3.5', meta.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{meta.label}</span>
            <span className="text-[10px] font-mono text-muted-foreground">{tool.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {tool.duration && (
            <span className="text-[10px] text-muted-foreground font-mono">{tool.duration}</span>
          )}
          {statusIcons[tool.status]}
          <ChevronDown className={cn(
            'h-3 w-3 text-muted-foreground transition-transform',
            expanded && 'rotate-180'
          )} />
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t animate-in slide-in-from-top-1 duration-150">
          {/* Input */}
          {tool.input && (
            <div className="mt-2">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                Input
              </p>
              <div className="p-2 rounded-md bg-muted/30 text-xs font-mono break-all whitespace-pre-wrap">
                {tool.input}
              </div>
            </div>
          )}

          {/* Output */}
          {tool.output && (
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">
                Output
              </p>
              <div className={cn(
                'p-2 rounded-md text-xs font-mono break-all whitespace-pre-wrap max-h-40 overflow-y-auto',
                tool.status === 'error' ? 'bg-red-500/5 text-red-400' : 'bg-muted/30'
              )}>
                {tool.output}
              </div>
            </div>
          )}

          {/* Running indicator */}
          {tool.status === 'running' && !tool.output && (
            <div className="mt-2 flex items-center gap-2 text-xs text-blue-500">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Executing tool...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function ToolCards({ tools, className }: ToolCardsProps) {
  if (tools.length === 0) return null

  return (
    <div className={cn('space-y-1.5 mb-3', className)}>
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}

// Single tool card export for use when iterating externally
export function ToolExecutionCard({ tool, className }: { tool: ToolExecution; className?: string }) {
  return (
    <div className={className}>
      <ToolCard tool={tool} />
    </div>
  )
}
