/**
 * Analytics Provider
 * 
 * Context provider for analytics tracking throughout the application
 */

import * as React from 'react'
import type { 
  AnalyticsConfig, 
  AnalyticsEvent, 
  AnalyticsUser, 
  PageView,
  AnalyticsProvider as AnalyticsProviderInterface
} from './types'

interface AnalyticsContextValue {
  /**
   * Track an event
   */
  track: (eventName: string, properties?: Record<string, any>) => void
  
  /**
   * Identify a user
   */
  identify: (user: AnalyticsUser) => void
  
  /**
   * Track a page view
   */
  page: (pageView: PageView) => void
  
  /**
   * Reset analytics (clear user data)
   */
  reset: () => void
  
  /**
   * Check if analytics is enabled
   */
  isEnabled: boolean
  
  /**
   * Get current configuration
   */
  config: AnalyticsConfig
}

const AnalyticsContext = React.createContext<AnalyticsContextValue | undefined>(undefined)

export interface AnalyticsProviderProps {
  children: React.ReactNode
  config: AnalyticsConfig
}

/**
 * Analytics Provider Component
 * 
 * Provides analytics context to all child components.
 * Supports multiple analytics providers (GA4, Mixpanel, PostHog, etc.)
 * 
 * @example
 * ```tsx
 * import { AnalyticsProvider } from '@/analytics'
 * import { googleAnalyticsProvider } from '@/analytics/providers/google-analytics'
 * 
 * <AnalyticsProvider
 *   config={{
 *     enabled: true,
 *     debug: process.env.NODE_ENV === 'development',
 *     providers: [googleAnalyticsProvider],
 *     autoTrackPageViews: true,
 *     autoTrackErrors: true,
 *   }}
 * >
 *   <App />
 * </AnalyticsProvider>
 * ```
 */
export function AnalyticsProvider({ children, config }: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = React.useState(false)
  const [sessionId] = React.useState(() => generateSessionId())
  const currentUserId = React.useRef<string | undefined>(undefined)
  
  // Check if analytics should be enabled
  const isEnabled = React.useMemo(() => {
    if (config.enabled === false) return false
    
    // Respect "Do Not Track" if configured
    if (config.respectDoNotTrack && typeof navigator !== 'undefined') {
      const doNotTrack = navigator.doNotTrack || (window as any).doNotTrack || (navigator as any).msDoNotTrack
      if (doNotTrack === '1' || doNotTrack === 'yes') {
        if (config.debug) {
          console.log('[Analytics] Disabled due to Do Not Track setting')
        }
        return false
      }
    }
    
    return true
  }, [config.enabled, config.respectDoNotTrack, config.debug])
  
  // Initialize providers
  React.useEffect(() => {
    if (!isEnabled || !config.providers?.length) {
      setIsInitialized(true)
      return
    }
    
    const initializeProviders = async () => {
      if (config.debug) {
        console.log('[Analytics] Initializing providers:', config.providers?.map(p => p.name))
      }
      
      try {
        await Promise.all(
          config.providers!.map(provider => provider.init?.())
        )
        setIsInitialized(true)
        
        if (config.debug) {
          console.log('[Analytics] Providers initialized successfully')
        }
      } catch (error) {
        console.error('[Analytics] Failed to initialize providers:', error)
        setIsInitialized(true) // Continue even if initialization fails
      }
    }
    
    initializeProviders()
  }, [isEnabled, config.providers, config.debug])
  
  // Auto-track page views
  React.useEffect(() => {
    if (!isEnabled || !config.autoTrackPageViews || !isInitialized) return
    
    const trackPageView = () => {
      const pageView: PageView = {
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      }
      
      page(pageView)
    }
    
    // Track initial page view
    trackPageView()
    
    // Track subsequent page views (for SPAs)
    const handlePopState = () => trackPageView()
    window.addEventListener('popstate', handlePopState)
    
    // Intercept pushState and replaceState
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      trackPageView()
    }
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      trackPageView()
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [isEnabled, config.autoTrackPageViews, isInitialized])
  
  // Auto-track errors
  React.useEffect(() => {
    if (!isEnabled || !config.autoTrackErrors || !isInitialized) return
    
    const handleError = (event: ErrorEvent) => {
      track('error_occurred', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.toString(),
      })
    }
    
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      track('unhandled_rejection', {
        reason: event.reason?.toString(),
      })
    }
    
    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [isEnabled, config.autoTrackErrors, isInitialized])
  
  // Track function
  const track = React.useCallback(
    (eventName: string, properties?: Record<string, any>) => {
      if (!isEnabled || !isInitialized) return
      
      const event: AnalyticsEvent = {
        name: config.eventPrefix ? `${config.eventPrefix}${eventName}` : eventName,
        properties: {
          ...properties,
          session_id: sessionId,
          timestamp: Date.now(),
        },
        timestamp: Date.now(),
        userId: currentUserId.current,
        sessionId,
      }
      
      if (config.debug) {
        console.log('[Analytics] Track:', event)
      }
      
      // Send to all providers
      config.providers?.forEach(provider => {
        try {
          provider.track(event)
        } catch (error) {
          console.error(`[Analytics] Error in provider ${provider.name}:`, error)
        }
      })
    },
    [isEnabled, isInitialized, config, sessionId]
  )
  
  // Identify function
  const identify = React.useCallback(
    (user: AnalyticsUser) => {
      if (!isEnabled || !isInitialized) return
      
      currentUserId.current = user.id
      
      if (config.debug) {
        console.log('[Analytics] Identify:', user)
      }
      
      config.providers?.forEach(provider => {
        try {
          provider.identify?.(user)
        } catch (error) {
          console.error(`[Analytics] Error in provider ${provider.name}:`, error)
        }
      })
    },
    [isEnabled, isInitialized, config]
  )
  
  // Page function
  const page = React.useCallback(
    (pageView: PageView) => {
      if (!isEnabled || !isInitialized) return
      
      if (config.debug) {
        console.log('[Analytics] Page:', pageView)
      }
      
      config.providers?.forEach(provider => {
        try {
          provider.page?.(pageView)
        } catch (error) {
          console.error(`[Analytics] Error in provider ${provider.name}:`, error)
        }
      })
    },
    [isEnabled, isInitialized, config]
  )
  
  // Reset function
  const reset = React.useCallback(() => {
    if (!isEnabled || !isInitialized) return
    
    currentUserId.current = undefined
    
    if (config.debug) {
      console.log('[Analytics] Reset')
    }
    
    config.providers?.forEach(provider => {
      try {
        provider.reset?.()
      } catch (error) {
        console.error(`[Analytics] Error in provider ${provider.name}:`, error)
      }
    })
  }, [isEnabled, isInitialized, config])
  
  const value = React.useMemo<AnalyticsContextValue>(
    () => ({
      track,
      identify,
      page,
      reset,
      isEnabled,
      config,
    }),
    [track, identify, page, reset, isEnabled, config]
  )
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook to access analytics context
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { track } = useAnalytics()
 *   
 *   const handleClick = () => {
 *     track('button_clicked', { button: 'submit' })
 *   }
 *   
 *   return <button onClick={handleClick}>Submit</button>
 * }
 * ```
 */
export function useAnalytics() {
  const context = React.useContext(AnalyticsContext)
  
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  
  return context
}

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}
