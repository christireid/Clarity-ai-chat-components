'use client'

import { useState } from 'react'
import { cn } from '@clarity-chat/primitives'
import {
  ChevronDown,
  ExternalLink,
  GraduationCap,
  Globe,
  FileText,
  Newspaper,
  MessageCircle,
  BookOpen,
} from 'lucide-react'
import { type Source } from '../../../_shared'

interface SourceDisplayProps {
  sources: Source[]
  className?: string
}

const typeConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  academic: {
    icon: GraduationCap,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    label: 'Academic',
  },
  web: {
    icon: Globe,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    label: 'Web',
  },
  documentation: {
    icon: FileText,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    label: 'Docs',
  },
  news: {
    icon: Newspaper,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    label: 'News',
  },
  forum: {
    icon: MessageCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    label: 'Forum',
  },
}

function truncateUrl(url: string, maxLength = 50): string {
  try {
    const parsed = new URL(url)
    const display = parsed.hostname + parsed.pathname
    if (display.length <= maxLength) return display
    return display.slice(0, maxLength - 3) + '...'
  } catch {
    return url.length > maxLength ? url.slice(0, maxLength - 3) + '...' : url
  }
}

function RelevanceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-orange-500'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">{value}%</span>
    </div>
  )
}

function SourceCard({ source, index }: { source: Source; index: number }) {
  const config = typeConfig[source.type] || typeConfig.web
  const TypeIcon = config.icon

  return (
    <div className="group flex gap-3 p-3 rounded-xl border hover:bg-muted/20 transition-colors">
      {/* Number badge */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
          {index + 1}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium leading-tight truncate">{source.title}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted-foreground font-mono truncate">
                {truncateUrl(source.url)}
              </span>
            </div>
          </div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.preventDefault()}
            className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 shrink-0"
            title="Open source"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Type badge and relevance */}
        <div className="flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
            config.bgColor, config.color
          )}>
            <TypeIcon className="h-2.5 w-2.5" />
            {config.label}
          </span>
          <RelevanceBar value={source.relevance} />
        </div>

        {/* Excerpt */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {source.excerpt}
        </p>
      </div>
    </div>
  )
}

export function SourceDisplay({ sources, className }: SourceDisplayProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [groupByType, setGroupByType] = useState(false)

  if (sources.length === 0) return null

  // Group sources by type
  const grouped = sources.reduce<Record<string, Source[]>>((acc, source) => {
    const type = source.type
    if (!acc[type]) acc[type] = []
    acc[type].push(source)
    return acc
  }, {})

  const typeOrder = ['academic', 'documentation', 'web', 'news', 'forum']
  const sortedTypes = typeOrder.filter(t => grouped[t])

  return (
    <div className={cn(
      'rounded-xl border bg-card/50 backdrop-blur-sm overflow-hidden mt-3',
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-muted/30 transition-colors"
      >
        <BookOpen className="h-4 w-4 text-primary shrink-0" />
        <span className="text-sm font-medium flex-1">
          Sources ({sources.length})
        </span>
        <button
          onClick={e => { e.stopPropagation(); setGroupByType(!groupByType) }}
          className={cn(
            'text-[10px] px-2 py-0.5 rounded-full transition-colors',
            groupByType
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {groupByType ? 'Grouped' : 'Group by Type'}
        </button>
        <ChevronDown className={cn(
          'h-4 w-4 text-muted-foreground transition-transform shrink-0',
          collapsed && '-rotate-90'
        )} />
      </button>

      {/* Sources List */}
      {!collapsed && (
        <div className="px-3 pb-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
          {groupByType ? (
            // Grouped view
            sortedTypes.map(type => {
              const config = typeConfig[type] || typeConfig.web
              const TypeIcon = config.icon
              return (
                <div key={type}>
                  <div className="flex items-center gap-2 px-2 py-1.5 mt-1">
                    <TypeIcon className={cn('h-3.5 w-3.5', config.color)} />
                    <span className={cn('text-xs font-medium', config.color)}>
                      {config.label} ({grouped[type].length})
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="space-y-1">
                    {grouped[type].map((source, idx) => {
                      const globalIdx = sources.indexOf(source)
                      return <SourceCard key={source.id} source={source} index={globalIdx} />
                    })}
                  </div>
                </div>
              )
            })
          ) : (
            // Flat view
            sources.map((source, index) => (
              <SourceCard key={source.id} source={source} index={index} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
