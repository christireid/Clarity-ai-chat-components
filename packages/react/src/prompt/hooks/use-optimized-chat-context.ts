/**
 * useOptimizedChatContext Hook
 * 
 * React hook that integrates with useClarityChat to automatically optimize
 * messages for token budgets.
 */

import { useMemo, useCallback, useEffect, useState } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type {
  ModelMetadata,
  OptimizationStrategy,
  OptimizationDiagnostics,
} from '../core/types'
import {
  estimateMessageArrayTokens,
} from '../core/token-estimation'
import {
  optimizeMessagesForBudget,
} from '../core/message-optimization'

/**
 * Options for useOptimizedChatContext
 */
export interface UseOptimizedChatContextOptions {
  /**
   * Messages from useClarityChat
   */
  messages: CoreMessage[]
  
  /**
   * Model metadata
   */
  model: ModelMetadata
  
  /**
   * Target token budget
   */
  targetTokens: number
  
  /**
   * Optimization strategy
   */
  strategy?: OptimizationStrategy
  
  /**
   * Enable automatic optimization
   */
  enabled?: boolean
  
  /**
   * Callback when optimization occurs
   */
  onOptimize?: (diagnostics: OptimizationDiagnostics) => void
}

/**
 * Return type for useOptimizedChatContext
 */
export interface UseOptimizedChatContextReturn {
  /**
   * Optimized messages ready to send
   */
  optimizedMessages: CoreMessage[]
  
  /**
   * Token statistics
   */
  tokenStats: {
    original: number
    optimized: number
    saved: number
    savedPercent: number
  }
  
  /**
   * Last optimization reason
   */
  lastOptimizationReason?: string
  
  /**
   * Optimization diagnostics
   */
  diagnostics?: OptimizationDiagnostics
  
  /**
   * Manually trigger optimization
   */
  optimize: () => Promise<void>
  
  /**
   * Whether optimization was applied
   */
  wasOptimized: boolean
}

/**
 * Hook for optimized chat context
 * 
 * @example
 * ```tsx
 * const { messages } = useClarityChat({ api: '/api/chat' })
 * const { optimizedMessages, tokenStats } = useOptimizedChatContext({
 *   messages,
 *   model: { id: 'gpt-4', maxTokens: 8192 },
 *   targetTokens: 4000,
 *   strategy: 'hybrid',
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
    strategy = 'sliding-window',
    enabled = true,
    onOptimize,
  } = options
  
  const [diagnostics, setDiagnostics] = useState<OptimizationDiagnostics | undefined>()
  const [wasOptimized, setWasOptimized] = useState(false)
  const [cachedOptimizedMessages, setCachedOptimizedMessages] = useState<CoreMessage[]>(messages)
  
  // Calculate original tokens
  const originalTokens = useMemo(() => {
    return estimateMessageArrayTokens(messages, { model: model.id })
  }, [messages, model])
  
  // Optimize messages if needed
  const optimizeMessages = useCallback(async () => {
    if (!enabled) {
      setCachedOptimizedMessages(messages)
      setWasOptimized(false)
      setDiagnostics(undefined)
      return
    }
    
    // Only optimize if we exceed the budget
    if (originalTokens <= targetTokens) {
      setCachedOptimizedMessages(messages)
      setWasOptimized(false)
      setDiagnostics(undefined)
      return
    }
    
    try {
      const result = await optimizeMessagesForBudget(messages, targetTokens, {
        strategy,
        model,
      })
      
      setCachedOptimizedMessages(result.messages)
      setDiagnostics(result.diagnostics)
      setWasOptimized(true)
      onOptimize?.(result.diagnostics)
    } catch (error) {
      // Error is already set in state, no need to log unless debug is enabled
      if (options.debug) {
        // eslint-disable-next-line no-console
        console.error('[useOptimizedChatContext] Optimization failed:', error)
      }
      setCachedOptimizedMessages(messages)
      setWasOptimized(false)
    }
  }, [messages, targetTokens, strategy, model, enabled, originalTokens, onOptimize])
  
  // Auto-optimize when messages change
  useEffect(() => {
    optimizeMessages()
  }, [optimizeMessages])
  
  // Get optimized messages
  const optimizedMessages = useMemo(() => {
    if (!enabled) {
      return messages
    }
    
    return cachedOptimizedMessages
  }, [messages, enabled, cachedOptimizedMessages])
  
  // Calculate token stats
  const tokenStats = useMemo(() => {
    const optimized = diagnostics
      ? diagnostics.optimizedTokens
      : originalTokens
    
    const saved = originalTokens - optimized
    const savedPercent = originalTokens > 0
      ? (saved / originalTokens) * 100
      : 0
    
    return {
      original: originalTokens,
      optimized,
      saved,
      savedPercent,
    }
  }, [originalTokens, diagnostics])
  
  const lastOptimizationReason = diagnostics?.reason
  
  return {
    optimizedMessages,
    tokenStats,
    lastOptimizationReason,
    diagnostics,
    optimize: optimizeMessages,
    wasOptimized,
  }
}
