'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
import { SparklesIcon, LoaderIcon, CheckIcon, XIcon } from '../ui/icons'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

export type AgentRunStatus = 'pending' | 'running' | 'succeeded' | 'failed'

export interface AgentRunStep {
  id: string
  title: string
  detail?: string
  status: AgentRunStatus
  tool?: string
  startedAt: Date
  completedAt?: Date
  outputPreview?: string
}

export interface AgentRunFeedProps {
  steps: AgentRunStep[]
  onRetry?: (step: AgentRunStep) => void
  onOpenLogs?: (step: AgentRunStep) => void
  className?: string
  title?: string
  subtitle?: string
}

const statusIcon: Record<AgentRunStatus, React.ReactNode> = {
  pending: (
    <LoaderIcon size={16} className="animate-spin text-muted-foreground" />
  ),
  running: <SparklesIcon size={16} className="text-primary animate-pulse" />,
  succeeded: <CheckIcon size={16} className="text-success" />,
  failed: <XIcon size={16} className="text-destructive" />,
}

const statusBadge: Record<
  AgentRunStatus,
  'info' | 'info' | 'success' | 'destructive'
> = {
  pending: 'info',
  running: 'info',
  succeeded: 'success',
  failed: 'destructive',
}

const statusLabel: Record<AgentRunStatus, string> = {
  pending: 'Queued',
  running: 'In progress',
  succeeded: 'Completed',
  failed: 'Failed',
}

const defaultTitle = 'Agent execution feed'
const defaultSubtitle =
  'Observe how the orchestrator called tools, merged evidence, and delivered the final answer.'

export const AgentRunFeed: React.FC<AgentRunFeedProps> = React.memo(
  ({
    steps,
    onRetry,
    onOpenLogs,
    className,
    title = defaultTitle,
    subtitle = defaultSubtitle,
  }) => {
    const prefersReducedMotion = useReducedMotion()

    const sortedSteps = React.useMemo(
      () =>
        [...steps].sort(
          (a, b) => a.startedAt.getTime() - b.startedAt.getTime()
        ),
      [steps]
    )

    const formatDuration = (step: AgentRunStep) => {
      if (!step.completedAt) return undefined
      const diffMs = step.completedAt.getTime() - step.startedAt.getTime()
      return `${(diffMs / 1000).toFixed(2)}s`
    }

    return (
      <Card
        className={cn('border-border/50 bg-background shadow-md', className)}
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
        </CardHeader>
        <CardContent className="">
          <ol className="space-y-4">
            {prefersReducedMotion ? (
              sortedSteps.map((step) => (
                <li
                  key={step.id}
                  className="rounded-lg border border-border/50 bg-muted p-4 shadow-xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-inner">
                        {statusIcon[step.status]}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">
                          {step.title}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                          Started{' '}
                          {step.startedAt.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusBadge[step.status]}>
                        {statusLabel[step.status]}
                      </Badge>
                      {step.tool && (
                        <Badge variant="outline" className="text-[11px]">
                          Tool • {step.tool}
                        </Badge>
                      )}
                      {formatDuration(step) && (
                        <Badge variant="subtle" className="text-[11px]">
                          {formatDuration(step)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {step.detail && (
                    <p className="mt-3 text-sm text-muted-foreground/85 whitespace-pre-wrap">
                      {step.detail}
                    </p>
                  )}

                  {step.outputPreview && (
                    <div className="mt-3 rounded-lg border border-dashed border-border/50 bg-background/70 p-3 text-xs text-muted-foreground/80">
                      {step.outputPreview}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {onOpenLogs && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onOpenLogs(step)}
                      >
                        View logs
                      </Button>
                    )}
                    {step.status === 'failed' && onRetry && (
                      <Button
                        variant="surface"
                        size="sm"
                        onClick={() => onRetry(step)}
                      >
                        Retry step
                      </Button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <AnimatePresence initial={false}>
                {sortedSteps.map((step) => (
                  <motion.li
                    key={step.id}
                    {...ANIMATION_PRESETS.slideUp}
                    transition={{
                      duration: durations.normal,
                      ease: EASING_FRAMER.default,
                    }}
                    className="rounded-lg border border-border/50 bg-muted p-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground shadow-inner">
                          {statusIcon[step.status]}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-foreground">
                            {step.title}
                          </span>
                          <span className="text-xs text-muted-foreground/70">
                            Started{' '}
                            {step.startedAt.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={statusBadge[step.status]}>
                          {statusLabel[step.status]}
                        </Badge>
                        {step.tool && (
                          <Badge variant="outline" className="text-[11px]">
                            Tool • {step.tool}
                          </Badge>
                        )}
                        {formatDuration(step) && (
                          <Badge variant="subtle" className="text-[11px]">
                            {formatDuration(step)}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {step.detail && (
                      <p className="mt-3 text-sm text-muted-foreground/85 whitespace-pre-wrap">
                        {step.detail}
                      </p>
                    )}

                    {step.outputPreview && (
                      <div className="mt-3 rounded-lg border border-dashed border-border/50 bg-background/70 p-3 text-xs text-muted-foreground/80">
                        {step.outputPreview}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {onOpenLogs && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onOpenLogs(step)}
                        >
                          View logs
                        </Button>
                      )}
                      {step.status === 'failed' && onRetry && (
                        <Button
                          variant="surface"
                          size="sm"
                          onClick={() => onRetry(step)}
                        >
                          Retry step
                        </Button>
                      )}
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            )}
          </ol>
        </CardContent>
      </Card>
    )
  }
)

AgentRunFeed.displayName = 'AgentRunFeed'
