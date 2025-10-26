/**
 * Error tracking type definitions
 *
 * This file defines types for error tracking and reporting functionality.
 * It provides a provider-agnostic interface for error tracking services.
 */

/**
 * Error severity levels following standard error tracking conventions
 */
export type ErrorSeverity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

/**
 * Error report containing all information about an error
 */
export interface ErrorReport {
  /** Error message */
  message: string

  /** Error stack trace */
  stack?: string

  /** Error severity level */
  severity: ErrorSeverity

  /** Error timestamp */
  timestamp: number

  /** User ID if available */
  userId?: string

  /** User email if available */
  userEmail?: string

  /** Session ID */
  sessionId?: string

  /** Additional context data */
  context?: Record<string, any>

  /** Tags for categorization */
  tags?: Record<string, string>

  /** User feedback/comments */
  userFeedback?: string

  /** Browser/environment information */
  environment?: {
    userAgent?: string
    url?: string
    referrer?: string
    viewport?: { width: number; height: number }
    locale?: string
  }

  /** Component stack for React errors */
  componentStack?: string

  /** Whether this error was handled */
  handled?: boolean

  /** Original error object (may not be serializable) */
  originalError?: Error
}

/**
 * Error tracking provider interface
 */
export interface ErrorProvider {
  /** Provider name for identification */
  name: string

  /** Initialize the provider */
  initialize?: () => void | Promise<void>

  /** Report an error */
  reportError: (report: ErrorReport) => void | Promise<void>

  /** Set user context */
  setUser?: (userId: string, email?: string, userData?: Record<string, any>) => void

  /** Set global context/tags */
  setContext?: (context: Record<string, any>) => void

  /** Add breadcrumb/event for debugging */
  addBreadcrumb?: (message: string, data?: Record<string, any>) => void

  /** Cleanup provider resources */
  destroy?: () => void
}

/**
 * Error reporter configuration
 */
export interface ErrorReporterConfig {
  /** Error tracking providers */
  providers: ErrorProvider[]

  /** Whether to enable error reporting (can disable in dev) */
  enabled?: boolean

  /** Whether to automatically report unhandled errors */
  autoReport?: boolean

  /** Whether to capture console errors */
  captureConsole?: boolean

  /** Whether to allow user feedback */
  enableFeedback?: boolean

  /** Sample rate for error reporting (0-1) */
  sampleRate?: number

  /** Filter function to exclude certain errors */
  beforeSend?: (report: ErrorReport) => ErrorReport | null

  /** Callback when error is reported */
  onError?: (report: ErrorReport) => void

  /** Global tags to add to all reports */
  globalTags?: Record<string, string>

  /** Global context to add to all reports */
  globalContext?: Record<string, any>
}

/**
 * Error feedback form data
 */
export interface ErrorFeedback {
  /** User's description of what happened */
  description: string

  /** User's email (optional) */
  email?: string

  /** Steps to reproduce (optional) */
  stepsToReproduce?: string

  /** What the user expected to happen */
  expectedBehavior?: string
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error statistics for monitoring
 */
export interface ErrorStats {
  /** Total errors reported */
  totalErrors: number

  /** Errors by severity */
  bySeverity: Record<ErrorSeverity, number>

  /** Errors by hour (last 24 hours) */
  byHour: Array<{ hour: number; count: number }>

  /** Most common error messages */
  topErrors: Array<{ message: string; count: number }>

  /** Last error timestamp */
  lastError?: number
}
