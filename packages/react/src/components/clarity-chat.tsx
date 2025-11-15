/**
<<<<<<< HEAD
 * ClarityChat - Drop-in ready AI chat component
 * 
 * This is the simplest way to add AI chat to your application.
 * It handles all the complexity internally - message conversion, error handling,
 * network status, token tracking, and more.
 * 
 * @example
 * ```tsx
 * // Minimal usage - just works!
 * import { ClarityChat } from '@clarity-chat/react'
 * 
 * export default function App() {
=======
 * ClarityChat - Top-Level Drop-in Component
 * 
 * The simplest way to add AI chat to your app. Just provide an API endpoint
 * and you're done. All the complexity is handled internally.
 * 
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat UI
 * 
 * This is the recommended entry point for most use cases. For more control,
 * use mid-level APIs like `ChatWindow` + `useClarityChat` + `useChatHandlers`.
 * 
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 * import '@clarity-chat/react/styles.css'
 * 
 * function App() {
>>>>>>> 35e277aaf5bac860785007d4ddd7fbd8582edbe5
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 * 
 * @example
 * ```tsx
 * // Customized usage
 * import { ClarityChat } from '@clarity-chat/react'
 * 
 * export default function App() {
 *   return (
 *     <ClarityChat
 *       api="/api/chat"
 *       theme="dark"
 *       enableMemory
 *       showTokenCounter
 *       onMessageSent={(msg) => console.log('Sent:', msg)}
 *     />
 *   )
 * }
=======
 * // With memory enabled
 * <ClarityChat 
 *   api="/api/chat"
 *   memory={{ enabled: true, strategy: 'vector-store' }}
 * />
>>>>>>> 35e277aaf5bac860785007d4ddd7fbd8582edbe5
 * ```
 */

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from '../hooks/use-clarity-chat'
<<<<<<< HEAD
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
// Also available as coreMessagesToMessages for convenience
import { ChatWindow } from './chat-window'
import { ErrorBoundary } from './error-boundary'
import { NetworkStatus } from './network-status'
import { TokenCounter } from './token-counter'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import { useTokenTracker } from '../hooks/use-token-tracker'
import { useMediaQuery } from '../hooks/use-media-query'
import { validateApiEndpoint, validateMemoryStrategy, validateMessages } from '../utils/runtime-validation'
import type { Message } from '@clarity-chat/types'

/**
 * Simplified props for ClarityChat component
 * Only the essentials are required - everything else has sensible defaults
 */
export interface ClarityChatProps {
  /** API endpoint URL - required */
  api: string
  
  /** Initial messages (optional) */
  initialMessages?: Message[]
  
  /** Additional body data to send with requests */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Theme name (optional) */
  theme?: string
  
  /** Enable memory integration */
  enableMemory?: boolean
  
  /** Memory strategy */
  memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  
  /** Show token counter */
  showTokenCounter?: boolean
  
  /** Show network status indicator */
  showNetworkStatus?: boolean
  
  /** Show header with session info */
  showHeader?: boolean
  
  /** Session title */
  sessionTitle?: string
  
  /** Session subtitle */
  sessionSubtitle?: string
  
  /** Enable message operations (edit, regenerate, delete) */
  enableMessageOperations?: boolean
  
  /** Callback when message is sent */
  onMessageSent?: (message: Message) => void
  
  /** Callback when message is received */
  onMessageReceived?: (message: Message) => void
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback when message is edited */
  onMessageEdit?: (messageId: string, newContent: string) => void
  
  /** Callback when message is regenerated */
  onMessageRegenerate?: (messageId: string) => void
  
  /** Callback when message is deleted */
  onMessageDelete?: (messageId: string) => void
  
  /** Custom className */
  className?: string
  
  /** Advanced options - for power users */
  advancedOptions?: {
    /** Transport protocol */
    transport?: 'sse' | 'websocket'
    /** WebSocket options */
    websocket?: UseClarityChatOptions['websocket']
    /** Prompt optimization */
    promptOptimization?: UseClarityChatOptions['promptOptimization']
    /** Custom fetch implementation */
    fetch?: typeof fetch
    /** Transform messages before sending */
    transform?: UseClarityChatOptions['transform']
  }
}

/**
 * ClarityChat - The simplest way to add AI chat to your app
 * 
 * This component wraps ChatWindow with useClarityChat and handles all the
 * complexity internally. Just provide an API endpoint and you're done!
 */
export function ClarityChat({
  api,
  initialMessages = [],
  body,
  headers,
  theme,
  enableMemory = false,
  memoryStrategy = 'sliding-window',
  showTokenCounter = true,
  showNetworkStatus = true,
  showHeader = false,
  sessionTitle = 'Chat',
  sessionSubtitle,
  enableMessageOperations = true,
  onMessageSent,
  onMessageReceived,
  onError,
  onMessageEdit,
  onMessageRegenerate,
  onMessageDelete,
  className,
  advancedOptions,
}: ClarityChatProps) {
  // Runtime validation
  React.useEffect(() => {
    try {
      validateApiEndpoint(api)
      if (initialMessages.length > 0) {
        validateMessages(initialMessages)
      }
      if (enableMemory) {
        validateMemoryStrategy(memoryStrategy)
      }
    } catch (error) {
      // Call error handler if provided, otherwise log
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      } else if (process.env['NODE_ENV'] === 'development') {
        console.error('[ClarityChat] Validation error:', error)
      }
      // Re-throw in development to help developers catch issues early
      if (process.env['NODE_ENV'] === 'development') {
        throw error
      }
    }
  }, [api, initialMessages, enableMemory, memoryStrategy, onError])
  // Convert initial messages to CoreMessage format if needed
  const initialCoreMessages = React.useMemo(() => {
    if (initialMessages.length === 0) return []
    return initialMessages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }))
  }, [initialMessages])

  // Configure useClarityChat hook
  const chatOptions: UseClarityChatOptions = React.useMemo(() => ({
    api,
    initialMessages: initialCoreMessages,
    body,
    headers,
    memory: enableMemory ? {
      enabled: true,
      strategy: memoryStrategy,
    } : undefined,
    transport: advancedOptions?.transport,
    websocket: advancedOptions?.websocket,
    promptOptimization: advancedOptions?.promptOptimization,
    fetch: advancedOptions?.fetch,
    transform: advancedOptions?.transform,
    onFinish: (message) => {
      // Convert CoreMessage to Message and call callback
      const converted = convertCoreMessagesToMessages([message])[0]
      onMessageReceived?.(converted)
    },
    onError: (error) => {
      onError?.(error)
    },
  }), [
    api,
    initialCoreMessages,
    body,
    headers,
    enableMemory,
    memoryStrategy,
    advancedOptions,
    onMessageReceived,
    onError,
  ])

  // Use the flagship hook
  const {
    messages: coreMessages,
    append,
    isLoading,
    error: chatError,
  } = useClarityChat(chatOptions)

  // Convert CoreMessages to Messages for ChatWindow
  const messages = React.useMemo(() => {
    return convertCoreMessagesToMessages(coreMessages)
  }, [coreMessages])

  // Auto-scroll setup
  const { scrollRef, scrollToBottom } = useAutoScroll({
    enabled: true,
    behavior: 'smooth',
    dependencies: [messages],
  })

  // Token tracking (if enabled)
  const tokenTracker = useTokenTracker({
    modelName: 'gpt-3.5-turbo', // Default, can be overridden via advancedOptions
    enabled: showTokenCounter,
  })

  // Responsive design
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Handle sending messages
  const handleSendMessage = React.useCallback(async (content: string) => {
    try {
      // Create user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        chatId: 'default',
        role: 'user',
        content,
        status: 'sending',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Call callback
      onMessageSent?.(userMessage)

      // Send via hook
      await append({
        role: 'user',
        content,
      })

      // Track tokens (rough estimate: 1 token ≈ 4 chars)
      if (showTokenCounter) {
        const tokens = Math.ceil(content.length / 4)
        tokenTracker.addInputTokens(tokens)
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send message')
      onError?.(error)
    }
  }, [append, onMessageSent, onError, showTokenCounter, tokenTracker])

  // Handle message edit
  const handleEditMessage = React.useCallback((messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (message) {
      const newContent = prompt('Edit message:', message.content) || message.content
      if (newContent !== message.content) {
        onMessageEdit?.(messageId, newContent)
      }
    }
  }, [messages, onMessageEdit])

  // Handle message regenerate
  const handleRegenerateMessage = React.useCallback(async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message || message.role !== 'assistant') return

    // Find the user message that prompted this response
    const messageIndex = messages.findIndex(m => m.id === messageId)
    const previousUserMessage = messages[messageIndex - 1]

    if (previousUserMessage && previousUserMessage.role === 'user') {
      // Delete old message
      onMessageDelete?.(messageId)

      // Regenerate by sending the user message again
      await append({
        role: 'user',
        content: previousUserMessage.content,
      })

      onMessageRegenerate?.(messageId)
    }
  }, [messages, append, onMessageRegenerate, onMessageDelete])

  // Handle message delete
  const handleDeleteMessage = React.useCallback((messageId: string) => {
    if (confirm('Delete this message?')) {
      onMessageDelete?.(messageId)
    }
  }, [onMessageDelete])

  // Error display
  const errorDisplay = chatError ? (
    <div
      style={{
        padding: '1rem',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        margin: '1rem',
        flexShrink: 0,
      }}
    >
      <p style={{ margin: 0, color: '#991b1b', fontSize: '0.875rem' }}>
        {chatError.message}
      </p>
    </div>
  ) : null

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto',
          }}
        >
          <h1 style={{ color: '#dc2626', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Reload Page
          </button>
        </div>
      )}
    >
      <div
        ref={scrollRef}
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '800px',
          height: isMobile ? '100vh' : '600px',
          display: 'flex',
          flexDirection: 'column',
          border: isMobile ? 'none' : '1px solid #e5e7eb',
          borderRadius: isMobile ? 0 : '0.5rem',
          overflow: 'hidden',
          background: 'white',
        }}
        className={className}
      >
        {/* Header with token counter and network status */}
        {(showTokenCounter || showNetworkStatus || showHeader) && (
          <div
            style={{
              padding: '1rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0,
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {showHeader && (
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>
                  {sessionTitle}
                </h2>
                {sessionSubtitle && (
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                    {sessionSubtitle}
                  </p>
                )}
              </div>
            )}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {showTokenCounter && (
                <TokenCounter
                  tokens={tokenTracker.totalTokens}
                  cost={tokenTracker.estimatedCost}
                  compact={isMobile}
                />
              )}
              {showNetworkStatus && <NetworkStatus />}
            </div>
          </div>
        )}

        {/* Error display */}
        {errorDisplay}

        {/* Chat window */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onEditMessage={enableMessageOperations ? handleEditMessage : undefined}
            onRegenerateMessage={enableMessageOperations ? handleRegenerateMessage : undefined}
            onDeleteMessage={enableMessageOperations ? handleDeleteMessage : undefined}
            showHeader={showHeader}
            sessionTitle={sessionTitle}
            sessionSubtitle={sessionSubtitle}
          />
        </div>
      </div>
    </ErrorBoundary>
=======
import { ChatWindow } from './chat-window'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import type { CoreMessage } from '../hooks/use-chat-enhanced'

export interface ClarityChatProps extends Omit<UseClarityChatOptions, 'api'> {
  /** API endpoint URL - the only required prop */
  api: string
  /** Optional className for the chat container */
  className?: string
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Show header with session info */
  showHeader?: boolean
  /** Session title */
  sessionTitle?: string
  /** Session subtitle */
  sessionSubtitle?: string
  /** Header actions */
  headerActions?: React.ReactNode
  /** Show message count badge */
  showMessageCount?: boolean
  /** Enable export functionality */
  onExport?: () => void
  /** Enable clear chat functionality */
  onClear?: () => void
}

/**
 * ClarityChat - All-in-one chat component
 * 
 * This is the recommended way to use Clarity Chat. It combines the hook
 * and component into a single, easy-to-use interface.
 * 
 * Features:
 * - Automatic message format conversion
 * - Built-in loading states
 * - Error handling
 * - Memory support (when configured)
 * - Streaming support
 * - All ChatWindow features
 * 
 * @example Basic usage
 * ```tsx
 * <ClarityChat api="/api/chat" />
 * ```
 * 
 * @example With memory
 * ```tsx
 * <ClarityChat 
 *   api="/api/chat"
 *   memory={{ enabled: true, strategy: 'sliding-window' }}
 * />
 * ```
 * 
 * @example With custom styling
 * ```tsx
 * <ClarityChat 
 *   api="/api/chat"
 *   className="h-screen"
 *   showHeader
 *   sessionTitle="AI Assistant"
 * />
 * ```
 */
export function ClarityChat({
  api,
  className,
  emptyState,
  showHeader,
  sessionTitle,
  sessionSubtitle,
  headerActions,
  showMessageCount,
  onExport,
  onClear,
  ...hookOptions
}: ClarityChatProps) {
  // Validate required prop with helpful error message
  if (!api || typeof api !== 'string' || api.trim().length === 0) {
    throw new Error(
      'ClarityChat: "api" prop is required.\n' +
      'Please provide your API endpoint URL.\n\n' +
      'Example:\n' +
      '  <ClarityChat api="/api/chat" />\n\n' +
      'Or use environment variable:\n' +
      '  CLARITY_CHAT_API=/api/chat\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/getting-started'
    )
  }

  const chat = useClarityChat({
    api,
    ...hookOptions,
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages),
    [chat.messages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await chat.append({ role: 'user', content })
    },
    [chat]
  )

  const handleClear = React.useCallback(() => {
    chat.setMessages([])
    onClear?.()
  }, [chat, onClear])

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={handleSendMessage}
      className={className}
      emptyState={emptyState}
      showHeader={showHeader}
      sessionTitle={sessionTitle}
      sessionSubtitle={sessionSubtitle}
      headerActions={headerActions}
      showMessageCount={showMessageCount}
      onExport={onExport}
      onClear={onClear ? handleClear : undefined}
    />
>>>>>>> 35e277aaf5bac860785007d4ddd7fbd8582edbe5
  )
}

ClarityChat.displayName = 'ClarityChat'
