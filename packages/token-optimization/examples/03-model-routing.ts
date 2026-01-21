/**
 * Example 03: Model Routing
 *
 * Automatically route prompts to the optimal model based on
 * complexity, cost, and quality requirements.
 *
 * Run: npx tsx examples/03-model-routing.ts
 */

import {
  ModelRouter,
  ModelRouterBuilder,
  RoutingStrategy,
  ComplexityAnalyzer,
} from '@clarity-chat/token-optimization'

// ============================================================================
// Simplest Usage: Default Router
// ============================================================================

const router = ModelRouter.default()

// Route a simple prompt
const simpleResult = router.route('What is 2 + 2?')
console.log('Simple prompt:')
console.log(`  Model: ${simpleResult.model}`)
console.log(`  Cost: $${simpleResult.cost.toFixed(6)}`)
console.log(`  Reason: ${simpleResult.reason}`)

// Route a complex prompt
const complexResult = router.route(`
  Analyze the following code for security vulnerabilities,
  suggest improvements, and explain the time complexity
  of each function. Also provide unit test suggestions.

  function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const left = arr.slice(1).filter(x => x < pivot);
    const right = arr.slice(1).filter(x => x >= pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
  }
`)
console.log('\nComplex prompt:')
console.log(`  Model: ${complexResult.model}`)
console.log(`  Cost: $${complexResult.cost.toFixed(6)}`)
console.log(`  Reason: ${complexResult.reason}`)

// ============================================================================
// Builder Pattern: Custom Router
// ============================================================================

console.log('\n--- BUILDER PATTERN ---')

// Cost-optimized router (uses cheapest models)
const cheapRouter = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .build()

const cheapResult = cheapRouter.route('Summarize this article.')
console.log(
  `Cost-optimized: ${cheapResult.model} ($${cheapResult.cost.toFixed(6)})`
)

// Quality-first router (uses best models)
const qualityRouter = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .withStrategy('quality-first')
  .build()

const qualityResult = qualityRouter.route('Summarize this article.')
console.log(
  `Quality-first: ${qualityResult.model} ($${qualityResult.cost.toFixed(6)})`
)

// ============================================================================
// Custom Models
// ============================================================================

console.log('\n--- CUSTOM MODELS ---')

const customRouter = ModelRouter.builder()
  // Add individual models with full control
  .addModel({
    id: 'my-fine-tuned-model',
    tier: 'premium',
    contextWindow: 16384,
    inputCostPer1M: 5.0,
    outputCostPer1M: 15.0,
    capabilities: ['code', 'analysis'],
  })
  // Or use shorthand
  .addModel('gpt-4o-mini', 'economy', 0.15, 0.6, 128000)
  .addModel('gpt-4o', 'premium', 2.5, 10.0, 128000)
  .withStrategy('balanced')
  .build()

console.log('Custom router with fine-tuned model configured')

// ============================================================================
// Routing with Options
// ============================================================================

console.log('\n--- ROUTING WITH OPTIONS ---')

// Force a specific tier
const forcedResult = router.route('Hello', {
  preferTier: 'economy',
})
console.log(`Forced economy: ${forcedResult.model}`)

// Require specific capabilities
const codeResult = router.route('Write a Python function', {
  requiredCapabilities: ['code'],
})
console.log(`Code capability: ${codeResult.model}`)

// ============================================================================
// Complexity Analysis
// ============================================================================

console.log('\n--- COMPLEXITY ANALYSIS ---')

const analyzer = new ComplexityAnalyzer()

const prompts = [
  'Hi',
  'What is the capital of France?',
  'Explain quantum entanglement and its applications in computing.',
  'Design a distributed system for handling 1M requests per second with global failover.',
]

for (const prompt of prompts) {
  const result = analyzer.analyze(prompt)
  console.log(`"${prompt.slice(0, 40)}..."`)
  console.log(`  Level: ${result.level}`)
  console.log(`  Score: ${result.score.toFixed(2)}`)
  console.log(`  Factors: ${JSON.stringify(result.factors)}`)
}

// ============================================================================
// Router Statistics
// ============================================================================

console.log('\n--- ROUTER STATISTICS ---')

// Make some routing decisions
for (let i = 0; i < 10; i++) {
  router.route('Test prompt ' + i)
}

const stats = router.getStats()
console.log('Router stats:')
console.log(`  Total routes: ${stats.totalRoutes}`)
console.log(`  By model: ${JSON.stringify(stats.routesByModel)}`)
console.log(`  Avg cost: $${stats.averageCost.toFixed(6)}`)

// ============================================================================
// Practical Example: Dynamic Routing
// ============================================================================

console.log('\n--- PRACTICAL: DYNAMIC ROUTING ---')

type Message = { role: 'user' | 'assistant'; content: string }

function routeConversation(messages: Message[]) {
  // Build context from conversation
  const context = messages.map((m) => `${m.role}: ${m.content}`).join('\n')

  // Route based on full context
  const result = router.route(context)

  return {
    suggestedModel: result.model,
    estimatedCost: result.cost,
    reason: result.reason,
  }
}

const conversation = [
  { role: 'user' as const, content: 'Hello!' },
  { role: 'assistant' as const, content: 'Hi there! How can I help?' },
  {
    role: 'user' as const,
    content: 'Can you analyze this codebase for security issues?',
  },
]

console.log(routeConversation(conversation))
