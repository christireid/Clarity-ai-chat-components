/**
 * Context Window Management Examples
 *
 * Demonstrates how to use conversation memory strategies to reduce
 * token consumption in multi-turn conversations by 40-60%.
 */

import {
  SlidingWindowStrategy,
  ImportanceBasedStrategy,
  SummarizationStrategy,
  AdaptiveConversationStrategy,
  optimizeConversation,
  type ConversationMessage,
  type ConversationSummarizer,
} from '../src/compression/strategies/conversation-memory'

// ============================================================================
// Example 1: Basic Sliding Window
// ============================================================================

console.log('=== Example 1: Sliding Window Strategy ===\n')

// Simulate a conversation with 20 exchanges
const longConversation: ConversationMessage[] = [
  { role: 'system', content: 'You are a helpful AI assistant.' },
]

for (let i = 1; i <= 20; i++) {
  longConversation.push(
    { role: 'user', content: `User question ${i}` },
    { role: 'assistant', content: `Assistant response ${i}` }
  )
}

// Keep only last 10 messages
const slidingWindow = new SlidingWindowStrategy({ windowSize: 10 })

slidingWindow.optimize(longConversation).then((result) => {
  console.log(`Original: ${result.originalMessages.length} messages, ${result.originalTokens} tokens`)
  console.log(`Optimized: ${result.messages.length} messages, ${result.optimizedTokens} tokens`)
  console.log(`Saved: ${result.tokensSaved} tokens (${(result.compressionRatio * 100).toFixed(1)}% remaining)`)
  console.log(`Strategy: ${result.strategy}\n`)
})

// ============================================================================
// Example 2: Importance-Based Selection
// ============================================================================

console.log('=== Example 2: Importance-Based Selection ===\n')

const conversation: ConversationMessage[] = [
  { role: 'system', content: 'You are a helpful AI assistant.' },
  {
    role: 'user',
    content: 'I decided to buy the new laptop for $1,500. Can you help me set it up?',
  },
  {
    role: 'assistant',
    content: 'Great choice! I can definitely help you set up your new laptop.',
  },
  {
    role: 'user',
    content: 'What is the weather like?',
  },
  {
    role: 'assistant',
    content: 'I don\'t have access to weather information.',
  },
  {
    role: 'user',
    content: 'The setup deadline is next Monday. I need to finish by then.',
  },
  {
    role: 'assistant',
    content: 'Understood. Let\'s make sure everything is ready by Monday.',
  },
  {
    role: 'user',
    content: 'Just chatting now...',
  },
  {
    role: 'assistant',
    content: 'Sure, I\'m here to chat!',
  },
]

// Optimize to 400 tokens, prioritizing important messages
const importanceBased = new ImportanceBasedStrategy({
  maxTokens: 400,
  recencyWeight: 0.3,
  userWeight: 0.4,
  contentWeight: 0.3,
})

importanceBased.optimize(conversation).then((result) => {
  console.log(`Original: ${result.originalMessages.length} messages`)
  console.log(`Optimized: ${result.messages.length} messages`)
  console.log(`Tokens saved: ${result.tokensSaved}`)
  console.log('Preserved messages:')
  result.messages.forEach((msg, i) => {
    console.log(`  ${i + 1}. [${msg.role}] ${msg.content.slice(0, 60)}...`)
  })
  console.log()
})

// ============================================================================
// Example 3: Summarization Strategy
// ============================================================================

console.log('=== Example 3: Summarization Strategy ===\n')

// Mock LLM summarizer (in production, use real LLM API)
class SimpleSummarizer implements ConversationSummarizer {
  async summarize(messages: ConversationMessage[], maxTokens: number): Promise<string> {
    // In production, call GPT-4o-mini or Claude Haiku for cheap summarization
    const topics = messages
      .filter((m) => m.role === 'user')
      .map((m) => {
        // Extract key topics (simple keyword extraction)
        const words = m.content.split(/\s+/)
        return words.slice(0, 3).join(' ')
      })
      .slice(0, 3)

    return `Previous discussion covered: ${topics.join(', ')}. User asked ${messages.filter((m) => m.role === 'user').length} questions.`
  }
}

const summarizer = new SimpleSummarizer()

const summarizationStrategy = new SummarizationStrategy({
  summarizer,
  maxTokens: 1000,
  keepRecentMessages: 4, // Keep last 4 messages intact
  summaryMaxTokens: 200, // Limit summary to 200 tokens
})

summarizationStrategy.optimize(longConversation).then((result) => {
  console.log(`Original: ${result.originalMessages.length} messages, ${result.originalTokens} tokens`)
  console.log(`Optimized: ${result.messages.length} messages, ${result.optimizedTokens} tokens`)
  console.log(`Summarized: ${result.metadata.summarized}`)
  console.log(`Summary tokens: ${result.metadata.summaryTokens}`)

  if (result.metadata.summarized) {
    const summaryMsg = result.messages.find((m) => m.metadata?.type === 'summary')
    console.log(`Summary: ${summaryMsg?.content}\n`)
  }
})

// ============================================================================
// Example 4: Adaptive Strategy (Automatic Selection)
// ============================================================================

console.log('=== Example 4: Adaptive Strategy ===\n')

const adaptive = new AdaptiveConversationStrategy({
  maxTokens: 1000,
  summarizer, // Optional: enables summarization for long conversations
  summarizeThreshold: 5000, // Use summarization above 5000 tokens
  importanceThreshold: 2000, // Use importance-based between 2000-5000 tokens
  defaultWindowSize: 10, // Use sliding window below 2000 tokens
})

// Test with different conversation lengths
const testConversations = [
  { name: 'Short (3 exchanges)', messages: [...longConversation.slice(0, 7)] },
  { name: 'Medium (10 exchanges)', messages: [...longConversation.slice(0, 21)] },
  { name: 'Long (20 exchanges)', messages: [...longConversation] },
]

for (const test of testConversations) {
  const info = adaptive.getStrategyInfo(test.messages)

  console.log(`${test.name}:`)
  console.log(`  Current tokens: ${info.currentTokens}`)
  console.log(`  Selected strategy: ${info.strategy}`)
  console.log(`  Reason: ${info.reason}`)

  adaptive.optimize(test.messages).then((result) => {
    console.log(`  Result: ${result.originalTokens} → ${result.optimizedTokens} tokens\n`)
  })
}

// ============================================================================
// Example 5: Quick Helper Function
// ============================================================================

console.log('=== Example 5: Quick Optimization ===\n')

const quickConversation: ConversationMessage[] = [
  { role: 'system', content: 'Be helpful and concise.' },
  { role: 'user', content: 'Explain quantum computing.' },
  { role: 'assistant', content: 'Quantum computing uses quantum bits (qubits)...' },
  { role: 'user', content: 'How is it different from classical computing?' },
  {
    role: 'assistant',
    content: 'Classical computers use bits (0 or 1), while quantum computers use qubits...',
  },
]

// One-liner optimization
optimizeConversation(quickConversation, 500).then((optimized) => {
  console.log(`Optimized to ${optimized.length} messages within 500 tokens`)
  console.log()
})

// ============================================================================
// Example 6: Integration with Chat Application
// ============================================================================

console.log('=== Example 6: Real-World Integration ===\n')

interface ChatState {
  messages: ConversationMessage[]
  maxContextTokens: number
}

class ChatApplication {
  private state: ChatState
  private optimizer: AdaptiveConversationStrategy

  constructor(maxContextTokens: number = 4000) {
    this.state = {
      messages: [],
      maxContextTokens,
    }

    // Use adaptive strategy with real LLM summarizer
    this.optimizer = new AdaptiveConversationStrategy({
      maxTokens: maxContextTokens,
      summarizer: new SimpleSummarizer(),
    })
  }

  async sendMessage(userMessage: string): Promise<string> {
    // Add user message to conversation
    this.state.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    })

    // Optimize conversation before sending to LLM
    const optimized = await this.optimizer.optimize(this.state.messages)

    // Send optimized conversation to LLM (mock response)
    const assistantResponse = `Response to: ${userMessage}`

    // Add assistant response
    this.state.messages.push({
      role: 'assistant',
      content: assistantResponse,
      timestamp: Date.now(),
    })

    // Update state with optimized messages
    this.state.messages = optimized.messages

    console.log(`Conversation optimized: ${optimized.originalTokens} → ${optimized.optimizedTokens} tokens`)
    console.log(`Strategy used: ${optimized.strategy}`)

    return assistantResponse
  }

  getMessages(): ConversationMessage[] {
    return this.state.messages
  }

  getTokenCount(): number {
    // Calculate current token count
    return this.state.messages.reduce((total, msg) => {
      // Simple estimation: 1 token ≈ 4 characters
      return total + Math.ceil(msg.content.length / 4)
    }, 0)
  }
}

// Usage
const chat = new ChatApplication(2000)

;(async () => {
  await chat.sendMessage('Hello, I need help with my project.')
  await chat.sendMessage('The deadline is next week.')
  await chat.sendMessage('I decided to use TypeScript.')
  await chat.sendMessage('Can you help me set up the build system?')

  console.log(`\nFinal conversation: ${chat.getMessages().length} messages`)
  console.log(`Total tokens: ${chat.getTokenCount()}`)
})()

// ============================================================================
// Example 7: Custom Strategy Configuration
// ============================================================================

console.log('\n=== Example 7: Custom Configuration ===\n')

// Aggressive compression for cost-sensitive applications
const aggressiveStrategy = new ImportanceBasedStrategy({
  maxTokens: 300, // Very tight budget
  recencyWeight: 0.5, // Prioritize recent messages
  userWeight: 0.8, // Heavily prioritize user messages
  contentWeight: 0.2, // Less weight on content analysis
})

// Conservative compression for quality-sensitive applications
const conservativeStrategy = new SlidingWindowStrategy({
  windowSize: 20, // Keep more messages
  minWindowSize: 10, // Higher minimum
  preserveSystemMessages: true,
})

// Hybrid approach: combine strategies
const hybridConversation: ConversationMessage[] = [
  { role: 'system', content: 'You are an expert consultant.' },
  ...longConversation.slice(1),
]

console.log('Aggressive compression:')
aggressiveStrategy.optimize(hybridConversation).then((result) => {
  console.log(`  ${result.messages.length} messages, ${result.optimizedTokens} tokens\n`)
})

console.log('Conservative compression:')
conservativeStrategy.optimize(hybridConversation).then((result) => {
  console.log(`  ${result.messages.length} messages, ${result.optimizedTokens} tokens\n`)
})

// ============================================================================
// Best Practices
// ============================================================================

console.log('\n=== Best Practices ===\n')

/*
1. Choose the right strategy:
   - Sliding Window: Fast, simple, works for most cases
   - Importance-Based: Better preservation of context
   - Summarization: Maximum compression for long conversations
   - Adaptive: Automatic selection based on conversation length

2. Set appropriate token budgets:
   - GPT-4: 8,000 - 128,000 tokens (use 50-75% for context)
   - Claude: 100,000 - 200,000 tokens (use 50-75% for context)
   - Balance between context and response quality

3. Preserve system messages:
   - Always keep system prompts and instructions
   - They define model behavior and persona

4. Monitor token usage:
   - Track tokens saved over time
   - Measure impact on response quality
   - Adjust strategies based on metrics

5. Use summarization wisely:
   - Only for conversations > 5000 tokens
   - Use cheap models (GPT-4o-mini, Claude Haiku)
   - Limit summary token budget to 20% of max context

6. Test with your use case:
   - Different applications need different strategies
   - Customer support: preserve recent context
   - Research assistant: preserve important facts
   - Code assistant: preserve recent code changes
*/

console.log('See comments in code for best practices!')
console.log('\n=== Examples Complete ===\n')
