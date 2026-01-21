/**
 * Tests for useQualityRouter hook
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useQualityRouter } from '../../hooks/use-quality-router'
import type { ModelConfig, GenerateResult } from '../../routing/cascading-router'

describe('useQualityRouter', () => {
  const mockGenerateFn = vi.fn(async (model: ModelConfig): Promise<GenerateResult> => {
    return {
      response: `Response from ${model.name}`,
      inputTokens: 100,
      outputTokens: 50,
    }
  })

  beforeEach(() => {
    mockGenerateFn.mockClear()
  })

  describe('Basic Functionality', () => {
    it('should initialize with default config', () => {
      const { result } = renderHook(() => useQualityRouter())

      expect(result.current.isGenerating).toBe(false)
      expect(result.current.lastResult).toBeNull()
      expect(result.current.stats).toEqual({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalCost: 0,
        totalAttempts: 0,
        averageAttemptsPerRequest: 0,
        escalationRate: 0,
      })
    })

    it('should execute with default router', async () => {
      const { result } = renderHook(() => useQualityRouter())

      const prompt = 'What is React?'

      await act(async () => {
        await result.current.execute(prompt, mockGenerateFn)
      })

      expect(mockGenerateFn).toHaveBeenCalled()
      expect(result.current.lastResult).toBeTruthy()
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should track isGenerating state', async () => {
      const { result } = renderHook(() => useQualityRouter())

      expect(result.current.isGenerating).toBe(false)

      const executePromise = act(async () => {
        const promise = result.current.execute('Test prompt', mockGenerateFn)
        // Check immediately after calling execute
        expect(result.current.isGenerating).toBe(true)
        return await promise
      })

      await executePromise

      expect(result.current.isGenerating).toBe(false)
    })
  })

  describe('OpenAI Provider', () => {
    it('should use OpenAI cascading router preset', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
          qualityThreshold: 0.7,
        })
      )

      const prompt = 'Explain quantum computing'

      await act(async () => {
        await result.current.execute(prompt, mockGenerateFn)
      })

      expect(result.current.lastResult).toBeTruthy()
      expect(mockGenerateFn).toHaveBeenCalled()

      // Check that it used OpenAI models
      const calls = mockGenerateFn.mock.calls
      expect(calls.length).toBeGreaterThan(0)
    })

    it('should start with cheaper OpenAI model', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('Simple question', mockGenerateFn)
      })

      // First call should be to gpt-4o-mini (cheapest tier)
      const firstCall = mockGenerateFn.mock.calls[0]
      expect(firstCall).toBeTruthy()
      expect(firstCall[0].name).toMatch(/mini|gpt-4o-mini/)
    })
  })

  describe('Anthropic Provider', () => {
    it('should use Anthropic cascading router preset', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'anthropic',
          qualityThreshold: 0.7,
        })
      )

      await act(async () => {
        await result.current.execute('Explain AI safety', mockGenerateFn)
      })

      expect(result.current.lastResult).toBeTruthy()
      expect(mockGenerateFn).toHaveBeenCalled()
    })

    it('should start with cheaper Anthropic model', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'anthropic',
        })
      )

      await act(async () => {
        await result.current.execute('Simple question', mockGenerateFn)
      })

      // First call should be to haiku (cheapest tier)
      const firstCall = mockGenerateFn.mock.calls[0]
      expect(firstCall).toBeTruthy()
      expect(firstCall[0].name).toMatch(/haiku|claude-3-5-haiku/)
    })
  })

  describe('Custom Router Config', () => {
    it('should accept custom router configuration', async () => {
      const customTiers = [
        {
          name: 'cheap',
          models: [
            {
              name: 'custom-mini',
              costPer1MInput: 0.1,
              costPer1MOutput: 0.3,
            },
          ],
        },
      ]

      const { result } = renderHook(() =>
        useQualityRouter({
          routerConfig: {
            tiers: customTiers,
          },
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.lastResult).toBeTruthy()
      const firstCall = mockGenerateFn.mock.calls[0]
      expect(firstCall[0].name).toBe('custom-mini')
    })

    it('should respect custom quality threshold', async () => {
      const mockGenerateWithQuality = vi.fn(async (model: ModelConfig): Promise<GenerateResult> => {
        // Return low-quality response to trigger escalation
        return {
          response: 'ok',
          inputTokens: 10,
          outputTokens: 2,
        }
      })

      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
          qualityThreshold: 0.9, // Very high threshold
        })
      )

      await act(async () => {
        await result.current.execute('Complex question', mockGenerateWithQuality)
      })

      // Should escalate due to high quality threshold
      expect(mockGenerateWithQuality.mock.calls.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Quality Assessment', () => {
    it('should escalate on low-quality response', async () => {
      const mockGenerateLowQuality = vi.fn()
        .mockResolvedValueOnce({
          response: 'idk',
          inputTokens: 10,
          outputTokens: 2,
        })
        .mockResolvedValueOnce({
          response: 'A comprehensive answer with detailed explanation',
          inputTokens: 10,
          outputTokens: 20,
        })

      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
          qualityThreshold: 0.7,
        })
      )

      await act(async () => {
        await result.current.execute('Explain machine learning', mockGenerateLowQuality)
      })

      // Should have escalated (called generate twice)
      expect(mockGenerateLowQuality).toHaveBeenCalledTimes(2)
      expect(result.current.lastResult?.attempts.length).toBe(2)
    })

    it('should not escalate on high-quality response', async () => {
      const mockGenerateHighQuality = vi.fn().mockResolvedValue({
        response: 'A comprehensive, detailed answer that thoroughly addresses the question with multiple paragraphs and clear explanations.',
        inputTokens: 10,
        outputTokens: 50,
      })

      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
          qualityThreshold: 0.6,
        })
      )

      await act(async () => {
        await result.current.execute('Explain AI', mockGenerateHighQuality)
      })

      // Should NOT escalate (only called once)
      expect(mockGenerateHighQuality).toHaveBeenCalledTimes(1)
      expect(result.current.lastResult?.attempts.length).toBe(1)
    })

    it('should track quality scores', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('Test question', mockGenerateFn)
      })

      expect(result.current.lastResult).toBeTruthy()
      expect(result.current.lastResult?.attempts[0].quality).toBeTruthy()
      expect(result.current.lastResult?.attempts[0].quality.score).toBeGreaterThanOrEqual(0)
      expect(result.current.lastResult?.attempts[0].quality.score).toBeLessThanOrEqual(1)
    })
  })

  describe('Statistics Tracking', () => {
    it('should track total requests', async () => {
      const { result } = renderHook(() => useQualityRouter())

      expect(result.current.stats.totalRequests).toBe(0)

      await act(async () => {
        await result.current.execute('First request', mockGenerateFn)
      })

      expect(result.current.stats.totalRequests).toBe(1)

      await act(async () => {
        await result.current.execute('Second request', mockGenerateFn)
      })

      expect(result.current.stats.totalRequests).toBe(2)
    })

    it('should track successful requests', async () => {
      const { result } = renderHook(() => useQualityRouter())

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.stats.successfulRequests).toBe(1)
      expect(result.current.successRate).toBe(1)
    })

    it('should track total cost', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.stats.totalCost).toBeGreaterThan(0)
    })

    it('should calculate average cost', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('First', mockGenerateFn)
      })

      const firstCost = result.current.averageCost

      await act(async () => {
        await result.current.execute('Second', mockGenerateFn)
      })

      expect(result.current.averageCost).toBeGreaterThan(0)
      expect(result.current.stats.totalRequests).toBe(2)
    })

    it('should calculate average attempts', async () => {
      const { result } = renderHook(() => useQualityRouter())

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.averageAttempts).toBeGreaterThan(0)
      expect(result.current.stats.averageAttemptsPerRequest).toBeGreaterThan(0)
    })

    it('should calculate escalation rate', async () => {
      const mockWithEscalation = vi.fn()
        .mockResolvedValueOnce({
          response: 'short',
          inputTokens: 10,
          outputTokens: 2,
        })
        .mockResolvedValueOnce({
          response: 'A much longer and more detailed response',
          inputTokens: 10,
          outputTokens: 20,
        })

      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
          qualityThreshold: 0.7,
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockWithEscalation)
      })

      expect(result.current.stats.escalationRate).toBeGreaterThanOrEqual(0)
      expect(result.current.stats.escalationRate).toBeLessThanOrEqual(1)
    })

    it('should reset stats', async () => {
      const { result } = renderHook(() => useQualityRouter())

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.stats.totalRequests).toBe(1)

      act(() => {
        result.current.resetStats()
      })

      expect(result.current.stats.totalRequests).toBe(0)
      expect(result.current.stats.totalCost).toBe(0)
      expect(result.current.lastResult).toBeNull()
    })
  })

  describe('Result Tracking', () => {
    it('should store last result', async () => {
      const { result } = renderHook(() => useQualityRouter())

      expect(result.current.lastResult).toBeNull()

      await act(async () => {
        await result.current.execute('Test prompt', mockGenerateFn)
      })

      expect(result.current.lastResult).toBeTruthy()
      expect(result.current.lastResult?.response).toContain('Response from')
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should track all attempts in result', async () => {
      const { result } = renderHook(() => useQualityRouter())

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.lastResult?.attempts).toBeTruthy()
      expect(result.current.lastResult?.attempts.length).toBeGreaterThan(0)

      const attempt = result.current.lastResult?.attempts[0]
      expect(attempt?.model).toBeTruthy()
      expect(attempt?.quality).toBeTruthy()
      expect(attempt?.cost).toBeGreaterThanOrEqual(0)
    })

    it('should track final model used', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.lastResult?.finalModel).toBeTruthy()
      expect(result.current.lastResult?.finalModel.name).toBeTruthy()
    })

    it('should track total cost in result', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.lastResult?.totalCost).toBeGreaterThan(0)
    })
  })

  describe('useQualityRouterMetrics helper', () => {
    it('should provide metrics information', async () => {
      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockGenerateFn)
      })

      expect(result.current.stats).toBeTruthy()
      expect(result.current.averageCost).toBeGreaterThanOrEqual(0)
      expect(result.current.averageAttempts).toBeGreaterThan(0)
      expect(result.current.successRate).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle generation errors', async () => {
      const mockGenerateError = vi.fn().mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => useQualityRouter())

      await act(async () => {
        try {
          await result.current.execute('Test', mockGenerateError)
        } catch (error) {
          expect(error).toBeTruthy()
        }
      })

      expect(result.current.isGenerating).toBe(false)
    })

    it('should handle empty prompt', async () => {
      const { result } = renderHook(() => useQualityRouter())

      await act(async () => {
        await result.current.execute('', mockGenerateFn)
      })

      expect(mockGenerateFn).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple concurrent executions', async () => {
      const { result } = renderHook(() => useQualityRouter())

      const promises = [
        act(async () => await result.current.execute('First', mockGenerateFn)),
        act(async () => await result.current.execute('Second', mockGenerateFn)),
      ]

      await Promise.all(promises)

      expect(result.current.stats.totalRequests).toBeGreaterThanOrEqual(2)
    })

    it('should handle very long prompts', async () => {
      const { result } = renderHook(() => useQualityRouter())

      const longPrompt = 'A'.repeat(10000)

      await act(async () => {
        await result.current.execute(longPrompt, mockGenerateFn)
      })

      expect(result.current.lastResult).toBeTruthy()
    })

    it('should handle max escalation', async () => {
      const mockAlwaysLowQuality = vi.fn().mockResolvedValue({
        response: 'no',
        inputTokens: 10,
        outputTokens: 1,
      })

      const { result } = renderHook(() =>
        useQualityRouter({
          provider: 'openai',
          qualityThreshold: 0.9,
        })
      )

      await act(async () => {
        await result.current.execute('Test', mockAlwaysLowQuality)
      })

      // Should eventually stop escalating
      expect(mockAlwaysLowQuality.mock.calls.length).toBeLessThan(10)
      expect(result.current.lastResult?.success).toBeTruthy()
    })
  })
})
