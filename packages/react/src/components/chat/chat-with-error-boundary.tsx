/**
 * ChatWithErrorBoundary - Chat component with built-in error handling
 *
 * Wraps ClarityChat with ErrorBoundary for production-ready error handling.
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
import { ClarityChat, type ClarityChatProps } from './clarity-chat'
import {
  ErrorBoundary,
  type ErrorBoundaryProps,
} from '../feedback/error-boundary'

export interface ChatWithErrorBoundaryProps extends ClarityChatProps {
  /** Error boundary fallback UI */
  errorFallback?: ErrorBoundaryProps['fallback']
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo?: React.ErrorInfo) => void
  /** Reset keys for error boundary */
  resetKeys?: ErrorBoundaryProps['resetKeys']
}

/**
 * ChatWithErrorBoundary - Chat component with automatic error handling
 *
 * This component wraps ClarityChat with an ErrorBoundary to catch and handle
 * errors gracefully. Perfect for production applications.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ChatWithErrorBoundary api="/api/chat" />
 *
 * // With custom error handling
 * <ChatWithErrorBoundary
 *   api="/api/chat"
 *   onError={(error) => {
 *     // Send to error tracking service
 *     trackError(error)
 *   }}
 *   errorFallback={(error, reset) => (
 *     <div>
 *       <p>Something went wrong: {error.message}</p>
 *       <button onClick={reset}>Try Again</button>
 *     </div>
 *   )}
 * />
 * ```
 */
export function ChatWithErrorBoundary({
  errorFallback,
  onError,
  resetKeys,
  ...chatProps
}: ChatWithErrorBoundaryProps) {
  return (
    <ErrorBoundary
      fallback={errorFallback}
      onError={onError}
      resetKeys={resetKeys}
    >
      <ClarityChat {...chatProps} />
    </ErrorBoundary>
  )
}

ChatWithErrorBoundary.displayName = 'ChatWithErrorBoundary'
