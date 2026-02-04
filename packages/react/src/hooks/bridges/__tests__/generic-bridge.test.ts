import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useGenericBridge, type GenericBridgeOptions } from '../index'

describe('useGenericBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================================
  // Message Mapping Tests
  // ============================================================================

  describe('message mapping', () => {
    it('maps custom message objects to clarity format', () => {
      interface CustomMessage {
        id: string
        sender: string
        text: string
      }

      const customMessages: CustomMessage[] = [
        { id: '1', sender: 'user', text: 'Hello' },
      ]

      const options: GenericBridgeOptions<CustomMessage> = {
        state: {
          messages: customMessages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: msg.id,
          role: msg.sender,
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0]).toEqual(
        expect.objectContaining({
          id: '1',
          role: 'user',
          content: 'Hello',
        })
      )
    })

    it('uses mapMessage function with correct index', () => {
      const mapMessage = vi.fn((msg, i) => ({
        id: `${i}`,
        role: 'user',
        content: `Message ${i}`,
      }))

      const options: GenericBridgeOptions = {
        state: {
          messages: [{}, {}],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage,
      }

      renderHook(() => useGenericBridge(options))

      expect(mapMessage).toHaveBeenCalledWith(expect.anything(), 0)
      expect(mapMessage).toHaveBeenCalledWith(expect.anything(), 1)
      expect(mapMessage).toHaveBeenCalledTimes(2)
    })

    it('maps multiple messages with different roles', () => {
      interface Message {
        type: 'user' | 'bot'
        text: string
        id?: string
      }

      const messages: Message[] = [
        { type: 'user', text: 'Hi' },
        { type: 'bot', text: 'Hello!' },
      ]

      const options: GenericBridgeOptions<Message> = {
        state: {
          messages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, i) => ({
          id: msg.id || `${i}`,
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const mappedMessages = result.current.conversationsProps.items[0].messages

      expect(mappedMessages[0].role).toBe('user')
      expect(mappedMessages[1].role).toBe('assistant')
    })

    it('includes createdAt when provided by mapMessage', () => {
      interface Message {
        text: string
        timestamp: number
      }

      const messages: Message[] = [
        { text: 'Hello', timestamp: 1000 },
      ]

      const options: GenericBridgeOptions<Message> = {
        state: {
          messages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: `${msg.timestamp}`,
          role: 'user',
          content: msg.text,
          createdAt: new Date(msg.timestamp),
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const mappedMessages = result.current.conversationsProps.items[0].messages

      expect(mappedMessages[0].createdAt).toBeInstanceOf(Date)
    })

    it('handles messages without createdAt', () => {
      interface Message {
        text: string
      }

      const messages: Message[] = [{ text: 'Test' }]

      const options: GenericBridgeOptions<Message> = {
        state: {
          messages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, i) => ({
          id: `${i}`,
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const mappedMessages = result.current.conversationsProps.items[0].messages

      expect(mappedMessages[0]).not.toHaveProperty('createdAt')
    })

    it('handles empty message array', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: 'id',
          role: 'user',
          content: 'content',
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toEqual([])
    })

    it('handles complex custom message types', () => {
      interface ComplexMessage {
        id: string
        author: { name: string; id: string }
        body: { text: string; metadata: Record<string, unknown> }
        timestamp: string
      }

      const messages: ComplexMessage[] = [
        {
          id: 'msg-1',
          author: { name: 'Alice', id: 'user-1' },
          body: {
            text: 'Complex message',
            metadata: { edited: false, likes: 5 },
          },
          timestamp: '2024-01-28T12:00:00Z',
        },
      ]

      const options: GenericBridgeOptions<ComplexMessage> = {
        state: {
          messages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: msg.id,
          role: msg.author.name,
          content: msg.body.text,
          createdAt: new Date(msg.timestamp),
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const mappedMessages = result.current.conversationsProps.items[0].messages

      expect(mappedMessages[0].id).toBe('msg-1')
      expect(mappedMessages[0].content).toBe('Complex message')
    })
  })

  // ============================================================================
  // State Synchronization Tests
  // ============================================================================

  describe('state synchronization', () => {
    it('reflects isLoading state in thinkingBarProps', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingBarProps.isActive).toBe(true)
      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })

    it('sets idle status when not loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingBarProps.isActive).toBe(false)
      expect(result.current.thinkingBarProps.status).toBe('idle')
    })

    it('sets error status when error exists', () => {
      const error = new Error('Custom SDK error')
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('error')
      expect(result.current.error).toBe(error)
    })

    it('reflects isLoading in senderProps', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.isLoading).toBe(true)
    })

    it('reflects isLoading in thinkingPillProps', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        thinkingLabel: 'Processing...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingPillProps.isActive).toBe(true)
      expect(result.current.thinkingPillProps.label).toBe('Processing...')
    })

    it('clears thinking pill when not loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingPillProps.isActive).toBe(false)
      expect(result.current.thinkingPillProps.label).toBeUndefined()
    })

    it('reflects isLoading in streamProgressProps', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.streamProgressProps.status).toBe('streaming')
      expect(result.current.streamProgressProps.progress).toBe(50)
    })

    it('sets complete progress when not loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.streamProgressProps.progress).toBe(100)
    })

    it('updates all props when state changes', () => {
      const state = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: GenericBridgeOptions) => useGenericBridge(opts),
        {
          initialProps: {
            state,
            mapMessage: (msg) => ({ id: '', role: '', content: '' }),
          },
        }
      )

      expect(result.current.thinkingBarProps.status).toBe('idle')

      state.isLoading = true
      rerender({
        state,
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      })

      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })
  })

  // ============================================================================
  // Callback Handling Tests
  // ============================================================================

  describe('callback handling', () => {
    it('passes sendMessage callback to senderProps', async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined)
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage,
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      await act(async () => {
        await result.current.senderProps.onSend('test message')
      })

      expect(sendMessage).toHaveBeenCalledWith('test message')
    })

    it('passes stop callback to senderProps.onStop', () => {
      const stop = vi.fn()
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stop,
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.onStop).toBe(stop)
    })

    it('calls stop when onStop is called', () => {
      const stop = vi.fn()
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stop,
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      act(() => {
        result.current.senderProps.onStop?.()
      })

      expect(stop).toHaveBeenCalled()
    })

    it('handles missing stop callback gracefully', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.onStop).toBeUndefined()
    })

    it('responseActionsProps has no regenerate capability', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.responseActionsProps.onRegenerate).toBeUndefined()
      expect(result.current.responseActionsProps.isRegenerating).toBe(false)
    })
  })

  // ============================================================================
  // Error Scenarios Tests
  // ============================================================================

  describe('error scenarios', () => {
    it('handles error state correctly', () => {
      const error = new Error('Custom error')
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.error).toBe(error)
      expect(result.current.isLoading).toBe(false)
    })

    it('prioritizes error over loading state', () => {
      const error = new Error('Critical error')
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          error,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('error')
    })

    it('recovers when error is cleared', () => {
      const state = {
        messages: [],
        isLoading: false,
        error: new Error('Initial error'),
        sendMessage: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (opts: GenericBridgeOptions) => useGenericBridge(opts),
        {
          initialProps: {
            state,
            mapMessage: (msg) => ({ id: '', role: '', content: '' }),
          },
        }
      )

      expect(result.current.thinkingBarProps.status).toBe('error')

      state.error = undefined
      rerender({
        state,
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      })

      expect(result.current.thinkingBarProps.status).toBe('idle')
    })

    it('maintains messages during error', () => {
      const error = new Error('Processing error')
      const options: GenericBridgeOptions = {
        state: {
          messages: [{ text: 'Hello' }],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, i) => ({
          id: `${i}`,
          role: 'user',
          content: 'Hello',
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1)
      expect(result.current.error).toBe(error)
    })
  })

  // ============================================================================
  // Placeholder and Label Customization Tests
  // ============================================================================

  describe('placeholder and label customization', () => {
    it('uses default placeholder when not provided', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Type a message...')
    })

    it('uses custom placeholder when provided', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        placeholder: 'Ask me anything...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Ask me anything...')
    })

    it('uses default thinking label when not provided', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingPillProps.label).toBe('Generating...')
    })

    it('uses custom thinking label when provided', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        thinkingLabel: 'Computing response...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.thinkingPillProps.label).toBe('Computing response...')
    })

    it('uses thinking label in senderProps placeholder when loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        placeholder: 'Ask me...',
        thinkingLabel: 'Thinking...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Thinking...')
    })

    it('uses regular placeholder when not loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        placeholder: 'Ask me...',
        thinkingLabel: 'Thinking...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Ask me...')
    })
  })

  // ============================================================================
  // Type Safety Tests
  // ============================================================================

  describe('type safety', () => {
    it('returns correct interface structure', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current).toHaveProperty('thinkingBarProps')
      expect(result.current).toHaveProperty('thinkingPillProps')
      expect(result.current).toHaveProperty('streamProgressProps')
      expect(result.current).toHaveProperty('conversationsProps')
      expect(result.current).toHaveProperty('senderProps')
      expect(result.current).toHaveProperty('responseActionsProps')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
    })

    it('stream progress props have correct structure', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const streamProps = result.current.streamProgressProps

      expect(typeof streamProps.progress).toBe('number')
      expect(['idle', 'streaming', 'error']).toContain(streamProps.status)
      expect(typeof streamProps.tokensUsed).toBe('number')
    })

    it('sender props have correct callback signature', async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined)
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage,
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const senderProps = result.current.senderProps

      expect(typeof senderProps.onSend).toBe('function')
      expect(typeof senderProps.isLoading).toBe('boolean')
    })

    it('conversations props have correct structure', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [{ text: 'test' }],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, i) => ({
          id: `${i}`,
          role: 'user',
          content: 'test',
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
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
      const state = {
        messages: [{ text: 'test' }],
        isLoading: false,
        sendMessage: vi.fn(),
      }

      const mapMessage = vi.fn((msg, i) => ({
        id: `${i}`,
        role: 'user',
        content: 'test',
      }))

      const { result, rerender } = renderHook(
        (opts: GenericBridgeOptions) => useGenericBridge(opts),
        {
          initialProps: {
            state,
            mapMessage,
          },
        }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      rerender({ state, mapMessage })

      const secondMessages = result.current.conversationsProps.items[0].messages

      expect(firstMessages).toBe(secondMessages)
    })

    it('updates memos when messages change', () => {
      const state = {
        messages: [{ text: 'test' }],
        isLoading: false,
        sendMessage: vi.fn(),
      }

      const mapMessage = vi.fn((msg, i) => ({
        id: `${i}`,
        role: 'user',
        content: msg.text,
      }))

      const { result, rerender } = renderHook(
        (opts: GenericBridgeOptions) => useGenericBridge(opts),
        {
          initialProps: {
            state,
            mapMessage,
          },
        }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      state.messages = [{ text: 'test' }, { text: 'response' }]
      rerender({ state, mapMessage })

      const secondMessages = result.current.conversationsProps.items[0].messages

      expect(secondMessages).not.toBe(firstMessages)
      expect(secondMessages).toHaveLength(2)
    })

    it('handles large message arrays', () => {
      const largeMessages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
      }))

      const options: GenericBridgeOptions = {
        state: {
          messages: largeMessages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, i) => ({
          id: `${i}`,
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1000)
    })

    it('uses stable tokens value', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.streamProgressProps.tokensUsed).toBe(0)
    })

    it('handles mapMessage errors gracefully', () => {
      const mapMessage = vi.fn((msg, i) => {
        throw new Error('Mapping error')
      })

      const options: GenericBridgeOptions = {
        state: {
          messages: [{ text: 'test' }],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage,
      }

      expect(() => renderHook(() => useGenericBridge(options))).toThrow()
    })

    it('handles extremely long placeholder text', () => {
      const veryLongPlaceholder = 'A'.repeat(1000)
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        placeholder: veryLongPlaceholder,
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe(veryLongPlaceholder)
    })

    it('handles unicode in placeholder and thinking label', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({ id: '', role: '', content: '' }),
        placeholder: '💬 Type your message...',
        thinkingLabel: '🤔 Thinking...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('🤔 Thinking...')
      expect(result.current.thinkingPillProps.label).toBe('🤔 Thinking...')
    })
  })

  // ============================================================================
  // Generic Type Tests
  // ============================================================================

  describe('generic type support', () => {
    it('works with string messages', () => {
      const options: GenericBridgeOptions<string> = {
        state: {
          messages: ['Hello', 'World'],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, i) => ({
          id: `${i}`,
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toHaveLength(2)
      expect(messages[0].content).toBe('Hello')
      expect(messages[1].content).toBe('World')
    })

    it('works with object messages', () => {
      interface ObjectMessage {
        id: string
        body: string
      }

      const options: GenericBridgeOptions<ObjectMessage> = {
        state: {
          messages: [
            { id: '1', body: 'First' },
            { id: '2', body: 'Second' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: msg.id,
          role: 'user',
          content: msg.body,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].id).toBe('1')
      expect(messages[1].id).toBe('2')
    })

    it('works with unknown type by default', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [{ data: 'anything' }],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: 'id',
          role: 'role',
          content: 'content',
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1)
    })
  })
})
