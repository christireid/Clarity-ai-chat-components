/**
 * useContextWindow Hook
 *
 * React hook for automatic conversation memory optimization.
 * Integrates with conversation memory strategies from Week 1.
 *
 * @module use-context-window
 */

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  AdaptiveConversationStrategy,
  SlidingWindowStrategy,
  ImportanceBasedStrategy,
  SummarizationStrategy,
  type ConversationMessage,
  type ConversationMemoryResult,
  type ConversationSummarizer,
  type AdaptiveStrategyOptions,
} from '../compression/strategies/conversation-memory'

/**
 * Strategy type selection
 */
export type ContextWindowStrategy = 'adaptive' | 'sliding-window' | 'importance-based' | 'summarization'

/**
 * Configuration for useContextWindow hook
 */
export interface UseContextWindowConfig {
  /** Maximum token budget for context */
  maxTokens: number
  /** Strategy to use (default: 'adaptive') */
  strategy?: ContextWindowStrategy
  /** Optional summarizer for summarization strategy */
  summarizer?: ConversationSummarizer
  /** Window size for sliding-window strategy */
  windowSize?: number
  /** Auto-optimize on every message (default: true) */
  autoOptimize?: boolean
  /** Threshold for triggering optimization (default: 0.8 = 80% of maxTokens) */
  optimizationThreshold?: number
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Return type for useContextWindow hook
 */
export interface UseContextWindowReturn {
  /** Current conversation messages */
  messages: ConversationMessage[]
  /** Add a message to conversation */
  addMessage: (role: ConversationMessage['role'], content: string) => void
  /** Add multiple messages */
  addMessages: (messages: ConversationMessage[]) => void
  /** Manually trigger optimization */
  optimize: () => Promise<ConversationMemoryResult | null>
  /** Clear all messages */
  clear: () => void
  /** Current token count */
  currentTokens: number
  /** Token budget utilization (0-1) */
  utilization: number
  /** Whether optimization is in progress */
  isOptimizing: boolean
  /** Last optimization result */
  lastOptimization: ConversationMemoryResult | null
  /** Strategy info without optimizing */
  getStrategyInfo: () => {
    strategy: string
    reason: string
    currentTokens: number
    maxTokens: number
  }
  /** Set new messages (replace all) */
  setMessages: (messages: ConversationMessage[]) => void
}

/**
 * React hook for automatic conversation memory optimization
 *
 * Manages conversation context within token budgets using intelligent
 * memory strategies. Automatically optimizes when threshold exceeded.
 *
 * @example Basic Usage
 * ```typescript
 * function ChatComponent() {
 *   const {
 *     messages,
 *     addMessage,
 *     currentTokens,
 *     utilization,
 *   } = useContextWindow({ maxTokens: 4000 })
 *
 *   const handleSend = (userMessage: string) => {
 *     addMessage('user', userMessage)
 *     // Messages automatically optimized when needed
 *   }
 *
 *   return (
 *     <div>
 *       <TokenUsage tokens={currentTokens} max={4000} utilization={utilization} />
 *       <MessageList messages={messages} />
 *     </div>
 *   )
 * }
 * ```
 *
 * @example With Summarization
 * ```typescript
 * const summarizer: ConversationSummarizer = {
 *   async summarize(messages, maxTokens) {
 *     const response = await openai.chat.completions.create({
 *       model: 'gpt-4o-mini',
 *       messages: [{
 *         role: 'system',
 *         content: `Summarize in ${maxTokens} tokens`
 *       }, {
 *         role: 'user',
 *         content: messages.map(m => `${m.role}: ${m.content}`).join('\n')
 *       }]
 *     })
 *     return response.choices[0].message.content
 *   }
 * }
 *
 * const { messages } = useContextWindow({
 *   maxTokens: 8000,
 *   strategy: 'adaptive',
 *   summarizer,
 * })
 * ```
 *
 * @param config - Hook configuration
 * @returns Hook state and methods
 */
export function useContextWindow(config: UseContextWindowConfig): UseContextWindowReturn {
  const {
    maxTokens,
    strategy = 'adaptive',
    summarizer,
    windowSize = 10,
    autoOptimize = true,
    optimizationThreshold = 0.8,
    debug = false,
  } = config

  // State
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [lastOptimization, setLastOptimization] = useState<ConversationMemoryResult | null>(null)

  // Track current tokens (simple estimation)
  const currentTokens = useMemo(() => {
    return messages.reduce((total, msg) => {
      // Simple token estimation: ~4 characters per token
      return total + Math.ceil(msg.content.length / 4)
    }, 0)
  }, [messages])

  // Token utilization (0-1)
  const utilization = currentTokens / maxTokens

  // Strategy instance (memoized)
  const strategyInstance = useMemo(() => {
    switch (strategy) {
      case 'sliding-window':
        return new SlidingWindowStrategy({ windowSize })
      case 'importance-based':
        return new ImportanceBasedStrategy({ maxTokens })
      case 'summarization':
        if (!summarizer) {
          if (debug) {
            console.warn('Summarizer not provided, falling back to adaptive strategy')
          }
          return new AdaptiveConversationStrategy({ maxTokens, summarizer })
        }
        return new SummarizationStrategy({ summarizer, maxTokens })
      case 'adaptive':
      default:
        return new AdaptiveConversationStrategy({ maxTokens, summarizer })
    }
  }, [strategy, maxTokens, windowSize, summarizer, debug])

  // Optimization function
  const optimize = useCallback(async (): Promise<ConversationMemoryResult | null> => {
    if (messages.length === 0) {
      return null
    }

    setIsOptimizing(true)

    try {
      const result = await strategyInstance.optimize(messages)

      if (debug) {
        console.log('Context window optimized:', {
          strategy: result.strategy,
          originalTokens: result.originalTokens,
          optimizedTokens: result.optimizedTokens,
          tokensSaved: result.tokensSaved,
          messagesRemoved: result.metadata.messagesRemoved,
        })
      }

      // Update messages with optimized version
      setMessages(result.messages)
      setLastOptimization(result)

      return result
    } catch (error) {
      if (debug) {
        console.error('Optimization failed:', error)
      }
      return null
    } finally {
      setIsOptimizing(false)
    }
  }, [messages, strategyInstance, debug])

  // Auto-optimization when threshold exceeded
  const shouldOptimizeRef = useRef(false)
  useEffect(() => {
    if (autoOptimize && utilization > optimizationThreshold && !isOptimizing) {
      shouldOptimizeRef.current = true
    }
  }, [utilization, optimizationThreshold, autoOptimize, isOptimizing])

  useEffect(() => {
    if (shouldOptimizeRef.current && !isOptimizing) {
      shouldOptimizeRef.current = false
      optimize()
    }
  }, [shouldOptimizeRef.current, isOptimizing, optimize])

  // Add a single message
  const addMessage = useCallback(
    (role: ConversationMessage['role'], content: string) => {
      const newMessage: ConversationMessage = {
        role,
        content,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, newMessage])
    },
    []
  )

  // Add multiple messages
  const addMessages = useCallback((newMessages: ConversationMessage[]) => {
    setMessages((prev) => [...prev, ...newMessages])
  }, [])

  // Clear all messages
  const clear = useCallback(() => {
    setMessages([])
    setLastOptimization(null)
  }, [])

  // Get strategy info
  const getStrategyInfo = useCallback(() => {
    if (strategyInstance instanceof AdaptiveConversationStrategy) {
      return strategyInstance.getStrategyInfo(messages)
    }

    return {
      strategy,
      reason: 'Manual strategy selection',
      currentTokens,
      maxTokens,
    }
  }, [strategyInstance, messages, strategy, currentTokens, maxTokens])

  return {
    messages,
    addMessage,
    addMessages,
    optimize,
    clear,
    currentTokens,
    utilization,
    isOptimizing,
    lastOptimization,
    getStrategyInfo,
    setMessages,
  }
}

/**
 * Hook for monitoring context window status
 *
 * Provides real-time feedback on context window health without
 * managing messages directly.
 *
 * @example
 * ```typescript
 * function ContextMonitor({ messages }: { messages: ConversationMessage[] }) {
 *   const status = useContextWindowStatus(messages, 4000)
 *
 *   return (
 *     <div>
 *       <ProgressBar value={status.utilization} />
 *       <Badge color={status.color}>{status.level}</Badge>
 *       {status.needsOptimization && <Alert>Optimization recommended</Alert>}
 *     </div>
 *   )
 * }
 * ```
 */
export interface ContextWindowStatus {
  /** Current token count */
  tokens: number
  /** Maximum tokens */
  maxTokens: number
  /** Utilization percentage (0-1) */
  utilization: number
  /** Status level */
  level: 'low' | 'normal' | 'high' | 'critical'
  /** Recommended color */
  color: 'green' | 'yellow' | 'orange' | 'red'
  /** Whether optimization is recommended */
  needsOptimization: boolean
}

export function useContextWindowStatus(
  messages: ConversationMessage[],
  maxTokens: number
): ContextWindowStatus {
  const tokens = useMemo(() => {
    return messages.reduce((total, msg) => {
      return total + Math.ceil(msg.content.length / 4)
    }, 0)
  }, [messages])

  const utilization = tokens / maxTokens

  let level: ContextWindowStatus['level']
  let color: ContextWindowStatus['color']
  let needsOptimization: boolean

  if (utilization < 0.5) {
    level = 'low'
    color = 'green'
    needsOptimization = false
  } else if (utilization < 0.75) {
    level = 'normal'
    color = 'yellow'
    needsOptimization = false
  } else if (utilization < 0.9) {
    level = 'high'
    color = 'orange'
    needsOptimization = true
  } else {
    level = 'critical'
    color = 'red'
    needsOptimization = true
  }

  return {
    tokens,
    maxTokens,
    utilization,
    level,
    color,
    needsOptimization,
  }
}
