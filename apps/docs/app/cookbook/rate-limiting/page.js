import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Cookbook: Rate Limiting & Quotas',
    description: 'Combine TokenBucket rate limiting with usage quotas to control cost and prevent abuse.',
};
export default function RateLimitingRecipePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("h1", { children: "Rate Limiting & Quotas" }), _jsx("p", { className: "docs-lead", children: "Learn how to throttle incoming requests, track token usage, and enforce per-tenant limits before the bill arrives." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Why Rate Limiting Matters" }), _jsxs("ul", { children: [_jsx("li", { children: "\uD83D\uDEE1\uFE0F Protects against abuse and runaway scripts" }), _jsx("li", { children: "\uD83D\uDCB8 Keeps API costs predictable per tenant or user" }), _jsx("li", { children: "\u2696\uFE0F Ensures fair usage across teams sharing the same workspace" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "1. Token Bucket Rate Limiter" }), _jsx(CodeBlock, { language: "ts", code: `import {
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
` }), _jsxs(Callout, { type: "warning", children: [_jsx("strong", { children: "MemoryRateLimitStorage" }), " is process-local. Use Redis or another shared backend in distributed environments."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "2. Usage Quotas" }), _jsxs("p", { children: ["Rate limit bursts and enforce hard monthly ceilings with", ' ', _jsx("code", { children: "QuotaManager" }), "."] }), _jsx(CodeBlock, { language: "ts", code: `import {
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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "3. Bringing It Together in an API Route" }), _jsx(CodeBlock, { language: "ts", code: `// app/api/chat/[tenantId]/route.ts
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
` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tips" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Store quota + rate limit history for analytics (send to ", _jsx("code", { children: "UsageDashboard" }), ")"] }), _jsx("li", { children: "Expose remaining quota to admins so they can take action early" }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "WebhookManager" }), " to alert billing teams when quotas are exceeded"] }), _jsxs("li", { children: ["Pair with ", _jsx("code", { children: "QuotaManager" }), "\u2019s ", _jsx("code", { children: "onWarning" }), " hook to send proactive emails"] })] }), _jsxs(Callout, { type: "success", children: ["Related docs: ", _jsx(Link, { href: "/guides/security", children: "Security & Compliance Guide" }), ' ', "and ", _jsx(Link, { href: "/guides/production-deployment", children: "Production Deployment Guide" }), "."] })] })] }));
}
//# sourceMappingURL=page.js.map