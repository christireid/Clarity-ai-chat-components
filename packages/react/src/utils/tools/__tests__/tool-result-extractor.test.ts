import { describe, it, expect } from 'vitest'
import type { Message } from '@clarity-chat/types'
import {
  extractToolResults,
  extractToolResultsByName,
  getLatestToolResult,
} from '../tool-result-extractor'

// Helper to create mock messages
function createMessage(
  id: string,
  content: string,
  metadata?: Record<string, any>
): Message {
  return {
    id,
    role: 'assistant',
    content,
    metadata: metadata || {},
  } as Message
}

describe('Tool Result Extractor', () => {
  describe('extractToolResults', () => {
    it('should extract tool results from toolInvocations metadata', () => {
      const messages = [
        createMessage('msg1', 'Using tools...', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              args: { id: '1' },
              result: { todo: 'Task 1' },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(1)
      expect(results[0].toolCall.id).toBe('call_123')
      expect(results[0].toolCall.function.name).toBe('getTodo')
      expect(results[0].result).toEqual({ todo: 'Task 1' })
    })

    it('should extract multiple tool results from single message', () => {
      const messages = [
        createMessage('msg1', 'Using tools...', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              args: { id: '1' },
              result: { todo: 'Task 1' },
            },
            {
              toolCallId: 'call_456',
              toolName: 'createTodo',
              state: 'result',
              args: { title: 'New task' },
              result: { success: true },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(2)
      expect(results[0].toolCall.function.name).toBe('getTodo')
      expect(results[1].toolCall.function.name).toBe('createTodo')
    })

    it('should skip tool invocations without results', () => {
      const messages = [
        createMessage('msg1', 'Using tools...', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'call', // Not 'result'
              args: { id: '1' },
            },
            {
              toolCallId: 'call_456',
              toolName: 'createTodo',
              state: 'result',
              args: { title: 'New task' },
              result: { success: true },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(1)
      expect(results[0].toolCall.function.name).toBe('createTodo')
    })

    it('should extract tool results from direct metadata format', () => {
      const messages = [
        createMessage(
          'msg1',
          JSON.stringify({ success: true }),
          {
            toolCallId: 'call_123',
            name: 'getTodo',
            args: { id: '1' },
            result: { todo: 'Task 1' },
          }
        ),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(1)
      expect(results[0].toolCall.id).toBe('call_123')
      expect(results[0].toolCall.function.name).toBe('getTodo')
      expect(results[0].result).toEqual({ todo: 'Task 1' })
    })

    it('should parse content as result if metadata.result is missing', () => {
      const messages = [
        createMessage(
          'msg1',
          JSON.stringify({ success: true, data: 'test' }),
          {
            toolCallId: 'call_123',
            name: 'getTodo',
            args: { id: '1' },
          }
        ),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(1)
      expect(results[0].result).toEqual({ success: true, data: 'test' })
    })

    it('should use content as-is if not valid JSON', () => {
      const messages = [
        createMessage(
          'msg1',
          'Plain text result',
          {
            toolCallId: 'call_123',
            name: 'getTodo',
            args: { id: '1' },
          }
        ),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(1)
      expect(results[0].result).toBe('Plain text result')
    })

    it('should skip messages with invalid toolCallId type', () => {
      const messages = [
        createMessage(
          'msg1',
          'content',
          {
            toolCallId: 123, // Not a string
            name: 'getTodo',
          }
        ),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(0)
    })

    it('should skip messages with invalid name type', () => {
      const messages = [
        createMessage(
          'msg1',
          'content',
          {
            toolCallId: 'call_123',
            name: 123, // Not a string
          }
        ),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(0)
    })

    it('should handle messages without toolInvocations', () => {
      const messages = [
        createMessage('msg1', 'Regular message'),
        createMessage('msg2', 'Another message'),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(0)
    })

    it('should handle empty messages array', () => {
      const results = extractToolResults([])

      expect(results).toHaveLength(0)
    })

    it('should handle non-array toolInvocations', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: { not: 'an array' },
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(0)
    })

    it('should handle missing toolCallId in invocation', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              // Missing toolCallId
              toolName: 'getTodo',
              state: 'result',
              result: { data: 'test' },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(0)
    })

    it('should use "unknown" as default tool name', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              // Missing toolName
              state: 'result',
              result: { data: 'test' },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(1)
      expect(results[0].toolCall.function.name).toBe('unknown')
    })

    it('should extract from multiple messages', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
          ],
        }),
        createMessage('msg2', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_456',
              toolName: 'createTodo',
              state: 'result',
              result: { success: true },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(2)
      expect(results[0].toolCall.function.name).toBe('getTodo')
      expect(results[1].toolCall.function.name).toBe('createTodo')
    })

    it('should handle both formats in same message array', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
          ],
        }),
        createMessage(
          'msg2',
          JSON.stringify({ success: true }),
          {
            toolCallId: 'call_456',
            name: 'createTodo',
            args: { title: 'New' },
            result: { id: '2' },
          }
        ),
      ]

      const results = extractToolResults(messages)

      expect(results).toHaveLength(2)
    })

    it('should serialize args as JSON string', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              args: { id: '1', status: 'active' },
              result: { todo: 'Task 1' },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results[0].toolCall.function.arguments).toBe(
        JSON.stringify({ id: '1', status: 'active' })
      )
    })

    it('should handle missing args', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              // Missing args
              result: { todo: 'Task 1' },
            },
          ],
        }),
      ]

      const results = extractToolResults(messages)

      expect(results[0].toolCall.function.arguments).toBe(JSON.stringify({}))
    })
  })

  describe('extractToolResultsByName', () => {
    it('should filter results by tool name', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
            {
              toolCallId: 'call_456',
              toolName: 'createTodo',
              state: 'result',
              result: { success: true },
            },
            {
              toolCallId: 'call_789',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 2' },
            },
          ],
        }),
      ]

      const results = extractToolResultsByName(messages, 'getTodo')

      expect(results).toHaveLength(2)
      expect(results[0].toolCall.function.name).toBe('getTodo')
      expect(results[1].toolCall.function.name).toBe('getTodo')
    })

    it('should return empty array if tool not found', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
          ],
        }),
      ]

      const results = extractToolResultsByName(messages, 'nonexistent')

      expect(results).toHaveLength(0)
    })

    it('should handle empty messages', () => {
      const results = extractToolResultsByName([], 'getTodo')

      expect(results).toHaveLength(0)
    })
  })

  describe('getLatestToolResult', () => {
    it('should return latest result for tool', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
            {
              toolCallId: 'call_456',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 2' },
            },
          ],
        }),
      ]

      const latest = getLatestToolResult(messages, 'getTodo')

      expect(latest).not.toBeNull()
      expect(latest!.toolCall.id).toBe('call_456')
      expect(latest!.result).toEqual({ todo: 'Task 2' })
    })

    it('should return null if tool not found', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
          ],
        }),
      ]

      const latest = getLatestToolResult(messages, 'nonexistent')

      expect(latest).toBeNull()
    })

    it('should return null for empty messages', () => {
      const latest = getLatestToolResult([], 'getTodo')

      expect(latest).toBeNull()
    })

    it('should return only result for single call', () => {
      const messages = [
        createMessage('msg1', 'content', {
          toolInvocations: [
            {
              toolCallId: 'call_123',
              toolName: 'getTodo',
              state: 'result',
              result: { todo: 'Task 1' },
            },
          ],
        }),
      ]

      const latest = getLatestToolResult(messages, 'getTodo')

      expect(latest).not.toBeNull()
      expect(latest!.toolCall.id).toBe('call_123')
    })
  })
})
