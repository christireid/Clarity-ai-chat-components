/**
 * Tests for Message Optimization
 */

import { describe, it, expect } from 'vitest'
import { optimizeMessagesForBudget } from '../core/message-optimization'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { ModelMetadata } from '../core/types'

describe('Message Optimization', () => {
  const createTestMessages = (count: number): CoreMessage[] => {
    return Array.from({ length: count }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i + 1}: ${'x'.repeat(100)}`, // ~25 tokens each
    }))
  }

  const testModel: ModelMetadata = {
    id: 'gpt-4',
    maxTokens: 8192,
    inputPricePer1K: 0.03,
  }

  describe('optimizeMessagesForBudget', () => {
    it('should not optimize if under budget', async () => {
      const messages = createTestMessages(5)
      const result = await optimizeMessagesForBudget(messages, 10000, {
        model: testModel,
      })

      expect(result.messages.length).toBe(messages.length)
      expect(result.diagnostics.droppedMessages).toBe(0)
    })

    it('should optimize when over budget', async () => {
      const messages = createTestMessages(20) // ~500 tokens total
      const result = await optimizeMessagesForBudget(messages, 200, {
        model: testModel,
        strategy: 'sliding-window',
      })

      expect(result.messages.length).toBeLessThan(messages.length)
      expect(result.diagnostics.optimizedTokens).toBeLessThanOrEqual(200)
    })

    it('should preserve system messages', async () => {
      const messages: CoreMessage[] = [
        { role: 'system', content: 'System message' },
        ...createTestMessages(20),
      ]

      const result = await optimizeMessagesForBudget(messages, 200, {
        model: testModel,
        strategy: 'sliding-window',
      })

      const systemMessages = result.messages.filter(m => m.role === 'system')
      expect(systemMessages.length).toBeGreaterThan(0)
    })

    it('should use different strategies', async () => {
      const messages = createTestMessages(20)

      const strategies: Array<'sliding-window' | 'drop-low-priority'> = [
        'sliding-window',
        'drop-low-priority',
      ]

      for (const strategy of strategies) {
        const result = await optimizeMessagesForBudget(messages, 200, {
          model: testModel,
          strategy,
        })

        expect(result.diagnostics.strategy).toBe(strategy)
        expect(result.messages.length).toBeLessThanOrEqual(messages.length)
      }
    })

    it('should provide diagnostics', async () => {
      const messages = createTestMessages(20)
      const result = await optimizeMessagesForBudget(messages, 200, {
        model: testModel,
      })

      expect(result.diagnostics).toBeDefined()
      expect(result.diagnostics.originalTokens).toBeGreaterThan(0)
      expect(result.diagnostics.optimizedTokens).toBeGreaterThan(0)
      expect(result.diagnostics.reason).toBeDefined()
    })
  })
})
