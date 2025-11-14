/**
 * useOptimizedChatContext Hook
 * 
 * Hook that integrates with useClarityChat to automatically optimize
 * chat context for token budgets.
 */

import { useMemo, useCallback, useEffect, useState } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { ModelMetadata } from '../core/tokenizer'
import type { OptimizationStrategy } from '../core/optimizer'
import { buildModelPrompt } from '../core/builder'
import { estimateMessageTokens, getTokenizerForModel, MODEL_PRESETS } from '../core/tokenizer'

/**
 * Options for useOptimizedChatContext
 */
export interface UseOptimizedChatContextOptions {
  /** Current messages from chat */
  messages: CoreMessage[]
  /** Memory context (from useMemory or similar) */
  memoryContext?: string | CoreMessage[]
  /** Current user input */
  userInput?: string
  /** Model metadata */
  modelMetadata?: ModelMetadata | string
  /** Target token budget */
  targetTokens?: number
  /** Optimization strategy */
  strategy?: OptimizationStrategy
  /** Message priorities */
  priorities?: Array<{ messageId: string; priority: number; reason?: string }>
  /** Summarization function */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  /** Keep recent N messages */
  keepRecent?: number
  /** Auto-optimize on changes */
  autoOptimize?: boolean
}

/**
 * Return type for useOptimizedChatContext
 */
export interface UseOptimizedChatContextReturn {
  /** Optimized message array ready to send */
  optimizedMessages: CoreMessage[]
  /** Token statistics */
  tokenStats: {
    inputTokens: number
    remainingBudget: number
    utilization: number
  }
  /** Last optimization reason */
  lastOptimizationReason?: string
  /** Whether optimization was applied */
  wasOptimized: boolean
  /** Manually trigger optimization */
  optimize: () => Promise<void>
}

/**
 * Hook for optimized chat context
 */
export function useOptimizedChatContext(
  options: UseOptimizedChatContextOptions
): UseOptimizedChatContextReturn {
  const {
    messages,
    memoryContext,
    userInput,
    modelMetadata: modelMetadataOption,
    targetTokens,
    strategy = 'hybrid',
    priorities = [],
    summarizeFn,
    keepRecent = 2,
    autoOptimize = true,
  } = options

  // Resolve model metadata
  const modelMetadata = useMemo<ModelMetadata | undefined>(() => {
    if (!modelMetadataOption) return MODEL_PRESETS['gpt-4']

    if (typeof modelMetadataOption === 'string') {
      return MODEL_PRESETS[modelMetadataOption] || {
        model: modelMetadataOption,
        maxTokens: 8192,
      }
    }

    return modelMetadataOption
  }, [modelMetadataOption])

  const [optimizedMessages, setOptimizedMessages] = useState<CoreMessage[]>(messages)
  const [lastOptimizationReason, setLastOptimizationReason] = useState<string>()
  const [wasOptimized, setWasOptimized] = useState(false)

  // Build optimized prompt
  const buildOptimized = useCallback(async () => {
    if (!modelMetadata) {
      setOptimizedMessages(messages)
      return
    }

    try {
      const result = await buildModelPrompt({
        toonNodes: undefined, // Use raw messages
        variables: {},
        memoryContext,
        userInput,
        modelMetadata,
        targetTokens: targetTokens ?? modelMetadata.maxTokens,
        optimization: {
          enabled: true,
          strategy,
          priorities,
          summarizeFn,
          keepRecent,
        },
      })

      // Merge with original messages structure
      const finalMessages = result.messages.length > 0
        ? result.messages
        : messages

      setOptimizedMessages(finalMessages)
      setWasOptimized(result.optimizationDiagnostics !== undefined)

      if (result.optimizationDiagnostics) {
        const diag = result.optimizationDiagnostics
        const reasons: string[] = []
        if (diag.messagesRemoved > 0) {
          reasons.push(`dropped ${diag.messagesRemoved} message${diag.messagesRemoved > 1 ? 's' : ''}`)
        }
        if (diag.messagesSummarized > 0) {
          reasons.push(`summarized ${diag.messagesSummarized} message${diag.messagesSummarized > 1 ? 's' : ''}`)
        }
        setLastOptimizationReason(reasons.join(', ') || 'optimized')
      } else {
        setLastOptimizationReason(undefined)
      }
    } catch (error) {
      console.warn('[useOptimizedChatContext] Optimization failed:', error)
      setOptimizedMessages(messages)
      setWasOptimized(false)
    }
  }, [
    messages,
    memoryContext,
    userInput,
    modelMetadata,
    targetTokens,
    strategy,
    priorities,
    summarizeFn,
    keepRecent,
  ])

  // Auto-optimize on changes
  useEffect(() => {
    if (autoOptimize) {
      buildOptimized()
    }
  }, [autoOptimize, buildOptimized])

  // Calculate token stats
  const tokenStats = useMemo(() => {
    const tokenizer = getTokenizerForModel(modelMetadata?.model || 'gpt-4')
    const inputTokens = estimateMessageTokens(optimizedMessages, tokenizer)
    const maxTokens = targetTokens ?? modelMetadata?.maxTokens ?? 8192
    const remainingBudget = Math.max(0, maxTokens - inputTokens)
    const utilization = Math.min(1, inputTokens / maxTokens)

    return {
      inputTokens,
      remainingBudget,
      utilization,
    }
  }, [optimizedMessages, modelMetadata, targetTokens])

  return {
    optimizedMessages,
    tokenStats,
    lastOptimizationReason,
    wasOptimized,
    optimize: buildOptimized,
  }
}
