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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  cn,
} from '@clarity-chat/primitives'
import { Skeleton } from '../ui/skeleton'

export interface SafetyHighlight {
  id: string
  start: number
  end: number
  category: string
  severity?: 'low' | 'medium' | 'high'
  suggestion?: string
}

export interface SafetyReviewConsoleProps {
  /** Content to review */
  content: string
  /** Highlighted issues in the content */
  highlights: SafetyHighlight[]
  /** Callback when a highlight is redacted */
  onRedact?: (highlight: SafetyHighlight) => void
  /** Callback when all highlights are bulk redacted */
  onRedactAll?: () => void
  /** Callback when response is approved */
  onApprove?: () => void
  /** Callback when response is rejected */
  onReject?: () => void
  /** Whether an action is in progress */
  isProcessing?: boolean
  /** Whether content is loading */
  isLoading?: boolean
  /** Require confirmation for approve/reject */
  requireConfirmation?: boolean
  /** Title for the console */
  title?: string
  /** Description for the console */
  description?: string
  className?: string
}

const severityVariant: Record<
  NonNullable<SafetyHighlight['severity']>,
  'info' | 'warning' | 'destructive'
> = {
  low: 'info',
  medium: 'warning',
  high: 'destructive',
}

const severityOrder: Record<
  NonNullable<SafetyHighlight['severity']>,
  number
> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const SafetyReviewConsole: React.FC<SafetyReviewConsoleProps> = ({
  content,
  highlights,
  onRedact,
  onRedactAll,
  onApprove,
  onReject,
  isProcessing = false,
  isLoading = false,
  requireConfirmation = true,
  title = 'Safety review console',
  description = 'Click highlighted spans to redact or edit sensitive content. Use arrow keys to navigate between highlights.',
  className,
}) => {
  const [focusedHighlightIndex, setFocusedHighlightIndex] =
    React.useState<number>(-1)
  const [showApproveDialog, setShowApproveDialog] = React.useState(false)
  const [showRejectDialog, setShowRejectDialog] = React.useState(false)

  const highlightRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map())

  const sortedHighlights = React.useMemo(
    () => [...highlights].sort((a, b) => a.start - b.start),
    [highlights]
  )

  // Sort by severity for the sidebar
  const severitySortedHighlights = React.useMemo(
    () =>
      [...highlights].sort(
        (a, b) =>
          severityOrder[a.severity ?? 'low'] -
            severityOrder[b.severity ?? 'low'] || a.start - b.start
      ),
    [highlights]
  )

  // Statistics
  const stats = React.useMemo(() => {
    const high = highlights.filter((h) => h.severity === 'high').length
    const medium = highlights.filter((h) => h.severity === 'medium').length
    const low = highlights.filter(
      (h) => h.severity === 'low' || !h.severity
    ).length
    return { high, medium, low, total: highlights.length }
  }, [highlights])

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (sortedHighlights.length === 0) return

      let newIndex = focusedHighlightIndex

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault()
          newIndex =
            focusedHighlightIndex < sortedHighlights.length - 1
              ? focusedHighlightIndex + 1
              : 0
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault()
          newIndex =
            focusedHighlightIndex > 0
              ? focusedHighlightIndex - 1
              : sortedHighlights.length - 1
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = sortedHighlights.length - 1
          break
        case 'Enter':
        case ' ':
          if (
            focusedHighlightIndex >= 0 &&
            focusedHighlightIndex < sortedHighlights.length
          ) {
            event.preventDefault()
            onRedact?.(sortedHighlights[focusedHighlightIndex])
          }
          return
        default:
          return
      }

      setFocusedHighlightIndex(newIndex)
      const highlight = sortedHighlights[newIndex]
      if (highlight) {
        highlightRefs.current.get(highlight.id)?.focus()
      }
    },
    [focusedHighlightIndex, sortedHighlights, onRedact]
  )

  const handleApprove = () => {
    if (requireConfirmation && stats.high > 0) {
      setShowApproveDialog(true)
    } else {
      onApprove?.()
    }
  }

  const handleReject = () => {
    if (requireConfirmation) {
      setShowRejectDialog(true)
    } else {
      onReject?.()
    }
  }

  const renderHighlightedContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton width="100%" height={16} />
          <Skeleton width="90%" height={16} />
          <Skeleton width="95%" height={16} />
          <Skeleton width="70%" height={16} />
        </div>
      )
    }

    const segments: React.ReactNode[] = []
    let cursor = 0

    sortedHighlights.forEach((highlight, index) => {
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
          ref={(el) => {
            if (el) highlightRefs.current.set(highlight.id, el)
          }}
          type="button"
          onClick={() => onRedact?.(highlight)}
          onFocus={() => setFocusedHighlightIndex(index)}
          aria-describedby={`highlight-desc-${highlight.id}`}
          className={cn(
            'rounded-md px-1 py-0.5 text-left text-sm font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'hover:scale-105',
            highlight.severity === 'high' &&
              'bg-destructive/20 text-destructive hover:bg-destructive/30',
            highlight.severity === 'medium' &&
              'bg-warning/20 text-warning-foreground hover:bg-warning/30',
            (highlight.severity === 'low' || !highlight.severity) &&
              'bg-primary/20 text-primary hover:bg-primary/30'
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
    <>
      <Card
        className={cn(
          'border-border/50 bg-background shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)]',
          className
        )}
        aria-busy={isProcessing || isLoading}
      >
        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80">
                {description}
              </CardDescription>
            </div>
            {stats.total > 0 && (
              <div className="flex items-center gap-2">
                {stats.high > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {stats.high} high
                  </Badge>
                )}
                {stats.medium > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {stats.medium} medium
                  </Badge>
                )}
                {stats.low > 0 && (
                  <Badge variant="info" className="text-xs">
                    {stats.low} low
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-3">
            <div
              role="region"
              aria-label="Content with safety highlights"
              onKeyDown={handleKeyDown}
              className="rounded-lg border border-border/50 bg-muted p-4 text-sm leading-relaxed"
            >
              {sortedHighlights.length > 0 ? (
                <p className="whitespace-pre-wrap">
                  {renderHighlightedContent()}
                </p>
              ) : isLoading ? (
                renderHighlightedContent()
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="mb-2 rounded-full bg-success/10 p-2">
                    <svg
                      className="h-5 w-5 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-success">
                    No issues detected
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    This response passed all safety checks.
                  </p>
                </div>
              )}
            </div>

            {/* Hidden descriptions for screen readers */}
            {sortedHighlights.map((highlight) => (
              <span
                key={`desc-${highlight.id}`}
                id={`highlight-desc-${highlight.id}`}
                className="sr-only"
              >
                {highlight.category} issue with {highlight.severity ?? 'low'}{' '}
                severity.
                {highlight.suggestion && ` Suggestion: ${highlight.suggestion}`}
              </span>
            ))}
          </div>

          <aside className="space-y-4" aria-label="Safety flags">
            <div className="rounded-lg border border-border/50 bg-muted p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Flag details
                </h3>
                {onRedactAll && stats.total > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRedactAll}
                    disabled={isProcessing}
                    className="text-xs"
                  >
                    Redact all
                  </Button>
                )}
              </div>

              {isLoading ? (
                <div className="mt-3 space-y-3">
                  <Skeleton width="100%" height={80} />
                  <Skeleton width="100%" height={80} />
                </div>
              ) : (
                <ul
                  className="mt-3 space-y-3 text-xs text-muted-foreground/80"
                  role="list"
                >
                  {severitySortedHighlights.map((highlight, index) => (
                    <li
                      key={`flag-${highlight.id}`}
                      className={cn(
                        'rounded-lg border border-dashed bg-background/80 p-3 transition-colors',
                        highlight.severity === 'high'
                          ? 'border-destructive/50'
                          : highlight.severity === 'medium'
                            ? 'border-warning/50'
                            : 'border-border/50'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {highlight.category}
                        </span>
                        <Badge
                          variant={severityVariant[highlight.severity ?? 'low']}
                        >
                          {highlight.severity ?? 'low'}
                        </Badge>
                      </div>
                      <p className="mt-2 rounded bg-muted px-2 py-1 text-xs text-muted-foreground/70">
                        "{content.slice(highlight.start, highlight.end)}"
                      </p>
                      {highlight.suggestion && (
                        <p className="mt-2 text-xs text-muted-foreground/60">
                          <span className="font-medium">Suggestion:</span>{' '}
                          {highlight.suggestion}
                        </p>
                      )}
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="surface"
                          size="sm"
                          onClick={() => onRedact?.(highlight)}
                          disabled={isProcessing}
                          aria-label={`Redact ${highlight.category} issue`}
                        >
                          Redact
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const el = highlightRefs.current.get(highlight.id)
                            if (el) {
                              el.focus()
                              el.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center',
                              })
                            }
                          }}
                          aria-label={`Jump to ${highlight.category} in content`}
                        >
                          Show
                        </Button>
                      </div>
                    </li>
                  ))}
                  {severitySortedHighlights.length === 0 && !isLoading && (
                    <li className="py-4 text-center text-muted-foreground/60">
                      No flagged content.
                    </li>
                  )}
                </ul>
              )}
            </div>
          </aside>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground/70">
            {stats.total > 0
              ? `${stats.total} issue${stats.total === 1 ? '' : 's'} require${stats.total === 1 ? 's' : ''} review`
              : 'Ready to approve'}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="surface"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Approve response'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleReject}
              disabled={isProcessing}
              className="text-destructive hover:text-destructive"
            >
              Reject response
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Approve Confirmation Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve with high severity issues?</DialogTitle>
            <DialogDescription>
              This response has {stats.high} high severity issue
              {stats.high === 1 ? '' : 's'} that haven't been addressed. Are you
              sure you want to approve it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowApproveDialog(false)
                onApprove?.()
              }}
            >
              Approve anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this response?</DialogTitle>
            <DialogDescription>
              This action will reject the response and it will not be sent. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowRejectDialog(false)
                onReject?.()
              }}
            >
              Reject response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

SafetyReviewConsole.displayName = 'SafetyReviewConsole'
