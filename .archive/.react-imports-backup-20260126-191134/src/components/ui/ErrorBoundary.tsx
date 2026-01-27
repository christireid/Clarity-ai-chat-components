/**
 * Error Boundary Components
 *
 * Re-exports from the canonical error-handling package.
 * All error boundaries and error utilities are now centralized in @clarity-chat/error-handling.
 */

// Re-export error boundaries and utilities from canonical location
export {
  // Main error boundaries
  EnhancedErrorBoundary as BaseErrorBoundary,
  EnhancedErrorBoundary as ContentErrorBoundary,
  InlineErrorBoundary as InlineContentErrorBoundary,
  MediaErrorBoundary,
  EnhancedErrorBoundary as AsyncContentErrorBoundary,
  PreviewErrorBoundary as ResilientErrorBoundary,
  EnhancedErrorBoundary as ReportableErrorBoundary,

  // Error boundary props and types
  type EnhancedErrorBoundaryProps as ErrorBoundaryProps,
  type EnhancedErrorBoundaryProps as BaseErrorBoundaryProps,
  type FallbackProps as ErrorFallbackProps,

  // Error handling hooks
  useErrorBoundary as useErrorHandler,
  useErrorBoundary as useAsyncErrorHandler,

  // HOC
  useErrorBoundary,

  // Error reporter
  errorReporter,
  type ErrorReport,
} from '@clarity-chat/error-handling'

// Re-export fallback components (these are built into the error boundaries now)
export const ContentErrorFallback = null as any // Replaced by EnhancedErrorBoundary's default fallback
export const InlineErrorFallback = null as any // Replaced by InlineErrorBoundary's fallback
export const EmptyStateErrorFallback = null as any // Replaced by EnhancedErrorBoundary's fallback

// withErrorBoundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps: Omit<any, 'children'> = {}
) {
  const { EnhancedErrorBoundary } = require('@clarity-chat/error-handling')

  const WrappedComponent = (props: P) => (
    <EnhancedErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </EnhancedErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}

// Development overlay (replaced by ErrorBoundaryDevTools in error-handling package)
export const ErrorOverlay = null as any
