# @clarity-chat/token-optimization

Count and optimize LLM tokens in **under 5 lines**:

```typescript
import { useTokenCount } from '@clarity-chat/token-optimization'

const { count, isLoading } = useTokenCount(text)
```

That's it. Works with GPT-4o, Claude, Gemini - zero configuration needed.

## Quick Examples

### React: Show Token Count

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function TokenCounter({ text }) {
  const { count, isLoading, info } = useTokenCount(text)

  return (
    <div>
      <span>{isLoading ? '...' : count} tokens</span>
      <small>
        {info.words} words • {info.characters} chars
      </small>
    </div>
  )
}
```

### React: Warn at Token Limit

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function PromptEditor({ maxTokens = 4096 }) {
  const [text, setText] = useState('')
  const { count } = useTokenCount(text)
  const isOverLimit = count > maxTokens

  return (
    <div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />
      <span style={{ color: isOverLimit ? 'red' : 'inherit' }}>
        {count} / {maxTokens} tokens
      </span>
    </div>
  )
}
```

### Node.js: Count Tokens

```typescript
import { countTokens, DEFAULTS } from '@clarity-chat/token-optimization'

// Zero-config: uses gpt-4o by default
const count = countTokens('Hello, world!')
console.log(`${count} tokens (using ${DEFAULTS.model})`)

// Or specify a model
const claudeCount = countTokens('Hello, world!', { model: 'claude-3-5-sonnet' })
```

### Route to Optimal Model

```typescript
import { ModelRouter } from '@clarity-chat/token-optimization'

// One line: get a router with all major providers
const router = ModelRouter.default()

// Or build a custom router
const router = ModelRouter.builder()
  .useOpenAIModels()
  .useClaudeModels()
  .withStrategy('cost-optimized')
  .build()

const { model, cost, reason } = router.route(prompt)
console.log(`Use ${model} - ${reason}`)
```

## Installation

```bash
npm install @clarity-chat/token-optimization
```

## Why This Package?

| Metric               | This Package | Alternatives   |
| -------------------- | ------------ | -------------- |
| Bundle size          | ~200KB       | tiktoken: ~4MB |
| Time to count        | 0.1ms        | 1-10ms         |
| Zero-config accuracy | 99%+         | Varies         |
| React hooks          | ✅ Built-in  | ❌ DIY         |
| Model routing        | ✅ Built-in  | ❌ DIY         |

## Sensible Defaults

Everything works out of the box. Here's what you get:

```typescript
import { DEFAULTS } from '@clarity-chat/token-optimization'

DEFAULTS.model // 'gpt-4o' - most commonly used
DEFAULTS.debounceMs // 150 - responsive but efficient
DEFAULTS.maxCacheSize // 1000 - balances memory vs hit rate
DEFAULTS.cacheTtlMs // 3600000 - 1 hour cache
```

Override only what you need:

```typescript
const { count } = useTokenCount(text, {
  model: 'claude-3-5-sonnet', // Override model
  debounceMs: 300, // Slower debounce for heavy typing
})
```

## Presets

Start with a preset, customize later:

```typescript
import { createOptimizer } from '@clarity-chat/token-optimization'

// Development: fast, minimal resources
const dev = createOptimizer({ preset: 'minimal' })

// Production: balanced performance (recommended)
const prod = createOptimizer({ preset: 'standard' })

// Enterprise: maximum performance
const enterprise = createOptimizer({ preset: 'enterprise' })
```

## Error Messages That Help

Errors tell you **what went wrong**, **why**, and **how to fix it**:

```typescript
import { UnsupportedModelError } from '@clarity-chat/token-optimization'

// If you use an unknown model, you get:
// ❌ UnsupportedModelError [TOKEN_UNSUPPORTED_MODEL]
//    Model "gpt-5-turbo" is not supported.
//
// 💡 Suggestion: Use one of: gpt-4o, gpt-4o-mini, claude-3-5-sonnet, ...
// 📚 Docs: https://clarity-chat.dev/docs/supported-models
```

## Progressive Complexity

### Level 1: Just Count Tokens

```typescript
const { count } = useTokenCount(text)
```

### Level 2: Add Caching

```typescript
const { count, cacheStats } = useTokenOptimization(text, {
  preset: 'standard',
  enableCache: true,
})
```

### Level 3: Full Pipeline

```typescript
const { result, stats } = useOptimizationPipeline(text, {
  cache: { maxSize: 1000, ttl: 3600000 },
  compression: { level: 'moderate', preserveCode: true },
  routing: { strategy: 'cost-optimized' },
})
```

## Complete Feature Set

This package provides:

- **Token Counting**: 99%+ accurate with gpt-tokenizer (20x smaller than tiktoken)
- **Text Chunking**: Smart splitting with overlap support
- **Compression**: LLMLingua-style compression (up to 20x reduction)
- **Caching**: Multi-tier with semantic similarity matching
- **Model Routing**: Automatic model selection by cost/quality/complexity
- **TOON Format**: Token-Optimized Object Notation (40-60% savings)
- **Security**: OWASP LLM Top 10 compliance
- **Accessibility**: WCAG 2.1 AA compliant components
- **Production**: Health checks, observability, circuit breakers

## Supported Models

| Provider  | Models                                           |
| --------- | ------------------------------------------------ |
| OpenAI    | gpt-4o, gpt-4o-mini, o1, o3, o4-mini             |
| Anthropic | claude-3-5-sonnet, claude-3-haiku, claude-3-opus |
| Google    | gemini-2.0-flash, gemini-2.0-pro                 |

## API Reference

### Hooks

| Hook                      | Purpose                | Complexity |
| ------------------------- | ---------------------- | ---------- |
| `useTokenCount`           | Count tokens           | Simple     |
| `useTokenBudget`          | Track against limit    | Simple     |
| `useModelRouter`          | Route to optimal model | Medium     |
| `useTieredCache`          | Cache optimization     | Medium     |
| `useTokenOptimization`    | All-in-one             | Full       |
| `useOptimizationPipeline` | Full pipeline control  | Advanced   |

### Classes

| Class                  | Purpose                       |
| ---------------------- | ----------------------------- |
| `AccurateTokenCounter` | Precise token counting        |
| `ModelRouter`          | Route prompts to models       |
| `ModelRouterBuilder`   | Build custom routers          |
| `TieredCache`          | Multi-level caching           |
| `LLMLinguaCompressor`  | Statistical compression       |
| `QualityGate`          | Quality threshold enforcement |

### Error Types

| Error                      | When                    |
| -------------------------- | ----------------------- |
| `UnsupportedModelError`    | Unknown model specified |
| `TokenBudgetExceededError` | Prompt exceeds limit    |
| `ValidationError`          | Invalid configuration   |
| `CacheError`               | Cache operation failed  |
| `CompressionError`         | Compression failed      |
| `QualityThresholdError`    | Quality below minimum   |
| `SecurityViolationError`   | Security rule triggered |

## TypeScript

Full TypeScript support with exported types:

```typescript
import type {
  UseTokenCountOptions,
  UseTokenCountReturn,
  ModelConfig,
  RoutingResult,
} from '@clarity-chat/token-optimization'
```

## Bundle Size

Tree-shakeable subpath exports:

```typescript
// Full package (~200KB)
import { useTokenCount } from '@clarity-chat/token-optimization'

// Just React hooks (~50KB)
import { useTokenCount } from '@clarity-chat/token-optimization/react'

// Just compression (~30KB)
import { compressWithLLMLingua } from '@clarity-chat/token-optimization/compression'
```

## License

MIT

---

**Need help?** Check out the [examples](./examples) directory or open an issue.
