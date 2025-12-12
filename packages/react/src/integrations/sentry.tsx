/**
 * Sentry Error Tracking Integration
 *
 * Provides hooks and utilities for integrating Sentry error tracking
 * into Clarity Chat applications. Handles AI-specific error contexts
 * and chat-related breadcrumbs.
 *
 * @example
 * ```tsx
 * // Initialize Sentry with Clarity Chat integration
 * import { initSentry, useSentryChat } from '@clarity-chat/react/integrations/sentry'
 *
 * initSentry({
 *   dsn: 'https://...@sentry.io/...',
 *   environment: 'production',
 * })
 *
 * // In your chat component
 * const { captureError, addBreadcrumb } = useSentryChat()
 * ```
 */

import * as React from 'react'

// Type definitions for Sentry SDK (avoid hard dependency)
export interface SentryOptions {
  /** Sentry DSN */
  dsn: string
  /** Environment name */
  environment?: string
  /** Release version */
  release?: string
  /** Sample rate for errors (0-1) */
  sampleRate?: number
  /** Enable debug mode */
  debug?: boolean
  /** Additional tags */
  tags?: Record<string, string>
  /** Ignored error patterns */
  ignoreErrors?: (string | RegExp)[]
}

export interface SentryScope {
  setTag(key: string, value: string): void
  setExtra(key: string, value: unknown): void
  setUser(user: { id?: string; email?: string; username?: string } | null): void
  setContext(name: string, context: Record<string, unknown>): void
}

export interface SentryBreadcrumb {
  category?: string
  message?: string
  level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal'
  data?: Record<string, unknown>
  timestamp?: number
}

// Global Sentry instance reference (injected at runtime)
let sentryInstance: typeof import('@sentry/react') | null = null

/**
 * Initialize Sentry with Clarity Chat defaults
 *
 * Call this once at app startup, before rendering.
 */
export function initSentry(options: SentryOptions): void {
  // Dynamically import Sentry to avoid bundling if not used
  import('@sentry/react')
    .then((Sentry) => {
      sentryInstance = Sentry

      Sentry.init({
        dsn: options.dsn,
        environment: options.environment ?? 'development',
        release: options.release,
        sampleRate: options.sampleRate ?? 1.0,
        debug: options.debug ?? false,
        ignoreErrors: [
          // Common non-actionable errors
          'ResizeObserver loop limit exceeded',
          'ResizeObserver loop completed with undelivered notifications',
          'Non-Error promise rejection captured',
          // User-initiated cancellations
          'AbortError',
          'User cancelled',
          // Network errors that are expected
          'Failed to fetch',
          'NetworkError',
          'Load failed',
          ...(options.ignoreErrors ?? []),
        ],
        beforeSend(event: unknown, hint: { originalException?: Error }) {
          // Filter out rate limit errors (expected in AI apps)
          const error = hint?.originalException
          if (
            error?.message?.includes('429') ||
            error?.message?.includes('rate limit')
          ) {
            return null
          }
          return event
        },
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        tracesSampleRate: 0.1, // 10% of transactions
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0, // 100% of error sessions
      })

      // Add default tags
      Sentry.setTag('clarity_chat', 'true')
      if (options.tags) {
        Object.entries(options.tags).forEach(([key, value]) => {
          Sentry.setTag(key, value)
        })
      }
    })
    .catch((err) => {
      console.warn('[Clarity Chat] Sentry not available:', err.message)
    })
}

/**
 * Capture an error with AI-specific context
 */
export function captureAIError(
  error: Error,
  context?: {
    provider?: string
    model?: string
    messageCount?: number
    tokenCount?: number
    conversationId?: string
    userId?: string
  }
): string | undefined {
  if (!sentryInstance) {
    console.error('[Clarity Chat] Sentry not initialized:', error)
    return undefined
  }

  return sentryInstance.withScope((scope) => {
    scope.setTag('error_type', 'ai_error')

    if (context?.provider) scope.setTag('ai_provider', context.provider)
    if (context?.model) scope.setTag('ai_model', context.model)

    scope.setContext('ai_context', {
      provider: context?.provider,
      model: context?.model,
      messageCount: context?.messageCount,
      tokenCount: context?.tokenCount,
      conversationId: context?.conversationId,
    })

    if (context?.userId) {
      scope.setUser({ id: context.userId })
    }

    return sentryInstance!.captureException(error)
  })
}

/**
 * Add a chat-related breadcrumb
 */
export function addChatBreadcrumb(
  action: 'message_sent' | 'message_received' | 'tool_called' | 'error',
  data?: {
    role?: string
    contentLength?: number
    toolName?: string
    errorMessage?: string
  }
): void {
  if (!sentryInstance) return

  sentryInstance.addBreadcrumb({
    category: 'chat',
    message: action,
    level: action === 'error' ? 'error' : 'info',
    data,
    timestamp: Date.now() / 1000,
  })
}

/**
 * React hook for Sentry integration in chat components
 */
export function useSentryChat(): {
  captureError: (error: Error, context?: Record<string, unknown>) => void
  addBreadcrumb: (action: string, data?: Record<string, unknown>) => void
  setUser: (user: { id: string; email?: string } | null) => void
  setConversationContext: (
    conversationId: string,
    metadata?: Record<string, unknown>
  ) => void
} {
  const captureError = React.useCallback(
    (error: Error, context?: Record<string, unknown>) => {
      if (!sentryInstance) {
        console.error('[Clarity Chat] Sentry error:', error)
        return
      }

      sentryInstance.withScope((scope) => {
        if (context) {
          Object.entries(context).forEach(([key, value]) => {
            scope.setExtra(key, value)
          })
        }
        sentryInstance!.captureException(error)
      })
    },
    []
  )

  const addBreadcrumb = React.useCallback(
    (action: string, data?: Record<string, unknown>) => {
      if (!sentryInstance) return

      sentryInstance.addBreadcrumb({
        category: 'chat',
        message: action,
        level: 'info',
        data,
        timestamp: Date.now() / 1000,
      })
    },
    []
  )

  const setUser = React.useCallback(
    (user: { id: string; email?: string } | null) => {
      if (!sentryInstance) return
      sentryInstance.setUser(user)
    },
    []
  )

  const setConversationContext = React.useCallback(
    (conversationId: string, metadata?: Record<string, unknown>) => {
      if (!sentryInstance) return

      sentryInstance.setContext('conversation', {
        id: conversationId,
        ...metadata,
      })
    },
    []
  )

  return {
    captureError,
    addBreadcrumb,
    setUser,
    setConversationContext,
  }
}

/**
 * Higher-order component for error boundary with Sentry
 */
export function withSentryErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
): React.FC<P> {
  return function SentryWrappedComponent(props: P) {
    if (!sentryInstance) {
      return <Component {...props} />
    }

    const ErrorBoundary = sentryInstance.ErrorBoundary

    return (
      <ErrorBoundary
        fallback={
          fallback ?? (
            <div className="p-4 text-center text-muted-foreground">
              Something went wrong. Please try again.
            </div>
          )
        }
      >
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

/**
 * Start a Sentry transaction for AI operations
 */
export function startAITransaction(
  name: string,
  operation: 'ai.chat' | 'ai.stream' | 'ai.tool'
): { finish: () => void } | null {
  if (!sentryInstance) return null

  const transaction = sentryInstance.startInactiveSpan({
    name,
    op: operation,
  })

  return {
    finish: () => transaction?.end(),
  }
}

export default {
  initSentry,
  captureAIError,
  addChatBreadcrumb,
  useSentryChat,
  withSentryErrorBoundary,
  startAITransaction,
}
