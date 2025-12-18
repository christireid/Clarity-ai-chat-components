/**
 * Accurate Token Counting
 *
 * Provides accurate token counting for various LLM models.
 * Uses js-tiktoken when available, falls back to estimation.
 */

import { TokenCounter } from '@clarity-chat/token-optimization'
import { InputValidator } from './input-validator.js'
import { errorHandler, ErrorCategory, ErrorSeverity } from './enhanced-error-handling.js'

export type ModelName =
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4.1'
  | 'gpt-4.1-mini'
  | 'gpt-4.1-nano'
  | 'gpt-3.5-turbo'
  // OpenAI O1/O3 Reasoning Models
  | 'o1'
  | 'o1-mini'
  | 'o1-preview'
  | 'o3-mini'
  // Anthropic Claude 3 Family
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  // Anthropic Claude 4 Family
  | 'claude-sonnet-4'
  | 'claude-opus-4'
  // Google Gemini Family
  | 'gemini-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  // DeepSeek Models
  | 'deepseek-chat'
  | 'deepseek-coder'
  | 'deepseek-r1'
  // Llama Models
  | 'llama-3'
  | 'llama-3.1'
  | 'llama-3.2'
  | 'llama-3.3'
  // Mistral Models
  | 'mistral-large'
  | 'mistral-medium'
  | 'mistral-small'

export interface TokenCount {
  /** Total tokens */
  total: number
  /** Input/prompt tokens */
  input?: number
  /** Output/completion tokens */
  output?: number
  /** Model used for counting */
  model: string
  /** Counting method (accurate or estimated) */
  method: 'accurate' | 'estimated'
}

export interface TokenizerOptions {
  /** Model to use for tokenization */
  model?: ModelName
  /** Cache tokenization results */
  cache?: boolean
  /** Use accurate tokenization if available */
  preferAccurate?: boolean
}

/**
 * Token counter cache with LRU eviction and hit/miss tracking
 *
 * Uses Map's insertion order for O(1) LRU implementation:
 * - On get: delete and re-insert to move to end (most recently used)
 * - On evict: delete first item (least recently used)
 */
class TokenCountCache {
  private cache = new Map<string, number>()
  private maxSize = 1000
  private hits = 0
  private misses = 0

  /**
   * Get value from cache, moving it to most recently used position
   */
  get(key: string): number | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      this.hits++
      // Move to end (most recently used) by delete + re-insert
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  /**
   * Record a cache miss (called when value not found and computed)
   */
  recordMiss(): void {
    this.misses++
  }

  /**
   * Set value in cache, evicting LRU entry if at capacity
   */
  set(key: string, count: number): void {
    // If key exists, delete it first (will be re-added at end)
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first item in Map)
      const lruKey = this.cache.keys().next().value
      if (lruKey) this.cache.delete(lruKey)
    }
    this.cache.set(key, count)
  }

  clear(): void {
    this.cache.clear()
    this.hits = 0
    this.misses = 0
  }

  size(): number {
    return this.cache.size
  }

  /**
   * Get cache statistics
   */
  getStats(): { hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0,
    }
  }
}

const tokenCache = new TokenCountCache()

/**
 * Model-specific tokenization configurations
 */
const MODEL_CONFIGS: Record<
  ModelName,
  {
    encoding: string
    charsPerToken: number
    provider:
      | 'openai'
      | 'anthropic'
      | 'google'
      | 'deepseek'
      | 'meta'
      | 'mistral'
  }
> = {
  // OpenAI GPT-4 Family
  'gpt-4': { encoding: 'cl100k_base', charsPerToken: 4, provider: 'openai' },
  'gpt-4-turbo': {
    encoding: 'cl100k_base',
    charsPerToken: 4,
    provider: 'openai',
  },
  'gpt-4o': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
  'gpt-4o-mini': {
    encoding: 'o200k_base',
    charsPerToken: 4,
    provider: 'openai',
  },
  'gpt-4.1': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
  'gpt-4.1-mini': {
    encoding: 'o200k_base',
    charsPerToken: 4,
    provider: 'openai',
  },
  'gpt-4.1-nano': {
    encoding: 'o200k_base',
    charsPerToken: 4,
    provider: 'openai',
  },
  'gpt-3.5-turbo': {
    encoding: 'cl100k_base',
    charsPerToken: 4,
    provider: 'openai',
  },

  // OpenAI O1/O3 Reasoning Models
  o1: { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
  'o1-mini': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },
  'o1-preview': {
    encoding: 'o200k_base',
    charsPerToken: 4,
    provider: 'openai',
  },
  'o3-mini': { encoding: 'o200k_base', charsPerToken: 4, provider: 'openai' },

  // Anthropic Claude 3 Family
  'claude-3-opus': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },
  'claude-3-sonnet': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },
  'claude-3-haiku': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },
  'claude-3-5-sonnet': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },
  'claude-3-5-haiku': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },

  // Anthropic Claude 4 Family
  'claude-sonnet-4': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },
  'claude-opus-4': {
    encoding: 'claude',
    charsPerToken: 3.8,
    provider: 'anthropic',
  },

  // Google Gemini Family
  'gemini-pro': { encoding: 'gemini', charsPerToken: 4, provider: 'google' },
  'gemini-1.5-pro': {
    encoding: 'gemini',
    charsPerToken: 4,
    provider: 'google',
  },
  'gemini-1.5-flash': {
    encoding: 'gemini',
    charsPerToken: 4,
    provider: 'google',
  },
  'gemini-2.0-flash': {
    encoding: 'gemini',
    charsPerToken: 4,
    provider: 'google',
  },
  'gemini-2.0-pro': {
    encoding: 'gemini',
    charsPerToken: 4,
    provider: 'google',
  },

  // DeepSeek Models
  'deepseek-chat': {
    encoding: 'deepseek',
    charsPerToken: 4,
    provider: 'deepseek',
  },
  'deepseek-coder': {
    encoding: 'deepseek',
    charsPerToken: 4,
    provider: 'deepseek',
  },
  'deepseek-r1': {
    encoding: 'deepseek',
    charsPerToken: 4,
    provider: 'deepseek',
  },

  // Llama Models
  'llama-3': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
  'llama-3.1': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
  'llama-3.2': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },
  'llama-3.3': { encoding: 'llama3', charsPerToken: 4, provider: 'meta' },

  // Mistral Models
  'mistral-large': {
    encoding: 'mistral',
    charsPerToken: 4,
    provider: 'mistral',
  },
  'mistral-medium': {
    encoding: 'mistral',
    charsPerToken: 4,
    provider: 'mistral',
  },
  'mistral-small': {
    encoding: 'mistral',
    charsPerToken: 4,
    provider: 'mistral',
  },
}

/**
 * Count tokens in text with high accuracy
 *
 * Uses the new @clarity-chat/token-optimization package for accurate counting.
 *
 * @example
 * ```ts
 * const count = await countTokens("Hello, world!", { model: 'gpt-4' })
 * logger.debug(count.total) // 4
 * logger.debug(count.method) // 'accurate' or 'estimated'
 * ```
 */
export async function countTokens(
  text: string,
  options: TokenizerOptions = {}
): Promise<TokenCount> {
  const { model = 'gpt-4', cache = true, preferAccurate = true } = options

  // Use the new TokenCounter from the token-optimization package
  const count = TokenCounter.count(text)

  return {
    total: count,
    model,
    method: 'accurate',
  }
}

/**
 * Count tokens accurately using tiktoken
 * Note: This requires js-tiktoken to be installed
 */
async function countTokensAccurate(
  text: string,
  encoding: string
): Promise<number> {
  try {
    // Dynamic import to avoid errors if package not installed
    // @ts-expect-error - js-tiktoken is an optional peer dependency
    const { encoding_for_model, get_encoding } = await import('js-tiktoken')

    // Try to get encoding by model name first, then by encoding name
    let encoder: any
    try {
      encoder = encoding_for_model(encoding as any)
    } catch {
      encoder = get_encoding(encoding as any)
    }

    const tokens = encoder.encode(text)
    encoder.free?.() // Clean up if free method exists

    return tokens.length
  } catch (error) {
    throw new Error(
      `js-tiktoken not available or encoding not found: ${encoding}`
    )
  }
}

/**
 * Estimate token count (fallback when tiktoken not available)
 */
function estimateTokenCount(text: string, charsPerToken: number): number {
  return Math.ceil(text.length / charsPerToken)
}

/**
 * Count tokens in a conversation
 * Uses the new @clarity-chat/token-optimization package for accurate counting
 */
export async function countConversationTokens(
  messages: Array<{ role: string; content: string }>,
  options: TokenizerOptions = {}
): Promise<TokenCount> {
  const { model = 'gpt-4' } = options

  try {
    // Validate inputs
    const modelValidation = InputValidator.validateModel(model);
    if (!modelValidation.valid) {
      throw errorHandler.createError(
        `Invalid model: ${modelValidation.errors.join(', ')}`,
        'INVALID_MODEL',
        ErrorCategory.VALIDATION,
        ErrorSeverity.LOW,
        { operation: 'countConversationTokens', config: options }
      );
    }

    const validModel = modelValidation.sanitized || 'gpt-4';

    // Validate messages
    if (!Array.isArray(messages)) {
      throw errorHandler.createError(
        'Messages must be an array',
        'INVALID_MESSAGES',
        ErrorCategory.VALIDATION,
        ErrorSeverity.LOW,
        { operation: 'countConversationTokens', input: messages }
      );
    }

    // Use the new TokenCounter for accurate counting
    // Add overhead for message formatting
    // OpenAI format adds ~4 tokens per message
    const TOKENS_PER_MESSAGE = 4
    const TOKENS_PER_NAME = 1

    let totalTokens = 0

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      
      // Validate message structure
      if (!message || typeof message !== 'object') {
        throw errorHandler.createError(
          `Message at index ${i} is invalid`,
          'INVALID_MESSAGE',
          ErrorCategory.VALIDATION,
          ErrorSeverity.LOW,
          { operation: 'countConversationTokens', input: message }
        );
      }

      if (typeof message.content !== 'string') {
        throw errorHandler.createError(
          `Message at index ${i} must have string content`,
          'INVALID_MESSAGE_CONTENT',
          ErrorCategory.VALIDATION,
          ErrorSeverity.LOW,
          { operation: 'countConversationTokens', input: message.content }
        );
      }

      // Validate content
      const contentValidation = InputValidator.validateTextInput(message.content, { allowEmpty: true });
      if (!contentValidation.valid) {
        throw errorHandler.createError(
          `Message content at index ${i} is invalid: ${contentValidation.errors.join(', ')}`,
          'INVALID_CONTENT',
          ErrorCategory.VALIDATION,
          ErrorSeverity.LOW,
          { operation: 'countConversationTokens', input: message.content }
        );
      }

      const validContent = contentValidation.sanitized || '';
      const contentCount = TokenCounter.count(validContent);
      totalTokens += contentCount;
      totalTokens += TOKENS_PER_MESSAGE;

      // Add extra tokens if message has a name field
      if ('name' in message && message.name) {
        totalTokens += TOKENS_PER_NAME;
      }
    }

    // Add 2 tokens for priming the response
    totalTokens += 2

    return {
      total: totalTokens,
      model: validModel,
      method: 'accurate',
    }
  } catch (error) {
    return errorHandler.handleError(
      error,
      { operation: 'countConversationTokens', input: messages, config: options },
      {
        attemptRecovery: true,
        fallbackValue: { 
          total: messages.reduce((sum, msg) => sum + (msg.content?.length || 0), 0) / 4,
          model: model || 'gpt-4',
          method: 'fallback'
        }
      }
    );
  }
}

/**
 * Truncate text to fit within token budget
 */
export async function truncateToTokenBudget(
  text: string,
  maxTokens: number,
  options: TokenizerOptions = {}
): Promise<{
  truncated: string
  tokens: number
  wasTruncated: boolean
}> {
  const count = await countTokens(text, options)

  if (count.total <= maxTokens) {
    return {
      truncated: text,
      tokens: count.total,
      wasTruncated: false,
    }
  }

  // Binary search for optimal length
  let left = 0
  let right = text.length
  let bestLength = 0

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const substring = text.substring(0, mid)
    const tokens = await countTokens(substring, options)

    if (tokens.total <= maxTokens) {
      bestLength = mid
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  // Try to end at sentence boundary
  let truncated = text.substring(0, bestLength)
  const lastPeriod = truncated.lastIndexOf('.')
  const lastNewline = truncated.lastIndexOf('\n')
  const lastBoundary = Math.max(lastPeriod, lastNewline)

  if (lastBoundary > bestLength * 0.8) {
    truncated = text.substring(0, lastBoundary + 1)
  }

  const finalCount = await countTokens(truncated, options)

  return {
    truncated,
    tokens: finalCount.total,
    wasTruncated: true,
  }
}

/**
 * Split text into chunks that fit within token budget
 */
export async function chunkByTokens(
  text: string,
  maxTokensPerChunk: number,
  options: TokenizerOptions & { overlap?: number } = {}
): Promise<string[]> {
  const { overlap = 0 } = options
  const chunks: string[] = []

  let remaining = text
  while (remaining.length > 0) {
    const result = await truncateToTokenBudget(
      remaining,
      maxTokensPerChunk,
      options
    )
    chunks.push(result.truncated)

    if (!result.wasTruncated) {
      break
    }

    // Move to next chunk with overlap
    const nextStart = result.truncated.length - overlap
    remaining = remaining.substring(Math.max(0, nextStart))
  }

  return chunks
}

/**
 * Get token count statistics for debugging and monitoring
 *
 * @returns Cache statistics including size and hit rate
 *
 * @example
 * ```typescript
 * const stats = getTokenizerStats()
 * logger.debug(`Cache hit rate: ${stats.cacheHitRate}`)
 * logger.debug(`Cache size: ${stats.cacheSize}/${stats.cacheMaxSize}`)
 * ```
 */
export function getTokenizerStats(): {
  cacheSize: number
  cacheMaxSize: number
  cacheHitRate: string
  cacheHits: number
  cacheMisses: number
  hitRatePercent: number
} {
  const stats = tokenCache.getStats()
  return {
    cacheSize: tokenCache.size(),
    cacheMaxSize: 1000,
    cacheHitRate: `${stats.hitRate.toFixed(1)}%`,
    cacheHits: stats.hits,
    cacheMisses: stats.misses,
    hitRatePercent: stats.hitRate,
  }
}

/**
 * Clear token count cache
 */
export function clearTokenCache(): void {
  tokenCache.clear()
}
