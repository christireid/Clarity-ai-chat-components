/**
 * Token Estimation Utilities
 *
 * Provides fast, character-based token estimation for various LLM models.
 * While not as accurate as full tokenization, these estimations are useful for:
 * - Quick budget checks before API calls
 * - UI feedback without blocking
 * - Approximate cost calculations
 *
 * @module utils/token-estimation
 */

import type { ModelId } from '../models/model-registry'
import { MODEL_REGISTRY } from '../models/model-registry'

/**
 * CJK character range detection
 * CJK characters typically use 1.5-2 tokens per character vs 0.25 for Latin
 */
function containsCJK(text: string): boolean {
  // Common CJK ranges: Chinese, Japanese, Korean
  return /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(text)
}

/**
 * Calculate CJK-aware character count
 * CJK characters count as ~3 chars for token estimation purposes
 */
function getEffectiveCharCount(text: string): number {
  let count = 0
  for (const char of text) {
    if (/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(char)) {
      count += 3 // CJK chars use more tokens
    } else {
      count += 1
    }
  }
  return count
}

/**
 * Estimate token count for a given text
 *
 * This provides fast, character-based estimation using model-specific ratios.
 * For accurate token counts, use AccurateTokenCounter instead.
 *
 * @param text - The text to estimate tokens for
 * @param model - Optional model name for model-specific estimation
 * @returns Estimated token count
 *
 * @example
 * ```ts
 * // Basic usage with default ratio (4 chars/token)
 * const tokens = estimateTokens("Hello, world!")
 * // => 4
 *
 * // With specific model for accurate estimation
 * const claudeTokens = estimateTokens(longText, 'claude-3-5-sonnet')
 * // Uses 3.8 chars/token ratio
 *
 * // CJK text is handled automatically
 * const chineseTokens = estimateTokens("你好世界")
 * // => 4 (accounts for higher token/char ratio)
 * ```
 */
export function estimateTokens(
  text: string,
  model?: ModelId | string
): number {
  if (!text) return 0

  // Get model-specific character-to-token ratio
  const charsPerToken = model && model in MODEL_REGISTRY
    ? MODEL_REGISTRY[model as ModelId].charsPerToken
    : 4 // Default ratio

  // Handle CJK text
  if (containsCJK(text)) {
    return Math.ceil(getEffectiveCharCount(text) / charsPerToken)
  }

  return Math.ceil(text.length / charsPerToken)
}

/**
 * Count tokens in a conversation with message formatting overhead
 *
 * Accounts for the token overhead of message formatting (role labels, delimiters, etc.)
 * Uses OpenAI's message formatting which adds ~4 tokens per message + 2 for priming.
 *
 * @param messages - Array of conversation messages
 * @param model - Optional model for estimation (defaults to gpt-4)
 * @returns Object with total token count and model
 *
 * @example
 * ```ts
 * const messages = [
 *   { role: 'system', content: 'You are a helpful assistant' },
 *   { role: 'user', content: 'Hello!' },
 *   { role: 'assistant', content: 'Hi there!' }
 * ]
 *
 * const result = countConversationTokens(messages)
 * // => { total: 25, model: 'gpt-4' }
 * // (4 tokens overhead per message × 3 messages + content tokens + 2 prime)
 * ```
 */
export function countConversationTokens(
  messages: Array<{ role: string; content: string; name?: string }>,
  model?: ModelId | string
): { total: number; model: string } {
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array')
  }

  const modelId = (model as ModelId) || 'gpt-4'

  // Message formatting overhead
  // OpenAI format adds ~4 tokens per message
  const TOKENS_PER_MESSAGE = 4
  const TOKENS_PER_NAME = 1
  const TOKENS_FOR_PRIMING = 2

  let totalTokens = 0

  for (const message of messages) {
    if (!message || typeof message !== 'object') {
      throw new Error('Invalid message structure')
    }

    if (typeof message.content !== 'string') {
      throw new Error('Message content must be a string')
    }

    // Count content tokens
    const contentTokens = estimateTokens(message.content, modelId)
    totalTokens += contentTokens

    // Add message formatting overhead
    totalTokens += TOKENS_PER_MESSAGE

    // Add extra tokens if message has a name field
    if (message.name) {
      totalTokens += TOKENS_PER_NAME
    }
  }

  // Add tokens for priming the response
  totalTokens += TOKENS_FOR_PRIMING

  return {
    total: totalTokens,
    model: modelId,
  }
}

/**
 * Estimate tokens for an array of messages (without conversation overhead)
 *
 * This is a simpler version that just sums token estimates without conversation formatting.
 * For conversation-aware estimation, use countConversationTokens instead.
 *
 * @param messages - Array of messages with content
 * @param model - Optional model for accurate estimation
 * @returns Total estimated token count
 *
 * @example
 * ```ts
 * const messages = [
 *   { content: 'First message', role: 'user' },
 *   { content: 'Second message', role: 'assistant' }
 * ]
 *
 * const tokens = estimateMessagesTokens(messages, 'gpt-4')
 * ```
 */
export function estimateMessagesTokens(
  messages: Array<{ content: string; role?: string }>,
  model?: ModelId | string
): number {
  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content, model)
  }, 0)
}

/**
 * Get the character-to-token ratio for a model
 *
 * @param model - Model name
 * @returns Character-to-token ratio
 *
 * @example
 * ```ts
 * const ratio = getCharsPerToken('gpt-4') // 4
 * const claudeRatio = getCharsPerToken('claude-3-sonnet') // 3.8
 * ```
 */
export function getCharsPerToken(model?: ModelId | string): number {
  if (!model || !(model in MODEL_REGISTRY)) {
    return 4 // Default ratio
  }
  return MODEL_REGISTRY[model as ModelId].charsPerToken
}

/**
 * Check if text is large enough to warrant async processing
 *
 * Texts larger than 50KB may benefit from async chunked processing
 * to avoid blocking the UI thread.
 *
 * @param text - Text to check
 * @returns true if async processing is recommended
 */
export function shouldUseAsyncEstimation(text: string): boolean {
  return text.length >= 50000 // 50KB threshold
}

/**
 * Estimate tokens with debugging info
 *
 * Provides detailed information about the estimation process,
 * including CJK-aware character counts and the method used.
 *
 * @param text - The text to estimate
 * @param model - Optional model for model-specific estimation
 * @returns Estimation result with detailed metadata
 *
 * @example
 * ```typescript
 * const debug = estimateTokensDebug("Hello 你好", 'gpt-4')
 * console.log(debug.tokens) // Accounts for CJK characters
 * console.log(debug.method) // 'model-specific'
 * console.log(debug.hasCJK) // true
 * ```
 */
export function estimateTokensDebug(
  text: string,
  model?: ModelId | string
): {
  tokens: number
  charsPerToken: number
  textLength: number
  effectiveLength: number
  hasCJK: boolean
  model: string | undefined
  method: 'model-specific' | 'default'
} {
  const hasCJK = containsCJK(text)
  const effectiveLength = hasCJK ? getEffectiveCharCount(text) : text.length
  const charsPerToken = getCharsPerToken(model)
  const method = model && model in MODEL_REGISTRY ? 'model-specific' : 'default'

  return {
    tokens: Math.ceil(effectiveLength / charsPerToken),
    charsPerToken,
    textLength: text.length,
    effectiveLength,
    hasCJK,
    model,
    method,
  }
}
