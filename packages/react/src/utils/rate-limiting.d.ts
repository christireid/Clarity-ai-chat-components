/**
 * Rate Limiting Utilities
 *
 * Flexible rate limiting with pluggable storage.
 * Bring your own storage backend (memory, Redis, database, etc.)
 */
export interface RateLimitStorage {
    /**
     * Get current request count for a key
     */
    get(key: string): Promise<number>;
    /**
     * Increment request count
     */
    increment(key: string, ttl: number): Promise<number>;
    /**
     * Reset request count
     */
    reset(key: string): Promise<void>;
}
export interface RateLimitConfig {
    /** Maximum requests allowed */
    maxRequests: number;
    /** Time window in milliseconds */
    windowMs: number;
    /** Storage backend */
    storage: RateLimitStorage;
    /** Key generator function */
    keyGenerator?: (identifier: string) => string;
    /** Handler for rate limit exceeded */
    onLimitExceeded?: (identifier: string, retryAfter: number) => void;
}
export interface RateLimitResult {
    /** Whether request is allowed */
    allowed: boolean;
    /** Current request count */
    count: number;
    /** Maximum allowed requests */
    limit: number;
    /** Time until window resets (ms) */
    retryAfter?: number;
    /** Remaining requests in window */
    remaining: number;
}
/**
 * In-memory rate limit storage (not shared across processes)
 */
export declare class MemoryRateLimitStorage implements RateLimitStorage {
    private store;
    get(key: string): Promise<number>;
    increment(key: string, ttl: number): Promise<number>;
    reset(key: string): Promise<void>;
    /**
     * Clean up expired entries
     */
    cleanup(): void;
}
/**
 * Token Bucket Rate Limiter
 *
 * Allows bursts of requests up to bucket capacity.
 */
export declare class TokenBucketRateLimiter {
    private config;
    constructor(config: RateLimitConfig);
    /**
     * Check if request is allowed and consume a token
     */
    checkLimit(identifier: string): Promise<RateLimitResult>;
    /**
     * Reset limit for identifier
     */
    reset(identifier: string): Promise<void>;
}
/**
 * Sliding Window Rate Limiter
 *
 * More accurate than token bucket for distributed systems.
 */
export declare class SlidingWindowRateLimiter {
    private config;
    private timestamps;
    constructor(config: RateLimitConfig);
    checkLimit(identifier: string): Promise<RateLimitResult>;
    reset(identifier: string): Promise<void>;
    /**
     * Clean up old timestamps
     */
    cleanup(): void;
}
/**
 * Rate limiter middleware helper
 *
 * @example
 * ```tsx
 * const limiter = new TokenBucketRateLimiter({
 *   maxRequests: 10,
 *   windowMs: 60000, // 1 minute
 *   storage: new MemoryRateLimitStorage(),
 * })
 *
 * async function handleRequest(userId: string) {
 *   const result = await withRateLimit(
 *     () => processRequest(),
 *     userId,
 *     limiter
 *   )
 * }
 * ```
 */
export declare function withRateLimit<T>(fn: () => Promise<T>, identifier: string, limiter: TokenBucketRateLimiter | SlidingWindowRateLimiter): Promise<T>;
/**
 * Rate limit error
 */
export declare class RateLimitError extends Error {
    readonly limitInfo: RateLimitResult;
    constructor(message: string, limitInfo: RateLimitResult);
}
//# sourceMappingURL=rate-limiting.d.ts.map