/**
 * Tests for Message Optimizer
 */

import { describe, it, expect } from 'vitest'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import { optimizeMessagesForBudgetSync } from '../core/optimizer-sync'
import type { ModelMetadata } from '../core/types'

const mockModel: ModelMetadata = {
  model: 'gpt-4',
  maxTokens: 8000,
  tokenizer: 'approximate',
}

describe('optimizeMessagesForBudgetSync', () => {
  it('should return messages as-is if under budget', () => {
    const messages: CoreMessage[] = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ]

    const result = optimizeMessagesForBudgetSync(
      messages,
      {
        targetTokens: 1000,
        strategy: 'sliding-window',
      },
      mockModel
    )

    expect(result.messages).toEqual(messages)
    expect(result.diagnostics.wasOptimized).toBe(false)
  })

  it('should apply sliding window strategy', () => {
    const messages: CoreMessage[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Message 1' },
      { role: 'assistant', content: 'Response 1' },
      { role: 'user', content: 'Message 2' },
      { role: 'assistant', content: 'Response 2' },
      { role: 'user', content: 'Message 3' },
      { role: 'assistant', content: 'Response 3' },
    ]

    const result = optimizeMessagesForBudgetSync(
      messages,
      {
        targetTokens: 50, // Very small budget
        strategy: 'sliding-window',
        preserveSystem: true,
      },
      mockModel
    )

    // Should preserve system message and keep recent messages
    expect(result.messages[0]?.role).toBe('system')
    expect(result.diagnostics.droppedMessages).toBeGreaterThan(0)
  })

  it('should preserve system messages', () => {
    const messages: CoreMessage[] = [
      { role: 'system', content: 'System prompt' },
      { role: 'user', content: 'User message' },
    ]

    const result = optimizeMessagesForBudgetSync(
      messages,
      {
        targetTokens: 10, // Very small budget
        strategy: 'sliding-window',
        preserveSystem: true,
      },
      mockModel
    )

    const systemMessages = result.messages.filter((m) => m.role === 'system')
    expect(systemMessages.length).toBeGreaterThan(0)
  })

  it('should handle empty messages array', () => {
    const result = optimizeMessagesForBudgetSync(
      [],
      {
        targetTokens: 1000,
        strategy: 'sliding-window',
      },
      mockModel
    )

    expect(result.messages).toEqual([])
    expect(result.diagnostics.originalTokens).toBe(0)
  })

  it('should apply drop-low-priority strategy', () => {
    const messages: CoreMessage[] = [
      { role: 'system', content: 'System' },
      { role: 'user', content: 'Important message' },
      { role: 'tool', content: 'Tool output' },
      { role: 'assistant', content: 'Response' },
    ]

    const result = optimizeMessagesForBudgetSync(
      messages,
      {
        targetTokens: 50, // Small budget
        strategy: 'drop-low-priority',
        preserveSystem: true,
      },
      mockModel
    )

    // Should prioritize system and assistant messages
    expect(result.messages[0]?.role).toBe('system')
    expect(result.diagnostics.droppedMessages).toBeGreaterThanOrEqual(0)
  })
})
