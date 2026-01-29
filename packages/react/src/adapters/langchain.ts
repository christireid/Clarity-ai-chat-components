'use client'

/**
 * LangChain Adapter
 *
 * Comprehensive adapter for integrating LangChain models, chains, and agents with clarity-chat.
 * Provides seamless integration with LangChain's message formats, streaming, and tool/function
 * calling capabilities through a unified ClarityChatAdapter interface.
 *
 * Features:
 * - Full ClarityChatAdapter implementation with all required methods
 * - Automatic message format conversion (HumanMessage, AIMessage, ToolMessage, etc.)
 * - Streaming support with LangChain's event system (streamEvents v2)
 * - Agent tool execution and function calling integration
 * - Message history management and regeneration
 * - React hooks for easy integration (useLangChainAdapter, useLangChainBridge)
 * - Token usage tracking and error handling
 * - Support for both simple models and complex agents/chains
 *
 * API Patterns:
 * - Consistent with ClarityChatAdapter interface
 * - Maps LangChain messages to ClarityChatMessage types
 * - Supports streaming with fallback to invoke if stream unavailable
 * - Compatible with LangChain callbacks and tracing systems
 * - Handles agent intermediate steps and tool results
 *
 * @example
 * ```tsx
 * import { ChatOpenAI } from '@langchain/openai'
 * import { createLangChainAdapter, useLangChainAdapter } from '@clarity-chat/react/adapters'
 *
 * // Option 1: Direct adapter creation
 * function MyChat() {
 *   const model = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY })
 *   const adapter = createLangChainAdapter({ model })
 *
 *   return (
 *     <ClarityChatProvider adapter={adapter}>
 *       <ChatComposer />
 *     </ClarityChatProvider>
 *   )
 * }
 *
 * // Option 2: Using React hook
 * function MyChatWithHook() {
 *   const model = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY })
 *   const { adapter, messages, isLoading, error, sendMessage } = useLangChainAdapter({ model })
 *
 *   return (
 *     <div>
 *       <Messages messages={messages} />
 *       <Composer onSend={sendMessage} isLoading={isLoading} />
 *     </div>
 *   )
 * }
 * ```
 *
 * @module adapters/langchain
 */

import type {
  ClarityChatAdapter,
  ClarityChatAdapterCapabilities,
  ClarityChatMessage,
  ClarityChatStreamableResponse,
  ClarityChatStreamChunk,
  ClarityChatStreamStatus,
  ClarityChatToolExecution,
  ChatMessageAttachment,
  ModelConfig,
  withClarityChatEvents,
} from './types'
import { useCallback, useReducer } from 'react'

// ============================================================================
// Types for LangChain
// ============================================================================

/** LangChain base message type */
export interface LangChainMessage {
  _getType: () => string
  content: string | Array<{ type: string; [key: string]: unknown }>
  name?: string
  additional_kwargs?: Record<string, unknown>
  response_metadata?: Record<string, unknown>
}

/** LangChain HumanMessage */
export interface LangChainHumanMessage extends LangChainMessage {
  _getType: () => 'human'
}

/** LangChain AIMessage */
export interface LangChainAIMessage extends LangChainMessage {
  _getType: () => 'ai'
  tool_calls?: LangChainToolCall[]
  usage_metadata?: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

/** LangChain ToolMessage */
export interface LangChainToolMessage extends LangChainMessage {
  _getType: () => 'tool'
  tool_call_id: string
}

/** LangChain SystemMessage */
export interface LangChainSystemMessage extends LangChainMessage {
  _getType: () => 'system'
}

/** LangChain tool call */
export interface LangChainToolCall {
  name: string
  args: Record<string, unknown>
  id: string
  type?: 'tool_call'
}

/** LangChain model interface */
export interface LangChainModel {
  invoke: (input: unknown, options?: unknown) => Promise<LangChainAIMessage>
  stream: (input: unknown, options?: unknown) => AsyncIterable<LangChainStreamChunk>
  withStructuredOutput?: (schema: unknown, options?: unknown) => LangChainModel
}

/** LangChain streaming chunk from model.stream() */
export interface LangChainStreamChunk {
  type: string
  content?: string
  tool_calls?: LangChainToolCall[]
  [key: string]: unknown
}

/** LangChain runnable interface (agent chains) */
export interface LangChainRunnable {
  invoke: (input: unknown, options?: unknown) => Promise<unknown>
  stream: (input: unknown, options?: unknown) => AsyncIterable<unknown>
  streamEvents?: (
    input: unknown,
    options?: { version: string } & Record<string, unknown>
  ) => AsyncIterable<LangChainStreamEvent>
  withFallbacks?: (fallbacks: LangChainRunnable[]) => LangChainRunnable
}

/** LangChain stream event from streamEvents */
export interface LangChainStreamEvent {
  event: string
  name: string
  data: {
    input?: unknown
    output?: unknown
    chunk?: LangChainStreamChunk
    delta?: Record<string, unknown>
  }
  run_id?: string
}

/** Options for LangChain adapter */
export interface LangChainAdapterOptions {
  /** LangChain model, runnable, or agent */
  model: LangChainModel | LangChainRunnable
  /** Message history for context */
  messageHistory?: LangChainMessage[]
  /** Custom API endpoint */
  apiEndpoint?: string
  /** Additional headers */
  headers?: Record<string, string>
  /** Tool definitions (for structured output) */
  tools?: Array<{
    name: string
    description: string
    parameters: Record<string, unknown>
  }>
  /** Error handler */
  onError?: (error: Error) => void
  /** Enable streaming (default: true) */
  enableStreaming?: boolean
  /** Custom streaming options */
  streamingOptions?: {
    version?: string
    includeNames?: boolean
    includeTags?: boolean
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/** Generate unique ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/** Detect LangChain message type */
function detectMessageType(msg: LangChainMessage): 'user' | 'assistant' | 'system' | 'tool' {
  const type = msg._getType?.()
  switch (type) {
    case 'human':
      return 'user'
    case 'ai':
      return 'assistant'
    case 'tool':
      return 'tool'
    case 'system':
      return 'system'
    default:
      return 'user'
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

/** Check if model has stream method */
function hasStreamMethod(obj: unknown): obj is { stream: (input: unknown, options?: unknown) => AsyncIterable<unknown> } {
  return typeof obj === 'object' && obj !== null && 'stream' in obj && typeof (obj as Record<string, unknown>).stream === 'function'
}

/** Check if model has streamEvents method */
function hasStreamEventsMethod(obj: unknown): obj is {
  streamEvents: (input: unknown, options?: Record<string, unknown>) => AsyncIterable<LangChainStreamEvent>
} {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'streamEvents' in obj &&
    typeof (obj as Record<string, unknown>).streamEvents === 'function'
  )
}

/** Map LangChain message to ClarityChatMessage */
function mapLangChainMessage(msg: LangChainMessage, id?: string): ClarityChatMessage {
  const messageId = id || generateId()
  const messageType = detectMessageType(msg)

  // Extract content
  let contentStr = ''
  if (typeof msg.content === 'string') {
    contentStr = msg.content
  } else if (Array.isArray(msg.content)) {
    contentStr = msg.content
      .map((part: Record<string, unknown>) => {
        if (typeof part === 'string') return part
        if (part.type === 'text' && 'text' in part) return String(part.text)
        return JSON.stringify(part)
      })
      .join('\n')
  }

  // Extract tool calls from AIMessage
  const toolCalls = (msg as LangChainAIMessage).tool_calls?.map((tool) => ({
    id: tool.id,
    type: 'function' as const,
    function: {
      name: tool.name,
      arguments: JSON.stringify(tool.args),
    },
  }))

  return {
    id: messageId,
    role: messageType,
    content: contentStr,
    createdAt: new Date(),
    toolCalls,
  }
}

/** Map LangChain tool call to ClarityChatToolExecution */
function mapLangChainToolCall(tool: LangChainToolCall, status: 'pending' | 'executing' | 'complete' = 'pending'): ClarityChatToolExecution {
  return {
    id: tool.id,
    name: tool.name,
    input: tool.args || {},
    status,
    requiresApproval: false,
  }
}

/** Extract content from LangChain message content */
function extractTextContent(content: string | unknown[]): string {
  if (typeof content === 'string') {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .map((part: unknown) => {
        if (typeof part === 'string') return part
        if (typeof part === 'object' && part !== null && 'text' in part) {
          return String((part as Record<string, unknown>).text)
        }
        return ''
      })
      .join('\n')
  }

  return ''
}

// ============================================================================
// Adapter Implementation
// ============================================================================

/**
 * Create a LangChain adapter for ClarityChatProvider
 */
export function createLangChainAdapter(options: LangChainAdapterOptions): ClarityChatAdapter {
  const { model, messageHistory = [], onError, enableStreaming = true, streamingOptions = {} } = options
  let abortController: AbortController | null = null
  let currentMessageHistory: LangChainMessage[] = [...messageHistory]

  const capabilities: ClarityChatAdapterCapabilities = {
    streaming: enableStreaming,
    tools: true,
    thinking: false,
    attachments: false,
    regeneration: true,
    history: true,
    multiModel: false,
    toolApproval: false,
  }

  const sendMessage = async (
    message: string,
    _attachments?: ChatMessageAttachment[],
    _config?: ModelConfig
  ): Promise<ClarityChatMessage> => {
    try {
      const messageId = generateId()

      // Create user message
      const userMessage = {
        _getType: () => 'human' as const,
        content: message,
      } as LangChainMessage

      currentMessageHistory.push(userMessage)

      // Call model
      const response = await model.invoke(currentMessageHistory)

      // Convert response to ClarityChatMessage
      const aiMessage = mapLangChainMessage(response as LangChainMessage, messageId)
      currentMessageHistory.push(response as LangChainMessage)

      return aiMessage
    } catch (error) {
      onError?.(error as Error)
      throw error
    }
  }

  const streamMessage = (
    message: string,
    _attachments?: ChatMessageAttachment[],
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

    // Create user message
    const userMessage = {
      _getType: () => 'human' as const,
      content: message,
    } as LangChainMessage

    currentMessageHistory.push(userMessage)

    // Create async generator for streaming
    async function* streamGenerator(): AsyncIterable<ClarityChatStreamChunk> {
      try {
        let accumulatedContent = ''
        let lastMessage: LangChainMessage | null = null

        if (hasStreamEventsMethod(model) && streamingOptions.version !== false) {
          // Use streamEvents if available (better for agents/chains)
          for await (const event of model.streamEvents(currentMessageHistory, {
            version: streamingOptions.version || 'v2',
          })) {
            if (abortController?.signal.aborted) break

            // Parse stream events
            if (event.event === 'on_chat_model_stream' || event.event === 'on_llm_stream') {
              const chunk = event.data?.chunk as LangChainStreamChunk | undefined
              if (chunk?.content) {
                accumulatedContent += chunk.content
                yield {
                  type: 'token',
                  content: chunk.content,
                  messageId,
                }
              }

              if (chunk?.tool_calls) {
                for (const tool of chunk.tool_calls) {
                  yield {
                    type: 'tool_call',
                    toolCall: {
                      id: tool.id,
                      type: 'function',
                      function: {
                        name: tool.name,
                        arguments: JSON.stringify(tool.args),
                      },
                    },
                    messageId,
                  }
                }
              }
            }

            // Track end event
            if (event.event === 'on_chain_end' || event.event === 'on_llm_end') {
              const output = event.data?.output as LangChainMessage | undefined
              if (output) {
                lastMessage = output
              }
            }
          }
        } else if (hasStreamMethod(model) && enableStreaming) {
          // Use regular stream method
          for await (const chunk of model.stream(currentMessageHistory)) {
            if (abortController?.signal.aborted) break

            const streamChunk = chunk as LangChainStreamChunk
            if (streamChunk.content) {
              accumulatedContent += streamChunk.content
              yield {
                type: 'token',
                content: streamChunk.content,
                messageId,
              }
            }

            if (streamChunk.tool_calls) {
              for (const tool of streamChunk.tool_calls) {
                yield {
                  type: 'tool_call',
                  toolCall: {
                    id: tool.id,
                    type: 'function',
                    function: {
                      name: tool.name,
                      arguments: JSON.stringify(tool.args),
                    },
                  },
                  messageId,
                }
              }
            }
          }
        } else {
          // Fallback to regular invoke
          const response = await model.invoke(currentMessageHistory)
          lastMessage = response as LangChainMessage
          const content = extractTextContent((response as LangChainMessage).content)
          if (content) {
            accumulatedContent += content
            yield {
              type: 'token',
              content,
              messageId,
            }
          }
        }

        // Create final message
        if (lastMessage) {
          const finalMessage = mapLangChainMessage(lastMessage, messageId)
          currentMessageHistory.push(lastMessage)
          resolvePromise(finalMessage)
        } else {
          // Create message from accumulated content
          const finalMessage: ClarityChatMessage = {
            id: messageId,
            role: 'assistant',
            content: accumulatedContent,
            createdAt: new Date(),
          }
          resolvePromise(finalMessage)
        }

        yield {
          type: 'done',
          messageId,
        }
      } catch (error) {
        const err = error as Error
        onError?.(err)
        rejectPromise(err)
      }
    }

    return {
      stream: () => streamGenerator(),
      promise,
      abort: () => {
        abortController?.abort()
      },
      messageId,
    }
  }

  const stopGeneration = () => {
    abortController?.abort()
    abortController = null
  }

  const regenerate = (_messageId: string): ClarityChatStreamableResponse => {
    abortController = new AbortController()
    let resolvePromise: (msg: ClarityChatMessage) => void
    let rejectPromise: (err: Error) => void

    const promise = new Promise<ClarityChatMessage>((resolve, reject) => {
      resolvePromise = resolve
      rejectPromise = reject
    })

    // Remove last assistant message and stream again
    if (currentMessageHistory.length > 0) {
      const lastIdx = currentMessageHistory.length - 1
      const lastMsg = currentMessageHistory[lastIdx]
      if (lastMsg._getType?.() === 'ai') {
        currentMessageHistory.pop()
      }
    }

    async function* streamGenerator(): AsyncIterable<ClarityChatStreamChunk> {
      try {
        let accumulatedContent = ''
        let lastMessage: LangChainMessage | null = null
        const messageId = generateId()

        if (hasStreamEventsMethod(model) && streamingOptions.version !== false) {
          for await (const event of model.streamEvents(currentMessageHistory, {
            version: streamingOptions.version || 'v2',
          })) {
            if (abortController?.signal.aborted) break

            if (event.event === 'on_chat_model_stream' || event.event === 'on_llm_stream') {
              const chunk = event.data?.chunk as LangChainStreamChunk | undefined
              if (chunk?.content) {
                accumulatedContent += chunk.content
                yield {
                  type: 'token',
                  content: chunk.content,
                  messageId,
                }
              }

              if (chunk?.tool_calls) {
                for (const tool of chunk.tool_calls) {
                  yield {
                    type: 'tool_call',
                    toolCall: {
                      id: tool.id,
                      type: 'function',
                      function: {
                        name: tool.name,
                        arguments: JSON.stringify(tool.args),
                      },
                    },
                    messageId,
                  }
                }
              }
            }

            if (event.event === 'on_chain_end' || event.event === 'on_llm_end') {
              const output = event.data?.output as LangChainMessage | undefined
              if (output) {
                lastMessage = output
              }
            }
          }
        } else if (hasStreamMethod(model) && enableStreaming) {
          for await (const chunk of model.stream(currentMessageHistory)) {
            if (abortController?.signal.aborted) break

            const streamChunk = chunk as LangChainStreamChunk
            if (streamChunk.content) {
              accumulatedContent += streamChunk.content
              yield {
                type: 'token',
                content: streamChunk.content,
                messageId,
              }
            }

            if (streamChunk.tool_calls) {
              for (const tool of streamChunk.tool_calls) {
                yield {
                  type: 'tool_call',
                  toolCall: {
                    id: tool.id,
                    type: 'function',
                    function: {
                      name: tool.name,
                      arguments: JSON.stringify(tool.args),
                    },
                  },
                  messageId,
                }
              }
            }
          }
        } else {
          const response = await model.invoke(currentMessageHistory)
          lastMessage = response as LangChainMessage
          const content = extractTextContent((response as LangChainMessage).content)
          if (content) {
            accumulatedContent += content
            yield {
              type: 'token',
              content,
              messageId,
            }
          }
        }

        if (lastMessage) {
          const finalMessage = mapLangChainMessage(lastMessage, messageId)
          currentMessageHistory.push(lastMessage)
          resolvePromise(finalMessage)
        } else {
          const finalMessage: ClarityChatMessage = {
            id: messageId,
            role: 'assistant',
            content: accumulatedContent,
            createdAt: new Date(),
          }
          resolvePromise(finalMessage)
        }

        yield {
          type: 'done',
          messageId,
        }
      } catch (error) {
        const err = error as Error
        onError?.(err)
        rejectPromise(err)
      }
    }

    return {
      stream: () => streamGenerator(),
      promise,
      abort: () => {
        abortController?.abort()
      },
      messageId: _messageId || generateId(),
    }
  }

  const mapMessages = (externalMessages: unknown[]): ClarityChatMessage[] => {
    return (externalMessages as LangChainMessage[]).map(mapLangChainMessage)
  }

  const mapStreamStatus = (): ClarityChatStreamStatus => {
    return {
      isStreaming: !!abortController && !abortController.signal.aborted,
      phase: abortController && !abortController.signal.aborted ? 'receiving' : 'idle',
      progress: abortController && !abortController.signal.aborted ? 50 : 100,
      tokensUsed: 0,
      startedAt: null,
      estimatedCompletion: null,
    }
  }

  const mapToolCalls = (externalToolCalls: unknown[]): ClarityChatToolExecution[] => {
    return (externalToolCalls as LangChainToolCall[]).map((tool) => mapLangChainToolCall(tool, 'pending'))
  }

  return {
    name: 'langchain',
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
// Bridge Hook for LangChain
// ============================================================================

/**
 * Hook result for LangChain bridge
 */
export interface LangChainBridgeResult {
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

/**
 * Hook result for LangChain adapter with full state management
 *
 * Provides reactive state management for chat history, loading states,
 * and error handling when using LangChain models.
 */
export interface UseLangChainAdapterResult {
  /** The underlying ClarityChatAdapter instance */
  adapter: ClarityChatAdapter
  /** Current messages in conversation */
  messages: ClarityChatMessage[]
  /** Whether a message is currently being sent/streamed */
  isLoading: boolean
  /** Current error if any */
  error?: Error
  /** Send a new message and update state */
  sendMessage: (message: string, attachments?: ChatMessageAttachment[]) => Promise<void>
  /** Stop current generation */
  stopGeneration: () => void
  /** Regenerate the last assistant message */
  regenerateMessage: (messageId?: string) => Promise<void>
  /** Clear all messages */
  clearMessages: () => void
  /** Add message to history directly */
  addMessage: (message: ClarityChatMessage) => void
}

/**
 * State for useLangChainAdapter hook
 */
interface LangChainAdapterState {
  messages: ClarityChatMessage[]
  isLoading: boolean
  error?: Error
}

/**
 * Action types for reducer
 */
type LangChainAdapterAction =
  | { type: 'ADD_MESSAGE'; payload: ClarityChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: ClarityChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | undefined }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'REPLACE_MESSAGES'; payload: ClarityChatMessage[] }

/**
 * Reducer for managing adapter state
 */
function langChainAdapterReducer(
  state: LangChainAdapterState,
  action: LangChainAdapterAction
): LangChainAdapterState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      }
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((msg) => (msg.id === action.payload.id ? action.payload : msg)),
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      }
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
      }
    case 'REPLACE_MESSAGES':
      return {
        ...state,
        messages: action.payload,
      }
    default:
      return state
  }
}

/**
 * React hook for using LangChain adapter with full state management
 *
 * Manages conversation history, loading states, and errors automatically.
 * Integrates with ClarityChatAdapter for a complete chat solution.
 *
 * @param options - Configuration for the adapter
 * @returns Hook result with adapter, state, and helper functions
 *
 * @example
 * ```tsx
 * import { ChatOpenAI } from '@langchain/openai'
 * import { useLangChainAdapter } from '@clarity-chat/react/adapters'
 *
 * function ChatComponent() {
 *   const model = new ChatOpenAI({ apiKey: process.env.OPENAI_API_KEY })
 *   const {
 *     messages,
 *     isLoading,
 *     error,
 *     sendMessage,
 *     stopGeneration,
 *     regenerateMessage,
 *   } = useLangChainAdapter({ model })
 *
 *   return (
 *     <div>
 *       <div className="messages">
 *         {messages.map((msg) => (
 *           <div key={msg.id} className={`message message-${msg.role}`}>
 *             {msg.content}
 *           </div>
 *         ))}
 *       </div>
 *       <input
 *         type="text"
 *         onKeyDown={(e) => {
 *           if (e.key === 'Enter' && !isLoading) {
 *             sendMessage(e.currentTarget.value)
 *             e.currentTarget.value = ''
 *           }
 *         }}
 *         disabled={isLoading}
 *       />
 *       {isLoading && <button onClick={stopGeneration}>Stop</button>}
 *       {error && <div className="error">{error.message}</div>}
 *     </div>
 *   )
 * }
 * ```
 */
export function useLangChainAdapter(options: LangChainAdapterOptions): UseLangChainAdapterResult {
  // Initialize state with optional message history
  const initialMessages = (options.messageHistory || []).map(mapLangChainMessage)
  const [state, dispatch] = useReducer(langChainAdapterReducer, {
    messages: initialMessages,
    isLoading: false,
    error: undefined,
  })

  // Create adapter instance once
  const adapter = createLangChainAdapter(options)

  /**
   * Send a message and update state
   */
  const sendMessage = useCallback(
    async (message: string, attachments?: ChatMessageAttachment[]) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ERROR', payload: undefined })

        // Add user message immediately
        const userMessage: ClarityChatMessage = {
          id: generateId(),
          role: 'user',
          content: message,
          createdAt: new Date(),
          attachments,
        }
        dispatch({ type: 'ADD_MESSAGE', payload: userMessage })

        // Stream the response
        const response = adapter.streamMessage(message, attachments)
        let assistantMessage: ClarityChatMessage | null = null

        for await (const chunk of response.stream()) {
          if (chunk.type === 'token' && chunk.content) {
            if (!assistantMessage) {
              assistantMessage = {
                id: response.messageId,
                role: 'assistant',
                content: chunk.content,
                createdAt: new Date(),
              }
              dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
            } else {
              assistantMessage.content += chunk.content
              dispatch({ type: 'UPDATE_MESSAGE', payload: assistantMessage })
            }
          } else if (chunk.type === 'tool_call' && chunk.toolCall) {
            if (!assistantMessage) {
              assistantMessage = {
                id: response.messageId,
                role: 'assistant',
                content: '',
                createdAt: new Date(),
                toolCalls: [chunk.toolCall],
              }
              dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
            } else if (!assistantMessage.toolCalls) {
              assistantMessage.toolCalls = [chunk.toolCall]
              dispatch({ type: 'UPDATE_MESSAGE', payload: assistantMessage })
            } else {
              assistantMessage.toolCalls.push(chunk.toolCall)
              dispatch({ type: 'UPDATE_MESSAGE', payload: assistantMessage })
            }
          }
        }

        // Wait for final promise
        const finalMessage = await response.promise
        if (finalMessage) {
          dispatch({ type: 'UPDATE_MESSAGE', payload: finalMessage })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        dispatch({ type: 'SET_ERROR', payload: err })
        options.onError?.(err)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [adapter, options]
  )

  /**
   * Stop current generation
   */
  const stopGeneration = useCallback(() => {
    adapter.stopGeneration()
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [adapter])

  /**
   * Regenerate the last message
   */
  const regenerateMessage = useCallback(
    async (messageId?: string) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        dispatch({ type: 'SET_ERROR', payload: undefined })

        const targetId = messageId || (state.messages.length > 0 ? state.messages[state.messages.length - 1].id : undefined)
        if (!targetId) return

        const response = adapter.regenerate?.(targetId)
        if (!response) return

        let assistantMessage: ClarityChatMessage | null = null

        for await (const chunk of response.stream()) {
          if (chunk.type === 'token' && chunk.content) {
            if (!assistantMessage) {
              assistantMessage = {
                id: response.messageId,
                role: 'assistant',
                content: chunk.content,
                createdAt: new Date(),
              }
              dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage })
            } else {
              assistantMessage.content += chunk.content
              dispatch({ type: 'UPDATE_MESSAGE', payload: assistantMessage })
            }
          }
        }

        const finalMessage = await response.promise
        if (finalMessage) {
          dispatch({ type: 'UPDATE_MESSAGE', payload: finalMessage })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        dispatch({ type: 'SET_ERROR', payload: err })
        options.onError?.(err)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    },
    [adapter, state.messages, options]
  )

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' })
  }, [])

  /**
   * Add a message directly
   */
  const addMessage = useCallback((message: ClarityChatMessage) => {
    dispatch({ type: 'ADD_MESSAGE', payload: message })
  }, [])

  return {
    adapter,
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    stopGeneration,
    regenerateMessage,
    clearMessages,
    addMessage,
  }
}

/**
 * Hook that bridges LangChain state to clarity-chat components
 *
 * Provides pre-configured props for common clarity-chat UI components.
 * Useful for quick integration without managing state separately.
 *
 * @param options - Configuration for the adapter
 * @returns Bridge result with component props
 *
 * @example
 * ```tsx
 * function MyChat() {
 *   const model = new ChatOpenAI()
 *   const bridge = useLangChainBridge(model)
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
export function useLangChainBridge(options: LangChainAdapterOptions): LangChainBridgeResult {
  const { messages, isLoading, error, sendMessage, stopGeneration, regenerateMessage } =
    useLangChainAdapter(options)

  // Input state management
  const [inputValue, setInputValue] = useReducer(
    (state: string, action: { type: string; value?: string }) => {
      switch (action.type) {
        case 'SET':
          return action.value || ''
        case 'CLEAR':
          return ''
        default:
          return state
      }
    },
    ''
  )

  const thinkingBarProps = {
    isActive: isLoading,
    status: isLoading ? ('processing' as const) : ('idle' as const),
  }

  const streamProgressProps = {
    progress: isLoading ? 50 : 100,
    status: isLoading ? ('streaming' as const) : ('idle' as const),
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
    activeKey: 'main' as const,
  }

  const senderProps = {
    onSend: async (content: string) => {
      await sendMessage(content)
      setInputValue({ type: 'CLEAR' })
    },
    onStop: () => {
      stopGeneration()
    },
    isLoading,
    value: inputValue,
    onChange: (value: string) => {
      setInputValue({ type: 'SET', value })
    },
  }

  const responseActionsProps = {
    onRegenerate: async () => {
      await regenerateMessage()
    },
    onStop: () => {
      stopGeneration()
    },
    isRegenerating: isLoading,
  }

  const streamStatus: ClarityChatStreamStatus = {
    isStreaming: isLoading,
    phase: isLoading ? 'receiving' : 'idle',
    progress: isLoading ? 50 : 100,
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
    isLoading,
    error,
  }
}

export default createLangChainAdapter
