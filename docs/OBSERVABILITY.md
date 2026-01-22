# Model Adapter Observability

**Version:** 1.0.0
**Date:** January 21, 2026

## Overview

This document describes the comprehensive observability infrastructure added to the model adapters in **Priority 3** of the [Model Adapter Audit](./ADAPTER_AUDIT_REPORT.md). These features provide visibility into adapter performance, health, and behavior in production environments.

## Features

### 1. Structured Logging

Professional logging system with levels, context, and automatic sensitive data scrubbing.

#### Log Levels

```typescript
enum LogLevel {
  DEBUG = 'debug',  // Detailed debugging information
  INFO = 'info',    // General informational messages
  WARN = 'warn',    // Warning messages
  ERROR = 'error',  // Error messages
}
```

#### Basic Usage

```typescript
import { Logger, LogLevel } from '@clarity-chat/react'

const logger = new Logger({
  level: LogLevel.INFO,
  scrubSensitiveData: true,
})

// Simple logging
logger.info('Request started', { provider: 'openai', model: 'gpt-4o' })
logger.warn('Rate limit approaching', { remaining: 10 })
logger.error('Request failed', error, { provider: 'openai' })

// With correlation ID for request tracing
const requestLogger = logger.setCorrelationId('req-123')
requestLogger.info('Processing request')
```

#### Log Transports

**Console Transport** (default, with colors):
```typescript
import { ConsoleLogTransport } from '@clarity-chat/react'

const logger = new Logger({
  transports: [new ConsoleLogTransport()],
})
```

**JSON Transport** (for structured logging systems):
```typescript
import { JSONLogTransport } from '@clarity-chat/react'

const logger = new Logger({
  transports: [new JSONLogTransport()],
})
```

**Buffered Transport** (for batching):
```typescript
import { BufferedLogTransport, JSONLogTransport } from '@clarity-chat/react'

const logger = new Logger({
  transports: [
    new BufferedLogTransport(
      new JSONLogTransport(),
      100,    // Buffer size
      5000    // Flush interval (ms)
    )
  ],
})
```

#### Custom Transport

```typescript
import type { LogTransport, LogEntry } from '@clarity-chat/react'

class CustomTransport implements LogTransport {
  async log(entry: LogEntry): Promise<void> {
    // Send to your logging service
    await fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  }

  async flush(): Promise<void> {
    // Flush any buffered logs
  }
}

const logger = new Logger({
  transports: [new CustomTransport()],
})
```

#### Sensitive Data Scrubbing

Automatically scrubs sensitive fields:

```typescript
logger.info('Request made', {
  apiKey: 'sk-abc123',  // Will be [REDACTED]
  model: 'gpt-4o',      // Will be logged
})

// Output: { apiKey: '[REDACTED]', model: 'gpt-4o' }
```

Default sensitive fields:
- `apiKey`, `api_key`, `apikey`
- `authorization`
- `password`
- `secret`
- `token`
- `x-api-key`

#### Correlation IDs

Track requests across async operations:

```typescript
import { createCorrelationId } from '@clarity-chat/react'

async function handleRequest() {
  const correlationId = createCorrelationId()
  const logger = globalLogger.setCorrelationId(correlationId)

  logger.info('Request started')
  // ... make API calls ...
  logger.info('Request completed')
}
```

### 2. Health Monitoring

Track provider health metrics including success rates, latencies, and error rates.

#### Metrics Tracked

- **Success/failure rates**
- **Latency percentiles** (p50, p95, p99, min, max, avg)
- **Error statistics** by error code
- **Token usage** (input, output, total)
- **Cost tracking** in USD
- **Throughput** (requests per second)
- **Health score** (0-100)

#### Basic Usage

```typescript
import { globalHealthMonitorRegistry } from '@clarity-chat/react'

// Get monitor for provider
const monitor = globalHealthMonitorRegistry.get('openai')

// Record successful request
monitor.recordSuccess(
  250,  // latency in ms
  {     // token usage
    promptTokens: 100,
    completionTokens: 50,
    totalTokens: 150,
  },
  0.001 // cost in USD
)

// Record failed request
monitor.recordFailure(500, error)

// Get current metrics
const metrics = monitor.getMetrics()
console.log('Success rate:', metrics.successRate)
console.log('p95 latency:', metrics.latency.p95)
console.log('Health score:', metrics.healthScore)
console.log('Is healthy:', metrics.isHealthy)
```

#### Health Metrics Interface

```typescript
interface ProviderHealthMetrics {
  provider: string
  totalRequests: number
  successCount: number
  failureCount: number
  successRate: number  // 0-1
  latency: {
    p50: number
    p95: number
    p99: number
    min: number
    max: number
    avg: number
  }
  errors: {
    total: number
    byCode: Record<string, number>
    retryable: number
    nonRetryable: number
  }
  tokens: {
    total: number
    input: number
    output: number
  }
  totalCost: number
  requestsPerSecond: number
  avgTokensPerRequest: number
  avgCostPerRequest: number
  isHealthy: boolean
  healthScore: number  // 0-100
}
```

#### Health Thresholds

Configure health check thresholds:

```typescript
import { HealthMonitorRegistry } from '@clarity-chat/react'

const registry = new HealthMonitorRegistry({
  thresholds: {
    minSuccessRate: 0.95,     // 95%
    maxP99Latency: 10000,     // 10 seconds
    maxErrorRate: 0.05,       // 5%
  },
})
```

#### Monitor All Providers

```typescript
// Get all provider metrics
const allMetrics = globalHealthMonitorRegistry.getAllMetrics()

for (const [provider, metrics] of Object.entries(allMetrics)) {
  console.log(`${provider}: ${metrics.healthScore}/100`)
}

// Get healthy providers only
const healthyProviders = globalHealthMonitorRegistry.getHealthyProviders()

// Get overall health summary
const summary = globalHealthMonitorRegistry.getHealthSummary()
console.log('Overall health:', summary.overallHealthScore)
```

### 3. Telemetry and Metrics Export

Integration hooks for external monitoring systems.

#### Telemetry Events

```typescript
enum TelemetryEventType {
  REQUEST_START = 'request.start',
  REQUEST_END = 'request.end',
  REQUEST_ERROR = 'request.error',
  REQUEST_RETRY = 'request.retry',
  CIRCUIT_STATE_CHANGE = 'circuit.state_change',
  CIRCUIT_REQUEST_REJECTED = 'circuit.request_rejected',
  TOKEN_USAGE = 'token.usage',
  COST_INCURRED = 'cost.incurred',
}
```

#### Custom Telemetry Hooks

```typescript
import { globalTelemetry, TelemetryEvent } from '@clarity-chat/react'

// Add custom hook
globalTelemetry.addHook(async (event: TelemetryEvent) => {
  // Send to your monitoring service
  await fetch('/api/telemetry', {
    method: 'POST',
    body: JSON.stringify(event),
  })
})

// Or multiple hooks
globalTelemetry.addHook((event) => {
  if (event.type === 'request.error') {
    // Alert on errors
    console.error('Adapter error:', event)
  }
})
```

#### Record Events Manually

```typescript
// Record request start
await globalTelemetry.recordRequestStart(
  'openai',
  'chat',
  correlationId,
  { model: 'gpt-4o' }
)

// Record request end
await globalTelemetry.recordRequestEnd(
  'openai',
  'chat',
  250,  // duration ms
  tokenUsage,
  'stop',  // finish reason
  correlationId
)

// Record error
await globalTelemetry.recordRequestError(
  'openai',
  'chat',
  error,
  250,
  correlationId
)
```

### 4. Prometheus Metrics Export

Export metrics in Prometheus-compatible format.

#### Available Metrics

- `adapter_requests_total` - Total requests (counter)
- `adapter_request_duration_ms` - Request duration (histogram)
- `adapter_errors_total` - Total errors (counter)
- `adapter_tokens_total` - Total tokens (counter)
- `adapter_cost_total` - Total cost (counter)
- `circuit_breaker_state` - Circuit state (gauge)
- `provider_health_score` - Health score (gauge)

#### Export Metrics

```typescript
import {
  exportPrometheusMetrics,
  exportPrometheusText,
} from '@clarity-chat/react'

// As JSON
const metrics = exportPrometheusMetrics()
console.log(metrics.adapter_requests_total)

// As Prometheus text format
const text = exportPrometheusText()
console.log(text)
```

#### Expose Metrics Endpoint

```typescript
// Express.js example
import { exportPrometheusText } from '@clarity-chat/react'

app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain; version=0.0.4')
  res.send(exportPrometheusText())
})
```

#### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'clarity-chat'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
```

### 5. OpenTelemetry Integration

OpenTelemetry-compatible span tracking.

#### Create and Export Spans

```typescript
import { createSpan, endSpan, exportSpan } from '@clarity-chat/react'

// Create span
const span = createSpan('openai.chat', {
  provider: 'openai',
  model: 'gpt-4o',
  operation: 'chat',
})

try {
  // ... make request ...
  endSpan(span, 'ok')
} catch (error) {
  endSpan(span, 'error', error.message)
}

// Export span
const exported = exportSpan(span)
console.log('Duration:', exported.durationMs)
```

#### Integration with OpenTelemetry SDK

```typescript
import { trace } from '@opentelemetry/api'
import { createSpan, endSpan } from '@clarity-chat/react'

const tracer = trace.getTracer('clarity-chat')

tracer.startActiveSpan('adapter.request', (otelSpan) => {
  const span = createSpan('openai.chat', {
    provider: 'openai',
    model: 'gpt-4o',
  })

  try {
    // ... make request ...
    endSpan(span, 'ok')
    otelSpan.setStatus({ code: SpanStatusCode.OK })
  } catch (error) {
    endSpan(span, 'error', error.message)
    otelSpan.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message,
    })
  } finally {
    otelSpan.end()
  }
})
```

## Integration Patterns

### Pattern 1: Basic Logging

```typescript
import { globalLogger } from '@clarity-chat/react'

async function chat(messages, config) {
  const logger = globalLogger
    .setProvider(config.provider)
    .setCorrelationId(createCorrelationId())

  logger.info('Chat request started', { model: config.model })

  try {
    const response = await adapter.chat(messages, config)
    logger.info('Chat request completed')
    return response
  } catch (error) {
    logger.error('Chat request failed', error)
    throw error
  }
}
```

### Pattern 2: Health Monitoring

```typescript
import { globalHealthMonitorRegistry } from '@clarity-chat/react'

async function chatWithMonitoring(messages, config) {
  const monitor = globalHealthMonitorRegistry.get(config.provider)
  const startTime = Date.now()

  try {
    const response = await adapter.chat(messages, config)
    const latency = Date.now() - startTime

    monitor.recordSuccess(latency, response.tokens, response.cost)
    return response
  } catch (error) {
    const latency = Date.now() - startTime
    monitor.recordFailure(latency, error)
    throw error
  }
}
```

### Pattern 3: Full Observability

```typescript
import {
  globalLogger,
  globalHealthMonitorRegistry,
  globalTelemetry,
  createCorrelationId,
  createSpan,
  endSpan,
} from '@clarity-chat/react'

async function chatWithFullObservability(messages, config) {
  const correlationId = createCorrelationId()
  const logger = globalLogger
    .setProvider(config.provider)
    .setCorrelationId(correlationId)
  const monitor = globalHealthMonitorRegistry.get(config.provider)
  const span = createSpan(`${config.provider}.chat`, {
    provider: config.provider,
    model: config.model,
  })

  logger.info('Chat request started', { model: config.model })

  await globalTelemetry.recordRequestStart(
    config.provider,
    'chat',
    correlationId,
    { model: config.model }
  )

  const startTime = Date.now()

  try {
    const response = await adapter.chat(messages, config)
    const latency = Date.now() - startTime

    // Record success
    monitor.recordSuccess(latency, response.tokens, response.cost)
    endSpan(span, 'ok')

    await globalTelemetry.recordRequestEnd(
      config.provider,
      'chat',
      latency,
      response.tokens,
      response.finishReason,
      correlationId
    )

    logger.info('Chat request completed', {
      latency,
      tokens: response.tokens?.totalTokens,
      finishReason: response.finishReason,
    })

    return response
  } catch (error) {
    const latency = Date.now() - startTime

    // Record failure
    monitor.recordFailure(latency, error)
    endSpan(span, 'error', error.message)

    await globalTelemetry.recordRequestError(
      config.provider,
      'chat',
      error,
      latency,
      correlationId
    )

    logger.error('Chat request failed', error, { latency })
    throw error
  }
}
```

### Pattern 4: Dashboard Integration

```typescript
// Express.js dashboard endpoint
import {
  globalHealthMonitorRegistry,
  globalCircuitBreakerRegistry,
  exportPrometheusMetrics,
} from '@clarity-chat/react'

app.get('/api/dashboard', (req, res) => {
  const healthMetrics = globalHealthMonitorRegistry.getAllMetrics()
  const circuitStats = globalCircuitBreakerRegistry.getAllStats()
  const healthSummary = globalHealthMonitorRegistry.getHealthSummary()

  res.json({
    summary: healthSummary,
    providers: Object.entries(healthMetrics).map(([provider, metrics]) => ({
      provider,
      health: metrics.healthScore,
      successRate: metrics.successRate,
      p95Latency: metrics.latency.p95,
      circuitState: circuitStats[provider]?.state || 'CLOSED',
      isHealthy: metrics.isHealthy,
    })),
    metrics: exportPrometheusMetrics(),
  })
})
```

### Pattern 5: Alerting

```typescript
import { globalHealthMonitorRegistry, globalTelemetry } from '@clarity-chat/react'

// Alert on unhealthy providers
setInterval(() => {
  const unhealthy = globalHealthMonitorRegistry.getUnhealthyProviders()

  if (unhealthy.length > 0) {
    console.error('Unhealthy providers:', unhealthy)
    // Send alert
    sendAlert({
      severity: 'warning',
      message: `Providers unhealthy: ${unhealthy.join(', ')}`,
    })
  }
}, 30000) // Check every 30s

// Alert on errors via telemetry
globalTelemetry.addHook((event) => {
  if (event.type === 'request.error') {
    const error = event.data.error as any

    if (!error.isRetryable) {
      // Non-retryable error - alert immediately
      sendAlert({
        severity: 'error',
        message: `${event.provider} error: ${error.message}`,
        code: error.code,
      })
    }
  }
})
```

## Configuration

### Production Configuration

```typescript
import {
  Logger,
  LogLevel,
  JSONLogTransport,
  BufferedLogTransport,
  HealthMonitorRegistry,
  TelemetryManager,
} from '@clarity-chat/react'

// Structured JSON logging
export const productionLogger = new Logger({
  level: LogLevel.INFO,
  transports: [
    new BufferedLogTransport(
      new JSONLogTransport(),
      100,   // Buffer 100 logs
      5000   // Flush every 5s
    )
  ],
  scrubSensitiveData: true,
})

// Health monitoring with strict thresholds
export const productionHealthMonitor = new HealthMonitorRegistry({
  windowMs: 300000,  // 5 minute window
  thresholds: {
    minSuccessRate: 0.99,     // 99%
    maxP99Latency: 5000,      // 5 seconds
    maxErrorRate: 0.01,       // 1%
  },
})

// Telemetry with sampling
export const productionTelemetry = new TelemetryManager({
  enabled: true,
  sampleRate: 0.1,  // Sample 10% of requests
  hooks: [
    // Send to monitoring service
    async (event) => {
      await fetch('/api/telemetry', {
        method: 'POST',
        body: JSON.stringify(event),
      })
    }
  ],
})
```

### Development Configuration

```typescript
// Verbose console logging
export const devLogger = new Logger({
  level: LogLevel.DEBUG,
  transports: [new ConsoleLogTransport()],
  scrubSensitiveData: false,  // See all data in dev
})

// Relaxed health thresholds
export const devHealthMonitor = new HealthMonitorRegistry({
  windowMs: 60000,  // 1 minute window
  thresholds: {
    minSuccessRate: 0.90,     // 90%
    maxP99Latency: 15000,     // 15 seconds
    maxErrorRate: 0.10,       // 10%
  },
})

// Full telemetry
export const devTelemetry = new TelemetryManager({
  enabled: true,
  sampleRate: 1.0,  // Log everything
  hooks: [
    (event) => console.log('Telemetry:', event)
  ],
})
```

## Monitoring Dashboards

### Grafana Dashboard

Example Grafana dashboard queries using Prometheus metrics:

```promql
# Success rate by provider
rate(adapter_requests_total{status="success"}[5m])
  /
rate(adapter_requests_total[5m])

# p95 latency by provider
adapter_request_duration_ms{quantile="0.95"}

# Error rate by provider
rate(adapter_errors_total[5m])

# Token usage by provider
rate(adapter_tokens_total[5m])

# Cost per minute by provider
rate(adapter_cost_total[5m]) * 60

# Circuit breaker state (0=closed, 1=open, 2=half_open)
circuit_breaker_state

# Provider health score (0-100)
provider_health_score
```

### DataDog Integration

```typescript
import { globalTelemetry } from '@clarity-chat/react'
import { datadogLogs } from '@datadog/browser-logs'

globalTelemetry.addHook((event) => {
  datadogLogs.logger.info(event.type, {
    provider: event.provider,
    correlationId: event.correlationId,
    ...event.data,
  })
})
```

### New Relic Integration

```typescript
import { globalTelemetry } from '@clarity-chat/react'
import newrelic from 'newrelic'

globalTelemetry.addHook((event) => {
  newrelic.recordCustomEvent('AdapterEvent', {
    eventType: event.type,
    provider: event.provider,
    correlationId: event.correlationId,
    ...event.data,
  })
})
```

## Best Practices

### 1. Use Correlation IDs

Always track requests with correlation IDs for distributed tracing:

```typescript
import { createCorrelationId } from '@clarity-chat/react'

async function handleRequest(req, res) {
  const correlationId = req.headers['x-correlation-id'] || createCorrelationId()
  const logger = globalLogger.setCorrelationId(correlationId)

  // All logs will include correlationId
  logger.info('Processing request')
}
```

### 2. Log Structured Data

Use metadata for structured logging:

```typescript
// ❌ Bad
logger.info('Request to OpenAI with gpt-4o took 250ms')

// ✅ Good
logger.info('Request completed', {
  provider: 'openai',
  model: 'gpt-4o',
  latencyMs: 250,
})
```

### 3. Set Appropriate Log Levels

```typescript
// Development
const logger = new Logger({ level: LogLevel.DEBUG })

// Production
const logger = new Logger({ level: LogLevel.INFO })
```

### 4. Monitor Critical Metrics

Track these key metrics:
- Success rate > 95%
- P95 latency < 5s
- Error rate < 5%
- Cost per request

### 5. Alert on Anomalies

```typescript
// Alert if success rate drops
const metrics = monitor.getMetrics()
if (metrics.successRate < 0.95) {
  sendAlert('Low success rate', metrics)
}

// Alert if p95 latency spikes
if (metrics.latency.p95 > 5000) {
  sendAlert('High latency', metrics)
}
```

### 6. Use Sampling in Production

Reduce overhead with sampling:

```typescript
const telemetry = new TelemetryManager({
  sampleRate: 0.1,  // 10% sampling
})
```

### 7. Buffer Logs for Performance

```typescript
const logger = new Logger({
  transports: [
    new BufferedLogTransport(
      new JSONLogTransport(),
      100,   // Batch size
      5000   // Flush interval
    )
  ],
})
```

## Performance Impact

### Logging
- **Console logging**: ~0.1-0.5ms per log
- **JSON logging**: ~0.05-0.2ms per log
- **Buffered logging**: ~0.01ms per log (amortized)

### Monitoring
- **Record success/failure**: ~0.1ms
- **Get metrics**: ~1-2ms
- **Memory**: ~100 bytes per request record

### Telemetry
- **Emit event**: ~0.1-0.5ms per event
- **With sampling (10%)**: ~0.01-0.05ms amortized

### Total Overhead
- Without sampling: ~1-3ms per request
- With sampling (10%): ~0.3-1ms per request
- With buffering: ~0.5-2ms per request

## Troubleshooting

### Problem: Too Many Logs

**Solution**: Increase log level or use sampling

```typescript
const logger = new Logger({ level: LogLevel.WARN })
const telemetry = new TelemetryManager({ sampleRate: 0.01 })
```

### Problem: High Memory Usage

**Solution**: Reduce monitoring window or max records

```typescript
const monitor = new HealthMonitor('openai', {
  windowMs: 30000,     // 30 seconds instead of 60
  maxRecords: 1000,    // 1k instead of 10k
})
```

### Problem: Slow Metrics Export

**Solution**: Cache exported metrics

```typescript
let cachedMetrics: string | null = null
let cacheTime = 0
const CACHE_TTL = 5000 // 5 seconds

app.get('/metrics', (req, res) => {
  const now = Date.now()
  if (!cachedMetrics || now - cacheTime > CACHE_TTL) {
    cachedMetrics = exportPrometheusText()
    cacheTime = now
  }
  res.send(cachedMetrics)
})
```

## Related Documentation

- [Model Adapter Audit Report](./ADAPTER_AUDIT_REPORT.md)
- [Reliability Features](./RELIABILITY_FEATURES.md)
- [Model Adapter API Reference](../apps/docs/content/vitepress-migration/api/model-adapters.md)

---

**Last Updated:** January 21, 2026
**Version:** 1.0.0
**Author:** Senior Software Engineer - AI Infrastructure
