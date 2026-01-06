'use client'

import * as React from 'react'
import {
  countChatTokens,
  countTokens,
  getModelEncoding,
  truncateToTokenLimit,
} from '@clarity-chat/clarity-tokens'
import type { ChatMessage, TokenEncoding } from '@clarity-chat/clarity-tokens'
import type {
  UseContextWindowConfig,
  UseContextWindowReturn,
  ContextWindowState,
  ContextStrategy,
} from './types'

/**
 * Default summarizer that concatenates message content
 */
const defaultSummarizer = async (messages: ChatMessage[]): Promise<string> => {
  // In a real implementation, this would call an LLM to summarize
  // For now, just create a condensed version
  const summaryParts = messages.map((msg) => {
    const role = msg.role === 'assistant' ? 'AI' : msg.role
    const truncated =
      msg.content.length > 200
        ? msg.content.slice(0, 200) + '...'
        : msg.content
    return `${role}: ${truncated}`
  })
  return `Previous conversation summary:\n${summaryParts.join('\n')}`
}

/**
 * useContextWindow - Sliding window context management
 *
 * Manages chat history to fit within model context limits.
 * Implements LangChain-style memory patterns: Buffer (full history),
 * BufferWindow (last k messages), SummaryBuffer (recent verbatim + older summarized).
 *
 * @param config - Configuration options
 * @returns Context window management utilities
 *
 * @example
 * ```tsx
 * function ChatWithContextManagement() {
 *   const {
 *     state,
 *     addMessage,
 *     getOptimizedContext,
 *   } = useContextWindow({
 *     maxTokens: 128000,
 *     strategy: 'summaryBuffer',
 *     reservedTokens: 4000,
 *   })
 *
 *   const handleSend = async (content: string) => {
 *     addMessage({ id: Date.now().toString(), role: 'user', content })
 *
 *     // Get optimized context for API call
 *     const { messages } = await getOptimizedContext()
 *
 *     // Send to API with optimized context
 *     const response = await sendToAPI(messages)
 *
 *     addMessage({
 *       id: (Date.now() + 1).toString(),
 *       role: 'assistant',
 *       content: response,
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <span>Context: {state.utilizationPercent.toFixed(1)}% used</span>
 *       {state.summarizedCount > 0 && (
 *         <span>{state.summarizedCount} messages summarized</span>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useContextWindow(
  config: UseContextWindowConfig
): UseContextWindowReturn {
  const {
    maxTokens,
    reservedTokens = 1000,
    strategy: initialStrategy = 'summaryBuffer',
    windowSize = 10,
    summarizationThreshold = 0.7,
    summarizer = defaultSummarizer,
    preserveSystemPrompt = true,
    preserveRecentCount = 4,
  } = config

  // State
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [summary, setSummary] = React.useState<string | null>(null)
  const [strategy, setStrategy] = React.useState<ContextStrategy>(initialStrategy)
  const [summarizedCount, setSummarizedCount] = React.useState(0)
  const [truncatedCount, setTruncatedCount] = React.useState(0)

  // Encoding for token counting (default to cl100k_base)
  const encoding: TokenEncoding = 'cl100k_base'

  // Calculate total tokens
  const totalTokens = React.useMemo(() => {
    let tokens = countChatTokens(messages, encoding)
    if (summary) {
      tokens += countTokens(summary, encoding)
    }
    return tokens
  }, [messages, summary])

  // Available tokens
  const availableTokens = maxTokens - reservedTokens - totalTokens
  const utilizationPercent = (totalTokens / (maxTokens - reservedTokens)) * 100

  // State object
  const state: ContextWindowState = React.useMemo(
    () => ({
      messages,
      summary,
      totalTokens,
      availableTokens,
      utilizationPercent,
      truncatedCount,
      summarizedCount,
    }),
    [messages, summary, totalTokens, availableTokens, utilizationPercent, truncatedCount, summarizedCount]
  )

  /**
   * Estimate tokens for a message
   */
  const estimateMessageTokens = React.useCallback(
    (message: ChatMessage): number => {
      return countTokens(message.content, encoding) + 4 // Add overhead
    },
    []
  )

  /**
   * Check if adding message would exceed limit
   */
  const willExceedLimit = React.useCallback(
    (newMessage: ChatMessage): boolean => {
      const newTokens = estimateMessageTokens(newMessage)
      return totalTokens + newTokens > maxTokens - reservedTokens
    },
    [totalTokens, maxTokens, reservedTokens, estimateMessageTokens]
  )

  /**
   * Estimate tokens after adding message
   */
  const estimateTokensAfterAdd = React.useCallback(
    (message: ChatMessage): number => {
      return totalTokens + estimateMessageTokens(message)
    },
    [totalTokens, estimateMessageTokens]
  )

  /**
   * Apply buffer strategy (keep all messages)
   */
  const applyBufferStrategy = React.useCallback(
    (msgs: ChatMessage[]): ChatMessage[] => {
      return msgs
    },
    []
  )

  /**
   * Apply window strategy (keep last k messages)
   */
  const applyWindowStrategy = React.useCallback(
    (msgs: ChatMessage[]): ChatMessage[] => {
      // Find system messages to preserve
      const systemMessages = preserveSystemPrompt
        ? msgs.filter((m) => m.role === 'system')
        : []

      const nonSystemMessages = msgs.filter((m) => m.role !== 'system')
      const recentMessages = nonSystemMessages.slice(-windowSize)

      return [...systemMessages, ...recentMessages]
    },
    [windowSize, preserveSystemPrompt]
  )

  /**
   * Apply summary buffer strategy
   */
  const applySummaryBufferStrategy = React.useCallback(
    async (
      msgs: ChatMessage[]
    ): Promise<{ messages: ChatMessage[]; newSummary: string | null }> => {
      const budget = maxTokens - reservedTokens

      // Check if we need to summarize
      if (totalTokens < budget * summarizationThreshold) {
        return { messages: msgs, newSummary: summary }
      }

      // Preserve system messages
      const systemMessages = preserveSystemPrompt
        ? msgs.filter((m) => m.role === 'system')
        : []

      const nonSystemMessages = msgs.filter((m) => m.role !== 'system')

      // Keep recent messages
      const recentMessages = nonSystemMessages.slice(-preserveRecentCount)
      const olderMessages = nonSystemMessages.slice(0, -preserveRecentCount)

      // Summarize older messages if we have any
      if (olderMessages.length > 0) {
        const newSummary = await summarizer(olderMessages)
        setSummarizedCount((prev) => prev + olderMessages.length)

        return {
          messages: [...systemMessages, ...recentMessages],
          newSummary,
        }
      }

      return { messages: msgs, newSummary: summary }
    },
    [
      maxTokens,
      reservedTokens,
      summarizationThreshold,
      totalTokens,
      summary,
      preserveSystemPrompt,
      preserveRecentCount,
      summarizer,
    ]
  )

  /**
   * Add single message
   */
  const addMessage = React.useCallback((message: ChatMessage): void => {
    setMessages((prev) => [...prev, message])
  }, [])

  /**
   * Add multiple messages
   */
  const addMessages = React.useCallback((newMessages: ChatMessage[]): void => {
    setMessages((prev) => [...prev, ...newMessages])
  }, [])

  /**
   * Get optimized context for API call
   */
  const getOptimizedContext = React.useCallback(async (): Promise<{
    messages: ChatMessage[]
    totalTokens: number
    wasTruncated: boolean
    wasSummarized: boolean
  }> => {
    let optimizedMessages: ChatMessage[]
    let newSummary = summary
    let wasSummarized = false

    switch (strategy) {
      case 'buffer':
        optimizedMessages = applyBufferStrategy(messages)
        break

      case 'window':
        optimizedMessages = applyWindowStrategy(messages)
        if (optimizedMessages.length < messages.length) {
          setTruncatedCount(messages.length - optimizedMessages.length)
        }
        break

      case 'summaryBuffer':
      default:
        const result = await applySummaryBufferStrategy(messages)
        optimizedMessages = result.messages
        if (result.newSummary !== summary) {
          newSummary = result.newSummary
          setSummary(newSummary)
          wasSummarized = true
        }
        break
    }

    // If we have a summary, prepend it as a system message
    if (newSummary) {
      const summaryMessage: ChatMessage = {
        id: 'context-summary',
        role: 'system',
        content: newSummary,
      }
      // Insert after any existing system messages
      const systemCount = optimizedMessages.filter((m) => m.role === 'system').length
      optimizedMessages = [
        ...optimizedMessages.slice(0, systemCount),
        summaryMessage,
        ...optimizedMessages.slice(systemCount),
      ]
    }

    const optimizedTokens = countChatTokens(optimizedMessages, encoding)

    return {
      messages: optimizedMessages,
      totalTokens: optimizedTokens,
      wasTruncated: truncatedCount > 0,
      wasSummarized,
    }
  }, [
    messages,
    strategy,
    summary,
    truncatedCount,
    applyBufferStrategy,
    applyWindowStrategy,
    applySummaryBufferStrategy,
  ])

  /**
   * Manually trigger summarization
   */
  const triggerSummarization = React.useCallback(async (): Promise<void> => {
    if (strategy !== 'summaryBuffer') return

    const result = await applySummaryBufferStrategy(messages)
    if (result.newSummary !== summary) {
      setSummary(result.newSummary)
      setMessages(result.messages)
    }
  }, [strategy, messages, summary, applySummaryBufferStrategy])

  /**
   * Clear all history
   */
  const clearHistory = React.useCallback((): void => {
    setMessages([])
    setSummary(null)
    setSummarizedCount(0)
    setTruncatedCount(0)
  }, [])

  /**
   * Export state
   */
  const exportState = React.useCallback((): ContextWindowState => {
    return state
  }, [state])

  /**
   * Import state
   */
  const importState = React.useCallback((newState: ContextWindowState): void => {
    setMessages(newState.messages)
    setSummary(newState.summary)
    setSummarizedCount(newState.summarizedCount)
    setTruncatedCount(newState.truncatedCount)
  }, [])

  return {
    state,
    addMessage,
    addMessages,
    getOptimizedContext,
    triggerSummarization,
    clearHistory,
    setStrategy,
    willExceedLimit,
    estimateTokensAfterAdd,
    exportState,
    importState,
  }
}
