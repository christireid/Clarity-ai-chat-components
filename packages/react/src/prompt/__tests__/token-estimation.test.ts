/**
 * Tests for Token Estimation Utilities
 */

import { describe, it, expect } from 'vitest'
import {
  estimateMessageTokens,
  estimateMessageArrayTokens,
  estimatePromptTokens,
  getModelMetadata,
} from '../core/token-estimation'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import type { ResolvedPrompt } from '../core/types'

describe('Token Estimation', () => {
  describe('estimateMessageTokens', () => {
    it('should estimate tokens for a simple message', () => {
      const message: CoreMessage = {
        role: 'user',
        content: 'Hello, world!',
      }
      
      const tokens = estimateMessageTokens(message)
      expect(tokens).toBeGreaterThan(0)
      expect(tokens).toBeLessThan(100) // Should be reasonable
    })

    it('should handle empty messages', () => {
      const message: CoreMessage = {
        role: 'user',
        content: '',
      }
      
      const tokens = estimateMessageTokens(message)
      expect(tokens).toBeGreaterThanOrEqual(0)
    })

    it('should account for message overhead', () => {
      const message: CoreMessage = {
        role: 'user',
        content: 'Test',
      }
      
      const tokens = estimateMessageTokens(message)
      // Should include overhead (~5 tokens)
      expect(tokens).toBeGreaterThan(1)
    })
  })

  describe('estimateMessageArrayTokens', () => {
    it('should sum tokens for multiple messages', () => {
      const messages: CoreMessage[] = [
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' },
      ]
      
      const total = estimateMessageArrayTokens(messages)
      const single1 = estimateMessageTokens(messages[0]!)
      const single2 = estimateMessageTokens(messages[1]!)
      
      expect(total).toBe(single1 + single2)
    })

    it('should handle empty arrays', () => {
      const tokens = estimateMessageArrayTokens([])
      expect(tokens).toBe(0)
    })
  })

  describe('estimatePromptTokens', () => {
    it('should estimate tokens for a resolved prompt', () => {
      const prompt: ResolvedPrompt = {
        messages: [
          { role: 'system', content: 'You are helpful.' },
          { role: 'user', content: 'Hello!' },
        ],
        variables: {},
      }
      
      const tokens = estimatePromptTokens(prompt)
      expect(tokens).toBeGreaterThan(0)
    })
  })

  describe('getModelMetadata', () => {
    it('should return metadata for known models', () => {
      const gpt4 = getModelMetadata('gpt-4')
      expect(gpt4).not.toBeNull()
      expect(gpt4?.id).toBe('gpt-4')
      expect(gpt4?.maxTokens).toBeGreaterThan(0)
    })

    it('should return null for unknown models', () => {
      const unknown = getModelMetadata('unknown-model')
      expect(unknown).toBeNull()
    })

    it('should support multiple model variants', () => {
      const models = ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo', 'claude-3-opus']
      
      for (const modelId of models) {
        const metadata = getModelMetadata(modelId)
        expect(metadata).not.toBeNull()
        expect(metadata?.id).toBe(modelId)
      }
    })
  })
})
