/**
 * Built-in Analytics Providers
 *
 * Pre-configured providers for popular analytics services
 */
import type { AnalyticsProvider, AnalyticsEvent } from './types';
/**
 * Console Logger Provider (for debugging)
 */
export declare function createConsoleProvider(): AnalyticsProvider;
/**
 * Google Analytics 4 Provider
 *
 * @example
 * ```tsx
 * const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')
 * ```
 */
export declare function createGoogleAnalyticsProvider(measurementId: string): AnalyticsProvider;
/**
 * Mixpanel Provider
 *
 * @example
 * ```tsx
 * const mixpanelProvider = createMixpanelProvider('YOUR_TOKEN')
 * ```
 */
export declare function createMixpanelProvider(token: string): AnalyticsProvider;
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
export declare function createPostHogProvider(apiKey: string, options?: {
    api_host?: string;
}): AnalyticsProvider;
/**
 * Amplitude Provider
 *
 * @example
 * ```tsx
 * const amplitudeProvider = createAmplitudeProvider('YOUR_API_KEY')
 * ```
 */
export declare function createAmplitudeProvider(apiKey: string): AnalyticsProvider;
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
export declare function createCustomApiProvider(config: {
    endpoint: string;
    headers?: Record<string, string>;
    transformEvent?: (event: AnalyticsEvent) => any;
}): AnalyticsProvider;
/**
 * LocalStorage Provider (for testing/offline)
 *
 * Stores events in localStorage for debugging
 */
export declare function createLocalStorageProvider(storageKey?: string): AnalyticsProvider;
//# sourceMappingURL=providers.d.ts.map