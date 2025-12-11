/**
 * Clarity Chat Integrations
 *
 * Optional integrations for error tracking, analytics, and monitoring.
 * These are tree-shakeable and only included if imported.
 */

// Sentry Error Tracking
export {
  initSentry,
  captureAIError,
  addChatBreadcrumb,
  useSentryChat,
  withSentryErrorBoundary,
  startAITransaction,
} from './sentry'
export type { SentryOptions, SentryScope, SentryBreadcrumb } from './sentry'

// Analytics (PostHog, Vercel)
export {
  AnalyticsProvider,
  useAnalytics,
  useChatAnalytics,
  useWebVitals,
} from './analytics'
export type {
  PostHogConfig,
  VercelAnalyticsConfig,
  AnalyticsProviderProps,
  AnalyticsContextValue,
  ChatAnalyticsEvent,
  ChatEventProperties,
} from './analytics'
