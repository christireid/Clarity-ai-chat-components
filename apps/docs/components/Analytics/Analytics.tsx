import { logger } from '@clarity-chat/utils/logger';
'use client'

import { useEffect, useCallback, createContext, useContext, type ReactNode } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, string | number | boolean>
}

interface AnalyticsContextValue {
  trackEvent: (event: AnalyticsEvent) => void
  trackPageView: (path: string) => void
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    // Return no-op functions if not in provider
    return {
      trackEvent: () => {},
      trackPageView: () => {},
    }
  }
  return context
}

interface AnalyticsProviderProps {
  children: ReactNode
  /**
   * Enable/disable analytics. Defaults to true in production.
   */
  enabled?: boolean
  /**
   * Google Analytics measurement ID (e.g., G-XXXXXXXXXX)
   */
  gaMeasurementId?: string
  /**
   * Enable debug mode for console logging
   */
  debug?: boolean
}

/**
 * Analytics Provider
 *
 * Provides analytics tracking throughout the documentation site.
 * Supports Google Analytics and can be extended for other providers.
 *
 * @example
 * ```tsx
 * <AnalyticsProvider gaMeasurementId="G-XXXXXXXXXX">
 *   <App />
 * </AnalyticsProvider>
 * ```
 */
export function AnalyticsProvider({
  children,
  enabled = process.env.NODE_ENV === 'production',
  gaMeasurementId,
  debug = false,
}: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  const trackPageView = useCallback(
    (path: string) => {
      if (!enabled) return

      if (debug) {
        logger.debug('[Analytics] Page view:', path)
      }

      // Google Analytics
      if (gaMeasurementId && typeof window !== 'undefined' && window.gtag) {
        window.gtag('config', gaMeasurementId, {
          page_path: path,
        })
      }
    },
    [enabled, gaMeasurementId, debug]
  )

  // Track custom events
  const trackEvent = useCallback(
    ({ name, properties }: AnalyticsEvent) => {
      if (!enabled) return

      if (debug) {
        logger.debug('[Analytics] Event:', name, properties)
      }

      // Google Analytics
      if (gaMeasurementId && typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', name, properties)
      }
    },
    [enabled, gaMeasurementId, debug]
  )

  // Automatic page view tracking
  useEffect(() => {
    if (!enabled) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    trackPageView(url)
  }, [pathname, searchParams, trackPageView, enabled])

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Google Analytics Script
 *
 * Add this component to your layout to load the Google Analytics script.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <head>
 *   <GoogleAnalyticsScript measurementId="G-XXXXXXXXXX" />
 * </head>
 * ```
 */
export function GoogleAnalyticsScript({ measurementId }: { measurementId: string }) {
  if (!measurementId || process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

/**
 * Analytics event tracking hook
 *
 * Use this to track specific user interactions in the documentation.
 *
 * @example
 * ```tsx
 * const { trackEvent } = useDocAnalytics()
 *
 * // Track when a user copies code
 * trackEvent.codeCopy('useClarityChat', 'import statement')
 *
 * // Track when a user gives feedback
 * trackEvent.feedback('positive', 'useClarityChat')
 * ```
 */
export function useDocAnalytics() {
  const { trackEvent } = useAnalytics()

  return {
    trackEvent: {
      // Code interaction events
      codeCopy: (hookName: string, codeType: string) => {
        trackEvent({
          name: 'code_copy',
          properties: { hook_name: hookName, code_type: codeType },
        })
      },

      // Feedback events
      feedback: (type: 'positive' | 'negative', pageId: string, comment?: string) => {
        trackEvent({
          name: 'feedback_submit',
          properties: {
            feedback_type: type,
            page_id: pageId,
            has_comment: Boolean(comment),
          },
        })
      },

      // Navigation events
      hookSelect: (hookName: string, source: string) => {
        trackEvent({
          name: 'hook_select',
          properties: { hook_name: hookName, source },
        })
      },

      // Search events
      search: (query: string, resultCount: number) => {
        trackEvent({
          name: 'search',
          properties: { search_query: query, result_count: resultCount },
        })
      },

      // Comparison events
      hookCompare: (hooks: string[]) => {
        trackEvent({
          name: 'hook_compare',
          properties: {
            hooks_compared: hooks.join(','),
            count: hooks.length,
          },
        })
      },

      // Export events
      exportData: (format: string, dataType: string) => {
        trackEvent({
          name: 'export_data',
          properties: { format, data_type: dataType },
        })
      },

      // External link clicks
      externalLink: (url: string, linkText: string) => {
        trackEvent({
          name: 'external_link_click',
          properties: { url, link_text: linkText },
        })
      },

      // Time on page (called when leaving)
      timeOnPage: (pageId: string, durationSeconds: number) => {
        trackEvent({
          name: 'time_on_page',
          properties: { page_id: pageId, duration_seconds: durationSeconds },
        })
      },
    },
  }
}

// Type augmentation for window.gtag
declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}
