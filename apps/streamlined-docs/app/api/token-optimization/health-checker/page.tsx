import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HealthChecker | Token Optimization API',
  description:
    'Comprehensive health monitoring for token optimization systems with component-level health status, liveness/readiness probes, and performance metrics.',
}

export default function HealthCheckerPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-bold mb-4">HealthChecker</h1>
        <p className="text-xl text-muted-foreground">
          Production-ready health monitoring system with component-level health tracking,
          liveness/readiness probes, and comprehensive performance metrics for token optimization
          systems.
        </p>
      </header>

      {/* Overview */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          The <code>HealthChecker</code> provides comprehensive health monitoring for the token
          optimization system, tracking the health of individual components (tokenizer, cache,
          security, compression) and providing aggregate system health with degradation detection.
        </p>
        <div className="bg-muted p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold">Key Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Component-level health status tracking (tokenizer, cache, security, compression)</li>
            <li>Aggregate system health with automatic degradation detection</li>
            <li>Performance metrics collection (latency, error rates, throughput)</li>
            <li>Kubernetes-compatible liveness and readiness probes</li>
            <li>Configurable thresholds for warning and critical states</li>
            <li>P95/P99 latency tracking and cache hit rate monitoring</li>
            <li>HTTP endpoint handlers for easy integration</li>
          </ul>
        </div>
      </section>

      {/* Import */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Import</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`import {
  HealthChecker,
  createHealthEndpoint,
  createLivenessCheck,
  createReadinessCheck,
  type HealthStatus,
  type ComponentHealth,
  type HealthMetrics,
  type HealthCheckerConfig,
} from '@clarity-chat/token-optimization'`}
          </code>
        </pre>
      </section>

      {/* Health Status States */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Health Status States</h2>
        <p className="mb-6">
          The health checker tracks three distinct states for both individual components and overall
          system health:
        </p>

        <div className="space-y-6">
          {/* Healthy */}
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <h3 className="text-xl font-semibold">Healthy</h3>
            </div>
            <p className="mb-4">
              All components are operating within normal parameters. No action required.
            </p>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Criteria:</strong> Error rate &lt; 1%, Latency &lt; 100ms, All components
                operational
              </p>
            </div>
          </div>

          {/* Degraded */}
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <h3 className="text-xl font-semibold">Degraded</h3>
            </div>
            <p className="mb-4">
              System is functional but experiencing elevated latency or error rates. Monitor
              closely.
            </p>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Criteria:</strong> Error rate 1-5%, Latency 100-500ms, Partial degradation
              </p>
            </div>
          </div>

          {/* Unhealthy */}
          <div className="border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <h3 className="text-xl font-semibold">Unhealthy</h3>
            </div>
            <p className="mb-4">
              Critical issues detected. System may not be functioning correctly. Immediate
              attention required.
            </p>
            <div className="bg-muted/50 p-3 rounded">
              <p className="text-sm">
                <strong>Criteria:</strong> Error rate &gt; 5%, Latency &gt; 500ms, Critical
                failures
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Constructor */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Constructor</h2>
        <p className="mb-4">Create a new HealthChecker instance with optional configuration.</p>

        <div className="space-y-6">
          {/* Signature */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Signature</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`new HealthChecker(config?: HealthCheckerConfig)`}
              </code>
            </pre>
          </div>

          {/* Configuration */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Configuration Options</h3>
            <div className="border border-border rounded-lg p-4">
              <div className="space-y-4 text-sm">
                <div className="border-b border-border pb-3">
                  <code className="font-semibold">degradedLatencyThreshold?: number</code>
                  <p className="text-muted-foreground mt-1">
                    Latency threshold (ms) above which a component is considered degraded. Default:
                    100ms
                  </p>
                </div>
                <div className="border-b border-border pb-3">
                  <code className="font-semibold">unhealthyLatencyThreshold?: number</code>
                  <p className="text-muted-foreground mt-1">
                    Latency threshold (ms) above which a component is considered unhealthy. Default:
                    500ms
                  </p>
                </div>
                <div className="border-b border-border pb-3">
                  <code className="font-semibold">degradedErrorRateThreshold?: number</code>
                  <p className="text-muted-foreground mt-1">
                    Error rate (0-1) above which a component is considered degraded. Default: 0.01
                    (1%)
                  </p>
                </div>
                <div className="border-b border-border pb-3">
                  <code className="font-semibold">unhealthyErrorRateThreshold?: number</code>
                  <p className="text-muted-foreground mt-1">
                    Error rate (0-1) above which a component is considered unhealthy. Default: 0.05
                    (5%)
                  </p>
                </div>
                <div className="border-b border-border pb-3">
                  <code className="font-semibold">metricsSampleSize?: number</code>
                  <p className="text-muted-foreground mt-1">
                    Number of recent samples to keep for metrics calculation. Default: 1000
                  </p>
                </div>
                <div>
                  <code className="font-semibold">version?: string</code>
                  <p className="text-muted-foreground mt-1">
                    Version string for the package. Default: "1.0.0"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Methods */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Core Methods</h2>

        <div className="space-y-8">
          {/* check() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">check()</h3>
            <p className="mb-4">
              Performs a comprehensive health check of all components and returns the complete
              health status.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`async check(): Promise<HealthStatus>`}
              </code>
            </pre>
            <div className="bg-muted/50 p-4 rounded">
              <h4 className="font-semibold mb-2">Returns: HealthStatus</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="font-semibold">status</code>: Overall system health status
                  (healthy | degraded | unhealthy)
                </div>
                <div>
                  <code className="font-semibold">timestamp</code>: Timestamp when this health
                  check was performed
                </div>
                <div>
                  <code className="font-semibold">version</code>: Version of the token optimization
                  package
                </div>
                <div>
                  <code className="font-semibold">components</code>: Individual component health
                  statuses
                </div>
                <div>
                  <code className="font-semibold">metrics</code>: Aggregated system metrics
                </div>
              </div>
            </div>
          </div>

          {/* recordComponentRequest() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">recordComponentRequest()</h3>
            <p className="mb-4">Records a request for a specific component to track performance.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`recordComponentRequest(
  component: 'tokenizer' | 'cache' | 'security' | 'compression',
  latencyMs: number,
  success: boolean,
  errorMessage?: string
): void`}
              </code>
            </pre>
            <div className="space-y-3 text-sm">
              <div>
                <strong>component:</strong> Which component the request was for
              </div>
              <div>
                <strong>latencyMs:</strong> Request latency in milliseconds
              </div>
              <div>
                <strong>success:</strong> Whether the request was successful
              </div>
              <div>
                <strong>errorMessage:</strong> Optional error message if request failed
              </div>
            </div>
          </div>

          {/* recordCacheHit() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">recordCacheHit()</h3>
            <p className="mb-4">Records a cache hit or miss for tracking cache effectiveness.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`recordCacheHit(hit: boolean): void`}
              </code>
            </pre>
            <div className="text-sm">
              <strong>hit:</strong> true for cache hit, false for cache miss
            </div>
          </div>

          {/* getMetrics() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">getMetrics()</h3>
            <p className="mb-4">Gets current health metrics snapshot without full health check.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`getMetrics(): HealthMetrics`}
              </code>
            </pre>
            <div className="bg-muted/50 p-4 rounded">
              <h4 className="font-semibold mb-2">Returns: HealthMetrics</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <code className="font-semibold">uptimeMs</code>: Total uptime in milliseconds
                  since initialization
                </div>
                <div>
                  <code className="font-semibold">requestsTotal</code>: Total number of requests
                  processed
                </div>
                <div>
                  <code className="font-semibold">errorsTotal</code>: Total number of errors
                  encountered
                </div>
                <div>
                  <code className="font-semibold">cacheHitRate</code>: Cache hit rate as a decimal
                  (0.0 to 1.0)
                </div>
                <div>
                  <code className="font-semibold">avgLatencyMs</code>: Average latency in
                  milliseconds
                </div>
                <div>
                  <code className="font-semibold">p95LatencyMs</code>: P95 latency in milliseconds
                </div>
                <div>
                  <code className="font-semibold">p99LatencyMs</code>: P99 latency in milliseconds
                </div>
                <div>
                  <code className="font-semibold">requestsPerSecond</code>: Requests per second
                  (averaged over last minute)
                </div>
              </div>
            </div>
          </div>

          {/* reset() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">reset()</h3>
            <p className="mb-4">Resets all metrics and statistics.</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`reset(): void`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Health Endpoints */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Health Endpoints</h2>
        <p className="mb-6">
          The package provides helper functions to create HTTP endpoint handlers compatible with
          Kubernetes health probes and standard monitoring systems.
        </p>

        <div className="space-y-8">
          {/* createHealthEndpoint() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">createHealthEndpoint()</h3>
            <p className="mb-4">
              Creates a comprehensive health check endpoint handler that returns full health status.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`createHealthEndpoint(
  healthChecker: HealthChecker
): () => Promise<{ status: number; body: HealthStatus }>`}
              </code>
            </pre>
            <div className="bg-muted/50 p-4 rounded">
              <p className="text-sm mb-2">
                <strong>Returns HTTP Status:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>200: System is healthy or degraded</li>
                <li>503: System is unhealthy</li>
              </ul>
              <p className="text-sm mt-3">
                Note: Degraded state returns 200 to prevent unnecessary alerts in production.
              </p>
            </div>
          </div>

          {/* createLivenessCheck() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">createLivenessCheck()</h3>
            <p className="mb-4">
              Creates a simple liveness probe that always returns success if the process is running.
              Used by Kubernetes to determine if a pod should be restarted.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`createLivenessCheck(): () => {
  status: number;
  body: { alive: boolean };
}`}
              </code>
            </pre>
            <div className="bg-muted/50 p-4 rounded">
              <p className="text-sm">
                <strong>Returns:</strong> Always 200 with {"{ alive: true }"}
              </p>
            </div>
          </div>

          {/* createReadinessCheck() */}
          <div className="border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">createReadinessCheck()</h3>
            <p className="mb-4">
              Creates a readiness probe that checks if the system is ready to receive traffic. Used
              by Kubernetes to determine if a pod should receive requests.
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
              <code className="text-sm">
                {`createReadinessCheck(
  healthChecker: HealthChecker
): () => Promise<{
  status: number;
  body: { ready: boolean; reason?: string };
}>`}
              </code>
            </pre>
            <div className="bg-muted/50 p-4 rounded">
              <p className="text-sm mb-2">
                <strong>Returns HTTP Status:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>200: System is ready (healthy or degraded)</li>
                <li>503: System is not ready (unhealthy)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Usage Examples</h2>

        <div className="space-y-6">
          {/* Basic Usage */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Basic Usage</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { HealthChecker } from '@clarity-chat/token-optimization'

const healthChecker = new HealthChecker({
  version: '2.0.0',
  degradedLatencyThreshold: 100,
  unhealthyLatencyThreshold: 500,
})

// Record operations
healthChecker.recordComponentRequest('tokenizer', 45, true)
healthChecker.recordComponentRequest('cache', 12, true)
healthChecker.recordCacheHit(true)

// Get health status
const status = await healthChecker.check()
console.log(\`System status: \${status.status}\`)
console.log(\`Cache hit rate: \${status.metrics.cacheHitRate}\`)`}
              </code>
            </pre>
          </div>

          {/* Express Integration */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Express.js Integration</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import express from 'express'
import {
  HealthChecker,
  createHealthEndpoint,
  createLivenessCheck,
  createReadinessCheck,
} from '@clarity-chat/token-optimization'

const app = express()
const healthChecker = new HealthChecker()

// Create endpoint handlers
const healthHandler = createHealthEndpoint(healthChecker)
const livenessHandler = createLivenessCheck()
const readinessHandler = createReadinessCheck(healthChecker)

// Health endpoint (comprehensive)
app.get('/health', async (req, res) => {
  const { status, body } = await healthHandler()
  res.status(status).json(body)
})

// Liveness probe (Kubernetes)
app.get('/health/live', (req, res) => {
  const { status, body } = livenessHandler()
  res.status(status).json(body)
})

// Readiness probe (Kubernetes)
app.get('/health/ready', async (req, res) => {
  const { status, body } = await readinessHandler()
  res.status(status).json(body)
})

app.listen(3000)`}
              </code>
            </pre>
          </div>

          {/* Next.js Route Handler */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Next.js Route Handler</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`// app/api/health/route.ts
import { NextResponse } from 'next/server'
import {
  HealthChecker,
  createHealthEndpoint,
} from '@clarity-chat/token-optimization'

// Create a singleton health checker
const healthChecker = new HealthChecker({ version: '1.0.0' })
const healthHandler = createHealthEndpoint(healthChecker)

export async function GET() {
  const { status, body } = await healthHandler()
  return NextResponse.json(body, { status })
}

// Record operations from your API routes
export function recordOperation(
  component: 'tokenizer' | 'cache' | 'security' | 'compression',
  latencyMs: number,
  success: boolean
) {
  healthChecker.recordComponentRequest(component, latencyMs, success)
}`}
              </code>
            </pre>
          </div>

          {/* Monitoring Integration */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Production Monitoring</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">
                {`import { HealthChecker } from '@clarity-chat/token-optimization'

const healthChecker = new HealthChecker({
  degradedLatencyThreshold: 100,
  unhealthyLatencyThreshold: 500,
  degradedErrorRateThreshold: 0.01,
  unhealthyErrorRateThreshold: 0.05,
})

// Wrap your operations with timing
async function processTokens(text: string) {
  const start = Date.now()
  try {
    const result = await tokenizer.encode(text)
    const latency = Date.now() - start
    healthChecker.recordComponentRequest('tokenizer', latency, true)
    return result
  } catch (error) {
    const latency = Date.now() - start
    healthChecker.recordComponentRequest(
      'tokenizer',
      latency,
      false,
      error.message
    )
    throw error
  }
}

// Periodic health check
setInterval(async () => {
  const health = await healthChecker.check()

  if (health.status === 'unhealthy') {
    console.error('System unhealthy!', health)
    // Send alerts
  } else if (health.status === 'degraded') {
    console.warn('System degraded', health)
  }

  // Export metrics to monitoring system
  exportMetrics(health.metrics)
}, 30000) // Check every 30 seconds`}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Kubernetes Configuration */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Kubernetes Configuration</h2>
        <p className="mb-4">
          Example Kubernetes deployment configuration with liveness and readiness probes:
        </p>

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`apiVersion: apps/v1
kind: Deployment
metadata:
  name: token-optimization-service
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: your-app:latest
        ports:
        - containerPort: 3000

        # Liveness probe - restart if failing
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3

        # Readiness probe - remove from service if failing
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2`}
          </code>
        </pre>
      </section>

      {/* Best Practices */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Use a singleton instance</h3>
            <p className="text-sm text-muted-foreground">
              Create one HealthChecker instance per process and reuse it across all health checks
              to maintain consistent metrics.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Record all operations</h3>
            <p className="text-sm text-muted-foreground">
              Wrap all token optimization operations with timing and record results to get accurate
              health metrics.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Set appropriate thresholds</h3>
            <p className="text-sm text-muted-foreground">
              Tune degraded and unhealthy thresholds based on your SLOs. Start with defaults (100ms
              degraded, 500ms unhealthy) and adjust.
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold mb-2">Monitor cache effectiveness</h3>
            <p className="text-sm text-muted-foreground">
              Record cache hits and misses to track cache effectiveness. Low cache hit rates may
              indicate configuration issues.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Use separate liveness and readiness probes</h3>
            <p className="text-sm text-muted-foreground">
              Liveness checks should be simple (just alive), while readiness checks can be more
              comprehensive. This prevents cascading failures.
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Export metrics to monitoring systems</h3>
            <p className="text-sm text-muted-foreground">
              Integrate with Prometheus, DataDog, or other monitoring systems by exporting metrics
              periodically.
            </p>
          </div>
        </div>
      </section>

      {/* Component Health Details */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Component Health Details</h2>
        <p className="mb-6">
          The HealthChecker tracks health for four core components of the token optimization
          system:
        </p>

        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Tokenizer</h3>
            <p className="text-sm text-muted-foreground">
              Tracks token encoding/decoding operations. Monitor for slow tokenization or encoding
              failures.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Cache</h3>
            <p className="text-sm text-muted-foreground">
              Monitors cache hit rates and cache operation latency. Low hit rates may indicate
              cache size issues.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-muted-foreground">
              Tracks security validation operations. High error rates may indicate malicious input
              attempts.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Compression</h3>
            <p className="text-sm text-muted-foreground">
              Monitors compression operations. Watch for increased latency or compression failures.
            </p>
          </div>
        </div>
      </section>

      {/* Related APIs */}
      <section>
        <h2 className="text-3xl font-semibold mb-4">Related APIs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/api/token-optimization/model-pricing"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ModelPricing</h3>
            <p className="text-sm text-muted-foreground">
              Cost tracking and budget management for token usage
            </p>
          </a>
          <a
            href="/api/token-optimization/security"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Security</h3>
            <p className="text-sm text-muted-foreground">
              Input validation and security checks for token optimization
            </p>
          </a>
          <a
            href="/api/token-optimization/adaptive-compressor"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">AdaptiveCompressor</h3>
            <p className="text-sm text-muted-foreground">
              Intelligent compression with automatic strategy selection
            </p>
          </a>
          <a
            href="/api/token-optimization"
            className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Token Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Main token optimization API documentation
            </p>
          </a>
        </div>
      </section>
    </div>
  )
}
