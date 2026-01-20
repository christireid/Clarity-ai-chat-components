# Token Optimization Implementation Strategy

**Date:** 2026-01-20 **Package:** @clarity/token-optimization **Target:** 98/100 implementation
confidence with enterprise-grade quality

---

## Executive Summary

This document outlines a comprehensive strategy to consolidate, enhance, and production-harden the
token optimization system for AI chat applications. Based on extensive research, we will implement
best-in-class token optimization achieving **60-90% cost reduction** with support for all major AI
models.

---

## 1. Token Counting & Estimation

### 1.1 Multi-Model Tokenizer Support

| Model Family                    | Encoding        | Library            | Implementation                     |
| ------------------------------- | --------------- | ------------------ | ---------------------------------- |
| GPT-4o, GPT-4o-mini, o1, o3, o4 | `o200k_base`    | gpt-tokenizer      | Client-side                        |
| GPT-4, GPT-3.5-turbo            | `cl100k_base`   | gpt-tokenizer      | Client-side                        |
| Claude (all variants)           | Custom          | Anthropic API      | Server-side with client estimation |
| Gemini (Pro, Flash, Ultra)      | Custom          | Gemini API         | Server-side with client estimation |
| LLaMA, Mistral                  | LLaMA tokenizer | llama-tokenizer-js | Client-side                        |

### 1.2 Implementation Architecture

```typescript
interface TokenCounter {
  // Accurate counting (may be async for some models)
  count(text: string, model: ModelId): Promise<number>
  countSync(text: string, model: ModelId): number // Client-side only

  // Chat message counting (includes overhead)
  countChat(messages: ChatMessage[], model: ModelId): Promise<number>

  // Limit checking
  isWithinLimit(content: string | ChatMessage[], limit: number): boolean

  // Model info
  getContextLimit(model: ModelId): number
  getOutputLimit(model: ModelId): number
}
```

### 1.3 Model Profiles (2026 Specifications)

```typescript
const MODEL_PROFILES = {
  // OpenAI Models
  'gpt-4o': {
    contextLimit: 128000,
    outputLimit: 16384,
    encoding: 'o200k_base',
    inputCost: 2.5,
    outputCost: 10.0,
  },
  'gpt-4o-mini': {
    contextLimit: 128000,
    outputLimit: 16384,
    encoding: 'o200k_base',
    inputCost: 0.15,
    outputCost: 0.6,
  },
  'gpt-4-turbo': {
    contextLimit: 128000,
    outputLimit: 4096,
    encoding: 'cl100k_base',
    inputCost: 10.0,
    outputCost: 30.0,
  },
  'gpt-3.5-turbo': {
    contextLimit: 16385,
    outputLimit: 4096,
    encoding: 'cl100k_base',
    inputCost: 0.5,
    outputCost: 1.5,
  },
  o1: {
    contextLimit: 200000,
    outputLimit: 100000,
    encoding: 'o200k_base',
    inputCost: 15.0,
    outputCost: 60.0,
  },
  'o1-mini': {
    contextLimit: 128000,
    outputLimit: 65536,
    encoding: 'o200k_base',
    inputCost: 3.0,
    outputCost: 12.0,
  },
  'o3-mini': {
    contextLimit: 200000,
    outputLimit: 100000,
    encoding: 'o200k_base',
    inputCost: 1.1,
    outputCost: 4.4,
  },

  // Anthropic Models
  'claude-opus-4-5': {
    contextLimit: 200000,
    outputLimit: 64000,
    encoding: 'claude',
    inputCost: 5.0,
    outputCost: 25.0,
  },
  'claude-sonnet-4-5': {
    contextLimit: 200000,
    outputLimit: 64000,
    encoding: 'claude',
    inputCost: 3.0,
    outputCost: 15.0,
  },
  'claude-haiku-4-5': {
    contextLimit: 200000,
    outputLimit: 64000,
    encoding: 'claude',
    inputCost: 1.0,
    outputCost: 5.0,
  },

  // Google Models
  'gemini-2.0-pro': {
    contextLimit: 1000000,
    outputLimit: 65536,
    encoding: 'gemini',
    inputCost: 2.5,
    outputCost: 15.0,
  },
  'gemini-2.0-flash': {
    contextLimit: 200000,
    outputLimit: 65536,
    encoding: 'gemini',
    inputCost: 0.5,
    outputCost: 3.0,
  },
  'gemini-2.0-flash-lite': {
    contextLimit: 200000,
    outputLimit: 65536,
    encoding: 'gemini',
    inputCost: 0.075,
    outputCost: 0.3,
  },
} as const
```

---

## 2. Message Compression

### 2.1 TOON (Token-Oriented Object Notation)

TOON achieves **40-61% token reduction** for structured data.

**Implementation:**

```typescript
interface TOONOptimizer {
  encode<T>(data: T, options?: TOONOptions): string
  decode<T>(toon: string): T
  estimateSavings(data: unknown): { jsonTokens: number; toonTokens: number; savings: number }
  isEligible(data: unknown): boolean // Check if TOON is beneficial
}

interface TOONOptions {
  delimiter?: ',' | '\t' | '|'
  keyFolding?: boolean
  tabularThreshold?: number // Min items for tabular format
}
```

**When to Use:**

- Arrays of 3+ uniform objects
- API responses with repeated structures
- RAG context injection
- Batch processing

### 2.2 Dynamic Compression Engine

```typescript
interface CompressionEngine {
  compress(content: string, options: CompressionOptions): Promise<CompressedResult>
  decompress(compressed: CompressedResult): string
}

interface CompressionOptions {
  strategy: 'conservative' | 'balanced' | 'aggressive'
  targetRatio?: number // 0.4-0.9
  minQuality?: number // 0.7-0.95
  preserveCode?: boolean
  preserveStructure?: boolean
}

interface CompressedResult {
  content: string
  originalTokens: number
  compressedTokens: number
  compressionRatio: number
  qualityScore: number
  strategy: string
}
```

### 2.3 Compression Strategies

| Strategy     | Target Ratio | Min Quality | Use Case                    |
| ------------ | ------------ | ----------- | --------------------------- |
| Conservative | 80%          | 95%         | Critical accuracy tasks     |
| Balanced     | 60%          | 85%         | General use                 |
| Aggressive   | 40%          | 70%         | Cost-sensitive, high volume |

### 2.4 LLMLingua-Style Compression

For extreme compression (up to 20x), implement statistical token importance:

```typescript
interface LLMLinguaCompressor {
  compress(prompt: string, options: LLMLinguaOptions): Promise<string>
}

interface LLMLinguaOptions {
  targetTokens?: number
  targetRatio?: number
  preserveFirst?: number // Keep first N sentences
  preserveLast?: number // Keep last N sentences
  instructionStart?: string // Mark instruction boundaries
}
```

---

## 3. Context Window Management

### 3.1 Sliding Window Implementation

```typescript
interface SlidingWindowManager {
  apply(messages: ChatMessage[], config: WindowConfig): ChatMessage[]
  getStats(): WindowStats
}

interface WindowConfig {
  maxTokens: number
  keepSystemPrompt: boolean
  keepRecentCount: number
  overlapTokens?: number
  priorityMessages?: number[]
}
```

### 3.2 Priority-Based Retention

```typescript
interface PriorityRetainer {
  retain(messages: PrioritizedMessage[], budget: number): ChatMessage[]
}

interface PrioritizedMessage extends ChatMessage {
  priority: 'critical' | 'high' | 'medium' | 'low'
  timestamp: number
  relevanceScore?: number
}
```

### 3.3 Smart Truncation

Place critical information at **start (first 20%)** and **end (last 10%)** for best recall:

```typescript
interface SmartTruncator {
  truncate(content: string, maxTokens: number, options?: TruncateOptions): string
}

interface TruncateOptions {
  preserveStart?: number // Percentage (default: 20)
  preserveEnd?: number // Percentage (default: 10)
  separator?: string
  preserveCodeBlocks?: boolean
}
```

---

## 4. Caching Strategies

### 4.1 Multi-Tier Cache Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Request Flow                              │
├─────────────────────────────────────────────────────────────┤
│  Request → Exact Cache → Semantic Cache → LLM → Response    │
│              ↓ miss        ↓ miss          ↓                │
│            Check         Embed &        Generate            │
│            Hash          Search         Response            │
│                            ↓               ↓                │
│                      Update Caches ←───────┘                │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Cache Implementations

```typescript
interface CacheManager {
  // Exact match cache (hash-based)
  exactCache: ExactCache

  // Semantic similarity cache (embedding-based)
  semanticCache: SemanticCache

  // Provider-specific prompt caching
  promptCache: PromptCache

  // Unified lookup
  get(query: string | ChatMessage[]): Promise<CacheResult | null>
  set(query: string | ChatMessage[], response: string): Promise<void>

  // Analytics
  getStats(): CacheStats
}

interface SemanticCache {
  get(query: string, threshold?: number): Promise<CachedResponse | null>
  set(query: string, response: string): Promise<void>
  invalidate(pattern: string): Promise<number>
}
```

### 4.3 Provider Prompt Caching

**Anthropic:** Cache static prefixes for 90% cost reduction

```typescript
interface AnthropicCacheConfig {
  cacheControl: { type: 'ephemeral' } // 5-min TTL
  // OR
  cacheControl: { type: 'extended'; ttlSeconds: 3600 } // 1-hour
}
```

**OpenAI:** Automatic caching of identical prefixes (50% savings)

---

## 5. Model Routing & Cost Optimization

### 5.1 Intelligent Router

```typescript
interface ModelRouter {
  route(request: RoutingRequest): RoutingDecision
  estimateCost(request: RoutingRequest, model: ModelId): CostEstimate
}

interface RoutingRequest {
  messages: ChatMessage[]
  taskType?: TaskType
  qualityRequirement?: 'low' | 'medium' | 'high' | 'critical'
  maxLatency?: number
  maxCost?: number
}

interface RoutingDecision {
  model: ModelId
  reason: string
  estimatedCost: number
  estimatedLatency: number
  confidence: number
}
```

### 5.2 Task-Based Routing

| Task Type         | Recommended Model          | Reasoning      |
| ----------------- | -------------------------- | -------------- |
| Classification    | gpt-4o-mini / claude-haiku | Simple, fast   |
| Summarization     | gpt-4o-mini / gemini-flash | Balanced       |
| Code Generation   | claude-sonnet / gpt-4o     | High accuracy  |
| Complex Reasoning | claude-opus / o1           | Best quality   |
| Translation       | gpt-4o-mini                | Fast, accurate |
| Creative Writing  | claude-sonnet              | Nuanced output |

### 5.3 Budget-Aware Optimization

```typescript
interface BudgetOptimizer {
  setDailyBudget(amount: number): void
  setMonthlyBudget(amount: number): void
  checkBudget(estimatedCost: number): BudgetCheck
  getUsageReport(): UsageReport
}

interface BudgetCheck {
  allowed: boolean
  remainingDaily: number
  remainingMonthly: number
  suggestion?: string
}
```

---

## 6. Streaming Optimization

### 6.1 Stream Processing

```typescript
interface StreamOptimizer {
  // Optimize stream chunks for display
  optimizeChunk(chunk: string, context: StreamContext): OptimizedChunk

  // Early termination on conditions
  shouldTerminate(fullResponse: string, conditions: StopCondition[]): boolean

  // Progressive token counting
  countStreamTokens(chunks: AsyncIterable<string>): AsyncIterable<TokenCount>
}
```

### 6.2 Partial Response Handling

```typescript
interface PartialResponseHandler {
  buffer: string
  onChunk(chunk: string): void
  onComplete(): void
  onAbort(reason: string): void
  getPartialTokenCount(): number
}
```

---

## 7. Security Features (OWASP LLM Top 10)

### 7.1 Security Manager

```typescript
interface SecurityManager {
  // Prompt injection prevention
  sanitizeInput(input: string): SanitizedInput
  detectInjection(input: string): InjectionResult

  // PII protection
  redactPII(text: string, config?: PIIConfig): RedactedText

  // Rate limiting
  checkRateLimit(userId: string): RateLimitResult

  // Audit logging
  logAccess(event: AuditEvent): void

  // Compliance
  getComplianceLevel(): ComplianceLevel
}

type ComplianceLevel = 'basic' | 'enterprise' | 'government'
```

### 7.2 Security Profiles

| Level      | Features                                 | Noise Factor |
| ---------- | ---------------------------------------- | ------------ |
| Basic      | Sanitization, PII redaction              | 5%           |
| Enterprise | + Audit logging, compression obfuscation | 10%          |
| Government | + Enhanced compliance, strict filtering  | 20%          |

### 7.3 Input Validation

```typescript
interface InputValidator {
  validate(input: string): ValidationResult
  sanitize(input: string): string
  detectMalicious(input: string): ThreatAssessment
}

interface ValidationResult {
  valid: boolean
  sanitized: string
  warnings: ValidationWarning[]
  threats: ThreatIndicator[]
}
```

---

## 8. Accessibility (WCAG 2.1 AA)

### 8.1 Accessible Token Display

```typescript
interface AccessibleTokenDisplay {
  // Screen reader announcements
  announceTokenCount(count: number, limit: number): string

  // Keyboard navigation
  keyboardShortcuts: KeyboardShortcut[]

  // High contrast mode
  getContrastStyles(mode: 'light' | 'dark' | 'high-contrast'): CSSProperties

  // Reduced motion
  getAnimationStyles(prefersReducedMotion: boolean): CSSProperties
}
```

### 8.2 ARIA Implementation

```typescript
// Token counter component
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  aria-label={`${tokenCount} of ${tokenLimit} tokens used`}
>
  {/* Visual display */}
</div>
```

---

## 9. Production Readiness

### 9.1 Health Checks

```typescript
interface HealthChecker {
  check(): Promise<HealthStatus>
  getMetrics(): Metrics
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  components: {
    tokenizer: ComponentHealth
    cache: ComponentHealth
    security: ComponentHealth
  }
  timestamp: number
}
```

### 9.2 Observability

```typescript
interface ObservabilityConfig {
  // Metrics
  metricsEnabled: boolean
  metricsEndpoint?: string

  // Logging
  logLevel: 'debug' | 'info' | 'warn' | 'error'
  structuredLogging: boolean

  // Tracing
  tracingEnabled: boolean
  tracingEndpoint?: string
}
```

### 9.3 Error Handling

```typescript
interface ErrorHandler {
  handle(error: TokenOptimizationError): ErrorResolution
  retry<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T>
  fallback<T>(operation: () => Promise<T>, fallback: T): Promise<T>
}

interface RetryOptions {
  maxRetries: number
  backoffMs: number
  exponential: boolean
}
```

---

## 10. Package Structure

### 10.1 Consolidated Exports

```typescript
// Main entry point
export {
  // Token counting
  TokenCounter,
  createTokenCounter,
  countTokens,
  countChatTokens,

  // Compression
  CompressionEngine,
  TOONOptimizer,
  LLMLinguaCompressor,
  MarkdownOptimizer,

  // Caching
  CacheManager,
  SemanticCache,
  ExactCache,

  // Context management
  SlidingWindowManager,
  PriorityRetainer,
  SmartTruncator,

  // Routing
  ModelRouter,
  BudgetOptimizer,
  CostEstimator,

  // Security
  SecurityManager,
  InputValidator,
  PIIRedactor,

  // React hooks
  useTokenCounter,
  useTokenBudget,
  useCostEstimator,
  useSemanticCache,
  useCompressionEngine,
  useModelRouter,

  // Types
  ModelId,
  ChatMessage,
  CompressionOptions,
  CacheConfig,
  SecurityConfig,

  // Constants
  MODEL_PROFILES,
  DEFAULT_COMPRESSION_OPTIONS,
  DEFAULT_SECURITY_CONFIG,
} from '@clarity/token-optimization'
```

### 10.2 Sub-Path Exports

```typescript
// Specific imports for tree-shaking
import { TokenCounter } from '@clarity/token-optimization/tokenizers'
import { SemanticCache } from '@clarity/token-optimization/caching'
import { useTokenCounter } from '@clarity/token-optimization/react'
import { SecurityManager } from '@clarity/token-optimization/security'
```

---

## 11. Implementation Phases

### Phase 1: Core Infrastructure (Week 1)

- [ ] Consolidate existing code from memory/react packages
- [ ] Implement multi-model token counter
- [ ] Update model profiles to 2026 specs
- [ ] Add comprehensive TypeScript types

### Phase 2: Compression & Caching (Week 2)

- [ ] Enhance TOON optimizer
- [ ] Implement LLMLingua-style compression
- [ ] Build semantic cache with embeddings
- [ ] Add provider-specific prompt caching

### Phase 3: Context & Routing (Week 3)

- [ ] Implement sliding window manager
- [ ] Build priority-based retention
- [ ] Create intelligent model router
- [ ] Add budget-aware optimization

### Phase 4: Security & Production (Week 4)

- [ ] Complete OWASP LLM Top 10 compliance
- [ ] Add accessibility features
- [ ] Implement health checks & observability
- [ ] Add comprehensive error handling

### Phase 5: Testing & Documentation (Week 5)

- [ ] Unit tests (>90% coverage)
- [ ] Integration tests
- [ ] Performance benchmarks
- [ ] API documentation
- [ ] Usage examples

---

## 12. Success Metrics

| Metric              | Target        | Measurement           |
| ------------------- | ------------- | --------------------- |
| Token reduction     | 60-90%        | Benchmark tests       |
| Accuracy (counting) | 99%+          | vs API counts         |
| Cache hit rate      | 80%+          | Production monitoring |
| Bundle size         | <50KB gzipped | Build output          |
| Test coverage       | >90%          | Jest coverage         |
| TypeScript strict   | 100%          | Compilation           |
| WCAG compliance     | AA            | Accessibility audit   |
| Security compliance | OWASP Top 10  | Security audit        |

---

## 13. Dependencies

### Required

- `gpt-tokenizer` - Token counting (GPT models)
- `lru-cache` - Efficient caching
- `crypto-js` - Security utilities

### Optional

- `@anthropic-ai/sdk` - Claude token counting
- `@google/generative-ai` - Gemini token counting
- `@toon-format/toon` - TOON encoding

### Dev Dependencies

- `vitest` - Testing
- `typescript` - Type checking
- `tsup` - Building

---

## Appendix A: API Reference

See `/packages/token-optimization/README.md` for complete API documentation.

## Appendix B: Migration Guide

See `/packages/token-optimization/MIGRATION.md` for upgrading from previous versions.
