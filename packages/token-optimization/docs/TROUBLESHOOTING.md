# Troubleshooting Guide

Common issues and solutions for `@clarity-chat/token-optimization`.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Token Counting Issues](#token-counting-issues)
- [Provider Caching Issues](#provider-caching-issues)
- [React Hook Issues](#react-hook-issues)
- [Compression Issues](#compression-issues)
- [TypeScript Issues](#typescript-issues)
- [Performance Issues](#performance-issues)
- [Security Issues](#security-issues)

## Installation Issues

### Peer Dependency Warnings

**Problem**: npm/yarn warns about missing React peer dependencies

```
npm WARN @clarity-chat/token-optimization@1.0.0 requires a peer of react@^18.0.0 || ^19.0.0
```

**Solution**: React is optional. If you're using Node.js only:

```bash
npm install @clarity-chat/token-optimization --legacy-peer-deps
```

Or add React as devDependencies if you don't need it at runtime:

```json
{
  "devDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

### Module Not Found

**Problem**: `Cannot find module '@clarity-chat/token-optimization'`

**Solutions**:

1. **Verify installation**:

   ```bash
   npm list @clarity-chat/token-optimization
   ```

2. **Clear cache and reinstall**:

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check imports match exports**:

   ```typescript
   // ✓ Correct
   import { useTokenCount } from '@clarity-chat/token-optimization'
   import { useTokenCount } from '@clarity-chat/token-optimization/react'

   // ✗ Wrong
   import { useTokenCount } from '@clarity-chat/token-optimization/hooks'
   ```

## Token Counting Issues

### Inaccurate Token Counts

**Problem**: Token counts don't match OpenAI's API

**Diagnosis**:

1. Check model:

   ```typescript
   const count = countTokens(text, { model: 'gpt-4o' }) // Specify model
   ```

2. Compare with OpenAI's tokenizer:

   ```typescript
   import { countTokens } from '@clarity-chat/token-optimization'

   const text = 'Hello, world!'
   const ourCount = countTokens(text)

   console.log('Our count:', ourCount)
   console.log('Expected (OpenAI):', 3)
   ```

**Solutions**:

- This package uses `gpt-tokenizer` which is 99%+ accurate
- Small differences (<1%) are acceptable
- For exact OpenAI counts, use their official API

### Special Tokens Not Counted

**Problem**: Special tokens like `<|endoftext|>` aren't counted

**Solution**: Enable special tokens:

```typescript
const count = countTokens(text, {
  includeSpecialTokens: true,
})
```

### Different Models Give Different Counts

**Problem**: Same text has different token counts for different models

**Expected**: This is normal! Different models use different tokenizers:

```typescript
const text = 'Hello, world!'

countTokens(text, { model: 'gpt-4o' }) // 3 tokens
countTokens(text, { model: 'claude-3-5-sonnet' }) // 4 tokens
```

**Solution**: Always count tokens for your specific model.

## Provider Caching Issues

### Cache Not Applied

**Problem**: `result.cached === false` even with large prompts

**Diagnosis**:

```typescript
import { estimateCacheSavings } from '@clarity-chat/token-optimization'

const estimate = await estimateCacheSavings(messages, 'anthropic')
console.log(estimate)
// Check: eligible, estimatedTokens, recommendation
```

**Common causes**:

1. **Below minimum threshold** (need ≥1024 tokens):

   ```typescript
   // Too small - won't be cached
   const messages = [
     { role: 'system', content: 'Short prompt' },
     { role: 'user', content: 'Question' },
   ]
   ```

   **Solution**: Increase content size or combine messages

2. **No cacheable messages**:

   ```typescript
   // Mark static content as cacheable
   const messages = [
     {
       role: 'system',
       content: largePrompt,
       cacheable: true, // ← Add this!
     },
   ]
   ```

3. **Wrong provider**:
   ```typescript
   // Make sure provider matches your API
   const result = await quickCache(messages, 'anthropic') // For Anthropic API
   ```

### Low Cache Hit Rate

**Problem**: OpenAI cache metrics show low `cacheHitRate`

**Diagnosis**:

```typescript
import { parseOpenAICacheMetrics } from '@clarity-chat/token-optimization'

const usage = response.usage
const metrics = parseOpenAICacheMetrics(usage)
console.log('Cache hit rate:', metrics.cacheHitRate * 100, '%')
```

**Solutions**:

1. **Enable message order optimization**:

   ```typescript
   const cache = new ProviderCachingManager({
     provider: 'openai',
     openai: {
       optimizeMessageOrder: true, // Put static content first
     },
   })
   ```

2. **Consolidate static messages**:

   ```typescript
   // ✗ Bad: Multiple small static messages
   const messages = [
     { role: 'system', content: 'Part 1' },
     { role: 'system', content: 'Part 2' },
     { role: 'system', content: 'Part 3' },
   ]

   // ✓ Good: One large static message
   const messages = [
     {
       role: 'system',
       content: 'Part 1\n\nPart 2\n\nPart 3',
       cacheable: true,
     },
   ]
   ```

3. **Increase static content proportion**:
   - Aim for 70%+ static content
   - Move unchanging context to system message

### Anthropic: "No cache breakpoints added"

**Problem**: Caching enabled but no breakpoints inserted

**Diagnosis**:

```typescript
const result = await anthropicCache(messages)
console.log('Breakpoints:', result.metadata.providerDetails?.breakpointCount)
```

**Solutions**:

1. **Lower minimum token threshold**:

   ```typescript
   const cache = new ProviderCachingManager({
     provider: 'anthropic',
     anthropic: {
       minCachedTokens: 512, // Lower from default 1024
     },
   })
   ```

2. **Increase content size**:

   ```typescript
   // Make system prompt larger
   const systemPrompt = basePrompt + '\n\n' + additionalContext
   ```

3. **Check message format**:
   ```typescript
   // Must have string or block array content
   const messages = [
     {
       role: 'system',
       content: 'String content works', // ✓ OK
     },
     {
       role: 'system',
       content: [{ type: 'text', text: 'Block array works' }], // ✓ OK
     },
   ]
   ```

## React Hook Issues

### Hook Called Outside Component

**Problem**: `Error: Hooks can only be called inside a function component`

**Solution**: Ensure hooks are called inside React components:

```tsx
// ✗ Wrong: Hook called outside component
const count = useTokenCount('text')

function Component() {
  return <div>{count}</div>
}

// ✓ Correct: Hook inside component
function Component() {
  const { count } = useTokenCount('text')
  return <div>{count}</div>
}
```

### Excessive Re-renders

**Problem**: Component re-renders too frequently

**Diagnosis**:

```tsx
import { useEffect } from 'react'

function Component({ text }) {
  const { count } = useTokenCount(text)

  useEffect(() => {
    console.log('Rendered with count:', count)
  }, [count])

  return <div>{count}</div>
}
```

**Solutions**:

1. **Increase debounce delay**:

   ```tsx
   const { count } = useTokenCount(text, {
     debounceMs: 500, // Wait longer before counting
   })
   ```

2. **Memoize text input**:

   ```tsx
   import { useMemo } from 'react'

   const memoizedText = useMemo(() => text, [text])
   const { count } = useTokenCount(memoizedText)
   ```

3. **Use callback pattern**:

   ```tsx
   const [count, setCount] = useState(0)

   const handleChange = useCallback((newText: string) => {
     const newCount = countTokens(newText)
     setCount(newCount)
   }, [])
   ```

### State Not Updating

**Problem**: Hook returns stale data

**Solution**: Check dependencies:

```tsx
// ✓ Correct: Text is dependency
const { count } = useTokenCount(text)

// Effect will re-run when text changes
useEffect(() => {
  console.log('New count:', count)
}, [count, text])
```

## Compression Issues

### Quality Threshold Not Met

**Problem**: `QualityThresholdError: Compressed output below minimum quality`

**Diagnosis**:

```typescript
const result = await compressor.compress(text)
console.log('Quality score:', result.qualityMetrics.score)
```

**Solutions**:

1. **Lower quality threshold**:

   ```typescript
   const gate = new QualityGate({
     minQualityScore: 0.7, // Lower from default 0.8
   })
   ```

2. **Use less aggressive compression**:

   ```typescript
   const result = await compressWithLLMLingua(text, {
     targetRatio: 0.7, // 70% instead of 50%
   })
   ```

3. **Preserve important content**:
   ```typescript
   const result = await compressWithLLMLingua(text, {
     preserveCode: true,
     preserveUrls: true,
     preserveStructure: true,
   })
   ```

### Compression Too Slow

**Problem**: Compression takes too long

**Solutions**:

1. **Use faster strategy**:

   ```typescript
   // Use extractive instead of LLMLingua
   const result = await compressExtractively(text, {
     targetTokens: 500,
   })
   ```

2. **Reduce input size**:

   ```typescript
   // Chunk large documents
   const chunks = chunker.chunk(largeText, {
     maxTokens: 2000,
     strategy: 'semantic',
   })

   const compressed = await Promise.all(chunks.map((chunk) => compress(chunk.text)))
   ```

3. **Use adaptive strategy**:
   ```typescript
   const result = await compressAdaptively(text, {
     targetTokens: 500,
     // Automatically picks fastest strategy for content type
   })
   ```

## TypeScript Issues

### Type Errors with Messages

**Problem**: TypeScript errors with message formats

**Solution**: Use correct message interface:

```typescript
import type { CacheableMessage } from '@clarity-chat/token-optimization'

const messages: CacheableMessage[] = [
  {
    role: 'system', // 'system' | 'user' | 'assistant'
    content: 'Text', // string or content block array
    cacheable: true, // optional
    cacheWeight: 1.0, // optional
  },
]
```

### Missing Type Exports

**Problem**: `Cannot find type 'XYZ'`

**Solution**: Import from main package:

```typescript
import type {
  UseTokenCountOptions,
  ProviderCachingResult,
  CompressionResult,
} from '@clarity-chat/token-optimization'
```

### Incompatible Versions

**Problem**: Type errors after updating

**Solution**:

1. Clear TypeScript cache:

   ```bash
   rm -rf node_modules/.cache
   ```

2. Restart TypeScript server (VS Code: Cmd+Shift+P → "Restart TS Server")

3. Check versions match:
   ```bash
   npm list @clarity-chat/token-optimization typescript
   ```

## Performance Issues

### Slow Token Counting

**Problem**: Token counting is slow

**Diagnosis**:

```typescript
const start = performance.now()
const count = countTokens(veryLongText)
const duration = performance.now() - start
console.log('Duration:', duration, 'ms')
```

**Solutions**:

1. **Enable caching**:

   ```typescript
   const counter = new AccurateTokenCounter({
     enableCaching: true,
     cacheSize: 10000,
   })
   ```

2. **Batch operations**:

   ```typescript
   // ✓ Efficient
   const counts = countTokensBatch(texts)

   // ✗ Inefficient
   const counts = texts.map((t) => countTokens(t))
   ```

3. **Use simpler counter for estimates**:

   ```typescript
   import { SimpleTokenCounter } from '@clarity-chat/token-optimization'

   const counter = new SimpleTokenCounter()
   const estimate = counter.count(text) // Fast approximation
   ```

### High Memory Usage

**Problem**: Application uses too much memory

**Solutions**:

1. **Limit cache sizes**:

   ```typescript
   const optimizer = createOptimizer({
     cache: { maxSize: 500 }, // Reduce from default 1000
   })
   ```

2. **Disable caching for one-off operations**:

   ```typescript
   const counter = new AccurateTokenCounter({
     enableCaching: false,
   })
   ```

3. **Clear caches periodically**:
   ```typescript
   // In long-running processes
   setInterval(() => {
     cache.clear()
   }, 3600000) // Clear every hour
   ```

## Security Issues

### Security Violation Errors

**Problem**: `SecurityViolationError` thrown unexpectedly

**Diagnosis**:

```typescript
const result = await security.sanitizeAndProtect(input)
console.log('Violations:', result.violations)
console.log('Risk level:', result.riskLevel)
```

**Solutions**:

1. **Adjust protection level**:

   ```typescript
   const security = new TokenSecurityManager({
     protectionLevel: 'basic', // Less strict
   })
   ```

2. **Whitelist patterns**:

   ```typescript
   const security = new TokenSecurityManager({
     whitelistPatterns: [/^https:\/\/trusted\.com/],
   })
   ```

3. **Disable specific checks**:
   ```typescript
   const security = new TokenSecurityManager({
     enablePromptInjectionDetection: true,
     enablePIIDetection: false, // Disable if causing issues
   })
   ```

### PII False Positives

**Problem**: Legitimate content flagged as PII

**Solution**: Configure PII detection:

```typescript
const result = await security.sanitizeAndProtect(input, {
  redactPII: true,
  piiTypes: ['email', 'phone'], // Only detect specific types
  customPatterns: [
    // Add custom patterns that should NOT be redacted
  ],
})
```

## Getting More Help

If your issue isn't covered here:

1. **Check Examples**: [examples/](../examples/) for working code
2. **Search Issues**: [GitHub Issues](https://github.com/clarity-ai/token-optimization/issues)
3. **Read Docs**:
   - [Getting Started](./GETTING_STARTED.md)
   - [Best Practices](./BEST_PRACTICES.md)
   - [API Reference](./API_REFERENCE.md)
4. **Open Issue**: [New Issue](https://github.com/clarity-ai/token-optimization/issues/new)

When opening an issue, include:

- Package version (`npm list @clarity-chat/token-optimization`)
- Node.js version (`node --version`)
- React version (if using React hooks)
- Minimal reproduction code
- Error messages and stack traces

## Common Error Codes

| Code                        | Meaning                  | Solution                              |
| --------------------------- | ------------------------ | ------------------------------------- |
| `MODEL_NOT_SUPPORTED`       | Unknown model            | Use supported model                   |
| `MODEL_LIMIT_EXCEEDED`      | Too many tokens          | Reduce prompt size                    |
| `COMPRESSION_FAILED`        | Compression error        | Check input format                    |
| `QUALITY_THRESHOLD_NOT_MET` | Quality too low          | Lower threshold or reduce compression |
| `CACHE_CORRUPTED`           | Cache data invalid       | Clear cache                           |
| `BUDGET_EXCEEDED`           | Over token/cost limit    | Increase budget or reduce usage       |
| `SECURITY_VIOLATION`        | Security policy violated | Review input for violations           |
| `INVALID_INPUT`             | Bad input format         | Check input validation                |
| `NETWORK_ERROR`             | Network request failed   | Check connectivity, retry             |
| `TIMEOUT`                   | Operation timed out      | Increase timeout or reduce load       |

## Debug Mode

Enable debug logging for troubleshooting:

```typescript
import { Logger } from '@clarity-chat/token-optimization'

const logger = new Logger({
  level: 'debug', // 'debug' | 'info' | 'warn' | 'error'
})

// Now all operations will log debug information
```

In React:

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

// Check console for debug output
const { count, isLoading, error } = useTokenCount(text, {
  debug: true, // Enable debug mode
})

if (error) {
  console.error('Token counting error:', error)
}
```
