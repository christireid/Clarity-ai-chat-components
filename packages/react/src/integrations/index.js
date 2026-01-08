/**
 * Clarity Chat Integrations
 *
 * Optional integrations for error tracking, analytics, and monitoring.
 * These are tree-shakeable and only included if imported.
 */
// Sentry Error Tracking
export { initSentry, captureAIError, addChatBreadcrumb, useSentryChat, withSentryErrorBoundary, startAITransaction, } from './sentry';
// Analytics (PostHog, Vercel)
export { AnalyticsProvider, useAnalytics, useChatAnalytics, useWebVitals, } from './analytics';
//# sourceMappingURL=index.js.map