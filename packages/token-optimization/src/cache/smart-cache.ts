/**
 * SmartCache - Pattern-based cache with entity extraction
 *
 * Tier 2 of the tiered caching system. Identifies semantically equivalent
 * queries by extracting and normalizing common entities (locations, dates, numbers).
 *
 * @module smart-cache
 */

export interface SmartCacheConfig {
  /** Maximum number of patterns to store */
  maxSize: number
  /** Time-to-live in milliseconds */
  ttl: number
}

export interface SmartCacheResult {
  /** Whether a matching pattern was found */
  hit: boolean
  /** The cached response value (if hit) */
  value?: string
  /** The normalized pattern that matched */
  pattern?: string
  /** Extracted parameters from the query */
  extractedParams?: Record<string, string>
  /** Confidence score (0-1) */
  confidence?: number
}

export interface SmartCacheStats {
  size: number
  hits: number
  misses: number
  hitRate: number
}

interface PatternEntry {
  pattern: string
  response: string
  timestamp: number
  params: string[]
}

// Common entity patterns for normalization
const LOCATION_PATTERNS = [
  'Paris',
  'London',
  'New York',
  'Los Angeles',
  'San Francisco',
  'Chicago',
  'Miami',
  'Tokyo',
  'Berlin',
  'Sydney',
  'Toronto',
  'Seattle',
  'Boston',
  'Denver',
  'Phoenix',
  'Dallas',
  'Houston',
  'Atlanta',
  'Mumbai',
  'Singapore',
  'Hong Kong',
  'Shanghai',
  'Beijing',
  'Seoul',
  'Bangkok',
  'Dubai',
  'Rome',
  'Madrid',
  'Amsterdam',
  'Vienna',
]

/**
 * Pattern-based cache that matches semantically equivalent queries
 *
 * @example
 * ```typescript
 * const cache = new SmartCache({ maxSize: 100, ttl: 3600000 })
 *
 * cache.index('What is the weather in Paris?', 'Sunny, 22°C')
 *
 * // This will match because it has the same pattern
 * const result = cache.match('What is the weather in London?')
 * // { hit: true, pattern: 'What is the weather in {location}?', ... }
 * ```
 */
export class SmartCache {
  private patterns = new Map<string, PatternEntry>()
  private accessOrder: string[] = []
  private hits = 0
  private misses = 0

  constructor(private config: SmartCacheConfig) {}

  /**
   * Index a query-response pair by extracting its pattern
   *
   * @param query - The original query
   * @param response - The response to cache
   * @param metadata - Optional metadata
   */
  index(
    query: string,
    response: string,
    _metadata?: Record<string, unknown>
  ): void {
    const template = this.generateTemplate(query)
    const params = this.extractParamNames(template)

    // Remove from access order if updating
    if (this.patterns.has(template)) {
      this.removeFromAccessOrder(template)
    }

    // Evict old entries if needed
    while (
      this.patterns.size >= this.config.maxSize &&
      this.accessOrder.length > 0
    ) {
      const oldest = this.accessOrder.shift()
      if (oldest) {
        this.patterns.delete(oldest)
      }
    }

    this.patterns.set(template, {
      pattern: template,
      response,
      timestamp: Date.now(),
      params,
    })
    this.accessOrder.push(template)
  }

  /**
   * Try to match a query against cached patterns
   *
   * @param query - The query to match
   * @param context - Optional context for matching
   * @returns Match result with pattern and extracted parameters
   */
  match(query: string, _context?: Record<string, unknown>): SmartCacheResult {
    const queryTemplate = this.generateTemplate(query)

    // Try exact template match first
    const exactMatch = this.patterns.get(queryTemplate)
    if (exactMatch && this.isValid(exactMatch)) {
      this.hits++
      this.updateAccessOrder(queryTemplate)
      return {
        hit: true,
        value: exactMatch.response,
        pattern: exactMatch.pattern,
        extractedParams: this.extractParams(query, exactMatch.pattern),
        confidence: 1.0,
      }
    }

    // Try fuzzy template matching
    for (const [template, entry] of this.patterns) {
      if (this.isValid(entry) && this.templatesMatch(queryTemplate, template)) {
        this.hits++
        this.updateAccessOrder(template)
        return {
          hit: true,
          value: entry.response,
          pattern: entry.pattern,
          extractedParams: this.extractParams(query, entry.pattern),
          confidence: 0.9,
        }
      }
    }

    this.misses++
    return { hit: false }
  }

  /**
   * Generate a normalized template from a query
   *
   * Replaces common entities with placeholders:
   * - Locations → {location}
   * - Dates → {date}
   * - Numbers → {number}
   *
   * @param text - The text to normalize
   * @returns Normalized template string
   */
  generateTemplate(text: string): string {
    let template = text

    // Replace known locations (case-insensitive)
    for (const loc of LOCATION_PATTERNS) {
      template = template.replace(
        new RegExp(`\\b${loc}\\b`, 'gi'),
        '{location}'
      )
    }

    // Replace dates (multiple formats)
    // Full month dates: "January 15, 2024" or "January 15 2024"
    template = template.replace(
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s+\d{4})?\b/gi,
      '{date}'
    )

    // US format: 01/15/2024
    template = template.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '{date}')

    // ISO format: 2024-01-15
    template = template.replace(/\b\d{4}-\d{2}-\d{2}\b/g, '{date}')

    // Replace numbers (including single digits when standalone)
    // Multi-digit numbers always get replaced
    template = template.replace(/\b\d{2,}\b/g, '{number}')
    // Single digits get replaced when preceded by common quantity words
    template = template.replace(
      /\b(top|first|last|next|for|in|every|each)\s+(\d)\b/gi,
      '$1 {number}'
    )

    return template
  }

  /**
   * Clear all cached patterns
   */
  clear(): void {
    this.patterns.clear()
    this.accessOrder = []
    this.hits = 0
    this.misses = 0
  }

  /**
   * Get the current number of cached patterns
   */
  get size(): number {
    return this.patterns.size
  }

  /**
   * Get cache statistics
   */
  getStats(): SmartCacheStats {
    const total = this.hits + this.misses
    return {
      size: this.patterns.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    }
  }

  /**
   * Extract parameter names from a template
   */
  private extractParamNames(template: string): string[] {
    const matches = template.match(/\{(\w+)\}/g) || []
    return matches.map((m) => m.slice(1, -1))
  }

  /**
   * Extract actual parameter values from a query based on a pattern
   */
  private extractParams(
    query: string,
    pattern: string
  ): Record<string, string> {
    const params: Record<string, string> = {}

    // Split pattern into parts (literals and placeholders)
    const patternParts = pattern.split(/(\{\w+\})/)
    const paramNames: string[] = []
    const literals: string[] = []

    for (const part of patternParts) {
      if (part.match(/^\{\w+\}$/)) {
        paramNames.push(part.slice(1, -1))
      } else if (part) {
        literals.push(part)
      }
    }

    // Simple extraction by finding values between literals
    let remaining = query
    let literalIndex = 0

    for (let i = 0; i < paramNames.length; i++) {
      const beforeLiteral = literals[literalIndex] || ''
      const afterLiteral = literals[literalIndex + 1] || ''

      if (beforeLiteral) {
        const beforeIndex = remaining.indexOf(beforeLiteral)
        if (beforeIndex >= 0) {
          remaining = remaining.substring(beforeIndex + beforeLiteral.length)
        }
        literalIndex++
      }

      let value: string
      if (afterLiteral) {
        const endIndex = remaining.indexOf(afterLiteral)
        value = endIndex > -1 ? remaining.substring(0, endIndex) : remaining
        remaining = remaining.substring(
          endIndex >= 0 ? endIndex : remaining.length
        )
      } else {
        value = remaining.trim()
      }

      params[paramNames[i]] = value.trim()
    }

    return params
  }

  /**
   * Check if two templates match (allowing for placeholder normalization)
   */
  private templatesMatch(template1: string, template2: string): boolean {
    // Normalize all placeholders to a common marker
    const normalize = (t: string) =>
      t
        .replace(/\{\w+\}/g, '{*}')
        .toLowerCase()
        .trim()
    return normalize(template1) === normalize(template2)
  }

  /**
   * Check if an entry is still valid (not expired)
   */
  private isValid(entry: PatternEntry): boolean {
    return Date.now() - entry.timestamp < this.config.ttl
  }

  /**
   * Update access order (move to end)
   */
  private updateAccessOrder(key: string): void {
    this.removeFromAccessOrder(key)
    this.accessOrder.push(key)
  }

  /**
   * Remove from access order array
   */
  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }
}
