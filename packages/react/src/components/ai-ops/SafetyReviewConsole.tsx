import * as React from 'react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
  Textarea,
  cn,
} from '@clarity-chat/primitives'

export interface SafetyHighlight {
  id: string
  start: number
  end: number
  category: string
  severity?: 'low' | 'medium' | 'high'
  suggestion?: string
}

export interface SafetyReviewConsoleProps {
  content: string
  highlights: SafetyHighlight[]
  onRedact?: (highlight: SafetyHighlight) => void
  onApprove?: () => void
  onReject?: () => void
  className?: string
}

const severityVariant: Record<NonNullable<SafetyHighlight['severity']>, 'info' | 'warning' | 'destructive'> = {
  low: 'info',
  medium: 'warning',
  high: 'destructive',
}

export const SafetyReviewConsole: React.FC<SafetyReviewConsoleProps> = ({
  content,
  highlights,
  onRedact,
  onApprove,
  onReject,
  className,
}) => {
  const sortedHighlights = React.useMemo(() => [...highlights].sort((a, b) => a.start - b.start), [highlights])

  const renderHighlightedContent = () => {
    const segments: React.ReactNode[] = []
    let cursor = 0

    sortedHighlights.forEach((highlight) => {
      if (cursor < highlight.start) {
        segments.push(
          <span key={`text-${cursor}`} className="text-muted-foreground/80">
            {content.slice(cursor, highlight.start)}
          </span>
        )
      }

      segments.push(
        <button
          key={highlight.id}
          type="button"
          onClick={() => onRedact?.(highlight)}
          className={cn(
            'rounded-md px-1 py-0.5 text-left text-sm font-medium transition-colors',
            highlight.severity === 'high' && 'bg-destructive/10 text-destructive',
            highlight.severity === 'medium' && 'bg-warning/10 text-warning-foreground',
            highlight.severity === 'low' && 'bg-primary/10 text-primary'
          )}
        >
          {content.slice(highlight.start, highlight.end)}
        </button>
      )
      cursor = highlight.end
    })

    if (cursor < content.length) {
      segments.push(
        <span key={`tail-${cursor}`} className="text-muted-foreground/80">
          {content.slice(cursor)}
        </span>
      )
    }

    return segments
  }

  return (
    <Card className={cn('border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]', className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-lg font-semibold text-foreground">Safety review console</CardTitle>
        <CardDescription className="text-sm text-muted-foreground/80">
          Click highlighted spans to redact or edit sensitive content.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="rounded-lg border border-border/50 bg-muted p-4 text-sm leading-relaxed">
            {sortedHighlights.length > 0 ? (
              <p className="space-x-1 whitespace-pre-wrap">{renderHighlightedContent()}</p>
            ) : (
              <p className="text-muted-foreground/80">No issues detected for this response.</p>
            )}
          </div>
          <Textarea
            aria-label="Redacted content"
            value={content}
            readOnly
            className="min-h-[140px] resize-y bg-background/60"
          />
        </div>
        <aside className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-muted p-4">
            <h3 className="text-sm font-semibold text-foreground">Flag details</h3>
            <ul className="mt-3 space-y-3 text-xs text-muted-foreground/80">
              {sortedHighlights.map((highlight) => (
                <li key={`flag-${highlight.id}`} className="rounded-lg border border-dashed border-border/50 bg-background/80 p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{highlight.category}</span>
                    <Badge variant={severityVariant[highlight.severity ?? 'low']}>
                      {highlight.severity ?? 'low'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground/70">
                    “{content.slice(highlight.start, highlight.end)}”
                  </p>
                  {highlight.suggestion && (
                    <p className="mt-2 text-xs text-muted-foreground/60">{highlight.suggestion}</p>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="surface"
                      size="sm"
                      onClick={() => onRedact?.(highlight)}
                    >
                      Redact
                    </Button>
                  </div>
                </li>
              ))}
              {sortedHighlights.length === 0 && (
                <li>No flagged content.</li>
              )}
            </ul>
          </div>
        </aside>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="surface" onClick={onApprove}>Approve response</Button>
        <Button variant="ghost" onClick={onReject} className="text-destructive hover:text-destructive">Reject response</Button>
      </CardFooter>
    </Card>
  )
}

SafetyReviewConsole.displayName = 'SafetyReviewConsole'

