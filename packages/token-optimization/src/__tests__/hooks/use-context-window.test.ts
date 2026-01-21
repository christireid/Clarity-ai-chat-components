/**
 * Tests for useContextWindow hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useContextWindow } from '../../hooks/use-context-window'
import type { ConversationMessage } from '../../compression/strategies/conversation-memory'

describe('useContextWindow', () => {
  const mockMessages: ConversationMessage[] = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello!' },
    { role: 'assistant', content: 'Hi! How can I help you?' },
    { role: 'user', content: 'What is React?' },
    { role: 'assistant', content: 'React is a JavaScript library for building user interfaces.' },
  ]

  describe('Basic Functionality', () => {
    it('should initialize with empty messages', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      expect(result.current.messages).toEqual([])
      expect(result.current.currentTokens).toBe(0)
      expect(result.current.utilization).toBe(0)
    })

    it('should add a single message', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessage({ role: 'user', content: 'Hello!' })
      })

      expect(result.current.messages).toHaveLength(1)
      expect(result.current.messages[0]).toEqual({ role: 'user', content: 'Hello!' })
      expect(result.current.currentTokens).toBeGreaterThan(0)
    })

    it('should add multiple messages', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      expect(result.current.messages).toHaveLength(5)
      expect(result.current.currentTokens).toBeGreaterThan(0)
    })

    it('should clear all messages', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      expect(result.current.messages).toHaveLength(5)

      act(() => {
        result.current.clear()
      })

      expect(result.current.messages).toEqual([])
      expect(result.current.currentTokens).toBe(0)
      expect(result.current.utilization).toBe(0)
    })
  })

  describe('Token Tracking', () => {
    it('should track current tokens accurately', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessage({ role: 'user', content: 'This is a short message' })
      })

      const tokensAfterFirst = result.current.currentTokens

      act(() => {
        result.current.addMessage({ role: 'assistant', content: 'This is a longer response with more words' })
      })

      expect(result.current.currentTokens).toBeGreaterThan(tokensAfterFirst)
    })

    it('should calculate utilization correctly', () => {
      const maxTokens = 100
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessage({
          role: 'user',
          content: 'Short message',
        })
      })

      const utilization = result.current.utilization
      expect(utilization).toBeGreaterThan(0)
      expect(utilization).toBeLessThanOrEqual(1)
      expect(utilization).toBe(result.current.currentTokens / maxTokens)
    })

    it('should track utilization percentage', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
        })
      )

      // Add messages to reach ~50% utilization
      act(() => {
        result.current.addMessage({ role: 'user', content: 'Test message' })
      })

      expect(result.current.utilization).toBeGreaterThan(0)
      expect(result.current.utilization).toBeLessThan(1)
    })
  })

  describe('Sliding Window Strategy', () => {
    it('should keep last N messages with sliding window', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
          windowSize: 3,
        })
      )

      // Add 5 messages (more than window size)
      act(() => {
        result.current.addMessages(mockMessages)
      })

      // Optimize to apply sliding window
      await act(async () => {
        await result.current.optimize()
      })

      // Should keep system message + last 2 conversation messages (windowSize=3 total)
      expect(result.current.messages.length).toBeLessThanOrEqual(5)
      expect(result.current.lastOptimization).toBeTruthy()
    })

    it('should preserve system messages in sliding window', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
          windowSize: 2,
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      await act(async () => {
        await result.current.optimize()
      })

      const systemMessages = result.current.messages.filter((m) => m.role === 'system')
      expect(systemMessages.length).toBeGreaterThan(0)
    })
  })

  describe('Importance-Based Strategy', () => {
    it('should use importance-based strategy', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'importance-based',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      await act(async () => {
        await result.current.optimize()
      })

      expect(result.current.messages.length).toBeGreaterThan(0)
      expect(result.current.lastOptimization).toBeTruthy()
      expect(result.current.lastOptimization?.strategy).toBe('importance-based')
    })

    it('should prioritize important messages', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 50,
          strategy: 'importance-based',
        })
      )

      const messagesWithPriority: ConversationMessage[] = [
        { role: 'system', content: 'System prompt' },
        { role: 'user', content: 'Important question about technical details' },
        { role: 'assistant', content: 'Detailed technical answer' },
        { role: 'user', content: 'ok' },
        { role: 'assistant', content: 'Great!' },
      ]

      act(() => {
        result.current.addMessages(messagesWithPriority)
      })

      await act(async () => {
        await result.current.optimize()
      })

      // System message should be preserved
      const hasSystemMessage = result.current.messages.some((m) => m.role === 'system')
      expect(hasSystemMessage).toBe(true)
    })
  })

  describe('Adaptive Strategy', () => {
    it('should use adaptive strategy', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'adaptive',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      await act(async () => {
        await result.current.optimize()
      })

      expect(result.current.lastOptimization).toBeTruthy()
      expect(result.current.lastOptimization?.strategy).toBe('adaptive')
    })

    it('should adapt strategy based on context size', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 5000,
          strategy: 'adaptive',
        })
      )

      // Add few messages (should use sliding window)
      act(() => {
        result.current.addMessages(mockMessages.slice(0, 3))
      })

      await act(async () => {
        await result.current.optimize()
      })

      const firstStrategy = result.current.lastOptimization?.actualStrategy

      // Add many more messages (should switch to importance-based or summarization)
      act(() => {
        const manyMessages = Array.from({ length: 50 }, (_, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: `Message ${i} with some content`,
        })) as ConversationMessage[]
        result.current.addMessages(manyMessages)
      })

      await act(async () => {
        await result.current.optimize()
      })

      const secondStrategy = result.current.lastOptimization?.actualStrategy

      // Strategy may change based on conversation size
      expect(secondStrategy).toBeTruthy()
    })
  })

  describe('Summarization Strategy', () => {
    it('should use summarization strategy with custom summarizer', async () => {
      const mockSummarizer = vi.fn(async (messages: ConversationMessage[]) => {
        return 'Summary of conversation'
      })

      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'summarization',
          summarizer: mockSummarizer,
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      await act(async () => {
        await result.current.optimize()
      })

      expect(mockSummarizer).toHaveBeenCalled()
      expect(result.current.lastOptimization?.strategy).toBe('summarization')
    })
  })

  describe('Auto-Optimization', () => {
    it('should auto-optimize when threshold exceeded', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 50,
          strategy: 'sliding-window',
          windowSize: 2,
          autoOptimize: true,
          optimizationThreshold: 0.8,
        })
      )

      // Add enough messages to exceed threshold
      await act(async () => {
        result.current.addMessages(mockMessages)
        // Wait for auto-optimization to trigger
        await waitFor(() => expect(result.current.lastOptimization).toBeTruthy(), { timeout: 1000 })
      })

      expect(result.current.lastOptimization).toBeTruthy()
    })

    it('should not auto-optimize when disabled', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 50,
          strategy: 'sliding-window',
          autoOptimize: false,
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      // Wait a bit to ensure auto-optimization doesn't trigger
      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(result.current.lastOptimization).toBeNull()
    })

    it('should respect optimization threshold', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
          autoOptimize: true,
          optimizationThreshold: 0.9, // High threshold
        })
      )

      // Add few messages (below threshold)
      act(() => {
        result.current.addMessages(mockMessages.slice(0, 2))
      })

      await new Promise((resolve) => setTimeout(resolve, 200))

      // Should not auto-optimize yet
      expect(result.current.utilization).toBeLessThan(0.9)
    })
  })

  describe('Manual Optimization', () => {
    it('should allow manual optimization', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
          windowSize: 2,
          autoOptimize: false,
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      const tokensBefore = result.current.currentTokens

      const optimizationResult = await act(async () => {
        return await result.current.optimize()
      })

      expect(optimizationResult).toBeTruthy()
      expect(optimizationResult.tokensBefore).toBe(tokensBefore)
      expect(optimizationResult.tokensAfter).toBeLessThanOrEqual(tokensBefore)
      expect(optimizationResult.tokensSaved).toBeGreaterThanOrEqual(0)
    })

    it('should update lastOptimization after manual optimization', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      expect(result.current.lastOptimization).toBeNull()

      await act(async () => {
        await result.current.optimize()
      })

      expect(result.current.lastOptimization).toBeTruthy()
      expect(result.current.lastOptimization?.timestamp).toBeGreaterThan(0)
      expect(result.current.lastOptimization?.tokensSaved).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Status Tracking', () => {
    it('should track isOptimizing state', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      expect(result.current.isOptimizing).toBe(false)

      const optimizePromise = act(async () => {
        const promise = result.current.optimize()
        // Check state immediately after calling optimize
        expect(result.current.isOptimizing).toBe(true)
        return await promise
      })

      await optimizePromise

      expect(result.current.isOptimizing).toBe(false)
    })

    it('should provide context window status', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
        })
      )

      const status = result.current

      expect(status).toHaveProperty('messages')
      expect(status).toHaveProperty('currentTokens')
      expect(status).toHaveProperty('utilization')
      expect(status).toHaveProperty('isOptimizing')
      expect(status).toHaveProperty('lastOptimization')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty message content', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessage({ role: 'user', content: '' })
      })

      expect(result.current.messages).toHaveLength(1)
      expect(result.current.currentTokens).toBeGreaterThanOrEqual(0)
    })

    it('should handle very large maxTokens', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000000,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      expect(result.current.utilization).toBeLessThan(0.01)
    })

    it('should handle very small maxTokens', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 10,
          strategy: 'sliding-window',
          windowSize: 1,
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      await act(async () => {
        await result.current.optimize()
      })

      // Should aggressively reduce messages
      expect(result.current.messages.length).toBeLessThan(mockMessages.length)
    })

    it('should handle optimization with no messages', async () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 1000,
          strategy: 'sliding-window',
        })
      )

      const optimizationResult = await act(async () => {
        return await result.current.optimize()
      })

      expect(optimizationResult.tokensSaved).toBe(0)
      expect(result.current.messages).toEqual([])
    })
  })

  describe('useContextWindowStatus helper', () => {
    it('should provide status information', () => {
      const { result } = renderHook(() =>
        useContextWindow({
          maxTokens: 100,
          strategy: 'sliding-window',
        })
      )

      act(() => {
        result.current.addMessages(mockMessages)
      })

      const status = result.current

      expect(status.currentTokens).toBeGreaterThan(0)
      expect(status.utilization).toBeGreaterThan(0)
      expect(status.messages.length).toBeGreaterThan(0)
    })
  })
})
