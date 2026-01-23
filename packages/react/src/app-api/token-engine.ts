'use client'

/**
 * Clarity Chat - Token Optimization Engine
 *
 * A production-ready token optimization system with:
 * - Accurate token estimation for multiple models
 * - Context compression strategies
 * - Response caching
 * - Budget management and alerts
 */

import type { Message } from '@clarity-chat/types'
import type { TokenOptimizationConfig } from './types'

// =============================================================================
// Types
// =============================================================================

export interface TokenBudget {
  total: number
  used: number
  remaining: number
  utilization: number
  warning: boolean
  critical: boolean
}

export interface TokenOptimizationResult {
  messages: Message[]
  originalTokens: number
  optimizedTokens: number
  savings: number
  savingsPercent: number
  compressionApplied: string[]
}

export interface TokenEngineState {
  budget: number
  used: number
  model: string
  cache: Map<string, { content: string; tokens: number; timestamp: number }>
  cacheTtlMs: number
  compression: 'none' | 'basic' | 'aggressive'
  qualityThreshold: number
}

/**
 * Token estimation result for app-api internal use
 * @internal - Use TokenEstimate from @clarity-chat/token-optimization for external APIs
 */
export interface AppTokenEstimate {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  estimatedCost: number
}

// =============================================================================
// Token Estimation by Model
// =============================================================================

/**
 * Model-specific token estimation multipliers
 * Different models have different tokenization schemes
 */
const MODEL_CHAR_PER_TOKEN: Record<string, number> = {
  // OpenAI models
  'gpt-4': 4,
  'gpt-4-turbo': 4,
  'gpt-4-turbo-preview': 4,
  'gpt-4o': 4,
  'gpt-4o-mini': 4,
  'gpt-3.5-turbo': 4,
  'gpt-3.5-turbo-16k': 4,

  // Anthropic models
  'claude-3-opus': 4,
  'claude-3-sonnet': 4,
  'claude-3-haiku': 4,
  'claude-3-5-sonnet': 4,

  // Other models
  'mistral-7b': 4.5,
  'llama-3': 4.2,
  'gemini-pro': 4,

  // Default
  default: 4,
}

/**
 * Model pricing (USD per 1K tokens)
 */
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  default: { input: 0.001, output: 0.002 },
}

/**
 * Get characters per token for a model
 */
function getCharPerToken(model: string): number {
  // Find best match
  for (const [key, value] of Object.entries(MODEL_CHAR_PER_TOKEN)) {
    if (model.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return MODEL_CHAR_PER_TOKEN.default
}

/**
 * Get pricing for a model
 */
function getModelPricing(model: string): { input: number; output: number } {
  for (const [key, value] of Object.entries(MODEL_PRICING)) {
    if (model.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  return MODEL_PRICING.default
}

/**
 * Estimate tokens from text for a specific model
 */
export function estimateTokens(
  text: string,
  model: string = 'default'
): number {
  const charPerToken = getCharPerToken(model)
  // Add overhead for message formatting
  const overhead = 4 // Message structure tokens
  return Math.ceil(text.length / charPerToken) + overhead
}

/**
 * Estimate tokens for a message
 */
export function estimateMessageTokens(
  message: Message,
  model: string = 'default'
): number {
  const roleTokens = 2 // Role prefix tokens
  const contentTokens = estimateTokens(message.content, model)
  return roleTokens + contentTokens
}

/**
 * Estimate tokens for a conversation
 */
export function estimateConversationTokens(
  messages: Message[],
  model: string = 'default'
): number {
  const baseOverhead = 3 // Conversation structure overhead
  const messageTokens = messages.reduce(
    (sum, msg) => sum + estimateMessageTokens(msg, model),
    0
  )
  return baseOverhead + messageTokens
}

/**
 * Estimate cost for token usage
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string = 'default'
): number {
  const pricing = getModelPricing(model)
  const inputCost = (inputTokens / 1000) * pricing.input
  const outputCost = (outputTokens / 1000) * pricing.output
  return inputCost + outputCost
}

// =============================================================================
// Context Compression
// =============================================================================

/**
 * Apply basic compression to text
 * - Remove extra whitespace
 * - Simplify common phrases
 */
function applyBasicCompression(text: string): string {
  let result = text

  // Normalize whitespace
  result = result.replace(/\s+/g, ' ')

  // Remove unnecessary punctuation patterns
  result = result.replace(/\.{2,}/g, '...')
  result = result.replace(/!{2,}/g, '!')
  result = result.replace(/\?{2,}/g, '?')

  return result.trim()
}

/**
 * Apply aggressive compression to text
 * - All basic compression
 * - Remove filler phrases
 * - Abbreviate common terms
 */
function applyAggressiveCompression(text: string): string {
  let result = applyBasicCompression(text)

  // Remove filler phrases (be careful not to change meaning)
  const fillers = [
    /\b(basically|essentially|actually|literally|really|very|just|simply)\b/gi,
    /\b(I think that|I believe that|In my opinion|It seems like)\b/gi,
    /\b(As I mentioned|As I said|As we discussed)\b/gi,
    /\b(You know|I mean|Kind of|Sort of)\b/gi,
  ]

  for (const filler of fillers) {
    result = result.replace(filler, '')
  }

  // Abbreviate common technical terms
  const abbreviations: Record<string, string> = {
    application: 'app',
    configuration: 'config',
    environment: 'env',
    repository: 'repo',
    authentication: 'auth',
    authorization: 'authz',
    implementation: 'impl',
    documentation: 'docs',
    development: 'dev',
    production: 'prod',
    function: 'fn',
    parameter: 'param',
    argument: 'arg',
    reference: 'ref',
    information: 'info',
    specification: 'spec',
    requirement: 'req',
    maximum: 'max',
    minimum: 'min',
    number: 'num',
  }

  for (const [full, abbr] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${full}s?\\b`, 'gi')
    result = result.replace(regex, (match) =>
      match.endsWith('s') ? abbr + 's' : abbr
    )
  }

  // Clean up resulting whitespace
  result = result.replace(/\s+/g, ' ').trim()

  return result
}

/**
 * Compress a message based on compression level
 */
function compressMessage(
  message: Message,
  compression: 'none' | 'basic' | 'aggressive'
): Message {
  if (compression === 'none') return message

  const compressedContent =
    compression === 'aggressive'
      ? applyAggressiveCompression(message.content)
      : applyBasicCompression(message.content)

  return { ...message, content: compressedContent }
}

// =============================================================================
// Token Engine
// =============================================================================

/**
 * Create a new token engine instance
 */
export function createTokenEngine(
  config: TokenOptimizationConfig = {}
): TokenEngineState {
  return {
    budget: config.budget || 8192,
    used: 0,
    model: config.model || 'gpt-4o-mini',
    cache: new Map(),
    cacheTtlMs: config.cacheTtlMs || 60000,
    compression: config.compression || 'none',
    qualityThreshold: config.qualityThreshold || 0.8,
  }
}

/**
 * Update token usage
 */
export function updateUsage(
  state: TokenEngineState,
  tokens: number
): TokenEngineState {
  return { ...state, used: state.used + tokens }
}

/**
 * Get current budget status
 */
export function getBudgetStatus(state: TokenEngineState): TokenBudget {
  const remaining = Math.max(0, state.budget - state.used)
  const utilization = state.used / state.budget

  return {
    total: state.budget,
    used: state.used,
    remaining,
    utilization,
    warning: utilization > 0.7,
    critical: utilization > 0.9,
  }
}

/**
 * Check if there's enough budget for a request
 */
export function hasBudget(
  state: TokenEngineState,
  requiredTokens: number
): boolean {
  return state.budget - state.used >= requiredTokens
}

/**
 * Optimize messages to fit within budget
 */
export function optimizeForBudget(
  state: TokenEngineState,
  messages: Message[],
  reserveForOutput: number = 1000
): TokenOptimizationResult {
  const availableTokens = state.budget - state.used - reserveForOutput
  const originalTokens = estimateConversationTokens(messages, state.model)
  const compressionApplied: string[] = []

  // If already within budget, return as-is
  if (originalTokens <= availableTokens) {
    return {
      messages,
      originalTokens,
      optimizedTokens: originalTokens,
      savings: 0,
      savingsPercent: 0,
      compressionApplied,
    }
  }

  let optimizedMessages = [...messages]
  let currentTokens = originalTokens

  // Step 1: Apply compression
  if (state.compression !== 'none') {
    optimizedMessages = optimizedMessages.map((msg) =>
      compressMessage(msg, state.compression)
    )
    currentTokens = estimateConversationTokens(optimizedMessages, state.model)
    compressionApplied.push(`${state.compression} compression`)
  }

  // Step 2: If still over budget, trim older messages
  if (currentTokens > availableTokens) {
    // Keep system messages and most recent messages
    const systemMessages = optimizedMessages.filter((m) => m.role === 'system')
    const nonSystemMessages = optimizedMessages.filter(
      (m) => m.role !== 'system'
    )

    // Calculate how many tokens we have for non-system messages
    const systemTokens = estimateConversationTokens(systemMessages, state.model)
    const availableForMessages = availableTokens - systemTokens

    // Trim from the beginning (oldest messages) until we fit
    let trimmedMessages: Message[] = []
    let accumulatedTokens = 0

    // Work backwards from most recent
    for (let i = nonSystemMessages.length - 1; i >= 0; i--) {
      const msg = nonSystemMessages[i]
      const msgTokens = estimateMessageTokens(msg, state.model)

      if (accumulatedTokens + msgTokens <= availableForMessages) {
        trimmedMessages.unshift(msg)
        accumulatedTokens += msgTokens
      } else {
        break
      }
    }

    optimizedMessages = [...systemMessages, ...trimmedMessages]
    currentTokens = estimateConversationTokens(optimizedMessages, state.model)

    const dropped = nonSystemMessages.length - trimmedMessages.length
    if (dropped > 0) {
      compressionApplied.push(`dropped ${dropped} older messages`)
    }
  }

  // Step 3: If still over budget with aggressive compression
  if (currentTokens > availableTokens && state.compression !== 'aggressive') {
    optimizedMessages = optimizedMessages.map((msg) =>
      compressMessage(msg, 'aggressive')
    )
    currentTokens = estimateConversationTokens(optimizedMessages, state.model)
    compressionApplied.push('aggressive compression fallback')
  }

  const savings = originalTokens - currentTokens
  const savingsPercent = (savings / originalTokens) * 100

  return {
    messages: optimizedMessages,
    originalTokens,
    optimizedTokens: currentTokens,
    savings,
    savingsPercent: Math.round(savingsPercent * 10) / 10,
    compressionApplied,
  }
}

/**
 * Get cached response if available
 */
export function getCachedResponse(
  state: TokenEngineState,
  key: string
): { content: string; tokens: number } | null {
  const cached = state.cache.get(key)

  if (!cached) return null

  // Check TTL
  if (Date.now() - cached.timestamp > state.cacheTtlMs) {
    return null
  }

  return { content: cached.content, tokens: cached.tokens }
}

/**
 * Cache a response
 */
export function cacheResponse(
  state: TokenEngineState,
  key: string,
  content: string
): TokenEngineState {
  const tokens = estimateTokens(content, state.model)
  const cache = new Map(state.cache)

  cache.set(key, {
    content,
    tokens,
    timestamp: Date.now(),
  })

  // Prune old entries if cache is too large
  if (cache.size > 100) {
    const entries = Array.from(cache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    for (let i = 0; i < 20; i++) {
      cache.delete(entries[i][0])
    }
  }

  return { ...state, cache }
}

/**
 * Generate cache key for a request
 */
export function generateCacheKey(
  messages: Message[],
  systemPrompt?: string
): string {
  const content = messages.map((m) => `${m.role}:${m.content}`).join('|')
  const key = systemPrompt ? `${systemPrompt}||${content}` : content

  // Simple hash
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }

  return `cache_${hash.toString(36)}`
}

/**
 * Get full token estimate for a request
 */
export function getTokenEstimate(
  state: TokenEngineState,
  messages: Message[],
  expectedOutputTokens: number = 500
): AppTokenEstimate {
  const inputTokens = estimateConversationTokens(messages, state.model)
  const outputTokens = expectedOutputTokens
  const totalTokens = inputTokens + outputTokens
  const estimatedCost = estimateCost(inputTokens, outputTokens, state.model)

  return {
    inputTokens,
    outputTokens,
    totalTokens,
    estimatedCost,
  }
}

/**
 * Reset token usage tracking
 */
export function resetUsage(state: TokenEngineState): TokenEngineState {
  return { ...state, used: 0 }
}

/**
 * Clear the response cache
 */
export function clearCache(state: TokenEngineState): TokenEngineState {
  return { ...state, cache: new Map() }
}

/**
 * Get token engine statistics
 */
export function getTokenStats(state: TokenEngineState): {
  budget: number
  used: number
  remaining: number
  utilization: number
  cacheSize: number
  cacheHitRate: number // Would need tracking to calculate accurately
  model: string
  compression: string
} {
  const budget = getBudgetStatus(state)

  return {
    budget: state.budget,
    used: state.used,
    remaining: budget.remaining,
    utilization: Math.round(budget.utilization * 100) / 100,
    cacheSize: state.cache.size,
    cacheHitRate: 0, // Would need request tracking to calculate
    model: state.model,
    compression: state.compression,
  }
}
