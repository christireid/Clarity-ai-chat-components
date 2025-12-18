'use client'

import * as React from 'react'
import { ModelRouter, COMMON_MODELS } from '../utils/model-router'
import type { RouteModelConfig, RoutingDecision } from '../utils/model-router'

export interface UseModelRouterOptions {
  /** Available models to route between */
  availableModels?: RouteModelConfig[]
  /** Preferred provider */
  preferProvider?: string
  /** Maximum cost per query */
  maxCost?: number
  /** Enable learning from feedback */
  learningEnabled?: boolean
  /** Callback when routing decision made */
  onRoute?: (decision: RoutingDecision) => void
}

export interface UseModelRouterReturn {
  /** Route a query to appropriate model */
  route: (query: string, context?: string[]) => RoutingDecision
  /** Record feedback for learning */
  recordFeedback: (
    index: number,
    actualCost: number,
    satisfaction: number
  ) => void
  /** Get routing statistics */
  stats: {
    totalQueries: number
    totalEstimatedCost: number
    totalActualCost: number
    averageSavings: number
    modelUsage: Record<string, number>
  }
  /** Get routing history */
  history: Array<{
    query: string
    decision: RoutingDecision
    actualCost?: number
    userSatisfaction?: number
  }>
  /** Clear history */
  clearHistory: () => void
  /** Last routing decision */
  lastDecision: RoutingDecision | null
}

/**
 * Hook for intelligent model routing
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const router = useModelRouter({
 *     availableModels: [
 *       { id: 'gpt-3.5-turbo', tier: 'simple', ... },
 *       { id: 'gpt-4', tier: 'advanced', ... },
 *     ],
 *     onRoute: (decision) => {
 *       logger.debug(`Using ${decision.model.name}`)
 *       logger.debug(`Estimated cost: $${decision.estimatedCost.toFixed(4)}`)
 *       logger.debug(`Savings: ${decision.savingsPercent.toFixed(1)}%`)
 *     }
 *   })
 *
 *   const handleQuery = async (query: string) => {
 *     // Route to best model
 *     const decision = router.route(query, conversationHistory)
 *
 *     // Use the selected model
 *     const response = await queryAPI(query, {
 *       model: decision.model.id
 *     })
 *
 *     return response
 *   }
 *
 *   return (
 *     <div>
 *       <div>Total Queries: {router.stats.totalQueries}</div>
 *       <div>Average Savings: {router.stats.averageSavings.toFixed(1)}%</div>
 *       <div>Total Cost: ${router.stats.totalEstimatedCost.toFixed(4)}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useModelRouter(
  options: UseModelRouterOptions = {}
): UseModelRouterReturn {
  const {
    availableModels = COMMON_MODELS,
    preferProvider,
    maxCost,
    learningEnabled = false,
    onRoute,
  } = options

  const [lastDecision, setLastDecision] =
    React.useState<RoutingDecision | null>(null)
  const [stats, setStats] = React.useState({
    totalQueries: 0,
    totalEstimatedCost: 0,
    totalActualCost: 0,
    averageSavings: 0,
    modelUsage: {} as Record<string, number>,
  })

  // Create router instance (memoized)
  const router = React.useMemo(
    () =>
      new ModelRouter(availableModels, {
        preferProvider,
        maxCost,
        learningEnabled,
      }),
    [availableModels, preferProvider, maxCost, learningEnabled]
  )

  const route = React.useCallback(
    (query: string, context?: string[]): RoutingDecision => {
      const decision = router.route(query, context)
      setLastDecision(decision)
      setStats(router.getStats())
      onRoute?.(decision)
      return decision
    },
    [router, onRoute]
  )

  const recordFeedback = React.useCallback(
    (index: number, actualCost: number, satisfaction: number) => {
      router.recordFeedback(index, actualCost, satisfaction)
      setStats(router.getStats())
    },
    [router]
  )

  const clearHistory = React.useCallback(() => {
    router.clearHistory()
    setStats(router.getStats())
    setLastDecision(null)
  }, [router])

  return {
    route,
    recordFeedback,
    stats,
    history: router.getHistory(),
    clearHistory,
    lastDecision,
  }
}
