/**
 * Token Estimation for Audit Harness
 *
 * Provides consistent token estimation across the audit framework.
 * Uses gpt-tokenizer for GPT models, heuristics for others.
 */

import { encode } from 'gpt-tokenizer'

/**
 * Model-specific character-to-token ratios (empirically derived)
 */
const MODEL_CHAR_RATIOS: Record<string, number> = {
  // OpenAI models
  'gpt-4': 4.0,
  'gpt-4-turbo': 4.0,
  'gpt-4o': 4.0,
  'gpt-4o-mini': 4.0,
  'gpt-3.5-turbo': 4.0,
  o1: 4.0,
  'o1-mini': 4.0,
  'o1-preview': 4.0,
  'o3-mini': 4.0,

  // Anthropic Claude models
  'claude-3-opus': 3.8,
  'claude-3-sonnet': 3.8,
  'claude-3-haiku': 3.8,
  'claude-3-5-sonnet': 3.8,
  'claude-3-5-haiku': 3.8,
  'claude-sonnet-4': 3.8,
  'claude-opus-4': 3.8,

  // Google Gemini models
  'gemini-pro': 4.0,
  'gemini-1.5-pro': 4.0,
  'gemini-1.5-flash': 4.0,
  'gemini-2.0-flash': 4.0,
  'gemini-2.0-pro': 4.0,
}

const DEFAULT_RATIO = 4.0

/**
 * Check if content contains CJK characters
 */
function containsCJK(text: string): boolean {
  return /[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/.test(text)
}

/**
 * Get effective character count (CJK chars count as ~3)
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
 * Determine if model is a GPT model (can use gpt-tokenizer)
 */
function isGPTModel(model: string): boolean {
  const lower = model.toLowerCase()
  return (
    lower.includes('gpt') ||
    lower.includes('o1') ||
    lower.includes('o3') ||
    lower.startsWith('text-davinci') ||
    lower.startsWith('text-curie') ||
    lower.startsWith('text-babbage') ||
    lower.startsWith('text-ada')
  )
}

/**
 * Get char/token ratio for a model
 */
function getCharRatio(model: string): number {
  const normalizedModel = model.toLowerCase()

  // Check exact matches first
  for (const [key, ratio] of Object.entries(MODEL_CHAR_RATIOS)) {
    if (normalizedModel.includes(key)) {
      return ratio
    }
  }

  // Provider-based fallback
  if (normalizedModel.includes('claude')) return 3.8
  if (normalizedModel.includes('gemini')) return 4.0

  return DEFAULT_RATIO
}

export interface TokenEstimate {
  /** Estimated token count */
  tokens: number
  /** Method used */
  method: 'gpt-tokenizer' | 'char-ratio'
  /** Chars per token ratio used (if char-ratio method) */
  charsPerToken?: number
  /** Confidence level */
  confidence: 'exact' | 'high' | 'approximate'
}

/**
 * Estimate tokens for text using the most accurate method available
 */
export function estimateTokens(text: string, model: string): TokenEstimate {
  if (!text) {
    return { tokens: 0, method: 'char-ratio', confidence: 'exact' }
  }

  // Try gpt-tokenizer for GPT models
  if (isGPTModel(model)) {
    try {
      const tokens = encode(text).length
      return {
        tokens,
        method: 'gpt-tokenizer',
        confidence: 'exact',
      }
    } catch {
      // Fall through to char-ratio
    }
  }

  // Character ratio method
  const ratio = getCharRatio(model)
  const effectiveChars = containsCJK(text)
    ? getEffectiveCharCount(text)
    : text.length
  const tokens = Math.ceil(effectiveChars / ratio)

  return {
    tokens,
    method: 'char-ratio',
    charsPerToken: ratio,
    confidence: isGPTModel(model) ? 'high' : 'approximate',
  }
}

/**
 * Estimate tokens for a message array (includes overhead per message)
 */
export function estimateMessagesTokens(
  messages: Array<{ role: string; content: string | unknown }>,
  model: string
): TokenEstimate {
  // OpenAI uses ~4 tokens per message for formatting
  const TOKENS_PER_MESSAGE = 4
  // Final reply priming
  const TOKENS_REPLY_PRIMING = 3

  let totalTokens = TOKENS_REPLY_PRIMING
  let method: 'gpt-tokenizer' | 'char-ratio' = 'gpt-tokenizer'
  let confidence: 'exact' | 'high' | 'approximate' = 'exact'

  for (const msg of messages) {
    const content =
      typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content)
    const estimate = estimateTokens(content, model)

    totalTokens += estimate.tokens + TOKENS_PER_MESSAGE

    // Downgrade confidence if any message used char-ratio
    if (estimate.method === 'char-ratio') {
      method = 'char-ratio'
      if (estimate.confidence === 'approximate') {
        confidence = 'approximate'
      } else if (confidence === 'exact') {
        confidence = 'high'
      }
    }
  }

  return {
    tokens: totalTokens,
    method,
    confidence,
  }
}

/**
 * Create a PayloadSnapshot from messages
 */
export function createPayloadSnapshot(
  messages: Array<{ role: string; content: string | unknown }>,
  model: string,
  tools?: unknown[]
): {
  messages: Array<{
    role: string
    content: string | unknown
    contentString: string
    charCount: number
    estimatedTokens: number
  }>
  systemPrompt?: string
  totalChars: number
  totalEstimatedTokens: number
  toolsJson?: string
  toolsEstimatedTokens?: number
} {
  const processedMessages = messages.map((msg) => {
    const contentString =
      typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content)
    const estimate = estimateTokens(contentString, model)
    return {
      role: msg.role,
      content: msg.content,
      contentString,
      charCount: contentString.length,
      estimatedTokens: estimate.tokens,
    }
  })

  const systemPrompt = processedMessages.find(
    (m) => m.role === 'system'
  )?.contentString
  const totalChars = processedMessages.reduce((sum, m) => sum + m.charCount, 0)
  const totalEstimatedTokens = estimateMessagesTokens(messages, model).tokens

  let toolsJson: string | undefined
  let toolsEstimatedTokens: number | undefined

  if (tools && tools.length > 0) {
    toolsJson = JSON.stringify(tools)
    toolsEstimatedTokens = estimateTokens(toolsJson, model).tokens
  }

  return {
    messages: processedMessages,
    systemPrompt,
    totalChars,
    totalEstimatedTokens,
    toolsJson,
    toolsEstimatedTokens,
  }
}

/**
 * Calculate token savings between before and after snapshots
 */
export function calculateSavings(
  before: { totalEstimatedTokens: number; toolsEstimatedTokens?: number },
  after: { totalEstimatedTokens: number; toolsEstimatedTokens?: number }
): {
  tokensSaved: number
  percentSaved: number
} {
  const beforeTotal =
    before.totalEstimatedTokens + (before.toolsEstimatedTokens || 0)
  const afterTotal =
    after.totalEstimatedTokens + (after.toolsEstimatedTokens || 0)

  const tokensSaved = beforeTotal - afterTotal
  const percentSaved = beforeTotal > 0 ? (tokensSaved / beforeTotal) * 100 : 0

  return { tokensSaved, percentSaved }
}
