/**
 * @vitest-environment happy-dom
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  trackSearchQuery,
  trackSearchClick,
  getAnalyticsSummary,
  clearAnalytics,
  exportAnalytics,
} from '../search-analytics'

describe('search-analytics', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset mocked timers
    vi.useRealTimers()
  })

  describe('trackSearchQuery', () => {
    it('tracks a search query', () => {
      trackSearchQuery('test query', 5)

      const summary = getAnalyticsSummary()
      expect(summary.totalQueries).toBe(1)
      expect(summary.topQueries[0].query).toBe('test query')
    })

    it('normalizes query to lowercase', () => {
      trackSearchQuery('TeSt QuErY', 5)

      const summary = getAnalyticsSummary()
      expect(summary.topQueries[0].query).toBe('test query')
    })

    it('trims whitespace from query', () => {
      trackSearchQuery('  test  ', 5)

      const summary = getAnalyticsSummary()
      expect(summary.topQueries[0].query).toBe('test')
    })

    it('tracks "no results" queries separately', () => {
      trackSearchQuery('missing', 0)

      const summary = getAnalyticsSummary()
      expect(summary.noResultsQueries).toContain('missing')
    })

    it('deduplicates rapid-fire queries within 1 second', () => {
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      trackSearchQuery('test', 5)
      trackSearchQuery('test', 5) // Should be ignored

      const summary = getAnalyticsSummary()
      expect(summary.totalQueries).toBe(1)

      vi.useRealTimers()
    })

    it('allows same query after 1 second', () => {
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      trackSearchQuery('test', 5)

      // Advance time by 1.1 seconds
      vi.setSystemTime(now + 1100)
      trackSearchQuery('test', 5)

      const summary = getAnalyticsSummary()
      expect(summary.totalQueries).toBe(2)

      vi.useRealTimers()
    })

    it('tracks different queries separately', () => {
      trackSearchQuery('first', 3)
      trackSearchQuery('second', 2)

      const summary = getAnalyticsSummary()
      expect(summary.totalQueries).toBe(2)
      expect(summary.uniqueQueries).toBe(2)
    })
  })

  describe('trackSearchClick', () => {
    it('tracks a search click', () => {
      trackSearchClick('test', '/docs/test', 'Test Page')

      const summary = getAnalyticsSummary()
      expect(summary.totalClicks).toBe(1)
      expect(summary.topClicks[0].href).toBe('/docs/test')
      expect(summary.topClicks[0].title).toBe('Test Page')
    })

    it('normalizes query to lowercase', () => {
      trackSearchClick('TeSt', '/docs/test', 'Test Page')

      // Verify it doesn't throw and stores correctly
      const data = JSON.parse(
        localStorage.getItem('clarity-search-analytics') || '{}'
      )
      expect(data.clicks[0].query).toBe('test')
    })

    it('counts clicks per href', () => {
      trackSearchClick('query1', '/page1', 'Page 1')
      trackSearchClick('query2', '/page1', 'Page 1')
      trackSearchClick('query3', '/page2', 'Page 2')

      const summary = getAnalyticsSummary()
      expect(summary.topClicks[0].count).toBe(2)
      expect(summary.topClicks[0].href).toBe('/page1')
    })
  })

  describe('getAnalyticsSummary', () => {
    it('returns empty summary when no data', () => {
      const summary = getAnalyticsSummary()

      expect(summary.totalQueries).toBe(0)
      expect(summary.uniqueQueries).toBe(0)
      expect(summary.totalClicks).toBe(0)
      expect(summary.noResultsQueries).toEqual([])
      expect(summary.topQueries).toEqual([])
      expect(summary.topClicks).toEqual([])
    })

    it('sorts top queries by frequency', () => {
      vi.useFakeTimers()
      const now = Date.now()

      // Track queries with time gaps to avoid deduplication
      vi.setSystemTime(now)
      trackSearchQuery('rare', 5)

      vi.setSystemTime(now + 1100)
      trackSearchQuery('common', 5)

      vi.setSystemTime(now + 2200)
      trackSearchQuery('common', 5)

      vi.setSystemTime(now + 3300)
      trackSearchQuery('common', 5)

      vi.setSystemTime(now + 4400)
      trackSearchQuery('medium', 5)

      vi.setSystemTime(now + 5500)
      trackSearchQuery('medium', 5)

      vi.useRealTimers()

      const summary = getAnalyticsSummary()
      expect(summary.topQueries[0].query).toBe('common')
      expect(summary.topQueries[0].count).toBe(3)
      expect(summary.topQueries[1].query).toBe('medium')
      expect(summary.topQueries[1].count).toBe(2)
    })

    it('limits top queries to 20', () => {
      // Add 25 unique queries
      for (let i = 0; i < 25; i++) {
        trackSearchQuery(`query${i}`, 1)
      }

      const summary = getAnalyticsSummary()
      expect(summary.topQueries.length).toBeLessThanOrEqual(20)
    })

    it('limits top clicks to 20', () => {
      // Add 25 unique clicks
      for (let i = 0; i < 25; i++) {
        trackSearchClick('query', `/page${i}`, `Page ${i}`)
      }

      const summary = getAnalyticsSummary()
      expect(summary.topClicks.length).toBeLessThanOrEqual(20)
    })
  })

  describe('clearAnalytics', () => {
    it('removes all analytics data', () => {
      trackSearchQuery('test', 5)
      trackSearchClick('test', '/page', 'Page')

      clearAnalytics()

      const summary = getAnalyticsSummary()
      expect(summary.totalQueries).toBe(0)
      expect(summary.totalClicks).toBe(0)
    })
  })

  describe('exportAnalytics', () => {
    it('returns valid JSON string', () => {
      trackSearchQuery('test', 5)

      const exported = exportAnalytics()
      const parsed = JSON.parse(exported)

      expect(parsed).toHaveProperty('queries')
      expect(parsed).toHaveProperty('clicks')
      expect(parsed).toHaveProperty('noResults')
    })

    it('returns empty structure when no data', () => {
      const exported = exportAnalytics()
      const parsed = JSON.parse(exported)

      expect(parsed.queries).toEqual([])
      expect(parsed.clicks).toEqual([])
      expect(parsed.noResults).toEqual([])
    })
  })

  describe('storage limits', () => {
    it('trims entries to MAX_ENTRIES (500)', () => {
      // Add more than 500 queries
      for (let i = 0; i < 510; i++) {
        trackSearchQuery(`query${i}`, 1)
      }

      const data = JSON.parse(
        localStorage.getItem('clarity-search-analytics') || '{}'
      )
      expect(data.queries.length).toBeLessThanOrEqual(500)
    })
  })

  describe('error handling', () => {
    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw
      const originalSetItem = localStorage.setItem
      localStorage.setItem = () => {
        throw new Error('QuotaExceeded')
      }

      // Should not throw
      expect(() => trackSearchQuery('test', 5)).not.toThrow()

      // Restore
      localStorage.setItem = originalSetItem
    })

    it('handles invalid JSON in localStorage', () => {
      localStorage.setItem('clarity-search-analytics', 'invalid json')

      // Should not throw and return default structure
      const summary = getAnalyticsSummary()
      expect(summary.totalQueries).toBe(0)
    })
  })
})
