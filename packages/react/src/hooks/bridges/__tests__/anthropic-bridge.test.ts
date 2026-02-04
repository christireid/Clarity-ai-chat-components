import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useAnthropicBridge, type AnthropicBridgeOptions } from '../index'

describe('useAnthropicBridge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ============================================================================
  // Message Mapping Tests
  // ============================================================================

  describe('message mapping', () => {
    it('maps Anthropic messages with string content', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-1',
              role: 'user',
              content: 'Hello Claude',
              usage: { input_tokens: 10, output_tokens: 0 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 10, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0]).toEqual(
        expect.objectContaining({
          id: 'msg-1',
          role: 'user',
          content: 'Hello Claude',
        })
      )
    })

    it('maps Anthropic assistant messages', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-2',
              role: 'assistant',
              content: 'Hi! I am Claude.',
              usage: { input_tokens: 0, output_tokens: 15 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 15 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].role).toBe('assistant')
      expect(messages[0].content).toBe('Hi! I am Claude.')
    })

    it('extracts text from content blocks array', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-3',
              role: 'assistant',
              content: [
                { type: 'text', text: 'First part. ' },
                { type: 'text', text: 'Second part.' },
              ],
              usage: { input_tokens: 0, output_tokens: 20 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 20 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].content).toBe('First part. Second part.')
    })

    it('filters non-text content blocks', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-4',
              role: 'assistant',
              content: [
                { type: 'text', text: 'Text content' },
                { type: 'tool_use', id: 'tool-1', name: 'search', input: {} },
                { type: 'text', text: ' more text' },
              ],
              usage: { input_tokens: 0, output_tokens: 25 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 25 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].content).toBe('Text content more text')
    })

    it('handles mixed content with tool_result blocks', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-5',
              role: 'assistant',
              content: [
                { type: 'text', text: 'Calling tool...' },
                { type: 'tool_use', id: 'tool-2', name: 'calc', input: { x: 1, y: 2 } },
              ],
              usage: { input_tokens: 0, output_tokens: 30 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 30 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].content).toBe('Calling tool...')
    })

    it('handles empty content blocks gracefully', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-6',
              role: 'assistant',
              content: [],
              usage: { input_tokens: 0, output_tokens: 5 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 5 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].content).toBe('')
    })

    it('assigns createdAt date to all messages', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-7',
              role: 'user',
              content: 'Test',
              usage: { input_tokens: 5, output_tokens: 0 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 5, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].createdAt).toBeInstanceOf(Date)
    })

    it('handles multiple messages correctly', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-8',
              role: 'user',
              content: 'What is 2+2?',
              usage: { input_tokens: 10, output_tokens: 0 },
            },
            {
              id: 'msg-9',
              role: 'assistant',
              content: 'The answer is 4.',
              usage: { input_tokens: 0, output_tokens: 8 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 10, outputTokens: 8 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toHaveLength(2)
      expect(messages[0].role).toBe('user')
      expect(messages[1].role).toBe('assistant')
    })

    it('handles empty message array', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toEqual([])
    })
  })

  // ============================================================================
  // Token Usage Tracking Tests
  // ============================================================================

  describe('token usage tracking', () => {
    it('calculates total tokens correctly', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 100, outputTokens: 50 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.usage.inputTokens).toBe(100)
      expect(result.current.usage.outputTokens).toBe(50)
      expect(result.current.usage.totalTokens).toBe(150)
    })

    it('reflects token usage in streamProgressProps', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 200, outputTokens: 75 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.streamProgressProps.tokensUsed).toBe(275)
    })

    it('handles zero token usage', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.usage.totalTokens).toBe(0)
      expect(result.current.streamProgressProps.tokensUsed).toBe(0)
    })

    it('updates token usage when state changes', () => {
      const anthropic = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 50, outputTokens: 25 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        { initialProps: { anthropic } }
      )

      expect(result.current.usage.totalTokens).toBe(75)

      anthropic.usage = { inputTokens: 100, outputTokens: 50 }
      rerender({ anthropic })

      expect(result.current.usage.totalTokens).toBe(150)
    })

    it('does not set tokensTotal by default', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 100, outputTokens: 50 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.streamProgressProps.tokensTotal).toBeUndefined()
    })
  })

  // ============================================================================
  // State Synchronization Tests
  // ============================================================================

  describe('state synchronization', () => {
    it('reflects isLoading state in thinkingBarProps', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingBarProps.isActive).toBe(true)
      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })

    it('sets idle status when not loading', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('idle')
      expect(result.current.thinkingBarProps.progress).toBe(100)
    })

    it('shows thinking progress when loading', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingBarProps.progress).toBeUndefined()
    })

    it('sets error status when error exists', () => {
      const error = new Error('API Error')
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('error')
      expect(result.current.error).toBe(error)
    })

    it('reflects isLoading in thinkingPillProps', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingPillProps.isActive).toBe(true)
      expect(result.current.thinkingPillProps.label).toBe('Claude is thinking...')
    })

    it('clears thinking pill label when not loading', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingPillProps.isActive).toBe(false)
      expect(result.current.thinkingPillProps.label).toBeUndefined()
    })

    it('reflects isLoading in streamProgressProps', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.streamProgressProps.status).toBe('streaming')
      expect(result.current.streamProgressProps.progress).toBe(50)
    })

    it('updates all props when state changes', () => {
      const anthropic = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 0, outputTokens: 0 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        { initialProps: { anthropic } }
      )

      expect(result.current.thinkingBarProps.status).toBe('idle')

      anthropic.isLoading = true
      rerender({ anthropic })

      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })
  })

  // ============================================================================
  // Callback Handling Tests
  // ============================================================================

  describe('callback handling', () => {
    it('passes sendMessage callback to senderProps', async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined)
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage,
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      await act(async () => {
        await result.current.senderProps.onSend('test message')
      })

      expect(sendMessage).toHaveBeenCalledWith('test message')
    })

    it('passes stopGeneration callback to senderProps.onStop', () => {
      const stopGeneration = vi.fn()
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration,
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.senderProps.onStop).toBe(stopGeneration)
    })

    it('calls stopGeneration when onStop is called', () => {
      const stopGeneration = vi.fn()
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration,
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      act(() => {
        result.current.senderProps.onStop?.()
      })

      expect(stopGeneration).toHaveBeenCalled()
    })

    it('responseActionsProps has no regenerate capability', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.responseActionsProps.onRegenerate).toBeUndefined()
      expect(result.current.responseActionsProps.isRegenerating).toBe(false)
    })

    it('placeholder changes based on showTokenUsage option', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
        showTokenUsage: true,
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Message Claude...')
    })
  })

  // ============================================================================
  // Error Scenarios Tests
  // ============================================================================

  describe('error scenarios', () => {
    it('handles error state correctly', () => {
      const error = new Error('Rate limit exceeded')
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.error).toBe(error)
      expect(result.current.isLoading).toBe(false)
    })

    it('prioritizes error over loading state', () => {
      const error = new Error('Connection failed')
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          error,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.thinkingBarProps.status).toBe('error')
    })

    it('recovers when error is cleared', () => {
      const anthropic = {
        messages: [],
        isLoading: false,
        error: new Error('Initial error'),
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 0, outputTokens: 0 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        { initialProps: { anthropic } }
      )

      expect(result.current.thinkingBarProps.status).toBe('error')

      anthropic.error = undefined
      rerender({ anthropic })

      expect(result.current.thinkingBarProps.status).toBe('idle')
    })

    it('maintains messages during error', () => {
      const error = new Error('Processing error')
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-10',
              role: 'user',
              content: 'Hello',
              usage: { input_tokens: 5, output_tokens: 0 },
            },
          ],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 5, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1)
      expect(result.current.error).toBe(error)
    })
  })

  // ============================================================================
  // Type Safety Tests
  // ============================================================================

  describe('type safety', () => {
    it('returns correct interface structure', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current).toHaveProperty('thinkingBarProps')
      expect(result.current).toHaveProperty('thinkingPillProps')
      expect(result.current).toHaveProperty('streamProgressProps')
      expect(result.current).toHaveProperty('conversationsProps')
      expect(result.current).toHaveProperty('senderProps')
      expect(result.current).toHaveProperty('responseActionsProps')
      expect(result.current).toHaveProperty('isLoading')
      expect(result.current).toHaveProperty('error')
      expect(result.current).toHaveProperty('usage')
      expect(result.current).toHaveProperty('stopGeneration')
    })

    it('usage object has required fields', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 50, outputTokens: 25 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.usage).toHaveProperty('inputTokens')
      expect(result.current.usage).toHaveProperty('outputTokens')
      expect(result.current.usage).toHaveProperty('totalTokens')
      expect(typeof result.current.usage.inputTokens).toBe('number')
      expect(typeof result.current.usage.outputTokens).toBe('number')
      expect(typeof result.current.usage.totalTokens).toBe('number')
    })

    it('stream progress props have correct structure', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 100, outputTokens: 50 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const streamProps = result.current.streamProgressProps

      expect(typeof streamProps.progress).toBe('number')
      expect(['idle', 'connecting', 'streaming', 'complete', 'error']).toContain(
        streamProps.status
      )
      expect(typeof streamProps.tokensUsed).toBe('number')
      expect(streamProps.tokensTotal).toBeUndefined()
    })

    it('sender props have correct callback signatures', async () => {
      const sendMessage = vi.fn().mockResolvedValue(undefined)
      const stopGeneration = vi.fn()
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage,
          stopGeneration,
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const senderProps = result.current.senderProps

      expect(typeof senderProps.onSend).toBe('function')
      expect(typeof senderProps.onStop).toBe('function')
      expect(typeof senderProps.isLoading).toBe('boolean')
    })
  })

  // ============================================================================
  // Edge Cases and Performance Tests
  // ============================================================================

  describe('edge cases and performance', () => {
    it('memoizes messages to prevent unnecessary re-renders', () => {
      const anthropic = {
        messages: [
          {
            id: 'msg-11',
            role: 'user' as const,
            content: 'test',
            usage: { input_tokens: 5, output_tokens: 0 },
          },
        ],
        isLoading: false,
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 5, outputTokens: 0 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        { initialProps: { anthropic } }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      rerender({ anthropic })

      const secondMessages = result.current.conversationsProps.items[0].messages

      expect(firstMessages).toBe(secondMessages)
    })

    it('updates memos when messages change', () => {
      const anthropic = {
        messages: [
          {
            id: 'msg-12',
            role: 'user' as const,
            content: 'test',
            usage: { input_tokens: 5, output_tokens: 0 },
          },
        ],
        isLoading: false,
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 5, outputTokens: 0 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        { initialProps: { anthropic } }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      anthropic.messages = [
        ...anthropic.messages,
        {
          id: 'msg-13',
          role: 'assistant' as const,
          content: 'response',
          usage: { input_tokens: 0, output_tokens: 10 },
        },
      ]
      rerender({ anthropic })

      const secondMessages = result.current.conversationsProps.items[0].messages

      expect(secondMessages).not.toBe(firstMessages)
      expect(secondMessages).toHaveLength(2)
    })

    it('handles large message arrays', () => {
      const largeMessages = Array.from({ length: 500 }, (_, i) => ({
        id: `msg-${i}`,
        role: (i % 2 === 0 ? 'user' : 'assistant') as const,
        content: `Message ${i}`,
        usage: { input_tokens: 10, output_tokens: 5 },
      }))

      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: largeMessages,
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 5000, outputTokens: 2500 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(500)
    })

    it('placeholder changes based on loading state', () => {
      const anthropic = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 0, outputTokens: 0 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        { initialProps: { anthropic } }
      )

      expect(result.current.senderProps.placeholder).toBe('Message Claude...')

      anthropic.isLoading = true
      rerender({ anthropic })

      expect(result.current.senderProps.placeholder).toBe('Generating response...')
    })

    it('handles showTokenUsage option', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 100, outputTokens: 50 },
        },
        showTokenUsage: true,
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.streamProgressProps.tokensUsed).toBe(150)
    })

    it('handles content with only non-text blocks', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-14',
              role: 'assistant',
              content: [
                { type: 'tool_use', id: 'tool-1', name: 'search', input: {} },
              ],
              usage: { input_tokens: 0, output_tokens: 10 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 10 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].content).toBe('')
    })
  })
})
