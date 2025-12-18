/**
 * Chat Analytics Service
 *
 * Provides a production-ready abstraction for tracking chat interactions.
 * Supports multiple analytics providers, environment-aware logging, and
 * batching for high-volume scenarios.
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
  /** Optional: Personality mode selected */
  personalityMode?: 'friendly' | 'technical' | 'concise'
  /** Optional: Query complexity classification */
  queryComplexity?: 'simple' | 'moderate' | 'complex'
  /** Optional: Whether demo mode was used as fallback */
  isDemoMode?: boolean
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

interface AnalyticsEvent {
  type:
    | 'chat_interaction'
    | 'api_error'
    | 'search_query'
    | 'personality_mode_change'
    | 'demo_mode_usage'
  data: Record<string, unknown>
  timestamp: string
}

// Batching configuration
const BATCH_SIZE = 10
const FLUSH_INTERVAL_MS = 5000

// Analytics queue for batching
let analyticsQueue: AnalyticsEvent[] = []
let flushTimer: ReturnType<typeof setTimeout> | null = null

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
 * Queue an event for batched sending
 */
function queueEvent(event: AnalyticsEvent): void {
  const config = getConfig()

  if (!config.sendToService || !config.serviceEndpoint) {
    return
  }

  analyticsQueue.push(event)

  // Flush if we've hit the batch size
  if (analyticsQueue.length >= BATCH_SIZE) {
    flushAnalytics()
    return
  }

  // Set up timer for periodic flush if not already running
  if (!flushTimer) {
    flushTimer = setTimeout(() => {
      flushAnalytics()
    }, FLUSH_INTERVAL_MS)
  }
}

/**
 * Flush all queued analytics events
 */
export function flushAnalytics(): void {
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  if (analyticsQueue.length === 0) {
    return
  }

  const config = getConfig()
  if (!config.sendToService || !config.serviceEndpoint) {
    analyticsQueue = []
    return
  }

  // Take all events and clear the queue
  const eventsToSend = [...analyticsQueue]
  analyticsQueue = []

  // Send batch to analytics service
  sendBatchToAnalyticsService(config.serviceEndpoint, eventsToSend).catch(
    (error) => {
      console.error('[Analytics] Failed to send batch:', error)
    }
  )
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

  const timestamp = new Date().toISOString()
  const enrichedMetrics = {
    ...metrics,
    timestamp,
    environment: process.env.NODE_ENV,
  }

  // Log to console in development
  if (config.logToConsole) {
    logger.debug('[Analytics] Chat interaction:', enrichedMetrics)
  }

  // Queue for batched sending in production
  queueEvent({
    type: 'chat_interaction',
    data: enrichedMetrics,
    timestamp,
  })
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

  const timestamp = new Date().toISOString()
  const enrichedError = {
    ...error,
    timestamp,
    environment: process.env.NODE_ENV,
  }

  if (config.logToConsole) {
    console.error('[Analytics] API error:', enrichedError)
  }

  // Errors are queued with type marker for batching
  queueEvent({
    type: 'api_error',
    data: enrichedError,
    timestamp,
  })
}

/**
 * Track personality mode selection for UX insights
 *
 * @example
 * ```ts
 * trackPersonalityModeChange({
 *   previousMode: 'friendly',
 *   newMode: 'technical',
 *   sessionId: 'session-123',
 * })
 * ```
 */
export function trackPersonalityModeChange(data: {
  previousMode?: 'friendly' | 'technical' | 'concise'
  newMode: 'friendly' | 'technical' | 'concise'
  sessionId?: string
  userId?: string
}): void {
  const config = getConfig()

  if (!config.enabled) {
    return
  }

  const timestamp = new Date().toISOString()
  const enrichedData = {
    type: 'personality_mode_change',
    ...data,
    timestamp,
    environment: process.env.NODE_ENV,
  }

  if (config.logToConsole) {
    logger.debug('[Analytics] Personality mode change:', enrichedData)
  }

  queueEvent({
    type: 'personality_mode_change' as AnalyticsEvent['type'],
    data: enrichedData,
    timestamp,
  })
}

/**
 * Track demo mode usage for understanding API key adoption
 */
export function trackDemoModeUsage(data: {
  query: string
  matchedTopic?: string
  sessionId?: string
}): void {
  const config = getConfig()

  if (!config.enabled) {
    return
  }

  const timestamp = new Date().toISOString()
  const enrichedData = {
    type: 'demo_mode_usage',
    queryLength: data.query.length,
    matchedTopic: data.matchedTopic || 'default',
    sessionId: data.sessionId,
    timestamp,
    environment: process.env.NODE_ENV,
  }

  if (config.logToConsole) {
    logger.debug('[Analytics] Demo mode usage:', enrichedData)
  }

  queueEvent({
    type: 'demo_mode_usage' as AnalyticsEvent['type'],
    data: enrichedData,
    timestamp,
  })
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

  const timestamp = new Date().toISOString()
  const enrichedQuery = {
    ...query,
    timestamp,
  }

  if (config.logToConsole) {
    logger.debug('[Analytics] Search query:', enrichedQuery)
  }

  queueEvent({
    type: 'search_query',
    data: enrichedQuery,
    timestamp,
  })
}

/**
 * Send a batch of events to the analytics service
 */
async function sendBatchToAnalyticsService(
  endpoint: string,
  events: AnalyticsEvent[]
): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.ANALYTICS_API_KEY || ''}`,
    },
    body: JSON.stringify({
      batch: true,
      events,
      sentAt: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    throw new Error(`Analytics service returned ${response.status}`)
  }
}

/**
 * Send metrics to external analytics service (single event - for backwards compatibility)
 * @deprecated Use batched sending via queueEvent instead
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

/**
 * Get the current queue size (useful for testing/monitoring)
 */
export function getQueueSize(): number {
  return analyticsQueue.length
}

/**
 * Clear the queue without sending (useful for testing)
 */
export function clearQueue(): void {
  analyticsQueue = []
  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }
}

// Note: In a real production environment, you would also want to:
// 1. Add process.on('beforeExit') handler to flush on shutdown
// 2. Use a more robust queue (e.g., Redis) for distributed systems
// 3. Add retry logic with exponential backoff
// 4. Implement circuit breaker pattern for failing endpoints
