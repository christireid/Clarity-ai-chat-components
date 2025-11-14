/**
 * Prompt Optimization Utilities
 * 
 * Helper utilities for working with prompts and token optimization.
 */

import type { CoreMessage } from '../hooks/use-chat-enhanced'
import type { ModelMetadata } from './core/types'
import { estimateMessageArrayTokens } from './core/token-estimation'

/**
 * Check if messages exceed token budget
 */
export function exceedsTokenBudget(
  messages: CoreMessage[],
  targetTokens: number,
  model?: ModelMetadata | string
): boolean {
  const modelId = typeof model === 'string' ? model : model?.id
  const tokens = estimateMessageArrayTokens(messages, { model: modelId })
  return tokens > targetTokens
}

/**
 * Get token usage percentage
 */
export function getTokenUsagePercent(
  messages: CoreMessage[],
  targetTokens: number,
  model?: ModelMetadata | string
): number {
  const modelId = typeof model === 'string' ? model : model?.id
  const tokens = estimateMessageArrayTokens(messages, { model: modelId })
  return Math.min(100, (tokens / targetTokens) * 100)
}

/**
 * Format token count for display
 */
export function formatTokenCount(tokens: number): string {
  if (tokens < 1000) {
    return `${tokens}`
  }
  if (tokens < 1000000) {
    return `${(tokens / 1000).toFixed(1)}K`
  }
  return `${(tokens / 1000000).toFixed(2)}M`
}

/**
 * Format cost for display
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}¢`
  }
  return `$${cost.toFixed(4)}`
}

/**
 * Get token budget status
 */
export function getTokenBudgetStatus(
  currentTokens: number,
  targetTokens: number
): 'safe' | 'warning' | 'exceeded' {
  const percent = (currentTokens / targetTokens) * 100
  
  if (percent > 100) {
    return 'exceeded'
  }
  if (percent > 80) {
    return 'warning'
  }
  return 'safe'
}

/**
 * Calculate remaining tokens
 */
export function getRemainingTokens(
  currentTokens: number,
  targetTokens: number
): number {
  return Math.max(0, targetTokens - currentTokens)
}

/**
 * Estimate response tokens (rough approximation)
 */
export function estimateResponseTokens(
  inputTokens: number,
  model?: ModelMetadata | string
): number {
  // Rough estimate: responses are typically 20-50% of input tokens
  // This is a very rough approximation
  return Math.floor(inputTokens * 0.3)
}

/**
 * Calculate total cost (input + estimated output)
 */
export function estimateTotalCost(
  inputTokens: number,
  model: ModelMetadata
): number {
  const inputCost = model.inputPricePer1K
    ? (inputTokens / 1000) * model.inputPricePer1K
    : 0
  
  const estimatedOutputTokens = estimateResponseTokens(inputTokens, model)
  const outputCost = model.outputPricePer1K
    ? (estimatedOutputTokens / 1000) * model.outputPricePer1K
    : 0
  
  return inputCost + outputCost
}
