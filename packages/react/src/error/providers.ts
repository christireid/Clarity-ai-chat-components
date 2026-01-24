/**
 * Built-in error tracking providers
 *
 * This file provides ready-to-use providers for popular error tracking services.
 * Each provider implements the ErrorProvider interface.
 */

import type { ErrorProvider, ErrorReport } from './types'

// ============================================================================
// Error Tracking Provider Interfaces
// ============================================================================

/** Sentry SDK mock interface */
interface SentryLike {
  init: (config: {
    dsn: string
    environment?: string
    release?: string
    tracesSampleRate?: number
  }) => void
  captureException: (
    error: Error,
    context?: {
      level?: string
      tags?: Record<string, string>
      contexts?: Record<string, Record<string, unknown>>
      user?: { id?: string; email?: string }
      extra?: Record<string, unknown>
    }
  ) => void
  setUser: (user: { id?: string; email?: string } | null) => void
  setContext: (name: string, context: Record<string, unknown>) => void
  addBreadcrumb: (breadcrumb: {
    message?: string
    data?: Record<string, unknown>
    timestamp?: number
  }) => void
}

/** Rollbar SDK mock interface */
interface RollbarLike {
  error: (error: Error | string, custom?: Record<string, unknown>) => void
  warning: (message: string, custom?: Record<string, unknown>) => void
  info: (message: string, custom?: Record<string, unknown>) => void
  critical: (error: Error | string, custom?: Record<string, unknown>) => void
  configure: (config: {
    accessToken?: string
    environment?: string
    codeVersion?: string
    payload?: { person?: { id: string; email?: string } }
  }) => void
  [key: string]:
    | ((arg: Error | string, custom?: Record<string, unknown>) => void)
    | unknown
}

/** Bugsnag SDK mock interface */
interface BugsnagEventLike {
  severity: string
  setUser: (id: string, email?: string, name?: string) => void
  addMetadata: (section: string, data: Record<string, unknown>) => void
}

interface BugsnagLike {
  start: (config: {
    apiKey: string
    releaseStage?: string
    appVersion?: string
  }) => void
  notify: (error: Error, onError?: (event: BugsnagEventLike) => void) => void
  setUser: (id: string, email?: string, name?: string) => void
  addMetadata: (section: string, data: Record<string, unknown>) => void
  leaveBreadcrumb: (message: string, metadata?: Record<string, unknown>) => void
}

// Import environment detection from canonical source
import { isDev } from '@clarity-chat/utils/env'

function safeDevLog(...args: unknown[]): void {
  if (!isDev()) return
  // Keep dev-only logs minimal and never include secrets.
  console.debug(...args)
}

function safeDevError(...args: unknown[]): void {
  if (!isDev()) return
  console.error(...args)
}

function hasLocalStorage(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    )
  } catch {
    return false
  }
}

/**
 * Sentry provider configuration
 */
interface SentryConfig {
  dsn: string
  environment?: string
  release?: string
  tracesSampleRate?: number
  /** Enable dev-only diagnostic logging (never logs secrets) */
  debug?: boolean
}

/**
 * Create a Sentry error tracking provider
 *
 * @example
 * ```tsx
 * const sentryProvider = createSentryProvider({
 *   dsn: 'https://xxx@sentry.io/123',
 *   environment: 'production',
 *   release: '1.0.0'
 * })
 * ```
 */
export function createSentryProvider(config: SentryConfig): ErrorProvider {
  let Sentry: SentryLike | null = null

  return {
    name: 'sentry',

    initialize: async () => {
      // In real implementation, would import @sentry/react
      // For now, we'll use a mock implementation.
      if (config.debug) safeDevLog('[Sentry] Provider initialized')

      // Mock Sentry object
      Sentry = {
        init: () => {},
        captureException: (error: Error, context?: Record<string, unknown>) => {
          if (config.debug)
            safeDevLog('[Sentry] Captured exception', { error, context })
        },
        setUser: () => {
          if (config.debug) safeDevLog('[Sentry] Set user')
        },
        setContext: (name: string) => {
          if (config.debug) safeDevLog('[Sentry] Set context', name)
        },
        addBreadcrumb: () => {
          if (config.debug) safeDevLog('[Sentry] Added breadcrumb')
        },
      }

      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        release: config.release,
        tracesSampleRate: config.tracesSampleRate,
      })
    },

    reportError: (report: ErrorReport) => {
      if (!Sentry) return

      const error = report.originalError || new Error(report.message)

      Sentry.captureException(error, {
        level: report.severity,
        tags: report.tags,
        contexts: {
          custom: report.context ?? {},
          environment: report.environment ?? {},
        },
        user: report.userId
          ? {
              id: report.userId,
              email: report.userEmail,
            }
          : undefined,
        extra: {
          componentStack: report.componentStack,
          userFeedback: report.userFeedback,
          handled: report.handled,
        },
      })
    },

    setUser: (
      userId: string,
      email?: string,
      userData?: Record<string, unknown>
    ) => {
      if (!Sentry) return
      Sentry.setUser({ id: userId, email, ...userData })
    },

    setContext: (context: Record<string, unknown>) => {
      if (!Sentry) return
      Sentry.setContext('custom', context)
    },

    addBreadcrumb: (message: string, data?: Record<string, unknown>) => {
      if (!Sentry) return
      Sentry.addBreadcrumb({
        message,
        data,
        timestamp: Date.now() / 1000,
      })
    },
  }
}

/**
 * Rollbar provider configuration
 */
interface RollbarConfig {
  accessToken: string
  environment?: string
  codeVersion?: string
  /** Enable dev-only diagnostic logging (never logs secrets) */
  debug?: boolean
}

/**
 * Create a Rollbar error tracking provider
 */
export function createRollbarProvider(config: RollbarConfig): ErrorProvider {
  let Rollbar: RollbarLike | null = null

  return {
    name: 'rollbar',

    initialize: async () => {
      if (config.debug) safeDevLog('[Rollbar] Provider initialized')

      // Mock Rollbar object
      Rollbar = {
        error: (error: Error | string, custom?: Record<string, unknown>) => {
          if (config.debug) safeDevLog('[Rollbar] Error', { error, custom })
        },
        warning: (message: string, custom?: Record<string, unknown>) => {
          if (config.debug) safeDevLog('[Rollbar] Warning', { message, custom })
        },
        info: (message: string, custom?: Record<string, unknown>) => {
          if (config.debug) safeDevLog('[Rollbar] Info', { message, custom })
        },
        critical: (error: Error | string, custom?: Record<string, unknown>) => {
          if (config.debug) safeDevLog('[Rollbar] Critical', { error, custom })
        },
        configure: (rollbarConfig: Record<string, unknown>) => {
          if (config.debug) safeDevLog('[Rollbar] Configured', rollbarConfig)
        },
      }

      Rollbar.configure({
        accessToken: config.accessToken,
        environment: config.environment,
        codeVersion: config.codeVersion,
      })
    },

    reportError: (report: ErrorReport) => {
      if (!Rollbar) return

      const payload = {
        custom: report.context,
        person: report.userId
          ? {
              id: report.userId,
              email: report.userEmail,
            }
          : undefined,
        request: report.environment
          ? {
              url: report.environment.url,
              user_ip: undefined, // Would be set by server
            }
          : undefined,
      }

      const level = report.severity === 'fatal' ? 'critical' : report.severity
      const logMethod = Rollbar[level]

      if (typeof logMethod === 'function') {
        if (report.originalError) {
          logMethod(report.originalError, payload)
        } else {
          logMethod(report.message, payload)
        }
      }
    },

    setUser: (
      userId: string,
      email?: string,
      userData?: Record<string, unknown>
    ) => {
      if (!Rollbar) return
      Rollbar.configure({
        payload: {
          person: { id: userId, email, ...userData },
        },
      })
    },
  }
}

/**
 * Bugsnag provider configuration
 */
interface BugsnagConfig {
  apiKey: string
  releaseStage?: string
  appVersion?: string
  /** Enable dev-only diagnostic logging (never logs secrets) */
  debug?: boolean
}

/**
 * Create a Bugsnag error tracking provider
 */
export function createBugsnagProvider(config: BugsnagConfig): ErrorProvider {
  let Bugsnag: BugsnagLike | null = null

  return {
    name: 'bugsnag',

    initialize: async () => {
      if (config.debug) safeDevLog('[Bugsnag] Provider initialized')

      // Mock Bugsnag object
      Bugsnag = {
        start: () => {},
        notify: (error: Error, onError?: (event: BugsnagEventLike) => void) => {
          if (config.debug) safeDevLog('[Bugsnag] Notified')
          if (onError) {
            // Create a mock event for the callback
            const mockEvent: BugsnagEventLike = {
              severity: 'error',
              setUser: () => {},
              addMetadata: () => {},
            }
            onError(mockEvent)
          }
        },
        setUser: (id: string, email?: string) => {
          if (config.debug) safeDevLog('[Bugsnag] Set user', { id, email })
        },
        addMetadata: (section: string) => {
          if (config.debug) safeDevLog('[Bugsnag] Added metadata', section)
        },
        leaveBreadcrumb: () => {
          if (config.debug) safeDevLog('[Bugsnag] Left breadcrumb')
        },
      }

      Bugsnag.start({
        apiKey: config.apiKey,
        releaseStage: config.releaseStage,
        appVersion: config.appVersion,
      })
    },

    reportError: (report: ErrorReport) => {
      if (!Bugsnag) return

      const error = report.originalError || new Error(report.message)

      Bugsnag.notify(error, (event: BugsnagEventLike) => {
        event.severity = report.severity === 'fatal' ? 'error' : report.severity

        if (report.userId) {
          event.setUser(report.userId, report.userEmail)
        }

        if (report.context) {
          event.addMetadata('custom', report.context)
        }

        if (report.environment) {
          event.addMetadata('environment', report.environment)
        }

        if (report.tags) {
          event.addMetadata('tags', report.tags)
        }
      })
    },

    setUser: (
      userId: string,
      email?: string,
      userData?: Record<string, unknown>
    ) => {
      if (!Bugsnag) return
      const name = userData?.['name']
      Bugsnag.setUser(
        userId,
        email,
        typeof name === 'string' ? name : undefined
      )
      if (userData) {
        Bugsnag.addMetadata('user', userData)
      }
    },

    addBreadcrumb: (message: string, data?: Record<string, unknown>) => {
      if (!Bugsnag) return
      Bugsnag.leaveBreadcrumb(message, data)
    },
  }
}

/**
 * Custom API provider configuration
 */
interface CustomAPIConfig {
  endpoint: string
  headers?: Record<string, string>
  method?: 'POST' | 'PUT'
}

/**
 * Create a custom API error tracking provider
 *
 * @example
 * ```tsx
 * const apiProvider = createCustomAPIProvider({
 *   endpoint: 'https://api.example.com/errors',
 *   headers: { 'Authorization': 'Bearer token' }
 * })
 * ```
 */
export function createCustomAPIProvider(
  config: CustomAPIConfig
): ErrorProvider {
  return {
    name: 'custom-api',

    reportError: async (report: ErrorReport) => {
      try {
        const response = await fetch(config.endpoint, {
          method: config.method || 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify({
            message: report.message,
            stack: report.stack,
            severity: report.severity,
            timestamp: report.timestamp,
            userId: report.userId,
            userEmail: report.userEmail,
            sessionId: report.sessionId,
            context: report.context,
            tags: report.tags,
            environment: report.environment,
            componentStack: report.componentStack,
            userFeedback: report.userFeedback,
          }),
        })

        if (!response.ok) {
          safeDevError(
            'Failed to report error to custom API:',
            response.statusText
          )
        }
      } catch (error) {
        safeDevError('Error reporting to custom API:', error)
      }
    },
  }
}

/**
 * Console provider for development
 * Logs errors to the browser console
 */
export function createConsoleErrorProvider(): ErrorProvider {
  return {
    name: 'console',

    reportError: (report: ErrorReport) => {
      const style = `
        color: white;
        background: ${
          report.severity === 'fatal' || report.severity === 'error'
            ? '#dc2626'
            : report.severity === 'warning'
              ? '#f59e0b'
              : '#3b82f6'
        };
        padding: 2px 6px;
        border-radius: 3px;
        font-weight: bold;
      `

      console.debug(`%c${report.severity.toUpperCase()}`, style, report.message)

      if (report.stack) {
        console.error('Stack:', report.stack)
      }

      if (report.componentStack) {
        console.error('Component Stack:', report.componentStack)
      }

      if (report.context) {
        console.debug('Context:', report.context)
      }

      if (report.environment) {
        console.debug('Environment:', report.environment)
      }

      if (report.tags) {
        console.debug('Tags:', report.tags)
      }

      if (report.userFeedback) {
        console.debug('User Feedback:', report.userFeedback)
      }

      console.debug()
    },

    setUser: (
      userId: string,
      email?: string,
      userData?: Record<string, unknown>
    ) => {
      console.debug('[Error Reporter] Set user:', {
        userId,
        email,
        ...userData,
      })
    },

    setContext: (context: Record<string, unknown>) => {
      console.debug('[Error Reporter] Set context:', context)
    },

    addBreadcrumb: (message: string, data?: Record<string, unknown>) => {
      console.debug('[Error Reporter] Breadcrumb:', message, data)
    },
  }
}

/**
 * LocalStorage provider for offline error tracking
 * Stores errors in localStorage for later retrieval
 */
export function createLocalStorageErrorProvider(
  maxErrors: number = 50
): ErrorProvider {
  const STORAGE_KEY = 'error_reports'

  return {
    name: 'localstorage',

    reportError: (report: ErrorReport) => {
      try {
        if (!hasLocalStorage()) return
        const stored = localStorage.getItem(STORAGE_KEY)
        const errors: ErrorReport[] = stored ? JSON.parse(stored) : []

        // Add new error
        errors.push({
          ...report,
          // Remove originalError as it's not serializable
          originalError: undefined,
        })

        // Keep only most recent errors
        if (errors.length > maxErrors) {
          errors.splice(0, errors.length - maxErrors)
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(errors))
      } catch (error) {
        safeDevError('Failed to store error in localStorage:', error)
      }
    },
  }
}

/**
 * Get all errors stored in localStorage
 */
export function getStoredErrors(): ErrorReport[] {
  try {
    if (!hasLocalStorage()) return []
    const stored = localStorage.getItem('error_reports')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Clear all errors from localStorage
 */
export function clearStoredErrors(): void {
  try {
    if (!hasLocalStorage()) return
    localStorage.removeItem('error_reports')
  } catch (error) {
    safeDevError('Failed to clear stored errors:', error)
  }
}
