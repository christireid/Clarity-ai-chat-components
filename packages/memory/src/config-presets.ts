/**
 * Configuration Presets and Profiles
 * Provides pre-configured settings for common use cases
 */

/**
 * Environment presets optimize for specific runtime environments
 */
export const ENVIRONMENT_PRESETS = {
  /**
   * Browser environment preset
   * - Conservative memory limits
   * - Client-side optimizations
   */
  browser: {
    limits: {
      maxMemories: 500,
      maxTotalTokens: 50000,
      maxMemorySize: 5000,
    },
    enableAutoCleanup: true,
    cleanupInterval: 60000, // 1 minute
    debug: false,
  },

  /**
   * Node.js environment preset
   * - Generous memory limits
   * - Server-side optimizations
   */
  node: {
    limits: {
      maxMemories: 5000,
      maxTotalTokens: 500000,
      maxMemorySize: 50000,
    },
    enableAutoCleanup: true,
    cleanupInterval: 300000, // 5 minutes
    enableAutoSummarization: true,
    summarizationInterval: 600000, // 10 minutes
    debug: false,
  },

  /**
   * Serverless environment preset
   * - Minimal footprint
   * - Fast startup
   */
  serverless: {
    limits: {
      maxMemories: 100,
      maxTotalTokens: 10000,
      maxMemorySize: 2000,
    },
    enableAutoCleanup: false,
    enableAutoSummarization: false,
    debug: false,
  },

  /**
   * Production environment preset
   * - Conservative limits
   * - Full monitoring
   */
  production: {
    limits: {
      maxMemories: 1000,
      maxTotalTokens: 100000,
      maxMemorySize: 10000,
      warnThreshold: 0.8,
    },
    enableAutoCleanup: true,
    cleanupInterval: 120000, // 2 minutes
    enableAutoSummarization: true,
    summarizationInterval: 600000, // 10 minutes
    consent: {
      enabled: true,
      requireConsentForWrites: true,
    },
    audit: {
      enabled: true,
      retentionDays: 90,
    },
    debug: false,
  },
} as const

/**
 * Application profiles optimize for specific use cases
 */
export const APPLICATION_PROFILES = {
  /**
   * Chatbot profile
   * - Focus on recent conversations
   * - Fast recall
   * - Episodic emphasis
   */
  chatbot: {
    limits: {
      maxMemories: 500,
      maxTotalTokens: 50000,
    },
    enableAutoCleanup: true,
    cleanupInterval: 60000,
    retention: {
      defaultTTL: 7 * 24 * 60 * 60 * 1000, // 7 days
      minAccessCount: 1,
      minImportance: 0.3,
    },
    importanceScoring: {
      enabled: true,
      recencyHalfLife: 7 * 24 * 60 * 60 * 1000, // 7 days
      weights: {
        base: 0.2,
        recency: 0.4,
        frequency: 0.2,
        relevance: 0.2,
      },
    },
  },

  /**
   * Knowledge base profile
   * - Long-term retention
   * - Semantic emphasis
   * - High importance threshold
   */
  knowledgeBase: {
    limits: {
      maxMemories: 2000,
      maxTotalTokens: 200000,
    },
    enableAutoSummarization: true,
    summarizationInterval: 600000, // 10 minutes
    retention: {
      defaultTTL: 365 * 24 * 60 * 60 * 1000, // 1 year
      minAccessCount: 0,
      minImportance: 0.5,
    },
    importanceScoring: {
      enabled: true,
      recencyHalfLife: 90 * 24 * 60 * 60 * 1000, // 90 days
      weights: {
        base: 0.3,
        recency: 0.2,
        frequency: 0.2,
        relevance: 0.3,
      },
    },
  },

  /**
   * History profile
   * - Chronological emphasis
   * - Complete preservation
   * - Temporal organization
   */
  history: {
    limits: {
      maxMemories: 10000,
      maxTotalTokens: 1000000,
    },
    enableAutoCleanup: false, // Preserve history
    enableAutoSummarization: false, // Keep original content
    retention: {
      defaultTTL: Infinity, // Never expire
      minAccessCount: 0,
      minImportance: 0.0,
    },
    importanceScoring: {
      enabled: true,
      recencyHalfLife: 30 * 24 * 60 * 60 * 1000, // 30 days
      weights: {
        base: 0.2,
        recency: 0.5,
        frequency: 0.1,
        relevance: 0.2,
      },
    },
  },
} as const

/**
 * Deep merge utility for configuration objects
 */
function deepMerge(
  target: Record<string, any>,
  ...sources: Record<string, any>[]
): Record<string, any> {
  const result = { ...target }

  for (const source of sources) {
    for (const key in source) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        sourceValue.constructor === Object &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue) &&
        targetValue.constructor === Object
      ) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else if (sourceValue !== undefined) {
        result[key] = sourceValue
      }
    }
  }

  return result
}

/**
 * Create configuration from preset and profile
 *
 * @param preset - Environment preset (browser, node, serverless, production)
 * @param profile - Application profile (chatbot, knowledgeBase, history)
 * @param overrides - Additional configuration overrides
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * // Browser chatbot
 * const config = createConfig('browser', 'chatbot')
 *
 * // Production knowledge base with overrides
 * const config = createConfig('production', 'knowledgeBase', {
 *   limits: { maxMemories: 5000 }
 * })
 * ```
 */
export function createConfig(
  preset: keyof typeof ENVIRONMENT_PRESETS,
  profile: keyof typeof APPLICATION_PROFILES,
  overrides?: Record<string, any>
): Record<string, any> {
  const envPreset = ENVIRONMENT_PRESETS[preset] as Record<string, any>
  const appProfile = APPLICATION_PROFILES[profile] as Record<string, any>

  if (overrides) {
    return deepMerge({}, envPreset, appProfile, overrides)
  }

  return deepMerge({}, envPreset, appProfile)
}

/**
 * Get preset configuration
 *
 * @param preset - Environment preset name
 * @returns Preset configuration
 */
export function getPreset(
  preset: keyof typeof ENVIRONMENT_PRESETS
): Record<string, any> {
  return { ...ENVIRONMENT_PRESETS[preset] }
}

/**
 * Get profile configuration
 *
 * @param profile - Application profile name
 * @returns Profile configuration
 */
export function getProfile(
  profile: keyof typeof APPLICATION_PROFILES
): Record<string, any> {
  return { ...APPLICATION_PROFILES[profile] }
}

/**
 * List available presets
 */
export function listPresets(): string[] {
  return Object.keys(ENVIRONMENT_PRESETS)
}

/**
 * List available profiles
 */
export function listProfiles(): string[] {
  return Object.keys(APPLICATION_PROFILES)
}
