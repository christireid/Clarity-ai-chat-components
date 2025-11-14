/**
 * usePromptOptimizer Hook
 * 
 * Advanced hook that wraps the full optimization engine
 */

import { useState, useEffect, useCallback } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import {
  optimizePrompt,
  type PromptOptimizationOptions,
  type OptimizationEngineResult,
} from '../core/engine'
import type { ModelProfile } from '../core/model-profiles'

export interface UsePromptOptimizerOptions {
  /** Messages to optimize */
  messages: CoreMessage[]
  /** Model profile */
  model: ModelProfile
  /** Target token budget */
  targetTokens: number
  /** Whether to auto-optimize on message changes */
  autoOptimize?: boolean
  /** Additional optimization options */
  options?: Partial<PromptOptimizationOptions>
}

export interface UsePromptOptimizerReturn {
  /** Optimized messages */
  optimizedMessages: CoreMessage[]
  /** Token statistics */
  tokenStats: OptimizationEngineResult['tokenStats']
  /** Cost estimate */
  costEstimate?: OptimizationEngineResult['costEstimate']
  /** Diagnostics */
  diagnostics: OptimizationEngineResult['diagnostics']
  /** Whether optimization is in progress */
  isOptimizing: boolean
  /** Error if optimization failed */
  error: Error | null
  /** Manually trigger optimization */
  optimize: () => Promise<void>
}

/**
 * Hook for advanced prompt optimization
 */
export function usePromptOptimizer(
  options: UsePromptOptimizerOptions
): UsePromptOptimizerReturn {
  const {
    messages,
    model,
    targetTokens,
    autoOptimize = true,
    options: optimizationOptions,
  } = options

  const [result, setResult] = useState<OptimizationEngineResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const optimize = useCallback(async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      const optimizationResult = await optimizePrompt({
        messages,
        modelProfile: model,
        targetTokens,
        enableSemanticPrioritization: true,
        enableCompression: true,
        ...optimizationOptions,
      })

      setResult(optimizationResult)
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      console.error('Optimization failed:', error)
    } finally {
      setIsOptimizing(false)
    }
  }, [messages, model, targetTokens, optimizationOptions])

  // Auto-optimize when messages change
  useEffect(() => {
    if (autoOptimize && messages.length > 0) {
      optimize()
    }
  }, [autoOptimize, messages, model, targetTokens, optimize])

  // Return default values if no optimization has run
  const defaultResult: UsePromptOptimizerReturn = {
    optimizedMessages: messages,
    tokenStats: {
      original: 0,
      optimized: 0,
      saved: 0,
      compressionRatio: 1.0,
    },
    diagnostics: {
      stages: [],
    },
    isOptimizing: false,
    error: null,
    optimize,
  }

  if (!result) {
    return defaultResult
  }

  return {
    optimizedMessages: result.messages,
    tokenStats: result.tokenStats,
    costEstimate: result.costEstimate,
    diagnostics: result.diagnostics,
    isOptimizing,
    error,
    optimize,
  }
}
