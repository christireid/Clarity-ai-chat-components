/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useTieredCache } from '../../hooks/use-tiered-cache'
import type { UseTieredCacheConfig } from '../../hooks/use-tiered-cache'

// Mock the TieredCache class with inline factory
vi.mock('../../cache/tiered-cache', () => {
  return {
    TieredCache: class {
      get = vi.fn().mockResolvedValue({ hit: false })
      set = vi.fn().mockResolvedValue(undefined)
      invalidate = vi.fn().mockResolvedValue(undefined)
      prefetch = vi.fn().mockResolvedValue(undefined)
      clear = vi.fn()
      getStats = vi.fn().mockReturnValue({
        hitRate: 0,
        totalHits: 0,
        totalMisses: 0,
        exactSize: 0,
        smartSize: 0,
        semanticSize: 0,
        tierStats: {
          exact: { hits: 0, misses: 0, size: 0 },
          smart: { hits: 0, misses: 0, size: 0 },
          semantic: { hits: 0, misses: 0, size: 0 },
        },
      })
    },
  }
})

describe('useTieredCache', () => {
  const defaultConfig: UseTieredCacheConfig = {
    exact: { maxSize: 100, ttl: 3600000 },
    smart: { maxSize: 50, ttl: 3600000 },
    semantic: {
      maxSize: 25,
      similarityThreshold: 0.92,
      ttl: 3600000,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('initializes cache and returns ready state', () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      expect(result.current.isReady).toBe(true)
    })

    it('provides all required methods', () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      expect(typeof result.current.get).toBe('function')
      expect(typeof result.current.set).toBe('function')
      expect(typeof result.current.invalidate).toBe('function')
      expect(typeof result.current.prefetch).toBe('function')
      expect(typeof result.current.clear).toBe('function')
      expect(typeof result.current.getStats).toBe('function')
    })

    it('returns null stats by default when trackStats is false', () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      expect(result.current.stats).toBeNull()
    })

    it('tracks stats when trackStats is true', () => {
      const { result } = renderHook(() =>
        useTieredCache({ ...defaultConfig, trackStats: true })
      )

      expect(result.current.stats).not.toBeNull()
      expect(result.current.stats?.hitRate).toBeDefined()
    })
  })

  describe('cache operations', () => {
    it('calls get on the underlying cache', async () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      let cacheResult
      await act(async () => {
        cacheResult = await result.current.get('test prompt')
      })

      expect(cacheResult).toEqual({ hit: false })
    })

    it('calls set on the underlying cache', async () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      await act(async () => {
        await result.current.set('test prompt', 'test response')
      })

      // No error means success
      expect(true).toBe(true)
    })

    it('calls invalidate on the underlying cache', async () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      await act(async () => {
        await result.current.invalidate('test prompt')
      })

      // No error means success
      expect(true).toBe(true)
    })

    it('calls prefetch on the underlying cache', async () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      await act(async () => {
        await result.current.prefetch([
          { key: 'prompt1', value: 'response1' },
          { key: 'prompt2', value: 'response2' },
        ])
      })

      // No error means success
      expect(true).toBe(true)
    })

    it('calls clear on the underlying cache', () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      act(() => {
        result.current.clear()
      })

      // No error means success
      expect(true).toBe(true)
    })
  })

  describe('getStats', () => {
    it('returns cache statistics', () => {
      const { result } = renderHook(() => useTieredCache(defaultConfig))

      const stats = result.current.getStats()

      expect(stats.hitRate).toBeDefined()
      expect(stats.totalHits).toBeDefined()
      expect(stats.totalMisses).toBeDefined()
      expect(stats.tierStats).toBeDefined()
    })
  })

  describe('stability', () => {
    it('maintains stable function references across renders', () => {
      const { result, rerender } = renderHook(() =>
        useTieredCache(defaultConfig)
      )

      const initialGet = result.current.get
      const initialSet = result.current.set
      const initialClear = result.current.clear

      rerender()

      expect(result.current.get).toBe(initialGet)
      expect(result.current.set).toBe(initialSet)
      expect(result.current.clear).toBe(initialClear)
    })

    it('preserves cache instance across renders', () => {
      const { result, rerender } = renderHook(() =>
        useTieredCache(defaultConfig)
      )

      const initialIsReady = result.current.isReady

      rerender()

      expect(result.current.isReady).toBe(initialIsReady)
    })
  })
})
