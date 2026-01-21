/**
 * Cost Savings Calculator Example
 *
 * Demonstrates how to track and calculate the "90% cost savings" using provider caching.
 * This example shows real-world usage patterns and how to measure actual savings.
 *
 * @example Run this example
 * ```bash
 * npx tsx examples/cost-savings-calculator.ts
 * ```
 */

import {
  CostTracker,
  calculateRequestCost,
  getSavingsPercentage,
  estimatePotentialSavings,
  compareModelCostsDetailed,
} from '@clarity-chat/token-optimization'

// =============================================================================
// Example 1: Basic Cost Calculation
// =============================================================================

console.log('='.repeat(80))
console.log('Example 1: Calculate cost for a single request')
console.log('='.repeat(80))

const singleRequestCost = calculateRequestCost({
  model: 'claude-3-sonnet',
  inputTokens: 10000,
  outputTokens: 1000,
  cachedInputTokens: 9000, // 90% of input is cached
})

console.log('\nRequest Details:')
console.log(`  Model: claude-3-sonnet`)
console.log(`  Input tokens: 10,000`)
console.log(`  Output tokens: 1,000`)
console.log(`  Cached input tokens: 9,000 (90%)`)
console.log('\nCost Breakdown:')
console.log(`  Uncached input cost: $${singleRequestCost.inputCost.toFixed(6)}`)
console.log(`  Cached input cost: $${singleRequestCost.cachedInputCost.toFixed(6)}`)
console.log(`  Output cost: $${singleRequestCost.outputCost.toFixed(6)}`)
console.log(`  Total cost: $${singleRequestCost.totalCost.toFixed(6)}`)
console.log(`  Baseline (no cache): $${singleRequestCost.baselineCost.toFixed(6)}`)
console.log(`  Savings: $${singleRequestCost.savingsAmount.toFixed(6)} (${singleRequestCost.savingsPercentage.toFixed(1)}%)`)

// =============================================================================
// Example 2: Verify the "90% Savings" Claim
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('Example 2: Verify the "90% Cost Savings" Claim')
console.log('='.repeat(80))

const anthropicModels = ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']

console.log('\nPer-token savings for Anthropic models with prompt caching:\n')
for (const model of anthropicModels) {
  const savings = getSavingsPercentage(model)
  console.log(`  ${model.padEnd(20)} → ${savings.toFixed(1)}% savings on cached tokens`)
}

// =============================================================================
// Example 3: Real-time Cost Tracking
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('Example 3: Track costs across multiple requests')
console.log('='.repeat(80))

const tracker = new CostTracker('claude-3-sonnet')

console.log('\nSimulating a chatbot with reusable system prompt...\n')

// Simulate 10 requests with a 5000-token system prompt that gets cached
for (let i = 0; i < 10; i++) {
  tracker.trackRequest({
    inputTokens: 6000, // 5000 system + 1000 user
    outputTokens: 500,
    cachedInputTokens: i === 0 ? 0 : 5000, // System prompt cached after first request
  })
}

const report = tracker.getReport()

console.log('Results after 10 requests:')
console.log(`  Total cost (with caching): $${report.cumulative.totalCostWithOptimization.toFixed(4)}`)
console.log(`  Total cost (without caching): $${report.cumulative.totalCostWithoutOptimization.toFixed(4)}`)
console.log(`  Total savings: $${report.cumulative.totalSavings.toFixed(4)} (${report.cumulative.averageSavingsPercentage.toFixed(1)}%)`)
console.log(`  Tokens saved: ${report.cumulative.tokensSaved.toLocaleString()}`)
console.log(`  Cache hit rate: ${(report.cachingStatus.cacheHitRate * 100).toFixed(1)}%`)

console.log('\nRecommendations:')
for (const rec of report.recommendations) {
  console.log(`  ✓ ${rec}`)
}

// =============================================================================
// Example 4: Compare Models
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('Example 4: Compare costs across different models')
console.log('='.repeat(80))

const comparison = compareModelCostsDetailed({
  models: ['claude-3-sonnet', 'gpt-4o', 'gemini-1.5-pro', 'deepseek-chat'],
  inputTokens: 10000,
  outputTokens: 1000,
  cachedInputTokens: 8000, // 80% cache hit
})

console.log('\nCost comparison for 10k input + 1k output (80% cached):\n')
for (const result of comparison) {
  const cachingSupport = result.supportsCaching ? '✓' : '✗'
  console.log(`  ${result.model.padEnd(20)} $${result.cost.totalCost.toFixed(6)} (${result.potentialSavings.toFixed(1)}% savings) [Caching: ${cachingSupport}]`)
}

// =============================================================================
// Example 5: Estimate ROI Before Implementation
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('Example 5: Estimate potential savings before implementing caching')
console.log('='.repeat(80))

const estimate = estimatePotentialSavings({
  model: 'claude-3-sonnet',
  monthlyRequests: 100000, // 100k requests/month
  averageInputTokens: 8000,
  averageOutputTokens: 500,
  expectedCacheHitRate: 0.7, // Conservative 70% cache hit
})

console.log('\nROI Projection:')
console.log(`  Monthly requests: ${estimate.breakdownPerRequest.withoutCaching.toLocaleString()}`)
console.log(`  Average input tokens: 8,000`)
console.log(`  Expected cache hit rate: 70%`)
console.log('\nCosts:')
console.log(`  Without caching: $${estimate.monthlyCostWithoutCaching.toFixed(2)}/month`)
console.log(`  With caching: $${estimate.monthlyCostWithCaching.toFixed(2)}/month`)
console.log(`  Monthly savings: $${estimate.monthlySavings.toFixed(2)} (${estimate.savingsPercentage.toFixed(1)}%)`)
console.log(`  Annual savings: $${estimate.annualSavings.toFixed(2)}`)

// =============================================================================
// Example 6: Real-World RAG Application
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('Example 6: RAG Application with Document Caching')
console.log('='.repeat(80))

const ragTracker = new CostTracker('gpt-4o')

console.log('\nSimulating RAG queries with reusable document context...\n')

// Simulate 50 queries where retrieved docs have 60% overlap
for (let i = 0; i < 50; i++) {
  ragTracker.trackRequest({
    inputTokens: 15000, // Large context from docs
    outputTokens: 500,
    cachedInputTokens: 9000, // 60% of docs are reused
  })
}

const ragReport = ragTracker.getReport()

console.log('RAG Application Results (50 queries):')
console.log(`  Total cost with caching: $${ragReport.cumulative.totalCostWithOptimization.toFixed(2)}`)
console.log(`  Total cost without caching: $${ragReport.cumulative.totalCostWithoutOptimization.toFixed(2)}`)
console.log(`  Savings: $${ragReport.cumulative.totalSavings.toFixed(2)} (${ragReport.cumulative.averageSavingsPercentage.toFixed(1)}%)`)
console.log(`  Tokens saved: ${ragReport.cumulative.tokensSaved.toLocaleString()}`)

// =============================================================================
// Summary
// =============================================================================

console.log('\n' + '='.repeat(80))
console.log('Summary: The "90% Cost Savings" Claim')
console.log('='.repeat(80))

console.log(`
The "90% cost savings" claim refers to the per-token discount on CACHED tokens:

1. Anthropic Models (Claude):
   - Standard input: $3.00 per 1M tokens
   - Cached input: $0.30 per 1M tokens
   - Savings: 90% on cached tokens ✓

2. OpenAI Models (GPT-4o):
   - Standard input: $2.50 per 1M tokens
   - Cached input: $1.25 per 1M tokens
   - Savings: 50% on cached tokens ✓

3. Google Models (Gemini):
   - Standard input: $1.25 per 1M tokens
   - Cached input: $0.31 per 1M tokens
   - Savings: ~75% on cached tokens ✓

4. Actual Application Savings:
   - Depends on cache hit rate (what % of tokens are cached)
   - With 80% cache hit: ~72% total savings
   - With 70% cache hit: ~63% total savings
   - With 50% cache hit: ~45% total savings

The claim is ACCURATE for cached tokens. Your actual savings will depend on
how effectively you structure your prompts to maximize cache reuse.

Use the CostTracker to measure YOUR actual savings!
`)
