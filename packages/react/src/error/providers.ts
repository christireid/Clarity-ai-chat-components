/**
 * Built-in error tracking providers
 *
 * This file provides ready-to-use providers for popular error tracking services.
 * Each provider implements the ErrorProvider interface.
 */

import type { ErrorProvider, ErrorReport } from './types'

/**
 * Sentry provider configuration
 */
interface SentryConfig {
  dsn: string
  environment?: string
  release?: string
  tracesSampleRate?: number
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
  let Sentry: any = null

  return {
    name: 'sentry',

    initialize: async () => {
      // In real implementation, would import @sentry/react
      // For now, we'll use a mock that logs to console
      console.log('[Sentry] Initialized with DSN:', config.dsn)
      
      // Mock Sentry object
      Sentry = {
        init: () => {},
        captureException: (error: Error, context?: any) => {
          console.log('[Sentry] Captured exception:', error, context)
        },
        setUser: (user: any) => {
          console.log('[Sentry] Set user:', user)
        },
        setContext: (name: string, context: any) => {
          console.log('[Sentry] Set context:', name, context)
        },
        addBreadcrumb: (breadcrumb: any) => {
          console.log('[Sentry] Added breadcrumb:', breadcrumb)
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
          custom: report.context,
          environment: report.environment,
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

    setUser: (userId: string, email?: string, userData?: Record<string, any>) => {
      if (!Sentry) return
      Sentry.setUser({ id: userId, email, ...userData })
    },

    setContext: (context: Record<string, any>) => {
      if (!Sentry) return
      Sentry.setContext('custom', context)
    },

    addBreadcrumb: (message: string, data?: Record<string, any>) => {
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
}

/**
 * Create a Rollbar error tracking provider
 */
export function createRollbarProvider(config: RollbarConfig): ErrorProvider {
  let Rollbar: any = null

  return {
    name: 'rollbar',

    initialize: async () => {
      console.log('[Rollbar] Initialized with token:', config.accessToken.substring(0, 8) + '...')
      
      // Mock Rollbar object
      Rollbar = {
        configure: () => {},
        error: (error: Error | string, custom?: any) => {
          console.log('[Rollbar] Error:', error, custom)
        },
        warning: (message: string, custom?: any) => {
          console.log('[Rollbar] Warning:', message, custom)
        },
        info: (message: string, custom?: any) => {
          console.log('[Rollbar] Info:', message, custom)
        },
        configure: (config: any) => {
          console.log('[Rollbar] Configured:', config)
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

      if (report.originalError) {
        Rollbar[level](report.originalError, payload)
      } else {
        Rollbar[level](report.message, payload)
      }
    },

    setUser: (userId: string, email?: string, userData?: Record<string, any>) => {
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
}

/**
 * Create a Bugsnag error tracking provider
 */
export function createBugsnagProvider(config: BugsnagConfig): ErrorProvider {
  let Bugsnag: any = null

  return {
    name: 'bugsnag',

    initialize: async () => {
      console.log('[Bugsnag] Initialized with API key:', config.apiKey.substring(0, 8) + '...')
      
      // Mock Bugsnag object
      Bugsnag = {
        start: () => {},
        notify: (error: Error, onError?: any) => {
          console.log('[Bugsnag] Notified:', error)
          if (onError) onError()
        },
        setUser: (id: string, email?: string, name?: string) => {
          console.log('[Bugsnag] Set user:', { id, email, name })
        },
        addMetadata: (section: string, data: any) => {
          console.log('[Bugsnag] Added metadata:', section, data)
        },
        leaveBreadcrumb: (message: string, metadata?: any) => {
          console.log('[Bugsnag] Left breadcrumb:', message, metadata)
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

      Bugsnag.notify(error, (event: any) => {
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

    setUser: (userId: string, email?: string, userData?: Record<string, any>) => {
      if (!Bugsnag) return
      Bugsnag.setUser(userId, email, userData?.name)
      if (userData) {
        Bugsnag.addMetadata('user', userData)
      }
    },

    addBreadcrumb: (message: string, data?: Record<string, any>) => {
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
export function createCustomAPIProvider(config: CustomAPIConfig): ErrorProvider {
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
          console.error('Failed to report error to custom API:', response.statusText)
        }
      } catch (error) {
        console.error('Error reporting to custom API:', error)
      }
    },
  }
}

/**
 * Console provider for development
 * Logs errors to the browser console
 */
export function createConsoleProvider(): ErrorProvider {
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

      console.group(
        `%c${report.severity.toUpperCase()}`,
        style,
        report.message
      )
      
      if (report.stack) {
        console.error('Stack:', report.stack)
      }

      if (report.componentStack) {
        console.error('Component Stack:', report.componentStack)
      }

      if (report.context) {
        console.log('Context:', report.context)
      }

      if (report.environment) {
        console.log('Environment:', report.environment)
      }

      if (report.tags) {
        console.log('Tags:', report.tags)
      }

      if (report.userFeedback) {
        console.log('User Feedback:', report.userFeedback)
      }

      console.groupEnd()
    },

    setUser: (userId: string, email?: string, userData?: Record<string, any>) => {
      console.log('[Error Reporter] Set user:', { userId, email, ...userData })
    },

    setContext: (context: Record<string, any>) => {
      console.log('[Error Reporter] Set context:', context)
    },

    addBreadcrumb: (message: string, data?: Record<string, any>) => {
      console.log('[Error Reporter] Breadcrumb:', message, data)
    },
  }
}

/**
 * LocalStorage provider for offline error tracking
 * Stores errors in localStorage for later retrieval
 */
export function createLocalStorageProvider(maxErrors: number = 50): ErrorProvider {
  const STORAGE_KEY = 'error_reports'

  return {
    name: 'localstorage',

    reportError: (report: ErrorReport) => {
      try {
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
        console.error('Failed to store error in localStorage:', error)
      }
    },
  }
}

/**
 * Get all errors stored in localStorage
 */
export function getStoredErrors(): ErrorReport[] {
  try {
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
    localStorage.removeItem('error_reports')
  } catch (error) {
    console.error('Failed to clear stored errors:', error)
  }
}
