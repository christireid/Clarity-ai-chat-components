import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useChatInputHandlers } from '../use-chat-input-handlers'
import type { TypedChatReturn } from '../use-typed-chat'
import type { HookMessage } from '../types'

function createMockChat(
  messages: HookMessage[] = [],
  isLoading = false
): TypedChatReturn {
  return {
    messages,
    setMessages: vi.fn(),
    append: vi.fn().mockResolvedValue(null),
    reload: vi.fn().mockResolvedValue(null),
    stop: vi.fn(),
    isLoading,
    error: undefined,
    data: undefined,
  }
}

describe('useChatInputHandlers', () => {
  it('input starts empty', () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    expect(result.current.input).toBe('')
  })

  it('handleInputChange updates input', () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('hello world'))

    expect(result.current.input).toBe('hello world')
  })

  it('handleInputChange detects slash commands ending with /', () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('/'))

    expect(result.current.showSlashMenu).toBe(true)
  })

  it('handleInputChange hides slash menu when input does not end with /', () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('/'))
    expect(result.current.showSlashMenu).toBe(true)

    act(() => result.current.handleInputChange('/help'))
    expect(result.current.showSlashMenu).toBe(false)
  })

  it('handleSend calls chat.append with correct args', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('test message'))

    await act(async () => {
      await result.current.handleSend()
    })

    expect(chat.append).toHaveBeenCalledWith({
      role: 'user',
      content: 'test message',
    })
  })

  it('handleSend clears input after sending', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('test message'))

    await act(async () => {
      await result.current.handleSend()
    })

    expect(result.current.input).toBe('')
  })

  it('handleSend does nothing when input is empty', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    await act(async () => {
      await result.current.handleSend()
    })

    expect(chat.append).not.toHaveBeenCalled()
  })

  it('handleSend does nothing when chat is loading', async () => {
    const chat = createMockChat([], true)
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('test message'))

    await act(async () => {
      await result.current.handleSend()
    })

    expect(chat.append).not.toHaveBeenCalled()
  })

  it('handleSend accepts override text', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    await act(async () => {
      await result.current.handleSend('override text')
    })

    expect(chat.append).toHaveBeenCalledWith({
      role: 'user',
      content: 'override text',
    })
  })

  it('handleInputSubmit calls stop when loading', async () => {
    const chat = createMockChat([], true)
    const { result } = renderHook(() => useChatInputHandlers(chat))

    await act(async () => {
      await result.current.handleInputSubmit('some text')
    })

    expect(chat.stop).toHaveBeenCalled()
    expect(chat.append).not.toHaveBeenCalled()
  })

  it('handleInputSubmit calls handleSend when not loading', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    await act(async () => {
      await result.current.handleInputSubmit('submitted text')
    })

    expect(chat.append).toHaveBeenCalledWith({
      role: 'user',
      content: 'submitted text',
    })
  })

  it('handleFollowUp sends the suggestion text', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    await act(async () => {
      result.current.handleFollowUp({
        id: 'suggestion-1',
        text: 'Tell me more',
        type: 'follow-up',
      })
    })

    expect(chat.append).toHaveBeenCalledWith({
      role: 'user',
      content: 'Tell me more',
    })
  })

  it('handleSend hides slash menu after sending', async () => {
    const chat = createMockChat()
    const { result } = renderHook(() => useChatInputHandlers(chat))

    act(() => result.current.handleInputChange('/'))
    expect(result.current.showSlashMenu).toBe(true)

    await act(async () => {
      await result.current.handleSend('some command')
    })

    expect(result.current.showSlashMenu).toBe(false)
  })
})
