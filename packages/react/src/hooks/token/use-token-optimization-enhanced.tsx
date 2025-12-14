/**
 * Enhanced Token Optimization Hook (Unified)
 *
 * Comprehensive token optimization with all features:
 * - TOON support (30-60% savings on structured data)
 * - Accurate tokenization (tiktoken)
 * - Prompt caching (50-90% savings)
 * - Advanced semantic caching
 * - Real-time cost tracking
 * - History limiting and throttling
 * - Model routing
 * - Reference system for large data
 * - Output limits and batching
 * - Response prefilling
 * - Context ordering
 *
 * This is the unified hook that combines all features from
 * useTokenOptimization (basic) and useTokenOptimizationEnhanced.
 *
 * @since 2.0.0
 */

'use client'

import * as React from 'react'
import type { CoreMessage } from './use-chat-enhanced'

// Import new utilities
import {
  jsonToToon,
  autoOptimize,
  formatForLLM,
  parseFlexible,
  type ToonOptimizationResult,
} from '../../utils/toon'
import {
  countTokens,
  countConversationTokens,
  type TokenCount,
  type ModelName,
} from '../../utils/tokenization'
import {
  calculateCost,
  type CostCalculation,
} from '../../utils/tokenization/model-pricing'
import {
  PromptCacheManager,
  createAnthropicCachedMessages,
  type CacheStats,
} from '../../utils/prompt-caching'

// Import existing utilities
import { type CompressionResult } from '../../utils/memory/prompt-compression'
import {
  intelligentCompress,
  type LLMLinguaConfig,
} from '../../utils/optimization/llmlingua-compressor'
import { SmartCache } from '../../utils/optimization/smart-cache'

// Import persistent cache utilities
import {
  createPersistentSemanticCache,
  type SemanticCacheConfig,
} from '../../utils/optimization/semantic-cache-persistent'
import {
  MODEL_REGISTRY,
  type ModelId,
} from '../../utils/tokenization/model-registry'

// Import utilities from token-optimization for unified API
import {
  limitHistory,
  createThrottler,
  routeToModel,
  estimateRoutingSavings,
  createReference,
  enforceOutputLimit,
  createBatcher,
  type HistoryLimitingOptions,
  type ThrottlingOptions,
  type ModelRoutingOptions,
  type ReferenceOptions,
  type OutputLimitOptions,
  type BatchingOptions,
} from '../../utils/optimization/token-optimization'

// Import new optimization utilities
import {
  PREFILL_TEMPLATES,
  type PrefillConfig,
  type PrefillTemplate,
} from '../../utils/optimization/response-prefilling'
import {
  restructurePrompt as restructurePromptUtil,
  type PromptStructureOptions,
} from '../../utils/optimization/prompt-structure'

export interface EnhancedTokenOptimizationOptions {
  /** Model to use */
  model?: ModelName

  // ============ TOON Optimization ============
  /** Enable TOON format optimization */
  enableToon?: boolean
  /** Minimum TOON savings threshold */
  toonMinSavings?: number

  // ============ Tokenization ============
  /** Enable accurate tokenization (requires js-tiktoken) */
  enableAccurateTokenization?: boolean

  // ============ Prompt Caching ============
  /** Enable prompt caching */
  enablePromptCaching?: boolean
  /** Prompt caching provider */
  cachingProvider?: 'anthropic' | 'openai' | 'auto'

  // ============ Semantic Caching ============
  /** Enable semantic caching */
  enableSemanticCaching?: boolean
  /** Similarity threshold for semantic caching */
  similarityThreshold?: number
  /** Persist semantic cache across sessions (default: false) */
  persistCache?: boolean

  // ============ Compression ============
  /** Enable prompt compression */
  enablePromptCompression?: boolean
  /** Compression aggressiveness */
  compressionLevel?: 'conservative' | 'balanced' | 'aggressive'
  /** Advanced compression config (LLMLingua) */
  compressionConfig?: LLMLinguaConfig

  // ============ Cost Tracking ============
  /** Enable real-time cost tracking */
  enableCostTracking?: boolean
  /** Token budget (in USD) */
  budget?: number
  /** Callback when budget is exceeded */
  onBudgetExceeded?: (cost: number, budget: number) => void

  /** Enable statistics collection */
  enableStats?: boolean

  // ============ History & Throttling (from basic hook) ============
  /** Enable history limiting */
  enableHistoryLimiting?: boolean
  /** History limiting options */
  historyLimiting?: HistoryLimitingOptions
  /** Custom summarization function for 'summarize' strategy */
  summarizeMessage?: (message: CoreMessage) => Promise<CoreMessage>
  /** Custom embedding function for 'smart' strategy */
  calculateEmbedding?: (text: string) => Promise<number[]>

  /** Enable PII redaction */
  enablePIIRedaction?: boolean
  /** Enable dynamic context sizing based on model */
  enableDynamicContext?: boolean

  /** Enable request throttling */
  enableThrottling?: boolean
  /** Throttling options */
  throttling?: ThrottlingOptions

  // ============ Model Routing (from basic hook) ============
  /** Enable model routing based on query complexity */
  enableModelRouting?: boolean
  /** Model routing options */
  modelRouting?: ModelRoutingOptions

  // ============ References (from basic hook) ============
  /** Enable reference system for large data */
  enableReferences?: boolean
  /** Reference options */
  references?: ReferenceOptions

  // ============ Output Limits (from basic hook) ============
  /** Enable output limits */
  enableOutputLimits?: boolean
  /** Output limit options */
  outputLimits?: OutputLimitOptions

  // ============ Batching (from basic hook) ============
  /** Enable request batching */
  enableBatching?: boolean
  /** Batching options */
  batching?: BatchingOptions

  // ============ Response Prefilling (NEW) ============
  /** Enable response prefilling to skip LLM preambles */
  enablePrefilling?: boolean
  /** Prefill configuration */
  prefillConfig?: PrefillConfig

  // ============ Prompt Structure (NEW) ============
  /** Enable question-at-end prompt restructuring */
  enablePromptStructure?: boolean
  /** Prompt structure configuration */
  promptStructureOptions?: PromptStructureOptions

  // ============ Presets ============
  /**
   * Configuration preset for quick setup
   * - 'aggressive': All optimizations, max savings
   * - 'balanced': Key optimizations, good UX
   * - 'conservative': Safe optimizations only
   * - 'realtime': Optimized for low latency
   */
  preset?: 'aggressive' | 'balanced' | 'conservative' | 'realtime'
}

export interface EnhancedOptimizationStats {
  /** TOON optimization */
  toon: {
    conversions: number
    totalTokensSaved: number
    averageSavingsPercent: number
  }

  /** Prompt compression */
  compression: {
    compressions: number
    totalTokensSaved: number
    averageSavingsPercent: number
  }

  /** Prompt caching */
  cache: CacheStats

  /** Semantic caching */
  semanticCache: {
    hits: number
    misses: number
    hitRate: number
    tokensSaved: number
  }

  /** Accurate tokenization */
  tokenization: {
    accurateCount: number
    estimatedCount: number
    accuracyRate: number
  }

  /** Cost tracking */
  costs: {
    totalCost: number
    inputCost: number
    outputCost: number
    cachedCost: number
    savingsFromOptimization: number
  }

  /** History limiting stats (from basic hook) */
  historyLimiting: {
    messagesRemoved: number
    tokensSaved: number
  }

  /** Throttling stats (from basic hook) */
  throttling: {
    requestsThrottled: number
  }

  /** Model routing stats (from basic hook) */
  modelRouting: {
    simpleModelRoutes: number
    complexModelRoutes: number
    routingCostSaved: number
  }

  /** Prefilling stats (NEW) */
  prefilling: {
    prefilledResponses: number
    preambleTokensSaved: number
  }

  /** PII redaction stats */
  piiRedaction: {
    emailsRedacted: number
    phonesRedacted: number
    totalTokensSaved: number
  }

  /** Prompt structure stats (NEW) */
  promptStructure: {
    restructuredPrompts: number
    questionsMovedToEnd: number
  }

  /** Overall */
  overall: {
    totalTokensSaved: number
    totalCostSaved: number
    averageSavingsPercent: number
  }
}

export interface EnhancedOptimizationResult {
  /** Optimized content */
  content: string
  /** Format used */
  format: 'json' | 'toon' | 'text'
  /** Token count */
  tokens: TokenCount
  /** Cost calculation */
  cost?: CostCalculation
  /** Optimization breakdown */
  optimizations: {
    toon?: ToonOptimizationResult
    compression?: CompressionResult
    cached?: boolean
  }
}

/**
 * Get configuration from preset
 */
function getPresetConfig(
  preset?: EnhancedTokenOptimizationOptions['preset']
): Partial<EnhancedTokenOptimizationOptions> {
  switch (preset) {
    case 'aggressive':
      return {
        enableToon: true,
        enablePromptCaching: true,
        enableSemanticCaching: true,
        enablePromptCompression: true,
        compressionLevel: 'aggressive',
        enableHistoryLimiting: true,
        enableModelRouting: true,
        enablePrefilling: true,
        enablePromptStructure: true,
      }
    case 'balanced':
      return {
        enableToon: true,
        enablePromptCaching: true,
        enablePromptCompression: true,
        compressionLevel: 'balanced',
        enableHistoryLimiting: true,
        enablePrefilling: true,
      }
    case 'conservative':
      return {
        enableToon: true,
        enablePromptCompression: true,
        compressionLevel: 'conservative',
      }
    case 'realtime':
      return {
        enableToon: true,
        enableSemanticCaching: true,
        enablePromptCompression: true,
        compressionLevel: 'conservative',
        // Skip caching for lowest latency
        enablePromptCaching: false,
      }
    default:
      return {}
  }
}

/**
 * Enhanced Token Optimization Hook (Unified)
 *
 * @example
 * ```tsx
 * // Using a preset for quick setup
 * const optimizer = useTokenOptimizationEnhanced({ preset: 'balanced' })
 *
 * // Or customize individual options
 * const {
 *   optimizeData,
 *   optimizePrompt,
 *   prepareMessages,
 *   optimizeHistory,
 *   routeQuery,
 *   getPrefill,
 *   stats,
 *   resetStats
 * } = useTokenOptimizationEnhanced({
 *   model: 'claude-3-5-sonnet',
 *   enableToon: true,
 *   enablePromptCaching: true,
 *   enableSemanticCaching: true,
 *   enableHistoryLimiting: true,
 *   enableModelRouting: true,
 *   enablePrefilling: true
 * })
 *
 * // Optimize structured data (uses TOON if beneficial)
 * const optimized = await optimizeData(myData)
 * console.log(`Saved ${optimized.optimizations.toon?.savingsPercent}%`)
 *
 * // Prepare messages with cache control
 * const messages = prepareMessages(conversationMessages)
 *
 * // Route to appropriate model
 * const model = routeQuery(userQuery)
 *
 * // Get prefill for JSON response
 * const prefill = getPrefill('json') // returns '{'
 *
 * // Track total savings
 * console.log(`Total saved: $${stats.overall.totalCostSaved.toFixed(4)}`)
 * ```
 */
export function useTokenOptimizationEnhanced(
  options: EnhancedTokenOptimizationOptions = {}
): {
  /** Optimize structured data (auto TOON/JSON) */
  optimizeData: (data: any) => Promise<EnhancedOptimizationResult>

  /** Optimize text prompt */
  optimizePrompt: (prompt: string) => Promise<EnhancedOptimizationResult>

  /** Optimize history (limit conversation messages) */
  optimizeHistory: (messages: CoreMessage[]) => Promise<CoreMessage[]>

  /** Prepare messages with caching */
  prepareMessages: (messages: CoreMessage[]) => Array<{
    role: string
    content: string
    cache_control?: { type: 'ephemeral' }
  }>

  /** Parse response (handles TOON/JSON) */
  parseResponse: (response: string) => any

  /** Count tokens accurately */
  countTokens: (text: string) => Promise<TokenCount>

  /** Calculate cost */
  calculateCost: (params: {
    inputTokens: number
    outputTokens: number
  }) => CostCalculation

  // ========== From basic hook ==========
  /** Limit conversation history */
  limitHistory: (messages: CoreMessage[]) => Promise<CoreMessage[]>

  /** Check if request can be made (throttling) */
  canMakeRequest: () => boolean

  /** Record a request (for throttling) */
  recordRequest: () => void

  /** Route query to appropriate model */
  routeQuery: (query: string) => string

  /** Create reference for large data */
  createDataReference: (
    data: string | object
  ) =>
    | { type: 'reference'; id: string; originalSize: number }
    | { type: 'data'; data: string | object }

  /** Enforce output limits */
  limitOutput: (output: string) => string

  /** Add request to batch */
  batchRequest: <T>(request: () => Promise<T>) => Promise<T>

  // ========== New optimizations ==========
  /** Get prefill string for response format */
  getPrefill: (format: 'json' | 'xml' | 'code' | 'markdown') => string

  /** Restructure prompt for optimal attention (question at end) */
  restructurePrompt: (
    prompt: string,
    context?: string
  ) => {
    restructured: string
    wasRestructured: boolean
    questionPosition?: 'start' | 'middle' | 'end'
  }

  /** Redact PII from text */
  redactPII: (text: string) => string

  /** Get statistics */
  stats: EnhancedOptimizationStats

  /** Reset statistics */
  resetStats: () => void

  /** Whether the budget has been exceeded */
  isBudgetExceeded: boolean
} {
  // Apply presets
  const presetConfig = getPresetConfig(options.preset)

  const {
    model = 'gpt-4',
    enableToon = presetConfig.enableToon ?? true,
    toonMinSavings = 20,
    enableAccurateTokenization = true,
    enablePromptCaching = presetConfig.enablePromptCaching ?? false,
    cachingProvider = 'auto',
    enableSemanticCaching = presetConfig.enableSemanticCaching ?? false,
    similarityThreshold = 0.85,
    persistCache = false,
    enablePromptCompression = presetConfig.enablePromptCompression ?? true,
    compressionLevel = presetConfig.compressionLevel ?? 'balanced',
    compressionConfig = {},
    enableCostTracking = true,
    budget,
    onBudgetExceeded,
    enableStats = true,
    // From basic hook
    enableHistoryLimiting = presetConfig.enableHistoryLimiting ?? false,
    historyLimiting = {},
    summarizeMessage,
    calculateEmbedding,
    enablePIIRedaction = false,
    enableDynamicContext = false,
    enableThrottling = false,
    throttling = {},
    enableModelRouting = presetConfig.enableModelRouting ?? false,
    modelRouting = {},
    enableReferences = false,
    references = {},
    enableOutputLimits = false,
    outputLimits = {},
    enableBatching = false,
    batching = {},
    // New optimizations
    enablePrefilling = presetConfig.enablePrefilling ?? false,
    prefillConfig = {},
    enablePromptStructure = presetConfig.enablePromptStructure ?? false,
    promptStructureOptions = {},
  } = options

  // Initialize managers
  const promptCacheManager = React.useMemo(
    () =>
      new PromptCacheManager({
        provider: cachingProvider,
        model,
        trackStats: enableStats,
      }),
    [cachingProvider, model, enableStats]
  )

  const semanticCache = React.useMemo(() => {
    if (!enableSemanticCaching) return null

    if (persistCache && calculateEmbedding) {
      // Use persistent cache with IndexedDB
      return createPersistentSemanticCache({
        embedFunction: calculateEmbedding,
        similarityThreshold,
        maxEntries: 1000,
        ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 days default for persistence
      })
    }

    // Use in-memory cache
    return new SmartCache({
      maxSize: 100,
      enableSemanticMatching: true,
      similarityThreshold,
    })
  }, [
    enableSemanticCaching,
    similarityThreshold,
    persistCache,
    calculateEmbedding,
  ])

  // Initialize embedding cache for smart history
  const embeddingCache = React.useRef<Map<string, number[]>>(new Map())

  // Initialize throttler (from basic hook)
  const throttler = React.useMemo(
    () => (enableThrottling ? createThrottler(throttling) : null),
    [enableThrottling, throttling]
  )

  // Initialize batcher (from basic hook)
  const batcher = React.useMemo(
    () => (enableBatching ? createBatcher(batching) : null),
    [enableBatching, batching]
  )

  // Statistics
  const [stats, setStats] = React.useState<EnhancedOptimizationStats>({
    toon: {
      conversions: 0,
      totalTokensSaved: 0,
      averageSavingsPercent: 0,
    },
    compression: {
      compressions: 0,
      totalTokensSaved: 0,
      averageSavingsPercent: 0,
    },
    cache: promptCacheManager.getStats(),
    semanticCache: {
      hits: 0,
      misses: 0,
      hitRate: 0,
      tokensSaved: 0,
    },
    tokenization: {
      accurateCount: 0,
      estimatedCount: 0,
      accuracyRate: 0,
    },
    costs: {
      totalCost: 0,
      inputCost: 0,
      outputCost: 0,
      cachedCost: 0,
      savingsFromOptimization: 0,
    },
    historyLimiting: {
      messagesRemoved: 0,
      tokensSaved: 0,
    },
    throttling: {
      requestsThrottled: 0,
    },
    modelRouting: {
      simpleModelRoutes: 0,
      complexModelRoutes: 0,
      routingCostSaved: 0,
    },
    prefilling: {
      prefilledResponses: 0,
      preambleTokensSaved: 0,
    },
    piiRedaction: {
      emailsRedacted: 0,
      phonesRedacted: 0,
      totalTokensSaved: 0,
    },
    promptStructure: {
      restructuredPrompts: 0,
      questionsMovedToEnd: 0,
    },
    overall: {
      totalTokensSaved: 0,
      totalCostSaved: 0,
      averageSavingsPercent: 0,
    },
  })

  /**
   * PII Redaction
   */
  const redactPII = React.useCallback(
    (text: string): string => {
      if (!enablePIIRedaction) return text

      let redacted = text
      let totalSaved = 0

      // Email regex
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
      const emails = redacted.match(emailRegex) || []
      redacted = redacted.replace(emailRegex, '<EMAIL_REDACTED>')

      // Phone regex (simple)
      const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g
      const phones = redacted.match(phoneRegex) || []
      redacted = redacted.replace(phoneRegex, '<PHONE_REDACTED>')

      // Rough token estimation: email ~4-8 tokens, phone ~4-6 tokens
      const emailSaved = emails.length * 5
      const phoneSaved = phones.length * 5
      totalSaved = emailSaved + phoneSaved

      if (enableStats && totalSaved > 0) {
        setStats((prev) => ({
          ...prev,
          piiRedaction: {
            emailsRedacted: prev.piiRedaction.emailsRedacted + emails.length,
            phonesRedacted: prev.piiRedaction.phonesRedacted + phones.length,
            totalTokensSaved: prev.piiRedaction.totalTokensSaved + totalSaved,
          },
        }))
      }

      return redacted
    },
    [enablePIIRedaction, enableStats]
  )

  /**
   * Optimize structured data
   */
  const optimizeData = React.useCallback(
    async (data: any): Promise<EnhancedOptimizationResult> => {
      // PII Redaction first
      let processedData = data
      if (enablePIIRedaction) {
        const jsonStr = JSON.stringify(data)
        const redactedStr = redactPII(jsonStr)
        processedData = JSON.parse(redactedStr)
      }

      // Apply TOON optimization
      let content: string
      let format: 'json' | 'toon' = 'json'
      let toonResult: ToonOptimizationResult | undefined

      if (enableToon) {
        const result = autoOptimize(processedData, {
          minSavingsPercent: toonMinSavings,
        })
        content = result.data
        format = result.format
        toonResult = result

        // Update stats
        if (enableStats && result.format === 'toon') {
          setStats((prev) => ({
            ...prev,
            toon: {
              conversions: prev.toon.conversions + 1,
              totalTokensSaved: prev.toon.totalTokensSaved + result.tokensSaved,
              averageSavingsPercent:
                (prev.toon.averageSavingsPercent * prev.toon.conversions +
                  result.savingsPercent) /
                (prev.toon.conversions + 1),
            },
          }))
        }
      } else {
        content = JSON.stringify(data)
      }

      // Count tokens
      const tokens = await countTokens(content, {
        model,
        preferAccurate: enableAccurateTokenization,
      })

      // Update tokenization stats
      if (enableStats) {
        setStats((prev) => ({
          ...prev,
          tokenization: {
            accurateCount:
              prev.tokenization.accurateCount +
              (tokens.method === 'accurate' ? 1 : 0),
            estimatedCount:
              prev.tokenization.estimatedCount +
              (tokens.method === 'estimated' ? 1 : 0),
            accuracyRate:
              ((prev.tokenization.accurateCount +
                (tokens.method === 'accurate' ? 1 : 0)) /
                (prev.tokenization.accurateCount +
                  prev.tokenization.estimatedCount +
                  1)) *
              100,
          },
        }))
      }

      // Calculate cost
      let cost: CostCalculation | undefined
      if (enableCostTracking) {
        cost = calculateCost({
          model,
          inputTokens: tokens.total,
          outputTokens: 0,
        })

        // Check budget
        const newTotalCost = stats.costs.totalCost + cost.totalCost
        if (budget && newTotalCost > budget && onBudgetExceeded) {
          onBudgetExceeded(newTotalCost, budget)
        }

        setStats((prev) => ({
          ...prev,
          costs: {
            ...prev.costs,
            inputCost: prev.costs.inputCost + cost!.inputCost,
            totalCost: prev.costs.totalCost + cost!.totalCost,
          },
        }))
      }

      return {
        content,
        format,
        tokens,
        cost,
        optimizations: {
          toon: toonResult,
        },
      }
    },
    [
      enableToon,
      toonMinSavings,
      model,
      enableAccurateTokenization,
      enableCostTracking,
      enableStats,
    ]
  )

  /**
   * Optimize text prompt
   */
  const optimizePrompt = React.useCallback(
    async (prompt: string): Promise<EnhancedOptimizationResult> => {
      let content = prompt

      // PII Redaction
      if (enablePIIRedaction) {
        content = redactPII(content)
      }

      let compressionResult: CompressionResult | undefined

      // Apply compression
      if (enablePromptCompression) {
        // Use intelligent compression (LLMLingua style)
        const targetRatio =
          compressionLevel === 'aggressive'
            ? 0.4
            : compressionLevel === 'conservative'
              ? 0.8
              : 0.6

        // Use custom config if provided, otherwise derive from level
        const config: Partial<LLMLinguaConfig> = {
          targetRatio,
          ...compressionConfig,
        }

        // Run intelligent compression
        const intelligentResult = await intelligentCompress(prompt, {
          targetRatio: config.targetRatio,
          preserveFirst: config.preserveFirst ?? 100,
          preserveLast: config.preserveLast ?? 50,
          // Use basic compression options as fallback/guidance
          preserveCode: true,
        })

        content = intelligentResult.compressed

        // Adapt to CompressionResult format for compatibility
        compressionResult = {
          compressed: intelligentResult.compressed,
          original: intelligentResult.original,
          originalLength: intelligentResult.original.length,
          compressedLength: intelligentResult.compressed.length,
          savingsPercent: (1 - intelligentResult.compressionRatio) * 100,
          originalTokens: intelligentResult.originalTokens,
          compressedTokens: intelligentResult.compressedTokens,
          tokenSavings:
            intelligentResult.originalTokens -
            intelligentResult.compressedTokens,
        }

        // Update stats
        if (enableStats) {
          setStats((prev) => ({
            ...prev,
            compression: {
              compressions: prev.compression.compressions + 1,
              totalTokensSaved:
                prev.compression.totalTokensSaved +
                compressionResult!.tokenSavings,
              averageSavingsPercent:
                (prev.compression.averageSavingsPercent *
                  prev.compression.compressions +
                  compressionResult!.savingsPercent) /
                (prev.compression.compressions + 1),
            },
          }))
        }
      }

      // Count tokens
      const tokens = await countTokens(content, {
        model,
        preferAccurate: enableAccurateTokenization,
      })

      // Calculate cost
      let cost: CostCalculation | undefined
      if (enableCostTracking) {
        cost = calculateCost({
          model,
          inputTokens: tokens.total,
          outputTokens: 0,
        })

        // Check budget
        const newTotalCost = stats.costs.totalCost + cost.totalCost
        if (budget && newTotalCost > budget && onBudgetExceeded) {
          onBudgetExceeded(newTotalCost, budget)
        }

        setStats((prev) => ({
          ...prev,
          costs: {
            ...prev.costs,
            inputCost: prev.costs.inputCost + cost!.inputCost,
            totalCost: prev.costs.totalCost + cost!.totalCost,
          },
        }))
      }

      return {
        content,
        format: 'text',
        tokens,
        cost,
        optimizations: {
          compression: compressionResult,
        },
      }
    },
    [
      enablePromptCompression,
      compressionLevel,
      compressionConfig,
      model,
      enableAccurateTokenization,
      enableCostTracking,
      enableStats,
    ]
  )

  /**
   * Prepare messages with caching
   */
  const prepareMessages = React.useCallback(
    (messages: CoreMessage[]) => {
      if (!enablePromptCaching) {
        return messages as any
      }

      // Extract system prompt
      const systemMessage = messages.find((m) => m.role === 'system')
      const conversationMessages = messages.filter((m) => m.role !== 'system')

      const systemPrompt = systemMessage
        ? typeof systemMessage.content === 'string'
          ? systemMessage.content
          : JSON.stringify(systemMessage.content)
        : ''

      // Prepare with cache control
      if (cachingProvider === 'anthropic' || cachingProvider === 'auto') {
        return createAnthropicCachedMessages(
          systemPrompt,
          conversationMessages.map((m) => ({
            role: m.role,
            content:
              typeof m.content === 'string'
                ? m.content
                : JSON.stringify(m.content),
          }))
        )
      }

      return messages as any
    },
    [enablePromptCaching, cachingProvider]
  )

  /**
   * Parse response
   */
  const parseResponse = React.useCallback((response: string): any => {
    return parseFlexible(response)
  }, [])

  /**
   * Count tokens wrapper
   */
  const countTokensWrapper = React.useCallback(
    async (text: string): Promise<TokenCount> => {
      return countTokens(text, {
        model,
        preferAccurate: enableAccurateTokenization,
      })
    },
    [model, enableAccurateTokenization]
  )

  /**
   * Calculate cost wrapper
   */
  const calculateCostWrapper = React.useCallback(
    (params: {
      inputTokens: number
      outputTokens: number
    }): CostCalculation => {
      return calculateCost({
        model,
        ...params,
      })
    },
    [model]
  )

  /**
   * Reset statistics
   */
  const resetStats = React.useCallback(() => {
    setStats({
      toon: {
        conversions: 0,
        totalTokensSaved: 0,
        averageSavingsPercent: 0,
      },
      compression: {
        compressions: 0,
        totalTokensSaved: 0,
        averageSavingsPercent: 0,
      },
      cache: promptCacheManager.getStats(),
      semanticCache: {
        hits: 0,
        misses: 0,
        hitRate: 0,
        tokensSaved: 0,
      },
      tokenization: {
        accurateCount: 0,
        estimatedCount: 0,
        accuracyRate: 0,
      },
      costs: {
        totalCost: 0,
        inputCost: 0,
        outputCost: 0,
        cachedCost: 0,
        savingsFromOptimization: 0,
      },
      historyLimiting: {
        messagesRemoved: 0,
        tokensSaved: 0,
      },
      throttling: {
        requestsThrottled: 0,
      },
      modelRouting: {
        simpleModelRoutes: 0,
        complexModelRoutes: 0,
        routingCostSaved: 0,
      },
      prefilling: {
        prefilledResponses: 0,
        preambleTokensSaved: 0,
      },
      piiRedaction: {
        emailsRedacted: 0,
        phonesRedacted: 0,
        totalTokensSaved: 0,
      },
      promptStructure: {
        restructuredPrompts: 0,
        questionsMovedToEnd: 0,
      },
      overall: {
        totalTokensSaved: 0,
        totalCostSaved: 0,
        averageSavingsPercent: 0,
      },
    })
    promptCacheManager.resetStats()
  }, [promptCacheManager])

  // ========== Methods from basic hook ==========

  /**
   * Optimize history (limit conversation messages)
   */
  const optimizeHistory = React.useCallback(
    async (messages: CoreMessage[]): Promise<CoreMessage[]> => {
      if (!enableHistoryLimiting) {
        return messages
      }

      const systemMessage = messages.find((m) => m.role === 'system')

      // Handle summarization strategy
      if (historyLimiting.strategy === 'summarize' && !summarizeMessage) {
        console.warn(
          'Summarization strategy selected but no summarizeMessage callback provided. Falling back to default.'
        )
        return limitHistory(messages, {
          ...historyLimiting,
          strategy: 'sliding-window',
        })
      }

      if (historyLimiting.strategy === 'summarize' && summarizeMessage) {
        const { maxMessages = 10, keepLast = 2 } = historyLimiting

        // If we're under the limit, don't summarize yet
        if (messages.length <= maxMessages) {
          return messages
        }

        const otherMessages = messages.filter((m) => m.role !== 'system')

        // Keep last N messages intact
        const recentMessages = otherMessages.slice(-keepLast)
        const messagesToSummarize = otherMessages.slice(0, -keepLast)

        if (messagesToSummarize.length === 0) {
          return [...(systemMessage ? [systemMessage] : []), ...recentMessages]
        }

        // Create a message representing the conversation to be summarized
        // In a real app, you might want to summarize in chunks
        const textToSummarize = messagesToSummarize
          .map(
            (m) =>
              `${m.role}: ${typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}`
          )
          .join('\n')

        try {
          // Create a dummy message for the summarizer
          const summary = await summarizeMessage({
            role: 'user',
            content: `Summarize the following conversation history:\n${textToSummarize}`,
          })

          // Return system + summary + recent
          return [
            ...(systemMessage ? [systemMessage] : []),
            {
              role: 'assistant',
              content: `[Previous conversation summary]: ${summary.content}`,
            },
            ...recentMessages,
          ]
        } catch (error) {
          console.warn(
            'Summarization failed, falling back to sliding window',
            error
          )
          // Fallback to sliding window
        }
      }

      // Handle smart strategy with embeddings
      if (historyLimiting.strategy === 'smart' && calculateEmbedding) {
        let dynamicMaxTokens = historyLimiting.maxTokens ?? 2000
        if (enableDynamicContext && model) {
          const config = MODEL_REGISTRY[model as ModelId]
          if (config) {
            dynamicMaxTokens = Math.max(
              1000,
              config.contextWindow - (config.recommendedOutputReserve + 1000)
            )
          }
        }

        const keepLast = historyLimiting.keepLast ?? 2
        const otherMessages = messages.filter((m) => m.role !== 'system')

        // Always keep last N messages
        const recentMessages = otherMessages.slice(-keepLast)
        // Candidates for semantic retrieval (excluding recent ones)
        const candidateMessages = otherMessages.slice(0, -keepLast)

        // If no candidates, just return
        if (candidateMessages.length === 0) {
          return [...(systemMessage ? [systemMessage] : []), ...recentMessages]
        }

        // Get query (last user message)
        const lastUserMessage = [...messages]
          .reverse()
          .find((m) => m.role === 'user')
        if (!lastUserMessage) {
          return limitHistory(messages, historyLimiting)
        }

        try {
          // Calculate/Get embedding for query
          const queryText =
            typeof lastUserMessage.content === 'string'
              ? lastUserMessage.content
              : JSON.stringify(lastUserMessage.content)

          const queryEmbedding = await calculateEmbedding(queryText)

          // Group candidates into turns (User + Assistant pairs)
          // This ensures we don't retrieve isolated questions or answers
          const turns: {
            user: CoreMessage
            assistant?: CoreMessage
            timestamp: number
          }[] = []
          let currentTurn: Partial<(typeof turns)[0]> = {}

          for (let i = 0; i < candidateMessages.length; i++) {
            const msg = candidateMessages[i]
            if (msg.role === 'user') {
              if (currentTurn.user) {
                // Previous turn incomplete or just user, push it
                turns.push(currentTurn as any)
              }
              currentTurn = { user: msg, timestamp: i }
            } else if (msg.role === 'assistant' && currentTurn.user) {
              currentTurn.assistant = msg
              turns.push(currentTurn as any)
              currentTurn = {}
            }
          }
          if (currentTurn.user) {
            turns.push(currentTurn as any)
          }

          // Score turns based on user message similarity
          const scoredTurns = await Promise.all(
            turns.map(async (turn) => {
              const text =
                typeof turn.user.content === 'string'
                  ? turn.user.content
                  : JSON.stringify(turn.user.content)

              // Check cache first
              let embedding = embeddingCache.current.get(text)
              if (!embedding) {
                embedding = await calculateEmbedding!(text)
                embeddingCache.current.set(text, embedding)
              }

              // Cosine similarity
              const similarity = queryEmbedding.reduce(
                (sum, val, i) => sum + val * embedding![i],
                0
              )

              // Calculate total tokens for this turn
              let tokens = await countTokens(text, { model }).then(
                (r) => r.total
              )
              if (turn.assistant) {
                const assistText =
                  typeof turn.assistant.content === 'string'
                    ? turn.assistant.content
                    : JSON.stringify(turn.assistant.content)
                tokens += await countTokens(assistText, { model }).then(
                  (r) => r.total
                )
              }

              return { turn, similarity, tokens }
            })
          )

          // Sort by similarity (descending)
          scoredTurns.sort((a, b) => b.similarity - a.similarity)

          // Select turns based on token budget
          // Reserve space for system + recent messages
          const reservedTokens = await countTokens(
            JSON.stringify([
              ...(systemMessage ? [systemMessage] : []),
              ...recentMessages,
            ]),
            { model }
          ).then((r) => r.total)

          let currentTokens = reservedTokens
          const keptTurns: typeof turns = []

          for (const scored of scoredTurns) {
            if (currentTokens + scored.tokens <= dynamicMaxTokens) {
              keptTurns.push(scored.turn)
              currentTokens += scored.tokens
            }
          }

          // Restore chronological order using original timestamp/index
          keptTurns.sort((a, b) => a.timestamp - b.timestamp)

          // Flatten turns back to messages
          const semanticHistory: CoreMessage[] = []
          keptTurns.forEach((t) => {
            semanticHistory.push(t.user)
            if (t.assistant) semanticHistory.push(t.assistant)
          })

          return [
            ...(systemMessage ? [systemMessage] : []),
            ...semanticHistory,
            ...recentMessages,
          ]
        } catch (error) {
          console.warn(
            'Smart history optimization failed, falling back to default',
            error
          )
        }
      }

      const originalLength = messages.length
      const limited = limitHistory(messages, historyLimiting)

      // Track stats
      if (enableStats && limited.length < originalLength) {
        setStats((prev) => ({
          ...prev,
          historyLimiting: {
            messagesRemoved:
              prev.historyLimiting.messagesRemoved +
              (originalLength - limited.length),
            tokensSaved: prev.historyLimiting.tokensSaved, // Would need token counting for accurate tracking
          },
        }))
      }

      return limited
    },
    [
      enableHistoryLimiting,
      historyLimiting,
      summarizeMessage,
      calculateEmbedding,
      enableStats,
      model,
    ]
  )

  /**
   * Check if request can be made (throttling)
   */
  const canMakeRequest = React.useCallback((): boolean => {
    // Check budget first
    if (enableCostTracking && budget && stats.costs.totalCost >= budget) {
      return false
    }

    if (!enableThrottling || !throttler) {
      return true
    }

    const canMake = throttler.canMakeRequest()
    if (!canMake && enableStats) {
      setStats((prev) => ({
        ...prev,
        throttling: {
          requestsThrottled: prev.throttling.requestsThrottled + 1,
        },
      }))
    }

    return canMake
  }, [
    enableThrottling,
    throttler,
    enableStats,
    enableCostTracking,
    budget,
    stats.costs.totalCost,
  ])

  /**
   * Record request (for throttling)
   */
  const recordRequest = React.useCallback((): void => {
    if (enableThrottling && throttler) {
      throttler.recordRequest()
    }
  }, [enableThrottling, throttler])

  /**
   * Route query to appropriate model
   */
  const routeQuery = React.useCallback(
    (query: string): string => {
      if (!enableModelRouting) {
        return modelRouting.complexModel ?? model ?? 'gpt-4'
      }

      const routedModel = routeToModel(query, modelRouting)
      const savings = estimateRoutingSavings(query, modelRouting)

      if (enableStats) {
        setStats((prev) => ({
          ...prev,
          modelRouting: {
            simpleModelRoutes:
              prev.modelRouting.simpleModelRoutes +
              (routedModel === modelRouting.simpleModel ? 1 : 0),
            complexModelRoutes:
              prev.modelRouting.complexModelRoutes +
              (routedModel === modelRouting.complexModel ? 1 : 0),
            routingCostSaved:
              prev.modelRouting.routingCostSaved + savings.saved,
          },
        }))
      }

      return routedModel
    },
    [enableModelRouting, modelRouting, model, enableStats]
  )

  /**
   * Create data reference for large data
   */
  const createDataReference = React.useCallback(
    (
      data: string | object
    ):
      | { type: 'reference'; id: string; originalSize: number }
      | { type: 'data'; data: string | object } => {
      if (!enableReferences) {
        return { type: 'data', data }
      }

      return createReference(data, references)
    },
    [enableReferences, references]
  )

  /**
   * Enforce output limits
   */
  const limitOutput = React.useCallback(
    (output: string): string => {
      if (!enableOutputLimits) {
        return output
      }

      return enforceOutputLimit(output, outputLimits)
    },
    [enableOutputLimits, outputLimits]
  )

  /**
   * Batch request
   */
  const batchRequest = React.useCallback(
    async <T,>(request: () => Promise<T>): Promise<T> => {
      if (!enableBatching || !batcher) {
        return request()
      }

      return batcher.add(request)
    },
    [enableBatching, batcher]
  )

  // ========== New optimization methods ==========

  /**
   * Get prefill string for response format
   */
  const getPrefill = React.useCallback(
    (format: 'json' | 'xml' | 'code' | 'markdown'): string => {
      if (!enablePrefilling) {
        return ''
      }

      // Map format to template
      let template: PrefillTemplate | undefined
      switch (format) {
        case 'json':
          template = PREFILL_TEMPLATES.json
          break
        case 'xml':
          // No XML template, use custom
          template = undefined
          break
        case 'code':
          template = PREFILL_TEMPLATES.javascript
          break
        case 'markdown':
          template = PREFILL_TEMPLATES.analysis
          break
      }

      const prefill =
        template?.config.prefill ?? (format === 'xml' ? '<response>' : '')

      if (enableStats && prefill) {
        setStats((prev) => ({
          ...prev,
          prefilling: {
            prefilledResponses: prev.prefilling.prefilledResponses + 1,
            preambleTokensSaved: prev.prefilling.preambleTokensSaved + 10, // Estimated average preamble tokens
          },
        }))
      }

      return prefill
    },
    [enablePrefilling, enableStats]
  )

  /**
   * Restructure prompt for optimal attention (question at end)
   *
   * If context is provided, it will be placed at the beginning of the prompt
   * while the question/instruction stays at the end (following "lost in the middle" research).
   */
  const restructurePrompt = React.useCallback(
    (
      prompt: string,
      context?: string
    ): {
      restructured: string
      wasRestructured: boolean
      questionPosition?: 'start' | 'middle' | 'end'
    } => {
      if (!enablePromptStructure) {
        return { restructured: prompt, wasRestructured: false }
      }

      // If context is provided, structure as: context at beginning, prompt at end
      let inputForRestructure = prompt
      if (context) {
        // Prepend context - the restructurePromptUtil will detect
        // and place the actual question at the end
        inputForRestructure = `${context}\n\n${prompt}`
      }

      const result = restructurePromptUtil(
        inputForRestructure,
        promptStructureOptions
      )
      const restructured = result.user
      const wasRestructured = restructured !== inputForRestructure

      if (enableStats && wasRestructured) {
        setStats((prev) => ({
          ...prev,
          promptStructure: {
            restructuredPrompts: prev.promptStructure.restructuredPrompts + 1,
            questionsMovedToEnd: prev.promptStructure.questionsMovedToEnd + 1,
          },
        }))
      }

      return {
        restructured,
        wasRestructured,
        questionPosition: 'end',
      }
    },
    [enablePromptStructure, promptStructureOptions, enableStats]
  )

  // Update overall stats periodically
  React.useEffect(() => {
    if (!enableStats) return

    const totalTokensSaved =
      stats.toon.totalTokensSaved +
      stats.compression.totalTokensSaved +
      stats.cache.tokensSaved +
      stats.semanticCache.tokensSaved

    const totalCostSaved =
      stats.costs.savingsFromOptimization + stats.cache.costSaved

    setStats((prev) => ({
      ...prev,
      overall: {
        totalTokensSaved,
        totalCostSaved,
        averageSavingsPercent:
          (stats.toon.averageSavingsPercent +
            stats.compression.averageSavingsPercent) /
          2,
      },
    }))
  }, [
    stats.toon,
    stats.compression,
    stats.cache,
    stats.semanticCache,
    stats.costs,
    enableStats,
  ])

  return {
    // Original enhanced methods
    optimizeData,
    optimizePrompt,
    prepareMessages,
    parseResponse,
    countTokens: countTokensWrapper,
    calculateCost: calculateCostWrapper,
    // From basic hook
    optimizeHistory,
    canMakeRequest,
    recordRequest,
    routeQuery,
    createDataReference,
    limitOutput,
    batchRequest,
    // Required by return type: provide the history limiter API.
    limitHistory: optimizeHistory,
    // New optimizations
    getPrefill,
    restructurePrompt,
    redactPII,
    // Stats
    stats,
    resetStats,
    isBudgetExceeded: !!(
      enableCostTracking &&
      budget &&
      stats.costs.totalCost >= budget
    ),
  }
}
