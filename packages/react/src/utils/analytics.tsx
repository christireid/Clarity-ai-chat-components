/**
 * Analytics and Usage Tracking Utilities
 *
 * Comprehensive analytics system for component usage tracking,
 * user interaction monitoring, and performance metrics collection.
 */

import { errorReporter } from './error-boundary'

// ============================================================================
// TYPES
// ============================================================================

export interface AnalyticsEvent {
  /** Event type */
  type: string
  /** Component name */
  component?: string
  /** User action or interaction */
  action?: string
  /** Event category */
  category?: string
  /** Additional metadata */
  metadata?: Record<string, any>
  /** Timestamp */
  timestamp: number
  /** Session ID */
  sessionId?: string
  /** User ID (if available) */
  userId?: string
}

export interface ComponentUsageEvent extends AnalyticsEvent {
  type: 'component_usage'
  component: string
  action: 'mount' | 'unmount' | 'render' | 'interaction'
  metadata: {
    props?: Record<string, any>
    renderTime?: number
    interactionType?: string
    element?: string
  }
}

export interface PerformanceEvent extends AnalyticsEvent {
  type: 'performance'
  component: string
  action: 'measure'
  category: 'render' | 'interaction' | 'memory' | 'network'
  metadata: {
    duration?: number
    memoryUsage?: number
    renderCount?: number
    interactionLatency?: number
  }
}

export interface ErrorEvent extends AnalyticsEvent {
  type: 'error'
  component?: string
  action: 'caught' | 'unhandled'
  category: 'javascript' | 'network' | 'validation'
  metadata: {
    error: {
      name: string
      message: string
      stack?: string
    }
    context?: Record<string, any>
  }
}

export interface UserJourneyEvent extends AnalyticsEvent {
  type: 'user_journey'
  action: 'page_view' | 'feature_usage' | 'conversion'
  category: 'navigation' | 'engagement' | 'completion'
  metadata: {
    page?: string
    feature?: string
    step?: number
    totalSteps?: number
  }
}

export interface AnalyticsConfig {
  /** Enable analytics tracking */
  enabled?: boolean
  /** Analytics provider endpoint */
  endpoint?: string
  /** Batch events before sending */
  batchEvents?: boolean
  /** Batch size */
  batchSize?: number
  /** Flush interval in milliseconds */
  flushInterval?: number
  /** Sample rate (0-1) */
  sampleRate?: number
  /** Anonymize user data */
  anonymize?: boolean
  /** Track performance metrics */
  trackPerformance?: boolean
  /** Track user interactions */
  trackInteractions?: boolean
  /** Track component usage */
  trackComponents?: boolean
  /** Custom event handler */
  onEvent?: (event: AnalyticsEvent) => void
  /** Custom error handler */
  onError?: (error: Error) => void
}

// ============================================================================
// ANALYTICS MANAGER
// ============================================================================

/**
 * Analytics manager for collecting and sending events
 */
class AnalyticsManager {
  private static instance: AnalyticsManager
  private config: Required<AnalyticsConfig>
  private events: AnalyticsEvent[] = []
  private sessionId: string
  private flushTimer?: NodeJS.Timeout
  private isInitialized = false

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.config = {
      enabled: true,
      endpoint: '/api/analytics',
      batchEvents: true,
      batchSize: 10,
      flushInterval: 30000, // 30 seconds
      sampleRate: 1.0,
      anonymize: false,
      trackPerformance: true,
      trackInteractions: true,
      trackComponents: true,
      onEvent: () => {},
      onError: (error) => console.error('Analytics error:', error),
    }
  }

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  /**
   * Initialize analytics with configuration
   */
  initialize(config: Partial<AnalyticsConfig> = {}): void {
    this.config = { ...this.config, ...config }
    this.isInitialized = true

    if (this.config.batchEvents && this.config.flushInterval > 0) {
      this.startFlushTimer()
    }

    // Track session start
    this.trackEvent({
      type: 'session',
      action: 'start',
      timestamp: Date.now(),
      sessionId: this.sessionId,
    })
  }

  /**
   * Track an analytics event
   */
  trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void {
    if (!this.config.enabled) return
    if (Math.random() > this.config.sampleRate) return

    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    }

    // Call custom event handler
    try {
      this.config.onEvent(fullEvent)
    } catch (error) {
      this.config.onError(error as Error)
    }

    if (this.config.batchEvents) {
      this.events.push(fullEvent)

      if (this.events.length >= this.config.batchSize) {
        this.flush()
      }
    } else {
      this.sendEvent(fullEvent)
    }
  }

  /**
   * Track component usage
   */
  trackComponentUsage(
    component: string,
    action: ComponentUsageEvent['action'],
    metadata: Partial<ComponentUsageEvent['metadata']> = {}
  ): void {
    if (!this.config.trackComponents) return

    this.trackEvent({
      type: 'component_usage',
      component,
      action,
      metadata,
    })
  }

  /**
   * Track performance metrics
   */
  trackPerformance(
    component: string,
    category: PerformanceEvent['category'],
    metadata: Partial<PerformanceEvent['metadata']>
  ): void {
    if (!this.config.trackPerformance) return

    this.trackEvent({
      type: 'performance',
      component,
      action: 'measure',
      category,
      metadata,
    })
  }

  /**
   * Track user interaction
   */
  trackInteraction(
    component: string,
    interactionType: string,
    element?: string,
    metadata: Record<string, any> = {}
  ): void {
    if (!this.config.trackInteractions) return

    this.trackEvent({
      type: 'component_usage',
      component,
      action: 'interaction',
      metadata: {
        interactionType,
        element,
        ...metadata,
      },
    })
  }

  /**
   * Track error event
   */
  trackError(
    error: Error,
    component?: string,
    context?: Record<string, any>
  ): void {
    this.trackEvent({
      type: 'error',
      component,
      action: 'caught',
      category: 'javascript',
      metadata: {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
        context,
      },
    })
  }

  /**
   * Track user journey event
   */
  trackJourney(
    action: UserJourneyEvent['action'],
    category: UserJourneyEvent['category'],
    metadata: Partial<UserJourneyEvent['metadata']> = {}
  ): void {
    this.trackEvent({
      type: 'user_journey',
      action,
      category,
      metadata,
    })
  }

  /**
   * Flush batched events
   */
  flush(): void {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    this.sendEvents(eventsToSend)
  }

  /**
   * Send single event
   */
  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    try {
      if (typeof window !== 'undefined' && navigator.sendBeacon) {
        // Use sendBeacon for reliable delivery
        const blob = new Blob([JSON.stringify(event)], {
          type: 'application/json'
        })
        navigator.sendBeacon(this.config.endpoint, blob)
      } else {
        // Fallback to fetch
        await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
          keepalive: true,
        })
      }
    } catch (error) {
      this.config.onError(error as Error)
    }
  }

  /**
   * Send multiple events
   */
  private async sendEvents(events: AnalyticsEvent[]): Promise<void> {
    try {
      const payload = { events, sessionId: this.sessionId }

      if (typeof window !== 'undefined' && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], {
          type: 'application/json'
        })
        navigator.sendBeacon(this.config.endpoint, blob)
      } else {
        await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          keepalive: true,
        })
      }
    } catch (error) {
      this.config.onError(error as Error)
    }
  }

  /**
   * Start flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }

    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.config.flushInterval)
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled
  }

  /**
   * Get analytics configuration
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config }

    if (this.config.batchEvents && this.config.flushInterval > 0) {
      this.startFlushTimer()
    } else if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = undefined
    }
  }
}

// Global analytics manager instance
export const analyticsManager = AnalyticsManager.getInstance()

// ============================================================================
// REACT HOOKS
// ============================================================================

/**
 * Hook for component usage tracking
 */
export function useAnalytics(componentName: string, trackUsage = true) {
  const mountTime = React.useRef<number>()
  const renderCount = React.useRef(0)

  React.useEffect(() => {
    mountTime.current = Date.now()
    renderCount.current = 0

    if (trackUsage) {
      analyticsManager.trackComponentUsage(componentName, 'mount')
    }

    return () => {
      if (trackUsage && mountTime.current) {
        const duration = Date.now() - mountTime.current
        analyticsManager.trackComponentUsage(componentName, 'unmount', {
          duration,
          renderCount: renderCount.current,
        })
      }
    }
  }, [componentName, trackUsage])

  // Track renders
  React.useEffect(() => {
    renderCount.current++
    if (trackUsage && renderCount.current > 1) {
      analyticsManager.trackComponentUsage(componentName, 'render', {
        renderCount: renderCount.current,
      })
    }
  })

  const trackInteraction = React.useCallback(
    (interactionType: string, element?: string, metadata?: Record<string, any>) => {
      analyticsManager.trackInteraction(componentName, interactionType, element, metadata)
    },
    [componentName]
  )

  const trackPerformance = React.useCallback(
    (category: PerformanceEvent['category'], metadata: Partial<PerformanceEvent['metadata']>) => {
      analyticsManager.trackPerformance(componentName, category, metadata)
    },
    [componentName]
  )

  return {
    trackInteraction,
    trackPerformance,
    renderCount: renderCount.current,
  }
}

/**
 * Hook for measuring render performance
 */
export function useRenderPerformance(componentName: string, enabled = true) {
  const renderStartTime = React.useRef<number>()
  const lastRenderDuration = React.useRef<number>(0)

  React.useLayoutEffect(() => {
    if (!enabled) return

    renderStartTime.current = performance.now()
  })

  React.useEffect(() => {
    if (!enabled || !renderStartTime.current) return

    const duration = performance.now() - renderStartTime.current
    lastRenderDuration.current = duration

    analyticsManager.trackPerformance(componentName, 'render', {
      duration,
    })
  })

  return {
    lastRenderDuration: lastRenderDuration.current,
  }
}

/**
 * Hook for tracking user interactions
 */
export function useInteractionTracking(componentName: string) {
  const trackClick = React.useCallback(
    (element: string, metadata?: Record<string, any>) => {
      analyticsManager.trackInteraction(componentName, 'click', element, metadata)
    },
    [componentName]
  )

  const trackHover = React.useCallback(
    (element: string, metadata?: Record<string, any>) => {
      analyticsManager.trackInteraction(componentName, 'hover', element, metadata)
    },
    [componentName]
  )

  const trackFocus = React.useCallback(
    (element: string, metadata?: Record<string, any>) => {
      analyticsManager.trackInteraction(componentName, 'focus', element, metadata)
    },
    [componentName]
  )

  const trackScroll = React.useCallback(
    (element: string, metadata?: Record<string, any>) => {
      analyticsManager.trackInteraction(componentName, 'scroll', element, metadata)
    },
    [componentName]
  )

  return {
    trackClick,
    trackHover,
    trackFocus,
    trackScroll,
  }
}

/**
 * Hook for measuring interaction latency
 */
export function useInteractionLatency(componentName: string) {
  const interactionStartTime = React.useRef<number>()

  const startInteraction = React.useCallback(() => {
    interactionStartTime.current = performance.now()
  }, [])

  const endInteraction = React.useCallback(
    (interactionType: string, metadata?: Record<string, any>) => {
      if (!interactionStartTime.current) return

      const latency = performance.now() - interactionStartTime.current

      analyticsManager.trackPerformance(componentName, 'interaction', {
        interactionLatency: latency,
        ...metadata,
      })

      interactionStartTime.current = undefined

      return latency
    },
    [componentName]
  )

  return {
    startInteraction,
    endInteraction,
  }
}

// ============================================================================
// ANALYTICS PROVIDER COMPONENT
// ============================================================================

/**
 * Analytics provider context
 */
const AnalyticsContext = React.createContext<{
  config: AnalyticsConfig
  updateConfig: (config: Partial<AnalyticsConfig>) => void
} | null>(null)

/**
 * Analytics provider props
 */
export interface AnalyticsProviderProps {
  children: React.ReactNode
  config?: Partial<AnalyticsConfig>
}

/**
 * Analytics provider component
 */
export function AnalyticsProvider({ children, config = {} }: AnalyticsProviderProps) {
  const [currentConfig, setCurrentConfig] = React.useState<AnalyticsConfig>(() => ({
    enabled: true,
    endpoint: '/api/analytics',
    batchEvents: true,
    batchSize: 10,
    flushInterval: 30000,
    sampleRate: 1.0,
    anonymize: false,
    trackPerformance: true,
    trackInteractions: true,
    trackComponents: true,
    onEvent: () => {},
    onError: (error) => console.error('Analytics error:', error),
    ...config,
  }))

  React.useEffect(() => {
    analyticsManager.initialize(currentConfig)
  }, [])

  React.useEffect(() => {
    analyticsManager.updateConfig(config)
    setCurrentConfig(prev => ({ ...prev, ...config }))
  }, [config])

  const updateConfig = React.useCallback((newConfig: Partial<AnalyticsConfig>) => {
    setCurrentConfig(prev => ({ ...prev, ...newConfig }))
    analyticsManager.updateConfig(newConfig)
  }, [])

  const contextValue = React.useMemo(
    () => ({
      config: currentConfig,
      updateConfig,
    }),
    [currentConfig, updateConfig]
  )

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook to use analytics context
 */
export function useAnalyticsContext() {
  const context = React.useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider')
  }
  return context
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Create analytics event handler for HTML elements
 */
export function createEventHandler(
  componentName: string,
  interactionType: string,
  element?: string
) {
  return (metadata?: Record<string, any>) => {
    analyticsManager.trackInteraction(componentName, interactionType, element, metadata)
  }
}

/**
 * Performance measurement utility
 */
export function measurePerformance<T>(
  componentName: string,
  operation: string,
  fn: () => T
): T {
  const startTime = performance.now()
  try {
    const result = fn()
    const duration = performance.now() - startTime

    analyticsManager.trackPerformance(componentName, 'render', {
      duration,
    })

    return result
  } catch (error) {
    const duration = performance.now() - startTime

    analyticsManager.trackError(error as Error, componentName, {
      operation,
      duration,
    })

    throw error
  }
}

/**
 * Batch analytics events
 */
export function batchAnalyticsEvents(events: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>[]): void {
  events.forEach(event => analyticsManager.trackEvent(event))
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export {
  type AnalyticsEvent,
  type ComponentUsageEvent,
  type PerformanceEvent,
  type ErrorEvent,
  type UserJourneyEvent,
  type AnalyticsConfig,
}