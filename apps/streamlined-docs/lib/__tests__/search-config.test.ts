/**
 * Search Configuration Tests
 *
 * Validates search priority configuration and scoring algorithms.
 */

import { describe, it, expect } from 'vitest'
import {
  getUrlPriorityScore,
  getContentTypeWeight,
  getCategoryBoost,
  getFreshnessScore,
  expandQueryWithSynonyms,
  calculateSearchScore,
  isTokenOptimizationQuery,
  searchPriorityConfig,
} from '../search-config'

describe('Search Priority Configuration', () => {
  describe('URL Priority Scoring', () => {
    it('should assign highest priority to token optimization cookbook', () => {
      const score = getUrlPriorityScore('/cookbook/token-optimization')
      expect(score).toBe(1.0)
    })

    it('should assign high priority to token optimization guide', () => {
      const score = getUrlPriorityScore('/guides/token-optimization')
      expect(score).toBe(0.95)
    })

    it('should assign medium-high priority to token components', () => {
      const score = getUrlPriorityScore('/components/token-counter')
      expect(score).toBeGreaterThanOrEqual(0.85)
    })

    it('should assign medium priority to token hooks', () => {
      const score = getUrlPriorityScore('/hooks/use-token-optimization')
      expect(score).toBeGreaterThanOrEqual(0.85)
    })

    it('should assign lower priority to general reference pages', () => {
      const score = getUrlPriorityScore('/reference/api/types')
      expect(score).toBeLessThanOrEqual(0.1)
    })

    it('should return 0 for unmatched URLs', () => {
      const score = getUrlPriorityScore('/some/random/page')
      expect(score).toBe(0)
    })

    it('should prioritize cookbooks over guides', () => {
      const cookbookScore = getUrlPriorityScore('/cookbook/token-optimization')
      const guideScore = getUrlPriorityScore('/guides/token-optimization')
      expect(cookbookScore).toBeGreaterThan(guideScore)
    })
  })

  describe('Content Type Weighting', () => {
    it('should weight cookbooks highest', () => {
      expect(getContentTypeWeight('cookbook')).toBe(1.5)
    })

    it('should weight guides higher than components', () => {
      const guideWeight = getContentTypeWeight('guide')
      const componentWeight = getContentTypeWeight('component')
      expect(guideWeight).toBeGreaterThan(componentWeight)
    })

    it('should weight components and hooks equally', () => {
      expect(getContentTypeWeight('component')).toBe(getContentTypeWeight('hook'))
    })

    it('should return 1.0 for unknown content types', () => {
      expect(getContentTypeWeight('unknown')).toBe(1.0)
    })

    it('should maintain proper hierarchy: cookbook > guide > component', () => {
      const cookbook = getContentTypeWeight('cookbook')
      const guide = getContentTypeWeight('guide')
      const component = getContentTypeWeight('component')

      expect(cookbook).toBeGreaterThan(guide)
      expect(guide).toBeGreaterThan(component)
    })
  })

  describe('Category Boosting', () => {
    it('should boost cookbook category', () => {
      expect(getCategoryBoost('cookbook')).toBeGreaterThan(1.0)
    })

    it('should boost token-optimization category highly', () => {
      expect(getCategoryBoost('token-optimization')).toBeGreaterThanOrEqual(1.2)
    })

    it('should boost performance category', () => {
      expect(getCategoryBoost('performance')).toBeGreaterThan(1.0)
    })

    it('should not penalize standard categories', () => {
      expect(getCategoryBoost('components')).toBe(1.0)
    })

    it('should return 1.0 for undefined category', () => {
      expect(getCategoryBoost(undefined)).toBe(1.0)
    })
  })

  describe('Freshness Scoring', () => {
    it('should return 1.0 for recent content (today)', () => {
      const today = new Date().toISOString()
      expect(getFreshnessScore(today)).toBeCloseTo(1.0, 2)
    })

    it('should penalize old content', () => {
      const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      const score = getFreshnessScore(oneYearAgo)
      expect(score).toBeLessThan(1.0)
      expect(score).toBeGreaterThan(0)
    })

    it('should return 1.0 for missing lastUpdated', () => {
      expect(getFreshnessScore(undefined)).toBe(1.0)
    })

    it('should decay exponentially', () => {
      const recent = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const older = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()

      const recentScore = getFreshnessScore(recent)
      const olderScore = getFreshnessScore(older)

      expect(recentScore).toBeGreaterThan(olderScore)
    })
  })

  describe('Query Synonym Expansion', () => {
    it('should expand "cost" with token optimization synonyms', () => {
      const expanded = expandQueryWithSynonyms('cost')
      expect(expanded).toContain('cost')
      expect(expanded).toContain('token optimization')
      expect(expanded).toContain('pricing')
    })

    it('should expand "savings" with optimization synonyms', () => {
      const expanded = expandQueryWithSynonyms('savings')
      expect(expanded).toContain('savings')
      expect(expanded).toContain('token optimization')
      expect(expanded).toContain('cost reduction')
    })

    it('should expand "budget" with quota synonyms', () => {
      const expanded = expandQueryWithSynonyms('budget')
      expect(expanded).toContain('budget')
      expect(expanded).toContain('token optimization')
      expect(expanded).toContain('quota')
    })

    it('should expand "slow" with performance synonyms', () => {
      const expanded = expandQueryWithSynonyms('slow')
      expect(expanded).toContain('slow')
      expect(expanded).toContain('performance')
      expect(expanded).toContain('optimization')
    })

    it('should handle multi-word phrases', () => {
      const expanded = expandQueryWithSynonyms('rate limit')
      expect(expanded).toContain('rate limit')
      expect(expanded).toContain('rate limiting')
      expect(expanded).toContain('quota')
    })

    it('should return original query if no synonyms found', () => {
      const expanded = expandQueryWithSynonyms('unique-term-xyz')
      expect(expanded).toContain('unique-term-xyz')
      expect(expanded.length).toBeGreaterThanOrEqual(1)
    })

    it('should be case-insensitive', () => {
      const lower = expandQueryWithSynonyms('cost')
      const upper = expandQueryWithSynonyms('COST')
      const mixed = expandQueryWithSynonyms('CoSt')

      expect(lower).toEqual(upper)
      expect(lower).toEqual(mixed)
    })
  })

  describe('Complete Search Scoring', () => {
    it('should boost token optimization cookbook highly', () => {
      const result = calculateSearchScore(
        0.8, // base score
        '/cookbook/token-optimization',
        'cookbook',
        'token-optimization',
        new Date().toISOString()
      )

      // Should have significant boosts
      expect(result.priorityScore).toBeGreaterThan(0.9)
      expect(result.categoryBoost).toBeGreaterThan(1.2)
      expect(result.finalScore).toBeGreaterThan(2.0) // Strong boost
    })

    it('should score token guide lower than cookbook', () => {
      const cookbook = calculateSearchScore(
        0.8,
        '/cookbook/token-optimization',
        'cookbook',
        'token-optimization'
      )

      const guide = calculateSearchScore(
        0.8,
        '/guides/token-optimization',
        'guide',
        'guides'
      )

      expect(cookbook.finalScore).toBeGreaterThan(guide.finalScore)
    })

    it('should score API reference lowest for same base score', () => {
      const cookbook = calculateSearchScore(
        0.8,
        '/cookbook/token-optimization',
        'cookbook'
      )

      const reference = calculateSearchScore(0.8, '/reference/api/types', 'guide')

      expect(cookbook.finalScore).toBeGreaterThan(reference.finalScore)
    })

    it('should penalize old content', () => {
      const recent = calculateSearchScore(
        0.8,
        '/guides/token-optimization',
        'guide',
        undefined,
        new Date().toISOString()
      )

      const old = calculateSearchScore(
        0.8,
        '/guides/token-optimization',
        'guide',
        undefined,
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      )

      expect(recent.finalScore).toBeGreaterThan(old.finalScore)
    })

    it('should return valid score breakdown', () => {
      const result = calculateSearchScore(
        0.7,
        '/cookbook/performance',
        'cookbook',
        'cookbook'
      )

      expect(result.baseScore).toBe(0.7)
      expect(result.priorityScore).toBeGreaterThanOrEqual(0)
      expect(result.categoryBoost).toBeGreaterThanOrEqual(1.0)
      expect(result.freshnessScore).toBeGreaterThan(0)
      expect(result.finalScore).toBeGreaterThan(0)
    })
  })

  describe('Token Optimization Query Detection', () => {
    it('should detect "token" queries', () => {
      expect(isTokenOptimizationQuery('token count')).toBe(true)
      expect(isTokenOptimizationQuery('how many tokens')).toBe(true)
      expect(isTokenOptimizationQuery('tokenization')).toBe(true)
    })

    it('should detect cost-related queries', () => {
      expect(isTokenOptimizationQuery('reduce costs')).toBe(true)
      expect(isTokenOptimizationQuery('pricing')).toBe(true)
      expect(isTokenOptimizationQuery('expensive api calls')).toBe(true)
    })

    it('should detect optimization queries', () => {
      expect(isTokenOptimizationQuery('optimize performance')).toBe(true)
      expect(isTokenOptimizationQuery('efficiency improvements')).toBe(true)
    })

    it('should detect budget/quota queries', () => {
      expect(isTokenOptimizationQuery('api budget')).toBe(true)
      expect(isTokenOptimizationQuery('rate quota')).toBe(true)
    })

    it('should detect savings queries', () => {
      expect(isTokenOptimizationQuery('save money')).toBe(true)
      expect(isTokenOptimizationQuery('cost savings')).toBe(true)
    })

    it('should not detect unrelated queries', () => {
      expect(isTokenOptimizationQuery('hello world')).toBe(false)
      expect(isTokenOptimizationQuery('getting started')).toBe(false)
      expect(isTokenOptimizationQuery('installation')).toBe(false)
    })

    it('should be case-insensitive', () => {
      expect(isTokenOptimizationQuery('TOKEN')).toBe(true)
      expect(isTokenOptimizationQuery('COST')).toBe(true)
      expect(isTokenOptimizationQuery('Budget')).toBe(true)
    })
  })

  describe('Configuration Validation', () => {
    it('should have all required configuration keys', () => {
      expect(searchPriorityConfig).toHaveProperty('contentTypeWeights')
      expect(searchPriorityConfig).toHaveProperty('urlPriorities')
      expect(searchPriorityConfig).toHaveProperty('synonyms')
      expect(searchPriorityConfig).toHaveProperty('categoryBoosts')
      expect(searchPriorityConfig).toHaveProperty('freshnessDecay')
    })

    it('should have valid content type weights', () => {
      const weights = searchPriorityConfig.contentTypeWeights
      expect(weights.cookbook).toBeGreaterThan(weights.guide)
      expect(weights.guide).toBeGreaterThan(weights.concept)
    })

    it('should have URL priorities in descending order by topic', () => {
      const tokenPriorities = searchPriorityConfig.urlPriorities.filter((p) =>
        p.description.toLowerCase().includes('token')
      )

      expect(tokenPriorities.length).toBeGreaterThan(0)

      // First token priority should be highest
      const scores = tokenPriorities.map((p) => p.score)
      expect(scores[0]).toBe(Math.max(...scores))
    })

    it('should have comprehensive synonym coverage', () => {
      const synonyms = searchPriorityConfig.synonyms

      // Token-related synonyms
      expect(synonyms).toHaveProperty('cost')
      expect(synonyms).toHaveProperty('savings')
      expect(synonyms).toHaveProperty('budget')

      // Performance synonyms
      expect(synonyms).toHaveProperty('slow')
      expect(synonyms).toHaveProperty('optimize')

      // Each synonym should map to array
      Object.values(synonyms).forEach((values) => {
        expect(Array.isArray(values)).toBe(true)
        expect(values.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Real-World Query Scenarios', () => {
    it('should prioritize token optimization for "reduce API costs"', () => {
      const query = 'reduce API costs'
      const isTokenQuery = isTokenOptimizationQuery(query)
      const expanded = expandQueryWithSynonyms(query)

      expect(isTokenQuery).toBe(true)
      expect(expanded).toContain('token optimization')
    })

    it('should prioritize token optimization for "how to save money"', () => {
      const query = 'how to save money'
      const expanded = expandQueryWithSynonyms(query)

      expect(expanded).toContain('token optimization')
      expect(expanded).toContain('cost reduction')
    })

    it('should surface token cookbook for cost queries', () => {
      const cookbook = calculateSearchScore(
        0.7,
        '/cookbook/token-optimization',
        'cookbook',
        'cookbook'
      )

      const guide = calculateSearchScore(
        0.7,
        '/guides/getting-started',
        'guide',
        'learn'
      )

      // Token cookbook should score much higher
      expect(cookbook.finalScore).toBeGreaterThan(guide.finalScore * 1.5)
    })

    it('should ensure token content appears in top 3 results', () => {
      // Simulate search results with mixed content
      const results = [
        {
          url: '/cookbook/token-optimization',
          type: 'cookbook',
          category: 'cookbook',
          baseScore: 0.8,
        },
        {
          url: '/guides/getting-started',
          type: 'guide',
          category: 'learn',
          baseScore: 0.85,
        },
        {
          url: '/guides/token-optimization',
          type: 'guide',
          category: 'guides',
          baseScore: 0.75,
        },
        {
          url: '/reference/api/types',
          type: 'guide',
          category: 'reference',
          baseScore: 0.9,
        },
      ]

      const scored = results.map((r) =>
        calculateSearchScore(r.baseScore, r.url, r.type, r.category)
      )

      // Sort by final score
      const sorted = scored
        .map((s, i) => ({ ...s, url: results[i].url }))
        .sort((a, b) => b.finalScore - a.finalScore)

      // Token optimization pages should be in top 3
      const top3 = sorted.slice(0, 3)
      const tokenInTop3 = top3.some((r) => r.url.includes('token-optimization'))

      expect(tokenInTop3).toBe(true)
    })
  })
})
