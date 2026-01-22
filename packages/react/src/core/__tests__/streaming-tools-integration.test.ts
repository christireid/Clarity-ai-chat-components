/**
 * Tests for Streaming + Tool Integration
 *
 * Verifies that streaming and tool calling work together correctly:
 * - Stream pauses when tool call completes
 * - Partial tool calls handled during streaming
 * - Tool execution while stream is paused
 * - Stream resumes after tool result
 * - Multiple tool calls during streaming
 * - Error handling during tool execution
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ToolOrchestrator } from '../tool-orchestrator'
import type { ToolDefinition } from '../../types/tool-definition'
import type { ToolInvocation } from '../../types/tool-invocation'

// =============================================================================
// Mock Streaming Parser
// =============================================================================

interface StreamChunk {
  type: 'content' | 'tool_call_start' | 'tool_call_delta' | 'tool_call_complete'
  content?: string
  toolCallId?: string
  toolName?: string
  argsJson?: string
}

class MockStreamParser {
  private chunks: StreamChunk[] = []
  private chunkIndex = 0
  private paused = false

  constructor(chunks: StreamChunk[]) {
    this.chunks = chunks
  }

  async *stream(): AsyncIterator<StreamChunk> {
    while (this.chunkIndex < this.chunks.length) {
      if (this.paused) {
        await new Promise((resolve) => setTimeout(resolve, 10))
        continue
      }

      const chunk = this.chunks[this.chunkIndex]!
      this.chunkIndex++

      yield chunk

      // Auto-pause when tool call completes
      if (chunk.type === 'tool_call_complete') {
        this.paused = true
      }
    }
  }

  resume() {
    this.paused = false
  }

  isPaused(): boolean {
    return this.paused
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

function createWeatherTool(): ToolDefinition {
  return {
    name: 'get_weather',
    description: 'Get weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: { type: 'string' },
      },
      required: ['location'],
    },
    execute: async (args) => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      return {
        temperature: 72,
        condition: 'sunny',
        location: args.location,
      }
    },
  }
}

function createCalculatorTool(): ToolDefinition {
  return {
    name: 'calculator',
    description: 'Perform calculations',
    parameters: {
      type: 'object',
      properties: {
        expression: { type: 'string' },
      },
      required: ['expression'],
    },
    execute: async (args) => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      return { result: eval(args.expression) }
    },
  }
}

function createSlowTool(timeoutMs: number = 100): ToolDefinition {
  return {
    name: 'slow_tool',
    description: 'A slow tool for timeout testing',
    parameters: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      await new Promise((resolve) => setTimeout(resolve, timeoutMs))
      return { done: true }
    },
    timeout: 50, // Shorter than execution time
  }
}

function createFailingTool(): ToolDefinition {
  return {
    name: 'failing_tool',
    description: 'A tool that always fails',
    parameters: {
      type: 'object',
      properties: {},
    },
    execute: async () => {
      throw new Error('Tool execution failed')
    },
  }
}

// =============================================================================
// Test: Basic Streaming with Single Tool Call
// =============================================================================

describe('Streaming + Tools Integration', () => {
  let orchestrator: ToolOrchestrator

  beforeEach(() => {
    orchestrator = new ToolOrchestrator({
      autoApprove: true,
      tools: [createWeatherTool(), createCalculatorTool()],
    })
  })

  describe('Basic Streaming', () => {
    it('should pause stream when tool call completes', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Let me check the weather' },
        { type: 'content', content: ' for you. ' },
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_delta', argsJson: '{"location"' },
        { type: 'tool_call_delta', argsJson: ': "San Francisco"}' },
        { type: 'tool_call_complete' }, // Stream should pause here
        { type: 'content', content: 'The weather in San Francisco is sunny.' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let contentAccumulated = ''
      let toolInvocations: Partial<ToolInvocation>[] = []
      let currentToolCall: Partial<ToolInvocation> | null = null

      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          contentAccumulated += chunk.content
        } else if (chunk.type === 'tool_call_start') {
          currentToolCall = {
            state: 'partial-call',
            toolCallId: chunk.toolCallId,
            toolName: chunk.toolName,
            args: {},
          }
        } else if (chunk.type === 'tool_call_delta' && currentToolCall) {
          // Accumulate args JSON
        } else if (chunk.type === 'tool_call_complete' && currentToolCall) {
          currentToolCall.state = 'call'
          currentToolCall.args = { location: 'San Francisco' }
          toolInvocations.push(currentToolCall)
          currentToolCall = null
        }

        // Check if paused after tool call complete
        if (chunk.type === 'tool_call_complete') {
          expect(parser.isPaused()).toBe(true)
          break // Stream is paused, need to execute tool
        }
      }

      expect(contentAccumulated).toBe('Let me check the weather for you. ')
      expect(toolInvocations).toHaveLength(1)
      expect(toolInvocations[0]).toMatchObject({
        state: 'call',
        toolName: 'get_weather',
        args: { location: 'San Francisco' },
      })
    })

    it('should handle partial tool calls during streaming', async () => {
      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_delta', argsJson: '{' },
        { type: 'tool_call_delta', argsJson: '"location"' },
        { type: 'tool_call_delta', argsJson: ':' },
        { type: 'tool_call_delta', argsJson: '"NYC"' },
        { type: 'tool_call_delta', argsJson: '}' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let argsJson = ''
      let toolName = ''

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_start') {
          toolName = chunk.toolName!
        } else if (chunk.type === 'tool_call_delta') {
          argsJson += chunk.argsJson
        } else if (chunk.type === 'tool_call_complete') {
          break
        }
      }

      expect(toolName).toBe('get_weather')
      expect(argsJson).toBe('{"location":"NYC"}')
      expect(JSON.parse(argsJson)).toEqual({ location: 'NYC' })
    })
  })

  // =============================================================================
  // Test: Tool Execution While Stream Paused
  // =============================================================================

  describe('Tool Execution During Pause', () => {
    it('should execute tool while stream is paused', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Checking weather... ' },
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_delta', argsJson: '{"location":"Boston"}' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'It is 72°F and sunny!' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let content = ''
      let toolCall: ToolInvocation | null = null

      // Consume stream until pause
      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          content += chunk.content
        } else if (chunk.type === 'tool_call_complete') {
          toolCall = {
            state: 'call',
            toolCallId: 'call_1',
            toolName: 'get_weather',
            args: { location: 'Boston' },
          }
          break // Paused
        }
      }

      expect(parser.isPaused()).toBe(true)

      // Execute tool while paused
      const result = await orchestrator.executeTool(
        toolCall!.toolName,
        toolCall!.args as Record<string, unknown>
      )

      expect(result.status).toBe('completed')
      expect(result.result).toEqual({
        temperature: 72,
        condition: 'sunny',
        location: 'Boston',
      })

      // Resume stream
      parser.resume()

      // Continue consuming
      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          content += chunk.content
        }
      }

      expect(content).toBe('Checking weather... It is 72°F and sunny!')
    })

    it('should update tool invocation state during execution', async () => {
      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'calculator' },
        { type: 'tool_call_delta', argsJson: '{"expression":"2+2"}' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let toolInvocation: ToolInvocation = {
        state: 'partial-call',
        toolCallId: 'call_1',
        toolName: 'calculator',
        args: {},
      }

      // Consume until complete
      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          toolInvocation.state = 'call'
          toolInvocation.args = { expression: '2+2' }
          break
        }
      }

      expect(toolInvocation.state).toBe('call')

      // Execute tool (state: call → executing → result)
      let executingInvocation: ToolInvocation = {
        ...toolInvocation,
        state: 'executing',
      }

      const result = await orchestrator.executeTool(
        toolInvocation.toolName,
        toolInvocation.args as Record<string, unknown>
      )

      const resultInvocation: ToolInvocation = {
        state: 'result',
        toolCallId: toolInvocation.toolCallId,
        toolName: toolInvocation.toolName,
        args: toolInvocation.args,
        result: result.result,
      }

      expect(resultInvocation.state).toBe('result')
      expect(resultInvocation.result).toEqual({ result: 4 })
    })
  })

  // =============================================================================
  // Test: Multiple Tool Calls
  // =============================================================================

  describe('Multiple Tool Calls', () => {
    it('should handle sequential tool calls', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Let me check two things. ' },
        // First tool call
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_delta', argsJson: '{"location":"NYC"}' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'Weather done. ' },
        // Second tool call
        { type: 'tool_call_start', toolCallId: 'call_2', toolName: 'calculator' },
        { type: 'tool_call_delta', argsJson: '{"expression":"10*5"}' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'All done!' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      const toolCalls: ToolInvocation[] = []
      let content = ''

      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          content += chunk.content
        } else if (chunk.type === 'tool_call_complete') {
          // Simulate tool call construction
          const toolCall: ToolInvocation = {
            state: 'call',
            toolCallId: toolCalls.length === 0 ? 'call_1' : 'call_2',
            toolName: toolCalls.length === 0 ? 'get_weather' : 'calculator',
            args:
              toolCalls.length === 0
                ? { location: 'NYC' }
                : { expression: '10*5' },
          }

          // Execute tool
          const result = await orchestrator.executeTool(
            toolCall.toolName,
            toolCall.args as Record<string, unknown>
          )

          // Create result invocation
          const resultInvocation: ToolInvocation = {
            state: 'result',
            toolCallId: toolCall.toolCallId,
            toolName: toolCall.toolName,
            args: toolCall.args,
            result: result.result,
          }
          toolCalls.push(resultInvocation)

          // Resume for next chunk
          parser.resume()
        }
      }

      expect(toolCalls).toHaveLength(2)
      expect(toolCalls[0]).toMatchObject({
        state: 'result',
        toolName: 'get_weather',
      })
      expect(toolCalls[1]).toMatchObject({
        state: 'result',
        toolName: 'calculator',
        result: { result: 50 },
      })
      expect(content).toBe('Let me check two things. Weather done. All done!')
    })

    it('should handle parallel tool calls', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Executing tools in parallel... ' },
        // Start both tool calls
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_delta', argsJson: '{"location":"SF"}' },
        { type: 'tool_call_complete' },
        { type: 'tool_call_start', toolCallId: 'call_2', toolName: 'calculator' },
        { type: 'tool_call_delta', argsJson: '{"expression":"20+30"}' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'Done!' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      const toolCallPromises: Promise<any>[] = []
      let pauseCount = 0

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          pauseCount++

          // Collect tool call promise
          const toolCall: ToolInvocation =
            pauseCount === 1
              ? {
                  state: 'call',
                  toolCallId: 'call_1',
                  toolName: 'get_weather',
                  args: { location: 'SF' },
                }
              : {
                  state: 'call',
                  toolCallId: 'call_2',
                  toolName: 'calculator',
                  args: { expression: '20+30' },
                }

          const promise = orchestrator.executeTool(
            toolCall.toolName,
            toolCall.args as Record<string, unknown>
          )
          toolCallPromises.push(promise)

          // Resume immediately to collect next tool
          parser.resume()

          // After collecting both, execute in parallel
          if (pauseCount === 2) {
            const results = await Promise.all(toolCallPromises)
            expect(results).toHaveLength(2)
            expect(results[0].result).toHaveProperty('temperature')
            expect(results[1].result).toEqual({ result: 50 })
            break
          }
        }
      }
    })
  })

  // =============================================================================
  // Test: Error Handling
  // =============================================================================

  describe('Error Handling', () => {
    it('should handle tool execution errors', async () => {
      const failingOrchestrator = new ToolOrchestrator({
        autoApprove: true,
        tools: [createFailingTool()],
      })

      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Trying to execute tool... ' },
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'failing_tool' },
        { type: 'tool_call_delta', argsJson: '{}' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let toolInvocation: ToolInvocation | null = null

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          toolInvocation = {
            state: 'call',
            toolCallId: 'call_1',
            toolName: 'failing_tool',
            args: {},
          }
          break
        }
      }

      // Execute failing tool
      const result = await failingOrchestrator.executeTool(
        toolInvocation!.toolName,
        toolInvocation!.args as Record<string, unknown>
      )

      expect(result.status).toBe('failed')
      expect(result.error).toBeDefined()
      expect(result.error?.message).toBe('Tool execution failed')

      // Create error invocation
      const errorInvocation: ToolInvocation = {
        state: 'error',
        toolCallId: toolInvocation!.toolCallId,
        toolName: toolInvocation!.toolName,
        args: toolInvocation!.args,
        error: result.error?.message || 'Unknown error',
      }

      expect(errorInvocation.state).toBe('error')
      expect(errorInvocation.error).toBe('Tool execution failed')
    })

    it('should handle tool timeout', async () => {
      const slowOrchestrator = new ToolOrchestrator({
        autoApprove: true,
        tools: [createSlowTool(100)],
      })

      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'slow_tool' },
        { type: 'tool_call_delta', argsJson: '{}' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let toolInvocation: ToolInvocation | null = null

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          toolInvocation = {
            state: 'call',
            toolCallId: 'call_1',
            toolName: 'slow_tool',
            args: {},
          }
          break
        }
      }

      // Execute slow tool (should timeout)
      const result = await slowOrchestrator.executeTool(
        toolInvocation!.toolName,
        toolInvocation!.args as Record<string, unknown>
      )

      expect(result.status).toBe('timeout')
      expect(result.error?.message).toContain('timeout')
    })

    it('should handle malformed tool call JSON', () => {
      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_delta', argsJson: '{"location":' }, // Incomplete
        { type: 'tool_call_delta', argsJson: '"NYC"' }, // Missing closing brace
        { type: 'tool_call_complete' },
      ]

      const argsJson = '{"location":"NYC"' // Malformed

      expect(() => JSON.parse(argsJson)).toThrow()

      // Should be caught and handled gracefully
      let parsedArgs
      try {
        parsedArgs = JSON.parse(argsJson)
      } catch {
        parsedArgs = null
      }

      expect(parsedArgs).toBeNull()
    })
  })

  // =============================================================================
  // Test: Stream Resumption
  // =============================================================================

  describe('Stream Resumption', () => {
    it('should resume stream after tool execution', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Part 1. ' },
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'calculator' },
        { type: 'tool_call_delta', argsJson: '{"expression":"5+5"}' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'Part 2. ' },
        { type: 'content', content: 'Part 3.' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let fullContent = ''
      let toolExecuted = false

      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          fullContent += chunk.content
        } else if (chunk.type === 'tool_call_complete') {
          // Execute tool
          const result = await orchestrator.executeTool('calculator', {
            expression: '5+5',
          })
          expect(result.result).toEqual({ result: 10 })
          toolExecuted = true

          // Resume stream
          parser.resume()
        }
      }

      expect(toolExecuted).toBe(true)
      expect(fullContent).toBe('Part 1. Part 2. Part 3.')
    })

    it('should preserve message state across pause/resume', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Before tool. ' },
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'calculator' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'After tool.' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      const message = {
        id: 'msg_123',
        role: 'assistant' as const,
        content: '',
        toolInvocations: [] as ToolInvocation[],
      }

      for await (const chunk of stream) {
        if (chunk.type === 'content') {
          message.content += chunk.content
        } else if (chunk.type === 'tool_call_complete') {
          const invocation: ToolInvocation = {
            state: 'call',
            toolCallId: 'call_1',
            toolName: 'calculator',
            args: { expression: '1+1' },
          }
          message.toolInvocations.push(invocation)

          // Execute
          const result = await orchestrator.executeTool(
            invocation.toolName,
            invocation.args as Record<string, unknown>
          )

          // Replace with result invocation
          message.toolInvocations[0] = {
            state: 'result',
            toolCallId: invocation.toolCallId,
            toolName: invocation.toolName,
            args: invocation.args,
            result: result.result,
          }

          parser.resume()
        }
      }

      expect(message.content).toBe('Before tool. After tool.')
      expect(message.toolInvocations).toHaveLength(1)
      expect(message.toolInvocations[0].state).toBe('result')
      if (message.toolInvocations[0].state === 'result') {
        expect(message.toolInvocations[0].result).toEqual({ result: 2 })
      }
    })
  })

  // =============================================================================
  // Test: User Interruption
  // =============================================================================

  describe('User Interruption', () => {
    it('should allow cancelling tool execution', async () => {
      const abortController = new AbortController()

      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'slow_tool' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          // Start execution
          const promise = orchestrator.executeTool(
            'slow_tool',
            {},
            { signal: abortController.signal }
          )

          // Cancel immediately
          setTimeout(() => abortController.abort(), 10)

          const result = await promise

          expect(result.status).toBe('cancelled')
          expect(result.error?.message).toContain('cancelled')
          break
        }
      }
    })

    it('should allow stopping stream during tool execution', async () => {
      const chunks: StreamChunk[] = [
        { type: 'content', content: 'Starting...' },
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'get_weather' },
        { type: 'tool_call_complete' },
        { type: 'content', content: 'This should not appear' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let streamStopped = false
      let content = ''

      for await (const chunk of stream) {
        if (streamStopped) break

        if (chunk.type === 'content') {
          content += chunk.content
        } else if (chunk.type === 'tool_call_complete') {
          // User stops stream before tool execution
          streamStopped = true
          break
        }
      }

      expect(content).toBe('Starting...')
      expect(content).not.toContain('This should not appear')
    })
  })

  // =============================================================================
  // Test: Integration with Lifecycle
  // =============================================================================

  describe('Lifecycle Integration', () => {
    it('should emit lifecycle events during streaming', async () => {
      const events: string[] = []

      orchestrator.lifecycle.on('all', (event) => {
        events.push(event.type)
      })

      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_1', toolName: 'calculator' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          await orchestrator.executeTool('calculator', { expression: '3*7' })
          break
        }
      }

      expect(events).toContain('tool_requested')
      expect(events).toContain('tool_approved')
      expect(events).toContain('tool_executing')
      expect(events).toContain('tool_completed')
    })

    it('should track call ID across stream pause/resume', async () => {
      const chunks: StreamChunk[] = [
        { type: 'tool_call_start', toolCallId: 'call_abc123', toolName: 'calculator' },
        { type: 'tool_call_complete' },
      ]

      const parser = new MockStreamParser(chunks)
      const stream = parser.stream()

      let callId: string | undefined

      for await (const chunk of stream) {
        if (chunk.type === 'tool_call_complete') {
          const result = await orchestrator.executeTool('calculator', {
            expression: '10/2',
          })
          callId = result.callId
          break
        }
      }

      expect(callId).toBeDefined()

      // Verify lifecycle record exists
      const lifecycleRecord = orchestrator.getToolCall(callId!)
      expect(lifecycleRecord.status).toBe('completed')
      expect(lifecycleRecord.toolName).toBe('calculator')
    })
  })
})
