/**
 * usePromptOptimizer Hook
 * 
 * Wraps the full prompt optimization engine for React components
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { PromptRecipe, ModelMetadata, OptimizationStrategy } from '../core/types'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import {
  optimizePrompt,
  type OptimizedPromptResult,
  type PromptOptimizerOptions,
} from '../core/prompt-optimizer'

/**
 * Hook options
 */
export interface UsePromptOptimizerOptions {
  /** Prompt recipe (toon DSL) */
  toon?: PromptRecipe
  /** Messages to optimize */
  messages: CoreMessage[]
  /** Memory context */
  memoryContext?: CoreMessage[]
  /** Model metadata */
  model: ModelMetadata
  /** Target token budget */
  targetTokens: number
  /** Optimization strategies */
  strategies?: OptimizationStrategy[]
  /** Auto-optimize when messages change */
  autoOptimize?: boolean
  /** Query text for semantic prioritization */
  queryText?: string
  /** Cost budget */
  costBudget?: number
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Hook return value
 */
export interface UsePromptOptimizerReturn {
  /** Optimized messages */
  optimizedMessages: CoreMessage[]
  /** Token statistics */
  tokenStats: OptimizedPromptResult['tokenStats']
  /** Cost estimate */
  costEstimate: OptimizedPromptResult['costEstimate']
  /** Optimization diagnostics */
  diagnostics: OptimizedPromptResult['diagnostics']
  /** Strategy used */
  strategy: string
  /** Whether optimization is in progress */
  isOptimizing: boolean
  /** Error if optimization failed */
  error: Error | null
  /** Manually trigger optimization */
  optimize: () => Promise<void>
  /** Reset to original messages */
  reset: () => void
}

/**
 * Hook for prompt optimization
 * 
 * @example
 * ```tsx
 * const {
 *   optimizedMessages,
 *   tokenStats,
 *   diagnostics,
 * } = usePromptOptimizer({
 *   toon: myRecipe,
 *   messages: chatMessages,
 *   model: { id: 'gpt-4', maxTokens: 8192 },
 *   targetTokens: 4000,
 *   autoOptimize: true,
 * })
 * ```
 */
export function usePromptOptimizer(
  options: UsePromptOptimizerOptions
): UsePromptOptimizerReturn {
  const {
    toon,
    messages,
    memoryContext,
    model,
    targetTokens,
    strategies,
    autoOptimize = true,
    queryText,
    costBudget,
    debug = false,
  } = options

  const [result, setResult] = useState<OptimizedPromptResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const optimize = useCallback(async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      const optimizerOptions: PromptOptimizerOptions = {
        toonDefinition: toon,
        messages,
        memoryContext,
        modelProfile: model,
        targetTokens,
        strategies,
        queryText,
        costBudget,
        debug,
      }

      const optimizationResult = await optimizePrompt(optimizerOptions)
      setResult(optimizationResult)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (debug) {
        console.error('[usePromptOptimizer] Optimization failed:', error)
      }
    } finally {
      setIsOptimizing(false)
    }
  }, [
    toon,
    messages,
    memoryContext,
    model,
    targetTokens,
    strategies,
    queryText,
    costBudget,
    debug,
  ])

  // Auto-optimize when dependencies change
  useEffect(() => {
    if (autoOptimize) {
      optimize()
    }
  }, [autoOptimize, optimize])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  // Return optimized messages or original if not optimized yet
  const optimizedMessages = useMemo(() => {
    return result?.messages || messages
  }, [result, messages])

  const tokenStats = useMemo(() => {
    if (result) {
      return result.tokenStats
    }
    // Return default stats if not optimized
    return {
      originalTokens: 0,
      optimizedTokens: 0,
      targetTokens,
      savings: 0,
      savingsPercent: 0,
      usagePercent: 0,
    }
  }, [result, targetTokens])

  const costEstimate = useMemo(() => {
    if (result) {
      return result.costEstimate
    }
    return {
      originalCost: 0,
      optimizedCost: 0,
      savings: 0,
    }
  }, [result])

  const diagnostics = useMemo(() => {
    if (result) {
      return result.diagnostics
    }
    return {
      originalTokens: 0,
      optimizedTokens: 0,
      droppedMessages: 0,
      summarizedMessages: 0,
      strategy: 'none' as const,
      reason: 'Not optimized',
      stages: [],
    }
  }, [result])

  return {
    optimizedMessages,
    tokenStats,
    costEstimate,
    diagnostics,
    strategy: result?.strategy || 'none',
    isOptimizing,
    error,
    optimize,
    reset,
  }
}
