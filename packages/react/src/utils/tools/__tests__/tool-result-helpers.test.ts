import { describe, it, expect } from 'vitest'
import type { ExtractedToolResult } from '../../../hooks/chat/use-clarity-chat-with-tools'
import type { ToolCall } from '../../../adapters/types'
import {
  groupToolResultsByToolName,
  groupToolResultsByMessage,
  getLatestToolResult,
  getToolResultsForTool,
  hasToolBeenCalled,
  getUniqueToolNames,
  countToolCallsByTool,
  filterToolResultsByMessage,
  hasToolError,
  getToolError,
  parseToolArguments,
  formatToolCall,
  getToolResultSummary,
} from '../tool-result-helpers'

// Helper to create mock tool results
function createMockToolResult(
  toolName: string,
  messageId: string,
  index: number,
  result?: any
): ExtractedToolResult {
  return {
    toolCall: {
      id: `call_${toolName}_${index}`,
      type: 'function',
      function: {
        name: toolName,
        arguments: JSON.stringify({ param: 'value' }),
      },
    },
    result: result || { success: true },
    messageId,
    index,
  }
}

describe('Tool Result Helpers', () => {
  describe('groupToolResultsByToolName', () => {
    it('should group results by tool name', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
        createMockToolResult('createTodo', 'msg3', 2),
      ]

      const grouped = groupToolResultsByToolName(results)

      expect(grouped.size).toBe(2)
      expect(grouped.get('getTodo')).toHaveLength(2)
      expect(grouped.get('createTodo')).toHaveLength(1)
    })

    it('should handle empty array', () => {
      const grouped = groupToolResultsByToolName([])
      expect(grouped.size).toBe(0)
    })

    it('should preserve order within groups', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
      ]

      const grouped = groupToolResultsByToolName(results)
      const getTodos = grouped.get('getTodo')!

      expect(getTodos[0].index).toBe(0)
      expect(getTodos[1].index).toBe(1)
    })
  })

  describe('groupToolResultsByMessage', () => {
    it('should group results by message ID', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('createTodo', 'msg1', 1),
        createMockToolResult('getTodo', 'msg2', 2),
      ]

      const grouped = groupToolResultsByMessage(results)

      expect(grouped.size).toBe(2)
      expect(grouped.get('msg1')).toHaveLength(2)
      expect(grouped.get('msg2')).toHaveLength(1)
    })

    it('should handle empty array', () => {
      const grouped = groupToolResultsByMessage([])
      expect(grouped.size).toBe(0)
    })
  })

  describe('getLatestToolResult', () => {
    it('should return latest result by index', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
        createMockToolResult('getTodo', 'msg3', 2),
      ]

      const latest = getLatestToolResult(results, 'getTodo')

      expect(latest).toBeDefined()
      expect(latest!.index).toBe(2)
      expect(latest!.messageId).toBe('msg3')
    })

    it('should return undefined if tool not found', () => {
      const results = [createMockToolResult('getTodo', 'msg1', 0)]

      const latest = getLatestToolResult(results, 'nonexistent')

      expect(latest).toBeUndefined()
    })

    it('should handle empty array', () => {
      const latest = getLatestToolResult([], 'getTodo')
      expect(latest).toBeUndefined()
    })

    it('should return only result for tool with one call', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('createTodo', 'msg2', 1),
      ]

      const latest = getLatestToolResult(results, 'createTodo')

      expect(latest).toBeDefined()
      expect(latest!.toolCall.function.name).toBe('createTodo')
    })
  })

  describe('getToolResultsForTool', () => {
    it('should return all results for a tool', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
        createMockToolResult('createTodo', 'msg3', 2),
      ]

      const getTodos = getToolResultsForTool(results, 'getTodo')

      expect(getTodos).toHaveLength(2)
      expect(getTodos[0].toolCall.function.name).toBe('getTodo')
      expect(getTodos[1].toolCall.function.name).toBe('getTodo')
    })

    it('should return empty array if tool not found', () => {
      const results = [createMockToolResult('getTodo', 'msg1', 0)]

      const filtered = getToolResultsForTool(results, 'nonexistent')

      expect(filtered).toEqual([])
    })
  })

  describe('hasToolBeenCalled', () => {
    it('should return true if tool was called', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('createTodo', 'msg2', 1),
      ]

      expect(hasToolBeenCalled(results, 'getTodo')).toBe(true)
      expect(hasToolBeenCalled(results, 'createTodo')).toBe(true)
    })

    it('should return false if tool was not called', () => {
      const results = [createMockToolResult('getTodo', 'msg1', 0)]

      expect(hasToolBeenCalled(results, 'nonexistent')).toBe(false)
    })

    it('should handle empty array', () => {
      expect(hasToolBeenCalled([], 'getTodo')).toBe(false)
    })
  })

  describe('getUniqueToolNames', () => {
    it('should return unique tool names', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
        createMockToolResult('createTodo', 'msg3', 2),
        createMockToolResult('deleteTodo', 'msg4', 3),
      ]

      const names = getUniqueToolNames(results)

      expect(names).toHaveLength(3)
      expect(names).toContain('getTodo')
      expect(names).toContain('createTodo')
      expect(names).toContain('deleteTodo')
    })

    it('should handle empty array', () => {
      const names = getUniqueToolNames([])
      expect(names).toEqual([])
    })

    it('should handle single tool called multiple times', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
      ]

      const names = getUniqueToolNames(results)

      expect(names).toEqual(['getTodo'])
    })
  })

  describe('countToolCallsByTool', () => {
    it('should count calls per tool', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('getTodo', 'msg2', 1),
        createMockToolResult('getTodo', 'msg3', 2),
        createMockToolResult('createTodo', 'msg4', 3),
      ]

      const counts = countToolCallsByTool(results)

      expect(counts.get('getTodo')).toBe(3)
      expect(counts.get('createTodo')).toBe(1)
    })

    it('should handle empty array', () => {
      const counts = countToolCallsByTool([])
      expect(counts.size).toBe(0)
    })
  })

  describe('filterToolResultsByMessage', () => {
    it('should filter by message ID', () => {
      const results = [
        createMockToolResult('getTodo', 'msg1', 0),
        createMockToolResult('createTodo', 'msg1', 1),
        createMockToolResult('getTodo', 'msg2', 2),
      ]

      const filtered = filterToolResultsByMessage(results, 'msg1')

      expect(filtered).toHaveLength(2)
      expect(filtered[0].messageId).toBe('msg1')
      expect(filtered[1].messageId).toBe('msg1')
    })

    it('should return empty array if message not found', () => {
      const results = [createMockToolResult('getTodo', 'msg1', 0)]

      const filtered = filterToolResultsByMessage(results, 'nonexistent')

      expect(filtered).toEqual([])
    })
  })

  describe('hasToolError', () => {
    it('should return true if result has error', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        error: 'Something went wrong',
      })

      expect(hasToolError(result)).toBe(true)
    })

    it('should return false if result has no error', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        success: true,
      })

      expect(hasToolError(result)).toBe(false)
    })

    it('should return false if error is null', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        error: null,
      })

      expect(hasToolError(result)).toBe(false)
    })

    it('should return false if error is undefined', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        error: undefined,
      })

      expect(hasToolError(result)).toBe(false)
    })

    it('should return false if result is not an object', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, 'success')

      expect(hasToolError(result)).toBe(false)
    })
  })

  describe('getToolError', () => {
    it('should extract string error', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        error: 'Something went wrong',
      })

      expect(getToolError(result)).toBe('Something went wrong')
    })

    it('should convert non-string error to string', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        error: { message: 'Error object' },
      })

      expect(getToolError(result)).toContain('message')
    })

    it('should return null if no error', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        success: true,
      })

      expect(getToolError(result)).toBeNull()
    })
  })

  describe('parseToolArguments', () => {
    it('should parse valid JSON arguments', () => {
      const toolCall: ToolCall = {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'getTodo',
          arguments: JSON.stringify({ id: '123', status: 'active' }),
        },
      }

      const args = parseToolArguments(toolCall)

      expect(args).toEqual({ id: '123', status: 'active' })
    })

    it('should return empty object for invalid JSON', () => {
      const toolCall: ToolCall = {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'getTodo',
          arguments: 'invalid json',
        },
      }

      const args = parseToolArguments(toolCall)

      expect(args).toEqual({})
    })

    it('should handle empty string', () => {
      const toolCall: ToolCall = {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'getTodo',
          arguments: '',
        },
      }

      const args = parseToolArguments(toolCall)

      expect(args).toEqual({})
    })
  })

  describe('formatToolCall', () => {
    it('should format tool call with arguments', () => {
      const toolCall: ToolCall = {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'getTodo',
          arguments: JSON.stringify({ id: '123', status: 'active' }),
        },
      }

      const formatted = formatToolCall(toolCall)

      expect(formatted).toBe('getTodo(id="123", status="active")')
    })

    it('should handle tool with no arguments', () => {
      const toolCall: ToolCall = {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'listTodos',
          arguments: '{}',
        },
      }

      const formatted = formatToolCall(toolCall)

      expect(formatted).toBe('listTodos()')
    })

    it('should handle invalid JSON arguments', () => {
      const toolCall: ToolCall = {
        id: 'call_123',
        type: 'function',
        function: {
          name: 'getTodo',
          arguments: 'invalid',
        },
      }

      const formatted = formatToolCall(toolCall)

      expect(formatted).toBe('getTodo()')
    })
  })

  describe('getToolResultSummary', () => {
    it('should return error summary if result has error', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        error: 'Todo not found',
      })

      const summary = getToolResultSummary(result)

      expect(summary).toBe('getTodo failed: Todo not found')
    })

    it('should extract summary field if present', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        summary: 'Found 5 todos',
      })

      const summary = getToolResultSummary(result)

      expect(summary).toBe('Found 5 todos')
    })

    it('should extract result field if present', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        result: 'Todo retrieved successfully',
      })

      const summary = getToolResultSummary(result)

      expect(summary).toBe('Todo retrieved successfully')
    })

    it('should extract output field if present', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        output: 'Operation completed',
      })

      const summary = getToolResultSummary(result)

      expect(summary).toBe('Operation completed')
    })

    it('should return generic success message if no fields', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        data: { id: '123' },
      })

      const summary = getToolResultSummary(result)

      expect(summary).toBe('getTodo completed successfully')
    })

    it('should handle non-object result', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, 'success')

      const summary = getToolResultSummary(result)

      expect(summary).toBe('getTodo completed successfully')
    })

    it('should prefer summary over result over output', () => {
      const result = createMockToolResult('getTodo', 'msg1', 0, {
        summary: 'Summary text',
        result: 'Result text',
        output: 'Output text',
      })

      const summary = getToolResultSummary(result)

      expect(summary).toBe('Summary text')
    })
  })
})
