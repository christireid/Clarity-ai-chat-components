import * as React from 'react'
import { motion } from 'framer-motion'
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
import {
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

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

const getTrendVariant = (trend: SessionMetric['trend']) => {
  switch (trend) {
    case 'up':
      return 'success'
    case 'down':
      return 'destructive'
    case 'steady':
      return 'secondary'
    default:
      return 'secondary'
  }
}

const getTrendIcon = (trend: SessionMetric['trend']) => {
  switch (trend) {
    case 'up':
      return (
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      )
    case 'down':
      return (
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      )
    case 'steady':
      return (
        <svg
          className="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h14"
          />
        </svg>
      )
    default:
      return null
  }
}

const defaultTitle = 'Conversation recap'
const defaultSubtitle =
  'Share this executive summary with stakeholders or use the follow-up plan to continue the workflow.'

export function SessionSummaryCard({
  summary,
  metrics,
  onAction,
  onExport,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
}: SessionSummaryCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      {...(prefersReducedMotion
        ? ANIMATION_PRESETS.fadeIn
        : ANIMATION_PRESETS.scale)}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              // Framer Motion 12: Spring entrance for summary card
              type: 'spring',
              damping: 22,
              stiffness: 280,
            }
      }
      viewport={{ once: true }}
    >
      <Card
        className={cn(
          'shadow-md hover:shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.1),0_4px_6px_-4px_rgb(0_0_0_/_0.1)] transition-shadow duration-150 ease-out',
          className
        )}
      >
        <CardHeader className="space-y-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground/80">
              {subtitle}
            </CardDescription>
          </div>
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              className="self-start gap-1.5"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
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
              <Badge variant="info">
                <svg
                  className="h-3 w-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Highlights
              </Badge>
            </header>
            <ul className="space-y-2">
              {summary.highlights.map((highlight, index) => (
                <motion.li
                  key={highlight}
                  {...(prefersReducedMotion
                    ? ANIMATION_PRESETS.fadeIn
                    : ANIMATION_PRESETS.slideRight)}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          // Framer Motion 12: Spring staggered list items
                          type: 'spring',
                          damping: 25,
                          stiffness: 300,
                          delay: index * 0.05,
                        }
                  }
                  viewport={{ once: true }}
                  className="flex items-start gap-3 rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground shadow-xs"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="flex-1">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                {...(prefersReducedMotion
                  ? ANIMATION_PRESETS.fadeIn
                  : ANIMATION_PRESETS.scale)}
                transition={{
                  duration: prefersReducedMotion ? 0 : durations.normal,
                  delay: prefersReducedMotion ? 0 : index * 0.05,
                }}
                viewport={{ once: true }}
                className="flex flex-col gap-2 rounded-lg border bg-muted/50 px-4 py-3 text-sm shadow-xs hover:shadow-md hover:-translate-y-px transition-all duration-150 ease-out"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </span>
                  {metric.trend && (
                    <Badge
                      variant={getTrendVariant(metric.trend)}
                      className="gap-1"
                    >
                      {getTrendIcon(metric.trend)}
                      {metric.trend === 'up'
                        ? 'Up'
                        : metric.trend === 'down'
                          ? 'Down'
                          : 'Stable'}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </section>

          {summary.nextActions && summary.nextActions.length > 0 && (
            <section className="space-y-3">
              <header className="flex items-center gap-2">
                <span className="text-base font-semibold text-foreground">
                  Suggested follow-up
                </span>
                <Badge variant="warning">
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Next steps
                </Badge>
              </header>
              <div className="flex flex-wrap gap-2">
                {summary.nextActions.map((action, index) => (
                  <motion.div
                    key={action}
                    {...(prefersReducedMotion
                      ? ANIMATION_PRESETS.fadeIn
                      : ANIMATION_PRESETS.pop)}
                    transition={{
                      duration: prefersReducedMotion ? 0 : durations.fast,
                      delay: prefersReducedMotion ? 0 : index * 0.05,
                    }}
                    viewport={{ once: true }}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onAction?.(action)}
                      className="rounded-full gap-1.5"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                      {action}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

SessionSummaryCard.displayName = 'SessionSummaryCard'
