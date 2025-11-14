/**
 * Clarity Memory Factory
 * 
 * Creates and returns a configured ClarityMemory instance
 * with smart defaults and helpful error messages
 */

import { ClarityMemory } from './core/clarity-memory'
import type { MemoryConfig } from './core/types'
import { detectEnvironment, getRecommendedStorageType } from './utils/environment'
import { validateConfig, formatValidationResult } from './utils/validation'

/**
 * Create a Clarity Memory instance with smart defaults
 * 
 * @example
 * ```typescript
 * // Zero-config usage (auto-detects environment)
 * const memory = clarityMemory()
 * await memory.initialize()
 * 
 * // With configuration
 * const memory = clarityMemory({
 *   embeddingProvider: {
 *     provider: 'openai',
 *     apiKey: process.env.OPENAI_API_KEY,
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
 */
export const clarityMemoryHelpers = {
  /**
   * Browser setup with IndexedDB
   */
  browser: (config?: Omit<MemoryConfig, 'storage'>): ClarityMemory => {
    return clarityMemory({
      ...config,
      storage: { type: 'indexeddb' },
    })
  },

  /**
   * Serverless setup with in-memory storage
   */
  serverless: (config?: Omit<MemoryConfig, 'storage'>): ClarityMemory => {
    return clarityMemory({
      ...config,
      storage: { type: 'in-memory' },
    })
  },

  /**
   * Node.js setup with in-memory storage
   */
  node: (config?: Omit<MemoryConfig, 'storage'>): ClarityMemory => {
    return clarityMemory({
      ...config,
      storage: { type: 'in-memory' },
    })
  },
}
