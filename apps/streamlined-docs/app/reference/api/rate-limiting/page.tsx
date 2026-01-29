'use client'

/**
 * Rate Limiting API Reference
 *
 * Comprehensive guide to implementing rate limiting with cost budgets for AI applications.
 * Covers per-user, per-endpoint, and global rate limiting patterns with Express, Fastify, and Hono.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Copy,
  Check,
  ChevronRight,
  DollarSign,
  AlertCircle,
  Keyboard,
  Eye,
  Activity,
  Clock,
  Server,
  TrendingDown,
  Users,
  Zap,
  Database,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div id={id} className={cn('scroll-mt-24', className)}>
      <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-sm">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Feature Card Component
// ============================================================================

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-br from-muted/30 to-muted/10 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-brand-500/10">
          <Icon className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Badge Component
// ============================================================================

function Badge({
  children,
  variant = 'default'
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const variants = {
    default: 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-500/20',
    success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    danger: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  }

  return (
    <span className={cn(
      'px-3 py-1 text-xs font-semibold rounded-full border',
      variants[variant]
    )}>
      {children}
    </span>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function RateLimitingAPIPage() {
  const breadcrumbItems = [
    { label: 'Reference', href: '/reference' },
    { label: 'API', href: '/reference/api' },
    { label: 'Rate Limiting' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />

        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    Rate Limiting API
                  </h1>
                  <Badge variant="success">Stable</Badge>
                  <Badge>Token Optimized</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Prevent cost overruns with intelligent rate limiting and budget controls
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Cost Savings</p>
                  <p className="text-sm font-semibold text-foreground">
                    50-70%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Users className="w-5 h-5 text-brand-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Per-User Limits</p>
                  <p className="text-sm font-semibold text-foreground">
                    Daily/Monthly
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Server className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Endpoint Control</p>
                  <p className="text-sm font-semibold text-foreground">
                    Granular Limits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/30 border border-border/50">
                <Activity className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Real-time</p>
                  <p className="text-sm font-semibold text-foreground">
                    Monitoring
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Overview */}
          <Section id="overview" title="Overview">
            <div className="space-y-4 mb-8">
              <p className="text-muted-foreground">
                Rate limiting for AI applications goes beyond traditional request counting. With token-based
                APIs, costs can vary dramatically per request. The Clarity rate limiting system combines
                traditional rate limits with cost budgets to prevent runaway expenses while maintaining
                optimal user experience.
              </p>

              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                      Cost Impact: Maintain 50-70% Savings
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Intelligent rate limiting prevents cost overruns from high-volume users or
                      expensive requests while preserving your optimization gains. Graceful degradation
                      ensures service continuity even when limits are reached.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* Key Features */}
          <Section id="features" title="Key Features">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              <FeatureCard
                icon={Users}
                title="Per-User Rate Limiting"
                description="Set individual limits per user with daily, weekly, or monthly quotas based on requests or cost"
              />
              <FeatureCard
                icon={Server}
                title="Per-Endpoint Limits"
                description="Apply different rate limits to different API endpoints based on their cost and criticality"
              />
              <FeatureCard
                icon={DollarSign}
                title="Cost Budget Integration"
                description="Track token costs in real-time and enforce budget limits across users and time periods"
              />
              <FeatureCard
                icon={Activity}
                title="Graceful Degradation"
                description="Automatically fall back to cheaper models or cached responses when limits are approached"
              />
              <FeatureCard
                icon={BarChart3}
                title="Dashboard Integration"
                description="Real-time monitoring with alerts and usage analytics for proactive management"
              />
              <FeatureCard
                icon={Settings}
                title="Production Patterns"
                description="Battle-tested patterns with Redis, distributed counters, and sliding windows"
              />
            </div>
          </Section>

          {/* Rate Limiting Patterns */}
          <Section id="patterns" title="Rate Limiting Patterns" className="mb-12">
            <SubSection id="per-user" title="1. Per-User Rate Limiting" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Limit each user's requests and costs independently. Essential for SaaS applications
                with tiered pricing or free tiers.
              </p>

              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Express Implementation
                  </h4>
                  <CodeBlock
                    code={`import { createRateLimiter, CostBudget } from '@clarity-chat/token-optimization'
import rateLimit from 'express-rate-limit'
import RedisStore from 'rate-limit-redis'
import { createClient } from 'redis'

// Redis client for distributed rate limiting
const redisClient = createClient({
  url: process.env.REDIS_URL,
})
await redisClient.connect()

// Per-user rate limiter with cost budget
const userRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:user:',
  }),
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: async (req) => {
    const user = req.user

    // Tiered limits based on plan
    const limits = {
      free: 100,
      pro: 1000,
      enterprise: 10000,
    }

    return limits[user.plan] || limits.free
  },
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: req.rateLimit.resetTime,
      limit: req.rateLimit.limit,
      remaining: 0,
    })
  },
})

// Cost budget middleware
const costBudgetLimiter = async (req, res, next) => {
  const userId = req.user.id
  const budget = new CostBudget({
    userId,
    dailyLimit: 10.00,    // $10/day
    monthlyLimit: 200.00, // $200/month
    storage: redisClient,
  })

  const canProceed = await budget.checkAndDecrement({
    estimatedCost: req.estimatedTokenCost || 0.01,
  })

  if (!canProceed) {
    return res.status(429).json({
      error: 'Cost budget exceeded',
      budgetInfo: await budget.getUsage(),
    })
  }

  // Attach budget info to request
  req.costBudget = budget
  next()
}

// Apply both limiters
app.use('/api/chat', userRateLimiter, costBudgetLimiter)

app.post('/api/chat', async (req, res) => {
  // Process chat request
  const response = await processChat(req.body)

  // Record actual cost
  await req.costBudget.recordCost(response.tokenCost)

  res.json(response)
})`}
                    language="typescript"
                  />
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Fastify Implementation
                  </h4>
                  <CodeBlock
                    code={`import fastify from 'fastify'
import fastifyRateLimit from '@fastify/rate-limit'
import { createRateLimiter, CostBudget } from '@clarity-chat/token-optimization'

const app = fastify()

// Register rate limit plugin
await app.register(fastifyRateLimit, {
  global: false, // Apply selectively
  redis: redisClient,
  keyGenerator: (request) => request.user.id,
  max: async (request) => {
    const tiers = {
      free: 100,
      pro: 1000,
      enterprise: 10000,
    }
    return tiers[request.user.plan] || 100
  },
  timeWindow: '1 day',
  errorResponseBuilder: (request, context) => ({
    error: 'Too many requests',
    limit: context.max,
    remaining: context.remaining,
    resetTime: new Date(context.ttl),
  }),
})

// Cost budget decorator
app.decorateRequest('costBudget', null)

// Cost budget hook
app.addHook('preHandler', async (request, reply) => {
  if (!request.routeOptions.config?.requiresBudget) return

  const budget = new CostBudget({
    userId: request.user.id,
    dailyLimit: 10.00,
    monthlyLimit: 200.00,
    storage: redisClient,
  })

  const canProceed = await budget.checkAndDecrement({
    estimatedCost: 0.01,
  })

  if (!canProceed) {
    return reply.code(429).send({
      error: 'Cost budget exceeded',
      budgetInfo: await budget.getUsage(),
    })
  }

  request.costBudget = budget
})

// Apply to specific route
app.post('/api/chat', {
  config: { requiresBudget: true },
  preHandler: app.rateLimit(),
}, async (request, reply) => {
  const response = await processChat(request.body)
  await request.costBudget.recordCost(response.tokenCost)
  return response
})`}
                    language="typescript"
                  />
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Hono Implementation
                  </h4>
                  <CodeBlock
                    code={`import { Hono } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { CostBudget } from '@clarity-chat/token-optimization'

const app = new Hono()

// Per-user rate limiter middleware
const userRateLimiter = rateLimiter({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: async (c) => {
    const user = c.get('user')
    const tiers = {
      free: 100,
      pro: 1000,
      enterprise: 10000,
    }
    return tiers[user.plan] || 100
  },
  keyGenerator: (c) => c.get('user').id,
  store: redisStore(redisClient),
  handler: (c) => {
    return c.json({
      error: 'Rate limit exceeded',
      retryAfter: c.get('rateLimitReset'),
    }, 429)
  },
})

// Cost budget middleware
const costBudgetMiddleware = async (c, next) => {
  const user = c.get('user')
  const budget = new CostBudget({
    userId: user.id,
    dailyLimit: 10.00,
    monthlyLimit: 200.00,
    storage: redisClient,
  })

  const canProceed = await budget.checkAndDecrement({
    estimatedCost: 0.01,
  })

  if (!canProceed) {
    return c.json({
      error: 'Cost budget exceeded',
      budgetInfo: await budget.getUsage(),
    }, 429)
  }

  c.set('costBudget', budget)
  await next()
}

// Apply middlewares
app.post('/api/chat',
  userRateLimiter,
  costBudgetMiddleware,
  async (c) => {
    const response = await processChat(await c.req.json())

    // Record actual cost
    const budget = c.get('costBudget')
    await budget.recordCost(response.tokenCost)

    return c.json(response)
  }
)`}
                    language="typescript"
                  />
                </div>
              </div>
            </SubSection>

            <SubSection id="per-endpoint" title="2. Per-Endpoint Rate Limiting" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Apply different limits to different endpoints based on their computational cost
                and business criticality.
              </p>

              <CodeBlock
                code={`import { RateLimiterRedis } from 'rate-limiter-flexible'
import { createClient } from 'redis'

const redisClient = createClient({ url: process.env.REDIS_URL })
await redisClient.connect()

// Define endpoint-specific limits
const endpointLimits = {
  '/api/chat': {
    points: 100,          // 100 requests
    duration: 60 * 60,    // per hour
    blockDuration: 60,    // block for 1 minute
    costPerRequest: 0.05, // estimated cost
  },
  '/api/completion': {
    points: 50,
    duration: 60 * 60,
    blockDuration: 120,
    costPerRequest: 0.02,
  },
  '/api/search': {
    points: 1000,
    duration: 60 * 60,
    blockDuration: 30,
    costPerRequest: 0.001,
  },
}

// Create rate limiters for each endpoint
const rateLimiters = {}
for (const [endpoint, config] of Object.entries(endpointLimits)) {
  rateLimiters[endpoint] = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: \`rl:\${endpoint}:\`,
    points: config.points,
    duration: config.duration,
    blockDuration: config.blockDuration,
  })
}

// Middleware to apply endpoint-specific limits
export const endpointRateLimiter = async (req, res, next) => {
  const endpoint = req.path
  const limiter = rateLimiters[endpoint]

  if (!limiter) {
    return next() // No limit for this endpoint
  }

  const key = \`\${req.user.id}:\${endpoint}\`

  try {
    await limiter.consume(key)

    // Add rate limit headers
    const limit = endpointLimits[endpoint]
    res.setHeader('X-RateLimit-Limit', limit.points)
    res.setHeader('X-RateLimit-Remaining',
      await limiter.get(key).then(r => r?.remainingPoints || limit.points)
    )

    next()
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      // Rate limit exceeded
      res.setHeader('Retry-After', Math.ceil(error.msBeforeNext / 1000))
      return res.status(429).json({
        error: 'Endpoint rate limit exceeded',
        endpoint,
        retryAfter: error.msBeforeNext,
      })
    }
    throw error
  }
}

// Apply to all routes
app.use(endpointRateLimiter)`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="global" title="3. Global Rate Limiting" className="mb-8">
              <p className="text-muted-foreground mb-4">
                Set organization-wide limits to prevent system overload and control total costs.
              </p>

              <CodeBlock
                code={`import { RateLimiterRedis } from 'rate-limiter-flexible'
import { CostBudget } from '@clarity-chat/token-optimization'

// Global organization limits
const globalLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:global:',
  points: 10000,        // 10k requests
  duration: 60 * 60,    // per hour
  blockDuration: 300,   // block for 5 minutes
})

// Global cost budget
const globalBudget = new CostBudget({
  userId: 'organization',
  dailyLimit: 1000.00,    // $1,000/day
  monthlyLimit: 20000.00, // $20,000/month
  storage: redisClient,
})

// Global rate limiting middleware
export const globalRateLimiter = async (req, res, next) => {
  const orgId = req.organization?.id || 'default'

  try {
    // Check global request limit
    await globalLimiter.consume(orgId)

    // Check global cost budget
    const canProceed = await globalBudget.checkAndDecrement({
      estimatedCost: 0.01,
    })

    if (!canProceed) {
      return res.status(429).json({
        error: 'Organization cost budget exceeded',
        budgetInfo: await globalBudget.getUsage(),
      })
    }

    // Attach global budget to request
    req.globalBudget = globalBudget
    next()
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      return res.status(429).json({
        error: 'Global rate limit exceeded',
        retryAfter: error.msBeforeNext,
      })
    }
    throw error
  }
}

// Apply globally
app.use(globalRateLimiter)`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Cost Budget Integration */}
          <Section id="cost-budgets" title="Cost Budget Integration" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Cost budgets track actual spending in real-time and enforce daily/monthly limits.
            </p>

            <SubSection id="budget-configuration" title="Budget Configuration" className="mb-6">
              <CodeBlock
                code={`import { CostBudget, BudgetPeriod } from '@clarity-chat/token-optimization'

// Create a cost budget with daily and monthly limits
const budget = new CostBudget({
  userId: 'user-123',

  // Budget limits
  dailyLimit: 5.00,      // $5 per day
  monthlyLimit: 100.00,  // $100 per month

  // Storage backend
  storage: redisClient,

  // Optional: Alert thresholds
  alertThresholds: [
    { percent: 50, action: 'notify' },
    { percent: 80, action: 'warn' },
    { percent: 95, action: 'throttle' },
  ],

  // Optional: Overage handling
  allowOverage: false,
  overageLimit: 1.10, // Allow 10% overage
})

// Check if request can proceed
const canProceed = await budget.checkAndDecrement({
  estimatedCost: 0.05, // Estimated $0.05 for this request
})

if (!canProceed) {
  throw new Error('Budget exceeded')
}

// After request completes, record actual cost
await budget.recordCost(actualCost)

// Get current usage
const usage = await budget.getUsage()
console.log({
  dailySpent: usage.daily.spent,
  dailyRemaining: usage.daily.remaining,
  dailyPercent: usage.daily.percentUsed,

  monthlySpent: usage.monthly.spent,
  monthlyRemaining: usage.monthly.remaining,
  monthlyPercent: usage.monthly.percentUsed,
})`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="budget-alerts" title="Budget Alert Configurations" className="mb-6">
              <CodeBlock
                code={`import { BudgetAlert, BudgetMonitor } from '@clarity-chat/token-optimization'

// Set up budget monitoring
const monitor = new BudgetMonitor({
  storage: redisClient,
  checkInterval: 60000, // Check every minute
})

// Configure alert handlers
monitor.on('threshold_reached', async (alert: BudgetAlert) => {
  const { userId, period, threshold, usage } = alert

  if (threshold.percent === 50) {
    // 50% threshold - informational notification
    await sendEmail(userId, {
      subject: 'AI Budget Update: 50% Used',
      body: \`You've used $\{usage.spent.toFixed(2)} of your $\{usage.limit.toFixed(2)} \${period} budget.\`,
    })
  }

  if (threshold.percent === 80) {
    // 80% threshold - warning
    await sendEmail(userId, {
      subject: 'AI Budget Warning: 80% Used',
      body: \`Warning: You've used 80% of your \${period} budget. Consider optimizing your requests.\`,
      priority: 'high',
    })

    // Also send push notification
    await sendPushNotification(userId, {
      title: 'Budget Warning',
      body: '80% of your AI budget has been used',
    })
  }

  if (threshold.percent === 95) {
    // 95% threshold - critical alert and throttling
    await sendEmail(userId, {
      subject: 'AI Budget Critical: 95% Used',
      body: \`Critical: You've used 95% of your \${period} budget. Service may be throttled.\`,
      priority: 'urgent',
    })

    // Enable automatic throttling
    await enableThrottling(userId, {
      mode: 'gradual',
      maxSlowdown: 2, // Up to 2x slower
    })
  }
})

// Configure overage handling
monitor.on('budget_exceeded', async (alert: BudgetAlert) => {
  const { userId, period, usage } = alert

  // Send immediate notification
  await sendEmail(userId, {
    subject: \`AI Budget Exceeded: \${period}\`,
    body: \`Your \${period} AI budget of $\{usage.limit.toFixed(2)} has been exceeded.\`,
    priority: 'urgent',
  })

  // Temporarily disable expensive features
  await disableFeatures(userId, ['image-generation', 'long-context'])

  // Switch to cheaper models
  await updateUserPreferences(userId, {
    defaultModel: 'claude-3-haiku',
    enableCaching: true,
  })
})

// Start monitoring
await monitor.start()`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="tiered-budgets" title="Tiered Budget Plans" className="mb-6">
              <CodeBlock
                code={`// Define budget tiers for different user plans
const budgetTiers = {
  free: {
    dailyLimit: 0.50,     // $0.50/day
    monthlyLimit: 10.00,  // $10/month
    requestLimit: 50,     // 50 requests/day
    features: ['basic-chat'],
  },

  starter: {
    dailyLimit: 2.00,
    monthlyLimit: 50.00,
    requestLimit: 200,
    features: ['basic-chat', 'code-completion', 'caching'],
  },

  pro: {
    dailyLimit: 10.00,
    monthlyLimit: 250.00,
    requestLimit: 1000,
    features: ['basic-chat', 'code-completion', 'caching', 'image-generation'],
  },

  enterprise: {
    dailyLimit: 100.00,
    monthlyLimit: 2500.00,
    requestLimit: 10000,
    features: ['all'],
    customAlerts: true,
    dedicatedSupport: true,
  },
}

// Middleware to apply tier-based budgets
export const tierBudgetMiddleware = async (req, res, next) => {
  const user = req.user
  const tier = budgetTiers[user.plan] || budgetTiers.free

  // Create budget with tier limits
  const budget = new CostBudget({
    userId: user.id,
    dailyLimit: tier.dailyLimit,
    monthlyLimit: tier.monthlyLimit,
    storage: redisClient,
  })

  // Check if feature is available for this tier
  const requestedFeature = req.body.feature
  if (!tier.features.includes('all') && !tier.features.includes(requestedFeature)) {
    return res.status(403).json({
      error: 'Feature not available in your plan',
      requiredPlan: 'pro',
      upgrade: '/upgrade',
    })
  }

  // Check budget
  const canProceed = await budget.checkAndDecrement({
    estimatedCost: estimateRequestCost(req),
  })

  if (!canProceed) {
    return res.status(429).json({
      error: 'Budget exceeded',
      budgetInfo: await budget.getUsage(),
      upgrade: user.plan === 'free' ? '/upgrade' : null,
    })
  }

  req.costBudget = budget
  req.tierFeatures = tier.features
  next()
}`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Graceful Degradation */}
          <Section id="graceful-degradation" title="Graceful Degradation When Limits Hit" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Instead of hard failures, implement progressive fallbacks to maintain service quality.
            </p>

            <SubSection id="fallback-strategies" title="Fallback Strategies" className="mb-6">
              <CodeBlock
                code={`import {
  CacheManager,
  ModelRouter,
  CompressionService
} from '@clarity-chat/token-optimization'

// Multi-level fallback system
class GracefulDegradation {
  private cache: CacheManager
  private router: ModelRouter
  private compressor: CompressionService

  async handleRequest(req, budget) {
    const usage = await budget.getUsage()
    const percentUsed = usage.daily.percentUsed

    // Level 1: Normal operation (0-50% budget used)
    if (percentUsed < 50) {
      return await this.processNormal(req)
    }

    // Level 2: Enable aggressive caching (50-70% budget used)
    if (percentUsed < 70) {
      const cached = await this.cache.get(req.query)
      if (cached) {
        return {
          ...cached,
          source: 'cache',
          costSaved: true,
        }
      }
      return await this.processWithCaching(req)
    }

    // Level 3: Switch to cheaper model (70-85% budget used)
    if (percentUsed < 85) {
      return await this.processCheaperModel(req)
    }

    // Level 4: Compress prompts (85-95% budget used)
    if (percentUsed < 95) {
      return await this.processCompressed(req)
    }

    // Level 5: Queue for later processing (95-100% budget used)
    if (percentUsed < 100) {
      return await this.queueForLater(req)
    }

    // Budget exceeded - return helpful error
    return {
      error: 'Daily budget exceeded',
      budgetInfo: usage,
      suggestions: [
        'Upgrade to a higher tier',
        'Wait until tomorrow',
        'Use cached responses',
      ],
    }
  }

  private async processNormal(req) {
    // Use premium model with full context
    return await this.router.route({
      model: 'claude-3-5-sonnet',
      prompt: req.prompt,
      context: req.context,
    })
  }

  private async processWithCaching(req) {
    const response = await this.processNormal(req)

    // Cache for future requests
    await this.cache.set(req.query, response, {
      ttl: 3600, // 1 hour
    })

    return response
  }

  private async processCheaperModel(req) {
    // Switch to more economical model
    return await this.router.route({
      model: 'claude-3-haiku', // 10x cheaper
      prompt: req.prompt,
      context: req.context,
      metadata: { fallback: true },
    })
  }

  private async processCompressed(req) {
    // Compress prompt to reduce tokens
    const compressed = await this.compressor.compress({
      prompt: req.prompt,
      context: req.context,
      targetReduction: 0.3, // 30% reduction
    })

    return await this.router.route({
      model: 'claude-3-haiku',
      prompt: compressed.prompt,
      context: compressed.context,
      metadata: {
        compressed: true,
        originalTokens: compressed.originalCount,
        compressedTokens: compressed.compressedCount,
      },
    })
  }

  private async queueForLater(req) {
    // Add to processing queue
    const jobId = await this.queue.add({
      userId: req.user.id,
      prompt: req.prompt,
      priority: 'low',
      scheduledFor: 'next-budget-period',
    })

    return {
      queued: true,
      jobId,
      estimatedProcessing: 'within 24 hours',
      message: 'Request queued due to budget limits',
    }
  }
}

// Apply graceful degradation
const degradation = new GracefulDegradation()

app.post('/api/chat', async (req, res) => {
  const response = await degradation.handleRequest(req, req.costBudget)
  res.json(response)
})`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="user-notification" title="User Notification Strategy" className="mb-6">
              <CodeBlock
                code={`// Inform users about degradation with helpful context
export const addDegradationHeaders = (res, level, usage) => {
  res.setHeader('X-Service-Mode', level)
  res.setHeader('X-Budget-Used-Percent', usage.daily.percentUsed)
  res.setHeader('X-Budget-Remaining', usage.daily.remaining.toFixed(2))

  // Warning headers when approaching limits
  if (usage.daily.percentUsed >= 70) {
    res.setHeader('X-Budget-Warning', 'approaching-limit')
  }

  if (usage.daily.percentUsed >= 90) {
    res.setHeader('X-Budget-Critical', 'true')
  }
}

// Client-side handling
export const handleDegradedResponse = (response) => {
  const serviceMode = response.headers.get('X-Service-Mode')
  const budgetPercent = parseFloat(
    response.headers.get('X-Budget-Used-Percent') || '0'
  )

  // Show user-friendly messages
  const messages = {
    cache: 'Response from cache (saving costs)',
    cheaper_model: 'Using faster model (budget-friendly)',
    compressed: 'Optimized response (approaching daily limit)',
    queued: 'Request queued (daily limit reached)',
  }

  if (serviceMode && serviceMode !== 'normal') {
    showToast({
      title: 'Service Notice',
      message: messages[serviceMode],
      type: budgetPercent > 90 ? 'warning' : 'info',
    })
  }

  // Suggest upgrade if frequently degraded
  if (budgetPercent > 90) {
    showUpgradePrompt({
      message: 'You're using your plan heavily. Upgrade for more capacity?',
      plan: 'pro',
    })
  }
}`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Dashboard Integration */}
          <Section id="dashboard" title="Dashboard Integration" className="mb-12">
            <p className="text-muted-foreground mb-6">
              Real-time monitoring and analytics for proactive budget management.
            </p>

            <SubSection id="dashboard-api" title="Dashboard API Endpoints" className="mb-6">
              <CodeBlock
                code={`import { CostBudget, UsageAnalytics } from '@clarity-chat/token-optimization'

// Get current budget status
app.get('/api/budget/status', async (req, res) => {
  const budget = new CostBudget({
    userId: req.user.id,
    storage: redisClient,
  })

  const usage = await budget.getUsage()

  res.json({
    daily: {
      limit: usage.daily.limit,
      spent: usage.daily.spent,
      remaining: usage.daily.remaining,
      percentUsed: usage.daily.percentUsed,
      resetAt: usage.daily.resetAt,
    },
    monthly: {
      limit: usage.monthly.limit,
      spent: usage.monthly.spent,
      remaining: usage.monthly.remaining,
      percentUsed: usage.monthly.percentUsed,
      resetAt: usage.monthly.resetAt,
    },
    projectedMonthlySpend: usage.daily.spent * 30,
    status: usage.daily.percentUsed > 90 ? 'critical' :
            usage.daily.percentUsed > 70 ? 'warning' : 'healthy',
  })
})

// Get detailed usage analytics
app.get('/api/budget/analytics', async (req, res) => {
  const analytics = new UsageAnalytics({
    userId: req.user.id,
    storage: redisClient,
  })

  const { period = '7d' } = req.query

  const data = await analytics.getUsageHistory({
    period,
    groupBy: 'day',
  })

  res.json({
    history: data.map(day => ({
      date: day.date,
      requests: day.requestCount,
      tokens: day.tokenCount,
      cost: day.totalCost,
      avgCostPerRequest: day.totalCost / day.requestCount,
    })),
    summary: {
      totalRequests: data.reduce((sum, d) => sum + d.requestCount, 0),
      totalTokens: data.reduce((sum, d) => sum + d.tokenCount, 0),
      totalCost: data.reduce((sum, d) => sum + d.totalCost, 0),
      avgDailyCost: data.reduce((sum, d) => sum + d.totalCost, 0) / data.length,
    },
    trends: {
      requestGrowth: analytics.calculateGrowth(data, 'requests'),
      costGrowth: analytics.calculateGrowth(data, 'cost'),
      efficiency: analytics.calculateEfficiency(data),
    },
  })
})

// Get cost breakdown by endpoint
app.get('/api/budget/breakdown', async (req, res) => {
  const analytics = new UsageAnalytics({
    userId: req.user.id,
    storage: redisClient,
  })

  const breakdown = await analytics.getCostBreakdown({
    period: '30d',
  })

  res.json({
    byEndpoint: breakdown.endpoints.map(e => ({
      endpoint: e.path,
      requests: e.requestCount,
      totalCost: e.totalCost,
      avgCost: e.avgCost,
      percentOfTotal: e.costPercent,
    })),
    byModel: breakdown.models.map(m => ({
      model: m.name,
      requests: m.requestCount,
      totalTokens: m.tokenCount,
      totalCost: m.totalCost,
      avgTokensPerRequest: m.avgTokens,
    })),
    topExpensive: breakdown.topExpensiveRequests,
    optimization: {
      potentialSavings: breakdown.optimizationOpportunities.totalSavings,
      recommendations: breakdown.optimizationOpportunities.recommendations,
    },
  })
})`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="real-time-monitoring" title="Real-Time Monitoring" className="mb-6">
              <CodeBlock
                code={`import { WebSocketServer } from 'ws'
import { BudgetMonitor } from '@clarity-chat/token-optimization'

// WebSocket server for real-time updates
const wss = new WebSocketServer({ port: 8080 })

const monitor = new BudgetMonitor({
  storage: redisClient,
  checkInterval: 5000, // Check every 5 seconds
})

// Broadcast budget updates to connected clients
monitor.on('budget_update', async (update) => {
  const message = JSON.stringify({
    type: 'budget_update',
    userId: update.userId,
    daily: update.daily,
    monthly: update.monthly,
    timestamp: Date.now(),
  })

  // Send to user's connected clients
  wss.clients.forEach(client => {
    if (client.userId === update.userId && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
})

// Broadcast threshold alerts
monitor.on('threshold_reached', async (alert) => {
  const message = JSON.stringify({
    type: 'threshold_alert',
    userId: alert.userId,
    threshold: alert.threshold.percent,
    usage: alert.usage,
    severity: alert.threshold.percent > 90 ? 'critical' : 'warning',
    timestamp: Date.now(),
  })

  wss.clients.forEach(client => {
    if (client.userId === alert.userId && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
})

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
  const userId = req.headers['x-user-id']
  ws.userId = userId

  // Send initial budget status
  const budget = new CostBudget({ userId, storage: redisClient })
  budget.getUsage().then(usage => {
    ws.send(JSON.stringify({
      type: 'initial_state',
      usage,
    }))
  })
})

await monitor.start()`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Production Patterns */}
          <Section id="production" title="Production Patterns" className="mb-12">
            <SubSection id="distributed-counters" title="Distributed Rate Limiting" className="mb-6">
              <p className="text-muted-foreground mb-4">
                Use Redis for distributed rate limiting across multiple server instances.
              </p>

              <CodeBlock
                code={`import { RateLimiterRedis } from 'rate-limiter-flexible'
import { Cluster } from 'ioredis'

// Redis Cluster for high availability
const redisCluster = new Cluster([
  { host: 'redis-1', port: 6379 },
  { host: 'redis-2', port: 6379 },
  { host: 'redis-3', port: 6379 },
])

// Distributed rate limiter
const limiter = new RateLimiterRedis({
  storeClient: redisCluster,
  keyPrefix: 'rl:',
  points: 100,
  duration: 60,

  // Insurance limiter for Redis failure
  insuranceLimiter: new RateLimiterMemory({
    points: 120, // Slightly higher for failover
    duration: 60,
  }),

  // Block for 2 minutes on limit exceeded
  blockDuration: 120,

  // Execute action atomically
  execEvenly: true,
  execEvenlyMinDelayMs: 100,
})

// Middleware with error handling
export const distributedRateLimiter = async (req, res, next) => {
  const key = req.user.id

  try {
    const result = await limiter.consume(key, 1)

    // Add headers
    res.setHeader('X-RateLimit-Limit', 100)
    res.setHeader('X-RateLimit-Remaining', result.remainingPoints)
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + result.msBeforeNext))

    next()
  } catch (error) {
    if (error.remainingPoints !== undefined) {
      // Rate limit exceeded
      res.setHeader('Retry-After', Math.ceil(error.msBeforeNext / 1000))
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: error.msBeforeNext,
      })
    }

    // Redis error - fall back to in-memory limiter
    console.error('Rate limiter error:', error)
    next() // Allow request through on error
  }
}`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="sliding-window" title="Sliding Window Algorithm" className="mb-6">
              <p className="text-muted-foreground mb-4">
                More accurate rate limiting using sliding windows instead of fixed windows.
              </p>

              <CodeBlock
                code={`import { RateLimiterRedis } from 'rate-limiter-flexible'

// Sliding window rate limiter
// Distributes requests evenly across the time window
const slidingWindowLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl:sliding:',
  points: 100,
  duration: 60,

  // Sliding window configuration
  execEvenly: true,
  execEvenlyMinDelayMs: 600, // Minimum 600ms between requests (100 req/60s)
})

// Advanced sliding window with sub-windows
class SlidingWindowRateLimiter {
  private redis: RedisClient
  private windowSize: number
  private limit: number

  constructor(config) {
    this.redis = config.redis
    this.windowSize = config.windowMs
    this.limit = config.limit
  }

  async checkLimit(key: string): Promise<boolean> {
    const now = Date.now()
    const windowStart = now - this.windowSize

    // Redis transaction
    const pipeline = this.redis.pipeline()

    // Remove old entries outside window
    pipeline.zremrangebyscore(key, 0, windowStart)

    // Count requests in current window
    pipeline.zcard(key)

    // Add current request
    pipeline.zadd(key, now, \`\${now}-\${Math.random()}\`)

    // Set expiry
    pipeline.expire(key, Math.ceil(this.windowSize / 1000))

    const results = await pipeline.exec()
    const count = results[1][1] as number

    return count < this.limit
  }

  async consume(key: string): Promise<void> {
    const allowed = await this.checkLimit(key)

    if (!allowed) {
      throw new Error('Rate limit exceeded')
    }
  }
}

// Usage
const limiter = new SlidingWindowRateLimiter({
  redis: redisClient,
  windowMs: 60000, // 1 minute
  limit: 100,
})

app.use(async (req, res, next) => {
  try {
    await limiter.consume(req.user.id)
    next()
  } catch (error) {
    res.status(429).json({ error: 'Rate limit exceeded' })
  }
})`}
                language="typescript"
              />
            </SubSection>

            <SubSection id="multi-tier" title="Multi-Tier Rate Limiting" className="mb-6">
              <CodeBlock
                code={`// Combine multiple rate limiting tiers
class MultiTierRateLimiter {
  private tiers: Map<string, RateLimiterRedis>

  constructor() {
    this.tiers = new Map([
      // Tier 1: Per-second (burst protection)
      ['second', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:second:',
        points: 10,
        duration: 1,
      })],

      // Tier 2: Per-minute (short-term)
      ['minute', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:minute:',
        points: 100,
        duration: 60,
      })],

      // Tier 3: Per-hour (medium-term)
      ['hour', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:hour:',
        points: 1000,
        duration: 3600,
      })],

      // Tier 4: Per-day (long-term)
      ['day', new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: 'rl:day:',
        points: 10000,
        duration: 86400,
      })],
    ])
  }

  async checkAll(key: string): Promise<void> {
    const results = await Promise.allSettled(
      Array.from(this.tiers.entries()).map(([name, limiter]) =>
        limiter.consume(key).catch(error => ({
          tier: name,
          error,
        }))
      )
    )

    // Find first exceeded tier
    const exceeded = results.find(
      r => r.status === 'rejected' ||
           (r.status === 'fulfilled' && r.value.error)
    )

    if (exceeded) {
      const tier = exceeded.status === 'fulfilled'
        ? exceeded.value.tier
        : 'unknown'

      throw new Error(\`Rate limit exceeded: \${tier}\`)
    }
  }
}

// Apply multi-tier limiting
const multiTier = new MultiTierRateLimiter()

app.use(async (req, res, next) => {
  try {
    await multiTier.checkAll(req.user.id)
    next()
  } catch (error) {
    res.status(429).json({
      error: error.message,
      retryAfter: 60, // Conservative estimate
    })
  }
})`}
                language="typescript"
              />
            </SubSection>
          </Section>

          {/* Related Resources */}
          <Section id="related" title="Related Components & APIs" className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/cookbook/nodejs-backend-integration"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Server className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  Node.js Backend Integration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete guide to integrating token optimization into your backend
                </p>
              </Link>

              <Link
                href="/reference/components/token-optimization-dashboard"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenOptimizationDashboard
                </h3>
                <p className="text-sm text-muted-foreground">
                  Real-time monitoring and analytics dashboard
                </p>
              </Link>

              <Link
                href="/reference/components/token-roi-calculator"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <DollarSign className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenROICalculator
                </h3>
                <p className="text-sm text-muted-foreground">
                  Calculate ROI and cost savings from optimization
                </p>
              </Link>

              <Link
                href="/reference/components/token-cost-preview"
                className="group p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 transition-all hover:border-brand-500/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <Eye className="w-5 h-5 text-brand-500" />
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  TokenCostPreview
                </h3>
                <p className="text-sm text-muted-foreground">
                  Preview costs before sending requests
                </p>
              </Link>
            </div>
          </Section>

          {/* Best Practices */}
          <Section id="best-practices" title="Best Practices" className="mb-12">
            <div className="space-y-6">
              <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Security Best Practices
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8 list-disc">
                  <li>Always validate user identity before applying rate limits</li>
                  <li>Use Redis for distributed rate limiting in production</li>
                  <li>Implement both request-based and cost-based limits</li>
                  <li>Add request signing to prevent limit bypassing</li>
                  <li>Monitor for unusual patterns that might indicate abuse</li>
                  <li>Implement IP-based rate limiting as a backup</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-brand-500" />
                  Performance Best Practices
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8 list-disc">
                  <li>Use sliding windows for smoother rate limiting</li>
                  <li>Implement multi-tier limits (per-second, per-minute, per-day)</li>
                  <li>Cache budget status to reduce Redis queries</li>
                  <li>Use Redis pipelining for batch operations</li>
                  <li>Set appropriate TTLs on all Redis keys</li>
                  <li>Monitor Redis performance and scale accordingly</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  User Experience Best Practices
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8 list-disc">
                  <li>Return clear error messages with retry information</li>
                  <li>Implement graceful degradation instead of hard failures</li>
                  <li>Notify users proactively when approaching limits</li>
                  <li>Provide upgrade paths for users hitting limits</li>
                  <li>Show budget usage in real-time dashboards</li>
                  <li>Allow users to track their spending history</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg border border-border/50 bg-muted/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-500" />
                  Monitoring Best Practices
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8 list-disc">
                  <li>Track rate limit hit rates and adjust limits accordingly</li>
                  <li>Monitor Redis health and failover readiness</li>
                  <li>Set up alerts for unusual spending patterns</li>
                  <li>Log all rate limit violations for analysis</li>
                  <li>Review and optimize limits based on usage patterns</li>
                  <li>Track cost savings from rate limiting</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* Accessibility */}
          <Section id="accessibility" title="Accessibility" className="mb-12">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Keyboard className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    API Response Headers
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Rate limit APIs should include standard headers for programmatic access:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">X-RateLimit-Limit</code> - Maximum requests allowed</li>
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">X-RateLimit-Remaining</code> - Requests remaining</li>
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">X-RateLimit-Reset</code> - Timestamp when limit resets</li>
                    <li><code className="text-xs bg-muted px-1.5 py-0.5 rounded">Retry-After</code> - Seconds to wait before retrying</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <Eye className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">
                    Error Messages
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Provide clear, actionable error messages that help users understand
                    what happened and what they can do about it. Include retry timing,
                    current usage, and upgrade options when appropriate.
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border/50">
            <Link
              href="/reference/api"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              API Reference
            </Link>
            <Link
              href="/cookbook/nodejs-backend-integration"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-500 transition-colors"
            >
              Node.js Backend Integration
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
