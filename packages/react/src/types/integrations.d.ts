/**
 * Type declarations for optional integration dependencies
 *
 * These modules are optional peer dependencies used by the integrations module.
 * They are dynamically imported and will only be bundled if the user has them installed.
 */

// Sentry React SDK
declare module '@sentry/react' {
  // SentryScope interface for typed scope callbacks
  interface SentryScope {
    setTag(key: string, value: string): void
    setExtra(key: string, value: unknown): void
    setContext(name: string, context: Record<string, unknown>): void
    setUser(user: { id?: string; email?: string; username?: string } | null): void
  }

  export function init(options: {
    dsn: string
    environment?: string
    release?: string
    sampleRate?: number
    debug?: boolean
    ignoreErrors?: (string | RegExp)[]
    beforeSend?: (event: unknown, hint: { originalException?: Error }) => unknown | null
    integrations?: unknown[]
    tracesSampleRate?: number
    replaysSessionSampleRate?: number
    replaysOnErrorSampleRate?: number
  }): void

  export function captureException(error: Error, hint?: { extra?: Record<string, unknown> }): string
  export function captureMessage(message: string, level?: string): string
  export function addBreadcrumb(breadcrumb: {
    category?: string
    message?: string
    level?: 'debug' | 'info' | 'warning' | 'error' | 'fatal'
    data?: Record<string, unknown>
    timestamp?: number
  }): void
  export function setTag(key: string, value: string): void
  export function setExtra(key: string, value: unknown): void
  export function setUser(user: { id?: string; email?: string; username?: string } | null): void
  export function setContext(name: string, context: Record<string, unknown>): void
  export function configureScope(callback: (scope: SentryScope) => void): void
  export function withScope<T>(callback: (scope: SentryScope) => T): T
  export function startTransaction(context: { name: string; op?: string }): {
    finish: () => void
    setData: (key: string, value: unknown) => void
    setTag: (key: string, value: string) => void
    startChild: (context: { op?: string; description?: string }) => {
      finish: () => void
    }
  }
  export function startInactiveSpan(context: { name: string; op?: string }): {
    end: () => void
  } | undefined
  export function getCurrentHub(): {
    getScope(): SentryScope | undefined
  }
  export const browserTracingIntegration: () => unknown
  export const replayIntegration: (options?: {
    maskAllText?: boolean
    blockAllMedia?: boolean
  }) => unknown
  export function ErrorBoundary(props: {
    children: React.ReactNode
    fallback?: React.ReactNode | ((props: { error: Error; resetError: () => void }) => React.ReactNode)
    onError?: (error: Error, componentStack: string, eventId: string) => void
    onReset?: () => void
    beforeCapture?: (scope: SentryScope) => void
  }): React.ReactElement

  // Re-export SentryScope for external use
  export type { SentryScope }
}

// PostHog Analytics
declare module 'posthog-js' {
  interface PostHog {
    init(apiKey: string, options?: {
      api_host?: string
      loaded?: (posthog: PostHog) => void
      autocapture?: boolean
      capture_pageview?: boolean
      capture_pageleave?: boolean
      disable_session_recording?: boolean
      persistence?: 'localStorage' | 'sessionStorage' | 'cookie' | 'memory'
    }): void
    capture(event: string, properties?: Record<string, unknown>): void
    identify(distinctId: string, properties?: Record<string, unknown>): void
    reset(): void
    get_distinct_id(): string
    opt_out_capturing(): void
    opt_in_capturing(): void
    has_opted_out_capturing(): boolean
    people: {
      set(properties: Record<string, unknown>): void
    }
  }
  const posthog: PostHog
  export default posthog
}

// Vercel Analytics
declare module '@vercel/analytics' {
  export function track(event: string, properties?: Record<string, unknown>): void
  export function inject(options?: { debug?: boolean }): void
}

// Web Vitals
declare module 'web-vitals' {
  interface Metric {
    name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
    value: number
    rating: 'good' | 'needs-improvement' | 'poor'
    delta: number
    entries: PerformanceEntry[]
    id: string
    navigationType: 'navigate' | 'reload' | 'back_forward' | 'back_forward_cache' | 'prerender'
  }

  type ReportCallback = (metric: Metric) => void

  export function onCLS(callback: ReportCallback, opts?: { reportAllChanges?: boolean }): void
  export function onFCP(callback: ReportCallback, opts?: { reportAllChanges?: boolean }): void
  export function onFID(callback: ReportCallback, opts?: { reportAllChanges?: boolean }): void
  export function onINP(callback: ReportCallback, opts?: { reportAllChanges?: boolean }): void
  export function onLCP(callback: ReportCallback, opts?: { reportAllChanges?: boolean }): void
  export function onTTFB(callback: ReportCallback, opts?: { reportAllChanges?: boolean }): void
}
