/**
 * Error Boundary Components
 *
 * Re-exports from the canonical error-handling package.
 * All error boundaries are now centralized in @clarity-chat/error-handling.
 */

// Re-export error boundaries from canonical location
export {
  EnhancedErrorBoundary as ErrorBoundary,
  PanelErrorBoundary,
  useErrorBoundary,
  type EnhancedErrorBoundaryProps as ErrorBoundaryProps,
  type PanelErrorBoundaryProps,
  type FallbackProps,
} from '@clarity-chat/error-handling'
