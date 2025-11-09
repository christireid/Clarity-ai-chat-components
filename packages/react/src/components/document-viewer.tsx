import * as React from 'react'
import { cn } from '@clarity-chat/primitives'

export interface DocumentViewerProps {
  document: {
    id: string
    name?: string
    type?: string
    content?: string
    summary?: string
    metadata?: Record<string, any>
    sourceUrl?: string
    tags?: string[]
  }
  highlightQuery?: string
  className?: string
  emptyState?: React.ReactNode
}

function highlightContent(content: string, query?: string) {
  if (!query || query.trim().length < 2) {
    return <>{content}</>
  }

  try {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'gi')
    const parts = content.split(regex)
    const matches = content.match(regex)

    if (!matches) {
      return <>{content}</>
    }

    const highlighted: React.ReactNode[] = []
    parts.forEach((part, index) => {
      highlighted.push(<span key={`part-${index}`}>{part}</span>)
      if (matches[index]) {
        highlighted.push(
          <mark
            key={`match-${index}`}
            className="rounded bg-yellow-200 px-1 py-0.5 text-gray-900 dark:bg-yellow-300/60 dark:text-gray-900"
          >
            {matches[index]}
          </mark>
        )
      }
    })

    return highlighted
  } catch {
    return <>{content}</>
  }
}

export function DocumentViewer({
  document,
  highlightQuery,
  className,
  emptyState,
}: DocumentViewerProps) {
  if (!document) {
    return (
      <div
        className={cn(
          'flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/20 p-6 text-sm text-muted-foreground',
          className
        )}
      >
        {emptyState ?? 'No document selected.'}
      </div>
    )
  }

  const { name, type, content, summary, metadata, sourceUrl, tags } = document

  return (
    <div
      className={cn(
        'flex h-full flex-col space-y-4 text-sm text-foreground',
        className
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border/50 bg-card/70 p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] backdrop-blur-sm">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {name ?? 'Document'}
          </h3>
          {type ? (
            <p className="text-xs text-muted-foreground mt-1">{type}</p>
          ) : null}
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View Source ↗
            </a>
          ) : null}
        </div>
        {tags?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </header>

      {summary ? (
        <section className="rounded-lg border border-border/50 bg-background/60 p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">
            {summary}
          </p>
        </section>
      ) : null}

      <section className="flex-1 overflow-y-auto rounded-lg border border-border/50 bg-background/70 p-4 shadow-inner">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Content
        </h4>
        <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {content ? (
            highlightContent(content, highlightQuery)
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
              <span className="text-4xl mb-2">📄</span>
              <p className="text-sm">Document content not available.</p>
              <p className="mt-1 text-xs">
                Provide `document.content` to render the body.
              </p>
            </div>
          )}
        </div>
      </section>

      {metadata && Object.keys(metadata).length ? (
        <section className="rounded-lg border border-border/50 bg-background/60 p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Metadata
          </h4>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted-foreground md:grid-cols-2">
            {Object.entries(metadata).map(([key, value]) => (
              <div
                key={key}
                className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
              >
                <dt className="font-medium text-foreground/80">
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}
                </dt>
                <dd className="mt-0.5 break-words text-muted-foreground/90">
                  {typeof value === 'string'
                    ? value
                    : JSON.stringify(value, null, 2)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}
    </div>
  )
}
