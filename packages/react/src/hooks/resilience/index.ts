/**
 * Resilience Hooks
 *
 * Hooks for error handling, retry logic, and circuit breaker patterns.
 */

export {
  useCircuitBreaker,
  CircuitOpenError,
  isCircuitOpenError,
  type UseCircuitBreakerOptions,
  type UseCircuitBreakerReturn,
} from './use-circuit-breaker'

export {
  useRetryWithBackoff,
  type UseRetryWithBackoffOptions,
  type UseRetryWithBackoffReturn,
} from './use-retry-with-backoff'

export {
  useRequestDeduplication,
  DebouncedError,
  isDebouncedError,
  createMessageKey,
  type UseRequestDeduplicationOptions,
  type UseRequestDeduplicationReturn,
} from './use-request-deduplication'

export * from './use-error-recovery'
