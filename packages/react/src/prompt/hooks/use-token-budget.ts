/**
 * useTokenBudget Hook
 * 
 * React hook for managing token budgets and optimization
 */

import * as React from 'react'
import type {
  ModelMetadata,
  OptimizationStrategy,
  OptimizationResult,
  MessagePriority,
} from '../core/types'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import { estimatePromptTokens, optimizeMessagesForBudget } from '../core'

/**
 * Options for useTokenBudget
 */
export interface UseTokenBudgetOptions {
  /** Messages to track */
  messages: CoreMessage[]
  /** Model metadata */
  model: ModelMetadata
  /** Target budget (in tokens or dollars) */
  targetBudget?: number | { tokens?: number; dollars?: number }
  /** Optimization strategy */
  strategy?: OptimizationStrategy
  /** Message priorities */
  priorities?: MessagePriority[]
}

/**
 * Return type for useTokenBudget
 */
export interface UseTokenBudgetReturn {
  /** Current token count */
  currentTokens: number
  /** Remaining budget in tokens */
  remainingBudget: number
  /** Estimated cost */
  estimatedCost?: number
  /** Whether budget is exceeded */
  isExceeded: boolean
  /** Optimize messages */
  optimize: (
    messages: CoreMessage[],
    strategy?: OptimizationStrategy
  ) => OptimizationResult
  /** Token breakdown by role */
  breakdown: {
    system?: number
    user?: number
    assistant?: number
    tool?: number
  }
}

/**
 * Hook for managing token budgets
 * 
 * @example
 * ```tsx
 * const { currentTokens, remainingBudget, optimize } = useTokenBudget({
 *   messages,
 *   model: { model: 'gpt-4', maxTokens: 8000 },
 *   targetBudget: { tokens: 4000 },
 * })
 * 
 * const optimized = optimize(messages, 'sliding-window')
 * ```
 */
export function useTokenBudget(
  options: UseTokenBudgetOptions
): UseTokenBudgetReturn {
  const { messages, model, targetBudget, strategy, priorities } = options

  // Calculate current token usage
  const tokenEstimate = React.useMemo(
    () => estimatePromptTokens(messages, model),
    [messages, model]
  )

  // Determine target tokens
  const targetTokens = React.useMemo(() => {
    if (!targetBudget) return model.maxTokens

    if (typeof targetBudget === 'number') {
      return targetBudget
    }

    if (targetBudget.tokens) {
      return targetBudget.tokens
    }

    if (targetBudget.dollars && model.inputPricePer1K) {
      // Convert dollars to tokens
      return Math.floor((targetBudget.dollars / model.inputPricePer1K) * 1000)
    }

    return model.maxTokens
  }, [targetBudget, model])

  const remainingBudget = Math.max(0, targetTokens - tokenEstimate.tokens)
  const isExceeded = tokenEstimate.tokens > targetTokens

  const optimize = React.useCallback(
    (
      messagesToOptimize: CoreMessage[],
      optStrategy?: OptimizationStrategy
    ): OptimizationResult => {
      return optimizeMessagesForBudget(
        messagesToOptimize,
        {
          targetTokens,
          strategy: optStrategy || strategy || 'hybrid',
          priorities,
          preserveSystem: true,
          minMessages: 2,
        },
        model
      )
    },
    [targetTokens, strategy, priorities, model]
  )

  return {
    currentTokens: tokenEstimate.tokens,
    remainingBudget,
    estimatedCost: tokenEstimate.estimatedCost,
    isExceeded,
    optimize,
    breakdown: tokenEstimate.breakdown,
  }
}
