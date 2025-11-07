/**
 * Benchmark command - Performance testing for AI chat
 */

import chalk from 'chalk'
import ora from 'ora'
import { performance } from 'perf_hooks'
import fs from 'fs-extra'
import path from 'path'

interface BenchmarkResult {
  name: string
  iterations: number
  mean: number
  median: number
  min: number
  max: number
  p95: number
  p99: number
}

interface BenchmarkSuite {
  timestamp: string
  results: BenchmarkResult[]
}

/**
 * Calculate statistics from timings
 */
function calculateStats(values: number[]): Omit<BenchmarkResult, 'name' | 'iterations'> {
  const sorted = values.slice().sort((a, b) => a - b)
  const sum = values.reduce((a, b) => a + b, 0)
  const mean = sum / values.length

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)],
  }
}

/**
 * Format duration
 */
function formatDuration(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}µs`
  if (ms < 1000) return `${ms.toFixed(2)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Run a benchmark
 */
async function runBenchmark(
  name: string,
  fn: () => void | Promise<void>,
  iterations: number = 100,
  warmup: number = 10
): Promise<BenchmarkResult> {
  // Warmup
  for (let i = 0; i < warmup; i++) {
    await fn()
  }

  // Actual benchmark
  const timings: number[] = []
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    timings.push(end - start)
  }

  const stats = calculateStats(timings)

  return {
    name,
    iterations,
    ...stats,
  }
}

/**
 * Message processing benchmark
 */
async function benchmarkMessageProcessing(): Promise<BenchmarkResult> {
  const messages = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    role: i % 2 === 0 ? 'user' : 'assistant',
    content: 'This is a test message with some content',
    timestamp: Date.now(),
  }))

  return runBenchmark(
    'Message Array Processing (100 messages)',
    () => {
      messages
        .filter(m => m.role === 'user')
        .map(m => ({ ...m, processed: true }))
        .slice(0, 50)
    }
  )
}

/**
 * JSON serialization benchmark
 */
async function benchmarkJSONSerialization(): Promise<BenchmarkResult> {
  const data = {
    messages: Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      role: 'user',
      content: 'Test message',
    })),
  }

  return runBenchmark(
    'JSON Serialization (1000 messages)',
    () => {
      JSON.stringify(data)
      JSON.parse(JSON.stringify(data))
    }
  )
}

/**
 * State cloning benchmark
 */
async function benchmarkStateCloning(): Promise<BenchmarkResult> {
  const state = {
    messages: Array.from({ length: 50 }, (_, i) => ({
      id: i,
      content: 'Message',
    })),
    config: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
    },
  }

  return runBenchmark('State Deep Clone', () => {
    JSON.parse(JSON.stringify(state))
  })
}

/**
 * String operations benchmark
 */
async function benchmarkStringOperations(): Promise<BenchmarkResult> {
  const text = 'This is a test message. '.repeat(100)

  return runBenchmark('String Operations', () => {
    text.split(' ')
    text.toLowerCase()
    text.toUpperCase()
    text.replace(/test/g, 'sample')
  })
}

/**
 * Display results
 */
function displayResults(suite: BenchmarkSuite) {
  console.log(chalk.blue.bold('\n⚡ Benchmark Results\n'))

  suite.results.forEach((result, index) => {
    console.log(chalk.white.bold(`${index + 1}. ${result.name}`))
    console.log(`   ${chalk.gray('Iterations:')} ${chalk.cyan(result.iterations)}`)
    console.log(`   ${chalk.gray('Mean:')} ${chalk.cyan(formatDuration(result.mean))}`)
    console.log(`   ${chalk.gray('Median:')} ${chalk.cyan(formatDuration(result.median))}`)
    console.log(`   ${chalk.gray('Min:')} ${chalk.green(formatDuration(result.min))}`)
    console.log(`   ${chalk.gray('Max:')} ${chalk.red(formatDuration(result.max))}`)
    console.log(`   ${chalk.gray('P95:')} ${chalk.cyan(formatDuration(result.p95))}`)
    console.log(`   ${chalk.gray('P99:')} ${chalk.cyan(formatDuration(result.p99))}`)
    console.log()
  })
}

/**
 * Save results
 */
async function saveResults(suite: BenchmarkSuite) {
  const spinner = ora('Saving results...').start()

  try {
    const resultsDir = path.join(process.cwd(), 'clarity-reports')
    await fs.ensureDir(resultsDir)

    const jsonPath = path.join(resultsDir, 'benchmark.json')
    await fs.writeJSON(jsonPath, suite, { spaces: 2 })

    // Generate markdown report
    const mdPath = path.join(resultsDir, 'benchmark.md')
    const markdown = generateMarkdownReport(suite)
    await fs.writeFile(mdPath, markdown)

    spinner.succeed(`Results saved to ${chalk.cyan('clarity-reports/')}`)
    console.log(`  ${chalk.gray(jsonPath)}`)
    console.log(`  ${chalk.gray(mdPath)}`)
  } catch (error) {
    spinner.fail('Failed to save results')
    throw error
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(suite: BenchmarkSuite): string {
  return `# Benchmark Report

Generated: ${suite.timestamp}

## Results

${suite.results.map((result, i) => `
### ${i + 1}. ${result.name}

| Metric | Value |
|--------|-------|
| Iterations | ${result.iterations} |
| Mean | ${formatDuration(result.mean)} |
| Median | ${formatDuration(result.median)} |
| Min | ${formatDuration(result.min)} |
| Max | ${formatDuration(result.max)} |
| P95 | ${formatDuration(result.p95)} |
| P99 | ${formatDuration(result.p99)} |
`).join('\n')}

---

Generated by Clarity Chat CLI
`
}

/**
 * Compare with previous results
 */
async function compareWithPrevious(current: BenchmarkSuite): Promise<void> {
  try {
    const previousPath = path.join(process.cwd(), 'clarity-reports', 'benchmark-previous.json')
    
    if (!await fs.pathExists(previousPath)) {
      return
    }

    const previous: BenchmarkSuite = await fs.readJSON(previousPath)

    console.log(chalk.blue.bold('\n📊 Comparison with Previous Run\n'))

    current.results.forEach(currentResult => {
      const previousResult = previous.results.find(r => r.name === currentResult.name)
      
      if (previousResult) {
        const diff = currentResult.mean - previousResult.mean
        const percentChange = ((diff / previousResult.mean) * 100).toFixed(2)
        const improved = diff < 0

        console.log(chalk.white(currentResult.name))
        console.log(
          `  ${improved ? chalk.green('↓') : chalk.red('↑')} ${Math.abs(parseFloat(percentChange))}% ${improved ? 'faster' : 'slower'} (${formatDuration(Math.abs(diff))})`
        )
      }
    })

    console.log()
  } catch (error) {
    // Ignore comparison errors
  }
}

/**
 * Save as previous for next comparison
 */
async function saveAsPrevious(suite: BenchmarkSuite) {
  try {
    const previousPath = path.join(process.cwd(), 'clarity-reports', 'benchmark-previous.json')
    await fs.writeJSON(previousPath, suite, { spaces: 2 })
  } catch (error) {
    // Ignore save errors
  }
}

/**
 * Main benchmark command
 */
export async function benchmarkCommand(options: {
  iterations?: number
  save?: boolean
  compare?: boolean
}) {
  console.log(chalk.blue.bold('\n⚡ Running Performance Benchmarks\n'))

  const iterations = options.iterations || 100

  try {
    const suite: BenchmarkSuite = {
      timestamp: new Date().toISOString(),
      results: [],
    }

    // Run benchmarks
    const spinner = ora('Running benchmarks...').start()

    spinner.text = 'Benchmarking message processing...'
    suite.results.push(await benchmarkMessageProcessing())

    spinner.text = 'Benchmarking JSON serialization...'
    suite.results.push(await benchmarkJSONSerialization())

    spinner.text = 'Benchmarking state cloning...'
    suite.results.push(await benchmarkStateCloning())

    spinner.text = 'Benchmarking string operations...'
    suite.results.push(await benchmarkStringOperations())

    spinner.succeed('Benchmarks complete')

    // Display results
    displayResults(suite)

    // Compare with previous
    if (options.compare) {
      await compareWithPrevious(suite)
    }

    // Save results
    if (options.save) {
      await saveResults(suite)
      await saveAsPrevious(suite)
    }

    console.log(chalk.green.bold('✓ Benchmark complete!\n'))
  } catch (error) {
    console.error(chalk.red(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`))
    process.exit(1)
  }
}

