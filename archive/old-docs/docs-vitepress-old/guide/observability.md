# Observability & Monitoring

Monitor your AI chat application with comprehensive observability tools including tracing, metrics, and evaluation.

## Overview

Observability features help you:
- Track request latency and performance
- Monitor token usage and costs
- Evaluate response quality
- Debug issues with detailed traces
- Analyze user behavior

## Tracing

Track AI operations with detailed traces:

```tsx
import { Tracer } from '@clarity-chat/react'

const tracer = new Tracer({
  enabled: true,
  provider: 'console', // or 'opentelemetry', 'datadog', etc.
})

// Wrap operations in traces
const trace = tracer.startTrace('chat.completion')

try {
  const response = await chat({
    messages: [{ role: 'user', content: 'Hello!' }],
  })
  
  trace.setAttribute('tokens', response.usage.totalTokens)
  trace.setAttribute('model', 'gpt-4')
  trace.end({ status: 'success' })
} catch (error) {
  trace.end({ status: 'error', error: error.message })
}
```

### Automatic Tracing

Enable automatic tracing for all operations:

```tsx
import { ObservabilityProvider } from '@clarity-chat/react'

function App() {
  return (
    <ObservabilityProvider
      tracer={tracer}
      autoTrace={true}
      traceOperations={['chat', 'embedding', 'tool_call']}
    >
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ObservabilityProvider>
  )
}
```

## Metrics

Track key metrics:

```tsx
import { MetricsCollector } from '@clarity-chat/react'

const metrics = new MetricsCollector({
  provider: 'console', // or 'prometheus', 'datadog', etc.
})

// Track custom metrics
metrics.increment('chat.messages.sent')
metrics.histogram('chat.response.time', responseTime)
metrics.gauge('chat.active.users', activeUsers)
```

### Built-in Metrics

Clarity Chat automatically tracks:
- `chat.messages.sent` - Total messages sent
- `chat.messages.received` - Total messages received
- `chat.tokens.input` - Input tokens used
- `chat.tokens.output` - Output tokens used
- `chat.cost.estimated` - Estimated cost
- `chat.errors` - Error count
- `chat.latency` - Response latency

## Evaluation Dashboard

Evaluate AI response quality:

```tsx
import { EvaluationDashboard } from '@clarity-chat/react'

function EvaluationPanel() {
  const metrics = [
    {
      id: 'groundedness',
      label: 'Groundedness',
      value: '0.92',
      trend: 'up',
    },
    {
      id: 'coherence',
      label: 'Coherence',
      value: '0.88',
      trend: 'steady',
    },
    {
      id: 'relevance',
      label: 'Relevance',
      value: '0.95',
      trend: 'up',
    },
  ]

  return <EvaluationDashboard metrics={metrics} />
}
```

### Response Quality Meter

Display quality metrics for individual responses:

```tsx
import { ResponseQualityMeter } from '@clarity-chat/react'

function MessageWithQuality({ message }) {
  const metrics = [
    {
      id: 'groundedness',
      label: 'Groundedness',
      score: 0.92,
      target: 0.9,
    },
    {
      id: 'coherence',
      label: 'Coherence',
      score: 0.88,
    },
  ]

  return (
    <div>
      <Message message={message} />
      <ResponseQualityMeter metrics={metrics} />
    </div>
  )
}
```

## Performance Monitoring

Monitor application performance:

```tsx
import { usePerformance } from '@clarity-chat/react'

function ChatComponent() {
  const { 
    measure,
    getMetrics,
    reportMetric,
  } = usePerformance()

  const handleSend = async (message: string) => {
    const endMeasure = measure('chat.send')
    
    try {
      await sendMessage(message)
      endMeasure({ status: 'success' })
    } catch (error) {
      endMeasure({ status: 'error' })
      reportMetric('chat.errors', 1)
    }
  }

  // Get performance metrics
  const metrics = getMetrics()
  console.log('Average latency:', metrics.averageLatency)
  console.log('Error rate:', metrics.errorRate)

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Performance Dashboard

Visualize performance metrics:

```tsx
import { PerformanceDashboard } from '@clarity-chat/react'

function AdminPanel() {
  return (
    <PerformanceDashboard
      metrics={{
        averageLatency: 250,
        p95Latency: 500,
        errorRate: 0.01,
        throughput: 100,
      }}
    />
  )
}
```

## Analytics Integration

Track user behavior:

```tsx
import { AnalyticsProvider, useAnalytics } from '@clarity-chat/react'

function App() {
  return (
    <AnalyticsProvider
      provider="mixpanel" // or 'amplitude', 'segment', etc.
      apiKey={process.env.ANALYTICS_API_KEY}
    >
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </AnalyticsProvider>
  )
}

function ChatComponent() {
  const { track } = useAnalytics()

  const handleSend = async (message: string) => {
    track('message_sent', {
      messageLength: message.length,
      timestamp: Date.now(),
    })
    
    await sendMessage(message)
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Logging

Structured logging for debugging:

```tsx
import { Logger } from '@clarity-chat/react'

const logger = new Logger({
  level: 'info', // 'debug', 'info', 'warn', 'error'
  provider: 'console', // or 'winston', 'pino', etc.
})

logger.info('Chat started', { userId: '123' })
logger.error('Failed to send message', { error: error.message })
logger.debug('Token count', { tokens: 150 })
```

## Complete Observability Setup

```tsx
import {
  ObservabilityProvider,
  Tracer,
  MetricsCollector,
  Logger,
} from '@clarity-chat/react'

const tracer = new Tracer({ enabled: true })
const metrics = new MetricsCollector({ enabled: true })
const logger = new Logger({ level: 'info' })

function App() {
  return (
    <ObservabilityProvider
      tracer={tracer}
      metrics={metrics}
      logger={logger}
      autoTrace={true}
    >
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ObservabilityProvider>
  )
}
```

## Best Practices

1. **Enable in Production**: Always enable observability in production
2. **Sample Traces**: Sample traces to avoid performance impact
3. **Monitor Costs**: Track token usage and costs
4. **Set Alerts**: Set up alerts for errors and latency
5. **Privacy**: Don't log sensitive user data
6. **Performance**: Use async logging to avoid blocking

## Next Steps

- [Observability API Reference](/api/observability) - Complete observability API
- [Evaluation Dashboard](/api/components/evaluation-dashboard) - Quality metrics
- [Performance Dashboard](/api/components/performance-dashboard) - Performance metrics
