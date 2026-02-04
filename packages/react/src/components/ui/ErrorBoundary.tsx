/**
 * Error Boundary Components
 *
 * Re-exports from the canonical error-handling package.
 * All error boundaries and error utilities are now centralized in @clarity-chat/error-handling.
 */

import * as React from 'react'

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

// Re-export fallback components (these are built into the error boundaries now)
export const ContentErrorFallback = null as any // Replaced by ChatErrorBoundary's default fallback
export const InlineErrorFallback = null as any // Replaced by ChatErrorBoundary's fallback
export const EmptyStateErrorFallback = null as any // Replaced by ChatErrorBoundary's fallback

// withErrorBoundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<any, 'children'> = {}
) {
  const { ChatErrorBoundary } = require('@clarity-chat/error-handling')

  const WrappedComponent = (props: P) => (
    <ChatErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ChatErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Development overlay (replaced by ErrorBoundaryDevTools in error-handling package)
export const ErrorOverlay = null as any
