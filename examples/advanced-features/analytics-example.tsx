/**
 * Advanced Analytics Examples (Phase 2)
 *
 * Demonstrates user interaction analytics and A/B testing features
 */

'use client'

import * as React from 'react'
import {
  UserInteractionAnalytics,
  ABTestingDashboard,
  useInteractionTracking,
  useABTesting,
  ChatWindow,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@clarity-chat/react'
import type {
  InteractionEvent,
  ExperimentResult,
  ExperimentVariant,
} from '@clarity-chat/react'

// 💡 Type definitions for this example
interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

// =============================================================================
// Example 1: Basic User Interaction Tracking
// =============================================================================

/**
 * Simple interaction tracking setup
 */
export function BasicInteractionExample() {
  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">User Interaction Analytics</h2>

      <UserInteractionAnalytics
        config={{
          trackClicks: true,
          trackFeatureDiscovery: true,
          samplingRate: 1.0,
        }}
        realtime
        updateInterval={5000}
        detailed
        onEventTracked={(event) => {
          console.log('Event tracked:', event)
        }}
        onAnalyticsGenerated={(metrics) => {
          console.log('Engagement score:', metrics.engagementScore)
          console.log('Bounce rate:', metrics.bounceRate)
        }}
      />
    </div>
  )
}

// =============================================================================
// Example 2: Feature Discovery Tracking
// =============================================================================

/**
 * Track when users discover and use features
 */
export function FeatureDiscoveryExample() {
  const { trackFeatureDiscovery, events } = useInteractionTracking()

  const features = [
    { id: 'voice-input', name: 'Voice Input', icon: '🎤' },
    { id: 'file-upload', name: 'File Upload', icon: '📎' },
    { id: 'code-mode', name: 'Code Mode', icon: '💻' },
    { id: 'dark-mode', name: 'Dark Mode', icon: '🌙' },
    { id: 'export', name: 'Export Chat', icon: '📥' },
  ]

  const handleFeatureClick = (featureId: string, featureName: string) => {
    trackFeatureDiscovery(featureName, featureId)
    console.log(`Feature discovered: ${featureName}`)
  }

  // Count discoveries per feature
  const discoveries = React.useMemo(() => {
    const counts = new Map<string, number>()
    events
      .filter(e => e.type === 'feature_discovery')
      .forEach(e => {
        const name = e.metadata?.featureName || 'unknown'
        counts.set(name, (counts.get(name) || 0) + 1)
      })
    return counts
  }, [events])

  return (
    <div className="space-y-4 p-4 max-w-2xl">
      <h2 className="text-2xl font-bold">Feature Discovery Tracking</h2>

      <Card>
        <CardHeader>
          <CardTitle>Click features to track discovery</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {features.map(feature => (
              <Button
                key={feature.id}
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleFeatureClick(feature.id, feature.name)}
              >
                <span>{feature.icon}</span>
                <span>{feature.name}</span>
                {discoveries.has(feature.name) && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {discoveries.get(feature.name)}x
                  </span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Discovery Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Array.from(discoveries.entries()).map(([name, count]) => (
                <div key={name} className="flex justify-between text-sm">
                  <span>{name}</span>
                  <span className="font-medium">{count} discoveries</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// =============================================================================
// Example 3: A/B Testing Setup
// =============================================================================

/**
 * Create and manage A/B tests
 */
export function ABTestingExample() {
  const {
    experiments,
    createExperiment,
    startExperiment,
    getVariant,
    recordMetric,
  } = useABTesting()

  const [userId] = React.useState(`user-${Math.random().toString(36).substr(2, 9)}`)

  React.useEffect(() => {
    // Create sample experiments if none exist
    if (experiments.length === 0) {
      // Experiment 1: Button color test
      const exp1 = createExperiment(
        'Button Color Test',
        [
          {
            id: 'control',
            name: 'Blue Button',
            isControl: true,
            config: { color: 'blue' },
          },
          {
            id: 'variant-green',
            name: 'Green Button',
            isControl: false,
            config: { color: 'green' },
          },
          {
            id: 'variant-red',
            name: 'Red Button',
            isControl: false,
            config: { color: 'red' },
          },
        ],
        'Testing button color impact on click-through rate'
      )
      startExperiment(exp1.experimentId)

      // Experiment 2: Message layout test
      const exp2 = createExperiment(
        'Message Layout Test',
        [
          {
            id: 'control',
            name: 'Compact Layout',
            isControl: true,
            config: { layout: 'compact' },
          },
          {
            id: 'variant-spacious',
            name: 'Spacious Layout',
            isControl: false,
            config: { layout: 'spacious' },
          },
        ],
        'Testing message layout impact on engagement'
      )
      startExperiment(exp2.experimentId)

      // Simulate some metrics
      simulateMetrics(exp1.experimentId, exp1.variants)
      simulateMetrics(exp2.experimentId, exp2.variants)
    }
  }, [])

  const simulateMetrics = (expId: string, variants: ExperimentVariant[]) => {
    variants.forEach(variant => {
      const impressions = Math.floor(Math.random() * 500) + 100
      const conversionRate = variant.isControl
        ? 0.10
        : 0.10 + (Math.random() * 0.08) // Variants have 0-8% lift

      recordMetric(expId, variant.id, {
        variantId: variant.id,
        impressions,
        conversions: Math.floor(impressions * conversionRate),
        conversionRate,
        avgEngagementTime: Math.random() * 60000 + 20000,
        bounceRate: Math.random() * 0.3,
        users: Math.floor(impressions * 0.8),
      })
    })
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">A/B Testing Dashboard</h2>

      <ABTestingDashboard
        experiments={experiments}
        config={{
          minSampleSize: 100,
          confidenceLevel: 0.95,
          minEffect: 5,
        }}
        showStatistics
        onSelectExperiment={(exp) => {
          console.log('Selected experiment:', exp.experimentName)
        }}
        onDeclareWinner={(expId, winnerId) => {
          console.log(`Winner declared for ${expId}: ${winnerId}`)
          alert(`Winner declared! Variant ${winnerId} wins.`)
        }}
      />
    </div>
  )
}

// =============================================================================
// Example 4: Integrated Chat with A/B Testing
// =============================================================================

/**
 * Chat application with A/B testing for UI variants
 */
export function ChatWithABTestExample() {
  const { getVariant, recordMetric, experiments, createExperiment, startExperiment } = useABTesting()
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [userId] = React.useState(`user-${Date.now()}`)
  const [variant, setVariant] = React.useState<ExperimentVariant | null>(null)

  React.useEffect(() => {
    // Create experiment if doesn't exist
    if (experiments.length === 0) {
      const exp = createExperiment(
        'Chat Theme Test',
        [
          { id: 'control', name: 'Default Theme', isControl: true, config: { theme: 'default' } },
          { id: 'variant-dark', name: 'Dark Theme', isControl: false, config: { theme: 'dark' } },
          { id: 'variant-minimal', name: 'Minimal Theme', isControl: false, config: { theme: 'minimal' } },
        ],
        'Testing chat theme impact on engagement'
      )
      startExperiment(exp.experimentId)

      // Get variant for this user
      const v = getVariant(exp.experimentId, userId)
      setVariant(v)

      // Record impression
      if (v) {
        recordMetric(exp.experimentId, v.id, {
          variantId: v.id,
          impressions: 1,
          conversions: 0,
          conversionRate: 0,
          avgEngagementTime: 0,
          bounceRate: 0,
          users: 1,
        })
      }
    }
  }, [])

  const handleSendMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    // Record conversion (message sent)
    if (variant && experiments.length > 0) {
      recordMetric(experiments[0].experimentId, variant.id, {
        conversions: 1,
      })
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-screen">
      {/* Chat window */}
      <div className="col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              Chat (Theme: {variant?.name || 'Loading...'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {messages.map(msg => (
                <div key={msg.id} className="p-2 border rounded">
                  {msg.content}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border rounded"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleSendMessage(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button onClick={() => handleSendMessage('Test message')}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A/B test results */}
      <div>
        {experiments.length > 0 && (
          <ABTestingDashboard
            experiments={experiments}
            showStatistics
          />
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Example 5: Production Analytics with Backend Integration
// =============================================================================

/**
 * Production-ready analytics with backend API calls
 */
export function ProductionAnalyticsExample() {
  const [experiments, setExperiments] = React.useState<ExperimentResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Load experiments from backend
  React.useEffect(() => {
    const loadExperiments = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/experiments')
        const data = await response.json()
        setExperiments(data.experiments)
      } catch (error) {
        console.error('Failed to load experiments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadExperiments()
  }, [])

  const handleDeclareWinner = async (experimentId: string, winnerId: string) => {
    try {
      await fetch(`/api/experiments/${experimentId}/winner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId }),
      })

      alert('Winner declared successfully!')

      // Reload experiments
      const response = await fetch('/api/experiments')
      const data = await response.json()
      setExperiments(data.experiments)
    } catch (error) {
      console.error('Failed to declare winner:', error)
      alert('Failed to declare winner')
    }
  }

  if (isLoading) {
    return <div className="p-4">Loading experiments...</div>
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Production Analytics</h2>

      <UserInteractionAnalytics
        config={{
          trackClicks: true,
          trackFeatureDiscovery: true,
          samplingRate: 0.1, // 10% sampling in production
        }}
        realtime
        onEventTracked={async (event) => {
          // Send events to analytics service
          try {
            await fetch('/api/analytics/events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(event),
            })
          } catch (error) {
            console.error('Failed to send event:', error)
          }
        }}
        onAnalyticsGenerated={async (metrics) => {
          // Send aggregated metrics
          try {
            await fetch('/api/analytics/metrics', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(metrics),
            })
          } catch (error) {
            console.error('Failed to send metrics:', error)
          }
        }}
      />

      <ABTestingDashboard
        experiments={experiments}
        showStatistics
        onDeclareWinner={handleDeclareWinner}
      />
    </div>
  )
}

// =============================================================================
// Example 6: Complete Analytics Suite
// =============================================================================

/**
 * All analytics features together
 */
export function CompleteAnalyticsSuiteExample() {
  const { trackFeatureDiscovery } = useInteractionTracking()
  const { experiments } = useABTesting()

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* User interaction analytics */}
      <div>
        <UserInteractionAnalytics
          config={{
            trackClicks: true,
            trackHover: false, // Disable hover for performance
            trackScroll: true,
            trackFeatureDiscovery: true,
            samplingRate: 1.0,
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
          }}
          realtime
          updateInterval={5000}
          detailed
          onEventTracked={(event) => {
            console.log('[Analytics] Event:', event.type, event.target)
          }}
          onAnalyticsGenerated={(metrics) => {
            console.log('[Analytics] Engagement score:', metrics.engagementScore)
            console.log('[Analytics] Top features:', metrics.topFeatures)
          }}
        />
      </div>

      {/* A/B testing dashboard */}
      <div>
        <ABTestingDashboard
          experiments={experiments}
          config={{
            minSampleSize: 100,
            confidenceLevel: 0.95,
            minEffect: 5,
            allocation: 'equal',
          }}
          showStatistics
          onSelectExperiment={(exp) => {
            console.log('[A/B Test] Selected:', exp.experimentName)
          }}
          onDeclareWinner={(expId, winnerId) => {
            console.log('[A/B Test] Winner:', winnerId)
            // Track winner declaration as feature discovery
            trackFeatureDiscovery('ab-test-winner-declared')
          }}
        />
      </div>
    </div>
  )
}

// =============================================================================
// Usage Instructions
// =============================================================================

/**
 * To use these examples:
 *
 * 1. Basic Interaction Tracking:
 *    - Drop-in analytics dashboard
 *    - Tracks clicks, scrolls, and more
 *
 * 2. Feature Discovery:
 *    - Track which features users find
 *    - See feature adoption rates
 *
 * 3. A/B Testing:
 *    - Create experiments with variants
 *    - Statistical significance testing
 *    - Winner recommendations
 *
 * 4. Chat with A/B Testing:
 *    - Test UI variants in real chat
 *    - Track conversions automatically
 *
 * 5. Production Integration:
 *    - Backend API integration
 *    - Sampling for scale
 *    - Error handling
 *
 * 6. Complete Suite:
 *    - All features together
 *    - Production-ready setup
 *
 * Choose the pattern that fits your needs!
 */
