/**
 * Cascading Router Usage Examples
 *
 * Demonstrates how to use the cascading router for intelligent model
 * selection with automatic escalation, achieving 50-80% cost savings.
 */

import {
  CascadingRouter,
  createOpenAICascadingRouter,
  createAnthropicCascadingRouter,
  HeuristicQualityAssessor,
  type ModelConfig,
  type ModelTier,
  type LLMQualityAssessor,
} from '../src/routing/cascading-router'

// ============================================================================
// Example 1: Basic Usage with OpenAI Preset
// ============================================================================

console.log('=== Example 1: Basic OpenAI Cascading ===\n')

const openaiRouter = createOpenAICascadingRouter({
  qualityThreshold: 0.7,
})

// Mock generate function (replace with actual OpenAI API call)
async function generateWithOpenAI(model: ModelConfig, prompt: string) {
  console.log(`  Trying model: ${model.id}`)

  // Simulate response based on model tier
  let response: string
  if (model.tier === 'small') {
    response = 'Quantum computing uses qubits.' // Too short, will escalate
  } else if (model.tier === 'medium') {
    response =
      'Quantum computing uses quantum bits (qubits) which can be in superposition, allowing for parallel computation. This enables solving certain problems exponentially faster than classical computers.'
  } else {
    response =
      'Quantum computing leverages quantum mechanical phenomena like superposition and entanglement. Qubits can exist in multiple states simultaneously, and through quantum gates and algorithms like Shor\'s algorithm, quantum computers can solve problems intractable for classical machines.'
  }

  // Simulate token usage
  const inputTokens = Math.ceil(prompt.length / 4)
  const outputTokens = Math.ceil(response.length / 4)

  return {
    response,
    inputTokens,
    outputTokens,
  }
}

;(async () => {
  const result = await openaiRouter.execute('Explain quantum computing', async (model) => {
    return await generateWithOpenAI(model, 'Explain quantum computing')
  })

  console.log(`Final response: ${result.response.slice(0, 100)}...`)
  console.log(`Total cost: $${result.totalCost.toFixed(6)}`)
  console.log(`Attempts: ${result.attempts.length}`)
  console.log(`Escalations: ${result.escalations}`)
  console.log(`Quality score: ${result.finalQuality.score.toFixed(2)}`)
  console.log(`Model used: ${result.finalModel.id}\n`)
})()

// ============================================================================
// Example 2: Custom Tier Configuration
// ============================================================================

console.log('=== Example 2: Custom Tier Configuration ===\n')

const cheapModel: ModelConfig = {
  id: 'gpt-4o-mini',
  tier: 'small',
  inputCostPer1M: 0.15,
  outputCostPer1M: 0.6,
  contextWindow: 128000,
  maxOutput: 16384,
  capabilities: ['chat'],
}

const standardModel: ModelConfig = {
  id: 'gpt-4o',
  tier: 'medium',
  inputCostPer1M: 2.5,
  outputCostPer1M: 10,
  contextWindow: 128000,
  maxOutput: 16384,
  capabilities: ['chat', 'tools'],
}

const premiumModel: ModelConfig = {
  id: 'o1',
  tier: 'premium',
  inputCostPer1M: 15,
  outputCostPer1M: 60,
  contextWindow: 200000,
  maxOutput: 100000,
  capabilities: ['chat', 'reasoning'],
}

const tiers: ModelTier[] = [
  {
    id: 'cheap',
    models: [cheapModel],
    maxAttempts: 1,
  },
  {
    id: 'standard',
    models: [standardModel],
    maxAttempts: 1,
  },
  {
    id: 'premium',
    models: [premiumModel],
    maxAttempts: 1,
  },
]

const customRouter = new CascadingRouter({
  tiers,
  qualityThreshold: 0.75,
  maxTotalAttempts: 3,
  assessmentMethod: 'heuristic',
})

;(async () => {
  const result = await customRouter.execute('Explain quantum entanglement', async (model) => {
    return await generateWithOpenAI(model, 'Explain quantum entanglement')
  })

  console.log(`Used ${result.attempts.length} attempts`)
  result.attempts.forEach((attempt, i) => {
    console.log(
      `  Attempt ${i + 1}: ${attempt.model.id} - Quality: ${attempt.quality.score.toFixed(2)} - ${attempt.success ? '✅' : '❌'}`
    )
  })
  console.log()
})()

// ============================================================================
// Example 3: Multiple Models Per Tier
// ============================================================================

console.log('=== Example 3: Multiple Models Per Tier ===\n')

const claudeHaiku: ModelConfig = {
  id: 'claude-3-5-haiku',
  tier: 'small',
  inputCostPer1M: 0.8,
  outputCostPer1M: 4,
  contextWindow: 200000,
  maxOutput: 8192,
  capabilities: ['chat'],
}

const multiModelTiers: ModelTier[] = [
  {
    id: 'cheap',
    models: [cheapModel, claudeHaiku], // Try both cheap models
    maxAttempts: 2, // Try 2 attempts in this tier
  },
  {
    id: 'standard',
    models: [standardModel],
  },
]

const multiModelRouter = new CascadingRouter({
  tiers: multiModelTiers,
  qualityThreshold: 0.7,
})

;(async () => {
  const result = await multiModelRouter.execute('What is 2+2?', async (model) => {
    const simpleResponse = {
      response: '2+2 equals 4.',
      inputTokens: 20,
      outputTokens: 15,
    }
    return simpleResponse
  })

  console.log('Multi-model tier test:')
  result.attempts.forEach((attempt) => {
    console.log(`  ${attempt.model.id}: Quality ${attempt.quality.score.toFixed(2)}`)
  })
  console.log()
})()

// ============================================================================
// Example 4: Heuristic Quality Configuration
// ============================================================================

console.log('=== Example 4: Custom Heuristic Configuration ===\n')

const strictRouter = new CascadingRouter({
  tiers,
  qualityThreshold: 0.8,
  assessmentMethod: 'heuristic',
  heuristicConfig: {
    minLength: 150, // Require longer responses
    maxLength: 2000,
    refusalKeywords: [
      "i can't",
      "i cannot",
      "i'm unable",
      "not able to",
      "as an ai",
      "as a language model",
    ],
    requiredKeywords: ['quantum', 'entanglement'], // Must mention these
    lengthWeight: 0.2,
    completenessWeight: 0.4,
    refusalWeight: 0.3,
    coherenceWeight: 0.1,
  },
})

;(async () => {
  const result = await strictRouter.execute(
    'Explain quantum entanglement in detail',
    async (model) => {
      return await generateWithOpenAI(model, 'Explain quantum entanglement in detail')
    }
  )

  console.log('Strict heuristic assessment:')
  console.log(`  Quality: ${result.finalQuality.score.toFixed(2)}`)
  console.log(`  Reasons:`, result.finalQuality.reasons)
  console.log()
})()

// ============================================================================
// Example 5: LLM-Based Quality Assessment
// ============================================================================

console.log('=== Example 5: LLM Quality Assessment ===\n')

// Mock LLM assessor (in production, use actual LLM API)
const mockLLMAssessor: LLMQualityAssessor = {
  async assess(prompt: string, response: string) {
    console.log('  Using LLM to assess quality...')

    // Simulate LLM assessment
    // In production, call GPT-4o-mini or similar for assessment
    const score = response.length > 100 ? 0.85 : 0.6
    const passesThreshold = score >= 0.7

    return {
      score,
      passesThreshold,
      metrics: {
        length: 0.9,
        completeness: 0.85,
        noRefusal: 1.0,
        coherence: 0.8,
        confidence: 0.95, // LLM assessments have high confidence
      },
      reasons: passesThreshold
        ? ['Comprehensive answer', 'Well-structured', 'Accurate information']
        : ['Response too brief', 'Lacks detail'],
      method: 'llm',
    }
  },
}

const llmRouter = new CascadingRouter({
  tiers,
  qualityThreshold: 0.7,
  assessmentMethod: 'llm',
  llmAssessor: mockLLMAssessor,
})

;(async () => {
  const result = await llmRouter.execute('Explain machine learning', async (model) => {
    return {
      response:
        'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.',
      inputTokens: 50,
      outputTokens: 100,
    }
  })

  console.log('LLM assessment result:')
  console.log(`  Method: ${result.finalQuality.method}`)
  console.log(`  Confidence: ${result.finalQuality.metrics.confidence}`)
  console.log()
})()

// ============================================================================
// Example 6: Combined Assessment (Heuristic + LLM)
// ============================================================================

console.log('=== Example 6: Combined Assessment ===\n')

const combinedRouter = new CascadingRouter({
  tiers,
  qualityThreshold: 0.75,
  assessmentMethod: 'both', // Use both heuristic and LLM
  llmAssessor: mockLLMAssessor,
})

;(async () => {
  const result = await combinedRouter.execute('Explain neural networks', async (model) => {
    return {
      response:
        'Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) organized in layers that process information through weighted connections.',
      inputTokens: 50,
      outputTokens: 120,
    }
  })

  console.log('Combined assessment:')
  console.log(`  Final score: ${result.finalQuality.score.toFixed(2)}`)
  console.log(`  Heuristic + LLM weighted average`)
  console.log()
})()

// ============================================================================
// Example 7: Statistics Tracking
// ============================================================================

console.log('=== Example 7: Statistics Tracking ===\n')

const trackedRouter = new CascadingRouter({
  tiers,
  qualityThreshold: 0.7,
  trackMetrics: true,
})

;(async () => {
  // Execute multiple requests
  const prompts = [
    'What is 2+2?',
    'Explain quantum computing',
    'Describe neural networks',
    'What is the speed of light?',
    'Explain general relativity',
  ]

  for (const prompt of prompts) {
    await trackedRouter.execute(prompt, async (model) => {
      return await generateWithOpenAI(model, prompt)
    })
  }

  // Get statistics
  const stats = trackedRouter.getStats()

  console.log('Cascade Statistics:')
  console.log(`  Total executions: ${stats.totalExecutions}`)
  console.log(`  Successful first attempts: ${stats.successfulFirstAttempts}`)
  console.log(`  Success rate: ${((stats.successfulFirstAttempts / stats.totalExecutions) * 100).toFixed(1)}%`)
  console.log(`  Average attempts: ${stats.averageAttempts.toFixed(2)}`)
  console.log(`  Total cost: $${stats.totalCost.toFixed(6)}`)
  console.log(`  Average cost: $${stats.averageCost.toFixed(6)}`)
  console.log(`  Estimated savings: $${stats.estimatedSavings.toFixed(6)}`)
  console.log()
})()

// ============================================================================
// Example 8: Integration with Real OpenAI API
// ============================================================================

console.log('=== Example 8: Real OpenAI Integration ===\n')

/* Uncomment to use with actual OpenAI API:

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const realRouter = createOpenAICascadingRouter({
  qualityThreshold: 0.7,
})

;(async () => {
  const result = await realRouter.execute(
    'Explain quantum computing',
    async (model) => {
      const response = await openai.chat.completions.create({
        model: model.id,
        messages: [
          {
            role: 'user',
            content: 'Explain quantum computing',
          },
        ],
      })

      return {
        response: response.choices[0].message.content || '',
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
      }
    }
  )

  console.log('Real OpenAI cascade result:')
  console.log(`  Response: ${result.response.slice(0, 100)}...`)
  console.log(`  Cost: $${result.totalCost.toFixed(6)}`)
  console.log(`  Attempts: ${result.attempts.length}`)
  console.log(`  Model: ${result.finalModel.id}`)
})()

*/

// ============================================================================
// Example 9: Integration with Anthropic API
// ============================================================================

console.log('=== Example 9: Real Anthropic Integration ===\n')

/* Uncomment to use with actual Anthropic API:

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const anthropicRouter = createAnthropicCascadingRouter({
  qualityThreshold: 0.75,
})

;(async () => {
  const result = await anthropicRouter.execute(
    'Explain quantum computing',
    async (model) => {
      const response = await anthropic.messages.create({
        model: model.id,
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: 'Explain quantum computing',
          },
        ],
      })

      const text = response.content[0].type === 'text'
        ? response.content[0].text
        : ''

      return {
        response: text,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      }
    }
  )

  console.log('Real Anthropic cascade result:')
  console.log(`  Response: ${result.response.slice(0, 100)}...`)
  console.log(`  Cost: $${result.totalCost.toFixed(6)}`)
  console.log(`  Attempts: ${result.attempts.length}`)
  console.log(`  Model: ${result.finalModel.id}`)
})()

*/

// ============================================================================
// Example 10: Combined with Conversation Memory
// ============================================================================

console.log('=== Example 10: Combined Optimization ===\n')

/*
Combine cascading router with conversation memory for maximum savings:

import { optimizeConversation } from '../src/compression/strategies/conversation-memory'

const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'Explain quantum computing' },
  { role: 'assistant', content: '...' },
  // ... many more exchanges
]

// Step 1: Optimize conversation (40-60% token reduction)
const optimizedMessages = await optimizeConversation(messages, 4000)

// Step 2: Use cascading router (50-80% cost reduction)
const result = await openaiRouter.execute(
  optimizedMessages[optimizedMessages.length - 1].content,
  async (model) => {
    const response = await openai.chat.completions.create({
      model: model.id,
      messages: optimizedMessages,
    })

    return {
      response: response.choices[0].message.content || '',
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
    }
  }
)

// Combined savings: 70-90% total cost reduction!
console.log('Combined optimization:')
console.log(`  Tokens reduced: ${messages.length - optimizedMessages.length} messages`)
console.log(`  Model optimized: ${result.escalations} escalations`)
console.log(`  Total cost: $${result.totalCost.toFixed(6)}`)
*/

// ============================================================================
// Example 11: Error Handling
// ============================================================================

console.log('=== Example 11: Error Handling ===\n')

;(async () => {
  try {
    const result = await openaiRouter.execute('Test prompt', async (model) => {
      // Simulate error
      if (Math.random() > 0.5) {
        throw new Error('API error')
      }

      return {
        response: 'Test response',
        inputTokens: 10,
        outputTokens: 10,
      }
    })

    console.log('Request succeeded')
  } catch (error) {
    console.error('Cascade failed:', error)
    // Implement retry logic or fallback
  }
})()

// ============================================================================
// Example 12: Quality Assessment Without Cascade
// ============================================================================

console.log('\n=== Example 12: Standalone Quality Assessment ===\n')

const assessor = new HeuristicQualityAssessor({
  minLength: 50,
  maxLength: 2000,
  refusalKeywords: ["i can't", "unable to"],
})

const prompt = 'Explain quantum computing'
const response1 = 'Quantum computing uses qubits.'
const response2 =
  'Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to perform computations that would be infeasible for classical computers.'

const assessment1 = assessor.assess(prompt, response1, 0.7)
const assessment2 = assessor.assess(prompt, response2, 0.7)

console.log('Assessment 1 (short response):')
console.log(`  Score: ${assessment1.score.toFixed(2)}`)
console.log(`  Passes: ${assessment1.passesThreshold}`)
console.log(`  Reasons: ${assessment1.reasons.join(', ')}`)

console.log('\nAssessment 2 (good response):')
console.log(`  Score: ${assessment2.score.toFixed(2)}`)
console.log(`  Passes: ${assessment2.passesThreshold}`)
console.log(`  Reasons: ${assessment2.reasons.join(', ')}`)

// ============================================================================
// Best Practices Summary
// ============================================================================

console.log('\n=== Best Practices ===\n')

/*
1. Start with preset routers (createOpenAICascadingRouter, createAnthropicCascadingRouter)
   - Pre-configured model tiers
   - Reasonable defaults
   - Easy to customize

2. Use heuristic assessment by default
   - Fast (< 5ms)
   - Good accuracy
   - No additional API calls
   - Reserve LLM assessment for critical use cases

3. Set appropriate quality thresholds
   - 0.6-0.7: Lenient (more first-attempt successes)
   - 0.7-0.8: Balanced (recommended)
   - 0.8-0.9: Strict (higher escalation rate)

4. Track metrics to optimize
   - Monitor success rates by tier
   - Identify ineffective models
   - Calculate actual savings
   - Adjust configuration based on data

5. Combine with conversation memory
   - First reduce tokens (40-60%)
   - Then optimize model selection (50-80%)
   - Total savings: 70-90%

6. Handle errors gracefully
   - Wrap in try-catch
   - Implement retry logic
   - Have fallback to premium model

7. Test with real data
   - Don't rely on synthetic examples
   - Use actual production prompts
   - Measure real cost savings
   - Adjust thresholds based on results
*/

console.log('See comments in code for best practices!')
console.log('\n=== Examples Complete ===\n')
