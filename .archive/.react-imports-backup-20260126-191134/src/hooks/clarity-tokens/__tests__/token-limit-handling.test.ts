/**
 * Token Limit Handling Tests
 *
 * Tests for token limit enforcement, truncation, summarization, and user feedback.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useTokenLimitGuard } from '../use-token-limit-guard'
import type { ChatMessage } from '@clarity-chat/token-optimization'
import { BudgetExceededError } from '../pipeline'

describe('Token Limit Handling', () => {
  const mockSummarizeFn = vi.fn(async (text: string, targetTokens: number) => {
    // Mock summarization - return shorter text
    return text.slice(0, Math.floor(text.length * 0.3))
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Truncate Policy', () => {
    it('should truncate messages when over limit', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'truncate',
          model: 'gpt-4o',
        })
      )

      const longMessages: ChatMessage[] = Array(20).fill(null).map((_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `This is a long message ${i} that contains many tokens and should exceed the limit when combined.`,
      }))

      const guardResult = await result.current.guardMessages(longMessages)

      expect(guardResult.policyApplied).toBe('truncate')
      expect(guardResult.finalTokens).toBeLessThanOrEqual(100)
      expect(guardResult.messages.length).toBeLessThan(longMessages.length)
    })

    it('should preserve system messages when truncating', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 50,
          policy: 'truncate',
          model: 'gpt-4o',
          preserveSystemMessages: true,
        })
      )

      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'This is a very long message that exceeds the token limit.' },
      ]

      const guardResult = await result.current.guardMessages(messages)

      // System message should be preserved
      expect(guardResult.messages[0]?.role).toBe('system')
    })

    it('should keep minimum number of messages', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 10,
          policy: 'truncate',
          model: 'gpt-4o',
          minMessagesToKeep: 2,
        })
      )

      const messages: ChatMessage[] = [
        { role: 'user', content: 'Message 1 with many tokens' },
        { role: 'assistant', content: 'Response 1 with many tokens' },
        { role: 'user', content: 'Message 2 with many tokens' },
        { role: 'assistant', content: 'Response 2 with many tokens' },
      ]

      const guardResult = await result.current.guardMessages(messages)

      expect(guardResult.messages.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Summarize Policy', () => {
    it('should summarize messages when over limit', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'summarize',
          model: 'gpt-4o',
          summarizeFn: mockSummarizeFn,
        })
      )

      const longMessages: ChatMessage[] = Array(10).fill(null).map((_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `This is message ${i} with many tokens that need to be summarized.`,
      }))

      const guardResult = await result.current.guardMessages(longMessages)

      expect(guardResult.policyApplied).toBe('summarize')
      expect(mockSummarizeFn).toHaveBeenCalled()
      expect(guardResult.summary).toBeTruthy()
      expect(guardResult.finalTokens).toBeLessThanOrEqual(100)
    })

    it('should throw error if summarizeFn not provided', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'summarize',
          model: 'gpt-4o',
        })
      )

      const longMessages: ChatMessage[] = [
        { role: 'user', content: 'A'.repeat(1000) },
      ]

      await expect(
        result.current.guardMessages(longMessages)
      ).rejects.toThrow()
    })
  })

  describe('Hybrid Policy', () => {
    it('should truncate then summarize', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'hybrid',
          model: 'gpt-4o',
          summarizeFn: mockSummarizeFn,
        })
      )

      const longMessages: ChatMessage[] = Array(20).fill(null).map((_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i} with many tokens.`,
      }))

      const guardResult = await result.current.guardMessages(longMessages)

      expect(guardResult.policyApplied).toBe('hybrid')
      expect(guardResult.finalTokens).toBeLessThanOrEqual(100)
    })
  })

  describe('Refuse Policy', () => {
    it('should throw error when over limit', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 10,
          policy: 'refuse',
          model: 'gpt-4o',
        })
      )

      const longMessages: ChatMessage[] = [
        { role: 'user', content: 'A'.repeat(1000) },
      ]

      await expect(
        result.current.guardMessages(longMessages)
      ).rejects.toThrow(BudgetExceededError)
    })
  })

  describe('User Feedback', () => {
    it('should provide token count information', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'truncate',
          model: 'gpt-4o',
        })
      )

      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello!' },
      ]

      const guardResult = await result.current.guardMessages(messages)

      expect(guardResult.originalTokens).toBeGreaterThan(0)
      expect(guardResult.finalTokens).toBeGreaterThan(0)
      expect(guardResult.removedTokens).toBeGreaterThanOrEqual(0)
    })

    it('should indicate when no policy was applied', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 10000,
          policy: 'truncate',
          model: 'gpt-4o',
        })
      )

      const messages: ChatMessage[] = [
        { role: 'user', content: 'Hello!' },
      ]

      const guardResult = await result.current.guardMessages(messages)

      expect(guardResult.policyApplied).toBe('none')
      expect(guardResult.removedTokens).toBe(0)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty messages', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'truncate',
          model: 'gpt-4o',
        })
      )

      const guardResult = await result.current.guardMessages([])

      expect(guardResult.messages).toEqual([])
      expect(guardResult.finalTokens).toBe(0)
    })

    it('should handle exactly at limit', async () => {
      const { result } = renderHook(() =>
        useTokenLimitGuard({
          maxInputTokens: 100,
          policy: 'truncate',
          model: 'gpt-4o',
        })
      )

      // Create messages that are exactly at limit (approximate)
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Short message' },
      ]

      const guardResult = await result.current.guardMessages(messages)

      // Should not apply policy if within limit
      if (guardResult.originalTokens <= 100) {
        expect(guardResult.policyApplied).toBe('none')
      }
    })
  })
})
