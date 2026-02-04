import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createBaseClarityChatAdapter,
  withClarityChatEvents,
  createAdapterRegistry,
  collectStreamText,
  isTextDelta,
  isToolCallDelta,
  isToolCallComplete,
  isFinishChunk,
  isErrorChunk,
  type ClarityChatAdapter,
  type ClarityChatAdapterWithEvents,
  type ClarityChatMessage,
  type ClarityChatStreamChunk,
  type ClarityChatStreamStatus,
  type TypedStreamChunk,
} from '../types'

// ============================================================================
// createBaseClarityChatAdapter Tests
// ============================================================================

describe('createBaseClarityChatAdapter', () => {
  it('should create adapter with provided name', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    expect(adapter.name).toBe('test-adapter')
  })

  it('should have all required methods', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    expect(typeof adapter.sendMessage).toBe('function')
    expect(typeof adapter.streamMessage).toBe('function')
    expect(typeof adapter.stopGeneration).toBe('function')
    expect(typeof adapter.mapMessages).toBe('function')
    expect(typeof adapter.mapStreamStatus).toBe('function')
  })

  it('should have disabled capabilities by default', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    expect(adapter.capabilities).toEqual({
      streaming: false,
      tools: false,
      thinking: false,
      attachments: false,
      regeneration: false,
      history: false,
      multiModel: false,
      toolApproval: false,
    })
  })

  it('should throw on sendMessage if not implemented', async () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    await expect(adapter.sendMessage('test')).rejects.toThrow('test-adapter: sendMessage not implemented')
  })

  it('should throw on streamMessage if not implemented', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    expect(() => adapter.streamMessage('test')).toThrow('test-adapter: streamMessage not implemented')
  })

  it('should have no-op stopGeneration', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    expect(() => adapter.stopGeneration()).not.toThrow()
  })

  it('should return empty messages from mapMessages', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    const result = adapter.mapMessages([])

    expect(result).toEqual([])
  })

  it('should return idle status from mapStreamStatus', () => {
    const adapter = createBaseClarityChatAdapter('test-adapter')

    const status = adapter.mapStreamStatus({})

    expect(status).toEqual({
      isStreaming: false,
      phase: 'idle',
      progress: 0,
      tokensUsed: 0,
      startedAt: null,
      estimatedCompletion: null,
    })
  })

  it('should create multiple independent adapters', () => {
    const adapter1 = createBaseClarityChatAdapter('adapter-1')
    const adapter2 = createBaseClarityChatAdapter('adapter-2')

    expect(adapter1.name).toBe('adapter-1')
    expect(adapter2.name).toBe('adapter-2')
    expect(adapter1).not.toBe(adapter2)
  })

  it('should preserve capabilities immutability', () => {
    const adapter = createBaseClarityChatAdapter('test')
    const caps1 = adapter.capabilities
    const caps2 = adapter.capabilities

    expect(caps1).toEqual(caps2)
  })
})

// ============================================================================
// withClarityChatEvents Tests
// ============================================================================

describe('withClarityChatEvents', () => {
  it('should wrap adapter with event methods', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)

    expect(typeof adapter.on).toBe('function')
    expect(typeof adapter.emit).toBe('function')
  })

  it('should preserve original adapter properties', () => {
    const baseAdapter = createBaseClarityChatAdapter('test-adapter')
    const adapter = withClarityChatEvents(baseAdapter)

    expect(adapter.name).toBe('test-adapter')
    expect(adapter.capabilities).toEqual(baseAdapter.capabilities)
  })

  it('should handle event subscriptions', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler = vi.fn()

    adapter.on('message:sent', handler)
    adapter.emit('message:sent', { content: 'test' })

    expect(handler).toHaveBeenCalledOnce()
  })

  it('should pass event with correct structure', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler = vi.fn()

    adapter.on('message:sent', handler)
    adapter.emit('message:sent', { content: 'test' })

    const call = handler.mock.calls[0][0]
    expect(call.type).toBe('message:sent')
    expect(call.payload).toEqual({ content: 'test' })
    expect(call.timestamp).toBeInstanceOf(Date)
  })

  it('should handle multiple subscribers', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    adapter.on('message:sent', handler1)
    adapter.on('message:sent', handler2)
    adapter.emit('message:sent')

    expect(handler1).toHaveBeenCalledOnce()
    expect(handler2).toHaveBeenCalledOnce()
  })

  it('should handle multiple event types', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    adapter.on('message:sent', handler1)
    adapter.on('message:received', handler2)

    adapter.emit('message:sent')
    adapter.emit('message:received')

    expect(handler1).toHaveBeenCalledOnce()
    expect(handler2).toHaveBeenCalledOnce()
  })

  it('should support unsubscription', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler = vi.fn()

    const unsubscribe = adapter.on('message:sent', handler)
    unsubscribe()
    adapter.emit('message:sent')

    expect(handler).not.toHaveBeenCalled()
  })

  it('should handle unsubscribe from specific event only', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const unsub1 = adapter.on('message:sent', handler1)
    adapter.on('message:sent', handler2)

    unsub1()
    adapter.emit('message:sent')

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledOnce()
  })

  it('should emit events without payload', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler = vi.fn()

    adapter.on('stream:complete', handler)
    adapter.emit('stream:complete')

    const call = handler.mock.calls[0][0]
    expect(call.type).toBe('stream:complete')
    expect(call.payload).toBeUndefined()
  })

  it('should support all event types', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler = vi.fn()

    const eventTypes = [
      'message:sent',
      'message:received',
      'message:error',
      'stream:start',
      'stream:chunk',
      'stream:complete',
      'stream:error',
      'tool:started',
      'tool:completed',
      'tool:error',
      'tool:approval:requested',
      'tool:approved',
      'tool:rejected',
      'thinking:started',
      'thinking:step',
      'thinking:completed',
    ] as const

    for (const eventType of eventTypes) {
      adapter.on(eventType, handler)
      adapter.emit(eventType)
    }

    expect(handler).toHaveBeenCalledTimes(eventTypes.length)
  })

  it('should preserve adapter method functionality through wrapper', async () => {
    const mockSendMessage = vi.fn().mockResolvedValue({
      id: 'msg-1',
      role: 'assistant',
      content: 'Test',
      createdAt: new Date(),
    })

    const baseAdapter: ClarityChatAdapter = {
      name: 'test',
      sendMessage: mockSendMessage,
      streamMessage: vi.fn(),
      stopGeneration: vi.fn(),
      mapMessages: vi.fn(),
      mapStreamStatus: vi.fn(),
      capabilities: {
        streaming: false,
        tools: false,
        thinking: false,
        attachments: false,
        regeneration: false,
        history: false,
        multiModel: false,
        toolApproval: false,
      },
    }

    const adapter = withClarityChatEvents(baseAdapter)
    await adapter.sendMessage('test')

    expect(mockSendMessage).toHaveBeenCalledWith('test')
  })

  it('should handle rapid fire emissions', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler = vi.fn()

    adapter.on('stream:chunk', handler)

    for (let i = 0; i < 100; i++) {
      adapter.emit('stream:chunk', { chunk: i })
    }

    expect(handler).toHaveBeenCalledTimes(100)
  })

  it('should handle handler that throws', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)

    const errorHandler = vi.fn().mockImplementation(() => {
      throw new Error('Handler error')
    })

    adapter.on('message:sent', errorHandler)

    expect(() => adapter.emit('message:sent')).toThrow()
  })

  it('should assign correct timestamps to events', async () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const timestamps: Date[] = []

    adapter.on('message:sent', (event) => {
      timestamps.push(event.timestamp)
    })

    adapter.emit('message:sent')
    await new Promise(r => setTimeout(r, 10))
    adapter.emit('message:sent')

    expect(timestamps[0]).toBeInstanceOf(Date)
    expect(timestamps[1]).toBeInstanceOf(Date)
    expect(timestamps[1].getTime()).toBeGreaterThanOrEqual(timestamps[0].getTime())
  })
})

// ============================================================================
// Type Guard Tests
// ============================================================================

describe('Type Guards', () => {
  describe('isTextDelta', () => {
    it('should identify text delta chunks', () => {
      const chunk: TypedStreamChunk = { type: 'text-delta', text: 'hello' }

      expect(isTextDelta(chunk)).toBe(true)
    })

    it('should reject non-text chunks', () => {
      const chunk: TypedStreamChunk = { type: 'finish', finishReason: 'stop' }

      expect(isTextDelta(chunk)).toBe(false)
    })
  })

  describe('isToolCallDelta', () => {
    it('should identify tool call delta chunks', () => {
      const chunk: TypedStreamChunk = {
        type: 'tool-call-delta',
        toolCallId: '1',
        toolName: 'test',
        argsText: '{}',
      }

      expect(isToolCallDelta(chunk)).toBe(true)
    })

    it('should reject non-tool chunks', () => {
      const chunk: TypedStreamChunk = { type: 'text-delta', text: 'hello' }

      expect(isToolCallDelta(chunk)).toBe(false)
    })
  })

  describe('isToolCallComplete', () => {
    it('should identify tool call complete chunks', () => {
      const chunk: TypedStreamChunk = {
        type: 'tool-call-complete',
        toolCallId: '1',
        toolName: 'test',
        args: {},
      }

      expect(isToolCallComplete(chunk)).toBe(true)
    })

    it('should reject non-complete tool chunks', () => {
      const chunk: TypedStreamChunk = {
        type: 'tool-call-delta',
        toolCallId: '1',
        toolName: 'test',
        argsText: '{}',
      }

      expect(isToolCallComplete(chunk)).toBe(false)
    })
  })

  describe('isFinishChunk', () => {
    it('should identify finish chunks', () => {
      const chunk: TypedStreamChunk = { type: 'finish', finishReason: 'stop' }

      expect(isFinishChunk(chunk)).toBe(true)
    })

    it('should reject non-finish chunks', () => {
      const chunk: TypedStreamChunk = { type: 'text-delta', text: 'hello' }

      expect(isFinishChunk(chunk)).toBe(false)
    })
  })

  describe('isErrorChunk', () => {
    it('should identify error chunks', () => {
      const chunk: TypedStreamChunk = { type: 'error', error: new Error('test') }

      expect(isErrorChunk(chunk)).toBe(true)
    })

    it('should reject non-error chunks', () => {
      const chunk: TypedStreamChunk = { type: 'finish', finishReason: 'stop' }

      expect(isErrorChunk(chunk)).toBe(false)
    })
  })
})

// ============================================================================
// Adapter Registry Tests
// ============================================================================

describe('createAdapterRegistry', () => {
  it('should create empty registry', () => {
    const registry = createAdapterRegistry()

    expect(registry.providers()).toEqual([])
  })

  it('should register adapter', () => {
    const registry = createAdapterRegistry()
    const adapter = createBaseClarityChatAdapter('test')

    registry.register('test-provider', adapter as any)

    expect(registry.has('test-provider')).toBe(true)
  })

  it('should retrieve registered adapter', () => {
    const registry = createAdapterRegistry()
    const adapter = createBaseClarityChatAdapter('test')

    registry.register('test-provider', adapter as any)
    const retrieved = registry.get('test-provider')

    expect(retrieved).toBe(adapter)
  })

  it('should return undefined for unregistered provider', () => {
    const registry = createAdapterRegistry()

    expect(registry.get('unknown-provider')).toBeUndefined()
  })

  it('should list all registered providers', () => {
    const registry = createAdapterRegistry()
    const adapter1 = createBaseClarityChatAdapter('adapter-1')
    const adapter2 = createBaseClarityChatAdapter('adapter-2')

    registry.register('provider-1', adapter1 as any)
    registry.register('provider-2', adapter2 as any)

    expect(registry.providers()).toEqual(['provider-1', 'provider-2'])
  })

  it('should check provider existence', () => {
    const registry = createAdapterRegistry()
    const adapter = createBaseClarityChatAdapter('test')

    registry.register('test-provider', adapter as any)

    expect(registry.has('test-provider')).toBe(true)
    expect(registry.has('unknown-provider')).toBe(false)
  })

  it('should support multiple registries independently', () => {
    const registry1 = createAdapterRegistry()
    const registry2 = createAdapterRegistry()
    const adapter = createBaseClarityChatAdapter('test')

    registry1.register('provider', adapter as any)

    expect(registry1.has('provider')).toBe(true)
    expect(registry2.has('provider')).toBe(false)
  })

  it('should overwrite existing provider', () => {
    const registry = createAdapterRegistry()
    const adapter1 = createBaseClarityChatAdapter('adapter-1')
    const adapter2 = createBaseClarityChatAdapter('adapter-2')

    registry.register('provider', adapter1 as any)
    expect(registry.get('provider')).toBe(adapter1)

    registry.register('provider', adapter2 as any)
    expect(registry.get('provider')).toBe(adapter2)
  })
})

// ============================================================================
// collectStreamText Tests
// ============================================================================

describe('collectStreamText', () => {
  it('should collect text from stream', async () => {
    const chunks: TypedStreamChunk[] = [
      { type: 'text-delta', text: 'Hello' },
      { type: 'text-delta', text: ' ' },
      { type: 'text-delta', text: 'world' },
    ]

    async function* generateStream() {
      for (const chunk of chunks) {
        yield chunk
      }
    }

    const text = await collectStreamText(generateStream())

    expect(text).toBe('Hello world')
  })

  it('should ignore non-text chunks', async () => {
    const chunks: TypedStreamChunk[] = [
      { type: 'text-delta', text: 'Hello' },
      {
        type: 'tool-call-complete',
        toolCallId: '1',
        toolName: 'test',
        args: {},
      },
      { type: 'text-delta', text: ' world' },
    ]

    async function* generateStream() {
      for (const chunk of chunks) {
        yield chunk
      }
    }

    const text = await collectStreamText(generateStream())

    expect(text).toBe('Hello world')
  })

  it('should handle empty stream', async () => {
    async function* generateStream() {
      // Empty
    }

    const text = await collectStreamText(generateStream())

    expect(text).toBe('')
  })

  it('should handle stream with only non-text chunks', async () => {
    const chunks: TypedStreamChunk[] = [
      { type: 'finish', finishReason: 'stop' },
      { type: 'error', error: new Error('test') },
    ]

    async function* generateStream() {
      for (const chunk of chunks) {
        yield chunk
      }
    }

    const text = await collectStreamText(generateStream())

    expect(text).toBe('')
  })

  it('should accumulate text in order', async () => {
    const chunks: TypedStreamChunk[] = [
      { type: 'text-delta', text: '1' },
      { type: 'text-delta', text: '2' },
      { type: 'text-delta', text: '3' },
    ]

    async function* generateStream() {
      for (const chunk of chunks) {
        yield chunk
      }
    }

    const text = await collectStreamText(generateStream())

    expect(text).toBe('123')
  })
})

// ============================================================================
// Type Compatibility Tests
// ============================================================================

describe('Type Compatibility', () => {
  it('should accept ClarityChatMessage with required fields', () => {
    const message: ClarityChatMessage = {
      id: 'msg-1',
      role: 'user',
      content: 'Hello',
      createdAt: new Date(),
    }

    expect(message.id).toBe('msg-1')
  })

  it('should accept ClarityChatMessage with optional fields', () => {
    const message: ClarityChatMessage = {
      id: 'msg-1',
      role: 'assistant',
      content: 'Response',
      createdAt: new Date(),
      attachments: [
        {
          id: 'att-1',
          type: 'image',
          name: 'image.png',
          url: 'https://example.com/image.png',
        },
      ],
      thinkingSteps: [
        {
          id: 'think-1',
          content: 'Thinking...',
          status: 'active',
        },
      ],
      isStreaming: true,
    }

    expect(message.attachments).toHaveLength(1)
    expect(message.thinkingSteps).toHaveLength(1)
  })

  it('should accept ClarityChatStreamStatus', () => {
    const status: ClarityChatStreamStatus = {
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 100,
      startedAt: new Date(),
      estimatedCompletion: new Date(),
    }

    expect(status.phase).toBe('receiving')
  })

  it('should accept ClarityChatStreamChunk with token type', () => {
    const chunk: ClarityChatStreamChunk = {
      type: 'token',
      content: 'Hello',
    }

    expect(chunk.type).toBe('token')
  })

  it('should accept ClarityChatStreamChunk with tool_call type', () => {
    const chunk: ClarityChatStreamChunk = {
      type: 'tool_call',
      toolCall: {
        id: 'tool-1',
        type: 'function',
        function: {
          name: 'test',
          arguments: '{}',
        },
      },
    }

    expect(chunk.type).toBe('tool_call')
  })

  it('should accept ClarityChatStreamChunk with thinking type', () => {
    const chunk: ClarityChatStreamChunk = {
      type: 'thinking',
      thinking: {
        id: 'think-1',
        content: 'Thinking...',
        status: 'active',
      },
    }

    expect(chunk.type).toBe('thinking')
  })

  it('should accept ClarityChatStreamChunk with done type', () => {
    const chunk: ClarityChatStreamChunk = {
      type: 'done',
    }

    expect(chunk.type).toBe('done')
  })

  it('should support streaming message flow', async () => {
    const adapter = createBaseClarityChatAdapter('test')
    const baseAdapter = withClarityChatEvents(adapter)

    const messages: ClarityChatMessage[] = []
    const statuses: ClarityChatStreamStatus[] = []

    baseAdapter.on('message:received', (event) => {
      if (event.payload) {
        messages.push(event.payload as ClarityChatMessage)
      }
    })

    baseAdapter.on('stream:chunk', (event) => {
      if (event.payload) {
        statuses.push(event.payload as ClarityChatStreamStatus)
      }
    })

    const message: ClarityChatMessage = {
      id: 'msg-1',
      role: 'assistant',
      content: 'Response',
      createdAt: new Date(),
    }

    const status: ClarityChatStreamStatus = {
      isStreaming: false,
      phase: 'complete',
      progress: 100,
      tokensUsed: 50,
      startedAt: new Date(),
      estimatedCompletion: null,
    }

    baseAdapter.emit('message:received', message)
    baseAdapter.emit('stream:chunk', status)

    expect(messages).toHaveLength(1)
    expect(statuses).toHaveLength(1)
  })
})

// ============================================================================
// Error Scenarios
// ============================================================================

describe('Error Scenarios', () => {
  it('should handle base adapter method errors gracefully', async () => {
    const baseAdapter = createBaseClarityChatAdapter('test')

    await expect(baseAdapter.sendMessage('test')).rejects.toThrow()
  })

  it('should handle event handler errors in wrapper', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)

    adapter.on('message:sent', () => {
      throw new Error('Handler error')
    })

    expect(() => adapter.emit('message:sent')).toThrow('Handler error')
  })

  it('should handle multiple handlers with one failing', () => {
    const baseAdapter = createBaseClarityChatAdapter('test')
    const adapter = withClarityChatEvents(baseAdapter)
    const handler1 = vi.fn()
    const handler2 = vi.fn().mockImplementation(() => {
      throw new Error('Handler 2 error')
    })
    const handler3 = vi.fn()

    adapter.on('message:sent', handler1)
    adapter.on('message:sent', handler2)
    adapter.on('message:sent', handler3)

    expect(() => adapter.emit('message:sent')).toThrow('Handler 2 error')
  })

  it('should handle registry get on empty registry', () => {
    const registry = createAdapterRegistry()

    expect(registry.get('any-provider')).toBeUndefined()
    expect(registry.has('any-provider')).toBe(false)
  })
})
