/**
 * Request Queue Status Component
 *
 * Displays the current status of the request queue with progress indicators,
 * estimated wait times, and queue management controls.
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import {
  ClockIcon,
  QueueListIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PauseIcon,
} from '../ui/icons'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'

export interface RequestQueueStatusProps {
  /** Queue status */
  queueStatus: {
    queueLength: number
    activeCount: number
    maxConcurrent: number
    maxQueueSize: number
  }

  /** Rate limiting status */
  isRateLimited?: boolean
  rateLimitResetAt?: number | null

  /** Current request position in queue (if queued) */
  currentRequestPosition?: number
  currentRequestEstimatedWaitMs?: number

  /** Callbacks */
  onClearQueue?: () => void

  /** Display options */
  showProgress?: boolean
  showControls?: boolean
  compact?: boolean

  /** Styling */
  className?: string
}

/**
 * Request Queue Status Component
 *
 * Shows queue status with animations and user-friendly messaging.
 */
export function RequestQueueStatus({
  queueStatus,
  isRateLimited = false,
  rateLimitResetAt,
  currentRequestPosition,
  currentRequestEstimatedWaitMs,
  onClearQueue,
  showProgress = true,
  showControls = true,
  compact = false,
  className,
}: RequestQueueStatusProps) {
  const prefersReducedMotion = useReducedMotion()
  const { queueLength, activeCount, maxConcurrent, maxQueueSize } = queueStatus

  // Calculate progress percentages
  const queueProgress = (queueLength / maxQueueSize) * 100
  const activeProgress = (activeCount / maxConcurrent) * 100

  // Format estimated wait time
  const formatWaitTime = (ms: number): string => {
    const seconds = Math.ceil(ms / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Calculate time until rate limit reset
  const timeUntilReset = React.useMemo(() => {
    if (!rateLimitResetAt) return null
    const remaining = rateLimitResetAt - Date.now()
    return remaining > 0 ? remaining : 0
  }, [rateLimitResetAt])

  // Auto-update time displays
  const [, forceUpdate] = React.useReducer(x => x + 1, 0)
  React.useEffect(() => {
    const interval = setInterval(forceUpdate, 1000)
    return () => clearInterval(interval)
  }, [])

  const hasQueue = queueLength > 0
  const hasActive = activeCount > 0
  const isQueueFull = queueLength >= maxQueueSize
  const isAtCapacity = activeCount >= maxConcurrent

  // Don't show if nothing is happening
  if (!hasQueue && !hasActive && !isRateLimited && !currentRequestPosition) {
    return null
  }

  if (compact) {
    return (
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
        viewport={{ once: true }}
        className={`flex items-center gap-2 px-3 py-2 bg-muted/50 border rounded-lg ${className}`}
      >
        <QueueListIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {hasQueue && `${queueLength} in queue`}
          {hasQueue && hasActive && ' • '}
          {hasActive && `${activeCount} active`}
          {isRateLimited && ' • Rate limited'}
        </span>
        {currentRequestEstimatedWaitMs && (
          <Badge variant="outline" className="text-xs">
            ~{formatWaitTime(currentRequestEstimatedWaitMs)}
          </Badge>
        )}
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
        viewport={{ once: true }}
        className={className}
      >
        <Card className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm">
              <QueueListIcon className="w-4 h-4" />
              Request Queue Status
              {isRateLimited && (
                <Badge variant="destructive" className="ml-auto">
                  Rate Limited
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Rate limit warning */}
            {isRateLimited && timeUntilReset !== null && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <ExclamationTriangleIcon className="w-4 h-4 text-destructive flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">
                    Rate limit exceeded
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Next request available in {formatWaitTime(timeUntilReset)}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Current request status */}
            {currentRequestPosition && (
              <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                <ClockIcon className="w-4 h-4 text-accent-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Your request is queued (#{currentRequestPosition})
                  </p>
                  {currentRequestEstimatedWaitMs && (
                    <p className="text-xs text-muted-foreground">
                      Estimated wait: ~{formatWaitTime(currentRequestEstimatedWaitMs)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Active requests */}
            {hasActive && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Active requests</span>
                  <span className="font-medium">
                    {activeCount} / {maxConcurrent}
                  </span>
                </div>
                {showProgress && (
                  <Progress
                    value={activeProgress}
                    className="h-2"
                    // @ts-expect-error - Progress component may not have indicator props
                    indicatorClassName={isAtCapacity ? 'bg-warning' : 'bg-primary'}
                  />
                )}
              </div>
            )}

            {/* Queue status */}
            {hasQueue && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Queued requests</span>
                  <span className="font-medium">
                    {queueLength} / {maxQueueSize}
                  </span>
                </div>
                {showProgress && (
                  <Progress
                    value={queueProgress}
                    className="h-2"
                    // @ts-expect-error - Progress component may not have indicator props
                    indicatorClassName={isQueueFull ? 'bg-destructive' : 'bg-secondary'}
                  />
                )}
              </div>
            )}

            {/* Queue full warning */}
            {isQueueFull && (
              <motion.div
                initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <PauseIcon className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">
                  Request queue is full. Please wait for current requests to complete.
                </p>
              </motion.div>
            )}

            {/* Controls */}
            {showControls && (hasQueue || isRateLimited) && (
              <div className="flex gap-2 pt-2">
                {hasQueue && onClearQueue && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onClearQueue}
                    className="flex items-center gap-2"
                  >
                    <XMarkIcon className="w-3 h-3" />
                    Clear Queue
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

RequestQueueStatus.displayName = 'RequestQueueStatus'