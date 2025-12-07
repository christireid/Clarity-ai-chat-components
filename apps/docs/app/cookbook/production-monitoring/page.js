import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Production Monitoring & Observability - Cookbook',
    description: 'Set up comprehensive monitoring, logging, and alerting for production AI apps.',
};
export default function ProductionMonitoringCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Production Monitoring & Observability" }), _jsx("p", { className: "docs-lead", children: "Implement comprehensive monitoring, tracing, and alerting for production AI applications." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsx("p", { children: "Monitor performance, track usage, detect anomalies, and maintain SLAs in production with integrated observability tools." }), _jsx(Callout, { type: "warning", title: "Production Ready", children: "This recipe covers enterprise-grade monitoring suitable for high-traffic applications." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Complete Monitoring Setup" }), _jsx("pre", { children: _jsx("code", { children: `// app/providers/monitoring-provider.tsx
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Custom Metrics" }), _jsx("pre", { children: _jsx("code", { children: `import { useMetrics } from '@clarity-chat/react/hooks'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Distributed Tracing" }), _jsx("pre", { children: _jsx("code", { children: `import { useTracer } from '@clarity-chat/react/hooks'

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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Alerting Rules" }), _jsx("pre", { children: _jsx("code", { children: `// monitoring/alerts.ts
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
]` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Health Checks" }), _jsx("pre", { children: _jsx("code", { children: `// app/api/health/route.ts
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Log Aggregation" }), _jsx("pre", { children: _jsx("code", { children: `// lib/logger.ts
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
})` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Dashboard Configuration" }), _jsx("pre", { children: _jsx("code", { children: `// monitoring/dashboards/main.json
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
}` }) })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsx("li", { children: "Use sampling in production to reduce overhead (10-20% is typical)" }), _jsx("li", { children: "Set up alerts for both technical and business metrics" }), _jsx("li", { children: "Implement graceful degradation when monitoring services fail" }), _jsx("li", { children: "Tag all metrics with relevant dimensions (user, tenant, model, etc.)" }), _jsx("li", { children: "Create runbooks for common alerts" }), _jsx("li", { children: "Review dashboards regularly and remove unused metrics" }), _jsx("li", { children: "Set up synthetic monitoring for critical flows" }), _jsx("li", { children: "Implement cost tracking and attribution" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Monitoring Checklist" }), _jsxs(Callout, { type: "info", title: "Production Checklist", children: ["\u2705 Request/error rates and latency percentiles", _jsx("br", {}), "\u2705 Token usage and costs per user/tenant", _jsx("br", {}), "\u2705 Model performance metrics (TTFT, tokens/sec)", _jsx("br", {}), "\u2705 Memory and cache hit rates", _jsx("br", {}), "\u2705 Queue depths and worker utilization", _jsx("br", {}), "\u2705 Dependency health checks", _jsx("br", {}), "\u2705 Alert coverage for SLA violations", _jsx("br", {}), "\u2705 Log aggregation and search", _jsx("br", {}), "\u2705 Distributed tracing across services", _jsx("br", {}), "\u2705 Synthetic monitoring for critical paths"] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Related" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("a", { href: "/reference/components/performance-dashboard", className: "docs-card", children: [_jsx("h3", { children: "Performance Dashboard" }), _jsx("p", { children: "Built-in performance monitoring" })] }), _jsxs("a", { href: "/reference/components/usage-dashboard", className: "docs-card", children: [_jsx("h3", { children: "Usage Dashboard" }), _jsx("p", { children: "Track usage and quotas" })] }), _jsxs("a", { href: "/guides/performance", className: "docs-card", children: [_jsx("h3", { children: "Performance Guide" }), _jsx("p", { children: "Optimization techniques" })] })] })] })] }));
}
//# sourceMappingURL=page.js.map