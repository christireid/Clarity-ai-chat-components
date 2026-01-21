# OpenTelemetry Integration

**Week 6** - Observability through traces, metrics, and logs for all token optimization operations.

## Overview

The OpenTelemetry integration provides comprehensive observability for your token optimization operations. Track performance, monitor costs in real-time, and debug issues with distributed tracing.

### Key Features

- **Distributed Tracing**: Track token counting, optimization, and caching operations
- **Metrics Collection**: Counters, gauges, and histograms for performance monitoring
- **Error Tracking**: Automatic error recording with stack traces
- **Sampling**: Configure sample rates to control overhead
- **Multiple Exporters**: Console, OTLP, and custom exporters
- **React Hooks**: Easy integration with React applications
- **Performance Monitoring**: Built-in percentile calculations (P50, P95, P99)

### Benefits

- **Visibility**: See exactly what's happening in your token optimization pipeline
- **Performance**: Identify bottlenecks and optimize hot paths
- **Debugging**: Quick error diagnosis with detailed traces
- **Cost Tracking**: Monitor token usage and costs in real-time
- **Analytics**: Gather data for optimization decisions

## Quick Start

### Basic Usage

```typescript
import { TelemetryCollector } from '@clarity-chat/token-optimization'

// Create collector
const collector = new TelemetryCollector({
  serviceName: 'my-app',
  enableTracing: true,
  enableMetrics: true,
})

// Start operation
const spanId = collector.startSpan('token_optimization', {
  model: 'gpt-4o',
  operation: 'count',
})

try {
  // Your operation
  const tokens = countTokens(text)

  // Record metrics
  collector.incrementCounter('tokensCounted')
  collector.recordMetric('tokenCountDurations', duration)

  // End span
  collector.endSpan(spanId, { tokens })
} catch (error) {
  collector.recordError(spanId, error)
  collector.endSpan(spanId)
  throw error
}
```

### React Hook Usage

```tsx
import { useTelemetry } from '@clarity-chat/token-optimization'

function MyComponent() {
  const {
    metrics,
    recentSpans,
    startSpan,
    endSpan,
    recordMetric,
    incrementCounter,
  } = useTelemetry({
    serviceName: 'my-app',
    enableTracing: true,
    enableMetrics: true,
    autoExportInterval: 5000, // Update UI every 5s
  })

  const handleOptimization = async () => {
    const spanId = startSpan('optimization')

    try {
      await optimize(text)
      incrementCounter('optimizationsPerformed')
      endSpan(spanId)
    } catch (error) {
      recordError(spanId, error)
      endSpan(spanId)
    }
  }

  return (
    <div>
      <p>Tokens Counted: {metrics.tokensCounted}</p>
      <p>Cache Hits: {metrics.cacheHits}</p>
      <p>Errors: {metrics.errorsEncountered}</p>
    </div>
  )
}
```

## API Reference

### TelemetryCollector

Core telemetry collector for spans and metrics.

#### Constructor

```typescript
new TelemetryCollector(config: TelemetryConfig)
```

**Config Options:**

```typescript
interface TelemetryConfig {
  serviceName: string           // Service identifier
  enableTracing?: boolean        // Enable span tracking (default: true)
  enableMetrics?: boolean        // Enable metrics collection (default: true)
  sampleRate?: number           // Sample rate 0-1 (default: 1.0)
  exportInterval?: number       // Export interval in ms (default: 60000)
  attributes?: Record<string, any> // Custom attributes for all spans
}
```

#### Methods

##### startSpan

Start a new operation span.

```typescript
startSpan(name: string, attributes?: Record<string, any>): string
```

**Example:**
```typescript
const spanId = collector.startSpan('token_count', {
  model: 'gpt-4o',
  textLength: text.length,
})
```

##### endSpan

End a span and record its completion.

```typescript
endSpan(spanId: string, attributes?: Record<string, any>): void
```

**Example:**
```typescript
collector.endSpan(spanId, {
  tokens: 150,
  duration: 12,
})
```

##### recordError

Record an error in a span.

```typescript
recordError(spanId: string, error: Error): void
```

**Example:**
```typescript
try {
  // Operation
} catch (error) {
  collector.recordError(spanId, error)
  collector.endSpan(spanId)
}
```

##### addEvent

Add an event to a span (for sub-operations).

```typescript
addEvent(spanId: string, name: string, attributes?: Record<string, any>): void
```

**Example:**
```typescript
collector.addEvent(spanId, 'cache_check', { hit: false })
collector.addEvent(spanId, 'optimization_start')
collector.addEvent(spanId, 'optimization_complete', { tokensSaved: 50 })
```

##### recordMetric

Record a metric value.

```typescript
recordMetric(name: keyof TelemetryMetrics, value: number): void
```

**Example:**
```typescript
collector.recordMetric('currentTokens', 1000)
collector.recordMetric('tokenCountDurations', 15) // Histogram
```

##### incrementCounter

Increment a counter metric.

```typescript
incrementCounter(name: keyof TelemetryMetrics, delta?: number): void
```

**Example:**
```typescript
collector.incrementCounter('tokensCounted')
collector.incrementCounter('cacheHits', 1)
```

##### getMetrics

Get current metrics snapshot.

```typescript
getMetrics(): TelemetryMetrics
```

##### getSpans

Get all collected spans.

```typescript
getSpans(): TelemetrySpan[]
```

##### export

Export and clear all data.

```typescript
export(): { spans: TelemetrySpan[]; metrics: TelemetryMetrics }
```

##### clear

Clear all collected data.

```typescript
clear(): void
```

### TelemetryMetrics

Available metrics for tracking.

```typescript
interface TelemetryMetrics {
  // Counter metrics
  tokensCounted: number              // Total tokens counted
  optimizationsPerformed: number     // Total optimizations
  cacheHits: number                  // Cache hit count
  cacheMisses: number                // Cache miss count
  errorsEncountered: number          // Error count

  // Gauge metrics
  currentTokens: number              // Current token count
  currentCost: number                // Current cost ($)
  cacheSize: number                  // Cache size (entries)

  // Histogram metrics (arrays)
  tokenCountDurations: number[]      // Token counting durations (ms)
  optimizationDurations: number[]    // Optimization durations (ms)
  costCalculationDurations: number[] // Cost calculation durations (ms)
}
```

### Instrumentation Helpers

#### instrumentTokenCount

Wrap a token counting function with automatic telemetry.

```typescript
instrumentTokenCount<T extends (...args: any[]) => any>(
  fn: T,
  collector: TelemetryCollector,
  spanName?: string
): T
```

**Example:**
```typescript
const countTokens = (text: string) => {
  // Token counting logic
  return tokens
}

const instrumented = instrumentTokenCount(
  countTokens,
  collector,
  'custom_token_count'
)

const tokens = instrumented(text) // Automatically traced
```

#### instrumentOptimization

Wrap an async optimization function with automatic telemetry.

```typescript
instrumentOptimization<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  collector: TelemetryCollector,
  spanName?: string
): T
```

**Example:**
```typescript
const optimize = async (text: string) => {
  // Optimization logic
  return { optimized: result, tokensSaved: 50 }
}

const instrumented = instrumentOptimization(
  optimize,
  collector,
  'text_optimization'
)

const result = await instrumented(text) // Automatically traced
```

#### withTelemetry

Generic wrapper for any function.

```typescript
withTelemetry<T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    collector?: TelemetryCollector
    spanName?: string
    type?: 'sync' | 'async'
  }
): T
```

**Example:**
```typescript
const myFunction = async (data: string) => {
  // Your logic
  return result
}

const traced = withTelemetry(myFunction, {
  collector,
  spanName: 'my_operation',
  type: 'async',
})
```

### React Hooks

#### useTelemetry

Comprehensive telemetry hook with full features.

```typescript
function useTelemetry(config: UseTelemetryConfig): {
  metrics: TelemetryMetrics
  recentSpans: TelemetrySpan[]
  enabled: boolean
  totalSpans: number
  startSpan: (name: string, attributes?: Record<string, any>) => string
  endSpan: (spanId: string, attributes?: Record<string, any>) => void
  recordError: (spanId: string, error: Error) => void
  addEvent: (spanId: string, name: string, attributes?: Record<string, any>) => void
  recordMetric: (name: keyof TelemetryMetrics, value: number) => void
  incrementCounter: (name: keyof TelemetryMetrics, delta?: number) => void
  getMetrics: () => TelemetryMetrics
  getSpans: () => TelemetrySpan[]
  exportData: () => { spans: TelemetrySpan[]; metrics: TelemetryMetrics }
  clear: () => void
}
```

**Config:**
```typescript
interface UseTelemetryConfig {
  serviceName: string
  enableTracing?: boolean
  enableMetrics?: boolean
  sampleRate?: number
  exportInterval?: number
  attributes?: Record<string, any>
  autoExportInterval?: number      // UI update interval
  enableConsoleExporter?: boolean  // Enable console logging
}
```

#### useTelemetryMetrics

Simplified hook for metrics only (no tracing).

```typescript
function useTelemetryMetrics(config: {
  serviceName: string
  attributes?: Record<string, any>
}): {
  metrics: TelemetryMetrics
  recordMetric: (name: keyof TelemetryMetrics, value: number) => void
  incrementCounter: (name: keyof TelemetryMetrics, delta?: number) => void
  reset: () => void
}
```

**Example:**
```tsx
function MetricsDisplay() {
  const { metrics, incrementCounter } = useTelemetryMetrics({
    serviceName: 'my-app',
  })

  const handleCacheHit = () => {
    incrementCounter('cacheHits')
  }

  return (
    <div>
      <p>Cache Hits: {metrics.cacheHits}</p>
      <p>Cache Misses: {metrics.cacheMisses}</p>
      <p>Hit Rate: {(metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses) * 100).toFixed(1)}%</p>
    </div>
  )
}
```

#### usePerformanceMonitor

Track operation performance with percentile calculations.

```typescript
function usePerformanceMonitor(): {
  track: <T>(operationName: string, operation: () => Promise<T>) => Promise<T>
  stats: {
    p50: number  // 50th percentile (median)
    p95: number  // 95th percentile
    p99: number  // 99th percentile
    avg: number  // Average
    min: number  // Minimum
    max: number  // Maximum
  }
  durations: number[]
  reset: () => void
}
```

**Example:**
```tsx
function PerformanceMonitor() {
  const { track, stats } = usePerformanceMonitor()

  const handleOperation = async () => {
    await track('optimization', async () => {
      // Your async operation
      await optimize(text)
    })
  }

  return (
    <div>
      <p>P50: {stats.p50.toFixed(1)}ms</p>
      <p>P95: {stats.p95.toFixed(1)}ms</p>
      <p>P99: {stats.p99.toFixed(1)}ms</p>
      <p>Average: {stats.avg.toFixed(1)}ms</p>
    </div>
  )
}
```

## Global Telemetry

For convenience, you can initialize a global telemetry instance.

```typescript
import { initTelemetry, getTelemetry } from '@clarity-chat/token-optimization'

// Initialize once at app startup
initTelemetry({
  serviceName: 'my-app',
  enableTracing: true,
  enableMetrics: true,
})

// Use anywhere in your app
const collector = getTelemetry()
if (collector) {
  const spanId = collector.startSpan('operation')
  // ...
}
```

## Exporters

### Console Exporter

Built-in console exporter for development.

```typescript
import { createConsoleExporter } from '@clarity-chat/token-optimization'

const collector = new TelemetryCollector({
  serviceName: 'my-app',
})

// Export to console every 60 seconds
const intervalId = createConsoleExporter(collector)

// Later: stop exporting
clearInterval(intervalId)
```

**Output:**
```
[Telemetry Export] {
  timestamp: '2024-01-15T10:30:00.000Z',
  spans: 15,
  metrics: {
    tokensCounted: 1,
    optimizationsPerformed: 3,
    cacheHits: 10,
    cacheMisses: 2,
    errorsEncountered: 0,
    currentTokens: 500,
    currentCost: 0.0025,
    cacheSize: 12,
    tokenCountDurations: [12, 15, 8, ...],
    optimizationDurations: [45, 38, 52],
    costCalculationDurations: [2, 1, 2]
  }
}
```

### Custom Exporters

Create custom exporters for your observability platform.

```typescript
function createCustomExporter(
  collector: TelemetryCollector,
  endpoint: string
) {
  return setInterval(() => {
    const data = collector.export()

    if (data.spans.length > 0) {
      // Send to your platform
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
    }
  }, 60000)
}

const exporter = createCustomExporter(
  collector,
  'https://your-platform.com/telemetry'
)
```

## Complete Examples

### Example 1: Token Optimization with Telemetry

```tsx
import {
  useTelemetry,
  useTokenOptimization,
} from '@clarity-chat/token-optimization'

function OptimizedChat() {
  const {
    metrics,
    startSpan,
    endSpan,
    incrementCounter,
  } = useTelemetry({
    serviceName: 'chat-app',
    enableTracing: true,
    enableMetrics: true,
    autoExportInterval: 5000,
  })

  const {
    optimize,
    stats,
  } = useTokenOptimization({
    preset: 'cost-optimized',
  })

  const handleMessage = async (message: string) => {
    const spanId = startSpan('message_processing', {
      messageLength: message.length,
    })

    try {
      // Optimize
      const result = await optimize(message)

      // Record metrics
      incrementCounter('optimizationsPerformed')
      incrementCounter('tokensCounted')

      // End span
      endSpan(spanId, {
        tokensOriginal: result.original.tokens,
        tokensOptimized: result.optimized.tokens,
        tokensSaved: result.savings.tokens,
      })

      return result
    } catch (error) {
      recordError(spanId, error)
      endSpan(spanId)
      throw error
    }
  }

  return (
    <div>
      <h2>Telemetry Dashboard</h2>
      <div>
        <p>Messages Processed: {metrics.optimizationsPerformed}</p>
        <p>Cache Hit Rate: {((metrics.cacheHits / (metrics.cacheHits + metrics.cacheMisses)) * 100).toFixed(1)}%</p>
        <p>Errors: {metrics.errorsEncountered}</p>
      </div>

      <h3>Performance</h3>
      <div>
        <p>Avg Token Count: {(metrics.tokenCountDurations.reduce((a, b) => a + b, 0) / metrics.tokenCountDurations.length).toFixed(1)}ms</p>
        <p>Avg Optimization: {(metrics.optimizationDurations.reduce((a, b) => a + b, 0) / metrics.optimizationDurations.length).toFixed(1)}ms</p>
      </div>
    </div>
  )
}
```

### Example 2: Performance Monitoring

```tsx
import { usePerformanceMonitor } from '@clarity-chat/token-optimization'

function PerformanceDashboard() {
  const { track, stats, reset } = usePerformanceMonitor()

  const handleOptimization = async (text: string) => {
    await track('full_optimization', async () => {
      // Your optimization pipeline
      const tokens = await countTokens(text)
      const compressed = await compress(text)
      const optimized = await optimize(compressed)
      return optimized
    })
  }

  return (
    <div>
      <h2>Performance Stats</h2>
      <table>
        <tr>
          <td>P50 (Median)</td>
          <td>{stats.p50.toFixed(1)}ms</td>
        </tr>
        <tr>
          <td>P95</td>
          <td>{stats.p95.toFixed(1)}ms</td>
        </tr>
        <tr>
          <td>P99</td>
          <td>{stats.p99.toFixed(1)}ms</td>
        </tr>
        <tr>
          <td>Average</td>
          <td>{stats.avg.toFixed(1)}ms</td>
        </tr>
        <tr>
          <td>Min</td>
          <td>{stats.min.toFixed(1)}ms</td>
        </tr>
        <tr>
          <td>Max</td>
          <td>{stats.max.toFixed(1)}ms</td>
        </tr>
      </table>

      <button onClick={reset}>Reset Stats</button>
    </div>
  )
}
```

### Example 3: Distributed Tracing

```tsx
import { useTelemetry } from '@clarity-chat/token-optimization'

function ComplexPipeline() {
  const { startSpan, endSpan, addEvent } = useTelemetry({
    serviceName: 'pipeline',
  })

  const processPipeline = async (input: string) => {
    // Main operation span
    const mainSpan = startSpan('pipeline_execution', {
      inputLength: input.length,
    })

    try {
      // Step 1: Validation
      addEvent(mainSpan, 'validation_start')
      const validationSpan = startSpan('validation')
      const validated = await validate(input)
      endSpan(validationSpan, { valid: validated.isValid })
      addEvent(mainSpan, 'validation_complete')

      // Step 2: Token counting
      addEvent(mainSpan, 'token_count_start')
      const countSpan = startSpan('token_counting')
      const tokens = await countTokens(validated.data)
      endSpan(countSpan, { tokens })
      addEvent(mainSpan, 'token_count_complete')

      // Step 3: Compression
      addEvent(mainSpan, 'compression_start')
      const compressSpan = startSpan('compression')
      const compressed = await compress(validated.data)
      endSpan(compressSpan, {
        originalSize: validated.data.length,
        compressedSize: compressed.length,
        ratio: compressed.length / validated.data.length,
      })
      addEvent(mainSpan, 'compression_complete')

      // Step 4: Optimization
      addEvent(mainSpan, 'optimization_start')
      const optSpan = startSpan('optimization')
      const optimized = await optimize(compressed)
      endSpan(optSpan, { tokensSaved: optimized.tokensSaved })
      addEvent(mainSpan, 'optimization_complete')

      // Complete main span
      endSpan(mainSpan, {
        success: true,
        finalTokens: optimized.tokens,
      })

      return optimized
    } catch (error) {
      recordError(mainSpan, error)
      endSpan(mainSpan)
      throw error
    }
  }

  return <div>...</div>
}
```

## Best Practices

### 1. Use Appropriate Sampling

For high-traffic applications, use sampling to reduce overhead:

```typescript
const collector = new TelemetryCollector({
  serviceName: 'high-traffic-app',
  sampleRate: 0.1, // Sample 10% of operations
})
```

### 2. Add Meaningful Attributes

Include context that helps with debugging:

```typescript
const spanId = collector.startSpan('optimization', {
  userId: user.id,
  model: 'gpt-4o',
  messageLength: message.length,
  cacheEnabled: true,
})
```

### 3. Record Errors Properly

Always record errors before ending spans:

```typescript
try {
  // Operation
} catch (error) {
  collector.recordError(spanId, error)
  collector.incrementCounter('errorsEncountered')
  collector.endSpan(spanId)
  throw error
}
```

### 4. Use Events for Sub-Operations

Break down complex operations with events:

```typescript
const spanId = collector.startSpan('complex_operation')

collector.addEvent(spanId, 'step1_start')
// Do step 1
collector.addEvent(spanId, 'step1_complete', { result: 'success' })

collector.addEvent(spanId, 'step2_start')
// Do step 2
collector.addEvent(spanId, 'step2_complete')

collector.endSpan(spanId)
```

### 5. Export Regularly

Set appropriate export intervals:

```typescript
const collector = new TelemetryCollector({
  serviceName: 'app',
  exportInterval: 30000, // Export every 30s
})
```

### 6. Clean Up Resources

Clear intervals when components unmount:

```typescript
useEffect(() => {
  const exporter = createConsoleExporter(collector)

  return () => {
    clearInterval(exporter)
  }
}, [])
```

## Performance Considerations

### Overhead

Telemetry has minimal overhead:
- Span creation: ~0.1ms
- Metric recording: ~0.01ms
- Event addition: ~0.05ms

### Memory Usage

- Each span: ~1KB
- Each metric: ~8 bytes (number) or ~array length × 8 bytes

### Recommendations

1. **Sample high-volume operations** (sampleRate < 1.0)
2. **Export regularly** to prevent memory buildup
3. **Limit histogram sizes** (keep last N values)
4. **Disable in production** if not needed

## Troubleshooting

### Spans not appearing

Check that tracing is enabled:
```typescript
const collector = new TelemetryCollector({
  serviceName: 'app',
  enableTracing: true, // Must be true
})
```

### Metrics not updating

Check that metrics are enabled:
```typescript
const collector = new TelemetryCollector({
  serviceName: 'app',
  enableMetrics: true, // Must be true
})
```

### Sample rate too aggressive

Increase sample rate for more coverage:
```typescript
const collector = new TelemetryCollector({
  serviceName: 'app',
  sampleRate: 1.0, // Sample everything
})
```

## What's Next?

- **Week 7**: Function Schema Optimization
- **Week 8**: Final Polish & QA

Continue to [Function Schema Optimization](./function-schema-optimization.md) →
