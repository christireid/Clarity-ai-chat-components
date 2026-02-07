'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@clarity-chat/primitives'
import {
  AlertTriangle,
  RefreshCw,
  Bug,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MessageSquare,
  Home,
} from 'lucide-react'
import { EnhancedErrorBoundary } from '@clarity-chat/error-handling'

// =============================================================================
// ERROR BOUNDARY
// =============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  onReset?: () => void
}

/**
 * ErrorBoundary for Clarity components.
 *
 * Delegates to the canonical EnhancedErrorBoundary from @clarity-chat/error-handling
 * while providing Clarity-specific default fallback UI via ErrorFallback.
 */
export function ErrorBoundary({
  children,
  fallback,
  onError,
  onReset,
}: ErrorBoundaryProps) {
  const handleReset = React.useCallback(() => {
    onReset?.()
  }, [onReset])

  return (
    <EnhancedErrorBoundary
      fallback={fallback}
      onError={onError}
      onReset={handleReset}
    >
      {children}
    </EnhancedErrorBoundary>
  )
}

// =============================================================================
// ERROR FALLBACK
// =============================================================================

interface ErrorFallbackProps {
  error: Error | null
  errorInfo?: React.ErrorInfo | null
  onReset?: () => void
  onReport?: (error: Error) => void
  variant?: 'full' | 'inline' | 'minimal'
  className?: string
}

export function ErrorFallback({
  error,
  errorInfo,
  onReset,
  onReport,
  variant = 'full',
  className,
}: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const errorDetails = React.useMemo(() => {
    const details = [
      `Error: ${error?.message || 'Unknown error'}`,
      `Stack: ${error?.stack || 'No stack trace'}`,
    ]
    if (errorInfo?.componentStack) {
      details.push(`Component Stack: ${errorInfo.componentStack}`)
    }
    return details.join('\n\n')
  }, [error, errorInfo])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(errorDetails)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (variant === 'minimal') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 text-sm text-destructive',
          className
        )}
      >
        <AlertTriangle className="h-4 w-4" />
        <span>Something went wrong</span>
        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-6 px-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <Card className={cn('border-destructive/50 bg-destructive/5', className)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-destructive">
                Something went wrong
              </h4>
              <p className="text-sm text-muted-foreground mt-1 truncate">
                {error?.message || 'An unexpected error occurred'}
              </p>
            </div>
            {onReset && (
              <Button variant="outline" size="sm" onClick={onReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-[400px] p-6',
        className
      )}
    >
      <Card className="w-full max-w-lg border-destructive/50">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto p-3 rounded-full bg-destructive/10 w-fit mb-4">
            <Bug className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {error?.message ||
              'An unexpected error occurred while rendering this component.'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 justify-center">
            {onReset && (
              <Button onClick={onReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            {onReport && error && (
              <Button variant="outline" onClick={() => onReport(error)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            )}
          </div>

          <div className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
            >
              <span>Technical Details</span>
              {showDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showDetails && (
              <div className="border-t bg-muted/30 p-3">
                <div className="flex justify-end mb-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 px-2"
                  >
                    {copied ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <Copy className="h-3 w-3 mr-1" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <pre className="text-xs text-muted-foreground overflow-auto max-h-48 whitespace-pre-wrap font-mono">
                  {errorDetails}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-center pt-0">
          <Button variant="link" asChild className="text-muted-foreground">
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Return Home
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// =============================================================================
// CHAT ERROR
// =============================================================================

interface ChatErrorProps {
  error: Error | string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
}

export function ChatError({
  error,
  onRetry,
  onDismiss,
  className,
}: ChatErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20',
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
      <p className="flex-1 text-sm text-destructive">{errorMessage}</p>
      <div className="flex gap-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="h-8 text-destructive hover:text-destructive"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-8">
            Dismiss
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// MESSAGE ERROR
// =============================================================================

interface MessageErrorProps {
  messageId: string
  error: string
  onRetry?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  className?: string
}

export function MessageError({
  messageId,
  error,
  onRetry,
  onEdit,
  className,
}: MessageErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-2 rounded-md bg-destructive/5',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <span>Failed to send: {error}</span>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onRetry(messageId)}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onEdit(messageId)}
          >
            Edit message
          </Button>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// NETWORK ERROR
// =============================================================================

interface NetworkErrorProps {
  onRetry?: () => void
  className?: string
}

export function NetworkError({ onRetry, className }: NetworkErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        className
      )}
    >
      <div className="p-3 rounded-full bg-muted mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium mb-1">Connection Lost</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      {onRetry && (
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reconnect
        </Button>
      )}
    </div>
  )
}

// =============================================================================
// RATE LIMIT ERROR
// =============================================================================

interface RateLimitErrorProps {
  retryAfter?: number
  onRetry?: () => void
  className?: string
}

export function RateLimitError({
  retryAfter,
  onRetry,
  className,
}: RateLimitErrorProps) {
  const [countdown, setCountdown] = React.useState(retryAfter || 60)

  React.useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20',
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium text-yellow-600">
          Rate Limit Exceeded
        </p>
        <p className="text-xs text-muted-foreground">
          {countdown > 0
            ? `Please wait ${countdown} seconds before trying again`
            : 'You can try again now'}
        </p>
      </div>
      {countdown <= 0 && onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Retry
        </Button>
      )}
    </div>
  )
}
