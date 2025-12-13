import { describe, it, expect } from 'vitest'
import {
  parseStreamingChunk,
  extractContentFromChunk,
  StreamingAccumulator,
  hasToolInvocation,
  extractToolInvocation,
  parseSSEDataLine,
} from '../streaming-parser'

describe('Streaming Parser Utils', () => {
  describe('parseStreamingChunk', () => {
    it('parses valid JSON string', () => {
      const input = '{"choices": [{"delta": {"content": "hello"}}]}'
      const result = parseStreamingChunk(input)
      expect(result).toEqual({ choices: [{ delta: { content: 'hello' } }] })
    })

    it('returns text object for non-JSON string', () => {
      const input = 'plain text'
      const result = parseStreamingChunk(input)
      expect(result).toEqual({ content: 'plain text', text: 'plain text', delta: 'plain text' })
    })
  })

  describe('extractContentFromChunk', () => {
    it('extracts content from OpenAI chat delta', () => {
      const chunk = { choices: [{ delta: { content: 'hello' } }] }
      expect(extractContentFromChunk(chunk)).toBe('hello')
    })

    it('extracts content from OpenAI completion text', () => {
      const chunk = { choices: [{ text: 'hello' }] }
      expect(extractContentFromChunk(chunk)).toBe('hello')
    })

    it('extracts content from Vercel AI SDK content field', () => {
      const chunk = { content: 'hello' }
      expect(extractContentFromChunk(chunk)).toBe('hello')
    })

    it('returns empty string for empty delta', () => {
      const chunk = { choices: [{ delta: {} }] }
      expect(extractContentFromChunk(chunk)).toBe('')
    })
  })

  describe('parseSSEDataLine', () => {
    it('extracts data from valid SSE line', () => {
      const line = 'data: {"foo":"bar"}'
      expect(parseSSEDataLine(line)).toEqual({ data: '{"foo":"bar"}' })
    })

    it('handles [DONE] signal', () => {
      const line = 'data: [DONE]'
      expect(parseSSEDataLine(line)).toEqual({ data: '[DONE]' })
    })

    it('returns null for invalid prefix', () => {
      const line = 'event: message'
      expect(parseSSEDataLine(line)).toBeNull()
    })
  })
})

describe('StreamingAccumulator', () => {
  it('accumulates text content', () => {
    const accumulator = new StreamingAccumulator()
    accumulator.addChunk({ choices: [{ delta: { content: 'Hello' } }] })
    accumulator.addChunk({ choices: [{ delta: { content: ' World' } }] })
    expect(accumulator.getContent()).toBe('Hello World')
  })

  it('accumulates OpenAI tool calls', () => {
    const accumulator = new StreamingAccumulator()
    
    // Chunk 1: Function name
    accumulator.addChunk({
      choices: [{
        delta: {
          tool_calls: [{
            index: 0,
            id: 'call_123',
            type: 'function',
            function: { name: 'get_weather', arguments: '' }
          }]
        }
      }]
    })

    // Chunk 2: Partial args
    accumulator.addChunk({
      choices: [{
        delta: {
          tool_calls: [{
            index: 0,
            function: { arguments: '{"location":' }
          }]
        }
      }]
    })

    // Chunk 3: Rest of args
    accumulator.addChunk({
      choices: [{
        delta: {
          tool_calls: [{
            index: 0,
            function: { arguments: '"Paris"}' }
          }]
        }
      }]
    })

    const tools = accumulator.getToolInvocations()
    expect(tools).toHaveLength(1)
    expect(tools[0]).toEqual({
      toolCallId: 'call_123',
      toolName: 'get_weather',
      args: { location: 'Paris' },
      state: 'call'
    })
  })

  it('handles partial JSON args gracefully', () => {
    const accumulator = new StreamingAccumulator()
    
    accumulator.addChunk({
      choices: [{
        delta: {
          tool_calls: [{
            index: 0,
            id: 'call_123',
            function: { name: 'test', arguments: '{"incomplete":' }
          }]
        }
      }]
    })

    const tools = accumulator.getToolInvocations()
    expect(tools).toHaveLength(1)
    expect(tools[0].state).toBe('partial-call')
  })

  it('accumulates direct tool invocations (Vercel SDK style)', () => {
    const accumulator = new StreamingAccumulator()
    
    const toolInvocation = {
      toolCallId: 'call_456',
      toolName: 'calculator',
      args: { expression: '2+2' },
      state: 'call' as const
    }

    accumulator.addChunk({ toolInvocation })
    
    const tools = accumulator.getToolInvocations()
    expect(tools).toHaveLength(1)
    expect(tools[0]).toEqual(toolInvocation)
  })

  it('resets state correctly', () => {
    const accumulator = new StreamingAccumulator()
    accumulator.addChunk({ content: 'test' })
    expect(accumulator.getContent()).toBe('test')
    
    accumulator.reset()
    expect(accumulator.getContent()).toBe('')
    expect(accumulator.getToolInvocations()).toHaveLength(0)
  })
})
