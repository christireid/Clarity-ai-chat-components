import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AccurateTokenCounter as TokenCounter } from '@clarity-chat/token-optimization'
import {
  useTokenValidator,
  useAutoTokenValidator,
} from '../use-token-validator'
import {
  useTokenPerformance,
  useAutoTokenPerformance,
} from '../use-token-performance'
import { InputValidator } from '../input-validator'
import { getTokenizerStats } from '../accurate-counter'

// Mock the dependencies
vi.mock('@clarity-chat/token-optimization', () => ({
  AccurateTokenCounter: {
    count: vi.fn((text: string) => text.length / 4),
  },
  TokenCounter: {
    count: vi.fn((text: string) => text.length / 4),
  },
}))

vi.mock('../accurate-counter', () => ({
  getTokenizerStats: vi.fn(() => ({
    cacheSize: 100,
    cacheMaxSize: 1000,
    cacheHitRate: '85.5%',
    cacheHits: 85,
    cacheMisses: 15,
    hitRatePercent: 85.5,
  })),
  clearTokenCache: vi.fn(),
}))

describe('Integration Tests - Token Optimization Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('useTokenValidator Integration', () => {
    it('should validate text input and update state correctly', () => {
      const { result } = renderHook(() => useTokenValidator())

      act(() => {
        const validationResult = result.current.validateText('Hello World', {
          maxLength: 100,
        })
        expect(validationResult.valid).toBe(true)
      })

      expect(result.current.textValidation?.valid).toBe(true)
      expect(result.current.isValid).toBe(true)
    })

    it('should handle validation errors correctly', () => {
      const { result } = renderHook(() => useTokenValidator())

      act(() => {
        // Empty string with minLength constraint should fail
        const validationResult = result.current.validateText('', {
          allowEmpty: false,
          minLength: 1,
        })
        expect(validationResult.valid).toBe(false)
      })

      expect(result.current.textValidation?.valid).toBe(false)
      expect(result.current.isValid).toBe(false)
      expect(result.current.allErrors.length).toBeGreaterThan(0)
    })

    it('should validate model names correctly', () => {
      const { result } = renderHook(() => useTokenValidator())

      act(() => {
        const validationResult = result.current.validateModel('gpt-4')
        expect(validationResult.valid).toBe(true)
      })

      expect(result.current.modelValidation?.valid).toBe(true)
    })

    it('should validate budgets correctly', () => {
      const { result } = renderHook(() => useTokenValidator())

      act(() => {
        const validationResult = result.current.validateBudget(1000)
        expect(validationResult.valid).toBe(true)
      })

      expect(result.current.budgetValidation?.valid).toBe(true)
    })

    it('should clear validation state', () => {
      const { result } = renderHook(() => useTokenValidator())

      act(() => {
        result.current.validateText('test')
      })

      expect(result.current.textValidation).toBeDefined()

      act(() => {
        result.current.clearValidation()
      })

      expect(result.current.textValidation).toBeUndefined()
    })

    it('should handle multiple validations simultaneously', () => {
      const { result } = renderHook(() => useTokenValidator())

      act(() => {
        result.current.validateText('Hello World')
        result.current.validateModel('gpt-4')
        result.current.validateBudget(1000)
      })

      expect(result.current.textValidation?.valid).toBe(true)
      expect(result.current.modelValidation?.valid).toBe(true)
      expect(result.current.budgetValidation?.valid).toBe(true)
      expect(result.current.isValid).toBe(true)
    })
  })

  describe('useTokenPerformance Integration', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
      vi.runOnlyPendingTimers()
      vi.useRealTimers()
    })

    it('should measure token counting performance', async () => {
      const { result } = renderHook(() => useTokenPerformance())

      let benchmark: Awaited<
        ReturnType<typeof result.current.benchmarkOperation>
      >
      await act(async () => {
        benchmark = await result.current.benchmarkOperation(async () => {
          return TokenCounter.count('Hello World')
        })
      })

      // "Hello World" is 11 chars, mock divides by 4 = 2.75
      expect(benchmark!.result).toBe(2.75)
      expect(benchmark!.duration).toBeGreaterThanOrEqual(0)
      // timestamp is from performance.now(), which may be 0 with fake timers
      expect(benchmark!.timestamp).toBeGreaterThanOrEqual(0)
    })

    it('should track performance metrics', async () => {
      const { result } = renderHook(() => useTokenPerformance())

      // Perform multiple operations
      await act(async () => {
        for (let i = 0; i < 5; i++) {
          await result.current.benchmarkOperation(async () => {
            return TokenCounter.count(`Test text ${i}`)
          })
        }
      })

      expect(result.current.metrics.totalOperations).toBe(5)
      expect(result.current.metrics.avgExecutionTime).toBeGreaterThanOrEqual(0)
    })

    it('should detect performance degradation', async () => {
      vi.useRealTimers() // Use real timers for this specific test
      const { result } = renderHook(() => useTokenPerformance())

      // Simulate a slow operation by introducing actual delay
      await act(async () => {
        await result.current.benchmarkOperation(async () => {
          // Using a small delay that still triggers threshold detection
          await new Promise((resolve) => setTimeout(resolve, 150))
          return TokenCounter.count('test')
        })
      })

      expect(result.current.isPerformanceDegraded(100)).toBe(true)
      vi.useFakeTimers() // Restore fake timers for other tests
    })

    it('should provide optimization suggestions', async () => {
      const { result } = renderHook(() => useTokenPerformance())

      // Simulate low cache hit rate
      vi.mocked(getTokenizerStats).mockReturnValueOnce({
        cacheSize: 100,
        cacheMaxSize: 1000,
        cacheHitRate: '45.0%',
        cacheHits: 45,
        cacheMisses: 55,
        hitRatePercent: 45.0,
      })

      await act(async () => {
        result.current.updateMetrics()
      })

      const suggestions = result.current.getOptimizationSuggestions()
      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions[0]).toContain('caching')
    })

    it('should handle monitoring lifecycle', () => {
      const { result } = renderHook(() => useTokenPerformance())

      expect(result.current.isMonitoring).toBe(false)

      act(() => {
        result.current.startMonitoring()
      })

      expect(result.current.isMonitoring).toBe(true)

      act(() => {
        result.current.stopMonitoring()
      })

      expect(result.current.isMonitoring).toBe(false)
    })

    it('should clear metrics and cache', () => {
      const { result } = renderHook(() => useTokenPerformance())

      act(() => {
        result.current.clearMetrics()
      })

      expect(result.current.metrics.totalOperations).toBe(0)
    })
  })

  describe('Integration with TokenCounter', () => {
    it('should integrate validation with token counting', async () => {
      const { result: validatorResult } = renderHook(() => useTokenValidator())
      const { result: performanceResult } = renderHook(() =>
        useTokenPerformance()
      )

      // Validate input
      act(() => {
        const validationResult =
          validatorResult.current.validateText('Hello World')
        expect(validationResult.valid).toBe(true)
      })

      // Count tokens with performance measurement
      let benchmark: Awaited<
        ReturnType<typeof performanceResult.current.benchmarkOperation>
      >
      await act(async () => {
        benchmark = await performanceResult.current.benchmarkOperation(
          async () => {
            return TokenCounter.count('Hello World')
          }
        )
      })

      // "Hello World" is 11 chars, mock divides by 4 = 2.75 (rounded)
      expect(benchmark!.result).toBe(2.75)
      expect(TokenCounter.count).toHaveBeenCalledWith('Hello World')
    })

    it('should handle validation errors during token counting', async () => {
      const { result: validatorResult } = renderHook(() => useTokenValidator())

      // Validate invalid input
      act(() => {
        const validationResult = validatorResult.current.validateText('', {
          allowEmpty: false,
          minLength: 1,
        })
        expect(validationResult.valid).toBe(false)
      })

      expect(validatorResult.current.textValidation?.valid).toBe(false)
      expect(validatorResult.current.allErrors.length).toBeGreaterThan(0)
    })
  })

  describe('Auto-validation hooks', () => {
    it('should auto-validate with useAutoTokenValidator', () => {
      const { result } = renderHook(() => useAutoTokenValidator(['test']))

      expect(result.current.validateText).toBeDefined()
      expect(result.current.validateModel).toBeDefined()
      expect(result.current.validateBudget).toBeDefined()
    })

    it('should auto-monitor with useAutoTokenPerformance', () => {
      const { result } = renderHook(() => useAutoTokenPerformance(false))

      expect(result.current.metrics).toBeDefined()
      expect(result.current.startMonitoring).toBeDefined()
      expect(result.current.stopMonitoring).toBeDefined()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle errors in validation gracefully', () => {
      const { result } = renderHook(() => useTokenValidator())

      // Test with invalid input that should trigger validation errors
      // Use allowEmpty: false to make null input invalid
      act(() => {
        const validationResult = result.current.validateText(null as any, {
          allowEmpty: false,
        })
        expect(validationResult.valid).toBe(false)
      })

      expect(result.current.textValidation?.valid).toBe(false)
      expect(result.current.allErrors.length).toBeGreaterThan(0)
    })

    it('should handle performance measurement errors', async () => {
      const { result } = renderHook(() => useTokenPerformance())

      // Mock an operation that throws an error
      const errorOperation = async () => {
        throw new Error('Test error')
      }

      await expect(
        act(async () => {
          await result.current.benchmarkOperation(errorOperation)
        })
      ).rejects.toThrow('Test error')
    })
  })

  describe('Performance and Memory Tests', () => {
    it('should handle large text validation efficiently', () => {
      const { result } = renderHook(() => useTokenValidator())
      const largeText = 'a'.repeat(10000)

      const start = performance.now()

      act(() => {
        const validationResult = result.current.validateText(largeText)
        expect(validationResult.valid).toBe(true)
      })

      const duration = performance.now() - start
      expect(duration).toBeLessThan(100) // Should complete within 100ms
    })

    it('should handle multiple rapid validations', () => {
      const { result } = renderHook(() => useTokenValidator())

      const start = performance.now()

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.validateText(`test ${i}`)
        }
      })

      const duration = performance.now() - start
      expect(duration).toBeLessThan(200) // Should complete within 200ms
    })
  })

  describe('Edge Cases and Boundary Conditions', () => {
    it('should handle empty validation state', () => {
      const { result } = renderHook(() => useTokenValidator())

      expect(result.current.isValid).toBe(true) // No validations means valid
      expect(result.current.allErrors).toEqual([])
      expect(result.current.allWarnings).toEqual([])
    })

    it('should handle Unicode and special characters', () => {
      const { result } = renderHook(() => useTokenValidator())
      const unicodeText = '🚀 Hello 世界 🌍 ñáéíóú'

      act(() => {
        const validationResult = result.current.validateText(unicodeText)
        expect(validationResult.valid).toBe(true)
      })

      expect(result.current.textValidation?.valid).toBe(true)
    })

    it('should handle very long model names', () => {
      const { result } = renderHook(() => useTokenValidator())
      // Model names > 100 chars are invalid
      const longModelName = 'a'.repeat(101)

      act(() => {
        const validationResult = result.current.validateModel(longModelName)
        expect(validationResult.valid).toBe(false)
      })

      expect(result.current.modelValidation?.valid).toBe(false)
    })

    it('should handle extreme budget values', () => {
      const { result } = renderHook(() => useTokenValidator())

      // Very large budget (>1M tokens is invalid per InputValidator.MAX_TOKEN_COUNT)
      act(() => {
        const validationResult = result.current.validateBudget(10000000)
        expect(validationResult.valid).toBe(false)
      })

      // Budget > 100k but <= 1M is valid with warning
      act(() => {
        const validationResult = result.current.validateBudget(500000)
        expect(validationResult.valid).toBe(true)
        expect(validationResult.warnings?.length).toBeGreaterThan(0)
      })

      // Negative budget
      act(() => {
        const validationResult = result.current.validateBudget(-100)
        expect(validationResult.valid).toBe(false)
      })
    })
  })

  describe('Real-world Usage Scenarios', () => {
    it('should handle chat message validation flow', () => {
      const { result } = renderHook(() => useTokenValidator())

      // Simulate chat message validation
      const chatMessage = 'Hello, how can I help you today?'
      const selectedModel = 'gpt-4'
      const budget = 4000

      act(() => {
        const textValid = result.current.validateText(chatMessage)
        const modelValid = result.current.validateModel(selectedModel)
        const budgetValid = result.current.validateBudget(budget)

        expect(textValid.valid).toBe(true)
        expect(modelValid.valid).toBe(true)
        expect(budgetValid.valid).toBe(true)
      })

      expect(result.current.isValid).toBe(true)
    })

    it('should handle file upload validation', () => {
      const { result } = renderHook(() => useTokenValidator())

      // Simulate large file content
      const fileContent = 'x'.repeat(50000) // 50KB file

      act(() => {
        const validationResult = result.current.validateText(fileContent, {
          maxLength: 100000, // 100KB limit
        })
        expect(validationResult.valid).toBe(true)
      })

      expect(result.current.textValidation?.valid).toBe(true)
    })

    it('should handle batch processing validation', () => {
      const { result } = renderHook(() => useTokenValidator())

      // Simulate batch of messages
      const messages = [
        'First message',
        'Second message',
        'Third message with more content',
      ]

      act(() => {
        messages.forEach((message) => {
          const validationResult = result.current.validateText(message)
          expect(validationResult.valid).toBe(true)
        })
      })

      expect(result.current.textValidation?.valid).toBe(true)
    })
  })
})
