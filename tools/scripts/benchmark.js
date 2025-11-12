#!/usr/bin/env node

/**
 * Performance Benchmarking Script
 * Measures component render performance, bundle load times, and memory usage
 */

const { performance } = require('perf_hooks')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

// Configuration
const ITERATIONS = 100
const WARMUP_ITERATIONS = 10
const OUTPUT_DIR = path.join(__dirname, '..', 'benchmark-results')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

/**
 * Statistical calculations
 */
function calculateStats(values) {
  const sorted = values.slice().sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / values.length
  
  const variance = values.reduce((acc, val) => {
    return acc + Math.pow(val - mean, 2)
  }, 0) / values.length
  
  const stdDev = Math.sqrt(variance)
  
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
    stdDev,
  }
}

/**
 * Format duration in ms
 */
function formatDuration(ms) {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Benchmark a function
 */
async function benchmark(name, fn, iterations = ITERATIONS) {
  console.log(chalk.blue(`\n⏱️  Benchmarking: ${name}`))
  
  // Warmup
  console.log(chalk.gray('  Warming up...'))
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    await fn()
  }
  
  // Actual benchmark
  console.log(chalk.gray(`  Running ${iterations} iterations...`))
  const timings = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    timings.push(end - start)
    
    // Progress indicator
    if ((i + 1) % Math.floor(iterations / 10) === 0) {
      process.stdout.write(chalk.gray('.'))
    }
  }
  
  console.log() // New line after progress dots
  
  const stats = calculateStats(timings)
  
  // Print results
  console.log(chalk.green('  ✓ Complete'))
  console.log(`    Mean: ${chalk.cyan(formatDuration(stats.mean))}`)
  console.log(`    Median: ${chalk.cyan(formatDuration(stats.median))}`)
  console.log(`    Min: ${chalk.cyan(formatDuration(stats.min))}`)
  console.log(`    Max: ${chalk.cyan(formatDuration(stats.max))}`)
  console.log(`    P95: ${chalk.cyan(formatDuration(stats.p95))}`)
  console.log(`    P99: ${chalk.cyan(formatDuration(stats.p99))}`)
  console.log(`    StdDev: ${chalk.cyan(formatDuration(stats.stdDev))}`)
  
  return {
    name,
    iterations,
    ...stats,
  }
}

/**
 * Benchmark bundle loading
 */
async function benchmarkBundleLoad(packageName) {
  return benchmark(
    `Bundle Load: ${packageName}`,
    () => {
      // Simulate module loading
      const packagePath = path.join(__dirname, '..', 'packages', packageName, 'dist', 'index.js')
      if (fs.existsSync(packagePath)) {
        delete require.cache[require.resolve(packagePath)]
        require(packagePath)
      }
    }
  )
}

/**
 * Benchmark JSON parsing (simulating config/data loading)
 */
async function benchmarkJSONParsing() {
  const largeObject = {
    messages: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: 'This is a sample message content that simulates realistic chat data.',
      timestamp: Date.now(),
      metadata: {
        provider: 'openai',
        model: 'gpt-4',
        tokens: 50,
      }
    }))
  }
  
  const jsonString = JSON.stringify(largeObject)
  
  return benchmark(
    'JSON Parsing (1000 messages)',
    () => {
      JSON.parse(jsonString)
    }
  )
}

/**
 * Benchmark array operations (simulating message filtering)
 */
async function benchmarkArrayOperations() {
  const messages = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: 'Sample content',
    timestamp: Date.now() - i * 1000,
  }))
  
  return benchmark(
    'Array Operations (filtering 10k messages)',
    () => {
      messages
        .filter(m => m.role === 'user')
        .map(m => ({ ...m, processed: true }))
        .slice(0, 100)
    }
  )
}

/**
 * Benchmark object cloning (simulating state updates)
 */
async function benchmarkObjectCloning() {
  const state = {
    messages: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      content: 'Sample',
    })),
    settings: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 1000,
    },
    metadata: {
      sessionId: 'test',
      userId: 'user123',
    }
  }
  
  return benchmark(
    'Object Cloning (deep clone state)',
    () => {
      JSON.parse(JSON.stringify(state))
    }
  )
}

/**
 * Generate HTML report
 */
function generateHTMLReport(results) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Performance Benchmark Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      padding: 2rem;
    }
    
    h1 {
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }
    
    .timestamp {
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    
    .benchmark {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
    }
    
    .benchmark-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
    
    .stat {
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #7f8c8d;
      margin-bottom: 0.25rem;
    }
    
    .stat-value {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
    }
    
    .chart {
      margin-top: 1rem;
      height: 40px;
      background: #e0e0e0;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }
    
    .chart-bar {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      display: flex;
      align-items: center;
      padding-left: 0.5rem;
      color: white;
      font-weight: 600;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⚡ Performance Benchmark Report</h1>
    <div class="timestamp">Generated: ${results.timestamp}</div>
    
    ${results.benchmarks.map(bench => {
      const maxValue = Math.max(...results.benchmarks.map(b => b.mean))
      const percentage = (bench.mean / maxValue) * 100
      
      return `
        <div class="benchmark">
          <div class="benchmark-name">${bench.name}</div>
          <div class="stats">
            <div class="stat">
              <div class="stat-label">Mean</div>
              <div class="stat-value">${formatDuration(bench.mean)}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Median</div>
              <div class="stat-value">${formatDuration(bench.median)}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Min</div>
              <div class="stat-value">${formatDuration(bench.min)}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Max</div>
              <div class="stat-value">${formatDuration(bench.max)}</div>
            </div>
            <div class="stat">
              <div class="stat-label">P95</div>
              <div class="stat-value">${formatDuration(bench.p95)}</div>
            </div>
            <div class="stat">
              <div class="stat-label">P99</div>
              <div class="stat-value">${formatDuration(bench.p99)}</div>
            </div>
          </div>
          <div class="chart">
            <div class="chart-bar" style="width: ${percentage}%">
              ${percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      `
    }).join('')}
  </div>
</body>
</html>
  `
  
  return html
}

/**
 * Main execution
 */
async function main() {
  console.log(chalk.blue.bold('\n⚡ Starting Performance Benchmarks\n'))
  
  const results = {
    timestamp: new Date().toISOString(),
    benchmarks: [],
  }
  
  // Run benchmarks
  try {
    results.benchmarks.push(await benchmarkJSONParsing())
    results.benchmarks.push(await benchmarkArrayOperations())
    results.benchmarks.push(await benchmarkObjectCloning())
  } catch (error) {
    console.error(chalk.red(`\n❌ Error running benchmarks: ${error.message}`))
    process.exit(1)
  }
  
  // Save results
  const jsonPath = path.join(OUTPUT_DIR, 'benchmark-results.json')
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2))
  console.log(chalk.green(`\n✓ Results saved to ${jsonPath}`))
  
  // Generate HTML report
  const htmlReport = generateHTMLReport(results)
  const htmlPath = path.join(OUTPUT_DIR, 'benchmark-report.html')
  fs.writeFileSync(htmlPath, htmlReport)
  console.log(chalk.green(`✓ HTML report saved to ${htmlPath}`))
  
  console.log(chalk.blue.bold('\n✓ Benchmark complete!\n'))
}

main()

