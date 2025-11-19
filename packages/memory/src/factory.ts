/**
 * Clarity Memory Factory
 * 
 * Creates and returns a configured ClarityMemory instance
 * with smart defaults and helpful error messages
 * 
 * Includes built-in optimizations:
 * - Embedding caching (LRU cache)
 * - Retry logic with exponential backoff
 * - Rate limiting for API calls
 * - Batch processing for bulk operations
 * - Performance monitoring
 */

import { ClarityMemory } from './memory-service'
import type { MemoryConfig } from './types'
import { detectEnvironment, getRecommendedStorageType } from './utils/environment'
import { validateConfig, formatValidationResult } from './utils/validation'

/**
 * Create a Clarity Memory instance with smart defaults
 * 
 * @param config - Optional configuration object
 * @returns Configured ClarityMemory instance
 * 
 * @example
 * ```typescript
 * // Zero-config usage (auto-detects environment)
 * const memory = clarityMemory()
 * await memory.initialize()
 * 
 * // With configuration and optimizations
 * const memory = clarityMemory({
 *   embeddingProvider: {
 *     provider: 'openai',
 *     apiKey: process.env.OPENAI_API_KEY,
 *     cache: true,              // Enable embedding cache
 *     cacheSize: 1000,         // Cache up to 1000 embeddings
 *     cacheTTL: 3600000,       // 1 hour TTL
 *     maxRetries: 3,           // Retry failed requests
 *     rateLimit: {             // Rate limiting
 *       maxTokens: 100,
 *       refillRate: 10,        // 10 tokens per second
 *     },
 *   },
 *   tokenBudget: {
 *     maxTokens: 4096,
 *     allocation: {
 *       systemPrompt: 0.10,
 *       userPreferences: 0.15,
 *       recentContext: 0.30,
 *       semanticMemory: 0.25,
 *       episodicMemory: 0.15,
 *       responseReserve: 0.05,
 *     },
 *     dynamicAllocation: true,
 *     strictMode: false,
 *   },
 * })
 * ```
 */
export function clarityMemory(config?: MemoryConfig): ClarityMemory {
  // Validate configuration early
  const validation = validateConfig(config)
  
  if (!validation.valid) {
    const errorMessage = `Invalid Clarity Memory configuration:\n${formatValidationResult(validation)}`
    
    // In production, throw immediately
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMessage)
    }
    
    // In development, log warnings but continue
    console.warn(errorMessage)
  }

  // Log helpful setup information in debug mode
  if (config?.debug || config?.logLevel === 'info') {
    const env = detectEnvironment()
    const storageType = config?.storage?.type || getRecommendedStorageType()
    
    console.log('[ClarityMemory] Setup Info:', {
      environment: env,
      recommendedStorage: storageType,
      configuredStorage: config?.storage?.type || 'auto',
      hasEmbeddingProvider: !!config?.embeddingProvider,
      hasTokenBudget: !!config?.tokenBudget,
    })
    
    if (validation.warnings.length > 0 || validation.suggestions.length > 0) {
      console.log('\n' + formatValidationResult(validation))
    }
  }

  return new ClarityMemory(config)
}

/**
 * Quick setup helper for common scenarios
 * 
 * Pre-configured helpers for different environments with optimal settings
 */
export const clarityMemoryHelpers = {
  /**
   * Browser setup with IndexedDB persistence
   * 
   * @param config - Optional configuration (storage type is auto-set)
   * @returns ClarityMemory instance configured for browser
   * 
   * @example
   * ```typescript
   * const memory = clarityMemoryHelpers.browser({
   *   embeddingProvider: {
   *     provider: 'openai',
   *     apiKey: '...',
   *     cache: true, // Recommended for browser
   *   },
   * })
   * ```
   */
  browser: (config?: Omit<MemoryConfig, 'storage'>): ClarityMemory => {
    return clarityMemory({
      ...config,
      storage: { type: 'indexeddb' },
    })
  },

  /**
   * Serverless setup with in-memory storage
   * 
   * Optimized for stateless serverless functions (Vercel, AWS Lambda, etc.)
   * 
   * @param config - Optional configuration (storage type is auto-set)
   * @returns ClarityMemory instance configured for serverless
   * 
   * @example
   * ```typescript
   * const memory = clarityMemoryHelpers.serverless({
   *   embeddingProvider: {
   *     provider: 'openai',
   *     apiKey: process.env.OPENAI_API_KEY,
   *     rateLimit: { maxTokens: 50, refillRate: 5 },
   *   },
   * })
   * ```
   */
  serverless: (config?: Omit<MemoryConfig, 'storage'>): ClarityMemory => {
    return clarityMemory({
      ...config,
      storage: { type: 'in-memory' },
    })
  },

  /**
   * Node.js setup with in-memory storage
   * 
   * @param config - Optional configuration (storage type is auto-set)
   * @returns ClarityMemory instance configured for Node.js
   * 
   * @example
   * ```typescript
   * const memory = clarityMemoryHelpers.node({
   *   embeddingProvider: {
   *     provider: 'openai',
   *     apiKey: process.env.OPENAI_API_KEY,
   *   },
   * })
   * ```
   */
  node: (config?: Omit<MemoryConfig, 'storage'>): ClarityMemory => {
    return clarityMemory({
      ...config,
      storage: { type: 'in-memory' },
    })
  },
}
