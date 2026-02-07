/**
 * Prompt & Token Optimization Utilities
 *
 * Helper functions and utilities for common tasks.
 */

import type { CoreMessage } from '../internal/hooks/use-chat-enhanced'
import {
  estimateMessageTokens,
  getTokenizerForModel,
  type ModelMetadata,
} from './core/tokenizer'

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) {
    return `${tokens}`
  } else if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K`
  } else {
    return `${(tokens / 1000000).toFixed(2)}M`
  }
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}¢`
  } else if (cost < 1) {
    return `$${(cost * 100).toFixed(2)}¢`
  } else {
    return `$${cost.toFixed(4)}`
  }
}

/**
 * Calculate token utilization percentage
 */
export function calculateUtilization(current: number, max: number): number {
  if (max === 0) return 0
  return Math.min(100, (current / max) * 100)
}

/**
 * Get utilization color (for UI)
 */
export function getUtilizationColor(utilization: number): string {
  if (utilization < 50) return 'green'
  if (utilization < 75) return 'yellow'
  if (utilization < 90) return 'orange'
  return 'red'
}

/**
 * Estimate total tokens for a conversation
 */
export function estimateConversationTokens(
  messages: CoreMessage[],
  modelMetadata?: ModelMetadata | string
): number {
  const tokenizer = modelMetadata
    ? getTokenizerForModel(
        typeof modelMetadata === 'string' ? modelMetadata : modelMetadata.model
      )
    : getTokenizerForModel('gpt-4')

  return estimateMessageTokens(messages, tokenizer)
}

/**
 * Check if messages exceed token budget
 */
export function exceedsTokenBudget(
  messages: CoreMessage[],
  budget: number,
  modelMetadata?: ModelMetadata | string
): boolean {
  const tokens = estimateConversationTokens(messages, modelMetadata)
  return tokens > budget
}

/**
 * Get token breakdown by role
 */
export function getTokenBreakdownByRole(
  messages: CoreMessage[],
  modelMetadata?: ModelMetadata | string
): Record<string, { tokens: number; count: number; percentage: number }> {
  const tokenizer = modelMetadata
    ? getTokenizerForModel(
        typeof modelMetadata === 'string' ? modelMetadata : modelMetadata.model
      )
    : getTokenizerForModel('gpt-4')

  const total = estimateMessageTokens(messages, tokenizer)
  const breakdown: Record<string, { tokens: number; count: number }> = {}

  for (const msg of messages) {
    const msgTokens = estimateMessageTokens([msg], tokenizer)
    const role = msg.role

    if (!breakdown[role]) {
      breakdown[role] = { tokens: 0, count: 0 }
    }

    breakdown[role].tokens += msgTokens
    breakdown[role].count += 1
  }

  const result: Record<
    string,
    { tokens: number; count: number; percentage: number }
  > = {}
  for (const [role, data] of Object.entries(breakdown)) {
    result[role] = {
      ...data,
      percentage: total > 0 ? (data.tokens / total) * 100 : 0,
    }
  }

  return result
}

/**
 * Get optimization recommendation based on token usage
 */
export function getOptimizationRecommendation(
  currentTokens: number,
  maxTokens: number,
  messageCount: number
): {
  recommended: boolean
  strategy?: 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
  reason: string
} {
  const utilization = calculateUtilization(currentTokens, maxTokens)

  if (utilization < 50) {
    return {
      recommended: false,
      reason: 'Token usage is low, no optimization needed',
    }
  }

  if (utilization < 75) {
    return {
      recommended: true,
      strategy: 'sliding-window',
      reason: 'Consider using sliding-window to keep conversation fresh',
    }
  }

  if (utilization < 90) {
    return {
      recommended: true,
      strategy: 'hybrid',
      reason: 'Approaching budget limit, use hybrid strategy for best results',
    }
  }

  return {
    recommended: true,
    strategy: 'summarize-old',
    reason:
      'Budget nearly exceeded, summarize old messages to preserve context',
  }
}

/**
 * Create a simple summarization function (placeholder)
 * In production, this would call an actual LLM API
 */
export function createSimpleSummarizer(
  apiEndpoint?: string
): (messages: CoreMessage[]) => Promise<string> {
  return async (messages: CoreMessage[]) => {
    if (apiEndpoint) {
      // Call actual summarization API
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        })
        const data = await response.json()
        return data.summary || 'Conversation summary'
      } catch (error) {
        // Summarization failed - fallback to simple truncation
      }
    }

    // Fallback: simple extractive summarization
    const texts = messages
      .map((m) =>
        typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      )
      .filter(Boolean)

    if (texts.length === 0) return 'No messages to summarize'

    // Take first and last messages, and a sample from the middle
    const first = texts[0]
    const last = texts[texts.length - 1]
    const middle = texts.length > 2 ? texts[Math.floor(texts.length / 2)] : ''

    return `Previous conversation summary: ${first}${middle ? ` ... ${middle} ... ` : ' ... '}${last}`
  }
}
