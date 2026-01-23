import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useRegenerateMessage } from '../use-regenerate-message'
import type { RegenerateMessage } from '../use-regenerate-message'

describe('useRegenerateMessage', () => {
  let messages: RegenerateMessage[]
  let onRegenerate: ReturnType<typeof vi.fn>
  let onMessagesChange: ReturnType<typeof vi.fn>
  let onRegenerateStart: ReturnType<typeof vi.fn>
  let onRegenerateComplete: ReturnType<typeof vi.fn>
  let onRegenerateError: ReturnType<typeof vi.fn>

  beforeEach(() => {
    messages = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there' },
      { id: '3', role: 'user', content: 'How are you?' },
      { id: '4', role: 'assistant', content: 'I am doing well' },
    ]

    onRegenerate = vi.fn().mockResolvedValue(undefined)
    onMessagesChange = vi.fn()
    onRegenerateStart = vi.fn()
    onRegenerateComplete = vi.fn()
    onRegenerateError = vi.fn()
  })

  it('should regenerate last assistant message', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
      })
    )

    await act(async () => {
      await result.current.regenerateLast()
    })

    // Should trim to last user message
    expect(onMessagesChange).toHaveBeenCalledWith([
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there' },
      { id: '3', role: 'user', content: 'How are you?' },
    ])

    // Should trigger regeneration with last user message
    expect(onRegenerate).toHaveBeenCalledWith({
      id: '3',
      role: 'user',
      content: 'How are you?',
    })
  })

  it('should set isRegenerating during regeneration', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
      })
    )

    expect(result.current.isRegenerating).toBe(false)

    let regeneratePromise: Promise<void>
    act(() => {
      regeneratePromise = result.current.regenerateLast()
    })

    // Should be regenerating during operation
    await waitFor(() => {
      expect(result.current.isRegenerating).toBe(true)
    })

    await act(async () => {
      await regeneratePromise
    })

    // Should no longer be regenerating after completion
    expect(result.current.isRegenerating).toBe(false)
  })

  it('should call lifecycle callbacks', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
        onRegenerateStart,
        onRegenerateComplete,
      })
    )

    await act(async () => {
      await result.current.regenerateLast()
    })

    expect(onRegenerateStart).toHaveBeenCalledWith('3')
    expect(onRegenerateComplete).toHaveBeenCalledWith('3')
  })

  it('should handle regeneration errors', async () => {
    const error = new Error('Regeneration failed')
    onRegenerate.mockRejectedValue(error)

    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
        onRegenerateError,
      })
    )

    await expect(
      act(async () => {
        await result.current.regenerateLast()
      })
    ).rejects.toThrow('Regeneration failed')

    expect(onRegenerateError).toHaveBeenCalledWith('3', error)
    expect(result.current.isRegenerating).toBe(false)
  })

  it('should regenerate from specific message', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
      })
    )

    await act(async () => {
      await result.current.regenerateFrom('1')
    })

    // Should trim to first message
    expect(onMessagesChange).toHaveBeenCalledWith([
      { id: '1', role: 'user', content: 'Hello' },
    ])

    // Should trigger regeneration with that message
    expect(onRegenerate).toHaveBeenCalledWith({
      id: '1',
      role: 'user',
      content: 'Hello',
    })
  })

  it('should handle case with no user messages', async () => {
    const messagesNoUser: RegenerateMessage[] = [
      { id: '1', role: 'assistant', content: 'Hello' },
    ]

    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages: messagesNoUser,
        onRegenerate,
        onMessagesChange,
      })
    )

    await act(async () => {
      await result.current.regenerateLast()
    })

    // Should not call callbacks
    expect(onMessagesChange).not.toHaveBeenCalled()
    expect(onRegenerate).not.toHaveBeenCalled()
  })

  it('should handle case with only user messages', async () => {
    const messagesOnlyUser: RegenerateMessage[] = [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'user', content: 'Anyone there?' },
    ]

    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages: messagesOnlyUser,
        onRegenerate,
        onMessagesChange,
      })
    )

    await act(async () => {
      await result.current.regenerateLast()
    })

    // Should trim to last user message (removes nothing)
    expect(onMessagesChange).toHaveBeenCalledWith([
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'user', content: 'Anyone there?' },
    ])

    // Should regenerate from last user message
    expect(onRegenerate).toHaveBeenCalledWith({
      id: '2',
      role: 'user',
      content: 'Anyone there?',
    })
  })

  it('should not regenerate from assistant message', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
      })
    )

    await act(async () => {
      await result.current.regenerateFrom('2') // assistant message
    })

    // Should not call callbacks
    expect(onMessagesChange).not.toHaveBeenCalled()
    expect(onRegenerate).not.toHaveBeenCalled()
  })

  it('should handle non-existent message ID', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
      })
    )

    await act(async () => {
      await result.current.regenerateFrom('nonexistent')
    })

    // Should not call callbacks
    expect(onMessagesChange).not.toHaveBeenCalled()
    expect(onRegenerate).not.toHaveBeenCalled()
  })

  it('should track regenerating message ID', async () => {
    const { result } = renderHook(() =>
      useRegenerateMessage({
        messages,
        onRegenerate,
        onMessagesChange,
      })
    )

    expect(result.current.regeneratingMessageId).toBeNull()

    let regeneratePromise: Promise<void>
    act(() => {
      regeneratePromise = result.current.regenerateLast()
    })

    await waitFor(() => {
      expect(result.current.regeneratingMessageId).toBe('3')
    })

    await act(async () => {
      await regeneratePromise
    })

    expect(result.current.regeneratingMessageId).toBeNull()
  })

  it('should use current messages ref (avoid stale closure)', async () => {
    const { result, rerender } = renderHook(
      (props) =>
        useRegenerateMessage({
          ...props,
          onRegenerate,
          onMessagesChange,
        }),
      { initialProps: { messages } }
    )

    // Update messages
    const newMessages: RegenerateMessage[] = [
      ...messages,
      { id: '5', role: 'user', content: 'New message' },
    ]

    rerender({ messages: newMessages })

    await act(async () => {
      await result.current.regenerateLast()
    })

    // Should use NEW messages (not stale closure)
    expect(onRegenerate).toHaveBeenCalledWith({
      id: '5',
      role: 'user',
      content: 'New message',
    })
  })

  it('should support custom message types with additional fields', async () => {
    interface CustomMessage extends RegenerateMessage {
      timestamp: number
      metadata?: Record<string, unknown>
    }

    const customMessages: CustomMessage[] = [
      { id: '1', role: 'user', content: 'Hello', timestamp: Date.now() },
      {
        id: '2',
        role: 'assistant',
        content: 'Hi',
        timestamp: Date.now(),
        metadata: { model: 'gpt-4' },
      },
    ]

    const customOnRegenerate = vi.fn().mockResolvedValue(undefined)

    const { result } = renderHook(() =>
      useRegenerateMessage<CustomMessage>({
        messages: customMessages,
        onRegenerate: customOnRegenerate,
      })
    )

    await act(async () => {
      await result.current.regenerateLast()
    })

    // Should preserve custom fields
    expect(customOnRegenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: expect.any(Number),
      })
    )
  })
})
