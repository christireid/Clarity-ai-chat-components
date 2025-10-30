# 📊 Analytics Integration Guide

> **Track user behavior, measure performance, and optimize your chat experiences**

---

## 📚 Overview

Clarity Chat includes a comprehensive analytics system with support for 7 major providers:

- 📈 **Google Analytics 4** - Industry standard web analytics
- 🎯 **Mixpanel** - Product analytics and user tracking  
- 📊 **PostHog** - Open-source product analytics
- 📉 **Amplitude** - Behavioral analytics
- 🔗 **Segment** - Customer data platform
- 📌 **Plausible** - Privacy-focused analytics
- 📐 **Heap** - Automatic event capture

---

## 🚀 Quick Start

### Basic Setup

```tsx
import {
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
} from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX')

  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [gaProvider],
        autoTrack: {
          pageViews: true,
          errors: true,
        },
      }}
    >
      <ChatWindow {...props} />
    </AnalyticsProvider>
  )
}
```

---

## 🧩 Provider Setup

### Google Analytics 4

```tsx
import { createGoogleAnalyticsProvider } from '@clarity-chat/react'

const gaProvider = createGoogleAnalyticsProvider('G-XXXXXXXXXX', {
  debug: process.env.NODE_ENV === 'development',
  anonymizeIP: true,
  cookieDomain: 'auto',
})
```

### Mixpanel

```tsx
import { createMixpanelProvider } from '@clarity-chat/react'

const mixpanelProvider = createMixpanelProvider('YOUR_PROJECT_TOKEN', {
  debug: false,
  trackPageView: true,
  persistenceType: 'localStorage',
})
```

### PostHog

```tsx
import { createPostHogProvider } from '@clarity-chat/react'

const posthogProvider = createPostHogProvider('YOUR_PROJECT_API_KEY', {
  apiHost: 'https://app.posthog.com',
  capturePageView: true,
  debug: false,
})
```

### Amplitude

```tsx
import { createAmplitudeProvider } from '@clarity-chat/react'

const amplitudeProvider = createAmplitudeProvider('YOUR_API_KEY', {
  serverUrl: 'https://api.amplitude.com',
  trackSessions: true,
})
```

### Segment

```tsx
import { createSegmentProvider } from '@clarity-chat/react'

const segmentProvider = createSegmentProvider('YOUR_WRITE_KEY', {
  debug: false,
  trackPageViews: true,
})
```

### Plausible

```tsx
import { createPlausibleProvider } from '@clarity-chat/react'

const plausibleProvider = createPlausibleProvider({
  domain: 'yourdomain.com',
  apiHost: 'https://plausible.io',
})
```

### Heap

```tsx
import { createHeapProvider } from '@clarity-chat/react'

const heapProvider = createHeapProvider('YOUR_APP_ID', {
  secureCookie: true,
})
```

---

## 📊 Multi-Provider Setup

Track events across multiple providers simultaneously:

```tsx
import {
  AnalyticsProvider,
  createGoogleAnalyticsProvider,
  createMixpanelProvider,
  createAmplitudeProvider,
} from '@clarity-chat/react'

function App() {
  const providers = [
    createGoogleAnalyticsProvider('G-XXXXXXXXXX'),
    createMixpanelProvider('MIXPANEL_TOKEN'),
    createAmplitudeProvider('AMPLITUDE_KEY'),
  ]

  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers,
        autoTrack: {
          pageViews: true,
          errors: true,
          performance: true,
        },
      }}
    >
      <ChatWindow {...props} />
    </AnalyticsProvider>
  )
}
```

---

## 🪝 Using Analytics

### useAnalytics Hook

```tsx
import { useAnalytics } from '@clarity-chat/react'

function ChatWindow() {
  const { track, page, identify, group } = useAnalytics()

  // Track custom events
  const handleSendMessage = (content: string) => {
    track('message_sent', {
      content_length: content.length,
      timestamp: new Date().toISOString(),
    })
    
    sendMessage(content)
  }

  // Track page views
  useEffect(() => {
    page('Chat Window')
  }, [page])

  // Identify user
  useEffect(() => {
    identify('user-123', {
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'pro',
    })
  }, [identify])

  return <ChatInput onSend={handleSendMessage} />
}
```

---

## 📋 Predefined Events

Clarity Chat includes 35+ predefined events:

### Chat Events
```typescript
// Message events
track('message_sent', { content_length: 100, has_attachments: false })
track('message_received', { response_time_ms: 450 })
track('message_edited', { message_id: '123' })
track('message_deleted', { message_id: '123' })
track('message_copied', { content_length: 50 })

// Voice events
track('voice_input_started')
track('voice_input_stopped', { duration_ms: 3500 })
track('voice_transcript_received', { word_count: 12 })

// File events
track('file_uploaded', { file_type: 'pdf', file_size: 1024000 })
track('file_download', { file_name: 'document.pdf' })

// Context events
track('context_added', { context_type: 'document', size: 50000 })
track('context_removed', { context_id: '456' })
```

### UI Events
```typescript
track('theme_changed', { from: 'light', to: 'dark' })
track('settings_opened')
track('search_performed', { query: 'pricing', results: 5 })
track('export_initiated', { format: 'pdf' })
```

### Error Events
```typescript
track('error_occurred', {
  error_type: 'network',
  error_message: 'Failed to connect',
  component: 'ChatWindow',
})
```

### Performance Events
```typescript
track('performance', {
  metric: 'message_latency',
  value: 245,
  unit: 'ms',
})
```

---

## 🎯 Common Use Cases

### 1. Track User Sessions

```tsx
import { useAnalytics } from '@clarity-chat/react'

function App() {
  const { track } = useAnalytics()

  useEffect(() => {
    // Session start
    const sessionId = crypto.randomUUID()
    track('session_started', {
      session_id: sessionId,
      user_agent: navigator.userAgent,
    })

    // Session end on cleanup
    return () => {
      track('session_ended', {
        session_id: sessionId,
        duration_ms: Date.now() - sessionStartTime,
      })
    }
  }, [])

  return <ChatWindow {...props} />
}
```

### 2. Conversion Tracking

```tsx
function ChatWindow() {
  const { track } = useAnalytics()

  const handleUpgrade = () => {
    track('conversion', {
      event_category: 'purchase',
      event_label: 'pro_plan',
      value: 29.99,
      currency: 'USD',
    })
    
    // Proceed with upgrade
  }

  return (
    <button onClick={handleUpgrade}>
      Upgrade to Pro
    </button>
  )
}
```

### 3. A/B Testing

```tsx
import { useAnalytics } from '@clarity-chat/react'

function ChatWindow() {
  const { track } = useAnalytics()
  const [variant, setVariant] = useState<'A' | 'B'>('A')

  useEffect(() => {
    // Assign variant
    const assignedVariant = Math.random() > 0.5 ? 'A' : 'B'
    setVariant(assignedVariant)

    // Track assignment
    track('ab_test_assigned', {
      test_name: 'new_ui_layout',
      variant: assignedVariant,
    })
  }, [])

  return (
    <div className={`layout-${variant}`}>
      {/* Your UI */}
    </div>
  )
}
```

### 4. User Behavior Funnel

```tsx
function OnboardingFlow() {
  const { track } = useAnalytics()

  const handleStep = (stepNumber: number, stepName: string) => {
    track('funnel_step_completed', {
      funnel_name: 'onboarding',
      step_number: stepNumber,
      step_name: stepName,
    })
  }

  return (
    <>
      <Step1 onComplete={() => handleStep(1, 'account_created')} />
      <Step2 onComplete={() => handleStep(2, 'profile_completed')} />
      <Step3 onComplete={() => handleStep(3, 'first_message_sent')} />
    </>
  )
}
```

### 5. Feature Usage Tracking

```tsx
function ChatWindow() {
  const { track } = useAnalytics()

  const trackFeatureUsage = (feature: string) => {
    track('feature_used', {
      feature_name: feature,
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div>
      <VoiceInput
        onStart={() => trackFeatureUsage('voice_input')}
        onTranscript={(text) => sendMessage(text)}
      />
      
      <FileUpload
        onUpload={(file) => trackFeatureUsage('file_upload')}
      />
      
      <ExportDialog
        onExport={(format) => trackFeatureUsage(`export_${format}`)}
      />
    </div>
  )
}
```

---

## 📈 Performance Metrics

Track application performance:

```tsx
import { usePerformanceTracking } from '@clarity-chat/react'

function ChatWindow() {
  usePerformanceTracking({
    metrics: ['message_latency', 'render_time', 'api_response_time'],
    sampleRate: 0.1, // Track 10% of events
  })

  return <ChatWindow {...props} />
}
```

### Custom Performance Metrics

```tsx
import { useAnalytics } from '@clarity-chat/react'

function ChatWindow() {
  const { track } = useAnalytics()

  const measurePerformance = async (label: string, fn: () => Promise<any>) => {
    const start = performance.now()
    
    try {
      await fn()
    } finally {
      const duration = performance.now() - start
      
      track('performance_metric', {
        label,
        duration_ms: Math.round(duration),
        timestamp: new Date().toISOString(),
      })
    }
  }

  const sendMessage = async (content: string) => {
    await measurePerformance('send_message', async () => {
      await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
    })
  }

  return <ChatInput onSend={sendMessage} />
}
```

---

## 🔒 Privacy & Compliance

### GDPR Compliance

```tsx
import { AnalyticsProvider } from '@clarity-chat/react'

function App() {
  const [hasConsent, setHasConsent] = useState(false)

  return (
    <>
      {!hasConsent && (
        <CookieConsent onAccept={() => setHasConsent(true)} />
      )}

      <AnalyticsProvider
        config={{
          enabled: hasConsent,
          providers: [/* ... */],
          respectDoNotTrack: true,
          anonymizeIP: true,
        }}
      >
        <ChatWindow {...props} />
      </AnalyticsProvider>
    </>
  )
}
```

### Data Anonymization

```tsx
import { useAnalytics } from '@clarity-chat/react'

function ChatWindow() {
  const { track } = useAnalytics()

  const handleSendMessage = (content: string) => {
    // Track without PII
    track('message_sent', {
      content_length: content.length,
      has_urls: /https?:\/\//.test(content),
      // Don't send actual content
    })
    
    sendMessage(content)
  }

  return <ChatInput onSend={handleSendMessage} />
}
```

---

## 🐛 Debug Mode

Enable debug mode during development:

```tsx
import { AnalyticsProvider } from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        debug: process.env.NODE_ENV === 'development',
        providers: [/* ... */],
      }}
    >
      <ChatWindow {...props} />
    </AnalyticsProvider>
  )
}
```

This will log all analytics events to the console:
```
[Analytics] Track: message_sent
{
  content_length: 42,
  timestamp: "2025-10-30T12:00:00.000Z"
}
```

---

## 📊 Dashboard Examples

### Create a Usage Dashboard

```tsx
import { useAnalytics } from '@clarity-chat/react'

function UsageDashboard() {
  const [metrics, setMetrics] = useState({
    messagesCount: 0,
    avgResponseTime: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // Fetch metrics from your analytics backend
    fetchMetrics().then(setMetrics)
  }, [])

  return (
    <div className="dashboard">
      <MetricCard
        title="Messages Sent"
        value={metrics.messagesCount}
        trend="+12%"
      />
      <MetricCard
        title="Avg Response Time"
        value={`${metrics.avgResponseTime}ms`}
        trend="-8%"
      />
      <MetricCard
        title="Active Users"
        value={metrics.activeUsers}
        trend="+25%"
      />
    </div>
  )
}
```

---

## 🔗 Backend Integration

### Send Events to Backend

```tsx
import { AnalyticsProvider } from '@clarity-chat/react'

const customProvider = {
  name: 'backend',
  track: async (event: string, properties: any) => {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        properties,
        timestamp: new Date().toISOString(),
      }),
    })
  },
  identify: async (userId: string, traits: any) => {
    await fetch('/api/users/identify', {
      method: 'POST',
      body: JSON.stringify({ userId, traits }),
    })
  },
}

function App() {
  return (
    <AnalyticsProvider
      config={{
        enabled: true,
        providers: [customProvider],
      }}
    >
      <ChatWindow {...props} />
    </AnalyticsProvider>
  )
}
```

---

## 📚 Best Practices

### ✅ Do's
- Track meaningful user actions
- Use consistent event naming
- Include relevant context in properties
- Respect user privacy (GDPR, CCPA)
- Test analytics in development
- Monitor data quality
- Set up conversion funnels
- Track errors and performance

### ❌ Don'ts
- Don't track PII without consent
- Don't track every single event
- Don't use inconsistent naming
- Don't forget to test analytics
- Don't ignore data privacy laws
- Don't track sensitive information
- Don't overwhelm with events

---

## 🔗 Related Documentation

- **[Error Handling](./error-handling.md)** - Track errors
- **[Performance](./mobile.md)** - Performance optimization
- **[API Reference](../api/components.md)** - Component API
- **[Hooks](../api/hooks.md)** - Analytics hooks

---

**Start tracking today!** Check out our [Analytics Examples](../../examples/analytics/)! 📊
