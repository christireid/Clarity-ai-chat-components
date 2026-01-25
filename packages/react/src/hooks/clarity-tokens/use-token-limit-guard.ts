'use client'

import * as React from 'react'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import type { ChatMessage } from '@clarity-chat/token-optimization'
import {
  MODEL_REGISTRY,
  getModelConfig,
} from '../../utils/tokenization/model-registry'

// =============================================================================
// Types
// =============================================================================

export type GuardPolicy = 'truncate' | 'summarize' | 'hybrid' | 'refuse'

export interface UseTokenLimitGuardConfig {
  /** Maximum input tokens allowed */
  maxInputTokens: number
  /** Policy for handling over-budget prompts */
  policy: GuardPolicy
  /** Summarization function (required for summarize/hybrid policies) */
  summarizeFn?: (text: string, targetTokens: number) => Promise<string>
  /** Model for token counting */
  model?: string
  /** Keep system messages intact */
  preserveSystemMessages?: boolean
  /** Minimum messages to keep */
  minMessagesToKeep?: number
}

export interface GuardResult {
  /** Guarded messages */
  messages: ChatMessage[]
  /** Number of tokens removed */
  removedTokens: number
  /** Policy that was applied */
  policyApplied: GuardPolicy | 'none'
  /** Original token count */
  originalTokens: number
  /** Final token count */
  finalTokens: number
  /** Summary text if summarization was applied */
  summary?: string
}

export interface UseTokenLimitGuardReturn {
  /** Guard messages against token limit */
  guardMessages: (messages: ChatMessage[]) => Promise<GuardResult>
  /** Check if messages are within limit */
  isWithinLimit: (messages: ChatMessage[]) => boolean
  /** Get token count for messages */
  countTokens: (messages: ChatMessage[]) => number
  /** Current configuration */
  config: UseTokenLimitGuardConfig
  /** Update configuration */
  updateConfig: (config: Partial<UseTokenLimitGuardConfig>) => void
}

// =============================================================================
// Error Classes
// =============================================================================

export class BudgetExceededError extends Error {
  currentTokens: number
  maxTokens: number

  constructor(currentTokens: number, maxTokens: number) {
    super(
      `Budget exceeded: ${currentTokens} tokens exceeds limit of ${maxTokens}`
    )
    this.name = 'BudgetExceededError'
    this.currentTokens = currentTokens
    this.maxTokens = maxTokens
  }
}

export class SummarizationFailedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SummarizationFailedError'
  }
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * useTokenLimitGuard - Ensures prompts stay under a max token limit
 *
 * Applies configurable policies to handle over-budget prompts:
 * - truncate: Drop oldest non-system messages first
 * - summarize: Summarize oldest segment into a synthetic system note
 * - hybrid: Truncate until near threshold then summarize
 * - refuse: Throw BudgetExceededError
 *
 * @example
 * ```tsx
 * function Chat() {
 *   const guard = useTokenLimitGuard({
 *     maxInputTokens: 8000,
 *     policy: 'hybrid',
 *     summarizeFn: async (text, targetTokens) => {
 *       // Call LLM to summarize
 *       return summarizedText
 *     }
 *   })
 *
 *   const handleSend = async () => {
 *     const { messages: safeMessages } = await guard.guardMessages(messages)
 *     await sendToLLM(safeMessages)
 *   }
 * }
 * ```
 */
export function useTokenLimitGuard(
  initialConfig: UseTokenLimitGuardConfig
): UseTokenLimitGuardReturn {
  const [config, setConfig] = React.useState(initialConfig)

  // Token counter instance
  const counterRef = React.useRef<AccurateTokenCounter | null>(null)

  // Initialize counter
  React.useEffect(() => {
    counterRef.current = new AccurateTokenCounter({
      model: config.model ?? 'gpt-4o',
      enableCaching: true,
    })

    return () => {
      counterRef.current?.destroy()
    }
  }, [config.model])

  /**
   * Count tokens for chat messages
   */
  const countTokens = React.useCallback((messages: ChatMessage[]): number => {
    if (!counterRef.current) {
      // Fallback estimate
      return messages.reduce(
        (sum, m) => sum + Math.ceil(m.content.length / 4),
        0
      )
    }
    return counterRef.current.countChat(messages)
  }, [])

  /**
   * Check if messages are within limit
   */
  const isWithinLimit = React.useCallback(
    (messages: ChatMessage[]): boolean => {
      return countTokens(messages) <= config.maxInputTokens
    },
    [countTokens, config.maxInputTokens]
  )

  /**
   * Truncate messages to fit within budget
   */
  const truncateMessages = React.useCallback(
    (
      messages: ChatMessage[],
      maxTokens: number
    ): { messages: ChatMessage[]; removedTokens: number } => {
      const truncatedMessages = [...messages]
      let currentTokens = countTokens(truncatedMessages)
      const originalTokens = currentTokens
      const minMessages = config.minMessagesToKeep ?? 2

      while (
        currentTokens > maxTokens &&
        truncatedMessages.length > minMessages
      ) {
        // Find first non-system message to remove (excluding the last user message)
        let indexToRemove = -1
        for (let i = 0; i < truncatedMessages.length - 1; i++) {
          const msg = truncatedMessages[i]
          if (config.preserveSystemMessages && msg.role === 'system') continue
          indexToRemove = i
          break
        }

        if (indexToRemove === -1) break

        truncatedMessages.splice(indexToRemove, 1)
        currentTokens = countTokens(truncatedMessages)
      }

      return {
        messages: truncatedMessages,
        removedTokens: originalTokens - currentTokens,
      }
    },
    [countTokens, config.preserveSystemMessages, config.minMessagesToKeep]
  )

  /**
   * Summarize older messages
   */
  const summarizeMessages = React.useCallback(
    async (
      messages: ChatMessage[],
      targetTokens: number
    ): Promise<{
      messages: ChatMessage[]
      summary: string
      removedTokens: number
    }> => {
      if (!config.summarizeFn) {
        throw new SummarizationFailedError('No summarization function provided')
      }

      const currentTokens = countTokens(messages)
      const tokensToRemove = currentTokens - targetTokens

      // Find messages to summarize (older messages, excluding system)
      const systemMessages = messages.filter((m) => m.role === 'system')
      const nonSystemMessages = messages.filter((m) => m.role !== 'system')

      // Keep the most recent messages, summarize the rest
      const keepCount = Math.max(2, Math.floor(nonSystemMessages.length / 2))
      const messagesToSummarize = nonSystemMessages.slice(0, -keepCount)
      const messagesToKeep = nonSystemMessages.slice(-keepCount)

      if (messagesToSummarize.length === 0) {
        return { messages, summary: '', removedTokens: 0 }
      }

      // Create text to summarize
      const textToSummarize = messagesToSummarize
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n\n')

      // Calculate target tokens for summary
      const currentSummaryTokens = countTokens([
        { role: 'system', content: textToSummarize },
      ])
      const targetSummaryTokens = Math.max(
        100,
        Math.floor(currentSummaryTokens * 0.3)
      )

      try {
        const summary = await config.summarizeFn(
          textToSummarize,
          targetSummaryTokens
        )

        // Build new message list
        const summaryMessage: ChatMessage = {
          role: 'system',
          content: `[Previous conversation summary]\n${summary}`,
        }

        const newMessages = [
          ...systemMessages,
          summaryMessage,
          ...messagesToKeep,
        ]
        const newTokens = countTokens(newMessages)

        return {
          messages: newMessages,
          summary,
          removedTokens: currentTokens - newTokens,
        }
      } catch (error) {
        throw new SummarizationFailedError(
          `Summarization failed: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    },
    [countTokens, config]
  )

  /**
   * Guard messages against token limit
   */
  const guardMessages = React.useCallback(
    async (messages: ChatMessage[]): Promise<GuardResult> => {
      const originalTokens = countTokens(messages)

      // Check if already within limit
      if (originalTokens <= config.maxInputTokens) {
        return {
          messages,
          removedTokens: 0,
          policyApplied: 'none',
          originalTokens,
          finalTokens: originalTokens,
        }
      }

      switch (config.policy) {
        case 'refuse':
          throw new BudgetExceededError(originalTokens, config.maxInputTokens)

        case 'truncate': {
          const { messages: truncated, removedTokens } = truncateMessages(
            messages,
            config.maxInputTokens
          )
          return {
            messages: truncated,
            removedTokens,
            policyApplied: 'truncate',
            originalTokens,
            finalTokens: countTokens(truncated),
          }
        }

        case 'summarize': {
          const {
            messages: summarized,
            summary,
            removedTokens,
          } = await summarizeMessages(messages, config.maxInputTokens)
          return {
            messages: summarized,
            removedTokens,
            policyApplied: 'summarize',
            originalTokens,
            finalTokens: countTokens(summarized),
            summary,
          }
        }

        case 'hybrid': {
          // First truncate to get close to limit
          const truncateTarget = Math.floor(config.maxInputTokens * 1.2)
          const { messages: truncated } = truncateMessages(
            messages,
            truncateTarget
          )

          // Then summarize if still over
          if (countTokens(truncated) > config.maxInputTokens) {
            const {
              messages: summarized,
              summary,
              removedTokens,
            } = await summarizeMessages(truncated, config.maxInputTokens)
            return {
              messages: summarized,
              removedTokens: originalTokens - countTokens(summarized),
              policyApplied: 'hybrid',
              originalTokens,
              finalTokens: countTokens(summarized),
              summary,
            }
          }

          return {
            messages: truncated,
            removedTokens: originalTokens - countTokens(truncated),
            policyApplied: 'hybrid',
            originalTokens,
            finalTokens: countTokens(truncated),
          }
        }

        default:
          throw new Error(`Unknown policy: ${config.policy}`)
      }
    },
    [
      config.maxInputTokens,
      config.policy,
      countTokens,
      truncateMessages,
      summarizeMessages,
    ]
  )

  /**
   * Update configuration
   */
  const updateConfig = React.useCallback(
    (newConfig: Partial<UseTokenLimitGuardConfig>) => {
      setConfig((prev) => ({ ...prev, ...newConfig }))
    },
    []
  )

  return {
    guardMessages,
    isWithinLimit,
    countTokens,
    config,
    updateConfig,
  }
}
