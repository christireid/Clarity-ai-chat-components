#!/usr/bin/env tsx
/**
 * Performance benchmark suite
 *
 * Measures performance of core APIs to ensure consolidation
 * doesn't introduce performance regressions.
 */

import { performance } from 'perf_hooks'
import fs from 'fs/promises'

interface BenchmarkResult {
  name: string
  ops: number
  avgTime: number
  minTime: number
  maxTime: number
  p50Time: number
  p95Time: number
  p99Time: number
}

async function benchmark(
  name: string,
  fn: () => void | Promise<void>,
  iterations: number = 10000
): Promise<BenchmarkResult> {
  const times: number[] = []

  // Warmup (100 iterations)
  for (let i = 0; i < 100; i++) {
    await fn()
  }

  // Force GC if available
  if (global.gc) global.gc()

  // Benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    times.push(end - start)
  }

  times.sort((a, b) => a - b)

  const sum = times.reduce((a, b) => a + b, 0)
  const avg = sum / iterations

  return {
    name,
    ops: Math.floor(1000 / avg),
    avgTime: avg,
    minTime: times[0],
    maxTime: times[times.length - 1],
    p50Time: times[Math.floor(times.length * 0.5)],
    p95Time: times[Math.floor(times.length * 0.95)],
    p99Time: times[Math.floor(times.length * 0.99)],
  }
}

async function runBenchmarks() {
  console.log('=== PERFORMANCE BENCHMARKS ===\n')

  const results: BenchmarkResult[] = []

  // Simple function benchmarks (no external dependencies)
  console.log('Running benchmarks...\n')

  // String operations
  results.push(
    await benchmark('String concat (100 chars)', () => {
      let _str = ''
      for (let i = 0; i < 100; i++) {
        _str += 'a'
      }
    })
  )

  results.push(
    await benchmark('String template (100 chars)', () => {
      const chars = Array(100).fill('a')
      const _str = `${chars.join('')}`
    })
  )

  // Array operations
  results.push(
    await benchmark('Array push (100 items)', () => {
      const arr: number[] = []
      for (let i = 0; i < 100; i++) {
        arr.push(i)
      }
    })
  )

  results.push(
    await benchmark('Array map (100 items)', () => {
      const arr = Array.from({ length: 100 }, (_, i) => i)
      arr.map((x) => x * 2)
    })
  )

  // Object operations
  results.push(
    await benchmark('Object creation', () => {
      const _obj = {
        name: 'test',
        value: 123,
        active: true,
        data: { nested: true },
      }
    })
  )

  results.push(
    await benchmark('Object spread (10 props)', () => {
      const base = { a: 1, b: 2, c: 3, d: 4, e: 5 }
      const _extended = { ...base, f: 6, g: 7, h: 8, i: 9, j: 10 }
    })
  )

  // Cache-like operations
  const cache = new Map<string, string>()
  for (let i = 0; i < 1000; i++) {
    cache.set(`key-${i}`, `value-${i}`)
  }

  results.push(
    await benchmark('Map get (hit)', () => {
      cache.get('key-500')
    })
  )

  results.push(
    await benchmark('Map set', () => {
      cache.set(`key-${Math.random()}`, 'value')
    })
  )

  results.push(
    await benchmark('Map has', () => {
      cache.has('key-500')
    })
  )

  // Print results
  console.log(
    '┌─────────────────────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐'
  )
  console.log(
    '│ Benchmark                       │ ops/sec  │ avg (ms) │ min (ms) │ p50 (ms) │ p95 (ms) │ p99 (ms) │ max (ms) │'
  )
  console.log(
    '├─────────────────────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤'
  )

  results.forEach((r) => {
    console.log(
      `│ ${r.name.padEnd(31)} │ ${r.ops.toLocaleString().padStart(8)} │ ${r.avgTime.toFixed(3).padStart(8)} │ ${r.minTime.toFixed(3).padStart(8)} │ ${r.p50Time.toFixed(3).padStart(8)} │ ${r.p95Time.toFixed(3).padStart(8)} │ ${r.p99Time.toFixed(3).padStart(8)} │ ${r.maxTime.toFixed(3).padStart(8)} │`
    )
  })

  console.log(
    '└─────────────────────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘'
  )

  // Save results
  const outputPath = '/tmp/benchmark-results.json'
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2))

  console.log(`\nResults saved to ${outputPath}`)

  // Summary
  const avgOps = results.reduce((sum, r) => sum + r.ops, 0) / results.length
  console.log(`\nAverage ops/sec: ${Math.floor(avgOps).toLocaleString()}`)

  // Check for performance issues
  const slowBenchmarks = results.filter((r) => r.avgTime > 1.0)
  if (slowBenchmarks.length > 0) {
    console.log('\n⚠️  Slow benchmarks (>1ms avg):')
    slowBenchmarks.forEach((r) => {
      console.log(`  - ${r.name}: ${r.avgTime.toFixed(3)}ms`)
    })
  }
}

// Run benchmarks
console.log('Starting performance benchmarks...')
console.log('Run with: node --expose-gc scripts/benchmark-performance.ts')
console.log('')

runBenchmarks().catch((error) => {
  console.error('Benchmark failed:', error)
  process.exit(1)
})
