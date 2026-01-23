# Security Audit - Recommended Fixes

**Branch:** `claude/token-optimization-hardening-TSODG` **Date:** 2026-01-23 **Priority:** Medium
severity issues should be addressed before production

---

## Fix 1: Add Timeout to Rate Limiter (MEDIUM-2)

**Priority:** HIGH (Before Production) **File:** `packages/memory/src/utils/rate-limiter.ts`
**Lines:** 43-51 **Estimated Effort:** 2-4 hours

### Current Implementation (Vulnerable)

```typescript
/**
 * Wait until a token is available
 */
async acquire(): Promise<void> {
  while (!this.tryAcquire()) {
    // Calculate wait time
    const tokensNeeded = 1 - this.tokens
    const waitTime = (tokensNeeded / this.refillRate) * 1000
    await new Promise(resolve => setTimeout(resolve, Math.ceil(waitTime)))
    this.refill()
  }
}
```

**Problem:** No timeout - can wait forever, leading to resource exhaustion.

### Recommended Fix

````typescript
export interface AcquireOptions {
  /** Maximum time to wait in milliseconds (default: 30000) */
  timeoutMs?: number
  /** AbortSignal for cancellation support */
  signal?: AbortSignal
}

/**
 * Wait until a token is available
 *
 * @param options - Timeout and cancellation options
 * @throws {Error} If timeout is reached or signal is aborted
 *
 * @example
 * ```typescript
 * // With timeout
 * await limiter.acquire({ timeoutMs: 5000 })
 *
 * // With cancellation
 * const controller = new AbortController()
 * await limiter.acquire({ signal: controller.signal })
 * controller.abort() // Cancel waiting
 * ```
 */
async acquire(options?: AcquireOptions): Promise<void> {
  const timeout = options?.timeoutMs ?? 30000 // 30 second default
  const start = Date.now()

  while (!this.tryAcquire()) {
    // Check timeout
    const elapsed = Date.now() - start
    if (elapsed > timeout) {
      throw new Error(
        `Rate limit acquire timeout after ${elapsed}ms (limit: ${timeout}ms)`
      )
    }

    // Check cancellation
    if (options?.signal?.aborted) {
      throw new Error('Rate limit acquire cancelled')
    }

    // Calculate wait time
    const tokensNeeded = 1 - this.tokens
    const baseWaitTime = (tokensNeeded / this.refillRate) * 1000

    // Don't wait longer than remaining timeout
    const remainingTimeout = timeout - elapsed
    const waitTime = Math.min(Math.ceil(baseWaitTime), remainingTimeout)

    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }

    this.refill()
  }
}
````

### Testing

```typescript
// Add to rate-limiter.test.ts
describe('Rate Limiter - acquire with timeout', () => {
  it('should timeout after specified duration', async () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillRate: 0.1, // Very slow refill
    })

    // Consume the only token
    limiter.tryAcquire()

    // Should timeout quickly
    await expect(limiter.acquire({ timeoutMs: 100 })).rejects.toThrow('Rate limit acquire timeout')
  })

  it('should respect abort signal', async () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillRate: 0.1,
    })

    limiter.tryAcquire() // Consume token

    const controller = new AbortController()
    setTimeout(() => controller.abort(), 50)

    await expect(limiter.acquire({ signal: controller.signal })).rejects.toThrow('cancelled')
  })

  it('should acquire when token becomes available within timeout', async () => {
    const limiter = new RateLimiter({
      maxTokens: 1,
      refillRate: 10, // 10 tokens/second
    })

    limiter.tryAcquire() // Consume token

    // Should succeed within 200ms
    await expect(limiter.acquire({ timeoutMs: 200 })).resolves.toBeUndefined()
  })
})
```

---

## Fix 2: Add Automatic Cleanup (LOW-1)

**Priority:** MEDIUM (Next Sprint) **File:** `packages/react/src/utils/api/rate-limiting.ts`
**Lines:** 170-242 **Estimated Effort:** 2-3 hours

### Current Implementation

```typescript
export class SlidingWindowRateLimiter {
  private config: RateLimitConfig
  private timestamps = new Map<string, number[]>()

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id) => `ratelimit:${id}`,
      ...config,
    }
  }

  // ...

  /**
   * Clean up old timestamps to prevent memory leaks.
   * Call this periodically in production.
   */
  cleanup(): void {
    // Manual cleanup required
  }
}
```

**Problem:** Cleanup must be called manually, risking memory leaks.

### Recommended Fix

```typescript
export class SlidingWindowRateLimiter {
  private config: RateLimitConfig
  private timestamps = new Map<string, number[]>()
  private cleanupInterval?: ReturnType<typeof setInterval>

  constructor(config: RateLimitConfig) {
    this.config = {
      keyGenerator: (id) => `ratelimit:${id}`,
      ...config,
    }

    // Start automatic cleanup (runs every minute or every window, whichever is shorter)
    const cleanupIntervalMs = Math.min(60000, this.config.windowMs)
    this.cleanupInterval = setInterval(() => this.cleanup(), cleanupIntervalMs)

    // Allow process to exit even if interval is running
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref()
    }
  }

  /**
   * Clean up old timestamps to prevent memory leaks.
   * Called automatically every minute (or every window).
   *
   * @returns Number of keys cleaned up
   */
  cleanup(): number {
    const now = Date.now()
    const windowStart = now - this.config.windowMs
    let cleanedCount = 0

    const entries = Array.from(this.timestamps.entries())
    for (const [key, times] of entries) {
      const filtered = times.filter((t) => t > windowStart)
      if (filtered.length === 0) {
        this.timestamps.delete(key)
        cleanedCount++
      } else if (filtered.length < times.length) {
        this.timestamps.set(key, filtered)
      }
    }

    return cleanedCount
  }

  /**
   * Stop automatic cleanup and free resources
   * Call this when the rate limiter is no longer needed
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = undefined
    }
    this.timestamps.clear()
  }
}
```

### Usage Update

```typescript
// In application code
const limiter = new SlidingWindowRateLimiter({
  maxRequests: 100,
  windowMs: 60000,
  storage: new MemoryRateLimitStorage(),
})

// Cleanup happens automatically every minute

// When shutting down (e.g., server shutdown)
process.on('SIGTERM', () => {
  limiter.destroy() // Clean up resources
})
```

### Testing

```typescript
describe('SlidingWindowRateLimiter - automatic cleanup', () => {
  it('should automatically clean up expired entries', async () => {
    jest.useFakeTimers()

    const limiter = new SlidingWindowRateLimiter({
      maxRequests: 10,
      windowMs: 1000,
      storage: new MemoryRateLimitStorage(),
    })

    // Make some requests
    await limiter.checkLimit('user1')
    await limiter.checkLimit('user2')

    // Fast-forward past cleanup interval
    jest.advanceTimersByTime(60000)

    // Cleanup should have run automatically
    // Verify by checking internal state or stats

    limiter.destroy()
    jest.useRealTimers()
  })

  it('should clean up on destroy', () => {
    const limiter = new SlidingWindowRateLimiter({
      maxRequests: 10,
      windowMs: 1000,
      storage: new MemoryRateLimitStorage(),
    })

    limiter.destroy()

    // Verify interval is cleared and data is removed
    expect(limiter['cleanupInterval']).toBeUndefined()
  })
})
```

---

## Fix 3: Review PII Redaction Default (MEDIUM-1)

**Priority:** MEDIUM (Product Decision Required) **File:**
`packages/token-optimization/src/defaults.ts` **Line:** 219 **Estimated Effort:** 4-6 hours
(including testing and documentation)

### Current Implementation

```typescript
export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enablePIIRedaction: true, // ⚠️ Always enabled
  enableAuditLogging: true,
  complianceLevel: 'standard' as const,
  auditRetention: 30,
} as const
```

**Problem:** PII redaction enabled by default may:

- Cause false positives in legitimate data
- Add performance overhead
- Break workflows that need full data
- Require explicit opt-out for common cases

### Option 1: Environment-Based (Recommended)

````typescript
/**
 * Default security configuration.
 *
 * ⚠️ SECURITY CONFIGURATION:
 * - PII Redaction: Controlled by ENABLE_PII_REDACTION env var (default: disabled)
 *   Set ENABLE_PII_REDACTION=true for production/compliance environments
 * - Audit Logging: ENABLED by default (required for security monitoring)
 * - Sanitization: ENABLED by default (required for injection protection)
 *
 * @example
 * ```bash
 * # Development (default)
 * npm run dev
 *
 * # Production with PII protection
 * ENABLE_PII_REDACTION=true npm run start
 * ```
 */
export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enablePIIRedaction:
    process.env.ENABLE_PII_REDACTION === 'true' || process.env.NODE_ENV === 'production', // Auto-enable in production
  enableAuditLogging: true,
  complianceLevel: 'standard' as const,
  auditRetention: 30,
} as const
````

### Option 2: Preset-Based (More Explicit)

```typescript
/**
 * Preset configurations for different use cases.
 */
export const PRESETS = {
  minimal: {
    description: 'Development - lowest security overhead',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.minimal,
    compressionLevel: 'light',
    routingStrategy: 'cost-optimized',
    security: {
      enableSanitization: true,
      enablePIIRedaction: false, // ✅ Disabled for dev
      enableAuditLogging: false,
      complianceLevel: 'minimal' as const,
      auditRetention: 7,
    },
  },
  standard: {
    description: 'Balanced defaults for most applications (recommended)',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.standard,
    compressionLevel: 'moderate',
    routingStrategy: 'balanced',
    security: {
      enableSanitization: true,
      enablePIIRedaction: false, // ✅ Disabled - opt-in
      enableAuditLogging: true,
      complianceLevel: 'standard' as const,
      auditRetention: 30,
    },
  },
  production: {
    description: 'Higher limits for production workloads',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.production,
    compressionLevel: 'moderate',
    routingStrategy: 'balanced',
    security: {
      enableSanitization: true,
      enablePIIRedaction: true, // ✅ Enabled for production
      enableAuditLogging: true,
      complianceLevel: 'standard' as const,
      auditRetention: 30,
    },
  },
  enterprise: {
    description: 'Maximum performance and compliance',
    cache: DEFAULT_TIERED_CACHE_BY_PRESET.enterprise,
    compressionLevel: 'aggressive',
    routingStrategy: 'quality-first',
    security: {
      enableSanitization: true,
      enablePIIRedaction: true, // ✅ Enabled for compliance
      enableAuditLogging: true,
      complianceLevel: 'strict' as const,
      auditRetention: 90,
    },
  },
} as const

// Default security inherits from standard preset
export const DEFAULT_SECURITY_CONFIG = PRESETS.standard.security
```

### Option 3: Warning-Based (Keep Current Default)

```typescript
export const DEFAULT_SECURITY_CONFIG = {
  enableSanitization: true,
  enablePIIRedaction: true,
  enableAuditLogging: true,
  complianceLevel: 'standard' as const,
  auditRetention: 30,
} as const

// Add runtime warning when PII redaction is disabled
export function validateSecurityConfig(config: typeof DEFAULT_SECURITY_CONFIG): void {
  if (!config.enablePIIRedaction && process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️  WARNING: PII redaction is disabled in production environment. ' +
        'This may violate GDPR/HIPAA compliance requirements. ' +
        'Set enablePIIRedaction: true or use enterprise preset.'
    )
  }

  if (!config.enableAuditLogging) {
    console.warn(
      '⚠️  WARNING: Audit logging is disabled. ' + 'Security events will not be tracked.'
    )
  }
}
```

### Recommended Approach

Use **Option 2 (Preset-Based)** because:

1. ✅ Explicit and clear for users
2. ✅ Different defaults for different environments
3. ✅ Easy to understand security trade-offs
4. ✅ Follows "principle of least surprise"
5. ✅ Makes compliance opt-in for those who need it

### Documentation Update

```markdown
## Security Configuration

Clarity AI Chat provides four security presets:

### Development (`minimal`)

- **PII Redaction:** Disabled
- **Audit Logging:** Disabled
- Best for: Local development, testing

### Standard (`standard`) - DEFAULT

- **PII Redaction:** Disabled (opt-in)
- **Audit Logging:** Enabled
- Best for: Most applications, internal tools

### Production (`production`)

- **PII Redaction:** Enabled
- **Audit Logging:** Enabled
- Best for: Customer-facing applications

### Enterprise (`enterprise`)

- **PII Redaction:** Enabled
- **Audit Logging:** Enabled (90-day retention)
- **Compliance:** Strict mode
- Best for: HIPAA, GDPR, SOC 2 compliance

### Usage

\`\`\`typescript import { createOptimizer } from '@clarity-chat/token-optimization'

// Use standard preset (default) const optimizer = createOptimizer({ preset: 'standard' })

// Use enterprise preset for compliance const secureOptimizer = createOptimizer({ preset:
'enterprise' })

// Custom configuration const customOptimizer = createOptimizer({ preset: 'standard', security: {
enablePIIRedaction: true, // Override preset }, }) \`\`\`
```

---

## Fix 4: Add Value Size Limits (LOW-2)

**Priority:** LOW (Future Enhancement) **File:** `packages/memory/src/utils/cache.ts` **Estimated
Effort:** 2-3 hours

### Enhanced LRU Cache

```typescript
export interface CacheOptions {
  maxSize: number
  ttl?: number // Time to live in milliseconds
  maxValueSize?: number // Maximum size per value in bytes
  onEvict?: (key: K, value: V, reason: 'size' | 'ttl' | 'lru') => void
}

export class LRUCache<K, V> {
  private cache: Map<K, { value: V; timestamp: number; size: number }>
  private maxSize: number
  private maxValueSize?: number
  private ttl?: number
  private onEvict?: (key: K, value: V, reason: 'size' | 'ttl' | 'lru') => void
  private totalSize: number = 0

  constructor(options: CacheOptions) {
    this.cache = new Map()
    this.maxSize = options.maxSize
    this.ttl = options.ttl
    this.maxValueSize = options.maxValueSize
    this.onEvict = options.onEvict
  }

  set(key: K, value: V): void {
    // Calculate value size
    const size = this.estimateSize(value)

    // Check if value is too large
    if (this.maxValueSize && size > this.maxValueSize) {
      throw new Error(`Value size (${size} bytes) exceeds maximum (${this.maxValueSize} bytes)`)
    }

    // Remove if exists
    if (this.cache.has(key)) {
      const old = this.cache.get(key)!
      this.totalSize -= old.size
      this.onEvict?.(key, old.value, 'size')
      this.cache.delete(key)
    }

    // Add new item
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      size,
    })
    this.totalSize += size

    // Evict oldest if over limit
    while (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey !== undefined) {
        const evicted = this.cache.get(firstKey)!
        this.totalSize -= evicted.size
        this.onEvict?.(firstKey, evicted.value, 'lru')
        this.cache.delete(firstKey)
      }
    }
  }

  /**
   * Estimate size of value in bytes
   */
  private estimateSize(value: V): number {
    if (typeof value === 'string') {
      return value.length * 2 // Rough estimate for UTF-16
    }
    if (typeof value === 'number') {
      return 8
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value).length * 2
    }
    return 100 // Default estimate
  }

  /**
   * Get current cache statistics
   */
  getStats(): {
    size: number
    totalSize: number
    avgSize: number
  } {
    return {
      size: this.cache.size,
      totalSize: this.totalSize,
      avgSize: this.cache.size > 0 ? this.totalSize / this.cache.size : 0,
    }
  }
}
```

---

## Fix 5: Configurable Recursion Depth (LOW-3)

**Priority:** LOW (Future Enhancement) **File:**
`packages/token-optimization/src/compression/strategies/llmlingua.ts` **Lines:** 302-303 **Estimated
Effort:** 1-2 hours

### Enhanced Constructor

```typescript
export interface LLMLinguaCompressorOptions extends Partial<LLMLinguaOptions> {
  /** Maximum recursion depth for quality retries (default: 5) */
  maxRecursionDepth?: number
}

export class LLMLinguaCompressor {
  private readonly stopWords: Set<string>
  private readonly instructionMarkers: Set<string>
  private readonly maxRecursionDepth: number

  constructor(private readonly defaultOptions: LLMLinguaCompressorOptions = {}) {
    this.stopWords = new Set([...DEFAULT_STOP_WORDS, ...(defaultOptions.additionalStopWords || [])])
    this.instructionMarkers = new Set(INSTRUCTION_MARKERS.map((m) => m.toLowerCase()))
    this.maxRecursionDepth = defaultOptions.maxRecursionDepth ?? 5

    // Validate
    if (this.maxRecursionDepth < 0 || this.maxRecursionDepth > 20) {
      throw new Error(`maxRecursionDepth must be between 0 and 20, got ${this.maxRecursionDepth}`)
    }
  }

  async compress(
    text: string,
    targetRatio: number,
    options?: LLMLinguaOptions,
    _recursionDepth: number = 0
  ): Promise<LLMLinguaResult> {
    // ... existing code ...

    // Use instance property instead of constant
    if (higherRatio < 1.0 && _recursionDepth < this.maxRecursionDepth) {
      return this.compress(text, higherRatio, { ...opts }, _recursionDepth + 1)
    } else {
      qualityWarning =
        higherRatio >= 1.0
          ? `Quality threshold (${opts.minQuality}) could not be met at maximum compression ratio (1.0)`
          : `Max recursion depth (${this.maxRecursionDepth}) reached while trying to meet quality threshold`
    }

    // ... rest of code ...
  }
}
```

---

## Testing Checklist

After implementing fixes, verify:

- [ ] Rate limiter timeout works correctly
- [ ] Abort signals are respected
- [ ] Automatic cleanup runs periodically
- [ ] Cleanup stops on destroy()
- [ ] PII redaction follows preset configuration
- [ ] Warning logs appear when security is weakened
- [ ] Value size limits are enforced
- [ ] Recursion depth is configurable
- [ ] All existing tests still pass
- [ ] New tests cover edge cases

---

## Deployment Plan

1. **Phase 1: Critical Fixes (Week 1)**
   - Implement timeout in rate limiter
   - Add comprehensive tests
   - Deploy to staging

2. **Phase 2: Security Review (Week 1)**
   - Review PII redaction default with product team
   - Decide on environment vs preset approach
   - Update documentation

3. **Phase 3: Enhancements (Week 2)**
   - Add automatic cleanup
   - Implement value size limits
   - Make recursion depth configurable

4. **Phase 4: Production (Week 2)**
   - Full regression testing
   - Security re-audit
   - Production deployment

---

**All fixes have been designed to be backward compatible where possible.**
