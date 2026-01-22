#!/usr/bin/env node

/**
 * Compare Benchmark Results
 *
 * Compares current benchmark results against baseline to detect performance regressions.
 *
 * Usage:
 *   node scripts/compare-benchmarks.mjs baseline.json current.json
 *
 * Exit codes:
 *   0 - No regressions detected
 *   1 - Performance regressions detected
 */

import { readFileSync } from 'fs'

// Configuration
const REGRESSION_THRESHOLD = 0.1 // 10% slower is a regression
const IMPROVEMENT_THRESHOLD = 0.1 // 10% faster is an improvement
const CRITICAL_THRESHOLD = 0.25 // 25% slower is critical

/**
 * Load JSON file
 */
function loadJSON(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Error loading ${filePath}: ${error.message}`)
    process.exit(1)
  }
}

/**
 * Compare two benchmark results
 */
function compareBenchmarks(baselinePath, currentPath) {
  const baseline = loadJSON(baselinePath)
  const current = loadJSON(currentPath)

  const results = {
    regressions: [],
    improvements: [],
    unchanged: [],
  }

  // Iterate through all benchmark categories
  for (const [category, tests] of Object.entries(baseline.benchmarks || {})) {
    const currentTests = current.benchmarks?.[category] || {}

    for (const [testName, baselineResult] of Object.entries(tests)) {
      const currentResult = currentTests[testName]

      if (!currentResult) {
        console.warn(`⚠️  Test not found in current results: ${category}.${testName}`)
        continue
      }

      const baselineMean = baselineResult.mean
      const currentMean = currentResult.mean

      if (typeof baselineMean !== 'number' || typeof currentMean !== 'number') {
        continue
      }

      const delta = (currentMean - baselineMean) / baselineMean
      const unit = baselineResult.unit || 'ms'

      const result = {
        category,
        test: testName,
        baseline: baselineMean,
        current: currentMean,
        delta,
        deltaPercent: (delta * 100).toFixed(2),
        unit,
        isCritical: delta > CRITICAL_THRESHOLD,
      }

      if (delta > REGRESSION_THRESHOLD) {
        results.regressions.push(result)
      } else if (delta < -IMPROVEMENT_THRESHOLD) {
        results.improvements.push(result)
      } else {
        results.unchanged.push(result)
      }
    }
  }

  return results
}

/**
 * Format result for display
 */
function formatResult(result) {
  const arrow = result.delta > 0 ? '↑' : '↓'
  const sign = result.delta > 0 ? '+' : ''
  const color = result.delta > 0 ? '\x1b[31m' : '\x1b[32m' // red or green
  const reset = '\x1b[0m'

  return `  ${color}${arrow} ${result.category}.${result.test}${reset}
    Baseline: ${result.baseline}${result.unit}
    Current:  ${result.current}${result.unit}
    Change:   ${color}${sign}${result.deltaPercent}%${reset}${result.isCritical ? ' 🚨 CRITICAL' : ''}`
}

/**
 * Print comparison report
 */
function printReport(results) {
  console.log('\n' + '='.repeat(80))
  console.log('📊  BENCHMARK COMPARISON REPORT')
  console.log('='.repeat(80) + '\n')

  // Regressions
  if (results.regressions.length > 0) {
    console.log(`❌ PERFORMANCE REGRESSIONS DETECTED (${results.regressions.length}):\n`)
    results.regressions.forEach(r => console.log(formatResult(r) + '\n'))
  }

  // Improvements
  if (results.improvements.length > 0) {
    console.log(`✅ PERFORMANCE IMPROVEMENTS (${results.improvements.length}):\n`)
    results.improvements.forEach(r => console.log(formatResult(r) + '\n'))
  }

  // Summary
  console.log('='.repeat(80))
  console.log('📈 SUMMARY:')
  console.log(`  Regressions:  ${results.regressions.length}`)
  console.log(`  Improvements: ${results.improvements.length}`)
  console.log(`  Unchanged:    ${results.unchanged.length}`)

  const criticalCount = results.regressions.filter(r => r.isCritical).length
  if (criticalCount > 0) {
    console.log(`  🚨 Critical:   ${criticalCount}`)
  }

  console.log('='.repeat(80) + '\n')

  // Recommendations
  if (results.regressions.length > 0) {
    console.log('💡 RECOMMENDATIONS:')
    if (criticalCount > 0) {
      console.log('  - Critical regressions detected! Review changes immediately.')
    }
    console.log('  - Profile affected components with Chrome DevTools')
    console.log('  - Review recent commits for performance-sensitive changes')
    console.log('  - Consider rolling back if regressions are severe')
    console.log('')
  }
}

/**
 * Main
 */
function main() {
  const args = process.argv.slice(2)

  if (args.length !== 2) {
    console.log('Usage: node scripts/compare-benchmarks.mjs <baseline.json> <current.json>')
    process.exit(1)
  }

  const [baselinePath, currentPath] = args

  console.log(`\n🔍 Comparing benchmarks...`)
  console.log(`   Baseline: ${baselinePath}`)
  console.log(`   Current:  ${currentPath}`)

  const results = compareBenchmarks(baselinePath, currentPath)
  printReport(results)

  // Exit with error if regressions detected
  if (results.regressions.length > 0) {
    process.exit(1)
  }

  console.log('✨ No performance regressions detected!\n')
  process.exit(0)
}

main()
