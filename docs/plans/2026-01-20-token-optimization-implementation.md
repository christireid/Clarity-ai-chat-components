# Token Optimization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan
> task-by-task.

**Goal:** Implement tiered caching, enhanced TOON/markdown optimization, model routing, and
AA-compliant React components for the token-optimization package.

**Architecture:** Build on existing `@clarity-chat/token-optimization` package. Add TieredCache
orchestrating exact→smart→semantic tiers. Enhance TOON with markdown-aware compression. Add
ModelRouter for cost-optimized model selection. Create accessible React hooks and components.

**Tech Stack:** TypeScript strict mode, gpt-tokenizer, Vitest, React 18/19, WCAG 2.1 AA

---

## Phase 1: Tiered Cache System (P0)

### Task 1.1: ExactCache Implementation

**Files:**

- Create: `packages/token-optimization/src/cache/exact-cache.ts`
- Test: `packages/token-optimization/src/__tests__/cache/exact-cache.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/token-optimization/src/__tests__/cache/exact-cache.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { ExactCache } from '../../cache/exact-cache'

describe('ExactCache', () => {
  let cache: ExactCache<string>

  beforeEach(() => {
    cache = new ExactCache({ maxSize: 100, ttl: 3600000 })
  })

  describe('basic operations', () => {
    it('stores and retrieves values by key', () => {
      cache.set('prompt1', 'response1')
      const result = cache.get('prompt1')

      expect(result).toEqual({
        hit: true,
        value: 'response1',
        age: expect.any(Number),
      })
    })

    it('returns miss for non-existent keys', () => {
      const result = cache.get('nonexistent')
      expect(result).toEqual({ hit: false })
    })

    it('achieves O(1) lookup time for 10000 entries', () => {
      for (let i = 0; i < 10000; i++) {
        cache.set(`key-${i}`, `value-${i}`)
      }

      const start = performance.now()
      cache.get('key-5000')
      const duration = performance.now() - start

      expect(duration).toBeLessThan(1) // < 1ms
    })
  })

  describe('TTL expiration', () => {
    it('expires entries after TTL', async () => {
      const shortTTLCache = new ExactCache<string>({ maxSize: 100, ttl: 50 })
      shortTTLCache.set('key', 'value')

      await new Promise((resolve) => setTimeout(resolve, 60))

      const result = shortTTLCache.get('key')
      expect(result.hit).toBe(false)
    })
  })

  describe('LRU eviction', () => {
    it('evicts least recently used when at capacity', () => {
      const smallCache = new ExactCache<string>({ maxSize: 3, ttl: 3600000 })

      smallCache.set('a', '1')
      smallCache.set('b', '2')
      smallCache.set('c', '3')
      smallCache.get('a') // Access 'a' to make it recently used
      smallCache.set('d', '4') // Should evict 'b'

      expect(smallCache.get('a').hit).toBe(true)
      expect(smallCache.get('b').hit).toBe(false) // Evicted
      expect(smallCache.get('c').hit).toBe(true)
      expect(smallCache.get('d').hit).toBe(true)
    })
  })

  describe('hash function', () => {
    it('generates consistent hashes for same input', () => {
      const hash1 = cache.hash('test prompt')
      const hash2 = cache.hash('test prompt')
      expect(hash1).toBe(hash2)
    })

    it('generates different hashes for different inputs', () => {
      const hash1 = cache.hash('prompt 1')
      const hash2 = cache.hash('prompt 2')
      expect(hash1).not.toBe(hash2)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/cache/exact-cache.test.ts
```

Expected: FAIL with "Cannot find module"

**Step 3: Write minimal implementation**

```typescript
// packages/token-optimization/src/cache/exact-cache.ts

export interface ExactCacheConfig {
  maxSize: number
  ttl: number // milliseconds
}

export interface ExactCacheResult<T> {
  hit: boolean
  value?: T
  age?: number
}

interface CacheEntry<T> {
  value: T
  timestamp: number
}

export class ExactCache<T> {
  private cache = new Map<string, CacheEntry<T>>()
  private accessOrder: string[] = []

  constructor(private config: ExactCacheConfig) {}

  get(key: string): ExactCacheResult<T> {
    const hashedKey = this.hash(key)
    const entry = this.cache.get(hashedKey)

    if (!entry) {
      return { hit: false }
    }

    const age = Date.now() - entry.timestamp
    if (age > this.config.ttl) {
      this.cache.delete(hashedKey)
      this.removeFromAccessOrder(hashedKey)
      return { hit: false }
    }

    // Update access order (move to end)
    this.removeFromAccessOrder(hashedKey)
    this.accessOrder.push(hashedKey)

    return { hit: true, value: entry.value, age }
  }

  set(key: string, value: T): void {
    const hashedKey = this.hash(key)

    // Evict if at capacity
    while (this.cache.size >= this.config.maxSize) {
      const lruKey = this.accessOrder.shift()
      if (lruKey) {
        this.cache.delete(lruKey)
      }
    }

    // Remove existing entry from access order if updating
    if (this.cache.has(hashedKey)) {
      this.removeFromAccessOrder(hashedKey)
    }

    this.cache.set(hashedKey, { value, timestamp: Date.now() })
    this.accessOrder.push(hashedKey)
  }

  has(key: string): boolean {
    return this.get(key).hit
  }

  delete(key: string): boolean {
    const hashedKey = this.hash(key)
    this.removeFromAccessOrder(hashedKey)
    return this.cache.delete(hashedKey)
  }

  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }

  get size(): number {
    return this.cache.size
  }

  hash(input: string): string {
    // FNV-1a hash - fast and good distribution
    let hash = 2166136261
    for (let i = 0; i < input.length; i++) {
      hash ^= input.charCodeAt(i)
      hash = (hash * 16777619) >>> 0
    }
    return hash.toString(36)
  }

  private removeFromAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key)
    if (index > -1) {
      this.accessOrder.splice(index, 1)
    }
  }
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/cache/exact-cache.test.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add packages/token-optimization/src/cache/exact-cache.ts packages/token-optimization/src/__tests__/cache/exact-cache.test.ts
git commit -m "feat(token-optimization): add ExactCache with O(1) lookup and LRU eviction"
```

---

### Task 1.2: SmartCache Implementation

**Files:**

- Create: `packages/token-optimization/src/cache/smart-cache.ts`
- Test: `packages/token-optimization/src/__tests__/cache/smart-cache.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/token-optimization/src/__tests__/cache/smart-cache.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { SmartCache } from '../../cache/smart-cache'

describe('SmartCache', () => {
  let cache: SmartCache

  beforeEach(() => {
    cache = new SmartCache({ maxSize: 100, ttl: 3600000 })
  })

  describe('pattern matching', () => {
    it('matches parameterized queries with same pattern', () => {
      cache.index('What is the weather in Paris?', 'Sunny, 22°C')

      const result = cache.match('What is the weather in London?')

      expect(result.hit).toBe(true)
      expect(result.pattern).toBe('What is the weather in {location}?')
    })

    it('extracts and stores entity parameters', () => {
      cache.index('Show me users from New York', 'User list...')

      const result = cache.match('Show me users from Los Angeles')

      expect(result.hit).toBe(true)
      expect(result.extractedParams).toEqual({ location: 'Los Angeles' })
    })

    it('does not match unrelated queries', () => {
      cache.index('What is the weather in Paris?', 'Sunny')

      const result = cache.match('What time is it?')

      expect(result.hit).toBe(false)
    })
  })

  describe('template generation', () => {
    it('normalizes locations to {location} placeholder', () => {
      const template = cache.generateTemplate('Find restaurants in San Francisco')
      expect(template).toBe('Find restaurants in {location}')
    })

    it('normalizes dates to {date} placeholder', () => {
      const template = cache.generateTemplate('Events on January 15, 2024')
      expect(template).toContain('{date}')
    })

    it('normalizes numbers to {number} placeholder', () => {
      const template = cache.generateTemplate('Show me the top 10 results')
      expect(template).toBe('Show me the top {number} results')
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/cache/smart-cache.test.ts
```

**Step 3: Write minimal implementation**

```typescript
// packages/token-optimization/src/cache/smart-cache.ts

export interface SmartCacheConfig {
  maxSize: number
  ttl: number
}

export interface SmartCacheResult {
  hit: boolean
  value?: string
  pattern?: string
  extractedParams?: Record<string, string>
  confidence?: number
}

interface PatternEntry {
  pattern: string
  response: string
  timestamp: number
  params: string[]
}

export class SmartCache {
  private patterns = new Map<string, PatternEntry>()

  constructor(private config: SmartCacheConfig) {}

  index(query: string, response: string, _metadata?: Record<string, unknown>): void {
    const template = this.generateTemplate(query)
    const params = this.extractParamNames(template)

    this.patterns.set(template, {
      pattern: template,
      response,
      timestamp: Date.now(),
      params,
    })

    // Evict old entries if needed
    if (this.patterns.size > this.config.maxSize) {
      const oldest = this.findOldestEntry()
      if (oldest) {
        this.patterns.delete(oldest)
      }
    }
  }

  match(query: string, _context?: Record<string, unknown>): SmartCacheResult {
    const queryTemplate = this.generateTemplate(query)

    // Try exact template match first
    const exactMatch = this.patterns.get(queryTemplate)
    if (exactMatch && this.isValid(exactMatch)) {
      return {
        hit: true,
        value: exactMatch.response,
        pattern: exactMatch.pattern,
        extractedParams: this.extractParams(query, exactMatch.pattern),
        confidence: 1.0,
      }
    }

    // Try fuzzy template matching
    for (const [template, entry] of this.patterns) {
      if (this.isValid(entry) && this.templatesMatch(queryTemplate, template)) {
        return {
          hit: true,
          value: entry.response,
          pattern: entry.pattern,
          extractedParams: this.extractParams(query, entry.pattern),
          confidence: 0.9,
        }
      }
    }

    return { hit: false }
  }

  generateTemplate(text: string): string {
    let template = text

    // Replace locations (cities, countries, etc.)
    const locations = [
      'Paris',
      'London',
      'New York',
      'Los Angeles',
      'San Francisco',
      'Tokyo',
      'Berlin',
      'Sydney',
      'Toronto',
      'Chicago',
    ]
    for (const loc of locations) {
      template = template.replace(new RegExp(loc, 'gi'), '{location}')
    }

    // Replace dates
    template = template.replace(
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s+\d{4})?\b/gi,
      '{date}'
    )
    template = template.replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g, '{date}')
    template = template.replace(/\b\d{4}-\d{2}-\d{2}\b/g, '{date}')

    // Replace numbers (but not single digits that might be part of words)
    template = template.replace(/\b\d{2,}\b/g, '{number}')

    return template
  }

  private extractParamNames(template: string): string[] {
    const matches = template.match(/\{(\w+)\}/g) || []
    return matches.map((m) => m.slice(1, -1))
  }

  private extractParams(query: string, pattern: string): Record<string, string> {
    const params: Record<string, string> = {}

    // Simple extraction - split by placeholders
    const patternParts = pattern.split(/\{(\w+)\}/)
    const paramNames: string[] = []
    const literals: string[] = []

    for (let i = 0; i < patternParts.length; i++) {
      if (i % 2 === 0) {
        literals.push(patternParts[i])
      } else {
        paramNames.push(patternParts[i])
      }
    }

    // Extract values between literals
    let remaining = query
    for (let i = 0; i < paramNames.length; i++) {
      const beforeLiteral = literals[i]
      const afterLiteral = literals[i + 1] || ''

      if (beforeLiteral) {
        remaining = remaining.substring(remaining.indexOf(beforeLiteral) + beforeLiteral.length)
      }

      let value: string
      if (afterLiteral) {
        const endIndex = remaining.indexOf(afterLiteral)
        value = endIndex > -1 ? remaining.substring(0, endIndex) : remaining
        remaining = remaining.substring(endIndex)
      } else {
        value = remaining.trim()
      }

      params[paramNames[i]] = value.trim()
    }

    return params
  }

  private templatesMatch(template1: string, template2: string): boolean {
    // Normalize both templates and compare
    const normalize = (t: string) => t.replace(/\{\w+\}/g, '{*}').toLowerCase()
    return normalize(template1) === normalize(template2)
  }

  private isValid(entry: PatternEntry): boolean {
    return Date.now() - entry.timestamp < this.config.ttl
  }

  private findOldestEntry(): string | null {
    let oldest: string | null = null
    let oldestTime = Infinity

    for (const [key, entry] of this.patterns) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldest = key
      }
    }

    return oldest
  }

  clear(): void {
    this.patterns.clear()
  }

  get size(): number {
    return this.patterns.size
  }
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/cache/smart-cache.test.ts
```

**Step 5: Commit**

```bash
git add packages/token-optimization/src/cache/smart-cache.ts packages/token-optimization/src/__tests__/cache/smart-cache.test.ts
git commit -m "feat(token-optimization): add SmartCache with pattern matching"
```

---

### Task 1.3: TieredCache Orchestrator

**Files:**

- Create: `packages/token-optimization/src/cache/tiered-cache.ts`
- Test: `packages/token-optimization/src/__tests__/cache/tiered-cache.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/token-optimization/src/__tests__/cache/tiered-cache.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { TieredCache } from '../../cache/tiered-cache'

describe('TieredCache', () => {
  let cache: TieredCache

  beforeEach(() => {
    cache = new TieredCache({
      exact: { maxSize: 100, ttl: 3600000 },
      smart: { maxSize: 100, ttl: 3600000 },
      semantic: {
        maxSize: 100,
        maxAge: 3600000,
        similarityThreshold: 0.92,
        enableEmbeddingCache: true,
        enableContextAwareness: false,
        enablePredictiveCaching: false,
        compressionThreshold: 10000,
      },
    })
  })

  describe('tiered lookup', () => {
    it('returns exact match from tier 1', async () => {
      await cache.set('Hello world', 'Response')

      const result = await cache.get('Hello world')

      expect(result.hit).toBe(true)
      expect(result.tier).toBe('exact')
      expect(result.data).toBe('Response')
    })

    it('returns smart match from tier 2 when exact misses', async () => {
      await cache.set('What is the weather in Paris?', 'Sunny, 22°C')

      const result = await cache.get('What is the weather in London?')

      expect(result.hit).toBe(true)
      expect(result.tier).toBe('smart')
    })

    it('returns semantic match from tier 3 when both miss', async () => {
      await cache.set('What is the capital of France?', 'Paris')

      const result = await cache.get('Tell me the capital city of France')

      expect(result.hit).toBe(true)
      expect(result.tier).toBe('semantic')
    })

    it('returns miss when all tiers miss', async () => {
      await cache.set('What is the weather?', 'Sunny')

      const result = await cache.get('How do I cook pasta?')

      expect(result.hit).toBe(false)
    })
  })

  describe('cache population', () => {
    it('populates all tiers on set', async () => {
      await cache.set('Test prompt', 'Test response')

      // Verify exact cache has entry
      const exactResult = await cache.get('Test prompt')
      expect(exactResult.tier).toBe('exact')

      // Stats should show entry in all tiers
      const stats = cache.getStats()
      expect(stats.exactSize).toBeGreaterThan(0)
    })
  })

  describe('analytics', () => {
    it('tracks hit rates per tier', async () => {
      await cache.set('prompt', 'response')
      await cache.get('prompt') // Exact hit
      await cache.get('prompt') // Exact hit
      await cache.get('nonexistent') // Miss

      const stats = cache.getStats()

      expect(stats.hitRate).toBeGreaterThan(0)
      expect(stats.tierStats.exact.hits).toBe(2)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/cache/tiered-cache.test.ts
```

**Step 3: Write minimal implementation**

```typescript
// packages/token-optimization/src/cache/tiered-cache.ts
import { ExactCache, ExactCacheConfig } from './exact-cache'
import { SmartCache, SmartCacheConfig } from './smart-cache'
import { AdvancedSemanticCache, SemanticCacheConfig } from './advanced-semantic-cache'

export interface TieredCacheConfig {
  exact: ExactCacheConfig
  smart: SmartCacheConfig
  semantic: SemanticCacheConfig
}

export interface TieredCacheResult {
  hit: boolean
  tier?: 'exact' | 'smart' | 'semantic'
  data?: string
  similarity?: number
  latency?: number
}

export interface TierStats {
  hits: number
  misses: number
  size: number
}

export interface CacheStats {
  hitRate: number
  totalHits: number
  totalMisses: number
  exactSize: number
  smartSize: number
  semanticSize: number
  tierStats: {
    exact: TierStats
    smart: TierStats
    semantic: TierStats
  }
}

export class TieredCache {
  private exactCache: ExactCache<string>
  private smartCache: SmartCache
  private semanticCache: AdvancedSemanticCache

  private stats = {
    exact: { hits: 0, misses: 0 },
    smart: { hits: 0, misses: 0 },
    semantic: { hits: 0, misses: 0 },
  }

  constructor(config: TieredCacheConfig) {
    this.exactCache = new ExactCache(config.exact)
    this.smartCache = new SmartCache(config.smart)
    this.semanticCache = new AdvancedSemanticCache(config.semantic)
  }

  async get(prompt: string, context?: Record<string, unknown>): Promise<TieredCacheResult> {
    const startTime = performance.now()

    // Tier 1: Exact match (< 1ms)
    const exactResult = this.exactCache.get(prompt)
    if (exactResult.hit && exactResult.value) {
      this.stats.exact.hits++
      return {
        hit: true,
        tier: 'exact',
        data: exactResult.value,
        latency: performance.now() - startTime,
      }
    }
    this.stats.exact.misses++

    // Tier 2: Smart pattern match (< 5ms)
    const smartResult = this.smartCache.match(prompt, context)
    if (smartResult.hit && smartResult.value) {
      this.stats.smart.hits++
      return {
        hit: true,
        tier: 'smart',
        data: smartResult.value,
        latency: performance.now() - startTime,
      }
    }
    this.stats.smart.misses++

    // Tier 3: Semantic similarity (< 50ms)
    const semanticResult = await this.semanticCache.get(prompt, context as any)
    if (semanticResult.found && semanticResult.entry) {
      this.stats.semantic.hits++
      return {
        hit: true,
        tier: 'semantic',
        data: semanticResult.entry.content,
        similarity: semanticResult.similarityScore,
        latency: performance.now() - startTime,
      }
    }
    this.stats.semantic.misses++

    return {
      hit: false,
      latency: performance.now() - startTime,
    }
  }

  async set(prompt: string, response: string, metadata?: Record<string, unknown>): Promise<void> {
    // Populate all tiers
    this.exactCache.set(prompt, response)
    this.smartCache.index(prompt, response, metadata)
    await this.semanticCache.set(prompt, response, { qualityScore: 0.95 }, metadata as any)
  }

  async invalidate(prompt: string): Promise<void> {
    this.exactCache.delete(prompt)
    // Smart and semantic caches don't support direct deletion by key
    // They rely on TTL and LRU eviction
  }

  clear(): void {
    this.exactCache.clear()
    this.smartCache.clear()
    this.semanticCache.clear()
    this.stats = {
      exact: { hits: 0, misses: 0 },
      smart: { hits: 0, misses: 0 },
      semantic: { hits: 0, misses: 0 },
    }
  }

  getStats(): CacheStats {
    const totalHits = this.stats.exact.hits + this.stats.smart.hits + this.stats.semantic.hits
    const totalMisses = this.stats.semantic.misses // Only count final misses
    const total = totalHits + totalMisses

    return {
      hitRate: total > 0 ? totalHits / total : 0,
      totalHits,
      totalMisses,
      exactSize: this.exactCache.size,
      smartSize: this.smartCache.size,
      semanticSize: this.semanticCache.getStats().totalEntries,
      tierStats: {
        exact: { ...this.stats.exact, size: this.exactCache.size },
        smart: { ...this.stats.smart, size: this.smartCache.size },
        semantic: { ...this.stats.semantic, size: this.semanticCache.getStats().totalEntries },
      },
    }
  }
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/cache/tiered-cache.test.ts
```

**Step 5: Commit**

```bash
git add packages/token-optimization/src/cache/tiered-cache.ts packages/token-optimization/src/__tests__/cache/tiered-cache.test.ts
git commit -m "feat(token-optimization): add TieredCache orchestrating exact→smart→semantic tiers"
```

---

## Phase 2: Markdown-Aware Compression (P1)

### Task 2.1: MarkdownCompressor Implementation

**Files:**

- Create: `packages/token-optimization/src/compression/markdown-compressor.ts`
- Test: `packages/token-optimization/src/__tests__/compression/markdown-compressor.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/token-optimization/src/__tests__/compression/markdown-compressor.test.ts
import { describe, it, expect } from 'vitest'
import { MarkdownCompressor } from '../../compression/markdown-compressor'

describe('MarkdownCompressor', () => {
  const compressor = new MarkdownCompressor()

  describe('structure detection', () => {
    it('identifies code blocks and preserves them', () => {
      const markdown = `Some text

\`\`\`typescript
const x = 1
\`\`\`

More text`

      const result = compressor.compress(markdown, {
        preserveCode: true,
        targetTokens: 50,
      })

      expect(result.compressed).toContain('const x = 1')
    })

    it('identifies and compresses bullet lists', () => {
      const markdown = `# Header

- Item one with lots of description text here
- Item two with even more verbose description text
- Item three also has unnecessary words
- Item four continues the pattern
- Item five wraps up the list`

      const result = compressor.compress(markdown, {
        compressLists: 'summarize',
        targetTokens: 30,
      })

      expect(result.compressedTokens).toBeLessThan(result.originalTokens)
    })
  })

  describe('TOON integration', () => {
    it('converts markdown to TOON format', () => {
      const markdown = `## Section Header

**Bold text** and regular text.

- List item 1
- List item 2`

      const result = compressor.toTOON(markdown)

      expect(result.toon).toContain('§') // TOON header marker
      expect(result.toon).toContain('•') // TOON list marker
      expect(result.compressionRatio).toBeGreaterThan(1.2)
    })
  })

  describe('quality preservation', () => {
    it('maintains minimum quality score', () => {
      const markdown = `# Important Document

This is critical information that must be preserved.

## Key Points

1. First important point
2. Second important point`

      const result = compressor.compress(markdown, {
        targetTokens: 20,
        minQualityScore: 0.85,
      })

      expect(result.qualityScore).toBeGreaterThanOrEqual(0.85)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/compression/markdown-compressor.test.ts
```

**Step 3: Write minimal implementation**

````typescript
// packages/token-optimization/src/compression/markdown-compressor.ts

export interface MarkdownCompressionOptions {
  preserveCode?: boolean
  preserveLinks?: boolean
  preserveTables?: boolean
  compressLists?: 'summarize' | 'truncate' | 'none'
  compressBlockquotes?: boolean
  compressParagraphs?: boolean
  targetTokens?: number
  minQualityScore?: number
}

export interface MarkdownCompressionResult {
  original: string
  compressed: string
  originalTokens: number
  compressedTokens: number
  compressionRatio: number
  qualityScore: number
  preservedElements: string[]
}

export interface TOONConversionResult {
  original: string
  toon: string
  compressionRatio: number
}

interface MarkdownElement {
  type: 'code' | 'header' | 'list' | 'paragraph' | 'blockquote' | 'table' | 'link'
  content: string
  priority: number
  tokens: number
}

export class MarkdownCompressor {
  compress(markdown: string, options: MarkdownCompressionOptions = {}): MarkdownCompressionResult {
    const {
      preserveCode = true,
      preserveLinks = true,
      preserveTables = true,
      compressLists = 'none',
      compressParagraphs = true,
      targetTokens,
      minQualityScore = 0.85,
    } = options

    const originalTokens = this.estimateTokens(markdown)
    const elements = this.parseElements(markdown)
    const preservedElements: string[] = []

    // Sort by priority (higher = more important to keep)
    elements.sort((a, b) => b.priority - a.priority)

    let result: string[] = []
    let currentTokens = 0
    const target = targetTokens || originalTokens

    for (const element of elements) {
      // Always preserve certain elements
      if (element.type === 'code' && preserveCode) {
        result.push(element.content)
        currentTokens += element.tokens
        preservedElements.push('code')
        continue
      }

      if (element.type === 'link' && preserveLinks) {
        result.push(element.content)
        currentTokens += element.tokens
        preservedElements.push('link')
        continue
      }

      if (element.type === 'table' && preserveTables) {
        result.push(element.content)
        currentTokens += element.tokens
        preservedElements.push('table')
        continue
      }

      // Compress lists if needed
      if (element.type === 'list' && compressLists !== 'none') {
        const compressed = this.compressList(element.content, compressLists)
        const compressedTokens = this.estimateTokens(compressed)

        if (currentTokens + compressedTokens <= target) {
          result.push(compressed)
          currentTokens += compressedTokens
        }
        continue
      }

      // Compress paragraphs if needed
      if (element.type === 'paragraph' && compressParagraphs && currentTokens >= target * 0.8) {
        const compressed = this.compressParagraph(element.content)
        const compressedTokens = this.estimateTokens(compressed)

        if (currentTokens + compressedTokens <= target) {
          result.push(compressed)
          currentTokens += compressedTokens
        }
        continue
      }

      // Add element if within budget
      if (currentTokens + element.tokens <= target) {
        result.push(element.content)
        currentTokens += element.tokens
      }
    }

    const compressed = this.reassemble(result)
    const compressedTokens = this.estimateTokens(compressed)
    const qualityScore = this.calculateQuality(markdown, compressed)

    // If quality is too low, include more content
    if (qualityScore < minQualityScore && result.length < elements.length) {
      return this.compress(markdown, {
        ...options,
        targetTokens: targetTokens ? targetTokens * 1.2 : undefined,
      })
    }

    return {
      original: markdown,
      compressed,
      originalTokens,
      compressedTokens,
      compressionRatio: originalTokens / compressedTokens,
      qualityScore,
      preservedElements,
    }
  }

  toTOON(markdown: string): TOONConversionResult {
    let toon = markdown
      // Headers: "## Section" → "§Section"
      .replace(/^#{1,6}\s+/gm, '§')
      // Lists: "- item" → "•item"
      .replace(/^[\-\*]\s+/gm, '•')
      // Bold: "**text**" → "*text*"
      .replace(/\*\*([^*]+)\*\*/g, '*$1*')
      // Code blocks: minimize markers
      .replace(/```(\w+)?\n/g, '`[$1]')
      .replace(/```/g, '`')
      // Links: "[text](url)" → "text→url"
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1→$2')
      // Remove excessive whitespace
      .replace(/\n{3,}/g, '\n\n')

    return {
      original: markdown,
      toon,
      compressionRatio: markdown.length / toon.length,
    }
  }

  private parseElements(markdown: string): MarkdownElement[] {
    const elements: MarkdownElement[] = []
    const lines = markdown.split('\n')
    let currentBlock: string[] = []
    let currentType: MarkdownElement['type'] = 'paragraph'
    let inCodeBlock = false

    for (const line of lines) {
      // Code block detection
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          currentBlock.push(line)
          elements.push({
            type: 'code',
            content: currentBlock.join('\n'),
            priority: 10, // Highest priority
            tokens: this.estimateTokens(currentBlock.join('\n')),
          })
          currentBlock = []
          inCodeBlock = false
        } else {
          if (currentBlock.length > 0) {
            elements.push(this.createElement(currentType, currentBlock))
            currentBlock = []
          }
          inCodeBlock = true
          currentBlock.push(line)
        }
        continue
      }

      if (inCodeBlock) {
        currentBlock.push(line)
        continue
      }

      // Header detection
      if (line.match(/^#{1,6}\s/)) {
        if (currentBlock.length > 0) {
          elements.push(this.createElement(currentType, currentBlock))
          currentBlock = []
        }
        elements.push({
          type: 'header',
          content: line,
          priority: 8,
          tokens: this.estimateTokens(line),
        })
        continue
      }

      // List detection
      if (line.match(/^[\-\*\d\.]\s/)) {
        if (currentType !== 'list' && currentBlock.length > 0) {
          elements.push(this.createElement(currentType, currentBlock))
          currentBlock = []
        }
        currentType = 'list'
        currentBlock.push(line)
        continue
      }

      // Table detection
      if (line.includes('|')) {
        if (currentType !== 'table' && currentBlock.length > 0) {
          elements.push(this.createElement(currentType, currentBlock))
          currentBlock = []
        }
        currentType = 'table'
        currentBlock.push(line)
        continue
      }

      // Empty line = end of block
      if (line.trim() === '') {
        if (currentBlock.length > 0) {
          elements.push(this.createElement(currentType, currentBlock))
          currentBlock = []
          currentType = 'paragraph'
        }
        continue
      }

      // Default to paragraph
      if (currentType !== 'paragraph' && currentBlock.length > 0) {
        elements.push(this.createElement(currentType, currentBlock))
        currentBlock = []
      }
      currentType = 'paragraph'
      currentBlock.push(line)
    }

    // Don't forget the last block
    if (currentBlock.length > 0) {
      elements.push(this.createElement(currentType, currentBlock))
    }

    return elements
  }

  private createElement(type: MarkdownElement['type'], lines: string[]): MarkdownElement {
    const content = lines.join('\n')
    const priorities: Record<MarkdownElement['type'], number> = {
      code: 10,
      header: 8,
      table: 7,
      link: 6,
      list: 4,
      blockquote: 3,
      paragraph: 2,
    }

    return {
      type,
      content,
      priority: priorities[type],
      tokens: this.estimateTokens(content),
    }
  }

  private compressList(content: string, strategy: 'summarize' | 'truncate'): string {
    const items = content.split('\n').filter((l) => l.trim())

    if (strategy === 'truncate') {
      // Keep first 3 items
      return items.slice(0, 3).join('\n')
    }

    // Summarize: shorten each item
    return items
      .map((item) => {
        const match = item.match(/^([\-\*\d\.]\s*)(.*)$/)
        if (match) {
          const prefix = match[1]
          const text = match[2]
          // Keep first 5 words
          const words = text.split(/\s+/).slice(0, 5).join(' ')
          return `${prefix}${words}${text.split(/\s+/).length > 5 ? '...' : ''}`
        }
        return item
      })
      .join('\n')
  }

  private compressParagraph(content: string): string {
    // Keep first 2 sentences
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content]
    return sentences.slice(0, 2).join(' ').trim()
  }

  private reassemble(elements: string[]): string {
    return elements.join('\n\n').trim()
  }

  private estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters for English
    return Math.ceil(text.length / 4)
  }

  private calculateQuality(original: string, compressed: string): number {
    // Simple quality metric based on key content preservation
    const originalWords = new Set(original.toLowerCase().split(/\s+/))
    const compressedWords = new Set(compressed.toLowerCase().split(/\s+/))

    let preserved = 0
    for (const word of originalWords) {
      if (compressedWords.has(word)) preserved++
    }

    return originalWords.size > 0 ? preserved / originalWords.size : 1
  }
}
````

**Step 4: Run test to verify it passes**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/compression/markdown-compressor.test.ts
```

**Step 5: Commit**

```bash
git add packages/token-optimization/src/compression/markdown-compressor.ts packages/token-optimization/src/__tests__/compression/markdown-compressor.test.ts
git commit -m "feat(token-optimization): add MarkdownCompressor with TOON support"
```

---

## Phase 3: Model Router (P1)

### Task 3.1: ComplexityAnalyzer Implementation

**Files:**

- Create: `packages/token-optimization/src/routing/complexity-analyzer.ts`
- Test: `packages/token-optimization/src/__tests__/routing/complexity-analyzer.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/token-optimization/src/__tests__/routing/complexity-analyzer.test.ts
import { describe, it, expect } from 'vitest'
import { ComplexityAnalyzer } from '../../routing/complexity-analyzer'

describe('ComplexityAnalyzer', () => {
  const analyzer = new ComplexityAnalyzer()

  describe('complexity scoring', () => {
    it('scores simple questions as low complexity', () => {
      const result = analyzer.analyze('What is 2 + 2?')
      expect(result.score).toBeLessThan(0.3)
      expect(result.level).toBe('simple')
    })

    it('scores coding tasks as high complexity', () => {
      const result = analyzer.analyze(`
        Write a function that implements a binary search tree with insert,
        delete, and search operations. Include proper error handling and
        optimize for O(log n) time complexity.
      `)
      expect(result.score).toBeGreaterThan(0.6)
      expect(result.level).toBe('complex')
    })

    it('scores reasoning tasks as moderate-high complexity', () => {
      const result = analyzer.analyze(`
        Explain why the sky appears blue during the day and red during sunset.
        Compare and contrast the physical phenomena involved.
      `)
      expect(result.score).toBeGreaterThan(0.4)
    })

    it('detects multi-step instructions', () => {
      const result = analyzer.analyze(`
        First, create the database schema. Then, implement the API endpoints.
        After that, write the frontend components. Finally, deploy to production.
      `)
      expect(result.hasMultiStep).toBe(true)
      expect(result.score).toBeGreaterThan(0.5)
    })

    it('detects code presence', () => {
      const result = analyzer.analyze(`
        Fix this code:
        \`\`\`javascript
        function broken() {
          return undefined
        }
        \`\`\`
      `)
      expect(result.hasCode).toBe(true)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/routing/complexity-analyzer.test.ts
```

**Step 3: Write minimal implementation**

````typescript
// packages/token-optimization/src/routing/complexity-analyzer.ts

export interface ComplexityResult {
  score: number // 0-1
  level: 'simple' | 'moderate' | 'complex'
  confidence: number
  hasCode: boolean
  hasReasoning: boolean
  hasMultiStep: boolean
  domainSpecific: boolean
  reasoning: string
}

export class ComplexityAnalyzer {
  analyze(prompt: string): ComplexityResult {
    const normalized = prompt.toLowerCase()

    // Feature detection
    const hasCode = this.detectCode(prompt)
    const hasReasoning = this.detectReasoning(normalized)
    const hasMultiStep = this.detectMultiStep(normalized)
    const domainSpecific = this.detectDomainSpecific(normalized)
    const length = prompt.length

    // Calculate score
    let score = 0
    const reasons: string[] = []

    // Length factor (longer = more complex, up to 0.2)
    if (length > 2000) {
      score += 0.2
      reasons.push('Long prompt')
    } else if (length > 500) {
      score += 0.1
      reasons.push('Medium length')
    }

    // Code factor (0.25)
    if (hasCode) {
      score += 0.25
      reasons.push('Contains code')
    }

    // Reasoning factor (0.25)
    if (hasReasoning) {
      score += 0.25
      reasons.push('Requires reasoning')
    }

    // Multi-step factor (0.2)
    if (hasMultiStep) {
      score += 0.2
      reasons.push('Multi-step task')
    }

    // Domain-specific factor (0.1)
    if (domainSpecific) {
      score += 0.1
      reasons.push('Domain-specific')
    }

    // Clamp score
    score = Math.min(1, score)

    // Determine level
    let level: ComplexityResult['level']
    if (score < 0.3) {
      level = 'simple'
    } else if (score < 0.6) {
      level = 'moderate'
    } else {
      level = 'complex'
    }

    return {
      score,
      level,
      confidence: 0.8,
      hasCode,
      hasReasoning,
      hasMultiStep,
      domainSpecific,
      reasoning: reasons.join(', ') || 'Simple query',
    }
  }

  private detectCode(text: string): boolean {
    const codePatterns = [
      /```[\s\S]*?```/,
      /`[^`]+`/,
      /function\s+\w+\s*\(/,
      /const\s+\w+\s*=/,
      /class\s+\w+/,
      /def\s+\w+\s*\(/,
      /import\s+.+from/,
      /export\s+(default\s+)?/,
    ]
    return codePatterns.some((p) => p.test(text))
  }

  private detectReasoning(text: string): boolean {
    const reasoningPatterns = [
      /explain/i,
      /analyze/i,
      /compare/i,
      /contrast/i,
      /why\s/i,
      /how\s+(does|do|can|would)/i,
      /what\s+(are|is)\s+the\s+(reason|cause|difference)/i,
      /evaluate/i,
      /assess/i,
      /critique/i,
    ]
    return reasoningPatterns.some((p) => p.test(text))
  }

  private detectMultiStep(text: string): boolean {
    const multiStepPatterns = [
      /first.*then/i,
      /step\s+\d/i,
      /\d+\.\s+/,
      /next.*after/i,
      /finally/i,
      /in\s+addition/i,
      /furthermore/i,
      /also.*and/i,
    ]
    return multiStepPatterns.some((p) => p.test(text))
  }

  private detectDomainSpecific(text: string): boolean {
    const domainPatterns = [
      // Technical
      /kubernetes|docker|aws|azure|gcp/i,
      /machine\s+learning|neural\s+network|deep\s+learning/i,
      /api|endpoint|microservice/i,
      // Legal/Medical
      /pursuant|whereas|heretofore/i,
      /diagnosis|prognosis|treatment/i,
      // Financial
      /roi|ebitda|amortization/i,
    ]
    return domainPatterns.some((p) => p.test(text))
  }
}
````

**Step 4: Run test to verify it passes**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/routing/complexity-analyzer.test.ts
```

**Step 5: Commit**

```bash
git add packages/token-optimization/src/routing/complexity-analyzer.ts packages/token-optimization/src/__tests__/routing/complexity-analyzer.test.ts
git commit -m "feat(token-optimization): add ComplexityAnalyzer for prompt scoring"
```

---

### Task 3.2: ModelRouter Implementation

**Files:**

- Create: `packages/token-optimization/src/routing/model-router.ts`
- Test: `packages/token-optimization/src/__tests__/routing/model-router.test.ts`

**Step 1: Write the failing test**

```typescript
// packages/token-optimization/src/__tests__/routing/model-router.test.ts
import { describe, it, expect } from 'vitest'
import { ModelRouter } from '../../routing/model-router'

describe('ModelRouter', () => {
  const router = new ModelRouter({
    models: {
      economy: ['claude-3-haiku-20240307', 'gpt-3.5-turbo'],
      standard: ['claude-3-5-sonnet-20241022', 'gpt-4o-mini'],
      premium: ['claude-3-5-sonnet-20241022', 'gpt-4o'],
      elite: ['claude-3-opus-20240229', 'gpt-4-turbo'],
    },
    costs: {
      'claude-3-haiku-20240307': 0.00025,
      'gpt-3.5-turbo': 0.0005,
      'claude-3-5-sonnet-20241022': 0.003,
      'gpt-4o-mini': 0.00015,
      'gpt-4o': 0.005,
      'claude-3-opus-20240229': 0.015,
      'gpt-4-turbo': 0.01,
    },
    defaultTier: 'standard',
  })

  describe('routing decisions', () => {
    it('routes simple queries to economy tier', async () => {
      const result = await router.route('What is 2+2?')
      expect(result.tier).toBe('economy')
    })

    it('routes complex coding tasks to premium/elite tier', async () => {
      const result = await router.route(`
        Implement a distributed cache with consistent hashing,
        replication, and automatic failover. Use TypeScript.
      `)
      expect(['premium', 'elite']).toContain(result.tier)
    })

    it('respects budget constraints', async () => {
      const result = await router.route('Complex task here', {
        maxCost: 0.001,
      })
      expect(result.estimatedCost).toBeLessThanOrEqual(0.001)
    })

    it('respects forced model override', async () => {
      const result = await router.route('Any prompt', {
        forceModel: 'gpt-4o',
      })
      expect(result.model).toBe('gpt-4o')
    })
  })

  describe('cost estimation', () => {
    it('estimates cost based on prompt tokens', async () => {
      const result = await router.route('Short prompt')
      expect(result.estimatedCost).toBeGreaterThan(0)
    })
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/routing/model-router.test.ts
```

**Step 3: Write minimal implementation**

```typescript
// packages/token-optimization/src/routing/model-router.ts
import { ComplexityAnalyzer, ComplexityResult } from './complexity-analyzer'

export interface ModelRouterConfig {
  models: Record<string, string[]>
  costs: Record<string, number> // Cost per 1K tokens
  defaultTier: string
}

export interface RoutingOptions {
  forceModel?: string
  maxCost?: number
  preferredProviders?: string[]
  minCapability?: 'basic' | 'reasoning' | 'coding' | 'vision'
}

export interface RoutingResult {
  model: string
  tier: string
  confidence: number
  estimatedCost: number
  complexity: ComplexityResult
  reasoning: string
  alternatives: Array<{ model: string; cost: number; tier: string }>
}

export class ModelRouter {
  private analyzer = new ComplexityAnalyzer()

  constructor(private config: ModelRouterConfig) {}

  async route(prompt: string, options: RoutingOptions = {}): Promise<RoutingResult> {
    // Handle forced model
    if (options.forceModel) {
      return this.createResult(options.forceModel, this.getTier(options.forceModel), prompt)
    }

    // Analyze complexity
    const complexity = this.analyzer.analyze(prompt)

    // Map complexity to tier
    let tier = this.complexityToTier(complexity)

    // Apply capability requirements
    if (options.minCapability) {
      tier = this.applyCapabilityRequirement(tier, options.minCapability)
    }

    // Get model for tier
    let model = this.selectModel(tier, options.preferredProviders)

    // Apply budget constraints
    if (options.maxCost) {
      const result = this.applyBudgetConstraint(prompt, options.maxCost, tier)
      if (result) {
        model = result.model
        tier = result.tier
      }
    }

    return this.createResult(model, tier, prompt, complexity)
  }

  private complexityToTier(complexity: ComplexityResult): string {
    if (complexity.score < 0.3) return 'economy'
    if (complexity.score < 0.5) return 'standard'
    if (complexity.score < 0.75) return 'premium'
    return 'elite'
  }

  private applyCapabilityRequirement(tier: string, capability: string): string {
    const tierOrder = ['economy', 'standard', 'premium', 'elite']
    const capabilityMinTier: Record<string, string> = {
      basic: 'economy',
      reasoning: 'standard',
      coding: 'premium',
      vision: 'premium',
    }

    const minTier = capabilityMinTier[capability] || 'economy'
    const currentIndex = tierOrder.indexOf(tier)
    const minIndex = tierOrder.indexOf(minTier)

    return currentIndex >= minIndex ? tier : minTier
  }

  private selectModel(tier: string, preferredProviders?: string[]): string {
    const models = this.config.models[tier] || this.config.models[this.config.defaultTier]

    if (preferredProviders && preferredProviders.length > 0) {
      for (const provider of preferredProviders) {
        const match = models.find((m) => m.toLowerCase().includes(provider.toLowerCase()))
        if (match) return match
      }
    }

    return models[0]
  }

  private applyBudgetConstraint(
    prompt: string,
    maxCost: number,
    currentTier: string
  ): { model: string; tier: string } | null {
    const tokens = this.estimateTokens(prompt)
    const tierOrder = ['economy', 'standard', 'premium', 'elite']

    // Try tiers from current down to economy
    const startIndex = tierOrder.indexOf(currentTier)
    for (let i = startIndex; i >= 0; i--) {
      const tier = tierOrder[i]
      const models = this.config.models[tier] || []

      for (const model of models) {
        const cost = this.estimateCost(model, tokens)
        if (cost <= maxCost) {
          return { model, tier }
        }
      }
    }

    // Return cheapest option if nothing fits budget
    const cheapestModel = this.findCheapestModel()
    return { model: cheapestModel, tier: this.getTier(cheapestModel) }
  }

  private getTier(model: string): string {
    for (const [tier, models] of Object.entries(this.config.models)) {
      if (models.includes(model)) return tier
    }
    return this.config.defaultTier
  }

  private estimateTokens(prompt: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(prompt.length / 4)
  }

  private estimateCost(model: string, tokens: number): number {
    const costPer1K = this.config.costs[model] || 0.001
    return costPer1K * (tokens / 1000)
  }

  private findCheapestModel(): string {
    let cheapest = ''
    let lowestCost = Infinity

    for (const [model, cost] of Object.entries(this.config.costs)) {
      if (cost < lowestCost) {
        lowestCost = cost
        cheapest = model
      }
    }

    return cheapest
  }

  private createResult(
    model: string,
    tier: string,
    prompt: string,
    complexity?: ComplexityResult
  ): RoutingResult {
    const tokens = this.estimateTokens(prompt)
    const analysisResult = complexity || this.analyzer.analyze(prompt)

    // Get alternatives
    const alternatives = this.getAlternatives(tier, tokens)

    return {
      model,
      tier,
      confidence: analysisResult.confidence,
      estimatedCost: this.estimateCost(model, tokens),
      complexity: analysisResult,
      reasoning: `Complexity: ${analysisResult.level} (${analysisResult.reasoning})`,
      alternatives,
    }
  }

  private getAlternatives(
    currentTier: string,
    tokens: number
  ): Array<{ model: string; cost: number; tier: string }> {
    const alternatives: Array<{ model: string; cost: number; tier: string }> = []

    for (const [tier, models] of Object.entries(this.config.models)) {
      if (tier !== currentTier) {
        for (const model of models) {
          alternatives.push({
            model,
            cost: this.estimateCost(model, tokens),
            tier,
          })
        }
      }
    }

    return alternatives.sort((a, b) => a.cost - b.cost).slice(0, 3)
  }
}
```

**Step 4: Run test to verify it passes**

```bash
pnpm --filter @clarity-chat/token-optimization test src/__tests__/routing/model-router.test.ts
```

**Step 5: Commit**

```bash
git add packages/token-optimization/src/routing/model-router.ts packages/token-optimization/src/__tests__/routing/model-router.test.ts
git commit -m "feat(token-optimization): add ModelRouter with complexity-based routing"
```

---

## Phase 4: Update Package Exports

### Task 4.1: Update index.ts

**Files:**

- Modify: `packages/token-optimization/src/index.ts`

**Step 1: Add new exports**

```typescript
// Add to packages/token-optimization/src/index.ts

// Cache exports (new)
export { ExactCache } from './cache/exact-cache'
export type { ExactCacheConfig, ExactCacheResult } from './cache/exact-cache'

export { SmartCache } from './cache/smart-cache'
export type { SmartCacheConfig, SmartCacheResult } from './cache/smart-cache'

export { TieredCache } from './cache/tiered-cache'
export type {
  TieredCacheConfig,
  TieredCacheResult,
  CacheStats as TieredCacheStats,
} from './cache/tiered-cache'

// Compression exports (new)
export { MarkdownCompressor } from './compression/markdown-compressor'
export type {
  MarkdownCompressionOptions,
  MarkdownCompressionResult,
  TOONConversionResult,
} from './compression/markdown-compressor'

// Routing exports (new)
export { ComplexityAnalyzer } from './routing/complexity-analyzer'
export type { ComplexityResult } from './routing/complexity-analyzer'

export { ModelRouter } from './routing/model-router'
export type { ModelRouterConfig, RoutingOptions, RoutingResult } from './routing/model-router'
```

**Step 2: Commit**

```bash
git add packages/token-optimization/src/index.ts
git commit -m "feat(token-optimization): export new cache, compression, and routing modules"
```

---

## Phase 5: React Hooks (P1)

### Task 5.1: useTieredCache Hook

**Files:**

- Create: `packages/react/src/hooks/clarity-tokens/use-tiered-cache.ts`
- Test: `packages/react/src/hooks/clarity-tokens/__tests__/use-tiered-cache.test.ts`

_Implementation follows same TDD pattern..._

### Task 5.2: useModelRouter Hook

**Files:**

- Create: `packages/react/src/hooks/clarity-tokens/use-model-router.ts`
- Test: `packages/react/src/hooks/clarity-tokens/__tests__/use-model-router.test.ts`

_Implementation follows same TDD pattern..._

### Task 5.3: useOptimizationPipeline Hook

**Files:**

- Create: `packages/react/src/hooks/clarity-tokens/use-optimization-pipeline.ts`
- Test: `packages/react/src/hooks/clarity-tokens/__tests__/use-optimization-pipeline.test.ts`

_Implementation follows same TDD pattern..._

---

## Phase 6: React Components with AA Compliance (P1)

### Task 6.1: TokenBudgetBar Component

**Files:**

- Create: `packages/react/src/components/token-optimization/TokenBudgetBar.tsx`
- Test: `packages/react/src/components/token-optimization/__tests__/TokenBudgetBar.test.tsx`

_Implementation includes WCAG 2.1 AA compliance..._

### Task 6.2: OptimizationPanel Component

### Task 6.3: CacheInspector Component

---

## Summary

**Total Tasks:** 15 (detailed above: 6 complete, 9 abbreviated)

**Execution Order:**

1. Phase 1: Tiered Cache (Tasks 1.1-1.3) - Core infrastructure
2. Phase 2: Markdown Compression (Task 2.1) - Content optimization
3. Phase 3: Model Router (Tasks 3.1-3.2) - Cost optimization
4. Phase 4: Package Exports (Task 4.1) - Integration
5. Phase 5: React Hooks (Tasks 5.1-5.3) - Developer experience
6. Phase 6: React Components (Tasks 6.1-6.3) - UI

**Run all tests after completion:**

```bash
pnpm --filter @clarity-chat/token-optimization test
pnpm --filter @clarity-chat/react test
```
