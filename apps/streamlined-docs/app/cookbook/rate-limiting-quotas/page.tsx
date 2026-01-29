/**
 * Rate Limiting & Quotas Cookbook
 *
 * Complete guide to implementing rate limiting, usage quotas, and
 * cost control for AI chat applications. Covers token budgets,
 * user-level limits, and API throttling strategies.
 *
 * Use Cases:
 * - Cost control and budget management
 * - Abuse prevention and fair usage
 * - Tier-based pricing models
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DocumentationPage } from '../../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../../components/Docs/Section'
import { ServerCodeBlock } from '../../../../../components/Docs/ServerCodeBlock'
import type { TocItem } from '../../../../../components/Docs/TableOfContents'

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'token-budgets', title: 'Token Budgets', level: 2 },
  { id: 'rate-limiting', title: 'Rate Limiting', level: 2 },
  { id: 'user-quotas', title: 'User Quotas', level: 2 },
  { id: 'tier-based', title: 'Tier-Based Limits', level: 2 },
  { id: 'examples', title: 'Complete Examples', level: 2 },
  { id: 'use-cases', title: 'Use Cases', level: 2 },
]

// ============================================================================
// Demo Component
// ============================================================================

interface UsageStats {
  tokensUsed: number
  tokensLimit: number
  requestsToday: number
  requestsLimit: number
  tier: 'free' | 'pro' | 'enterprise'
}

function RateLimitDemo() {
  const [stats, setStats] = useState<UsageStats>({
    tokensUsed: 1250,
    tokensLimit: 10000,
    requestsToday: 45,
    requestsLimit: 100,
    tier: 'free',
  })

  const [isBlocked, setIsBlocked] = useState(false)
  const [simulatedRequest, setSimulatedRequest] = useState<string | null>(null)

  const tokensPercentage = (stats.tokensUsed / stats.tokensLimit) * 100
  const requestsPercentage = (stats.requestsToday / stats.requestsLimit) * 100

  const handleSimulateRequest = (tokens: number) => {
    if (stats.tokensUsed + tokens > stats.tokensLimit) {
      setIsBlocked(true)
      setSimulatedRequest('Token limit exceeded!')
      return
    }

    if (stats.requestsToday >= stats.requestsLimit) {
      setIsBlocked(true)
      setSimulatedRequest('Daily request limit exceeded!')
      return
    }

    setStats((prev) => ({
      ...prev,
      tokensUsed: prev.tokensUsed + tokens,
      requestsToday: prev.requestsToday + 1,
    }))

    setSimulatedRequest(`Request sent! Used ${tokens} tokens`)
    setTimeout(() => setSimulatedRequest(null), 2000)
  }

  const handleUpgrade = (tier: 'free' | 'pro' | 'enterprise') => {
    const limits = {
      free: { tokens: 10000, requests: 100 },
      pro: { tokens: 100000, requests: 1000 },
      enterprise: { tokens: 1000000, requests: 10000 },
    }

    setStats((prev) => ({
      ...prev,
      tier,
      tokensLimit: limits[tier].tokens,
      requestsLimit: limits[tier].requests,
    }))

    setIsBlocked(false)
  }

  const handleReset = () => {
    setStats((prev) => ({
      ...prev,
      tokensUsed: 0,
      requestsToday: 0,
    }))
    setIsBlocked(false)
  }

  return (
    <div className="space-y-6">
      {/* Current Tier */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Current Plan</h3>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              stats.tier === 'free'
                ? 'bg-gray-500/10 text-gray-600'
                : stats.tier === 'pro'
                  ? 'bg-blue-500/10 text-blue-600'
                  : 'bg-purple-500/10 text-purple-600'
            }`}
          >
            {stats.tier.toUpperCase()}
          </span>
        </div>

        {/* Token Usage */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Token Usage</span>
            <span className="font-medium">
              {stats.tokensUsed.toLocaleString()} /{' '}
              {stats.tokensLimit.toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full ${
                tokensPercentage >= 90
                  ? 'bg-red-500'
                  : tokensPercentage >= 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(tokensPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Request Usage */}
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily Requests</span>
            <span className="font-medium">
              {stats.requestsToday} / {stats.requestsLimit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full ${
                requestsPercentage >= 90
                  ? 'bg-red-500'
                  : requestsPercentage >= 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(requestsPercentage, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Simulate Requests */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="mb-3 text-lg font-semibold">Simulate Requests</h3>
        <div className="grid gap-2 sm:grid-cols-3">
          <button
            onClick={() => handleSimulateRequest(100)}
            disabled={isBlocked}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Small (100 tokens)
          </button>
          <button
            onClick={() => handleSimulateRequest(500)}
            disabled={isBlocked}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Medium (500 tokens)
          </button>
          <button
            onClick={() => handleSimulateRequest(2000)}
            disabled={isBlocked}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50 disabled:hover:bg-transparent"
          >
            Large (2000 tokens)
          </button>
        </div>
      </div>

      {/* Feedback Messages */}
      <AnimatePresence>
        {simulatedRequest && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            viewport={{ once: true }}
            className={`rounded-lg px-4 py-3 text-sm ${
              isBlocked
                ? 'border border-red-500/50 bg-red-500/10 text-red-600'
                : 'border border-green-500/50 bg-green-500/10 text-green-600'
            }`}
          >
            {simulatedRequest}
          </motion.div>
        )}

        {isBlocked && !simulatedRequest && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            viewport={{ once: true }}
            className="rounded-lg border border-red-500/50 bg-red-500/10 p-4"
          >
            <p className="mb-3 text-sm font-medium text-red-600">
              🚫 Usage limit exceeded
            </p>
            <p className="mb-3 text-sm text-red-600/80">
              You&apos;ve reached your usage limit. Upgrade your plan or reset
              the demo to continue.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpgrade('pro')}
                className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Reset Demo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan Options */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Available Plans</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              tier: 'free' as const,
              name: 'Free',
              tokens: 10000,
              requests: 100,
              price: '$0',
            },
            {
              tier: 'pro' as const,
              name: 'Pro',
              tokens: 100000,
              requests: 1000,
              price: '$29',
            },
            {
              tier: 'enterprise' as const,
              name: 'Enterprise',
              tokens: 1000000,
              requests: 10000,
              price: '$299',
            },
          ].map((plan) => (
            <button
              key={plan.tier}
              onClick={() => handleUpgrade(plan.tier)}
              className={`rounded-lg border p-4 text-left transition-colors ${
                stats.tier === plan.tier
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted'
              }`}
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-semibold">{plan.name}</h4>
                <span className="text-sm text-muted-foreground">
                  {plan.price}/mo
                </span>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{plan.tokens.toLocaleString()} tokens/month</p>
                <p>{plan.requests} requests/day</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component
// ============================================================================

export default function RateLimitingQuotasCookbook() {
  return (
    <DocumentationPage
      title="Rate Limiting & Quotas"
      description="Implement token budgets, rate limiting, and usage quotas to control costs and prevent abuse"
      tableOfContents={tableOfContents}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <p>
          Implementing proper rate limiting and usage quotas is essential for
          controlling costs, preventing abuse, and ensuring fair usage of your
          AI chat application. This guide covers token budgets, request
          throttling, and tier-based pricing models.
        </p>

        <div className="my-6">
          <h3 className="mb-3 text-lg font-semibold">Interactive Demo</h3>
          <RateLimitDemo />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="mb-2 font-semibold">What You&apos;ll Learn</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Token budget tracking and enforcement</li>
            <li>• Request-based rate limiting with sliding windows</li>
            <li>• User-level quotas and usage monitoring</li>
            <li>• Tier-based pricing models (Free/Pro/Enterprise)</li>
            <li>• Redis-based rate limiting for scale</li>
            <li>• Graceful limit enforcement with feedback</li>
          </ul>
        </div>
      </Section>

      {/* Token Budgets */}
      <Section id="token-budgets" title="Token Budgets">
        <p>
          Track and enforce token usage limits to control costs. Monitor usage
          in real-time and notify users before they hit limits.
        </p>

        <ServerCodeBlock
          title="Token Budget Middleware"
          language="typescript"
          code={`// middleware/tokenBudget.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

interface TokenBudget {
  userId: string
  tokensUsed: number
  tokensLimit: number
  periodStart: Date
  periodEnd: Date
}

export async function checkTokenBudget(request: NextRequest) {
  const session = await getSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user's current budget
  const budget = await db.tokenBudget.findUnique({
    where: { userId: session.userId },
  })

  if (!budget) {
    // Create new budget for user
    await db.tokenBudget.create({
      data: {
        userId: session.userId,
        tokensUsed: 0,
        tokensLimit: 10000, // Default limit
        periodStart: new Date(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })
    return NextResponse.next()
  }

  // Check if current period has expired
  if (new Date() > budget.periodEnd) {
    // Reset budget for new period
    await db.tokenBudget.update({
      where: { userId: session.userId },
      data: {
        tokensUsed: 0,
        periodStart: new Date(),
        periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
    return NextResponse.next()
  }

  // Check if user has exceeded limit
  if (budget.tokensUsed >= budget.tokensLimit) {
    return NextResponse.json(
      {
        error: 'Token budget exceeded',
        details: {
          tokensUsed: budget.tokensUsed,
          tokensLimit: budget.tokensLimit,
          resetDate: budget.periodEnd,
        },
      },
      { status: 429 }
    )
  }

  // Check if user is approaching limit (90%)
  const percentageUsed = (budget.tokensUsed / budget.tokensLimit) * 100
  if (percentageUsed >= 90) {
    // Add warning header
    const response = NextResponse.next()
    response.headers.set('X-Token-Budget-Warning', 'true')
    response.headers.set('X-Tokens-Remaining',
      String(budget.tokensLimit - budget.tokensUsed)
    )
    return response
  }

  return NextResponse.next()
}

// Update token usage after request
export async function updateTokenUsage(
  userId: string,
  tokensUsed: number
) {
  await db.tokenBudget.update({
    where: { userId },
    data: {
      tokensUsed: {
        increment: tokensUsed,
      },
    },
  })
}`}
        />
      </Section>

      {/* Rate Limiting */}
      <Section id="rate-limiting" title="Rate Limiting">
        <p>
          Implement request-based rate limiting to prevent abuse and ensure
          fair usage. Use sliding windows for accurate tracking.
        </p>

        <ServerCodeBlock
          title="Redis-Based Rate Limiter"
          language="typescript"
          code={`// lib/rateLimit.ts
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

interface RateLimitOptions {
  interval: number // Time window in seconds
  limit: number // Max requests per window
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number // Timestamp when limit resets
}

/**
 * Sliding window rate limiter using Redis
 */
export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { interval, limit } = options
  const now = Date.now()
  const key = \`ratelimit:\${identifier}\`

  // Use Redis pipeline for atomic operations
  const pipeline = redis.pipeline()

  // Remove old entries outside the window
  pipeline.zremrangebyscore(key, 0, now - interval * 1000)

  // Count requests in current window
  pipeline.zcard(key)

  // Add current request
  pipeline.zadd(key, { score: now, member: \`\${now}-\${Math.random()}\` })

  // Set expiration
  pipeline.expire(key, interval)

  const results = await pipeline.exec()
  const count = results[1] as number

  const success = count < limit
  const remaining = Math.max(0, limit - count - 1)
  const reset = now + interval * 1000

  return {
    success,
    limit,
    remaining,
    reset,
  }
}

// Usage in API route
export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit: 10 requests per minute
  const result = await rateLimit(session.userId, {
    interval: 60,
    limit: 10,
  })

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        details: {
          limit: result.limit,
          remaining: result.remaining,
          resetAt: new Date(result.reset).toISOString(),
        },
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.reset),
        },
      }
    )
  }

  // Process request
  // ...

  return NextResponse.json(
    { success: true },
    {
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(result.reset),
      },
    }
  )
}`}
        />
      </Section>

      {/* User Quotas */}
      <Section id="user-quotas" title="User Quotas">
        <p>
          Implement per-user quotas based on subscription tiers. Track usage
          across multiple dimensions (tokens, requests, storage).
        </p>

        <ServerCodeBlock
          title="User Quota System"
          language="typescript"
          code={`// lib/quotas.ts
import { z } from 'zod'

export const QuotaTierSchema = z.enum(['free', 'pro', 'enterprise'])
export type QuotaTier = z.infer<typeof QuotaTierSchema>

export interface QuotaLimits {
  tokensPerMonth: number
  requestsPerDay: number
  requestsPerMinute: number
  maxConversations: number
  maxMessagesPerConversation: number
  maxFileUploads: number
  maxFileSize: number // bytes
}

export const QUOTA_LIMITS: Record<QuotaTier, QuotaLimits> = {
  free: {
    tokensPerMonth: 10000,
    requestsPerDay: 100,
    requestsPerMinute: 5,
    maxConversations: 10,
    maxMessagesPerConversation: 50,
    maxFileUploads: 5,
    maxFileSize: 1024 * 1024, // 1MB
  },
  pro: {
    tokensPerMonth: 100000,
    requestsPerDay: 1000,
    requestsPerMinute: 20,
    maxConversations: 100,
    maxMessagesPerConversation: 500,
    maxFileUploads: 50,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
  enterprise: {
    tokensPerMonth: 1000000,
    requestsPerDay: 10000,
    requestsPerMinute: 100,
    maxConversations: 1000,
    maxMessagesPerConversation: 5000,
    maxFileUploads: 500,
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
}

export interface QuotaUsage {
  tier: QuotaTier
  tokensUsedThisMonth: number
  requestsToday: number
  conversationCount: number
  fileUploadCount: number
}

/**
 * Check if user can perform an action based on their quota
 */
export async function checkQuota(
  userId: string,
  action: 'request' | 'token' | 'conversation' | 'upload',
  amount: number = 1
): Promise<{ allowed: boolean; reason?: string }> {
  // Get user's tier and usage
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user) {
    return { allowed: false, reason: 'User not found' }
  }

  const tier = (user.subscription?.tier ?? 'free') as QuotaTier
  const limits = QUOTA_LIMITS[tier]
  const usage = await getUserQuotaUsage(userId)

  switch (action) {
    case 'request':
      if (usage.requestsToday + amount > limits.requestsPerDay) {
        return {
          allowed: false,
          reason: \`Daily request limit exceeded (\${limits.requestsPerDay})\`,
        }
      }
      break

    case 'token':
      if (usage.tokensUsedThisMonth + amount > limits.tokensPerMonth) {
        return {
          allowed: false,
          reason: \`Monthly token limit exceeded (\${limits.tokensPerMonth})\`,
        }
      }
      break

    case 'conversation':
      if (usage.conversationCount + amount > limits.maxConversations) {
        return {
          allowed: false,
          reason: \`Max conversations limit reached (\${limits.maxConversations})\`,
        }
      }
      break

    case 'upload':
      if (usage.fileUploadCount + amount > limits.maxFileUploads) {
        return {
          allowed: false,
          reason: \`Max file uploads limit reached (\${limits.maxFileUploads})\`,
        }
      }
      break
  }

  return { allowed: true }
}

async function getUserQuotaUsage(userId: string): Promise<QuotaUsage> {
  // Implementation depends on your database schema
  // This is a simplified example
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
      usage: true,
      conversations: { where: { deletedAt: null } },
      fileUploads: {
        where: {
          uploadedAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    },
  })

  return {
    tier: (user?.subscription?.tier ?? 'free') as QuotaTier,
    tokensUsedThisMonth: user?.usage?.tokensThisMonth ?? 0,
    requestsToday: user?.usage?.requestsToday ?? 0,
    conversationCount: user?.conversations?.length ?? 0,
    fileUploadCount: user?.fileUploads?.length ?? 0,
  }
}`}
        />
      </Section>

      {/* Tier-Based */}
      <Section id="tier-based" title="Tier-Based Limits">
        <p>
          Implement different limits for different subscription tiers. Provide
          upgrade paths when users hit limits.
        </p>

        <ServerCodeBlock
          title="Tier-Based API Protection"
          language="typescript"
          code={`// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { checkQuota, QUOTA_LIMITS, rateLimit } from '@/lib/quotas'

export async function POST(request: NextRequest) {
  const session = await getSession(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get user tier
  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { subscription: true },
  })

  const tier = (user?.subscription?.tier ?? 'free') as QuotaTier
  const limits = QUOTA_LIMITS[tier]

  // Check rate limit (requests per minute)
  const rateLimitResult = await rateLimit(session.userId, {
    interval: 60,
    limit: limits.requestsPerMinute,
  })

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        details: {
          tier,
          limit: rateLimitResult.limit,
          resetAt: new Date(rateLimitResult.reset).toISOString(),
          upgradeUrl: '/pricing',
        },
      },
      { status: 429 }
    )
  }

  // Check daily request quota
  const requestQuotaCheck = await checkQuota(session.userId, 'request')
  if (!requestQuotaCheck.allowed) {
    return NextResponse.json(
      {
        error: 'Quota exceeded',
        reason: requestQuotaCheck.reason,
        tier,
        upgradeUrl: '/pricing',
      },
      { status: 429 }
    )
  }

  // Check token quota (estimate tokens)
  const body = await request.json()
  const estimatedTokens = estimateTokens(body.messages)

  const tokenQuotaCheck = await checkQuota(
    session.userId,
    'token',
    estimatedTokens
  )

  if (!tokenQuotaCheck.allowed) {
    return NextResponse.json(
      {
        error: 'Token quota exceeded',
        reason: tokenQuotaCheck.reason,
        tier,
        estimatedTokens,
        upgradeUrl: '/pricing',
      },
      { status: 429 }
    )
  }

  // Process chat request
  // ...

  return NextResponse.json({ success: true })
}

function estimateTokens(messages: any[]): number {
  // Rough estimate: 1 token ≈ 4 characters
  const totalChars = messages
    .map((m) => m.content.length)
    .reduce((a, b) => a + b, 0)
  return Math.ceil(totalChars / 4)
}`}
        />
      </Section>

      {/* Complete Examples */}
      <Section id="examples" title="Complete Examples">
        <ServerCodeBlock
          title="Client-Side Quota Display"
          language="typescript"
          code={`// components/QuotaDisplay.tsx
'use client'

import { useEffect, useState } from 'react'

interface QuotaInfo {
  tier: string
  tokensUsed: number
  tokensLimit: number
  requestsToday: number
  requestsLimit: number
}

export function QuotaDisplay() {
  const [quota, setQuota] = useState<QuotaInfo | null>(null)

  useEffect(() => {
    fetch('/api/user/quota')
      .then((res) => res.json())
      .then(setQuota)
  }, [])

  if (!quota) return null

  const tokensPercentage = (quota.tokensUsed / quota.tokensLimit) * 100
  const requestsPercentage = (quota.requestsToday / quota.requestsLimit) * 100

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 font-semibold">Usage - {quota.tier}</h3>

      {/* Tokens */}
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm">
          <span>Tokens</span>
          <span>
            {quota.tokensUsed.toLocaleString()} /{' '}
            {quota.tokensLimit.toLocaleString()}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={\`h-full transition-all \${
              tokensPercentage >= 90
                ? 'bg-red-500'
                : tokensPercentage >= 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }\`}
            style={{ width: \`\${Math.min(tokensPercentage, 100)}%\` }}
          />
        </div>
      </div>

      {/* Requests */}
      <div>
        <div className="mb-1 flex justify-between text-sm">
          <span>Requests Today</span>
          <span>
            {quota.requestsToday} / {quota.requestsLimit}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={\`h-full transition-all \${
              requestsPercentage >= 90
                ? 'bg-red-500'
                : requestsPercentage >= 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            }\`}
            style={{ width: \`\${Math.min(requestsPercentage, 100)}%\` }}
          />
        </div>
      </div>

      {(tokensPercentage >= 90 || requestsPercentage >= 90) && (
        <div className="mt-3 rounded bg-yellow-500/10 p-2 text-sm text-yellow-600">
          ⚠️ Approaching usage limit.{' '}
          <a href="/pricing" className="underline">
            Upgrade
          </a>{' '}
          for more capacity.
        </div>
      )}
    </div>
  )
}`}
        />
      </Section>

      {/* Use Cases */}
      <Section id="use-cases" title="Use Cases">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Cost Control',
              description:
                'Prevent runaway costs by setting hard limits on token and request usage per user or organization',
              icon: '💰',
            },
            {
              title: 'Abuse Prevention',
              description:
                'Stop malicious actors from overwhelming your API with excessive requests or automated attacks',
              icon: '🛡️',
            },
            {
              title: 'Tiered Pricing',
              description:
                'Implement freemium models with clear upgrade paths as users grow their usage',
              icon: '📊',
            },
          ].map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <div className="mb-3 text-3xl">{useCase.icon}</div>
              <h3 className="mb-2 font-semibold">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground">
                {useCase.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>
    </DocumentationPage>
  )
}
