/**
 * Advanced Analytics Examples (Phase 2)
 *
 * Demonstrates user interaction analytics and A/B testing features
 */
'use client'
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
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
import {
  ErrorBoundary,
  LoadingSpinner,
  ErrorState,
} from '../utils/ErrorBoundary'
// =============================================================================
// Example 1: Basic User Interaction Tracking
// =============================================================================
/**
 * Simple interaction tracking setup
 */
export function BasicInteractionExample() {
  return _jsxs('div', {
    className: 'space-y-4 p-4',
    children: [
      _jsx('h2', {
        className: 'text-2xl font-bold',
        children: 'User Interaction Analytics',
      }),
      _jsx(UserInteractionAnalytics, {
        config: {
          trackClicks: true,
          trackFeatureDiscovery: true,
          samplingRate: 1.0,
        },
        realtime: true,
        updateInterval: 5000,
        detailed: true,
        onEventTracked: (event) => {
          console.log('Event tracked:', event)
        },
        onAnalyticsGenerated: (metrics) => {
          console.log('Engagement score:', metrics.engagementScore)
          console.log('Bounce rate:', metrics.bounceRate)
        },
      }),
    ],
  })
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
  const handleFeatureClick = (featureId, featureName) => {
    trackFeatureDiscovery(featureName, featureId)
    console.log(`Feature discovered: ${featureName}`)
  }
  // Count discoveries per feature
  const discoveries = React.useMemo(() => {
    const counts = new Map()
    events
      .filter((e) => e.type === 'feature_discovery')
      .forEach((e) => {
        const name = e.metadata?.featureName || 'unknown'
        counts.set(name, (counts.get(name) || 0) + 1)
      })
    return counts
  }, [events])
  return _jsxs('div', {
    className: 'space-y-4 p-4 max-w-2xl',
    children: [
      _jsx('h2', {
        className: 'text-2xl font-bold',
        children: 'Feature Discovery Tracking',
      }),
      _jsxs(Card, {
        children: [
          _jsx(CardHeader, {
            children: _jsx(CardTitle, {
              children: 'Click features to track discovery',
            }),
          }),
          _jsx(CardContent, {
            children: _jsx('div', {
              className: 'grid grid-cols-2 gap-3',
              children: features.map((feature) =>
                _jsxs(
                  Button,
                  {
                    variant: 'outline',
                    className: 'flex items-center gap-2',
                    onClick: () => handleFeatureClick(feature.id, feature.name),
                    children: [
                      _jsx('span', { children: feature.icon }),
                      _jsx('span', { children: feature.name }),
                      discoveries.has(feature.name) &&
                        _jsxs('span', {
                          className: 'ml-auto text-xs text-muted-foreground',
                          children: [discoveries.get(feature.name), 'x'],
                        }),
                    ],
                  },
                  feature.id
                )
              ),
            }),
          }),
        ],
      }),
      events.length > 0 &&
        _jsxs(Card, {
          children: [
            _jsx(CardHeader, {
              children: _jsx(CardTitle, { children: 'Discovery Stats' }),
            }),
            _jsx(CardContent, {
              children: _jsx('div', {
                className: 'space-y-2',
                children: Array.from(discoveries.entries()).map(
                  ([name, count]) =>
                    _jsxs(
                      'div',
                      {
                        className: 'flex justify-between text-sm',
                        children: [
                          _jsx('span', { children: name }),
                          _jsxs('span', {
                            className: 'font-medium',
                            children: [count, ' discoveries'],
                          }),
                        ],
                      },
                      name
                    )
                ),
              }),
            }),
          ],
        }),
    ],
  })
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
  const [userId] = React.useState(
    `user-${Math.random().toString(36).substr(2, 9)}`
  )
  // Track if demo data has been initialized (intentionally runs once)
  const hasInitialized = React.useRef(false)
  // 🎯 Intentionally runs once on mount to seed demo data

  React.useEffect(() => {
    // Only initialize once
    if (hasInitialized.current || experiments.length > 0) return
    hasInitialized.current = true
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
  }, [])
  const simulateMetrics = (expId, variants) => {
    variants.forEach((variant) => {
      const impressions = Math.floor(Math.random() * 500) + 100
      const conversionRate = variant.isControl
        ? 0.1
        : 0.1 + Math.random() * 0.08 // Variants have 0-8% lift
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
  return _jsxs('div', {
    className: 'p-4',
    children: [
      _jsx('h2', {
        className: 'text-2xl font-bold mb-4',
        children: 'A/B Testing Dashboard',
      }),
      _jsx(ABTestingDashboard, {
        experiments: experiments,
        config: {
          minSampleSize: 100,
          confidenceLevel: 0.95,
          minEffect: 5,
        },
        showStatistics: true,
        onSelectExperiment: (exp) => {
          console.log('Selected experiment:', exp.experimentName)
        },
        onDeclareWinner: (expId, winnerId) => {
          console.log(`Winner declared for ${expId}: ${winnerId}`)
          alert(`Winner declared! Variant ${winnerId} wins.`)
        },
      }),
    ],
  })
}
// =============================================================================
// Example 4: Integrated Chat with A/B Testing
// =============================================================================
/**
 * Chat application with A/B testing for UI variants
 */
export function ChatWithABTestExample() {
  const {
    getVariant,
    recordMetric,
    experiments,
    createExperiment,
    startExperiment,
  } = useABTesting()
  const [messages, setMessages] = React.useState([])
  const [userId] = React.useState(`user-${Date.now()}`)
  const [variant, setVariant] = React.useState(null)
  // Track if demo data has been initialized (intentionally runs once)
  const hasInitialized = React.useRef(false)
  // 🎯 Intentionally runs once on mount to seed demo data

  React.useEffect(() => {
    // Only initialize once
    if (hasInitialized.current || experiments.length > 0) return
    hasInitialized.current = true
    const exp = createExperiment(
      'Chat Theme Test',
      [
        {
          id: 'control',
          name: 'Default Theme',
          isControl: true,
          config: { theme: 'default' },
        },
        {
          id: 'variant-dark',
          name: 'Dark Theme',
          isControl: false,
          config: { theme: 'dark' },
        },
        {
          id: 'variant-minimal',
          name: 'Minimal Theme',
          isControl: false,
          config: { theme: 'minimal' },
        },
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
  }, [])
  const handleSendMessage = (content) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: Date.now(),
      },
    ])
    // Record conversion (message sent)
    if (variant && experiments.length > 0) {
      recordMetric(experiments[0].experimentId, variant.id, {
        conversions: 1,
      })
    }
  }
  return _jsxs('div', {
    className: 'grid grid-cols-3 gap-4 p-4 h-screen',
    children: [
      _jsx('div', {
        className: 'col-span-2',
        children: _jsxs(Card, {
          className: 'h-full',
          children: [
            _jsx(CardHeader, {
              children: _jsxs(CardTitle, {
                children: ['Chat (Theme: ', variant?.name || 'Loading...', ')'],
              }),
            }),
            _jsxs(CardContent, {
              children: [
                _jsx('div', {
                  className: 'space-y-2 mb-4',
                  children: messages.map((msg) =>
                    _jsx(
                      'div',
                      {
                        className: 'p-2 border rounded',
                        children: msg.content,
                      },
                      msg.id
                    )
                  ),
                }),
                _jsxs('div', {
                  className: 'flex gap-2',
                  children: [
                    _jsx('input', {
                      type: 'text',
                      placeholder: 'Type a message...',
                      className: 'flex-1 px-3 py-2 border rounded',
                      onKeyDown: (e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                          handleSendMessage(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      },
                    }),
                    _jsx(Button, {
                      onClick: () => handleSendMessage('Test message'),
                      children: 'Send',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      }),
      _jsx('div', {
        children:
          experiments.length > 0 &&
          _jsx(ABTestingDashboard, {
            experiments: experiments,
            showStatistics: true,
          }),
      }),
    ],
  })
}
// =============================================================================
// Example 5: Production Analytics with Backend Integration
// =============================================================================
/**
 * Production-ready analytics with backend API calls
 */
export function ProductionAnalyticsExample() {
  const [experiments, setExperiments] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState(null)
  // Load experiments from backend
  React.useEffect(() => {
    const loadExperiments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/experiments')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        setExperiments(data.experiments)
      } catch (err) {
        console.error('Failed to load experiments:', err)
        setError(
          err instanceof Error ? err : new Error('Failed to load experiments')
        )
      } finally {
        setIsLoading(false)
      }
    }
    loadExperiments()
  }, [])
  const handleDeclareWinner = async (experimentId, winnerId) => {
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
    } catch (err) {
      console.error('Failed to declare winner:', err)
      alert('Failed to declare winner')
    }
  }
  if (isLoading) {
    return _jsx('div', {
      className: 'flex items-center justify-center p-8',
      children: _jsx(LoadingSpinner, {
        size: 'lg',
        label: 'Loading experiments...',
      }),
    })
  }
  if (error) {
    return _jsx(ErrorState, {
      message: error.message,
      onRetry: () => window.location.reload(),
    })
  }
  return _jsx(ErrorBoundary, {
    children: _jsxs('div', {
      className: 'space-y-4 p-4',
      children: [
        _jsx('h2', {
          className: 'text-2xl font-bold',
          children: 'Production Analytics',
        }),
        _jsx(UserInteractionAnalytics, {
          config: {
            trackClicks: true,
            trackFeatureDiscovery: true,
            samplingRate: 0.1, // 10% sampling in production
          },
          realtime: true,
          onEventTracked: async (event) => {
            // Send events to analytics service
            try {
              await fetch('/api/analytics/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
              })
            } catch (err) {
              console.error('Failed to send event:', err)
            }
          },
          onAnalyticsGenerated: async (metrics) => {
            // Send aggregated metrics
            try {
              await fetch('/api/analytics/metrics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(metrics),
              })
            } catch (err) {
              console.error('Failed to send metrics:', err)
            }
          },
        }),
        _jsx(ABTestingDashboard, {
          experiments: experiments,
          showStatistics: true,
          onDeclareWinner: handleDeclareWinner,
        }),
      ],
    }),
  })
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
  return _jsxs('div', {
    className: 'grid grid-cols-2 gap-4 p-4',
    children: [
      _jsx('div', {
        children: _jsx(UserInteractionAnalytics, {
          config: {
            trackClicks: true,
            trackHover: false, // Disable hover for performance
            trackScroll: true,
            trackFeatureDiscovery: true,
            samplingRate: 1.0,
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
          },
          realtime: true,
          updateInterval: 5000,
          detailed: true,
          onEventTracked: (event) => {
            console.log('[Analytics] Event:', event.type, event.target)
          },
          onAnalyticsGenerated: (metrics) => {
            console.log(
              '[Analytics] Engagement score:',
              metrics.engagementScore
            )
            console.log('[Analytics] Top features:', metrics.topFeatures)
          },
        }),
      }),
      _jsx('div', {
        children: _jsx(ABTestingDashboard, {
          experiments: experiments,
          config: {
            minSampleSize: 100,
            confidenceLevel: 0.95,
            minEffect: 5,
            allocation: 'equal',
          },
          showStatistics: true,
          onSelectExperiment: (exp) => {
            console.log('[A/B Test] Selected:', exp.experimentName)
          },
          onDeclareWinner: (expId, winnerId) => {
            console.log('[A/B Test] Winner:', winnerId)
            // Track winner declaration as feature discovery
            trackFeatureDiscovery('ab-test-winner-declared')
          },
        }),
      }),
    ],
  })
}
//# sourceMappingURL=analytics-example.js.map
