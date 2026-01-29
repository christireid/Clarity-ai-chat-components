'use client'

import { useState } from 'react'
import { CheckCircle, Code, Server, Shield, ArrowRight, AlertTriangle, Zap } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'

export default function NodeJsBackendIntegrationCookbook() {
  const [activeFramework, setActiveFramework] = useState<'express' | 'fastify' | 'hono'>('express')

  return (
    <div className="space-y-12 max-w-4xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500/10 rounded-full">
          <Server className="w-4 h-4 text-brand-600" />
          <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
            Node.js Backend Integration
          </span>
        </div>

        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
          Add Token Optimization to Your Node.js API
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Integrate provider caching, compression, and smart routing into Express, Fastify, or Hono backends with
          middleware and best practices.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-6">
          <div className="space-y-1">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">50-70%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Cost Reduction</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">Middleware</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Drop-in Ready</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">Production</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Battle-Tested</div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">What You'll Learn</h2>
        <ul className="space-y-3">
          {[
            'Create optimization middleware for Express/Fastify/Hono',
            'Track costs per API endpoint',
            'Implement rate limiting with cost budgets',
            'Handle errors gracefully with fallbacks',
            'Monitor optimization in production',
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
            <li>Node.js 18+ installed</li>
            <li>Express, Fastify, or Hono backend</li>
            <li>
              Installed{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                @clarity-chat/token-optimization
              </code>
            </li>
            <li>
              Environment variable{' '}
              <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">ANTHROPIC_API_KEY</code>
            </li>
            <li>Basic understanding of middleware patterns</li>
          </ul>
        </div>
      </section>

      {/* Framework Selection */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Choose Your Framework</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Select your backend framework for framework-specific examples:
        </p>

        {/* Framework Tabs */}
        <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
          {[
            { id: 'express', label: 'Express', icon: Server },
            { id: 'fastify', label: 'Fastify', icon: Zap },
            { id: 'hono', label: 'Hono', icon: Code },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveFramework(id as typeof activeFramework)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeFramework === id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Framework Content */}
        <div className="space-y-6">
          {activeFramework === 'express' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Step 1: Install Dependencies</h3>
                <CodeBlock
                  language="bash"
                  code={`npm install express @anthropic-ai/sdk @clarity-chat/token-optimization`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 2: Create Optimization Middleware</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  This middleware automatically optimizes all AI requests:
                </p>

                <CodeBlock
                  language="typescript"
                  code={`// middleware/optimization.ts
import { Request, Response, NextFunction } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import {
  formatForCaching,
  compressWithLLMLingua,
  ModelRouter,
  CostTracker,
} from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const costTracker = new CostTracker()
const router = ModelRouter.builder().useClaudeModels().withStrategy('hybrid').build()

export interface OptimizedRequest extends Request {
  optimizedAI?: {
    sendMessage: (messages: any[]) => Promise<any>
    getCost: () => number
  }
}

export function optimizationMiddleware(
  req: OptimizedRequest,
  res: Response,
  next: NextFunction
) {
  // Attach optimization helpers to request
  req.optimizedAI = {
    async sendMessage(messages) {
      try {
        // Step 1: Format for caching
        const cached = await formatForCaching(messages, {
          provider: 'anthropic',
          minTokens: 1024,
        })

        // Step 2: Compress user context
        const lastMsg = messages[messages.length - 1]
        if (lastMsg.content.length > 500) {
          const compressed = await compressWithLLMLingua(lastMsg.content, {
            targetRatio: 0.5,
            qualityThreshold: 0.7,
          })
          if (compressed.quality >= 0.7) {
            lastMsg.content = compressed.compressed
          }
        }

        // Step 3: Route to optimal model
        const routing = await router.route(lastMsg.content)

        // Step 4: Call API
        const response = await anthropic.messages.create({
          model: routing.model,
          max_tokens: 1024,
          messages: cached.messages,
        })

        // Step 5: Track cost
        const cost =
          (response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000
        costTracker.recordRequest({
          cost,
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          model: routing.model,
          endpoint: req.path,
        })

        return {
          content: response.content[0].text,
          usage: response.usage,
          model: routing.model,
          cost,
        }
      } catch (error) {
        console.error('Optimization failed:', error)
        throw error
      }
    },

    getCost() {
      return costTracker.getTotalCost()
    },
  }

  next()
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 3: Add Middleware to App</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app.ts
import express from 'express'
import { optimizationMiddleware } from './middleware/optimization'

const app = express()

app.use(express.json())
app.use(optimizationMiddleware) // Add optimization to all routes

// Your routes here
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  try {
    const result = await req.optimizedAI!.sendMessage(messages)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'AI request failed' })
  }
})

// Cost monitoring endpoint
app.get('/api/metrics/cost', (req, res) => {
  const totalCost = req.optimizedAI!.getCost()
  res.json({ totalCost })
})

app.listen(3000, () => console.log('Server running on port 3000'))`}
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
                <h4 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">
                  Middleware Benefits
                </h4>
                <ul className="text-sm space-y-1 text-emerald-800 dark:text-emerald-200">
                  <li>✅ Drop-in optimization for all endpoints</li>
                  <li>✅ Automatic cost tracking per request</li>
                  <li>✅ No code changes in route handlers</li>
                  <li>✅ Centralized error handling</li>
                </ul>
              </div>
            </div>
          )}

          {activeFramework === 'fastify' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Step 1: Install Dependencies</h3>
                <CodeBlock
                  language="bash"
                  code={`npm install fastify @anthropic-ai/sdk @clarity-chat/token-optimization`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 2: Create Optimization Plugin</h3>
                <CodeBlock
                  language="typescript"
                  code={`// plugins/optimization.ts
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import Anthropic from '@anthropic-ai/sdk'
import {
  formatForCaching,
  compressWithLLMLingua,
  ModelRouter,
  CostTracker,
} from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const costTracker = new CostTracker()
const router = ModelRouter.builder().useClaudeModels().withStrategy('hybrid').build()

const optimizationPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('optimizedAI', {
    async sendMessage(messages: any[]) {
      // Step 1: Format for caching
      const cached = await formatForCaching(messages, {
        provider: 'anthropic',
        minTokens: 1024,
      })

      // Step 2: Compress
      const lastMsg = messages[messages.length - 1]
      if (lastMsg.content.length > 500) {
        const compressed = await compressWithLLMLingua(lastMsg.content, {
          targetRatio: 0.5,
          qualityThreshold: 0.7,
        })
        if (compressed.quality >= 0.7) {
          lastMsg.content = compressed.compressed
        }
      }

      // Step 3: Route
      const routing = await router.route(lastMsg.content)

      // Step 4: Call API
      const response = await anthropic.messages.create({
        model: routing.model,
        max_tokens: 1024,
        messages: cached.messages,
      })

      // Step 5: Track cost
      const cost =
        (response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000
      costTracker.recordRequest({ cost, model: routing.model })

      return {
        content: response.content[0].text,
        cost,
        model: routing.model,
      }
    },

    getCost() {
      return costTracker.getTotalCost()
    },
  })
}

export default fp(optimizationPlugin, { name: 'optimization' })`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 3: Register Plugin</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app.ts
import Fastify from 'fastify'
import optimizationPlugin from './plugins/optimization'

const fastify = Fastify({ logger: true })

// Register optimization plugin
await fastify.register(optimizationPlugin)

// Routes
fastify.post('/api/chat', async (request, reply) => {
  const { messages } = request.body as { messages: any[] }

  try {
    const result = await fastify.optimizedAI.sendMessage(messages)
    return result
  } catch (error) {
    reply.status(500).send({ error: 'AI request failed' })
  }
})

fastify.get('/api/metrics/cost', async () => {
  return { totalCost: fastify.optimizedAI.getCost() }
})

await fastify.listen({ port: 3000 })
console.log('Server running on port 3000')`}
                />
              </div>
            </div>
          )}

          {activeFramework === 'hono' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Step 1: Install Dependencies</h3>
                <CodeBlock
                  language="bash"
                  code={`npm install hono @anthropic-ai/sdk @clarity-chat/token-optimization`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 2: Create Optimization Middleware</h3>
                <CodeBlock
                  language="typescript"
                  code={`// middleware/optimization.ts
import { Context, Next } from 'hono'
import Anthropic from '@anthropic-ai/sdk'
import {
  formatForCaching,
  compressWithLLMLingua,
  ModelRouter,
  CostTracker,
} from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const costTracker = new CostTracker()
const router = ModelRouter.builder().useClaudeModels().withStrategy('hybrid').build()

export async function optimizationMiddleware(c: Context, next: Next) {
  c.set('optimizedAI', {
    async sendMessage(messages: any[]) {
      const cached = await formatForCaching(messages, {
        provider: 'anthropic',
        minTokens: 1024,
      })

      const lastMsg = messages[messages.length - 1]
      if (lastMsg.content.length > 500) {
        const compressed = await compressWithLLMLingua(lastMsg.content, {
          targetRatio: 0.5,
          qualityThreshold: 0.7,
        })
        if (compressed.quality >= 0.7) {
          lastMsg.content = compressed.compressed
        }
      }

      const routing = await router.route(lastMsg.content)

      const response = await anthropic.messages.create({
        model: routing.model,
        max_tokens: 1024,
        messages: cached.messages,
      })

      const cost =
        (response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000
      costTracker.recordRequest({ cost, model: routing.model })

      return {
        content: response.content[0].text,
        cost,
        model: routing.model,
      }
    },

    getCost() {
      return costTracker.getTotalCost()
    },
  })

  await next()
}`}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Step 3: Use Middleware in App</h3>
                <CodeBlock
                  language="typescript"
                  code={`// app.ts
import { Hono } from 'hono'
import { optimizationMiddleware } from './middleware/optimization'

const app = new Hono()

// Add optimization middleware
app.use('*', optimizationMiddleware)

// Routes
app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json()
  const optimizedAI = c.get('optimizedAI')

  try {
    const result = await optimizedAI.sendMessage(messages)
    return c.json(result)
  } catch (error) {
    return c.json({ error: 'AI request failed' }, 500)
  }
})

app.get('/api/metrics/cost', (c) => {
  const optimizedAI = c.get('optimizedAI')
  return c.json({ totalCost: optimizedAI.getCost() })
})

export default app`}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Rate Limiting with Cost Budgets */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Rate Limiting with Cost Budgets</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Protect your API from runaway costs with budget-based rate limiting:
        </p>

        <CodeBlock
          language="typescript"
          code={`// middleware/rateLimiting.ts
import { Request, Response, NextFunction } from 'express'
import { CostTracker } from '@clarity-chat/token-optimization'

const costTracker = new CostTracker()

// Budget: $10/hour per user
const HOURLY_BUDGET = 10
const userBudgets = new Map<string, { spent: number; resetAt: number }>()

export function costBasedRateLimiting(req: Request, res: Response, next: NextFunction) {
  const userId = req.headers['x-user-id'] as string

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' })
  }

  const now = Date.now()
  const userBudget = userBudgets.get(userId)

  // Reset budget if expired
  if (!userBudget || now > userBudget.resetAt) {
    userBudgets.set(userId, {
      spent: 0,
      resetAt: now + 3600000, // 1 hour
    })
  }

  const budget = userBudgets.get(userId)!

  // Check if budget exceeded
  if (budget.spent >= HOURLY_BUDGET) {
    return res.status(429).json({
      error: 'Cost budget exceeded',
      spent: budget.spent,
      limit: HOURLY_BUDGET,
      resetAt: new Date(budget.resetAt).toISOString(),
    })
  }

  // Hook into response to track actual cost
  const originalJson = res.json.bind(res)
  res.json = function (body: any) {
    if (body.cost) {
      budget.spent += body.cost
      userBudgets.set(userId, budget)
    }
    return originalJson(body)
  }

  next()
}

// Usage in Express app
app.use('/api/chat', costBasedRateLimiting)
app.post('/api/chat', async (req, res) => {
  const result = await req.optimizedAI!.sendMessage(req.body.messages)
  res.json(result) // Cost automatically tracked
})`}
        />

        <div className="mt-6 bg-brand-500/10 border border-brand-500/30 p-4 rounded-lg">
          <h4 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">Budget Protection Benefits</h4>
          <ul className="text-sm space-y-1 text-brand-800 dark:text-brand-200">
            <li>✅ Per-user cost limits prevent abuse</li>
            <li>✅ Automatic reset after time window</li>
            <li>✅ Clear error messages with reset time</li>
            <li>✅ Works with existing rate limiting</li>
          </ul>
        </div>
      </section>

      {/* Error Handling */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Error Handling & Fallbacks</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Handle failures gracefully with fallback strategies:
        </p>

        <CodeBlock
          language="typescript"
          code={`// middleware/errorHandling.ts
import { formatForCaching, compressWithLLMLingua, ModelRouter } from '@clarity-chat/token-optimization'

export async function sendMessageWithFallbacks(messages: any[]) {
  try {
    // Attempt full optimization
    return await sendOptimizedMessage(messages)
  } catch (error) {
    console.warn('Full optimization failed, trying fallback:', error)

    try {
      // Fallback 1: Skip compression, keep caching + routing
      const cached = await formatForCaching(messages, { provider: 'anthropic', minTokens: 1024 })
      const routing = await router.route(messages[messages.length - 1].content)
      return await anthropic.messages.create({
        model: routing.model,
        max_tokens: 1024,
        messages: cached.messages,
      })
    } catch (fallbackError) {
      console.warn('Fallback 1 failed, trying minimal fallback:', fallbackError)

      // Fallback 2: No optimization, just send
      return await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages,
      })
    }
  }
}

async function sendOptimizedMessage(messages: any[]) {
  const cached = await formatForCaching(messages, { provider: 'anthropic', minTokens: 1024 })
  const lastMsg = messages[messages.length - 1]

  if (lastMsg.content.length > 500) {
    const compressed = await compressWithLLMLingua(lastMsg.content, {
      targetRatio: 0.5,
      qualityThreshold: 0.7,
    })
    if (compressed.quality >= 0.7) {
      lastMsg.content = compressed.compressed
    }
  }

  const routing = await router.route(lastMsg.content)

  return await anthropic.messages.create({
    model: routing.model,
    max_tokens: 1024,
    messages: cached.messages,
  })
}`}
        />
      </section>

      {/* Production Monitoring */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Production Monitoring</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Track optimization metrics in production with structured logging:
        </p>

        <CodeBlock
          language="typescript"
          code={`// lib/monitoring.ts
import { CostTracker } from '@clarity-chat/token-optimization'

const costTracker = new CostTracker()

export function logOptimizationMetrics(req: any, result: any) {
  const metrics = {
    timestamp: new Date().toISOString(),
    endpoint: req.path,
    userId: req.headers['x-user-id'],
    cost: result.cost,
    model: result.model,
    inputTokens: result.usage?.input_tokens,
    outputTokens: result.usage?.output_tokens,
    cacheHit: result.usage?.cache_read_input_tokens > 0,
    totalCost: costTracker.getTotalCost(),
  }

  // Log to your observability platform
  console.log('OPTIMIZATION_METRICS', JSON.stringify(metrics))

  // Optional: Send to external monitoring
  // await sendToDatadog(metrics)
  // await sendToNewRelic(metrics)
}

// Usage
app.post('/api/chat', async (req, res) => {
  const result = await req.optimizedAI!.sendMessage(req.body.messages)
  logOptimizationMetrics(req, result)
  res.json(result)
})`}
        />

        <div className="mt-6 bg-neutral-50 dark:bg-neutral-900 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold mb-3">Key Metrics to Monitor</h3>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Cost per request:</strong> Track average and p95 costs
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Cache hit rate:</strong> Monitor caching effectiveness
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Model distribution:</strong> % queries per model
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Error rate:</strong> Failed optimization attempts
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Troubleshooting */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: High latency after adding optimization
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> API responses 200-300ms slower
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Compression and routing add ~50-100ms. For latency-sensitive endpoints,
              disable compression and use caching + routing only.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Cost tracking incorrect
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Reported costs don't match Anthropic bills
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Update pricing constants regularly. Pricing changes, and cached token
              prices differ from regular prices.
            </p>
          </div>

          <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Problem: Memory leaks in production
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
              <strong>Symptoms:</strong> Memory grows over time
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <strong>Solution:</strong> Clear old entries from userBudgets Map periodically. Add a cleanup
              interval that removes expired entries.
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
            href="/cookbook/enterprise-production-pipeline"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Set up enterprise production pipeline
          </Link>
          <Link
            href="/cookbook/achieving-50-percent-reduction"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            Learn the complete optimization strategy
          </Link>
          <Link
            href="/reference/classes/cost-tracker"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            CostTracker API Reference
          </Link>
          <Link
            href="/reference/classes/model-router"
            className="flex items-center gap-2 text-brand-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" />
            ModelRouter API Reference
          </Link>
        </div>
      </section>

      {/* Real-World Example */}
      <section className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4">Real-World Example: API Gateway</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Scenario</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Express-based API gateway serving 100K requests/day across multiple AI endpoints
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Implementation</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Optimization middleware on all AI routes</li>
              <li>• Per-user cost budgets ($50/day limit)</li>
              <li>• Structured logging to Datadog</li>
              <li>• Fallback chains for reliability</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Results</h3>
            <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
              <li>• Before: $3,000/day (all Sonnet)</li>
              <li>• After: $750/day (optimized routing)</li>
              <li>• <strong>75% cost reduction</strong></li>
              <li>• Added 50ms latency (acceptable trade-off)</li>
              <li>• Zero runaway cost incidents (budget protection)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
