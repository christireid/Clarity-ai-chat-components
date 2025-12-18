/**
 * Structured Output Schema Caching
 *
 * Addresses the first-use latency issue with structured outputs (JSON Schema).
 * OpenAI's structured outputs have a known first-use latency of 10-60 seconds
 * for new schemas. This module provides schema caching and warming utilities.
 *
 * Key features:
 * - Schema hashing and caching
 * - Schema warming (pre-cache before production use)
 * - First-use latency tracking
 * - Schema reuse recommendations
 *
 * @module utils/structured-output-cache
 */

import { estimateTokens } from '../tokenization/estimator'

/**
 * Generate a hash for a JSON schema
 */
function hashSchema(schema: object): string {
  const str = JSON.stringify(schema, Object.keys(schema).sort())
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return `schema_${Math.abs(hash).toString(36)}`
}

export interface SchemaEntry {
  /** Schema hash */
  hash: string
  /** The schema object */
  schema: object
  /** Schema name/description */
  name?: string
  /** Whether the schema has been warmed */
  isWarmed: boolean
  /** Warmup latency in ms (if warmed) */
  warmupLatencyMs?: number
  /** First use timestamp */
  firstUsedAt?: number
  /** Last used timestamp */
  lastUsedAt?: number
  /** Usage count */
  usageCount: number
  /** Estimated token cost of schema */
  schemaTokens: number
}

export interface SchemaCacheOptions {
  /** Maximum schemas to cache */
  maxSchemas?: number
  /** Auto-evict least recently used schemas */
  enableLRUEviction?: boolean
  /** Track schema usage statistics */
  trackStats?: boolean
}

export interface SchemaWarmingResult {
  /** Schema hash */
  hash: string
  /** Whether warming was successful */
  success: boolean
  /** Warmup latency in ms */
  latencyMs: number
  /** Error if warming failed */
  error?: string
}

/**
 * Schema Cache for structured outputs
 *
 * Tracks and manages JSON schemas to optimize first-use latency.
 *
 * @example
 * ```ts
 * const cache = new SchemaCache()
 *
 * // Register a schema
 * const hash = cache.register(mySchema, 'UserProfile')
 *
 * // Check if schema needs warming
 * if (cache.needsWarming(hash)) {
 *   await cache.warmSchema(hash, apiClient)
 * }
 *
 * // Get schema for API call
 * const schema = cache.get(hash)
 * ```
 */
export class SchemaCache {
  private schemas: Map<string, SchemaEntry> = new Map()
  private options: Required<SchemaCacheOptions>

  constructor(options: SchemaCacheOptions = {}) {
    this.options = {
      maxSchemas: options.maxSchemas ?? 100,
      enableLRUEviction: options.enableLRUEviction ?? true,
      trackStats: options.trackStats ?? true,
    }
  }

  /**
   * Register a schema in the cache
   */
  register(schema: object, name?: string): string {
    const hash = hashSchema(schema)

    if (this.schemas.has(hash)) {
      // Update existing entry
      const entry = this.schemas.get(hash)!
      entry.lastUsedAt = Date.now()
      entry.usageCount++
      if (name) entry.name = name
      return hash
    }

    // Evict if at capacity
    if (
      this.schemas.size >= this.options.maxSchemas &&
      this.options.enableLRUEviction
    ) {
      this.evictLRU()
    }

    // Create new entry
    const entry: SchemaEntry = {
      hash,
      schema,
      name,
      isWarmed: false,
      usageCount: 1,
      firstUsedAt: Date.now(),
      lastUsedAt: Date.now(),
      schemaTokens: estimateTokens(JSON.stringify(schema)),
    }

    this.schemas.set(hash, entry)
    return hash
  }

  /**
   * Get a schema by hash
   */
  get(hash: string): object | undefined {
    const entry = this.schemas.get(hash)
    if (entry && this.options.trackStats) {
      entry.lastUsedAt = Date.now()
      entry.usageCount++
    }
    return entry?.schema
  }

  /**
   * Get schema entry with metadata
   */
  getEntry(hash: string): SchemaEntry | undefined {
    return this.schemas.get(hash)
  }

  /**
   * Check if a schema needs warming
   */
  needsWarming(hash: string): boolean {
    const entry = this.schemas.get(hash)
    return entry ? !entry.isWarmed : false
  }

  /**
   * Mark a schema as warmed
   */
  markWarmed(hash: string, latencyMs: number): void {
    const entry = this.schemas.get(hash)
    if (entry) {
      entry.isWarmed = true
      entry.warmupLatencyMs = latencyMs
    }
  }

  /**
   * Warm a schema by making a minimal API request
   *
   * Note: This requires an API client to be passed in. The actual
   * warming request depends on the provider (OpenAI, etc.)
   */
  async warmSchema(
    hash: string,
    makeRequest: (schema: object) => Promise<void>
  ): Promise<SchemaWarmingResult> {
    const entry = this.schemas.get(hash)
    if (!entry) {
      return {
        hash,
        success: false,
        latencyMs: 0,
        error: 'Schema not found in cache',
      }
    }

    if (entry.isWarmed) {
      return {
        hash,
        success: true,
        latencyMs: entry.warmupLatencyMs ?? 0,
      }
    }

    const startTime = Date.now()
    try {
      await makeRequest(entry.schema)
      const latencyMs = Date.now() - startTime

      this.markWarmed(hash, latencyMs)

      return {
        hash,
        success: true,
        latencyMs,
      }
    } catch (error) {
      return {
        hash,
        success: false,
        latencyMs: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Warm multiple schemas in parallel
   */
  async warmSchemas(
    hashes: string[],
    makeRequest: (schema: object) => Promise<void>,
    options: { concurrency?: number } = {}
  ): Promise<SchemaWarmingResult[]> {
    const { concurrency = 3 } = options
    const results: SchemaWarmingResult[] = []

    // Process in batches
    for (let i = 0; i < hashes.length; i += concurrency) {
      const batch = hashes.slice(i, i + concurrency)
      const batchResults = await Promise.all(
        batch.map((hash) => this.warmSchema(hash, makeRequest))
      )
      results.push(...batchResults)
    }

    return results
  }

  /**
   * Get all schemas that need warming
   */
  getUnwarmedSchemas(): string[] {
    return Array.from(this.schemas.entries())
      .filter(([_, entry]) => !entry.isWarmed)
      .map(([hash]) => hash)
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    totalSchemas: number
    warmedSchemas: number
    unwarmedSchemas: number
    totalTokens: number
    averageWarmupLatency: number
    mostUsedSchemas: Array<{ hash: string; name?: string; usageCount: number }>
  } {
    const entries = Array.from(this.schemas.values())
    const warmed = entries.filter((e) => e.isWarmed)
    const warmupLatencies = warmed
      .filter((e) => e.warmupLatencyMs !== undefined)
      .map((e) => e.warmupLatencyMs!)

    return {
      totalSchemas: entries.length,
      warmedSchemas: warmed.length,
      unwarmedSchemas: entries.length - warmed.length,
      totalTokens: entries.reduce((sum, e) => sum + e.schemaTokens, 0),
      averageWarmupLatency:
        warmupLatencies.length > 0
          ? warmupLatencies.reduce((a, b) => a + b, 0) / warmupLatencies.length
          : 0,
      mostUsedSchemas: entries
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 5)
        .map((e) => ({ hash: e.hash, name: e.name, usageCount: e.usageCount })),
    }
  }

  /**
   * Evict the least recently used schema
   */
  private evictLRU(): void {
    let oldestHash: string | undefined
    let oldestTime = Infinity

    for (const [hash, entry] of this.schemas) {
      const lastUsed = entry.lastUsedAt ?? entry.firstUsedAt ?? 0
      if (lastUsed < oldestTime) {
        oldestTime = lastUsed
        oldestHash = hash
      }
    }

    if (oldestHash) {
      this.schemas.delete(oldestHash)
    }
  }

  /**
   * Clear all cached schemas
   */
  clear(): void {
    this.schemas.clear()
  }

  /**
   * Export cache for persistence
   */
  export(): SchemaEntry[] {
    return Array.from(this.schemas.values())
  }

  /**
   * Import schemas from persistence
   */
  import(entries: SchemaEntry[]): void {
    for (const entry of entries) {
      this.schemas.set(entry.hash, entry)
    }
  }
}

/**
 * Create a schema warming request for OpenAI
 *
 * Makes a minimal request to trigger schema compilation on OpenAI's side.
 */
export function createOpenAIWarmingRequest(
  apiKey: string,
  model: string = 'gpt-4o-mini'
): (schema: object) => Promise<void> {
  return async (schema: object) => {
    // This is a placeholder - actual implementation would use the OpenAI SDK
    // The key is to make a minimal request with the schema to trigger caching
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: 'test' }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'warmup',
            schema,
          },
        },
        max_tokens: 1,
      }),
    })

    if (!response.ok) {
      throw new Error(`Schema warming failed: ${response.statusText}`)
    }
  }
}

/**
 * Estimate the first-use latency for a schema
 *
 * Based on schema complexity and typical OpenAI processing times.
 */
export function estimateSchemaLatency(schema: object): {
  estimatedLatencyMs: number
  complexity: 'simple' | 'moderate' | 'complex'
  recommendation: string
} {
  const schemaStr = JSON.stringify(schema)
  const tokens = estimateTokens(schemaStr)

  // Properties count (rough measure of complexity)
  const propertyMatches = schemaStr.match(/"properties"/g)
  const propertiesCount = propertyMatches?.length ?? 0

  // Nested depth estimation
  const maxDepth = (schemaStr.match(/{/g)?.length ?? 0) / 2

  let complexity: 'simple' | 'moderate' | 'complex'
  let estimatedLatencyMs: number

  if (tokens < 100 && propertiesCount < 5 && maxDepth < 3) {
    complexity = 'simple'
    estimatedLatencyMs = 10000 // 10 seconds
  } else if (tokens < 500 && propertiesCount < 20 && maxDepth < 5) {
    complexity = 'moderate'
    estimatedLatencyMs = 30000 // 30 seconds
  } else {
    complexity = 'complex'
    estimatedLatencyMs = 60000 // 60 seconds
  }

  let recommendation: string
  if (complexity === 'complex') {
    recommendation =
      'Consider simplifying schema or warming during app initialization'
  } else if (complexity === 'moderate') {
    recommendation = 'Recommend warming schema before production use'
  } else {
    recommendation = 'Schema complexity is acceptable, warming optional'
  }

  return {
    estimatedLatencyMs,
    complexity,
    recommendation,
  }
}

/**
 * Common schema patterns for reuse
 */
export const COMMON_SCHEMAS = {
  /** Simple string response */
  stringResponse: {
    type: 'object',
    properties: {
      response: { type: 'string' },
    },
    required: ['response'],
    additionalProperties: false,
  },

  /** Boolean response */
  booleanResponse: {
    type: 'object',
    properties: {
      result: { type: 'boolean' },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
    },
    required: ['result'],
    additionalProperties: false,
  },

  /** List response */
  listResponse: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['items'],
    additionalProperties: false,
  },

  /** Key-value pairs */
  keyValueResponse: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        additionalProperties: { type: 'string' },
      },
    },
    required: ['data'],
    additionalProperties: false,
  },

  /** Analysis response */
  analysisResponse: {
    type: 'object',
    properties: {
      summary: { type: 'string' },
      keyPoints: {
        type: 'array',
        items: { type: 'string' },
      },
      sentiment: {
        type: 'string',
        enum: ['positive', 'negative', 'neutral'],
      },
      confidence: { type: 'number', minimum: 0, maximum: 1 },
    },
    required: ['summary', 'keyPoints'],
    additionalProperties: false,
  },
} as const

/**
 * Recommend whether to use a cached schema vs custom
 */
export function recommendSchemaStrategy(
  customSchema: object,
  cache: SchemaCache
): {
  strategy: 'use-cached' | 'use-common' | 'use-custom' | 'warm-first'
  reason: string
  suggestedSchema?: object
  estimatedLatency?: number
} {
  const hash = hashSchema(customSchema)
  const cached = cache.getEntry(hash)

  // Check if already cached and warmed
  if (cached?.isWarmed) {
    return {
      strategy: 'use-cached',
      reason: 'Schema is already cached and warmed',
    }
  }

  // Check if matches a common schema
  for (const [name, commonSchema] of Object.entries(COMMON_SCHEMAS)) {
    if (hashSchema(commonSchema) === hash) {
      return {
        strategy: 'use-common',
        reason: `Matches common schema: ${name}`,
        suggestedSchema: commonSchema,
      }
    }
  }

  // Estimate latency for new schema
  const latencyEstimate = estimateSchemaLatency(customSchema)

  if (latencyEstimate.complexity === 'complex') {
    return {
      strategy: 'warm-first',
      reason: 'Complex schema - recommend warming before use',
      estimatedLatency: latencyEstimate.estimatedLatencyMs,
    }
  }

  return {
    strategy: 'use-custom',
    reason: 'Custom schema with acceptable complexity',
    estimatedLatency: latencyEstimate.estimatedLatencyMs,
  }
}
