/**
 * Clarity Chat Error Handling System
 *
 * Comprehensive error handling for React 19 applications with:
 * - Type-safe error classes with domain-specific errors
 * - React error boundaries using react-error-boundary v5
 * - Streaming-aware error handling with retry logic
 * - Centralized API error handling for Next.js 15 App Router
 * - Structured logging for production debugging
 *
 * @packageDocumentation
 */

// =============================================================================
// Error Classes
// =============================================================================

export * from './errors'

// =============================================================================
// Error Factory Functions (Legacy)
// =============================================================================

export * from './errors/factory'

// =============================================================================
// Components
// =============================================================================

// Original ErrorBoundary (class component)
export { ErrorBoundary } from './components/ErrorBoundary'
export type { ErrorBoundaryProps } from './components/ErrorBoundary'

// Enhanced ErrorBoundary (using react-error-boundary)
export {
  EnhancedErrorBoundary,
  useErrorBoundary,
} from './components/EnhancedErrorBoundary'
export type {
  EnhancedErrorBoundaryProps,
  FallbackProps,
} from './components/EnhancedErrorBoundary'

// Chat-specific ErrorBoundary
export { ChatErrorBoundary } from './components/ChatErrorBoundary'
export type { ChatErrorBoundaryProps } from './components/ChatErrorBoundary'

// =============================================================================
// Hooks
// =============================================================================

// Original hooks
export { useErrorHandler } from './hooks/useErrorHandler'
export type { UseErrorHandlerOptions } from './hooks/useErrorHandler'

export { useErrorBoundary as useErrorBoundaryThrow } from './hooks/useErrorBoundary'

export { useAsyncError } from './hooks/useAsyncError'
export type { UseAsyncErrorOptions } from './hooks/useAsyncError'

export { useErrorRecovery } from './hooks/useErrorRecovery'
export type { RecoveryStrategy } from './hooks/useErrorRecovery'

export { useErrorToast } from './hooks/useErrorToast'
export type { ErrorToast } from './hooks/useErrorToast'

// Enhanced hooks
export { useEnhancedErrorHandler } from './hooks/useEnhancedErrorHandler'
export type {
  UseEnhancedErrorHandlerOptions,
  UseEnhancedErrorHandlerReturn,
} from './hooks/useEnhancedErrorHandler'

export { useStreamingError } from './hooks/useStreamingError'
export type {
  UseStreamingErrorOptions,
  UseStreamingErrorReturn,
} from './hooks/useStreamingError'

// =============================================================================
// Utilities
// =============================================================================

export * from './utils'
