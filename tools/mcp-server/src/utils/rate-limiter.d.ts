/**
 * Rate Limiter for MCP Server
 *
 * Implements token bucket and sliding window rate limiting
 * to protect against abuse and ensure fair usage.
 *
 * @module utils/rate-limiter
 */
export interface RateLimitConfig {
    /** Maximum requests per window */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
    /** Block duration when limit exceeded (ms) */
    blockDurationMs?: number;
    /** Enable sliding window (more accurate) */
    slidingWindow?: boolean;
    /** Custom key generator */
    keyGenerator?: (context: RequestContext) => string;
    /** Skip rate limiting based on context */
    skip?: (context: RequestContext) => boolean;
    /** Custom response when rate limited */
    onRateLimited?: (context: RequestContext, retryAfter: number) => void;
    /** Maximum number of entries to track (prevents memory issues) */
    maxEntries?: number;
}
export interface RequestContext {
    type: 'tool' | 'resource' | 'prompt';
    name: string;
    clientId?: string;
    timestamp: number;
}
export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    limit: number;
    retryAfterMs?: number;
    windowResetMs: number;
}
/**
 * Token Bucket / Sliding Window Rate Limiter
 */
export declare class RateLimiter {
    private entries;
    private config;
    private cleanupInterval;
    constructor(config: RateLimitConfig);
    /**
     * Default key generator - uses type:name
     */
    private defaultKeyGenerator;
    /**
     * Check if request is allowed
     */
    check(context: RequestContext): RateLimitResult;
    /**
     * Fixed window rate limiting
     */
    private checkFixedWindow;
    /**
     * Sliding window rate limiting (more accurate)
     */
    private checkSlidingWindow;
    /**
     * Consume a request (call after successful check)
     * Note: check() already increments, this is for explicit consumption
     */
    consume(context: RequestContext, _tokens?: number): boolean;
    /**
     * Get current limit status for a context
     */
    getStatus(context: RequestContext): RateLimitResult;
    /**
     * Reset rate limit for a specific key
     */
    reset(context: RequestContext): void;
    /**
     * Reset all rate limits
     */
    resetAll(): void;
    /**
     * Evict oldest entries to make room for new ones
     */
    private evictOldestEntries;
    /**
     * Clean up expired entries
     */
    private cleanup;
    /**
     * Stop the cleanup interval
     */
    destroy(): void;
    /**
     * Get statistics
     */
    getStats(): {
        totalEntries: number;
        blockedEntries: number;
    };
}
/**
 * Default rate limiter for tool calls
 * Default: 100 requests per minute per tool (configurable via env)
 */
export declare const toolRateLimiter: RateLimiter;
/**
 * Rate limiter for resource reads
 * Default: 200 requests per minute per resource (configurable via env)
 */
export declare const resourceRateLimiter: RateLimiter;
/**
 * Global rate limiter
 * Default: 500 requests per minute total (configurable via env)
 */
export declare const globalRateLimiter: RateLimiter;
export interface RateLimitError extends Error {
    retryAfterMs: number;
    remaining: number;
    limit: number;
}
/**
 * Create a rate limit error
 */
export declare function createRateLimitError(result: RateLimitResult): RateLimitError;
/**
 * Apply rate limiting to an async function
 */
export declare function withRateLimit<T extends (...args: any[]) => Promise<any>>(fn: T, limiter: RateLimiter, getContext: (...args: Parameters<T>) => RequestContext): T;
//# sourceMappingURL=rate-limiter.d.ts.map