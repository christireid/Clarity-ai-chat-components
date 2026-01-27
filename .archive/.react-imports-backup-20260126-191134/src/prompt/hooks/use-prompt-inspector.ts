/**
 * usePromptInspector Hook
 *
 * Dev tool hook for inspecting prompt composition and token usage.
 */

import { useMemo } from 'react'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import type { ModelMetadata } from '../core/tokenizer'
import {
  estimateMessageTokens,
  getTokenizerForModel,
  MODEL_PRESETS,
} from '../core/tokenizer'

/**
 * Options for usePromptInspector
 */
export interface UsePromptInspectorOptions {
  /** Messages to inspect */
  messages: CoreMessage[]
  /** Model metadata */
  modelMetadata?: ModelMetadata | string
  /** Show detailed breakdown */
  detailed?: boolean
}

/**
 * Message breakdown for inspection
 */
export interface MessageBreakdown {
  id: string
  role: string
  tokens: number
  content: string
  percentage: number
}

/**
 * Return type for usePromptInspector
 */
export interface UsePromptInspectorReturn {
  /** Total tokens */
  totalTokens: number
  /** Token breakdown by message */
  breakdown: MessageBreakdown[]
  /** Token breakdown by role */
  byRole: Record<string, { tokens: number; count: number; percentage: number }>
  /** Formatted view for display */
  formattedView: {
    summary: string
    details: string[]
  }
}

/**
 * Hook for inspecting prompts (dev tool)
 */
export function usePromptInspector(
  options: UsePromptInspectorOptions
): UsePromptInspectorReturn {
  const {
    messages,
    modelMetadata: modelMetadataOption,
    detailed = false,
  } = options

  // Resolve model metadata
  const modelMetadata = useMemo<ModelMetadata | undefined>(() => {
    if (!modelMetadataOption) return MODEL_PRESETS['gpt-4']

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

  const tokenizer = useMemo(() => {
    return getTokenizerForModel(modelMetadata?.model || 'gpt-4')
  }, [modelMetadata])

  // Calculate breakdown
  const breakdown = useMemo<MessageBreakdown[]>(() => {
    const total = estimateMessageTokens(messages, tokenizer)

    return messages.map((msg) => {
      const msgTokens = estimateMessageTokens([msg], tokenizer)
      const content =
        typeof msg.content === 'string'
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content
                .filter((p) => p.type === 'text')
                .map((p) => (p as { text: string }).text)
                .join(' ')
            : JSON.stringify(msg.content)

      return {
        id: msg.id || 'unknown',
        role: msg.role,
        tokens: msgTokens,
        content: detailed
          ? content
          : content.slice(0, 100) + (content.length > 100 ? '...' : ''),
        percentage: total > 0 ? (msgTokens / total) * 100 : 0,
      }
    })
  }, [messages, tokenizer, detailed])

  // Calculate by role
  const byRole = useMemo(() => {
    const total = estimateMessageTokens(messages, tokenizer)
    const roleMap: Record<string, { tokens: number; count: number }> = {}

    for (const msg of messages) {
      const msgTokens = estimateMessageTokens([msg], tokenizer)
      if (!roleMap[msg.role]) {
        roleMap[msg.role] = { tokens: 0, count: 0 }
      }
      roleMap[msg.role].tokens += msgTokens
      roleMap[msg.role].count += 1
    }

    const result: Record<
      string,
      { tokens: number; count: number; percentage: number }
    > = {}
    for (const [role, data] of Object.entries(roleMap)) {
      result[role] = {
        ...data,
        percentage: total > 0 ? (data.tokens / total) * 100 : 0,
      }
    }

    return result
  }, [messages, tokenizer])

  // Total tokens
  const totalTokens = useMemo(() => {
    return estimateMessageTokens(messages, tokenizer)
  }, [messages, tokenizer])

  // Formatted view
  const formattedView = useMemo(() => {
    const maxTokens = modelMetadata?.maxTokens ?? 8192
    const utilization = (totalTokens / maxTokens) * 100

    const summary = `Total: ${totalTokens} tokens / ${maxTokens} max (${utilization.toFixed(1)}% utilization)`

    const details: string[] = []
    details.push(`Messages: ${messages.length}`)
    details.push(`Breakdown by role:`)
    for (const [role, data] of Object.entries(byRole)) {
      details.push(
        `  ${role}: ${data.tokens} tokens (${data.count} messages, ${data.percentage.toFixed(1)}%)`
      )
    }

    if (detailed) {
      details.push('')
      details.push('Per-message breakdown:')
      for (const item of breakdown) {
        details.push(
          `  [${item.role}] ${item.tokens} tokens (${item.percentage.toFixed(1)}%): ${item.content.slice(0, 50)}...`
        )
      }
    }

    return { summary, details }
  }, [totalTokens, modelMetadata, messages.length, byRole, breakdown, detailed])

  return {
    totalTokens,
    breakdown,
    byRole,
    formattedView,
  }
}
