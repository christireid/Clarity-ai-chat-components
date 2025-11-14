/**
 * usePromptOptimizer Hook
 * 
 * Wraps the prompt optimization engine for React components.
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { ToonNode } from '../core/toon'
import type { ModelProfile } from '../core/model-profiles'
import type { OptimizationStrategy } from '../core/optimizer'
import type { CompressionStrategy } from '../core/compression-chain'
import { optimizePrompt, type OptimizePromptOptions, type OptimizePromptResult } from '../core/engine/prompt-optimizer'

/**
 * Options for usePromptOptimizer
 */
export interface UsePromptOptimizerOptions {
  /** Toon DSL definition */
  toon?: ToonNode[]
  /** Messages to optimize */
  messages?: CoreMessage[]
  /** Memory context */
  memoryContext?: string | CoreMessage[]
  /** Model profile or name */
  model: ModelProfile | string
  /** Target token budget */
  targetTokens?: number
  /** Optimization strategies */
  strategies?: (OptimizationStrategy | CompressionStrategy)[]
  /** User intent for semantic prioritization */
  userIntent?: string
  /** Whether to auto-optimize when messages change */
  autoOptimize?: boolean
  /** Whether to apply style transformation */
  applyStyleTransformation?: boolean
  /** Summarization function */
  summarizeFn?: (messages: CoreMessage[], context?: string) => Promise<string> | string
  /** Embedding function */
  getEmbedding?: (text: string) => Promise<number[]> | number[]
  /** Debug mode */
  debug?: boolean
}

/**
 * Return value of usePromptOptimizer
 */
export interface UsePromptOptimizerReturn {
  /** Optimized messages */
  optimizedMessages: CoreMessage[]
  /** Token statistics */
  tokenStats: {
    inputTokens: number
    remainingBudget: number
    utilization: number
  }
  /** Cost estimate */
  costEstimate?: {
    inputCost: number
    outputCost: number
    totalCost: number
  }
  /** Optimization diagnostics */
  diagnostics: {
    originalTokens: number
    finalTokens: number
    totalTokensSaved: number
    wasOptimized: boolean
    reason: string
    stages: Array<{
      name: string
      tokensBefore: number
      tokensAfter: number
      tokensSaved: number
      details: string[]
    }>
  }
  /** Manually trigger optimization */
  optimize: () => Promise<void>
  /** Whether optimization is in progress */
  isOptimizing: boolean
  /** Last error (if any) */
  error: Error | null
}

/**
 * Hook for prompt optimization
 */
export function usePromptOptimizer(
  options: UsePromptOptimizerOptions
): UsePromptOptimizerReturn {
  const {
    toon,
    messages = [],
    memoryContext,
    model,
    targetTokens,
    strategies,
    userIntent,
    autoOptimize = true,
    applyStyleTransformation = true,
    summarizeFn,
    getEmbedding,
    debug = false,
  } = options

  const [result, setResult] = useState<OptimizePromptResult | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const optimizeOptions = useMemo<OptimizePromptOptions>(
    () => ({
      toonDefinition: toon,
      messages,
      memoryContext,
      modelProfile: model,
      targetTokens,
      strategies,
      userIntent,
      applyStyleTransformation,
      summarizeFn,
      getEmbedding,
      debug,
    }),
    [
      toon,
      messages,
      memoryContext,
      model,
      targetTokens,
      strategies,
      userIntent,
      applyStyleTransformation,
      summarizeFn,
      getEmbedding,
      debug,
    ]
  )

  const performOptimization = useCallback(async () => {
    setIsOptimizing(true)
    setError(null)

    try {
      const optimizationResult = await optimizePrompt(optimizeOptions)
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
  }, [optimizeOptions, debug])

  // Auto-optimize when dependencies change
  useEffect(() => {
    if (autoOptimize) {
      performOptimization()
    }
  }, [autoOptimize, performOptimization])

  // Return default values if no optimization has run
  if (!result) {
    return {
      optimizedMessages: messages,
      tokenStats: {
        inputTokens: 0,
        remainingBudget: targetTokens ?? 0,
        utilization: 0,
      },
      diagnostics: {
        originalTokens: 0,
        finalTokens: 0,
        totalTokensSaved: 0,
        wasOptimized: false,
        reason: 'Not optimized yet',
        stages: [],
      },
      optimize: performOptimization,
      isOptimizing,
      error,
    }
  }

  return {
    optimizedMessages: result.optimizedMessages,
    tokenStats: result.tokenStats,
    costEstimate: result.costEstimate,
    diagnostics: {
      originalTokens: result.diagnostics.originalTokens,
      finalTokens: result.diagnostics.finalTokens,
      totalTokensSaved: result.diagnostics.totalTokensSaved,
      wasOptimized: result.diagnostics.wasOptimized,
      reason: result.diagnostics.reason,
      stages: result.diagnostics.stages.map((stage) => ({
        name: stage.name,
        tokensBefore: stage.tokensBefore,
        tokensAfter: stage.tokensAfter,
        tokensSaved: stage.tokensSaved,
        details: stage.details,
      })),
    },
    optimize: performOptimization,
    isOptimizing,
    error,
  }
}
