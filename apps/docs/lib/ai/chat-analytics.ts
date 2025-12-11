/**
 * Chat Analytics Service
 *
 * Provides a production-ready abstraction for tracking chat interactions.
 * Supports multiple analytics providers and environment-aware logging.
 *
 * @example
 * ```ts
 * import { trackChatInteraction } from '@/lib/ai/chat-analytics'
 *
 * // In your API route with after()
 * after(() => {
 *   trackChatInteraction({
 *     messageLength: message.length,
 *     hasDocsContext: true,
 *     provider: 'gemini',
 *   })
 * })
 * ```
 */

export interface ChatInteractionMetrics {
  /** Length of the user's message */
  messageLength: number
  /** Whether documentation context was included */
  hasDocsContext: boolean
  /** Number of search results used for context */
  searchResultsCount: number
  /** AI provider used (gemini, demo, openai, etc.) */
  provider: string
  /** Optional: Response time in milliseconds */
  responseTimeMs?: number
  /** Optional: Number of tokens used */
  tokensUsed?: number
  /** Optional: User identifier (anonymized) */
  userId?: string
  /** Optional: Session identifier */
  sessionId?: string
}

export interface AnalyticsConfig {
  /** Enable/disable analytics (respects ANALYTICS_ENABLED env var) */
  enabled: boolean
  /** Log to console in development */
  logToConsole: boolean
  /** Send to external analytics service */
  sendToService: boolean
  /** Analytics service endpoint */
  serviceEndpoint?: string
}

/**
 * Get analytics configuration from environment
 */
function getConfig(): AnalyticsConfig {
  const isProduction = process.env.NODE_ENV === 'production'
  const analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true'

  return {
    enabled: analyticsEnabled || !isProduction, // Always enabled in dev
    logToConsole: !isProduction,
    sendToService: isProduction && analyticsEnabled,
    serviceEndpoint: process.env.ANALYTICS_ENDPOINT,
  }
}

/**
 * Track a chat interaction
 *
 * This function is designed to be called from within Next.js `after()` callbacks
 * to ensure analytics don't block the response.
 */
export function trackChatInteraction(metrics: ChatInteractionMetrics): void {
  const config = getConfig()

  if (!config.enabled) {
    return
  }

  const enrichedMetrics = {
    ...metrics,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  // Log to console in development
  if (config.logToConsole) {
    console.log('[Analytics] Chat interaction:', enrichedMetrics)
  }

  // Send to external service in production
  if (config.sendToService && config.serviceEndpoint) {
    sendToAnalyticsService(config.serviceEndpoint, enrichedMetrics).catch(
      (error) => {
        // Don't throw - analytics should never break the app
        console.error('[Analytics] Failed to send metrics:', error)
      }
    )
  }
}

/**
 * Track an API error
 */
export function trackApiError(error: {
  path: string
  method: string
  statusCode: number
  errorMessage: string
  stack?: string
}): void {
  const config = getConfig()

  if (!config.enabled) {
    return
  }

  const enrichedError = {
    ...error,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  if (config.logToConsole) {
    console.error('[Analytics] API error:', enrichedError)
  }

  if (config.sendToService && config.serviceEndpoint) {
    sendToAnalyticsService(config.serviceEndpoint, {
      type: 'api_error',
      ...enrichedError,
    }).catch((err) => {
      console.error('[Analytics] Failed to send error metrics:', err)
    })
  }
}

/**
 * Track search queries for improving documentation
 */
export function trackSearchQuery(query: {
  searchTerm: string
  resultsCount: number
  topResultScore?: number
}): void {
  const config = getConfig()

  if (!config.enabled) {
    return
  }

  const enrichedQuery = {
    ...query,
    timestamp: new Date().toISOString(),
  }

  if (config.logToConsole) {
    console.log('[Analytics] Search query:', enrichedQuery)
  }
}

/**
 * Send metrics to external analytics service
 */
async function sendToAnalyticsService(
  endpoint: string,
  data: Record<string, unknown>
): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.ANALYTICS_API_KEY || ''}`,
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Analytics service returned ${response.status}`)
  }
}

/**
 * Create a performance timer for measuring response times
 */
export function createPerformanceTimer(): {
  stop: () => number
} {
  const start = performance.now()
  return {
    stop: () => Math.round(performance.now() - start),
  }
}
