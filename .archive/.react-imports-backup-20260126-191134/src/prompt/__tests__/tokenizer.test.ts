/**
 * Tests for Token Estimator
 */

import { describe, it, expect } from 'vitest'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import { estimatePromptTokens } from '../core/tokenizer'
import type { ModelMetadata } from '../core/types'

describe('estimatePromptTokens', () => {
  const mockModel: ModelMetadata = {
    model: 'gpt-4',
    maxTokens: 8000,
    tokenizer: 'approximate',
  }

  it('should estimate tokens for simple messages', () => {
    const messages: CoreMessage[] = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ]

    const estimate = estimatePromptTokens(messages, mockModel)

    expect(estimate.tokens).toBeGreaterThan(0)
    expect(estimate.breakdown.user).toBeGreaterThan(0)
    expect(estimate.breakdown.assistant).toBeGreaterThan(0)
  })

  it('should handle empty messages', () => {
    const estimate = estimatePromptTokens([], mockModel)

    expect(estimate.tokens).toBe(0)
  })

  it('should estimate system messages', () => {
    const messages: CoreMessage[] = [
      { role: 'system', content: 'You are a helpful assistant.' },
    ]

    const estimate = estimatePromptTokens(messages, mockModel)

    expect(estimate.tokens).toBeGreaterThan(0)
    expect(estimate.breakdown.system).toBeGreaterThan(0)
  })

  it('should handle different tokenizers', () => {
    const messages: CoreMessage[] = [{ role: 'user', content: 'Test message' }]

    const openaiModel: ModelMetadata = {
      ...mockModel,
      tokenizer: 'openai',
    }

    const anthropicModel: ModelMetadata = {
      ...mockModel,
      tokenizer: 'anthropic',
    }

    const openaiEstimate = estimatePromptTokens(messages, openaiModel)
    const anthropicEstimate = estimatePromptTokens(messages, anthropicModel)
    const approximateEstimate = estimatePromptTokens(messages, mockModel)

    // All should return positive numbers
    expect(openaiEstimate.tokens).toBeGreaterThan(0)
    expect(anthropicEstimate.tokens).toBeGreaterThan(0)
    expect(approximateEstimate.tokens).toBeGreaterThan(0)
  })

  it('should calculate cost if pricing provided', () => {
    const modelWithPricing: ModelMetadata = {
      ...mockModel,
      inputPricePer1K: 0.03,
    }

    const messages: CoreMessage[] = [{ role: 'user', content: 'Test' }]

    const estimate = estimatePromptTokens(messages, modelWithPricing)

    expect(estimate.estimatedCost).toBeDefined()
    expect(estimate.estimatedCost).toBeGreaterThanOrEqual(0)
  })
})
