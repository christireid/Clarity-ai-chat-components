# Provider-Native Prompt Caching

Achieve up to **90% cost reduction** on cached tokens with provider-native caching from Anthropic,
OpenAI, and Google Gemini.

## Table of Contents

- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Supported Providers](#supported-providers)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Simple API (Recommended)

The simplest way to get started with provider caching:

```typescript
import { quickCache } from '@clarity-chat/token-optimization'

// Anthropic (default)
const result = await quickCache([
  {
    role: 'system',
    content: 'You are a helpful coding assistant with expertise in TypeScript...',
  },
  {
    role: 'user',
    content: 'How do I create a React component?',
  },
])

// Use result.messages in your API call to Anthropic
// Check result.estimatedSavings for potential cost reduction
```

### Provider-Specific Functions

```typescript
import { anthropicCache, openaiCache, googleCache } from '@clarity-chat/token-optimization'

// Anthropic Claude
const anthropicResult = await anthropicCache(messages)

// OpenAI GPT
const openaiResult = await openaiCache(messages)

// Google Gemini
const geminiResult = await googleCache(messages)
```

### Advanced Configuration

```typescript
import { createProviderCache } from '@clarity-chat/token-optimization'

const cache = createProviderCache({
  provider: 'anthropic',
  minTokens: 2048, // Higher threshold
  autoSelectProvider: true, // Automatically choose best provider
})

const result = await cache(messages)
```

## How It Works

Provider caching leverages built-in caching features from LLM providers:

1. **Anthropic**: Inserts `cache_control` breakpoints in messages
2. **OpenAI**: Automatically caches prompts ≥1024 tokens
3. **Google**: Uses implicit/explicit caching modes

### Cost Savings

All providers offer **90% cost reduction** on cached tokens:

- **Without caching**: 1000 cached tokens × $0.01/1K = $0.01
- **With caching**: 1000 cached tokens × $0.001/1K = $0.001
- **Savings**: 90% reduction

## Supported Providers

### Anthropic Claude

**Features:**

- Manual cache control with `cache_control` breakpoints
- Up to 4 cache breakpoints per request
- Minimum 1024 tokens per cached block
- TTL: 5 minutes or 1 hour

**Best for**: Structured prompts with static system instructions

```typescript
import { ProviderCachingManager } from '@clarity-chat/token-optimization'

const manager = new ProviderCachingManager({
  enabled: true,
  provider: 'anthropic',
  anthropic: {
    minCachedTokens: 1024,
    maxBreakpoints: 4,
    defaultTTL: '5m',
    autoDetectBreakpoints: true,
  },
})

const result = await manager.applyCaching(messages)
```

### OpenAI GPT

**Features:**

- Automatic caching for prompts ≥1024 tokens
- No explicit cache control needed
- Message order optimization

**Best for**: Large context windows and conversation history

```typescript
const manager = new ProviderCachingManager({
  enabled: true,
  provider: 'openai',
  openai: {
    optimizeMessageOrder: true,
    retention: 'in_memory',
  },
})
```

### Google Gemini

**Features:**

- Implicit mode: Automatic caching like OpenAI
- Explicit mode: Manual cache creation with IDs
- Flexible TTL configuration

**Best for**: Long-running sessions with explicit cache management

```typescript
// Implicit mode (automatic)
const manager = new ProviderCachingManager({
  enabled: true,
  provider: 'google',
  google: {
    mode: 'implicit',
    autoCreateCache: true,
  },
})

// Explicit mode (manual cache IDs)
const manager = new ProviderCachingManager({
  enabled: true,
  provider: 'google',
  google: {
    mode: 'explicit',
    cacheId: 'my-cache-123',
    defaultTTL: '7200s',
  },
})
```

## API Reference

### Simple API

#### `quickCache(messages, provider?)`

Zero-config provider caching.

```typescript
quickCache(
  messages: CacheableMessage[],
  provider?: 'anthropic' | 'openai' | 'google'
): Promise<ProviderCachingResult>
```

#### `createProviderCache(config?)`

Create a reusable caching function with custom configuration.

```typescript
createProviderCache(
  config?: SimpleProviderCachingConfig
): (messages: CacheableMessage[]) => Promise<ProviderCachingResult>
```

#### `estimateCacheSavings(messages, provider?)`

Estimate potential savings before applying caching.

```typescript
estimateCacheSavings(
  messages: CacheableMessage[],
  provider?: 'anthropic' | 'openai' | 'google'
): Promise<{
  eligible: boolean
  estimatedTokens: number
  estimatedSavingsPercent: number
  recommendation: string
}>
```

### Advanced API

#### `ProviderCachingManager`

Full control over provider caching with detailed configuration.

```typescript
class ProviderCachingManager {
  constructor(config: Partial<ProviderCachingConfig>, tokenCounter?: TokenCounter)

  applyCaching(
    messages: CacheableMessage[],
    provider?: CachingProvider
  ): Promise<ProviderCachingResult>

  updateConfig(config: Partial<ProviderCachingConfig>): void
  getConfig(): ProviderCachingConfig
}
```

#### `applyProviderCaching(messages, config?, tokenCounter?)`

Convenience function without creating a manager instance.

```typescript
applyProviderCaching(
  messages: CacheableMessage[],
  config?: Partial<ProviderCachingConfig>,
  tokenCounter?: TokenCounter
): Promise<ProviderCachingResult>
```

## Examples

### Example 1: Chatbot with System Instructions

```typescript
import { anthropicCache } from '@clarity-chat/token-optimization'

const systemPrompt = `
You are an expert TypeScript developer assistant.
[... long system instructions ...]
`.repeat(10) // Make it large enough to cache

const messages = [
  {
    role: 'system',
    content: systemPrompt,
    cacheable: true, // Mark as cacheable
  },
  {
    role: 'user',
    content: 'How do I create a generic function?',
    cacheable: false, // User query changes frequently
  },
]

const result = await anthropicCache(messages)

// Send result.messages to Anthropic API
// Subsequent calls with same system prompt will be 90% cheaper
```

### Example 2: Document Q&A with RAG

```typescript
import { createProviderCache } from '@clarity-chat/token-optimization'

const cache = createProviderCache({ provider: 'openai' })

const documentContext = loadLargeDocument() // e.g., 5000 tokens

const messages = [
  {
    role: 'system',
    content: `You are answering questions about this document:\n\n${documentContext}`,
    cacheable: true,
  },
  {
    role: 'user',
    content: 'What is the main topic?',
  },
]

const result = await cache(messages)

// OpenAI will automatically cache the large document context
// Follow-up questions will reuse the cached context
```

### Example 3: Multi-Turn Conversation

```typescript
import { openaiCache, parseOpenAICacheMetrics } from '@clarity-chat/token-optimization'

let conversationHistory = [{ role: 'system', content: 'You are a helpful assistant.' }]

// Turn 1
conversationHistory.push({
  role: 'user',
  content: 'What is TypeScript?',
})

let result = await openaiCache(conversationHistory)
// ... send to OpenAI, get response

// Turn 2 - system message and previous turns will be cached
conversationHistory.push({
  role: 'assistant',
  content: response1,
})
conversationHistory.push({
  role: 'user',
  content: 'How is it different from JavaScript?',
})

result = await openaiCache(conversationHistory)

// Check cache savings in OpenAI response
const usage = response.usage
const metrics = parseOpenAICacheMetrics(usage)
console.log(`Cache hit rate: ${(metrics.cacheHitRate * 100).toFixed(1)}%`)
console.log(`Cost savings: ${(metrics.costSavings * 100).toFixed(1)}%`)
```

### Example 4: Estimating Savings Before Applying

```typescript
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

const estimate = await estimateCacheSavings(messages, 'anthropic')

if (estimate.eligible) {
  console.log(`✓ Caching enabled`)
  console.log(`  Tokens: ${estimate.estimatedTokens}`)
  console.log(`  Savings: ${estimate.estimatedSavingsPercent}%`)
  console.log(`  ${estimate.recommendation}`)
} else {
  console.log(`✗ Caching not available`)
  console.log(`  ${estimate.recommendation}`)
}
```

### Example 5: Integration with Factory API

```typescript
import { createOptimizer } from '@clarity-chat/token-optimization'

const optimizer = createOptimizer({
  preset: 'production',
  enableProviderCaching: true,
  cachingProvider: 'anthropic',
})

const result = await optimizer.optimize(largePrompt)

if (result.providerCacheMetadata) {
  console.log('Provider caching applied:')
  console.log(`  Provider: ${result.providerCacheMetadata.provider}`)
  console.log(`  Cached tokens: ${result.providerCacheMetadata.cachedTokens}`)
  console.log(`  Savings: ${result.providerCacheMetadata.savingsPercentage * 100}%`)
}
```

## Best Practices

### 1. Mark Static Content as Cacheable

Explicitly mark static content to optimize cache hit rates:

```typescript
const messages = [
  {
    role: 'system',
    content: largeSystemPrompt,
    cacheable: true, // ✓ Static, should be cached
  },
  {
    role: 'user',
    content: dynamicUserQuery,
    cacheable: false, // ✓ Dynamic, don't cache
  },
]
```

### 2. Ensure Minimum Token Threshold

All providers require ≥1024 tokens for caching:

```typescript
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

// Check before applying
const estimate = await estimateCacheSavings(messages)
if (!estimate.eligible) {
  console.warn(estimate.recommendation)
  // Consider: concatenating messages, using smaller provider threshold
}
```

### 3. Use Appropriate TTL

Match TTL to your use case:

```typescript
// Short sessions (e.g., quick Q&A)
anthropic: {
  defaultTTL: '5m',
}

// Long sessions (e.g., document analysis)
anthropic: {
  defaultTTL: '1h',
}
```

### 4. Monitor Cache Performance

Track savings to optimize further:

```typescript
const result = await anthropicCache(messages)

console.log(`Cache applied: ${result.cached}`)
console.log(`Estimated savings:`, result.estimatedSavings)

if (result.recommendations.length > 0) {
  console.log('Recommendations:')
  result.recommendations.forEach((r) => console.log(`  - ${r}`))
}
```

### 5. Choose the Right Provider

- **Anthropic**: Best for structured prompts with clear static sections
- **OpenAI**: Best for large contexts and conversation history
- **Google**: Best for long-running sessions with explicit cache IDs

## Troubleshooting

### Cache Not Applied

**Problem**: `result.cached === false` even with large prompts

**Solutions**:

1. Check token count:
   ```typescript
   const estimate = await estimateCacheSavings(messages)
   console.log(estimate)
   ```
2. Verify message format
3. Check provider-specific requirements

### Low Cache Hit Rate

**Problem**: OpenAI cache metrics show low `cacheHitRate`

**Solutions**:

1. Enable message order optimization:
   ```typescript
   openai: {
     optimizeMessageOrder: true,
   }
   ```
2. Consolidate static messages
3. Increase static content proportion

### TypeScript Errors

**Problem**: Type mismatches with `CacheableMessage`

**Solution**: Ensure messages match the interface:

```typescript
interface CacheableMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | any[]
  cacheable?: boolean
  cacheWeight?: number
}
```

### Provider-Specific Issues

#### Anthropic: "No cache breakpoints added"

**Solution**: Increase content size or lower `minCachedTokens`:

```typescript
anthropic: {
  minCachedTokens: 512, // Lower threshold
}
```

#### OpenAI: "Total prompt is below 1024 tokens"

**Solution**: Combine messages or add more context:

```typescript
const messages = [
  {
    role: 'system',
    content: `${basePrompt}\n\n${additionalContext}`,
  },
]
```

#### Google: "Prompt is below recommended size"

**Solution**: Switch to explicit mode for small prompts:

```typescript
google: {
  mode: 'explicit',
  cacheId: 'my-small-prompt-cache',
}
```

## Performance Metrics

### Cost Reduction

| Scenario                                | Without Caching | With Caching | Savings |
| --------------------------------------- | --------------- | ------------ | ------- |
| System prompt (2K tokens)               | $0.02           | $0.002       | 90%     |
| Document context (10K tokens)           | $0.10           | $0.01        | 90%     |
| Conversation (50K tokens over 10 turns) | $0.50           | $0.05        | 90%     |

### Token Savings

```typescript
// Example: Document Q&A session (10 questions)
// Document: 8000 tokens (cached)
// Questions: 100 tokens each (not cached)

// Without caching:
Total tokens = 8000 * 10 + 100 * 10 = 81,000 tokens

// With caching:
First call = 8000 + 100 = 8,100 tokens
Subsequent 9 calls = (8000 * 0.1 + 100) * 9 = 8,100 tokens
Total tokens = 8,100 + 8,100 = 16,200 tokens

// Savings: 80% token reduction
```

## Further Reading

- [Anthropic Prompt Caching Documentation](https://docs.anthropic.com/claude/docs/prompt-caching)
- [OpenAI Prompt Caching Guide](https://platform.openai.com/docs/guides/prompt-caching)
- [Google Gemini Context Caching](https://ai.google.dev/docs/caching)

## Support

- [GitHub Issues](https://github.com/clarity-ai/token-optimization/issues)
- [Documentation](../README.md)
- [API Reference](./API.md)
