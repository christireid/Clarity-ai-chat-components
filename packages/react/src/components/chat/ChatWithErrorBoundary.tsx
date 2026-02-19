/**
 * ChatWithErrorBoundary - Chat component with built-in error handling
 *
 * Wraps ClarityChat with ErrorBoundary for robust error handling.
 * This is useful when you want error boundaries without manually wrapping.
 *
 * @example
 * ```tsx
 * import { ChatWithErrorBoundary } from '@clarity-chat/react'
 *
 * function App() {
 *   return (
 *     <ChatWithErrorBoundary
 *       api="/api/chat"
 *       onError={(error) => logger.logger.error('Chat error:', error)}
 *     />
 *   )
 * }
 * ```
 */

import * as React from 'react'
import { ClarityChat, type ClarityChatProps } from './ClarityChat'
import {
  ChatErrorBoundary,
  type ChatErrorBoundaryProps,
  EnhancedErrorBoundary,
  type EnhancedErrorBoundaryProps,
} from '@clarity-chat/error-handling'

export interface ChatWithErrorBoundaryProps extends ClarityChatProps {
  /** Custom fallback UI (requires using EnhancedErrorBoundary wrapper) */
  errorFallback?: EnhancedErrorBoundaryProps['fallback']
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo?: React.ErrorInfo) => void
  /** Reset keys for error boundary (requires using EnhancedErrorBoundary wrapper) */
  resetKeys?: EnhancedErrorBoundaryProps['resetKeys']
  /** Optional provider name for error context */
  provider?: string
}

/**
 * ChatWithErrorBoundary - Chat component with automatic error handling
 *
 * This component wraps ClarityChat with ChatErrorBoundary for chat-specific
 * error handling. If custom fallback UI or reset keys are provided, it wraps
 * with EnhancedErrorBoundary for advanced error boundary features.
 *
 * @example
 * ```tsx
 * // Basic usage with ChatErrorBoundary
 * <ChatWithErrorBoundary api="/api/chat" />
 *
 * // With error callback
 * <ChatWithErrorBoundary
 *   api="/api/chat"
 *   onError={(error) => {
 *     // Send to error tracking service
 *     trackError(error)
 *   }}
 * />
 *
 * // With custom fallback (uses EnhancedErrorBoundary)
 * <ChatWithErrorBoundary
 *   api="/api/chat"
 *   errorFallback={
 *     <div>
 *       <p>Chat unavailable. Please try again later.</p>
 *     </div>
 *   }
 * />
 * ```
 */
export function ChatWithErrorBoundary({
  errorFallback,
  onError,
  resetKeys,
  provider,
  ...chatProps
}: ChatWithErrorBoundaryProps) {
  // If custom fallback or resetKeys are provided, use EnhancedErrorBoundary wrapper
  if (errorFallback || resetKeys) {
    return (
      <EnhancedErrorBoundary
        fallback={errorFallback}
        onError={onError}
        resetKeys={resetKeys}
      >
        <ChatErrorBoundary
          chatId={chatProps.chatId}
          provider={provider}
          onError={onError ? (error) => onError(error, undefined) : undefined}
        >
          <ClarityChat {...chatProps} />
        </ChatErrorBoundary>
      </EnhancedErrorBoundary>
    )
  }

  // Default: Use ChatErrorBoundary only
  return (
    <ChatErrorBoundary
      chatId={chatProps.chatId}
      provider={provider}
      onError={onError ? (error) => onError(error, undefined) : undefined}
    >
      <ClarityChat {...chatProps} />
    </ChatErrorBoundary>
  )
}

ChatWithErrorBoundary.displayName = 'ChatWithErrorBoundary'
