/**
 * Analytics System
 * 
 * Complete analytics solution for tracking user behavior and application performance.
 * 
 * Features:
 * - Provider-agnostic architecture
 * - Multiple analytics providers support (GA4, Mixpanel, PostHog, Amplitude, etc.)
 * - Auto-tracking (page views, errors, performance)
 * - React hooks for common patterns
 * - Type-safe event tracking
 * - Debug mode
 * - "Do Not Track" respect
 * - Session management
 * 
 * @example
 * ```tsx
 * import { 
 *   AnalyticsProvider, 
 *   useAnalytics,
 *   createGoogleAnalyticsProvider 
 * } from '@/analytics'
 * 
 * // Setup
 * const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')
 * 
 * <AnalyticsProvider
 *   config={{
 *     enabled: true,
 *     providers: [gaProvider],
 *     autoTrackPageViews: true,
 *     autoTrackErrors: true,
 *   }}
 * >
 *   <App />
 * </AnalyticsProvider>
 * 
 * // Usage
 * function MyComponent() {
 *   const { track } = useAnalytics()
 *   
 *   const handleClick = () => {
 *     track('button_clicked', { button_name: 'submit' })
 *   }
 *   
 *   return <button onClick={handleClick}>Submit</button>
 * }
 * ```
 */

// Core - Export types
export type {
  AnalyticsEvent,
  AnalyticsUser,
  PageView,
  AnalyticsConfig,
  AnalyticsProvider as AnalyticsProviderInterface,
} from './types'

// Export constants
export { AnalyticsEvents } from './types'

// Export provider component and hook
export { AnalyticsProvider, useAnalytics } from './AnalyticsProvider'

// Export provider implementations
export * from './providers'

// Export tracking hooks
export * from './hooks'
