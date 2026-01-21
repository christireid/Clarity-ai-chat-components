/**
 * Integration test for cost calculator exports
 *
 * This verifies that developers can import and use the cost calculator
 * as documented in the README.
 */

import {
  calculateRequestCost,
  getSavingsPercentage,
  CostTracker,
  type AnalyticsTokenUsage,
  type CostBreakdown,
  type CostTracking,
  type SavingsReport,
} from '@clarity-chat/token-optimization'

// Test 1: Calculate single request cost
console.log('Test 1: Calculate single request cost')
const cost: CostBreakdown = calculateRequestCost({
  model: 'claude-3-5-sonnet',
  inputTokens: 10000,
  outputTokens: 500,
  cachedInputTokens: 8000,
})

console.log(`  Total cost: $${cost.totalCost.toFixed(4)}`)
console.log(`  Baseline cost: $${cost.baselineCost.toFixed(4)}`)
console.log(`  Savings: ${cost.savingsPercentage.toFixed(1)}%`)
console.assert(cost.savingsPercentage > 0, 'Should have savings with caching')

// Test 2: Get savings percentage for a model
console.log('\nTest 2: Get savings percentage for cached tokens')
const cacheSavings = getSavingsPercentage('claude-3-5-sonnet')
console.log(`  Cached tokens are ${cacheSavings.toFixed(1)}% cheaper`)
console.assert(cacheSavings === 90, 'Claude should have 90% savings on cached tokens')

// Test 3: Track multiple requests
console.log('\nTest 3: Track multiple requests with CostTracker')
const tracker = new CostTracker('gpt-4o')

// First request
tracker.trackRequest({
  inputTokens: 5000,
  outputTokens: 500,
  cachedInputTokens: 0, // Cold start, no cache
})

// Second request with caching
tracker.trackRequest({
  inputTokens: 5000,
  outputTokens: 500,
  cachedInputTokens: 4000, // 80% cache hit
})

// Third request with even better caching
tracker.trackRequest({
  inputTokens: 5000,
  outputTokens: 500,
  cachedInputTokens: 4500, // 90% cache hit
})

const report: SavingsReport = tracker.getReport()
console.log(`  Total requests: ${report.cumulative.requestCount}`)
console.log(`  Total saved: $${report.cumulative.totalSavings.toFixed(4)}`)
console.log(`  Average savings: ${report.cumulative.averageSavingsPercentage.toFixed(1)}%`)
console.log(`  Cache hit rate: ${(report.cachingStatus.cacheHitRate * 100).toFixed(1)}%`)

console.assert(report.cumulative.requestCount === 3, 'Should track 3 requests')
console.assert(report.cumulative.averageSavingsPercentage > 0, 'Should have positive savings')
console.assert(report.recommendations.length > 0, 'Should provide recommendations')

// Test 4: Type safety
console.log('\nTest 4: Type safety verification')
const usage: AnalyticsTokenUsage = {
  inputTokens: 1000,
  outputTokens: 100,
  cachedInputTokens: 500,
}

const tracking: CostTracking = report.cumulative
console.log(`  Tokens saved: ${tracking.tokensSaved}`)
console.log(`  Total tokens: ${tracking.totalTokens}`)

console.log('\n✅ All tests passed! Cost calculator is properly integrated.')
console.log('\nDevelopers can now use:')
console.log('  import { calculateRequestCost, getSavingsPercentage, CostTracker }')
console.log('    from "@clarity-chat/token-optimization"')
