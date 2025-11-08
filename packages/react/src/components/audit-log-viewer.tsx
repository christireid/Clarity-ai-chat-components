import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export type AuditLogResult = 'success' | 'failure' | 'warning' | 'info' | string

export interface AuditLogEntry {
  id: string
  timestamp: Date | string
  user: string
  action: string
  resource?: string
  result?: AuditLogResult
  metadata?: Record<string, React.ReactNode | string | number | boolean>
}

export interface AuditLogViewerProps {
  logs: AuditLogEntry[]
  className?: string
  timezone?: string
  onEntryClick?: (entry: AuditLogEntry) => void
  emptyState?: React.ReactNode
  title?: string
}

const resultStyles: Record<string, string> = {
  success: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/20',
  failure: 'bg-red-500/10 text-red-600 border border-red-500/20',
  warning: 'bg-amber-500/10 text-amber-600 border border-amber-500/20',
  info: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
}

function formatTimestamp(value: Date | string, timezone?: string) {
  const date = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(date.getTime())) {
    return value.toString()
  }

  return date.toLocaleString(undefined, {
    hour12: false,
    timeZone: timezone,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function AuditLogViewer({
  logs,
  className,
  timezone,
  onEntryClick,
  emptyState,
  title = 'Audit Log',
}: AuditLogViewerProps) {
  if (!logs.length) {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-muted-foreground/20 bg-card/50 p-6 text-center text-sm text-muted-foreground',
          className
        )}
      >
        {emptyState ?? 'No audit events recorded yet.'}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {logs.length} event{logs.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        <ul className="divide-y divide-border/70">
          {logs.map((entry) => {
            const badgeClass =
              entry.result && resultStyles[entry.result.toLowerCase()]
                ? resultStyles[entry.result.toLowerCase()]
                : 'bg-muted text-muted-foreground border border-border/70'

            return (
              <li
                key={entry.id}
                className={cn(
                  'px-4 py-3 transition-colors',
                  onEntryClick && 'cursor-pointer hover:bg-muted/40'
                )}
                onClick={() => onEntryClick?.(entry)}
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {entry.action}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(entry.timestamp, timezone)}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">
                        {entry.user}
                      </span>
                      {entry.resource ? (
                        <span className="ml-1 text-muted-foreground/80">
                          • {entry.resource}
                        </span>
                      ) : null}
                    </div>
                    {entry.metadata ? (
                      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground/90">
                        {Object.entries(entry.metadata).map(([key, value]) => (
                          <div key={key} className="flex gap-1">
                            <dt className="font-medium text-foreground/80">
                              {key}:
                            </dt>
                            <dd className="truncate text-muted-foreground">
                              {String(value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}
                  </div>
                  {entry.result ? (
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                        badgeClass
                      )}
                    >
                      {entry.result}
                    </span>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
