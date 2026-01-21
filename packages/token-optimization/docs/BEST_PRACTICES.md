# Best Practices for Production

This guide covers production-ready patterns and best practices for using
`@clarity-chat/token-optimization` at scale.

## Table of Contents

- [Provider Caching](#provider-caching)
- [Performance Optimization](#performance-optimization)
- [Security](#security)
- [Error Handling](#error-handling)
- [Monitoring & Observability](#monitoring--observability)
- [Cost Optimization](#cost-optimization)
- [React Patterns](#react-patterns)
- [Node.js Patterns](#nodejs-patterns)

## Provider Caching

### 1. Mark Static Content as Cacheable

Always explicitly mark static content to maximize cache hit rates:

```typescript
const messages = [
  {
    role: 'system',
    content: largeSystemPrompt,
    cacheable: true, // ✓ Static, mark as cacheable
  },
  {
    role: 'user',
    content: dynamicUserQuery,
    cacheable: false, // ✓ Dynamic, don't cache
  },
]
```

### 2. Ensure Minimum Token Threshold

All providers require ≥1024 tokens for caching. Check before applying:

```typescript
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

// Check eligibility first
const estimate = await estimateCacheSavings(messages, 'anthropic')

if (!estimate.eligible) {
  console.warn(estimate.recommendation)
  // Consider: concatenating messages or adding more context
}
```

### 3. Use Appropriate TTL

Match cache TTL to your use case:

```typescript
import { createProviderCache } from '@clarity-chat/token-optimization'

// Short sessions (quick Q&A)
const shortCache = createProviderCache({
  provider: 'anthropic',
  // Uses default 5m TTL
})

// Long sessions (document analysis)
const cache = new ProviderCachingManager({
  provider: 'anthropic',
  anthropic: {
    defaultTTL: '1h', // Longer TTL for extended sessions
  },
})
```

### 4. Monitor Cache Performance

Track savings to optimize further:

```typescript
const result = await anthropicCache(messages)

if (result.cached) {
  console.log('Cache Performance:', {
    cachedTokens: result.metadata.cachedTokens,
    savingsPercent: result.estimatedSavings.percentage * 100,
    costReduction: result.estimatedSavings.costReduction,
  })
}

// Log recommendations for improvement
result.recommendations.forEach((rec) => console.log(`💡 ${rec}`))
```

## Performance Optimization

### 1. Use Debouncing in React

Prevent excessive re-renders with debouncing:

```tsx
const { count } = useTokenCount(text, {
  debounceMs: 300, // Wait 300ms after user stops typing
})
```

### 2. Batch Operations

Process multiple texts efficiently:

```typescript
import { countTokensBatch } from '@clarity-chat/token-optimization'

// ✓ Efficient: Single operation
const counts = countTokensBatch(texts)

// ✗ Inefficient: Multiple operations
const counts = texts.map((text) => countTokens(text))
```

### 3. Enable Caching for Repeated Strings

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  enableCaching: true, // Cache repeated strings
  cacheSize: 10000, // Adjust based on use case
})
```

### 4. Use Presets for Common Scenarios

```typescript
import { createOptimizer } from '@clarity-chat/token-optimization'

// Development: Fast, minimal resources
const dev = createOptimizer({ preset: 'minimal' })

// Production: Balanced performance
const prod = createOptimizer({ preset: 'standard' })

// Enterprise: Maximum performance
const enterprise = createOptimizer({ preset: 'enterprise' })
```

## Security

### 1. Enable Security Manager

Protect against prompt injection and data exfiltration:

```typescript
import { TokenSecurityManager } from '@clarity-chat/token-optimization'

const security = new TokenSecurityManager({
  enablePromptInjectionDetection: true,
  enablePIIDetection: true,
  enableCompressionRatioObfuscation: true,
  protectionLevel: 'standard', // or 'government' for stricter
})

const result = await security.sanitizeAndProtect(userInput, {
  type: 'user_prompt',
})

if (!result.allowed) {
  throw new Error('Security violation detected')
}
```

### 2. Validate All User Input

```typescript
import { ValidationError } from '@clarity-chat/token-optimization'

function processPrompt(text: string) {
  // Validate length
  if (text.length > 100000) {
    throw new ValidationError('Input too long', { max: 100000, actual: text.length })
  }

  // Validate token count
  const count = countTokens(text)
  if (count > 8000) {
    throw new ValidationError('Token count exceeds limit', { max: 8000, actual: count })
  }

  return count
}
```

### 3. Redact Sensitive Information

```typescript
const result = await security.sanitizeAndProtect(userInput, {
  redactPII: true,
  redactPatterns: [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{16}\b/, // Credit cards
  ],
})

console.log(result.sanitized) // PII redacted
```

## Error Handling

### 1. Use Typed Errors

All errors include error codes for programmatic handling:

```typescript
import {
  UnsupportedModelError,
  TokenBudgetExceededError,
  SecurityViolationError,
} from '@clarity-chat/token-optimization'

try {
  const count = countTokens(text, { model: 'unknown-model' })
} catch (error) {
  if (error instanceof UnsupportedModelError) {
    // Handle unsupported model
    console.error('Use a supported model:', error.suggestion)
  } else if (error instanceof TokenBudgetExceededError) {
    // Handle budget exceeded
    console.error('Reduce prompt size')
  }
}
```

### 2. Implement Retry Logic

Use built-in retry utilities for transient failures:

```typescript
import { withRetry } from '@clarity-chat/token-optimization'

const result = await withRetry(() => compressionEngine.compress(text), {
  maxAttempts: 3,
  initialDelay: 1000,
  backoffMultiplier: 2,
  retryableErrors: ['NETWORK_ERROR', 'TIMEOUT'],
})
```

### 3. Set Timeouts

Prevent hanging operations:

```typescript
import { withTimeout } from '@clarity-chat/token-optimization'

const result = await withTimeout(
  () => heavyOperation(),
  5000 // 5 second timeout
)
```

## Monitoring & Observability

### 1. Enable Metrics Collection

```typescript
import { MetricsCollector } from '@clarity-chat/token-optimization'

const metrics = new MetricsCollector({
  enabled: true,
  flushInterval: 60000, // Flush every minute
})

// Collect custom metrics
metrics.increment('token_count_requests')
metrics.timing('tokenization_duration', duration)
metrics.gauge('active_sessions', sessionCount)

// Get metrics snapshot
const snapshot = metrics.getSnapshot()
console.log(snapshot)
```

### 2. Implement Health Checks

```typescript
import { createHealthEndpoint } from '@clarity-chat/token-optimization'

const healthCheck = createHealthEndpoint({
  components: ['cache', 'tokenizer', 'security'],
  timeout: 5000,
})

// Express route
app.get('/health', async (req, res) => {
  const health = await healthCheck()
  res.status(health.healthy ? 200 : 503).json(health)
})
```

### 3. Enable Distributed Tracing

```typescript
import { Tracer } from '@clarity-chat/token-optimization'

const tracer = new Tracer({
  serviceName: 'token-optimization',
  exporterUrl: 'http://localhost:4318/v1/traces',
})

const span = tracer.startSpan('compress_prompt')
try {
  const result = await compress(text)
  span.setStatus({ code: 'OK' })
} catch (error) {
  span.setStatus({ code: 'ERROR', message: error.message })
  throw error
} finally {
  span.end()
}
```

## Cost Optimization

### 1. Use Model Routing

Automatically select the cheapest model that meets quality requirements:

```typescript
import { ModelRouter } from '@clarity-chat/token-optimization'

const router = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .withStrategy('cost-optimized')
  .build()

const { model, cost, reason } = router.route(prompt)
console.log(`Using ${model} - ${reason} - $${cost}`)
```

### 2. Enable Provider Caching

Save 90% on cached tokens:

```typescript
import { createOptimizer } from '@clarity-chat/token-optimization'

const optimizer = createOptimizer({
  preset: 'production',
  enableProviderCaching: true,
  cachingProvider: 'anthropic',
})

const result = await optimizer.optimize(prompt)
// Subsequent calls with similar prompts = 90% cheaper
```

### 3. Compress Before Sending

Reduce token count with compression:

```typescript
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

const result = await compressWithLLMLingua(longDocument, {
  targetRatio: 0.5, // 50% compression
  preserveCode: true,
  preserveUrls: true,
})

console.log('Original:', result.original.tokens)
console.log('Compressed:', result.compressed.tokens)
console.log('Savings:', result.compressionRatio * 100, '%')
```

## React Patterns

### 1. Memoize Expensive Operations

```tsx
import { useMemo } from 'react'
import { useTokenCount } from '@clarity-chat/token-optimization'

function OptimizedComponent({ largeText }: { largeText: string }) {
  // Only recalculate when text changes
  const { count } = useTokenCount(largeText)

  const analysis = useMemo(() => {
    return {
      count,
      costEstimate: count * 0.00001,
      isExpensive: count > 5000,
    }
  }, [count])

  return <div>{analysis.costEstimate}</div>
}
```

### 2. Use Quality Gates

Prevent low-quality compressed output:

```tsx
import { QualityGate } from '@clarity-chat/token-optimization'

function CompressedPrompt() {
  const qualityGate = useMemo(
    () =>
      new QualityGate({
        minQualityScore: 0.8,
        maxCompressionRatio: 0.7,
      }),
    []
  )

  const compress = async (text: string) => {
    const result = await compressor.compress(text)

    const passed = await qualityGate.check(result, {
      originalText: text,
      compressedText: result.output,
    })

    if (!passed.passed) {
      console.error('Quality check failed:', passed.failures)
      return text // Use original
    }

    return result.output
  }
}
```

### 3. Progressive Enhancement

Start simple, add features as needed:

```tsx
// Level 1: Just count
const { count } = useTokenCount(text)

// Level 2: Add budget tracking
const { count, percentage } = useTokenBudget(text, { max: 4096 })

// Level 3: Full optimization
const { result, stats } = useTokenOptimization(text, {
  preset: 'production',
  enableCache: true,
  enableCompression: true,
})
```

## Node.js Patterns

### 1. Use Circuit Breakers

Prevent cascading failures:

```typescript
import { createCircuitBreaker } from '@clarity-chat/token-optimization'

const breaker = createCircuitBreaker({
  failureThreshold: 5,
  resetTimeout: 30000,
  halfOpenRequests: 3,
})

const result = await breaker.execute(async () => {
  return await expensiveOperation()
})
```

### 2. Implement Resource Limits

```typescript
import { createOptimizer } from '@clarity-chat/token-optimization'

const optimizer = createOptimizer({
  maxConcurrency: 10, // Limit concurrent operations
  maxTokensPerRequest: 100000, // Prevent excessive usage
  rateLimitPerMinute: 100, // API rate limiting
})
```

### 3. Use Factory Pattern

Create optimizers per use case:

```typescript
// Fast queries (minimal optimization)
const fastOptimizer = createOptimizer({ preset: 'minimal' })

// Standard queries (balanced)
const standardOptimizer = createOptimizer({ preset: 'standard' })

// Complex queries (maximum optimization)
const complexOptimizer = createOptimizer({
  preset: 'enterprise',
  enableProviderCaching: true,
  enableCompression: true,
})

// Route based on complexity
const optimizer =
  complexity === 'simple'
    ? fastOptimizer
    : complexity === 'complex'
      ? complexOptimizer
      : standardOptimizer
```

## Production Checklist

Before deploying to production, verify:

### Configuration

- [ ] Environment-specific presets configured
- [ ] API keys secured (not in code)
- [ ] Rate limits configured
- [ ] Timeouts set appropriately

### Monitoring

- [ ] Health checks implemented
- [ ] Metrics collection enabled
- [ ] Logging configured
- [ ] Alerts set up

### Security

- [ ] Input validation enabled
- [ ] PII detection configured
- [ ] Prompt injection detection enabled
- [ ] Security audit passed

### Performance

- [ ] Caching strategy implemented
- [ ] Debouncing configured
- [ ] Circuit breakers in place
- [ ] Load testing completed

### Error Handling

- [ ] Retry logic implemented
- [ ] Error tracking configured
- [ ] Fallback strategies defined
- [ ] User-friendly error messages

## Common Pitfalls

### 1. ✗ Not Using Provider Caching

```typescript
// ✗ Bad: Missing 90% cost savings
const response = await anthropic.messages.create({
  messages: [
    { role: 'system', content: largePrompt },
    { role: 'user', content: query },
  ],
})

// ✓ Good: 90% savings on cached tokens
const cached = await anthropicCache([
  { role: 'system', content: largePrompt, cacheable: true },
  { role: 'user', content: query },
])
const response = await anthropic.messages.create({
  messages: cached.messages,
})
```

### 2. ✗ Excessive Re-renders in React

```tsx
// ✗ Bad: Counts on every render
function Component({ text }) {
  const count = countTokens(text) // Runs on every render!
  return <div>{count}</div>
}

// ✓ Good: Uses hook with debouncing
function Component({ text }) {
  const { count } = useTokenCount(text, { debounceMs: 300 })
  return <div>{count}</div>
}
```

### 3. ✗ Ignoring Error Types

```typescript
// ✗ Bad: Generic error handling
try {
  const count = countTokens(text)
} catch (error) {
  console.error('Error:', error) // What kind of error?
}

// ✓ Good: Typed error handling
try {
  const count = countTokens(text)
} catch (error) {
  if (error instanceof TokenBudgetExceededError) {
    // Specific handling for budget errors
    notifyUser('Please shorten your prompt')
  } else if (error instanceof UnsupportedModelError) {
    // Specific handling for model errors
    fallbackToDefaultModel()
  }
}
```

## Performance Benchmarks

Expected performance on typical hardware:

| Operation                | Time     | Throughput      |
| ------------------------ | -------- | --------------- |
| Token count (100 chars)  | <0.1ms   | >10K ops/sec    |
| Token count (1K chars)   | <1ms     | >1K ops/sec     |
| Batch count (100 items)  | <10ms    | >10K items/sec  |
| Provider cache check     | <5ms     | >200 ops/sec    |
| Compression (10K tokens) | 50-200ms | 50-200 docs/sec |

## Further Reading

- [Provider Caching Guide](./PROVIDER_CACHING.md) - Complete caching reference
- [API Reference](./API_REFERENCE.md) - Full API documentation
- [Troubleshooting](./TROUBLESHOOTING.md) - Common issues and solutions
- [Examples](../examples/) - Real-world code examples

## Support

Need help? Check:

- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [GitHub Issues](https://github.com/clarity-ai/token-optimization/issues)
- [Examples Directory](../examples/)
