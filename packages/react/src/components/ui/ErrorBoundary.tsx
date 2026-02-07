/**
 * Error Boundary Components
 *
 * Re-exports from the canonical error-handling package.
 * All error boundaries and error utilities are now centralized in @clarity-chat/error-handling.
 */

import * as React from 'react'
import {
  ChatErrorBoundary,
  type ChatErrorBoundaryProps,
} from '@clarity-chat/error-handling'

// Re-export error boundaries and utilities from canonical location
export {
  // Main error boundaries
  ChatErrorBoundary as BaseErrorBoundary,
  ChatErrorBoundary as ContentErrorBoundary,
  ChatErrorBoundary as ErrorBoundary,

  // Error boundary props and types
  type ChatErrorBoundaryProps as ErrorBoundaryProps,
  type ChatErrorBoundaryProps as BaseErrorBoundaryProps,

  // Error handling hooks
  useErrorHandler,
  useErrorBoundaryThrow as useErrorBoundary,
  useAsyncError,

  // Error reporter
  errorReporter,
  type ErrorReport,
} from '@clarity-chat/error-handling'

// withErrorBoundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<ChatErrorBoundaryProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => (
    <ChatErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ChatErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
