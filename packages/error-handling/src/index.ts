/**
 * Clarity Chat React Component Library
 * Modern React 19 chat components with comprehensive error handling
 */

// Export all error classes
export * from './errors'

// Export error factory functions
export * from './errors/factory'

// Export components
export { ErrorBoundary } from './components/ErrorBoundary'
export type { ErrorBoundaryProps } from './components/ErrorBoundary'

// Export hooks
export { useErrorHandler } from './hooks/useErrorHandler'
export type { UseErrorHandlerOptions } from './hooks/useErrorHandler'

export { useErrorBoundary } from './hooks/useErrorBoundary'

export { useAsyncError } from './hooks/useAsyncError'
export type { UseAsyncErrorOptions } from './hooks/useAsyncError'

export { useErrorRecovery } from './hooks/useErrorRecovery'
export type { RecoveryStrategy } from './hooks/useErrorRecovery'

export { useErrorToast } from './hooks/useErrorToast'
export type { ErrorToast } from './hooks/useErrorToast'
