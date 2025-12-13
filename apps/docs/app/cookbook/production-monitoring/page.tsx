import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Production Monitoring & Observability - Cookbook',
  description: 'Set up comprehensive monitoring, logging, and alerting for production AI apps.',
}

export default function ProductionMonitoringCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Production Monitoring & Observability</h1>
        <p className="docs-lead">
          Implement comprehensive monitoring, tracing, and alerting for production AI applications.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Monitor performance, track usage, detect anomalies, and maintain SLAs in production
          with integrated observability tools.
        </p>
        <Callout type="warning" title="Production Ready">
          This recipe covers enterprise-grade monitoring suitable for high-traffic applications.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Complete Monitoring Setup</h2>
        <pre><code>{`// app/providers/monitoring-provider.tsx
import { 
  Tracer, 
  MetricsCollector, 
  ErrorReporter 
} from '@clarity-chat/react/observability'

export function MonitoringProvider({ children }) {
  const tracer = new Tracer({
    serviceName: 'clarity-chat',
    endpoint: process.env.OTEL_ENDPOINT,
    sampleRate: 0.1, // Sample 10% in production
    exportFormat: 'opentelemetry'
  })

  const metrics = new MetricsCollector({
    endpoint: '/api/metrics',
    flushIntervalMs: 30000,
    batchSize: 100
  })

  const errorReporter = new ErrorReporter({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    beforeSend: (error) => {
      // Filter sensitive data
      delete error.user?.apiKey
      return error
    }
  })

  return (
    <TracingContext.Provider value={tracer}>
      <MetricsContext.Provider value={metrics}>
        <ErrorContext.Provider value={errorReporter}>
          {children}
        </ErrorContext.Provider>
      </MetricsContext.Provider>
    </TracingContext.Provider>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Custom Metrics</h2>
        <pre><code>{`import { useMetrics } from '@clarity-chat/react/hooks'

export function ChatWindow() {
  const metrics = useMetrics()

  const handleSendMessage = async (message) => {
    const startTime = Date.now()
    
    try {
      metrics.increment('chat.messages.sent')
      
      const response = await sendMessage(message)
      
      const latency = Date.now() - startTime
      metrics.histogram('chat.latency', latency)
      metrics.increment('chat.messages.success')
      
      // Track token usage
      metrics.gauge('chat.tokens.used', response.usage.totalTokens)
      
      return response
    } catch (error) {
      metrics.increment('chat.messages.error', {
        errorType: error.name
      })
      throw error
    }
  }
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Distributed Tracing</h2>
        <pre><code>{`import { useTracer } from '@clarity-chat/react/hooks'

export async function POST(req: Request) {
  const tracer = useTracer()
  
  return tracer.trace('chat.request', async (span) => {
    span.setAttribute('user.id', userId)
    span.setAttribute('model', 'gpt-4')
    
    // Trace memory retrieval
    const memories = await tracer.trace('memory.retrieve', async () => {
      return await memoryService.retrieve({ query, userId })
    })
    
    span.setAttribute('memory.count', memories.length)
    
    // Trace LLM call
    const response = await tracer.trace('llm.call', async (llmSpan) => {
      llmSpan.setAttribute('llm.model', 'gpt-4')
      llmSpan.setAttribute('llm.tokens', prompt.length)
      
      return await openai.chat.completions.create({
        model: 'gpt-4',
        messages: prompt
      })
    })
    
    return Response.json(response)
  })
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Alerting Rules</h2>
        <pre><code>{`// monitoring/alerts.ts
export const alertRules = [
  {
    name: 'HighErrorRate',
    condition: 'error_rate > 0.05',
    window: '5m',
    severity: 'critical',
    actions: ['pagerduty', 'slack']
  },
  {
    name: 'SlowResponses',
    condition: 'p95_latency_ms > 3000',
    window: '10m',
    severity: 'warning',
    actions: ['slack']
  },
  {
    name: 'QuotaExceeded',
    condition: 'quota_usage > 0.9',
    window: '1h',
    severity: 'warning',
    actions: ['email', 'slack']
  },
  {
    name: 'HighTokenUsage',
    condition: 'tokens_per_hour > 100000',
    window: '1h',
    severity: 'info',
    actions: ['slack']
  }
]`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Health Checks</h2>
        <pre><code>{`// app/api/health/route.ts
import { checkDependencies } from '@/lib/monitoring'

export async function GET() {
  const checks = await Promise.allSettled([
    checkDatabase(),
    checkRedis(),
    checkVectorStore(),
    checkLLMProvider()
  ])

  const health = {
    status: checks.every(c => c.status === 'fulfilled') ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks: {
      database: checks[0].status === 'fulfilled' ? 'up' : 'down',
      redis: checks[1].status === 'fulfilled' ? 'up' : 'down',
      vectorStore: checks[2].status === 'fulfilled' ? 'up' : 'down',
      llm: checks[3].status === 'fulfilled' ? 'up' : 'down'
    }
  }

  const statusCode = health.status === 'healthy' ? 200 : 503
  return Response.json(health, { status: statusCode })
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Log Aggregation</h2>
        <pre><code>{`// lib/logger.ts
import { Logger } from '@clarity-chat/react/logging'

export const logger = new Logger({
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  outputs: [
    { type: 'console' },
    { 
      type: 'file', 
      path: '/var/log/clarity-chat.log',
      rotation: { maxSize: '100MB', maxFiles: 10 }
    },
    {
      type: 'remote',
      endpoint: process.env.LOG_ENDPOINT,
      batchSize: 100
    }
  ],
  // Structured logging
  defaultFields: {
    service: 'clarity-chat',
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION
  }
})

// Usage
logger.info('Chat message sent', {
  userId,
  messageId,
  model: 'gpt-4',
  tokens: 150
})`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Dashboard Configuration</h2>
        <pre><code>{`// monitoring/dashboards/main.json
{
  "name": "Clarity Chat - Main Dashboard",
  "panels": [
    {
      "title": "Request Rate",
      "query": "rate(chat_requests_total[5m])",
      "type": "graph"
    },
    {
      "title": "Error Rate",
      "query": "rate(chat_errors_total[5m]) / rate(chat_requests_total[5m])",
      "type": "graph",
      "alert": { "threshold": 0.05 }
    },
    {
      "title": "P95 Latency",
      "query": "histogram_quantile(0.95, chat_latency_seconds)",
      "type": "graph",
      "alert": { "threshold": 3.0 }
    },
    {
      "title": "Token Usage",
      "query": "sum(rate(chat_tokens_total[1h]))",
      "type": "graph"
    },
    {
      "title": "Active Users",
      "query": "count(chat_active_sessions)",
      "type": "stat"
    }
  ]
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use sampling in production to reduce overhead (10-20% is typical)</li>
          <li>Set up alerts for both technical and business metrics</li>
          <li>Implement graceful degradation when monitoring services fail</li>
          <li>Tag all metrics with relevant dimensions (user, tenant, model, etc.)</li>
          <li>Create runbooks for common alerts</li>
          <li>Review dashboards regularly and remove unused metrics</li>
          <li>Set up synthetic monitoring for critical flows</li>
          <li>Implement cost tracking and attribution</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Monitoring Checklist</h2>
        <Callout type="info" title="Production Checklist">
          ✅ Request/error rates and latency percentiles<br/>
          ✅ Token usage and costs per user/tenant<br/>
          ✅ Model performance metrics (TTFT, tokens/sec)<br/>
          ✅ Memory and cache hit rates<br/>
          ✅ Queue depths and worker utilization<br/>
          ✅ Dependency health checks<br/>
          ✅ Alert coverage for SLA violations<br/>
          ✅ Log aggregation and search<br/>
          ✅ Distributed tracing across services<br/>
          ✅ Synthetic monitoring for critical paths
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/performance-dashboard" className="docs-card">
            <h3>Performance Dashboard</h3>
            <p>Built-in performance monitoring</p>
          </a>
          <a href="/reference/components/usage-dashboard" className="docs-card">
            <h3>Usage Dashboard</h3>
            <p>Track usage and quotas</p>
          </a>
          <a href="/guides/performance" className="docs-card">
            <h3>Performance Guide</h3>
            <p>Optimization techniques</p>
          </a>
        </div>
      </section>
    </div>
  )
}
