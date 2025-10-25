import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTokenTracker } from '../use-token-tracker'

describe('useTokenTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with zero tokens', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    expect(result.current.tokens).toBe(0)
    expect(result.current.inputTokens).toBe(0)
    expect(result.current.outputTokens).toBe(0)
    expect(result.current.estimatedCost).toBe(0)
  })

  it('should track input tokens from user messages', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Hello, how are you?',
        tokens: 10,
      })
    })

    expect(result.current.inputTokens).toBe(10)
    expect(result.current.outputTokens).toBe(0)
    expect(result.current.tokens).toBe(10)
  })

  it('should track output tokens from assistant messages', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'assistant',
        content: 'I am doing well, thank you!',
        tokens: 15,
      })
    })

    expect(result.current.inputTokens).toBe(0)
    expect(result.current.outputTokens).toBe(15)
    expect(result.current.tokens).toBe(15)
  })

  it('should calculate estimated cost correctly', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
        // GPT-4: input $0.00003, output $0.00006
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Hello',
        tokens: 100,
      })
      result.current.addMessage({
        role: 'assistant',
        content: 'Hi there!',
        tokens: 50,
      })
    })

    // 100 * 0.00003 + 50 * 0.00006 = 0.003 + 0.003 = 0.006
    expect(result.current.estimatedCost).toBeCloseTo(0.006, 6)
  })

  it('should detect when near token limit', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
        maxTokens: 100,
        warningThreshold: 0.8, // 80%
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test message',
        tokens: 85, // 85% of limit
      })
    })

    expect(result.current.isNearLimit).toBe(true)
    expect(result.current.isCritical).toBe(false)
    expect(result.current.percentage).toBe(85)
  })

  it('should detect critical token limit', () => {
    const onWarning = vi.fn()
    const onCritical = vi.fn()

    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
        maxTokens: 100,
        warningThreshold: 0.8,
        criticalThreshold: 0.95,
        onWarning,
        onCritical,
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test message',
        tokens: 96, // 96% of limit
      })
    })

    expect(result.current.isCritical).toBe(true)
    expect(result.current.suggestPruning).toBe(true)
    expect(onCritical).toHaveBeenCalled()
  })

  it('should validate if can send message', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
        maxTokens: 100,
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test',
        tokens: 80,
      })
    })

    expect(result.current.canSend(15)).toBe(true)
    expect(result.current.canSend(25)).toBe(false)
  })

  it('should remove messages', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Message 1',
        tokens: 10,
      })
      result.current.addMessage({
        role: 'user',
        content: 'Message 2',
        tokens: 20,
      })
    })

    expect(result.current.tokens).toBe(30)

    act(() => {
      result.current.removeMessage(0) // Remove first message
    })

    expect(result.current.tokens).toBe(20)
  })

  it('should clear all messages', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test',
        tokens: 50,
      })
    })

    expect(result.current.tokens).toBe(50)

    act(() => {
      result.current.clear()
    })

    expect(result.current.tokens).toBe(0)
    expect(result.current.isNearLimit).toBe(false)
  })

  it('should estimate tokens from text', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    // Rough approximation: 4 chars = 1 token + 4 overhead
    const text = 'This is a test message'
    const estimated = result.current.estimateTokens(text)

    expect(estimated).toBeGreaterThan(0)
    expect(estimated).toBeLessThan(text.length) // Should be less than character count
  })

  it('should use custom pricing', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'custom-model',
        maxTokens: 4096,
        inputCostPerToken: 0.00001,
        outputCostPerToken: 0.00002,
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Test',
        tokens: 100,
      })
      result.current.addMessage({
        role: 'assistant',
        content: 'Response',
        tokens: 200,
      })
    })

    // 100 * 0.00001 + 200 * 0.00002 = 0.001 + 0.004 = 0.005
    expect(result.current.estimatedCost).toBeCloseTo(0.005, 6)
  })

  it('should auto-estimate tokens if not provided', () => {
    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
      })
    )

    act(() => {
      result.current.addMessage({
        role: 'user',
        content: 'Hello, this is a test message!', // 30 chars ≈ 8 tokens
        // No tokens property provided
      })
    })

    expect(result.current.tokens).toBeGreaterThan(0)
  })

  it('should trigger warning callback only once', () => {
    const onWarning = vi.fn()

    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
        maxTokens: 100,
        warningThreshold: 0.8,
        onWarning,
      })
    )

    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test', tokens: 85 })
    })

    expect(onWarning).toHaveBeenCalledTimes(1)

    // Add more tokens (still in warning zone)
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test', tokens: 5 })
    })

    // Should not trigger again
    expect(onWarning).toHaveBeenCalledTimes(1)
  })

  it('should reset warnings when usage drops', () => {
    const onWarning = vi.fn()

    const { result } = renderHook(() =>
      useTokenTracker({
        modelName: 'gpt-4',
        maxTokens: 100,
        warningThreshold: 0.8,
        onWarning,
      })
    )

    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test', tokens: 85 })
    })

    expect(onWarning).toHaveBeenCalledTimes(1)

    // Clear to reset
    act(() => {
      result.current.clear()
    })

    // Add again to trigger warning
    act(() => {
      result.current.addMessage({ role: 'user', content: 'Test', tokens: 85 })
    })

    expect(onWarning).toHaveBeenCalledTimes(2)
  })
})
