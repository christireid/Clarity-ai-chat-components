/**
 * Example 02: Node.js Token Counting
 *
 * Count tokens in Node.js without React.
 * Run: npx tsx examples/02-node-counting.ts
 */

import {
  countTokens,
  countTokensBatch,
  AccurateTokenCounter,
  DEFAULTS,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Simplest Usage (one line)
// ============================================================================

const simple = countTokens('Hello, world!')
console.log(`Simple count: ${simple} tokens`)

// ============================================================================
// With Specific Model
// ============================================================================

const gpt4 = countTokens('Hello, world!', { model: 'gpt-4o' })
const claude = countTokens('Hello, world!', { model: 'claude-3-5-sonnet' })
console.log(`GPT-4o: ${gpt4} tokens, Claude: ${claude} tokens`)

// ============================================================================
// Batch Counting
// ============================================================================

const texts = [
  'First message',
  'Second message with more content',
  'Third message that is even longer than the others',
]

const counts = countTokensBatch(texts)
console.log('Batch counts:', counts)

// Total tokens for all messages
const total = counts.reduce((sum, count) => sum + count, 0)
console.log(`Total: ${total} tokens`)

// ============================================================================
// Using the Class for Better Performance
// ============================================================================

// Create once, reuse for better performance (has internal caching)
const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  enableCaching: true,
})

// Count individual texts
const count1 = counter.count('Hello, world!')
const count2 = counter.count('How are you today?')
console.log(`With class: ${count1} + ${count2} = ${count1 + count2} tokens`)

// Get detailed info
const info = counter.getTokenInfo('Hello, world!')
console.log('Token info:', {
  tokens: info.tokens,
  characters: info.characters,
  words: info.words,
  ratio: info.ratio.toFixed(2), // chars per token
})

// Check cache performance
const stats = counter.getCacheStats()
console.log('Cache stats:', {
  hits: stats.hits,
  misses: stats.misses,
  hitRate: (stats.hitRate * 100).toFixed(1) + '%',
})

// Clean up when done
counter.destroy()

// ============================================================================
// Using Defaults
// ============================================================================

console.log('\n--- DEFAULTS ---')
console.log(`Default model: ${DEFAULTS.model}`)
console.log(`Default debounce: ${DEFAULTS.debounceMs}ms`)
console.log(`Default cache size: ${DEFAULTS.maxCacheSize}`)
console.log(`Default cache TTL: ${DEFAULTS.cacheTtlMs}ms`)

// ============================================================================
// Practical Example: API Cost Estimation
// ============================================================================

const PRICING = {
  'gpt-4o': { input: 2.5, output: 10 }, // per 1M tokens
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'claude-3-5-sonnet': { input: 3, output: 15 },
}

function estimateCost(
  prompt: string,
  expectedOutputTokens: number,
  model: keyof typeof PRICING
) {
  const inputTokens = countTokens(prompt, { model })
  const pricing = PRICING[model]

  const inputCost = (inputTokens / 1_000_000) * pricing.input
  const outputCost = (expectedOutputTokens / 1_000_000) * pricing.output
  const totalCost = inputCost + outputCost

  return {
    inputTokens,
    outputTokens: expectedOutputTokens,
    inputCost: `$${inputCost.toFixed(6)}`,
    outputCost: `$${outputCost.toFixed(6)}`,
    totalCost: `$${totalCost.toFixed(6)}`,
  }
}

console.log('\n--- COST ESTIMATION ---')
const prompt = 'Explain quantum computing in simple terms.'
console.log(estimateCost(prompt, 500, 'gpt-4o'))
console.log(estimateCost(prompt, 500, 'gpt-4o-mini'))
console.log(estimateCost(prompt, 500, 'claude-3-5-sonnet'))
