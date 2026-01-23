import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Analytics & Usage Tracking Utilities',
  description: 'Comprehensive analytics utilities for tracking user behavior, performance metrics, and application usage patterns.',
}

const analyticsFunctionsProps: Prop[] = [
  {
    name: 'analyticsManager',
    type: 'AnalyticsManager',
    description: 'Global analytics manager for coordinating multiple providers.',
  },
  {
    name: 'AnalyticsProvider',
    type: 'React.ComponentType<AnalyticsProviderProps>',
    description: 'React context provider for analytics configuration.',
  },
  {
    name: 'useAnalytics',
    type: '() => AnalyticsHook',
    description: 'Hook for accessing analytics context and methods.',
  },
  {
    name: 'useAnalyticsContext',
    type: '() => AnalyticsContext',
    description: 'Hook for accessing raw analytics context.',
  },
  {
    name: 'useRenderPerformance',
    type: '(options?: PerformanceOptions) => PerformanceMetrics',
    description: 'Hook for tracking component render performance.',
  },
  {
    name: 'useInteractionTracking',
    type: '(options?: InteractionOptions) => InteractionTracker',
    description: 'Hook for tracking user interactions.',
  },
  {
    name: 'useInteractionLatency',
    type: '(options?: LatencyOptions) => LatencyMetrics',
    description: 'Hook for measuring interaction latency.',
  },
  {
    name: 'createEventHandler',
    type: '(eventType: string, properties?: object) => EventHandler',
    description: 'Create typed event handlers with automatic analytics.',
  },
  {
    name: 'measurePerformance',
    type: '(name: string, fn: () => void) => PerformanceResult',
    description: 'Measure execution time of synchronous operations.',
  },
  {
    name: 'batchAnalyticsEvents',
    type: '(events: AnalyticsEvent[]) => Promise<void>',
    description: 'Batch multiple analytics events for efficient sending.',
  },
]

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
          <span>📊 Analytics & Tracking</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Analytics & Usage Tracking</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Comprehensive analytics utilities for tracking user behavior, performance metrics,
          interaction patterns, and application usage insights for AI chat applications.
        </p>
        <p className="text-muted-foreground">
          <strong>Category:</strong> Monitoring & Insights •{' '}
          <strong>Impact:</strong> User Experience & Product Analytics
        </p>
      </div>

      <Callout type="info" title="Analytics for AI Chat Applications">
        <p className="mb-2">
          AI chat interfaces generate unique usage patterns: conversation flows, response quality,
          user engagement metrics, and performance characteristics. These analytics utilities
          provide deep insights into how users interact with AI-powered chat experiences.
        </p>
      </Callout>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Analytics Setup</h2>
        <CodePlayground
          code={`import {
  AnalyticsProvider,
  useAnalytics,
  analyticsManager
} from '@clarity-chat/react'

// Configure analytics globally
analyticsManager.configure({
  providers: [
    {
      name: 'google-analytics',
      trackingId: 'GA_MEASUREMENT_ID'
    },
    {
      name: 'mixpanel',
      token: 'MIXPANEL_TOKEN'
    },
    {
      name: 'custom',
      handler: (event) => {
        // Send to custom analytics endpoint
        fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event)
        })
      }
    }
  ],
  user: {
    id: currentUser?.id,
    properties: {
      plan: currentUser?.plan,
      organization: currentUser?.organization
    }
  },
  globalProperties: {
    appVersion: '1.0.0',
    environment: process.env.NODE_ENV
  }
})

function AnalyticsEnabledApp() {
  return (
    <AnalyticsProvider config={analyticsManager.getConfig()}>
      <ChatApp />
    </AnalyticsProvider>
  )
}

function ChatApp() {
  const { track, identify } = useAnalytics()

  useEffect(() => {
    // Identify user when they log in
    identify(currentUser.id, {
      name: currentUser.name,
      email: currentUser.email,
      plan: currentUser.plan
    })

    // Track app open
    track('app_opened', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer
    })
  }, [currentUser])

  return (
    <ClarityChat
      api="/api/chat"
      onMessageSend={(message) => {
        track('message_sent', {
          length: message.content.length,
          type: message.role,
          conversationId: message.conversationId
        })
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Global analytics setup with multiple providers, user identification,
          and automatic event tracking for chat interactions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Performance Analytics</h2>
        <CodePlayground
          code={`import {
  useRenderPerformance,
  useInteractionLatency,
  measurePerformance
} from '@clarity-chat/react'

function PerformanceTrackedChat() {
  const renderMetrics = useRenderPerformance({
    trackMemory: true,
    sampleRate: 0.1, // Track 10% of renders
    onMetrics: (metrics) => {
      analytics.track('component_render', {
        component: 'ClarityChat',
        renderTime: metrics.renderTime,
        memoryDelta: metrics.memoryDelta,
        timestamp: Date.now()
      })
    }
  })

  const interactionLatency = useInteractionLatency({
    threshold: 100, // Alert on interactions > 100ms
    onSlowInteraction: (interaction, latency) => {
      analytics.track('slow_interaction', {
        type: interaction.type,
        target: interaction.target,
        latency,
        timestamp: Date.now()
      })
    }
  })

  const handleMessageSend = measurePerformance('message_send', async () => {
    const startTime = Date.now()

    try {
      await api.sendMessage(message)
      const duration = Date.now() - startTime

      analytics.track('message_send_success', {
        duration,
        messageLength: message.content.length
      })
    } catch (error) {
      const duration = Date.now() - startTime

      analytics.track('message_send_error', {
        duration,
        error: error.message,
        messageLength: message.content.length
      })

      throw error
    }
  })

  return (
    <div>
      <ClarityChat
        api="/api/chat"
        onMessageSend={handleMessageSend}
      />

      {/* Performance dashboard (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black text-white p-3 rounded text-xs">
          <div>Render: {renderMetrics.averageRenderTime}ms avg</div>
          <div>Memory: {renderMetrics.memoryDelta}MB</div>
          <div>Interactions: {interactionLatency.totalInteractions}</div>
          <div>Avg Latency: {interactionLatency.averageLatency}ms</div>
        </div>
      )}
    </div>
  )
}

// Advanced performance tracking
function AdvancedPerformanceChat() {
  const [performanceData, setPerformanceData] = useState({
    messageSendTimes: [],
    renderTimes: [],
    interactionLatencies: []
  })

  const trackMessagePerformance = async (message) => {
    const result = await measurePerformance('full_message_flow', async () => {
      // Measure typing latency (from first keystroke to send)
      const typingStart = performance.mark('typing_start')
      // ... user types ...
      const sendStart = performance.mark('send_start')

      // API call
      await api.sendMessage(message)

      // Response rendering
      const renderStart = performance.mark('render_start')
      // ... component re-renders ...
      const renderEnd = performance.mark('render_end')

      return {
        typingLatency: sendStart - typingStart,
        apiLatency: renderStart - sendStart,
        renderLatency: renderEnd - renderStart
      }
    })

    setPerformanceData(prev => ({
      ...prev,
      messageSendTimes: [...prev.messageSendTimes.slice(-99), result.duration]
    }))

    analytics.track('message_flow_performance', {
      totalDuration: result.duration,
      typingLatency: result.result.typingLatency,
      apiLatency: result.result.apiLatency,
      renderLatency: result.result.renderLatency,
      timestamp: Date.now()
    })
  }

  return (
    <ClarityChat
      api="/api/chat"
      onMessageSend={trackMessagePerformance}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive performance analytics including render times, memory usage,
          interaction latency, and end-to-end message flow performance tracking.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">User Interaction Tracking</h2>
        <CodePlayground
          code={`import {
  useInteractionTracking,
  createEventHandler
} from '@clarity-chat/react'

function InteractionTrackedChat() {
  const interactionTracker = useInteractionTracking({
    trackClicks: true,
    trackScrolls: true,
    trackFocus: true,
    debounceMs: 500, // Batch rapid interactions
    onInteraction: (interaction) => {
      analytics.track('user_interaction', {
        type: interaction.type,
        target: interaction.target,
        context: interaction.context,
        timestamp: interaction.timestamp,
        sessionDuration: interaction.sessionDuration
      })
    }
  })

  // Create typed event handlers
  const handleMessageCopy = createEventHandler('message_copy', {
    context: 'chat_interface'
  })

  const handleFeedbackSubmit = createEventHandler('feedback_submit', (rating) => ({
    rating,
    context: 'message_feedback'
  }))

  const handleSettingsOpen = createEventHandler('settings_opened', {
    source: 'header_button'
  })

  return (
    <ClarityChat
      api="/api/chat"
      onMessageCopy={(id, content) => {
        handleMessageCopy({ messageId: id, contentLength: content.length })
      }}
      onMessageFeedback={(messageId, type, comment) => {
        handleFeedbackSubmit({
          messageId,
          feedbackType: type,
          hasComment: !!comment,
          commentLength: comment?.length || 0
        })
      }}
      onSettingsOpen={handleSettingsOpen}
    />
  )
}

// Advanced interaction patterns
function PatternAnalysisChat() {
  const [interactionPatterns, setInteractionPatterns] = useState({
    rapidClicks: 0,
    longPauses: 0,
    errorRecovery: 0,
    featureDiscovery: 0
  })

  const analyzePatterns = (interactions) => {
    const patterns = {
      rapidClicks: interactions.filter(i =>
        i.type === 'click' && i.timeSinceLastInteraction < 100
      ).length,

      longPauses: interactions.filter(i =>
        i.timeSinceLastInteraction > 30000 // 30 seconds
      ).length,

      errorRecovery: interactions.filter(i =>
        i.context?.includes('error') && i.context?.includes('recovery')
      ).length,

      featureDiscovery: interactions.filter(i =>
        i.type === 'click' && i.context?.includes('new_feature')
      ).length
    }

    setInteractionPatterns(patterns)

    // Track pattern insights
    if (patterns.rapidClicks > 5) {
      analytics.track('interaction_pattern', {
        pattern: 'rapid_clicking',
        count: patterns.rapidClicks,
        severity: 'medium'
      })
    }

    if (patterns.longPauses > 3) {
      analytics.track('engagement_drop', {
        longPauses: patterns.longPauses,
        timestamp: Date.now()
      })
    }
  }

  return (
    <div>
      <ClarityChat api="/api/chat" />

      {/* Pattern insights (for product team) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 bg-blue-100 p-3 rounded text-sm">
          <h4>Interaction Patterns</h4>
          <div>Rapid Clicks: {interactionPatterns.rapidClicks}</div>
          <div>Long Pauses: {interactionPatterns.longPauses}</div>
          <div>Error Recovery: {interactionPatterns.errorRecovery}</div>
          <div>Feature Discovery: {interactionPatterns.featureDiscovery}</div>
        </div>
      )}
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Detailed user interaction tracking with pattern analysis, event batching,
          and insights into user behavior and engagement patterns.
        </p>

        <Callout type="tip" title="Privacy-First Analytics">
          <p>Always respect user privacy:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Obtain explicit consent for tracking</li>
            <li>Anonymize personally identifiable information</li>
            <li>Provide opt-out mechanisms</li>
            <li>Comply with GDPR and privacy regulations</li>
            <li>Minimize data collection to what's necessary</li>
          </ul>
        </Callout>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Conversation Analytics</h2>
        <CodePlayground
          code={`import { useAnalytics, batchAnalyticsEvents } from '@clarity-chat/react'

function ConversationAnalyticsChat() {
  const { track } = useAnalytics()
  const [conversationMetrics, setConversationMetrics] = useState({
    messageCount: 0,
    averageResponseTime: 0,
    userSatisfaction: 0,
    featureUsage: {}
  })

  const trackConversationFlow = async (messages) => {
    const events = []

    // Track conversation start
    if (messages.length === 1) {
      events.push({
        event: 'conversation_started',
        properties: {
          userId: currentUser.id,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          initialMessageLength: messages[0].content.length
        }
      })
    }

    // Track message exchanges
    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'assistant') {
      const userMessage = messages[messages.length - 2]
      const responseTime = lastMessage.timestamp - userMessage.timestamp

      events.push({
        event: 'message_exchange',
        properties: {
          conversationId: conversationId,
          messageIndex: messages.length / 2, // Pair index
          userMessageLength: userMessage.content.length,
          assistantMessageLength: lastMessage.content.length,
          responseTime,
          timestamp: Date.now()
        }
      })

      // Update rolling average
      setConversationMetrics(prev => ({
        ...prev,
        messageCount: prev.messageCount + 1,
        averageResponseTime: (
          (prev.averageResponseTime * (prev.messageCount - 1)) + responseTime
        ) / prev.messageCount
      }))
    }

    // Track conversation end
    if (lastMessage.content.toLowerCase().includes('goodbye')) {
      events.push({
        event: 'conversation_ended',
        properties: {
          conversationId,
          totalMessages: messages.length,
          duration: Date.now() - messages[0].timestamp,
          userSatisfaction: conversationMetrics.userSatisfaction,
          finalMessage: lastMessage.content.substring(0, 100)
        }
      })
    }

    // Batch send events
    if (events.length > 0) {
      await batchAnalyticsEvents(events)
    }
  }

  const trackFeatureUsage = (feature, context = {}) => {
    setConversationMetrics(prev => ({
      ...prev,
      featureUsage: {
        ...prev.featureUsage,
        [feature]: (prev.featureUsage[feature] || 0) + 1
      }
    }))

    track('feature_used', {
      feature,
      context,
      conversationId,
      timestamp: Date.now()
    })
  }

  return (
    <ClarityChat
      api="/api/chat"
      conversationId={conversationId}
      onMessagesChange={trackConversationFlow}
      onMessageCopy={() => trackFeatureUsage('message_copy')}
      onMessageFeedback={(id, type) => trackFeatureUsage('feedback', { type })}
      onExport={() => trackFeatureUsage('conversation_export')}
      onClear={() => trackFeatureUsage('conversation_clear')}
    />
  )
}

// Analytics dashboard component
function ConversationAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState({
    activeConversations: 0,
    averageSessionLength: 0,
    popularFeatures: {},
    userSatisfaction: 0
  })

  useEffect(() => {
    // Subscribe to real-time analytics updates
    const unsubscribe = analyticsManager.subscribe((event) => {
      if (event.type === 'conversation_started') {
        setAnalyticsData(prev => ({
          ...prev,
          activeConversations: prev.activeConversations + 1
        }))
      } else if (event.type === 'conversation_ended') {
        setAnalyticsData(prev => ({
          ...prev,
          activeConversations: Math.max(0, prev.activeConversations - 1),
          averageSessionLength: (
            (prev.averageSessionLength + event.properties.duration) / 2
          )
        }))
      } else if (event.type === 'feature_used') {
        setAnalyticsData(prev => ({
          ...prev,
          popularFeatures: {
            ...prev.popularFeatures,
            [event.properties.feature]: (
              prev.popularFeatures[event.properties.feature] || 0
            ) + 1
          }
        }))
      }
    })

    return unsubscribe
  }, [])

  return (
    <div className="analytics-dashboard p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Live Conversation Analytics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {analyticsData.activeConversations}
          </div>
          <div className="text-sm text-gray-600">Active Conversations</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.round(analyticsData.averageSessionLength / 1000 / 60)}m
          </div>
          <div className="text-sm text-gray-600">Avg Session Length</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {analyticsData.userSatisfaction}%
          </div>
          <div className="text-sm text-gray-600">User Satisfaction</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {Object.keys(analyticsData.popularFeatures).length}
          </div>
          <div className="text-sm text-gray-600">Features Used</div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-medium mb-2">Popular Features</h4>
        <div className="space-y-2">
          {Object.entries(analyticsData.popularFeatures)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([feature, count]) => (
              <div key={feature} className="flex justify-between text-sm">
                <span className="capitalize">{feature.replace('_', ' ')}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive conversation analytics with real-time metrics, user behavior insights,
          and feature usage tracking for product optimization.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Multi-Provider Analytics</h2>
        <CodePlayground
          code={`import { analyticsManager } from '@clarity-chat/react'

// Configure multiple analytics providers
analyticsManager.configure({
  providers: [
    // Google Analytics 4
    {
      name: 'google-analytics-4',
      measurementId: 'G-XXXXXXXXXX',
      config: {
        send_page_view: false, // We'll handle page views manually
        allow_google_signals: true,
        allow_ad_personalization_signals: true
      }
    },

    // Mixpanel
    {
      name: 'mixpanel',
      token: 'your_mixpanel_token',
      config: {
        debug: process.env.NODE_ENV === 'development',
        persistence: 'localStorage',
        ip: false // Don't send IP addresses
      }
    },

    // Amplitude
    {
      name: 'amplitude',
      apiKey: 'your_amplitude_api_key',
      config: {
        saveEvents: true,
        includeUtm: true,
        includeReferrer: true,
        trackingOptions: {
          ipAddress: false // Privacy-focused
        }
      }
    },

    // Custom analytics endpoint
    {
      name: 'custom-api',
      handler: async (event) => {
        try {
          const response = await fetch('/api/analytics/events', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${process.env.ANALYTICS_API_KEY}\`
            },
            body: JSON.stringify({
              ...event,
              source: 'clarity-chat',
              version: '1.0.0'
            })
          })

          if (!response.ok) {
            console.warn('Analytics API error:', response.status)
          }
        } catch (error) {
          console.warn('Failed to send analytics:', error)
          // Don't throw - analytics failures shouldn't break the app
        }
      }
    }
  ],

  // Global user identification
  user: currentUser ? {
    id: currentUser.id,
    properties: {
      name: currentUser.name,
      email: currentUser.email,
      plan: currentUser.plan,
      organization: currentUser.organization,
      signupDate: currentUser.createdAt
    }
  } : undefined,

  // Global event properties
  globalProperties: {
    app: 'clarity-chat',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    build: process.env.BUILD_ID,
    timestamp: Date.now()
  },

  // Privacy and compliance settings
  privacy: {
    anonymizeIp: true,
    disableCookies: false,
    respectDoNotTrack: true,
    gdprCompliant: true
  }
})

// Chat-specific event tracking
function AnalyticsEnhancedChat() {
  const { track, identify, setUserProperties } = useAnalytics()

  // Track chat-specific events
  const handleMessageSent = (message) => {
    track('message_sent', {
      messageId: message.id,
      conversationId: message.conversationId,
      contentLength: message.content.length,
      hasAttachments: message.attachments?.length > 0,
      timestamp: message.timestamp
    })
  }

  const handleMessageReceived = (message) => {
    track('message_received', {
      messageId: message.id,
      conversationId: message.conversationId,
      contentLength: message.content.length,
      responseTime: message.timestamp - message.userMessageTimestamp,
      model: message.model,
      tokens: message.usage?.totalTokens
    })
  }

  const handleError = (error, context) => {
    track('error_occurred', {
      error: error.message,
      errorType: error.name,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now()
    })
  }

  const handleFeatureUsed = (feature, params = {}) => {
    track('feature_used', {
      feature,
      ...params,
      conversationId: currentConversation?.id,
      timestamp: Date.now()
    })
  }

  return (
    <ClarityChat
      api="/api/chat"
      conversationId={conversationId}
      onMessageSend={handleMessageSent}
      onMessageReceive={handleMessageReceived}
      onError={handleError}
      onExport={() => handleFeatureUsed('conversation_export')}
      onClear={() => handleFeatureUsed('conversation_clear')}
      onMessageCopy={() => handleFeatureUsed('message_copy')}
      onMessageFeedback={(id, type) => handleFeatureUsed('feedback', { type })}
    />
  )
}

// Advanced user journey tracking
function UserJourneyTracker() {
  const { track } = useAnalytics()
  const [journey, setJourney] = useState({
    startedAt: Date.now(),
    steps: [],
    featuresUsed: new Set(),
    errorsEncountered: 0
  })

  const trackStep = (step, data = {}) => {
    const stepEvent = {
      step,
      timestamp: Date.now(),
      data
    }

    setJourney(prev => ({
      ...prev,
      steps: [...prev.steps, stepEvent]
    }))

    track('journey_step', {
      step,
      stepIndex: journey.steps.length,
      timeSinceStart: Date.now() - journey.startedAt,
      ...data
    })
  }

  const completeJourney = () => {
    track('journey_completed', {
      duration: Date.now() - journey.startedAt,
      stepsCount: journey.steps.length,
      featuresUsed: Array.from(journey.featuresUsed),
      errorsEncountered: journey.errorsEncountered,
      completionRate: 100
    })
  }

  return {
    trackStep,
    completeJourney,
    journey
  }
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Multi-provider analytics setup with privacy compliance, custom event tracking,
          and comprehensive user journey analytics for data-driven product decisions.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>
        <PropsTable props={analyticsFunctionsProps} />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Analytics Best Practices</h2>
        <div className="space-y-4">
          <Callout type="info" title="Event Naming Conventions">
            <p>Use consistent, descriptive event names:</p>
            <ul className="list-disc list-inside mt-2">
              <li><code>message_sent</code> - User sends a message</li>
              <li><code>message_received</code> - AI response received</li>
              <li><code>feature_used</code> - User interacts with a feature</li>
              <li><code>error_occurred</code> - Application error</li>
              <li><code>conversation_started</code> - New conversation begins</li>
            </ul>
          </Callout>

          <Callout type="tip" title="Privacy & Compliance">
            <ul className="list-disc list-inside">
              <li>Always obtain user consent for tracking</li>
              <li>Anonymize personally identifiable information</li>
              <li>Implement data retention policies</li>
              <li>Comply with GDPR, CCPA, and privacy regulations</li>
              <li>Provide clear opt-out mechanisms</li>
            </ul>
          </Callout>

          <Callout type="warning" title="Performance Impact">
            <p>Analytics can impact performance:</p>
            <ul className="list-disc list-inside mt-2">
              <li>Use batching for high-frequency events</li>
              <li>Implement sampling for performance-critical paths</li>
              <li>Send analytics asynchronously</li>
              <li>Monitor the performance impact of tracking</li>
              <li>Disable detailed tracking in production if needed</li>
            </ul>
          </Callout>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/utilities/performance-monitoring"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Performance Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Monitor performance metrics alongside user analytics.
            </p>
          </Link>
          <Link
            href="/reference/utilities/security"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Security Utilities</h3>
            <p className="text-sm text-muted-foreground">
              Track security events and user safety metrics.
            </p>
          </Link>
          <Link
            href="/guides/analytics"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Analytics Guide</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive guide to implementing analytics in chat applications.
            </p>
          </Link>
          <Link
            href="/enterprise/analytics-dashboard"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Enterprise Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Advanced analytics dashboards and reporting for enterprises.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}