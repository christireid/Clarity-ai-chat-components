import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useMessageEditing } from '../use-message-editing'
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

describe('useMessageEditing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts editing with correct text', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'hello world' },
    ])
    const { result } = renderHook(() => useMessageEditing({ chat }))

    act(() => result.current.handleEditStart('msg-1'))

    expect(result.current.editingMessageId).toBe('msg-1')
    expect(result.current.editingText).toBe('hello world')
  })

  it('does nothing when editing a non-existent message', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'hello' },
    ])
    const { result } = renderHook(() => useMessageEditing({ chat }))

    act(() => result.current.handleEditStart('nonexistent'))

    expect(result.current.editingMessageId).toBeNull()
    expect(result.current.editingText).toBe('')
  })

  it('cancels editing and clears state', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'hello' },
    ])
    const { result } = renderHook(() => useMessageEditing({ chat }))

    act(() => result.current.handleEditStart('msg-1'))
    expect(result.current.editingMessageId).toBe('msg-1')

    act(() => result.current.handleEditCancel())
    expect(result.current.editingMessageId).toBeNull()
    expect(result.current.editingText).toBe('')
  })

  it('saves edit: truncates messages and resends via onResend', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'original' },
      { id: 'msg-2', role: 'assistant', content: 'response' },
    ])
    const onResend = vi.fn()
    const { result } = renderHook(() => useMessageEditing({ chat, onResend }))

    act(() => result.current.handleEditStart('msg-1'))
    act(() => result.current.setEditingText('edited text'))
    act(() => result.current.handleEditSave('msg-1'))

    // Messages should be truncated to before the edited message
    expect(chat.setMessages).toHaveBeenCalledWith([])
    expect(result.current.editingMessageId).toBeNull()

    // After timeout, onResend should be called
    act(() => vi.advanceTimersByTime(150))
    expect(onResend).toHaveBeenCalledWith('edited text')
  })

  it('saves edit: falls back to chat.append when no onResend', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'original' },
    ])
    const { result } = renderHook(() => useMessageEditing({ chat }))

    act(() => result.current.handleEditStart('msg-1'))
    act(() => result.current.setEditingText('fallback text'))
    act(() => result.current.handleEditSave('msg-1'))

    act(() => vi.advanceTimersByTime(150))
    expect(chat.append).toHaveBeenCalledWith({
      role: 'user',
      content: 'fallback text',
    })
  })

  it('reads fresh messages inside handleEditStart (stale closure test)', () => {
    const initialMessages: HookMessage[] = [
      { id: 'msg-1', role: 'user', content: 'initial' },
    ]
    const chat = createMockChat(initialMessages)
    const { result, rerender } = renderHook(() => useMessageEditing({ chat }))

    // Simulate messages changing between renders
    chat.messages = [{ id: 'msg-1', role: 'user', content: 'updated content' }]
    rerender()

    act(() => result.current.handleEditStart('msg-1'))
    expect(result.current.editingText).toBe('updated content')
  })

  it('uses external messages when provided', () => {
    const chat = createMockChat([])
    const externalMessages: HookMessage[] = [
      { id: 'ext-1', role: 'user', content: 'external' },
    ]
    const { result } = renderHook(() =>
      useMessageEditing({ chat, messages: externalMessages })
    )

    act(() => result.current.handleEditStart('ext-1'))
    expect(result.current.editingText).toBe('external')
  })

  it('cleans up setTimeout on unmount', () => {
    const chat = createMockChat([
      { id: 'msg-1', role: 'user', content: 'hello' },
    ])
    const onResend = vi.fn()
    const { result, unmount } = renderHook(() =>
      useMessageEditing({ chat, onResend })
    )

    act(() => result.current.handleEditStart('msg-1'))
    act(() => result.current.handleEditSave('msg-1'))

    // Unmount before the timeout fires
    unmount()
    act(() => vi.advanceTimersByTime(200))

    // onResend should NOT have been called since we unmounted
    expect(onResend).not.toHaveBeenCalled()
  })
})
