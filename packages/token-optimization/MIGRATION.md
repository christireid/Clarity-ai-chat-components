# Migration Guide

**Package:** @clarity-chat/token-optimization v1.0.0
**Last Updated:** 2026-01-20

This guide helps you migrate from:
1. Deprecated APIs within this package
2. Legacy `@clarity-chat/memory` package
3. Legacy `@clarity-chat/react` token utilities

---

## Table of Contents

1. [Deprecated APIs in v1.0.0](#deprecated-apis-in-v100)
2. [Migrating from @clarity-chat/memory](#migrating-from-clarity-chatmemory)
3. [Migrating from @clarity-chat/react](#migrating-from-clarity-chatreact)
4. [Runtime Deprecation Warnings](#runtime-deprecation-warnings)
5. [Compression Strategy Selection](#compression-strategy-selection-guide)

---

## Deprecated APIs in v1.0.0

### ⚠️ Deprecation Timeline

- **v1.0.0**: Deprecated APIs marked with runtime warnings
- **v1.x.x**: Deprecated APIs continue to work (backward compatible)
- **v2.0.0** (planned 3-6 months): Deprecated APIs removed entirely

### DynamicCompressionEngine (DEPRECATED)

### DynamicCompressionEngine (REMOVED)

**Status:** ❌ Removed from public API
**Reason:** Misleading claims - achieved only 10-20% whitespace normalization, not the claimed 70-85% compression

**Migration:**

```typescript
// ❌ Old (removed)
import { DynamicCompressionEngine } from '@clarity-chat/token-optimization'
const engine = new DynamicCompressionEngine(config)
const result = engine.compress(text)

// ✅ New - Use LLMLinguaCompressor for real compression (2-20x)
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'
const compressor = new LLMLinguaCompressor({
  targetRatio: 0.5,  // 50% compression
  preserveQuestions: true,
  preserveEntities: true,
})
const result = await compressor.compress(text)

// ✅ Or use AdaptiveCompressor (auto-selects best strategy)
import { AdaptiveCompressor } from '@clarity-chat/token-optimization'
const compressor = new AdaptiveCompressor()
const result = await compressor.compress(text)

// ✅ Or just whitespace normalization (if that's all you need)
import { normalizeWhitespace } from '@clarity-chat/token-optimization'
const normalized = normalizeWhitespace(text)
```

### BasicCompressionEngine (NOT exported, but documented)

**Status:** ⚠️ Internal API only
**Reason:** Only performs whitespace normalization, not real compression

**If you were using it directly:**

```typescript
// ❌ Old (never officially exported, but available in src/)
import { BasicCompressionEngine } from './compression/basic-engine'

// ✅ New - Use normalizeWhitespace function
import { normalizeWhitespace } from '@clarity-chat/token-optimization'
const normalized = normalizeWhitespace(text)
```

---

## Compression Strategy Selection Guide

### When to use each strategy:

| Strategy | Use Case | Compression | Speed | Quality |
|----------|----------|-------------|-------|---------|
| **LLMLinguaCompressor** | Maximum compression needed | 2-20x | Slow | High |
| **ExtractiveCompressor** | Preserve key sentences | 2-5x | Fast | High |
| **AdaptiveCompressor** | Auto-select best strategy | 2-10x | Medium | High |
| **normalizeWhitespace** | Just clean up whitespace | 1.1-1.2x | Instant | Perfect |

### Code Examples:

**Maximum Compression (LLMLingua):**
```typescript
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

const result = await compressWithLLMLingua(longText, {
  targetRatio: 0.3,  // Compress to 30% of original
  preserveQuestions: true,
  preserveEntities: true,
})
console.log(`Reduced from ${result.originalTokens} to ${result.compressedTokens} tokens`)
```

**Sentence Extraction:**
```typescript
import { compressExtractively } from '@clarity-chat/token-optimization'

const result = await compressExtractively(text, {
  topK: 5,  // Keep top 5 sentences
  minScore: 0.3,  // Minimum relevance score
})
```

**Auto-Select (Recommended):**
```typescript
import { compressAdaptively } from '@clarity-chat/token-optimization'

// Analyzes content and picks best strategy automatically
const result = await compressAdaptively(text, {
  targetRatio: 0.5,
})
console.log(`Method used: ${result.method}`)
```

---

---

## Migrating from @clarity-chat/memory

If you were using `@clarity-chat/memory` for token counting and compression:

### TokenCounter → AccurateTokenCounter

```typescript
// ❌ Old (@clarity-chat/memory)
import { TokenCounter } from '@clarity-chat/memory'
const counter = new TokenCounter()
const count = counter.count(text)

// ✅ New
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({
  model: 'gpt-4',
  cacheResults: true, // Enable caching for better performance
})
const count = counter.count(text)

// ✅ Or use simple API
import { countTokens } from '@clarity-chat/token-optimization/simple'
const count = countTokens(text) // Zero config
```

### TokenBudgetManager → Budget Tracking

```typescript
// ❌ Old (@clarity-chat/memory)
import { TokenBudgetManager } from '@clarity-chat/memory'
const budget = new TokenBudgetManager({ maxTokens: 4000 })
budget.consume(1000)

// ✅ New - Use CostAwareOptimizer
import { CostAwareOptimizer } from '@clarity-chat/token-optimization'
const optimizer = new CostAwareOptimizer({
  totalBudget: 100.00, // Dollar budget
  enableBudgetTracking: true,
})
```

### MemoryCompressor → Modern Compression

```typescript
// ❌ Old (@clarity-chat/memory)
import { MemoryCompressor } from '@clarity-chat/memory'
const compressor = new MemoryCompressor()
const result = compressor.compress(text)

// ✅ New - Real compression with LLMLingua
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'
const compressor = new LLMLinguaCompressor({
  targetRatio: 0.5, // 50% compression
})
const result = await compressor.compress(text)

// ✅ Or use adaptive strategy
import { compressAdaptively } from '@clarity-chat/token-optimization/simple'
const result = await compressAdaptively(text, { targetRatio: 0.5 })
```

### SemanticChunker → TextChunker

```typescript
// ❌ Old (@clarity-chat/memory)
import { SemanticChunker } from '@clarity-chat/memory'
const chunker = new SemanticChunker({ chunkSize: 512 })
const chunks = chunker.chunk(text)

// ✅ New - Enhanced chunking strategies
import { TextChunker, ChunkingStrategy } from '@clarity-chat/token-optimization'
const chunker = new TextChunker({
  strategy: ChunkingStrategy.SEMANTIC, // or BALANCED, PRECISE
  maxTokens: 512,
  overlapPercentage: 0.15,
})
const result = chunker.chunk(text)

// Access chunks with metadata
result.chunks.forEach(chunk => {
  console.log(`Chunk ${chunk.index}: ${chunk.tokenCount} tokens`)
  console.log(chunk.text)
})
```

### ContextOptimizer → Advanced Optimization

```typescript
// ❌ Old (@clarity-chat/memory)
import { ContextOptimizer } from '@clarity-chat/memory'
const optimizer = new ContextOptimizer()
const optimized = optimizer.optimize(context)

// ✅ New - File optimization with multiple strategies
import { FileOptimizer } from '@clarity-chat/token-optimization/advanced'
const optimizer = new FileOptimizer({
  outputFormat: 'toon', // or 'markdown', 'json'
  chunkingStrategy: 'semantic',
  targetChunkSize: 1000,
})
const result = await optimizer.optimize(content, 'html')
console.log(`Saved ${result.stats.tokensSaved} tokens (${result.stats.savingsPercent}%)`)
```

---

## Migrating from @clarity-chat/react

If you were using token utilities from `@clarity-chat/react`:

### Token Counting

```typescript
// ❌ Old (@clarity-chat/react)
import { useTokenCount } from '@clarity-chat/react'
const count = useTokenCount(text)

// ✅ New - Use this package
import { countTokens } from '@clarity-chat/token-optimization/simple'
const count = countTokens(text)

// For React hooks, use the new hooks:
import { useTokenCounter } from '@clarity-chat/token-optimization'
const counter = useTokenCounter({ model: 'gpt-4', cacheResults: true })
const count = counter.count(text)
```

### Dynamic Optimization

```typescript
// ❌ Old (@clarity-chat/react)
import { useDynamicOptimization } from '@clarity-chat/react'
const optimized = useDynamicOptimization(text)

// ✅ New - Use compression strategies
import { compressAdaptively } from '@clarity-chat/token-optimization/simple'
const result = await compressAdaptively(text, {
  targetRatio: 0.5,
})
```

---

## Runtime Deprecation Warnings

Starting in v1.0.0, deprecated classes will emit console warnings when instantiated:

```typescript
// Using deprecated DynamicCompressionEngine
const engine = new DynamicCompressionEngine(config)

// Console output:
// ⚠️ DynamicCompressionEngine is deprecated and will be removed in v2.0.0
// ℹ️ Migrate to LLMLinguaCompressor for real compression (2-20x)
// ℹ️ Or use AdaptiveCompressor for automatic strategy selection
// ℹ️ See: https://github.com/clarity-chat/token-optimization/blob/main/MIGRATION.md
```

### Suppressing Warnings

If you're in the process of migrating and want to suppress warnings temporarily:

```typescript
// Set environment variable
process.env.SUPPRESS_DEPRECATION_WARNINGS = 'true'

// Or configure logger
import { Logger } from '@clarity-chat/token-optimization'
const logger = new Logger({
  logLevel: 'error', // Only show errors, not warnings
})
```

**Note:** We recommend addressing deprecations rather than suppressing warnings, as deprecated APIs will be removed in v2.0.0.

---

## Compression Strategy Selection Guide
