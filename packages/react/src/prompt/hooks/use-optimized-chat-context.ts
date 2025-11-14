/**
 * useOptimizedChatContext Hook
 * 
 * Hook that integrates with useClarityChat to automatically optimize context
 */

import * as React from 'react'
import type {
  ModelMetadata,
  OptimizationStrategy,
  OptimizationResult,
} from '../core/types'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import { estimatePromptTokens, optimizeMessagesForBudget } from '../core'

/**
 * Options for useOptimizedChatContext
 */
export interface UseOptimizedChatContextOptions {
  /** Messages from chat */
  messages: CoreMessage[]
  /** Model metadata */
  model: ModelMetadata
  /** Target token budget */
  targetTokens?: number
  /** Optimization strategy */
  strategy?: OptimizationStrategy
  /** Whether optimization is enabled */
  enabled?: boolean
  /** Summarization function */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string>
}

/**
 * Return type for useOptimizedChatContext
 */
export interface UseOptimizedChatContextReturn {
  /** Optimized messages ready to send */
  optimizedMessages: CoreMessage[]
  /** Token statistics */
  tokenStats: {
    original: number
    optimized: number
    saved: number
    compressionRatio: number
  }
  /** Last optimization reason */
  lastOptimizationReason?: string
  /** Whether optimization was applied */
  wasOptimized: boolean
  /** Optimization diagnostics */
  diagnostics?: OptimizationResult['diagnostics']
}

/**
 * Hook for automatically optimizing chat context
 * 
 * Designed to plug into useClarityChat
 * 
 * @example
 * ```tsx
 * const { messages } = useClarityChat({ api: '/api/chat' })
 * 
 * const { optimizedMessages, tokenStats } = useOptimizedChatContext({
 *   messages,
 *   model: { model: 'gpt-4', maxTokens: 8000 },
 *   targetTokens: 4000,
 *   strategy: 'sliding-window',
 * })
 * ```
 */
export function useOptimizedChatContext(
  options: UseOptimizedChatContextOptions
): UseOptimizedChatContextReturn {
  const {
    messages,
    model,
    targetTokens,
    strategy = 'hybrid',
    enabled = true,
    summarizeFn,
  } = options

  const optimizationResult = React.useMemo(() => {
    if (!enabled || !targetTokens) {
      return null
    }

    const originalEstimate = estimatePromptTokens(messages, model)

    // Only optimize if over budget
    if (originalEstimate.tokens <= targetTokens) {
      return null
    }

    return optimizeMessagesForBudget(
      messages,
      {
        targetTokens,
        strategy,
        preserveSystem: true,
        minMessages: 2,
        summarizeFn,
      },
      model
    )
  }, [messages, model, targetTokens, strategy, enabled, summarizeFn])

  const originalTokens = React.useMemo(
    () => estimatePromptTokens(messages, model).tokens,
    [messages, model]
  )

  const wasOptimized = optimizationResult !== null

  const optimizedMessages = optimizationResult
    ? optimizationResult.messages
    : messages

  const optimizedTokens = optimizationResult
    ? optimizationResult.diagnostics.optimizedTokens
    : originalTokens

  const lastOptimizationReason = React.useMemo(() => {
    if (!optimizationResult) return undefined

    const { diagnostics } = optimizationResult
    const reasons: string[] = []

    if (diagnostics.droppedMessages > 0) {
      reasons.push(`dropped ${diagnostics.droppedMessages} messages`)
    }

    if (diagnostics.summarizedMessages > 0) {
      reasons.push(`summarized ${diagnostics.summarizedMessages} messages`)
    }

    if (diagnostics.details.length > 0) {
      const truncated = diagnostics.details.filter((d) => d.action === 'truncated')
      if (truncated.length > 0) {
        reasons.push(`truncated ${truncated.length} messages`)
      }
    }

    return reasons.length > 0 ? reasons.join(', ') : 'optimized for budget'
  }, [optimizationResult])

  return {
    optimizedMessages,
    tokenStats: {
      original: originalTokens,
      optimized: optimizedTokens,
      saved: originalTokens - optimizedTokens,
      compressionRatio:
        originalTokens > 0 ? optimizedTokens / originalTokens : 1.0,
    },
    lastOptimizationReason,
    wasOptimized,
    diagnostics: optimizationResult?.diagnostics,
  }
}
