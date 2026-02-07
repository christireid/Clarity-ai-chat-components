/**
 * Circuit Breaker Pattern for Model Adapters
 *
 * Implements circuit breaker to prevent cascading failures:
 * - CLOSED: Normal operation, requests pass through
 * - OPEN: Too many failures, requests fail immediately
 * - HALF_OPEN: Testing recovery, limited requests pass through
 *
 * Benefits:
 * - Fail fast when provider is down
 * - Prevent overwhelming failing providers
 * - Automatic recovery testing
 * - Provider health visibility
 *
 * NOTE: There are 3 circuit breaker implementations in this monorepo:
 * - This file (adapters/) — enum-based state, includes Registry + global instance
 * - `utils/resilience/circuit-breaker.ts` — string union state, simpler API
 * - `@clarity-chat/token-optimization` — generic `<T>`, lowercase state strings
 *
 * Consolidation plan: standardize on a single generic circuit breaker in
 * `@clarity-chat/utils`. Adapter-specific configuration stays here but
 * uses the shared base. See CODE_REUSE_AUDIT.md H1 for details.
 */

/**
 * Circuit breaker states
 */
export enum CircuitState {
  /** Normal operation - requests pass through */
  CLOSED = 'CLOSED',
  /** Too many failures - reject requests immediately */
  OPEN = 'OPEN',
  /** Testing recovery - allow limited requests */
  HALF_OPEN = 'HALF_OPEN',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  /** Failure threshold to open circuit (default: 5) */
  failureThreshold?: number

  /** Success threshold to close circuit from half-open (default: 2) */
  successThreshold?: number

  /** Time window for counting failures in ms (default: 60000 = 1 min) */
  failureWindowMs?: number

  /** Time to wait before entering half-open state in ms (default: 30000 = 30s) */
  openTimeoutMs?: number

  /** Number of test requests to allow in half-open state (default: 1) */
  halfOpenMaxRequests?: number

  /** Callback when circuit state changes */
  onStateChange?: (
    state: CircuitState,
    previousState: CircuitState,
    provider: string
  ) => void

  /** Callback when request is rejected */
  onRequestRejected?: (provider: string, state: CircuitState) => void
}

/**
 * Default circuit breaker configuration
 */
const DEFAULT_CONFIG: Required<CircuitBreakerConfig> = {
  failureThreshold: 5,
  successThreshold: 2,
  failureWindowMs: 60000,
  openTimeoutMs: 30000,
  halfOpenMaxRequests: 1,
  onStateChange: () => {
    /* no-op */
  },
  onRequestRejected: () => {
    /* no-op */
  },
}

/**
 * Circuit breaker error thrown when circuit is open
 */
export class CircuitBreakerError extends Error {
  public readonly state: CircuitState
  public readonly provider: string
  public readonly nextAttemptTime?: number

  constructor(
    provider: string,
    state: CircuitState,
    nextAttemptTime?: number
  ) {
    super(
      `Circuit breaker is ${state} for ${provider}${nextAttemptTime ? `. Next attempt at ${new Date(nextAttemptTime).toISOString()}` : ''}`
    )
    this.name = 'CircuitBreakerError'
    this.state = state
    this.provider = provider
    this.nextAttemptTime = nextAttemptTime
  }
}

/**
 * Failure record for tracking
 */
interface FailureRecord {
  timestamp: number
  error?: Error
}

/**
 * Circuit breaker statistics
 */
export interface CircuitBreakerStats {
  /** Current state */
  state: CircuitState
  /** Total requests attempted */
  totalRequests: number
  /** Successful requests */
  successCount: number
  /** Failed requests */
  failureCount: number
  /** Rejected requests (circuit open) */
  rejectedCount: number
  /** Success rate (0-1) */
  successRate: number
  /** Current failure count in window */
  currentFailures: number
  /** Time circuit was last opened */
  lastOpenTime?: number
  /** Time circuit was last closed */
  lastClosedTime?: number
  /** Number of state transitions */
  stateTransitions: number
}

/**
 * Circuit breaker implementation
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private config: Required<CircuitBreakerConfig>
  private provider: string

  // Failure tracking
  private failures: FailureRecord[] = []
  private successCount = 0
  private halfOpenSuccesses = 0
  private halfOpenRequests = 0

  // State timing
  private lastStateChange = Date.now()
  private openTime?: number

  // Statistics
  private stats = {
    totalRequests: 0,
    successCount: 0,
    failureCount: 0,
    rejectedCount: 0,
    stateTransitions: 0,
  }

  constructor(provider: string, config: CircuitBreakerConfig = {}) {
    this.provider = provider
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    // Check if we should transition from OPEN to HALF_OPEN
    if (
      this.state === CircuitState.OPEN &&
      this.openTime &&
      Date.now() - this.openTime >= this.config.openTimeoutMs
    ) {
      this.setState(CircuitState.HALF_OPEN)
    }

    return this.state
  }

  /**
   * Check if request is allowed
   */
  async allowRequest(): Promise<boolean> {
    const state = this.getState()

    if (state === CircuitState.CLOSED) {
      return true
    }

    if (state === CircuitState.OPEN) {
      this.stats.rejectedCount++
      this.config.onRequestRejected(this.provider, state)
      return false
    }

    // HALF_OPEN state
    if (this.halfOpenRequests < this.config.halfOpenMaxRequests) {
      this.halfOpenRequests++
      return true
    }

    this.stats.rejectedCount++
    this.config.onRequestRejected(this.provider, state)
    return false
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute<T>(
    operation: () => Promise<T>,
    isFailure: (error: Error) => boolean = () => true
  ): Promise<T> {
    // Check if request is allowed
    const allowed = await this.allowRequest()
    if (!allowed) {
      const nextAttemptTime = this.openTime
        ? this.openTime + this.config.openTimeoutMs
        : undefined
      throw new CircuitBreakerError(
        this.provider,
        this.getState(),
        nextAttemptTime
      )
    }

    this.stats.totalRequests++

    try {
      const result = await operation()
      this.recordSuccess()
      return result
    } catch (error) {
      // Only record as failure if it's considered a circuit-breaking failure
      if (isFailure(error as Error)) {
        this.recordFailure(error as Error)
      }
      throw error
    }
  }

  /**
   * Record successful request
   */
  recordSuccess(): void {
    this.successCount++
    this.stats.successCount++

    const state = this.getState()

    if (state === CircuitState.HALF_OPEN) {
      this.halfOpenSuccesses++

      // Close circuit if we hit success threshold
      if (this.halfOpenSuccesses >= this.config.successThreshold) {
        this.setState(CircuitState.CLOSED)
        this.resetCounts()
      }
    }
  }

  /**
   * Record failed request
   */
  recordFailure(error?: Error): void {
    this.stats.failureCount++

    const now = Date.now()
    this.failures.push({ timestamp: now, error })

    // Remove old failures outside the window
    this.cleanupOldFailures(now)

    const state = this.getState()

    if (state === CircuitState.HALF_OPEN) {
      // Any failure in half-open reopens the circuit
      this.setState(CircuitState.OPEN)
      this.resetHalfOpenCounts()
    } else if (state === CircuitState.CLOSED) {
      // Open circuit if we hit failure threshold
      if (this.failures.length >= this.config.failureThreshold) {
        this.setState(CircuitState.OPEN)
      }
    }
  }

  /**
   * Manually open the circuit
   */
  open(): void {
    if (this.state !== CircuitState.OPEN) {
      this.setState(CircuitState.OPEN)
    }
  }

  /**
   * Manually close the circuit
   */
  close(): void {
    if (this.state !== CircuitState.CLOSED) {
      this.setState(CircuitState.CLOSED)
      this.resetCounts()
    }
  }

  /**
   * Force transition to half-open for testing
   */
  halfOpen(): void {
    if (this.state !== CircuitState.HALF_OPEN) {
      this.setState(CircuitState.HALF_OPEN)
      this.resetHalfOpenCounts()
    }
  }

  /**
   * Get circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    const state = this.getState()
    this.cleanupOldFailures(Date.now())

    return {
      state,
      ...this.stats,
      successRate:
        this.stats.totalRequests > 0
          ? this.stats.successCount / this.stats.totalRequests
          : 1,
      currentFailures: this.failures.length,
      lastOpenTime: state === CircuitState.OPEN ? this.openTime : undefined,
      lastClosedTime:
        state === CircuitState.CLOSED ? this.lastStateChange : undefined,
    }
  }

  /**
   * Reset all statistics
   */
  reset(): void {
    this.failures = []
    this.successCount = 0
    this.halfOpenSuccesses = 0
    this.halfOpenRequests = 0
    this.openTime = undefined
    this.stats = {
      totalRequests: 0,
      successCount: 0,
      failureCount: 0,
      rejectedCount: 0,
      stateTransitions: 0,
    }

    if (this.state !== CircuitState.CLOSED) {
      this.setState(CircuitState.CLOSED)
    }
  }

  /**
   * Change circuit state
   */
  private setState(newState: CircuitState): void {
    const previousState = this.state
    if (previousState === newState) return

    this.state = newState
    this.lastStateChange = Date.now()
    this.stats.stateTransitions++

    if (newState === CircuitState.OPEN) {
      this.openTime = Date.now()
    } else if (newState === CircuitState.CLOSED) {
      this.openTime = undefined
    }

    // Notify state change
    this.config.onStateChange(newState, previousState, this.provider)
  }

  /**
   * Reset half-open state counters
   */
  private resetHalfOpenCounts(): void {
    this.halfOpenSuccesses = 0
    this.halfOpenRequests = 0
  }

  /**
   * Reset all counters
   */
  private resetCounts(): void {
    this.failures = []
    this.successCount = 0
    this.resetHalfOpenCounts()
  }

  /**
   * Remove failures outside the time window
   */
  private cleanupOldFailures(now: number): void {
    const cutoff = now - this.config.failureWindowMs
    this.failures = this.failures.filter((f) => f.timestamp >= cutoff)
  }
}

/**
 * Registry of circuit breakers by provider
 */
export class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>()
  private config: CircuitBreakerConfig

  constructor(config: CircuitBreakerConfig = {}) {
    this.config = config
  }

  /**
   * Get or create circuit breaker for provider
   */
  get(provider: string): CircuitBreaker {
    if (!this.breakers.has(provider)) {
      const breaker = new CircuitBreaker(provider, this.config)
      this.breakers.set(provider, breaker)
    }
    return this.breakers.get(provider)!
  }

  /**
   * Get all circuit breakers
   */
  getAll(): Map<string, CircuitBreaker> {
    return new Map(this.breakers)
  }

  /**
   * Get statistics for all providers
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {}
    for (const [provider, breaker] of this.breakers.entries()) {
      stats[provider] = breaker.getStats()
    }
    return stats
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset()
    }
  }

  /**
   * Clear all circuit breakers
   */
  clear(): void {
    this.breakers.clear()
  }
}

/**
 * Global circuit breaker registry instance
 */
export const globalCircuitBreakerRegistry = new CircuitBreakerRegistry({
  onStateChange: (state, previousState, provider) => {
    console.warn(
      `[CircuitBreaker] ${provider}: ${previousState} → ${state}`
    )
  },
  onRequestRejected: (provider, state) => {
    console.warn(
      `[CircuitBreaker] ${provider}: Request rejected (circuit ${state})`
    )
  },
})
