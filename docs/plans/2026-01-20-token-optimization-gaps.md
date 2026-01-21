# Token Optimization Gap Analysis

**Date:** 2026-01-20 **Based on:** Comprehensive audit of token-optimization, memory, and react
packages

---

## Executive Summary

| Category       | Current State            | Target State                     | Gap Size     |
| -------------- | ------------------------ | -------------------------------- | ------------ |
| Model Support  | GPT-4, Claude 2, GPT-3.5 | GPT-4o/o1/o3, Claude 3.5, Gemini | **CRITICAL** |
| Token Counting | 99% accurate (GPT only)  | 99%+ all major models            | Medium       |
| TOON Format    | Partial implementation   | Full parser/encoder              | High         |
| Compression    | 10-20% actual            | 60-80% target                    | **CRITICAL** |
| Security       | Basic patterns           | OWASP LLM Top 10 2026            | High         |
| Caching        | Basic LRU                | Semantic + Provider caching      | Medium       |
| Accessibility  | None                     | WCAG 2.1 AA                      | High         |
| Documentation  | Sparse                   | Comprehensive                    | Medium       |

---

## 1. CRITICAL GAPS

### 1.1 Outdated Model Profiles

**Current (packages/token-optimization/src/constants.ts:89-96):**

```typescript
export const MODEL_TOKEN_LIMITS: Record<string, number> = {
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-turbo': 128000,
  'gpt-3.5-turbo': 4096,
  'gpt-3.5-turbo-16k': 16385,
  'claude-2': 100000,
  'claude-instant': 100000,
}
```

**Required (2026 Models):**

```typescript
export const MODEL_TOKEN_LIMITS: Record<string, number> = {
  // OpenAI GPT-4o Series
  'gpt-4o': 128000,
  'gpt-4o-mini': 128000,
  'gpt-4o-2024-11-20': 128000,

  // OpenAI o-Series (Reasoning)
  o1: 200000,
  'o1-mini': 128000,
  'o1-preview': 128000,
  o3: 200000,
  'o3-mini': 128000,
  'o4-mini': 200000,

  // OpenAI GPT-4 Legacy
  'gpt-4': 8192,
  'gpt-4-32k': 32768,
  'gpt-4-turbo': 128000,
  'gpt-4-turbo-preview': 128000,

  // OpenAI GPT-3.5
  'gpt-3.5-turbo': 16385,
  'gpt-3.5-turbo-16k': 16385,

  // Anthropic Claude 3.5
  'claude-3-5-sonnet-20241022': 200000,
  'claude-3-5-haiku-20241022': 200000,
  'claude-opus-4-5': 200000,
  'claude-sonnet-4-5': 200000,
  'claude-haiku-4-5': 200000,

  // Anthropic Claude 3
  'claude-3-opus': 200000,
  'claude-3-sonnet': 200000,
  'claude-3-haiku': 200000,

  // Google Gemini 2.x
  'gemini-2.0-pro': 1000000,
  'gemini-2.0-flash': 200000,
  'gemini-2.0-flash-lite': 200000,

  // Google Gemini 1.5
  'gemini-1.5-pro': 2000000,
  'gemini-1.5-flash': 1000000,

  // Legacy
  'claude-2': 100000,
  'claude-instant': 100000,
}
```

### 1.2 Missing Model Pricing

**Required addition:**

```typescript
export const MODEL_PRICING: Record<string, { input: number; output: number; cached?: number }> = {
  // OpenAI (per 1M tokens)
  'gpt-4o': { input: 2.5, output: 10.0, cached: 1.25 },
  'gpt-4o-mini': { input: 0.15, output: 0.6, cached: 0.075 },
  o1: { input: 15.0, output: 60.0 },
  'o1-mini': { input: 3.0, output: 12.0 },
  'o3-mini': { input: 1.1, output: 4.4 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },

  // Anthropic (per 1M tokens)
  'claude-opus-4-5': { input: 5.0, output: 25.0 },
  'claude-sonnet-4-5': { input: 3.0, output: 15.0, cached: 0.3 },
  'claude-haiku-4-5': { input: 1.0, output: 5.0, cached: 0.1 },

  // Gemini (per 1M tokens)
  'gemini-2.0-pro': { input: 2.5, output: 15.0 },
  'gemini-2.0-flash': { input: 0.5, output: 3.0 },
  'gemini-2.0-flash-lite': { input: 0.075, output: 0.3 },
}
```

### 1.3 False Compression Claims

**Current Claims vs Reality:** | Claimed | Actual | Gap | |---------|--------|-----| | 70-85%
compression | 10-20% | -60% | | LLMLingua support | Basic whitespace | Missing | | Quality
preservation | Not measured | Missing |

**Required:**

- Implement actual LLMLingua-style compression
- Add real quality metrics (BLEU, semantic similarity)
- Remove false advertising from docs/comments

---

## 2. HIGH PRIORITY GAPS

### 2.1 TOON Parser Incomplete

**Current State (toon-optimizer.ts:333-339):**

```typescript
private parseTable(toon: string): unknown[] {
  // TODO: Implement full table parsing
  return []
}
```

**Required:**

- Complete parseTable with column detection
- Complete parseArray with type inference
- Add validation and error messages with line numbers
- Add schema support

### 2.2 Security Pattern Gaps

**Missing Attack Vectors:**

- Unicode normalization attacks (U+2028, U+2029)
- RTLO (Right-to-Left Override) characters
- Zero-width character injection (U+200B, U+FEFF)
- Homoglyph substitution (Cyrillic а vs Latin a)
- Markdown/HTML injection via backslash escaping
- Tool/function calling injection
- Indirect prompt injection via RAG context

**Required Additions to INJECTION_PATTERNS:**

```typescript
const MODERN_INJECTION_PATTERNS = [
  // Unicode attacks
  /[\u2028\u2029]/g, // Line/paragraph separators
  /[\u200B-\u200F\uFEFF]/g, // Zero-width chars
  /[\u202A-\u202E]/g, // Bidirectional overrides

  // Homoglyph detection
  /[а-яА-Я]+/g, // Cyrillic mixed with Latin context

  // Markdown injection
  /\\(?:n|r|t|\\)/g, // Escaped control chars
  /!\[.*?\]\(javascript:/gi, // JS in images

  // Tool calling injection
  /\{"?function"?:/gi,
  /\{"?tool_calls"?:/gi,
]
```

### 2.3 Browser Incompatibility

**Issues:**

1. `Buffer` usage in unified-optimizer.ts (Node.js only)
2. `btoa` usage in advanced-cache.ts (different in Node.js)
3. `crypto` module differences

**Required:**

```typescript
// Cross-platform hash
async function hashString(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    // Browser
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  } else {
    // Node.js
    const crypto = await import('crypto')
    return crypto.createHash('sha256').update(str).digest('hex')
  }
}
```

### 2.4 Memory Leaks

**Affected Files:**

- `accurate-counter.ts:~line 100` - setInterval not cleared
- `token-security.ts:~line 200` - setInterval not cleared

**Required:**

```typescript
class AccurateTokenCounter {
  private cleanupInterval?: NodeJS.Timeout

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 3600000)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = undefined
    }
  }
}
```

---

## 3. MEDIUM PRIORITY GAPS

### 3.1 Accessibility (WCAG 2.1 AA)

**Required Components:**

```typescript
// Token display with accessibility
interface AccessibleTokenDisplayProps {
  current: number
  limit: number
  warningThreshold?: number // Default 80%
  criticalThreshold?: number // Default 95%
}

// Required ARIA attributes
const TokenDisplay: React.FC<AccessibleTokenDisplayProps> = ({
  current,
  limit,
  warningThreshold = 0.8,
  criticalThreshold = 0.95
}) => {
  const percentage = current / limit
  const level = percentage >= criticalThreshold ? 'critical'
    : percentage >= warningThreshold ? 'warning'
    : 'normal'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${current} of ${limit} tokens used, ${Math.round(percentage * 100)}%`}
      className={styles[level]}
    >
      <span aria-hidden="true">{current.toLocaleString()}</span>
      <span className="sr-only">of</span>
      <span aria-hidden="true">/</span>
      <span aria-hidden="true">{limit.toLocaleString()}</span>
    </div>
  )
}
```

**Required Keyboard Shortcuts:**

- `Ctrl+Shift+T` - Announce current token count
- `Escape` - Cancel streaming

### 3.2 Missing React Hooks Integration

**Hooks that need token-optimization integration:** | Hook | Current State | Required |
|------|--------------|----------| | useLazyTokenCounter | Own implementation | Wrap
AccurateTokenCounter | | useResponseCache | Own cache | Use ExactCache | | useEmbeddingCache | Own
cache | Use token-opt embeddings |

### 3.3 Documentation Gaps

**Missing:**

- JSDoc for all public exports
- Usage examples for each utility
- Migration guide from v1
- Performance benchmarks
- API reference docs

---

## 4. CONSOLIDATION REQUIREMENTS

### 4.1 From Memory Package → Token Optimization

| Source File                              | Target Location                   | Action        |
| ---------------------------------------- | --------------------------------- | ------------- |
| memory/compression/extract-strategy.ts   | token-opt/compression/strategies/ | MIGRATE       |
| memory/compression/adaptive-strategy.ts  | token-opt/compression/strategies/ | MIGRATE       |
| memory/compression/summarize-strategy.ts | token-opt/compression/strategies/ | MIGRATE       |
| memory/context/token-budget.ts           | token-opt/budget/                 | MIGRATE       |
| memory/utils/token-counter.ts            | token-opt/legacy-compatibility.ts | EXPORT FACADE |

### 4.2 From React Package → Token Optimization

| Source File                                  | Target Location      | Action      |
| -------------------------------------------- | -------------------- | ----------- |
| react/utils/streaming/streaming-optimizer.ts | token-opt/streaming/ | MIGRATE     |
| react/prompt/core/model-profiles.ts          | token-opt/models/    | CONSOLIDATE |

### 4.3 Files to Remove After Consolidation

**Memory Package:**

- utils/token-optimization-stubs.ts (251 lines)
- utils/context-optimizer.ts (105 lines)
- token-optimizer.ts (21 lines)
- compression/truncate-strategy.ts (duplicate)
- compression/compression-strategy.ts (duplicate interface)

**React Package:**

- utils/optimization/prompt-compression.ts (duplicate)
- prompt/core/tokenizer.ts (duplicate)

---

## 5. PRODUCTION READINESS GAPS

### 5.1 Error Handling

**Current:** Errors swallowed or logged to console **Required:** Proper error hierarchy with
recovery

```typescript
export class TokenOptimizationError extends Error {
  constructor(
    message: string,
    public readonly code: TokenErrorCode,
    public readonly recoverable: boolean,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'TokenOptimizationError'
  }
}

export enum TokenErrorCode {
  MODEL_NOT_SUPPORTED = 'MODEL_NOT_SUPPORTED',
  COMPRESSION_FAILED = 'COMPRESSION_FAILED',
  CACHE_CORRUPTED = 'CACHE_CORRUPTED',
  BUDGET_EXCEEDED = 'BUDGET_EXCEEDED',
  SECURITY_VIOLATION = 'SECURITY_VIOLATION',
}
```

### 5.2 Observability

**Required:**

- Structured logging with log levels
- Metrics export (OpenTelemetry compatible)
- Health check endpoint
- Performance tracing

### 5.3 Circuit Breaker

**Required for production:**

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number // Default: 5
  resetTimeout: number // Default: 30000ms
  halfOpenRequests: number // Default: 1
}

class CircuitBreaker<T> {
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private failures = 0
  private lastFailure?: number

  async execute(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure! > this.config.resetTimeout) {
        this.state = 'half-open'
      } else {
        throw new Error('Circuit breaker is open')
      }
    }
    // ... implementation
  }
}
```

---

## 6. IMPLEMENTATION PRIORITY

### Phase 1: Critical Fixes (Days 1-2)

1. ✅ Update MODEL_TOKEN_LIMITS with 2026 models
2. ✅ Add MODEL_PRICING for all models
3. ✅ Fix memory leaks (interval cleanup)
4. ✅ Fix browser compatibility issues
5. ✅ Update MODEL_ENCODING_MAP for new models

### Phase 2: Core Improvements (Days 3-4)

1. Complete TOON parser implementation
2. Implement real compression (LLMLingua-style)
3. Update security patterns for 2026 attacks
4. Migrate unique code from memory package
5. Add runtime validation with Zod

### Phase 3: Consolidation (Days 5-6)

1. Consolidate memory package code
2. Update React hooks to use token-optimization
3. Remove duplicate code
4. Update all imports across packages

### Phase 4: Production Hardening (Days 7-8)

1. Add accessibility features
2. Implement proper error handling
3. Add observability (metrics, tracing)
4. Add comprehensive documentation
5. Write tests for >90% coverage

### Phase 5: Verification (Days 9-10)

1. Integration testing
2. Performance benchmarking
3. Security audit
4. Accessibility audit (WCAG 2.1 AA)
5. Final documentation review

---

## 7. SUCCESS CRITERIA

| Metric            | Target           | Verification              |
| ----------------- | ---------------- | ------------------------- |
| Model coverage    | 25+ models       | Unit tests for each model |
| Token accuracy    | 99%+             | Benchmark vs API counts   |
| Compression ratio | 40-60% real      | Benchmark tests           |
| Security patterns | 50+ patterns     | Pattern test suite        |
| Test coverage     | >90%             | Jest coverage report      |
| Bundle size       | <50KB gzipped    | Build output              |
| Accessibility     | WCAG 2.1 AA      | axe-core audit            |
| Documentation     | 100% public APIs | TypeDoc generation        |

---

## Appendix: Files Requiring Changes

### Must Change

1. packages/token-optimization/src/constants.ts
2. packages/token-optimization/src/tokenizers/accurate-counter.ts
3. packages/token-optimization/src/security/token-security.ts
4. packages/token-optimization/src/formats/toon-optimizer.ts
5. packages/token-optimization/src/unified-optimizer.ts
6. packages/token-optimization/src/compression/dynamic-compression.ts

### Should Change

1. packages/react/src/hooks/clarity-tokens/use-lazy-token-counter.ts
2. packages/react/src/hooks/clarity-tokens/use-response-cache.ts
3. packages/memory/src/utils/token-counter.ts

### Can Remove After Migration

1. packages/memory/src/utils/token-optimization-stubs.ts
2. packages/memory/src/utils/context-optimizer.ts
3. packages/react/src/prompt/core/tokenizer.ts
