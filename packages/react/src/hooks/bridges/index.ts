'use client'

/**
 * SDK Bridge Hooks
 *
 * Hooks that bridge external AI SDKs to clarity-chat components.
 * Provides consistent prop mapping for seamless integration.
 *
 * Supported SDKs:
 * - Vercel AI SDK (useChat, streamText)
 * - LangChain.js
 * - Anthropic SDK (direct)
 *
 * API Pattern (consistent across all bridges):
 * - Returns props objects for each clarity-chat component
 * - Handles state mapping internally
 * - Provides event handlers consistent with component APIs
 *
 * @example
 * ```tsx
 * // Vercel AI
 * const chat = useChat({ api: '/api/chat' })
 * const bridge = useVercelAIBridge(chat)
 * <ThinkingBar {...bridge.thinkingBarProps} />
 *
 * // LangChain
 * const langchain = useLangChain()
 * const bridge = useLangChainBridge(langchain)
 * <Conversations {...bridge.conversationsProps} />
 * ```
 */

import * as React from 'react'

// Re-export Vercel AI bridge from adapters
export {
  useVercelAIBridge,
  type VercelAIBridgeResult,
} from '../../adapters/vercel-ai'

// ============================================================================
// Common Bridge Types
// ============================================================================

/** Base bridge props structure - consistent across all bridges */
export interface BaseBridgeProps {
  /** Props for ThinkingBar component */
  thinkingBarProps: {
    isActive: boolean
    status: 'idle' | 'thinking' | 'processing' | 'complete' | 'error'
    progress?: number
    currentStep?: string
  }
  /** Props for ThinkingPill component */
  thinkingPillProps: {
    isActive: boolean
    label?: string
  }
  /** Props for StreamStatusProgress component */
  streamProgressProps: {
    progress: number
    status: 'idle' | 'connecting' | 'streaming' | 'complete' | 'error'
    tokensUsed: number
    tokensTotal?: number
    timeRemaining?: number
  }
  /** Props for Conversations component */
  conversationsProps: {
    items: Array<{
      key: string
      label: string
      messages: Array<{
        id: string
        role: string
        content: string
        createdAt?: Date
      }>
    }>
    activeKey: string
  }
  /** Props for Sender component */
  senderProps: {
    onSend: (content: string) => Promise<void>
    onStop?: () => void
    isLoading: boolean
    disabled?: boolean
    placeholder?: string
  }
  /** Props for ResponseActions component */
  responseActionsProps: {
    onRegenerate?: () => Promise<void>
    onCopy?: () => void
    isRegenerating?: boolean
  }
  /** Whether the SDK is currently loading/streaming */
  isLoading: boolean
  /** Any error that occurred */
  error?: Error
}

// ============================================================================
// LangChain Bridge Types
// ============================================================================

/** LangChain chat model interface (minimal) */
interface LangChainChatModel {
  invoke: (messages: unknown[]) => Promise<unknown>
  stream?: (messages: unknown[]) => AsyncIterable<unknown>
}

/** LangChain message */
interface LangChainMessage {
  content: string
  additional_kwargs?: Record<string, unknown>
}

/** LangChain hook return (expected interface) */
interface LangChainHookReturn {
  messages: Array<{
    type: 'human' | 'ai' | 'system'
    content: string
    id?: string
  }>
  isLoading: boolean
  error?: Error
  sendMessage: (content: string) => Promise<void>
  clear: () => void
  model?: LangChainChatModel
}

/** LangChain bridge options */
export interface LangChainBridgeOptions {
  /** LangChain hook return */
  langchain: LangChainHookReturn
  /** Custom message ID generator */
  generateId?: () => string
}

/** LangChain bridge result */
export interface LangChainBridgeResult extends BaseBridgeProps {
  /** Clear conversation */
  clearConversation: () => void
  /** LangChain model reference */
  model?: LangChainChatModel
}

// ============================================================================
// LangChain Bridge Implementation
// ============================================================================

/**
 * Hook that bridges LangChain.js to clarity-chat components
 *
 * @example
 * ```tsx
 * const langchain = useLangChainChat({ model: new ChatOpenAI() })
 * const bridge = useLangChainBridge({ langchain })
 *
 * <Conversations {...bridge.conversationsProps} />
 * <Sender {...bridge.senderProps} />
 * ```
 */
export function useLangChainBridge(
  options: LangChainBridgeOptions
): LangChainBridgeResult {
  const { langchain, generateId } = options

  // Map LangChain messages to clarity-chat format
  const messages = React.useMemo(
    () =>
      langchain.messages.map((msg, i) => ({
        id: msg.id || (generateId ? generateId() : `msg-${i}`),
        role:
          msg.type === 'human'
            ? 'user'
            : msg.type === 'ai'
              ? 'assistant'
              : 'system',
        content: msg.content,
        createdAt: new Date(),
      })),
    [langchain.messages, generateId]
  )

  const thinkingBarProps = React.useMemo(
    () => ({
      isActive: langchain.isLoading,
      status: langchain.isLoading
        ? ('thinking' as const)
        : langchain.error
          ? ('error' as const)
          : ('idle' as const),
    }),
    [langchain.isLoading, langchain.error]
  )

  const thinkingPillProps = React.useMemo(
    () => ({
      isActive: langchain.isLoading,
      label: langchain.isLoading ? 'Generating...' : undefined,
    }),
    [langchain.isLoading]
  )

  const streamProgressProps = React.useMemo(
    () => ({
      progress: langchain.isLoading ? 50 : 100,
      status: langchain.isLoading
        ? ('streaming' as const)
        : langchain.error
          ? ('error' as const)
          : ('idle' as const),
      tokensUsed: 0,
    }),
    [langchain.isLoading, langchain.error]
  )

  const conversationsProps = React.useMemo(
    () => ({
      items: [
        {
          key: 'main',
          label: 'Chat',
          messages,
        },
      ],
      activeKey: 'main',
    }),
    [messages]
  )

  const senderProps = React.useMemo(
    () => ({
      onSend: langchain.sendMessage,
      isLoading: langchain.isLoading,
      placeholder: langchain.isLoading ? 'Generating...' : 'Type a message...',
    }),
    [langchain.sendMessage, langchain.isLoading]
  )

  const responseActionsProps = React.useMemo(
    () => ({
      onRegenerate: undefined, // LangChain doesn't have built-in regenerate
      isRegenerating: false,
    }),
    []
  )

  return {
    thinkingBarProps,
    thinkingPillProps,
    streamProgressProps,
    conversationsProps,
    senderProps,
    responseActionsProps,
    isLoading: langchain.isLoading,
    error: langchain.error,
    clearConversation: langchain.clear,
    model: langchain.model,
  }
}

// ============================================================================
// Anthropic Direct Bridge Types
// ============================================================================

/** Anthropic message content */
interface AnthropicContentBlock {
  type: 'text' | 'tool_use' | 'tool_result'
  text?: string
  id?: string
  name?: string
  input?: Record<string, unknown>
}

/** Anthropic message */
interface AnthropicMessage {
  id: string
  role: 'user' | 'assistant'
  content: string | AnthropicContentBlock[]
  stop_reason?: string
  usage?: {
    input_tokens: number
    output_tokens: number
  }
}

/** Anthropic client interface (minimal) */
interface AnthropicClient {
  messages: {
    create: (params: unknown) => Promise<AnthropicMessage>
    stream?: (params: unknown) => AsyncIterable<unknown>
  }
}

/** Anthropic hook state (expected interface) */
interface AnthropicHookState {
  messages: AnthropicMessage[]
  isLoading: boolean
  error?: Error
  sendMessage: (content: string) => Promise<void>
  stopGeneration: () => void
  usage: {
    inputTokens: number
    outputTokens: number
  }
}

/** Anthropic bridge options */
export interface AnthropicBridgeOptions {
  /** Anthropic hook state */
  anthropic: AnthropicHookState
  /** Show token usage */
  showTokenUsage?: boolean
}

/** Anthropic bridge result */
export interface AnthropicBridgeResult extends BaseBridgeProps {
  /** Token usage stats */
  usage: {
    inputTokens: number
    outputTokens: number
    totalTokens: number
  }
  /** Stop generation */
  stopGeneration: () => void
}

// ============================================================================
// Anthropic Direct Bridge Implementation
// ============================================================================

/**
 * Hook that bridges Anthropic SDK directly to clarity-chat components
 *
 * @example
 * ```tsx
 * const anthropic = useAnthropicChat({ client, model: 'claude-3-opus' })
 * const bridge = useAnthropicBridge({ anthropic })
 *
 * <StreamStatusProgress {...bridge.streamProgressProps} />
 * <Conversations {...bridge.conversationsProps} />
 * ```
 */
export function useAnthropicBridge(
  options: AnthropicBridgeOptions
): AnthropicBridgeResult {
  const { anthropic, showTokenUsage = true } = options

  // Map Anthropic messages to clarity-chat format
  const messages = React.useMemo(
    () =>
      anthropic.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content:
          typeof msg.content === 'string'
            ? msg.content
            : msg.content
                .filter(
                  (c): c is AnthropicContentBlock & { text: string } =>
                    c.type === 'text'
                )
                .map((c) => c.text)
                .join(''),
        createdAt: new Date(),
      })),
    [anthropic.messages]
  )

  const totalTokens = anthropic.usage.inputTokens + anthropic.usage.outputTokens

  const thinkingBarProps = React.useMemo(
    () => ({
      isActive: anthropic.isLoading,
      status: anthropic.isLoading
        ? ('thinking' as const)
        : anthropic.error
          ? ('error' as const)
          : ('idle' as const),
      progress: anthropic.isLoading ? undefined : 100,
    }),
    [anthropic.isLoading, anthropic.error]
  )

  const thinkingPillProps = React.useMemo(
    () => ({
      isActive: anthropic.isLoading,
      label: anthropic.isLoading ? 'Claude is thinking...' : undefined,
    }),
    [anthropic.isLoading]
  )

  const streamProgressProps = React.useMemo(
    () => ({
      progress: anthropic.isLoading ? 50 : 100,
      status: anthropic.isLoading
        ? ('streaming' as const)
        : anthropic.error
          ? ('error' as const)
          : ('idle' as const),
      tokensUsed: totalTokens,
      tokensTotal: undefined,
    }),
    [anthropic.isLoading, anthropic.error, totalTokens]
  )

  const conversationsProps = React.useMemo(
    () => ({
      items: [
        {
          key: 'main',
          label: 'Chat',
          messages,
        },
      ],
      activeKey: 'main',
    }),
    [messages]
  )

  const senderProps = React.useMemo(
    () => ({
      onSend: anthropic.sendMessage,
      onStop: anthropic.stopGeneration,
      isLoading: anthropic.isLoading,
      placeholder: anthropic.isLoading
        ? 'Generating response...'
        : 'Message Claude...',
    }),
    [anthropic.sendMessage, anthropic.stopGeneration, anthropic.isLoading]
  )

  const responseActionsProps = React.useMemo(
    () => ({
      onRegenerate: undefined, // Requires custom implementation
      isRegenerating: false,
    }),
    []
  )

  return {
    thinkingBarProps,
    thinkingPillProps,
    streamProgressProps,
    conversationsProps,
    senderProps,
    responseActionsProps,
    isLoading: anthropic.isLoading,
    error: anthropic.error,
    usage: {
      inputTokens: anthropic.usage.inputTokens,
      outputTokens: anthropic.usage.outputTokens,
      totalTokens,
    },
    stopGeneration: anthropic.stopGeneration,
  }
}

// ============================================================================
// Generic Bridge Factory
// ============================================================================

/** Generic external chat state */
export interface GenericChatState<TMessage = unknown> {
  messages: TMessage[]
  isLoading: boolean
  error?: Error
  sendMessage: (content: string) => Promise<void>
  stop?: () => void
}

/** Generic bridge options */
export interface GenericBridgeOptions<TMessage = unknown> {
  /** External chat state */
  state: GenericChatState<TMessage>
  /** Map external message to clarity format */
  mapMessage: (
    message: TMessage,
    index: number
  ) => {
    id: string
    role: string
    content: string
    createdAt?: Date
  }
  /** Custom placeholder text */
  placeholder?: string
  /** Custom thinking label */
  thinkingLabel?: string
}

/**
 * Create a generic bridge for any external chat SDK
 *
 * @example
 * ```tsx
 * const customBridge = useGenericBridge({
 *   state: myCustomChatHook,
 *   mapMessage: (msg, i) => ({
 *     id: msg.id || `msg-${i}`,
 *     role: msg.sender,
 *     content: msg.text,
 *   }),
 * })
 * ```
 */
export function useGenericBridge<TMessage = unknown>(
  options: GenericBridgeOptions<TMessage>
): BaseBridgeProps {
  const {
    state,
    mapMessage,
    placeholder = 'Type a message...',
    thinkingLabel = 'Generating...',
  } = options

  const messages = React.useMemo(
    () => state.messages.map((msg, index) => mapMessage(msg, index)),
    [state.messages, mapMessage]
  )

  return {
    thinkingBarProps: {
      isActive: state.isLoading,
      status: state.error ? 'error' : state.isLoading ? 'thinking' : 'idle',
    },
    thinkingPillProps: {
      isActive: state.isLoading,
      label: state.isLoading ? thinkingLabel : undefined,
    },
    streamProgressProps: {
      progress: state.isLoading ? 50 : 100,
      status: state.isLoading ? 'streaming' : state.error ? 'error' : 'idle',
      tokensUsed: 0,
    },
    conversationsProps: {
      items: [{ key: 'main', label: 'Chat', messages }],
      activeKey: 'main',
    },
    senderProps: {
      onSend: state.sendMessage,
      onStop: state.stop,
      isLoading: state.isLoading,
      placeholder: state.isLoading ? thinkingLabel : placeholder,
    },
    responseActionsProps: {
      isRegenerating: false,
    },
    isLoading: state.isLoading,
    error: state.error,
  }
}
