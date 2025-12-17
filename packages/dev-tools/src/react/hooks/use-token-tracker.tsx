/**
 * React hook for AI Token Usage Tracking
 *
 * Track and monitor AI token usage and costs
 */

'use client'

import * as React from 'react'
import {
  getTokenTracker,
  createTokenTracker,
  type TokenTracker,
  type TokenEvent,
  type TokenUsage,
  type UsageStats,
  type BudgetConfig,
  type ModelPricing,
} from '../../debug/token-tracker'

export interface UseTokenTrackerOptions {
  enabled?: boolean
  customPricing?: Record<string, ModelPricing>
  budget?: Partial<BudgetConfig>
  onBudgetWarning?: (message: string) => void
}

export interface UseTokenTrackerReturn {
  stats: UsageStats
  events: TokenEvent[]
  track: (options: {
    provider: string
    model: string
    usage: TokenUsage
    conversationId?: string
  }) => TokenEvent
  estimateCost: (model: string, promptTokens: number, completionTokens: number) => {
    promptCost: number
    completionCost: number
    totalCost: number
  }
  getRecommendations: () => string[]
  clear: () => void
  export: () => string
}

/**
 * Hook to track AI token usage
 */
export function useTokenTracker(
  options: UseTokenTrackerOptions = {}
): UseTokenTrackerReturn {
  const {
    enabled = process.env.NODE_ENV === 'development',
    customPricing,
    budget,
    onBudgetWarning,
  } = options

  const tracker = React.useMemo(() => {
    if (customPricing || budget) {
      return createTokenTracker({ enabled, customPricing, budget })
    }
    return getTokenTracker()
  }, [enabled, customPricing, budget])

  const [stats, setStats] = React.useState<UsageStats>(() => tracker.getStats())
  const [events, setEvents] = React.useState<TokenEvent[]>([])

  // Subscribe to token events
  React.useEffect(() => {
    const unsubscribe = tracker.addListener((event, newStats) => {
      setStats(newStats)
      setEvents(tracker.getEvents(50))
    })

    // Initial load
    setStats(tracker.getStats())
    setEvents(tracker.getEvents(50))

    return unsubscribe
  }, [tracker])

  const track = React.useCallback((trackOptions: {
    provider: string
    model: string
    usage: TokenUsage
    conversationId?: string
  }) => {
    return tracker.track(trackOptions)
  }, [tracker])

  const estimateCost = React.useCallback((
    model: string,
    promptTokens: number,
    completionTokens: number
  ) => {
    const cost = tracker.estimateCost(model, promptTokens, completionTokens)
    return {
      promptCost: cost.promptCost,
      completionCost: cost.completionCost,
      totalCost: cost.totalCost,
    }
  }, [tracker])

  const getRecommendations = React.useCallback(() => {
    return tracker.getOptimizationRecommendations()
  }, [tracker])

  const clear = React.useCallback(() => {
    tracker.clear()
    setStats(tracker.getStats())
    setEvents([])
  }, [tracker])

  const exportData = React.useCallback(() => {
    return tracker.export()
  }, [tracker])

  return {
    stats,
    events,
    track,
    estimateCost,
    getRecommendations,
    clear,
    export: exportData,
  }
}

export default useTokenTracker
