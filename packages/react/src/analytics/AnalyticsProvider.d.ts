/**
 * Analytics Provider
 *
 * Context provider for analytics tracking throughout the application
 */
import * as React from 'react';
import type { AnalyticsConfig, AnalyticsUser, PageView } from './types';
interface AnalyticsContextValue {
    /**
     * Track an event
     */
    track: (eventName: string, properties?: Record<string, any>) => void;
    /**
     * Identify a user
     */
    identify: (user: AnalyticsUser) => void;
    /**
     * Track a page view
     */
    page: (pageView: PageView) => void;
    /**
     * Reset analytics (clear user data)
     */
    reset: () => void;
    /**
     * Check if analytics is enabled
     */
    isEnabled: boolean;
    /**
     * Get current configuration
     */
    config: AnalyticsConfig;
}
export interface AnalyticsProviderProps {
    children: React.ReactNode;
    config: AnalyticsConfig;
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
export declare function AnalyticsProvider({ children, config }: AnalyticsProviderProps): import("react/jsx-runtime").JSX.Element;
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
export declare function useAnalytics(): AnalyticsContextValue;
export {};
//# sourceMappingURL=AnalyticsProvider.d.ts.map