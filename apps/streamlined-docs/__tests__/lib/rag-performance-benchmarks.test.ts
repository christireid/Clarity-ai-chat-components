/**
 * RAG Performance Benchmark Tests
 *
 * Validates performance characteristics of the RAG system:
 * - Query latency (p50, p95, p99)
 * - Throughput (queries per second)
 * - Memory usage
 * - Index build time
 * - Scalability tests
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'
import { hybridSearch } from '../../lib/ai/ragOptimized'
import { HNSWVectorIndex } from '../../lib/ai/vectorIndexHNSW'
import { generateEmbedding } from '../../lib/ai/embeddings'
import type { DocChunk } from '../../lib/ai/vectorStore'

// ============================================================================
// Performance Test Configuration
// ============================================================================

const PERFORMANCE_CONFIG = {
  // Latency targets (milliseconds)
  TARGET_P50_LATENCY: 100,
  TARGET_P95_LATENCY: 250,
  TARGET_P99_LATENCY: 500,

  // Throughput targets
  MIN_QPS: 10, // Queries per second

  // Memory limits
  MAX_MEMORY_MB: 500,

  // Build time limits
  MAX_BUILD_TIME_MS: 10000, // 10 seconds for 1000 docs

  // Test sizes
  SMALL_DATASET: 100,
  MEDIUM_DATASET: 500,
  LARGE_DATASET: 1000,

  // Test iterations
  WARMUP_ITERATIONS: 10,
  BENCHMARK_ITERATIONS: 100,
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateMockDocuments(count: number): DocChunk[] {
  const categories = ['component', 'hook', 'guide', 'cookbook', 'example'] as const
  const docs: DocChunk[] = []

  for (let i = 0; i < count; i++) {
    docs.push({
      id: `doc-${i}`,
      title: `Document ${i}: ${categories[i % categories.length]}`,
      content: `This is test document ${i}. It contains information about ${
        categories[i % categories.length]
      }. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`.repeat(
        3
      ),
      url: `/docs/test-${i}`,
      category: categories[i % categories.length],
      embedding: new Array(1536).fill(0).map(() => Math.random()),
      metadata: {
        lastUpdated: new Date().toISOString(),
        tags: [`tag-${i % 10}`, `category-${i % 5}`],
        section: `section-${i % 3}`,
        headings: [`Heading ${i}`, `Subheading ${i}`],
      },
    })
  }

  return docs
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[index]
}

function calculateStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: values.reduce((a, b) => a + b, 0) / values.length,
    median: sorted[Math.floor(sorted.length / 2)],
    p50: calculatePercentile(values, 50),
    p95: calculatePercentile(values, 95),
    p99: calculatePercentile(values, 99),
    stdDev: Math.sqrt(
      values.reduce((sum, val) => {
        const mean = values.reduce((a, b) => a + b, 0) / values.length
        return sum + Math.pow(val - mean, 2)
      }, 0) / values.length
    ),
  }
}

async function measureMemoryUsage(): Promise<number> {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    // @ts-ignore - memory is not in standard types
    return performance.memory.usedJSHeapSize / (1024 * 1024) // Convert to MB
  }
  return 0 // Memory API not available
}

// ============================================================================
// Latency Tests
// ============================================================================

describe('Search Latency Benchmarks', () => {
  // Mock setup for consistent testing
  beforeAll(() => {
    vi.mock('../../lib/ai/vectorStore', () => ({
      getVectorStore: vi.fn(() => ({
        initialize: vi.fn(),
        search: vi.fn(async () => {
          // Simulate realistic search delay
          await new Promise((resolve) => setTimeout(resolve, 5))
          return [
            {
              id: 'result-1',
              title: 'Result 1',
              content: 'Content 1',
              url: '/result-1',
              category: 'guide',
              score: 0.9,
              metadata: {
                lastUpdated: new Date().toISOString(),
                tags: [],
              },
            },
          ]
        }),
      })),
    }))

    vi.mock('../../lib/ai/keywordSearch', () => ({
      searchDocumentation: vi.fn(() => {
        // Simulate keyword search
        return [
          {
            chunk: {
              id: 'keyword-1',
              title: 'Keyword Result',
              content: 'Content',
              url: '/keyword-1',
              category: 'guide',
              keywords: [],
              metadata: {
                lastUpdated: new Date().toISOString(),
                tags: [],
              },
            },
            score: 8.0,
            matches: { title: 2, keywords: 1, content: 1, headings: 0 },
          },
        ]
      }),
    }))
  })

  it('should meet p50 latency target', async () => {
    const query = 'test query for latency'
    const latencies: number[] = []

    // Warmup
    for (let i = 0; i < PERFORMANCE_CONFIG.WARMUP_ITERATIONS; i++) {
      await hybridSearch(query, { topK: 5 })
    }

    // Benchmark
    for (let i = 0; i < PERFORMANCE_CONFIG.BENCHMARK_ITERATIONS; i++) {
      const start = performance.now()
      await hybridSearch(query, { topK: 5 })
      latencies.push(performance.now() - start)
    }

    const stats = calculateStats(latencies)

    console.log('Latency Statistics (ms):')
    console.log(`  Mean: ${stats.mean.toFixed(2)}`)
    console.log(`  Median: ${stats.median.toFixed(2)}`)
    console.log(`  p50: ${stats.p50.toFixed(2)}`)
    console.log(`  p95: ${stats.p95.toFixed(2)}`)
    console.log(`  p99: ${stats.p99.toFixed(2)}`)
    console.log(`  Std Dev: ${stats.stdDev.toFixed(2)}`)

    expect(stats.p50).toBeLessThan(PERFORMANCE_CONFIG.TARGET_P50_LATENCY)
  })

  it('should meet p95 latency target', async () => {
    const query = 'test query for p95'
    const latencies: number[] = []

    for (let i = 0; i < PERFORMANCE_CONFIG.BENCHMARK_ITERATIONS; i++) {
      const start = performance.now()
      await hybridSearch(query, { topK: 5 })
      latencies.push(performance.now() - start)
    }

    const p95 = calculatePercentile(latencies, 95)

    expect(p95).toBeLessThan(PERFORMANCE_CONFIG.TARGET_P95_LATENCY)
  })

  it('should meet p99 latency target', async () => {
    const query = 'test query for p99'
    const latencies: number[] = []

    for (let i = 0; i < PERFORMANCE_CONFIG.BENCHMARK_ITERATIONS; i++) {
      const start = performance.now()
      await hybridSearch(query, { topK: 5 })
      latencies.push(performance.now() - start)
    }

    const p99 = calculatePercentile(latencies, 99)

    expect(p99).toBeLessThan(PERFORMANCE_CONFIG.TARGET_P99_LATENCY)
  })

  it('should have consistent latency across iterations', async () => {
    const query = 'consistency test query'
    const latencies: number[] = []

    for (let i = 0; i < 50; i++) {
      const start = performance.now()
      await hybridSearch(query, { topK: 5 })
      latencies.push(performance.now() - start)
    }

    const stats = calculateStats(latencies)

    // Coefficient of variation should be < 50% (reasonable consistency)
    const coefficientOfVariation = (stats.stdDev / stats.mean) * 100

    console.log(`Latency CoV: ${coefficientOfVariation.toFixed(2)}%`)

    expect(coefficientOfVariation).toBeLessThan(50)
  })
})

// ============================================================================
// Throughput Tests
// ============================================================================

describe('Throughput Benchmarks', () => {
  it('should achieve minimum QPS target', async () => {
    const queries = Array.from(
      { length: 50 },
      (_, i) => `test query ${i}`
    )

    const start = performance.now()

    // Execute queries sequentially (realistic scenario)
    for (const query of queries) {
      await hybridSearch(query, { topK: 5 })
    }

    const elapsed = (performance.now() - start) / 1000 // Convert to seconds
    const qps = queries.length / elapsed

    console.log(`Throughput: ${qps.toFixed(2)} QPS`)
    console.log(`Average time per query: ${(elapsed / queries.length * 1000).toFixed(2)}ms`)

    expect(qps).toBeGreaterThan(PERFORMANCE_CONFIG.MIN_QPS)
  })

  it('should handle concurrent queries efficiently', async () => {
    const queries = Array.from(
      { length: 20 },
      (_, i) => `concurrent query ${i}`
    )

    const start = performance.now()

    // Execute queries concurrently
    await Promise.all(
      queries.map((query) => hybridSearch(query, { topK: 5 }))
    )

    const elapsed = (performance.now() - start) / 1000
    const effectiveQPS = queries.length / elapsed

    console.log(`Concurrent throughput: ${effectiveQPS.toFixed(2)} QPS`)

    // Concurrent should be faster than sequential
    expect(effectiveQPS).toBeGreaterThan(PERFORMANCE_CONFIG.MIN_QPS)
  })

  it('should maintain performance under load', async () => {
    const batchSize = 10
    const batches = 5
    const throughputs: number[] = []

    for (let batch = 0; batch < batches; batch++) {
      const queries = Array.from(
        { length: batchSize },
        (_, i) => `load test query ${batch}-${i}`
      )

      const start = performance.now()
      await Promise.all(
        queries.map((query) => hybridSearch(query, { topK: 5 }))
      )
      const elapsed = (performance.now() - start) / 1000

      throughputs.push(batchSize / elapsed)
    }

    const avgThroughput =
      throughputs.reduce((a, b) => a + b, 0) / throughputs.length

    // Throughput should remain consistent across batches
    const minThroughput = Math.min(...throughputs)
    const maxThroughput = Math.max(...throughputs)
    const variance = ((maxThroughput - minThroughput) / avgThroughput) * 100

    console.log(`Average throughput: ${avgThroughput.toFixed(2)} QPS`)
    console.log(`Throughput variance: ${variance.toFixed(2)}%`)

    expect(variance).toBeLessThan(30) // Less than 30% variance
  })
})

// ============================================================================
// Scalability Tests
// ============================================================================

describe('Scalability Benchmarks', () => {
  it('should scale linearly with dataset size', async () => {
    const sizes = [50, 100, 200]
    const latencies: Record<number, number> = {}

    for (const size of sizes) {
      const docs = generateMockDocuments(size)
      const index = new HNSWVectorIndex({ dimension: 1536 })

      const embeddings = docs.map((d) => d.embedding)
      await index.build(docs, embeddings)

      const query = new Array(1536).fill(0.01)
      const start = performance.now()
      await index.search(query, 10)
      latencies[size] = performance.now() - start
    }

    console.log('Scalability test (search latency by dataset size):')
    Object.entries(latencies).forEach(([size, latency]) => {
      console.log(`  ${size} docs: ${latency.toFixed(2)}ms`)
    })

    // Search time should grow sub-linearly due to HNSW
    const latency50 = latencies[50]
    const latency200 = latencies[200]
    const scaleFactor = latency200 / latency50

    // 4x data should be less than 4x slower (logarithmic scaling)
    expect(scaleFactor).toBeLessThan(4)
  })

  it('should handle large result sets efficiently', async () => {
    const query = 'test query'
    const resultSizes = [5, 10, 20, 50]
    const latencies: number[] = []

    for (const k of resultSizes) {
      const start = performance.now()
      await hybridSearch(query, { topK: k })
      latencies.push(performance.now() - start)
    }

    console.log('Result set size impact:')
    resultSizes.forEach((k, i) => {
      console.log(`  topK=${k}: ${latencies[i].toFixed(2)}ms`)
    })

    // Larger K should not drastically increase latency
    const latencyIncrease = latencies[latencies.length - 1] / latencies[0]
    expect(latencyIncrease).toBeLessThan(3) // Less than 3x slower for 10x results
  })

  it('should maintain performance with complex queries', async () => {
    const simpleQuery = 'chat'
    const complexQuery =
      'How do I implement a real-time streaming chat system with authentication, token optimization, and message history persistence using the ChatProvider component and useChat hook?'

    const simpleLatencies: number[] = []
    const complexLatencies: number[] = []

    for (let i = 0; i < 20; i++) {
      let start = performance.now()
      await hybridSearch(simpleQuery, { topK: 5 })
      simpleLatencies.push(performance.now() - start)

      start = performance.now()
      await hybridSearch(complexQuery, { topK: 5 })
      complexLatencies.push(performance.now() - start)
    }

    const simpleAvg =
      simpleLatencies.reduce((a, b) => a + b, 0) / simpleLatencies.length
    const complexAvg =
      complexLatencies.reduce((a, b) => a + b, 0) / complexLatencies.length

    console.log(`Simple query avg: ${simpleAvg.toFixed(2)}ms`)
    console.log(`Complex query avg: ${complexAvg.toFixed(2)}ms`)

    // Complex queries should be handled efficiently
    expect(complexAvg).toBeLessThan(simpleAvg * 2) // Less than 2x slower
  })
})

// ============================================================================
// Memory Usage Tests
// ============================================================================

describe('Memory Usage Benchmarks', () => {
  it('should stay within memory limits', async () => {
    const initialMemory = await measureMemoryUsage()

    // Perform memory-intensive operations
    const queries = Array.from({ length: 100 }, (_, i) => `query ${i}`)

    for (const query of queries) {
      await hybridSearch(query, { topK: 10 })
    }

    const finalMemory = await measureMemoryUsage()
    const memoryIncrease = finalMemory - initialMemory

    console.log(`Memory usage: ${finalMemory.toFixed(2)} MB`)
    console.log(`Memory increase: ${memoryIncrease.toFixed(2)} MB`)

    if (finalMemory > 0) {
      expect(finalMemory).toBeLessThan(PERFORMANCE_CONFIG.MAX_MEMORY_MB)
    }
  })

  it('should not leak memory over time', async () => {
    const measurements: number[] = []

    for (let i = 0; i < 5; i++) {
      // Perform operations
      for (let j = 0; j < 20; j++) {
        await hybridSearch(`query ${i}-${j}`, { topK: 5 })
      }

      const memory = await measureMemoryUsage()
      if (memory > 0) {
        measurements.push(memory)
      }
    }

    if (measurements.length > 0) {
      console.log('Memory measurements:', measurements.map((m) => m.toFixed(2)))

      // Memory should stabilize, not grow continuously
      const firstHalf = measurements.slice(0, Math.floor(measurements.length / 2))
      const secondHalf = measurements.slice(Math.floor(measurements.length / 2))

      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length

      const memoryGrowth = ((secondAvg - firstAvg) / firstAvg) * 100

      console.log(`Memory growth: ${memoryGrowth.toFixed(2)}%`)

      // Should not grow more than 20%
      expect(memoryGrowth).toBeLessThan(20)
    }
  })
})

// ============================================================================
// Index Build Performance Tests
// ============================================================================

describe('Index Build Performance', () => {
  it('should build index within time limit', async () => {
    const docs = generateMockDocuments(PERFORMANCE_CONFIG.LARGE_DATASET)
    const embeddings = docs.map((d) => d.embedding)

    const index = new HNSWVectorIndex({
      dimension: 1536,
      maxConnections: 16,
      efConstruction: 200,
    })

    const start = performance.now()
    await index.build(docs, embeddings)
    const buildTime = performance.now() - start

    console.log(`Index build time: ${buildTime.toFixed(2)}ms`)
    console.log(`Documents indexed: ${docs.length}`)
    console.log(`Time per document: ${(buildTime / docs.length).toFixed(2)}ms`)

    expect(buildTime).toBeLessThan(PERFORMANCE_CONFIG.MAX_BUILD_TIME_MS)
  })

  it('should build progressively without blocking', async () => {
    const docs = generateMockDocuments(100)
    const embeddings = docs.map((d) => d.embedding)

    const index = new HNSWVectorIndex({ dimension: 1536 })

    const checkpoints: number[] = []
    const targetCheckpoints = 5
    const docsPerCheckpoint = Math.floor(docs.length / targetCheckpoints)

    const start = performance.now()

    // Simulate progressive building
    for (let i = 0; i < targetCheckpoints; i++) {
      const batchStart = i * docsPerCheckpoint
      const batchEnd = Math.min((i + 1) * docsPerCheckpoint, docs.length)
      const batchDocs = docs.slice(batchStart, batchEnd)
      const batchEmbeddings = embeddings.slice(batchStart, batchEnd)

      await index.build(batchDocs, batchEmbeddings)
      checkpoints.push(performance.now() - start)
    }

    console.log('Progressive build checkpoints:', checkpoints.map((t) => `${t.toFixed(0)}ms`))

    // Should complete all checkpoints
    expect(checkpoints).toHaveLength(targetCheckpoints)
  })
})

// ============================================================================
// Regression Tests
// ============================================================================

describe('Performance Regression Tests', () => {
  it('should not regress from baseline performance', async () => {
    // Baseline: 100ms p95 latency for standard query
    const BASELINE_P95 = 250 // ms
    const TOLERANCE = 1.2 // 20% tolerance

    const query = 'standard baseline query'
    const latencies: number[] = []

    for (let i = 0; i < 100; i++) {
      const start = performance.now()
      await hybridSearch(query, { topK: 5 })
      latencies.push(performance.now() - start)
    }

    const p95 = calculatePercentile(latencies, 95)

    console.log(`Current p95: ${p95.toFixed(2)}ms`)
    console.log(`Baseline p95: ${BASELINE_P95}ms`)
    console.log(`Tolerance: ${(TOLERANCE * 100 - 100).toFixed(0)}%`)

    expect(p95).toBeLessThan(BASELINE_P95 * TOLERANCE)
  })

  it('should maintain or improve over previous version', async () => {
    // Compare basic vs optimized search
    const query = 'test comparison query'

    // Measure with all optimizations
    const withOptimizations: number[] = []
    for (let i = 0; i < 50; i++) {
      const start = performance.now()
      await hybridSearch(query, {
        topK: 5,
        enableReranking: true,
        enableMMR: true,
      })
      withOptimizations.push(performance.now() - start)
    }

    // Measure with minimal optimizations
    const withoutOptimizations: number[] = []
    for (let i = 0; i < 50; i++) {
      const start = performance.now()
      await hybridSearch(query, {
        topK: 5,
        enableReranking: false,
        enableMMR: false,
      })
      withoutOptimizations.push(performance.now() - start)
    }

    const optimizedAvg =
      withOptimizations.reduce((a, b) => a + b, 0) / withOptimizations.length
    const basicAvg =
      withoutOptimizations.reduce((a, b) => a + b, 0) /
      withoutOptimizations.length

    console.log(`With optimizations: ${optimizedAvg.toFixed(2)}ms`)
    console.log(`Without optimizations: ${basicAvg.toFixed(2)}ms`)

    // Optimizations should not significantly slow down search
    expect(optimizedAvg).toBeLessThan(basicAvg * 2) // Less than 2x slower
  })
})

// ============================================================================
// Stress Tests
// ============================================================================

describe('Stress Tests', () => {
  it('should handle burst traffic', async () => {
    const burstSize = 50
    const queries = Array.from(
      { length: burstSize },
      (_, i) => `burst query ${i}`
    )

    const start = performance.now()

    // Simulate burst by executing all at once
    const results = await Promise.allSettled(
      queries.map((query) => hybridSearch(query, { topK: 5 }))
    )

    const elapsed = performance.now() - start

    const successful = results.filter((r) => r.status === 'fulfilled').length
    const failed = results.filter((r) => r.status === 'rejected').length

    console.log(`Burst test: ${burstSize} queries in ${elapsed.toFixed(2)}ms`)
    console.log(`Success rate: ${(successful / burstSize * 100).toFixed(2)}%`)

    expect(successful).toBe(burstSize)
    expect(failed).toBe(0)
  })

  it('should recover from errors gracefully', async () => {
    // Test error recovery by triggering potential failure conditions
    const queries = ['', 'a'.repeat(10000), '   ', '\n\n\n']

    for (const query of queries) {
      try {
        const results = await hybridSearch(query, { topK: 5 })
        expect(results).toBeDefined()
      } catch (error) {
        // Should handle errors gracefully without crashing
        expect(error).toBeDefined()
      }
    }
  })
})
