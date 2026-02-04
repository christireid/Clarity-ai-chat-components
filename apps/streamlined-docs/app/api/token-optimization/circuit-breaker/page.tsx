'use client'

/**
 * CircuitBreaker API Documentation
 *
 * Documentation for CircuitBreaker utility and useCircuitBreaker hook.
 * Implements resilience patterns for preventing cascading failures in AI applications.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Shield,
  Copy,
  Check,
  ChevronRight,
  AlertCircle,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
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
// Props/Return Table Components
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  {
    id: 'circuit-breaker',
    title: 'CircuitBreaker Class',
    children: [
      { id: 'circuit-constructor', title: 'Constructor' },
      { id: 'circuit-options', title: 'Options' },
      { id: 'circuit-methods', title: 'Methods' },
      { id: 'circuit-states', title: 'States' },
    ],
  },
  {
    id: 'use-circuit-breaker',
    title: 'useCircuitBreaker Hook',
    children: [
      { id: 'hook-options', title: 'Options' },
      { id: 'hook-returns', title: 'Returns' },
    ],
  },
  {
    id: 'utilities',
    title: 'Utility Functions',
    children: [
      { id: 'create-ai-circuit-breaker', title: 'createAICircuitBreaker' },
      { id: 'with-circuit-breaker', title: 'withCircuitBreaker' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Protection' },
      { id: 'example-react', title: 'React Hook Usage' },
      { id: 'example-ai-provider', title: 'AI Provider Protection' },
      { id: 'example-fallback', title: 'Fallback Strategy' },
    ],
  },
  { id: 'circuit-states-detail', title: 'Circuit States' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'related', title: 'Related APIs' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const circuitBreakerOptionsProps: PropDefinition[] = [
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Name for logging and monitoring. Identifies the circuit in callbacks.',
  },
  {
    name: 'failureThreshold',
    type: 'number',
    default: '5',
    description: 'Number of failures before opening circuit.',
  },
  {
    name: 'resetTimeout',
    type: 'number',
    default: '30000',
    description: 'Time in ms before attempting reset (transitioning to HALF_OPEN).',
  },
  {
    name: 'successThreshold',
    type: 'number',
    default: '2',
    description: 'Number of successful calls to close circuit from HALF_OPEN state.',
  },
  {
    name: 'windowDuration',
    type: 'number',
    default: '60000',
    description: 'Sliding window duration in ms for failure counting.',
  },
  {
    name: 'onStateChange',
    type: '(state: CircuitState, name: string) => void',
    description: 'Callback when circuit state changes.',
  },
  {
    name: 'onOpen',
    type: '(name: string, failureCount: number, lastError?: Error) => void',
    description: 'Callback when circuit opens.',
  },
  {
    name: 'onClose',
    type: '(name: string) => void',
    description: 'Callback when circuit closes.',
  },
  {
    name: 'onReject',
    type: '(name: string) => void',
    description: 'Callback when request is rejected due to open circuit.',
  },
  {
    name: 'isFailure',
    type: '(error: Error) => boolean',
    description: 'Optional check if error should count as failure. Default: all errors count.',
  },
]

const circuitBreakerMethodsProps: PropDefinition[] = [
  {
    name: 'execute',
    type: '<T>(fn: () => Promise<T>) => Promise<T>',
    description: 'Execute a function through the circuit breaker. Throws CircuitOpenError if circuit is open.',
  },
  {
    name: 'getStats',
    type: '() => CircuitBreakerStats',
    description: 'Get current circuit statistics including state, failures, and successes.',
  },
  {
    name: 'getState',
    type: '() => CircuitState',
    description: 'Get current circuit state (CLOSED, OPEN, or HALF_OPEN).',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Manually reset the circuit to CLOSED state.',
  },
  {
    name: 'isAllowed',
    type: '() => boolean',
    description: 'Check if circuit allows requests.',
  },
]

const hookOptionsProps: PropDefinition[] = [
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Name for the circuit breaker.',
  },
  {
    name: 'failureThreshold',
    type: 'number',
    default: '5',
    description: 'Number of failures before opening circuit.',
  },
  {
    name: 'resetTimeout',
    type: 'number',
    default: '30000',
    description: 'Time in ms before attempting reset.',
  },
  {
    name: 'successThreshold',
    type: 'number',
    default: '2',
    description: 'Successful calls needed to close from HALF_OPEN.',
  },
  {
    name: 'onStateChange',
    type: '(state: CircuitState, name: string) => void',
    description: 'Callback when state changes. Also updates React state.',
  },
]

const hookReturnsProps: PropDefinition[] = [
  {
    name: 'execute',
    type: '<T>(fn: () => Promise<T>) => Promise<T>',
    description: 'Execute a function through the circuit breaker.',
  },
  {
    name: 'state',
    type: 'CircuitState',
    description: 'Current circuit state (reactive).',
  },
  {
    name: 'stats',
    type: 'CircuitBreakerStats',
    description: 'Current statistics (reactive).',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Manually reset the circuit.',
  },
  {
    name: 'isAllowed',
    type: 'boolean',
    description: 'Whether circuit allows requests.',
  },
  {
    name: 'breaker',
    type: 'CircuitBreaker',
    description: 'The underlying CircuitBreaker instance.',
  },
]

const statsProps: PropDefinition[] = [
  {
    name: 'state',
    type: 'CircuitState',
    description: 'Current state: CLOSED, OPEN, or HALF_OPEN.',
  },
  {
    name: 'failures',
    type: 'number',
    description: 'Number of failures in current window.',
  },
  {
    name: 'successes',
    type: 'number',
    description: 'Number of successes since last state change.',
  },
  {
    name: 'lastFailure',
    type: 'number | undefined',
    description: 'Timestamp of last failure.',
  },
  {
    name: 'lastSuccess',
    type: 'number | undefined',
    description: 'Timestamp of last success.',
  },
  {
    name: 'nextRetryTime',
    type: 'number | undefined',
    description: 'Time until reset attempt (if OPEN).',
  },
  {
    name: 'totalRequests',
    type: 'number',
    description: 'Total requests through breaker.',
  },
  {
    name: 'totalFailures',
    type: 'number',
    description: 'Total failures since creation.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `// Utility class
import {
  CircuitBreaker,
  CircuitOpenError,
  isCircuitOpenError,
  type CircuitBreakerOptions,
  type CircuitBreakerStats,
  type CircuitState,
} from '@clarity-chat/react'

// React hook
import {
  useCircuitBreaker,
  type UseCircuitBreakerOptions,
  type UseCircuitBreakerReturn,
} from '@clarity-chat/react'

// Utilities
import {
  createAICircuitBreaker,
  withCircuitBreaker,
} from '@clarity-chat/react'`

const constructorCode = `const breaker = new CircuitBreaker({
  name: 'openai-api',
  failureThreshold: 5,
  resetTimeout: 30000,
  successThreshold: 2,
  onStateChange: (state, name) => {
    console.log(\`Circuit \${name} is now \${state}\`)
  },
  onOpen: (name, failureCount, lastError) => {
    console.error(\`Circuit \${name} opened after \${failureCount} failures\`)
  },
})`

const basicExampleCode = `import { CircuitBreaker, isCircuitOpenError } from '@clarity-chat/react'

const openaiBreaker = new CircuitBreaker({
  name: 'openai-api',
  failureThreshold: 5,
  resetTimeout: 30000,
  onOpen: () => console.error('OpenAI circuit opened!'),
})

async function callOpenAI(prompt: string) {
  try {
    const result = await openaiBreaker.execute(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${apiKey}\` },
        body: JSON.stringify({ model: 'gpt-4o', messages: [{ role: 'user', content: prompt }] }),
      })

      if (!response.ok) throw new Error(\`API error: \${response.status}\`)
      return response.json()
    })

    return result
  } catch (error) {
    if (isCircuitOpenError(error)) {
      // Circuit is open - use cached response or show error
      console.log('Circuit open, using fallback...')
      return getCachedResponse(prompt)
    }
    throw error
  }
}`

const reactHookCode = `import { useCircuitBreaker, isCircuitOpenError } from '@clarity-chat/react'
import { useState } from 'react'

function ChatComponent() {
  const [error, setError] = useState<string | null>(null)

  const { execute, state, stats, isAllowed } = useCircuitBreaker({
    name: 'chat-api',
    failureThreshold: 3,
    resetTimeout: 20000,
    onOpen: () => {
      setError('Service temporarily unavailable. Please try again in 20 seconds.')
    },
    onClose: () => {
      setError(null)
    },
  })

  const handleSend = async (message: string) => {
    if (!isAllowed) {
      setError('Service is currently unavailable')
      return
    }

    try {
      const response = await execute(() => fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }))

      const data = await response.json()
      // Handle success
    } catch (err) {
      if (isCircuitOpenError(err)) {
        // Circuit is open
        console.log('Circuit open, retry in', err.nextRetryTime - Date.now(), 'ms')
      } else {
        // Other error
        console.error('Request failed:', err)
      }
    }
  }

  return (
    <div>
      <div className="status">
        Circuit: {state} | Failures: {stats.failures} | Total: {stats.totalRequests}
      </div>
      {error && <div className="error">{error}</div>}
      <ChatInput onSend={handleSend} disabled={!isAllowed} />
    </div>
  )
}`

const aiProviderCode = `import { createAICircuitBreaker } from '@clarity-chat/react'

// Create circuit breakers for different providers
const openaiBreaker = createAICircuitBreaker('openai', {
  failureThreshold: 5,
  resetTimeout: 30000,
  onOpen: () => notify('OpenAI service temporarily unavailable'),
})

const anthropicBreaker = createAICircuitBreaker('anthropic', {
  failureThreshold: 5,
  resetTimeout: 30000,
  onOpen: () => notify('Anthropic service temporarily unavailable'),
})

async function callAI(provider: 'openai' | 'anthropic', prompt: string) {
  const breaker = provider === 'openai' ? openaiBreaker : anthropicBreaker

  try {
    return await breaker.execute(() => {
      return provider === 'openai'
        ? callOpenAI(prompt)
        : callAnthropic(prompt)
    })
  } catch (error) {
    if (isCircuitOpenError(error)) {
      // Try fallback provider
      const fallbackProvider = provider === 'openai' ? 'anthropic' : 'openai'
      console.log(\`Falling back to \${fallbackProvider}\`)
      return callAI(fallbackProvider, prompt)
    }
    throw error
  }
}

// createAICircuitBreaker provides smart defaults:
// - Ignores AbortError (user cancellations)
// - Ignores validation errors (client-side issues)
// - Counts rate limits and server errors`

const fallbackStrategyCode = `import { CircuitBreaker, isCircuitOpenError } from '@clarity-chat/react'

class ResilientAPIClient {
  private breaker: CircuitBreaker
  private cache: Map<string, any> = new Map()

  constructor() {
    this.breaker = new CircuitBreaker({
      name: 'api-client',
      failureThreshold: 5,
      resetTimeout: 30000,
      successThreshold: 2,
      onOpen: () => console.warn('Circuit opened - using fallback strategies'),
    })
  }

  async fetch(url: string, options?: RequestInit) {
    try {
      // Try primary request through circuit breaker
      const response = await this.breaker.execute(async () => {
        const res = await fetch(url, options)
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        const data = await res.json()

        // Cache successful response
        this.cache.set(url, { data, timestamp: Date.now() })
        return data
      })

      return response
    } catch (error) {
      if (isCircuitOpenError(error)) {
        // Circuit is open - try fallback strategies

        // 1. Check cache first
        const cached = this.cache.get(url)
        if (cached && Date.now() - cached.timestamp < 300000) { // 5 min
          console.log('Using cached response')
          return cached.data
        }

        // 2. Try secondary endpoint
        console.log('Trying fallback endpoint...')
        return this.fallbackFetch(url, options)
      }

      throw error
    }
  }

  private async fallbackFetch(url: string, options?: RequestInit) {
    // Fallback to secondary service (no circuit breaker)
    const fallbackUrl = url.replace('api.primary.com', 'api.fallback.com')
    const res = await fetch(fallbackUrl, options)
    return res.json()
  }

  getCircuitStats() {
    return this.breaker.getStats()
  }
}`

const statesDetailCode = `/**
 * Circuit Breaker States
 *
 * The circuit breaker implements a state machine with three states:
 */

// 1. CLOSED (Normal Operation)
// - All requests pass through
// - Failures are counted in a sliding window
// - If failures >= failureThreshold within windowDuration, transition to OPEN

// 2. OPEN (Circuit Tripped)
// - All requests fail immediately with CircuitOpenError
// - No actual requests are made to the failing service
// - After resetTimeout, transition to HALF_OPEN
// - Protects service from being overwhelmed

// 3. HALF_OPEN (Testing Recovery)
// - Limited requests are allowed through
// - If successThreshold consecutive successes, transition to CLOSED
// - If any failure occurs, transition back to OPEN
// - Safely tests if service has recovered

// State Transitions:
// CLOSED --[failures >= threshold]--> OPEN
// OPEN --[resetTimeout elapsed]--> HALF_OPEN
// HALF_OPEN --[successThreshold successes]--> CLOSED
// HALF_OPEN --[any failure]--> OPEN`

// ============================================================================
// Main Page Component
// ============================================================================

export default function CircuitBreakerPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                  <Shield className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Resilience
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                CircuitBreaker
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Prevents cascading failures by temporarily blocking requests to
                failing services. Essential for production AI systems that depend
                on external API providers.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Shield,
                  label: 'Failure Protection',
                  desc: 'Prevent cascading failures',
                  color: 'red',
                },
                {
                  icon: Activity,
                  label: 'State Machine',
                  desc: 'Smart state transitions',
                  color: 'blue',
                },
                {
                  icon: AlertCircle,
                  label: 'Auto Recovery',
                  desc: 'Test service health',
                  color: 'amber',
                },
                {
                  icon: Zap,
                  label: 'Fast Fail',
                  desc: 'Immediate rejection',
                  color: 'purple',
                },
              ].map(({ icon: Icon, label, desc, color }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 mb-2',
                      color === 'red' && 'text-red-500',
                      color === 'blue' && 'text-blue-500',
                      color === 'amber' && 'text-amber-500',
                      color === 'purple' && 'text-purple-500'
                    )}
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The Circuit Breaker pattern prevents cascading failures by monitoring
                  requests to external services. When failures exceed a threshold, the
                  circuit opens and subsequent requests fail immediately without
                  attempting the operation. After a timeout period, the circuit
                  transitions to half-open to test if the service has recovered.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Why Use Circuit Breakers?</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>
                    <strong>Prevent cascading failures</strong> - When an AI API is down,
                    avoid overwhelming it with retry attempts
                  </li>
                  <li>
                    <strong>Fast fail</strong> - Return errors immediately instead of
                    waiting for timeouts
                  </li>
                  <li>
                    <strong>Automatic recovery</strong> - Test service health and resume
                    normal operation when recovered
                  </li>
                  <li>
                    <strong>Fallback strategies</strong> - Implement graceful degradation
                    with cached responses or alternative providers
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">When to Use</h4>
                <div className="grid gap-4 md:grid-cols-2 not-prose">
                  <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-500/5">
                    <h5 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Good Use Cases
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>External AI API calls</li>
                      <li>Rate-limited services</li>
                      <li>Services with known reliability issues</li>
                      <li>Multi-tenant systems</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-500/5">
                    <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Not Recommended For
                    </h5>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Internal function calls</li>
                      <li>Database queries (use retry logic)</li>
                      <li>File system operations</li>
                      <li>Synchronous operations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
            </Section>

            {/* CircuitBreaker Class Section */}
            <Section id="circuit-breaker" title="CircuitBreaker Class">
              <p className="text-muted-foreground mb-6">
                The core CircuitBreaker class implements the circuit breaker pattern
                with configurable thresholds and callbacks.
              </p>

              <SubSection id="circuit-constructor" title="Constructor">
                <CodeBlock
                  code={constructorCode}
                  language="tsx"
                  filename="Constructor"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="circuit-options" title="Options">
                <PropsTable props={circuitBreakerOptionsProps} />
              </SubSection>

              <SubSection id="circuit-methods" title="Methods">
                <PropsTable props={circuitBreakerMethodsProps} />
              </SubSection>

              <SubSection id="circuit-states" title="Statistics">
                <p className="text-muted-foreground mb-4">
                  The <code>getStats()</code> method returns detailed statistics:
                </p>
                <PropsTable props={statsProps} />
              </SubSection>
            </Section>

            {/* useCircuitBreaker Hook Section */}
            <Section id="use-circuit-breaker" title="useCircuitBreaker Hook">
              <p className="text-muted-foreground mb-6">
                React hook for circuit breaker pattern with automatic state tracking
                and cleanup.
              </p>

              <SubSection id="hook-options" title="Options">
                <PropsTable props={hookOptionsProps} />
              </SubSection>

              <SubSection id="hook-returns" title="Returns">
                <PropsTable props={hookReturnsProps} />
              </SubSection>
            </Section>

            {/* Utilities Section */}
            <Section id="utilities" title="Utility Functions">
              <SubSection
                id="create-ai-circuit-breaker"
                title="createAICircuitBreaker"
              >
                <p className="text-muted-foreground mb-4">
                  Create a circuit breaker pre-configured for AI API providers:
                </p>
                <CodeBlock
                  code={`import { createAICircuitBreaker } from '@clarity-chat/react'

const openaiBreaker = createAICircuitBreaker('openai', {
  failureThreshold: 5,
  resetTimeout: 30000,
  onOpen: () => console.error('OpenAI circuit opened'),
})

// Smart defaults:
// - Ignores AbortError (user cancellations)
// - Ignores validation errors (client-side)
// - Counts rate limits and server errors`}
                  language="tsx"
                  filename="createAICircuitBreaker"
                />
              </SubSection>

              <SubSection id="with-circuit-breaker" title="withCircuitBreaker">
                <p className="text-muted-foreground mb-4">
                  Wrap a function with circuit breaker protection:
                </p>
                <CodeBlock
                  code={`import { withCircuitBreaker, createAICircuitBreaker } from '@clarity-chat/react'

const breaker = createAICircuitBreaker('openai')

// Wrap function
const protectedFetch = withCircuitBreaker(
  breaker,
  async (url: string) => {
    const res = await fetch(url)
    return res.json()
  }
)

// Use wrapped function
const data = await protectedFetch('https://api.openai.com/...')`}
                  language="tsx"
                  filename="withCircuitBreaker"
                />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Protection">
                <p className="text-muted-foreground mb-4">
                  Protect API calls with circuit breaker:
                </p>
                <CodeBlock
                  code={basicExampleCode}
                  language="tsx"
                  filename="BasicExample.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-react" title="React Hook Usage">
                <p className="text-muted-foreground mb-4">
                  Use circuit breaker in React components:
                </p>
                <CodeBlock
                  code={reactHookCode}
                  language="tsx"
                  filename="ChatComponent.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-ai-provider" title="AI Provider Protection">
                <p className="text-muted-foreground mb-4">
                  Protect multiple AI providers with automatic fallback:
                </p>
                <CodeBlock
                  code={aiProviderCode}
                  language="tsx"
                  filename="AIProviderProtection.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-fallback" title="Fallback Strategy">
                <p className="text-muted-foreground mb-4">
                  Implement comprehensive fallback strategies:
                </p>
                <CodeBlock
                  code={fallbackStrategyCode}
                  language="tsx"
                  filename="ResilientAPIClient.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Circuit States Detail Section */}
            <Section id="circuit-states-detail" title="Circuit States">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-muted-foreground mb-6">
                  The circuit breaker implements a state machine with three states:
                </p>

                <div className="grid gap-4 md:grid-cols-3 not-prose mb-6">
                  <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">
                        CLOSED
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Normal operation. All requests pass through.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Failures counted in sliding window</li>
                      <li>Opens if failures exceed threshold</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <h4 className="font-semibold text-red-700 dark:text-red-300">
                        OPEN
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Circuit tripped. Requests fail immediately.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Throws CircuitOpenError</li>
                      <li>Transitions to HALF_OPEN after timeout</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-500/5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-amber-700 dark:text-amber-300">
                        HALF_OPEN
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Testing recovery. Limited requests allowed.
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Success closes circuit</li>
                      <li>Failure reopens circuit</li>
                    </ul>
                  </div>
                </div>

                <CodeBlock
                  code={statesDetailCode}
                  language="tsx"
                  filename="States"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Best Practices Section */}
            <Section id="best-practices" title="Best Practices">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    1. Choose Appropriate Thresholds
                  </h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      <code>failureThreshold: 3-5</code> for most APIs
                    </li>
                    <li>
                      <code>resetTimeout: 20000-60000ms</code> (20-60 seconds)
                    </li>
                    <li>
                      Lower thresholds for critical services, higher for occasional failures
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    2. Implement Fallback Strategies
                  </h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Use cached responses when circuit is open</li>
                    <li>Fall back to alternative providers</li>
                    <li>Show user-friendly error messages</li>
                    <li>Queue requests for later retry if appropriate</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    3. Monitor Circuit State
                  </h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Log state transitions to monitoring systems</li>
                    <li>Alert on circuit open events</li>
                    <li>Track failure rates and patterns</li>
                    <li>Display circuit status in admin dashboards</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    4. Use Smart Failure Detection
                  </h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Use <code>isFailure</code> callback to ignore client errors
                    </li>
                    <li>Do not count user cancellations (AbortError)</li>
                    <li>Do not count validation errors (400-level responses)</li>
                    <li>Count rate limits (429) and server errors (500-level)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-500/10">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Important Considerations
                  </h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                    <li>
                      Circuit breakers add complexity - only use for external services
                    </li>
                    <li>
                      Test failure scenarios thoroughly in staging environments
                    </li>
                    <li>
                      Consider using separate circuits for different service endpoints
                    </li>
                    <li>
                      Combine with retry logic for transient failures
                    </li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'RateLimiter',
                    type: 'utility',
                    description: 'Control request rate to prevent overwhelming services',
                    href: '/api/token-optimization/rate-limiter',
                  },
                  {
                    name: 'RetryWithBackoff',
                    type: 'utility',
                    description: 'Exponential backoff retry logic for transient failures',
                    href: '/api/token-optimization/retry-with-backoff',
                  },
                  {
                    name: 'ErrorBoundary',
                    type: 'component',
                    description: 'React error boundary for graceful error handling',
                    href: '/reference/components/error-boundary-wrapper',
                  },
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'Main chat hook with built-in error handling',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'utility'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : api.type === 'hook'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/api/token-optimization"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Token Optimization
                    </div>
                  </div>
                </Link>
                <Link
                  href="/api/token-optimization/rate-limiter"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      RateLimiter
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
