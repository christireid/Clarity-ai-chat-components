# Data Integrity Review: API Consolidation Plan

**Date:** 2026-01-25 **Reviewer:** Data Integrity Guardian **Scope:** Cache consistency, token
counting accuracy, validation consistency, error state preservation, migration safety

---

## Executive Summary

**OVERALL RISK LEVEL:** 🟡 **MEDIUM-HIGH**

The consolidation plan involves moving 150+ duplicate implementations to canonical locations. While
architecturally sound, it introduces **significant data integrity risks** around:

1. **Cache key collisions** during migration (CRITICAL)
2. **Token count divergence** between old and new implementations (HIGH)
3. **Validation logic drift** causing inconsistent behavior (HIGH)
4. **Error state loss** during boundary consolidation (MEDIUM)
5. **localStorage data corruption** on hook migrations (MEDIUM)

**RECOMMENDATION:** Implement data integrity safety checks and migration validators BEFORE executing
consolidation.

---

## 1. Cache Consistency Analysis

### 1.1 Current State Assessment

**Simple Caching (`@clarity-chat/utils`):**

```typescript
// LRUCache - Simple FIFO eviction with Map-based storage
class LRUCache<K, V> {
  private cache = new Map<K, V>()
  private readonly maxSize: number
}

// TTLCache - Time-based expiration with interval cleanup
class TTLCache<K, V> {
  private cache = new Map<K, { value: V; expiry: number }>()
  private pruneInterval: ReturnType<typeof setInterval> | null = null
}
```

**Advanced Caching (`@clarity-chat/token-optimization`):**

```typescript
// SmartCache, TieredCache, ExactCache - Semantic + embedding-based
export { ExactCache, SmartCache, TieredCache }
```

**React Hook Wrapper (`useSemanticCache`):**

```typescript
// Wraps AdvancedSemanticCache with React state
const cacheRef = React.useRef<AdvancedSemanticCache | null>(null)
const responseMapRef = React.useRef<Map<string, T>>(new Map())
```

### 1.2 DATA INTEGRITY RISKS

#### CRITICAL: Dual Storage Pattern in `useSemanticCache`

**Risk:** Cache and response map can desynchronize, causing data loss.

```typescript
// packages/react/src/hooks/clarity-tokens/use-semantic-cache.ts
Lines 86-89, 224-231, 243-245

// ISSUE: Two separate data stores
cacheRef.current = new AdvancedSemanticCache(config)  // Store 1: Embeddings + content
responseMapRef.current = new Map<string, T>()         // Store 2: Typed responses

// Set operation writes to BOTH
await cacheRef.current.set(prompt, content, { qualityScore: 0.95 })  // Store 1
responseMapRef.current.set(id, response)                              // Store 2

// Get operation can return stale data if ID mapping lost
const typedResponse = responseMapRef.current.get(result.entry.id)
```

**Failure Scenarios:**

1. **Race condition:** Cache invalidation clears Store 1, but Store 2 not cleared → returns stale
   typed response
2. **ID collision:** Random ID generation (`cache_${Date.now()}_${Math.random()}`) can collide →
   overwrites wrong entry
3. **Memory leak:** responseMapRef never pruned → grows unbounded even when cache evicts

**Data Loss Example:**

```typescript
// User calls set() 1000 times
for (let i = 0; i < 1000; i++) {
  await cache.set(`query${i}`, `response${i}`)
}

// AdvancedSemanticCache evicts old entries (LRU)
// But responseMapRef keeps ALL 1000 entries

cache.search('query0') // Returns null (evicted)
// BUT responseMapRef.get('cache_...') still exists → MEMORY LEAK
// WORSE: If ID collision, returns WRONG data → DATA CORRUPTION
```

**FIX REQUIRED:**

```typescript
// Option 1: Use AdvancedSemanticCache.entry.id as key (don't generate random IDs)
const id = result.entry.id // Use cache's ID
responseMapRef.current.set(id, response)

// Option 2: Store typed response IN the cache content
await cacheRef.current.set(
  prompt,
  JSON.stringify({
    type: typeof response,
    data: response,
  }),
  context
)

// Option 3: Add synchronized eviction
cacheRef.current.on('evict', (id) => {
  responseMapRef.current.delete(id)
})
```

#### HIGH: Cache Key Hash Collisions

**Risk:** FNV-1a hash function has 32-bit output space (4.3 billion keys).

```typescript
// packages/utils/src/cache/index.ts
Lines 33-45

export function getContentHash(content: string): string {
  let hash = 2166136261  // FNV offset basis

  for (let i = 0; i < content.length; i++) {
    hash ^= content.charCodeAt(i)
    hash = Math.imul(hash, 16777619)  // FNV prime
  }

  return (hash >>> 0).toString(16).padStart(8, '0')
}
```

**Collision Probability:**

- With 100,000 cached items: ~1.16% chance of collision (Birthday paradox)
- Collision → wrong data returned → **SILENT DATA CORRUPTION**

**FIX REQUIRED:**

```typescript
// Add collision detection
export class LRUCache<K, V> {
  set(key: K, value: V): void {
    const existing = this.cache.get(key)
    if (existing !== undefined && existing !== value) {
      throw new CacheCollisionError(`Hash collision detected for key: ${key}`)
    }
    // ... rest of implementation
  }
}
```

#### MEDIUM: TTLCache Auto-Prune Memory Leak

**Risk:** `pruneInterval` not cleared on early disposal.

```typescript
// packages/utils/src/cache/index.ts
Lines 217-229, 236-242

constructor(defaultTTLMs: number, options: TTLCacheOptions = {}) {
  if (options.autoPrune && options.autoPrune > 0) {
    this.pruneInterval = setInterval(() => {
      this.prune()
    }, options.autoPrune)
  }
}

dispose(): void {
  if (this.pruneInterval) {
    clearInterval(this.pruneInterval)  // ✅ Good cleanup
  }
}
```

**But consumers may not call `dispose()`:**

```typescript
// React hook that doesn't dispose
useEffect(() => {
  const cache = new TTLCache(60000, { autoPrune: 30000 })
  // Missing: return () => cache.dispose()
}, [])
```

**FIX REQUIRED:**

```typescript
// Add finalizer warning
constructor(defaultTTLMs: number, options: TTLCacheOptions = {}) {
  // ... setup

  if (options.autoPrune && typeof FinalizationRegistry !== 'undefined') {
    const registry = new FinalizationRegistry(() => {
      console.warn('TTLCache was garbage collected without dispose() call')
    })
    registry.register(this, null)
  }
}
```

### 1.3 Migration Safety Checks

**REQUIRED PRE-MIGRATION:**

```typescript
/**
 * Cache Migration Validator
 *
 * Ensures no data loss when consolidating cache implementations
 */
export class CacheMigrationValidator {
  /**
   * Verify cache key compatibility between old and new implementations
   */
  validateKeyEquivalence(oldCache: LRUCache<string, any>, newCache: SmartCache): ValidationReport {
    const report = {
      compatible: true,
      mismatches: [] as string[],
      collisions: [] as string[],
    }

    // Test 100 random keys
    for (let i = 0; i < 100; i++) {
      const key = generateTestKey()
      const oldHash = getContentHash(key)
      const newHash = newCache.hashKey(key)

      if (oldHash !== newHash) {
        report.compatible = false
        report.mismatches.push(key)
      }
    }

    return report
  }

  /**
   * Detect hash collisions before migration
   */
  detectCollisions(keys: string[]): Map<string, string[]> {
    const hashMap = new Map<string, string[]>()

    for (const key of keys) {
      const hash = getContentHash(key)
      const existing = hashMap.get(hash) || []
      existing.push(key)
      hashMap.set(hash, existing)
    }

    // Return only collisions
    return new Map(Array.from(hashMap.entries()).filter(([_, keys]) => keys.length > 1))
  }

  /**
   * Export cache state for rollback
   */
  async exportCacheSnapshot(cache: LRUCache<any, any>): Promise<CacheSnapshot> {
    const entries: Array<[any, any]> = []

    for (const [key, value] of cache.entries()) {
      entries.push([key, value])
    }

    return {
      timestamp: Date.now(),
      size: cache.size,
      entries,
      checksum: this.calculateChecksum(entries),
    }
  }

  /**
   * Verify migration integrity
   */
  verifyMigration(snapshot: CacheSnapshot, newCache: SmartCache): boolean {
    for (const [key, expectedValue] of snapshot.entries) {
      const actualValue = newCache.get(key)

      if (!deepEqual(actualValue, expectedValue)) {
        console.error('Migration verification failed:', { key, expectedValue, actualValue })
        return false
      }
    }

    return true
  }
}
```

---

## 2. Token Counting Accuracy

### 2.1 Current State Assessment

**Canonical:** `AccurateTokenCounter`
(packages/token-optimization/src/tokenizers/accurate-counter.ts)

```typescript
// Uses gpt-tokenizer (pure JS, 972KB)
import { encode, encodeChat, isWithinTokenLimit } from 'gpt-tokenizer'

count(text: string): number {
  if (!text) return 0

  // Cache check
  if (this.config.enableCaching && this.cache.has(text)) {
    this.cacheHits++
    return this.cache.get(text)!
  }

  // For non-OpenAI models (Claude, Gemini)
  if (this.useEstimation) {
    return this.estimateTokens(text)  // Uses cl100k_base as proxy
  }

  // Exact counting for OpenAI models
  const tokens = encode(text, { allowedSpecial: 'all' }).length

  // Cache result
  if (this.config.enableCaching) {
    this.addToCache(text, tokens)
  }

  return tokens
}
```

**Duplicates to be deleted:**

- FastTokenCounter
- SimpleTokenCounter
- AdvancedTokenCounter
- LegacyTokenCounter
- OptimizedTokenCounter
- SmartTokenCounter
- RobustTokenCounter

### 2.2 DATA INTEGRITY RISKS

#### CRITICAL: Estimation Divergence for Claude/Gemini

**Risk:** Token counts change between implementations for non-OpenAI models.

```typescript
// AccurateTokenCounter estimation (NEW)
private estimateTokens(text: string): number {
  try {
    // Uses cl100k_base encoding as proxy
    const tokens = encode(text, { allowedSpecial: 'all' }).length

    // Adjustment factors
    const adjustmentFactor = this.modelName === 'claude' ? 0.95 : 0.97
    return Math.ceil(tokens * adjustmentFactor)
  } catch {
    return this.characterBasedEstimate(text)
  }
}

// Old implementations may use different factors
// FastTokenCounter: text.length / 4
// SimpleTokenCounter: text.split(' ').length * 0.75
// AdvancedTokenCounter: Complex heuristic with code detection
```

**Divergence Example:**

```typescript
const text = 'Write a Python function to calculate fibonacci'

// Old FastTokenCounter
const oldCount = text.length / 4 // 50 / 4 = 12.5 → 13 tokens

// New AccurateTokenCounter (Claude)
const newCount = Math.ceil(encode(text).length * 0.95)
// encode() returns 10 tokens → 10 * 0.95 = 9.5 → 10 tokens

// DIVERGENCE: 13 → 10 tokens (23% decrease)
// If token budgets are cached, old budgets now invalid!
```

**Impact on Budget Tracking:**

```typescript
// User's stored budget (calculated with old counter)
localStorage.setItem('daily-tokens-used', '9500') // Based on FastTokenCounter

// After migration to AccurateTokenCounter
const actualUsed = recalculateWithNewCounter() // Returns 7600 tokens

// User has phantom 1900 tokens → BUDGET VIOLATION RISK
```

**FIX REQUIRED:**

```typescript
/**
 * Token Count Migration Tool
 *
 * Recalculates stored token counts after counter consolidation
 */
export class TokenCountMigrator {
  /**
   * Detect which counter implementation was used
   */
  detectCounterType(text: string, count: number): CounterType {
    const charBasedCount = text.length / 4
    const wordBasedCount = text.split(/\s+/).length * 0.75
    const actualCount = encode(text).length

    if (Math.abs(count - charBasedCount) < 1) return 'FastTokenCounter'
    if (Math.abs(count - wordBasedCount) < 1) return 'SimpleTokenCounter'
    if (Math.abs(count - actualCount) < 1) return 'AdvancedTokenCounter'

    return 'Unknown'
  }

  /**
   * Migrate stored token counts to new canonical counter
   */
  migrateStoredCounts(
    oldCounts: Map<string, number>,
    texts: Map<string, string>
  ): Map<string, number> {
    const canonicalCounter = new AccurateTokenCounter({
      model: 'gpt-4o',
      enableCaching: false,
    })

    const newCounts = new Map<string, number>()
    const divergences: Array<{ key: string; old: number; new: number; diff: number }> = []

    for (const [key, oldCount] of oldCounts) {
      const text = texts.get(key)
      if (!text) {
        console.warn(`Missing text for key: ${key}`)
        continue
      }

      const newCount = canonicalCounter.count(text)
      newCounts.set(key, newCount)

      const diff = Math.abs(newCount - oldCount)
      if (diff > oldCount * 0.1) {
        // >10% divergence
        divergences.push({ key, old: oldCount, new: newCount, diff })
      }
    }

    // Log significant divergences
    if (divergences.length > 0) {
      console.error('CRITICAL: Token count divergences detected:', divergences)
      throw new TokenCountMigrationError(`${divergences.length} token counts diverged by >10%`)
    }

    return newCounts
  }

  /**
   * Migrate localStorage token budgets
   */
  migrateLocalStorageBudgets(): void {
    const keys = ['clarity-tokens-throttle', 'token-usage-daily', 'token-budget-remaining']

    for (const key of keys) {
      const stored = localStorage.getItem(key)
      if (!stored) continue

      try {
        const data = JSON.parse(stored)

        // Recalculate token counts
        if (data.tokensUsedThisDay) {
          console.warn(
            `Cannot recalculate ${key}: no source text available. ` +
              `Consider resetting user budgets.`
          )
        }
      } catch (error) {
        console.error(`Failed to migrate ${key}:`, error)
      }
    }
  }
}
```

#### HIGH: Cache Invalidation on Counter Consolidation

**Risk:** Cached token counts become stale after migration.

```typescript
// AccurateTokenCounter cache (Lines 148-149, 236-238)
private cache: Map<string, number>

private addToCache(text: string, tokens: number): void {
  if (this.config.cacheSize && this.cache.size >= this.config.cacheSize) {
    // FIFO eviction
    const firstKey = this.cache.keys().next().value
    if (firstKey) {
      this.cache.delete(firstKey)
    }
  }
  this.cache.set(text, tokens)
}
```

**Problem:** No cache versioning or invalidation mechanism.

**If old counter cached:**

```typescript
// Old FastTokenCounter
cache.set('Hello world', 3) // Character-based estimate

// After migration, AccurateTokenCounter reads same cache
cache.get('Hello world') // Returns 3
// But actual gpt-tokenizer count is 2 → WRONG DATA
```

**FIX REQUIRED:**

```typescript
// Add cache versioning
export class AccurateTokenCounter {
  private static readonly CACHE_VERSION = '2.0.0' // Increment on algorithm change

  private cache = new Map<string, { version: string; tokens: number }>()

  count(text: string): number {
    if (this.config.enableCaching && this.cache.has(text)) {
      const entry = this.cache.get(text)!

      // Invalidate if version mismatch
      if (entry.version !== AccurateTokenCounter.CACHE_VERSION) {
        this.cache.delete(text)
        this.cacheMisses++
      } else {
        this.cacheHits++
        return entry.tokens
      }
    }

    const tokens = this.countInternal(text)

    if (this.config.enableCaching) {
      this.cache.set(text, {
        version: AccurateTokenCounter.CACHE_VERSION,
        tokens,
      })
    }

    return tokens
  }
}
```

#### MEDIUM: Race Condition in Cache Size Limit

**Risk:** Concurrent `addToCache` calls can exceed `maxSize`.

```typescript
// Lines 436-447
private addToCache(text: string, tokens: number): void {
  // CHECK
  if (this.config.cacheSize && this.cache.size >= this.config.cacheSize) {
    // EVICT
    const firstKey = this.cache.keys().next().value
    if (firstKey) {
      this.cache.delete(firstKey)
    }
  }

  // ADD
  this.cache.set(text, tokens)
}
```

**Race Condition:**

```
Thread 1: CHECK (size = 99, limit = 100) → Pass
Thread 2: CHECK (size = 99, limit = 100) → Pass
Thread 1: ADD → size = 100
Thread 2: ADD → size = 101 (EXCEEDS LIMIT)
```

**FIX REQUIRED:**

```typescript
private addToCache(text: string, tokens: number): void {
  // Always evict BEFORE adding if at limit
  while (this.config.cacheSize && this.cache.size >= this.config.cacheSize) {
    const firstKey = this.cache.keys().next().value
    if (firstKey) {
      this.cache.delete(firstKey)
    } else {
      break  // Shouldn't happen, but prevent infinite loop
    }
  }

  this.cache.set(text, tokens)
}
```

### 2.3 Migration Safety Checks

**REQUIRED PRE-MIGRATION:**

```bash
# 1. Export all cached token counts
node scripts/export-token-counts.js > old-counts.json

# 2. Recalculate with canonical counter
node scripts/recalculate-tokens.js old-counts.json > new-counts.json

# 3. Compare divergences
node scripts/compare-token-counts.js old-counts.json new-counts.json

# 4. If divergence < 5%, proceed
# If divergence > 5%, investigate and fix

# 5. Clear all localStorage token budgets
node scripts/clear-token-budgets.js

# 6. Notify users to refresh budgets
```

---

## 3. Validation Consistency

### 3.1 Current State Assessment

**Canonical:** `ValidationError` (packages/error-handling/src/errors/validation-error.ts)

```typescript
export class ValidationError extends ClarityError {
  readonly code: string = 'VALIDATION_ERROR'
  readonly statusCode: number = 400
  readonly fields: FieldError[]

  static field(
    field: string,
    message: string,
    code: ValidationErrorCode,
    options?: { value?: unknown; expected?: string }
  ): ValidationError {
    /* ... */
  }

  static required(field: string): ValidationError {
    /* ... */
  }
  static invalidFormat(field: string, expected: string, value?: unknown): ValidationError
  static outOfRange(field: string, min?: number, max?: number, value?: number): ValidationError
  // ... 8 total factory methods
}
```

**Extensions to keep:**

- `MemoryValidationError` (memory package)
- `ToolValidationError` (tool package)
- `ConfigValidationError` (config package)
- `CLIValidationError` (CLI package)

**Duplicates to delete:**

- `ValidationError` in token-optimization/src/errors/index.ts
- `ValidationError` in utils/src/errors/validation.ts
- `ValidationError` in cli/src/utils/errors.ts
- `ValidationError` in react/src/enterprise/enterprise-errors.ts

### 3.2 DATA INTEGRITY RISKS

#### HIGH: Validation Logic Drift Between Duplicates

**Risk:** Different duplicate implementations may have different validation rules.

**Example: Required field validation**

```typescript
// Canonical ValidationError (error-handling package)
static required(field: string): ValidationError {
  return ValidationError.field(
    field,
    `${field} is required`,
    ValidationErrorCode.REQUIRED_FIELD
  )
}

// Duplicate in utils/src/errors/validation.ts (hypothetical)
static required(field: string, allowEmpty = false): ValidationError {
  // DIFFERENT BEHAVIOR: Allows empty strings if allowEmpty=true
  return ValidationError.field(
    field,
    allowEmpty ? `${field} cannot be null` : `${field} is required`,
    ValidationErrorCode.REQUIRED_FIELD
  )
}
```

**Impact:**

```typescript
// Component A uses canonical ValidationError
if (!username) {
  throw ValidationError.required('username') // Rejects empty strings
}

// Component B uses duplicate ValidationError
if (!username) {
  throw ValidationError.required('username', true) // Allows empty strings
}

// INCONSISTENT BEHAVIOR: Same validation, different results
```

**FIX REQUIRED:**

```typescript
/**
 * Validation Consistency Checker
 *
 * Ensures all ValidationError duplicates produce identical results
 */
export class ValidationConsistencyChecker {
  /**
   * Test all factory methods for equivalence
   */
  testEquivalence(
    canonical: typeof ValidationError,
    duplicate: typeof ValidationError
  ): ValidationReport {
    const report = {
      compatible: true,
      mismatches: [] as Array<{
        method: string
        canonicalError: string
        duplicateError: string
      }>,
    }

    // Test: required()
    const canonicalRequired = canonical.required('email')
    const duplicateRequired = duplicate.required('email')

    if (canonicalRequired.message !== duplicateRequired.message) {
      report.compatible = false
      report.mismatches.push({
        method: 'required',
        canonicalError: canonicalRequired.message,
        duplicateError: duplicateRequired.message,
      })
    }

    // Test: invalidFormat()
    const canonicalFormat = canonical.invalidFormat('email', 'user@domain.com', 'invalid')
    const duplicateFormat = duplicate.invalidFormat('email', 'user@domain.com', 'invalid')

    if (canonicalFormat.message !== duplicateFormat.message) {
      report.compatible = false
      report.mismatches.push({
        method: 'invalidFormat',
        canonicalError: canonicalFormat.message,
        duplicateError: duplicateFormat.message,
      })
    }

    // ... test all 8 factory methods

    return report
  }

  /**
   * Find all ValidationError usage in codebase
   */
  async findAllValidationUsage(): Promise<Map<string, string[]>> {
    const usage = new Map<string, string[]>()

    // Search for ValidationError.required()
    const requiredUsage = await execAsync(`rg "ValidationError\\.required" --type ts --type tsx -l`)
    usage.set('required', requiredUsage.split('\n'))

    // ... search for all factory methods

    return usage
  }

  /**
   * Verify no runtime behavior changes after migration
   */
  async verifyNoRegressions(
    beforeSnapshot: ValidationSnapshot,
    afterSnapshot: ValidationSnapshot
  ): Promise<boolean> {
    for (const [testCase, beforeError] of beforeSnapshot.results) {
      const afterError = afterSnapshot.results.get(testCase)

      if (!afterError) {
        console.error(`Missing test case after migration: ${testCase}`)
        return false
      }

      if (
        beforeError.code !== afterError.code ||
        beforeError.message !== afterError.message ||
        beforeError.statusCode !== afterError.statusCode
      ) {
        console.error('Validation regression detected:', {
          testCase,
          before: beforeError,
          after: afterError,
        })
        return false
      }
    }

    return true
  }
}
```

#### MEDIUM: Error Message Localization Drift

**Risk:** Different duplicates may have different error messages.

```typescript
// Canonical
static tooLong(field: string, maxLength: number, actual: number): ValidationError {
  return ValidationError.field(
    field,
    `${field} exceeds maximum length of ${maxLength}`,
    ValidationErrorCode.TOO_LONG,
    { value: actual, expected: `max ${maxLength} characters` }
  )
}

// Potential duplicate variation
static tooLong(field: string, maxLength: number): ValidationError {
  return ValidationError.field(
    field,
    `${field} is too long (max: ${maxLength})`,  // DIFFERENT MESSAGE
    ValidationErrorCode.TOO_LONG
  )
}
```

**Impact:** UI shows different error messages for same validation error.

**FIX:** Use canonical implementation everywhere, ensure message consistency.

### 3.3 Migration Safety Checks

**REQUIRED PRE-MIGRATION:**

```typescript
/**
 * Create validation test suite BEFORE migration
 */
export class ValidationRegressionSuite {
  /**
   * Snapshot all validation error outputs
   */
  createSnapshot(): ValidationSnapshot {
    const snapshot = new Map<string, ValidationErrorResult>()

    // Test required()
    try {
      throw ValidationError.required('username')
    } catch (error) {
      snapshot.set('required-username', {
        code: (error as ValidationError).code,
        message: error.message,
        statusCode: (error as ValidationError).statusCode,
        fields: (error as ValidationError).fields,
      })
    }

    // Test invalidFormat()
    try {
      throw ValidationError.invalidFormat('email', 'user@domain.com', 'notanemail')
    } catch (error) {
      snapshot.set('invalidFormat-email', {
        code: (error as ValidationError).code,
        message: error.message,
        statusCode: (error as ValidationError).statusCode,
        fields: (error as ValidationError).fields,
      })
    }

    // ... test all factory methods with various inputs

    return { timestamp: Date.now(), results: snapshot }
  }

  /**
   * Run after migration, compare to before snapshot
   */
  verifySnapshot(before: ValidationSnapshot, after: ValidationSnapshot): boolean {
    let passed = true

    for (const [testCase, beforeResult] of before.results) {
      const afterResult = after.results.get(testCase)

      if (!afterResult) {
        console.error(`Missing test: ${testCase}`)
        passed = false
        continue
      }

      if (!this.resultsEqual(beforeResult, afterResult)) {
        console.error(`Regression in ${testCase}:`, {
          before: beforeResult,
          after: afterResult,
        })
        passed = false
      }
    }

    return passed
  }
}
```

---

## 4. Error State Management

### 4.1 Current State Assessment

**Canonical:** `EnhancedErrorBoundary`
(packages/error-handling/src/components/EnhancedErrorBoundary.tsx)

```typescript
export function EnhancedErrorBoundary({
  children,
  FallbackComponent = DefaultFallback,
  fallback,
  onError,
  onReset,
  resetKeys,
  enableLogging = true,
}: EnhancedErrorBoundaryProps) {
  const handleError = React.useCallback(
    (error: Error, info: React.ErrorInfo) => {
      // Log to external service
      if (enableLogging) {
        console.error('[EnhancedErrorBoundary] Caught error:', {
          error: isClarityError(error) ? error.toJSON() : error,
          componentStack: info.componentStack,
        })
      }

      onError?.(error, info)
    },
    [enableLogging, onError]
  )

  return (
    <div className={className}>
      <ReactErrorBoundary
        FallbackComponent={FallbackWrapper}
        onError={handleError}
        onReset={handleReset}
        resetKeys={resetKeys}
      >
        {children}
      </ReactErrorBoundary>
    </div>
  )
}
```

**Uses:** `react-error-boundary` v5 library

**Duplicates to delete:**

- ErrorBoundary.ts (class component)
- playground/src/components/ErrorBoundary.ts
- react/src/components/feedback/error-boundary.tsx
- PromptArchitectErrorBoundary.tsx
- 20+ example error boundaries

### 4.2 DATA INTEGRITY RISKS

#### MEDIUM: Error State Lost During Boundary Consolidation

**Risk:** Different error boundaries may have different error logging logic.

```typescript
// EnhancedErrorBoundary (canonical) - Logs to console
if (enableLogging) {
  console.error('[EnhancedErrorBoundary] Caught error:', {
    error: isClarityError(error) ? error.toJSON() : error,
    componentStack: info.componentStack,
  })
}

// Custom ErrorBoundary (duplicate) - Sends to Sentry
onError(error, info) {
  Sentry.captureException(error, {
    contexts: {
      react: {
        componentStack: info.componentStack
      }
    }
  })
}
```

**After migration:** If custom logging removed, error tracking lost.

**FIX:** Preserve custom `onError` handlers during migration:

```typescript
// Before migration, inventory all custom onError handlers
const customHandlers = findAllErrorHandlers()  // Returns Map<file, handler>

// During migration, ensure onError prop is passed
<EnhancedErrorBoundary
  onError={(error, info) => {
    // Preserve custom logging
    customLogic(error, info)
  }}
>
  {children}
</EnhancedErrorBoundary>
```

#### MEDIUM: Reset Key Semantics Change

**Risk:** `resetKeys` behavior may differ between boundaries.

```typescript
// EnhancedErrorBoundary uses react-error-boundary resetKeys
<ReactErrorBoundary
  resetKeys={resetKeys}  // Resets when array identity changes
>

// Custom boundary may use different reset logic
componentDidUpdate(prevProps) {
  if (prevProps.userId !== this.props.userId) {
    this.setState({ hasError: false })  // Resets on userId change
  }
}
```

**After migration:** Reset behavior changes, stale errors may persist.

**FIX:** Ensure `resetKeys` prop correctly resets errors:

```typescript
// Before migration
class CustomBoundary {
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.setState({ hasError: false })
    }
  }
}

// After migration
<EnhancedErrorBoundary
  resetKeys={[userId]}  // ✅ Equivalent behavior
>
```

#### LOW: Animation State Loss

**Risk:** EnhancedErrorBoundary has built-in animations that may not match custom boundaries.

```typescript
// EnhancedErrorBoundary - Built-in animations
const containerStyle: React.CSSProperties = {
  animation: !prefersReducedMotion
    ? 'enhancedErrorFadeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
    : 'none',
}

// Custom boundary - No animations
return <div>Error occurred</div>
```

**Not a data integrity issue, but UX regression.**

### 4.3 Migration Safety Checks

**REQUIRED PRE-MIGRATION:**

```bash
# 1. Inventory all custom error handlers
rg "onError=" --type tsx -A 5 > error-handlers.txt

# 2. Check for custom reset logic
rg "componentDidUpdate.*hasError" --type tsx > reset-logic.txt

# 3. Verify all custom handlers preserved after migration
node scripts/verify-error-handlers.js error-handlers.txt
```

---

## 5. Migration Safety: Overall Strategy

### 5.1 Pre-Migration Requirements

**BLOCKING:** These MUST be completed before any consolidation:

1. **Export all cache snapshots**

   ```bash
   node scripts/export-cache-snapshots.js
   # Exports: lru-cache-snapshot.json, ttl-cache-snapshot.json, smart-cache-snapshot.json
   ```

2. **Export all token count data**

   ```bash
   node scripts/export-token-data.js
   # Exports: token-counts.json, token-budgets.json
   ```

3. **Create validation test suite**

   ```bash
   node scripts/create-validation-snapshot.js
   # Exports: validation-snapshot.json
   ```

4. **Inventory all error handlers**
   ```bash
   node scripts/inventory-error-handlers.js
   # Exports: error-handlers.json
   ```

### 5.2 Migration Execution Order

**CRITICAL:** Execute in this EXACT order to prevent data loss:

#### Phase 1: Infrastructure Setup (1 hour)

```bash
# 1. Create migration branch
git checkout -b consolidation-migration

# 2. Install migration tools
pnpm add --save-dev deep-equal fast-hash

# 3. Create rollback snapshots
node scripts/create-rollback-snapshot.js
# Creates: .migration-snapshots/pre-migration-$(date).tar.gz

# 4. Run data integrity checks
pnpm test:data-integrity
# MUST PASS: 0 failures
```

#### Phase 2: Token Counter Consolidation (4 hours)

```bash
# 1. Add cache versioning to AccurateTokenCounter
# Manual code change: Add CACHE_VERSION constant

# 2. Deploy cache invalidation
pnpm build:packages
pnpm test

# 3. Clear all token caches
node scripts/clear-token-caches.js

# 4. Migrate localStorage budgets
node scripts/migrate-token-budgets.js

# 5. Update all imports
node scripts/update-token-imports.js

# 6. Verify token count accuracy
node scripts/verify-token-counts.js
# MUST PASS: <5% divergence

# 7. Delete duplicate counters
rm packages/token-optimization/src/tokenizers/fast-counter.ts
# ... delete all duplicates

# 8. Run tests
pnpm test
# MUST PASS: All tests green
```

#### Phase 3: Cache Consolidation (6 hours)

```bash
# 1. Add collision detection to LRUCache
# Manual code change

# 2. Add cache migration validator
cp scripts/CacheMigrationValidator.ts packages/utils/src/

# 3. Export existing cache data
node scripts/export-cache-data.js

# 4. Detect hash collisions
node scripts/detect-hash-collisions.js
# MUST PASS: 0 collisions

# 5. Update all imports
node scripts/update-cache-imports.js

# 6. Migrate cache data to canonical implementations
node scripts/migrate-cache-data.js

# 7. Verify migration integrity
node scripts/verify-cache-migration.js
# MUST PASS: 100% data match

# 8. Delete duplicate caches
rm packages/react/src/utils/tokenization/intelligent-caching.ts
# ... delete all duplicates

# 9. Run tests
pnpm test
```

#### Phase 4: Validation Consolidation (3 hours)

```bash
# 1. Create validation regression suite
node scripts/create-validation-suite.js

# 2. Run pre-migration snapshot
node scripts/snapshot-validation.js > validation-before.json

# 3. Update all imports
node scripts/update-validation-imports.js

# 4. Delete duplicates
rm packages/utils/src/errors/validation.ts
# ... delete all duplicates

# 5. Run post-migration snapshot
node scripts/snapshot-validation.js > validation-after.json

# 6. Compare snapshots
node scripts/compare-validation-snapshots.js validation-before.json validation-after.json
# MUST PASS: 0 differences

# 7. Run tests
pnpm test
```

#### Phase 5: Error Boundary Consolidation (2 hours)

```bash
# 1. Inventory custom error handlers
node scripts/inventory-error-handlers.js > handlers-before.json

# 2. Update all ErrorBoundary usage
node scripts/update-error-boundaries.js

# 3. Verify handlers preserved
node scripts/verify-error-handlers.js handlers-before.json
# MUST PASS: All handlers preserved

# 4. Delete duplicates
rm packages/react/src/components/feedback/error-boundary.tsx
# ... delete all duplicates

# 5. Run tests
pnpm test
```

#### Phase 6: Final Verification (2 hours)

```bash
# 1. Run full test suite
pnpm test

# 2. Run data integrity checks
pnpm test:data-integrity

# 3. Verify zero old API references
rg "FastTokenCounter|SimpleTokenCounter" --type ts
# MUST RETURN: 0 results

# 4. Build all packages
pnpm build:packages

# 5. Verify bundle sizes
node scripts/check-bundle-sizes.js
# MUST PASS: No size regressions

# 6. Create migration report
node scripts/create-migration-report.js
# Exports: migration-report.md
```

### 5.3 Rollback Procedures

**If ANY verification step fails:**

```bash
# 1. Stop immediately
git stash

# 2. Restore pre-migration snapshot
node scripts/restore-rollback-snapshot.js .migration-snapshots/pre-migration-*.tar.gz

# 3. Verify restoration
pnpm test
pnpm test:data-integrity

# 4. Investigate failure
cat migration-error.log

# 5. Fix issue, retry migration
```

### 5.4 Data Integrity Verification Scripts

**Create these BEFORE starting migration:**

#### `scripts/verify-token-counts.js`

```javascript
/**
 * Verify token count accuracy after migration
 */
const { AccurateTokenCounter } = require('@clarity-chat/token-optimization')
const oldCounts = require('./token-counts.json')

const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  enableCaching: false,
})

let totalDivergence = 0
let maxDivergence = 0
const divergences = []

for (const [text, oldCount] of Object.entries(oldCounts)) {
  const newCount = counter.count(text)
  const diff = Math.abs(newCount - oldCount)
  const percentDiff = (diff / oldCount) * 100

  totalDivergence += percentDiff
  maxDivergence = Math.max(maxDivergence, percentDiff)

  if (percentDiff > 5) {
    divergences.push({ text, oldCount, newCount, percentDiff })
  }
}

const avgDivergence = totalDivergence / Object.keys(oldCounts).length

console.log('Token Count Verification Report:')
console.log(`  Average divergence: ${avgDivergence.toFixed(2)}%`)
console.log(`  Max divergence: ${maxDivergence.toFixed(2)}%`)
console.log(`  Counts >5% divergence: ${divergences.length}`)

if (avgDivergence > 5 || maxDivergence > 10) {
  console.error('FAILED: Token count divergence too high')
  process.exit(1)
}

console.log('PASSED: Token counts within acceptable range')
```

#### `scripts/verify-cache-migration.js`

```javascript
/**
 * Verify cache data integrity after migration
 */
const { LRUCache } = require('@clarity-chat/utils')
const snapshot = require('./cache-snapshot.json')

const cache = new LRUCache(snapshot.maxSize)

// Restore snapshot
for (const [key, value] of snapshot.entries) {
  cache.set(key, value)
}

// Verify all entries
let passed = 0
let failed = 0

for (const [key, expectedValue] of snapshot.entries) {
  const actualValue = cache.get(key)

  if (JSON.stringify(actualValue) === JSON.stringify(expectedValue)) {
    passed++
  } else {
    failed++
    console.error('Cache mismatch:', { key, expected: expectedValue, actual: actualValue })
  }
}

console.log('Cache Migration Verification Report:')
console.log(`  Passed: ${passed}`)
console.log(`  Failed: ${failed}`)

if (failed > 0) {
  console.error('FAILED: Cache data corrupted')
  process.exit(1)
}

console.log('PASSED: All cache data intact')
```

---

## 6. Recommended Fixes Summary

### 6.1 CRITICAL Fixes (MUST implement before migration)

1. **Fix `useSemanticCache` dual storage** (Lines 86-89, 224-231)
   - Use cache's native ID instead of generating random IDs
   - Add synchronized eviction between cache and responseMap
   - Add memory leak detection

2. **Add cache collision detection** (packages/utils/src/cache/index.ts)
   - Detect when two different keys hash to same value
   - Throw error instead of silently overwriting

3. **Add token counter cache versioning** (packages/token-optimization/.../accurate-counter.ts)
   - Add CACHE_VERSION constant
   - Invalidate cache entries from old versions
   - Prevent stale token counts

### 6.2 HIGH Priority Fixes

4. **Token count migration tool**
   - Recalculate all stored token counts with canonical counter
   - Detect divergences >10%
   - Clear localStorage budgets if divergence too high

5. **Validation consistency checker**
   - Create regression test suite BEFORE migration
   - Verify identical behavior AFTER migration
   - Ensure no message changes

6. **Cache migration validator**
   - Export cache snapshots before migration
   - Verify data integrity after migration
   - Automated rollback on failure

### 6.3 MEDIUM Priority Fixes

7. **TTLCache disposal warning**
   - Add FinalizationRegistry warning
   - Detect leaked intervals

8. **Race condition in cache eviction**
   - Use while loop instead of if
   - Prevent exceeding maxSize

9. **Error handler preservation**
   - Inventory all custom onError handlers
   - Ensure they're preserved in migration

---

## 7. Migration Checklist

**Use this checklist during execution:**

### Pre-Migration (BLOCKING)

- [ ] Install migration tools (`deep-equal`, `fast-hash`)
- [ ] Create rollback snapshots (`.migration-snapshots/`)
- [ ] Export cache snapshots (`cache-snapshot.json`)
- [ ] Export token count data (`token-counts.json`)
- [ ] Create validation snapshot (`validation-before.json`)
- [ ] Inventory error handlers (`error-handlers.json`)
- [ ] Run data integrity tests (0 failures)

### Token Counter Migration

- [ ] Add cache versioning to `AccurateTokenCounter`
- [ ] Clear all token caches
- [ ] Migrate localStorage budgets
- [ ] Update all imports
- [ ] Verify token count accuracy (<5% divergence)
- [ ] Delete duplicate counters
- [ ] Run tests (all pass)

### Cache Migration

- [ ] Add collision detection to `LRUCache`
- [ ] Export existing cache data
- [ ] Detect hash collisions (0 found)
- [ ] Update all imports
- [ ] Migrate cache data
- [ ] Verify migration integrity (100% match)
- [ ] Delete duplicate caches
- [ ] Run tests (all pass)

### Validation Migration

- [ ] Create validation regression suite
- [ ] Run pre-migration snapshot
- [ ] Update all imports
- [ ] Delete duplicates
- [ ] Run post-migration snapshot
- [ ] Compare snapshots (0 differences)
- [ ] Run tests (all pass)

### Error Boundary Migration

- [ ] Inventory custom error handlers
- [ ] Update all ErrorBoundary usage
- [ ] Verify handlers preserved
- [ ] Delete duplicates
- [ ] Run tests (all pass)

### Final Verification

- [ ] Run full test suite (all pass)
- [ ] Run data integrity checks (all pass)
- [ ] Verify zero old API references
- [ ] Build all packages (success)
- [ ] Verify bundle sizes (no regressions)
- [ ] Create migration report

---

## 8. Risk Assessment Matrix

| Risk                    | Severity | Likelihood                | Impact                  | Mitigation                 |
| ----------------------- | -------- | ------------------------- | ----------------------- | -------------------------- |
| Cache key collision     | CRITICAL | Low (1.16% at 100k items) | Data corruption         | Add collision detection    |
| Token count divergence  | HIGH     | High (23% in example)     | Budget violations       | Recalculate all counts     |
| Dual storage desync     | CRITICAL | Medium                    | Data loss               | Use single source of truth |
| Validation logic drift  | HIGH     | Medium                    | Inconsistent behavior   | Regression test suite      |
| Error state loss        | MEDIUM   | Low                       | Lost error tracking     | Preserve custom handlers   |
| localStorage corruption | MEDIUM   | Medium                    | Budget reset            | Clear on divergence        |
| Memory leak (TTLCache)  | MEDIUM   | High                      | Performance degradation | Add disposal warning       |
| Race condition (cache)  | LOW      | Low                       | Exceeded maxSize        | Use while loop             |

---

## 9. Success Criteria

**Migration is ONLY successful if ALL of these pass:**

1. ✅ **Zero data loss:** All cache entries, token counts, and validation results match
   pre-migration
2. ✅ **Zero behavioral changes:** Validation snapshot comparison shows 0 differences
3. ✅ **Zero test failures:** Full test suite passes (pnpm test)
4. ✅ **Zero old API references:** `rg` searches return 0 results for deleted APIs
5. ✅ **Token count accuracy:** <5% average divergence, <10% max divergence
6. ✅ **Cache collision-free:** Hash collision detection finds 0 collisions
7. ✅ **Error handlers preserved:** All custom onError logic intact
8. ✅ **Build succeeds:** All packages build successfully
9. ✅ **Bundle size stable:** No significant size regressions
10. ✅ **Documentation updated:** All references to old APIs removed

**If ANY criterion fails, ROLLBACK immediately.**

---

## 10. Post-Migration Monitoring

**After migration, monitor for 7 days:**

1. **Cache hit rates:** Should remain stable (±5%)
2. **Token budget violations:** Should not increase
3. **Validation errors:** Should have same frequency
4. **Error boundary triggers:** Should have same frequency
5. **Memory usage:** Should not increase (watch for TTLCache leaks)

**Set up alerts:**

```typescript
// Alert if cache hit rate drops >10%
if (newHitRate < oldHitRate * 0.9) {
  alert('Cache hit rate degraded after migration')
}

// Alert if token divergence detected
if (Math.abs(newCount - oldCount) / oldCount > 0.1) {
  alert('Token count divergence detected')
}
```

---

## Conclusion

The API consolidation plan is architecturally sound but introduces **significant data integrity
risks**. The primary concerns are:

1. **Cache consistency:** Dual storage pattern in `useSemanticCache` can desynchronize
2. **Token counting accuracy:** Different counter implementations produce divergent counts
3. **Validation consistency:** Duplicate ValidationErrors may have different logic
4. **Error state preservation:** Custom error handlers may be lost

**RECOMMENDATION:** Implement all CRITICAL and HIGH priority fixes BEFORE executing the
consolidation plan. Follow the migration checklist exactly, and ROLLBACK immediately if any
verification step fails.

**ESTIMATED ADDITIONAL EFFORT:** 24 hours for fixes + verification scripts

**TOTAL MIGRATION EFFORT:** 135 hours (original) + 24 hours (data integrity) = **159 hours**

---

**Prepared by:** Data Integrity Guardian **Date:** 2026-01-25 **Status:** Ready for review and
implementation
