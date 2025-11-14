import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookbook: Rate Limiting & Quotas',
  description:
    'Combine TokenBucket rate limiting with usage quotas to control cost and prevent abuse.',
}

export default function RateLimitingRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>Rate Limiting &amp; Quotas</h1>
        <p className="docs-lead">
          Learn how to throttle incoming requests, track token usage, and enforce
          per-tenant limits before the bill arrives.
        </p>
      </div>

      <section className="docs-section">
        <h2>Why Rate Limiting Matters</h2>
        <ul>
          <li>🛡️ Protects against abuse and runaway scripts</li>
          <li>💸 Keeps API costs predictable per tenant or user</li>
          <li>⚖️ Ensures fair usage across teams sharing the same workspace</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>1. Token Bucket Rate Limiter</h2>
        <CodeBlock
          language="ts"
          code={`import {
  TokenBucketRateLimiter,
  MemoryRateLimitStorage,
} from '@clarity-chat/react'

const limiter = new TokenBucketRateLimiter({
  maxRequests: 5,
  windowMs: 10_000, // 5 requests per 10 seconds
  storage: new MemoryRateLimitStorage(),
  keyGenerator: (tenantId) => \`ratelimit:tenant:\${tenantId}\`,
  onLimitExceeded: (tenantId, retryAfter) => {
    console.warn('Rate limit exceeded for', tenantId, 'retry after', retryAfter)
  },
})

export async function withRateLimit<T>(
  tenantId: string,
  fn: () => Promise<T>,
) {
  const result = await limiter.checkLimit(tenantId)
  if (!result.allowed) {
    throw Object.assign(new Error('Too many requests'), {
      statusCode: 429,
      retryAfter: result.retryAfter,
    })
  }
  return await fn()
}
`}
        />
        <Callout type="warning">
          <strong>MemoryRateLimitStorage</strong> is process-local. Use Redis or
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
          <li>Store quota + rate limit history for analytics (send to <code>UsageDashboard</code>)</li>
          <li>Expose remaining quota to admins so they can take action early</li>
          <li>Use <code>WebhookManager</code> to alert billing teams when quotas are exceeded</li>
          <li>Pair with <code>QuotaManager</code>’s <code>onWarning</code> hook to send proactive emails</li>
        </ul>
        <Callout type="success">
          Related docs: <Link href="/guides/security">Security &amp; Compliance Guide</Link>{' '}
          and <Link href="/guides/production-deployment">Production Deployment Guide</Link>.
        </Callout>
      </section>
    </div>
  )
}

