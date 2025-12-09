/**
 * Centralized Token Estimation
 *
 * Single source of truth for token estimation across the codebase.
 * Uses model-specific character-to-token ratios for accurate estimates.
 *
 * @module tokenization/estimator
 */

import type { ModelName } from './accurate-counter'

/**
 * Model-specific character-to-token ratios
 * Based on empirical data from accurate tokenizers
 */
const MODEL_CHAR_RATIOS: Record<string, number> = {
  // OpenAI models use ~4 chars per token (cl100k_base / o200k_base)
  'gpt-4': 4,
  'gpt-4-turbo': 4,
  'gpt-4o': 4,
  'gpt-4o-mini': 4,
  'gpt-4.1': 4,
  'gpt-3.5-turbo': 4,
  o1: 4,
  'o1-mini': 4,
  'o1-preview': 4,
  'o3-mini': 4,

  // Anthropic Claude models use ~3.8 chars per token
  'claude-3-opus': 3.8,
  'claude-3-sonnet': 3.8,
  'claude-3-haiku': 3.8,
  'claude-3-5-sonnet': 3.8,
  'claude-3-5-haiku': 3.8,
  'claude-sonnet-4': 3.8,
  'claude-opus-4': 3.8,

  // Google Gemini models use ~4 chars per token
  'gemini-pro': 4,
  'gemini-1.5-pro': 4,
  'gemini-1.5-flash': 4,
  'gemini-2.0-flash': 4,
  'gemini-2.0-pro': 4,

  // DeepSeek models
  'deepseek-chat': 4,
  'deepseek-coder': 4,
  'deepseek-r1': 4,

  // Llama models
  'llama-3': 4,
  'llama-3.1': 4,
  'llama-3.2': 4,
  'llama-3.3': 4,

  // Mistral models
  'mistral-large': 4,
  'mistral-medium': 4,
  'mistral-small': 4,
}

/**
 * Default character-to-token ratio for unknown models
 */
const DEFAULT_CHARS_PER_TOKEN = 4

/**
 * Provider-specific character-to-token ratios
 */
const PROVIDER_CHAR_RATIOS: Record<string, number> = {
  openai: 4,
  anthropic: 3.8,
  google: 4,
  deepseek: 4,
  meta: 4,
  mistral: 4,
}

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
 * This is the single source of truth for token estimation across the codebase.
 * Use this function instead of hardcoding character-to-token ratios.
 *
 * @param text - The text to estimate tokens for
 * @param model - Optional model name for model-specific estimation
 * @returns Estimated token count
 *
 * @example
 * ```ts
 * // Basic usage with default ratio
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
 *
 * // With provider-based estimation
 * const anthropicTokens = estimateTokensByProvider(text, 'anthropic')
 * ```
 */
export function estimateTokens(
  text: string,
  model?: ModelName | string
): number {
  if (!text) return 0

  const charsPerToken = model
    ? (MODEL_CHAR_RATIOS[model] ?? inferRatioFromModelName(model))
    : DEFAULT_CHARS_PER_TOKEN

  // Use effective char count for CJK-aware estimation
  const effectiveLength = containsCJK(text)
    ? getEffectiveCharCount(text)
    : text.length

  return Math.ceil(effectiveLength / charsPerToken)
}

/**
 * Estimate tokens using provider-specific ratio
 *
 * @param text - The text to estimate tokens for
 * @param provider - The LLM provider
 * @returns Estimated token count
 */
export function estimateTokensByProvider(
  text: string,
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'meta' | 'mistral'
): number {
  if (!text) return 0

  const charsPerToken =
    PROVIDER_CHAR_RATIOS[provider] ?? DEFAULT_CHARS_PER_TOKEN
  return Math.ceil(text.length / charsPerToken)
}

/**
 * Infer character-to-token ratio from model name
 * Falls back to default if no match found
 */
function inferRatioFromModelName(model: string): number {
  const lowerModel = model.toLowerCase()

  // Check for known model family patterns
  if (lowerModel.includes('claude')) return 3.8
  if (lowerModel.includes('gpt')) return 4
  if (lowerModel.includes('gemini')) return 4
  if (lowerModel.includes('deepseek')) return 4
  if (lowerModel.includes('llama')) return 4
  if (lowerModel.includes('mistral')) return 4
  if (lowerModel.includes('o1') || lowerModel.includes('o3')) return 4

  return DEFAULT_CHARS_PER_TOKEN
}

/**
 * Estimate tokens for an array of messages
 *
 * @param messages - Array of messages with content
 * @param model - Optional model for accurate estimation
 * @returns Total estimated token count
 */
export function estimateMessagesTokens(
  messages: Array<{ content: string; role?: string }>,
  model?: ModelName | string
): number {
  // Add ~4 tokens per message for formatting overhead (OpenAI style)
  const TOKENS_PER_MESSAGE = 4

  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content, model) + TOKENS_PER_MESSAGE
  }, 0)
}

/**
 * Get the character-to-token ratio for a model
 *
 * @param model - Model name
 * @returns Character-to-token ratio
 */
export function getCharsPerToken(model?: ModelName | string): number {
  if (!model) return DEFAULT_CHARS_PER_TOKEN
  return MODEL_CHAR_RATIOS[model] ?? inferRatioFromModelName(model)
}

/**
 * Validation helper to compare estimated vs actual token counts
 *
 * @param estimated - Estimated token count
 * @param actual - Actual token count from tokenizer
 * @returns Accuracy metrics
 */
export function validateEstimation(
  estimated: number,
  actual: number
): {
  error: number
  errorPercent: number
  isAccurate: boolean
} {
  const error = Math.abs(estimated - actual)
  const errorPercent = actual > 0 ? (error / actual) * 100 : 0
  const isAccurate = errorPercent <= 20 // Consider accurate if within 20%

  return { error, errorPercent, isAccurate }
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
  model?: ModelName | string
): {
  tokens: number
  charsPerToken: number
  textLength: number
  effectiveLength: number
  hasCJK: boolean
  model: string | undefined
  method: 'model-specific' | 'inferred' | 'default'
} {
  const charsPerToken = model
    ? (MODEL_CHAR_RATIOS[model] ?? inferRatioFromModelName(model))
    : DEFAULT_CHARS_PER_TOKEN

  const method: 'model-specific' | 'inferred' | 'default' = model
    ? MODEL_CHAR_RATIOS[model]
      ? 'model-specific'
      : 'inferred'
    : 'default'

  // Use CJK-aware estimation for accuracy
  const hasCJK = containsCJK(text)
  const effectiveLength = hasCJK ? getEffectiveCharCount(text) : text.length

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
