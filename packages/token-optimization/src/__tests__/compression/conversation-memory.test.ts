/**
 * Tests for Conversation Memory Management Strategies
 */

import { describe, it, expect } from 'vitest'
import {
  SlidingWindowStrategy,
  ImportanceBasedStrategy,
  SummarizationStrategy,
  AdaptiveConversationStrategy,
  optimizeConversation,
  createSlidingWindowStrategy,
  createImportanceBasedStrategy,
  createSummarizationStrategy,
  createAdaptiveStrategy,
  type ConversationMessage,
  type ConversationSummarizer,
} from '../../compression/strategies/conversation-memory'

// Helper: Create test messages
function createTestMessages(count: number): ConversationMessage[] {
  const messages: ConversationMessage[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
  ]

  for (let i = 0; i < count; i++) {
    messages.push(
      {
        role: 'user',
        content: `User message ${i + 1}: This is a question about something important. What can you tell me about topic ${i + 1}?`,
        timestamp: Date.now() + i * 1000,
      },
      {
        role: 'assistant',
        content: `Assistant response ${i + 1}: Here's a detailed answer to your question. This response contains useful information about topic ${i + 1}. Let me explain further with some additional context and details that make this response more comprehensive.`,
        timestamp: Date.now() + i * 1000 + 500,
      }
    )
  }

  return messages
}

// Mock summarizer for testing
class MockSummarizer implements ConversationSummarizer {
  async summarize(messages: ConversationMessage[], maxTokens: number): Promise<string> {
    const messageCount = messages.length
    const preview = messages[0]?.content.slice(0, 50) || 'messages'
    return `Summary of ${messageCount} messages (max ${maxTokens} tokens): "${preview}..."`
  }
}

describe('SlidingWindowStrategy', () => {
  it('should preserve system messages and keep last N messages', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 4 })
    const messages = createTestMessages(5) // 1 system + 10 conversation messages

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('sliding-window')
    expect(result.messages.length).toBeLessThan(messages.length)

    // Should preserve system message
    const systemMessages = result.messages.filter((m) => m.role === 'system')
    expect(systemMessages.length).toBe(1)

    // Should keep last 4 conversation messages
    const conversationMessages = result.messages.filter((m) => m.role !== 'system')
    expect(conversationMessages.length).toBe(4)
  })

  it('should handle messages already within window size', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 20 })
    const messages = createTestMessages(5) // 11 total messages

    const result = await strategy.optimize(messages)

    expect(result.messages.length).toBe(messages.length)
    expect(result.tokensSaved).toBe(0)
    expect(result.compressionRatio).toBe(1)
  })

  it('should respect minimum window size', async () => {
    const strategy = new SlidingWindowStrategy({
      windowSize: 1,
      minWindowSize: 2,
    })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    const conversationMessages = result.messages.filter((m) => m.role !== 'system')
    expect(conversationMessages.length).toBeGreaterThanOrEqual(2)
  })

  it('should save tokens by removing old messages', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 2 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.tokensSaved).toBeGreaterThan(0)
    expect(result.compressionRatio).toBeLessThan(1)
    expect(result.originalTokens).toBeGreaterThan(result.optimizedTokens)
  })

  it('should work with factory function', async () => {
    const strategy = createSlidingWindowStrategy(4)
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('sliding-window')
    expect(result.messages.length).toBeLessThan(messages.length)
  })
})

describe('ImportanceBasedStrategy', () => {
  it('should select messages based on importance scores', async () => {
    const strategy = new ImportanceBasedStrategy({ maxTokens: 500 })
    const messages: ConversationMessage[] = [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'I need help with my project deadline next Monday.' },
      { role: 'assistant', content: 'Sure, I can help you with that.' },
      { role: 'user', content: 'What is the weather like?' },
      { role: 'assistant', content: 'I don\'t have access to weather data.' },
      {
        role: 'user',
        content: 'I decided to choose option A for the project. Can you help implement it?',
      },
      {
        role: 'assistant',
        content: 'Great choice! Option A is best for your requirements. Here are the steps...',
      },
    ]

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('importance-based')
    expect(result.messages.length).toBeLessThan(messages.length)

    // Should preserve system message
    expect(result.messages.some((m) => m.role === 'system')).toBe(true)

    // Should prioritize messages with decisions and dates
    const hasDecisionMessage = result.messages.some((m) => m.content.includes('decided'))
    expect(hasDecisionMessage).toBe(true)
  })

  it('should prioritize user messages over assistant messages', async () => {
    const strategy = new ImportanceBasedStrategy({
      maxTokens: 300,
      userWeight: 0.8,
    })

    const messages: ConversationMessage[] = [
      { role: 'system', content: 'System prompt.' },
      { role: 'user', content: 'Important user question that needs to be preserved.' },
      {
        role: 'assistant',
        content: 'Long assistant response with lots of details that could be removed.',
      },
      { role: 'user', content: 'Another important user question.' },
      { role: 'assistant', content: 'Brief response.' },
    ]

    const result = await strategy.optimize(messages)

    const userMessages = result.messages.filter((m) => m.role === 'user')
    const assistantMessages = result.messages.filter((m) => m.role === 'assistant')

    // Should preserve more user messages proportionally
    expect(userMessages.length).toBeGreaterThanOrEqual(assistantMessages.length)
  })

  it('should prioritize recent messages', async () => {
    const strategy = new ImportanceBasedStrategy({
      maxTokens: 400,
      recencyWeight: 0.9,
    })

    const messages = createTestMessages(10)

    const result = await strategy.optimize(messages)

    // Get indices of preserved messages in original array
    const preservedIndices = result.messages
      .filter((m) => m.role !== 'system')
      .map((m) => messages.indexOf(m))

    // Recent messages should have higher indices
    const averageIndex = preservedIndices.reduce((sum, i) => sum + i, 0) / preservedIndices.length

    expect(averageIndex).toBeGreaterThan(messages.length / 2)
  })

  it('should work with factory function', async () => {
    const strategy = createImportanceBasedStrategy(500, { recencyWeight: 0.5 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('importance-based')
  })

  it('should maintain chronological order after selection', async () => {
    const strategy = new ImportanceBasedStrategy({ maxTokens: 400 })
    const messages = createTestMessages(8)

    const result = await strategy.optimize(messages)

    // Verify messages are in chronological order
    const conversationMessages = result.messages.filter((m) => m.role !== 'system')
    for (let i = 1; i < conversationMessages.length; i++) {
      const prevIndex = messages.indexOf(conversationMessages[i - 1])
      const currIndex = messages.indexOf(conversationMessages[i])
      expect(currIndex).toBeGreaterThan(prevIndex)
    }
  })
})

describe('SummarizationStrategy', () => {
  it('should summarize old messages and keep recent ones', async () => {
    const summarizer = new MockSummarizer()
    const strategy = new SummarizationStrategy({
      summarizer,
      maxTokens: 1000,
      keepRecentMessages: 2,
    })

    const messages = createTestMessages(5) // 1 system + 10 conversation

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('summarization')
    expect(result.metadata.summarized).toBe(true)
    expect(result.metadata.summaryTokens).toBeGreaterThan(0)

    // Should have system + summary + 2 recent message pairs
    const systemCount = result.messages.filter((m) => m.role === 'system').length
    expect(systemCount).toBeGreaterThanOrEqual(2) // Original system + summary

    // Should preserve recent messages unchanged
    const recentMessages = messages.slice(-2)
    const preservedRecent = result.messages.slice(-2)
    expect(preservedRecent).toEqual(recentMessages)
  })

  it('should create summary message with proper metadata', async () => {
    const summarizer = new MockSummarizer()
    const strategy = new SummarizationStrategy({
      summarizer,
      maxTokens: 1000,
      keepRecentMessages: 1,
    })

    const messages = createTestMessages(4)

    const result = await strategy.optimize(messages)

    const summaryMessage = result.messages.find((m) => m.metadata?.type === 'summary')
    expect(summaryMessage).toBeDefined()
    expect(summaryMessage?.role).toBe('system')
    expect(summaryMessage?.content).toContain('Previous conversation summary')
    expect(summaryMessage?.metadata?.originalMessages).toBeGreaterThan(0)
  })

  it('should skip summarization for short conversations', async () => {
    const summarizer = new MockSummarizer()
    const strategy = new SummarizationStrategy({
      summarizer,
      maxTokens: 1000,
      keepRecentMessages: 10,
    })

    const messages = createTestMessages(3) // 7 total messages

    const result = await strategy.optimize(messages)

    // Should not summarize if keepRecentMessages >= conversation length
    expect(result.metadata.summarized).toBe(false)
  })

  it('should work with factory function', async () => {
    const summarizer = new MockSummarizer()
    const strategy = createSummarizationStrategy(summarizer, 1000, {
      keepRecentMessages: 3,
    })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('summarization')
  })

  it('should reduce token count significantly', async () => {
    const summarizer = new MockSummarizer()
    const strategy = new SummarizationStrategy({
      summarizer,
      maxTokens: 1000,
      keepRecentMessages: 2,
      summaryMaxTokens: 100,
    })

    const messages = createTestMessages(10)

    const result = await strategy.optimize(messages)

    expect(result.tokensSaved).toBeGreaterThan(0)
    expect(result.compressionRatio).toBeLessThan(0.5) // Should achieve >50% compression
  })
})

describe('AdaptiveConversationStrategy', () => {
  it('should return original messages if already under budget', async () => {
    const strategy = new AdaptiveConversationStrategy({ maxTokens: 10000 })
    const messages = createTestMessages(3)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('none')
    expect(result.messages).toEqual(messages)
    expect(result.tokensSaved).toBe(0)
  })

  it('should use sliding window for short conversations', async () => {
    const strategy = new AdaptiveConversationStrategy({
      maxTokens: 400,
      importanceThreshold: 5000,
      defaultWindowSize: 4,
    })

    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('sliding-window')
  })

  it('should use importance-based for medium conversations', async () => {
    const strategy = new AdaptiveConversationStrategy({
      maxTokens: 500,
      importanceThreshold: 200,
      summarizeThreshold: 5000,
    })

    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('importance-based')
  })

  it('should use summarization for long conversations with summarizer', async () => {
    const summarizer = new MockSummarizer()
    const strategy = new AdaptiveConversationStrategy({
      maxTokens: 500,
      summarizer,
      summarizeThreshold: 300,
    })

    const messages = createTestMessages(10)

    const result = await strategy.optimize(messages)

    expect(result.strategy).toBe('summarization')
    expect(result.metadata.summarized).toBe(true)
  })

  it('should provide strategy info without optimization', () => {
    const strategy = new AdaptiveConversationStrategy({
      maxTokens: 500,
      summarizer: new MockSummarizer(),
    })

    const messages = createTestMessages(2)
    const info = strategy.getStrategyInfo(messages)

    expect(info).toHaveProperty('strategy')
    expect(info).toHaveProperty('reason')
    expect(info).toHaveProperty('currentTokens')
    expect(info).toHaveProperty('maxTokens')
    expect(info.maxTokens).toBe(500)
  })

  it('should work with factory function', async () => {
    const strategy = createAdaptiveStrategy(500, { defaultWindowSize: 5 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(['sliding-window', 'importance-based', 'none']).toContain(result.strategy)
  })
})

describe('optimizeConversation helper', () => {
  it('should optimize conversation with adaptive strategy', async () => {
    const messages = createTestMessages(5)
    const optimized = await optimizeConversation(messages, 500)

    expect(Array.isArray(optimized)).toBe(true)
    expect(optimized.length).toBeLessThanOrEqual(messages.length)
  })

  it('should use summarizer when provided', async () => {
    const summarizer = new MockSummarizer()
    const messages = createTestMessages(10)
    const optimized = await optimizeConversation(messages, 500, summarizer)

    // Should include summary message
    const hasSummary = optimized.some((m) => m.metadata?.type === 'summary')
    expect(hasSummary).toBe(true)
  })
})

describe('Edge cases and error handling', () => {
  it('should handle empty message array', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 5 })
    const messages: ConversationMessage[] = []

    const result = await strategy.optimize(messages)

    expect(result.messages).toEqual([])
    expect(result.originalTokens).toBe(0)
    expect(result.optimizedTokens).toBe(0)
  })

  it('should handle single message', async () => {
    const strategy = new ImportanceBasedStrategy({ maxTokens: 100 })
    const messages: ConversationMessage[] = [
      { role: 'user', content: 'Hello' },
    ]

    const result = await strategy.optimize(messages)

    expect(result.messages.length).toBeGreaterThan(0)
  })

  it('should handle messages with no content', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 5 })
    const messages: ConversationMessage[] = [
      { role: 'system', content: '' },
      { role: 'user', content: 'Question' },
      { role: 'assistant', content: '' },
    ]

    const result = await strategy.optimize(messages)

    expect(result.messages.length).toBeGreaterThan(0)
  })

  it('should handle very long single messages', async () => {
    const strategy = new ImportanceBasedStrategy({ maxTokens: 500 })
    const longContent = 'word '.repeat(1000)
    const messages: ConversationMessage[] = [
      { role: 'user', content: longContent },
    ]

    const result = await strategy.optimize(messages)

    // Should handle gracefully even if single message exceeds budget
    expect(result.messages.length).toBeGreaterThan(0)
  })
})

describe('Metadata and result properties', () => {
  it('should provide accurate metadata in results', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 3 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    expect(result.metadata.messagesRemoved).toBe(
      messages.length - result.messages.length
    )
    expect(result.metadata.messagesPreserved).toBe(result.messages.length)
    expect(result.metadata.systemMessagesPreserved).toBe(1)
  })

  it('should calculate compression ratio correctly', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 2 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    const expectedRatio = result.optimizedTokens / result.originalTokens
    expect(result.compressionRatio).toBeCloseTo(expectedRatio, 5)
  })

  it('should calculate tokens saved correctly', async () => {
    const strategy = new ImportanceBasedStrategy({ maxTokens: 400 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    const expectedSaved = result.originalTokens - result.optimizedTokens
    expect(result.tokensSaved).toBe(expectedSaved)
  })
})

describe('Performance and token counting', () => {
  it('should complete optimization quickly', async () => {
    const strategy = new SlidingWindowStrategy({ windowSize: 10 })
    const messages = createTestMessages(50)

    const start = performance.now()
    await strategy.optimize(messages)
    const duration = performance.now() - start

    expect(duration).toBeLessThan(100) // Should complete in < 100ms
  })

  it('should count tokens accurately', async () => {
    const strategy = new ImportanceBasedStrategy({ maxTokens: 500 })
    const messages = createTestMessages(5)

    const result = await strategy.optimize(messages)

    // Optimized tokens should be less than or equal to original
    expect(result.optimizedTokens).toBeLessThanOrEqual(result.originalTokens)

    // Optimized tokens should be approximately under max tokens (with some margin)
    expect(result.optimizedTokens).toBeLessThan(result.originalTokens * 0.8)
  })
})
