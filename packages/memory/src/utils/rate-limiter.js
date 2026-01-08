/**
 * Rate Limiter
 *
 * Simple token bucket rate limiter for API calls
 */
export class RateLimiter {
    tokens;
    maxTokens;
    refillRate;
    lastRefill;
    constructor(options) {
        this.maxTokens = options.maxTokens;
        this.refillRate = options.refillRate;
        this.tokens = options.maxTokens;
        this.lastRefill = Date.now();
    }
    /**
     * Try to acquire a token
     * Returns true if token acquired, false if rate limited
     */
    tryAcquire() {
        this.refill();
        if (this.tokens >= 1) {
            this.tokens--;
            return true;
        }
        return false;
    }
    /**
     * Wait until a token is available
     */
    async acquire() {
        while (!this.tryAcquire()) {
            // Calculate wait time
            const tokensNeeded = 1 - this.tokens;
            const waitTime = (tokensNeeded / this.refillRate) * 1000;
            await new Promise(resolve => setTimeout(resolve, Math.ceil(waitTime)));
            this.refill();
        }
    }
    /**
     * Get current available tokens
     */
    getAvailableTokens() {
        this.refill();
        return this.tokens;
    }
    /**
     * Refill tokens based on elapsed time
     */
    refill() {
        const now = Date.now();
        const elapsed = (now - this.lastRefill) / 1000; // seconds
        const tokensToAdd = elapsed * this.refillRate;
        this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
        this.lastRefill = now;
    }
    /**
     * Reset rate limiter
     */
    reset() {
        this.tokens = this.maxTokens;
        this.lastRefill = Date.now();
    }
}
//# sourceMappingURL=rate-limiter.js.map