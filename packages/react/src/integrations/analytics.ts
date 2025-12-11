/**
 * Analytics Integration
 *
 * Unified analytics hooks and utilities for Clarity Chat.
 * Supports PostHog, Vercel Analytics, and custom providers.
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider, useAnalytics } from '@clarity-chat/react/integrations/analytics'
 *
 * // Wrap your app
 * <AnalyticsProvider
 *   posthog={{ apiKey: 'phc_...', apiHost: 'https://app.posthog.com' }}
 *   vercel={{ enabled: true }}
 * >
 *   <App />
 * </AnalyticsProvider>
 *
 * // In components
 * const { track, identify } = useAnalytics()
 * track('message_sent', { model: 'gpt-4' })
 * ```
 */

import * as React from 'react'

// ============================================
// Types
// ============================================

export interface PostHogConfig {
  apiKey: string
  apiHost?: string
  /** Autocapture click events (default: false for privacy) */
  autocapture?: boolean
  /** Capture pageviews (default: true) */
  capturePageview?: boolean
  /** Disable in development (default: true) */
  disableInDev?: boolean
}

export interface VercelAnalyticsConfig {
  enabled?: boolean
  /** Debug mode */
  debug?: boolean
}

export interface AnalyticsProviderProps {
  children: React.ReactNode
  posthog?: PostHogConfig
  vercel?: VercelAnalyticsConfig
  /** Custom analytics handler */
  onTrack?: (event: string, properties?: Record<string, unknown>) => void
  /** Disable all analytics */
  disabled?: boolean
}

export interface AnalyticsContextValue {
  /** Track a custom event */
  track: (event: string, properties?: Record<string, unknown>) => void
  /** Identify a user */
  identify: (userId: string, traits?: Record<string, unknown>) => void
  /** Set user properties */
  setUserProperties: (properties: Record<string, unknown>) => void
  /** Track a page view */
  page: (name?: string, properties?: Record<string, unknown>) => void
  /** Reset user identity */
  reset: () => void
  /** Check if analytics is ready */
  isReady: boolean
}

// Chat-specific event types
export type ChatAnalyticsEvent =
  | 'chat_started'
  | 'message_sent'
  | 'message_received'
  | 'chat_completed'
  | 'tool_invoked'
  | 'tool_completed'
  | 'artifact_created'
  | 'model_switched'
  | 'error_occurred'
  | 'feedback_submitted'
  | 'conversation_exported'
  | 'conversation_shared'

export interface ChatEventProperties {
  conversationId?: string
  model?: string
  provider?: string
  messageRole?: 'user' | 'assistant' | 'system'
  messageLength?: number
  tokenCount?: number
  toolName?: string
  artifactType?: string
  errorType?: string
  rating?: number
  duration?: number
}

// ============================================
// Context
// ============================================

const AnalyticsContext = React.createContext<AnalyticsContextValue | undefined>(
  undefined
)

// Global analytics instance references
let posthogInstance: typeof import('posthog-js').default | null = null

// ============================================
// Provider
// ============================================

export function AnalyticsProvider({
  children,
  posthog: posthogConfig,
  vercel: vercelConfig,
  onTrack,
  disabled = false,
}: AnalyticsProviderProps): React.ReactElement {
  const [isReady, setIsReady] = React.useState(false)

  // Initialize PostHog
  React.useEffect(() => {
    if (disabled || !posthogConfig?.apiKey) return

    // Skip in development if configured
    if (
      posthogConfig.disableInDev !== false &&
      process.env.NODE_ENV === 'development'
    ) {
      setIsReady(true)
      return
    }

    import('posthog-js')
      .then((module) => {
        const posthog = module.default
        posthogInstance = posthog

        posthog.init(posthogConfig.apiKey, {
          api_host: posthogConfig.apiHost ?? 'https://app.posthog.com',
          autocapture: posthogConfig.autocapture ?? false,
          capture_pageview: posthogConfig.capturePageview ?? true,
          persistence: 'localStorage',
          loaded: () => {
            setIsReady(true)
          },
        })
      })
      .catch((err) => {
        console.warn('[Clarity Chat] PostHog not available:', err.message)
        setIsReady(true)
      })

    return () => {
      // Cleanup on unmount
      if (posthogInstance) {
        // PostHog doesn't have a destroy method, just reset
      }
    }
  }, [disabled, posthogConfig])

  // Initialize Vercel Analytics
  React.useEffect(() => {
    if (disabled || !vercelConfig?.enabled) return

    import('@vercel/analytics')
      .then(({ inject }) => {
        inject({ debug: vercelConfig.debug ?? false })
      })
      .catch((err) => {
        console.warn('[Clarity Chat] Vercel Analytics not available:', err.message)
      })
  }, [disabled, vercelConfig])

  const track = React.useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      if (disabled) return

      // Custom handler
      onTrack?.(event, properties)

      // PostHog
      if (posthogInstance) {
        posthogInstance.capture(event, properties)
      }

      // Vercel Analytics (via Web Vitals, doesn't have custom events)
      // Custom events can be tracked via Vercel's track function if imported
    },
    [disabled, onTrack]
  )

  const identify = React.useCallback(
    (userId: string, traits?: Record<string, unknown>) => {
      if (disabled) return

      if (posthogInstance) {
        posthogInstance.identify(userId, traits)
      }
    },
    [disabled]
  )

  const setUserProperties = React.useCallback(
    (properties: Record<string, unknown>) => {
      if (disabled) return

      if (posthogInstance) {
        posthogInstance.people.set(properties)
      }
    },
    [disabled]
  )

  const page = React.useCallback(
    (name?: string, properties?: Record<string, unknown>) => {
      if (disabled) return

      if (posthogInstance) {
        posthogInstance.capture('$pageview', {
          $current_url: window.location.href,
          page_name: name,
          ...properties,
        })
      }
    },
    [disabled]
  )

  const reset = React.useCallback(() => {
    if (disabled) return

    if (posthogInstance) {
      posthogInstance.reset()
    }
  }, [disabled])

  const value: AnalyticsContextValue = {
    track,
    identify,
    setUserProperties,
    page,
    reset,
    isReady,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

// ============================================
// Hooks
// ============================================

/**
 * Use analytics context
 */
export function useAnalytics(): AnalyticsContextValue {
  const context = React.useContext(AnalyticsContext)

  if (!context) {
    // Return no-op functions if not within provider
    return {
      track: () => {},
      identify: () => {},
      setUserProperties: () => {},
      page: () => {},
      reset: () => {},
      isReady: false,
    }
  }

  return context
}

/**
 * Chat-specific analytics hook with typed events
 */
export function useChatAnalytics(): {
  trackChatEvent: (
    event: ChatAnalyticsEvent,
    properties?: ChatEventProperties
  ) => void
  trackMessageSent: (properties: {
    conversationId: string
    model?: string
    messageLength: number
  }) => void
  trackMessageReceived: (properties: {
    conversationId: string
    model?: string
    tokenCount?: number
    duration?: number
  }) => void
  trackToolInvoked: (properties: {
    conversationId: string
    toolName: string
  }) => void
  trackError: (properties: {
    conversationId?: string
    errorType: string
    errorMessage?: string
  }) => void
} {
  const { track } = useAnalytics()

  const trackChatEvent = React.useCallback(
    (event: ChatAnalyticsEvent, properties?: ChatEventProperties) => {
      track(event, properties)
    },
    [track]
  )

  const trackMessageSent = React.useCallback(
    (properties: {
      conversationId: string
      model?: string
      messageLength: number
    }) => {
      track('message_sent', {
        ...properties,
        messageRole: 'user',
      })
    },
    [track]
  )

  const trackMessageReceived = React.useCallback(
    (properties: {
      conversationId: string
      model?: string
      tokenCount?: number
      duration?: number
    }) => {
      track('message_received', {
        ...properties,
        messageRole: 'assistant',
      })
    },
    [track]
  )

  const trackToolInvoked = React.useCallback(
    (properties: { conversationId: string; toolName: string }) => {
      track('tool_invoked', properties)
    },
    [track]
  )

  const trackError = React.useCallback(
    (properties: {
      conversationId?: string
      errorType: string
      errorMessage?: string
    }) => {
      track('error_occurred', properties)
    },
    [track]
  )

  return {
    trackChatEvent,
    trackMessageSent,
    trackMessageReceived,
    trackToolInvoked,
    trackError,
  }
}

/**
 * Track Web Vitals (for Vercel Analytics compatibility)
 */
export function useWebVitals(): void {
  React.useEffect(() => {
    import('web-vitals')
      .then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
        onCLS(console.log)
        onFID(console.log)
        onLCP(console.log)
        onFCP(console.log)
        onTTFB(console.log)
      })
      .catch(() => {
        // web-vitals not available
      })
  }, [])
}

export default {
  AnalyticsProvider,
  useAnalytics,
  useChatAnalytics,
  useWebVitals,
}
