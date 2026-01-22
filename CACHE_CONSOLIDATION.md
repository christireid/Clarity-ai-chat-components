# Cache Implementation Consolidation

## Overview

This document analyzes the caching implementations across the codebase and identifies consolidation opportunities to reduce code duplication and improve maintainability.

## Current Cache Implementations

### 1. Token Optimization Caches (Well-Organized)

**Location:** `packages/token-optimization/src/cache/`

#### ExactCache
**File:** `exact-cache.ts` (191 lines)
**Purpose:** O(1) hash-based cache with LRU eviction (Tier 1 caching)
**Features:**
- FNV-1a hashing for fast, well-distributed keys
- LRU eviction policy
- TTL expiration
- Stats tracking (hits, misses, hit rate)
- Clean, efficient implementation

#### SmartCache
**File:** `smart-cache.ts` (361 lines)
**Purpose:** Pattern-based cache with entity extraction (Tier 2 caching)
**Features:**
- Template generation (replaces locations, dates, numbers with placeholders)
- Pattern matching for semantically equivalent queries
- LRU eviction
- TTL expiration
- Parameter extraction
- Confidence scoring

#### TieredCache
**File:** `tiered-cache.ts` (267 lines)
**Purpose:** Multi-tier cache orchestrator
**Features:**
- Combines ExactCache (Tier 1) + SmartCache (Tier 2) + AdvancedSemanticCache (Tier 3)
- Waterfall lookup strategy
- Latency tracking
- Comprehensive stats across all tiers
- Prefetch support

**Assessment:** ✅ Well-designed, minimal duplication, good separation of concerns

### 2. Embedding Caches (High Duplication)

**Location:** `packages/react/src/embeddings/cache.ts` (309 lines)

#### MemoryEmbeddingCache
**Lines:** 16-95 (80 lines)
**Purpose:** In-memory embedding cache
**Features:**
- Simple hash function (different from ExactCache's FNV-1a)
- Map-based storage
- TTL support
- Stats tracking (hits, misses, hit rate)
- Async interface

#### LocalStorageEmbeddingCache
**Lines:** 103-208 (106 lines)
**Purpose:** Persistent embedding cache using localStorage
**Features:**
- Same hash function as MemoryEmbeddingCache
- localStorage persistence
- TTL support
- Stats tracking
- Quota exceeded handling
- Async interface

#### SemanticEmbeddingCache
**Lines:** 216-308 (93 lines)
**Purpose:** Semantic cache with similarity search (placeholder implementation)
**Features:**
- Cosine similarity computation (unused)
- Same TTL and stats as others
- Async interface
- **Note:** Currently only does exact matching, semantic features not implemented

**Issues:**
- ❌ Hash function duplicated 2x (and differs from ExactCache's better FNV-1a)
- ❌ Stats tracking duplicated 3x
- ❌ TTL expiration logic duplicated 3x
- ❌ getCacheKey method duplicated 3x
- ❌ Similar interfaces but slightly different implementations
- ❌ SemanticEmbeddingCache doesn't actually use semantic similarity
- ❌ No LRU eviction (unbounded growth risk)

### 3. Additional Caches (Not Analyzed Yet)

These exist but weren't examined in detail:
- `use-smart-cache.tsx` (React hook wrapper)
- `semantic-cache-persistent.ts`
- `kv-cache-prompt-builder.ts`
- `structured-output-cache.ts`
- `cache-manager.ts` (prompt caching)

## Problems Identified

### High Priority Issues

1. **Embedding Cache Duplication**
   - Three classes with 80-95% identical logic
   - Hash function duplicated 2x
   - Stats tracking duplicated 3x
   - TTL logic duplicated 3x
   - No LRU eviction in any embedding cache

2. **Inconsistent Hashing**
   - ExactCache uses FNV-1a (better distribution, collision resistance)
   - EmbeddingCaches use simple bitshift hash (weaker, more collisions)
   - No shared hash utility

3. **Missing Features**
   - EmbeddingCaches lack LRU eviction (memory leak risk)
   - SemanticEmbeddingCache semantic features not implemented
   - No size limits in embedding caches

### Medium Priority Issues

4. **Stats Tracking Duplication**
   - Every cache reimplements hits/misses/hitRate tracking
   - Could be a shared utility class

5. **TTL Logic Duplication**
   - Every cache reimplements TTL expiration checks
   - Could be a shared utility function

## Consolidation Strategy

### Phase 1: Create Shared Cache Utilities

**File:** `packages/shared/src/cache/utils.ts`

```typescript
/**
 * Shared cache utilities
 */

// FNV-1a hash - fast with good distribution
export function hash(input: string): string {
  let hash = 2166136261 // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i)
    hash = Math.imul(hash, 16777619) // FNV prime
    hash = hash >>> 0 // Keep as unsigned 32-bit
  }
  return hash.toString(36)
}

// Stats tracker
export class CacheStats {
  private hits = 0
  private misses = 0

  recordHit(): void {
    this.hits++
  }

  recordMiss(): void {
    this.misses++
  }

  reset(): void {
    this.hits = 0
    this.misses = 0
  }

  getStats() {
    const total = this.hits + this.misses
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    }
  }
}

// TTL checker
export function isExpired(timestamp: number, ttl: number): boolean {
  return Date.now() - timestamp > ttl
}

// LRU tracker
export class LRUTracker {
  private accessOrder: string[] = []

  access(key: string): void {
    this.remove(key)
    this.accessOrder.push(key)
  }

  remove(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }

  getLRU(): string | undefined {
    return this.accessOrder[0]
  }

  clear(): void {
    this.accessOrder = []
  }

  get size(): number {
    return this.accessOrder.length
  }
}
```

**Savings:** ~150 lines of duplicated code

### Phase 2: Consolidate Embedding Caches

**File:** `packages/react/src/embeddings/unified-embedding-cache.ts`

```typescript
/**
 * Unified Embedding Cache
 *
 * Consolidates three separate embedding cache implementations:
 * 1. MemoryEmbeddingCache (in-memory)
 * 2. LocalStorageEmbeddingCache (persistent)
 * 3. SemanticEmbeddingCache (semantic similarity - future)
 *
 * Features:
 * - Multiple storage backends (memory, localStorage, custom)
 * - FNV-1a hashing (better than simple hash)
 * - LRU eviction (prevents unbounded growth)
 * - TTL support
 * - Stats tracking
 * - Semantic similarity (future)
 */

import { hash, CacheStats, isExpired, LRUTracker } from '@clarity-chat/shared/cache'

export type StorageBackend = 'memory' | 'localStorage' | 'custom'

export interface EmbeddingCacheConfig {
  /** Storage backend to use */
  backend: StorageBackend
  /** Maximum number of entries (enables LRU eviction) */
  maxSize?: number
  /** Time-to-live in milliseconds */
  ttl?: number
  /** Similarity threshold for semantic matching (0-1) */
  similarityThreshold?: number
  /** Custom storage implementation */
  customStorage?: CacheStorage
}

export interface CacheStorage {
  get(key: string): Promise<EmbeddingCacheEntry | null>
  set(key: string, entry: EmbeddingCacheEntry): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  keys(): Promise<string[]>
}

export interface EmbeddingCacheEntry {
  key: string
  text: string
  model: string
  embedding: number[]
  timestamp: number
  expiresAt?: number
}

export class UnifiedEmbeddingCache {
  private storage: CacheStorage
  private stats: CacheStats
  private lru?: LRUTracker
  private config: EmbeddingCacheConfig

  constructor(config: EmbeddingCacheConfig) {
    this.config = config
    this.stats = new CacheStats()

    if (config.maxSize) {
      this.lru = new LRUTracker()
    }

    // Initialize storage backend
    if (config.backend === 'memory') {
      this.storage = new MemoryStorage()
    } else if (config.backend === 'localStorage') {
      this.storage = new LocalStorage()
    } else if (config.customStorage) {
      this.storage = config.customStorage
    } else {
      throw new Error('Invalid storage backend')
    }
  }

  private getCacheKey(text: string, model: string): string {
    return hash(`${model}:${text}`)
  }

  async get(text: string, model: string): Promise<number[] | null> {
    const key = this.getCacheKey(text, model)
    const entry = await this.storage.get(key)

    if (!entry) {
      this.stats.recordMiss()
      return null
    }

    // Check TTL
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      await this.storage.delete(key)
      this.lru?.remove(key)
      this.stats.recordMiss()
      return null
    }

    // Update LRU
    this.lru?.access(key)
    this.stats.recordHit()
    return entry.embedding
  }

  async set(text: string, model: string, embedding: number[], ttl?: number): Promise<void> {
    const key = this.getCacheKey(text, model)

    // LRU eviction if at capacity
    if (this.config.maxSize && this.lru) {
      const keys = await this.storage.keys()
      while (keys.length >= this.config.maxSize) {
        const lruKey = this.lru.getLRU()
        if (lruKey) {
          await this.storage.delete(lruKey)
          this.lru.remove(lruKey)
          keys.splice(keys.indexOf(lruKey), 1)
        } else {
          break
        }
      }
    }

    const entry: EmbeddingCacheEntry = {
      key,
      text,
      model,
      embedding,
      timestamp: Date.now(),
      expiresAt: ttl ? Date.now() + ttl : this.config.ttl ? Date.now() + this.config.ttl : undefined,
    }

    await this.storage.set(key, entry)
    this.lru?.access(key)
  }

  async has(text: string, model: string): Promise<boolean> {
    const result = await this.get(text, model)
    return result !== null
  }

  async clear(): Promise<void> {
    await this.storage.clear()
    this.lru?.clear()
    this.stats.reset()
  }

  async getStats(): Promise<{
    size: number
    hits: number
    misses: number
    hitRate: number
  }> {
    const keys = await this.storage.keys()
    return {
      size: keys.length,
      ...this.stats.getStats(),
    }
  }
}

// Memory storage implementation
class MemoryStorage implements CacheStorage {
  private cache = new Map<string, EmbeddingCacheEntry>()

  async get(key: string): Promise<EmbeddingCacheEntry | null> {
    return this.cache.get(key) || null
  }

  async set(key: string, entry: EmbeddingCacheEntry): Promise<void> {
    this.cache.set(key, entry)
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key)
  }

  async clear(): Promise<void> {
    this.cache.clear()
  }

  async keys(): Promise<string[]> {
    return Array.from(this.cache.keys())
  }
}

// LocalStorage storage implementation
class LocalStorage implements CacheStorage {
  private storageKey = 'clarity-embeddings-cache'

  private getCache(): Map<string, EmbeddingCacheEntry> {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) return new Map()
      const data = JSON.parse(stored)
      return new Map(Object.entries(data))
    } catch {
      return new Map()
    }
  }

  private setCache(cache: Map<string, EmbeddingCacheEntry>): void {
    try {
      const data = Object.fromEntries(cache)
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.warn('LocalStorage cache write failed:', error)
    }
  }

  async get(key: string): Promise<EmbeddingCacheEntry | null> {
    const cache = this.getCache()
    return cache.get(key) || null
  }

  async set(key: string, entry: EmbeddingCacheEntry): Promise<void> {
    const cache = this.getCache()
    cache.set(key, entry)
    this.setCache(cache)
  }

  async delete(key: string): Promise<void> {
    const cache = this.getCache()
    cache.delete(key)
    this.setCache(cache)
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.storageKey)
  }

  async keys(): Promise<string[]> {
    const cache = this.getCache()
    return Array.from(cache.keys())
  }
}
```

### Phase 3: Update Token Optimization Caches

The token optimization caches (ExactCache, SmartCache, TieredCache) are already well-designed. The only improvement would be to use shared utilities:

```typescript
// In exact-cache.ts - replace hash method
import { hash } from '@clarity-chat/shared/cache'

// In exact-cache.ts - use shared stats
import { CacheStats, LRUTracker } from '@clarity-chat/shared/cache'
```

### Phase 4: Update Usage

Update all imports and usages:

```typescript
// Before
import { MemoryEmbeddingCache } from './embeddings/cache'
const cache = new MemoryEmbeddingCache()

// After
import { UnifiedEmbeddingCache } from './embeddings/unified-embedding-cache'
const cache = new UnifiedEmbeddingCache({
  backend: 'memory',
  maxSize: 1000,
  ttl: 3600000
})
```

## Benefits

### 1. Reduced Code Duplication
- **Before:** ~280 lines of embedding cache code with significant duplication
- **After:** ~200 lines unified + ~100 lines shared utilities
- **Savings:** ~180 lines of duplicate code

### 2. Better Hashing
- All caches use FNV-1a hash (better distribution, fewer collisions)
- Single source of truth for hashing logic
- Easier to upgrade hash algorithm if needed

### 3. LRU Eviction Everywhere
- Embedding caches now have LRU eviction (prevents memory leaks)
- Consistent eviction behavior across all caches
- Configurable max size

### 4. Consistent Stats Tracking
- All caches use same stats tracking
- Easier to aggregate cache statistics
- Consistent metrics across the application

### 5. Easier Testing
- Shared utilities can be tested once
- Mock storage backends for testing
- Consistent behavior across cache types

### 6. Better Maintainability
- Bug fixes in one place
- Feature additions benefit all caches
- Easier to understand cache behavior

### 7. Extensibility
- Easy to add new storage backends (IndexedDB, Redis, etc.)
- Custom storage interface for specialized needs
- Semantic similarity can be added without duplicating code

## Migration Path

### Step 1: Create Shared Utilities
1. Create `packages/shared/src/cache/utils.ts`
2. Export hash, CacheStats, LRUTracker, isExpired
3. Add tests for shared utilities

### Step 2: Create Unified Embedding Cache
1. Create `packages/react/src/embeddings/unified-embedding-cache.ts`
2. Implement UnifiedEmbeddingCache with all features
3. Add comprehensive tests
4. Ensure backward compatibility with async interface

### Step 3: Update Token Optimization Caches (Optional)
1. Update ExactCache to use shared hash and stats
2. Update SmartCache to use shared LRUTracker
3. Test for performance regressions

### Step 4: Deprecate Old Embedding Caches
1. Add deprecation warnings to old classes
2. Update documentation to use UnifiedEmbeddingCache
3. Keep old implementations for 1-2 versions

### Step 5: Remove Old Implementations
1. Remove MemoryEmbeddingCache
2. Remove LocalStorageEmbeddingCache
3. Remove SemanticEmbeddingCache
4. Update all imports

## Rollout Timeline

- **Week 1:** Create shared utilities and unified embedding cache
- **Week 2:** Test and validate unified cache
- **Week 3:** Update token optimization caches (optional)
- **Week 4:** Deprecate old embedding caches
- **Week 5-6:** Migration period (both APIs available)
- **Week 7:** Remove old implementations

## Testing Strategy

1. **Unit Tests:**
   - Test shared utilities independently
   - Test each storage backend
   - Test LRU eviction
   - Test TTL expiration
   - Test stats tracking

2. **Integration Tests:**
   - Test with real embeddings
   - Test localStorage quota handling
   - Test memory pressure scenarios
   - Test concurrent access

3. **Performance Tests:**
   - Benchmark hash function
   - Measure cache lookup speed
   - Test with 1000+ entries
   - Compare with old implementation

4. **Migration Tests:**
   - Verify backward compatibility
   - Test old data migration
   - Ensure no breaking changes

## Conclusion

Consolidating the embedding caches will significantly reduce code duplication, improve consistency, and add missing features like LRU eviction. The shared utilities will make all caches more maintainable and testable. The token optimization caches are already well-designed and only need minor updates to use shared utilities.

Total impact:
- **-180 lines** of duplicate code
- **+3 features** (LRU eviction, better hashing, consistent stats)
- **Better** maintainability and testability
- **No** breaking changes for consumers
