'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SourceCard, type Source } from './SourceCard'

export interface SourcesListProps {
  sources: Source[]
  className?: string
  variant?: 'default' | 'compact'
  collapsible?: boolean
  defaultExpanded?: boolean
  maxVisible?: number
}

export function SourcesList({
  sources,
  className,
  variant = 'default',
  collapsible = true,
  defaultExpanded = true,
  maxVisible = 5,
}: SourcesListProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set())
  const [showAll, setShowAll] = useState(false)

  if (sources.length === 0) {
    return null
  }

  const toggleSource = (index: number) => {
    setExpandedSources(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const visibleSources = showAll ? sources : sources.slice(0, maxVisible)
  const hasMore = sources.length > maxVisible

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>Sources ({sources.length})</span>
          </div>

          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                'p-1 rounded-md',
                'hover:bg-accent hover:text-accent-foreground',
                'transition-colors'
              )}
              aria-label={isExpanded ? 'Collapse sources' : 'Expand sources'}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Sources list */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2 }}
              className="space-y-1.5 overflow-hidden"
            >
              {visibleSources.map((source, index) => (
                <SourceCard
                  key={source.url}
                  source={source}
                  index={index}
                  variant="compact"
                />
              ))}

              {hasMore && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className={cn(
                    'w-full px-3 py-2 rounded-md text-sm',
                    'bg-secondary/50 hover:bg-secondary',
                    'text-muted-foreground hover:text-foreground',
                    'transition-colors'
                  )}
                >
                  Show {sources.length - maxVisible} more sources
                </button>
              )}

              {showAll && hasMore && (
                <button
                  onClick={() => setShowAll(false)}
                  className={cn(
                    'w-full px-3 py-2 rounded-md text-sm',
                    'bg-secondary/50 hover:bg-secondary',
                    'text-muted-foreground hover:text-foreground',
                    'transition-colors'
                  )}
                >
                  Show less
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-primary/10">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Sources</h3>
            <p className="text-xs text-muted-foreground">
              {sources.length} {sources.length === 1 ? 'source' : 'sources'} referenced
            </p>
          </div>
        </div>

        {collapsible && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium',
              'bg-secondary hover:bg-secondary/80',
              'transition-colors',
              'flex items-center gap-1.5'
            )}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand
              </>
            )}
          </button>
        )}
      </div>

      {/* Sources grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="space-y-2 overflow-hidden"
          >
            {visibleSources.map((source, index) => (
              <SourceCard
                key={source.url}
                source={source}
                index={index}
                expanded={expandedSources.has(index)}
                onToggle={() => toggleSource(index)}
              />
            ))}

            {hasMore && !showAll && (
              <button
                onClick={() => setShowAll(true)}
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-secondary/50 hover:bg-secondary',
                  'text-sm font-medium',
                  'text-muted-foreground hover:text-foreground',
                  'transition-all duration-200',
                  'border border-dashed border-border'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <ChevronDown className="w-4 h-4" />
                  Show {sources.length - maxVisible} more sources
                </div>
              </button>
            )}

            {showAll && hasMore && (
              <button
                onClick={() => setShowAll(false)}
                className={cn(
                  'w-full px-4 py-3 rounded-lg',
                  'bg-secondary/50 hover:bg-secondary',
                  'text-sm font-medium',
                  'text-muted-foreground hover:text-foreground',
                  'transition-all duration-200',
                  'border border-dashed border-border'
                )}
              >
                <div className="flex items-center justify-center gap-2">
                  <ChevronUp className="w-4 h-4" />
                  Show less
                </div>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary when collapsed */}
      {!isExpanded && (
        <div className="text-xs text-muted-foreground">
          Click expand to view sources
        </div>
      )}
    </div>
  )
}

/**
 * Inline sources display (for embedding in text)
 */
export function InlineSources({
  sources,
  className,
}: {
  sources: Source[]
  className?: string
}) {
  if (sources.length === 0) {
    return null
  }

  return (
    <div className={cn('inline-flex items-center gap-1 flex-wrap', className)}>
      {sources.map((source, index) => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-0.5',
            'text-xs font-medium',
            'px-1.5 py-0.5 rounded',
            'bg-primary/10 text-primary',
            'hover:bg-primary/20',
            'transition-colors'
          )}
          title={source.title}
        >
          <span>[{index + 1}]</span>
        </a>
      ))}
    </div>
  )
}
