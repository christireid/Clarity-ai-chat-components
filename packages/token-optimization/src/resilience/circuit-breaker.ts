/**
 * Circuit Breaker for Resilient Operations
 *
 * Implements the circuit breaker pattern to prevent cascading failures
 * and provide graceful degradation for token optimization operations.
 *
 * The circuit breaker has three states:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Failing, requests are rejected immediately
 * - HALF-OPEN: Testing recovery, limited requests pass through
 *
 * NOTE: There are 3 circuit breaker implementations in this monorepo:
 * - This file — generic `<T>`, lowercase state strings, includes Registry
 * - `@clarity-chat/react` adapters/ — enum-based state, global registry
 * - `@clarity-chat/react` utils/resilience/ — string union, simpler API
 *
 * Consolidation plan: standardize on a single generic circuit breaker in
 * `@clarity-chat/utils`. See CODE_REUSE_AUDIT.md H1 for details.
 *
 * @module resilience/circuit-breaker
 * @version 1.0.0
 */

import { TokenOptimizationError, TokenErrorCode } from '../errors'

/**
 * Configuration options for the circuit breaker
 */
export interface CircuitBreakerConfig {
  /** Number of failures before opening the circuit (default: 5) */
  failureThreshold: number
  /** Time in milliseconds before attempting to reset (default: 30000) */
  resetTimeoutMs: number
  /** Number of requests to allow in half-open state (default: 1) */
  halfOpenRequests: number
  /** Optional name for this circuit breaker (for logging/metrics) */
  name?: string
  /** Optional callback when state changes */
  onStateChange?: (from: CircuitState, to: CircuitState) => void
  /** Optional callback on successful request */
  onSuccess?: () => void
  /** Optional callback on failed request */
  onFailure?: (error: unknown) => void
}

/**
 * Possible states for the circuit breaker
 */
export type CircuitState = 'closed' | 'open' | 'half-open'

/**
 * Statistics about the circuit breaker's operation
 */
export interface CircuitBreakerStats {
  /** Current state of the circuit */
  state: CircuitState
  /** Number of consecutive failures */
  failures: number
  /** Total number of successful requests */
  successes: number
  /** Total number of failed requests */
  totalFailures: number
  /** Total number of requests */
  totalRequests: number
  /** Timestamp of last failure */
  lastFailure?: number
  /** Timestamp of last success */
  lastSuccess?: number
  /** Number of times circuit has opened */
  timesOpened: number
  /** Time spent in open state (ms) */
  totalOpenTimeMs: number
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<
  Omit<CircuitBreakerConfig, 'onStateChange' | 'onSuccess' | 'onFailure'>
> = {
  failureThreshold: 5,
  resetTimeoutMs: 30000,
  halfOpenRequests: 1,
  name: 'default',
}

/**
 * Circuit breaker for resilient operations
 *
 * Prevents cascading failures by tracking operation failures and
 * short-circuiting requests when the failure rate is too high.
 *
 * @example
 * ```typescript
 * const breaker = new CircuitBreaker<string>({
 *   failureThreshold: 3,
 *   resetTimeoutMs: 10000,
 *   name: 'compression',
 *   onStateChange: (from, to) => console.log(`Circuit ${from} -> ${to}`)
 * })
 *
 * try {
 *   const result = await breaker.execute(() => compressText(text))
 * } catch (error) {
 *   if (error.code === TokenErrorCode.RATE_LIMIT_EXCEEDED) {
 *     // Circuit is open, operation was not attempted
 *   }
 * }
 * ```
 */
export class CircuitBreaker<T> {
  private readonly config: Required<
    Omit<CircuitBreakerConfig, 'onStateChange' | 'onSuccess' | 'onFailure'>
  > &
    Pick<CircuitBreakerConfig, 'onStateChange' | 'onSuccess' | 'onFailure'>

  private currentState: CircuitState = 'closed'
  private failureCount: number = 0
  private successCount: number = 0
  private totalFailures: number = 0
  private totalRequests: number = 0
  private lastFailureTime?: number
  private lastSuccessTime?: number
  private halfOpenAttempts: number = 0
  private openedAt?: number
  private timesOpened: number = 0
  private totalOpenTimeMs: number = 0

  /**
   * Creates a new CircuitBreaker instance
   *
   * @param config - Circuit breaker configuration
   */
  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Gets the current state of the circuit breaker
   */
  get state(): CircuitState {
    // Check if we should transition from open to half-open
    if (this.currentState === 'open' && this.shouldAttemptReset()) {
      this.transitionTo('half-open')
    }
    return this.currentState
  }

  /**
   * Executes an operation through the circuit breaker
   *
   * @param operation - Async function to execute
   * @returns The result of the operation
   * @throws TokenOptimizationError if circuit is open or operation fails
   */
  async execute(operation: () => Promise<T>): Promise<T> {
    this.totalRequests++

    // Check current state
    const currentState = this.state

    if (currentState === 'open') {
      throw new TokenOptimizationError(
        `Circuit breaker is open for "${this.config.name}"`,
        TokenErrorCode.RATE_LIMIT_EXCEEDED,
        true,
        {
          circuitName: this.config.name,
          state: this.currentState,
          failures: this.failureCount,
          resetTimeoutMs: this.config.resetTimeoutMs,
          lastFailure: this.lastFailureTime,
        }
      )
    }

    if (currentState === 'half-open') {
      // Check if we've exceeded half-open request limit
      if (this.halfOpenAttempts >= this.config.halfOpenRequests) {
        throw new TokenOptimizationError(
          `Circuit breaker half-open limit reached for "${this.config.name}"`,
          TokenErrorCode.RATE_LIMIT_EXCEEDED,
          true,
          {
            circuitName: this.config.name,
            state: this.currentState,
            halfOpenAttempts: this.halfOpenAttempts,
          }
        )
      }
      this.halfOpenAttempts++
    }

    try {
      const result = await operation()
      this.recordSuccess()
      return result
    } catch (error) {
      this.recordFailure(error)
      throw error
    }
  }

  /**
   * Records a successful operation
   */
  private recordSuccess(): void {
    this.successCount++
    this.lastSuccessTime = Date.now()
    this.failureCount = 0

    if (this.currentState === 'half-open') {
      // Successful request in half-open state closes the circuit
      this.transitionTo('closed')
    }

    if (this.config.onSuccess) {
      this.config.onSuccess()
    }
  }

  /**
   * Records a failed operation
   */
  private recordFailure(error: unknown): void {
    this.failureCount++
    this.totalFailures++
    this.lastFailureTime = Date.now()

    if (this.config.onFailure) {
      this.config.onFailure(error)
    }

    if (this.currentState === 'half-open') {
      // Failure in half-open state reopens the circuit
      this.transitionTo('open')
      return
    }

    if (this.failureCount >= this.config.failureThreshold) {
      this.transitionTo('open')
    }
  }

  /**
   * Checks if enough time has passed to attempt a reset
   */
  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true
    return Date.now() - this.lastFailureTime >= this.config.resetTimeoutMs
  }

  /**
   * Transitions to a new state
   */
  private transitionTo(newState: CircuitState): void {
    if (this.currentState === newState) return

    const oldState = this.currentState

    // Track time in open state
    if (oldState === 'open' && this.openedAt) {
      this.totalOpenTimeMs += Date.now() - this.openedAt
      this.openedAt = undefined
    }

    this.currentState = newState

    // Reset counters on state transition
    if (newState === 'closed') {
      this.failureCount = 0
      this.halfOpenAttempts = 0
    } else if (newState === 'half-open') {
      this.halfOpenAttempts = 0
    } else if (newState === 'open') {
      this.openedAt = Date.now()
      this.timesOpened++
    }

    if (this.config.onStateChange) {
      this.config.onStateChange(oldState, newState)
    }
  }

  /**
   * Manually resets the circuit breaker to closed state
   */
  reset(): void {
    this.transitionTo('closed')
    this.failureCount = 0
    this.halfOpenAttempts = 0
  }

  /**
   * Gets statistics about the circuit breaker's operation
   *
   * @returns Circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    // Calculate current open time if in open state
    let currentOpenTime = this.totalOpenTimeMs
    if (this.currentState === 'open' && this.openedAt) {
      currentOpenTime += Date.now() - this.openedAt
    }

    return {
      state: this.state,
      failures: this.failureCount,
      successes: this.successCount,
      totalFailures: this.totalFailures,
      totalRequests: this.totalRequests,
      lastFailure: this.lastFailureTime,
      lastSuccess: this.lastSuccessTime,
      timesOpened: this.timesOpened,
      totalOpenTimeMs: currentOpenTime,
    }
  }

  /**
   * Checks if the circuit breaker is currently allowing requests
   *
   * @returns true if requests are allowed
   */
  isAllowingRequests(): boolean {
    const currentState = this.state
    if (currentState === 'closed') return true
    if (currentState === 'half-open') {
      return this.halfOpenAttempts < this.config.halfOpenRequests
    }
    return false
  }
}

/**
 * Creates a circuit breaker with default configuration for token operations
 *
 * @param name - Name for the circuit breaker
 * @param config - Optional additional configuration
 * @returns A new CircuitBreaker instance
 *
 * @example
 * ```typescript
 * const compressionBreaker = createCircuitBreaker('compression')
 * const cacheBreaker = createCircuitBreaker('cache', { failureThreshold: 3 })
 * ```
 */
export function createCircuitBreaker<T>(
  name: string,
  config?: Partial<Omit<CircuitBreakerConfig, 'name'>>
): CircuitBreaker<T> {
  return new CircuitBreaker<T>({
    ...config,
    name,
  })
}

/**
 * Registry for managing multiple circuit breakers
 *
 * @example
 * ```typescript
 * const registry = new CircuitBreakerRegistry()
 *
 * registry.register('compression', { failureThreshold: 5 })
 * registry.register('cache', { failureThreshold: 3 })
 *
 * const result = await registry.execute('compression', () => compress(text))
 * const stats = registry.getAllStats()
 * ```
 */
export class CircuitBreakerRegistry {
  private readonly breakers: Map<string, CircuitBreaker<unknown>> = new Map()
  private readonly defaultConfig: Partial<CircuitBreakerConfig>

  /**
   * Creates a new CircuitBreakerRegistry
   *
   * @param defaultConfig - Default configuration for all circuit breakers
   */
  constructor(defaultConfig?: Partial<CircuitBreakerConfig>) {
    this.defaultConfig = defaultConfig || {}
  }

  /**
   * Registers a new circuit breaker
   *
   * @param name - Unique name for the circuit breaker
   * @param config - Optional configuration override
   * @returns The created circuit breaker
   */
  register<T>(
    name: string,
    config?: Partial<CircuitBreakerConfig>
  ): CircuitBreaker<T> {
    const breaker = new CircuitBreaker<T>({
      ...this.defaultConfig,
      ...config,
      name,
    })
    this.breakers.set(name, breaker as CircuitBreaker<unknown>)
    return breaker
  }

  /**
   * Gets an existing circuit breaker by name
   *
   * @param name - Name of the circuit breaker
   * @returns The circuit breaker or undefined
   */
  get<T>(name: string): CircuitBreaker<T> | undefined {
    return this.breakers.get(name) as CircuitBreaker<T> | undefined
  }

  /**
   * Gets or creates a circuit breaker
   *
   * @param name - Name of the circuit breaker
   * @param config - Optional configuration for creation
   * @returns The circuit breaker
   */
  getOrCreate<T>(
    name: string,
    config?: Partial<CircuitBreakerConfig>
  ): CircuitBreaker<T> {
    let breaker = this.get<T>(name)
    if (!breaker) {
      breaker = this.register<T>(name, config)
    }
    return breaker
  }

  /**
   * Executes an operation through a named circuit breaker
   *
   * @param name - Name of the circuit breaker
   * @param operation - Async function to execute
   * @returns The result of the operation
   */
  async execute<T>(name: string, operation: () => Promise<T>): Promise<T> {
    const breaker = this.getOrCreate<T>(name)
    return breaker.execute(operation)
  }

  /**
   * Gets stats for all circuit breakers
   *
   * @returns Map of circuit breaker names to their stats
   */
  getAllStats(): Map<string, CircuitBreakerStats> {
    const stats = new Map<string, CircuitBreakerStats>()
    for (const [name, breaker] of this.breakers) {
      stats.set(name, breaker.getStats())
    }
    return stats
  }

  /**
   * Resets all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset()
    }
  }

  /**
   * Removes a circuit breaker from the registry
   *
   * @param name - Name of the circuit breaker to remove
   * @returns true if the circuit breaker was removed
   */
  remove(name: string): boolean {
    return this.breakers.delete(name)
  }

  /**
   * Clears all circuit breakers from the registry
   */
  clear(): void {
    this.breakers.clear()
  }
}
