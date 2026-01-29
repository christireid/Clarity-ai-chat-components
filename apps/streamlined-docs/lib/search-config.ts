/**
 * Search Priority Configuration
 *
 * Configures search result prioritization and relevance scoring.
 * Optimized to surface token optimization content for cost-related queries.
 *
 * Features:
 * - Content type weighting (cookbooks > guides > API reference)
 * - URL-based priority scoring
 * - Search synonym mapping for improved relevance
 * - Category-based boosting
 * - Freshness scoring
 *
 * @module search-config
 */

// ============================================================================
// Types
// ============================================================================

export interface SearchPriorityConfig {
  /** Content type weights (higher = more important) */
  contentTypeWeights: Record<string, number>
  /** URL pattern priority scores */
  urlPriorities: Array<{
    pattern: RegExp | string
    score: number
    description: string
  }>
  /** Search query synonyms for improved matching */
  synonyms: Record<string, string[]>
  /** Category boost multipliers */
  categoryBoosts: Record<string, number>
  /** Freshness decay factor (days) */
  freshnessDecay: number
}

export interface ScoredSearchResult {
  baseScore: number
  priorityScore: number
  categoryBoost: number
  freshnessScore: number
  finalScore: number
}

// ============================================================================
// Configuration
// ============================================================================

/**
 * Search priority configuration
 *
 * Priority scoring algorithm:
 * finalScore = baseScore * contentTypeWeight * (1 + urlPriorityScore) * categoryBoost * freshnessScore
 */
export const searchPriorityConfig: SearchPriorityConfig = {
  /**
   * Content type weights
   *
   * Cookbooks are prioritized as they provide practical, actionable examples.
   * Guides provide conceptual understanding.
   * API reference is for detailed technical specs.
   */
  contentTypeWeights: {
    cookbook: 1.5, // Highest: Practical examples
    guide: 1.2, // Medium-high: Conceptual guides
    component: 1.0, // Medium: Component documentation
    hook: 1.0, // Medium: Hook documentation
    example: 0.9, // Medium-low: Example code
    concept: 0.8, // Lower: Conceptual content
    deployment: 0.7, // Lower: Deployment guides
    integration: 0.7, // Lower: Integration guides
  },

  /**
   * URL-based priority scores
   *
   * Higher scores = more relevant for priority queries
   * Organized by topic priority (token optimization is highest)
   */
  urlPriorities: [
    // ========================================================================
    // TOKEN OPTIMIZATION - Highest Priority (0.8-1.0)
    // ========================================================================
    {
      pattern: /\/cookbook\/token-optimization/,
      score: 1.0,
      description: 'Token optimization cookbook - highest priority',
    },
    {
      pattern: /\/guides\/token-optimization/,
      score: 0.95,
      description: 'Token optimization guide',
    },
    {
      pattern: /\/token-optimization/,
      score: 0.9,
      description: 'General token optimization pages',
    },
    {
      pattern: /\/components\/token-(counter|optimization|budget|cost|usage)/,
      score: 0.85,
      description: 'Token-related components',
    },
    {
      pattern: /\/hooks\/use-token/,
      score: 0.85,
      description: 'Token-related hooks',
    },
    {
      pattern: /\/tools\/token-/,
      score: 0.8,
      description: 'Token optimization tools',
    },

    // ========================================================================
    // COST & EFFICIENCY - High Priority (0.5-0.7)
    // ========================================================================
    {
      pattern: /\/cookbook\/(rate-limiting|caching|performance)/,
      score: 0.7,
      description: 'Cost-related cookbooks',
    },
    {
      pattern: /\/guides\/(performance|caching|prompt-caching)/,
      score: 0.65,
      description: 'Performance and efficiency guides',
    },
    {
      pattern: /\/tools\/(roi-calculator|performance)/,
      score: 0.6,
      description: 'ROI and performance tools',
    },
    {
      pattern: /\/components\/(performance|optimization)/,
      score: 0.55,
      description: 'Performance components',
    },
    {
      pattern: /\/hooks\/use-(performance|cache|optimization)/,
      score: 0.5,
      description: 'Performance-related hooks',
    },

    // ========================================================================
    // CORE FEATURES - Medium Priority (0.3-0.4)
    // ========================================================================
    {
      pattern: /\/cookbook\/(streaming|memory|rag)/,
      score: 0.4,
      description: 'Core feature cookbooks',
    },
    {
      pattern: /\/guides\/(streaming|memory|rag|agents)/,
      score: 0.35,
      description: 'Core feature guides',
    },
    {
      pattern: /\/components\/(chat|message|input)/,
      score: 0.3,
      description: 'Core components',
    },

    // ========================================================================
    // GETTING STARTED - Medium-Low Priority (0.1-0.2)
    // ========================================================================
    {
      pattern: /\/learn\/(quick-start|installation|tutorial)/,
      score: 0.2,
      description: 'Getting started content',
    },
    {
      pattern: /\/examples\//,
      score: 0.15,
      description: 'Example pages',
    },
    {
      pattern: /\/playground/,
      score: 0.1,
      description: 'Interactive playground',
    },

    // ========================================================================
    // REFERENCE - Low Priority (0.0-0.05)
    // ========================================================================
    {
      pattern: /\/reference\/(api|types|utilities)/,
      score: 0.05,
      description: 'API reference documentation',
    },
  ],

  /**
   * Search query synonyms
   *
   * Maps user queries to canonical terms for improved relevance.
   * Organized by topic for maintainability.
   */
  synonyms: {
    // Token optimization synonyms
    cost: ['token optimization', 'pricing', 'expense', 'budget', 'spending'],
    costs: ['token optimization', 'pricing', 'expenses', 'budget', 'spending'],
    price: ['token optimization', 'cost', 'pricing', 'expense'],
    pricing: ['token optimization', 'cost', 'expense', 'budget'],
    expensive: ['token optimization', 'cost reduction', 'cost savings'],
    cheap: ['token optimization', 'cost reduction', 'cost savings'],
    save: ['token optimization', 'cost reduction', 'efficiency'],
    savings: ['token optimization', 'cost reduction', 'efficiency'],
    reduce: ['token optimization', 'minimize', 'optimize'],
    budget: ['token optimization', 'cost management', 'quota'],
    quota: ['token optimization', 'rate limiting', 'budget'],
    limit: ['token optimization', 'rate limiting', 'quota', 'budget'],

    // Performance synonyms
    slow: ['performance', 'optimization', 'speed'],
    fast: ['performance', 'optimization', 'speed'],
    speed: ['performance', 'optimization', 'latency'],
    latency: ['performance', 'speed', 'response time'],
    optimize: ['performance', 'token optimization', 'efficiency'],
    optimization: ['performance', 'token optimization', 'efficiency'],
    efficient: ['performance', 'optimization', 'token optimization'],
    efficiency: ['performance', 'optimization', 'token optimization'],

    // Caching synonyms
    cache: ['caching', 'prompt caching', 'performance'],
    caching: ['cache', 'prompt caching', 'performance'],

    // Token counting synonyms
    tokens: ['token optimization', 'token counter', 'tokenization'],
    tokenize: ['token counter', 'tokenization', 'token optimization'],
    count: ['token counter', 'measurement', 'tracking'],

    // Rate limiting synonyms
    'rate limit': ['rate limiting', 'quota', 'throttling'],
    throttle: ['rate limiting', 'quota', 'limit'],
    throttling: ['rate limiting', 'quota', 'limit'],

    // ROI synonyms
    roi: ['return on investment', 'cost benefit', 'value'],
    'return on investment': ['roi', 'cost benefit', 'value'],
    value: ['roi', 'cost benefit', 'efficiency'],

    // Usage monitoring synonyms
    usage: ['monitoring', 'tracking', 'analytics'],
    monitor: ['monitoring', 'tracking', 'usage'],
    tracking: ['monitoring', 'usage', 'analytics'],

    // LLM model synonyms
    'openai': ['model', 'provider', 'llm'],
    'anthropic': ['model', 'provider', 'llm', 'claude'],
    'claude': ['model', 'anthropic', 'llm'],
    'gpt': ['model', 'openai', 'llm'],
    'llm': ['model', 'language model', 'ai'],
  },

  /**
   * Category boost multipliers
   *
   * Applied after content type and URL priority scoring.
   * Boosts entire categories based on current focus areas.
   */
  categoryBoosts: {
    // High priority categories
    cookbook: 1.3, // Practical examples get highest boost
    'token-optimization': 1.25, // Token content gets priority
    performance: 1.2, // Performance content important
    tools: 1.15, // Interactive tools valuable

    // Medium priority categories
    guides: 1.1, // Guides are helpful
    learn: 1.05, // Learning content moderately boosted
    reference: 1.0, // Reference at baseline

    // Standard categories (no boost)
    examples: 1.0,
    components: 1.0,
    hooks: 1.0,

    // Lower priority categories
    about: 0.9,
    contributing: 0.8,
    license: 0.7,
  },

  /**
   * Freshness decay factor (in days)
   *
   * Content older than this gets gradually lower scores.
   * Set to 0 to disable freshness scoring.
   */
  freshnessDecay: 180, // 6 months
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate priority score for a URL
 */
export function getUrlPriorityScore(url: string): number {
  for (const priority of searchPriorityConfig.urlPriorities) {
    const pattern =
      typeof priority.pattern === 'string'
        ? new RegExp(priority.pattern)
        : priority.pattern

    if (pattern.test(url)) {
      return priority.score
    }
  }
  return 0 // Default: no priority boost
}

/**
 * Get content type weight
 */
export function getContentTypeWeight(type: string): number {
  return searchPriorityConfig.contentTypeWeights[type] || 1.0
}

/**
 * Get category boost
 */
export function getCategoryBoost(category: string | undefined): number {
  if (!category) return 1.0
  return searchPriorityConfig.categoryBoosts[category] || 1.0
}

/**
 * Calculate freshness score
 */
export function getFreshnessScore(lastUpdated?: string): number {
  if (
    !lastUpdated ||
    !searchPriorityConfig.freshnessDecay ||
    searchPriorityConfig.freshnessDecay === 0
  ) {
    return 1.0 // No freshness penalty
  }

  const now = Date.now()
  const updated = new Date(lastUpdated).getTime()
  const ageInDays = (now - updated) / (1000 * 60 * 60 * 24)

  if (ageInDays <= 0) return 1.0

  // Exponential decay: score = e^(-age / decay)
  return Math.exp(-ageInDays / searchPriorityConfig.freshnessDecay)
}

/**
 * Expand query with synonyms
 */
export function expandQueryWithSynonyms(query: string): string[] {
  const lowerQuery = query.toLowerCase().trim()
  const words = lowerQuery.split(/\s+/)

  const expandedTerms = new Set<string>([lowerQuery])

  // Add exact word matches
  for (const word of words) {
    const synonyms = searchPriorityConfig.synonyms[word]
    if (synonyms) {
      synonyms.forEach((syn) => expandedTerms.add(syn))
    }
  }

  // Add phrase matches
  for (const [phrase, synonyms] of Object.entries(searchPriorityConfig.synonyms)) {
    if (lowerQuery.includes(phrase)) {
      synonyms.forEach((syn) => expandedTerms.add(syn))
    }
  }

  return Array.from(expandedTerms)
}

/**
 * Calculate final search score
 *
 * @param baseScore - Base relevance score from search algorithm
 * @param url - Page URL for priority scoring
 * @param type - Content type (cookbook, guide, etc.)
 * @param category - Content category
 * @param lastUpdated - Last update timestamp
 * @returns Scored result with breakdown
 */
export function calculateSearchScore(
  baseScore: number,
  url: string,
  type: string,
  category?: string,
  lastUpdated?: string
): ScoredSearchResult {
  const priorityScore = getUrlPriorityScore(url)
  const contentTypeWeight = getContentTypeWeight(type)
  const categoryBoost = getCategoryBoost(category)
  const freshnessScore = getFreshnessScore(lastUpdated)

  // Final score formula:
  // finalScore = baseScore * contentTypeWeight * (1 + priorityScore) * categoryBoost * freshnessScore
  const finalScore =
    baseScore * contentTypeWeight * (1 + priorityScore) * categoryBoost * freshnessScore

  return {
    baseScore,
    priorityScore,
    categoryBoost,
    freshnessScore,
    finalScore,
  }
}

/**
 * Check if query is token-optimization related
 *
 * Used to apply special boosting for token optimization queries.
 */
export function isTokenOptimizationQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase()

  const tokenKeywords = [
    'token',
    'cost',
    'price',
    'pricing',
    'expensive',
    'cheap',
    'save',
    'savings',
    'reduce',
    'budget',
    'quota',
    'roi',
    'efficiency',
    'optimize',
    'optimization',
  ]

  return tokenKeywords.some((keyword) => lowerQuery.includes(keyword))
}

// ============================================================================
// Export Configuration
// ============================================================================

export default searchPriorityConfig
