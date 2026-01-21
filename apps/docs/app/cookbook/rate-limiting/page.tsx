import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookbook: Enterprise Rate Limiting',
  description:
    'Advanced rate limiting with automatic queuing, retry logic, and seamless ClarityChat integration.',
}

export default function RateLimitingRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Enterprise Rate Limiting</h1>
        <p className="docs-lead">
          Advanced rate limiting with automatic request queuing, intelligent retry logic,
          and seamless integration with ClarityChat for production-ready AI applications.
        </p>
      </div>

      <section className="docs-section">
        <h2>Why Enterprise Rate Limiting Matters</h2>
        <ul>
          <li>🛡️ Protects against API abuse and runaway requests</li>
          <li>💸 Keeps AI API costs predictable and controlled</li>
          <li>⚖️ Ensures fair usage across users and applications</li>
          <li>🔄 Provides seamless user experience during rate limits</li>
          <li>📊 Offers real-time visibility into request queues</li>
          <li>🔧 Includes automatic retry logic with backoff</li>
        </ul>

        <Callout type="info" title="Built-in vs Custom">
          <p>
            For most applications, use ClarityChat's built-in rate limiting.
            Only implement custom solutions if you have very specific requirements.
          </p>
        </Callout>
      </section>

      <section className="docs-section">
        <h2>1. Basic Rate Limiting with ClarityChat</h2>
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Enable rate limiting with just one prop. ClarityChat automatically handles queuing,
          retries, and user feedback. Perfect for production applications.
        </p>

        <Callout type="tip" title="Queue Status Display">
          <p>
            Set <code>showQueueStatus=true</code> to display real-time queue information
            to users, improving transparency during rate limit scenarios.
          </p>
        </Callout>
      </section>

      <section className="docs-section">
        <h2>2. Advanced Configuration</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function AdvancedRateLimitedChat() {
  return (
    <ClarityChat
      api="/api/chat"
      enableRateLimiting={true}
      maxConcurrentRequests={5}    // Allow more concurrent requests
      maxQueueSize={20}            // Larger queue for high-traffic apps
      showQueueStatus={true}
      compactQueueStatus={false}   // Full queue status display
      onRateLimited={(resetTime) => {
        // Log to analytics
        analytics.track('rate_limit_exceeded', {
          resetTime,
          userId: currentUser.id
        })
      }}
      onRequestQueued={(position, waitMs) => {
        // Show user notification
        toast.info(\`Request queued. Position: \${position}, Wait: ~\${Math.round(waitMs/1000)}s\`)
      }}
      onQueueFull={() => {
        // Alert user that queue is full
        toast.error('Request queue is full. Please try again later.')
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Advanced configuration for high-traffic applications with comprehensive
          monitoring and user feedback.
        </p>
      </section>

      <section className="docs-section">
        <h2>3. Integration with Hooks</h2>
        <CodePlayground
          code={`import { useClarityChat } from '@clarity-chat/react'

function CustomChatWithRateLimiting() {
  const chat = useClarityChat({
    api: '/api/chat',
    enableRateLimiting: true,
    maxConcurrentRequests: 2,
    maxQueueSize: 8,
  })

  return (
    <div>
      {/* Queue status indicator */}
      {chat.isRateLimited && (
        <div className="bg-yellow-100 p-2 rounded">
          Rate limited. {chat.queueStatus?.queueLength || 0} requests queued.
        </div>
      )}

      {/* Custom chat UI */}
      <div className="messages">
        {chat.messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>

      {/* Custom input with rate limiting awareness */}
      <input
        disabled={chat.isRateLimited}
        placeholder={chat.isRateLimited ? "Rate limited..." : "Type a message..."}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !chat.isRateLimited) {
            chat.append({ role: 'user', content: e.target.value })
            e.target.value = ''
          }
        }}
      />
    </div>
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Use the lower-level hook for complete control over UI and rate limiting behavior.
        </p>
      </section>

      <section className="docs-section">
        <h2>4. Monitoring & Analytics</h2>
        <CodePlayground
          code={`import { ClarityChat } from '@clarity-chat/react'

function MonitoredChat() {
  const [rateLimitEvents, setRateLimitEvents] = useState([])

  return (
    <ClarityChat
      api="/api/chat"
      enableRateLimiting={true}
      onRateLimited={(resetTime) => {
        const event = {
          timestamp: Date.now(),
          resetTime,
          userAgent: navigator.userAgent,
          url: window.location.href
        }

        // Store for analytics
        setRateLimitEvents(prev => [...prev, event])

        // Send to monitoring service
        monitoring.track('rate_limit_exceeded', event)
      }}
      onRequestQueued={(position, waitMs) => {
        monitoring.track('request_queued', {
          position,
          estimatedWaitMs: waitMs,
          queueDepth: position
        })
      }}
      onQueueFull={() => {
        monitoring.track('queue_full', {
          timestamp: Date.now(),
          impact: 'user_blocked'
        })
      }}
    />
  )
}`}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Comprehensive monitoring and analytics for production rate limiting insights.
        </p>

        <Callout type="info" title="Rate Limiting Metrics">
          <p>Monitor these key metrics for optimal rate limiting performance:</p>
          <ul className="list-disc list-inside mt-2">
            <li><strong>Hit Rate</strong>: Percentage of requests that hit rate limits</li>
            <li><strong>Queue Depth</strong>: Average number of queued requests</li>
            <li><strong>Wait Times</strong>: Average time requests spend in queue</li>
            <li><strong>User Impact</strong>: How rate limiting affects user experience</li>
          </ul>
        </Callout>
      </section>

      <section className="docs-section">
        <h2>5. Best Practices</h2>

        <h3>Configuration Guidelines</h3>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>Start Conservative</strong>: Begin with lower limits (2-3 concurrent)
            and increase based on usage patterns
          </li>
          <li>
            <strong>Monitor Usage</strong>: Track rate limit hits and adjust limits accordingly
          </li>
          <li>
            <strong>User Communication</strong>: Always show queue status when rate limited
          </li>
          <li>
            <strong>Graceful Degradation</strong>: Handle rate limits without breaking the UX
          </li>
        </ul>

        <h3>Queue Size Recommendations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Use Case</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Concurrent</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Queue Size</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Rationale</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Personal Chat</td>
                <td className="border border-gray-300 px-4 py-2">1-2</td>
                <td className="border border-gray-300 px-4 py-2">5</td>
                <td className="border border-gray-300 px-4 py-2">Simple, low traffic</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Team Collaboration</td>
                <td className="border border-gray-300 px-4 py-2">3-5</td>
                <td className="border border-gray-300 px-4 py-2">10-15</td>
                <td className="border border-gray-300 px-4 py-2">Multiple users, moderate traffic</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Enterprise App</td>
                <td className="border border-gray-300 px-4 py-2">5-10</td>
                <td className="border border-gray-300 px-4 py-2">20-50</td>
                <td className="border border-gray-300 px-4 py-2">High traffic, critical workflows</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="warning" title="Avoid Common Pitfalls">
          <ul className="list-disc list-inside">
            <li>Don't set queue sizes too large - this can hide performance issues</li>
            <li>Always provide user feedback during rate limiting</li>
            <li>Monitor queue depths and adjust limits based on real usage</li>
            <li>Test rate limiting scenarios in development</li>
          </ul>
        </Callout>
      </section>

      <section className="docs-section">
        <h2>6. Migration from Legacy Systems</h2>

        <h3>From Token Bucket to ClarityChat</h3>
        <CodeBlock
          language="diff"
          code={`// Before: Manual token bucket implementation
- const limiter = new TokenBucketRateLimiter({...})
- const result = await limiter.checkLimit(userId)
- if (!result.allowed) throw new Error('Rate limited')
- await makeAPIRequest()

// After: Built-in ClarityChat rate limiting
+ <ClarityChat
+   api="/api/chat"
+   enableRateLimiting={true}
+   maxConcurrentRequests={3}
+   maxQueueSize={10}
+   onRateLimited={(resetTime) => {
+     console.log('Automatically handled by ClarityChat')
+   }}
+ />
`}
        />

        <p className="mt-4 text-sm text-muted-foreground">
          ClarityChat's built-in rate limiting provides automatic queuing, retry logic,
          and user feedback - eliminating the need for manual token bucket implementations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Related Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/components/clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">ClarityChat Component</h3>
            <p className="text-sm text-muted-foreground">
              Complete reference for ClarityChat's rate limiting props and configuration.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChat Hook</h3>
            <p className="text-sm text-muted-foreground">
              Hook-level rate limiting configuration and queue management.
            </p>
          </Link>
        </div>
      </section>
          another shared backend in distributed environments.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>2. Usage Quotas</h2>
        <p>
          Rate limit bursts and enforce hard monthly ceilings with{' '}
          <code>QuotaManager</code>.
        </p>
        <CodeBlock
          language="ts"
          code={`import {
  QuotaManager,
  MemoryQuotaStorage,
} from '@clarity-chat/react'

const quotas = new QuotaManager({
  storage: new MemoryQuotaStorage(),
  limits: {
    tokens: 500_000,
    requests: 20_000,
  },
  resetPeriod: 'monthly',
  onWarning: (quota) => {
    console.warn('Tenant near quota', quota)
  },
  onExceeded: (quota) => {
    // Notify billing, send webhook, etc.
  },
})

export async function ensureQuota(
  tenantId: string,
  estimatedTokens: number,
) {
  const check = await quotas.checkQuota(tenantId, 'tokens', estimatedTokens)
  if (!check.allowed) {
    throw Object.assign(new Error('Quota exceeded'), {
      statusCode: 402,
      detail: check,
    })
  }
}

export async function recordUsage(
  tenantId: string,
  actualTokens: number,
  metadata?: { cost?: number },
) {
  await quotas.recordUsage(tenantId, 'tokens', actualTokens, metadata)
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>3. Bringing It Together in an API Route</h2>
        <CodeBlock
          language="ts"
          code={`// app/api/chat/[tenantId]/route.ts
import { NextRequest } from 'next/server'
import { withRateLimit } from '@/lib/rate-limit'
import { ensureQuota, recordUsage } from '@/lib/quotas'
import { callProvider } from '@/lib/provider'

export async function POST(
  request: NextRequest,
  { params }: { params: { tenantId: string } },
) {
  const { tenantId } = params
  const body = await request.json()

  await ensureQuota(tenantId, 2_000)

  return await withRateLimit(tenantId, async () => {
    const response = await callProvider(body.messages)
    await recordUsage(tenantId, response.usage.total_tokens, {
      cost: response.cost,
    })

    return Response.json(response)
  })
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <ul>
          <li>
            Store quota + rate limit history for analytics (send to{' '}
            <code>UsageDashboard</code>)
          </li>
          <li>
            Expose remaining quota to admins so they can take action early
          </li>
          <li>
            Use <code>WebhookManager</code> to alert billing teams when quotas
            are exceeded
          </li>
          <li>
            Pair with <code>QuotaManager</code>’s <code>onWarning</code> hook to
            send proactive emails
          </li>
        </ul>
        <Callout type="success">
          Related docs:{' '}
          <Link href="/guides/security">Security &amp; Compliance Guide</Link>{' '}
          and{' '}
          <Link href="/guides/production-deployment">
            Production Deployment Guide
          </Link>
          .
        </Callout>
      </section>
    </div>
  )
}
