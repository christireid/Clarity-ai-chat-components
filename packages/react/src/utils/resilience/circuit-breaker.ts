/**
 * Circuit Breaker Pattern Implementation
 *
 * Prevents cascading failures by temporarily blocking requests to
 * failing services. Essential for production AI systems that depend
 * on external API providers.
 *
 * States:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Circuit tripped, requests fail immediately
 * - HALF_OPEN: Testing if service has recovered
 *
 * @example
 * ```ts
 * const breaker = new CircuitBreaker({
 *   name: 'openai-api',
 *   failureThreshold: 5,
 *   resetTimeout: 30000,
 *   onStateChange: (state) => logger.debug(`Circuit ${state}`)
 * })
 *
 * try {
 *   const result = await breaker.execute(() => callOpenAI(request))
 * } catch (error) {
 *   if (error instanceof CircuitOpenError) {
 *     // Use fallback or cached response
 *   }
 * }
 * ```
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

export interface CircuitBreakerOptions {
  /** Name for logging/monitoring */
  name: string
  /** Number of failures before opening circuit (default: 5) */
  failureThreshold?: number
  /** Time in ms before attempting reset (default: 30000) */
  resetTimeout?: number
  /** Number of successful calls to close circuit from half-open (default: 2) */
  successThreshold?: number
  /** Callback when state changes */
  onStateChange?: (state: CircuitState, name: string) => void
  /** Callback when circuit opens */
  onOpen?: (name: string, failureCount: number, lastError?: Error) => void
  /** Callback when circuit closes */
  onClose?: (name: string) => void
  /** Callback when request is rejected due to open circuit */
  onReject?: (name: string) => void
  /** Optional: Check if error should count as failure (default: all errors) */
  isFailure?: (error: Error) => boolean
  /** Sliding window duration in ms for failure counting (default: 60000) */
  windowDuration?: number
}

export interface CircuitBreakerStats {
  /** Current state */
  state: CircuitState
  /** Number of failures in current window */
  failures: number
  /** Number of successes since last state change */
  successes: number
  /** Last failure timestamp */
  lastFailure?: number
  /** Last success timestamp */
  lastSuccess?: number
  /** Time until reset attempt (if OPEN) */
  nextRetryTime?: number
  /** Total requests through breaker */
  totalRequests: number
  /** Total failures since creation */
  totalFailures: number
}

/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
  public readonly circuitName: string
  public readonly nextRetryTime: number

  constructor(name: string, nextRetryTime: number) {
    super(
      `Circuit breaker '${name}' is OPEN. Retry after ${Math.ceil((nextRetryTime - Date.now()) / 1000)}s`
    )
    this.name = 'CircuitOpenError'
    this.circuitName = name
    this.nextRetryTime = nextRetryTime
  }
}

/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker {
  private readonly name: string
  private readonly failureThreshold: number
  private readonly resetTimeout: number
  private readonly successThreshold: number
  private readonly windowDuration: number
  private readonly onStateChange?: (state: CircuitState, name: string) => void
  private readonly onOpen?: (
    name: string,
    failureCount: number,
    lastError?: Error
  ) => void
  private readonly onClose?: (name: string) => void
  private readonly onReject?: (name: string) => void
  private readonly isFailure: (error: Error) => boolean

  private state: CircuitState = 'CLOSED'
  private failures: number[] = [] // Timestamps of failures within window
  private successCount = 0
  private lastError?: Error
  private openedAt?: number
  private totalRequests = 0
  private totalFailures = 0
  private lastSuccess?: number

  constructor(options: CircuitBreakerOptions) {
    this.name = options.name
    this.failureThreshold = options.failureThreshold ?? 5
    this.resetTimeout = options.resetTimeout ?? 30000
    this.successThreshold = options.successThreshold ?? 2
    this.windowDuration = options.windowDuration ?? 60000
    this.onStateChange = options.onStateChange
    this.onOpen = options.onOpen
    this.onClose = options.onClose
    this.onReject = options.onReject
    this.isFailure = options.isFailure ?? (() => true)
  }

  /**
   * Execute a function through the circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalRequests++

    // Check if circuit is open
    if (this.state === 'OPEN') {
      const now = Date.now()
      const nextRetryTime = (this.openedAt ?? 0) + this.resetTimeout

      if (now < nextRetryTime) {
        this.onReject?.(this.name)
        throw new CircuitOpenError(this.name, nextRetryTime)
      }

      // Transition to half-open
      this.transitionTo('HALF_OPEN')
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure(error as Error)
      throw error
    }
  }

  /**
   * Get current circuit statistics
   */
  getStats(): CircuitBreakerStats {
    this.pruneOldFailures()

    return {
      state: this.state,
      failures: this.failures.length,
      successes: this.successCount,
      lastFailure: this.failures[this.failures.length - 1],
      lastSuccess: this.lastSuccess,
      nextRetryTime:
        this.state === 'OPEN' && this.openedAt
          ? this.openedAt + this.resetTimeout
          : undefined,
      totalRequests: this.totalRequests,
      totalFailures: this.totalFailures,
    }
  }

  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state
  }

  /**
   * Manually reset the circuit to closed state
   */
  reset(): void {
    this.state = 'CLOSED'
    this.failures = []
    this.successCount = 0
    this.openedAt = undefined
    this.lastError = undefined
  }

  /**
   * Check if circuit allows requests
   */
  isAllowed(): boolean {
    if (this.state === 'CLOSED' || this.state === 'HALF_OPEN') {
      return true
    }

    const now = Date.now()
    const nextRetryTime = (this.openedAt ?? 0) + this.resetTimeout
    return now >= nextRetryTime
  }

  private onSuccess(): void {
    this.lastSuccess = Date.now()

    if (this.state === 'HALF_OPEN') {
      this.successCount++

      if (this.successCount >= this.successThreshold) {
        this.transitionTo('CLOSED')
      }
    } else if (this.state === 'CLOSED') {
      // Reset success count on each success in closed state
      this.successCount++
    }
  }

  private onFailure(error: Error): void {
    // Check if this error should count as a failure
    if (!this.isFailure(error)) {
      return
    }

    this.totalFailures++
    this.lastError = error
    const now = Date.now()

    if (this.state === 'HALF_OPEN') {
      // Any failure in half-open state opens the circuit
      this.transitionTo('OPEN')
      return
    }

    if (this.state === 'CLOSED') {
      this.failures.push(now)
      this.pruneOldFailures()

      if (this.failures.length >= this.failureThreshold) {
        this.transitionTo('OPEN')
      }
    }
  }

  private pruneOldFailures(): void {
    const cutoff = Date.now() - this.windowDuration
    this.failures = this.failures.filter((ts) => ts > cutoff)
  }

  private transitionTo(newState: CircuitState): void {
    const oldState = this.state
    this.state = newState

    if (oldState !== newState) {
      this.onStateChange?.(newState, this.name)

      if (newState === 'OPEN') {
        this.openedAt = Date.now()
        this.successCount = 0
        this.onOpen?.(this.name, this.failures.length, this.lastError)
      } else if (newState === 'CLOSED') {
        this.failures = []
        this.successCount = 0
        this.openedAt = undefined
        this.onClose?.(this.name)
      } else if (newState === 'HALF_OPEN') {
        this.successCount = 0
      }
    }
  }
}

/**
 * Create a circuit breaker with default AI API settings
 *
 * @example
 * ```ts
 * const openaiBreaker = createAICircuitBreaker('openai')
 * const anthropicBreaker = createAICircuitBreaker('anthropic')
 * ```
 */
export function createAICircuitBreaker(
  provider: string,
  options?: Partial<CircuitBreakerOptions>
): CircuitBreaker {
  return new CircuitBreaker({
    name: `${provider}-api`,
    failureThreshold: 5,
    resetTimeout: 30000,
    successThreshold: 2,
    windowDuration: 60000,
    isFailure: (error: Error) => {
      // Don't count user cancellations or validation errors
      if (error.name === 'AbortError') return false
      if (error.message.includes('Invalid request')) return false
      if (error.message.includes('validation')) return false

      // Count rate limits and server errors
      return true
    },
    ...options,
  })
}

/**
 * Wrap a function with circuit breaker protection
 *
 * @example
 * ```ts
 * const protectedFetch = withCircuitBreaker(
 *   createAICircuitBreaker('openai'),
 *   () => fetch('https://api.openai.com/...')
 * )
 *
 * const result = await protectedFetch()
 * ```
 */
export function withCircuitBreaker<T extends (...args: any[]) => Promise<any>>(
  breaker: CircuitBreaker,
  fn: T
): T {
  return ((...args: Parameters<T>) => breaker.execute(() => fn(...args))) as T
}

/**
 * Check if error is a circuit open error
 */
export function isCircuitOpenError(error: unknown): error is CircuitOpenError {
  return error instanceof CircuitOpenError
}
