/**
 * usePromptInspector Hook
 * 
 * Dev tool hook for inspecting prompt composition and token usage
 */

import * as React from 'react'
import type { ModelMetadata } from '../core/types'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import { estimatePromptTokens } from '../core'

/**
 * Options for usePromptInspector
 */
export interface UsePromptInspectorOptions {
  /** Messages to inspect */
  messages: CoreMessage[]
  /** Model metadata */
  model: ModelMetadata
  /** Whether inspector is enabled */
  enabled?: boolean
}

/**
 * Message inspection data
 */
export interface MessageInspection {
  /** Message */
  message: CoreMessage
  /** Token count */
  tokens: number
  /** Role */
  role: CoreMessage['role']
  /** Content preview */
  contentPreview: string
}

/**
 * Return type for usePromptInspector
 */
export interface UsePromptInspectorReturn {
  /** Total token count */
  totalTokens: number
  /** Breakdown by role */
  breakdown: {
    system?: number
    user?: number
    assistant?: number
    tool?: number
  }
  /** Per-message inspection */
  messageInspections: MessageInspection[]
  /** Estimated cost */
  estimatedCost?: number
  /** Whether budget is exceeded */
  isOverBudget: boolean
  /** Budget percentage used */
  budgetPercentage: number
}

/**
 * Hook for inspecting prompts (dev tool)
 * 
 * @example
 * ```tsx
 * const inspector = usePromptInspector({
 *   messages,
 *   model: { model: 'gpt-4', maxTokens: 8000 },
 * })
 * 
 * // Render in debug panel
 * <div>
 *   <p>Tokens: {inspector.totalTokens} / {model.maxTokens}</p>
 *   <p>Budget: {inspector.budgetPercentage.toFixed(1)}%</p>
 * </div>
 * ```
 */
export function usePromptInspector(
  options: UsePromptInspectorOptions
): UsePromptInspectorReturn {
  const { messages, model, enabled = true } = options

  const inspection = React.useMemo(() => {
    if (!enabled) {
      return {
        totalTokens: 0,
        breakdown: {},
        messageInspections: [],
        estimatedCost: undefined,
        isOverBudget: false,
        budgetPercentage: 0,
      }
    }

    const estimate = estimatePromptTokens(messages, model)

    // Inspect each message
    const messageInspections: MessageInspection[] = messages.map((msg) => {
      const msgEstimate = estimatePromptTokens([msg], model)

      let contentPreview = ''
      if (typeof msg.content === 'string') {
        contentPreview = msg.content.slice(0, 100)
      } else if (Array.isArray(msg.content)) {
        const textParts = msg.content
          .filter((p) => p.type === 'text')
          .map((p) => (p as { text: string }).text)
        contentPreview = textParts.join(' ').slice(0, 100)
      }

      return {
        message: msg,
        tokens: msgEstimate.tokens,
        role: msg.role,
        contentPreview,
      }
    })

    const budgetPercentage =
      model.maxTokens > 0
        ? (estimate.tokens / model.maxTokens) * 100
        : 0

    return {
      totalTokens: estimate.tokens,
      breakdown: estimate.breakdown,
      messageInspections,
      estimatedCost: estimate.estimatedCost,
      isOverBudget: estimate.tokens > model.maxTokens,
      budgetPercentage,
    }
  }, [messages, model, enabled])

  return inspection
}
