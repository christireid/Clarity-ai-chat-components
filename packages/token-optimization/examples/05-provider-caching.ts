/**
 * Provider-Native Caching Example
 *
 * Demonstrates how to use provider-native caching to achieve
 * 90% cost reduction on cached tokens with Anthropic, OpenAI, and Google.
 *
 * Run: npx tsx examples/05-provider-caching.ts
 */

import {
  quickCache,
  anthropicCache,
  openaiCache,
  googleCache,
  createProviderCache,
  estimateCacheSavings,
} from '../src/index'

/**
 * Example 1: Zero-Config Quick Caching
 *
 * The simplest way to add provider caching to your application.
 */
async function example1_quickCache() {
  console.log('\n=== Example 1: Zero-Config Quick Caching ===\n')

  const messages = [
    {
      role: 'system' as const,
      content:
        'You are a helpful coding assistant with expertise in TypeScript, React, and Node.js. You provide clear, concise answers with code examples. '.repeat(
          20
        ), // ~1500 tokens
    },
    {
      role: 'user' as const,
      content: 'How do I create a React component with TypeScript?',
    },
  ]

  // Use default provider (Anthropic)
  const result = await quickCache(messages)

  console.log('Caching applied:', result.cached)
  console.log('Provider:', result.metadata.provider)
  console.log('Cached tokens:', result.metadata.cachedTokens)
  console.log(
    'Estimated savings:',
    `${(result.estimatedSavings.percentage * 100).toFixed(1)}%`
  )
  console.log(
    'Cost reduction:',
    `$${result.estimatedSavings.costReduction.toFixed(4)}`
  )

  if (result.recommendations.length > 0) {
    console.log('\nRecommendations:')
    result.recommendations.forEach((rec) => console.log(`  - ${rec}`))
  }
}

/**
 * Example 2: Provider-Specific Functions
 *
 * Use provider-specific functions for clarity.
 */
async function example2_providerSpecific() {
  console.log('\n=== Example 2: Provider-Specific Functions ===\n')

  const messages = [
    {
      role: 'system' as const,
      content: 'You are an expert SQL database administrator. '.repeat(100), // ~1000+ tokens
    },
    {
      role: 'user' as const,
      content: 'How do I optimize this slow query?',
    },
  ]

  // Anthropic caching
  const anthropicResult = await anthropicCache(messages)
  console.log('Anthropic caching:', anthropicResult.cached)
  console.log(
    '  - Breakpoints:',
    anthropicResult.metadata.providerDetails?.breakpointCount
  )

  // OpenAI caching (automatic for prompts ≥1024 tokens)
  const openaiResult = await openaiCache(messages)
  console.log('\nOpenAI caching:', openaiResult.cached)
  console.log(
    '  - Retention:',
    openaiResult.metadata.providerDetails?.retention
  )

  // Google Gemini caching (implicit mode)
  const googleResult = await googleCache(messages)
  console.log('\nGoogle caching:', googleResult.cached)
  console.log('  - Mode: implicit')
}

/**
 * Example 3: Reusable Cache Function
 *
 * Create a cache function once, use it many times.
 */
async function example3_reusableCache() {
  console.log('\n=== Example 3: Reusable Cache Function ===\n')

  // Create a cache function with custom configuration
  const cache = createProviderCache({
    provider: 'anthropic',
    minTokens: 2048, // Higher threshold for caching
    autoSelectProvider: false,
  })

  // Use it multiple times
  const result1 = await cache([
    {
      role: 'system' as const,
      content: 'You are a helpful assistant. '.repeat(300), // ~2100 tokens
    },
    { role: 'user' as const, content: 'What is TypeScript?' },
  ])

  console.log('First call:')
  console.log('  - Cached:', result1.cached)
  console.log(
    '  - Tokens:',
    result1.estimatedSavings.tokens,
    '/',
    result1.metadata.cachedTokens
  )

  const result2 = await cache([
    {
      role: 'system' as const,
      content: 'You are a helpful assistant. '.repeat(300),
    },
    { role: 'user' as const, content: 'What is JavaScript?' },
  ])

  console.log('\nSecond call (same system prompt):')
  console.log('  - Cached:', result2.cached)
  console.log('  - Same benefits on subsequent calls!')
}

/**
 * Example 4: Estimate Savings Before Applying
 *
 * Check if caching will be beneficial before committing.
 */
async function example4_estimateSavings() {
  console.log('\n=== Example 4: Estimate Savings ===\n')

  const smallMessages = [
    { role: 'system' as const, content: 'You are a helpful assistant.' },
    { role: 'user' as const, content: 'Hello!' },
  ]

  const largeMessages = [
    {
      role: 'system' as const,
      content: 'You are a helpful assistant. '.repeat(200), // ~1400 tokens
    },
    { role: 'user' as const, content: 'Hello!' },
  ]

  // Estimate for small messages (below threshold)
  const smallEstimate = await estimateCacheSavings(smallMessages, 'anthropic')
  console.log('Small messages estimate:')
  console.log('  - Eligible:', smallEstimate.eligible)
  console.log('  - Tokens:', smallEstimate.estimatedTokens)
  console.log('  - Recommendation:', smallEstimate.recommendation)

  // Estimate for large messages (above threshold)
  const largeEstimate = await estimateCacheSavings(largeMessages, 'anthropic')
  console.log('\nLarge messages estimate:')
  console.log('  - Eligible:', largeEstimate.eligible)
  console.log('  - Tokens:', largeEstimate.estimatedTokens)
  console.log('  - Savings:', `${largeEstimate.estimatedSavingsPercent}%`)
  console.log('  - Recommendation:', largeEstimate.recommendation)
}

/**
 * Example 5: Advanced Configuration
 *
 * Full control over provider caching behavior.
 */
async function example5_advancedConfig() {
  console.log('\n=== Example 5: Advanced Configuration ===\n')

  // Auto-select provider based on content size
  const adaptiveCache = createProviderCache({
    autoSelectProvider: true, // Anthropic for <5K tokens, OpenAI for ≥5K
  })

  const mediumContent = [
    {
      role: 'system' as const,
      content: 'System prompt. '.repeat(200), // ~1400 tokens
    },
    { role: 'user' as const, content: 'Question' },
  ]

  const largeContent = [
    {
      role: 'system' as const,
      content: 'System prompt. '.repeat(800), // ~5600 tokens
    },
    { role: 'user' as const, content: 'Question' },
  ]

  const mediumResult = await adaptiveCache(mediumContent)
  console.log('Medium content (~1400 tokens):')
  console.log('  - Selected provider:', mediumResult.metadata.provider)

  const largeResult = await adaptiveCache(largeContent)
  console.log('\nLarge content (~5600 tokens):')
  console.log('  - Selected provider:', largeResult.metadata.provider)
}

/**
 * Example 6: Real-World Use Case - Document Q&A
 *
 * Cache large document context, vary questions.
 */
async function example6_documentQA() {
  console.log('\n=== Example 6: Document Q&A Use Case ===\n')

  const cache = createProviderCache({ provider: 'openai' })

  // Simulated large document (would be loaded from file in real app)
  const documentContext = `
    This is a comprehensive guide to TypeScript...
    [Imagine 5000+ tokens of documentation here]
  `.repeat(100) // ~1500+ tokens

  // First question
  const q1 = await cache([
    {
      role: 'system' as const,
      content: `You are answering questions about this document:\n\n${documentContext}`,
      cacheable: true, // Mark as cacheable
    },
    { role: 'user' as const, content: 'What is TypeScript?' },
  ])

  console.log('Question 1:')
  console.log('  - Cached:', q1.cached)
  console.log(
    '  - Savings:',
    `${(q1.estimatedSavings.percentage * 100).toFixed(1)}%`
  )

  // Second question (same document, different question)
  const q2 = await cache([
    {
      role: 'system' as const,
      content: `You are answering questions about this document:\n\n${documentContext}`,
      cacheable: true,
    },
    {
      role: 'user' as const,
      content: 'What are the benefits of TypeScript?',
    },
  ])

  console.log('\nQuestion 2 (same document):')
  console.log('  - Cached:', q2.cached)
  console.log('  - Document context is reused from cache = 90% cheaper! 🎉')
}

/**
 * Run all examples
 */
async function main() {
  console.log('🎯 Provider-Native Caching Examples\n')
  console.log('Demonstrating 90% cost reduction with provider caching\n')

  try {
    await example1_quickCache()
    await example2_providerSpecific()
    await example3_reusableCache()
    await example4_estimateSavings()
    await example5_advancedConfig()
    await example6_documentQA()

    console.log('\n✅ All examples completed!\n')
    console.log('💡 Key Takeaways:')
    console.log('  1. Use quickCache() for zero-config caching')
    console.log('  2. All providers offer 90% savings on cached tokens')
    console.log('  3. Minimum 1024 tokens required for caching')
    console.log('  4. Mark static content as cacheable, vary dynamic content')
    console.log('  5. Use estimateCacheSavings() to check before applying\n')
    console.log('📚 Full documentation: docs/PROVIDER_CACHING.md\n')
  } catch (error) {
    console.error('Error running examples:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export {
  example1_quickCache,
  example2_providerSpecific,
  example3_reusableCache,
  example4_estimateSavings,
  example5_advancedConfig,
  example6_documentQA,
}
