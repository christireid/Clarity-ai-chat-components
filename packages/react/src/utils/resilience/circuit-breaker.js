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
 *   onStateChange: (state) => console.log(`Circuit ${state}`)
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
/**
 * Error thrown when circuit is open
 */
export class CircuitOpenError extends Error {
    circuitName;
    nextRetryTime;
    constructor(name, nextRetryTime) {
        super(`Circuit breaker '${name}' is OPEN. Retry after ${Math.ceil((nextRetryTime - Date.now()) / 1000)}s`);
        this.name = 'CircuitOpenError';
        this.circuitName = name;
        this.nextRetryTime = nextRetryTime;
    }
}
/**
 * Circuit Breaker implementation
 */
export class CircuitBreaker {
    name;
    failureThreshold;
    resetTimeout;
    successThreshold;
    windowDuration;
    onStateChange;
    onOpen;
    onClose;
    onReject;
    isFailure;
    state = 'CLOSED';
    failures = []; // Timestamps of failures within window
    successCount = 0;
    lastError;
    openedAt;
    totalRequests = 0;
    totalFailures = 0;
    lastSuccess;
    constructor(options) {
        this.name = options.name;
        this.failureThreshold = options.failureThreshold ?? 5;
        this.resetTimeout = options.resetTimeout ?? 30000;
        this.successThreshold = options.successThreshold ?? 2;
        this.windowDuration = options.windowDuration ?? 60000;
        this.onStateChange = options.onStateChange;
        this.onOpen = options.onOpen;
        this.onClose = options.onClose;
        this.onReject = options.onReject;
        this.isFailure = options.isFailure ?? (() => true);
    }
    /**
     * Execute a function through the circuit breaker
     */
    async execute(fn) {
        this.totalRequests++;
        // Check if circuit is open
        if (this.state === 'OPEN') {
            const now = Date.now();
            const nextRetryTime = (this.openedAt ?? 0) + this.resetTimeout;
            if (now < nextRetryTime) {
                this.onReject?.(this.name);
                throw new CircuitOpenError(this.name, nextRetryTime);
            }
            // Transition to half-open
            this.transitionTo('HALF_OPEN');
        }
        try {
            const result = await fn();
            this.onSuccess();
            return result;
        }
        catch (error) {
            this.onFailure(error);
            throw error;
        }
    }
    /**
     * Get current circuit statistics
     */
    getStats() {
        this.pruneOldFailures();
        return {
            state: this.state,
            failures: this.failures.length,
            successes: this.successCount,
            lastFailure: this.failures[this.failures.length - 1],
            lastSuccess: this.lastSuccess,
            nextRetryTime: this.state === 'OPEN' && this.openedAt
                ? this.openedAt + this.resetTimeout
                : undefined,
            totalRequests: this.totalRequests,
            totalFailures: this.totalFailures,
        };
    }
    /**
     * Get current state
     */
    getState() {
        return this.state;
    }
    /**
     * Manually reset the circuit to closed state
     */
    reset() {
        this.state = 'CLOSED';
        this.failures = [];
        this.successCount = 0;
        this.openedAt = undefined;
        this.lastError = undefined;
    }
    /**
     * Check if circuit allows requests
     */
    isAllowed() {
        if (this.state === 'CLOSED' || this.state === 'HALF_OPEN') {
            return true;
        }
        const now = Date.now();
        const nextRetryTime = (this.openedAt ?? 0) + this.resetTimeout;
        return now >= nextRetryTime;
    }
    onSuccess() {
        this.lastSuccess = Date.now();
        if (this.state === 'HALF_OPEN') {
            this.successCount++;
            if (this.successCount >= this.successThreshold) {
                this.transitionTo('CLOSED');
            }
        }
        else if (this.state === 'CLOSED') {
            // Reset success count on each success in closed state
            this.successCount++;
        }
    }
    onFailure(error) {
        // Check if this error should count as a failure
        if (!this.isFailure(error)) {
            return;
        }
        this.totalFailures++;
        this.lastError = error;
        const now = Date.now();
        if (this.state === 'HALF_OPEN') {
            // Any failure in half-open state opens the circuit
            this.transitionTo('OPEN');
            return;
        }
        if (this.state === 'CLOSED') {
            this.failures.push(now);
            this.pruneOldFailures();
            if (this.failures.length >= this.failureThreshold) {
                this.transitionTo('OPEN');
            }
        }
    }
    pruneOldFailures() {
        const cutoff = Date.now() - this.windowDuration;
        this.failures = this.failures.filter((ts) => ts > cutoff);
    }
    transitionTo(newState) {
        const oldState = this.state;
        this.state = newState;
        if (oldState !== newState) {
            this.onStateChange?.(newState, this.name);
            if (newState === 'OPEN') {
                this.openedAt = Date.now();
                this.successCount = 0;
                this.onOpen?.(this.name, this.failures.length, this.lastError);
            }
            else if (newState === 'CLOSED') {
                this.failures = [];
                this.successCount = 0;
                this.openedAt = undefined;
                this.onClose?.(this.name);
            }
            else if (newState === 'HALF_OPEN') {
                this.successCount = 0;
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
export function createAICircuitBreaker(provider, options) {
    return new CircuitBreaker({
        name: `${provider}-api`,
        failureThreshold: 5,
        resetTimeout: 30000,
        successThreshold: 2,
        windowDuration: 60000,
        isFailure: (error) => {
            // Don't count user cancellations or validation errors
            if (error.name === 'AbortError')
                return false;
            if (error.message.includes('Invalid request'))
                return false;
            if (error.message.includes('validation'))
                return false;
            // Count rate limits and server errors
            return true;
        },
        ...options,
    });
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
export function withCircuitBreaker(breaker, fn) {
    return ((...args) => breaker.execute(() => fn(...args)));
}
/**
 * Check if error is a circuit open error
 */
export function isCircuitOpenError(error) {
    return error instanceof CircuitOpenError;
}
//# sourceMappingURL=circuit-breaker.js.map