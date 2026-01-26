#!/usr/bin/env tsx
/**
 * Bundle Size Tracker
 *
 * Tracks bundle sizes over time and generates historical reports.
 * Records measurements to .bundle-analysis/history/ for trend analysis.
 *
 * Usage:
 *   pnpm tsx scripts/bundle-size-tracker.ts           # Record current sizes
 *   pnpm tsx scripts/bundle-size-tracker.ts --report  # Generate trend report
 *   pnpm tsx scripts/bundle-size-tracker.ts --compare <commit> # Compare with commit
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { gzipSync } from 'zlib'

interface BundleSize {
  file: string
  size: number
  gzipSize: number
  brotliSize?: number
}

interface BundleMeasurement {
  timestamp: string
  commit?: string
  branch?: string
  bundles: BundleSize[]
  totalSize: number
  totalGzipSize: number
  totalBrotliSize?: number
}

interface TrendData {
  measurements: BundleMeasurement[]
  firstMeasurement?: BundleMeasurement
  latestMeasurement?: BundleMeasurement
  trend: 'increasing' | 'decreasing' | 'stable'
  changePercent: number
}

const DIST_DIR = path.join(process.cwd(), 'dist')
const HISTORY_DIR = path.join(process.cwd(), '.bundle-analysis', 'history')
const CURRENT_FILE = path.join(
  process.cwd(),
  '.bundle-analysis',
  'current.json'
)

// Entry points to track
const ENTRY_POINTS = [
  { file: 'index.js', name: 'Main (CJS)' },
  { file: 'index.mjs', name: 'Main (ESM)' },
  { file: 'core.js', name: 'Core (CJS)' },
  { file: 'core.mjs', name: 'Core (ESM)' },
  { file: 'core-minimal.js', name: 'Core Minimal (CJS)' },
  { file: 'core-minimal.mjs', name: 'Core Minimal (ESM)' },
  { file: 'slim.js', name: 'Slim' },
  { file: 'utils/index.js', name: 'Utils' },
  { file: 'animations/index.js', name: 'Animations' },
  { file: 'prompt/index.js', name: 'Prompt' },
  { file: 'analytics/index.js', name: 'Analytics' },
  { file: 'memory/index.js', name: 'Memory' },
  { file: 'adapters/index.js', name: 'Adapters' },
]

function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath)
    return stats.size
  } catch {
    return 0
  }
}

function getGzipSize(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath)
    const compressed = gzipSync(content, { level: 9 })
    return compressed.length
  } catch {
    return 0
  }
}

function getBrotliSize(filePath: string): number {
  try {
    // Use native brotli compression if available
    const { brotliCompressSync } = require('zlib')
    const content = fs.readFileSync(filePath)
    const compressed = brotliCompressSync(content, {
      params: {
        [require('zlib').constants.BROTLI_PARAM_MODE]:
          require('zlib').constants.BROTLI_MODE_TEXT,
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: 11,
      },
    })
    return compressed.length
  } catch {
    return 0
  }
}

function getGitInfo() {
  try {
    const commit = execSync('git rev-parse --short HEAD', {
      encoding: 'utf-8',
    }).trim()
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf-8',
    }).trim()
    return { commit, branch }
  } catch {
    return { commit: undefined, branch: undefined }
  }
}

function measureBundles(): BundleMeasurement {
  const bundles: BundleSize[] = []
  let totalSize = 0
  let totalGzipSize = 0
  let totalBrotliSize = 0

  console.log('📊 Measuring bundle sizes...\n')

  for (const entry of ENTRY_POINTS) {
    const filePath = path.join(DIST_DIR, entry.file)
    const size = getFileSize(filePath)

    if (size === 0) {
      console.log(`⏭️  Skipping ${entry.name} (not found)`)
      continue
    }

    const gzipSize = getGzipSize(filePath)
    const brotliSize = getBrotliSize(filePath)

    bundles.push({
      file: entry.file,
      size,
      gzipSize,
      brotliSize,
    })

    totalSize += size
    totalGzipSize += gzipSize
    totalBrotliSize += brotliSize

    console.log(
      `✅ ${entry.name.padEnd(25)} ${formatBytes(size).padStart(12)} (${formatBytes(gzipSize)} gzip, ${formatBytes(brotliSize)} brotli)`
    )
  }

  const gitInfo = getGitInfo()

  console.log('\n' + '='.repeat(80))
  console.log(
    `📦 Total: ${formatBytes(totalSize)} (${formatBytes(totalGzipSize)} gzip, ${formatBytes(totalBrotliSize)} brotli)`
  )
  if (gitInfo.commit) {
    console.log(`🔀 Git: ${gitInfo.branch}@${gitInfo.commit}`)
  }
  console.log('='.repeat(80) + '\n')

  return {
    timestamp: new Date().toISOString(),
    commit: gitInfo.commit,
    branch: gitInfo.branch,
    bundles,
    totalSize,
    totalGzipSize,
    totalBrotliSize,
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function formatPercent(percent: number): string {
  const sign = percent > 0 ? '+' : ''
  return `${sign}${percent.toFixed(2)}%`
}

function saveMeasurement(measurement: BundleMeasurement) {
  // Ensure directories exist
  fs.mkdirSync(HISTORY_DIR, { recursive: true })

  // Save current measurement
  fs.writeFileSync(CURRENT_FILE, JSON.stringify(measurement, null, 2))

  // Save to history with timestamp
  const historyFile = path.join(
    HISTORY_DIR,
    `${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  )
  fs.writeFileSync(historyFile, JSON.stringify(measurement, null, 2))

  console.log(`💾 Saved measurement to ${historyFile}`)
}

function loadHistory(): BundleMeasurement[] {
  try {
    const files = fs.readdirSync(HISTORY_DIR).filter((f) => f.endsWith('.json'))
    return files
      .map((f) => {
        const content = fs.readFileSync(path.join(HISTORY_DIR, f), 'utf-8')
        return JSON.parse(content) as BundleMeasurement
      })
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
  } catch {
    return []
  }
}

function analyzeTrend(measurements: BundleMeasurement[]): TrendData {
  if (measurements.length === 0) {
    return {
      measurements: [],
      trend: 'stable',
      changePercent: 0,
    }
  }

  const first = measurements[0]
  const latest = measurements[measurements.length - 1]
  const changePercent =
    ((latest.totalGzipSize - first.totalGzipSize) / first.totalGzipSize) * 100

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable'
  if (Math.abs(changePercent) > 5) {
    trend = changePercent > 0 ? 'increasing' : 'decreasing'
  }

  return {
    measurements,
    firstMeasurement: first,
    latestMeasurement: latest,
    trend,
    changePercent,
  }
}

function generateTrendReport() {
  const history = loadHistory()

  if (history.length === 0) {
    console.log(
      '❌ No historical data found. Run without --report to record measurements.'
    )
    return
  }

  const trend = analyzeTrend(history)

  console.log('📈 Bundle Size Trend Report')
  console.log('='.repeat(80))
  console.log(`\nMeasurements: ${history.length}`)
  console.log(
    `First: ${new Date(trend.firstMeasurement!.timestamp).toLocaleString()}`
  )
  console.log(
    `Latest: ${new Date(trend.latestMeasurement!.timestamp).toLocaleString()}`
  )
  console.log(
    `\nTrend: ${getTrendEmoji(trend.trend)} ${trend.trend.toUpperCase()}`
  )
  console.log(`Change: ${formatPercent(trend.changePercent)}`)

  console.log('\n📊 Size Comparison (Gzipped)')
  console.log('-'.repeat(80))
  console.log(
    `First:  ${formatBytes(trend.firstMeasurement!.totalGzipSize)} (${new Date(trend.firstMeasurement!.timestamp).toLocaleDateString()})`
  )
  console.log(
    `Latest: ${formatBytes(trend.latestMeasurement!.totalGzipSize)} (${new Date(trend.latestMeasurement!.timestamp).toLocaleDateString()})`
  )
  console.log(
    `Diff:   ${formatBytes(trend.latestMeasurement!.totalGzipSize - trend.firstMeasurement!.totalGzipSize)}`
  )

  // Recent measurements (last 10)
  console.log('\n📅 Recent Measurements (Last 10)')
  console.log('-'.repeat(80))
  const recent = history.slice(-10)
  for (const m of recent) {
    const date = new Date(m.timestamp).toLocaleString()
    const size = formatBytes(m.totalGzipSize)
    const commit = m.commit ? ` [${m.commit}]` : ''
    console.log(`${date} - ${size}${commit}`)
  }

  // Per-bundle analysis
  console.log('\n📦 Per-Bundle Trends')
  console.log('-'.repeat(80))

  const firstBundles = new Map(
    trend.firstMeasurement!.bundles.map((b) => [b.file, b.gzipSize])
  )
  const latestBundles = new Map(
    trend.latestMeasurement!.bundles.map((b) => [b.file, b.gzipSize])
  )

  for (const [file, firstSize] of firstBundles) {
    const latestSize = latestBundles.get(file)
    if (latestSize) {
      const change = latestSize - firstSize
      const changePercent = (change / firstSize) * 100
      const emoji = change > 0 ? '📈' : change < 0 ? '📉' : '➡️'
      console.log(
        `${emoji} ${file.padEnd(30)} ${formatBytes(firstSize).padStart(10)} → ${formatBytes(latestSize).padStart(10)} (${formatPercent(changePercent)})`
      )
    }
  }

  console.log('\n' + '='.repeat(80))
}

function getTrendEmoji(trend: string): string {
  switch (trend) {
    case 'increasing':
      return '📈'
    case 'decreasing':
      return '📉'
    default:
      return '➡️'
  }
}

function compareWithCommit(commitHash: string) {
  console.log(`🔍 Comparing with commit ${commitHash}...`)

  try {
    // Checkout commit
    execSync(`git checkout ${commitHash}`, { stdio: 'ignore' })

    // Build bundles
    console.log('🔨 Building bundles...')
    execSync('pnpm build', { stdio: 'inherit' })

    // Measure
    const oldMeasurement = measureBundles()

    // Return to current branch
    execSync('git checkout -', { stdio: 'ignore' })

    // Build current
    console.log('\n🔨 Building current bundles...')
    execSync('pnpm build', { stdio: 'inherit' })

    // Measure current
    const newMeasurement = measureBundles()

    // Compare
    console.log('\n📊 Comparison Report')
    console.log('='.repeat(80))

    const totalChange =
      newMeasurement.totalGzipSize - oldMeasurement.totalGzipSize
    const totalChangePercent =
      (totalChange / oldMeasurement.totalGzipSize) * 100

    console.log(
      `Total Size Change: ${formatBytes(totalChange)} (${formatPercent(totalChangePercent)})`
    )

    console.log('\n📦 Per-Bundle Changes')
    console.log('-'.repeat(80))

    const oldBundles = new Map(
      oldMeasurement.bundles.map((b) => [b.file, b.gzipSize])
    )
    const newBundles = new Map(
      newMeasurement.bundles.map((b) => [b.file, b.gzipSize])
    )

    for (const [file, oldSize] of oldBundles) {
      const newSize = newBundles.get(file)
      if (newSize) {
        const change = newSize - oldSize
        const changePercent = (change / oldSize) * 100
        const emoji = change > 0 ? '📈' : change < 0 ? '📉' : '➡️'
        console.log(
          `${emoji} ${file.padEnd(30)} ${formatBytes(change).padStart(10)} (${formatPercent(changePercent)})`
        )
      }
    }

    console.log('\n' + '='.repeat(80))
  } catch (error) {
    console.error('❌ Error comparing with commit:', error)
    process.exit(1)
  }
}

// Main execution
const args = process.argv.slice(2)

if (args.includes('--report')) {
  generateTrendReport()
} else if (args.includes('--compare')) {
  const commitIndex = args.indexOf('--compare')
  const commit = args[commitIndex + 1]
  if (!commit) {
    console.error('❌ Please provide a commit hash: --compare <commit>')
    process.exit(1)
  }
  compareWithCommit(commit)
} else {
  // Record current measurement
  const measurement = measureBundles()
  saveMeasurement(measurement)
}
