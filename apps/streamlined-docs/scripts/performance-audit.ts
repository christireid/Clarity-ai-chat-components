#!/usr/bin/env tsx

/**
 * Performance Audit Script
 *
 * Analyzes bundle size, performance metrics, and provides optimization recommendations.
 * Run with: pnpm tsx scripts/performance-audit.ts
 */

import fs from 'fs'
import path from 'path'

interface BundleStats {
  totalSize: number
  largestChunk: number
  vendorSize: number
  chunks: Array<{ name: string; size: number }>
}

interface PerformanceMetrics {
  ttfb: number
  fcp: number
  lcp: number
  bundleSize: number
  isrEnabled: boolean
}

const PERFORMANCE_BUDGETS = {
  initialLoad: {
    javascript: 400 * 1024, // 400 KB
  },
  coreWebVitals: {
    ttfb: 600, // 600ms
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
  },
  isrWebVitals: {
    ttfb: 100, // 100ms
    fcp: 800, // 800ms
    lcp: 1200, // 1.2s
  },
}

/**
 * Read bundle stats from webpack stats file
 */
function readBundleStats(): BundleStats | null {
  const statsPath = path.join(process.cwd(), '.next', 'bundle-stats.json')

  if (!fs.existsSync(statsPath)) {
    console.warn('⚠️  Bundle stats not found. Run `pnpm perf:analyze` first.')
    return null
  }

  try {
    const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'))

    // Extract relevant metrics
    const chunks =
      stats.chunks?.map((chunk: any) => ({
        name: chunk.names?.[0] || 'unknown',
        size: chunk.size || 0,
      })) || []

    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    const largestChunk = Math.max(...chunks.map((c) => c.size))
    const vendorChunk = chunks.find((c) => c.name.includes('vendor'))
    const vendorSize = vendorChunk?.size || 0

    return {
      totalSize,
      largestChunk,
      vendorSize,
      chunks,
    }
  } catch (error) {
    console.error('❌ Failed to read bundle stats:', error)
    return null
  }
}

/**
 * Get optimization recommendations
 */
function getRecommendations(stats: BundleStats): string[] {
  const recommendations: string[] = []

  // Check total bundle size
  if (stats.totalSize > PERFORMANCE_BUDGETS.initialLoad.javascript) {
    const overBy = Math.round(
      (stats.totalSize - PERFORMANCE_BUDGETS.initialLoad.javascript) / 1024
    )
    recommendations.push(
      `🔴 Bundle size exceeds budget by ${overBy} KB`,
      '   → Add more dynamic imports for heavy components',
      '   → Review and remove unused dependencies'
    )
  } else {
    const remaining = Math.round(
      (PERFORMANCE_BUDGETS.initialLoad.javascript - stats.totalSize) / 1024
    )
    recommendations.push(`✅ Bundle size is ${remaining} KB under budget`)
  }

  // Check largest chunk
  if (stats.largestChunk > 150 * 1024) {
    const size = Math.round(stats.largestChunk / 1024)
    recommendations.push(
      `🟡 Largest chunk (${size} KB) should be split`,
      '   → Use route-based code splitting',
      '   → Extract shared dependencies to vendor chunk'
    )
  }

  // Check vendor size
  if (stats.vendorSize > 200 * 1024) {
    const size = Math.round(stats.vendorSize / 1024)
    recommendations.push(
      `🟡 Vendor bundle (${size} KB) is large`,
      '   → Check for duplicate dependencies',
      '   → Consider using CDN for large libraries'
    )
  }

  return recommendations
}

/**
 * Display performance report
 */
function displayReport(stats: BundleStats) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Performance Audit Report')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Bundle size metrics
  console.log('📦 Bundle Size Metrics\n')
  console.log(`   Total Size:     ${Math.round(stats.totalSize / 1024)} KB`)
  console.log(`   Largest Chunk:  ${Math.round(stats.largestChunk / 1024)} KB`)
  console.log(`   Vendor Size:    ${Math.round(stats.vendorSize / 1024)} KB`)
  console.log(
    `   Budget:         ${PERFORMANCE_BUDGETS.initialLoad.javascript / 1024} KB`
  )

  const budgetUsage =
    (stats.totalSize / PERFORMANCE_BUDGETS.initialLoad.javascript) * 100
  console.log(`   Budget Usage:   ${budgetUsage.toFixed(1)}%`)

  // Top 5 largest chunks
  const topChunks = stats.chunks.sort((a, b) => b.size - a.size).slice(0, 5)

  console.log('\n📋 Largest Chunks\n')
  topChunks.forEach((chunk, i) => {
    const sizekB = Math.round(chunk.size / 1024)
    const bar = '█'.repeat(Math.min(Math.round(chunk.size / 10000), 40))
    console.log(
      `   ${i + 1}. ${chunk.name.padEnd(30)} ${sizekB.toString().padStart(6)} KB ${bar}`
    )
  })

  // Recommendations
  const recommendations = getRecommendations(stats)
  console.log('\n💡 Recommendations\n')
  recommendations.forEach((rec) => console.log(`   ${rec}`))

  // Performance budgets
  console.log('\n🎯 Performance Budgets\n')
  console.log('   Core Web Vitals Targets (ISR):')
  console.log(`   • TTFB:  < ${PERFORMANCE_BUDGETS.isrWebVitals.ttfb}ms`)
  console.log(`   • FCP:   < ${PERFORMANCE_BUDGETS.isrWebVitals.fcp}ms`)
  console.log(`   • LCP:   < ${PERFORMANCE_BUDGETS.isrWebVitals.lcp}ms`)

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Save report
  const reportPath = path.join(process.cwd(), '.next', 'performance-audit.txt')
  const report = generateTextReport(stats, recommendations)
  fs.writeFileSync(reportPath, report, 'utf-8')
  console.log(`📄 Report saved to: ${reportPath}\n`)
}

/**
 * Generate text report for file output
 */
function generateTextReport(
  stats: BundleStats,
  recommendations: string[]
): string {
  const date = new Date().toISOString()

  return `
Performance Audit Report
Generated: ${date}

═══════════════════════════════════════
Bundle Size Metrics
═══════════════════════════════════════

Total Size:     ${Math.round(stats.totalSize / 1024)} KB
Largest Chunk:  ${Math.round(stats.largestChunk / 1024)} KB
Vendor Size:    ${Math.round(stats.vendorSize / 1024)} KB
Budget:         ${PERFORMANCE_BUDGETS.initialLoad.javascript / 1024} KB
Budget Usage:   ${((stats.totalSize / PERFORMANCE_BUDGETS.initialLoad.javascript) * 100).toFixed(1)}%

═══════════════════════════════════════
Top 5 Largest Chunks
═══════════════════════════════════════

${stats.chunks
  .sort((a, b) => b.size - a.size)
  .slice(0, 5)
  .map(
    (chunk, i) =>
      `${i + 1}. ${chunk.name.padEnd(30)} ${Math.round(chunk.size / 1024)} KB`
  )
  .join('\n')}

═══════════════════════════════════════
Recommendations
═══════════════════════════════════════

${recommendations.join('\n')}

═══════════════════════════════════════
Performance Budgets
═══════════════════════════════════════

Core Web Vitals Targets (ISR):
• TTFB:  < ${PERFORMANCE_BUDGETS.isrWebVitals.ttfb}ms
• FCP:   < ${PERFORMANCE_BUDGETS.isrWebVitals.fcp}ms
• LCP:   < ${PERFORMANCE_BUDGETS.isrWebVitals.lcp}ms

═══════════════════════════════════════
Next Steps
═══════════════════════════════════════

1. Run Lighthouse audit: npx lighthouse http://localhost:3000
2. Test ISR caching: Check Network tab for cache hits
3. Verify loading states for dynamic components
4. Measure Core Web Vitals in production

═══════════════════════════════════════
`.trim()
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Running performance audit...\n')

  const stats = readBundleStats()

  if (!stats) {
    console.log('\n📝 To generate bundle stats, run:')
    console.log('   pnpm perf:analyze\n')
    process.exit(1)
  }

  displayReport(stats)
}

main()
