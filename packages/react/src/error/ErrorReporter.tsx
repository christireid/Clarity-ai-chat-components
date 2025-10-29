/**
 * Error Reporter Provider
 *
 * This component provides error tracking and reporting functionality throughout the app.
 * It automatically captures unhandled errors and provides utilities for manual error reporting.
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { 
  // ErrorProvider, // Reserved for future use
  ErrorReport, 
  ErrorReporterConfig, 
  ErrorStats 
} from './types'

/**
 * Error Reporter Context
 */
interface ErrorReporterContextValue {
  /** Report an error manually */
  reportError: (error: Error | string, context?: Record<string, any>) => void

  /** Report an error with full options */
  reportErrorDetailed: (report: Partial<ErrorReport>) => void

  /** Set user context */
  setUser: (userId: string, email?: string, userData?: Record<string, any>) => void

  /** Set global context */
  setContext: (context: Record<string, any>) => void

  /** Add breadcrumb for debugging */
  addBreadcrumb: (message: string, data?: Record<string, any>) => void

  /** Get error statistics */
  getStats: () => ErrorStats

  /** Check if error reporting is enabled */
  isEnabled: boolean
}

const ErrorReporterContext = createContext<ErrorReporterContextValue | undefined>(undefined)

/**
 * Error Reporter Provider Props
 */
export interface ErrorReporterProviderProps {
  children: React.ReactNode
  config: ErrorReporterConfig
}

/**
 * Generate a random session ID
 */
function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Get environment information
 */
function getEnvironment() {
  if (typeof window === 'undefined') return undefined

  return {
    userAgent: window.navigator.userAgent,
    url: window.location.href,
    referrer: document.referrer,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    locale: window.navigator.language,
  }
}

/**
 * Error Reporter Provider Component
 *
 * @example
 * ```tsx
 * import { ErrorReporterProvider, createSentryProvider, createConsoleProvider } from '@chat-ui/react'
 *
 * function App() {
 *   return (
 *     <ErrorReporterProvider
 *       config={{
 *         providers: [
 *           createSentryProvider({ dsn: 'YOUR_DSN' }),
 *           createConsoleProvider()
 *         ],
 *         enabled: process.env.NODE_ENV === 'production',
 *         autoReport: true,
 *         enableFeedback: true
 *       }}
 *     >
 *       <YourApp />
 *     </ErrorReporterProvider>
 *   )
 * }
 * ```
 */
export function ErrorReporterProvider({ children, config }: ErrorReporterProviderProps) {
  const [sessionId] = useState(generateSessionId)
  const [errorStats, setErrorStats] = useState<ErrorStats>({
    totalErrors: 0,
    bySeverity: {
      fatal: 0,
      error: 0,
      warning: 0,
      info: 0,
      debug: 0,
    },
    byHour: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
    topErrors: [],
  })

  const userRef = useRef<{
    userId?: string
    email?: string
    userData?: Record<string, any>
  }>({})
  
  const contextRef = useRef<Record<string, any>>({})
  const breadcrumbsRef = useRef<Array<{ message: string; data?: Record<string, any>; timestamp: number }>>([])

  const {
    providers,
    enabled = true,
    autoReport = true,
    captureConsole = false,
    sampleRate = 1.0,
    beforeSend,
    onError,
    globalTags = {},
    globalContext = {},
  } = config

  // Initialize providers
  useEffect(() => {
    if (!enabled) return

    providers.forEach((provider) => {
      provider.initialize?.()
    })

    return () => {
      providers.forEach((provider) => {
        provider.destroy?.()
      })
    }
  }, [enabled, providers])

  // Update error statistics
  const updateStats = useCallback((report: ErrorReport) => {
    setErrorStats((prev) => {
      const newStats = { ...prev }
      
      // Increment total
      newStats.totalErrors++
      
      // Increment severity count
      newStats.bySeverity = {
        ...prev.bySeverity,
        [report.severity]: prev.bySeverity[report.severity] + 1,
      }

      // Update hourly stats
      const hour = new Date(report.timestamp).getHours()
      newStats.byHour = prev.byHour.map((h) =>
        h.hour === hour ? { ...h, count: h.count + 1 } : h
      )

      // Update top errors
      const existingError = newStats.topErrors.find((e) => e.message === report.message)
      if (existingError) {
        existingError.count++
      } else {
        newStats.topErrors.push({ message: report.message, count: 1 })
      }
      newStats.topErrors.sort((a, b) => b.count - a.count)
      newStats.topErrors = newStats.topErrors.slice(0, 10)

      // Update last error timestamp
      newStats.lastError = report.timestamp

      return newStats
    })
  }, [])

  // Report error to all providers
  const reportError = useCallback(
    (error: Error | string, context?: Record<string, any>) => {
      if (!enabled) return

      // Sample rate check
      if (Math.random() > sampleRate) return

      const report: ErrorReport = {
        message: typeof error === 'string' ? error : error.message,
        stack: typeof error === 'string' ? undefined : error.stack,
        severity: 'error',
        timestamp: Date.now(),
        sessionId,
        userId: userRef.current.userId,
        userEmail: userRef.current.email,
        context: {
          ...globalContext,
          ...contextRef.current,
          ...context,
        },
        tags: globalTags,
        environment: getEnvironment(),
        originalError: typeof error === 'string' ? undefined : error,
        handled: true,
      }

      // Apply beforeSend filter
      const filteredReport = beforeSend ? beforeSend(report) : report
      if (!filteredReport) return

      // Update stats
      updateStats(filteredReport)

      // Call onError callback
      onError?.(filteredReport)

      // Report to all providers
      providers.forEach((provider) => {
        try {
          provider.reportError(filteredReport)
        } catch (providerError) {
          console.error(`Error reporting to provider ${provider.name}:`, providerError)
        }
      })
    },
    [enabled, sampleRate, sessionId, providers, beforeSend, onError, globalContext, globalTags, updateStats]
  )

  // Report error with full options
  const reportErrorDetailed = useCallback(
    (report: Partial<ErrorReport>) => {
      if (!enabled) return

      // Sample rate check
      if (Math.random() > sampleRate) return

      const fullReport: ErrorReport = {
        message: report.message || 'Unknown error',
        stack: report.stack,
        severity: report.severity || 'error',
        timestamp: report.timestamp || Date.now(),
        sessionId: report.sessionId || sessionId,
        userId: report.userId || userRef.current.userId,
        userEmail: report.userEmail || userRef.current.email,
        context: {
          ...globalContext,
          ...contextRef.current,
          ...report.context,
        },
        tags: {
          ...globalTags,
          ...report.tags,
        },
        environment: report.environment || getEnvironment(),
        componentStack: report.componentStack,
        userFeedback: report.userFeedback,
        handled: report.handled ?? true,
        originalError: report.originalError,
      }

      // Apply beforeSend filter
      const filteredReport = beforeSend ? beforeSend(fullReport) : fullReport
      if (!filteredReport) return

      // Update stats
      updateStats(filteredReport)

      // Call onError callback
      onError?.(filteredReport)

      // Report to all providers
      providers.forEach((provider) => {
        try {
          provider.reportError(filteredReport)
        } catch (providerError) {
          console.error(`Error reporting to provider ${provider.name}:`, providerError)
        }
      })
    },
    [enabled, sampleRate, sessionId, providers, beforeSend, onError, globalContext, globalTags, updateStats]
  )

  // Set user context
  const setUser = useCallback(
    (userId: string, email?: string, userData?: Record<string, any>) => {
      userRef.current = { userId, email, userData }

      if (!enabled) return

      providers.forEach((provider) => {
        try {
          provider.setUser?.(userId, email, userData)
        } catch (error) {
          console.error(`Error setting user in provider ${provider.name}:`, error)
        }
      })
    },
    [enabled, providers]
  )

  // Set global context
  const setContext = useCallback(
    (context: Record<string, any>) => {
      contextRef.current = { ...contextRef.current, ...context }

      if (!enabled) return

      providers.forEach((provider) => {
        try {
          provider.setContext?.(context)
        } catch (error) {
          console.error(`Error setting context in provider ${provider.name}:`, error)
        }
      })
    },
    [enabled, providers]
  )

  // Add breadcrumb
  const addBreadcrumb = useCallback(
    (message: string, data?: Record<string, any>) => {
      const breadcrumb = {
        message,
        data,
        timestamp: Date.now(),
      }

      breadcrumbsRef.current.push(breadcrumb)

      // Keep only last 50 breadcrumbs
      if (breadcrumbsRef.current.length > 50) {
        breadcrumbsRef.current.shift()
      }

      if (!enabled) return

      providers.forEach((provider) => {
        try {
          provider.addBreadcrumb?.(message, data)
        } catch (error) {
          console.error(`Error adding breadcrumb in provider ${provider.name}:`, error)
        }
      })
    },
    [enabled, providers]
  )

  // Auto-report unhandled errors
  useEffect(() => {
    if (!enabled || !autoReport) return

    const handleError = (event: ErrorEvent) => {
      event.preventDefault()
      reportError(event.error || event.message, {
        type: 'unhandled_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault()
      reportError(event.reason, {
        type: 'unhandled_rejection',
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [enabled, autoReport, reportError])

  // Capture console errors
  useEffect(() => {
    if (!enabled || !captureConsole) return

    const originalError = console.error
    const originalWarn = console.warn

    console.error = (...args: any[]) => {
      originalError.apply(console, args)
      reportError(args.join(' '), { type: 'console_error' })
    }

    console.warn = (...args: any[]) => {
      originalWarn.apply(console, args)
      reportErrorDetailed({
        message: args.join(' '),
        severity: 'warning',
        context: { type: 'console_warn' },
      })
    }

    return () => {
      console.error = originalError
      console.warn = originalWarn
    }
  }, [enabled, captureConsole, reportError, reportErrorDetailed])

  const getStats = useCallback(() => errorStats, [errorStats])

  const value: ErrorReporterContextValue = {
    reportError,
    reportErrorDetailed,
    setUser,
    setContext,
    addBreadcrumb,
    getStats,
    isEnabled: enabled,
  }

  return <ErrorReporterContext.Provider value={value}>{children}</ErrorReporterContext.Provider>
}

/**
 * Hook to access error reporter
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { reportError, setUser, addBreadcrumb } = useErrorReporter()
 *
 *   useEffect(() => {
 *     setUser('user-123', 'user@example.com')
 *   }, [])
 *
 *   const handleAction = () => {
 *     addBreadcrumb('User clicked button')
 *     try {
 *       // Some action
 *     } catch (error) {
 *       reportError(error, { action: 'button_click' })
 *     }
 *   }
 *
 *   return <button onClick={handleAction}>Click me</button>
 * }
 * ```
 */
export function useErrorReporter() {
  const context = useContext(ErrorReporterContext)
  if (!context) {
    throw new Error('useErrorReporter must be used within an ErrorReporterProvider')
  }
  return context
}
