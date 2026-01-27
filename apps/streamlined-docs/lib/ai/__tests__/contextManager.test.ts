/**
 * Context Manager Tests
 *
 * Tests for conversation context management including:
 * - Message importance scoring
 * - Compression strategy selection
 * - Context optimization
 * - Token budget management
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { ContextManager, createContextManager } from '../contextManager'
import type { SessionMessage } from '../sessionStore'

/**
 * Helper: Create test messages
 */
function createMessages(count: number, role: 'user' | 'assistant' = 'user'): SessionMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    role,
    content: `Test message ${i + 1}. This is some content to simulate a real message.`,
    timestamp: new Date(Date.now() - (count - i) * 60000).toISOString(),
  }))
}

/**
 * Helper: Create message with specific characteristics
 */
function createSpecialMessage(type: 'code' | 'error' | 'preference' | 'system'): SessionMessage {
  const base = {
    timestamp: new Date().toISOString(),
  }

  switch (type) {
    case 'code':
      return {
        ...base,
        role: 'assistant' as const,
        content: 'Here is an example:\n```tsx\n<ChatWindow />\n```',
      }
    case 'error':
      return {
        ...base,
        role: 'user' as const,
        content: 'I got this error: TypeError: Cannot read property of undefined',
        metadata: { hasError: true },
      }
    case 'preference':
      return {
        ...base,
        role: 'user' as const,
        content: 'I prefer using TypeScript',
        metadata: { isPreference: true },
      }
    case 'system':
      return {
        ...base,
        role: 'system' as const,
        content: 'You are a helpful documentation assistant.',
      }
  }
}

describe('ContextManager', () => {
  let manager: ContextManager

  beforeEach(() => {
    manager = new ContextManager()
  })

  describe('Context Optimization', () => {
    it('returns original messages when within budget', async () => {
      const messages = createMessages(5)
      const result = await manager.optimizeContext(messages, 128000)

      expect(result.strategy).toBe('none')
      expect(result.messages.length).toBe(messages.length)
      expect(result.compressionRatio).toBe(1.0)
      expect(result.summarizedMessages).toBe(0)
    })

    it('applies sliding window for small overages', async () => {
      const messages = createMessages(50)
      const smallBudgetManager = new ContextManager({
        maxContextTokens: 1000,
        recentMessagesToKeep: 5,
      })

      const result = await smallBudgetManager.optimizeContext(messages, 128000)

      expect(result.strategy).toBe('sliding-window')
      expect(result.optimizedTokens).toBeLessThanOrEqual(1000)
      expect(result.messages.length).toBeLessThan(messages.length)
    })

    it('summarizes old messages for moderate overages', async () => {
      const messages = createMessages(100)
      const manager = new ContextManager({
        maxContextTokens: 2000,
        recentMessagesToKeep: 10,
        enableSummarization: true,
      })

      const result = await manager.optimizeContext(messages, 128000)

      expect(result.strategy).toBe('summarize-old')
      expect(result.summary).toBeTruthy()
      expect(result.summary).toContain('conversation_summary')
      expect(result.summarizedMessages).toBeGreaterThan(0)
    })

    it('applies hierarchical summarization for high overages', async () => {
      const messages = createMessages(200)
      const manager = new ContextManager({
        maxContextTokens: 2000,
        recentMessagesToKeep: 5,
      })

      const result = await manager.optimizeContext(messages, 128000)

      expect(['hierarchical', 'summarize-old']).toContain(result.strategy)
      expect(result.optimizedTokens).toBeLessThan(result.originalTokens)
    })

    it('applies aggressive compression for severe overages', async () => {
      const messages = createMessages(500)
      const tinyBudgetManager = new ContextManager({
        maxContextTokens: 500,
        recentMessagesToKeep: 2,
      })

      const result = await tinyBudgetManager.optimizeContext(messages, 128000)

      expect(['aggressive', 'hierarchical']).toContain(result.strategy)
      expect(result.messages.length).toBeLessThan(10)
      expect(result.compressionRatio).toBeLessThan(0.5)
    })
  })

  describe('Message Importance Scoring', () => {
    it('scores system messages highest', async () => {
      const messages = [
        createSpecialMessage('system'),
        ...createMessages(10),
      ]

      const manager = new ContextManager({
        maxContextTokens: 500,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // System message should always be kept
      expect(result.messages.some((m) => m.role === 'system')).toBe(true)
    })

    it('preserves code examples', async () => {
      const messages = [
        ...createMessages(20),
        createSpecialMessage('code'),
        ...createMessages(20),
      ]

      const manager = new ContextManager({
        maxContextTokens: 2000,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Code message should be preserved if possible
      const hasCodeExample = result.messages.some((m) => m.content.includes('```'))
      expect(hasCodeExample).toBe(true)
    })

    it('preserves error messages', async () => {
      const messages = [
        ...createMessages(20),
        createSpecialMessage('error'),
        ...createMessages(20),
      ]

      const manager = new ContextManager({
        maxContextTokens: 2000,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Error message should be preserved
      const hasError = result.messages.some(
        (m) => m.metadata?.hasError === true || m.content.includes('error')
      )
      expect(hasError).toBe(true)
    })

    it('preserves user preferences', async () => {
      const messages = [
        ...createMessages(20),
        createSpecialMessage('preference'),
        ...createMessages(20),
      ]

      const manager = new ContextManager({
        maxContextTokens: 2000,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Preference message should be preserved
      const hasPreference = result.messages.some((m) => m.metadata?.isPreference === true)
      expect(hasPreference).toBe(true)
    })

    it('prioritizes recent messages', async () => {
      const messages = createMessages(50)
      const manager = new ContextManager({
        maxContextTokens: 2000,
        recentMessagesToKeep: 10,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Last 10 messages should be in the result
      const lastMessages = messages.slice(-10)
      const allRecentIncluded = lastMessages.every((recent) =>
        result.messages.some((kept) => kept.content === recent.content)
      )

      expect(allRecentIncluded).toBe(true)
    })
  })

  describe('Key Context Extraction', () => {
    it('extracts system prompt', () => {
      const messages = [createSpecialMessage('system'), ...createMessages(10)]

      const keyContext = manager.extractKeyContext(messages)

      expect(keyContext.systemPrompt).toBeTruthy()
      expect(keyContext.systemPrompt).toContain('helpful documentation assistant')
    })

    it('extracts user preferences', () => {
      const messages = [
        createSpecialMessage('preference'),
        createSpecialMessage('preference'),
        ...createMessages(5),
      ]

      const keyContext = manager.extractKeyContext(messages)

      expect(Object.keys(keyContext.userPreferences).length).toBeGreaterThan(0)
    })

    it('extracts error context', () => {
      const messages = [
        createSpecialMessage('error'),
        createSpecialMessage('error'),
        ...createMessages(5),
      ]

      const keyContext = manager.extractKeyContext(messages)

      expect(keyContext.errorContext.length).toBeGreaterThan(0)
      expect(keyContext.errorContext.some((e) => e.includes('error'))).toBe(true)
    })

    it('extracts code examples', () => {
      const messages = [
        createSpecialMessage('code'),
        createSpecialMessage('code'),
        ...createMessages(5),
      ]

      const keyContext = manager.extractKeyContext(messages)

      expect(keyContext.codeExamples.length).toBeGreaterThan(0)
      expect(keyContext.codeExamples.some((e) => e.includes('```'))).toBe(true)
    })

    it('limits extracted context to recent items', () => {
      const messages = [
        ...Array(10).fill(null).map(() => createSpecialMessage('error')),
        ...createMessages(5),
      ]

      const keyContext = manager.extractKeyContext(messages)

      // Should only keep last 3 errors
      expect(keyContext.errorContext.length).toBeLessThanOrEqual(3)
    })
  })

  describe('Configuration', () => {
    it('respects custom maxContextTokens', async () => {
      const messages = createMessages(100)
      const manager = new ContextManager({
        maxContextTokens: 3000,
      })

      const result = await manager.optimizeContext(messages, 128000)

      expect(result.optimizedTokens).toBeLessThanOrEqual(3000)
    })

    it('respects custom recentMessagesToKeep', async () => {
      const messages = createMessages(50)
      const manager = new ContextManager({
        maxContextTokens: 2000,
        recentMessagesToKeep: 15,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Should keep at least 15 recent messages (if they fit)
      const recentMessages = messages.slice(-15)
      const keptRecentCount = recentMessages.filter((recent) =>
        result.messages.some((kept) => kept.content === recent.content)
      ).length

      expect(keptRecentCount).toBeGreaterThanOrEqual(10) // At least most recent ones
    })

    it('respects minMessagesToKeep', async () => {
      const messages = createMessages(10)
      const manager = new ContextManager({
        maxContextTokens: 100, // Very small budget
        minMessagesToKeep: 3,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Should keep at least minMessagesToKeep even if over budget
      expect(result.messages.length).toBeGreaterThanOrEqual(3)
    })

    it('can disable summarization', async () => {
      const messages = createMessages(100)
      const manager = new ContextManager({
        maxContextTokens: 2000,
        enableSummarization: false,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Should use sliding-window instead of summarization
      expect(result.strategy).not.toBe('summarize-old')
      expect(result.summary).toBeFalsy()
    })
  })

  describe('Model-Specific Optimization', () => {
    it('optimizes for GPT-4 context window', async () => {
      const { optimizeMessagesForModel } = await import('../contextManager')
      const messages = createMessages(100)

      const result = await optimizeMessagesForModel(messages, 'gpt-4')

      // GPT-4 has 8K context, should optimize accordingly
      expect(result.optimizedTokens).toBeLessThanOrEqual(8192)
    })

    it('optimizes for Claude context window', async () => {
      const { optimizeMessagesForModel } = await import('../contextManager')
      const messages = createMessages(100)

      const result = await optimizeMessagesForModel(messages, 'claude-3-5-sonnet-20241022')

      // Claude has 200K context, may not need compression for 100 messages
      expect(result.strategy).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty message array', async () => {
      const result = await manager.optimizeContext([], 128000)

      expect(result.messages).toEqual([])
      expect(result.strategy).toBe('none')
      expect(result.originalTokens).toBe(0)
    })

    it('handles single message', async () => {
      const messages = createMessages(1)
      const result = await manager.optimizeContext(messages, 128000)

      expect(result.messages.length).toBe(1)
      expect(result.strategy).toBe('none')
    })

    it('handles messages with no content', async () => {
      const messages: SessionMessage[] = [
        { role: 'user', content: '', timestamp: new Date().toISOString() },
      ]

      const result = await manager.optimizeContext(messages, 128000)

      expect(result.messages.length).toBe(1)
    })

    it('handles very long single message', async () => {
      const longContent = 'word '.repeat(10000) // ~10K words
      const messages: SessionMessage[] = [
        { role: 'user', content: longContent, timestamp: new Date().toISOString() },
      ]

      const manager = new ContextManager({
        maxContextTokens: 1000,
        minMessagesToKeep: 1,
      })

      const result = await manager.optimizeContext(messages, 128000)

      // Should keep at least the minimum
      expect(result.messages.length).toBeGreaterThanOrEqual(1)
    })

    it('handles alternating roles', async () => {
      const messages: SessionMessage[] = []
      for (let i = 0; i < 20; i++) {
        messages.push({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i}`,
          timestamp: new Date().toISOString(),
        })
      }

      const result = await manager.optimizeContext(messages, 128000)

      expect(result.messages.length).toBeGreaterThan(0)
    })
  })

  describe('Compression Metrics', () => {
    it('calculates compression ratio correctly', async () => {
      const messages = createMessages(100)
      const manager = new ContextManager({
        maxContextTokens: 2000,
      })

      const result = await manager.optimizeContext(messages, 128000)

      expect(result.compressionRatio).toBeGreaterThan(0)
      expect(result.compressionRatio).toBeLessThanOrEqual(1)
      expect(result.optimizedTokens).toBe(
        Math.floor(result.originalTokens * result.compressionRatio)
      )
    })

    it('tracks message counts correctly', async () => {
      const messages = createMessages(50)
      const manager = new ContextManager({
        maxContextTokens: 2000,
      })

      const result = await manager.optimizeContext(messages, 128000)

      expect(result.keptMessages + result.summarizedMessages).toBeGreaterThanOrEqual(
        messages.length - 5 // Allow for summary combining
      )
    })

    it('provides meaningful summary when compressing', async () => {
      const messages = createMessages(100)
      const manager = new ContextManager({
        maxContextTokens: 2000,
        enableSummarization: true,
      })

      const result = await manager.optimizeContext(messages, 128000)

      if (result.summary) {
        expect(result.summary).toContain('message')
        expect(result.summary.length).toBeGreaterThan(50)
        expect(result.summary.length).toBeLessThan(result.originalTokens * 4) // Much shorter than original
      }
    })
  })

  describe('Helper Functions', () => {
    it('createContextManager creates instance with defaults', () => {
      const manager = createContextManager()
      expect(manager).toBeInstanceOf(ContextManager)
    })

    it('createContextManager accepts custom config', () => {
      const manager = createContextManager({
        maxContextTokens: 5000,
      })
      expect(manager).toBeInstanceOf(ContextManager)
    })
  })
})
