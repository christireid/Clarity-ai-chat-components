/**
 * useTokenBudget Hook
 *
 * React hook for managing token budgets and optimization.
 */

import { useMemo, useCallback } from 'react'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import type { ModelMetadata } from '../core/tokenizer'
import type { OptimizationStrategy, MessagePriority } from '../core/optimizer'
import {
  estimateMessageTokens,
  getTokenizerForModel,
  MODEL_PRESETS,
} from '../core/tokenizer'
import { optimizeMessagesForBudget } from '../core/optimizer'

/**
 * Options for useTokenBudget
 */
export interface UseTokenBudgetOptions {
  /** Messages to track */
  messages: CoreMessage[]
  /** Model metadata */
  modelMetadata?: ModelMetadata | string
  /** Target budget in tokens (defaults to model maxTokens) */
  targetBudget?: number
  /** Target budget in dollars (alternative to tokens) */
  targetBudgetDollars?: number
  /** Message priorities for optimization */
  priorities?: MessagePriority[]
  /** Summarization function */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
}

/**
 * Return type for useTokenBudget
 */
export interface UseTokenBudgetReturn {
  /** Current token count */
  currentTokens: number
  /** Remaining budget in tokens */
  remainingBudget: number
  /** Budget utilization (0-1) */
  utilization: number
  /** Whether budget is exceeded */
  isExceeded: boolean
  /** Estimated cost (if model pricing available) */
  estimatedCost?: {
    inputCost: number
    outputCost: number
    totalCost: number
  }
  /** Optimize messages to fit budget */
  optimize: (
    strategy?: OptimizationStrategy,
    customTarget?: number
  ) => Promise<{
    optimizedMessages: CoreMessage[]
    diagnostics: {
      originalTokens: number
      optimizedTokens: number
      messagesRemoved: number
      messagesSummarized: number
      strategy: string
      details: string[]
    }
  }>
}

/**
 * Hook for managing token budgets
 */
export function useTokenBudget(
  options: UseTokenBudgetOptions
): UseTokenBudgetReturn {
  const {
    messages,
    modelMetadata: modelMetadataOption,
    targetBudget,
    targetBudgetDollars,
    priorities = [],
    summarizeFn,
  } = options

  // Resolve model metadata
  const modelMetadata = useMemo<ModelMetadata | undefined>(() => {
    if (!modelMetadataOption) return undefined

    if (typeof modelMetadataOption === 'string') {
      return (
        MODEL_PRESETS[modelMetadataOption] || {
          model: modelMetadataOption,
          maxTokens: 8192,
        }
      )
    }

    return modelMetadataOption
  }, [modelMetadataOption])

  // Calculate target budget
  const targetTokens = useMemo(() => {
    if (targetBudget !== undefined) {
      return targetBudget
    }

    if (targetBudgetDollars !== undefined && modelMetadata?.inputPricePer1K) {
      // Convert dollars to tokens
      return Math.floor(
        (targetBudgetDollars / modelMetadata.inputPricePer1K) * 1000
      )
    }

    return modelMetadata?.maxTokens ?? 8192
  }, [targetBudget, targetBudgetDollars, modelMetadata])

  // Get tokenizer
  const tokenizer = useMemo(() => {
    if (!modelMetadata) return getTokenizerForModel('gpt-4')
    return getTokenizerForModel(modelMetadata.model, modelMetadata.tokenizer)
  }, [modelMetadata])

  // Calculate current tokens
  const currentTokens = useMemo(() => {
    return estimateMessageTokens(messages, tokenizer)
  }, [messages, tokenizer])

  // Calculate remaining budget
  const remainingBudget = useMemo(() => {
    return Math.max(0, targetTokens - currentTokens)
  }, [targetTokens, currentTokens])

  // Calculate utilization
  const utilization = useMemo(() => {
    return Math.min(1, currentTokens / targetTokens)
  }, [currentTokens, targetTokens])

  // Check if exceeded
  const isExceeded = useMemo(() => {
    return currentTokens > targetTokens
  }, [currentTokens, targetTokens])

  // Estimate cost
  const estimatedCost = useMemo(() => {
    if (!modelMetadata?.inputPricePer1K) return undefined

    const inputCost = (currentTokens / 1000) * modelMetadata.inputPricePer1K
    const outputCost = modelMetadata.outputPricePer1K
      ? (0 / 1000) * modelMetadata.outputPricePer1K // Assume 0 output tokens for now
      : 0

    return {
      inputCost,
      outputCost,
      totalCost: inputCost + outputCost,
    }
  }, [currentTokens, modelMetadata])

  // Optimize function
  const optimize = useCallback(
    async (
      strategy: OptimizationStrategy = 'hybrid',
      customTarget?: number
    ) => {
      const target = customTarget ?? targetTokens

      const result = await optimizeMessagesForBudget(messages, {
        targetTokens: target,
        strategy,
        modelMetadata,
        tokenizer,
        priorities,
        summarizeFn,
      })

      return result
    },
    [messages, targetTokens, modelMetadata, tokenizer, priorities, summarizeFn]
  )

  return {
    currentTokens,
    remainingBudget,
    utilization,
    isExceeded,
    estimatedCost,
    optimize,
  }
}
