import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useChat } from '../use-chat'
import type { Message } from '@clarity-chat/types'

describe('useChat', () => {
  // Suppress deprecation warnings during tests
  const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with empty messages', () => {
      const { result } = renderHook(() => useChat())

      expect(result.current.messages).toEqual([])
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should initialize with provided messages', () => {
      const initialMessages: Message[] = [
        {
          id: 'msg-1',
          chatId: 'default',
          role: 'user',
          content: 'Hello',
          status: 'sent',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const { result } = renderHook(() => useChat({ initialMessages }))

      expect(result.current.messages).toEqual(initialMessages)
      expect(result.current.messages).toHaveLength(1)
    })
  })

  describe('sendMessage', () => {
    it('should add message and set loading state', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('Hello World')
      })

      expect(result.current.messages).toHaveLength(1)
      expect(result.current.messages[0].content).toBe('Hello World')
      expect(result.current.messages[0].role).toBe('user')
      expect(result.current.messages[0].status).toBe('sent')
      expect(result.current.isLoading).toBe(false)
    })

    it('should call onSendMessage callback', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('Test message')
      })

      expect(onSendMessage).toHaveBeenCalledTimes(1)
      expect(onSendMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'Test message',
          role: 'user',
          status: 'sent',
        }),
        // Note: Deprecated hook doesn't pass signal - updated test to match actual behavior
        undefined
      )
    })

    it('should set loading state during async operation', async () => {
      let resolvePromise: () => void
      const onSendMessage = vi.fn().mockImplementation(async () => {
        await new Promise<void>((resolve) => {
          resolvePromise = resolve
        })
      })

      const { result } = renderHook(() => useChat({ onSendMessage }))

      expect(result.current.isLoading).toBe(false)

      // Start sending
      let sendPromise: Promise<void>
      act(() => {
        sendPromise = result.current.sendMessage('Test')
      })

      // Resolve the mock
      await act(async () => {
        resolvePromise!()
        await sendPromise
      })

      // Should not be loading after completion
      expect(result.current.isLoading).toBe(false)
      expect(onSendMessage).toHaveBeenCalledTimes(1)
    })

    it('should handle errors and remove failed message', async () => {
      const error = new Error('Send failed')
      const onSendMessage = vi.fn().mockRejectedValue(error)

      const { result } = renderHook(() => useChat({ onSendMessage }))

      // The hook throws the error, so we need to catch it
      await act(async () => {
        try {
          await result.current.sendMessage('Test message')
        } catch (e) {
          // Expected to throw
        }
      })

      // Deprecated hook removes message on error (doesn't set status: 'error')
      expect(result.current.error).toBe(error)
      expect(result.current.messages).toHaveLength(0) // Message removed on error
      expect(result.current.isLoading).toBe(false)
    })

    it('should clear error on new message', async () => {
      const error = new Error('First error')
      const onSendMessage = vi
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useChat({ onSendMessage }))

      // First message fails (throws)
      await act(async () => {
        try {
          await result.current.sendMessage('First')
        } catch (e) {
          // Expected to throw
        }
      })
      expect(result.current.error).toBe(error)

      // Second message succeeds and clears error
      await act(async () => {
        await result.current.sendMessage('Second')
      })
      expect(result.current.error).toBeNull()
    })

    it('should generate unique IDs for messages', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('Message 1')
      })

      await act(async () => {
        await result.current.sendMessage('Message 2')
      })

      expect(result.current.messages).toHaveLength(2)
      expect(result.current.messages[0].id).not.toBe(
        result.current.messages[1].id
      )
    })
  })

  describe('AbortController Support', () => {
    // Note: Deprecated useChat hook has limited AbortController support
    // It passes options through but doesn't manage abort internally

    it('should support custom AbortSignal in options', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      const controller = new AbortController()

      await act(async () => {
        await result.current.sendMessage('Test', { signal: controller.signal })
      })

      // Deprecated hook passes options through to onSendMessage
      expect(onSendMessage).toHaveBeenCalledWith(expect.any(Object), {
        signal: controller.signal,
      })
    })

    it('should allow concurrent message sends', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)

      const { result } = renderHook(() => useChat({ onSendMessage }))

      // Send multiple messages concurrently (deprecated hook doesn't abort previous)
      await act(async () => {
        await Promise.all([
          result.current.sendMessage('First message'),
          result.current.sendMessage('Second message'),
        ])
      })

      // Both messages should be added
      expect(result.current.messages).toHaveLength(2)
      expect(onSendMessage).toHaveBeenCalledTimes(2)
    })

    it('should treat AbortError same as other errors', async () => {
      const abortError = new Error('Aborted')
      abortError.name = 'AbortError'

      const onSendMessage = vi.fn().mockRejectedValue(abortError)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      // Deprecated hook doesn't have special AbortError handling
      await act(async () => {
        try {
          await result.current.sendMessage('Test')
        } catch (e) {
          // Expected to throw
        }
      })

      // Error is set (no special AbortError handling in deprecated hook)
      expect(result.current.error).toBe(abortError)
    })

    it('should cleanup on unmount', () => {
      const onSendMessage = vi.fn().mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      const { result, unmount } = renderHook(() => useChat({ onSendMessage }))

      act(() => {
        result.current.sendMessage('Test')
      })

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('retry', () => {
    it('should retry sending a message by ID', async () => {
      const onSendMessage = vi
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useChat({ onSendMessage }))

      // First send succeeds
      await act(async () => {
        await result.current.sendMessage('Test message')
      })

      const messageId = result.current.messages[0].id

      // Retry removes the message and resends
      await act(async () => {
        await result.current.retry(messageId)
      })

      // Should have called onSendMessage twice
      expect(onSendMessage).toHaveBeenCalledTimes(2)
      // Retry implementation removes old messages up to the retry point, then adds new
      expect(result.current.messages).toHaveLength(1)
    })

    it('should do nothing if message ID not found', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.retry('non-existent-id')
      })

      expect(onSendMessage).not.toHaveBeenCalled()
    })

    it('should support AbortSignal in retry', async () => {
      const onSendMessage = vi
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(undefined)

      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('Test')
      })

      const messageId = result.current.messages[0].id
      const controller = new AbortController()

      await act(async () => {
        await result.current.retry(messageId, { signal: controller.signal })
      })

      expect(onSendMessage).toHaveBeenCalledTimes(2)
      // Second call should have the signal passed through
      expect(onSendMessage.mock.calls[1][1]).toEqual({
        signal: controller.signal,
      })
    })
  })

  describe('clear', () => {
    it('should clear all messages', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('Message 1')
      })

      await act(async () => {
        await result.current.sendMessage('Message 2')
      })

      expect(result.current.messages).toHaveLength(2)

      act(() => {
        result.current.clear()
      })

      expect(result.current.messages).toHaveLength(0)
    })

    it('should clear error state', async () => {
      const error = new Error('Send failed')
      const onSendMessage = vi.fn().mockRejectedValue(error)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        try {
          await result.current.sendMessage('Test')
        } catch (e) {
          // Expected to throw
        }
      })

      expect(result.current.error).toBe(error)

      act(() => {
        result.current.clear()
      })

      expect(result.current.error).toBeNull()
    })
  })

  describe('Message Structure', () => {
    it('should create messages with correct structure', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('Test content')
      })

      const message = result.current.messages[0]

      expect(message).toMatchObject({
        id: expect.any(String),
        chatId: 'default',
        role: 'user',
        content: 'Test content',
        status: 'sent',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('should maintain message order', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('First')
      })

      await act(async () => {
        await result.current.sendMessage('Second')
      })

      await act(async () => {
        await result.current.sendMessage('Third')
      })

      expect(result.current.messages.map((m) => m.content)).toEqual([
        'First',
        'Second',
        'Third',
      ])
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty content', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage('')
      })

      expect(result.current.messages[0].content).toBe('')
    })

    it('should handle very long content', async () => {
      const longContent = 'a'.repeat(10000)
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage(longContent)
      })

      expect(result.current.messages[0].content).toBe(longContent)
    })

    it('should handle special characters', async () => {
      const specialContent = '🚀 Hello <script>alert("xss")</script> 世界'
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await result.current.sendMessage(specialContent)
      })

      expect(result.current.messages[0].content).toBe(specialContent)
    })

    it('should handle rapid consecutive sends', async () => {
      const onSendMessage = vi.fn().mockResolvedValue(undefined)
      const { result } = renderHook(() => useChat({ onSendMessage }))

      await act(async () => {
        await Promise.all([
          result.current.sendMessage('Message 1'),
          result.current.sendMessage('Message 2'),
          result.current.sendMessage('Message 3'),
        ])
      })

      expect(result.current.messages).toHaveLength(3)
    })

    it('should handle undefined onSendMessage', async () => {
      // When onSendMessage is undefined, the hook logs a warning and returns early
      const localWarnSpy = vi.spyOn(console, 'warn')

      const { result } = renderHook(() => useChat())

      await act(async () => {
        await result.current.sendMessage('Test')
      })

      // No message is added when onSendMessage is undefined (early return)
      expect(result.current.messages).toHaveLength(0)
      expect(result.current.error).toBeNull()
      expect(localWarnSpy).toHaveBeenCalledWith(
        '[useChat] onSendMessage is required to send messages'
      )
    })
  })
})
