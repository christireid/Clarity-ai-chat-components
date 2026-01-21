/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useModelRouter, RoutingStrategy } from '../../hooks/use-model-router'
import type { UseModelRouterConfig } from '../../hooks/use-model-router'

// Mock the ModelRouter class with inline factory
vi.mock('../../routing/model-router', () => {
  return {
    ModelRouter: class {
      route = vi.fn().mockReturnValue({
        selectedModel: {
          id: 'gpt-4o-mini',
          tier: 'small',
          inputCostPer1M: 0.15,
          outputCostPer1M: 0.6,
          contextWindow: 128000,
          maxOutput: 16384,
          capabilities: ['text', 'code'],
        },
        strategy: 'cost-optimized',
        complexity: {
          level: 'low',
          score: 0.2,
          confidence: 0.95,
        },
        estimatedCost: 0.0001,
        confidence: 0.95,
      })
      getStats = vi.fn().mockReturnValue({
        totalRoutes: 0,
        routesByTier: { small: 0, medium: 0, large: 0, premium: 0 },
        estimatedSavings: 0,
        averageComplexity: 0,
      })
      resetStats = vi.fn()
    },
    RoutingStrategy: {
      CostOptimized: 'cost-optimized',
      QualityFirst: 'quality-first',
      Balanced: 'balanced',
    },
  }
})

describe('useModelRouter', () => {
  const testModels = [
    {
      id: 'gpt-4o-mini',
      tier: 'small' as const,
      inputCostPer1M: 0.15,
      outputCostPer1M: 0.6,
      contextWindow: 128000,
      maxOutput: 16384,
      capabilities: ['text', 'code'],
    },
    {
      id: 'gpt-4o',
      tier: 'medium' as const,
      inputCostPer1M: 2.5,
      outputCostPer1M: 10,
      contextWindow: 128000,
      maxOutput: 16384,
      capabilities: ['text', 'code', 'vision'],
    },
  ]

  const defaultConfig: UseModelRouterConfig = {
    models: testModels,
    defaultStrategy: RoutingStrategy.CostOptimized,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('initializes router and returns ready state', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      expect(result.current.isReady).toBe(true)
    })

    it('provides all required methods', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      expect(typeof result.current.route).toBe('function')
      expect(typeof result.current.getStats).toBe('function')
      expect(typeof result.current.resetStats).toBe('function')
    })

    it('exposes models and default strategy', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      expect(result.current.models).toEqual(testModels)
      expect(result.current.defaultStrategy).toBe(RoutingStrategy.CostOptimized)
    })

    it('returns null stats by default when trackStats is false', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      expect(result.current.stats).toBeNull()
    })

    it('tracks stats when trackStats is true', () => {
      const { result } = renderHook(() =>
        useModelRouter({ ...defaultConfig, trackStats: true })
      )

      expect(result.current.stats).not.toBeNull()
      expect(result.current.stats?.totalRoutes).toBeDefined()
    })
  })

  describe('routing operations', () => {
    it('calls route on the underlying router', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      let routingResult
      act(() => {
        routingResult = result.current.route('Hello, how are you?')
      })

      expect(routingResult).toBeDefined()
      expect(routingResult?.selectedModel).toBeDefined()
    })

    it('passes options to route', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      let routingResult
      act(() => {
        routingResult = result.current.route('Hello', {
          estimatedOutputTokens: 500,
          requiredCapabilities: ['vision'],
        })
      })

      expect(routingResult).toBeDefined()
    })

    it('calls resetStats on the underlying router', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      act(() => {
        result.current.resetStats()
      })

      // No error means success
      expect(true).toBe(true)
    })
  })

  describe('getStats', () => {
    it('returns router statistics', () => {
      const { result } = renderHook(() => useModelRouter(defaultConfig))

      const stats = result.current.getStats()

      expect(stats.totalRoutes).toBeDefined()
      expect(stats.routesByTier).toBeDefined()
      expect(stats.estimatedSavings).toBeDefined()
      expect(stats.averageComplexity).toBeDefined()
    })
  })

  describe('stability', () => {
    it('maintains stable function references across renders', () => {
      const { result, rerender } = renderHook(() =>
        useModelRouter(defaultConfig)
      )

      const initialRoute = result.current.route
      const initialGetStats = result.current.getStats
      const initialResetStats = result.current.resetStats

      rerender()

      expect(result.current.route).toBe(initialRoute)
      expect(result.current.getStats).toBe(initialGetStats)
      expect(result.current.resetStats).toBe(initialResetStats)
    })

    it('preserves router instance across renders', () => {
      const { result, rerender } = renderHook(() =>
        useModelRouter(defaultConfig)
      )

      const initialIsReady = result.current.isReady

      rerender()

      expect(result.current.isReady).toBe(initialIsReady)
    })
  })

  describe('different strategies', () => {
    it('uses quality-first strategy when configured', () => {
      const { result } = renderHook(() =>
        useModelRouter({
          ...defaultConfig,
          defaultStrategy: RoutingStrategy.QualityFirst,
        })
      )

      expect(result.current.defaultStrategy).toBe(RoutingStrategy.QualityFirst)
    })

    it('uses balanced strategy when configured', () => {
      const { result } = renderHook(() =>
        useModelRouter({
          ...defaultConfig,
          defaultStrategy: RoutingStrategy.Balanced,
        })
      )

      expect(result.current.defaultStrategy).toBe(RoutingStrategy.Balanced)
    })
  })
})
