'use client'

import { memo } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  Code,
  FileText,
  GitBranch,
  Database,
  Layout,
  Braces,
  Wrench,
} from 'lucide-react'

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  usageCount: number
}

const tools: Tool[] = [
  {
    id: 'code-gen',
    name: 'Code Generator',
    description: 'Creates code artifacts with syntax highlighting',
    icon: <Code className="h-4 w-4" />,
    color: 'text-blue-500 bg-blue-500/10',
    usageCount: 0,
  },
  {
    id: 'doc-writer',
    name: 'Document Writer',
    description: 'Creates markdown documentation',
    icon: <FileText className="h-4 w-4" />,
    color: 'text-emerald-500 bg-emerald-500/10',
    usageCount: 0,
  },
  {
    id: 'diagram-creator',
    name: 'Diagram Creator',
    description: 'Creates mermaid and SVG diagrams',
    icon: <GitBranch className="h-4 w-4" />,
    color: 'text-violet-500 bg-violet-500/10',
    usageCount: 0,
  },
  {
    id: 'data-transformer',
    name: 'Data Transformer',
    description: 'Creates tables and structured data',
    icon: <Database className="h-4 w-4" />,
    color: 'text-amber-500 bg-amber-500/10',
    usageCount: 0,
  },
  {
    id: 'html-builder',
    name: 'HTML Builder',
    description: 'Creates interactive HTML layouts',
    icon: <Layout className="h-4 w-4" />,
    color: 'text-red-500 bg-red-500/10',
    usageCount: 0,
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Creates formatted JSON structures',
    icon: <Braces className="h-4 w-4" />,
    color: 'text-yellow-500 bg-yellow-500/10',
    usageCount: 0,
  },
]

interface ToolPanelProps {
  usageCounts: Record<string, number>
  className?: string
}

export const ToolPanel = memo(function ToolPanel({
  usageCounts,
  className,
}: ToolPanelProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <Wrench className="h-4 w-4 text-orange-500" />
        Creation Tools
      </h4>

      <div className="grid grid-cols-1 gap-2">
        {tools.map((tool) => {
          const count = usageCounts[tool.id] || 0
          return (
            <div
              key={tool.id}
              className="flex items-center gap-2.5 p-2.5 rounded-lg border bg-card/50 hover:bg-muted/30 transition-colors"
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  tool.color
                )}
              >
                {tool.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{tool.name}</div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {tool.description}
                </div>
              </div>
              {count > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted font-mono">
                  {count}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})
