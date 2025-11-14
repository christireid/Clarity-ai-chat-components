/**
 * useTokenBudget Hook
 * 
 * React hook for tracking token usage and budget management.
 */

import { useMemo, useCallback, useState } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type {
  ModelMetadata,
  OptimizationStrategy,
  OptimizationDiagnostics,
} from '../core/types'
import {
  estimateMessageArrayTokens,
  estimateMessageArrayCost,
} from '../core/token-estimation'
import {
  optimizeMessagesForBudget,
} from '../core/message-optimization'

/**
 * Options for useTokenBudget
 */
export interface UseTokenBudgetOptions {
  /**
   * Messages to track
   */
  messages: CoreMessage[]
  
  /**
   * Model metadata
   */
  model: ModelMetadata
  
  /**
   * Target budget (in tokens or USD)
   */
  targetBudget: number
  
  /**
   * Budget unit: 'tokens' or 'dollars'
   */
  budgetUnit?: 'tokens' | 'dollars'
  
  /**
   * Optimization strategy (optional)
   */
  strategy?: OptimizationStrategy
}

/**
 * Return type for useTokenBudget
 */
export interface UseTokenBudgetReturn {
  /**
   * Current token count
   */
  currentTokens: number
  
  /**
   * Current cost in USD
   */
  currentCost: number
  
  /**
   * Remaining budget (in tokens or dollars)
   */
  remainingBudget: number
  
  /**
   * Budget exceeded flag
   */
  isExceeded: boolean
  
  /**
   * Percentage of budget used
   */
  budgetUsagePercent: number
  
  /**
   * Optimize messages to fit budget
   */
  optimize: (
    messages: CoreMessage[],
    strategy?: OptimizationStrategy
  ) => Promise<{
    messages: CoreMessage[]
    diagnostics: OptimizationDiagnostics
  }>
  
  /**
   * Token stats breakdown
   */
  stats: {
    tokens: number
    cost: number
    budget: number
    remaining: number
    usagePercent: number
  }
}

/**
 * Hook for token budget management
 * 
 * @example
 * ```tsx
 * const { currentTokens, remainingBudget, optimize } = useTokenBudget({
 *   messages,
 *   model: { id: 'gpt-4', maxTokens: 8192, inputPricePer1K: 0.03 },
 *   targetBudget: 4000,
 *   budgetUnit: 'tokens',
 * })
 * ```
 */
export function useTokenBudget(
  options: UseTokenBudgetOptions
): UseTokenBudgetReturn {
  const {
    messages,
    model,
    targetBudget,
    budgetUnit = 'tokens',
    strategy = 'sliding-window',
  } = options
  
  const [optimizationStrategy, setOptimizationStrategy] = useState(strategy)
  
  // Calculate current tokens and cost
  const currentTokens = useMemo(() => {
    return estimateMessageArrayTokens(messages, { model: model.id })
  }, [messages, model])
  
  const currentCost = useMemo(() => {
    return estimateMessageArrayCost(messages, model, { model: model.id })
  }, [messages, model])
  
  // Calculate budget in tokens
  const budgetInTokens = useMemo(() => {
    if (budgetUnit === 'tokens') {
      return targetBudget
    }
    
    // Convert dollars to tokens
    if (model.inputPricePer1K) {
      return Math.floor((targetBudget / model.inputPricePer1K) * 1000)
    }
    
    // Fallback: assume we can use all available tokens
    return model.maxTokens
  }, [targetBudget, budgetUnit, model])
  
  // Calculate remaining budget
  const remainingBudget = useMemo(() => {
    if (budgetUnit === 'tokens') {
      return Math.max(0, budgetInTokens - currentTokens)
    }
    
    // For dollars, calculate remaining in dollars
    const remainingTokens = Math.max(0, budgetInTokens - currentTokens)
    if (model.inputPricePer1K) {
      return (remainingTokens / 1000) * model.inputPricePer1K
    }
    
    return 0
  }, [budgetInTokens, currentTokens, budgetUnit, model])
  
  const isExceeded = useMemo(() => {
    return currentTokens > budgetInTokens
  }, [currentTokens, budgetInTokens])
  
  const budgetUsagePercent = useMemo(() => {
    return Math.min(100, (currentTokens / budgetInTokens) * 100)
  }, [currentTokens, budgetInTokens])
  
  const optimize = useCallback(
    async (
      messagesToOptimize: CoreMessage[],
      customStrategy?: OptimizationStrategy
    ) => {
      const strategyToUse = customStrategy || optimizationStrategy
      return optimizeMessagesForBudget(messagesToOptimize, budgetInTokens, {
        strategy: strategyToUse,
        model,
      })
    },
    [budgetInTokens, model, optimizationStrategy]
  )
  
  const stats = useMemo(
    () => ({
      tokens: currentTokens,
      cost: currentCost,
      budget: budgetInTokens,
      remaining: remainingBudget,
      usagePercent: budgetUsagePercent,
    }),
    [currentTokens, currentCost, budgetInTokens, remainingBudget, budgetUsagePercent]
  )
  
  return {
    currentTokens,
    currentCost,
    remainingBudget,
    isExceeded,
    budgetUsagePercent,
    optimize,
    stats,
  }
}
