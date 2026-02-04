'use client'

/**
 * ClarityChatProvider
 *
 * Unified context provider that connects all clarity-chat components.
 * Provides shared state for messages, streaming, tools, thinking, and configuration.
 *
 * Features:
 * - Centralized message management
 * - Streaming state synchronization
 * - Tool execution tracking
 * - Thinking/reasoning state
 * - Configuration management
 * - Event broadcasting
 *
 * @example
 * ```tsx
 * import { ClarityChatProvider } from '@clarity-chat/react'
 * import { createVercelAIAdapter } from '@clarity-chat/react/adapters'
 *
 * function App() {
 *   return (
 *     <ClarityChatProvider
 *       adapter={createVercelAIAdapter({ useChat })}
 *       config={{ model: 'claude-3-sonnet' }}
 *     >
 *       <ThinkingBar connected />
 *       <Conversations connected />
 *       <Sender connected />
 *     </ClarityChatProvider>
 *   )
 * }
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Message role */
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

/** Message status */
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error'

/** Tool call within a message */
export interface MessageToolCall {
  id: string
  name: string
  arguments: Record<string, unknown>
  result?: unknown
  status: 'pending' | 'running' | 'complete' | 'error'
  error?: string
}

/** Attachment data */
export interface MessageAttachment {
  id: string
  name: string
  type: string
  size?: number
  url?: string
  previewUrl?: string
}

/** Chat message */
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: Date
  status: MessageStatus
  toolCalls?: MessageToolCall[]
  attachments?: MessageAttachment[]
  metadata?: Record<string, unknown>
}

/** Thinking step */
export interface ThinkingStep {
  id: string
  content: string
  status: 'pending' | 'active' | 'complete'
  timestamp: Date
}

/** Stream status */
export interface StreamStatus {
  isStreaming: boolean
  phase: 'idle' | 'connecting' | 'receiving' | 'processing' | 'complete' | 'error'
  progress: number
  tokensUsed: number
  tokensTotal?: number
  startedAt?: Date
  estimatedCompletion?: Date
  error?: string
}

/** Tool execution */
export interface ToolExecution {
  id: string
  callId: string
  name: string
  description?: string
  arguments: Record<string, unknown>
  status: 'pending' | 'approved' | 'rejected' | 'running' | 'complete' | 'error'
  result?: unknown
  error?: string
  requiresApproval: boolean
  startedAt?: Date
  completedAt?: Date
}

/** Chat configuration */
export interface ChatConfig {
  model?: string
  provider?: string
  temperature?: number
  maxTokens?: number
  systemPrompt?: string
  streaming?: boolean
}

/** Chat adapter interface - implemented by SDK-specific adapters */
export interface ChatAdapter {
  /** Send a message and get response */
  sendMessage: (
    content: string,
    attachments?: MessageAttachment[]
  ) => Promise<void>

  /** Stop current generation */
  stopGeneration: () => void

  /** Regenerate last response */
  regenerate: (messageId?: string) => Promise<void>

  /** Handle tool approval */
  approveTool?: (toolId: string) => Promise<void>

  /** Handle tool rejection */
  rejectTool?: (toolId: string, reason?: string) => Promise<void>

  /** Get current messages */
  getMessages: () => ChatMessage[]

  /** Get stream status */
  getStreamStatus: () => StreamStatus

  /** Get active tools */
  getActiveTools: () => ToolExecution[]

  /** Get thinking steps */
  getThinkingSteps: () => ThinkingStep[]

  /** Subscribe to state changes */
  subscribe: (callback: () => void) => () => void

  /** Set configuration */
  setConfig?: (config: Partial<ChatConfig>) => void
}

/** Clarity event types */
export type ClarityEventType =
  | 'message:sending'
  | 'message:sent'
  | 'message:received'
  | 'message:error'
  | 'stream:start'
  | 'stream:chunk'
  | 'stream:end'
  | 'stream:error'
  | 'tool:start'
  | 'tool:approval:required'
  | 'tool:approved'
  | 'tool:rejected'
  | 'tool:complete'
  | 'tool:error'
  | 'thinking:start'
  | 'thinking:step'
  | 'thinking:end'
  | 'suggestion:selected'
  | 'attachment:added'
  | 'attachment:removed'

/** Clarity event */
export interface ClarityEvent {
  type: ClarityEventType
  payload?: unknown
  timestamp: Date
}

/** Event handler */
export type ClarityEventHandler = (event: ClarityEvent) => void

/** Context value */
export interface ClarityChatContextValue {
  // State
  messages: ChatMessage[]
  streamStatus: StreamStatus
  activeTools: ToolExecution[]
  pendingApprovals: ToolExecution[]
  thinkingSteps: ThinkingStep[]
  config: ChatConfig

  // Computed
  isStreaming: boolean
  isThinking: boolean
  lastMessage: ChatMessage | null
  streamingMessage: ChatMessage | null

  // Actions
  sendMessage: (content: string, attachments?: MessageAttachment[]) => Promise<void>
  stopGeneration: () => void
  regenerate: (messageId?: string) => Promise<void>
  approveTool: (toolId: string) => Promise<void>
  rejectTool: (toolId: string, reason?: string) => Promise<void>
  updateConfig: (config: Partial<ChatConfig>) => void
  clearMessages: () => void

  // Events
  emit: (type: ClarityEventType, payload?: unknown) => void
  on: (type: ClarityEventType, handler: ClarityEventHandler) => () => void

  // Adapter
  adapter: ChatAdapter | null
}

/** Provider props */
export interface ClarityChatProviderProps {
  children: React.ReactNode
  /** Chat adapter (from createVercelAIAdapter, etc.) */
  adapter?: ChatAdapter
  /** Initial configuration */
  config?: ChatConfig
  /** Initial messages */
  initialMessages?: ChatMessage[]
  /** Callback when messages change */
  onMessagesChange?: (messages: ChatMessage[]) => void
  /** Callback on error */
  onError?: (error: Error) => void
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_STREAM_STATUS: StreamStatus = {
  isStreaming: false,
  phase: 'idle',
  progress: 0,
  tokensUsed: 0,
}

const DEFAULT_CONFIG: ChatConfig = {
  streaming: true,
}

// ============================================================================
// Context
// ============================================================================

const ClarityChatContext = React.createContext<ClarityChatContextValue | null>(null)

// ============================================================================
// Mock Adapter (for standalone usage)
// ============================================================================

function createMockAdapter(
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setStreamStatus: React.Dispatch<React.SetStateAction<StreamStatus>>,
  setThinkingSteps: React.Dispatch<React.SetStateAction<ThinkingStep[]>>
): ChatAdapter {
  let messages: ChatMessage[] = []
  let streamStatus = DEFAULT_STREAM_STATUS
  let thinkingSteps: ThinkingStep[] = []
  const subscribers = new Set<() => void>()

  const notify = () => {
    subscribers.forEach((cb) => cb())
  }

  return {
    sendMessage: async (content, attachments) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date(),
        status: 'complete',
        attachments,
      }
      messages = [...messages, userMessage]
      setMessages(messages)

      // Simulate streaming response
      setStreamStatus({ ...DEFAULT_STREAM_STATUS, isStreaming: true, phase: 'connecting' })

      // Add thinking
      const thinkingStep: ThinkingStep = {
        id: `think-${Date.now()}`,
        content: 'Processing your request...',
        status: 'active',
        timestamp: new Date(),
      }
      thinkingSteps = [thinkingStep]
      setThinkingSteps(thinkingSteps)

      await new Promise((r) => setTimeout(r, 500))

      // Start assistant message
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
        status: 'streaming',
      }
      messages = [...messages, assistantMessage]
      setMessages(messages)
      setStreamStatus({ ...DEFAULT_STREAM_STATUS, isStreaming: true, phase: 'receiving' })

      // Simulate streaming
      const response = `I received your message: "${content}". This is a mock response from the ClarityChatProvider. Connect a real adapter for actual AI responses.`
      for (let i = 0; i < response.length; i += 5) {
        await new Promise((r) => setTimeout(r, 20))
        const updatedMessage = {
          ...assistantMessage,
          content: response.slice(0, i + 5),
        }
        messages = [...messages.slice(0, -1), updatedMessage]
        setMessages(messages)
        setStreamStatus({
          isStreaming: true,
          phase: 'receiving',
          progress: (i / response.length) * 100,
          tokensUsed: Math.floor(i / 4),
        })
      }

      // Complete
      const finalMessage = { ...assistantMessage, content: response, status: 'complete' as const }
      messages = [...messages.slice(0, -1), finalMessage]
      setMessages(messages)

      thinkingSteps = [{ ...thinkingStep, status: 'complete' }]
      setThinkingSteps(thinkingSteps)

      setStreamStatus({ ...DEFAULT_STREAM_STATUS, phase: 'complete', progress: 100 })
      notify()
    },

    stopGeneration: () => {
      setStreamStatus({ ...DEFAULT_STREAM_STATUS, phase: 'idle' })
      notify()
    },

    regenerate: async () => {
      // Remove last assistant message and resend
      if (messages.length >= 2) {
        const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')
        if (lastUserMessage) {
          messages = messages.filter((m) => m.id !== messages[messages.length - 1].id)
          setMessages(messages)
          // Note: Would call sendMessage here in real implementation
        }
      }
    },

    getMessages: () => messages,
    getStreamStatus: () => streamStatus,
    getActiveTools: () => [],
    getThinkingSteps: () => thinkingSteps,

    subscribe: (callback) => {
      subscribers.add(callback)
      return () => subscribers.delete(callback)
    },
  }
}

// ============================================================================
// Provider Component
// ============================================================================

/**
 * ClarityChatProvider - Unified context for all clarity-chat components
 */
export function ClarityChatProvider({
  children,
  adapter: externalAdapter,
  config: initialConfig = DEFAULT_CONFIG,
  initialMessages = [],
  onMessagesChange,
  onError,
}: ClarityChatProviderProps) {
  // State
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages)
  const [streamStatus, setStreamStatus] = React.useState<StreamStatus>(DEFAULT_STREAM_STATUS)
  const [activeTools, setActiveTools] = React.useState<ToolExecution[]>([])
  const [thinkingSteps, setThinkingSteps] = React.useState<ThinkingStep[]>([])
  const [config, setConfig] = React.useState<ChatConfig>(initialConfig)

  // Event handlers
  const eventHandlersRef = React.useRef<Map<ClarityEventType, Set<ClarityEventHandler>>>(new Map())

  // Create mock adapter if none provided
  const mockAdapter = React.useMemo(
    () => createMockAdapter(setMessages, setStreamStatus, setThinkingSteps),
    []
  )
  const adapter = externalAdapter || mockAdapter

  // Sync with external adapter
  React.useEffect(() => {
    if (!externalAdapter) return

    const unsubscribe = externalAdapter.subscribe(() => {
      setMessages(externalAdapter.getMessages())
      setStreamStatus(externalAdapter.getStreamStatus())
      setActiveTools(externalAdapter.getActiveTools())
      setThinkingSteps(externalAdapter.getThinkingSteps())
    })

    // Initial sync
    setMessages(externalAdapter.getMessages())
    setStreamStatus(externalAdapter.getStreamStatus())
    setActiveTools(externalAdapter.getActiveTools())
    setThinkingSteps(externalAdapter.getThinkingSteps())

    return unsubscribe
  }, [externalAdapter])

  // Notify on messages change
  React.useEffect(() => {
    onMessagesChange?.(messages)
  }, [messages, onMessagesChange])

  // Computed values
  const isStreaming = streamStatus.isStreaming
  const isThinking = thinkingSteps.some((s) => s.status === 'active')
  const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
  const streamingMessage = messages.find((m) => m.status === 'streaming') || null
  const pendingApprovals = activeTools.filter((t) => t.status === 'pending' && t.requiresApproval)

  // Actions
  const sendMessage = React.useCallback(
    async (content: string, attachments?: MessageAttachment[]) => {
      try {
        emit('message:sending', { content, attachments })
        await adapter.sendMessage(content, attachments)
        emit('message:sent', { content })
      } catch (error) {
        emit('message:error', { error })
        onError?.(error as Error)
      }
    },
    [adapter, onError]
  )

  const stopGeneration = React.useCallback(() => {
    adapter.stopGeneration()
    emit('stream:end', {})
  }, [adapter])

  const regenerate = React.useCallback(
    async (messageId?: string) => {
      try {
        await adapter.regenerate(messageId)
      } catch (error) {
        onError?.(error as Error)
      }
    },
    [adapter, onError]
  )

  const approveTool = React.useCallback(
    async (toolId: string) => {
      if (adapter.approveTool) {
        emit('tool:approved', { toolId })
        await adapter.approveTool(toolId)
      }
    },
    [adapter]
  )

  const rejectTool = React.useCallback(
    async (toolId: string, reason?: string) => {
      if (adapter.rejectTool) {
        emit('tool:rejected', { toolId, reason })
        await adapter.rejectTool(toolId, reason)
      }
    },
    [adapter]
  )

  const updateConfig = React.useCallback(
    (updates: Partial<ChatConfig>) => {
      setConfig((prev) => ({ ...prev, ...updates }))
      adapter.setConfig?.(updates)
    },
    [adapter]
  )

  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  // Event system
  const emit = React.useCallback((type: ClarityEventType, payload?: unknown) => {
    const event: ClarityEvent = { type, payload, timestamp: new Date() }
    const handlers = eventHandlersRef.current.get(type)
    handlers?.forEach((handler) => handler(event))
  }, [])

  const on = React.useCallback((type: ClarityEventType, handler: ClarityEventHandler) => {
    if (!eventHandlersRef.current.has(type)) {
      eventHandlersRef.current.set(type, new Set())
    }
    eventHandlersRef.current.get(type)!.add(handler)

    return () => {
      eventHandlersRef.current.get(type)?.delete(handler)
    }
  }, [])

  // Context value
  const value: ClarityChatContextValue = {
    // State
    messages,
    streamStatus,
    activeTools,
    pendingApprovals,
    thinkingSteps,
    config,

    // Computed
    isStreaming,
    isThinking,
    lastMessage,
    streamingMessage,

    // Actions
    sendMessage,
    stopGeneration,
    regenerate,
    approveTool,
    rejectTool,
    updateConfig,
    clearMessages,

    // Events
    emit,
    on,

    // Adapter
    adapter,
  }

  return (
    <ClarityChatContext.Provider value={value}>
      {children}
    </ClarityChatContext.Provider>
  )
}

// ============================================================================
// Hooks
// ============================================================================

/**
 * Hook to access the ClarityChat context
 */
export function useClarityChat(): ClarityChatContextValue {
  const context = React.useContext(ClarityChatContext)
  if (!context) {
    throw new Error('useClarityChat must be used within a ClarityChatProvider')
  }
  return context
}

/**
 * Hook to check if inside ClarityChatProvider
 */
export function useIsConnected(): boolean {
  const context = React.useContext(ClarityChatContext)
  return context !== null
}

/**
 * Hook to access only messages
 */
export function useChatMessages() {
  const { messages, lastMessage, streamingMessage } = useClarityChat()
  return { messages, lastMessage, streamingMessage }
}

/**
 * Hook to access only stream status
 */
export function useChatStreamStatus() {
  const { streamStatus, isStreaming } = useClarityChat()
  return { streamStatus, isStreaming }
}

/**
 * Hook to access only tools
 */
export function useChatTools() {
  const { activeTools, pendingApprovals, approveTool, rejectTool } = useClarityChat()
  return { activeTools, pendingApprovals, approveTool, rejectTool }
}

/**
 * Hook to access only thinking state
 */
export function useChatThinking() {
  const { thinkingSteps, isThinking } = useClarityChat()
  return { thinkingSteps, isThinking }
}

/**
 * Hook to access chat actions
 */
export function useChatActions() {
  const { sendMessage, stopGeneration, regenerate, clearMessages } = useClarityChat()
  return { sendMessage, stopGeneration, regenerate, clearMessages }
}

/**
 * Hook to access event system
 */
export function useChatEvents() {
  const { emit, on } = useClarityChat()
  return { emit, on }
}

/**
 * Hook to subscribe to specific event
 */
export function useChatEvent(type: ClarityEventType, handler: ClarityEventHandler) {
  const { on } = useClarityChat()

  React.useEffect(() => {
    return on(type, handler)
  }, [on, type, handler])
}

export default ClarityChatProvider
