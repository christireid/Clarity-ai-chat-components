import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import { SkeletonText } from './skeleton'

// Memory display types (UI-oriented, not core memory system types)
// Not exported to avoid conflicts with utils/memory types
type MemoryScope = 'session' | 'thread' | 'global'
type MemoryType = 'episodic' | 'semantic' | 'preference' | 'fact' | 'behavior'
type MemoryLayer = 'real-time' | 'session' | 'semantic' | 'episodic'

interface MemoryItem {
  id: string
  userId: string
  label: string
  value: string
  scope: MemoryScope
  type: MemoryType
  layer: MemoryLayer
  confidence?: number
  source?: string
  lastUpdated: Date
  tokens?: number
  importanceScore?: number
  metadata?: Record<string, any>
}

export interface MemoryInspectorProps {
  memories: MemoryItem[]
  isLoading?: boolean
  onRemove?: (memory: MemoryItem) => void
  onPromote?: (memory: MemoryItem) => void
  onRefresh?: () => void
  className?: string
  title?: string
  subtitle?: string
  showHeaderActions?: boolean
}

const scopeLabel: Record<MemoryScope, string> = {
  session: 'This conversation',
  thread: 'Current thread',
  global: 'Global memory',
}

const scopeVariant: Record<MemoryScope, 'info' | 'warning' | 'success'> = {
  session: 'info',
  thread: 'warning',
  global: 'success',
}

const typeLabel: Record<MemoryType, string> = {
  episodic: 'Event',
  semantic: 'Knowledge',
  preference: 'Preference',
  fact: 'Fact',
  behavior: 'Behavior',
}

const layerLabel: Record<MemoryLayer, string> = {
  'real-time': 'Real-time',
  session: 'Session',
  semantic: 'Semantic',
  episodic: 'Episodic',
}

const defaultTitle = 'Conversation memory'
const defaultSubtitle = 'Inspect what the assistant has stored so you can prune, promote, or debug contextual memory.'

export const MemoryInspector: React.FC<MemoryInspectorProps> = ({
  memories,
  isLoading = false,
  onRemove,
  onPromote,
  onRefresh,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
  showHeaderActions = true,
}) => {
  const formatRelative = (date: Date) => {
    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.round(diffMs / (1000 * 60))
    if (diffMinutes < 1) return 'moments ago'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const diffHours = Math.round(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.round(diffHours / 24)
    return `${diffDays}d ago`
  }

  const grouped = React.useMemo(() => {
    return memories.reduce<Record<MemoryScope, MemoryItem[]>>(
      (acc, item) => {
        acc[item.scope] = [...acc[item.scope], item]
        return acc
      },
      { session: [], thread: [], global: [] }
    )
  }, [memories])

  return (
    <Card className={cn('border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', className)}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">
            {subtitle}
          </CardDescription>
        </div>
        {showHeaderActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-muted-foreground hover:text-primary"
            >
              Refresh
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="space-y-4">
            <SkeletonText lines={2} />
            <SkeletonText lines={2} />
            <SkeletonText lines={2} />
          </div>
        )}

        {!isLoading && memories.length === 0 && (
          <div className="rounded-lg border border-dashed border-border/50 bg-muted p-6 text-center text-sm text-muted-foreground">
            No memories captured yet. Engage with the assistant to seed persistent context.
          </div>
        )}

        {!isLoading && memories.length > 0 && (
          (Object.keys(grouped) as MemoryScope[])
            .filter((scope) => grouped[scope].length > 0)
            .map((scope) => (
              <section key={scope} className="space-y-3">
                <header className="flex items-center gap-2">
                  <Badge variant={scopeVariant[scope]}>{scopeLabel[scope]}</Badge>
                  <span className="text-xs font-medium text-muted-foreground/70">
                    {grouped[scope].length} item{grouped[scope].length > 1 ? 's' : ''}
                  </span>
                </header>
                <ul className="space-y-3">
                  {grouped[scope].map((memory) => (
                    <li
                      key={memory.id}
                      className="rounded-lg border border-border/50 bg-muted p-4 shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">
                              {memory.label}
                            </span>
                            {memory.type && (
                              <Badge variant="outline" className="text-[11px]">
                                {typeLabel[memory.type]}
                              </Badge>
                            )}
                            {memory.layer && (
                              <Badge variant="outline" className="text-[11px]">
                                {layerLabel[memory.layer]}
                              </Badge>
                            )}
                            {memory.tokens !== undefined && (
                              <Badge variant="outline" className="text-[11px]">
                                {memory.tokens} tokens
                              </Badge>
                            )}
                            {memory.confidence !== undefined && (
                              <Badge variant={memory.confidence >= 0.7 ? 'success' : memory.confidence >= 0.4 ? 'warning' : 'destructive'}>
                                Confidence {(memory.confidence * 100).toFixed(0)}%
                              </Badge>
                            )}
                            {memory.importanceScore !== undefined && (
                              <Badge variant="outline" className="text-[11px]">
                                Importance: {(memory.importanceScore * 100).toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground/85 whitespace-pre-wrap">
                            {memory.value}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground/70">
                          <span>Updated {formatRelative(memory.lastUpdated)}</span>
                          {memory.source && <span>Source: {memory.source}</span>}
                          <div className="flex gap-2">
                            {onPromote && scope !== 'global' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onPromote(memory)}
                                className="text-muted-foreground hover:text-primary"
                              >
                                Promote
                              </Button>
                            )}
                            {onRemove && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemove(memory)}
                                className="text-destructive hover:text-destructive"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))
        )}
      </CardContent>
    </Card>
  )
}

MemoryInspector.displayName = 'MemoryInspector'

