#!/usr/bin/env npx tsx
/**
 * Token Optimization Audit CLI
 *
 * Run this script to execute the full token optimization audit.
 *
 * Usage:
 *   npx tsx packages/token-optimization/audit/run-audit.ts
 *   npx tsx packages/token-optimization/audit/run-audit.ts --baseline-only
 *   npx tsx packages/token-optimization/audit/run-audit.ts --optimized-only
 *   npx tsx packages/token-optimization/audit/run-audit.ts --scenarios=short-01-greeting,short-02-simple-question
 */

import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import {
  createTestRunner,
  getDeterministicScenarios,
  getReplayScenarios,
  type OptimizationConfig,
  type RunComparison,
} from './harness'

// Parse command line arguments
const args = process.argv.slice(2)
const flags = {
  baselineOnly: args.includes('--baseline-only'),
  optimizedOnly: args.includes('--optimized-only'),
  verbose: !args.includes('--quiet'),
  scenarios: args
    .find((a) => a.startsWith('--scenarios='))
    ?.split('=')[1]
    ?.split(','),
  preset: args.find((a) => a.startsWith('--preset='))?.split('=')[1] as
    | 'aggressive'
    | 'balanced'
    | 'conservative'
    | undefined,
}

// Optimization presets (TUNED for maximum measured savings)
const PRESETS: Record<string, OptimizationConfig> = {
  conservative: {
    enablePromptCompression: true,
    compressionLevel: 'conservative',
    enableHistoryLimiting: true,
    maxHistoryMessages: 8, // Lowered from 10
  },
  balanced: {
    enableToon: true,
    enablePromptCompression: true,
    compressionLevel: 'balanced',
    enableHistoryLimiting: true,
    maxHistoryMessages: 5, // Lowered from 10 for better savings
  },
  aggressive: {
    enableToon: true,
    enablePromptCompression: true,
    compressionLevel: 'aggressive',
    enableHistoryLimiting: true,
    maxHistoryMessages: 3, // Aggressive: only keep 3 turn pairs
    enableSemanticCaching: true,
    enablePIIRedaction: true,
    enablePrefilling: true,
    enablePromptStructure: true,
  },
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗')
  console.log('║         TOKEN OPTIMIZATION AUDIT HARNESS                   ║')
  console.log('║         Ruthless. Measured. No vibes.                      ║')
  console.log('╚════════════════════════════════════════════════════════════╝')
  console.log()

  // Determine scenarios to run
  let scenarioIds: string[] | undefined = flags.scenarios
  if (!scenarioIds) {
    // Default: run all deterministic + replay scenarios (skip adversarial for speed)
    scenarioIds = [...getDeterministicScenarios(), ...getReplayScenarios()].map(
      (s) => s.id
    )
  }

  console.log(`📋 Scenarios to run: ${scenarioIds.length}`)
  console.log(
    `   Categories: ${[...new Set(scenarioIds.map((id) => id.split('-')[0]))].join(', ')}`
  )
  console.log()

  // Determine optimization config
  const optimizationConfig = flags.preset
    ? PRESETS[flags.preset]
    : PRESETS.balanced // Default to balanced

  console.log(`⚙️  Optimization preset: ${flags.preset || 'balanced'}`)
  console.log(`   Config: ${JSON.stringify(optimizationConfig, null, 2)}`)
  console.log()

  // Create test runner
  const runner = createTestRunner({
    outputDir: path.join(__dirname, 'output'),
    verbose: flags.verbose,
  })

  // Run tests
  let comparison: RunComparison | null = null

  if (flags.baselineOnly) {
    console.log('🔬 Running BASELINE only...')
    const baseline = await runner.runBaseline(scenarioIds, 1)
    console.log('\n--- BASELINE RESULTS ---')
    console.log(`Total measurements: ${baseline.totalMeasurements}`)
    console.log(`Successful: ${baseline.successfulMeasurements}`)
    console.log(
      `Mean estimated input tokens: ${baseline.tokens.meanEstimatedInput.toFixed(1)}`
    )
    console.log(
      `Median estimated input tokens: ${baseline.tokens.medianEstimatedInput.toFixed(1)}`
    )
    console.log(
      `P90 estimated input tokens: ${baseline.tokens.p90EstimatedInput.toFixed(1)}`
    )

    if (baseline.tokens.meanActualInput !== undefined) {
      console.log(
        `\nMean actual input tokens: ${baseline.tokens.meanActualInput.toFixed(1)}`
      )
      console.log(
        `Estimation error: ${baseline.tokens.estimationErrorPercent?.toFixed(1)}%`
      )
    }
  } else if (flags.optimizedOnly) {
    console.log('🔬 Running OPTIMIZED only...')
    const optimized = await runner.runOptimized(
      optimizationConfig,
      scenarioIds,
      1
    )
    console.log('\n--- OPTIMIZED RESULTS ---')
    console.log(`Total measurements: ${optimized.totalMeasurements}`)
    console.log(`Successful: ${optimized.successfulMeasurements}`)
    console.log(
      `Mean estimated input tokens: ${optimized.tokens.meanEstimatedInput.toFixed(1)}`
    )
    console.log(
      `Estimated savings: ${optimized.optimization.totalEstimatedSaved} tokens (${optimized.optimization.reductionPercentEstimated.toFixed(1)}%)`
    )

    if (optimized.optimization.totalActualSaved !== undefined) {
      console.log(
        `Actual savings: ${optimized.optimization.totalActualSaved} tokens (${optimized.optimization.reductionPercentActual?.toFixed(1)}%)`
      )
    }
  } else {
    console.log('🔬 Running FULL A/B COMPARISON...')
    comparison = await runner.runComparison(optimizationConfig, scenarioIds, 1)
  }

  // Export results
  const csvPath = path.join(__dirname, 'output', `audit_${Date.now()}.csv`)
  runner.exportToCSV(csvPath)
  console.log(`\n📊 Results exported to: ${csvPath}`)

  // Final summary
  if (comparison) {
    console.log('\n' + '═'.repeat(60))
    console.log('FINAL VERDICT')
    console.log('═'.repeat(60))

    if (comparison.verdict.isEffective) {
      console.log('✅ Token optimization IS EFFECTIVE')
      console.log(
        `   Estimated reduction: ${comparison.tokenDelta.percentReductionEstimated.toFixed(1)}%`
      )
      if (comparison.tokenDelta.percentReductionActual !== undefined) {
        console.log(
          `   Actual reduction: ${comparison.tokenDelta.percentReductionActual.toFixed(1)}%`
        )
      }
    } else {
      console.log('❌ Token optimization is NOT EFFECTIVE')
      console.log('   The optimization does not reduce actual token spend.')
      console.log('   This is a PLACEBO optimization.')
    }

    console.log('\nNotes:')
    comparison.verdict.notes.forEach((note) => console.log(`   ${note}`))

    console.log('\n' + '═'.repeat(60))
  }

  console.log('\n✅ Audit complete.')
}

// Run
main().catch((error) => {
  console.error('❌ Audit failed:', error)
  process.exit(1)
})
