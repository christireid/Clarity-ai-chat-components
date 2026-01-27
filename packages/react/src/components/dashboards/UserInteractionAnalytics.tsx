'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { useReducedMotion } from '@/hooks/ui/use-reduced-motion'
import { ANIMATION_PRESETS } from '@/animations/constants'

/**
 * Interaction event types
 */
export type InteractionEventType =
  | 'click'
  | 'hover'
  | 'scroll'
  | 'input'
  | 'submit'
  | 'copy'
  | 'select'
  | 'feature_discovery'
  | 'navigation'

/**
 * Interaction event data
 */
export interface InteractionEvent {
  id: string
  type: InteractionEventType
  target: string
  element?: string
  timestamp: number
  metadata?: Record<string, any>
  position?: { x: number; y: number }
  sessionId?: string
  userId?: string
}

/**
 * Feature interaction data
 */
export interface FeatureInteraction {
  featureId: string
  featureName: string
  interactionCount: number
  uniqueUsers: number
  firstDiscovery: number
  lastInteraction: number
  avgTimeToDiscover: number
  usageRate: number
}

/**
 * Click heatmap data point
 */
export interface HeatmapPoint {
  x: number
  y: number
  intensity: number
  timestamp: number
}

/**
 * User journey step
 */
export interface JourneyStep {
  id: string
  action: string
  target: string
  timestamp: number
  duration?: number
  metadata?: Record<string, any>
}

/**
 * Session analytics
 */
export interface SessionAnalytics {
  sessionId: string
  userId?: string
  startTime: number
  endTime?: number
  duration: number
  pageViews: number
  interactions: number
  features: string[]
  journey: JourneyStep[]
  bounced: boolean
  converted: boolean
}

/**
 * Engagement metrics
 */
export interface EngagementMetrics {
  totalSessions: number
  avgSessionDuration: number
  avgInteractionsPerSession: number
  bounceRate: number
  conversionRate: number
  topFeatures: FeatureInteraction[]
  returnRate: number
  engagementScore: number
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  /** Enable click tracking */
  trackClicks: boolean
  /** Enable hover tracking */
  trackHover: boolean
  /** Enable scroll tracking */
  trackScroll: boolean
  /** Enable feature discovery tracking */
  trackFeatureDiscovery: boolean
  /** Sampling rate (0-1) */
  samplingRate: number
  /** Session timeout (ms) */
  sessionTimeout: number
  /** Heatmap resolution */
  heatmapResolution: number
}

/**
 * Props for UserInteractionAnalytics
 */
export interface UserInteractionAnalyticsProps {
  /** Analytics configuration */
  config?: Partial<AnalyticsConfig>
  /** Initial events */
  initialEvents?: InteractionEvent[]
  /** Callback when event is tracked */
  onEventTracked?: (event: InteractionEvent) => void
  /** Callback when analytics are generated */
  onAnalyticsGenerated?: (analytics: EngagementMetrics) => void
  /** Enable real-time updates */
  realtime?: boolean
  /** Update interval (ms) */
  updateInterval?: number
  /** Show detailed view */
  detailed?: boolean
  /** Custom className */
  className?: string
}

const defaultConfig: AnalyticsConfig = {
  trackClicks: true,
  trackHover: true,
  trackScroll: true,
  trackFeatureDiscovery: true,
  samplingRate: 1.0,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  heatmapResolution: 10, // 10x10 grid
}

/**
 * UserInteractionAnalytics Component
 *
 * Tracks and visualizes user interactions including:
 * - Click patterns and heatmaps
 * - Feature discovery tracking
 * - User journey visualization
 * - Session analytics
 * - Engagement metrics
 */
export function UserInteractionAnalytics({
  config: userConfig,
  initialEvents = [],
  onEventTracked,
  onAnalyticsGenerated,
  realtime = true,
  updateInterval = 5000,
  detailed = false,
  className,
}: UserInteractionAnalyticsProps) {
  const config = { ...defaultConfig, ...userConfig }
  const prefersReducedMotion = useReducedMotion()

  const [events, setEvents] = React.useState<InteractionEvent[]>(initialEvents)
  const [sessions, setSessions] = React.useState<SessionAnalytics[]>([])
  const [metrics, setMetrics] = React.useState<EngagementMetrics | null>(null)
  const [heatmap, setHeatmap] = React.useState<HeatmapPoint[]>([])
  const [isTracking, setIsTracking] = React.useState(true)
  const [selectedView, setSelectedView] = React.useState<
    'overview' | 'features' | 'journey' | 'heatmap'
  >('overview')

  const currentSessionId = React.useRef<string>(`session-${Date.now()}`)

  // Track interaction event
  const trackEvent = React.useCallback(
    (event: Omit<InteractionEvent, 'id' | 'timestamp' | 'sessionId'>) => {
      if (!isTracking) return
      if (Math.random() > config.samplingRate) return

      const newEvent: InteractionEvent = {
        ...event,
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        sessionId: currentSessionId.current,
      }

      setEvents((prev) => [...prev, newEvent])
      onEventTracked?.(newEvent)

      // Update heatmap for click events
      if (event.type === 'click' && event.position) {
        setHeatmap((prev) => [
          ...prev,
          {
            x: event.position!.x,
            y: event.position!.y,
            intensity: 1,
            timestamp: Date.now(),
          },
        ])
      }
    },
    [isTracking, config.samplingRate, onEventTracked]
  )

  // Set up global event listeners
  React.useEffect(() => {
    if (!isTracking) return

    const handleClick = (e: MouseEvent) => {
      if (!config.trackClicks) return

      const target = e.target as HTMLElement
      trackEvent({
        type: 'click',
        target: target.tagName,
        element: target.id || target.className || undefined,
        position: { x: e.clientX, y: e.clientY },
        metadata: {
          button: e.button,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
        },
      })
    }

    const handleScroll = () => {
      if (!config.trackScroll) return

      trackEvent({
        type: 'scroll',
        target: 'window',
        metadata: {
          scrollY: window.scrollY,
          scrollX: window.scrollX,
        },
      })
    }

    let scrollTimeout: NodeJS.Timeout
    const throttledScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScroll, 200)
    }

    if (config.trackClicks) {
      document.addEventListener('click', handleClick)
    }
    if (config.trackScroll) {
      window.addEventListener('scroll', throttledScroll)
    }

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', throttledScroll)
      clearTimeout(scrollTimeout)
    }
  }, [isTracking, config.trackClicks, config.trackScroll, trackEvent])

  // Generate analytics from events
  const generateAnalytics = React.useCallback(() => {
    if (events.length === 0) return

    // Calculate sessions
    const sessionMap = new Map<string, SessionAnalytics>()

    events.forEach((event) => {
      const sessionId = event.sessionId || 'unknown'

      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          sessionId,
          userId: event.userId,
          startTime: event.timestamp,
          endTime: event.timestamp,
          duration: 0,
          pageViews: 0,
          interactions: 0,
          features: [],
          journey: [],
          bounced: false,
          converted: false,
        })
      }

      const session = sessionMap.get(sessionId)!
      session.endTime = Math.max(session.endTime || 0, event.timestamp)
      session.duration = session.endTime - session.startTime
      session.interactions++

      // Track feature usage
      if (event.type === 'feature_discovery' && event.metadata?.featureName) {
        if (!session.features.includes(event.metadata.featureName)) {
          session.features.push(event.metadata.featureName)
        }
      }

      // Add to journey
      session.journey.push({
        id: event.id,
        action: event.type,
        target: event.target,
        timestamp: event.timestamp,
        metadata: event.metadata,
      })
    })

    const sessionsList = Array.from(sessionMap.values())
    setSessions(sessionsList)

    // Calculate engagement metrics
    const totalSessions = sessionsList.length
    const avgSessionDuration =
      sessionsList.reduce((sum, s) => sum + s.duration, 0) / totalSessions
    const avgInteractionsPerSession =
      sessionsList.reduce((sum, s) => sum + s.interactions, 0) / totalSessions

    // Bounce rate (sessions with < 2 interactions or < 10 seconds)
    const bounces = sessionsList.filter(
      (s) => s.interactions < 2 || s.duration < 10000
    ).length
    const bounceRate = bounces / totalSessions

    // Calculate feature interactions
    const featureMap = new Map<string, FeatureInteraction>()
    events
      .filter((e) => e.type === 'feature_discovery')
      .forEach((event) => {
        const featureName = event.metadata?.featureName || 'unknown'

        if (!featureMap.has(featureName)) {
          featureMap.set(featureName, {
            featureId: event.metadata?.featureId || featureName,
            featureName,
            interactionCount: 0,
            uniqueUsers: new Set([event.userId]).size,
            firstDiscovery: event.timestamp,
            lastInteraction: event.timestamp,
            avgTimeToDiscover: 0,
            usageRate: 0,
          })
        }

        const feature = featureMap.get(featureName)!
        feature.interactionCount++
        feature.lastInteraction = Math.max(
          feature.lastInteraction,
          event.timestamp
        )
      })

    const topFeatures = Array.from(featureMap.values())
      .sort((a, b) => b.interactionCount - a.interactionCount)
      .slice(0, 10)

    // Calculate engagement score (0-100)
    const engagementScore = Math.min(
      100,
      Math.round(
        (avgSessionDuration / 60000) * 20 + // 20 points for avg duration in minutes
          (avgInteractionsPerSession / 10) * 30 + // 30 points for interactions
          (1 - bounceRate) * 30 + // 30 points for low bounce rate
          (topFeatures.length / 10) * 20 // 20 points for feature diversity
      )
    )

    const metrics: EngagementMetrics = {
      totalSessions,
      avgSessionDuration,
      avgInteractionsPerSession,
      bounceRate,
      conversionRate: 0, // Would need conversion tracking
      topFeatures,
      returnRate: 0, // Would need user ID tracking
      engagementScore,
    }

    setMetrics(metrics)
    onAnalyticsGenerated?.(metrics)
  }, [events, onAnalyticsGenerated])

  // Auto-generate analytics
  React.useEffect(() => {
    if (!realtime) return

    const interval = setInterval(() => {
      generateAnalytics()
    }, updateInterval)

    return () => clearInterval(interval)
  }, [realtime, updateInterval, generateAnalytics])

  // Initial analytics generation
  React.useEffect(() => {
    if (events.length > 0) {
      generateAnalytics()
    }
  }, [events.length, generateAnalytics])

  // Format duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  // Render overview
  const renderOverview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sessions</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="text-2xl font-bold">
              {metrics?.totalSessions || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Duration</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="text-2xl font-bold">
              {metrics ? formatDuration(metrics.avgSessionDuration) : '0s'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bounce Rate</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="text-2xl font-bold">
              {metrics ? `${(metrics.bounceRate * 100).toFixed(1)}%` : '0%'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Engagement Score</CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="text-2xl font-bold">
              {metrics?.engagementScore || 0}
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="">
          <CardTitle>Session Analytics</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Avg Interactions per Session
              </span>
              <span className="font-medium">
                {metrics ? metrics.avgInteractionsPerSession.toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total Events Tracked
              </span>
              <span className="font-medium">{events.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Active Sessions
              </span>
              <span className="font-medium">{sessions.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render feature discovery
  const renderFeatures = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="">
          <CardTitle>Top Features</CardTitle>
          <CardDescription>Most discovered and used features</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-3">
            {metrics?.topFeatures.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No feature interactions tracked yet
              </p>
            )}

            {metrics?.topFeatures.map((feature, index) => (
              <motion.div
                key={feature.featureId}
                {...(prefersReducedMotion
                  ? ANIMATION_PRESETS.fadeIn
                  : ANIMATION_PRESETS.slideRight)}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{index + 1}</Badge>
                  <div>
                    <div className="font-medium">{feature.featureName}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.interactionCount} interactions
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {feature.uniqueUsers} users
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render user journey
  const renderJourney = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="">
          <CardTitle>Recent User Journey</CardTitle>
          <CardDescription>Last 10 interactions</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-2">
            {events
              .slice(-10)
              .reverse()
              .map((event, index) => (
                <motion.div
                  key={event.id}
                  {...(prefersReducedMotion
                    ? ANIMATION_PRESETS.fadeIn
                    : ANIMATION_PRESETS.slideDown)}
                  transition={{ delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3 p-2 border-l-2 border-primary/20 pl-3"
                >
                  <Badge variant="secondary" className="mt-0.5">
                    {event.type}
                  </Badge>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{event.target}</div>
                    {event.element && (
                      <div className="text-xs text-muted-foreground">
                        {event.element}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}

            {events.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No interactions tracked yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Render heatmap (simplified visualization)
  const renderHeatmap = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="">
          <CardTitle>Click Heatmap</CardTitle>
          <CardDescription>Click density visualization</CardDescription>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              Total clicks: {heatmap.length}
            </div>

            {heatmap.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No clicks tracked yet. Click around to see the heatmap.
              </p>
            )}

            {heatmap.length > 0 && (
              <div className="text-sm">
                <div className="font-medium mb-2">Recent Click Positions:</div>
                <div className="space-y-1 max-h-60 overflow-auto">
                  {heatmap.slice(-20).map((point, index) => (
                    <div key={index} className="flex justify-between text-xs">
                      <span>
                        ({point.x}, {point.y})
                      </span>
                      <span className="text-muted-foreground">
                        {new Date(point.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Interaction Analytics</CardTitle>
            <CardDescription>
              Track and analyze user behavior patterns
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isTracking ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsTracking(!isTracking)}
            >
              {isTracking ? 'Tracking' : 'Paused'}
            </Button>

            {detailed && (
              <Button variant="outline" size="sm" onClick={generateAnalytics}>
                Refresh
              </Button>
            )}
          </div>
        </div>

        {/* View selector */}
        <div className="flex gap-2 mt-4">
          <Button
            variant={selectedView === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('overview')}
          >
            Overview
          </Button>
          <Button
            variant={selectedView === 'features' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('features')}
          >
            Features
          </Button>
          <Button
            variant={selectedView === 'journey' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('journey')}
          >
            Journey
          </Button>
          <Button
            variant={selectedView === 'heatmap' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedView('heatmap')}
          >
            Heatmap
          </Button>
        </div>
      </CardHeader>

      <CardContent className="">
        {prefersReducedMotion ? (
          <div key={selectedView}>
            {selectedView === 'overview' && renderOverview()}
            {selectedView === 'features' && renderFeatures()}
            {selectedView === 'journey' && renderJourney()}
            {selectedView === 'heatmap' && renderHeatmap()}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedView}
              {...ANIMATION_PRESETS.slideUp}
              transition={{
                // Framer Motion 12: Spring view transitions
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
            >
              {selectedView === 'overview' && renderOverview()}
              {selectedView === 'features' && renderFeatures()}
              {selectedView === 'journey' && renderJourney()}
              {selectedView === 'heatmap' && renderHeatmap()}
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Hook for tracking user interactions
 */
export function useInteractionTracking(config?: Partial<AnalyticsConfig>) {
  const [events, setEvents] = React.useState<InteractionEvent[]>([])
  const fullConfig = { ...defaultConfig, ...config }

  const trackInteraction = React.useCallback(
    (
      type: InteractionEventType,
      target: string,
      metadata?: Record<string, any>
    ) => {
      const event: InteractionEvent = {
        id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        target,
        timestamp: Date.now(),
        metadata,
      }

      setEvents((prev) => [...prev, event])
      return event
    },
    []
  )

  const trackFeatureDiscovery = React.useCallback(
    (featureName: string, featureId?: string) => {
      return trackInteraction('feature_discovery', featureName, {
        featureName,
        featureId: featureId || featureName,
      })
    },
    [trackInteraction]
  )

  const clearEvents = React.useCallback(() => {
    setEvents([])
  }, [])

  return {
    events,
    trackInteraction,
    trackFeatureDiscovery,
    clearEvents,
  }
}
