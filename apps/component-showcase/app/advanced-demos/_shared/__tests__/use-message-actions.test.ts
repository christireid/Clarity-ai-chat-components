import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useMessageActions } from '../use-message-actions'
import type { ChatHandle, HookMessage } from '../types'

function createMockChat(messages: HookMessage[] = []): ChatHandle {
  return {
    messages,
    setMessages: vi.fn(),
    append: vi.fn().mockResolvedValue(null),
    reload: vi.fn().mockResolvedValue(null),
    stop: vi.fn(),
  }
}

describe('useMessageActions', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('records feedback for a message', () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useMessageActions({ chat }))

    act(() => result.current.handleFeedback('msg-1', 'up'))
    expect(result.current.feedback['msg-1']).toBe('up')

    act(() => result.current.handleFeedback('msg-1', 'down'))
    expect(result.current.feedback['msg-1']).toBe('down')
  })

  it('deletes a message and calls onDeleteCleanup', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'first' },
      { id: 'msg-2', role: 'assistant', content: 'second' },
      { id: 'msg-3', role: 'user', content: 'third' },
    ]
    const chat = createMockChat(messages)
    const onDeleteCleanup = vi.fn()
    const { result } = renderHook(() =>
      useMessageActions({ chat, onDeleteCleanup })
    )

    // Add feedback for msg-2 first
    act(() => result.current.handleFeedback('msg-2', 'up'))
    expect(result.current.feedback['msg-2']).toBe('up')

    act(() => result.current.handleDeleteMessage('msg-2'))

    // setMessages should be called without msg-2
    expect(chat.setMessages).toHaveBeenCalledWith([
      { id: 'msg-1', role: 'user', content: 'first' },
      { id: 'msg-3', role: 'user', content: 'third' },
    ])

    // Feedback for deleted message should be cleaned up
    expect(result.current.feedback['msg-2']).toBeUndefined()

    // Cleanup callback should fire
    expect(onDeleteCleanup).toHaveBeenCalledWith('msg-2')
  })

  it('regenerates last message via chat.reload()', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'hello' },
      { id: 'msg-2', role: 'assistant', content: 'response' },
    ]
    const chat = createMockChat(messages)
    const { result } = renderHook(() => useMessageActions({ chat }))

    act(() => result.current.handleRegenerate('msg-2'))

    // Since it's the last message, reload should be called
    expect(chat.reload).toHaveBeenCalled()
  })

  it('regenerates non-last assistant message by resending user message', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'first question' },
      { id: 'msg-2', role: 'assistant', content: 'first answer' },
      { id: 'msg-3', role: 'user', content: 'second question' },
      { id: 'msg-4', role: 'assistant', content: 'second answer' },
    ]
    const chat = createMockChat(messages)
    const onResend = vi.fn()
    const { result } = renderHook(() => useMessageActions({ chat, onResend }))

    act(() => result.current.handleRegenerate('msg-2'))

    // Should truncate to before the user+assistant pair
    expect(chat.setMessages).toHaveBeenCalledWith([])

    // After timeout, onResend should resend the user message
    act(() => vi.advanceTimersByTime(150))
    expect(onResend).toHaveBeenCalledWith('first question')
  })

  it('does nothing for non-existent message regeneration', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'hello' },
    ])
    const { result } = renderHook(() => useMessageActions({ chat }))

    act(() => result.current.handleRegenerate('nonexistent'))

    expect(chat.setMessages).not.toHaveBeenCalled()
    expect(chat.reload).not.toHaveBeenCalled()
  })

  it('cleans up setTimeout on unmount', () => {
    const messages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'hello' },
      { id: 'msg-2', role: 'assistant', content: 'response' },
      { id: 'msg-3', role: 'user', content: 'world' },
    ]
    const chat = createMockChat(messages)
    const onResend = vi.fn()
    const { result, unmount } = renderHook(() =>
      useMessageActions({ chat, onResend })
    )

    act(() => result.current.handleRegenerate('msg-2'))

    // Unmount before timeout fires
    unmount()
    act(() => vi.advanceTimersByTime(200))

    expect(onResend).not.toHaveBeenCalled()
  })

  it('reads fresh messages from chat inside callbacks', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'original' },
    ])
    const { result, rerender } = renderHook(() => useMessageActions({ chat }))

    // Simulate messages changing
    chat.messages = [
      { id: 'msg-1', role: 'user', content: 'original' },
      { id: 'msg-2', role: 'assistant', content: 'new response' },
    ]
    rerender()

    act(() => result.current.handleDeleteMessage('msg-1'))

    // Should use the fresh messages array (with msg-2)
    expect(chat.setMessages).toHaveBeenCalledWith([
      { id: 'msg-2', role: 'assistant', content: 'new response' },
    ])
  })
})
