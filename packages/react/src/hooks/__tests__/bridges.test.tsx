/**
 * Tests for Bridge Hooks
 *
 * Tests bridge hooks that connect external AI SDKs (LangChain, Anthropic, Generic)
 * to clarity-chat components.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useLangChainBridge,
  useAnthropicBridge,
  useGenericBridge,
  type LangChainBridgeOptions,
  type AnthropicBridgeOptions,
  type GenericBridgeOptions,
  type BaseBridgeProps,
} from '../bridges/index'

// ============================================================================
// LangChain Bridge Tests
// ============================================================================

describe('useLangChainBridge', () => {
  // ============================================================================
  // Message Mapping Tests
  // ============================================================================

  describe('message mapping', () => {
    it('maps human messages to user role', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toContainEqual(
        expect.objectContaining({
          role: 'user',
          content: 'Hello',
        })
      )
    })

    it('maps ai messages to assistant role', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'ai', content: 'Hi there!' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toContainEqual(
        expect.objectContaining({
          role: 'assistant',
          content: 'Hi there!',
        })
      )
    })

    it('maps system messages to system role', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'system', content: 'You are helpful' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toContainEqual(
        expect.objectContaining({
          role: 'system',
          content: 'You are helpful',
        })
      )
    })

    it('uses provided message ID when available', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human', content: 'Hello', id: 'custom-id-123' },
          ],
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
          messages: [{ type: 'human', content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].id).toBe('msg-0')
    })

    it('handles multiple messages in order', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human', content: 'First' },
            { type: 'ai', content: 'Response' },
            { type: 'human', content: 'Second' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages).toHaveLength(3)
      expect(messages[0].content).toBe('First')
      expect(messages[1].content).toBe('Response')
      expect(messages[2].content).toBe('Second')
    })

    it('uses custom ID generator when provided', () => {
      const customIdGenerator = vi.fn(() => 'custom-id-from-generator')
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
        generateId: customIdGenerator,
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const messages = result.current.conversationsProps.items[0].messages

      expect(messages[0].id).toBe('custom-id-from-generator')
    })
  })

  // ============================================================================
  // State Synchronization Tests
  // ============================================================================

  describe('state synchronization', () => {
    it('syncs loading state to thinking bar', () => {
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

    it('syncs error state to progress props', () => {
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

      expect(result.current.streamProgressProps.status).toBe('error')
      expect(result.current.error).toBe(error)
    })

    it('updates props when state changes', () => {
      const langchain = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        clear: vi.fn(),
      }

      const { result, rerender } = renderHook(
        (options: LangChainBridgeOptions) => useLangChainBridge(options),
        {
          initialProps: { langchain } as LangChainBridgeOptions,
        }
      )

      expect(result.current.isLoading).toBe(false)

      // Update to loading state
      langchain.isLoading = true
      rerender({ langchain })

      expect(result.current.isLoading).toBe(true)
      expect(result.current.thinkingBarProps.isActive).toBe(true)
    })
  })

  // ============================================================================
  // Callback Tests
  // ============================================================================

  describe('callback handlers', () => {
    it('forwards sendMessage to sender props', async () => {
      const sendMessageMock = vi.fn().mockResolvedValue(undefined)
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: sendMessageMock,
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      await act(async () => {
        await result.current.senderProps.onSend('Hello world')
      })

      expect(sendMessageMock).toHaveBeenCalledWith('Hello world')
    })

    it('provides clear conversation callback', async () => {
      const clearMock = vi.fn()
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: clearMock,
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      act(() => {
        result.current.clearConversation()
      })

      expect(clearMock).toHaveBeenCalled()
    })

    it('provides regenerate callback to response actions', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      // LangChain doesn't have built-in regenerate
      expect(result.current.responseActionsProps.onRegenerate).toBeUndefined()
    })
  })

  // ============================================================================
  // Props Structure Tests
  // ============================================================================

  describe('props structure', () => {
    it('returns all required bridge props', () => {
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
    })

    it('returns sender placeholder when loading', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Generating...')
    })

    it('returns default placeholder when not loading', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Type a message...')
    })

    it('creates single conversation with main key', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human', content: 'Hello' },
            { type: 'ai', content: 'Hi' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items).toHaveLength(1)
      expect(result.current.conversationsProps.items[0].key).toBe('main')
      expect(result.current.conversationsProps.items[0].label).toBe('Chat')
      expect(result.current.conversationsProps.activeKey).toBe('main')
    })
  })

  // ============================================================================
  // Model Reference Tests
  // ============================================================================

  describe('model reference', () => {
    it('includes model reference when available', () => {
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
  })

  // ============================================================================
  // Memoization Tests
  // ============================================================================

  describe('memoization', () => {
    it('memoizes conversation props', () => {
      const messages = [{ type: 'human' as const, content: 'Hello' }]
      const options: LangChainBridgeOptions = {
        langchain: {
          messages,
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: options }
      )

      const firstProps = result.current.conversationsProps

      // Rerender with same messages
      rerender(options)

      // Should return same reference if messages haven't changed
      expect(result.current.conversationsProps).toBe(firstProps)
    })

    it('updates memoized props when dependencies change', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human' as const, content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result, rerender } = renderHook(
        (opts: LangChainBridgeOptions) => useLangChainBridge(opts),
        { initialProps: options }
      )

      const firstProps = result.current.conversationsProps

      // Rerender with different messages
      const newOptions: LangChainBridgeOptions = {
        langchain: {
          messages: [
            { type: 'human' as const, content: 'Hello' },
            { type: 'ai' as const, content: 'Hi' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      rerender(newOptions)

      // Should return new reference if messages changed
      expect(result.current.conversationsProps).not.toBe(firstProps)
      expect(result.current.conversationsProps.items[0].messages).toHaveLength(2)
    })
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('edge cases', () => {
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

      expect(result.current.conversationsProps.items[0].messages).toEqual([])
    })

    it('handles simultaneous loading and error', () => {
      const error = new Error('Stream error')
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

      // Loading takes precedence
      expect(result.current.thinkingBarProps.status).toBe('thinking')
    })

    it('handles very long content', () => {
      const longContent = 'a'.repeat(10000)
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human', content: longContent }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))

      expect(result.current.conversationsProps.items[0].messages[0].content).toBe(longContent)
    })

    it('handles messages with undefined optional fields', () => {
      const options: LangChainBridgeOptions = {
        langchain: {
          messages: [{ type: 'human' as const, content: 'Hello' }],
          isLoading: false,
          sendMessage: vi.fn(),
          clear: vi.fn(),
        },
      }

      const { result } = renderHook(() => useLangChainBridge(options))
      const message = result.current.conversationsProps.items[0].messages[0]

      expect(message).toHaveProperty('id')
      expect(message).toHaveProperty('role')
      expect(message).toHaveProperty('content')
      expect(message).toHaveProperty('createdAt')
    })
  })
})

// ============================================================================
// Anthropic Bridge Tests
// ============================================================================

describe('useAnthropicBridge', () => {
  // ============================================================================
  // Message Mapping Tests
  // ============================================================================

  describe('message mapping', () => {
    it('maps anthropic messages to clarity format', () => {
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

      expect(result.current.conversationsProps.items[0].messages).toContainEqual(
        expect.objectContaining({
          id: 'msg-1',
          role: 'user',
          content: 'Hello Claude',
        })
      )
    })

    it('handles text content blocks', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-1',
              role: 'assistant',
              content: [
                { type: 'text', text: 'Hello' },
                { type: 'text', text: ' World' },
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
      const message = result.current.conversationsProps.items[0].messages[0]

      expect(message.content).toBe('Hello World')
    })

    it('filters non-text content blocks', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-1',
              role: 'assistant',
              content: [
                { type: 'text', text: 'Thinking...' },
                { type: 'tool_use', id: 'tool-1', name: 'calculator', input: {} },
                { type: 'text', text: 'Done!' },
              ],
              usage: { input_tokens: 0, output_tokens: 50 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 50 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const message = result.current.conversationsProps.items[0].messages[0]

      // Should concatenate text blocks only
      expect(message.content).toBe('Thinking...Done!')
    })

    it('handles string content', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-1',
              role: 'user',
              content: 'Direct string content',
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

      expect(result.current.conversationsProps.items[0].messages[0].content).toBe(
        'Direct string content'
      )
    })
  })

  // ============================================================================
  // Token Usage Tests
  // ============================================================================

  describe('token usage tracking', () => {
    it('tracks input and output tokens', () => {
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

    it('includes token usage in stream progress', () => {
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

      expect(result.current.streamProgressProps.tokensUsed).toBe(150)
    })

    it('updates usage when tokens change', () => {
      const anthropic = {
        messages: [],
        isLoading: false,
        sendMessage: vi.fn(),
        stopGeneration: vi.fn(),
        usage: { inputTokens: 100, outputTokens: 50 },
      }

      const { result, rerender } = renderHook(
        (opts: AnthropicBridgeOptions) => useAnthropicBridge(opts),
        {
          initialProps: { anthropic } as AnthropicBridgeOptions,
        }
      )

      expect(result.current.usage.totalTokens).toBe(150)

      anthropic.usage = { inputTokens: 200, outputTokens: 100 }
      rerender({ anthropic })

      expect(result.current.usage.totalTokens).toBe(300)
    })
  })

  // ============================================================================
  // State Synchronization Tests
  // ============================================================================

  describe('state synchronization', () => {
    it('syncs isLoading to loading indicators', () => {
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

      expect(result.current.isLoading).toBe(true)
      expect(result.current.thinkingBarProps.isActive).toBe(true)
      expect(result.current.thinkingPillProps.isActive).toBe(true)
    })

    it('provides custom thinking label for Claude', () => {
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

      expect(result.current.thinkingPillProps.label).toBe('Claude is thinking...')
    })

    it('updates sender placeholder based on loading state', () => {
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

      expect(result.current.senderProps.placeholder).toBe('Generating response...')
    })
  })

  // ============================================================================
  // Callback Tests
  // ============================================================================

  describe('callback handlers', () => {
    it('forwards sendMessage callback', async () => {
      const sendMessageMock = vi.fn().mockResolvedValue(undefined)
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: false,
          sendMessage: sendMessageMock,
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      await act(async () => {
        await result.current.senderProps.onSend('Test message')
      })

      expect(sendMessageMock).toHaveBeenCalledWith('Test message')
    })

    it('forwards stopGeneration callback', () => {
      const stopGenerationMock = vi.fn()
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stopGeneration: stopGenerationMock,
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      act(() => {
        result.current.senderProps.onStop?.()
      })

      expect(stopGenerationMock).toHaveBeenCalled()
    })

    it('provides stopGeneration method directly', () => {
      const stopGenerationMock = vi.fn()
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stopGeneration: stopGenerationMock,
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      act(() => {
        result.current.stopGeneration()
      })

      expect(stopGenerationMock).toHaveBeenCalled()
    })
  })

  // ============================================================================
  // Props Structure Tests
  // ============================================================================

  describe('props structure', () => {
    it('returns all required bridge props', () => {
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

    it('creates single conversation', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            { id: 'msg-1', role: 'user', content: 'Hello' },
            { id: 'msg-2', role: 'assistant', content: 'Hi' },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 50, outputTokens: 30 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.conversationsProps.items).toHaveLength(1)
      expect(result.current.conversationsProps.items[0].key).toBe('main')
      expect(result.current.conversationsProps.items[0].messages).toHaveLength(2)
    })
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('edge cases', () => {
    it('handles empty content blocks array', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-1',
              role: 'assistant',
              content: [],
              usage: { input_tokens: 0, output_tokens: 0 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 0 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))

      expect(result.current.conversationsProps.items[0].messages[0].content).toBe('')
    })

    it('handles mixed content block types', () => {
      const options: AnthropicBridgeOptions = {
        anthropic: {
          messages: [
            {
              id: 'msg-1',
              role: 'assistant',
              content: [
                { type: 'tool_use', id: 'tool-1', name: 'search', input: {} },
                { type: 'text', text: 'Found it' },
                { type: 'tool_result', id: 'tool-result-1' },
                { type: 'text', text: '!' },
              ],
              usage: { input_tokens: 0, output_tokens: 100 },
            },
          ],
          isLoading: false,
          sendMessage: vi.fn(),
          stopGeneration: vi.fn(),
          usage: { inputTokens: 0, outputTokens: 100 },
        },
      }

      const { result } = renderHook(() => useAnthropicBridge(options))
      const content = result.current.conversationsProps.items[0].messages[0].content

      // Should only include text blocks
      expect(content).toBe('Found it!')
    })
  })
})

// ============================================================================
// Generic Bridge Tests
// ============================================================================

describe('useGenericBridge', () => {
  // ============================================================================
  // Message Mapping Tests
  // ============================================================================

  describe('message mapping', () => {
    it('applies custom message mapper', () => {
      const customMessages = [
        { sender: 'user', body: 'Hello', timestamp: '2024-01-01' },
        { sender: 'bot', body: 'Hi there', timestamp: '2024-01-01' },
      ]

      const options: GenericBridgeOptions<typeof customMessages[0]> = {
        state: {
          messages: customMessages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg, index) => ({
          id: `msg-${index}`,
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.body,
          createdAt: new Date(msg.timestamp),
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(2)
      expect(result.current.conversationsProps.items[0].messages[0]).toEqual(
        expect.objectContaining({
          id: 'msg-0',
          role: 'user',
          content: 'Hello',
        })
      )
    })

    it('supports generic message type', () => {
      const customMessages = [{ text: 'Test', id: 'custom-id' }]

      const options: GenericBridgeOptions = {
        state: {
          messages: customMessages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: msg.id,
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages[0].id).toBe('custom-id')
    })
  })

  // ============================================================================
  // Callback Tests
  // ============================================================================

  describe('callback handlers', () => {
    it('forwards sendMessage from external state', async () => {
      const sendMessageMock = vi.fn().mockResolvedValue(undefined)
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: sendMessageMock,
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      await act(async () => {
        await result.current.senderProps.onSend('Custom message')
      })

      expect(sendMessageMock).toHaveBeenCalledWith('Custom message')
    })

    it('forwards stop callback when provided', () => {
      const stopMock = vi.fn()
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
          stop: stopMock,
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      act(() => {
        result.current.senderProps.onStop?.()
      })

      expect(stopMock).toHaveBeenCalled()
    })

    it('omits stop callback when not provided', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.onStop).toBeUndefined()
    })
  })

  // ============================================================================
  // Customization Tests
  // ============================================================================

  describe('customization options', () => {
    it('uses custom placeholder text', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
        placeholder: 'Ask me anything...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Ask me anything...')
    })

    it('uses custom thinking label', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
        thinkingLabel: 'Processing...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Processing...')
      expect(result.current.thinkingPillProps.label).toBe('Processing...')
    })

    it('shows custom placeholder when loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
        placeholder: 'Default',
        thinkingLabel: 'Computing...',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Computing...')
    })

    it('shows default placeholder when not loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
        placeholder: 'Custom placeholder',
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.senderProps.placeholder).toBe('Custom placeholder')
    })
  })

  // ============================================================================
  // Props Structure Tests
  // ============================================================================

  describe('props structure', () => {
    it('returns base bridge props', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
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

    it('maps progress based on loading state', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: true,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.streamProgressProps.progress).toBe(50)
      expect(result.current.streamProgressProps.status).toBe('streaming')
    })

    it('maps to idle when not loading', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.streamProgressProps.progress).toBe(100)
      expect(result.current.streamProgressProps.status).toBe('idle')
    })
  })

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('edge cases', () => {
    it('handles empty messages', () => {
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toEqual([])
    })

    it('handles error state', () => {
      const error = new Error('Custom error')
      const options: GenericBridgeOptions = {
        state: {
          messages: [],
          isLoading: false,
          error,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any) => ({
          id: '1',
          role: 'user',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.streamProgressProps.status).toBe('error')
      expect(result.current.error).toBe(error)
    })

    it('handles mapper that returns all optional fields', () => {
      const customMessages = [{ id: 'id-1', sender: 'user', body: 'Test' }]

      const options: GenericBridgeOptions<typeof customMessages[0]> = {
        state: {
          messages: customMessages,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg) => ({
          id: msg.id,
          role: 'user',
          content: msg.body,
          createdAt: new Date(),
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))
      const message = result.current.conversationsProps.items[0].messages[0]

      expect(message).toHaveProperty('createdAt')
      expect(message.createdAt instanceof Date).toBe(true)
    })

    it('handles large number of messages', () => {
      const largeMessageArray = Array.from({ length: 1000 }, (_, i) => ({
        text: `Message ${i}`,
      }))

      const options: GenericBridgeOptions = {
        state: {
          messages: largeMessageArray,
          isLoading: false,
          sendMessage: vi.fn(),
        },
        mapMessage: (msg: any, index) => ({
          id: `msg-${index}`,
          role: index % 2 === 0 ? 'user' : 'assistant',
          content: msg.text,
        }),
      }

      const { result } = renderHook(() => useGenericBridge(options))

      expect(result.current.conversationsProps.items[0].messages).toHaveLength(1000)
    })
  })

  // ============================================================================
  // Memoization Tests
  // ============================================================================

  describe('memoization', () => {
    it('memoizes mapped messages', () => {
      const messages = [{ text: 'Hello' }]
      const mapMessage = vi.fn((msg: any, i) => ({
        id: `${i}`,
        role: 'user',
        content: msg.text,
      }))

      const options: GenericBridgeOptions = {
        state: { messages, isLoading: false, sendMessage: vi.fn() },
        mapMessage,
      }

      const { result, rerender } = renderHook(
        (opts: GenericBridgeOptions) => useGenericBridge(opts),
        { initialProps: options }
      )

      const firstMessages = result.current.conversationsProps.items[0].messages

      // Rerender with same messages
      rerender(options)

      // Mapper should have been called, but messages should be same reference
      const secondMessages = result.current.conversationsProps.items[0].messages
      expect(firstMessages).toEqual(secondMessages)
    })
  })
})
