import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useLangChainBridge, type LangChainBridgeOptions } from '../index'

describe('useLangChainBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================================
  // Message Mapping Tests
  // ============================================================================

  describe('message mapping', () => {
    it('maps LangChain human messages to user role', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            role: 'user',
            content: 'Hello',
          })
        ]
        )
      )
    })

    it('maps LangChain ai messages to assistant role', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'ai', content: 'Hi there!' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            role: 'assistant',
            content: 'Hi there!',
          })
        ]
        )
      )
    })

    it('maps LangChain system messages to system role', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'system', content: 'You are helpful' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            role: 'system',
            content: 'You are helpful',
          })
        ]
        )
      )
    })

    it('uses provided message ID', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'Hello', id: 'custom-id-123' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].id).toBe('custom-id-123')
    })

    it('generates ID with index fallback when no ID provided', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human', content: 'Message 1' },
            { type: 'ai', content: 'Message 2' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].id).toBe('msg-0')
      expect(messages[1].id).toBe('msg-1')
    })

    it('uses custom ID generator when provided', () => {
      const customGenerateId = vi.fn()
        .mockReturnValueOnce('custom-1')
        .mockReturnValueOnce('custom-2')

      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human', content: 'Message 1' },
            { type: 'human', content: 'Message 2' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
        generateId: customGenerateId,
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].id).toBe('custom-1')
      expect(messages[1].id).toBe('custom-2')
    })

    it('assigns createdAt date to all messages', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].createdAt).toBeInstanceOf(Date)
    })

    it('handles multiple messages with mixed types', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human', content: 'What is AI?' },
            { type: 'ai', content: 'AI is artificial intelligence.' },
            { type: 'human', content: 'Tell me more.' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toHaveLength(3)
      expect(messages[0].role).toBe('user')
      expect(messages[1].role).toBe('assistant')
      expect(messages[2].role).toBe('user')
    })

    it('handles empty message array', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toEqual([])
    })
  })

  // ============================================================================
  // State Synchronization Tests
  // ============================================================================

  describe('state synchronization', () => {
    it('reflects isLoading state in thinkingBarProps', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.thinkingBarProps.isActive).toBe(true)
      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })

    it('sets idle status when not loading', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.thinkingBarProps.isActive).toBe(false)
      expect(result.current.thinkingBarProps.status).toBe('idle')
    })

    it('sets error status when error exists', () => {
      const error = new Error('Connection failed')
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('error')
      expect(result.current.error).toBe(error)
    })

    it('reflects isLoading in senderProps', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.senderProps.isLoading).toBe(true)
    })

    it('reflects isLoading in thinkingPillProps', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.thinkingPillProps.isActive).toBe(true)
      expect(result.current.thinkingPillProps.label).toBe('Generating...')
    })

    it('clears thinking pill label when not loading', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.thinkingPillProps.isActive).toBe(false)
      expect(result.current.thinkingPillProps.label).toBeUndefined()
    })

    it('reflects isLoading in streamProgressProps', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.streamProgressProps.status).toBe('streaming')
      expect(result.current.streamProgressProps.progress).toBe(50)
    })

    it('sets complete progress when not loading', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.streamProgressProps.progress).toBe(100)
    })

    it('updates all props when state changes', () => {
      const langchain = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        clear: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: { langchain } }
      )

      expect(result.current.thinkingBarProps.status).toBe('idle')

      langchain.isLoading = true
      rerender({ langchain })

      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })
  })

  // ============================================================================
  // Callback Handling Tests
  // ============================================================================

  describe('callback handling', () => {
    it('passes sendMessage callback to senderProps', async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined)
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage,
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      await act(async () => {
        await result.current.senderProps.onSend('test message')
      })

      expect(sendMessage).toHaveBeenCalledWith('test message')
    })

    it('passes clear callback to clearConversation', () => {
      const clear = vi.fn()
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear,
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      act(() => {
        result.current.clearConversation()
      })

      expect(clear).toHaveBeenCalled()
    })

    it('provides model reference when available', () => {
      const mockModel = { invoke: vi.fn(), stream: vi.fn() }
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
          model: mockModel,
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.model).toBe(mockModel)
    })

    it('handles missing model gracefully', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.model).toBeUndefined()
    })

    it('responseActionsProps has no regenerate capability', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.responseActionsProps.onRegenerate).toBeUndefined()
      expect(result.current.responseActionsProps.isRegenerating).toBe(false)
    })
  })

  // ============================================================================
  // Error Scenarios Tests
  // ============================================================================

  describe('error scenarios', () => {
    it('handles error state correctly', () => {
      const error = new Error('API Error')
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.error).toBe(error)
      expect(result.current.isLoading).toBe(false)
    })

    it('prioritizes error over loading state', () => {
      const error = new Error('API Error')
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: true,
          error,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('error')
    })

    it('recovers when error is cleared', () => {
      const langchain = {
        messages: [],
        isLoading: false,
        error: new Error('Initial error'),
        sendMessage: vi.fn(),
        clear: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: { langchain } }
      )

      expect(result.current.thinkingBarProps.status).toBe('error')

      langchain.error = undefined
      rerender({ langchain })

      expect(result.current.thinkingBarProps.status).toBe('idle')
    })

    it('maintains other props during error', () => {
      const error = new Error('API Error')
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'test' }],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1)
      expect(result.current.error).toBe(error)
    })
  })

  // ============================================================================
  // Type Safety Tests
  // ============================================================================

  describe('type safety', () => {
    it('returns correct interface structure', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current).toHaveProperty('thinkingBarProps')
      expect(result.current).toHaveProperty('thinkingPillProps')
      expect(result.current).toHaveProperty('streamProgressProps')
      expect(result.current).toHaveProperty('conversationsProps')
      expect(result.current).toHaveProperty('senderProps')
      expect(result.current).toHaveProperty('responseActionsProps')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('clearConversation')
      expect(result.current).toHaveProperty('model')
    })

    it('thinking bar props have required fields', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const thinkingBar = result.current.thinkingBarProps

      expect(thinkingBar).toHaveProperty('isActive')
      expect(thinkingBar).toHaveProperty('status')
      expect(['idle', 'thinking', 'processing', 'complete', 'error']).toContain(
        thinkingBar.status
      )
    })

    it('sender props have correct callback signature', async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined)
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage,
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const senderProps = result.current.senderProps

      expect(typeof senderProps.onSend).toBe('function')
      expect(senderProps.onStop).toBeUndefined()
    })

    it('conversations props have correct structure', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'test' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const conversations = result.current.conversationsProps

      expect(Array.isArray(conversations.items)).toBe(true)
      expect(conversations.items[0]).toHaveProperty('key')
      expect(conversations.items[0]).toHaveProperty('label')
      expect(conversations.items[0]).toHaveProperty('messages')
      expect(typeof conversations.activeKey).toBe('string')
    })
  })

  // ============================================================================
  // Edge Cases and Performance Tests
  // ============================================================================

  describe('edge cases and performance', () => {
    it('memoizes messages to prevent unnecessary re-renders', () => {
      const langchain = {
        messages: [{ type: 'human', content: 'test' }],
        isLoading: false,
        sendMessage: vi.fn(),
        clear: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: { langchain } }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      rerender({ langchain })

      const secondMessages = result.current.conversationsProps.items[0].messages

      expect(firstMessages).toBe(secondMessages)
    })

    it('updates memos when messages change', () => {
      const langchain = {
        messages: [{ type: 'human', content: 'test' }],
        isLoading: false,
        sendMessage: vi.fn(),
        clear: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: { langchain } }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      langchain.messages = [
        { type: 'human', content: 'test' },
        { type: 'ai', content: 'response' },
      ]
      rerender({ langchain })

      const secondMessages = result.current.conversationsProps.items[0].messages

      expect(secondMessages).not.toBe(firstMessages)
      expect(secondMessages).toHaveLength(2)
    })

    it('handles large message arrays', () => {
      const largeMessages = Array.from({ length: 1000 }, (_, i) => ({
        type: (i % 2 === 0 ? 'human' : 'ai') as const,
        content: `Message ${i}`,
      }))

      const options: LangChainBridgeOptions = {
        langchain: {
          messages: largeMessages,
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1000)
    })

    it('placeholder changes based on loading state', () => {
      const langchain = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        clear: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: { langchain } }
      )

      expect(result.current.senderProps.placeholder).toBe('Type a message...')

      langchain.isLoading = true
      rerender({ langchain })

      expect(result.current.senderProps.placeholder).toBe('Generating...')
    })
  })
})
