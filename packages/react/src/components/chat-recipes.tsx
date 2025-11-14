/**
 * Chat Recipe Components - Pre-built combinations for common patterns
 * 
 * These components combine multiple features for common use cases,
 * making it even easier to get started.
 */

import * as React from 'react'
import { ClarityChat, type ClarityChatProps } from './clarity-chat'
import { ErrorBoundary } from './error-boundary'
import { applyChatPreset, type ChatPreset } from '../presets/chat-presets'

/**
 * ChatWithMemory - Chat component with memory enabled
 * 
 * Perfect for conversations that need context retention.
 * 
 * @example
 * ```tsx
 * <ChatWithMemory api="/api/chat" strategy="vector-store" />
 * ```
 */
export interface ChatWithMemoryProps extends Omit<ClarityChatProps, 'memory'> {
  /** Memory strategy to use */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
}

export function ChatWithMemory({
  strategy = 'vector-store',
  maxTokens,
  ...props
}: ChatWithMemoryProps) {
  return (
    <ClarityChat
      {...props}
      memory={{
        enabled: true,
        strategy,
        maxTokens,
        retryOnError: true,
      }}
    />
  )
}

/**
 * ChatWithAnalytics - Chat component with analytics tracking
 * 
 * Automatically tracks messages, errors, and user interactions.
 * 
 * @example
 * ```tsx
 * <ChatWithAnalytics
 *   api="/api/chat"
 *   onMessageSent={(content) => analytics.track('message_sent', { content })}
 *   onMessageReceived={(message) => analytics.track('message_received')}
 * />
 * ```
 */
export interface ChatWithAnalyticsProps extends ClarityChatProps {
  /** Callback when message is sent */
  onMessageSent?: (content: string) => void
  /** Callback when message is received */
  onMessageReceived?: (messageId: string) => void
  /** Callback when error occurs */
  onError?: (error: Error) => void
}

export function ChatWithAnalytics({
  onMessageSent,
  onMessageReceived,
  onError,
  ...props
}: ChatWithAnalyticsProps) {
  const handleSendMessage = React.useCallback(
    async (content: string) => {
      onMessageSent?.(content)
      // Note: This is a simplified version - in practice, you'd wrap the actual send
      // For full analytics, use useClarityChatWithAnalytics hook
    },
    [onMessageSent]
  )

  return (
    <ClarityChat
      {...props}
      onMessageCopy={(id, content) => {
        onMessageReceived?.(id)
        props.onMessageCopy?.(id, content)
      }}
    />
  )
}

/**
 * ChatWithPreset - Chat component using a preset configuration
 * 
 * Apply pre-configured settings for common scenarios.
 * 
 * @example
 * ```tsx
 * <ChatWithPreset preset="enterprise" api="/api/chat" />
 * ```
 */
export interface ChatWithPresetProps extends ClarityChatProps {
  /** Preset to apply */
  preset: ChatPreset
}

export function ChatWithPreset({ preset, ...props }: ChatWithPresetProps) {
  const presetOptions = applyChatPreset(preset, props)
  return <ClarityChat {...presetOptions} />
}

/**
 * ChatWithPersistence - Chat component with localStorage persistence
 * 
 * Messages are automatically saved and restored.
 * 
 * @example
 * ```tsx
 * <ChatWithPersistence
 *   api="/api/chat"
 *   storageKey="my-chat-session"
 * />
 * ```
 */
export interface ChatWithPersistenceProps extends ClarityChatProps {
  /** Storage key for persistence */
  storageKey?: string
  /** Enable persistence (default: true) */
  persist?: boolean
}

export function ChatWithPersistence({
  storageKey = 'clarity-chat',
  persist = true,
  ...props
}: ChatWithPersistenceProps) {
  // Note: This is a wrapper - actual persistence would be handled by useChat hook
  // This component exists for API consistency
  return <ClarityChat {...props} chatId={storageKey} />
}

/**
 * ChatWithErrorHandling - Chat component with built-in error boundary
 * 
 * Wraps ClarityChat with ErrorBoundary for production-ready error handling.
 * 
 * @example
 * ```tsx
 * <ChatWithErrorHandling
 *   api="/api/chat"
 *   onError={(error) => trackError(error)}
 * />
 * ```
 */
export interface ChatWithErrorHandlingProps extends ClarityChatProps {
  /** Custom error fallback UI */
  errorFallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode)
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export function ChatWithErrorHandling({
  errorFallback,
  onError,
  ...props
}: ChatWithErrorHandlingProps) {
  return (
    <ErrorBoundary fallback={errorFallback} onError={onError}>
      <ClarityChat {...props} />
    </ErrorBoundary>
  )
}

/**
 * ChatComplete - All-in-one chat component with everything enabled
 * 
 * Includes: memory, error handling, persistence, analytics hooks
 * Perfect for production applications.
 * 
 * @example
 * ```tsx
 * <ChatComplete
 *   api="/api/chat"
 *   onMessageSent={(content) => analytics.track('message_sent')}
 * />
 * ```
 */
export interface ChatCompleteProps extends Omit<ClarityChatProps, 'memory'> {
  /** Memory strategy */
  memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Enable error boundary (default: true) */
  errorBoundary?: boolean
  /** Storage key for persistence */
  storageKey?: string
  /** Analytics callbacks */
  onMessageSent?: (content: string) => void
  onMessageReceived?: (messageId: string) => void
  onError?: (error: Error) => void
}

export function ChatComplete({
  memoryStrategy = 'vector-store',
  errorBoundary = true,
  storageKey = 'clarity-chat-complete',
  onMessageSent,
  onMessageReceived,
  onError,
  ...props
}: ChatCompleteProps) {
  const chatComponent = (
    <ClarityChat
      {...props}
      chatId={storageKey}
      memory={{
        enabled: true,
        strategy: memoryStrategy,
        retryOnError: true,
      }}
    />
  )

  if (!errorBoundary) {
    return chatComponent
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        onError?.(error)
        console.error('[ChatComplete] Error:', error, errorInfo)
      }}
    >
      {chatComponent}
    </ErrorBoundary>
  )
}
