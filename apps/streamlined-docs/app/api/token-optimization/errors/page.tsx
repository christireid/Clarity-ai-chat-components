// @ts-nocheck -- Multiple unresolvable imports: '@/components/Layout/Documentation' (Section, SectionHeader, SubSection) does not exist at that path, '@clarity-chat/primitives' (Badge) is a workspace package not available in the docs app's TS context, and '@/components/CodeBlock' should be '@/components/Docs/CodeBlock'.
import React from 'react'
import { Metadata } from 'next'
import {
  Section,
  SectionHeader,
  SubSection,
} from '@/components/Layout/Documentation'
import { Badge } from '@clarity-chat/primitives'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = {
  title: 'Error Handling System | Clarity AI Chat Components',
  description:
    'Comprehensive error handling with HelpfulError classes, error codes, and retry strategies for production AI applications',
}

export default function ErrorsPage() {
  return (
    <div className="space-y-16">
      {/* Hero */}
      <Section>
        <SectionHeader
          title="Error Handling System"
          description="Production-ready error handling with actionable messages, intelligent retry strategies, and circuit breakers"
          badge={
            <Badge variant="secondary" className="ml-3">
              Production Ready
            </Badge>
          }
        />
      </Section>

      {/* Overview */}
      <Section>
        <SubSection title="Overview">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Clarity provides a comprehensive error handling system designed for
            production AI applications. Every error includes actionable
            solutions, context-aware messages, and intelligent retry strategies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">HelpfulError Classes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Structured errors with codes, solutions, and documentation links
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <svg
                    className="h-5 w-5 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Intelligent Retries</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Exponential backoff with jitter and rate limit awareness
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border/50 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <svg
                    className="h-5 w-5 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold">Circuit Breakers</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Prevent cascading failures with automatic service protection
              </p>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* ClarityError Base Class */}
      <Section>
        <SubSection title="ClarityError Base Class">
          <p className="text-muted-foreground mb-6">
            All Clarity errors extend from <code>ClarityError</code>, providing
            consistent structure, serialization, and helpful debugging
            information.
          </p>

          <CodeBlock
            language="typescript"
            code={`import { ClarityError } from '@clarity-chat/error-handling'

// Base error class with helpful features
abstract class ClarityError extends Error {
  abstract readonly code: string          // Unique error code
  abstract readonly statusCode: number    // HTTP status code
  readonly recoverable: boolean           // Can user recover?
  readonly context?: Record<string, unknown>  // Debug context
  readonly cause?: Error                  // Original error
  readonly timestamp: Date                // When error occurred
  readonly solution?: string              // Actionable fix
  readonly docs?: string                  // Documentation URL

  get userMessage(): string               // User-friendly message
  toJSON(): Record<string, unknown>       // For API responses
}`}
          />

          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Key Benefits
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>
                  <strong>Actionable Messages:</strong> Every error includes
                  what went wrong and how to fix it
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>
                  <strong>Type Safety:</strong> Strongly typed error codes for
                  programmatic handling
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>
                  <strong>Context Preservation:</strong> Stack traces and debug
                  context included
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success mt-0.5">✓</span>
                <span>
                  <strong>Production Ready:</strong> Sensitive data filtered in
                  production
                </span>
              </li>
            </ul>
          </div>
        </SubSection>
      </Section>

      {/* Error Codes */}
      <Section>
        <SubSection title="Error Codes">
          <p className="text-muted-foreground mb-6">
            Type-safe error codes organized by domain for easy programmatic
            handling and searchability.
          </p>

          <div className="space-y-6">
            {/* API Errors */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="outline">API</Badge>
                  API Error Codes
                </h4>
              </div>
              <div className="p-4">
                <CodeBlock
                  language="typescript"
                  code={`export const ApiErrorCode = {
  BAD_REQUEST: 'API_BAD_REQUEST',           // 400 - Invalid request
  UNAUTHORIZED: 'API_UNAUTHORIZED',         // 401 - Auth required
  FORBIDDEN: 'API_FORBIDDEN',               // 403 - Permission denied
  NOT_FOUND: 'API_NOT_FOUND',               // 404 - Resource not found
  RATE_LIMITED: 'API_RATE_LIMITED',         // 429 - Too many requests
  SERVER_ERROR: 'API_SERVER_ERROR',         // 500 - Server error
  NETWORK_ERROR: 'API_NETWORK_ERROR',       // Network failure
  TIMEOUT: 'API_TIMEOUT',                   // Request timeout
} as const`}
                />
              </div>
            </div>

            {/* Provider Errors */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="outline">Provider</Badge>
                  AI Provider Error Codes
                </h4>
              </div>
              <div className="p-4">
                <CodeBlock
                  language="typescript"
                  code={`export const ProviderErrorCode = {
  OPENAI_ERROR: 'PROVIDER_OPENAI_ERROR',
  ANTHROPIC_ERROR: 'PROVIDER_ANTHROPIC_ERROR',
  GOOGLE_ERROR: 'PROVIDER_GOOGLE_ERROR',
  RATE_LIMIT: 'PROVIDER_RATE_LIMIT',        // Provider rate limit
  CONTEXT_LENGTH: 'PROVIDER_CONTEXT_LENGTH', // Token limit exceeded
  CONTENT_FILTER: 'PROVIDER_CONTENT_FILTER', // Content policy violation
  INVALID_API_KEY: 'PROVIDER_INVALID_API_KEY',
  MODEL_NOT_FOUND: 'PROVIDER_MODEL_NOT_FOUND',
  QUOTA_EXCEEDED: 'PROVIDER_QUOTA_EXCEEDED',
  SERVICE_UNAVAILABLE: 'PROVIDER_SERVICE_UNAVAILABLE',
} as const`}
                />
              </div>
            </div>

            {/* Streaming Errors */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="outline">Streaming</Badge>
                  Streaming Error Codes
                </h4>
              </div>
              <div className="p-4">
                <CodeBlock
                  language="typescript"
                  code={`export const StreamingErrorCode = {
  CONNECTION_FAILED: 'STREAM_CONNECTION_FAILED',
  CONNECTION_LOST: 'STREAM_CONNECTION_LOST',
  PARSE_ERROR: 'STREAM_PARSE_ERROR',
  TIMEOUT: 'STREAM_TIMEOUT',
  ABORTED: 'STREAM_ABORTED',
  PROVIDER_ERROR: 'STREAM_PROVIDER_ERROR',
} as const`}
                />
              </div>
            </div>

            {/* Network Errors */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="outline">Network</Badge>
                  Network Error Codes
                </h4>
              </div>
              <div className="p-4">
                <CodeBlock
                  language="typescript"
                  code={`export const NetworkErrorCode = {
  CONNECTION_FAILED: 'NETWORK_CONNECTION_FAILED',
  DNS_RESOLUTION_FAILED: 'NETWORK_DNS_FAILED',
  SSL_ERROR: 'NETWORK_SSL_ERROR',
  OFFLINE: 'NETWORK_OFFLINE',
} as const`}
                />
              </div>
            </div>

            {/* Token Errors */}
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="bg-muted/30 px-4 py-3 border-b border-border/50">
                <h4 className="font-semibold flex items-center gap-2">
                  <Badge variant="outline">Token</Badge>
                  Token Error Codes
                </h4>
              </div>
              <div className="p-4">
                <CodeBlock
                  language="typescript"
                  code={`export const TokenErrorCode = {
  TOKEN_LIMIT_EXCEEDED: 'TOKEN_LIMIT_EXCEEDED',
  CONTEXT_TOO_LONG: 'TOKEN_CONTEXT_TOO_LONG',
  MESSAGE_TOO_LONG: 'TOKEN_MESSAGE_TOO_LONG',
} as const`}
                />
              </div>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* Retry Strategies */}
      <Section>
        <SubSection title="Retry Strategies">
          <p className="text-muted-foreground mb-6">
            Intelligent retry logic with exponential backoff, jitter, and
            rate-limit awareness for resilient AI applications.
          </p>

          <div className="space-y-6">
            {/* Exponential Backoff */}
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Badge variant="default">Recommended</Badge>
                Exponential Backoff with Jitter
              </h4>

              <CodeBlock
                language="typescript"
                code={`import { retryWithBackoff } from '@clarity-chat/react'

// Automatic retry with intelligent backoff
const result = await retryWithBackoff(
  async () => {
    // Your AI API call
    return await fetch('/api/openai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
  },
  {
    maxRetries: 3,           // Max attempts
    baseDelay: 1000,         // 1s base delay
    maxDelay: 30000,         // 30s max delay
    jitter: 0.5,             // 50% jitter for randomization

    // Custom retry logic
    shouldRetry: (error, attempt) => {
      // Don't retry validation errors
      if (error.message.includes('invalid')) return false

      // Always retry rate limits and server errors
      return error.status >= 500 || error.status === 429
    },

    // Track retry attempts
    onRetry: (attempt, delay, error) => {
      console.log(\`Retry attempt \${attempt} after \${delay}ms\`)
      analytics.track('api_retry', { attempt, error: error.message })
    },
  }
)

console.log(\`Success after \${result.attempts} attempts\`)
console.log(\`Total time: \${result.totalTime}ms\`)`}
              />

              <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  How It Works
                </h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Attempt 1:</strong> Immediate (0ms)
                  </li>
                  <li>
                    <strong>Attempt 2:</strong> 1000ms ± 500ms jitter
                  </li>
                  <li>
                    <strong>Attempt 3:</strong> 2000ms ± 1000ms jitter
                  </li>
                  <li>
                    <strong>Attempt 4:</strong> 4000ms ± 2000ms jitter
                  </li>
                  <li className="pt-2 border-t border-border/50">
                    Jitter prevents thundering herd when many clients retry
                    simultaneously
                  </li>
                </ul>
              </div>
            </div>

            {/* Rate Limit Aware */}
            <div>
              <h4 className="font-semibold mb-4">Rate Limit Aware Retries</h4>

              <CodeBlock
                language="typescript"
                code={`import { retryWithBackoff } from '@clarity-chat/react'

// Respects rate limit headers automatically
const result = await retryWithBackoff(
  async () => {
    const response = await fetch('/api/anthropic/messages')

    // Extract rate limit info from headers
    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after')
      const rateLimitReset = response.headers.get('x-ratelimit-reset')

      const error = new Error('Rate limited')
      ;(error as any).rateLimitInfo = {
        retryAfter: retryAfter ? parseInt(retryAfter) : undefined,
        resetTime: rateLimitReset ? parseInt(rateLimitReset) : undefined,
      }
      throw error
    }

    return response.json()
  },
  {
    // Extract rate limit info from error
    getRateLimitInfo: (error) => {
      return (error as any).rateLimitInfo
    },
  }
)

// Automatically waits for rate limit reset before retrying`}
              />
            </div>

            {/* Preset Options */}
            <div>
              <h4 className="font-semibold mb-4">Preset Retry Options</h4>

              <CodeBlock
                language="typescript"
                code={`import {
  AI_API_RETRY_OPTIONS,
  STREAMING_RETRY_OPTIONS,
  retryWithBackoff,
} from '@clarity-chat/react'

// For standard AI API calls
const result = await retryWithBackoff(
  () => callOpenAI(),
  AI_API_RETRY_OPTIONS
)
// maxRetries: 3, baseDelay: 1000ms, maxDelay: 60000ms

// For streaming (faster failure, shorter delays)
const stream = await retryWithBackoff(
  () => streamChat(),
  STREAMING_RETRY_OPTIONS
)
// maxRetries: 2, baseDelay: 1000ms, maxDelay: 30000ms`}
              />
            </div>

            {/* Retry Button Component */}
            <div>
              <h4 className="font-semibold mb-4">RetryButton Component</h4>

              <CodeBlock
                language="typescript"
                code={`import { RetryButton } from '@clarity-chat/react'

function ChatInterface() {
  const [error, setError] = useState<Error | null>(null)

  return (
    <>
      {error && (
        <RetryButton
          onRetry={async () => {
            setError(null)
            await sendMessage()
          }}

          // Visual feedback
          errorType="network"  // network | ratelimit | server | auth
          maxAttempts={3}
          backoffMs={[1000, 3000, 10000]}  // Custom delays

          // Callbacks for analytics
          onRetryStart={(attempt) => {
            analytics.track('retry_started', { attempt })
          }}
          onRetrySuccess={(attempt) => {
            analytics.track('retry_succeeded', { attempt })
          }}
          onRetryFail={(attempt, error) => {
            analytics.track('retry_failed', { attempt, error })
          }}
          onMaxAttemptsReached={() => {
            showSupportDialog()
          }}

          // Visual customization
          size="md"              // sm | md | lg
          variant="default"      // default | ghost | outline
          showAttemptsRemaining={true}
        />
      )}
    </>
  )
}`}
              />

              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <h5 className="font-semibold mb-2">Error Type Messages</h5>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <code>network</code>: "Connection lost. Check your internet
                    and try again."
                  </li>
                  <li>
                    <code>ratelimit</code>: "Too many requests. Please wait a
                    moment before retrying."
                  </li>
                  <li>
                    <code>server</code>: "Server error. Please try again in a
                    moment."
                  </li>
                  <li>
                    <code>auth</code>: "Authentication failed. Please sign in
                    again."
                  </li>
                  <li>
                    <code>unknown</code>: "Something went wrong. Please try
                    again."
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* Circuit Breaker */}
      <Section>
        <SubSection title="Circuit Breaker Pattern">
          <p className="text-muted-foreground mb-6">
            Prevent cascading failures by temporarily blocking requests to
            failing services. Essential for production systems.
          </p>

          <div className="space-y-6">
            {/* States */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-success/50 bg-success/5">
                <h5 className="font-semibold text-success mb-2">CLOSED</h5>
                <p className="text-sm text-muted-foreground">
                  Normal operation. All requests pass through.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                <h5 className="font-semibold text-destructive mb-2">OPEN</h5>
                <p className="text-sm text-muted-foreground">
                  Circuit tripped. Requests fail immediately without hitting
                  service.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-warning/50 bg-warning/5">
                <h5 className="font-semibold text-warning mb-2">HALF_OPEN</h5>
                <p className="text-sm text-muted-foreground">
                  Testing recovery. Limited requests to check if service is
                  healthy.
                </p>
              </div>
            </div>

            {/* Basic Usage */}
            <div>
              <h4 className="font-semibold mb-4">Basic Usage</h4>

              <CodeBlock
                language="typescript"
                code={`import { CircuitBreaker } from '@clarity-chat/react'

// Create a circuit breaker for each API provider
const openaiBreaker = new CircuitBreaker({
  name: 'openai-api',
  failureThreshold: 5,        // Open after 5 failures
  resetTimeout: 30000,        // Try again after 30s
  successThreshold: 2,        // Close after 2 successes
  windowDuration: 60000,      // 60s failure counting window

  // Callbacks for monitoring
  onStateChange: (state, name) => {
    console.log(\`Circuit \${name} changed to \${state}\`)
    metrics.gauge('circuit_state', state === 'OPEN' ? 1 : 0)
  },

  onOpen: (name, failureCount, lastError) => {
    console.error(\`Circuit \${name} opened after \${failureCount} failures\`)
    alerts.send(\`OpenAI circuit opened: \${lastError?.message}\`)
  },

  onClose: (name) => {
    console.log(\`Circuit \${name} closed - service recovered\`)
    alerts.send(\`OpenAI circuit recovered\`)
  },
})

// Use circuit breaker
try {
  const result = await openaiBreaker.execute(async () => {
    return await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
  })
} catch (error) {
  if (error instanceof CircuitOpenError) {
    // Circuit is open - use fallback
    console.log(\`Circuit open, retry in \${error.nextRetryTime - Date.now()}ms\`)
    return useCachedResponse() // Fallback logic
  }
  throw error
}`}
              />
            </div>

            {/* Multi-Provider Setup */}
            <div>
              <h4 className="font-semibold mb-4">Multi-Provider Setup</h4>

              <CodeBlock
                language="typescript"
                code={`import { createAICircuitBreaker } from '@clarity-chat/react'

// Create breakers for each provider
const breakers = {
  openai: createAICircuitBreaker('openai'),
  anthropic: createAICircuitBreaker('anthropic'),
  google: createAICircuitBreaker('google'),
}

async function callAIWithFallback(request: ChatRequest) {
  // Try primary provider
  try {
    return await breakers.openai.execute(() => callOpenAI(request))
  } catch (error) {
    if (error instanceof CircuitOpenError) {
      // OpenAI circuit is open, try Anthropic
      try {
        return await breakers.anthropic.execute(() =>
          callAnthropic(request)
        )
      } catch (fallbackError) {
        if (fallbackError instanceof CircuitOpenError) {
          // Both circuits open, try Google
          return await breakers.google.execute(() =>
            callGoogle(request)
          )
        }
        throw fallbackError
      }
    }
    throw error
  }
}`}
              />
            </div>

            {/* Monitoring */}
            <div>
              <h4 className="font-semibold mb-4">Monitoring & Stats</h4>

              <CodeBlock
                language="typescript"
                code={`// Get circuit breaker statistics
const stats = openaiBreaker.getStats()

console.log(stats)
// {
//   state: 'CLOSED',
//   failures: 2,              // Current failures in window
//   successes: 15,            // Successes since last state change
//   lastFailure: 1706450123,  // Timestamp
//   lastSuccess: 1706450456,  // Timestamp
//   nextRetryTime: undefined, // Only when OPEN
//   totalRequests: 1247,
//   totalFailures: 28,
// }

// Check if circuit allows requests
if (openaiBreaker.isAllowed()) {
  await openaiBreaker.execute(() => callAPI())
}

// Manually reset circuit
openaiBreaker.reset()`}
              />
            </div>

            {/* Configuration */}
            <div>
              <h4 className="font-semibold mb-4">
                Advanced Configuration
              </h4>

              <CodeBlock
                language="typescript"
                code={`const breaker = new CircuitBreaker({
  name: 'openai-api',
  failureThreshold: 5,
  resetTimeout: 30000,
  successThreshold: 2,
  windowDuration: 60000,

  // Custom failure detection
  isFailure: (error: Error) => {
    // Don't count user cancellations
    if (error.name === 'AbortError') return false

    // Don't count validation errors
    if (error.message.includes('Invalid request')) return false

    // Count rate limits and server errors
    const status = (error as any).status
    return status === 429 || (status >= 500 && status < 600)
  },

  // Monitoring callbacks
  onStateChange: (state, name) => {
    metrics.gauge(\`circuit.\${name}.state\`, state === 'OPEN' ? 1 : 0)
  },

  onOpen: (name, failureCount, lastError) => {
    alerts.critical(\`Circuit \${name} opened\`, {
      failures: failureCount,
      error: lastError?.message,
    })
  },

  onClose: (name) => {
    alerts.info(\`Circuit \${name} recovered\`)
  },

  onReject: (name) => {
    metrics.increment(\`circuit.\${name}.rejected\`)
  },
})`}
              />
            </div>
          </div>
        </SubSection>
      </Section>

      {/* Complete Example */}
      <Section>
        <SubSection title="Complete Production Example">
          <p className="text-muted-foreground mb-6">
            Combine error handling, retries, and circuit breakers for
            production-ready resilience.
          </p>

          <CodeBlock
            language="typescript"
            code={`import {
  ClarityError,
  ApiErrorCode,
  retryWithBackoff,
  createAICircuitBreaker,
  CircuitOpenError,
} from '@clarity-chat/react'

// Setup circuit breaker
const openaiBreaker = createAICircuitBreaker('openai', {
  onStateChange: (state) => {
    metrics.gauge('openai_circuit', state === 'OPEN' ? 1 : 0)
  },
})

// Custom error class
class OpenAIError extends ClarityError {
  code = ApiErrorCode.SERVER_ERROR
  statusCode = 500

  constructor(message: string, options?: {
    cause?: Error
    context?: Record<string, unknown>
  }) {
    super(message, {
      ...options,
      recoverable: true,
      solution: 'The AI service is temporarily unavailable. Please try again in a moment.',
      docs: 'https://docs.clarity-chat.dev/errors/openai',
    })
  }
}

// Production-ready AI call with full error handling
export async function callOpenAIWithResilience(
  messages: Message[],
  options: {
    signal?: AbortSignal
    onRetry?: (attempt: number) => void
  } = {}
) {
  return await retryWithBackoff(
    async () => {
      // Execute through circuit breaker
      return await openaiBreaker.execute(async () => {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages,
            }),
            signal: options.signal,
          })

          if (!response.ok) {
            // Extract error details
            const error = await response.json()

            throw new OpenAIError(
              error.error?.message || 'OpenAI request failed',
              {
                context: {
                  status: response.status,
                  code: error.error?.code,
                  type: error.error?.type,
                },
              }
            )
          }

          return await response.json()

        } catch (error) {
          // Wrap fetch errors
          if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new OpenAIError('Network error connecting to OpenAI', {
              cause: error as Error,
            })
          }
          throw error
        }
      })
    },
    {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 30000,
      signal: options.signal,

      // Smart retry logic
      shouldRetry: (error, attempt) => {
        // Don't retry if user cancelled
        if (error.name === 'AbortError') return false

        // Don't retry circuit open errors
        if (error instanceof CircuitOpenError) return false

        // Don't retry validation errors
        if (error.message.includes('Invalid request')) return false

        // Retry rate limits and server errors
        return true
      },

      onRetry: (attempt, delay, error) => {
        console.log(\`Retry attempt \${attempt} after \${delay}ms: \${error.message}\`)
        options.onRetry?.(attempt)

        // Track retries
        metrics.increment('openai.retry', {
          attempt,
          error: error.message,
        })
      },
    }
  )
}

// Usage in your app
try {
  const result = await callOpenAIWithResilience(messages, {
    signal: abortController.signal,
    onRetry: (attempt) => {
      toast.info(\`Retrying... (attempt \${attempt})\`)
    },
  })

  console.log(\`Success after \${result.attempts} attempts\`)
  console.log(\`Total time: \${result.totalTime}ms\`)

} catch (error) {
  if (error instanceof CircuitOpenError) {
    // Circuit is open - show maintenance message
    toast.error('AI service is temporarily unavailable. Using cached responses.')
    return getCachedResponse()

  } else if (error instanceof ClarityError) {
    // Show user-friendly message
    toast.error(error.userMessage)

    // Log full error details
    console.error('AI Error:', error.toJSON())

  } else {
    // Unknown error
    toast.error('An unexpected error occurred')
    console.error(error)
  }
}`}
          />
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section>
        <SubSection title="Best Practices">
          <div className="space-y-6">
            <div className="rounded-lg border border-border/50 p-6 bg-card">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Do's
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Use ClarityError:</strong> Always throw ClarityError
                    subclasses with actionable messages and solutions
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Implement Circuit Breakers:</strong> Protect
                    external service calls to prevent cascading failures
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Use Exponential Backoff:</strong> Add jitter to
                    prevent thundering herd problems
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Respect Rate Limits:</strong> Parse retry-after
                    headers and adjust delays accordingly
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Monitor Circuits:</strong> Track circuit state
                    changes and set up alerts for open circuits
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Provide Fallbacks:</strong> Have cached or degraded
                    responses ready when circuits open
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong>Log Context:</strong> Include relevant context in
                    errors for easier debugging
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-destructive/50 p-6 bg-destructive/5">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Don'ts
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 shrink-0">✗</span>
                  <span>
                    <strong>Don't retry validation errors:</strong> Client
                    errors (400, 401, 403) won't succeed on retry
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 shrink-0">✗</span>
                  <span>
                    <strong>Don't use fixed delays:</strong> Always add jitter
                    to prevent synchronized retries
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 shrink-0">✗</span>
                  <span>
                    <strong>Don't retry forever:</strong> Set reasonable max
                    attempts and timeouts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 shrink-0">✗</span>
                  <span>
                    <strong>Don't ignore circuit state:</strong> Check
                    isAllowed() before expensive operations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 shrink-0">✗</span>
                  <span>
                    <strong>Don't expose internal errors:</strong> Always show
                    user-friendly messages
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive mt-0.5 shrink-0">✗</span>
                  <span>
                    <strong>Don't skip AbortSignal checks:</strong> Respect user
                    cancellations to save resources
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </SubSection>
      </Section>

      {/* Related Documentation */}
      <Section>
        <SubSection title="Related Documentation">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/guides/error-handling"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors"
            >
              <h4 className="font-semibold mb-2">Error Handling Guide</h4>
              <p className="text-sm text-muted-foreground">
                Complete guide to error handling patterns and best practices
              </p>
            </a>

            <a
              href="/reference/components/retry-button"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors"
            >
              <h4 className="font-semibold mb-2">RetryButton Component</h4>
              <p className="text-sm text-muted-foreground">
                UI component for user-friendly retry experiences
              </p>
            </a>

            <a
              href="/reference/components/error-boundary-wrapper"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors"
            >
              <h4 className="font-semibold mb-2">ErrorBoundary</h4>
              <p className="text-sm text-muted-foreground">
                React error boundaries for graceful error handling
              </p>
            </a>

            <a
              href="/reference/hooks/use-error-recovery"
              className="p-4 rounded-lg border border-border/50 bg-card hover:border-primary/50 transition-colors"
            >
              <h4 className="font-semibold mb-2">useErrorRecovery Hook</h4>
              <p className="text-sm text-muted-foreground">
                React hook for automatic error recovery and retry logic
              </p>
            </a>
          </div>
        </SubSection>
      </Section>
    </div>
  )
}
