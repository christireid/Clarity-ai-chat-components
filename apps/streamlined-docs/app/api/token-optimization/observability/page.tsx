'use client'

/**
 * Observability System Documentation
 *
 * Documents the Logger, MetricsCollector, and Tracer classes for monitoring
 * token optimization operations.
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Clock,
  Code,
  Database,
  Eye,
  Gauge,
  GitBranch,
  Info,
  Lightbulb,
  LineChart,
  PlayCircle,
  Settings,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CollapsibleSection } from '@/components/CollapsibleSection/CollapsibleSection'
import { EnhancedCopyButton } from '@/components/Enhanced/EnhancedCopyButton'
import { durations } from '@/lib/animations'
import Link from 'next/link'

interface CodeExample {
  title: string
  description: string
  code: string
}

const codeExamples: CodeExample[] = [
  {
    title: 'Basic Logger Setup',
    description: 'Initialize the logger with structured logging and custom handlers.',
    code: `import { Logger, LogLevel } from '@clarity-chat/token-optimization'

// Create logger with defaults
const logger = new Logger({
  logLevel: LogLevel.INFO,
  structuredLogging: true,
  serviceName: 'my-app',
  environment: 'production',
})

// Use logger
logger.info('Processing tokens', { count: 1500, model: 'gpt-4' })
logger.error('Compression failed', new Error('Quality threshold not met'))

// Create child logger with additional context
const requestLogger = logger.child({ requestId: 'req-123' })
requestLogger.debug('Starting compression', { inputSize: 5000 })`,
  },
  {
    title: 'Custom Log Handler',
    description: 'Integrate with external logging services like DataDog or New Relic.',
    code: `import { Logger, LogHandler, LogEntry } from '@clarity-chat/token-optimization'

// Custom handler for DataDog
class DataDogHandler implements LogHandler {
  async log(entry: LogEntry): Promise<void> {
    await fetch('https://http-intake.logs.datadoghq.com/v1/input', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'DD-API-KEY': process.env.DATADOG_API_KEY,
      },
      body: JSON.stringify({
        ddsource: 'nodejs',
        service: entry.service,
        hostname: process.env.HOSTNAME,
        message: entry.message,
        level: entry.level,
        timestamp: entry.timestamp,
        ...entry.metadata,
      }),
    })
  }
}

// Use custom handler
const logger = new Logger({
  logLevel: 'info',
  logHandler: new DataDogHandler(),
})`,
  },
  {
    title: 'Metrics Collection',
    description: 'Track token usage, cache performance, and operation latency.',
    code: `import { MetricsCollector } from '@clarity-chat/token-optimization'

// Create metrics collector
const metrics = new MetricsCollector({
  metricsEnabled: true,
  serviceName: 'token-optimization',
})

// Track token usage
metrics.incrementTokensProcessed(1500, 'gpt-4')

// Track cache performance
metrics.incrementCacheHit()
metrics.incrementCacheMiss()

// Record operation latency
const start = Date.now()
// ... perform compression
const duration = Date.now() - start
metrics.recordLatency('compression', duration)

// Record compression ratio
metrics.recordCompressionRatio(0.65) // 65% compression

// Get snapshot
const snapshot = metrics.getSnapshot()
console.log('Cache hit rate:', metrics.getCacheHitRate())
console.log('Total tokens:', snapshot.tokensProcessed)`,
  },
  {
    title: 'Custom Metrics Handler',
    description: 'Send metrics to external monitoring systems like Prometheus or CloudWatch.',
    code: `import { MetricsHandler } from '@clarity-chat/token-optimization'

// Prometheus metrics handler
class PrometheusHandler implements MetricsHandler {
  private counters = new Map<string, number>()
  private gauges = new Map<string, number>()

  increment(name: string, value = 1, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags)
    const current = this.counters.get(key) || 0
    this.counters.set(key, current + value)
  }

  gauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags)
    this.gauges.set(key, value)
  }

  histogram(name: string, value: number, tags?: Record<string, string>): void {
    // Record histogram value
    this.increment(\`\${name}_count\`, 1, tags)
    this.increment(\`\${name}_sum\`, value, tags)
  }

  timing(name: string, durationMs: number, tags?: Record<string, string>): void {
    this.histogram(name, durationMs, tags)
  }

  private buildKey(name: string, tags?: Record<string, string>): string {
    if (!tags) return name
    const tagStr = Object.entries(tags)
      .map(([k, v]) => \`\${k}="\${v}"\`)
      .join(',')
    return \`\${name}{\${tagStr}}\`
  }

  // Export metrics in Prometheus format
  export(): string {
    let output = ''

    for (const [key, value] of this.counters) {
      output += \`\${key} \${value}\\n\`
    }

    for (const [key, value] of this.gauges) {
      output += \`\${key} \${value}\\n\`
    }

    return output
  }
}

// Use with MetricsCollector
const handler = new PrometheusHandler()
const metrics = new MetricsCollector({
  metricsEnabled: true,
  metricsHandler: handler,
})`,
  },
  {
    title: 'Distributed Tracing',
    description: 'Track operations across distributed systems with OpenTelemetry-compatible spans.',
    code: `import { Tracer } from '@clarity-chat/token-optimization'

// Create tracer
const tracer = new Tracer({
  tracingEnabled: true,
  serviceName: 'token-optimization',
})

// Manual span management
const span = tracer.startSpan('compress_text')
span.setAttribute('inputTokens', 5000)
span.setAttribute('compressionType', 'semantic')

try {
  // ... perform compression
  span.setAttribute('outputTokens', 1250)
  span.setAttribute('compressionRatio', 0.75)
  span.setStatus('ok')
} catch (error) {
  span.setStatus('error')
  span.recordException(error)
  throw error
} finally {
  span.end()
}

// Automatic tracing with helper
const result = await tracer.trace('optimize_prompt', async (span) => {
  span.setAttribute('model', 'gpt-4')

  const optimized = await optimizePrompt(text)

  span.setAttribute('savings', optimized.savings)
  return optimized
})`,
  },
  {
    title: 'OpenTelemetry Integration',
    description: 'Integrate with OpenTelemetry for advanced distributed tracing.',
    code: `import { Tracer, TraceHandler, Span } from '@clarity-chat/token-optimization'
import { trace, context, SpanStatusCode } from '@opentelemetry/api'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { JaegerExporter } from '@opentelemetry/exporter-jaeger'

// Setup OpenTelemetry
const provider = new NodeTracerProvider()
provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://localhost:14268/api/traces',
    })
  )
)
provider.register()

// Custom trace handler
class OpenTelemetryHandler implements TraceHandler {
  private tracer = trace.getTracer('token-optimization')

  startSpan(name: string, context?: Record<string, unknown>): Span {
    const otelSpan = this.tracer.startSpan(name, {
      attributes: context,
    })

    return {
      end: () => otelSpan.end(),
      setStatus: (status) => {
        otelSpan.setStatus({
          code: status === 'ok'
            ? SpanStatusCode.OK
            : SpanStatusCode.ERROR,
        })
      },
      setAttribute: (key, value) => {
        otelSpan.setAttribute(key, value)
      },
      recordException: (error) => {
        otelSpan.recordException(error)
      },
      getSpanId: () => otelSpan.spanContext().spanId,
      getTraceId: () => otelSpan.spanContext().traceId,
    }
  }
}

// Use with Tracer
const tracer = new Tracer({
  tracingEnabled: true,
  traceHandler: new OpenTelemetryHandler(),
})`,
  },
  {
    title: 'Complete Observability Setup',
    description: 'Initialize all observability components together.',
    code: `import {
  createObservability,
  LogLevel
} from '@clarity-chat/token-optimization'

// Create all observability instances
const { logger, metrics, tracer } = createObservability({
  logLevel: LogLevel.INFO,
  structuredLogging: true,
  metricsEnabled: true,
  tracingEnabled: true,
  serviceName: 'my-token-optimizer',
  environment: process.env.NODE_ENV,
})

// Use together
async function processDocument(doc: Document) {
  const span = tracer.startSpan('process_document')

  try {
    logger.info('Processing document', {
      docId: doc.id,
      size: doc.content.length
    })

    const start = Date.now()
    const result = await compressContent(doc.content)
    const duration = Date.now() - start

    metrics.recordLatency('document_processing', duration)
    metrics.incrementTokensProcessed(result.tokens, 'gpt-4')
    metrics.recordCompressionRatio(result.ratio)

    span.setAttribute('tokens', result.tokens)
    span.setAttribute('ratio', result.ratio)
    span.setStatus('ok')

    logger.info('Document processed', {
      docId: doc.id,
      tokens: result.tokens,
      duration,
    })

    return result
  } catch (error) {
    logger.error('Document processing failed', error, { docId: doc.id })
    span.setStatus('error')
    throw error
  } finally {
    span.end()
  }
}`,
  },
  {
    title: 'Production Monitoring Example',
    description: 'Real-world example with DataDog and custom alerting.',
    code: `import {
  Logger,
  MetricsCollector,
  Tracer,
  LogHandler,
  MetricsHandler,
} from '@clarity-chat/token-optimization'

// DataDog integration
class DataDogMetrics implements MetricsHandler {
  increment(name: string, value = 1, tags?: Record<string, string>) {
    // Send to DataDog StatsD
    statsd.increment(\`token_optimization.\${name}\`, value, tags)
  }

  gauge(name: string, value: number, tags?: Record<string, string>) {
    statsd.gauge(\`token_optimization.\${name}\`, value, tags)
  }

  histogram(name: string, value: number, tags?: Record<string, string>) {
    statsd.histogram(\`token_optimization.\${name}\`, value, tags)
  }

  timing(name: string, durationMs: number, tags?: Record<string, string>) {
    statsd.timing(\`token_optimization.\${name}\`, durationMs, tags)
  }
}

// Setup observability
const logger = new Logger({
  logLevel: 'info',
  serviceName: 'token-optimizer',
  environment: 'production',
})

const metrics = new MetricsCollector({
  metricsEnabled: true,
  metricsHandler: new DataDogMetrics(),
})

const tracer = new Tracer({
  tracingEnabled: true,
  // Use APM service trace handler
})

// Monitor cache performance
setInterval(() => {
  const snapshot = metrics.getSnapshot()
  const hitRate = metrics.getCacheHitRate()

  // Alert if hit rate drops below 70%
  if (hitRate < 0.7) {
    logger.warn('Low cache hit rate', {
      hitRate,
      cacheHits: snapshot.cacheHits,
      cacheMisses: snapshot.cacheMisses,
    })
  }

  // Send gauge metric
  metrics.gauge('cache_hit_rate', hitRate)
}, 60000) // Check every minute`,
  },
]

const features = [
  {
    icon: Activity,
    title: 'Structured Logging',
    description:
      'Log messages with structured context, correlation IDs, and automatic sensitive data scrubbing.',
    benefits: [
      'JSON or human-readable formats',
      'Configurable log levels (debug, info, warn, error)',
      'Child loggers with inherited context',
      'Custom log handlers for external services',
    ],
  },
  {
    icon: BarChart3,
    title: 'Metrics Collection',
    description:
      'Track token usage, cache performance, compression ratios, and operation latency.',
    benefits: [
      'Counter, gauge, and histogram metrics',
      'Built-in token and cache metrics',
      'Snapshot API for current state',
      'Integration with Prometheus, DataDog, CloudWatch',
    ],
  },
  {
    icon: GitBranch,
    title: 'Distributed Tracing',
    description:
      'Trace operations across systems with OpenTelemetry-compatible spans.',
    benefits: [
      'Manual and automatic span management',
      'Span attributes and status tracking',
      'Exception recording',
      'Integration with Jaeger, Zipkin, APM services',
    ],
  },
]

const integrations = [
  {
    name: 'DataDog',
    type: 'Logs & Metrics',
    setup: 'Custom handler with DD HTTP API',
  },
  {
    name: 'New Relic',
    type: 'Logs & Traces',
    setup: 'Custom handler with NR Telemetry SDK',
  },
  {
    name: 'Prometheus',
    type: 'Metrics',
    setup: 'Custom metrics handler with /metrics endpoint',
  },
  {
    name: 'OpenTelemetry',
    type: 'Traces',
    setup: 'Custom trace handler with OTEL SDK',
  },
  {
    name: 'CloudWatch',
    type: 'Logs & Metrics',
    setup: 'Custom handler with AWS SDK',
  },
  {
    name: 'Jaeger',
    type: 'Traces',
    setup: 'OpenTelemetry exporter',
  },
]

const bestPractices = [
  {
    icon: CheckCircle2,
    title: 'Use Child Loggers',
    description:
      'Create child loggers with request-specific context instead of passing context to every log call.',
  },
  {
    icon: Gauge,
    title: 'Set Appropriate Log Levels',
    description:
      'Use DEBUG for development, INFO for production. Avoid excessive logging in hot paths.',
  },
  {
    icon: Clock,
    title: 'Record Latency for All Operations',
    description:
      'Track timing metrics for compression, caching, and API calls to identify bottlenecks.',
  },
  {
    icon: Database,
    title: 'Monitor Cache Hit Rate',
    description:
      'Alert when cache hit rate drops below 70% to catch configuration issues early.',
  },
  {
    icon: LineChart,
    title: 'Aggregate Metrics Periodically',
    description:
      'Use getSnapshot() to send aggregate metrics every minute instead of per-operation.',
  },
  {
    icon: Eye,
    title: 'Trace High-Value Operations',
    description:
      'Use distributed tracing for complex workflows, not every function call.',
  },
]

export default function ObservabilityPage() {
  const [openSections, setOpenSections] = React.useState<string[]>([
    'overview',
    'logger',
    'metrics',
    'tracer',
  ])

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: durations.moderate,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              <Activity className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted-foreground">
              Token Optimization
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            Observability System
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Monitor token optimization operations with structured logging,
            metrics collection, and distributed tracing. Integrates with
            DataDog, New Relic, Prometheus, OpenTelemetry, and more.
          </p>
        </motion.header>

        {/* Features Overview */}
        <CollapsibleSection
          id="overview"
          title="Core Components"
          icon={<Settings className="w-5 h-5" />}
          defaultOpen={openSections.includes('overview')}
          onToggle={() => toggleSection('overview')}
        >
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.moderate,
                  delay: index * 0.1,
                }}
                className="rounded-lg border border-border/50 bg-card p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Logger Documentation */}
        <CollapsibleSection
          id="logger"
          title="Logger Class"
          icon={<Code className="w-5 h-5" />}
          defaultOpen={openSections.includes('logger')}
          onToggle={() => toggleSection('logger')}
        >
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                The Logger class provides structured logging with configurable
                output handlers and support for both human-readable and JSON
                formats. It includes automatic sensitive data scrubbing and
                correlation ID support for request tracing.
              </p>
            </div>

            {/* API Reference */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4">
                Constructor Options
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <code className="text-purple-600 dark:text-purple-400">
                    logLevel
                  </code>
                  <span className="text-muted-foreground ml-2">
                    - Minimum log level (debug, info, warn, error)
                  </span>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400">
                    structuredLogging
                  </code>
                  <span className="text-muted-foreground ml-2">
                    - Output JSON format (default: true)
                  </span>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400">
                    logHandler
                  </code>
                  <span className="text-muted-foreground ml-2">
                    - Custom log handler for external services
                  </span>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400">
                    serviceName
                  </code>
                  <span className="text-muted-foreground ml-2">
                    - Service identifier for logs
                  </span>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400">
                    environment
                  </code>
                  <span className="text-muted-foreground ml-2">
                    - Environment name (production, staging, etc.)
                  </span>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4">Methods</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    debug(message, context?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Log a debug message with optional context
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    info(message, context?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Log an info message with optional context
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    warn(message, context?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Log a warning message with optional context
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    error(message, error?, context?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Log an error with optional Error object and context
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    child(context)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Create a child logger with inherited context
                  </p>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            {codeExamples
              .filter((ex) =>
                [
                  'Basic Logger Setup',
                  'Custom Log Handler',
                ].includes(ex.title)
              )
              .map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold text-foreground">
                      {example.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                  <div className="relative">
                    <pre className="rounded-lg border border-border/50 bg-muted/50 p-4 overflow-x-auto">
                      <code className="text-sm font-mono">{example.code}</code>
                    </pre>
                    <div className="absolute top-2 right-2">
                      <EnhancedCopyButton text={example.code} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CollapsibleSection>

        {/* MetricsCollector Documentation */}
        <CollapsibleSection
          id="metrics"
          title="MetricsCollector Class"
          icon={<BarChart3 className="w-5 h-5" />}
          defaultOpen={openSections.includes('metrics')}
          onToggle={() => toggleSection('metrics')}
        >
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                The MetricsCollector class collects and aggregates metrics about
                token processing, caching, and compression operations. It
                supports custom metrics handlers for integration with external
                monitoring systems.
              </p>
            </div>

            {/* Built-in Metrics */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4">
                Built-in Metrics
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Counters</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• tokens_processed</li>
                    <li>• cache_hits</li>
                    <li>• cache_misses</li>
                    <li>• custom counters</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Histograms</span>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• operation latencies</li>
                    <li>• compression ratios</li>
                    <li>• custom histograms</li>
                    <li>• timing metrics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4">Methods</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    incrementTokensProcessed(count, model?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Track tokens processed by model
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    incrementCacheHit()
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Record a cache hit event
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    incrementCacheMiss()
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Record a cache miss event
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    recordLatency(operation, latencyMs)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Track operation timing in milliseconds
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    recordCompressionRatio(ratio)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Track compression effectiveness (0.0-1.0)
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    increment(name, value?, tags?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Custom counter metric
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    gauge(name, value, tags?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Set a gauge value
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    getSnapshot()
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Get current metrics snapshot
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    getCacheHitRate()
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Calculate cache hit rate (0.0-1.0)
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    reset()
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Reset all collected metrics
                  </p>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            {codeExamples
              .filter((ex) =>
                [
                  'Metrics Collection',
                  'Custom Metrics Handler',
                ].includes(ex.title)
              )
              .map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold text-foreground">
                      {example.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                  <div className="relative">
                    <pre className="rounded-lg border border-border/50 bg-muted/50 p-4 overflow-x-auto">
                      <code className="text-sm font-mono">{example.code}</code>
                    </pre>
                    <div className="absolute top-2 right-2">
                      <EnhancedCopyButton text={example.code} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CollapsibleSection>

        {/* Tracer Documentation */}
        <CollapsibleSection
          id="tracer"
          title="Tracer Class"
          icon={<GitBranch className="w-5 h-5" />}
          defaultOpen={openSections.includes('tracer')}
          onToggle={() => toggleSection('tracer')}
        >
          <div className="space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                The Tracer class provides span-based distributed tracing for
                tracking operations across systems. Compatible with
                OpenTelemetry and integrates with Jaeger, Zipkin, and APM
                services.
              </p>
            </div>

            {/* Span Lifecycle */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4">
                Span Lifecycle
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Start Span</div>
                    <div className="text-muted-foreground">
                      Call startSpan(name, context) to begin tracking
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Add Attributes</div>
                    <div className="text-muted-foreground">
                      Use setAttribute() to record operation details
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Set Status</div>
                    <div className="text-muted-foreground">
                      Call setStatus('ok') or setStatus('error')
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono flex-shrink-0">
                    4
                  </div>
                  <div>
                    <div className="font-medium">End Span</div>
                    <div className="text-muted-foreground">
                      Call end() to complete and send the span
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="rounded-lg border border-border/50 bg-card p-6">
              <h4 className="font-semibold text-foreground mb-4">Methods</h4>
              <div className="space-y-4 text-sm">
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    startSpan(name, context?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Start a new span with optional initial context
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    trace(name, fn, context?)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Automatically wrap an async function with tracing
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    span.setAttribute(key, value)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Add metadata to the current span
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    span.setStatus('ok' | 'error')
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Mark the span as successful or failed
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    span.recordException(error)
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Attach error details to the span
                  </p>
                </div>
                <div>
                  <code className="text-purple-600 dark:text-purple-400 font-mono">
                    span.end()
                  </code>
                  <p className="text-muted-foreground mt-1">
                    Complete and send the span
                  </p>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            {codeExamples
              .filter((ex) =>
                [
                  'Distributed Tracing',
                  'OpenTelemetry Integration',
                ].includes(ex.title)
              )
              .map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold text-foreground">
                      {example.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                  <div className="relative">
                    <pre className="rounded-lg border border-border/50 bg-muted/50 p-4 overflow-x-auto">
                      <code className="text-sm font-mono">{example.code}</code>
                    </pre>
                    <div className="absolute top-2 right-2">
                      <EnhancedCopyButton text={example.code} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CollapsibleSection>

        {/* Complete Examples */}
        <CollapsibleSection
          id="examples"
          title="Complete Examples"
          icon={<Zap className="w-5 h-5" />}
          defaultOpen={false}
          onToggle={() => toggleSection('examples')}
        >
          <div className="space-y-6">
            {codeExamples
              .filter((ex) =>
                [
                  'Complete Observability Setup',
                  'Production Monitoring Example',
                ].includes(ex.title)
              )
              .map((example, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold text-foreground">
                      {example.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {example.description}
                  </p>
                  <div className="relative">
                    <pre className="rounded-lg border border-border/50 bg-muted/50 p-4 overflow-x-auto">
                      <code className="text-sm font-mono">{example.code}</code>
                    </pre>
                    <div className="absolute top-2 right-2">
                      <EnhancedCopyButton text={example.code} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CollapsibleSection>

        {/* Integrations */}
        <CollapsibleSection
          id="integrations"
          title="Service Integrations"
          icon={<Database className="w-5 h-5" />}
          defaultOpen={false}
          onToggle={() => toggleSection('integrations')}
        >
          <div className="space-y-6">
            <p className="text-muted-foreground">
              The observability system integrates with popular monitoring and
              APM services through custom handlers.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/50 bg-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground">
                      {integration.name}
                    </h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      {integration.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {integration.setup}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {/* Best Practices */}
        <CollapsibleSection
          id="best-practices"
          title="Best Practices"
          icon={<Lightbulb className="w-5 h-5" />}
          defaultOpen={false}
          onToggle={() => toggleSection('best-practices')}
        >
          <div className="grid gap-4 md:grid-cols-2">
            {bestPractices.map((practice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: durations.moderate,
                  delay: index * 0.05,
                }}
                className="rounded-lg border border-border/50 bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex-shrink-0">
                    <practice.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {practice.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {practice.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Related Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: durations.moderate, delay: 0.3 }}
          className="mt-12 rounded-lg border border-border/50 bg-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-foreground">
              Related Documentation
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/guides/token-optimization"
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-brand-500/30 hover:bg-muted/50 transition-all"
            >
              <span className="text-sm font-medium">Token Optimization Guide</span>
              <Zap className="w-4 h-4 text-muted-foreground" />
            </Link>
            <Link
              href="/api/token-optimization/security"
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-brand-500/30 hover:bg-muted/50 transition-all"
            >
              <span className="text-sm font-medium">Security Dashboard</span>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
