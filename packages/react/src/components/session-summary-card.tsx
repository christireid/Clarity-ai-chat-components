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

export interface SessionSummaryHighlights {
  title: string
  highlights: string[]
  nextActions?: string[]
}

export interface SessionMetric {
  label: string
  value: string
  trend?: 'up' | 'down' | 'steady'
}

export interface SessionSummaryCardProps {
  summary: SessionSummaryHighlights
  metrics: SessionMetric[]
  onAction?: (action: string) => void
  onExport?: () => void
  className?: string
  title?: string
  subtitle?: string
}

const trendIcon: Record<NonNullable<SessionMetric['trend']>, string> = {
  up: '↑',
  down: '↓',
  steady: '→',
}

const defaultTitle = 'Conversation recap'
const defaultSubtitle = 'Share this executive summary with stakeholders or use the follow-up plan to continue the workflow.'

export const SessionSummaryCard: React.FC<SessionSummaryCardProps> = ({
  summary,
  metrics,
  onAction,
  onExport,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
}) => {
  return (
    <Card className={cn('border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_26px_56px_rgba(15,23,42,0.18)]', className)}>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-semibold text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground/80">{subtitle}</CardDescription>
        </div>
        {onExport && (
          <Button variant="ghost" size="sm" onClick={onExport} className="self-start">
            Export transcript
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-3">
          <header className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">
              {summary.title}
            </span>
            <Badge variant="info" className="text-[11px]">
              Highlights
            </Badge>
          </header>
          <ul className="space-y-2">
            {summary.highlights.map((highlight, index) => (
              <li
                key={highlight}
                className="flex items-start gap-3 rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] px-4 py-3 text-sm text-muted-foreground/85"
              >
                <span className="mt-1 text-primary">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-2 rounded-2xl border border-border/40 bg-[hsl(var(--surface-muted))] px-4 py-3 text-sm"
            >
              <span className="text-muted-foreground/70">{metric.label}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-semibold text-foreground">{metric.value}</span>
                {metric.trend && (
                  <Badge variant="subtle" className="text-[11px]">
                    {trendIcon[metric.trend]} {metric.trend === 'up' ? 'Improving' : metric.trend === 'down' ? 'Regression' : 'Stable'}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </section>

        {summary.nextActions && summary.nextActions.length > 0 && (
          <section className="space-y-3">
            <header className="flex items-center gap-2">
              <span className="text-base font-semibold text-foreground">Suggested follow-up</span>
              <Badge variant="warning" className="text-[11px]">
                Next steps
              </Badge>
            </header>
            <div className="flex flex-wrap gap-2">
              {summary.nextActions.map((action) => (
                <Button
                  key={action}
                  variant="surface"
                  size="sm"
                  onClick={() => onAction?.(action)}
                  className="rounded-full"
                >
                  {action}
                </Button>
              ))}
            </div>
          </section>
        )}
      </CardContent>
    </Card>
  )
}

SessionSummaryCard.displayName = 'SessionSummaryCard'

