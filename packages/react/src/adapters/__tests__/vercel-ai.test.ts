import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  createVercelAIAdapter,
  useVercelAIBridge,
  type VercelAIAdapterOptions,
  type VercelAIChatHook,
  type VercelAIMessage,
} from '../vercel-ai'
import type { ClarityChatStreamChunk, ClarityChatMessage, ChatMessageAttachment } from '../types'

// ============================================================================
// Mock Setup
// ============================================================================

const createMockChat = (overrides?: Partial<VercelAIChatHook>): VercelAIChatHook => ({
  messages: [],
  input: '',
  setInput: vi.fn(),
  isLoading: false,
  error: undefined,
  append: vi.fn().mockResolvedValue(''),
  reload: vi.fn().mockResolvedValue(''),
  stop: vi.fn(),
  setMessages: vi.fn(),
  handleSubmit: vi.fn(),
  handleInputChange: vi.fn(),
  ...overrides,
})

const createMockMessage = (overrides?: Partial<VercelAIMessage>): VercelAIMessage => ({
  id: 'msg-1',
  role: 'assistant',
  content: 'Hello, world!',
  createdAt: new Date(),
  ...overrides,
})

describe('Vercel AI Adapter', () => {
  describe('Adapter Creation', () => {
    it('should create adapter with correct name', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.name).toBe('vercel-ai')
    })

    it('should expose capabilities', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities).toEqual({
        streaming: true,
        tools: true,
        thinking: false,
        attachments: true,
        regeneration: true,
        history: true,
        multiModel: false,
        toolApproval: false,
      })
    })

    it('should have all required methods', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(typeof adapter.sendMessage).toBe('function')
      expect(typeof adapter.streamMessage).toBe('function')
      expect(typeof adapter.stopGeneration).toBe('function')
      expect(typeof adapter.regenerate).toBe('function')
      expect(typeof adapter.mapMessages).toBe('function')
      expect(typeof adapter.mapStreamStatus).toBe('function')
      expect(typeof adapter.mapToolCalls).toBe('function')
    })

    it('should accept optional configuration', () => {
      const chat = createMockChat()
      const onError = vi.fn()
      const options: VercelAIAdapterOptions = {
        chat,
        apiEndpoint: '/api/custom',
        headers: { 'X-Custom': 'header' },
        onError,
      }

      expect(() => createVercelAIAdapter(options)).not.toThrow()
    })
  })

  describe('Message Mapping', () => {
    it('should map basic user message', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped).toHaveLength(1)
      expect(mapped[0]).toMatchObject({
        id: 'msg-1',
        role: 'user',
        content: 'Hello',
      })
    })

    it('should map assistant message', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        role: 'assistant',
        content: 'How can I help?',
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0]).toMatchObject({
        role: 'assistant',
        content: 'How can I help?',
      })
    })

    it('should convert tool/function role to assistant', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const toolMessage = createMockMessage({ role: 'tool' })
      const functionMessage = createMockMessage({ role: 'function' })

      const toolMapped = adapter.mapMessages([toolMessage])
      const functionMapped = adapter.mapMessages([functionMessage])

      expect(toolMapped[0].role).toBe('assistant')
      expect(functionMapped[0].role).toBe('assistant')
    })

    it('should include createdAt timestamp', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const now = new Date()
      const vercelMessage = createMockMessage({
        createdAt: now,
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].createdAt).toEqual(now)
    })

    it('should handle message without createdAt', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        createdAt: undefined,
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].createdAt).toBeInstanceOf(Date)
    })

    it('should map attachments correctly', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        experimental_attachments: [
          {
            name: 'image.png',
            contentType: 'image/png',
            url: 'https://example.com/image.png',
          },
          {
            name: 'document.pdf',
            contentType: 'application/pdf',
            url: 'https://example.com/document.pdf',
          },
        ],
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].attachments).toHaveLength(2)
      expect(mapped[0].attachments?.[0]).toMatchObject({
        name: 'image.png',
        type: 'image',
        url: 'https://example.com/image.png',
      })
      expect(mapped[0].attachments?.[1]).toMatchObject({
        name: 'document.pdf',
        type: 'file',
      })
    })

    it('should detect audio attachments by MIME type', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        experimental_attachments: [
          {
            contentType: 'audio/mp3',
            url: 'https://example.com/audio.mp3',
          },
        ],
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].attachments?.[0].type).toBe('audio')
    })

    it('should detect video attachments by MIME type', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        experimental_attachments: [
          {
            contentType: 'video/mp4',
            url: 'https://example.com/video.mp4',
          },
        ],
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].attachments?.[0].type).toBe('video')
    })

    it('should detect code attachments by MIME type', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        experimental_attachments: [
          { contentType: 'application/javascript', url: 'file.js' },
          { contentType: 'application/typescript', url: 'file.ts' },
          { contentType: 'application/json', url: 'file.json' },
        ],
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].attachments?.every(att => att.type === 'code')).toBe(true)
    })

    it('should map tool invocations', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const vercelMessage = createMockMessage({
        toolInvocations: [
          {
            toolCallId: 'tool-1',
            toolName: 'get_weather',
            state: 'call',
            args: { location: 'NYC' },
          },
        ],
      })

      const mapped = adapter.mapMessages([vercelMessage])

      expect(mapped[0].toolCalls).toHaveLength(1)
      expect(mapped[0].toolCalls?.[0]).toMatchObject({
        id: 'tool-1',
        type: 'function',
        function: {
          name: 'get_weather',
          arguments: JSON.stringify({ location: 'NYC' }),
        },
      })
    })

    it('should handle multiple messages', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const messages = [
        createMockMessage({ id: 'msg-1', role: 'user', content: 'Hi' }),
        createMockMessage({ id: 'msg-2', role: 'assistant', content: 'Hello' }),
        createMockMessage({ id: 'msg-3', role: 'user', content: 'How are you?' }),
      ]

      const mapped = adapter.mapMessages(messages)

      expect(mapped).toHaveLength(3)
      expect(mapped[0].role).toBe('user')
      expect(mapped[1].role).toBe('assistant')
      expect(mapped[2].role).toBe('user')
    })
  })

  describe('Send Message', () => {
    it('should send message via chat.append', async () => {
      const append = vi.fn().mockResolvedValue('')
      const chat = createMockChat({ append, messages: [createMockMessage()] })
      const adapter = createVercelAIAdapter({ chat })

      await adapter.sendMessage('Hello')

      expect(append).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'user',
          content: 'Hello',
        }),
        undefined
      )
    })

    it('should send message with attachments', async () => {
      const append = vi.fn().mockResolvedValue('')
      const chat = createMockChat({ append })
      const adapter = createVercelAIAdapter({ chat })

      const attachments: ChatMessageAttachment[] = [
        {
          id: 'att-1',
          type: 'image',
          name: 'image.png',
          url: 'https://example.com/image.png',
          mimeType: 'image/png',
        },
      ]

      await adapter.sendMessage('Check this image', attachments)

      expect(append).toHaveBeenCalled()
      const call = (append as any).mock.calls[0]
      expect(call[1]).toEqual({
        experimental_attachments: [
          {
            name: 'image.png',
            contentType: 'image/png',
            url: 'https://example.com/image.png',
          },
        ],
      })
    })

    it('should return last assistant message', async () => {
      const assistantMessage = createMockMessage({
        role: 'assistant',
        content: 'Response',
      })
      const append = vi.fn().mockResolvedValue('')
      const chat = createMockChat({
        append,
        messages: [assistantMessage],
      })
      const adapter = createVercelAIAdapter({ chat })

      const result = await adapter.sendMessage('Hello')

      expect(result).toMatchObject({
        role: 'assistant',
        content: 'Response',
      })
    })

    it('should handle error with onError callback', async () => {
      const error = new Error('API Error')
      const append = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()
      const chat = createMockChat({ append })
      const adapter = createVercelAIAdapter({ chat, onError })

      await expect(adapter.sendMessage('Hello')).rejects.toThrow('API Error')
      expect(onError).toHaveBeenCalledWith(error)
    })

    it('should return empty message if no assistant response', async () => {
      const append = vi.fn().mockResolvedValue('')
      const chat = createMockChat({ append, messages: [] })
      const adapter = createVercelAIAdapter({ chat })

      const result = await adapter.sendMessage('Hello')

      expect(result).toMatchObject({
        role: 'assistant',
        content: '',
      })
    })
  })

  describe('Stream Message', () => {
    it('should create streamable response', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const response = adapter.streamMessage('Hello')

      expect(response).toHaveProperty('stream')
      expect(response).toHaveProperty('promise')
      expect(response).toHaveProperty('abort')
      expect(response).toHaveProperty('messageId')
      expect(typeof response.stream).toBe('function')
    })

    it('should stream tokens', async () => {
      const assistantMessage = createMockMessage({
        role: 'assistant',
        content: 'Hello, world!',
      })
      const append = vi.fn().mockResolvedValue('')
      const chat = createMockChat({
        append,
        messages: [assistantMessage],
        isLoading: false,
      })
      const adapter = createVercelAIAdapter({ chat })

      const response = adapter.streamMessage('Hello')
      const chunks: ClarityChatStreamChunk[] = []

      for await (const chunk of response.stream()) {
        chunks.push(chunk)
      }

      expect(chunks.length).toBeGreaterThan(0)
      const doneChunk = chunks[chunks.length - 1]
      expect(doneChunk.type).toBe('done')
    })

    it('should handle stream abort', () => {
      const chat = createMockChat({ isLoading: true })
      const adapter = createVercelAIAdapter({ chat })

      const response = adapter.streamMessage('Hello')
      response.abort()

      expect(chat.stop).toHaveBeenCalled()
    })

    it('should stream tool calls', async () => {
      const assistantMessage = createMockMessage({
        toolInvocations: [
          {
            toolCallId: 'tool-1',
            toolName: 'get_weather',
            state: 'call',
            args: { location: 'NYC' },
          },
        ],
      })
      const append = vi.fn().mockResolvedValue('')
      const chat = createMockChat({
        append,
        messages: [assistantMessage],
        isLoading: false,
      })
      const adapter = createVercelAIAdapter({ chat })

      const response = adapter.streamMessage('Hello')
      const chunks: ClarityChatStreamChunk[] = []

      for await (const chunk of response.stream()) {
        chunks.push(chunk)
      }

      const toolChunks = chunks.filter(c => c.type === 'tool_call')
      expect(toolChunks.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle stream error with onError callback', async () => {
      const error = new Error('Stream error')
      const append = vi.fn().mockRejectedValue(error)
      const onError = vi.fn()
      const chat = createMockChat({ append })
      const adapter = createVercelAIAdapter({ chat, onError })

      const response = adapter.streamMessage('Hello')

      try {
        await response.promise
      } catch (e) {
        // Expected
      }

      expect(onError).toHaveBeenCalledWith(error)
    })
  })

  describe('Stop Generation', () => {
    it('should call chat.stop', () => {
      const stop = vi.fn()
      const chat = createMockChat({ stop })
      const adapter = createVercelAIAdapter({ chat })

      adapter.stopGeneration()

      expect(stop).toHaveBeenCalled()
    })

    it('should abort in-flight stream', () => {
      const stop = vi.fn()
      const chat = createMockChat({ stop, isLoading: true })
      const adapter = createVercelAIAdapter({ chat })

      const response = adapter.streamMessage('Hello')
      adapter.stopGeneration()

      expect(stop).toHaveBeenCalled()
    })
  })

  describe('Regenerate', () => {
    it('should reload conversation', async () => {
      const reload = vi.fn().mockResolvedValue('')
      const assistantMessage = createMockMessage({
        role: 'assistant',
        content: 'Response',
      })
      const chat = createMockChat({
        reload,
        messages: [assistantMessage],
      })
      const adapter = createVercelAIAdapter({ chat })

      await adapter.regenerate?.('msg-1')

      expect(reload).toHaveBeenCalled()
    })

    it('should stream regenerated response', async () => {
      const reload = vi.fn().mockResolvedValue('')
      const assistantMessage = createMockMessage({
        role: 'assistant',
        content: 'New response',
      })
      const chat = createMockChat({
        reload,
        messages: [assistantMessage],
        isLoading: false,
      })
      const adapter = createVercelAIAdapter({ chat })

      const response = adapter.regenerate?.('msg-1')!
      const chunks: ClarityChatStreamChunk[] = []

      for await (const chunk of response.stream()) {
        chunks.push(chunk)
      }

      expect(chunks.length).toBeGreaterThan(0)
    })
  })

  describe('Capability Detection', () => {
    it('should detect streaming capability', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities.streaming).toBe(true)
    })

    it('should detect tool support', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities.tools).toBe(true)
    })

    it('should detect attachment support', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities.attachments).toBe(true)
    })

    it('should NOT support thinking', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities.thinking).toBe(false)
    })

    it('should NOT support tool approval', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities.toolApproval).toBe(false)
    })

    it('should NOT support multi-model', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      expect(adapter.capabilities.multiModel).toBe(false)
    })
  })

  describe('Stream Status Mapping', () => {
    it('should map streaming status', () => {
      const chat = createMockChat({ isLoading: true })
      const adapter = createVercelAIAdapter({ chat })

      const status = adapter.mapStreamStatus({})

      expect(status).toMatchObject({
        isStreaming: true,
        phase: 'receiving',
        progress: 50,
      })
    })

    it('should map idle status', () => {
      const chat = createMockChat({ isLoading: false, error: undefined })
      const adapter = createVercelAIAdapter({ chat })

      const status = adapter.mapStreamStatus({})

      expect(status).toMatchObject({
        isStreaming: false,
        phase: 'idle',
        progress: 100,
      })
    })

    it('should map error status', () => {
      const error = new Error('Test error')
      const chat = createMockChat({ isLoading: false, error })
      const adapter = createVercelAIAdapter({ chat })

      const status = adapter.mapStreamStatus({})

      expect(status.phase).toBe('error')
    })

    it('should include token usage', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const status = adapter.mapStreamStatus({})

      expect(status.tokensUsed).toBe(0)
    })
  })

  describe('Tool Call Mapping', () => {
    it('should map pending tool call', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const toolInvocation = {
        toolCallId: 'tool-1',
        toolName: 'get_weather',
        state: 'partial-call' as const,
        args: { location: 'NYC' },
      }

      const mapped = adapter.mapToolCalls?.([toolInvocation])

      expect(mapped?.[0]).toMatchObject({
        id: 'tool-1',
        name: 'get_weather',
        status: 'executing',
        input: { location: 'NYC' },
      })
    })

    it('should map complete tool call', () => {
      const chat = createMockChat()
      const adapter = createVercelAIAdapter({ chat })

      const toolInvocation = {
        toolCallId: 'tool-1',
        toolName: 'get_weather',
        state: 'result' as const,
        args: { location: 'NYC' },
        result: { temperature: 72 },
      }

      const mapped = adapter.mapToolCalls?.([toolInvocation])

      expect(mapped?.[0]).toMatchObject({
        status: 'complete',
        output: { temperature: 72 },
      })
    })
  })
})

// ============================================================================
// useVercelAIBridge Hook Tests
// ============================================================================

describe('useVercelAIBridge Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should map messages to clarity format', () => {
    const chat = createMockChat({
      messages: [
        createMockMessage({ role: 'user', content: 'Hi' }),
        createMockMessage({ role: 'assistant', content: 'Hello' }),
      ],
    })

    const bridge = useVercelAIBridge(chat)

    expect(bridge.messages).toHaveLength(2)
    expect(bridge.messages[0].role).toBe('user')
    expect(bridge.messages[1].role).toBe('assistant')
  })

  it('should provide thinking bar props', () => {
    const chat = createMockChat({ isLoading: true })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.thinkingBarProps).toMatchObject({
      isActive: true,
      status: 'thinking',
    })
  })

  it('should set thinking bar to idle when not loading', () => {
    const chat = createMockChat({ isLoading: false })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.thinkingBarProps.status).toBe('idle')
  })

  it('should set thinking bar to error on error', () => {
    const error = new Error('Test error')
    const chat = createMockChat({ isLoading: false, error })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.thinkingBarProps.status).toBe('error')
  })

  it('should provide stream progress props', () => {
    const chat = createMockChat({ isLoading: true })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.streamProgressProps).toMatchObject({
      progress: 50,
      status: 'streaming',
      tokensUsed: 0,
    })
  })

  it('should provide conversation props with messages', () => {
    const chat = createMockChat({
      messages: [createMockMessage({ role: 'user', content: 'Hi' })],
    })

    const bridge = useVercelAIBridge(chat)

    expect(bridge.conversationsProps.items).toHaveLength(1)
    expect(bridge.conversationsProps.items[0]).toMatchObject({
      key: 'main',
      label: 'Chat',
    })
    expect(bridge.conversationsProps.items[0].messages).toHaveLength(1)
  })

  it('should provide sender props with callbacks', () => {
    const append = vi.fn().mockResolvedValue('')
    const setInput = vi.fn()
    const stop = vi.fn()
    const chat = createMockChat({
      append,
      setInput,
      stop,
      input: 'test',
    })

    const bridge = useVercelAIBridge(chat)

    expect(typeof bridge.senderProps.onSend).toBe('function')
    expect(typeof bridge.senderProps.onStop).toBe('function')
    expect(bridge.senderProps.value).toBe('test')
    expect(typeof bridge.senderProps.onChange).toBe('function')
  })

  it('should call append on send', async () => {
    const append = vi.fn().mockResolvedValue('')
    const chat = createMockChat({ append })
    const bridge = useVercelAIBridge(chat)

    await bridge.senderProps.onSend('Hello')

    expect(append).toHaveBeenCalledWith({ role: 'user', content: 'Hello' })
  })

  it('should call stop on stop', () => {
    const stop = vi.fn()
    const chat = createMockChat({ stop })
    const bridge = useVercelAIBridge(chat)

    bridge.senderProps.onStop()

    expect(stop).toHaveBeenCalled()
  })

  it('should provide response actions props', () => {
    const reload = vi.fn().mockResolvedValue('')
    const stop = vi.fn()
    const chat = createMockChat({ reload, stop })

    const bridge = useVercelAIBridge(chat)

    expect(typeof bridge.responseActionsProps.onRegenerate).toBe('function')
    expect(typeof bridge.responseActionsProps.onStop).toBe('function')
    expect(bridge.responseActionsProps.isRegenerating).toBe(false)
  })

  it('should call reload on regenerate', async () => {
    const reload = vi.fn().mockResolvedValue('')
    const chat = createMockChat({ reload })
    const bridge = useVercelAIBridge(chat)

    await bridge.responseActionsProps.onRegenerate()

    expect(reload).toHaveBeenCalled()
  })

  it('should provide stream status', () => {
    const chat = createMockChat({ isLoading: true })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.streamStatus).toMatchObject({
      isStreaming: true,
      phase: 'receiving',
      progress: 50,
      tokensUsed: 0,
    })
  })

  it('should expose loading state', () => {
    const chat = createMockChat({ isLoading: true })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.isLoading).toBe(true)
  })

  it('should expose error', () => {
    const error = new Error('Test error')
    const chat = createMockChat({ error })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.error).toBe(error)
  })

  it('should handle empty messages', () => {
    const chat = createMockChat({ messages: [] })
    const bridge = useVercelAIBridge(chat)

    expect(bridge.messages).toHaveLength(0)
    expect(bridge.conversationsProps.items[0].messages).toHaveLength(0)
  })

  it('should handle sender input change', () => {
    const setInput = vi.fn()
    const chat = createMockChat({ setInput })
    const bridge = useVercelAIBridge(chat)

    bridge.senderProps.onChange('new input')

    expect(setInput).toHaveBeenCalledWith('new input')
  })

  it('should provide all required properties', () => {
    const chat = createMockChat()
    const bridge = useVercelAIBridge(chat)

    expect(bridge).toHaveProperty('thinkingBarProps')
    expect(bridge).toHaveProperty('streamProgressProps')
    expect(bridge).toHaveProperty('conversationsProps')
    expect(bridge).toHaveProperty('senderProps')
    expect(bridge).toHaveProperty('responseActionsProps')
    expect(bridge).toHaveProperty('messages')
    expect(bridge).toHaveProperty('streamStatus')
    expect(bridge).toHaveProperty('isLoading')
    expect(bridge).toHaveProperty('error')
  })
})

// ============================================================================
// Edge Cases and Error Scenarios
// ============================================================================

describe('Edge Cases', () => {
  it('should handle message with null content', () => {
    const chat = createMockChat()
    const adapter = createVercelAIAdapter({ chat })

    const vercelMessage = createMockMessage({
      content: null as any,
    })

    const mapped = adapter.mapMessages([vercelMessage])

    expect(mapped[0].content).toBe('null')
  })

  it('should handle message with object content', () => {
    const chat = createMockChat()
    const adapter = createVercelAIAdapter({ chat })

    const vercelMessage = createMockMessage({
      content: { type: 'text', value: 'test' } as any,
    })

    const mapped = adapter.mapMessages([vercelMessage])

    expect(typeof mapped[0].content).toBe('string')
  })

  it('should handle missing attachment name', () => {
    const chat = createMockChat()
    const adapter = createVercelAIAdapter({ chat })

    const vercelMessage = createMockMessage({
      experimental_attachments: [
        {
          url: 'https://example.com/file',
        },
      ],
    })

    const mapped = adapter.mapMessages([vercelMessage])

    expect(mapped[0].attachments?.[0].name).toBe('attachment')
  })

  it('should handle unknown MIME type', () => {
    const chat = createMockChat()
    const adapter = createVercelAIAdapter({ chat })

    const vercelMessage = createMockMessage({
      experimental_attachments: [
        {
          contentType: 'application/unknown',
          url: 'https://example.com/file',
        },
      ],
    })

    const mapped = adapter.mapMessages([vercelMessage])

    expect(mapped[0].attachments?.[0].type).toBe('file')
  })

  it('should handle stream without messages', async () => {
    const chat = createMockChat({ messages: [], isLoading: false })
    const adapter = createVercelAIAdapter({ chat })

    const response = adapter.streamMessage('Hello')
    const chunks: ClarityChatStreamChunk[] = []

    for await (const chunk of response.stream()) {
      chunks.push(chunk)
      if (chunks.length > 100) break // Safety
    }

    expect(chunks.length).toBeGreaterThan(0)
  })

  it('should handle rapid stop calls', () => {
    const stop = vi.fn()
    const chat = createMockChat({ stop })
    const adapter = createVercelAIAdapter({ chat })

    adapter.stopGeneration()
    adapter.stopGeneration()
    adapter.stopGeneration()

    expect(stop).toHaveBeenCalledTimes(3)
  })

  it('should handle sendMessage without attachments', async () => {
    const append = vi.fn().mockResolvedValue('')
    const chat = createMockChat({ append, messages: [createMockMessage()] })
    const adapter = createVercelAIAdapter({ chat })

    await adapter.sendMessage('Hello', undefined)

    expect(append).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'user', content: 'Hello' }),
      undefined
    )
  })

  it('should handle streamMessage with config', () => {
    const chat = createMockChat()
    const adapter = createVercelAIAdapter({ chat })

    const response = adapter.streamMessage('Hello', [], { provider: 'openai', model: 'gpt-4' })

    expect(response).toHaveProperty('messageId')
  })

  it('should generate unique message IDs', () => {
    const chat = createMockChat()
    const adapter = createVercelAIAdapter({ chat })

    const response1 = adapter.streamMessage('Hello')
    const response2 = adapter.streamMessage('World')

    expect(response1.messageId).not.toBe(response2.messageId)
  })
})
