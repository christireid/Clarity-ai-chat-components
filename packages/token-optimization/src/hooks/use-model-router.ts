/**
 * useModelRouter - React hook for cost-optimized model selection
 *
 * Provides a React-friendly interface to the ModelRouter system
 * with automatic complexity analysis and cost tracking.
 *
 * @module use-model-router
 */

import { useRef, useCallback, useMemo, useState, useEffect } from 'react'
import { ModelRouter, RoutingStrategy } from '../routing/model-router'
import type {
  ModelRouterConfig,
  ModelRoutingConfig,
  RoutingOptions,
  RoutingResult,
  RouterStats,
} from '../routing/model-router'

/**
 * Hook configuration - extends ModelRouterConfig
 */
export interface UseModelRouterConfig extends ModelRouterConfig {
  /** Enable automatic stats tracking (triggers re-render on stats change) */
  trackStats?: boolean
}

/**
 * Hook return type
 */
export interface UseModelRouterReturn {
  /**
   * Route a prompt to the optimal model
   *
   * @param prompt - The prompt to route
   * @param options - Routing options
   * @returns Routing result with selected model and cost estimate
   */
  route: (prompt: string, options?: RoutingOptions) => RoutingResult

  /**
   * Get current router statistics
   */
  getStats: () => RouterStats

  /**
   * Reset all statistics
   */
  resetStats: () => void

  /**
   * Current router statistics (reactive, only when trackStats=true)
   */
  stats: RouterStats | null

  /**
   * Available models
   */
  models: ModelRoutingConfig[]

  /**
   * Default routing strategy
   */
  defaultStrategy: RoutingStrategy

  /**
   * Whether the router is ready
   */
  isReady: boolean
}

/**
 * React hook for cost-optimized model selection
 *
 * @param config - Configuration for the model router including models and strategy
 * @returns Router interface with route, getStats, and resetStats functions
 *
 * @example
 * ```tsx
 * function AIChat() {
 *   const router = useModelRouter({
 *     models: [
 *       { id: 'gpt-4o-mini', tier: 'small', inputCostPer1M: 0.15, ... },
 *       { id: 'gpt-4o', tier: 'medium', inputCostPer1M: 2.5, ... },
 *       { id: 'claude-3-opus', tier: 'premium', inputCostPer1M: 15, ... }
 *     ],
 *     defaultStrategy: RoutingStrategy.CostOptimized,
 *     trackStats: true
 *   })
 *
 *   const handleSubmit = async (prompt: string) => {
 *     const result = router.route(prompt, {
 *       estimatedOutputTokens: 500
 *     })
 *
 *     if (!result.selectedModel) {
 *       return 'No suitable model found'
 *     }
 *
 *     // Use result.selectedModel.id to make API call
 *     const response = await callAI(result.selectedModel.id, prompt)
 *     return response
 *   }
 *
 *   return (
 *     <ChatUI
 *       onSubmit={handleSubmit}
 *       savings={router.stats?.estimatedSavings}
 *     />
 *   )
 * }
 * ```
 */
export function useModelRouter(
  config: UseModelRouterConfig
): UseModelRouterReturn {
  const { trackStats = false, ...routerConfig } = config

  // Persist router instance across renders
  const routerRef = useRef<ModelRouter | null>(null)

  // Lazy initialization
  if (routerRef.current === null) {
    routerRef.current = new ModelRouter(routerConfig)
  }

  // Track stats reactively if enabled
  const [stats, setStats] = useState<RouterStats | null>(null)

  // Update router on config change
  useEffect(() => {
    routerRef.current = new ModelRouter(routerConfig)
  }, [routerConfig])

  // Initialize stats in effect to avoid setState during render
  useEffect(() => {
    if (trackStats && routerRef.current) {
      setStats(routerRef.current.getStats())
    }
  }, [trackStats])

  // Update stats helper
  const updateStats = useCallback(() => {
    if (trackStats && routerRef.current) {
      setStats(routerRef.current.getStats())
    }
  }, [trackStats])

  // Memoized route function
  const route = useCallback(
    (prompt: string, options?: RoutingOptions): RoutingResult => {
      if (!routerRef.current) {
        return {
          selectedModel: undefined,
          strategy: config.defaultStrategy ?? RoutingStrategy.CostOptimized,
          confidence: 0,
        }
      }
      const result = routerRef.current.route(prompt, options)
      updateStats()
      return result
    },
    [updateStats, config.defaultStrategy]
  )

  // Memoized getStats function
  const getStats = useCallback((): RouterStats => {
    if (!routerRef.current) {
      return {
        totalRoutes: 0,
        routesByTier: { small: 0, medium: 0, large: 0, premium: 0 },
        estimatedSavings: 0,
        averageComplexity: 0,
      }
    }
    return routerRef.current.getStats()
  }, [])

  // Memoized resetStats function
  const resetStats = useCallback((): void => {
    if (!routerRef.current) return
    routerRef.current.resetStats()
    updateStats()
  }, [updateStats])

  // Memoized return value
  return useMemo(
    () => ({
      route,
      getStats,
      resetStats,
      stats,
      models: config.models,
      defaultStrategy: config.defaultStrategy ?? RoutingStrategy.CostOptimized,
      isReady: routerRef.current !== null,
    }),
    [route, getStats, resetStats, stats, config.models, config.defaultStrategy]
  )
}

// Re-export types and enums for convenience
export { RoutingStrategy }
export type { ModelRoutingConfig, RoutingOptions, RoutingResult, RouterStats }
