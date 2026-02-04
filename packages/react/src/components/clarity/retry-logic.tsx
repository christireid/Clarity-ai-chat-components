'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import { Progress } from '@clarity-chat/primitives'
import {
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  X,
} from 'lucide-react'

// =============================================================================
// TYPES
// =============================================================================

export type RetryStatus =
  | 'idle'
  | 'pending'
  | 'retrying'
  | 'success'
  | 'failed'
  | 'cancelled'

export interface RetryConfig {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
  retryOn?: (error: Error) => boolean
}

export interface RetryState {
  status: RetryStatus
  attempt: number
  maxAttempts: number
  nextRetryIn: number
  error: Error | null
}

// =============================================================================
// USE RETRY HOOK
// =============================================================================

export function useRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): {
  execute: () => Promise<T | null>
  cancel: () => void
  reset: () => void
  state: RetryState
} {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    backoffMultiplier = 2,
    retryOn = () => true,
  } = config

  const [state, setState] = React.useState<RetryState>({
    status: 'idle',
    attempt: 0,
    maxAttempts: maxRetries,
    nextRetryIn: 0,
    error: null,
  })

  const cancelRef = React.useRef(false)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const cancel = React.useCallback(() => {
    cancelRef.current = true
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState((s) => ({ ...s, status: 'cancelled', nextRetryIn: 0 }))
  }, [])

  const reset = React.useCallback(() => {
    cancelRef.current = false
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setState({
      status: 'idle',
      attempt: 0,
      maxAttempts: maxRetries,
      nextRetryIn: 0,
      error: null,
    })
  }, [maxRetries])

  const execute = React.useCallback(async (): Promise<T | null> => {
    cancelRef.current = false
    let attempt = 0

    const attemptFn = async (): Promise<T | null> => {
      if (cancelRef.current) return null

      attempt++
      setState((s) => ({
        ...s,
        status: attempt === 1 ? 'pending' : 'retrying',
        attempt,
        error: null,
      }))

      try {
        const result = await fn()
        setState((s) => ({ ...s, status: 'success', error: null }))
        return result
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))

        if (cancelRef.current) return null

        if (attempt >= maxRetries || !retryOn(err)) {
          setState((s) => ({ ...s, status: 'failed', error: err }))
          throw err
        }

        const delay = Math.min(
          initialDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        )

        setState((s) => ({ ...s, nextRetryIn: delay, error: err }))

        // Countdown
        const startTime = Date.now()
        const updateCountdown = () => {
          if (cancelRef.current) return
          const remaining = Math.max(0, delay - (Date.now() - startTime))
          setState((s) => ({ ...s, nextRetryIn: remaining }))
          if (remaining > 0) {
            timeoutRef.current = setTimeout(updateCountdown, 100)
          }
        }
        updateCountdown()

        await new Promise((resolve) => {
          timeoutRef.current = setTimeout(resolve, delay)
        })

        return attemptFn()
      }
    }

    return attemptFn()
  }, [fn, maxRetries, initialDelay, maxDelay, backoffMultiplier, retryOn])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { execute, cancel, reset, state }
}

// =============================================================================
// RETRY INDICATOR
// =============================================================================

interface RetryIndicatorProps {
  state: RetryState
  onCancel?: () => void
  onRetry?: () => void
  showProgress?: boolean
  className?: string
}

export function RetryIndicator({
  state,
  onCancel,
  onRetry,
  showProgress = true,
  className,
}: RetryIndicatorProps) {
  const { status, attempt, maxAttempts, nextRetryIn, error } = state

  if (status === 'idle') return null

  const statusConfig: Record<
    RetryStatus,
    { icon: React.ReactNode; color: string; label: string }
  > = {
    idle: { icon: null, color: '', label: '' },
    pending: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      color: 'text-blue-500',
      label: 'Processing...',
    },
    retrying: {
      icon: <RefreshCw className="h-4 w-4 animate-spin" />,
      color: 'text-yellow-500',
      label: `Retrying (${attempt}/${maxAttempts})...`,
    },
    success: {
      icon: <CheckCircle className="h-4 w-4" />,
      color: 'text-green-500',
      label: 'Success',
    },
    failed: {
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'text-red-500',
      label: 'Failed',
    },
    cancelled: {
      icon: <X className="h-4 w-4" />,
      color: 'text-gray-500',
      label: 'Cancelled',
    },
  }

  const config = statusConfig[status]

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-3 rounded-lg bg-muted/50',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn('flex items-center gap-2', config.color)}>
          {config.icon}
          <span className="text-sm font-medium">{config.label}</span>
        </div>
        <div className="flex gap-2">
          {(status === 'pending' || status === 'retrying') && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-7"
            >
              Cancel
            </Button>
          )}
          {status === 'failed' && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-7 bg-transparent"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          )}
        </div>
      </div>

      {status === 'retrying' && nextRetryIn > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Retrying in {Math.ceil(nextRetryIn / 1000)}s</span>
          {showProgress && (
            <Progress
              value={100 - (nextRetryIn / (nextRetryIn + 1000)) * 100}
              className="flex-1 h-1"
            />
          )}
        </div>
      )}

      {error && (status === 'retrying' || status === 'failed') && (
        <p className="text-xs text-muted-foreground truncate">
          Error: {error.message}
        </p>
      )}
    </div>
  )
}

// =============================================================================
// AUTO RETRY WRAPPER
// =============================================================================

interface AutoRetryProps {
  children: React.ReactNode
  onRetry: () => Promise<void>
  config?: Partial<RetryConfig>
  showIndicator?: boolean
  className?: string
}

export function AutoRetry({
  children,
  onRetry,
  config,
  showIndicator = true,
  className,
}: AutoRetryProps) {
  const { execute, cancel, reset, state } = useRetry(onRetry, config)

  React.useEffect(() => {
    execute()
    return () => cancel()
  }, [execute, cancel])

  if (state.status === 'success') {
    return <>{children}</>
  }

  return (
    <div className={cn('relative', className)}>
      {showIndicator && (
        <RetryIndicator
          state={state}
          onCancel={cancel}
          onRetry={() => {
            reset()
            execute()
          }}
        />
      )}
    </div>
  )
}

// =============================================================================
// SEND WITH RETRY
// =============================================================================

interface SendWithRetryProps {
  onSend: () => Promise<void>
  children: React.ReactNode
  config?: Partial<RetryConfig>
  className?: string
}

export function SendWithRetry({
  onSend,
  children,
  config = { maxRetries: 3 },
  className,
}: SendWithRetryProps) {
  const { execute, cancel, reset, state } = useRetry(onSend, config)
  const [showRetry, setShowRetry] = React.useState(false)

  const handleSend = async () => {
    setShowRetry(true)
    try {
      await execute()
    } catch {
      // Error handled in state
    }
  }

  return (
    <div className={cn('relative', className)}>
      <div onClick={handleSend}>{children}</div>
      {showRetry && state.status !== 'idle' && state.status !== 'success' && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <RetryIndicator
            state={state}
            onCancel={() => {
              cancel()
              setShowRetry(false)
            }}
            onRetry={() => {
              reset()
              execute()
            }}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// OFFLINE QUEUE
// =============================================================================

interface QueuedMessage {
  id: string
  content: string
  timestamp: Date
  status: 'queued' | 'sending' | 'sent' | 'failed'
}

interface OfflineQueueProps {
  messages: QueuedMessage[]
  onRetry?: (id: string) => void
  onRemove?: (id: string) => void
  onRetryAll?: () => void
  className?: string
}

export function OfflineQueue({
  messages,
  onRetry,
  onRemove,
  onRetryAll,
  className,
}: OfflineQueueProps) {
  const queuedMessages = messages.filter(
    (m) => m.status === 'queued' || m.status === 'failed'
  )

  if (queuedMessages.length === 0) return null

  return (
    <div
      className={cn(
        'p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm font-medium text-yellow-600">
          <Clock className="h-4 w-4" />
          <span>{queuedMessages.length} messages waiting to send</span>
        </div>
        {onRetryAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetryAll}
            className="h-7 bg-transparent"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Send All
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {queuedMessages.slice(0, 3).map((message) => (
          <div
            key={message.id}
            className="flex items-center justify-between p-2 rounded bg-background/50"
          >
            <p className="text-sm truncate flex-1">{message.content}</p>
            <div className="flex gap-1 ml-2">
              {onRetry && message.status === 'failed' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRetry(message.id)}
                  className="h-6 w-6 p-0"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
              {onRemove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(message.id)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
        {queuedMessages.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            +{queuedMessages.length - 3} more messages
          </p>
        )}
      </div>
    </div>
  )
}
