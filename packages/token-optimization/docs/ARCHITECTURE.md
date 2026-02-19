# Architecture Documentation

**Package:** @clarity-chat/token-optimization v1.0.0
**Date:** 2026-01-20

---

## Table of Contents

1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Layer Architecture](#layer-architecture)
4. [Dual-API Pattern](#dual-api-pattern)
5. [Subpath Exports](#subpath-exports)
6. [Progressive Complexity](#progressive-complexity)
7. [Key Design Decisions](#key-design-decisions)
8. [Module Organization](#module-organization)
9. [Extension Points](#extension-points)
10. [Performance Considerations](#performance-considerations)

---

## Overview

The `@clarity-chat/token-optimization` package is designed as a **production-grade token management system** for LLM applications. It follows a **layered architecture** with a **dual-API pattern** that provides both simple and advanced interfaces for different use cases.

### Core Principles

1. **Progressive Disclosure** - Simple APIs for common cases, advanced APIs when needed
2. **Zero Lock-In** - Pure functions and composable utilities, no framework dependencies
3. **Production-First** - Built-in observability, error handling, and performance monitoring
4. **Type Safety** - Strict TypeScript with zero 'any' types
5. **Tree-Shakeable** - ESM-first with subpath exports for optimal bundling

---

## Design Philosophy

### Why This Architecture?

**Problem:** Most token optimization libraries are either:
- Too simple (just wrappers around tokenizers)
- Too complex (require deep integration with LLM frameworks)
- Not complete (missing monitoring, error handling, caching)

**Solution:** A **layered architecture** that provides:
- **Simple layer:** Drop-in utilities for common tasks
- **Standard layer:** Flexible classes with configuration
- **Advanced layer:** Full control with extension points

### Architectural Goals

1. **Developer Experience**
   - Zero config for 80% use cases
   - Clear upgrade path from simple → advanced
   - Self-documenting APIs with TypeScript

2. **Production Readiness**
   - Built-in logging and metrics
   - Graceful error handling
   - Performance optimizations
   - Security by default

3. **Maintainability**
   - Clear module boundaries
   - Minimal inter-module dependencies
   - Consistent patterns throughout

---

## Layer Architecture

The package is organized into three conceptual layers:

```
┌─────────────────────────────────────────────────────┐
│                   Application Layer                  │
│            (Your LLM Application Code)              │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│              Simple API Layer (Utilities)            │
│  countTokens(), truncateToTokens(), compressText()  │
│         Pure functions, zero configuration          │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│            Standard API Layer (Classes)              │
│   AccurateTokenCounter, TextChunker, Compressors   │
│        Configurable, stateful, cacheable           │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│           Advanced API Layer (Infrastructure)        │
│   ProviderNativeCounter, FileOptimizer, Security    │
│        Full control, custom implementations         │
└─────────────────────────────────────────────────────┘
                         ▲
                         │
┌─────────────────────────────────────────────────────┐
│              Core Infrastructure Layer               │
│   Tokenizers, Observability, Errors, Types         │
│         Shared utilities and services               │
└─────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Simple API Layer
**Purpose:** Frictionless adoption for common use cases

- Pure functions with no setup required
- Sensible defaults for all parameters
- Clear input → output contracts
- No state management

**Example:**
```typescript
import { countTokens } from '@clarity-chat/token-optimization/simple'

const count = countTokens('Hello, world!') // 4
```

#### 2. Standard API Layer
**Purpose:** Flexible configuration with reasonable complexity

- Class-based APIs with configuration options
- Stateful caching for performance
- Reusable instances
- Error recovery

**Example:**
```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  model: 'gpt-4',
  cacheResults: true,
})

const count = counter.count('Hello, world!') // 4
```

#### 3. Advanced API Layer
**Purpose:** Full control for specialized requirements

- Provider-native token counting (Anthropic, Gemini APIs)
- File optimization with chunking strategies
- Security and compliance features
- Custom tokenizer implementations

**Example:**
```typescript
import { ProviderNativeCounter } from '@clarity-chat/token-optimization/advanced'

const counter = new ProviderNativeCounter({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const result = await counter.count('Your prompt')
// { tokens: 123, method: 'provider-api', cached: false }
```

#### 4. Core Infrastructure Layer
**Purpose:** Shared utilities and services

- Tokenizers (gpt-tokenizer, Claude, Gemini)
- Observability system (Logger, metrics, tracing)
- Error handling (TokenOptimizationError)
- Type definitions

---

## Dual-API Pattern

The package provides **two parallel APIs** for most features: **simple utilities** and **configurable classes**.

### Pattern Structure

```typescript
// Simple API - Pure function
export function countTokens(text: string): number {
  return new AccurateTokenCounter().count(text)
}

// Standard API - Configurable class
export class AccurateTokenCounter {
  constructor(config?: TokenCounterConfig) {
    // Setup with configuration
  }

  count(text: string): number {
    // Stateful, cached, optimized implementation
  }
}
```

### When to Use Which API

**Use Simple API when:**
- Quick prototyping or scripts
- No performance concerns
- No custom configuration needed
- One-time operations

**Use Standard API when:**
- Production applications
- Performance matters (caching)
- Custom configuration needed
- Repeated operations on many inputs

**Use Advanced API when:**
- 100% accurate counts required (provider APIs)
- Complex file processing (chunking, conversion)
- Security and compliance needs
- Custom implementations

---

## Subpath Exports

The package uses **subpath exports** for tree-shaking and logical organization.

### Export Map

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./simple": "./dist/simple/index.js",
    "./advanced": "./dist/advanced/index.js",
    "./types": "./dist/types/index.js",
    "./errors": "./dist/errors/index.js"
  }
}
```

### Benefits

1. **Tree-Shaking** - Import only what you need
2. **Clear Namespacing** - Organized feature discovery
3. **Bundle Size** - Users pay only for what they use
4. **Future-Proof** - Easy to add new subpaths without breaking changes

### Import Examples

```typescript
// Main exports (standard API)
import { AccurateTokenCounter, TextChunker } from '@clarity-chat/token-optimization'

// Simple utilities
import { countTokens, truncateToTokens } from '@clarity-chat/token-optimization/simple'

// Advanced features
import { ProviderNativeCounter, FileOptimizer } from '@clarity-chat/token-optimization/advanced'

// Types only
import type { TokenCounterConfig, ChunkingStrategy } from '@clarity-chat/token-optimization/types'

// Errors
import { TokenOptimizationError, TokenErrorCode } from '@clarity-chat/token-optimization/errors'
```

---

## Progressive Complexity

The architecture implements **progressive complexity** - you only learn what you need, when you need it.

### Complexity Ladder

```
Level 1: Function Calls
├─ countTokens()
├─ truncateToTokens()
└─ compressText()
    ↓ Need configuration?

Level 2: Class Instances
├─ new AccurateTokenCounter({ model, cache })
├─ new TextChunker({ strategy, maxTokens })
└─ new AdaptiveCompressor({ quality })
    ↓ Need provider accuracy?

Level 3: Provider Integration
├─ new ProviderNativeCounter({ provider, apiKey })
├─ new FileOptimizer({ chunking, format })
└─ new TokenSecurityManager({ compliance })
    ↓ Need custom logic?

Level 4: Extension Points
├─ Custom tokenizer: class MyTokenizer implements Tokenizer
├─ Custom compressor: class MyCompressor implements Compressor
└─ Custom security: class MyValidator implements Validator
```

### Example Progression

**Beginner:**
```typescript
import { countTokens } from '@clarity-chat/token-optimization/simple'
const count = countTokens('text')
```

**Intermediate:**
```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({ model: 'gpt-4', cacheResults: true })
const count = counter.count('text')
```

**Advanced:**
```typescript
import { ProviderNativeCounter } from '@clarity-chat/token-optimization/advanced'
const counter = new ProviderNativeCounter({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  cacheFor: 3600,
})
const result = await counter.count('text')
```

---

## Key Design Decisions

### 1. Why gpt-tokenizer?

**Decision:** Use `gpt-tokenizer` as the default tokenizer instead of `tiktoken`

**Rationale:**
- 5-6x smaller bundle (972KB vs 5.3MB for js-tiktoken)
- Pure JavaScript (no native dependencies)
- Supports all OpenAI models including o-series
- 99%+ accuracy for OpenAI models
- Used by Microsoft Teams AI, CodeRabbit, Elastic Kibana

**Trade-offs:**
- Not 100% accurate (99%+ for OpenAI, ~90% for others)
- Solution: Offer `ProviderNativeCounter` for 100% accuracy when needed

### 2. Why Provider-Native Counting?

**Decision:** Implement API-based token counting for Anthropic and Gemini

**Rationale:**
- 100% accurate counts (matches provider billing exactly)
- Free APIs available (Anthropic /v1/messages/count_tokens, Gemini countTokens)
- Critical for cost-sensitive applications
- Validates caching effectiveness

**Trade-offs:**
- Requires API keys
- Network latency
- Solution: 1-hour caching + fallback to local counting

### 3. Why Deprecate DynamicCompressionEngine?

**Decision:** Deprecate complex compression engine in favor of simpler strategies

**Rationale:**
- Original engine claimed "70-85% compression" but delivered 10-30% (mostly whitespace)
- Complex infrastructure (1,225 lines) for minimal benefit
- New strategies (LLMLingua, Extractive) achieve 2-20x real compression
- Clearer value proposition

**Migration Path:**
- Runtime deprecation warnings
- MIGRATION.md with code examples
- Keep deprecated code until v2.0.0

### 4. Why Dual-API Pattern?

**Decision:** Provide both simple functions and configurable classes

**Rationale:**
- **Adoption friction:** Simple functions remove setup barriers
- **Performance:** Classes enable caching and optimization
- **Flexibility:** Users choose complexity level

**Example:**
```typescript
// Simple: Zero setup
countTokens('text')

// Standard: Performance + config
const counter = new AccurateTokenCounter({ cacheResults: true })
counter.count('text')
```

### 5. Why ESM-First?

**Decision:** Ship ESM as primary format with CJS as compatibility layer

**Rationale:**
- Modern bundlers (Vite, Webpack 5, esbuild) prefer ESM
- Better tree-shaking support
- Aligns with Node.js ecosystem direction
- Smaller bundle sizes for users

**Compatibility:**
- Still ship CJS for older toolchains
- Use `.js` extensions in imports for ESM compliance

---

## Module Organization

### Directory Structure

```
src/
├── index.ts                  # Main exports (standard API)
├── simple/                   # Simple utility functions
│   ├── index.ts
│   ├── token-counter.ts
│   ├── chunker.ts
│   └── compressor.ts
├── advanced/                 # Advanced features
│   ├── index.ts
│   ├── provider-native-counter.ts
│   └── file-optimizer.ts
├── tokenizers/               # Tokenizer implementations
│   ├── accurate-counter.ts   # gpt-tokenizer wrapper
│   └── provider-native-counter.ts
├── chunking/                 # Text chunking
│   └── text-chunker.ts
├── compression/              # Compression strategies
│   ├── llmlingua.ts
│   ├── extractive.ts
│   └── adaptive.ts
├── files/                    # File optimization
│   └── file-optimizer.ts
├── security/                 # Security and compliance
│   ├── token-security.ts
│   └── input-validator.ts
├── cost/                     # Cost optimization
│   └── cost-aware-optimizer.ts
├── observability/            # Logging and metrics
│   └── index.ts
├── errors/                   # Error handling
│   └── index.ts
├── types/                    # Type definitions
│   └── index.ts
└── __tests__/                # Test suites
    ├── integration.test.ts
    └── benchmarks/
```

### Module Dependencies

```
Core Modules (No internal dependencies):
├── errors/
├── types/
└── observability/

Utility Modules (Depend on Core):
├── tokenizers/ → errors, types
├── chunking/ → tokenizers, types
└── security/ → errors, types, observability

Feature Modules (Depend on Utilities):
├── compression/ → tokenizers, chunking
├── files/ → tokenizers, chunking
└── cost/ → tokenizers, types

API Layers (Depend on Features):
├── simple/ → tokenizers, chunking, compression
└── advanced/ → all modules
```

### Dependency Rules

1. **Core modules** have no internal dependencies
2. **Utility modules** depend only on core modules
3. **Feature modules** depend on utilities but not other features
4. **API layers** can depend on any module (aggregation layer)
5. **No circular dependencies** allowed

---

## Extension Points

The architecture provides several extension points for customization.

### 1. Custom Tokenizers

Implement the `Tokenizer` interface:

```typescript
interface Tokenizer {
  encode(text: string): number[]
  decode(tokens: number[]): string
  countTokens(text: string): number
}

class MyCustomTokenizer implements Tokenizer {
  encode(text: string): number[] {
    // Your implementation
  }

  decode(tokens: number[]): string {
    // Your implementation
  }

  countTokens(text: string): number {
    return this.encode(text).length
  }
}
```

### 2. Custom Compressors

Implement the `Compressor` interface:

```typescript
interface Compressor {
  compress(text: string): Promise<CompressResult>
  decompress?(compressed: string): Promise<string>
}

class MyCompressor implements Compressor {
  async compress(text: string): Promise<CompressResult> {
    // Your implementation
    return {
      compressed: '...',
      originalTokens: 100,
      compressedTokens: 50,
      compressionRatio: 0.5,
    }
  }
}
```

### 3. Custom Logging

Provide a custom `LogHandler`:

```typescript
const logger = new Logger({
  logLevel: 'info',
  logHandler: {
    log(level, message, context) {
      // Send to your logging service
      myLoggingService.log({ level, message, ...context })
    },
  },
})
```

### 4. Custom Metrics

Provide a custom `MetricsHandler`:

```typescript
const logger = new Logger({
  metricsEnabled: true,
  metricsHandler: {
    increment(name, value, tags) {
      datadog.increment(name, value, tags)
    },
    gauge(name, value, tags) {
      datadog.gauge(name, value, tags)
    },
  },
})
```

---

## Performance Considerations

### Caching Strategy

**Token Counting:**
- `AccurateTokenCounter` caches results in memory (LRU cache)
- `ProviderNativeCounter` caches for 1 hour to minimize API calls
- Cache keys based on text content hash

**Compression:**
- LLMLingua results cached to avoid expensive recomputation
- Extractive compression cached per configuration

### Bundle Size Optimization

**Approach:**
1. **Subpath exports** - Import only what you need
2. **ESM-first** - Better tree-shaking
3. **gpt-tokenizer** - 5-6x smaller than tiktoken
4. **Lazy loading** - Advanced features loaded on demand

**Results:**
- Core package: ~200KB minified
- Simple utilities: ~50KB minified
- Advanced features: ~100KB additional (loaded on demand)

### Memory Management

**Large File Handling:**
- `FileOptimizer` uses streaming for files >10MB
- Chunking strategies prevent loading entire file into memory
- Configurable chunk sizes with overlap

**Token Counting:**
- Caches use LRU eviction to prevent unbounded growth
- Configurable cache size limits
- Automatic cache cleanup on memory pressure

---

## Summary

The architecture balances:
- **Simplicity** (utilities) with **flexibility** (classes)
- **Performance** (caching) with **accuracy** (provider APIs)
- **Bundle size** (tree-shaking) with **features** (comprehensive toolkit)
- **Developer experience** (progressive complexity) with **production readiness** (observability)

This design enables both:
1. **Quick adoption** for new users (simple functions)
2. **Production deployment** for serious applications (advanced features)

---

**For questions or contributions, see:** [CONTRIBUTING.md](../CONTRIBUTING.md)
