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

// Accessibility hooks (enhanced)
export {
  // Enhanced accessibility utilities
  useFocusManagement,
  useScreenReaderAnnounce,
  useHighContrastMode,
  useReducedMotion,
  useColorContrast,
  useKeyboardNavigation,
  // Legacy accessibility hooks (for backward compatibility)
  useFocusManagementLegacy as useFocusManagementLegacy,
  useFocusTrap as useFocusTrapLegacy,
  useAnnounce as useAnnounceLegacy,
  usePrefersReducedMotionLegacy as usePrefersReducedMotionLegacy,
  useIdLegacy as useIdLegacy,
} from './accessibility'

// Analytics hooks
export {
  ErrorAnalyticsProvider,
  useErrorAnalytics,
  useErrorAnalyticsOptional,
} from './hooks/useErrorAnalytics'
export type {
  ErrorAnalyticsEntry,
  ErrorStats,
  ErrorAnalyticsCallbacks,
  ErrorAnalyticsProviderProps,
} from './hooks/useErrorAnalytics'

// Persistent circuit breaker
export {
  usePersistentCircuitBreaker,
  cleanupStaleCircuitBreakers,
} from './hooks/usePersistentCircuitBreaker'
export type { CircuitState } from './hooks/usePersistentCircuitBreaker'

// Reset strategies
export {
  useResetStrategies,
  dispatchResetEvent,
  useNetworkStatus,
  useRouteChangeReset,
} from './hooks/useResetStrategies'
export type {
  ResetStrategiesOptions,
  ResetReason,
} from './hooks/useResetStrategies'

// =============================================================================
// Additional Components
// =============================================================================

// Error Display (beautiful error presentation)
export { ErrorDisplay } from './components/ErrorDisplay'
export type {
  ErrorDisplayProps,
  ErrorSeverity,
  ErrorSize,
  ErrorVariant,
} from './components/ErrorDisplay'

// Retry countdown
export { RetryCountdown } from './components/RetryCountdown'
export type {
  RetryCountdownProps,
  RetryCountdownVariant,
  RetryCountdownColorScheme,
} from './components/RetryCountdown'

// Toast notification system
export {
  ToastProvider,
  useToast,
  useToastOptional,
} from './components/ErrorToast'
export type {
  Toast,
  ToastType,
  ToastPosition,
  ToastProviderProps,
  ToastContextValue,
} from './components/ErrorToast'

// Dev tools (development only)
export {
  ErrorBoundaryDevTools,
  useDevToolsRegistration,
} from './components/ErrorBoundaryDevTools'
export type { ErrorBoundaryDevToolsProps } from './components/ErrorBoundaryDevTools'

// =============================================================================
// Provider Error Detection
// =============================================================================

export {
  detectProviderError,
  logDetectionResult,
  isMalformedErrorBody,
} from './errors/provider-error-detector'
export type {
  DetectionConfidence,
  DetectionResult,
} from './errors/provider-error-detector'

// =============================================================================
// Utilities
// =============================================================================

export * from './utils'

// =============================================================================
// Styles (CSS)
// =============================================================================

// Import this in your app for error animations:
// import '@clarity-chat/error-handling/styles/error-animations.css'
