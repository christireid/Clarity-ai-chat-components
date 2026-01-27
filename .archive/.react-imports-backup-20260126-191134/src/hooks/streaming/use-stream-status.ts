'use client'

import * as React from 'react'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Status of a streaming field in structured output
 */
export type FieldStreamStatus = 'pending' | 'streaming' | 'complete' | 'error'

/**
 * Per-field streaming status for structured outputs
 */
export interface FieldStatus {
  /** Field name/key */
  name: string
  /** Current status */
  status: FieldStreamStatus
  /** Tokens received for this field */
  tokensReceived: number
  /** Estimated total tokens for this field (if known) */
  estimatedTokens?: number
  /** Progress percentage (0-100) */
  progress: number
  /** Error message if status is 'error' */
  error?: string
  /** Timestamp when field started streaming */
  startedAt?: Date
  /** Timestamp when field completed */
  completedAt?: Date
}

/**
 * Overall streaming status
 */
export type StreamingState =
  | 'idle'
  | 'connecting'
  | 'streaming'
  | 'paused'
  | 'complete'
  | 'error'

/**
 * Token statistics
 */
export interface TokenStats {
  /** Total tokens received so far */
  received: number
  /** Estimated total tokens (if known) */
  estimated?: number
  /** Tokens per second (throughput) */
  tokensPerSecond: number
  /** Input tokens (if tracked separately) */
  inputTokens?: number
  /** Output tokens (if tracked separately) */
  outputTokens?: number
}

/**
 * Time statistics
 */
export interface TimeStats {
  /** Time elapsed in milliseconds */
  elapsed: number
  /** Estimated time remaining in milliseconds (if estimatedTotal is known) */
  remaining?: number
  /** Time to first token in milliseconds */
  timeToFirstToken?: number
  /** Streaming started timestamp */
  startedAt?: Date
}

/**
 * Options for useStreamStatus hook
 */
export interface UseStreamStatusOptions {
  /** Initial estimated total tokens (can be updated dynamically) */
  estimatedTotal?: number
  /** Fields to track for structured output streaming */
  trackedFields?: string[]
  /** Callback when streaming starts */
  onStart?: () => void
  /** Callback when progress updates */
  onProgress?: (progress: number, tokens: TokenStats) => void
  /** Callback when streaming completes */
  onComplete?: (finalStats: StreamStatusReturn) => void
  /** Callback when error occurs */
  onError?: (error: Error) => void
  /** Update interval for time-based calculations (ms) */
  updateInterval?: number
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Return type for useStreamStatus hook
 */
export interface UseStreamStatusReturn {
  /** Overall progress percentage (0-100) */
  progress: number
  /** Token statistics */
  tokens: TokenStats
  /** Time statistics */
  time: TimeStats
  /** Per-field status for structured outputs */
  fieldStatus: Map<string, FieldStatus>
  /** Current streaming state */
  state: StreamingState
  /** Whether currently streaming */
  isStreaming: boolean
  /** Whether streaming is complete */
  isComplete: boolean
  /** Whether an error occurred */
  hasError: boolean
  /** Error message if hasError is true */
  error?: string

  // Actions
  /** Start tracking a new stream */
  startStream: (estimatedTotal?: number) => void
  /** Record tokens received */
  recordTokens: (count: number) => void
  /** Update estimated total */
  updateEstimate: (estimatedTotal: number) => void
  /** Update field status (for structured outputs) */
  updateFieldStatus: (
    fieldName: string,
    updates: Partial<Omit<FieldStatus, 'name'>>
  ) => void
  /** Mark stream as complete */
  complete: () => void
  /** Mark stream as errored */
  setError: (error: string | Error) => void
  /** Pause streaming (for UI feedback) */
  pause: () => void
  /** Resume streaming */
  resume: () => void
  /** Reset all state */
  reset: () => void
}

/**
 * Simplified return type for external use
 */
export type StreamStatusReturn = Omit<
  UseStreamStatusReturn,
  | 'startStream'
  | 'recordTokens'
  | 'updateEstimate'
  | 'updateFieldStatus'
  | 'complete'
  | 'setError'
  | 'pause'
  | 'resume'
  | 'reset'
>

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate progress percentage safely
 */
function calculateProgress(received: number, estimated?: number): number {
  if (!estimated || estimated <= 0) return 0
  const progress = (received / estimated) * 100
  return Math.min(Math.max(progress, 0), 100)
}

/**
 * Calculate tokens per second
 */
function calculateThroughput(tokens: number, elapsedMs: number): number {
  if (elapsedMs <= 0) return 0
  return Math.round((tokens / elapsedMs) * 1000 * 100) / 100
}

/**
 * Calculate estimated time remaining
 */
function calculateRemainingTime(
  received: number,
  estimated: number | undefined,
  tokensPerSecond: number
): number | undefined {
  if (!estimated || tokensPerSecond <= 0) return undefined
  const remaining = estimated - received
  if (remaining <= 0) return 0
  return Math.round((remaining / tokensPerSecond) * 1000)
}

// =============================================================================
// HOOK IMPLEMENTATION
// =============================================================================

/**
 * useStreamStatus - Track streaming progress and statistics
 *
 * **Architecture Layer**: Mid-Level (Streaming Domain)
 *
 * A comprehensive hook for tracking streaming progress, token counts,
 * and per-field status for structured outputs. Inspired by Tambo's
 * useTamboStreamStatus pattern.
 *
 * **Features:**
 * - Overall progress tracking (0-100%)
 * - Per-field streaming status for structured outputs
 * - Token statistics (received, estimated, throughput)
 * - Time statistics (elapsed, remaining, time to first token)
 * - Pause/resume support
 * - Error handling
 * - Callbacks for state changes
 *
 * @param options - Configuration options
 * @returns Stream status state and actions
 *
 * @example
 * ```tsx
 * // Basic usage
 * const {
 *   progress,
 *   tokens,
 *   isStreaming,
 *   startStream,
 *   recordTokens,
 *   complete
 * } = useStreamStatus({ estimatedTotal: 500 })
 *
 * // Start tracking
 * startStream()
 *
 * // Record tokens as they arrive
 * recordTokens(50)
 *
 * // Mark complete
 * complete()
 * ```
 *
 * @example
 * ```tsx
 * // With structured output field tracking
 * const { fieldStatus, updateFieldStatus } = useStreamStatus({
 *   trackedFields: ['title', 'summary', 'content']
 * })
 *
 * // Update field status as each field streams
 * updateFieldStatus('title', { status: 'streaming', tokensReceived: 10 })
 * updateFieldStatus('title', { status: 'complete', tokensReceived: 25 })
 * ```
 *
 * @example
 * ```tsx
 * // With callbacks
 * const status = useStreamStatus({
 *   estimatedTotal: 1000,
 *   onStart: () => console.log('Streaming started'),
 *   onProgress: (progress, tokens) => {
 *     console.log(`${progress}% complete, ${tokens.tokensPerSecond} tok/s`)
 *   },
 *   onComplete: (stats) => {
 *     console.log(`Completed in ${stats.time.elapsed}ms`)
 *   },
 *   onError: (error) => console.error('Stream error:', error)
 * })
 * ```
 */
export function useStreamStatus(
  options: UseStreamStatusOptions = {}
): UseStreamStatusReturn {
  const {
    estimatedTotal: initialEstimate,
    trackedFields = [],
    onStart,
    onProgress,
    onComplete,
    onError,
    updateInterval = 100,
    debug = false,
  } = options

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [state, setState] = React.useState<StreamingState>('idle')
  const [tokensReceived, setTokensReceived] = React.useState(0)
  const [estimatedTotal, setEstimatedTotal] = React.useState<
    number | undefined
  >(initialEstimate)
  const [fieldStatus, setFieldStatus] = React.useState<
    Map<string, FieldStatus>
  >(
    () =>
      new Map(
        trackedFields.map((name) => [
          name,
          {
            name,
            status: 'pending' as FieldStreamStatus,
            tokensReceived: 0,
            progress: 0,
          },
        ])
      )
  )
  const [error, setErrorState] = React.useState<string | undefined>()
  const [startTime, setStartTime] = React.useState<Date | undefined>()
  const [firstTokenTime, setFirstTokenTime] = React.useState<
    number | undefined
  >()
  const [elapsed, setElapsed] = React.useState(0)

  // Refs for tracking
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const lastTokensRef = React.useRef(0)
  const throughputRef = React.useRef(0)

  // Store callbacks in refs to avoid dependency issues
  const onStartRef = React.useRef(onStart)
  const onProgressRef = React.useRef(onProgress)
  const onCompleteRef = React.useRef(onComplete)
  const onErrorRef = React.useRef(onError)

  React.useLayoutEffect(() => {
    onStartRef.current = onStart
    onProgressRef.current = onProgress
    onCompleteRef.current = onComplete
    onErrorRef.current = onError
  }, [onStart, onProgress, onComplete, onError])

  // ==========================================================================
  // DERIVED STATE
  // ==========================================================================

  const progress = React.useMemo(
    () => calculateProgress(tokensReceived, estimatedTotal),
    [tokensReceived, estimatedTotal]
  )

  const tokensPerSecond = throughputRef.current

  const tokens: TokenStats = React.useMemo(
    () => ({
      received: tokensReceived,
      estimated: estimatedTotal,
      tokensPerSecond,
    }),
    [tokensReceived, estimatedTotal, tokensPerSecond]
  )

  const time: TimeStats = React.useMemo(
    () => ({
      elapsed,
      remaining: calculateRemainingTime(
        tokensReceived,
        estimatedTotal,
        tokensPerSecond
      ),
      timeToFirstToken: firstTokenTime,
      startedAt: startTime,
    }),
    [
      elapsed,
      tokensReceived,
      estimatedTotal,
      tokensPerSecond,
      firstTokenTime,
      startTime,
    ]
  )

  const isStreaming = state === 'streaming' || state === 'connecting'
  const isComplete = state === 'complete'
  const hasError = state === 'error'

  // ==========================================================================
  // TIMER MANAGEMENT
  // ==========================================================================

  const startTimer = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const start = Date.now()
    setStartTime(new Date(start))

    intervalRef.current = setInterval(() => {
      const now = Date.now()
      const newElapsed = now - start
      setElapsed(newElapsed)

      // Calculate throughput (tokens per second)
      const currentTokens = lastTokensRef.current
      throughputRef.current = calculateThroughput(currentTokens, newElapsed)
    }, updateInterval)
  }, [updateInterval])

  const stopTimer = React.useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopTimer()
    }
  }, [stopTimer])

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  const startStream = React.useCallback(
    (newEstimatedTotal?: number) => {
      if (process.env['NODE_ENV'] === 'development') {
        if (debug) {
          console.log('[useStreamStatus] Starting stream', {
            newEstimatedTotal,
          })
        }
      }

      setState('connecting')
      setTokensReceived(0)
      setErrorState(undefined)
      setFirstTokenTime(undefined)
      lastTokensRef.current = 0
      throughputRef.current = 0

      if (newEstimatedTotal !== undefined) {
        setEstimatedTotal(newEstimatedTotal)
      }

      // Reset field status
      setFieldStatus(
        new Map(
          trackedFields.map((name) => [
            name,
            {
              name,
              status: 'pending' as FieldStreamStatus,
              tokensReceived: 0,
              progress: 0,
            },
          ])
        )
      )

      startTimer()
      onStartRef.current?.()
    },
    [trackedFields, startTimer, debug]
  )

  const recordTokens = React.useCallback(
    (count: number) => {
      setTokensReceived((prev) => {
        const newTotal = prev + count
        lastTokensRef.current = newTotal

        // Track time to first token
        if (prev === 0 && count > 0 && startTime) {
          const ttft = Date.now() - startTime.getTime()
          setFirstTokenTime(ttft)
          setState('streaming')

          if (process.env['NODE_ENV'] === 'development') {
            if (debug) {
              console.log('[useStreamStatus] First token received', { ttft })
            }
          }
        }

        // Call progress callback
        const newProgress = calculateProgress(newTotal, estimatedTotal)
        onProgressRef.current?.(newProgress, {
          received: newTotal,
          estimated: estimatedTotal,
          tokensPerSecond: throughputRef.current,
        })

        return newTotal
      })
    },
    [estimatedTotal, startTime, debug]
  )

  const updateEstimate = React.useCallback((newEstimate: number) => {
    setEstimatedTotal(newEstimate)
  }, [])

  const updateFieldStatus = React.useCallback(
    (fieldName: string, updates: Partial<Omit<FieldStatus, 'name'>>) => {
      setFieldStatus((prev) => {
        const newMap = new Map(prev)
        const existing = newMap.get(fieldName) || {
          name: fieldName,
          status: 'pending' as FieldStreamStatus,
          tokensReceived: 0,
          progress: 0,
        }

        const updated: FieldStatus = {
          ...existing,
          ...updates,
        }

        // Auto-calculate progress if tokens are provided
        if (
          updates.tokensReceived !== undefined &&
          updates.estimatedTokens !== undefined
        ) {
          updated.progress = calculateProgress(
            updates.tokensReceived,
            updates.estimatedTokens
          )
        } else if (
          updates.tokensReceived !== undefined &&
          existing.estimatedTokens
        ) {
          updated.progress = calculateProgress(
            updates.tokensReceived,
            existing.estimatedTokens
          )
        }

        // Auto-set timestamps
        if (updates.status === 'streaming' && !existing.startedAt) {
          updated.startedAt = new Date()
        }
        if (updates.status === 'complete' && !existing.completedAt) {
          updated.completedAt = new Date()
        }

        newMap.set(fieldName, updated)

        if (process.env['NODE_ENV'] === 'development') {
          if (debug) {
            console.log('[useStreamStatus] Field status updated', {
              fieldName,
              updated,
            })
          }
        }

        return newMap
      })
    },
    [debug]
  )

  const complete = React.useCallback(() => {
    if (debug) {
      console.log('[useStreamStatus] Stream complete', {
        tokensReceived: lastTokensRef.current,
        elapsed,
      })
    }

    setState('complete')
    stopTimer()

    // Get final stats for callback
    const finalStats: StreamStatusReturn = {
      progress: 100,
      tokens: {
        received: lastTokensRef.current,
        estimated: estimatedTotal,
        tokensPerSecond: throughputRef.current,
      },
      time: {
        elapsed,
        remaining: 0,
        timeToFirstToken: firstTokenTime,
        startedAt: startTime,
      },
      fieldStatus,
      state: 'complete',
      isStreaming: false,
      isComplete: true,
      hasError: false,
    }

    onCompleteRef.current?.(finalStats)
  }, [
    elapsed,
    estimatedTotal,
    firstTokenTime,
    startTime,
    fieldStatus,
    stopTimer,
    debug,
  ])

  const setError = React.useCallback(
    (err: string | Error) => {
      const errorMessage = err instanceof Error ? err.message : err

      if (process.env['NODE_ENV'] === 'development') {
        if (debug) {
          console.error('[useStreamStatus] Stream error', errorMessage)
        }
      }

      setState('error')
      setErrorState(errorMessage)
      stopTimer()

      onErrorRef.current?.(err instanceof Error ? err : new Error(errorMessage))
    },
    [stopTimer, debug]
  )

  const pause = React.useCallback(() => {
    if (state === 'streaming') {
      setState('paused')
      stopTimer()

      if (process.env['NODE_ENV'] === 'development') {
        if (debug) {
          console.log('[useStreamStatus] Stream paused')
        }
      }
    }
  }, [state, stopTimer, debug])

  const resume = React.useCallback(() => {
    if (state === 'paused') {
      setState('streaming')
      // Resume timer from current elapsed time
      const resumeStart = Date.now() - elapsed

      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const newElapsed = now - resumeStart
        setElapsed(newElapsed)
        throughputRef.current = calculateThroughput(
          lastTokensRef.current,
          newElapsed
        )
      }, updateInterval)

      if (process.env['NODE_ENV'] === 'development') {
        if (debug) {
          console.log('[useStreamStatus] Stream resumed')
        }
      }
    }
  }, [state, elapsed, updateInterval, debug])

  const reset = React.useCallback(() => {
    if (process.env['NODE_ENV'] === 'development') {
      if (debug) {
        console.log('[useStreamStatus] Reset')
      }
    }

    setState('idle')
    setTokensReceived(0)
    setEstimatedTotal(initialEstimate)
    setErrorState(undefined)
    setStartTime(undefined)
    setFirstTokenTime(undefined)
    setElapsed(0)
    lastTokensRef.current = 0
    throughputRef.current = 0
    stopTimer()

    // Reset field status
    setFieldStatus(
      new Map(
        trackedFields.map((name) => [
          name,
          {
            name,
            status: 'pending' as FieldStreamStatus,
            tokensReceived: 0,
            progress: 0,
          },
        ])
      )
    )
  }, [initialEstimate, trackedFields, stopTimer, debug])

  // ==========================================================================
  // RETURN
  // ==========================================================================

  return {
    // State
    progress,
    tokens,
    time,
    fieldStatus,
    state,
    isStreaming,
    isComplete,
    hasError,
    error,

    // Actions
    startStream,
    recordTokens,
    updateEstimate,
    updateFieldStatus,
    complete,
    setError,
    pause,
    resume,
    reset,
  }
}

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Simplified hook for basic progress tracking
 *
 * @example
 * ```tsx
 * const { progress, tokensReceived, isStreaming } = useSimpleStreamStatus(500)
 * ```
 */
export function useSimpleStreamStatus(estimatedTotal?: number) {
  const status = useStreamStatus({ estimatedTotal })

  return {
    progress: status.progress,
    tokensReceived: status.tokens.received,
    estimatedTotal: status.tokens.estimated,
    isStreaming: status.isStreaming,
    isComplete: status.isComplete,
    startStream: status.startStream,
    recordTokens: status.recordTokens,
    complete: status.complete,
    reset: status.reset,
  }
}
