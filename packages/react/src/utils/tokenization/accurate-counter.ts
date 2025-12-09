/**
 * Accurate Token Counting
 *
 * Provides accurate token counting for various LLM models.
 * Uses js-tiktoken when available, falls back to estimation.
 */

export type ModelName =
  // OpenAI GPT-4 Family
  | 'gpt-4'
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
 * Token counter cache for performance with hit/miss tracking
 */
class TokenCountCache {
  private cache = new Map<string, number>()
  private maxSize = 1000
  private hits = 0
  private misses = 0

  get(key: string): number | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      this.hits++
    }
    return value
  }

  /**
   * Record a cache miss (called when value not found and computed)
   */
  recordMiss(): void {
    this.misses++
  }

  set(key: string, count: number): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest entry (first item)
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
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
 * Count tokens accurately (uses tiktoken if available)
 *
 * @example
 * ```ts
 * const count = await countTokens("Hello, world!", { model: 'gpt-4' })
 * console.log(count.total) // 4
 * console.log(count.method) // 'accurate' or 'estimated'
 * ```
 */
export async function countTokens(
  text: string,
  options: TokenizerOptions = {}
): Promise<TokenCount> {
  const { model = 'gpt-4', cache = true, preferAccurate = true } = options

  // Check cache
  if (cache) {
    const cacheKey = `${model}:${text}`
    const cached = tokenCache.get(cacheKey)
    if (cached !== undefined) {
      return {
        total: cached,
        model,
        method: 'accurate',
      }
    }
    // Record cache miss for statistics
    tokenCache.recordMiss()
  }

  const config = MODEL_CONFIGS[model]
  if (!config) {
    throw new Error(`Unknown model: ${model}`)
  }

  let count: number
  let method: 'accurate' | 'estimated' = 'estimated'

  // Try accurate tokenization first if preferred
  if (preferAccurate) {
    try {
      count = await countTokensAccurate(text, config.encoding)
      method = 'accurate'
    } catch {
      // Fall back to estimation
      count = estimateTokenCount(text, config.charsPerToken)
    }
  } else {
    count = estimateTokenCount(text, config.charsPerToken)
  }

  // Cache result
  if (cache) {
    const cacheKey = `${model}:${text}`
    tokenCache.set(cacheKey, count)
  }

  return {
    total: count,
    model,
    method,
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
 */
export async function countConversationTokens(
  messages: Array<{ role: string; content: string }>,
  options: TokenizerOptions = {}
): Promise<TokenCount> {
  const { model = 'gpt-4' } = options

  // Add overhead for message formatting
  // OpenAI format adds ~4 tokens per message
  const TOKENS_PER_MESSAGE = 4
  const TOKENS_PER_NAME = 1

  let totalTokens = 0

  for (const message of messages) {
    const contentCount = await countTokens(message.content, options)
    totalTokens += contentCount.total
    totalTokens += TOKENS_PER_MESSAGE

    // Add extra tokens if message has a name field
    if ('name' in message) {
      totalTokens += TOKENS_PER_NAME
    }
  }

  // Add 2 tokens for priming the response
  totalTokens += 2

  return {
    total: totalTokens,
    model,
    method: 'accurate',
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
 * console.log(`Cache hit rate: ${stats.cacheHitRate}`)
 * console.log(`Cache size: ${stats.cacheSize}/${stats.cacheMaxSize}`)
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
