/**
 * Tests for useCacheStats hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCacheStats, useCacheComparison } from '../../hooks/use-cache-stats'

// Mock cache implementation
class MockCache {
  private hits = 0
  private misses = 0
  private entries = new Map<string, any>()

  get(key: string): any {
    if (this.entries.has(key)) {
      this.hits++
      return this.entries.get(key)
    }
    this.misses++
    return undefined
  }

  set(key: string, value: any): void {
    this.entries.set(key, value)
  }

  getStats() {
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.entries.size,
    }
  }

  clear() {
    this.entries.clear()
    this.hits = 0
    this.misses = 0
  }
}

describe('useCacheStats', () => {
  let mockCache: MockCache

  beforeEach(() => {
    mockCache = new MockCache()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Basic Functionality', () => {
    it('should initialize with zero stats', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 1000,
        })
      )

      expect(result.current.stats).toEqual({
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalOperations: 0,
        size: 0,
        tokensSaved: 0,
        costSaved: 0,
      })
    })

    it('should track cache hits', async () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 100,
        })
      )

      // Trigger cache operations
      mockCache.get('key1') // hit
      mockCache.get('key2') // miss

      // Manually update stats
      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hits).toBe(1)
      expect(result.current.stats.misses).toBe(1)
      expect(result.current.stats.totalOperations).toBe(2)
    })

    it('should calculate hit rate correctly', () => {
      mockCache.set('key1', 'value1')
      mockCache.set('key2', 'value2')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // 2 hits, 1 miss = 2/3 = 0.666...
      mockCache.get('key1') // hit
      mockCache.get('key2') // hit
      mockCache.get('key3') // miss

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hitRate).toBeCloseTo(0.667, 2)
    })

    it('should track cache size', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      mockCache.set('key1', 'value1')
      mockCache.set('key2', 'value2')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.size).toBe(2)
    })
  })

  describe('Token and Cost Tracking', () => {
    it('should calculate tokens saved', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          avgTokensPerResponse: 500,
        })
      )

      mockCache.get('key1') // 1 hit
      mockCache.get('key1') // 2 hits

      act(() => {
        result.current.updateStats()
      })

      // 2 hits * 500 tokens = 1000 tokens saved
      expect(result.current.stats.tokensSaved).toBe(1000)
    })

    it('should calculate cost saved', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          avgTokensPerResponse: 1000,
          tokenCostPer1M: 10, // $10 per 1M tokens
        })
      )

      mockCache.get('key1') // 1 hit = 1000 tokens saved

      act(() => {
        result.current.updateStats()
      })

      // (1000 / 1,000,000) * $10 = $0.01
      expect(result.current.stats.costSaved).toBeCloseTo(0.01, 4)
    })

    it('should handle custom token and cost values', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          avgTokensPerResponse: 2000,
          tokenCostPer1M: 5,
        })
      )

      // Create 10 hits
      for (let i = 0; i < 10; i++) {
        mockCache.get('key1')
      }

      act(() => {
        result.current.updateStats()
      })

      // 10 hits * 2000 tokens = 20,000 tokens saved
      expect(result.current.stats.tokensSaved).toBe(20000)

      // (20,000 / 1,000,000) * $5 = $0.10
      expect(result.current.stats.costSaved).toBeCloseTo(0.1, 4)
    })

    it('should not calculate cost when tokenCostPer1M is zero', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          avgTokensPerResponse: 500,
          tokenCostPer1M: 0,
        })
      )

      mockCache.get('key1')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.costSaved).toBe(0)
    })
  })

  describe('Performance Metrics', () => {
    it('should calculate performance metrics', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // High hit rate scenario
      for (let i = 0; i < 8; i++) {
        mockCache.get('key1') // hits
      }
      for (let i = 0; i < 2; i++) {
        mockCache.get(`miss-${i}`) // misses
      }

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.performance).toBeTruthy()
      expect(result.current.performance.hitRate).toBeCloseTo(0.8, 2)
      expect(result.current.performance.rating).toBeTruthy()
      expect(result.current.performance.color).toBeTruthy()
    })

    it('should rate excellent performance (>80% hit rate)', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // 9 hits, 1 miss = 90% hit rate
      for (let i = 0; i < 9; i++) {
        mockCache.get('key1')
      }
      mockCache.get('miss')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.performance.rating).toBe('excellent')
      expect(result.current.performance.color).toBe('green')
    })

    it('should rate good performance (60-80% hit rate)', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // 7 hits, 3 misses = 70% hit rate
      for (let i = 0; i < 7; i++) {
        mockCache.get('key1')
      }
      for (let i = 0; i < 3; i++) {
        mockCache.get(`miss-${i}`)
      }

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.performance.rating).toBe('good')
      expect(result.current.performance.color).toBe('blue')
    })

    it('should rate fair performance (40-60% hit rate)', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // 5 hits, 5 misses = 50% hit rate
      for (let i = 0; i < 5; i++) {
        mockCache.get('key1')
      }
      for (let i = 0; i < 5; i++) {
        mockCache.get(`miss-${i}`)
      }

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.performance.rating).toBe('fair')
      expect(result.current.performance.color).toBe('yellow')
    })

    it('should rate poor performance (<40% hit rate)', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // 2 hits, 8 misses = 20% hit rate
      mockCache.set('key1', 'value1')
      for (let i = 0; i < 2; i++) {
        mockCache.get('key1')
      }
      for (let i = 0; i < 8; i++) {
        mockCache.get(`miss-${i}`)
      }

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.performance.rating).toBe('poor')
      expect(result.current.performance.color).toBe('red')
    })
  })

  describe('Auto-Update', () => {
    it('should auto-update stats at interval', async () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 100,
        })
      )

      mockCache.set('key1', 'value1')
      mockCache.get('key1')

      // Initial stats should be 0
      expect(result.current.stats.hits).toBe(0)

      // Advance timer past update interval
      await act(async () => {
        vi.advanceTimersByTime(150)
      })

      // Stats should be updated
      await waitFor(() => {
        expect(result.current.stats.hits).toBe(1)
      })
    })

    it('should update multiple times', async () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 100,
        })
      )

      mockCache.set('key1', 'value1')

      // First update
      mockCache.get('key1')
      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      // Second update
      mockCache.get('key1')
      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      await waitFor(() => {
        expect(result.current.stats.hits).toBe(2)
      })
    })

    it('should clean up interval on unmount', () => {
      const { unmount } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 100,
        })
      )

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval')

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
    })
  })

  describe('Manual Updates', () => {
    it('should allow manual stats update', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 10000, // Long interval
        })
      )

      mockCache.set('key1', 'value1')
      mockCache.get('key1')

      expect(result.current.stats.hits).toBe(0)

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hits).toBe(1)
    })

    it('should update stats on demand', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      // Multiple manual updates
      mockCache.set('key1', 'value1')
      mockCache.get('key1')

      act(() => {
        result.current.updateStats()
      })

      const hitsAfterFirst = result.current.stats.hits

      mockCache.get('key1')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hits).toBeGreaterThan(hitsAfterFirst)
    })
  })

  describe('Reset Functionality', () => {
    it('should reset stats', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      mockCache.set('key1', 'value1')
      mockCache.get('key1')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hits).toBe(1)

      act(() => {
        result.current.resetStats()
      })

      expect(result.current.stats).toEqual({
        hits: 0,
        misses: 0,
        hitRate: 0,
        totalOperations: 0,
        size: 0,
        tokensSaved: 0,
        costSaved: 0,
      })
    })

    it('should reset cache when requested', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      mockCache.set('key1', 'value1')
      mockCache.set('key2', 'value2')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.size).toBe(2)

      act(() => {
        result.current.resetStats()
      })

      // Cache should be cleared
      expect(mockCache.getStats().size).toBe(0)
    })
  })

  describe('Tracking State', () => {
    it('should track isTracking state', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      expect(result.current.isTracking).toBe(true)
    })

    it('should maintain tracking across updates', async () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          updateInterval: 100,
        })
      )

      expect(result.current.isTracking).toBe(true)

      await act(async () => {
        vi.advanceTimersByTime(100)
      })

      expect(result.current.isTracking).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle zero operations', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hitRate).toBe(0)
      expect(result.current.stats.totalOperations).toBe(0)
    })

    it('should handle only hits', () => {
      mockCache.set('key1', 'value1')

      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      mockCache.get('key1')
      mockCache.get('key1')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hitRate).toBe(1)
      expect(result.current.stats.misses).toBe(0)
    })

    it('should handle only misses', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
        })
      )

      mockCache.get('missing1')
      mockCache.get('missing2')

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.hitRate).toBe(0)
      expect(result.current.stats.hits).toBe(0)
    })

    it('should handle very large numbers', () => {
      const { result } = renderHook(() =>
        useCacheStats({
          cache: mockCache as any,
          avgTokensPerResponse: 10000,
        })
      )

      mockCache.set('key1', 'value1')

      // Simulate many hits
      for (let i = 0; i < 1000; i++) {
        mockCache.get('key1')
      }

      act(() => {
        result.current.updateStats()
      })

      expect(result.current.stats.tokensSaved).toBe(10000000) // 1000 hits * 10000 tokens
    })
  })
})

describe('useCacheComparison', () => {
  let cache1: MockCache
  let cache2: MockCache

  beforeEach(() => {
    cache1 = new MockCache()
    cache2 = new MockCache()
  })

  it('should compare two caches', () => {
    const { result } = renderHook(() =>
      useCacheComparison({
        cache1: cache1 as any,
        cache2: cache2 as any,
        label1: 'Memory Cache',
        label2: 'Disk Cache',
      })
    )

    cache1.set('key1', 'value1')
    cache2.set('key1', 'value1')

    cache1.get('key1')
    cache1.get('key1')
    cache2.get('key1')

    act(() => {
      result.current.cache1Stats.updateStats()
      result.current.cache2Stats.updateStats()
    })

    expect(result.current.comparison).toBeTruthy()
    expect(result.current.comparison.cache1HitRate).toBeGreaterThan(
      result.current.comparison.cache2HitRate
    )
  })

  it('should identify better performing cache', () => {
    const { result } = renderHook(() =>
      useCacheComparison({
        cache1: cache1 as any,
        cache2: cache2 as any,
      })
    )

    cache1.set('key1', 'value1')
    cache2.set('key1', 'value1')

    // Cache 1: 90% hit rate
    for (let i = 0; i < 9; i++) {
      cache1.get('key1')
    }
    cache1.get('miss')

    // Cache 2: 50% hit rate
    for (let i = 0; i < 5; i++) {
      cache2.get('key1')
    }
    for (let i = 0; i < 5; i++) {
      cache2.get(`miss-${i}`)
    }

    act(() => {
      result.current.cache1Stats.updateStats()
      result.current.cache2Stats.updateStats()
    })

    expect(result.current.comparison.betterCache).toBe('cache1')
    expect(result.current.comparison.hitRateDifference).toBeGreaterThan(0)
  })

  it('should calculate hit rate difference', () => {
    const { result } = renderHook(() =>
      useCacheComparison({
        cache1: cache1 as any,
        cache2: cache2 as any,
      })
    )

    cache1.set('key1', 'value1')
    cache2.set('key1', 'value1')

    // Cache 1: 100% hit rate (1/1)
    cache1.get('key1')

    // Cache 2: 50% hit rate (1/2)
    cache2.get('key1')
    cache2.get('miss')

    act(() => {
      result.current.cache1Stats.updateStats()
      result.current.cache2Stats.updateStats()
    })

    expect(result.current.comparison.hitRateDifference).toBeCloseTo(0.5, 2)
  })
})
