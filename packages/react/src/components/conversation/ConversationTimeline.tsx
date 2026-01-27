'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  cn,
} from '@clarity-chat/primitives'
import {
  BotIcon,
  UserIcon,
  SearchIcon,
  SparklesIcon,
  FileIcon,
} from '../ui/icons'
import {
  EASING_FRAMER,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

export type TimelineEventType =
  | 'user'
  | 'assistant'
  | 'tool'
  | 'system'
  | 'note'

export interface ConversationTimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  timestamp: Date
  summary?: string
  metadata?: Array<{ label: string; value: string }>
  durationMs?: number
  status?: 'pending' | 'complete' | 'error'
  icon?: React.ReactNode
}

export interface ConversationTimelineProps {
  events: ConversationTimelineEvent[]
  onJumpToEvent?: (event: ConversationTimelineEvent) => void
  showStatusIndicators?: boolean
  className?: string
  title?: string
  subtitle?: string
}

const typeStyles: Record<
  TimelineEventType,
  { bg: string; border: string; icon: React.ReactNode }
> = {
  user: {
    bg: 'from-primary/12 via-primary/5 to-transparent',
    border: 'border-primary/40',
    icon: <UserIcon size={16} className="text-primary" />,
  },
  assistant: {
    bg: 'from-sky-500/12 via-sky-500/5 to-transparent',
    border: 'border-sky-500/40',
    icon: <BotIcon size={16} className="text-sky-500" />,
  },
  tool: {
    bg: 'from-amber-500/12 via-amber-500/5 to-transparent',
    border: 'border-amber-500/40',
    icon: <SparklesIcon size={16} className="text-amber-500" />,
  },
  system: {
    bg: 'from-emerald-500/12 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/40',
    icon: <SearchIcon size={16} className="text-emerald-500" />,
  },
  note: {
    bg: 'from-purple-500/12 via-purple-500/5 to-transparent',
    border: 'border-purple-500/40',
    icon: <FileIcon size={16} className="text-purple-500" />,
  },
}

const statusText: Record<
  NonNullable<ConversationTimelineEvent['status']>,
  string
> = {
  pending: 'Pending',
  complete: 'Complete',
  error: 'Needs attention',
}

const statusVariant: Record<
  NonNullable<ConversationTimelineEvent['status']>,
  'warning' | 'success' | 'destructive'
> = {
  pending: 'warning',
  complete: 'success',
  error: 'destructive',
}

const defaultTitle = 'Conversation timeline'
const defaultSubtitle =
  'Inspect how the session evolved across user input, model responses, and tool calls.'

export const ConversationTimeline: React.FC<ConversationTimelineProps> = ({
  events,
  onJumpToEvent,
  showStatusIndicators = true,
  className,
  title = defaultTitle,
  subtitle = defaultSubtitle,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const sortedEvents = React.useMemo(
    () =>
      [...events].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
    [events]
  )

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <Card
      className={cn(
        'border-border/60 bg-[hsl(var(--surface-elevated))] shadow-[0_24px_54px_rgba(15,23,42,0.18)]',
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
      </CardHeader>
      <CardContent className="">
        <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border/70">
          {prefersReducedMotion ? (
            sortedEvents.map((event, index) => {
              const style = typeStyles[event.type]
              const isLast = index === sortedEvents.length - 1
              const timelineDotClasses = cn(
                'absolute left-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border bg-[hsl(var(--surface-elevated))] shadow-[0_6px_16px_rgba(15,23,42,0.16)]',
                style.border
              )

              return (
                <li key={event.id} className="relative pl-12">
                  <span className={timelineDotClasses}>
                    {event.icon ?? style.icon}
                  </span>
                  <div
                    className={cn(
                      'group flex flex-col gap-2 rounded-lg border bg-gradient-to-br p-4 text-sm shadow-md backdrop-blur-sm transition-all duration-150 ease-out hover:-translate-y-px hover:border-primary/40',
                      style.bg,
                      style.border
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-semibold text-foreground">
                          {event.title}
                        </h3>
                        <span className="text-xs font-medium text-muted-foreground/70">
                          {formatTime(event.timestamp)}
                        </span>
                        {event.durationMs !== undefined && (
                          <span className="text-xs font-medium text-muted-foreground/70">
                            • {(event.durationMs / 1000).toFixed(1)}s
                          </span>
                        )}
                      </div>

                      {showStatusIndicators && event.status && (
                        <Badge variant={statusVariant[event.status]}>
                          {statusText[event.status]}
                        </Badge>
                      )}
                    </div>

                    {event.summary && (
                      <p className="text-sm text-muted-foreground/85">
                        {event.summary}
                      </p>
                    )}

                    {event.metadata && event.metadata.length > 0 && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground/70">
                        {event.metadata.map(({ label, value }) => (
                          <div
                            key={`${event.id}-${label}`}
                            className="flex items-center gap-1"
                          >
                            <span className="font-medium text-muted-foreground/90">
                              {label}:
                            </span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {onJumpToEvent && (
                      <button
                        type="button"
                        onClick={() => onJumpToEvent(event)}
                        className="self-start text-xs font-semibold text-primary transition-all hover:text-primary/80"
                      >
                        Jump to moment →
                      </button>
                    )}
                  </div>

                  {!isLast && (
                    <span className="sr-only">Continues to next event</span>
                  )}
                </li>
              )
            })
          ) : (
            <AnimatePresence initial={false}>
              {sortedEvents.map((event, index) => {
                const style = typeStyles[event.type]
                const isLast = index === sortedEvents.length - 1
                const timelineDotClasses = cn(
                  'absolute left-0 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border bg-[hsl(var(--surface-elevated))] shadow-[0_6px_16px_rgba(15,23,42,0.16)]',
                  style.border
                )

                return (
                  <motion.li
                    key={event.id}
                    {...ANIMATION_PRESETS.slideUp}
                    initial={{ opacity: 0, y: 12 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{
                      duration: durations.normal,
                      ease: EASING_FRAMER.default,
                    }}
                    viewport={{ once: true }}
                    className="relative pl-12"
                  >
                    <span className={timelineDotClasses}>
                      {event.icon ?? style.icon}
                    </span>
                    <div
                      className={cn(
                        'group flex flex-col gap-2 rounded-lg border bg-gradient-to-br p-4 text-sm shadow-md backdrop-blur-sm transition-all duration-150 ease-out hover:-translate-y-px hover:border-primary/40',
                        style.bg,
                        style.border
                      )}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-foreground">
                            {event.title}
                          </h3>
                          <span className="text-xs font-medium text-muted-foreground/70">
                            {formatTime(event.timestamp)}
                          </span>
                          {event.durationMs !== undefined && (
                            <span className="text-xs font-medium text-muted-foreground/70">
                              • {(event.durationMs / 1000).toFixed(1)}s
                            </span>
                          )}
                        </div>

                        {showStatusIndicators && event.status && (
                          <Badge variant={statusVariant[event.status]}>
                            {statusText[event.status]}
                          </Badge>
                        )}
                      </div>

                      {event.summary && (
                        <p className="text-sm text-muted-foreground/85">
                          {event.summary}
                        </p>
                      )}

                      {event.metadata && event.metadata.length > 0 && (
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground/70">
                          {event.metadata.map(({ label, value }) => (
                            <div
                              key={`${event.id}-${label}`}
                              className="flex items-center gap-1"
                            >
                              <span className="font-medium text-muted-foreground/90">
                                {label}:
                              </span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {onJumpToEvent && (
                        <button
                          type="button"
                          onClick={() => onJumpToEvent(event)}
                          className="self-start text-xs font-semibold text-primary transition-all hover:text-primary/80"
                        >
                          Jump to moment →
                        </button>
                      )}
                    </div>

                    {!isLast && (
                      <span className="sr-only">Continues to next event</span>
                    )}
                  </motion.li>
                )
              })}
            </AnimatePresence>
          )}
        </ol>
      </CardContent>
    </Card>
  )
}

ConversationTimeline.displayName = 'ConversationTimeline'
