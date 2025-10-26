/**
 * Built-in Analytics Providers
 * 
 * Pre-configured providers for popular analytics services
 */

import type { AnalyticsProvider, AnalyticsEvent, AnalyticsUser, PageView } from './types'

/**
 * Console Logger Provider (for debugging)
 */
export function createConsoleProvider(): AnalyticsProvider {
  return {
    name: 'console',
    track: (event) => {
      console.log('[Analytics] Event:', event)
    },
    identify: (user) => {
      console.log('[Analytics] User identified:', user)
    },
    page: (pageView) => {
      console.log('[Analytics] Page view:', pageView)
    },
    reset: () => {
      console.log('[Analytics] Reset')
    },
  }
}

/**
 * Google Analytics 4 Provider
 * 
 * @example
 * ```tsx
 * const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')
 * ```
 */
export function createGoogleAnalyticsProvider(measurementId: string): AnalyticsProvider {
  return {
    name: 'google-analytics',
    init: () => {
      // Load GA4 script
      if (typeof window === 'undefined') return
      
      // Check if already loaded
      if ((window as any).gtag) return
      
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
      document.head.appendChild(script)
      
      ;(window as any).dataLayer = (window as any).dataLayer || []
      function gtag(...args: any[]) {
        ;(window as any).dataLayer.push(args)
      }
      ;(window as any).gtag = gtag
      
      gtag('js', new Date())
      gtag('config', measurementId)
    },
    track: (event) => {
      if (typeof window === 'undefined' || !(window as any).gtag) return
      
      ;(window as any).gtag('event', event.name, {
        ...event.properties,
        user_id: event.userId,
      })
    },
    identify: (user) => {
      if (typeof window === 'undefined' || !(window as any).gtag) return
      
      ;(window as any).gtag('config', measurementId, {
        user_id: user.id,
        user_properties: user.properties,
      })
    },
    page: (pageView) => {
      if (typeof window === 'undefined' || !(window as any).gtag) return
      
      ;(window as any).gtag('config', measurementId, {
        page_path: pageView.path,
        page_title: pageView.title,
      })
    },
  }
}

/**
 * Mixpanel Provider
 * 
 * @example
 * ```tsx
 * const mixpanelProvider = createMixpanelProvider('YOUR_TOKEN')
 * ```
 */
export function createMixpanelProvider(token: string): AnalyticsProvider {
  return {
    name: 'mixpanel',
    init: async () => {
      if (typeof window === 'undefined') return
      if ((window as any).mixpanel) return
      
      // Load Mixpanel library
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
      
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
      
      ;(window as any).mixpanel.init(token)
    },
    track: (event) => {
      if (typeof window === 'undefined' || !(window as any).mixpanel) return
      
      ;(window as any).mixpanel.track(event.name, event.properties)
    },
    identify: (user) => {
      if (typeof window === 'undefined' || !(window as any).mixpanel) return
      
      ;(window as any).mixpanel.identify(user.id)
      if (user.properties) {
        ;(window as any).mixpanel.people.set(user.properties)
      }
    },
    page: (pageView) => {
      if (typeof window === 'undefined' || !(window as any).mixpanel) return
      
      ;(window as any).mixpanel.track('Page View', {
        path: pageView.path,
        title: pageView.title,
        referrer: pageView.referrer,
        ...pageView.properties,
      })
    },
    reset: () => {
      if (typeof window === 'undefined' || !(window as any).mixpanel) return
      ;(window as any).mixpanel.reset()
    },
  }
}

/**
 * PostHog Provider
 * 
 * @example
 * ```tsx
 * const posthogProvider = createPostHogProvider('YOUR_API_KEY', {
 *   api_host: 'https://app.posthog.com'
 * })
 * ```
 */
export function createPostHogProvider(
  apiKey: string,
  options?: { api_host?: string }
): AnalyticsProvider {
  return {
    name: 'posthog',
    init: async () => {
      if (typeof window === 'undefined') return
      if ((window as any).posthog) return
      
      // Load PostHog library
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://cdn.jsdelivr.net/npm/posthog-js@1/dist/posthog.min.js'
      
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
      
      ;(window as any).posthog.init(apiKey, {
        api_host: options?.api_host || 'https://app.posthog.com',
        loaded: (posthog: any) => {
          posthog.debug(false)
        },
      })
    },
    track: (event) => {
      if (typeof window === 'undefined' || !(window as any).posthog) return
      
      ;(window as any).posthog.capture(event.name, event.properties)
    },
    identify: (user) => {
      if (typeof window === 'undefined' || !(window as any).posthog) return
      
      ;(window as any).posthog.identify(user.id, user.properties)
    },
    page: (pageView) => {
      if (typeof window === 'undefined' || !(window as any).posthog) return
      
      ;(window as any).posthog.capture('$pageview', {
        $current_url: window.location.href,
        path: pageView.path,
        title: pageView.title,
        ...pageView.properties,
      })
    },
    reset: () => {
      if (typeof window === 'undefined' || !(window as any).posthog) return
      ;(window as any).posthog.reset()
    },
  }
}

/**
 * Amplitude Provider
 * 
 * @example
 * ```tsx
 * const amplitudeProvider = createAmplitudeProvider('YOUR_API_KEY')
 * ```
 */
export function createAmplitudeProvider(apiKey: string): AnalyticsProvider {
  return {
    name: 'amplitude',
    init: async () => {
      if (typeof window === 'undefined') return
      if ((window as any).amplitude) return
      
      // Load Amplitude library
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://cdn.amplitude.com/libs/amplitude-8.21.4-min.gz.js'
      
      await new Promise((resolve, reject) => {
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
      
      ;(window as any).amplitude.getInstance().init(apiKey)
    },
    track: (event) => {
      if (typeof window === 'undefined' || !(window as any).amplitude) return
      
      ;(window as any).amplitude.getInstance().logEvent(event.name, event.properties)
    },
    identify: (user) => {
      if (typeof window === 'undefined' || !(window as any).amplitude) return
      
      ;(window as any).amplitude.getInstance().setUserId(user.id)
      if (user.properties) {
        const identify = new (window as any).amplitude.Identify()
        Object.entries(user.properties).forEach(([key, value]) => {
          identify.set(key, value)
        })
        ;(window as any).amplitude.getInstance().identify(identify)
      }
    },
    page: (pageView) => {
      if (typeof window === 'undefined' || !(window as any).amplitude) return
      
      ;(window as any).amplitude.getInstance().logEvent('Page View', {
        path: pageView.path,
        title: pageView.title,
        referrer: pageView.referrer,
        ...pageView.properties,
      })
    },
    reset: () => {
      if (typeof window === 'undefined' || !(window as any).amplitude) return
      ;(window as any).amplitude.getInstance().setUserId(null)
      ;(window as any).amplitude.getInstance().regenerateDeviceId()
    },
  }
}

/**
 * Custom API Provider
 * 
 * Send events to your own API endpoint
 * 
 * @example
 * ```tsx
 * const customProvider = createCustomApiProvider({
 *   endpoint: 'https://api.example.com/analytics',
 *   headers: { 'Authorization': 'Bearer token' }
 * })
 * ```
 */
export function createCustomApiProvider(config: {
  endpoint: string
  headers?: Record<string, string>
  transformEvent?: (event: AnalyticsEvent) => any
}): AnalyticsProvider {
  return {
    name: 'custom-api',
    track: async (event) => {
      const payload = config.transformEvent ? config.transformEvent(event) : event
      
      try {
        await fetch(config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify(payload),
        })
      } catch (error) {
        console.error('[Analytics] Failed to send event to custom API:', error)
      }
    },
    identify: async (user) => {
      try {
        await fetch(`${config.endpoint}/identify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify(user),
        })
      } catch (error) {
        console.error('[Analytics] Failed to identify user:', error)
      }
    },
    page: async (pageView) => {
      try {
        await fetch(`${config.endpoint}/page`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          body: JSON.stringify(pageView),
        })
      } catch (error) {
        console.error('[Analytics] Failed to track page view:', error)
      }
    },
  }
}

/**
 * LocalStorage Provider (for testing/offline)
 * 
 * Stores events in localStorage for debugging
 */
export function createLocalStorageProvider(storageKey: string = 'analytics_events'): AnalyticsProvider {
  return {
    name: 'localStorage',
    track: (event) => {
      if (typeof window === 'undefined') return
      
      try {
        const events = JSON.parse(localStorage.getItem(storageKey) || '[]')
        events.push(event)
        
        // Keep only last 100 events
        if (events.length > 100) {
          events.shift()
        }
        
        localStorage.setItem(storageKey, JSON.stringify(events))
      } catch (error) {
        console.error('[Analytics] Failed to store event:', error)
      }
    },
    identify: (user) => {
      if (typeof window === 'undefined') return
      
      try {
        localStorage.setItem(`${storageKey}_user`, JSON.stringify(user))
      } catch (error) {
        console.error('[Analytics] Failed to store user:', error)
      }
    },
    reset: () => {
      if (typeof window === 'undefined') return
      
      try {
        localStorage.removeItem(storageKey)
        localStorage.removeItem(`${storageKey}_user`)
      } catch (error) {
        console.error('[Analytics] Failed to reset:', error)
      }
    },
  }
}
