'use client'

import { useState } from 'react'
import { cn, Badge, ScrollArea } from '@clarity-chat/primitives'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  Code2,
  Plug,
  Brain,
  Coins,
  Wrench,
  Search,
  Settings,
  X,
} from 'lucide-react'
import type { KnowledgeEntry } from './knowledge-base'

const categoryConfig: Record<
  KnowledgeEntry['category'],
  { icon: React.ReactNode; color: string; label: string }
> = {
  component: { icon: <Layers className="h-3 w-3" />, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Component' },
  hook: { icon: <Code2 className="h-3 w-3" />, color: 'text-green-500 bg-green-500/10 border-green-500/20', label: 'Hook' },
  adapter: { icon: <Plug className="h-3 w-3" />, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', label: 'Adapter' },
  memory: { icon: <Brain className="h-3 w-3" />, color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', label: 'Memory' },
  token: { icon: <Coins className="h-3 w-3" />, color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', label: 'Token' },
  tool: { icon: <Wrench className="h-3 w-3" />, color: 'text-red-500 bg-red-500/10 border-red-500/20', label: 'Tool' },
  rag: { icon: <Search className="h-3 w-3" />, color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20', label: 'RAG' },
  setup: { icon: <Settings className="h-3 w-3" />, color: 'text-gray-500 bg-gray-500/10 border-gray-500/20', label: 'Setup' },
}

interface RagCitationsProps {
  entries: KnowledgeEntry[]
  className?: string
}

export function RagCitations({ entries, className }: RagCitationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (entries.length === 0) return null

  return (
    <div className={cn('mt-3', className)}>
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">
          Sources ({entries.length} matched)
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {entries.slice(0, 5).map((entry) => {
          const config = categoryConfig[entry.category]
          const isExpanded = expandedId === entry.id

          return (
            <div key={entry.id} className="relative">
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition-all',
                  'hover:shadow-md',
                  isExpanded
                    ? 'bg-card shadow-lg ring-1 ring-primary/20'
                    : 'bg-card/50 hover:bg-card'
                )}
              >
                <div className={cn('p-1 rounded', config.color.split(' ').slice(1).join(' '))}>
                  {config.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate max-w-[150px]">
                    {entry.title}
                  </div>
                  <Badge
                    variant="outline"
                    className={cn('text-[9px] px-1 py-0', config.color.split(' ')[0])}
                  >
                    {config.label}
                  </Badge>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-3 w-3 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </button>

              {/* Expanded detail card */}
              {isExpanded && (
                <div className="absolute top-full left-0 mt-1 w-80 rounded-xl border bg-card shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1 rounded', config.color.split(' ').slice(1).join(' '))}>
                          {config.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold">{entry.title}</h4>
                          <Badge
                            variant="outline"
                            className={cn('text-[9px]', config.color.split(' ')[0])}
                          >
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setExpandedId(null)
                        }}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                      >
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                  <ScrollArea className="max-h-48">
                    <div className="px-4 py-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {entry.content}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {entry.tags.slice(0, 6).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[9px] px-1.5 py-0 text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          )
        })}
        {entries.length > 5 && (
          <div className="flex items-center px-2 text-xs text-muted-foreground">
            +{entries.length - 5} more
          </div>
        )}
      </div>
    </div>
  )
}
