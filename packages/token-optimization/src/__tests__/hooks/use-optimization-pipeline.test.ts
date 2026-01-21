/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useOptimizationPipeline,
  CompressionLevel,
  RoutingStrategy,
} from '../../hooks/use-optimization-pipeline'
import type { OptimizationPipelineConfig } from '../../hooks/use-optimization-pipeline'

// Mock the TieredCache class
vi.mock('../../cache/tiered-cache', () => {
  return {
    TieredCache: class {
      get = vi.fn().mockResolvedValue({ hit: false })
      set = vi.fn().mockResolvedValue(undefined)
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

// Mock the MarkdownCompressor class
vi.mock('../../compression/markdown-compressor', () => {
  return {
    MarkdownCompressor: class {
      compress = vi.fn().mockImplementation((content: string) => ({
        compressed: content,
        originalSize: content.length,
        compressedSize: content.length,
        savingsPercent: 0,
        estimatedTokensSaved: 0,
        toonApplied: false,
      }))
    },
    CompressionLevel: {
      Light: 'light',
      Moderate: 'moderate',
      Aggressive: 'aggressive',
    },
  }
})

// Mock the ModelRouter class
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

describe('useOptimizationPipeline', () => {
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
  ]

  const fullConfig: OptimizationPipelineConfig = {
    cache: {
      exact: { maxSize: 100, ttl: 3600000 },
      smart: { maxSize: 50, ttl: 3600000 },
      semantic: { maxSize: 25, similarityThreshold: 0.92, ttl: 3600000 },
    },
    compressionLevel: CompressionLevel.Moderate,
    router: {
      models: testModels,
      defaultStrategy: RoutingStrategy.CostOptimized,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('initializes and returns ready state', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      expect(result.current.isReady).toBe(true)
    })

    it('provides all required methods', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      expect(typeof result.current.process).toBe('function')
      expect(typeof result.current.cacheResponse).toBe('function')
      expect(typeof result.current.compress).toBe('function')
      expect(typeof result.current.route).toBe('function')
      expect(typeof result.current.getStats).toBe('function')
      expect(typeof result.current.resetStats).toBe('function')
      expect(typeof result.current.clearCache).toBe('function')
    })

    it('reports correct feature flags with all features enabled', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      expect(result.current.features.caching).toBe(true)
      expect(result.current.features.compression).toBe(true)
      expect(result.current.features.routing).toBe(true)
    })

    it('reports correct feature flags with only caching enabled', () => {
      const { result } = renderHook(() =>
        useOptimizationPipeline({
          cache: fullConfig.cache,
        })
      )

      expect(result.current.features.caching).toBe(true)
      expect(result.current.features.compression).toBe(false)
      expect(result.current.features.routing).toBe(false)
    })

    it('returns null stats by default when trackStats is false', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      expect(result.current.stats).toBeNull()
    })

    it('tracks stats when trackStats is true', () => {
      const { result } = renderHook(() =>
        useOptimizationPipeline({ ...fullConfig, trackStats: true })
      )

      expect(result.current.stats).not.toBeNull()
      expect(result.current.stats?.totalProcessed).toBeDefined()
    })
  })

  describe('process', () => {
    it('processes a prompt and returns result', async () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      let pipelineResult
      await act(async () => {
        pipelineResult = await result.current.process('Hello, how are you?')
      })

      expect(pipelineResult).toBeDefined()
      expect(pipelineResult?.originalPrompt).toBe('Hello, how are you?')
      expect(pipelineResult?.processedPrompt).toBeDefined()
      expect(pipelineResult?.processingTime).toBeGreaterThanOrEqual(0)
    })

    it('returns routing result when router is configured', async () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      let pipelineResult
      await act(async () => {
        pipelineResult = await result.current.process('Hello')
      })

      expect(pipelineResult?.routingResult).toBeDefined()
      expect(pipelineResult?.selectedModelId).toBe('gpt-4o-mini')
      expect(pipelineResult?.estimatedCost).toBeDefined()
    })

    it('returns compression result when compression is configured', async () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      let pipelineResult
      await act(async () => {
        pipelineResult = await result.current.process('Hello')
      })

      expect(pipelineResult?.compressionResult).toBeDefined()
    })

    it('returns cache miss when not cached', async () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      let pipelineResult
      await act(async () => {
        pipelineResult = await result.current.process('Hello')
      })

      expect(pipelineResult?.cacheHit).toBe(false)
      expect(pipelineResult?.cachedResponse).toBeUndefined()
    })
  })

  describe('cacheResponse', () => {
    it('caches a response', async () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      await act(async () => {
        await result.current.cacheResponse('Hello', 'World')
      })

      // No error means success
      expect(true).toBe(true)
    })
  })

  describe('compress', () => {
    it('compresses content', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      let compressionResult
      act(() => {
        compressionResult = result.current.compress('# Hello World')
      })

      expect(compressionResult).toBeDefined()
      expect(compressionResult?.compressed).toBeDefined()
    })

    it('returns original content when compression not configured', () => {
      const { result } = renderHook(() =>
        useOptimizationPipeline({ cache: fullConfig.cache })
      )

      let compressionResult
      act(() => {
        compressionResult = result.current.compress('# Hello World')
      })

      expect(compressionResult?.compressed).toBe('# Hello World')
    })
  })

  describe('route', () => {
    it('routes a prompt', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      let routingResult
      act(() => {
        routingResult = result.current.route('Hello')
      })

      expect(routingResult).toBeDefined()
      expect(routingResult?.selectedModel).toBeDefined()
    })

    it('returns null when router not configured', () => {
      const { result } = renderHook(() =>
        useOptimizationPipeline({ cache: fullConfig.cache })
      )

      let routingResult
      act(() => {
        routingResult = result.current.route('Hello')
      })

      expect(routingResult).toBeNull()
    })
  })

  describe('getStats', () => {
    it('returns combined statistics', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      const stats = result.current.getStats()

      expect(stats.totalProcessed).toBeDefined()
      expect(stats.compressionTokensSaved).toBeDefined()
      expect(stats.cacheHitRate).toBeDefined()
    })
  })

  describe('resetStats', () => {
    it('resets all statistics', async () => {
      const { result } = renderHook(() =>
        useOptimizationPipeline({ ...fullConfig, trackStats: true })
      )

      // Process a prompt first
      await act(async () => {
        await result.current.process('Hello')
      })

      // Reset stats
      act(() => {
        result.current.resetStats()
      })

      const stats = result.current.getStats()
      expect(stats.totalProcessed).toBe(0)
    })
  })

  describe('clearCache', () => {
    it('clears the cache', () => {
      const { result } = renderHook(() => useOptimizationPipeline(fullConfig))

      act(() => {
        result.current.clearCache()
      })

      // No error means success
      expect(true).toBe(true)
    })
  })

  describe('stability', () => {
    it('maintains stable function references across renders', () => {
      const { result, rerender } = renderHook(() =>
        useOptimizationPipeline(fullConfig)
      )

      const initialProcess = result.current.process
      const initialCompress = result.current.compress
      const initialRoute = result.current.route

      rerender()

      expect(result.current.process).toBe(initialProcess)
      expect(result.current.compress).toBe(initialCompress)
      expect(result.current.route).toBe(initialRoute)
    })
  })
})
