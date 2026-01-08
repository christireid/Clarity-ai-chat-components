import { jsx as _jsx } from "react/jsx-runtime";
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
import * as React from 'react';
// ============================================
// Context
// ============================================
const AnalyticsContext = React.createContext(undefined);
// Global analytics instance references
let posthogInstance = null;
// ============================================
// Provider
// ============================================
export function AnalyticsProvider({ children, posthog: posthogConfig, vercel: vercelConfig, onTrack, disabled = false, }) {
    const [isReady, setIsReady] = React.useState(false);
    // Initialize PostHog
    React.useEffect(() => {
        if (disabled || !posthogConfig?.apiKey)
            return;
        // Skip in development if configured
        if (posthogConfig.disableInDev !== false &&
            process.env.NODE_ENV === 'development') {
            setIsReady(true);
            return;
        }
        import('posthog-js')
            .then((module) => {
            const posthog = module.default;
            posthogInstance = posthog;
            posthog.init(posthogConfig.apiKey, {
                api_host: posthogConfig.apiHost ?? 'https://app.posthog.com',
                autocapture: posthogConfig.autocapture ?? false,
                capture_pageview: posthogConfig.capturePageview ?? true,
                persistence: 'localStorage',
                loaded: () => {
                    setIsReady(true);
                },
            });
        })
            .catch((err) => {
            console.warn('[Clarity Chat] PostHog not available:', err.message);
            setIsReady(true);
        });
        return () => {
            // Cleanup on unmount
            if (posthogInstance) {
                // PostHog doesn't have a destroy method, just reset
            }
        };
    }, [disabled, posthogConfig]);
    // Initialize Vercel Analytics
    React.useEffect(() => {
        if (disabled || !vercelConfig?.enabled)
            return;
        import('@vercel/analytics')
            .then(({ inject }) => {
            inject({ debug: vercelConfig.debug ?? false });
        })
            .catch((err) => {
            console.warn('[Clarity Chat] Vercel Analytics not available:', err.message);
        });
    }, [disabled, vercelConfig]);
    const track = React.useCallback((event, properties) => {
        if (disabled)
            return;
        // Custom handler
        onTrack?.(event, properties);
        // PostHog
        if (posthogInstance) {
            posthogInstance.capture(event, properties);
        }
        // Vercel Analytics (via Web Vitals, doesn't have custom events)
        // Custom events can be tracked via Vercel's track function if imported
    }, [disabled, onTrack]);
    const identify = React.useCallback((userId, traits) => {
        if (disabled)
            return;
        if (posthogInstance) {
            posthogInstance.identify(userId, traits);
        }
    }, [disabled]);
    const setUserProperties = React.useCallback((properties) => {
        if (disabled)
            return;
        if (posthogInstance) {
            posthogInstance.people.set(properties);
        }
    }, [disabled]);
    const page = React.useCallback((name, properties) => {
        if (disabled)
            return;
        if (posthogInstance) {
            posthogInstance.capture('$pageview', {
                $current_url: window.location.href,
                page_name: name,
                ...properties,
            });
        }
    }, [disabled]);
    const reset = React.useCallback(() => {
        if (disabled)
            return;
        if (posthogInstance) {
            posthogInstance.reset();
        }
    }, [disabled]);
    const value = {
        track,
        identify,
        setUserProperties,
        page,
        reset,
        isReady,
    };
    return (_jsx(AnalyticsContext.Provider, { value: value, children: children }));
}
// ============================================
// Hooks
// ============================================
/**
 * Use analytics context
 */
export function useAnalytics() {
    const context = React.useContext(AnalyticsContext);
    if (!context) {
        // Return no-op functions if not within provider
        return {
            track: () => { },
            identify: () => { },
            setUserProperties: () => { },
            page: () => { },
            reset: () => { },
            isReady: false,
        };
    }
    return context;
}
/**
 * Chat-specific analytics hook with typed events
 */
export function useChatAnalytics() {
    const { track } = useAnalytics();
    const trackChatEvent = React.useCallback((event, properties) => {
        track(event, properties);
    }, [track]);
    const trackMessageSent = React.useCallback((properties) => {
        track('message_sent', {
            ...properties,
            messageRole: 'user',
        });
    }, [track]);
    const trackMessageReceived = React.useCallback((properties) => {
        track('message_received', {
            ...properties,
            messageRole: 'assistant',
        });
    }, [track]);
    const trackToolInvoked = React.useCallback((properties) => {
        track('tool_invoked', properties);
    }, [track]);
    const trackError = React.useCallback((properties) => {
        track('error_occurred', properties);
    }, [track]);
    return {
        trackChatEvent,
        trackMessageSent,
        trackMessageReceived,
        trackToolInvoked,
        trackError,
    };
}
/**
 * Track Web Vitals (for Vercel Analytics compatibility)
 */
export function useWebVitals() {
    React.useEffect(() => {
        import('web-vitals')
            .then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
            onCLS(console.log);
            onFID(console.log);
            onLCP(console.log);
            onFCP(console.log);
            onTTFB(console.log);
        })
            .catch(() => {
            // web-vitals not available
        });
    }, []);
}
export default {
    AnalyticsProvider,
    useAnalytics,
    useChatAnalytics,
    useWebVitals,
};
//# sourceMappingURL=analytics.js.map