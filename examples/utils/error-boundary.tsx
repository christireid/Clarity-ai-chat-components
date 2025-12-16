/**
 * Error Boundary Component for Example Applications
 *
 * Catches JavaScript errors in child components and displays
 * a fallback UI instead of crashing the entire app.
 *
 * @module error-boundary
 */

import * as React from 'react'

import { SecureLogger } from '@/lib/security/secureLogger';
// =============================================================================
// 💡 Types
// =============================================================================

interface ErrorBoundaryProps {
  /** Child components to render */
  children: React.ReactNode
  /** Custom fallback UI to show on error */
  fallback?: React.ReactNode
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Whether to show a reset button */
  showReset?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// =============================================================================
// 💡 Error Boundary Component
// =============================================================================

/**
 * Error boundary that catches errors in child components.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ErrorBoundary
 *       fallback={<ErrorFallback />}
 *       onError={(error) => logError(error)}
 *     >
 *       <ChatComponent />
 *     </ErrorBoundary>
 *   )
 * }
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    SecureLogger.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          role="alert"
          className="p-6 border border-destructive/20 bg-destructive/5 rounded-lg"
        >
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.props.showReset !== false && (
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Try again
            </button>
          )}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-auto max-h-40">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

// =============================================================================
// 💡 Loading State Components
// =============================================================================

interface LoadingSpinnerProps {
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg'
  /** Accessible label for screen readers */
  label?: string
}

/**
 * Animated loading spinner component.
 *
 * @example
 * ```tsx
 * {isLoading ? <LoadingSpinner label="Loading messages..." /> : <Messages />}
 * ```
 */
export function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
}: LoadingSpinnerProps): React.ReactElement {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div role="status" aria-label={label} className="flex items-center gap-2">
      <div
        className={`${sizeClasses[size]} border-primary/30 border-t-primary rounded-full animate-spin`}
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}

interface SkeletonProps {
  /** Width of the skeleton */
  width?: string
  /** Height of the skeleton */
  height?: string
  /** Whether to show rounded corners */
  rounded?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Skeleton loading placeholder.
 *
 * @example
 * ```tsx
 * {isLoading ? (
 *   <div className="space-y-2">
 *     <Skeleton width="100%" height="20px" />
 *     <Skeleton width="75%" height="20px" />
 *   </div>
 * ) : (
 *   <Content />
 * )}
 * ```
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  rounded = true,
  className = '',
}: SkeletonProps): React.ReactElement {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`bg-muted animate-pulse ${rounded ? 'rounded' : ''} ${className}`}
      style={{ width, height }}
    />
  )
}

interface MessageSkeletonProps {
  /** Number of skeleton messages to show */
  count?: number
}

/**
 * Skeleton for chat messages.
 *
 * @example
 * ```tsx
 * {isLoading ? <MessageSkeleton count={3} /> : <MessageList messages={messages} />}
 * ```
 */
export function MessageSkeleton({
  count = 3,
}: MessageSkeletonProps): React.ReactElement {
  return (
    <div className="space-y-4" role="status" aria-label="Loading messages">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`p-4 rounded-lg ${i % 2 === 0 ? 'ml-12' : 'mr-12'}`}
        >
          <Skeleton width="60%" height="16px" className="mb-2" />
          <Skeleton width="100%" height="16px" className="mb-2" />
          <Skeleton width="40%" height="16px" />
        </div>
      ))}
      <span className="sr-only">Loading messages...</span>
    </div>
  )
}

// =============================================================================
// 💡 Empty State Component
// =============================================================================

interface EmptyStateProps {
  /** Title of the empty state */
  title: string
  /** Description text */
  description?: string
  /** Icon to display */
  icon?: React.ReactNode
  /** Action button */
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * Empty state component for when there's no content.
 *
 * @example
 * ```tsx
 * {messages.length === 0 ? (
 *   <EmptyState
 *     title="No messages yet"
 *     description="Start a conversation to see messages here"
 *     action={{ label: "Start chat", onClick: startChat }}
 *   />
 * ) : (
 *   <MessageList messages={messages} />
 * )}
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// =============================================================================
// 💡 Error State Component
// =============================================================================

interface ErrorStateProps {
  /** Error title */
  title?: string
  /** Error message */
  message: string
  /** Retry action */
  onRetry?: () => void
}

/**
 * Error state component for displaying errors.
 *
 * @example
 * ```tsx
 * {error ? (
 *   <ErrorState
 *     message={error.message}
 *     onRetry={() => refetch()}
 *   />
 * ) : (
 *   <Content />
 * )}
 * ```
 */
export function ErrorState({
  title = 'Error',
  message,
  onRetry,
}: ErrorStateProps): React.ReactElement {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div
        className="mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="text-lg font-semibold text-destructive mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Try again
        </button>
      )}
    </div>
  )
}
