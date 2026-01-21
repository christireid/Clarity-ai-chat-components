'use client'

import * as React from 'react'
import {
  AccurateTokenCounter,
  ExactCache,
  LLMLinguaCompressor,
  ExtractiveCompressor,
  AdaptiveCompressor,
} from '@clarity-chat/token-optimization'
import type {
  ChatMessage,
  LLMLinguaOptions,
  ExtractiveOptions,
  AdaptiveOptions,
} from '@clarity-chat/token-optimization'

/**
 * Configuration options for useTokenOptimization
 */
export interface UseTokenOptimizationOptions {
  /** Model identifier for token counting (default: 'gpt-4o') */
  model?: string
  /** Enable compression features (default: true) */
  enableCompression?: boolean
  /** Enable response caching (default: true) */
  enableCaching?: boolean
  /** Maximum tokens for the model context (default: 128000 for gpt-4o) */
  maxTokens?: number
  /** Cache TTL in milliseconds (default: 1 hour) */
  cacheTtlMs?: number
  /** Maximum cache entries (default: 1000) */
  maxCacheEntries?: number
}

/**
 * Compression options for compress operations
 */
export interface CompressionOptions {
  /** Target compression ratio (0.1-1.0), lower = more aggressive */
  targetRatio?: number
  /** Minimum quality threshold (0-1) */
  minQuality?: number
  /** Compression strategy */
  strategy?: 'llmlingua' | 'extractive' | 'adaptive'
  /** LLMLingua-specific options */
  llmlinguaOptions?: Partial<LLMLinguaOptions>
  /** Extractive-specific options */
  extractiveOptions?: Partial<ExtractiveOptions>
  /** Adaptive-specific options */
  adaptiveOptions?: Partial<AdaptiveOptions>
}

/**
 * Result of a compression operation
 */
export interface CompressionResult {
  /** Original text */
  original: string
  /** Compressed text */
  compressed: string
  /** Compression ratio (compressed/original) */
  compressionRatio: number
  /** Original token count */
  originalTokens: number
  /** Compressed token count */
  compressedTokens: number
  /** Tokens saved */
  tokensSaved: number
  /** Strategy used */
  strategyUsed: string
  /** Quality score (0-1) */
  quality: number
}

/**
 * Cached response entry
 */
export interface CachedResponse {
  /** Cached data */
  data: string
  /** When it was cached */
  cachedAt: Date
  /** Age in milliseconds */
  age: number
}

/**
 * Model information
 */
export interface ModelInfo {
  /** Model identifier */
  model: string
  /** Maximum context tokens */
  maxTokens: number
  /** Pricing per 1M input tokens (USD) */
  inputPricePerMillion: number
  /** Pricing per 1M output tokens (USD) */
  outputPricePerMillion: number
}

/**
 * Result returned by useTokenOptimization
 */
export interface TokenOptimizationResult {
  // Token counting
  /** Count tokens in a text string */
  countTokens: (text: string) => number
  /** Count tokens in chat messages */
  countChatTokens: (messages: ChatMessage[]) => number
  /** Check if content is within a token limit */
  isWithinLimit: (content: string | ChatMessage[], limit: number) => boolean

  // Compression
  /** Compress text using the configured strategy */
  compress: (
    text: string,
    options?: CompressionOptions
  ) => Promise<CompressionResult>
  /** Compress chat messages */
  compressMessages: (
    messages: ChatMessage[],
    options?: CompressionOptions
  ) => Promise<{
    messages: ChatMessage[]
    compressionRatio: number
    tokensSaved: number
  }>

  // Caching
  /** Get a cached response */
  getCached: (key: string) => Promise<CachedResponse | null>
  /** Set a cached response */
  setCached: (key: string, value: string, ttlMs?: number) => Promise<void>
  /** Clear cache by key */
  clearCached: (key: string) => Promise<void>
  /** Clear all cache entries */
  clearAllCache: () => Promise<void>

  // Cost estimation
  /** Estimate cost for a given number of tokens */
  estimateCost: (
    inputTokens: number,
    outputTokens?: number
  ) => {
    inputCost: number
    outputCost: number
    totalCost: number
  }

  // Model info
  /** Current model information */
  modelInfo: ModelInfo

  // Status
  /** Whether the optimizer is ready */
  isReady: boolean
  /** Whether compression is available */
  compressionEnabled: boolean
  /** Whether caching is available */
  cachingEnabled: boolean
}

/**
 * Model pricing information (per 1M tokens, USD)
 */
const MODEL_PRICING: Record<
  string,
  { input: number; output: number; maxTokens: number }
> = {
  'gpt-4o': { input: 2.5, output: 10.0, maxTokens: 128000 },
  'gpt-4o-mini': { input: 0.15, output: 0.6, maxTokens: 128000 },
  'gpt-4-turbo': { input: 10.0, output: 30.0, maxTokens: 128000 },
  'gpt-4': { input: 30.0, output: 60.0, maxTokens: 8192 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5, maxTokens: 16385 },
  o1: { input: 15.0, output: 60.0, maxTokens: 200000 },
  'o1-mini': { input: 3.0, output: 12.0, maxTokens: 128000 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0, maxTokens: 200000 },
  'claude-3-5-haiku-20241022': { input: 0.8, output: 4.0, maxTokens: 200000 },
  'claude-3-opus': { input: 15.0, output: 75.0, maxTokens: 200000 },
}

/**
 * useTokenOptimization - Unified hook for all token optimization features
 *
 * Provides a comprehensive API for token counting, compression, caching, and cost estimation.
 * Integrates with @clarity-chat/token-optimization for high-performance operations.
 *
 * **Features:**
 * - **Token Counting**: Accurate token counting using AccurateTokenCounter
 * - **Compression**: LLMLingua, Extractive, and Adaptive compression strategies
 * - **Caching**: High-performance exact-match caching with ExactCache
 * - **Cost Estimation**: Real-time cost estimates based on model pricing
 *
 * @example
 * ```tsx
 * function OptimizedChat() {
 *   const {
 *     countTokens,
 *     compress,
 *     getCached,
 *     setCached,
 *     estimateCost,
 *     modelInfo,
 *     isReady,
 *   } = useTokenOptimization({
 *     model: 'gpt-4o',
 *     enableCompression: true,
 *     enableCaching: true,
 *   })
 *
 *   const handleSend = async (message: string) => {
 *     // Check token count
 *     const tokens = countTokens(message)
 *     console.log(`Message has ${tokens} tokens`)
 *
 *     // Check cache first
 *     const cached = await getCached(message)
 *     if (cached) {
 *       return cached.data
 *     }
 *
 *     // Compress if too long
 *     if (tokens > 4000) {
 *       const result = await compress(message, { targetRatio: 0.5 })
 *       message = result.compressed
 *       console.log(`Compressed from ${result.originalTokens} to ${result.compressedTokens} tokens`)
 *     }
 *
 *     // Estimate cost
 *     const cost = estimateCost(tokens, 500)
 *     console.log(`Estimated cost: $${cost.totalCost.toFixed(6)}`)
 *
 *     // Send to API and cache result
 *     const response = await sendToAPI(message)
 *     await setCached(message, response)
 *     return response
 *   }
 *
 *   return (
 *     <div>
 *       <p>Model: {modelInfo.model} ({modelInfo.maxTokens} max tokens)</p>
 *       <p>Status: {isReady ? 'Ready' : 'Loading...'}</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns Token optimization utilities
 */
export function useTokenOptimization(
  options: UseTokenOptimizationOptions = {}
): TokenOptimizationResult {
  const {
    model = 'gpt-4o',
    enableCompression = true,
    enableCaching = true,
    maxTokens,
    cacheTtlMs = 3600000, // 1 hour
    maxCacheEntries = 1000,
  } = options

  // Refs for lazy-initialized instances
  const counterRef = React.useRef<AccurateTokenCounter | null>(null)
  const cacheRef = React.useRef<ExactCache<{
    data: string
    cachedAt: number
  }> | null>(null)
  const llmlinguaRef = React.useRef<LLMLinguaCompressor | null>(null)
  const extractiveRef = React.useRef<ExtractiveCompressor | null>(null)
  const adaptiveRef = React.useRef<AdaptiveCompressor | null>(null)

  // State
  const [isReady, setIsReady] = React.useState(false)

  // Get model info
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o']
  const modelInfo: ModelInfo = React.useMemo(
    () => ({
      model,
      maxTokens: maxTokens || pricing.maxTokens,
      inputPricePerMillion: pricing.input,
      outputPricePerMillion: pricing.output,
    }),
    [model, maxTokens, pricing]
  )

  // Initialize on mount
  React.useEffect(() => {
    // Initialize token counter
    counterRef.current = new AccurateTokenCounter({
      model,
      enableCaching: true,
      cacheSize: 500,
    })

    // Initialize cache if enabled
    if (enableCaching) {
      cacheRef.current = new ExactCache<{ data: string; cachedAt: number }>({
        maxSize: maxCacheEntries,
        ttl: cacheTtlMs,
      })
    }

    setIsReady(true)

    // Cleanup
    return () => {
      if (counterRef.current) {
        counterRef.current.destroy()
        counterRef.current = null
      }
      if (cacheRef.current) {
        cacheRef.current.clear()
        cacheRef.current = null
      }
    }
  }, [model, enableCaching, cacheTtlMs, maxCacheEntries])

  /**
   * Count tokens in text
   */
  const countTokens = React.useCallback((text: string): number => {
    if (!text) return 0
    if (counterRef.current) {
      return counterRef.current.count(text)
    }
    // Fallback estimation
    return Math.ceil(text.length / 4)
  }, [])

  /**
   * Count tokens in chat messages
   */
  const countChatTokens = React.useCallback(
    (messages: ChatMessage[]): number => {
      if (!messages || messages.length === 0) return 0
      if (counterRef.current) {
        return counterRef.current.countChat(messages)
      }
      // Fallback estimation
      return messages.reduce(
        (sum, msg) => sum + Math.ceil(msg.content.length / 4) + 4,
        3
      )
    },
    []
  )

  /**
   * Check if content is within token limit
   */
  const isWithinLimit = React.useCallback(
    (content: string | ChatMessage[], limit: number): boolean => {
      if (Array.isArray(content)) {
        return countChatTokens(content) <= limit
      }
      if (counterRef.current) {
        return counterRef.current.isWithinLimit(content, limit)
      }
      return Math.ceil(content.length / 4) <= limit
    },
    [countChatTokens]
  )

  /**
   * Get or create compressor
   */
  const getCompressor = React.useCallback(
    (strategy: 'llmlingua' | 'extractive' | 'adaptive') => {
      switch (strategy) {
        case 'llmlingua':
          if (!llmlinguaRef.current) {
            llmlinguaRef.current = new LLMLinguaCompressor()
          }
          return llmlinguaRef.current
        case 'extractive':
          if (!extractiveRef.current) {
            extractiveRef.current = new ExtractiveCompressor()
          }
          return extractiveRef.current
        case 'adaptive':
        default:
          if (!adaptiveRef.current) {
            adaptiveRef.current = new AdaptiveCompressor()
          }
          return adaptiveRef.current
      }
    },
    []
  )

  /**
   * Compress text
   */
  const compress = React.useCallback(
    async (
      text: string,
      compressOptions?: CompressionOptions
    ): Promise<CompressionResult> => {
      if (!enableCompression || !text.trim()) {
        const tokens = countTokens(text)
        return {
          original: text,
          compressed: text,
          compressionRatio: 1,
          originalTokens: tokens,
          compressedTokens: tokens,
          tokensSaved: 0,
          strategyUsed: 'none',
          quality: 1,
        }
      }

      const strategy = compressOptions?.strategy || 'adaptive'
      const targetRatio = compressOptions?.targetRatio || 0.5
      const originalTokens = countTokens(text)

      let compressed: string
      let compressionRatio: number
      let quality: number
      let strategyUsed: string

      switch (strategy) {
        case 'llmlingua': {
          const compressor = getCompressor('llmlingua') as LLMLinguaCompressor
          const result = await compressor.compress(
            text,
            targetRatio,
            compressOptions?.llmlinguaOptions
          )
          compressed = result.compressed
          compressionRatio = result.compressionRatio
          quality = result.quality.overallQuality
          strategyUsed = 'llmlingua'
          break
        }
        case 'extractive': {
          const compressor = getCompressor('extractive') as ExtractiveCompressor
          const result = compressor.compress(
            text,
            targetRatio,
            compressOptions?.extractiveOptions
          )
          compressed = result.compressed
          compressionRatio = result.compressionRatio
          quality = result.quality.overallQuality
          strategyUsed = 'extractive'
          break
        }
        case 'adaptive':
        default: {
          const compressor = getCompressor('adaptive') as AdaptiveCompressor
          const result = await compressor.compress(text, {
            targetRatio,
            minQuality: compressOptions?.minQuality,
            ...compressOptions?.adaptiveOptions,
          })
          compressed = result.compressed
          compressionRatio = result.compressionRatio
          quality = result.quality.overallQuality
          strategyUsed = result.strategyUsed
          break
        }
      }

      const compressedTokens = countTokens(compressed)

      return {
        original: text,
        compressed,
        compressionRatio,
        originalTokens,
        compressedTokens,
        tokensSaved: originalTokens - compressedTokens,
        strategyUsed,
        quality,
      }
    },
    [enableCompression, countTokens, getCompressor]
  )

  /**
   * Compress multiple chat messages
   */
  const compressMessages = React.useCallback(
    async (
      messages: ChatMessage[],
      compressOptions?: CompressionOptions
    ): Promise<{
      messages: ChatMessage[]
      compressionRatio: number
      tokensSaved: number
    }> => {
      if (!enableCompression || messages.length === 0) {
        return {
          messages,
          compressionRatio: 1,
          tokensSaved: 0,
        }
      }

      let totalOriginalTokens = 0
      let totalCompressedTokens = 0
      const compressedMessages: ChatMessage[] = []

      for (const message of messages) {
        // Don't compress system messages or very short messages
        if (message.role === 'system' || message.content.length < 100) {
          compressedMessages.push(message)
          const tokens = countTokens(message.content)
          totalOriginalTokens += tokens
          totalCompressedTokens += tokens
          continue
        }

        const result = await compress(message.content, compressOptions)
        totalOriginalTokens += result.originalTokens
        totalCompressedTokens += result.compressedTokens

        compressedMessages.push({
          ...message,
          content: result.compressed,
        })
      }

      return {
        messages: compressedMessages,
        compressionRatio:
          totalOriginalTokens > 0
            ? totalCompressedTokens / totalOriginalTokens
            : 1,
        tokensSaved: totalOriginalTokens - totalCompressedTokens,
      }
    },
    [enableCompression, countTokens, compress]
  )

  /**
   * Get cached response
   */
  const getCached = React.useCallback(
    async (key: string): Promise<CachedResponse | null> => {
      if (!enableCaching || !cacheRef.current) return null

      const result = cacheRef.current.get(key)
      if (result.hit && result.value) {
        return {
          data: result.value.data,
          cachedAt: new Date(result.value.cachedAt),
          age: result.age || 0,
        }
      }
      return null
    },
    [enableCaching]
  )

  /**
   * Set cached response
   */
  const setCached = React.useCallback(
    async (key: string, value: string, _ttlMs?: number): Promise<void> => {
      if (!enableCaching || !cacheRef.current) return

      cacheRef.current.set(key, {
        data: value,
        cachedAt: Date.now(),
      })
    },
    [enableCaching]
  )

  /**
   * Clear cached response by key
   */
  const clearCached = React.useCallback(
    async (key: string): Promise<void> => {
      if (!enableCaching || !cacheRef.current) return
      cacheRef.current.delete(key)
    },
    [enableCaching]
  )

  /**
   * Clear all cache entries
   */
  const clearAllCache = React.useCallback(async (): Promise<void> => {
    if (!enableCaching || !cacheRef.current) return
    cacheRef.current.clear()
  }, [enableCaching])

  /**
   * Estimate cost for tokens
   */
  const estimateCost = React.useCallback(
    (
      inputTokens: number,
      outputTokens: number = 0
    ): { inputCost: number; outputCost: number; totalCost: number } => {
      const inputCost =
        (inputTokens / 1_000_000) * modelInfo.inputPricePerMillion
      const outputCost =
        (outputTokens / 1_000_000) * modelInfo.outputPricePerMillion
      return {
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
      }
    },
    [modelInfo]
  )

  return {
    // Token counting
    countTokens,
    countChatTokens,
    isWithinLimit,

    // Compression
    compress,
    compressMessages,

    // Caching
    getCached,
    setCached,
    clearCached,
    clearAllCache,

    // Cost estimation
    estimateCost,

    // Model info
    modelInfo,

    // Status
    isReady,
    compressionEnabled: enableCompression,
    cachingEnabled: enableCaching,
  }
}
