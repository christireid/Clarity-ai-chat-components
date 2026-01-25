'use client'

import * as React from 'react'
import type {
  UseTokenThrottleConfig,
  UseTokenThrottleReturn,
  ThrottleState,
} from './types'

/**
 * useTokenThrottle - Rate limiting and token budgeting
 *
 * Enforces token usage limits per time window (minute, hour, day).
 * Provides budget allocation across different request types with
 * configurable overflow strategies (queue, reject, degrade).
 *
 * @param config - Configuration options
 * @returns Throttle utilities and state
 *
 * @example
 * ```tsx
 * function ThrottledChat() {
 *   const {
 *     state,
 *     requestTokens,
 *     recordUsage,
 *     getBudgetStatus,
 *   } = useTokenThrottle({
 *     limits: {
 *       perMinute: 10000,
 *       perHour: 100000,
 *       perDay: 1000000,
 *     },
 *     budgets: {
 *       chat: { allocation: 60, priority: 1 },
 *       search: { allocation: 30, priority: 2 },
 *       background: { allocation: 10, priority: 3 },
 *     },
 *     overflowStrategy: 'degrade',
 *   })
 *
 *   const handleSend = async (message: string, category: string) => {
 *     const estimatedTokens = estimateTokens(message)
 *
 *     // Request tokens before API call
 *     const { granted, grantedCount, reason } = await requestTokens(
 *       estimatedTokens,
 *       category
 *     )
 *
 *     if (!granted) {
 *       if (reason === 'quota_exceeded') {
 *         alert('Rate limit exceeded. Please wait.')
 *         return
 *       }
 *     }
 *
 *     // Use grantedCount (may be less if degraded)
 *     const response = await sendWithTokenLimit(message, grantedCount)
 *
 *     // Record actual usage
 *     recordUsage(response.tokensUsed, category)
 *   }
 *
 *   return (
 *     <div>
 *       <span>Tokens remaining: {state.tokensRemaining.minute}/min</span>
 *       {state.isThrottled && <span>Rate limited until {state.nextAvailableAt}</span>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useTokenThrottle(
  config: UseTokenThrottleConfig
): UseTokenThrottleReturn {
  const {
    limits,
    budgets = {},
    overflowStrategy = 'queue',
    degradationRatio = 0.5,
    persistUsage = false,
  } = config

  // State
  const [state, setState] = React.useState<ThrottleState>({
    tokensUsedThisMinute: 0,
    tokensUsedThisHour: 0,
    tokensUsedThisDay: 0,
    tokensRemaining: {
      minute: limits.perMinute ?? Infinity,
      hour: limits.perHour ?? Infinity,
      day: limits.perDay ?? Infinity,
    },
    queuedRequests: 0,
    isThrottled: false,
    nextAvailableAt: null,
  })

  // Category usage tracking
  const [categoryUsage, setCategoryUsage] = React.useState<
    Record<string, number>
  >({})

  // Queue for pending requests
  const queueRef = React.useRef<
    Array<{
      resolve: (value: {
        granted: boolean
        grantedCount: number
        waitTimeMs: number
        reason?: 'quota_exceeded' | 'queued' | 'degraded'
      }) => void
      count: number
      category?: string
    }>
  >([])

  // Timer refs for resetting periods
  const minuteTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(
    null
  )
  const hourTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)
  const dayTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // Paused state
  const [isPaused, setIsPaused] = React.useState(false)

  // Load persisted usage
  React.useEffect(() => {
    if (persistUsage && typeof localStorage !== 'undefined') {
      try {
        const stored = localStorage.getItem('clarity-tokens-throttle')
        if (stored) {
          const data = JSON.parse(stored)
          // Only use if not expired (same day)
          const storedDate = new Date(data.date)
          const today = new Date()
          if (storedDate.toDateString() === today.toDateString()) {
            setState((prev) => ({
              ...prev,
              tokensUsedThisDay: data.tokensUsedThisDay ?? 0,
            }))
          }
        }
      } catch {
        // Ignore errors
      }
    }
  }, [persistUsage])

  // Set up reset timers
  React.useEffect(() => {
    // Reset minute usage every minute
    minuteTimerRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        tokensUsedThisMinute: 0,
        tokensRemaining: {
          ...prev.tokensRemaining,
          minute: limits.perMinute ?? Infinity,
        },
        isThrottled: false,
        nextAvailableAt: null,
      }))

      // Process queued requests
      processQueue()
    }, 60000)

    // Reset hour usage every hour
    hourTimerRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        tokensUsedThisHour: 0,
        tokensRemaining: {
          ...prev.tokensRemaining,
          hour: limits.perHour ?? Infinity,
        },
      }))
    }, 3600000)

    // Reset day usage at midnight
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - now.getTime()

    const dailyReset = () => {
      setState((prev) => ({
        ...prev,
        tokensUsedThisDay: 0,
        tokensRemaining: {
          ...prev.tokensRemaining,
          day: limits.perDay ?? Infinity,
        },
      }))
      setCategoryUsage({})
    }

    dayTimerRef.current = setTimeout(() => {
      dailyReset()
      // Then set up daily interval
      dayTimerRef.current = setInterval(dailyReset, 86400000)
    }, msUntilMidnight)

    return () => {
      if (minuteTimerRef.current) clearInterval(minuteTimerRef.current)
      if (hourTimerRef.current) clearInterval(hourTimerRef.current)
      if (dayTimerRef.current) clearTimeout(dayTimerRef.current)
    }
  }, [limits.perMinute, limits.perHour, limits.perDay, processQueue])

  /**
   * Process queued requests
   */
  const processQueue = React.useCallback(() => {
    // Use setState callback to access latest state
    setState((prev) => {
      const queue = queueRef.current

      while (queue.length > 0) {
        const request = queue[0]

        // Check if we can fulfill
        const remaining = Math.min(
          prev.tokensRemaining.minute,
          prev.tokensRemaining.hour,
          prev.tokensRemaining.day
        )

        if (remaining >= request.count) {
          queue.shift()
          request.resolve({
            granted: true,
            grantedCount: request.count,
            waitTimeMs: 0,
          })

          // Update usage inline
          const newState = {
            ...prev,
            tokensUsedThisMinute: prev.tokensUsedThisMinute + request.count,
            tokensUsedThisHour: prev.tokensUsedThisHour + request.count,
            tokensUsedThisDay: prev.tokensUsedThisDay + request.count,
            tokensRemaining: {
              minute:
                (limits.perMinute ?? Infinity) -
                prev.tokensUsedThisMinute -
                request.count,
              hour:
                (limits.perHour ?? Infinity) -
                prev.tokensUsedThisHour -
                request.count,
              day:
                (limits.perDay ?? Infinity) -
                prev.tokensUsedThisDay -
                request.count,
            },
            queuedRequests: queue.length,
          }

          // Update category usage
          if (request.category) {
            setCategoryUsage((prevCat) => ({
              ...prevCat,
              [request.category!]: (prevCat[request.category!] ?? 0) + request.count,
            }))
          }

          // Persist if enabled
          if (persistUsage && typeof localStorage !== 'undefined') {
            localStorage.setItem(
              'clarity-tokens-throttle',
              JSON.stringify({
                date: new Date().toISOString(),
                tokensUsedThisDay: newState.tokensUsedThisDay,
              })
            )
          }

          prev = newState
        } else {
          break
        }
      }

      return {
        ...prev,
        queuedRequests: queue.length,
      }
    })
  }, [limits, persistUsage])

  /**
   * Internal usage recording
   */
  const recordUsageInternal = React.useCallback(
    (tokens: number, category?: string) => {
      setState((prev) => {
        const newState = {
          ...prev,
          tokensUsedThisMinute: prev.tokensUsedThisMinute + tokens,
          tokensUsedThisHour: prev.tokensUsedThisHour + tokens,
          tokensUsedThisDay: prev.tokensUsedThisDay + tokens,
          tokensRemaining: {
            minute:
              (limits.perMinute ?? Infinity) -
              prev.tokensUsedThisMinute -
              tokens,
            hour:
              (limits.perHour ?? Infinity) - prev.tokensUsedThisHour - tokens,
            day: (limits.perDay ?? Infinity) - prev.tokensUsedThisDay - tokens,
          },
        }

        // Persist if enabled
        if (persistUsage && typeof localStorage !== 'undefined') {
          localStorage.setItem(
            'clarity-tokens-throttle',
            JSON.stringify({
              date: new Date().toISOString(),
              tokensUsedThisDay: newState.tokensUsedThisDay,
            })
          )
        }

        return newState
      })

      if (category) {
        setCategoryUsage((prev) => ({
          ...prev,
          [category]: (prev[category] ?? 0) + tokens,
        }))
      }
    },
    [limits, persistUsage]
  )

  /**
   * Request tokens
   */
  const requestTokens = React.useCallback(
    async (
      count: number,
      category?: string
    ): Promise<{
      granted: boolean
      grantedCount: number
      waitTimeMs: number
      reason?: 'quota_exceeded' | 'queued' | 'degraded'
    }> => {
      if (isPaused) {
        return {
          granted: false,
          grantedCount: 0,
          waitTimeMs: Infinity,
          reason: 'quota_exceeded',
        }
      }

      // Check category budget
      if (category && budgets[category]) {
        const budget = budgets[category]
        const totalBudget =
          (limits.perDay ?? Infinity) * (budget.allocation / 100)
        const used = categoryUsage[category] ?? 0

        if (used + count > totalBudget) {
          return {
            granted: false,
            grantedCount: 0,
            waitTimeMs: 0,
            reason: 'quota_exceeded',
          }
        }
      }

      // Use setState callback to get latest state
      let currentRemaining = 0
      setState((prev) => {
        currentRemaining = Math.min(
          prev.tokensRemaining.minute,
          prev.tokensRemaining.hour,
          prev.tokensRemaining.day
        )
        return prev
      })

      if (currentRemaining >= count) {
        // Grant immediately
        recordUsageInternal(count, category)
        return {
          granted: true,
          grantedCount: count,
          waitTimeMs: 0,
        }
      }

      // Handle overflow
      switch (overflowStrategy) {
        case 'reject':
          setState((prev) => ({
            ...prev,
            isThrottled: true,
            nextAvailableAt: new Date(Date.now() + 60000),
          }))
          return {
            granted: false,
            grantedCount: 0,
            waitTimeMs: 0,
            reason: 'quota_exceeded',
          }

        case 'degrade':
          const degradedCount = Math.floor(currentRemaining * degradationRatio)
          if (degradedCount > 0) {
            recordUsageInternal(degradedCount, category)
            return {
              granted: true,
              grantedCount: degradedCount,
              waitTimeMs: 0,
              reason: 'degraded',
            }
          }
          return {
            granted: false,
            grantedCount: 0,
            waitTimeMs: 60000,
            reason: 'quota_exceeded',
          }

        case 'queue':
        default:
          // Add to queue
          return new Promise((resolve) => {
            queueRef.current.push({ resolve, count, category })
            setState((prev) => ({
              ...prev,
              queuedRequests: queueRef.current.length,
            }))
          })
      }
    },
    [
      isPaused,
      budgets,
      categoryUsage,
      limits,
      overflowStrategy,
      degradationRatio,
      recordUsageInternal,
    ]
  )

  /**
   * Record usage (public API)
   */
  const recordUsage = React.useCallback(
    (tokens: number, category?: string): void => {
      recordUsageInternal(tokens, category)
    },
    [recordUsageInternal]
  )

  /**
   * Get budget status
   */
  const getBudgetStatus = React.useCallback(
    (
      category: string
    ): {
      used: number
      remaining: number
      percentUsed: number
    } => {
      const budget = budgets[category]
      if (!budget) {
        return { used: 0, remaining: Infinity, percentUsed: 0 }
      }

      const totalBudget =
        (limits.perDay ?? Infinity) * (budget.allocation / 100)
      const used = categoryUsage[category] ?? 0
      const remaining = Math.max(0, totalBudget - used)
      const percentUsed = totalBudget > 0 ? (used / totalBudget) * 100 : 0

      return { used, remaining, percentUsed }
    },
    [budgets, limits.perDay, categoryUsage]
  )

  /**
   * Pause throttle
   */
  const pause = React.useCallback((): void => {
    setIsPaused(true)
  }, [])

  /**
   * Resume throttle
   */
  const resume = React.useCallback((): void => {
    setIsPaused(false)
    processQueue()
  }, [processQueue])

  /**
   * Reset limits
   */
  const resetLimits = React.useCallback((): void => {
    setState({
      tokensUsedThisMinute: 0,
      tokensUsedThisHour: 0,
      tokensUsedThisDay: 0,
      tokensRemaining: {
        minute: limits.perMinute ?? Infinity,
        hour: limits.perHour ?? Infinity,
        day: limits.perDay ?? Infinity,
      },
      queuedRequests: 0,
      isThrottled: false,
      nextAvailableAt: null,
    })
    setCategoryUsage({})
    queueRef.current = []
  }, [limits])

  return {
    state,
    requestTokens,
    recordUsage,
    getBudgetStatus,
    pause,
    resume,
    resetLimits,
  }
}
