'use client'

/**
 * Vercel AI SDK Adapter
 *
 * Connects clarity-chat components to Vercel AI SDK (useChat, streamText).
 * Provides seamless integration with existing Vercel AI implementations.
 *
 * API Patterns:
 * - Consistent with ClarityChatProvider interface
 * - Maps Vercel AI messages to ClarityChatMessage
 * - Supports streaming, tools, and attachments
 * - Event emission for state updates
 *
 * @example
 * ```tsx
 * import { useChat } from 'ai/react'
 * import { createVercelAIAdapter } from '@clarity-chat/react/adapters'
 *
 * function MyChat() {
 *   const chat = useChat({ api: '/api/chat' })
 *   const adapter = createVercelAIAdapter({ chat })
 *
 *   return (
 *     <ClarityChatProvider adapter={adapter}>
 *       <ChatComposer />
 *     </ClarityChatProvider>
 *   )
 * }
 * ```
 */

import type {
  ClarityChatAdapter,
  ClarityChatAdapterCapabilities,
  ClarityChatAdapterFactoryOptions,
  ClarityChatMessage,
  ClarityChatStreamableResponse,
  ClarityChatStreamChunk,
  ClarityChatStreamStatus,
  ClarityChatToolExecution,
  ChatMessageAttachment,
  ModelConfig,
  withClarityChatEvents,
} from './types'

// ============================================================================
// Types for Vercel AI SDK
// ============================================================================

/** Vercel AI message type */
interface VercelAIMessage {
  id: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  createdAt?: Date
  name?: string
  toolInvocations?: VercelAIToolInvocation[]
  experimental_attachments?: VercelAIAttachment[]
}

/** Vercel AI tool invocation */
interface VercelAIToolInvocation {
  state: 'partial-call' | 'call' | 'result'
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  result?: unknown
}

/** Vercel AI attachment */
interface VercelAIAttachment {
  name?: string
  contentType?: string
  url: string
}

/** Vercel AI useChat return type */
interface VercelAIChatHook {
  messages: VercelAIMessage[]
  input: string
  setInput: (input: string) => void
  isLoading: boolean
  error?: Error
  append: (message: { role: 'user'; content: string }, options?: unknown) => Promise<string | null | undefined>
  reload: () => Promise<string | null | undefined>
  stop: () => void
  setMessages: (messages: VercelAIMessage[]) => void
  handleSubmit: (e?: { preventDefault?: () => void }, options?: unknown) => void
  handleInputChange: (e: { target: { value: string } }) => void
}

/** Options for Vercel AI adapter */
export interface VercelAIAdapterOptions {
  /** useChat hook result */
  chat: VercelAIChatHook
  /** Custom API endpoint */
  apiEndpoint?: string
  /** Additional headers */
  headers?: Record<string, string>
  /** Tool definitions */
  tools?: Array<{
    name: string
    description: string
    parameters: Record<string, unknown>
  }>
  /** Error handler */
  onError?: (error: Error) => void
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Generate unique ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/** Map Vercel AI message to ClarityChatMessage */
function mapVercelMessage(msg: VercelAIMessage): ClarityChatMessage {
  return {
    id: msg.id,
    role: msg.role === 'function' || msg.role === 'tool' ? 'assistant' : msg.role,
    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    createdAt: msg.createdAt || new Date(),
    attachments: msg.experimental_attachments?.map((att, i) => ({
      id: `att-${i}`,
      type: getAttachmentType(att.contentType),
      name: att.name || 'attachment',
      url: att.url,
      mimeType: att.contentType,
    })),
    toolCalls: msg.toolInvocations?.map((tool) => ({
      id: tool.toolCallId,
      type: 'function' as const,
      function: {
        name: tool.toolName,
        arguments: JSON.stringify(tool.args),
      },
    })),
  }
}

/** Get attachment type from MIME type */
function getAttachmentType(mimeType?: string): 'image' | 'file' | 'audio' | 'video' | 'code' {
  if (!mimeType) return 'file'
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.includes('javascript') || mimeType.includes('typescript') || mimeType.includes('json')) {
    return 'code'
  }
  return 'file'
}

/** Map Vercel AI tool invocation to ClarityChatToolExecution */
function mapToolInvocation(tool: VercelAIToolInvocation): ClarityChatToolExecution {
  const statusMap: Record<string, ClarityChatToolExecution['status']> = {
    'partial-call': 'executing',
    call: 'executing',
    result: 'complete',
  }

  return {
    id: tool.toolCallId,
    name: tool.toolName,
    input: tool.args,
    output: tool.result,
    status: statusMap[tool.state] || 'pending',
    requiresApproval: false,
  }
}

// ============================================================================
// Adapter Implementation
// ============================================================================

/**
 * Create a Vercel AI SDK adapter for ClarityChatProvider
 */
export function createVercelAIAdapter(options: VercelAIAdapterOptions): ClarityChatAdapter {
  const { chat, onError } = options
  let abortController: AbortController | null = null

  const capabilities: ClarityChatAdapterCapabilities = {
    streaming: true,
    tools: true,
    thinking: false,
    attachments: true,
    regeneration: true,
    history: true,
    multiModel: false,
    toolApproval: false,
  }

  const sendMessage = async (
    message: string,
    attachments?: ChatMessageAttachment[],
    _config?: ModelConfig
  ): Promise<ClarityChatMessage> => {
    try {
      const messageId = generateId()

      // Convert attachments to Vercel AI format
      const experimental_attachments = attachments?.map((att) => ({
        name: att.name,
        contentType: att.mimeType,
        url: att.url || att.data || '',
      }))

      await chat.append(
        { role: 'user', content: message },
        experimental_attachments ? { experimental_attachments } : undefined
      )

      // Wait for response (Vercel AI handles this internally)
      // Return the last assistant message
      const lastMessage = chat.messages[chat.messages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        return mapVercelMessage(lastMessage)
      }

      return {
        id: messageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }

  const streamMessage = (
    message: string,
    attachments?: ChatMessageAttachment[],
    _config?: ModelConfig
  ): ClarityChatStreamableResponse => {
    abortController = new AbortController()
    const messageId = generateId()
    let resolvePromise: (msg: ClarityChatMessage) => void
    let rejectPromise: (err: Error) => void

    const promise = new Promise<ClarityChatMessage>((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })

    // Start the message
    const experimental_attachments = attachments?.map((att) => ({
      name: att.name,
      contentType: att.mimeType,
      url: att.url || att.data || '',
    }))

    chat
      .append(
        { role: 'user', content: message },
        experimental_attachments ? { experimental_attachments } : undefined
      )
      .then(() => {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage) {
          resolvePromise(mapVercelMessage(lastMessage))
        }
      })
      .catch((error) => {
        onError?.(error)
        rejectPromise(error)
      })

    // Create async generator for streaming
    async function* streamGenerator(): AsyncIterable<ClarityChatStreamChunk> {
      // Track previous content length to yield only new content
      let prevLength = 0

      while (chat.isLoading && !abortController?.signal.aborted) {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          const content = lastMessage.content
          if (content.length > prevLength) {
            yield {
              type: 'token',
              content: content.slice(prevLength),
              messageId,
            }
            prevLength = content.length
          }

          // Check for tool invocations
          if (lastMessage.toolInvocations?.length) {
            for (const tool of lastMessage.toolInvocations) {
              if (tool.state === 'call') {
                yield {
                  type: 'tool_call',
                  toolCall: {
                    id: tool.toolCallId,
                    type: 'function',
                    function: {
                      name: tool.toolName,
                      arguments: JSON.stringify(tool.args),
                    },
                  },
                  messageId,
                }
              }
            }
          }
        }

        // Small delay to prevent tight loop
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      // Final chunk
      yield {
        type: 'done',
        messageId,
      }
    }

    return {
      stream: () => streamGenerator(),
      promise,
      abort: () => {
        chat.stop()
        abortController?.abort()
      },
      messageId,
    }
  }

  const stopGeneration = () => {
    chat.stop()
    abortController?.abort()
    abortController = null
  }

  const regenerate = (messageId: string): ClarityChatStreamableResponse => {
    abortController = new AbortController()
    let resolvePromise: (msg: ClarityChatMessage) => void
    let rejectPromise: (err: Error) => void

    const promise = new Promise<ClarityChatMessage>((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })

    chat
      .reload()
      .then(() => {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage) {
          resolvePromise(mapVercelMessage(lastMessage))
        }
      })
      .catch((error) => {
        onError?.(error)
        rejectPromise(error)
      })

    async function* streamGenerator(): AsyncIterable<ClarityChatStreamChunk> {
      let prevLength = 0

      while (chat.isLoading && !abortController?.signal.aborted) {
        const lastMessage = chat.messages[chat.messages.length - 1]
        if (lastMessage && lastMessage.role === 'assistant') {
          const content = lastMessage.content
          if (content.length > prevLength) {
            yield {
              type: 'token',
              content: content.slice(prevLength),
              messageId,
            }
            prevLength = content.length
          }
        }
        await new Promise((resolve) => setTimeout(resolve, 50))
      }

      yield { type: 'done', messageId }
    }

    return {
      stream: () => streamGenerator(),
      promise,
      abort: () => {
        chat.stop()
        abortController?.abort()
      },
      messageId,
    }
  }

  const mapMessages = (externalMessages: unknown[]): ClarityChatMessage[] => {
    return (externalMessages as VercelAIMessage[]).map(mapVercelMessage)
  }

  const mapStreamStatus = (_externalStatus: unknown): ClarityChatStreamStatus => {
    return {
      isStreaming: chat.isLoading,
      phase: chat.isLoading ? 'receiving' : chat.error ? 'error' : 'idle',
      progress: chat.isLoading ? 50 : 100,
      tokensUsed: 0,
      startedAt: chat.isLoading ? new Date() : null,
      estimatedCompletion: null,
    }
  }

  const mapToolCalls = (externalToolCalls: unknown[]): ClarityChatToolExecution[] => {
    return (externalToolCalls as VercelAIToolInvocation[]).map(mapToolInvocation)
  }

  return {
    name: 'vercel-ai',
    sendMessage,
    streamMessage,
    stopGeneration,
    regenerate,
    mapMessages,
    mapStreamStatus,
    mapToolCalls,
    capabilities,
  }
}

// ============================================================================
// Bridge Hook for Vercel AI
// ============================================================================

/**
 * Hook that bridges Vercel AI SDK state to clarity-chat components
 *
 * @example
 * ```tsx
 * function MyChat() {
 *   const chat = useChat({ api: '/api/chat' })
 *   const bridge = useVercelAIBridge(chat)
 *
 *   return (
 *     <>
 *       <ThinkingBar {...bridge.thinkingBarProps} />
 *       <Conversations {...bridge.conversationsProps} />
 *       <Sender {...bridge.senderProps} />
 *     </>
 *   )
 * }
 * ```
 */
export interface VercelAIBridgeResult {
  /** Props for ThinkingBar component */
  thinkingBarProps: {
    isActive: boolean
    status: 'idle' | 'thinking' | 'processing' | 'complete' | 'error'
  }
  /** Props for StreamStatusProgress component */
  streamProgressProps: {
    progress: number
    status: 'idle' | 'connecting' | 'streaming' | 'complete' | 'error'
    tokensUsed: number
  }
  /** Props for Conversations component */
  conversationsProps: {
    items: Array<{
      key: string
      label: string
      messages: ClarityChatMessage[]
    }>
    activeKey: string
  }
  /** Props for Sender component */
  senderProps: {
    onSend: (content: string) => Promise<void>
    onStop: () => void
    isLoading: boolean
    value: string
    onChange: (value: string) => void
  }
  /** Props for ResponseActions component */
  responseActionsProps: {
    onRegenerate: () => Promise<void>
    onStop: () => void
    isRegenerating: boolean
  }
  /** All messages mapped to clarity-chat format */
  messages: ClarityChatMessage[]
  /** Current streaming status */
  streamStatus: ClarityChatStreamStatus
  /** Whether currently loading */
  isLoading: boolean
  /** Any error that occurred */
  error?: Error
}

export function useVercelAIBridge(chat: VercelAIChatHook): VercelAIBridgeResult {
  const messages = chat.messages.map(mapVercelMessage)

  const thinkingBarProps = {
    isActive: chat.isLoading,
    status: chat.isLoading
      ? ('thinking' as const)
      : chat.error
        ? ('error' as const)
        : ('idle' as const),
  }

  const streamProgressProps = {
    progress: chat.isLoading ? 50 : 100,
    status: chat.isLoading
      ? ('streaming' as const)
      : chat.error
        ? ('error' as const)
        : ('idle' as const),
    tokensUsed: 0,
  }

  const conversationsProps = {
    items: [
      {
        key: 'main',
        label: 'Chat',
        messages,
      },
    ],
    activeKey: 'main',
  }

  const senderProps = {
    onSend: async (content: string) => {
      await chat.append({ role: 'user', content })
    },
    onStop: chat.stop,
    isLoading: chat.isLoading,
    value: chat.input,
    onChange: chat.setInput,
  }

  const responseActionsProps = {
    onRegenerate: async () => {
      await chat.reload()
    },
    onStop: chat.stop,
    isRegenerating: chat.isLoading,
  }

  const streamStatus: ClarityChatStreamStatus = {
    isStreaming: chat.isLoading,
    phase: chat.isLoading ? 'receiving' : chat.error ? 'error' : 'idle',
    progress: chat.isLoading ? 50 : 100,
    tokensUsed: 0,
    startedAt: null,
    estimatedCompletion: null,
  }

  return {
    thinkingBarProps,
    streamProgressProps,
    conversationsProps,
    senderProps,
    responseActionsProps,
    messages,
    streamStatus,
    isLoading: chat.isLoading,
    error: chat.error,
  }
}

export default createVercelAIAdapter
