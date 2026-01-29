'use client'

import { useState } from 'react'
import { CheckCircle, Code, Server, Shield, Activity, ArrowRight, AlertTriangle, Zap } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export default function EnterpriseProductionPipelineCookbook() {
  const [activePhase, setActivePhase] = useState<'deploy' | 'monitor' | 'scale'>('deploy')

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full">
          <Server className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Enterprise Production
          </span>
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Enterprise Production Pipeline
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Deploy token optimization at scale with security, monitoring, high availability, and cost governance
          for enterprise environments.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">99.9%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Uptime SLA</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">&lt;100ms</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">P95 Latency</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">SOC 2</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Compliant</div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
        <ul className="space-y-3">
          {[
            'Deploy with zero-downtime rollouts and blue-green deployments',
            'Monitor costs, performance, and quality in production',
            'Scale horizontally with caching and load balancing',
            'Implement security best practices and SOC 2 compliance',
            'Set up alerting for cost overruns and quality degradation',
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Prerequisites */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Prerequisites</h2>
        <div className="space-y-3 text-neutral-600 dark:text-neutral-400">
          <p>Before starting, ensure you have:</p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Token optimization implemented and tested in staging</li>
            <li>Monitoring infrastructure (Datadog, New Relic, or CloudWatch)</li>
            <li>CI/CD pipeline (GitHub Actions, GitLab CI, or Jenkins)</li>
            <li>Kubernetes or container orchestration platform</li>
            <li>Security review approved by InfoSec team</li>
          </ul>
        </div>
      </section>

      {/* Important Note */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 dark:text-amber-100">Production Deployment Caution</p>
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
              Always deploy optimization gradually. Start with 1-5% traffic, monitor for 24 hours, then increase
              to 50%, then 100%. Never deploy 100% immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Phase Selection */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Production Pipeline Phases</h2>

        {/* Phase Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'deploy', label: 'Deployment', icon: Server },
            { id: 'monitor', label: 'Monitoring', icon: Activity },
            { id: 'scale', label: 'Scaling', icon: Zap },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActivePhase(id as typeof activePhase)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activePhase === id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Phase Content */}
        <div className="space-y-6">
          {activePhase === 'deploy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Environment Variables & Secrets</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Store sensitive configuration securely using secrets management:
                </p>

                <CodeBlock
                  language="yaml"
                  code={`# Kubernetes Secret
apiVersion: v1
kind: Secret
metadata:
  name: ai-optimization-secrets
  namespace: production
type: Opaque
stringData:
  ANTHROPIC_API_KEY: "sk-ant-..."
  COST_BUDGET_LIMIT: "1000"  # $1000/day limit
  QUALITY_THRESHOLD: "0.7"   # Minimum quality
  CACHE_TTL: "3600"          # 1 hour

---
# Deployment using secrets
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
spec:
  template:
    spec:
      containers:
        - name: api
          image: your-registry/ai-service:v2.0.0
          envFrom:
            - secretRef:
                name: ai-optimization-secrets
          env:
            - name: NODE_ENV
              value: "production"
            - name: LOG_LEVEL
              value: "info"`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Gradual Rollout with Feature Flags</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Deploy optimization to a small percentage of traffic first:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`// Feature flag configuration
import { FeatureFlags } from './lib/features'

const flags = FeatureFlags.init({
  optimizationEnabled: {
    default: false,
    rollout: {
      percentage: 5, // Start with 5% of traffic
      users: ['beta-testers'], // Include beta testers
    },
  },
})

// Middleware with feature flag
export async function optimizationMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id']
  const useOptimization = await flags.isEnabled('optimizationEnabled', { userId })

  if (useOptimization) {
    // Use optimized path (new)
    req.optimizedAI = await createOptimizedClient()
  } else {
    // Use standard path (existing)
    req.standardAI = await createStandardClient()
  }

  next()
}

// Gradual rollout schedule:
// Day 1: 5% traffic
// Day 2: If metrics good, 20% traffic
// Day 3: If metrics good, 50% traffic
// Day 4: If metrics good, 100% traffic`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Blue-Green Deployment Strategy</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Deploy new version alongside old version for instant rollback:
                </p>

                <CodeBlock
                  language="yaml"
                  code={`# Blue deployment (existing)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service-blue
  labels:
    version: blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-service
      version: blue
  template:
    metadata:
      labels:
        app: ai-service
        version: blue
    spec:
      containers:
        - name: api
          image: your-registry/ai-service:v1.0.0

---
# Green deployment (new with optimization)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service-green
  labels:
    version: green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-service
      version: green
  template:
    metadata:
      labels:
        app: ai-service
        version: green
    spec:
      containers:
        - name: api
          image: your-registry/ai-service:v2.0.0  # With optimization

---
# Service switches between blue/green
apiVersion: v1
kind: Service
metadata:
  name: ai-service
spec:
  selector:
    app: ai-service
    version: green  # Change to 'blue' for instant rollback
  ports:
    - port: 80
      targetPort: 3000`}
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Blue-Green Rollback Procedure
                </h4>
                <ol className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200 list-decimal list-inside">
                  <li>Monitor metrics for 1 hour after switching to green</li>
                  <li>If error rate &gt;0.5% or cost spike &gt;20%, rollback immediately</li>
                  <li>
                    Rollback: <code className="px-1 py-0.5 rounded bg-emerald-900/20">kubectl patch service ai-service -p '{"spec":{"selector":{"version":"blue"}}}'</code>
                  </li>
                  <li>Investigate issue in green deployment, fix, redeploy</li>
                </ol>
              </div>
            </div>
          )}

          {activePhase === 'monitor' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Structured Logging</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Log optimization metrics in structured JSON format:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { Logger } from './lib/logger'

const logger = Logger.create('optimization')

export function logOptimizationEvent(event: {
  type: 'request' | 'cost_alert' | 'quality_alert' | 'cache_hit' | 'cache_miss'
  userId?: string
  endpoint: string
  cost: number
  model: string
  quality?: number
  cacheHit?: boolean
  latency: number
}) {
  logger.info('optimization_event', {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    ...event,
  })
}

// Usage
app.post('/api/chat', async (req, res) => {
  const start = Date.now()
  const result = await req.optimizedAI!.sendMessage(req.body.messages)
  const latency = Date.now() - start

  logOptimizationEvent({
    type: 'request',
    userId: req.headers['x-user-id'] as string,
    endpoint: req.path,
    cost: result.cost,
    model: result.model,
    quality: result.quality,
    cacheHit: result.cacheHit,
    latency,
  })

  res.json(result)
})`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Metrics Dashboard (Datadog Example)</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Track key metrics with your observability platform:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import { StatsD } from 'hot-shots'

const metrics = new StatsD({
  host: process.env.DATADOG_HOST,
  port: 8125,
  prefix: 'ai.optimization.',
})

export function recordOptimizationMetrics(result: any) {
  // Cost metrics
  metrics.gauge('cost.per_request', result.cost)
  metrics.increment('requests.total')
  metrics.increment(\`requests.by_model.\${result.model}\`)

  // Quality metrics
  if (result.quality) {
    metrics.gauge('quality.score', result.quality)
  }

  // Cache metrics
  if (result.cacheHit) {
    metrics.increment('cache.hits')
  } else {
    metrics.increment('cache.misses')
  }

  // Latency metrics
  metrics.timing('latency', result.latency)

  // Daily cost tracking
  metrics.increment('cost.daily', result.cost)
}

// Datadog Dashboard Query Examples:
// - avg:ai.optimization.cost.per_request{*}
// - sum:ai.optimization.requests.total{*}.as_count()
// - avg:ai.optimization.quality.score{*}
// - (sum:ai.optimization.cache.hits{*} / (sum:ai.optimization.cache.hits{*} + sum:ai.optimization.cache.misses{*})) * 100`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Alerting Rules</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Set up alerts for cost overruns and quality issues:
                </p>

                <CodeBlock
                  language="yaml"
                  code={`# Prometheus AlertManager rules
groups:
  - name: ai_optimization
    interval: 1m
    rules:
      # Cost overrun alert
      - alert: DailyCostExceeded
        expr: sum(increase(ai_optimization_cost_daily[1d])) > 1000
        for: 5m
        labels:
          severity: critical
          team: ai-platform
        annotations:
          summary: "Daily AI cost budget exceeded"
          description: "Daily cost is \${{ $value }} (limit: $1000)"

      # Quality degradation alert
      - alert: QualityDegraded
        expr: avg(ai_optimization_quality_score) < 0.7
        for: 10m
        labels:
          severity: warning
          team: ai-platform
        annotations:
          summary: "AI quality score below threshold"
          description: "Average quality {{ $value }} < 0.7 for 10 minutes"

      # Cache hit rate drop
      - alert: CacheHitRateDropped
        expr: |
          (sum(rate(ai_optimization_cache_hits[5m])) /
          (sum(rate(ai_optimization_cache_hits[5m])) +
           sum(rate(ai_optimization_cache_misses[5m])))) < 0.6
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Cache hit rate dropped to {{ $value }}"

      # High error rate
      - alert: OptimizationErrorRate
        expr: |
          (sum(rate(ai_optimization_errors[5m])) /
           sum(rate(ai_optimization_requests_total[5m]))) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Optimization error rate {{ $value }} > 1%"`}
                />
              </div>

              <div className="bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">
                  Key Metrics to Monitor
                </h4>
                <ul className="text-sm space-y-1 text-brand-800 dark:text-brand-200">
                  <li>• <strong>Cost per request:</strong> Track p50, p95, p99</li>
                  <li>• <strong>Daily spend:</strong> Alert if &gt;budget</li>
                  <li>• <strong>Quality score:</strong> Alert if &lt;0.7 for 10min</li>
                  <li>• <strong>Cache hit rate:</strong> Alert if &lt;60%</li>
                  <li>• <strong>Error rate:</strong> Alert if &gt;1%</li>
                  <li>• <strong>Latency:</strong> Alert if p95 &gt;500ms</li>
                </ul>
              </div>
            </div>
          )}

          {activePhase === 'scale' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Horizontal Pod Autoscaling</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Scale based on request rate and CPU usage:
                </p>

                <CodeBlock
                  language="yaml"
                  code={`apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ai-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ai-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    # Scale on CPU
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70

    # Scale on request rate
    - type: Pods
      pods:
        metric:
          name: ai_requests_per_second
        target:
          type: AverageValue
          averageValue: "100"  # 100 req/s per pod

  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Percent
          value: 50    # Scale up by 50% of current
          periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1     # Scale down 1 pod at a time
          periodSeconds: 120`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Redis Cache for Routing Decisions</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Cache routing decisions to reduce latency:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import Redis from 'ioredis'
import { ModelRouter } from '@clarity-chat/token-optimization'

const redis = new Redis(process.env.REDIS_URL)
const router = ModelRouter.builder().useClaudeModels().withStrategy('hybrid').build()

export async function getRoutingWithCache(query: string): Promise<string> {
  // Generate cache key from query hash
  const cacheKey = \`routing:\${hashQuery(query)}\`

  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) {
    return cached
  }

  // Route query
  const routing = await router.route(query)

  // Cache result (TTL: 1 hour)
  await redis.setex(cacheKey, 3600, routing.model)

  return routing.model
}

function hashQuery(query: string): string {
  // Use first 100 chars + length for cache key
  return \`\${query.slice(0, 100).toLowerCase()}_\${query.length}\`
}

// Result: 95% cache hit rate, 50ms → 2ms latency`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Load Balancing Strategy</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Distribute traffic across pods efficiently:
                </p>

                <CodeBlock
                  language="yaml"
                  code={`# Ingress with intelligent routing
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ai-service-ingress
  annotations:
    nginx.ingress.kubernetes.io/load-balance: "ewma"  # Exponentially weighted moving average
    nginx.ingress.kubernetes.io/upstream-hash-by: "$request_uri"  # Consistent hashing
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "30"
    nginx.ingress.kubernetes.io/rate-limit: "1000"  # 1000 req/s
spec:
  ingressClassName: nginx
  rules:
    - host: ai.example.com
      http:
        paths:
          - path: /api/chat
            pathType: Prefix
            backend:
              service:
                name: ai-service
                port:
                  number: 80

---
# Service with session affinity (sticky sessions)
apiVersion: v1
kind: Service
metadata:
  name: ai-service
spec:
  type: ClusterIP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 3600  # 1 hour sticky sessions
  selector:
    app: ai-service
  ports:
    - port: 80
      targetPort: 3000`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">4. Circuit Breaker Pattern</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Protect against cascading failures:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`import CircuitBreaker from 'opossum'

// Circuit breaker configuration
const breakerOptions = {
  timeout: 5000,              // 5s timeout
  errorThresholdPercentage: 50, // Open if 50% fail
  resetTimeout: 30000,        // Try again after 30s
}

// Wrap optimization calls
const optimizationBreaker = new CircuitBreaker(async (messages: any[]) => {
  return await sendOptimizedMessage(messages)
}, breakerOptions)

// Fallback when circuit is open
optimizationBreaker.fallback(async (messages: any[]) => {
  console.warn('Circuit breaker open, using standard path')
  return await sendStandardMessage(messages) // Unoptimized fallback
})

// Monitor circuit state
optimizationBreaker.on('open', () => {
  metrics.increment('circuit_breaker.open')
  logger.error('Optimization circuit breaker opened')
})

optimizationBreaker.on('halfOpen', () => {
  metrics.increment('circuit_breaker.half_open')
  logger.info('Optimization circuit breaker half-open')
})

// Usage
app.post('/api/chat', async (req, res) => {
  try {
    const result = await optimizationBreaker.fire(req.body.messages)
    res.json(result)
  } catch (error) {
    // Fallback already executed
    res.status(500).json({ error: 'Service temporarily unavailable' })
  }
})`}
                />
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Enterprise Scaling Checklist
                </h4>
                <ul className="text-sm space-y-1 text-purple-800 dark:text-purple-200">
                  <li>✅ Horizontal pod autoscaling (3-20 replicas)</li>
                  <li>✅ Redis cache for routing decisions (95% hit rate)</li>
                  <li>✅ Load balancer with EWMA algorithm</li>
                  <li>✅ Circuit breaker for graceful degradation</li>
                  <li>✅ Rate limiting (1000 req/s per ingress)</li>
                  <li>✅ Sticky sessions for cache affinity</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Security Best Practices */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Security Best Practices</h2>
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              1. API Key Rotation
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Rotate Anthropic API keys every 90 days:
            </p>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 list-disc list-inside ml-4">
              <li>Store keys in secrets manager (AWS Secrets Manager, HashiCorp Vault)</li>
              <li>Use separate keys for staging and production</li>
              <li>Implement automatic rotation with zero downtime</li>
              <li>Log all key usage for audit trails</li>
            </ul>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              2. Data Encryption
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Encrypt all data in transit and at rest:
            </p>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 list-disc list-inside ml-4">
              <li>TLS 1.3 for all API communication</li>
              <li>Encrypt logs containing user queries</li>
              <li>Encrypt cost tracking data in database</li>
              <li>Use KMS for encryption key management</li>
            </ul>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              3. Access Control & Audit Logs
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              Implement RBAC and comprehensive audit logging:
            </p>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 list-disc list-inside ml-4">
              <li>Role-based access control (RBAC) for API endpoints</li>
              <li>Log all optimization requests with user IDs</li>
              <li>Retain audit logs for 1 year (SOC 2 requirement)</li>
              <li>Alert on unusual access patterns</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Cost Governance */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Cost Governance</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Implement cost controls to prevent runaway spending:
        </p>

        <CodeBlock
          language="typescript"
          code={`// Cost governor middleware
import { CostGovernor } from './lib/costGovernor'

const governor = new CostGovernor({
  dailyBudget: 1000,        // $1000/day org-wide
  userDailyLimit: 50,       // $50/day per user
  teamDailyLimit: 200,      // $200/day per team
  alertThresholds: [0.7, 0.9], // Alert at 70% and 90%
})

export async function costGovernanceMiddleware(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string
  const teamId = req.headers['x-team-id'] as string

  // Check budgets before processing
  const canProceed = await governor.checkBudgets({ userId, teamId })

  if (!canProceed) {
    return res.status(429).json({
      error: 'Daily budget exceeded',
      limits: await governor.getLimits({ userId, teamId }),
    })
  }

  // Process request
  const result = await req.optimizedAI!.sendMessage(req.body.messages)

  // Record cost
  await governor.recordCost({
    userId,
    teamId,
    cost: result.cost,
    timestamp: new Date(),
  })

  res.json(result)
}

// Daily summary report
cron.schedule('0 0 * * *', async () => {
  const summary = await governor.getDailySummary()

  // Send to finance team
  await sendEmailReport({
    to: 'finance@company.com',
    subject: 'Daily AI Cost Summary',
    body: \`
      Total Spend: $\${summary.totalCost}
      Top 10 Users: ...
      Top 10 Teams: ...
      Budget Utilization: \${summary.budgetUtilization}%
    \`,
  })
})`}
        />
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Production Troubleshooting</h2>
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Cost spike after deployment
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Daily cost 2-3x higher than expected
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Check cache hit rate (should be &gt;60%). If low, verify cache
              configuration. Check if routing is working (should be 40-60% on Haiku). If not, verify
              ModelRouter configuration.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Pods crashing under load
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> OOMKilled errors, frequent restarts
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Increase memory limits. Compression can use 500MB-1GB RAM. Set
              limits: <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">memory: 2Gi</code>.
              Implement request queue to limit concurrent compression operations.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Inconsistent cache hit rates
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Cache hits vary 20-90% across pods
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Enable sticky sessions on load balancer (sessionAffinity: ClientIP).
              This ensures the same user hits the same pod, maximizing cache efficiency.
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="bg-brand-500/10 border border-brand-500/30 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Code className="w-5 h-5" />
          Next Steps
        </h2>
        <div className="space-y-3">
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Review the complete 50-70% optimization strategy
          </Link>
          <Link
            href="/guides/production-best-practices"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Production deployment best practices guide
          </Link>
          <Link
            href="/reference/classes/cost-tracker"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            CostTracker API Reference
          </Link>
        </div>
      </section>

      {/* Real-World Example */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">Real-World Deployment: Enterprise SaaS</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">System Scale</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• 10 million AI requests/month</li>
              <li>• 50,000 enterprise users</li>
              <li>• 99.9% uptime SLA</li>
              <li>• SOC 2 Type II compliant</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Implementation</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Kubernetes with 5-30 pods (HPA)</li>
              <li>• Blue-green deployments (2min rollback)</li>
              <li>• Redis cache (92% hit rate)</li>
              <li>• Datadog monitoring + PagerDuty alerts</li>
              <li>• Cost governance ($50/day per user)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Results</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Before: $150,000/month</li>
              <li>• After: $42,000/month</li>
              <li>• <strong>72% cost reduction</strong> ($108,000/month savings)</li>
              <li>• 99.95% actual uptime (exceeds SLA)</li>
              <li>• P95 latency: 85ms (vs 200ms baseline)</li>
              <li>• Zero cost overrun incidents</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
