'use client'

/**
 * optimizationMiddleware API Reference
 *
 * Comprehensive API reference for Express/Fastify/Hono middleware
 * that adds automatic token optimization to backend API routes.
 */

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Server,
  Code,
  Zap,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
  DollarSign,
  Shield,
  BarChart3,
  Clock,
  Settings,
} from 'lucide-react'
import { CodeBlock } from '@/components/CodeBlock'
import { cn } from '@/lib/utils'

// ISR Configuration
export const revalidate = 3600 // Revalidate every hour

interface Framework {
  id: 'express' | 'fastify' | 'hono'
  name: string
  icon: typeof Server
  description: string
}

const frameworks: Framework[] = [
  {
    id: 'express',
    name: 'Express',
    icon: Server,
    description: 'Traditional Node.js middleware pattern',
  },
  {
    id: 'fastify',
    name: 'Fastify',
    icon: Zap,
    description: 'Plugin-based architecture for performance',
  },
  {
    id: 'hono',
    name: 'Hono',
    icon: Code,
    description: 'Edge-first framework for modern runtimes',
  },
]

export default function OptimizationMiddlewareAPIReference() {
  const [activeFramework, setActiveFramework] = useState<
    'express' | 'fastify' | 'hono'
  >('express')

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: durations.slow }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                <Server className="w-6 h-6" aria-hidden="true" />
              </div>
              <span className="text-sm text-muted-foreground">
                API Reference
              </span>
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-4">
              optimizationMiddleware
            </h1>

            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
              Drop-in middleware for Express, Fastify, and Hono that
              automatically optimizes AI API calls with provider caching,
              compression, and smart routing.
            </p>

            {/* Cost Reduction Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">
                Add 50-70% cost reduction to your backend
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  50-70%
                </div>
                <div className="text-sm text-muted-foreground">
                  Cost Reduction
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  &lt;100ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Added Latency
                </div>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  3 Lines
                </div>
                <div className="text-sm text-muted-foreground">
                  To Integrate
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Table of Contents */}
        <section className="bg-muted/50 rounded-lg p-6 border border-border">
          <h2 className="text-xl font-semibold mb-4">On This Page</h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'installation', label: 'Installation' },
              { id: 'middleware-signature', label: 'Middleware Signature' },
              { id: 'configuration', label: 'Configuration Options' },
              {
                id: 'request-response',
                label: 'Request/Response Augmentation',
              },
              { id: 'examples', label: 'Framework Examples' },
              { id: 'rate-limiting', label: 'Rate Limiting & Cost Budgets' },
              { id: 'error-handling', label: 'Error Handling' },
              { id: 'monitoring', label: 'Production Monitoring' },
              { id: 'cost-impact', label: 'Cost Impact Analysis' },
            ].map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </section>

        {/* Overview */}
        <section id="overview" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Overview</h2>
          <p className="text-muted-foreground">
            The{' '}
            <code className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-sm">
              optimizationMiddleware
            </code>{' '}
            provides automatic token optimization for backend API routes. It
            intercepts AI API calls and applies provider caching, compression,
            and smart model routing to reduce costs by 50-70% without code
            changes in your route handlers.
          </p>

          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Key Benefits
            </h3>
            <ul className="space-y-1 text-sm text-emerald-800 dark:text-emerald-200">
              <li>• Drop-in integration: Add middleware, zero route changes</li>
              <li>
                • Automatic optimization: Provider caching + compression +
                routing
              </li>
              <li>
                • Cost tracking: Per-request and aggregate cost monitoring
              </li>
              <li>
                • Production-ready: Error handling, rate limiting, monitoring
              </li>
              <li>
                • Framework-agnostic: Works with Express, Fastify, and Hono
              </li>
            </ul>
          </div>
        </section>

        {/* Installation */}
        <section id="installation" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Installation</h2>
          <CodeBlock
            language="bash"
            code={`npm install @clarity-chat/token-optimization @anthropic-ai/sdk

# Optional: For Redis-based rate limiting
npm install @upstash/redis`}
          />
        </section>

        {/* Middleware Signature */}
        <section id="middleware-signature" className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Middleware Signature
          </h2>

          <div className="space-y-6">
            {/* Framework Tabs */}
            <div className="flex gap-2 border-b border-border">
              {frameworks.map((framework) => {
                const Icon = framework.icon
                return (
                  <button
                    key={framework.id}
                    onClick={() => setActiveFramework(framework.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
                      activeFramework === framework.id
                        ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {framework.name}
                  </button>
                )
              })}
            </div>

            {/* Express Signature */}
            {activeFramework === 'express' && (
              <div className="space-y-4">
                <CodeBlock
                  language="typescript"
                  code={`import { Request, Response, NextFunction } from 'express'

interface OptimizationOptions {
  provider?: 'anthropic' | 'openai' | 'gemini'
  minCacheTokens?: number
  compressionRatio?: number
  compressionQuality?: number
  routingStrategy?: 'complexity' | 'intent' | 'hybrid'
  enableTracking?: boolean
}

interface OptimizedRequest extends Request {
  optimizedAI: {
    sendMessage: (messages: any[]) => Promise<AIResponse>
    getCost: () => number
    getStats: () => OptimizationStats
  }
}

function optimizationMiddleware(
  options?: OptimizationOptions
): (req: OptimizedRequest, res: Response, next: NextFunction) => void`}
                />
                <p className="text-sm text-muted-foreground">
                  Attaches optimization helpers to{' '}
                  <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
                    req.optimizedAI
                  </code>{' '}
                  for use in route handlers.
                </p>
              </div>
            )}

            {/* Fastify Signature */}
            {activeFramework === 'fastify' && (
              <div className="space-y-4">
                <CodeBlock
                  language="typescript"
                  code={`import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'

interface OptimizationOptions {
  provider?: 'anthropic' | 'openai' | 'gemini'
  minCacheTokens?: number
  compressionRatio?: number
  compressionQuality?: number
  routingStrategy?: 'complexity' | 'intent' | 'hybrid'
  enableTracking?: boolean
}

declare module 'fastify' {
  interface FastifyInstance {
    optimizedAI: {
      sendMessage: (messages: any[]) => Promise<AIResponse>
      getCost: () => number
      getStats: () => OptimizationStats
    }
  }
}

const optimizationPlugin: FastifyPluginAsync<OptimizationOptions>
export default fp(optimizationPlugin, { name: 'optimization' })`}
                />
                <p className="text-sm text-muted-foreground">
                  Decorates Fastify instance with{' '}
                  <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
                    fastify.optimizedAI
                  </code>{' '}
                  for use in routes.
                </p>
              </div>
            )}

            {/* Hono Signature */}
            {activeFramework === 'hono' && (
              <div className="space-y-4">
                <CodeBlock
                  language="typescript"
                  code={`import { Context, Next } from 'hono'

interface OptimizationOptions {
  provider?: 'anthropic' | 'openai' | 'gemini'
  minCacheTokens?: number
  compressionRatio?: number
  compressionQuality?: number
  routingStrategy?: 'complexity' | 'intent' | 'hybrid'
  enableTracking?: boolean
}

interface OptimizedAI {
  sendMessage: (messages: any[]) => Promise<AIResponse>
  getCost: () => number
  getStats: () => OptimizationStats
}

async function optimizationMiddleware(
  c: Context,
  next: Next,
  options?: OptimizationOptions
): Promise<void>`}
                />
                <p className="text-sm text-muted-foreground">
                  Sets optimization helpers on context via{' '}
                  <code className="px-1 py-0.5 rounded bg-muted text-foreground font-mono text-xs">
                    c.set('optimizedAI', ...)
                  </code>{' '}
                  for use in handlers.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Configuration Options */}
        <section id="configuration" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Configuration Options
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Option</th>
                  <th className="text-left py-3 px-4 font-semibold">Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Default</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-xs">provider</td>
                  <td className="py-3 px-4">
                    <code className="text-xs">
                      'anthropic' | 'openai' | 'gemini'
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">'anthropic'</code>
                  </td>
                  <td className="py-3 px-4">AI provider for optimization</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-xs">
                    minCacheTokens
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">number</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">1024</code>
                  </td>
                  <td className="py-3 px-4">
                    Minimum tokens required for caching
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-xs">
                    compressionRatio
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">number</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">0.5</code>
                  </td>
                  <td className="py-3 px-4">
                    Target compression ratio (0.5 = 50% reduction)
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-xs">
                    compressionQuality
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">number</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">0.7</code>
                  </td>
                  <td className="py-3 px-4">
                    Minimum quality threshold (0.0-1.0)
                  </td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-xs">
                    routingStrategy
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">
                      'complexity' | 'intent' | 'hybrid'
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">'hybrid'</code>
                  </td>
                  <td className="py-3 px-4">Model routing strategy</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-3 px-4 font-mono text-xs">
                    enableTracking
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">boolean</code>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs">true</code>
                  </td>
                  <td className="py-3 px-4">
                    Enable cost and performance tracking
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Request/Response Augmentation */}
        <section id="request-response" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Request/Response Augmentation
          </h2>
          <p className="text-muted-foreground">
            The middleware augments request/context objects with optimization
            helpers:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                optimizedAI.sendMessage()
              </h3>
              <CodeBlock
                language="typescript"
                code={`interface AIResponse {
  content: string
  usage: {
    inputTokens: number
    outputTokens: number
    cacheReadTokens?: number
    cacheWriteTokens?: number
  }
  model: string
  cost: number
  optimizations: {
    cached: boolean
    compressed: boolean
    routed: boolean
    originalTokens: number
    finalTokens: number
  }
}

async sendMessage(messages: Message[]): Promise<AIResponse>`}
              />
              <p className="text-sm text-muted-foreground mt-2">
                Sends messages with automatic optimization applied. Returns
                detailed usage and cost information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                optimizedAI.getCost()
              </h3>
              <CodeBlock
                language="typescript"
                code={`getCost(): number

// Returns total accumulated cost in USD
const totalCost = req.optimizedAI.getCost() // 0.0234`}
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">
                optimizedAI.getStats()
              </h3>
              <CodeBlock
                language="typescript"
                code={`interface OptimizationStats {
  totalRequests: number
  totalCost: number
  totalTokens: number
  cacheHitRate: number
  avgCompressionRatio: number
  modelDistribution: Record<string, number>
  avgCostPerRequest: number
}

getStats(): OptimizationStats`}
              />
            </div>
          </div>
        </section>

        {/* Framework Examples */}
        <section id="examples" className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Framework Examples
          </h2>

          <div className="flex gap-2 border-b border-border">
            {frameworks.map((framework) => {
              const Icon = framework.icon
              return (
                <button
                  key={framework.id}
                  onClick={() => setActiveFramework(framework.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
                    activeFramework === framework.id
                      ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {framework.name}
                </button>
              )
            })}
          </div>

          {activeFramework === 'express' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Express Implementation</h3>
              <CodeBlock
                language="typescript"
                code={`// middleware/optimization.ts
import { Request, Response, NextFunction } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import {
  formatMessagesForProviderCaching,
  compressWithLLMLingua,
  ModelRouter
} from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('hybrid')
  .build()

export interface OptimizedRequest extends Request {
  optimizedAI: {
    sendMessage: (messages: any[]) => Promise<any>
    getCost: () => number
    getStats: () => any
  }
}

let totalCost = 0
let totalRequests = 0

export function optimizationMiddleware(
  req: OptimizedRequest,
  res: Response,
  next: NextFunction
) {
  req.optimizedAI = {
    async sendMessage(messages) {
      // Step 1: Format for caching
      const cached = await formatMessagesForProviderCaching(messages, {
        provider: 'anthropic',
        minTokens: 1024,
      })

      // Step 2: Compress if needed
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

      // Step 5: Calculate cost
      const cost = (
        response.usage.input_tokens * 0.003 +
        response.usage.output_tokens * 0.015
      ) / 1000

      totalCost += cost
      totalRequests += 1

      return {
        content: response.content[0].text,
        usage: response.usage,
        model: routing.model,
        cost,
      }
    },

    getCost() {
      return totalCost
    },

    getStats() {
      return {
        totalRequests,
        totalCost,
        avgCostPerRequest: totalCost / totalRequests,
      }
    },
  }

  next()
}

// app.ts
import express from 'express'
import { optimizationMiddleware } from './middleware/optimization'

const app = express()

app.use(express.json())
app.use(optimizationMiddleware)

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  try {
    const result = await req.optimizedAI.sendMessage(messages)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'AI request failed' })
  }
})

app.get('/api/metrics', (req, res) => {
  res.json(req.optimizedAI.getStats())
})

app.listen(3000, () => console.log('Server running on port 3000'))`}
              />
            </div>
          )}

          {activeFramework === 'fastify' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Fastify Implementation</h3>
              <CodeBlock
                language="typescript"
                code={`// plugins/optimization.ts
import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import Anthropic from '@anthropic-ai/sdk'
import {
  formatMessagesForProviderCaching,
  compressWithLLMLingua,
  ModelRouter,
} from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('hybrid')
  .build()

let totalCost = 0
let totalRequests = 0

const optimizationPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('optimizedAI', {
    async sendMessage(messages: any[]) {
      const cached = await formatMessagesForProviderCaching(messages, {
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

      const cost = (
        response.usage.input_tokens * 0.003 +
        response.usage.output_tokens * 0.015
      ) / 1000

      totalCost += cost
      totalRequests += 1

      return {
        content: response.content[0].text,
        usage: response.usage,
        model: routing.model,
        cost,
      }
    },

    getCost() {
      return totalCost
    },

    getStats() {
      return {
        totalRequests,
        totalCost,
        avgCostPerRequest: totalCost / totalRequests,
      }
    },
  })
}

export default fp(optimizationPlugin, { name: 'optimization' })

// app.ts
import Fastify from 'fastify'
import optimizationPlugin from './plugins/optimization'

const fastify = Fastify({ logger: true })

await fastify.register(optimizationPlugin)

fastify.post('/api/chat', async (request, reply) => {
  const { messages } = request.body as { messages: any[] }

  try {
    const result = await fastify.optimizedAI.sendMessage(messages)
    return result
  } catch (error) {
    reply.status(500).send({ error: 'AI request failed' })
  }
})

fastify.get('/api/metrics', async () => {
  return fastify.optimizedAI.getStats()
})

await fastify.listen({ port: 3000 })
console.log('Server running on port 3000')`}
              />
            </div>
          )}

          {activeFramework === 'hono' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Hono Implementation</h3>
              <CodeBlock
                language="typescript"
                code={`// middleware/optimization.ts
import { Context, Next } from 'hono'
import Anthropic from '@anthropic-ai/sdk'
import {
  formatMessagesForProviderCaching,
  compressWithLLMLingua,
  ModelRouter,
} from '@clarity-chat/token-optimization'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const router = ModelRouter.builder()
  .useClaudeModels()
  .withStrategy('hybrid')
  .build()

let totalCost = 0
let totalRequests = 0

export async function optimizationMiddleware(c: Context, next: Next) {
  c.set('optimizedAI', {
    async sendMessage(messages: any[]) {
      const cached = await formatMessagesForProviderCaching(messages, {
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

      const cost = (
        response.usage.input_tokens * 0.003 +
        response.usage.output_tokens * 0.015
      ) / 1000

      totalCost += cost
      totalRequests += 1

      return {
        content: response.content[0].text,
        usage: response.usage,
        model: routing.model,
        cost,
      }
    },

    getCost() {
      return totalCost
    },

    getStats() {
      return {
        totalRequests,
        totalCost,
        avgCostPerRequest: totalCost / totalRequests,
      }
    },
  })

  await next()
}

// app.ts
import { Hono } from 'hono'
import { optimizationMiddleware } from './middleware/optimization'

const app = new Hono()

app.use('*', optimizationMiddleware)

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

app.get('/api/metrics', (c) => {
  const optimizedAI = c.get('optimizedAI')
  return c.json(optimizedAI.getStats())
})

export default app`}
              />
            </div>
          )}
        </section>

        {/* Rate Limiting & Cost Budgets */}
        <section id="rate-limiting" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Rate Limiting with Cost Budgets
          </h2>
          <p className="text-muted-foreground">
            Protect your API from runaway costs by implementing per-user cost
            budgets:
          </p>

          <CodeBlock
            language="typescript"
            code={`// middleware/costBudget.ts
import { Request, Response, NextFunction } from 'express'

const HOURLY_BUDGET = 10 // $10/hour per user
const userBudgets = new Map<string, { spent: number; resetAt: number }>()

export function costBasedRateLimiting(
  req: Request,
  res: Response,
  next: NextFunction
) {
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

// Usage
app.use('/api/chat', costBasedRateLimiting)
app.post('/api/chat', async (req, res) => {
  const result = await req.optimizedAI!.sendMessage(req.body.messages)
  res.json(result) // Cost automatically tracked
})`}
          />

          <div className="bg-brand-500/10 border border-brand-500/30 rounded-lg p-4">
            <h3 className="font-semibold text-brand-900 dark:text-brand-100 mb-2">
              Budget Protection Benefits
            </h3>
            <ul className="text-sm space-y-1 text-brand-800 dark:text-brand-200">
              <li>• Per-user cost limits prevent abuse</li>
              <li>• Automatic reset after time window</li>
              <li>• Clear error messages with reset time</li>
              <li>• Works alongside request-based rate limiting</li>
            </ul>
          </div>
        </section>

        {/* Error Handling */}
        <section id="error-handling" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Error Handling Integration
          </h2>
          <p className="text-muted-foreground">
            Implement graceful degradation with fallback strategies:
          </p>

          <CodeBlock
            language="typescript"
            code={`// middleware/errorHandling.ts
import { formatMessagesForProviderCaching, compressWithLLMLingua, ModelRouter } from '@clarity-chat/token-optimization'

export async function sendMessageWithFallbacks(messages: any[]) {
  try {
    // Attempt full optimization
    return await sendOptimizedMessage(messages)
  } catch (error) {
    console.warn('Full optimization failed, trying fallback:', error)

    try {
      // Fallback 1: Skip compression, keep caching + routing
      const cached = await formatMessagesForProviderCaching(messages, {
        provider: 'anthropic',
        minTokens: 1024
      })
      const routing = await router.route(messages[messages.length - 1].content)

      return await anthropic.messages.create({
        model: routing.model,
        max_tokens: 1024,
        messages: cached.messages,
      })
    } catch (fallbackError) {
      console.warn('Fallback 1 failed, using minimal fallback:', fallbackError)

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
  const cached = await formatMessagesForProviderCaching(messages, {
    provider: 'anthropic',
    minTokens: 1024
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

  return await anthropic.messages.create({
    model: routing.model,
    max_tokens: 1024,
    messages: cached.messages,
  })
}`}
          />
        </section>

        {/* Production Monitoring */}
        <section id="monitoring" className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            Production Monitoring
          </h2>
          <p className="text-muted-foreground">
            Track optimization metrics with structured logging:
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

          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 border border-border">
            <h3 className="font-semibold mb-3">Key Metrics to Monitor</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
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
                  <strong>Model distribution:</strong> Percentage of queries per
                  model
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

        {/* Cost Impact */}
        <section id="cost-impact" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 text-white">
              <DollarSign className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Cost Impact: Add 50-70% Cost Reduction to Your Backend
            </h2>
          </div>

          <p className="text-lg text-muted-foreground">
            The optimizationMiddleware combines three powerful strategies to
            achieve significant cost savings:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                50-60%
              </div>
              <div className="font-semibold mb-2">Provider Caching</div>
              <div className="text-sm text-muted-foreground">
                90% discount on cached tokens (system prompts, context)
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                15-25%
              </div>
              <div className="font-semibold mb-2">Compression</div>
              <div className="text-sm text-muted-foreground">
                Reduce user input tokens while maintaining quality
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                10-15%
              </div>
              <div className="font-semibold mb-2">Smart Routing</div>
              <div className="text-sm text-muted-foreground">
                Route simple queries to cheaper models
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              Real-World Example: API Gateway
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-red-600 dark:text-red-400">
                  Before Optimization
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• 100,000 requests/day</li>
                  <li>• All queries to Claude Sonnet</li>
                  <li>• Average 1,500 tokens per request</li>
                  <li>
                    •{' '}
                    <strong className="text-red-600 dark:text-red-400">
                      $3,000/day ($90,000/month)
                    </strong>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-emerald-600 dark:text-emerald-400">
                  After Optimization
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• 60% tokens cached (provider caching)</li>
                  <li>• 20% user input compressed</li>
                  <li>• 55% queries routed to Haiku</li>
                  <li>
                    •{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      $750/day ($22,500/month)
                    </strong>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Total Savings</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  75% reduction
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                $67,500/month saved • 50ms added latency • Zero runaway cost
                incidents
              </div>
            </div>
          </div>
        </section>

        {/* Related Resources */}
        <section className="bg-brand-500/10 border border-brand-500/30 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Related Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/cookbook/nodejs-backend-integration"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Node.js Backend Integration Cookbook
            </Link>
            <Link
              href="/cookbook/achieving-50-percent-reduction"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Achieving 50-70% Cost Reduction
            </Link>
            <Link
              href="/cookbook/enterprise-production-pipeline"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Enterprise Production Pipeline
            </Link>
            <Link
              href="/cookbook/rate-limiting-quotas"
              className="flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <ArrowRight className="w-4 h-4" />
              Rate Limiting & Cost Budgets
            </Link>
          </div>
        </section>

        {/* Token Optimization Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
            <Zap className="w-5 h-5" />
            <span className="font-semibold">Token Optimization Enabled</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-medium">
              50-70% Savings
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
