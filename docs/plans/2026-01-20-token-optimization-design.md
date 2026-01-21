# Token Optimization System Design

**Date:** 2026-01-20 **Status:** Approved **Package:** `@clarity-chat/token-optimization`

---

## Overview

Comprehensive token optimization system for React TypeScript applications with tiered caching, TOON
compression, smart model routing, enterprise security, and WCAG 2.1 AA accessibility compliance.

**Target Savings:** 85-91% cost reduction through layered optimizations.

---

## Architecture

### Package Structure

```
packages/token-optimization/
├── src/
│   ├── index.ts                    # Public API exports
│   ├── types/
│   │   ├── index.ts
│   │   ├── models.ts               # All 70+ model definitions
│   │   ├── cache.ts                # Cache type definitions
│   │   └── security.ts             # Security types
│   │
│   ├── tokenizers/
│   │   ├── accurate-counter.ts     # Enhanced with TOON support
│   │   ├── model-registry.ts       # Add TOON support
│   │   └── markdown-optimizer.ts   # NEW - markdown-aware tokenization
│   │
│   ├── cache/
│   │   ├── tiered-cache.ts         # NEW - orchestrates all cache tiers
│   │   ├── exact-cache.ts          # NEW - hash-based O(1) lookup
│   │   ├── smart-cache.ts          # Enhanced pattern matching
│   │   ├── semantic-cache.ts       # Improved similarity
│   │   └── cache-analytics.ts      # NEW - hit rate tracking
│   │
│   ├── compression/
│   │   ├── dynamic-compression.ts  # Add TOON strategy
│   │   ├── markdown-compressor.ts  # NEW - structure-aware compression
│   │   └── toon-optimizer.ts       # NEW - TOON format handling
│   │
│   ├── routing/
│   │   ├── model-router.ts         # NEW - intelligent model selection
│   │   └── complexity-analyzer.ts  # NEW - prompt complexity scoring
│   │
│   ├── security/
│   │   └── token-security.ts       # Enhanced with rate limiting, encryption
│   │
│   ├── hooks/
│   │   ├── use-token-counter.ts    # Enhanced with TOON
│   │   ├── use-token-budget.ts     # Enhanced with auto-compress
│   │   ├── use-tiered-cache.ts     # NEW
│   │   ├── use-model-router.ts     # NEW
│   │   └── use-optimization-pipeline.ts  # NEW
│   │
│   └── components/
│       ├── TokenBudgetBar.tsx      # AA-compliant
│       ├── OptimizationPanel.tsx   # Dev tools
│       └── CacheInspector.tsx      # NEW
```

### Design Principles

1. **Backward Compatible** — All existing APIs remain unchanged
2. **Tree-Shakeable** — Only import what you use
3. **Type-Safe** — Fix all 300+ TypeScript strict mode errors
4. **Accessible** — WCAG 2.1 AA for all UI components
5. **Testable** — 90%+ coverage target

---

## Tiered Caching System

### Cache Flow

```
Request → Exact Match Cache (O(1), instant)
              ↓ miss
          Smart Cache (pattern matching, TTL-aware)
              ↓ miss
          Semantic Cache (embedding similarity ≥0.92)
              ↓ miss
          LLM API Call → Populate all tiers
```

### Implementation

```typescript
class TieredCache {
  private exactCache: ExactCache
  private smartCache: SmartCache
  private semanticCache: SemanticCache

  async get(prompt: string, context?: CacheContext): Promise<CacheResult> {
    // Tier 1: Exact match (< 1ms)
    const exactHit = this.exactCache.get(this.hash(prompt))
    if (exactHit) return { hit: true, tier: 'exact', data: exactHit }

    // Tier 2: Smart pattern match (< 5ms)
    const smartHit = this.smartCache.match(prompt, context)
    if (smartHit) return { hit: true, tier: 'smart', data: smartHit }

    // Tier 3: Semantic similarity (< 50ms)
    const semanticHit = await this.semanticCache.findSimilar(prompt, {
      threshold: 0.92,
      maxResults: 1,
    })
    if (semanticHit) return { hit: true, tier: 'semantic', data: semanticHit }

    return { hit: false }
  }

  async set(prompt: string, response: string, metadata?: CacheMetadata) {
    const hash = this.hash(prompt)
    this.exactCache.set(hash, response)
    this.smartCache.index(prompt, response, metadata)
    await this.semanticCache.store(prompt, response, metadata)
  }
}
```

### Smart Cache Pattern Matching

Identifies semantically equivalent queries with different parameters:

```typescript
// Example: These should return cached results
"What is the weather in Paris?"     → cached
"What is the weather in London?"    → cache HIT (same pattern, different param)
```

Pattern extraction normalizes queries by:

- Extracting entities (locations, dates, names)
- Creating parameterized templates
- Matching templates with different parameter values

---

## TOON & Markdown Optimization

### TOON Format

Token-Optimized Output Notation reduces token usage by 40-60% for structured content.

````typescript
class TOONOptimizer {
  toTOON(markdown: string): TOONResult {
    return {
      optimized: this.applyTOONRules(markdown),
      originalTokens: this.counter.count(markdown),
      optimizedTokens: this.counter.count(optimized),
      compressionRatio: original / optimized,
    }
  }

  private applyTOONRules(text: string): string {
    return (
      text
        // Headers: "## Section" → "§Section"
        .replace(/^#{1,6}\s+/gm, '§')
        // Lists: "- item" → "•item"
        .replace(/^[\-\*]\s+/gm, '•')
        // Bold: "**text**" → "*text*"
        .replace(/\*\*([^*]+)\*\*/g, '*$1*')
        // Code blocks: preserve but minimize markers
        .replace(/```(\w+)?\n/g, '`[$1]')
        .replace(/```/g, '`')
        // Links: "[text](url)" → "text→url"
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1→$2')
        // Remove excessive whitespace
        .replace(/\n{3,}/g, '\n\n')
    )
  }

  fromTOON(toon: string): string {
    /* reverse transforms */
  }
}
````

### Markdown-Aware Compression

```typescript
interface MarkdownCompressionStrategy {
  // Preserve these (high information density)
  preserveCode: boolean
  preserveLinks: boolean
  preserveTables: boolean

  // Compress these aggressively
  compressLists: 'summarize' | 'truncate' | 'none'
  compressBlockquotes: boolean
  compressParagraphs: boolean

  targetTokens: number
  minQualityScore: number // 0.85 default
}
```

### Token Savings

| Content Type  | Original     | TOON         | Savings |
| ------------- | ------------ | ------------ | ------- |
| API docs      | 1,200 tokens | 720 tokens   | 40%     |
| Code tutorial | 2,500 tokens | 1,500 tokens | 40%     |
| Bullet lists  | 800 tokens   | 400 tokens   | 50%     |
| Mixed content | 3,000 tokens | 1,650 tokens | 45%     |

---

## Security & Accessibility

### Security Enhancements

```typescript
interface SecurityConfig {
  piiRedaction: PIIConfig
  promptInjectionProtection: boolean
  auditLogging: AuditConfig

  rateLimiting: {
    maxRequestsPerMinute: number
    maxTokensPerMinute: number
    burstAllowance: number
  }

  inputValidation: {
    maxPromptLength: number
    sanitizeUnicode: boolean
    blockPatterns: RegExp[]
  }

  outputSanitization: {
    stripPII: boolean
    sanitizeMarkdown: boolean
    maxOutputLength: number
  }

  encryption: {
    cacheEncryption: boolean
    algorithm: 'AES-256-GCM'
    keyRotationDays: number
  }
}
```

### WCAG 2.1 AA Compliance

| Requirement            | Implementation                           |
| ---------------------- | ---------------------------------------- |
| Color contrast ≥ 4.5:1 | CSS custom properties with tested values |
| Focus indicators       | 2px solid outline, 3:1 contrast          |
| Screen reader support  | ARIA labels, live regions, roles         |
| Keyboard navigation    | All interactive elements focusable       |
| Error identification   | Programmatic + visual error states       |
| Text resizing          | Supports 200% zoom without loss          |
| Motion preferences     | Respects `prefers-reduced-motion`        |

---

## React Hooks & Components

### Core Hooks

```typescript
// useTokenCounter - Enhanced with TOON support
const { count, estimate, toTOON, isLoading } = useTokenCounter(text, {
  model: 'gpt-4o',
  enableTOON: true,
  debounceMs: 150,
})

// useTieredCache - Access all cache tiers
const { get, set, invalidate, hitRate, tierStats, prefetch } = useTieredCache({
  exactCacheSize: 500,
  smartCacheSize: 200,
  semanticThreshold: 0.92,
  ttl: 3600000,
})

// useTokenBudget - Enhanced with warnings
const { used, remaining, percentage, status, suggestions, compress } = useTokenBudget(text, {
  maxTokens: 128000,
  reserveForOutput: 4000,
  warningThreshold: 0.8,
})

// useModelRouter - Intelligent model selection
const { recommendedModel, confidence, estimatedCost, alternatives } = useModelRouter(prompt, {
  budget: 0.05,
  preferredProviders: ['anthropic', 'openai'],
  minCapability: 'reasoning',
})

// useOptimizationPipeline - Full optimization flow
const { optimizedPrompt, metrics, apply } = useOptimizationPipeline(prompt, {
  enableTOON: true,
  enableCompression: true,
  targetTokens: 4000,
  cacheEnabled: true,
})
```

### UI Components

```tsx
<TokenBudgetBar
  text={prompt}
  maxTokens={128000}
  variant="detailed"
  showCost={true}
  model="claude-3-sonnet"
  // AA compliance built-in
/>

<OptimizationPanel
  prompt={prompt}
  onOptimize={setOptimizedPrompt}
  showTOON={true}
  showCacheStats={true}
  showModelSuggestions={true}
/>

<CacheInspector
  cache={tieredCache}
  showHitRates={true}
  showEntries={true}
  onInvalidate={handleInvalidate}
/>
```

---

## Enterprise & Production Readiness

### Multi-Tenancy

```typescript
interface TenantConfig {
  tenantId: string

  cache: {
    namespace: string
    maxSize: number
    ttl: number
  }

  budget: {
    monthlyTokenLimit: number
    dailyTokenLimit: number
    maxCostPerRequest: number
    alertThresholds: number[]
  }

  allowedModels: ModelId[]
  defaultModel: ModelId
  security: Partial<SecurityConfig>
}
```

### Observability

```typescript
interface OptimizationMetrics {
  tokenization: {
    totalProcessed: Counter
    latencyHistogram: Histogram
    errorRate: Gauge
  }

  cache: {
    hitRate: Gauge
    size: Gauge
    evictions: Counter
    latencyByTier: Histogram
  }

  cost: {
    totalSpend: Counter
    savingsFromCache: Counter
    savingsFromCompression: Counter
    costByModel: Record<ModelId, Counter>
  }
}
```

### Error Handling

```typescript
class TokenOptimizationError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public recoverable: boolean,
    public context: Record<string, unknown>
  ) {
    super(message)
  }
}

type ErrorCode =
  | 'TOKENIZATION_FAILED'
  | 'CACHE_UNAVAILABLE'
  | 'COMPRESSION_QUALITY_LOW'
  | 'BUDGET_EXCEEDED'
  | 'MODEL_UNAVAILABLE'
```

---

## Testing Strategy

### Coverage Targets

| Module            | Target |
| ----------------- | ------ |
| Tokenizers        | 95%    |
| Cache (all tiers) | 95%    |
| Compression/TOON  | 90%    |
| Security          | 98%    |
| Hooks             | 90%    |
| Components        | 85%    |

### Performance Benchmarks

- Tokenize 10KB text in < 50ms
- TOON compression achieves 40%+ reduction
- Handle 1000 cache operations/second
- Exact cache lookup < 1ms
- Semantic cache lookup < 50ms

---

## Deliverables

| Deliverable                   | Priority |
| ----------------------------- | -------- |
| `TieredCache`                 | P0       |
| `TOONOptimizer`               | P0       |
| `MarkdownCompressor`          | P1       |
| Enhanced `TokenCounter`       | P0       |
| `useTokenBudget` hook         | P0       |
| `useTieredCache` hook         | P0       |
| `useModelRouter` hook         | P1       |
| `TokenBudgetBar` component    | P1       |
| `OptimizationPanel` component | P2       |
| Security hardening            | P0       |
| TypeScript strict mode fixes  | P1       |
| Test suite (90%+ coverage)    | P0       |
| Documentation                 | P1       |

---

## Expected Savings

```
┌─────────────────────────────────────────────────────────┐
│  OPTIMIZATION LAYER          │  SAVINGS    │  COMBINED │
├─────────────────────────────────────────────────────────┤
│  Tiered Cache (60% hit rate) │    60%      │    60%    │
│  + TOON Compression          │    45%      │    78%    │
│  + Smart Model Routing       │    40%      │    87%    │
│  + Context Pruning           │    30%      │    91%    │
└─────────────────────────────────────────────────────────┘
  Potential total cost reduction: 85-91%
```

---

## Public API

```typescript
// @clarity-chat/token-optimization

// Core classes
export { TokenCounter, TOONOptimizer, MarkdownCompressor } from './tokenizers'
export { TieredCache, ExactCache, SmartCache, SemanticCache } from './cache'
export { ModelRouter, ComplexityAnalyzer } from './routing'
export { TokenSecurityManager } from './security'

// React hooks
export {
  useTokenCounter,
  useTokenBudget,
  useTieredCache,
  useModelRouter,
  useOptimizationPipeline,
} from './hooks'

// React components
export { TokenBudgetBar, OptimizationPanel, CacheInspector } from './components'

// Types
export type {
  TokenCountResult,
  CacheResult,
  TOONResult,
  TenantConfig,
  SecurityConfig,
  ModelRoutingResult,
} from './types'

// Utilities
export { createConfig, MetricsExporter } from './utils'
```
