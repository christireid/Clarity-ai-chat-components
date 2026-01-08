'use client'

import React, { useMemo, useCallback } from 'react'
import type { Message } from '@clarity-chat/types'
import type { ClarityChatAppProps, ClarityEvent } from './types'
import { useClarityChatApp } from './use-clarity-chat-app'
import { resolveConfig, isFeatureEnabled } from './resolve-config'
import { formatErrorForDisplay, type ClarityError } from './dx-hints'

// =============================================================================
// Internal Components
// =============================================================================

/**
 * Default message renderer
 */
function DefaultMessageRenderer({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`clarity-message clarity-message-${message.role}`}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '12px',
      }}
    >
      <div
        style={{
          maxWidth: '80%',
          padding: '12px 16px',
          borderRadius: '12px',
          backgroundColor: isUser ? '#0066cc' : '#f0f0f0',
          color: isUser ? 'white' : 'black',
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
        {message.createdAt && (
          <div
            style={{
              fontSize: '0.75rem',
              opacity: 0.7,
              marginTop: '4px',
            }}
          >
            {new Date(message.createdAt).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Default input renderer
 */
function DefaultInputRenderer({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = 'Type a message...',
}: {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit: () => void
  isLoading: boolean
  placeholder?: string
}) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        onSubmit()
      }
    },
    [onSubmit]
  )

  return (
    <div
      className="clarity-input-container"
      style={{
        display: 'flex',
        gap: '8px',
        padding: '12px',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        style={{
          flex: 1,
          padding: '12px',
          borderRadius: '8px',
          border: '1px solid #d0d0d0',
          resize: 'none',
          minHeight: '44px',
          maxHeight: '120px',
          fontFamily: 'inherit',
          fontSize: '14px',
        }}
        rows={1}
      />
      <button
        onClick={onSubmit}
        disabled={isLoading || !value.trim()}
        style={{
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          backgroundColor: isLoading || !value.trim() ? '#ccc' : '#0066cc',
          color: 'white',
          cursor: isLoading || !value.trim() ? 'not-allowed' : 'pointer',
          fontWeight: 500,
        }}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </div>
  )
}

/**
 * Default header renderer
 */
function DefaultHeader({ title = 'Chat' }: { title?: string }) {
  return (
    <div
      className="clarity-header"
      style={{
        padding: '16px',
        borderBottom: '1px solid #e0e0e0',
        fontWeight: 600,
        fontSize: '18px',
      }}
    >
      {title}
    </div>
  )
}

/**
 * Default empty state
 */
function DefaultEmptyState() {
  return (
    <div
      className="clarity-empty-state"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#666',
        padding: '32px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
      <div style={{ fontSize: '18px', fontWeight: 500, marginBottom: '8px' }}>
        Start a conversation
      </div>
      <div style={{ fontSize: '14px', opacity: 0.8 }}>
        Send a message to begin chatting
      </div>
    </div>
  )
}

/**
 * Default loading indicator
 */
function DefaultLoadingIndicator() {
  return (
    <div
      className="clarity-loading"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 16px',
        color: '#666',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: '#0066cc',
          animation: 'clarity-pulse 1s ease-in-out infinite',
        }}
      />
      <span>Thinking...</span>
    </div>
  )
}

/**
 * Default error display with actionable suggestions
 */
function DefaultErrorDisplay({
  error,
  retry,
}: {
  error: Error
  retry?: () => void
}) {
  const formatted = formatErrorForDisplay(error)

  return (
    <div
      className="clarity-error"
      style={{
        padding: '12px 16px',
        margin: '12px',
        borderRadius: '8px',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#991b1b',
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span style={{ fontSize: '16px' }}>!</span>
        {formatted.title}
      </div>
      <div
        style={{
          fontSize: '14px',
          marginBottom: formatted.suggestion ? '8px' : '0',
        }}
      >
        {formatted.message}
      </div>
      {formatted.suggestion && (
        <div
          style={{
            fontSize: '13px',
            color: '#7f1d1d',
            backgroundColor: '#fef2f2',
            padding: '8px',
            borderRadius: '4px',
            border: '1px dashed #fca5a5',
          }}
        >
          <strong>Suggestion:</strong> {formatted.suggestion}
        </div>
      )}
      {formatted.canRetry && retry && (
        <button
          onClick={retry}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#991b1b',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          Retry
        </button>
      )}
    </div>
  )
}

/**
 * Token stats display
 */
function TokenStatsDisplay({
  inputTokens,
  outputTokens,
  utilization,
  budgetRemaining,
}: {
  inputTokens: number
  outputTokens: number
  utilization: number
  budgetRemaining: number
}) {
  return (
    <div
      className="clarity-token-stats"
      style={{
        display: 'flex',
        gap: '16px',
        padding: '8px 16px',
        fontSize: '12px',
        color: '#666',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <span>Input: {inputTokens}</span>
      <span>Output: {outputTokens}</span>
      <span>Budget: {budgetRemaining} remaining</span>
      <span>Utilization: {(utilization * 100).toFixed(1)}%</span>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * ClarityChatApp - The unified, easy-to-use chat component
 *
 * A single component that encapsulates all advanced features behind simple
 * flags and curated defaults. Enable memory, token optimization, tools,
 * RAG, and safety with zero additional imports.
 *
 * @example Basic usage (3-minute setup)
 * ```tsx
 * <ClarityChatApp api="/api/chat" />
 * ```
 *
 * @example With memory enabled (one flag)
 * ```tsx
 * <ClarityChatApp api="/api/chat" features={{ memory: true }} />
 * ```
 *
 * @example Using a preset
 * ```tsx
 * <ClarityChatApp api="/api/chat" preset="pro" />
 * ```
 *
 * @example Enterprise configuration with overrides
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   preset="enterprise"
 *   config={{
 *     tokenOptimization: { budget: 16000 },
 *     memory: { strategy: 'vector-store' },
 *   }}
 * />
 * ```
 *
 * @example With RAG sources
 * ```tsx
 * <ClarityChatApp
 *   api="/api/chat"
 *   sources={[
 *     { type: 'text', content: 'Your document content...' },
 *   ]}
 * />
 * ```
 */
export function ClarityChatApp({
  api,
  preset,
  features,
  config,
  initialMessages,
  systemPrompt,
  model,
  sources,
  onEvent,
  onError,
  onMessageSent,
  onMessageReceived,
  header,
  footer,
  className,
  children,
}: ClarityChatAppProps) {
  // Resolve configuration
  const resolvedConfig = useMemo(
    () => resolveConfig({ preset, features, config, model, sources }),
    [preset, features, config, model, sources]
  )

  // Event handler that combines all callbacks
  const handleEvent = useCallback(
    (event: ClarityEvent) => {
      onEvent?.(event)

      if (event.type === 'message:sent' && onMessageSent) {
        onMessageSent(event.data['message'] as Message)
      }
      if (event.type === 'message:received' && onMessageReceived) {
        onMessageReceived(event.data['message'] as Message)
      }
      if (event.type === 'message:error' && onError) {
        onError(new Error(event.data['error'] as string))
      }
    },
    [onEvent, onMessageSent, onMessageReceived, onError]
  )

  // Use the unified hook
  const chat = useClarityChatApp({
    api,
    preset,
    features,
    config,
    initialMessages,
    systemPrompt,
    model,
    sources,
    onEvent: handleEvent,
  })

  // Get UI components (custom or default)
  const components = resolvedConfig.ui.components
  const MessageRenderer = components?.MessageRenderer ?? DefaultMessageRenderer
  const InputRenderer = components?.InputRenderer
  const HeaderComponent = components?.Header ?? DefaultHeader
  const EmptyState = components?.EmptyState ?? DefaultEmptyState
  const LoadingIndicator =
    components?.LoadingIndicator ?? DefaultLoadingIndicator
  const ErrorDisplay = components?.ErrorDisplay ?? DefaultErrorDisplay

  // Determine if token stats should be shown
  const showTokenStats =
    isFeatureEnabled(resolvedConfig, 'tokenOptimization') &&
    resolvedConfig.tokenOptimization.showStats

  return (
    <div
      className={`clarity-chat-app ${className ?? ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '400px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      {header ?? <HeaderComponent title="Chat" />}

      {/* Messages area */}
      <div
        className="clarity-messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
        }}
      >
        {chat.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {chat.messages.map((message) => (
              <MessageRenderer key={message.id} message={message} />
            ))}
            {chat.isLoading && <LoadingIndicator />}
          </>
        )}
      </div>

      {/* Error display */}
      {chat.error && <ErrorDisplay error={chat.error} retry={chat.retry} />}

      {/* Token stats */}
      {showTokenStats && (
        <TokenStatsDisplay
          inputTokens={chat.meta.token.inputTokens}
          outputTokens={chat.meta.token.outputTokens}
          utilization={chat.meta.token.utilization}
          budgetRemaining={chat.meta.token.budgetRemaining}
        />
      )}

      {/* Input area */}
      {InputRenderer ? (
        <InputRenderer onSubmit={() => chat.handleSubmit()} />
      ) : (
        <DefaultInputRenderer
          value={chat.input}
          onChange={chat.handleInputChange}
          onSubmit={chat.handleSubmit}
          isLoading={chat.isLoading}
        />
      )}

      {/* Footer */}
      {footer}

      {/* Children for composition */}
      {children}

      {/* Styles */}
      <style>{`
        @keyframes clarity-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

// =============================================================================
// Context for Advanced Usage
// =============================================================================

import { createContext, useContext } from 'react'
import type { UseClarityChatAppReturn } from './types'

const ClarityChatAppContext = createContext<UseClarityChatAppReturn | null>(
  null
)

/**
 * Hook to access ClarityChatApp state from child components
 */
export function useClarityChatAppContext(): UseClarityChatAppReturn {
  const context = useContext(ClarityChatAppContext)
  if (!context) {
    throw new Error(
      'useClarityChatAppContext must be used within a ClarityChatApp component'
    )
  }
  return context
}

/**
 * Provider version of ClarityChatApp for headless usage
 */
export function ClarityChatAppProvider({
  children,
  ...props
}: Omit<ClarityChatAppProps, 'children'> & { children: React.ReactNode }) {
  const chat = useClarityChatApp({
    api: props.api,
    preset: props.preset,
    features: props.features,
    config: props.config,
    initialMessages: props.initialMessages,
    systemPrompt: props.systemPrompt,
    model: props.model,
    sources: props.sources,
    onEvent: props.onEvent,
  })

  return (
    <ClarityChatAppContext.Provider value={chat}>
      {children}
    </ClarityChatAppContext.Provider>
  )
}
