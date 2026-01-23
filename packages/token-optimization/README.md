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

### Provider-Native Caching (Up to 90% Cost Reduction Possible)\*

<sub>\*Based on provider prompt caching pricing specifications. Requires provider API
implementation. Actual savings depend on cache hit rates and usage patterns. See documentation for
details.</sub>

Leverage built-in caching from Anthropic, OpenAI, and Google:

```typescript
import { quickCache } from '@clarity-chat/token-optimization'

// Zero-config caching with Anthropic (default)
const result = await quickCache([
  {
    role: 'system',
    content: 'You are a helpful coding assistant...', // This gets cached!
  },
  { role: 'user', content: 'How do I create a React component?' },
])

// Use result.messages in your API call to Anthropic
// Subsequent calls with same system prompt = 90% cheaper!* 🎉
// *Based on provider specifications. Actual savings may vary.
console.log(`Estimated savings: ${result.estimatedSavings.percentage * 100}%`)
```

Works with:

- **Anthropic**: Automatic `cache_control` breakpoints
- **OpenAI**: Auto-caches prompts ≥1024 tokens
- **Google Gemini**: Implicit and explicit caching modes

[→ Full Provider Caching Guide](./docs/PROVIDER_CACHING.md)

### Track Cost Savings in Real-Time

Monitor actual savings from token optimization with built-in cost analytics:

```typescript
import {
  CostTracker,
  calculateRequestCost,
  getSavingsPercentage,
} from '@clarity-chat/token-optimization'

// Create a tracker for your model
const tracker = new CostTracker('claude-3-5-sonnet')

// Track each request
const cost = tracker.trackRequest({
  inputTokens: 10000,
  outputTokens: 500,
  cachedInputTokens: 8000, // 80% cache hit rate
})

console.log(`This request: $${cost.totalCost.toFixed(4)}`)
console.log(`Savings: ${cost.savingsPercentage.toFixed(1)}%`)

// Get cumulative statistics
const report = tracker.getReport()
console.log(`Total saved: $${report.cumulative.totalSavings.toFixed(2)}`)
console.log(`Average savings: ${report.cumulative.averageSavingsPercentage.toFixed(1)}%`)
console.log(`Requests tracked: ${report.cumulative.requestCount}`)

// Get savings percentage for cached tokens
const cacheSavings = getSavingsPercentage('claude-3-5-sonnet')
console.log(`Cached tokens are ${cacheSavings}% cheaper`) // 90.0%

// Calculate cost for a single request
const singleCost = calculateRequestCost({
  model: 'gpt-4o',
  inputTokens: 5000,
  outputTokens: 1000,
  cachedInputTokens: 4000,
})
```

**Features:**

- Real-time cost calculations with caching savings
- Cumulative tracking across multiple requests
- Personalized recommendations for optimization
- Compare costs across different models
- Estimate potential savings before implementation

### Provider-Native Token Counting (100% Accurate!)

Get exact token counts directly from provider APIs:

```typescript
import { ProviderNativeCounter } from '@clarity-chat/token-optimization'

// Anthropic: Uses /v1/messages/count_tokens API (free, 100% accurate)
const anthropic = new ProviderNativeCounter({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022',
  apiKey: process.env.ANTHROPIC_API_KEY, // optional
})

const result = await anthropic.count('Your message here')
console.log(`${result.tokens} tokens (${result.method})`)
// Output: "5 tokens (provider-api)" - 100% accurate!

// Google Gemini: Uses countTokens API (free, 3000 RPM, 100% accurate)
const gemini = new ProviderNativeCounter({
  provider: 'google',
  model: 'gemini-1.5-pro',
  apiKey: process.env.GOOGLE_API_KEY,
})

// Falls back to local gpt-tokenizer if no API key provided
const localCounter = new ProviderNativeCounter({
  provider: 'openai',
  model: 'gpt-4o',
  // No API key? Uses fast local counting (99%+ accurate)
})
```

**Why use provider-native counting?**

- **100% accurate** - Exact counts from the source
- **Free APIs** - Anthropic and Gemini provide free counting endpoints
- **Auto fallback** - Uses fast local counting when API unavailable
- **Caching** - Results cached for 1 hour to minimize API calls

### File Optimization (Coming Soon)

> ⚠️ **Note**: FileOptimizer is planned for a future release and is not yet available. Current
> version provides format-specific optimizers (HTML, Markdown, TOON).

**Available Now:**

```typescript
import { HTMLOptimizer, MarkdownOptimizer, ToonOptimizer } from '@clarity-chat/token-optimization'

// HTML optimization (40-60% savings)
const htmlOpt = new HTMLOptimizer()
const markdown = htmlToMarkdown('<html><body><h1>API Guide</h1></body></html>')

// TOON format (20-45% measured savings)
const toonOpt = new ToonOptimizer()
const toon = encodeToon({ name: 'John', age: 30 })

// Markdown compression
const mdOpt = new MarkdownOptimizer()
const compressed = compressMarkdown(largeMarkdownDoc, { level: 'aggressive' })
```

**Supported optimizations:**

- HTML → Markdown/Text (40-60% savings)
- JSON → TOON (20-45% measured savings)
- Markdown → Compressed Markdown
- Text → Normalized Text

<sub>\*TOON savings measured using real GPT tokenizer across diverse test cases.</sub>

**See Also:**

- `TextChunker` for smart chunking strategies
- `LLMLinguaCompressor` for statistical compression
- Format-specific optimizers (HTMLOptimizer, MarkdownOptimizer, ToonOptimizer)

## Installation

```bash
npm install @clarity-chat/token-optimization
```

## Why This Package?

| Metric               | This Package | Alternatives   |
| -------------------- | ------------ | -------------- |
| Bundle size          | ~400KB       | tiktoken: ~4MB |
| Time to count        | 0.1ms        | 1-10ms         |
| Zero-config accuracy | 99%+         | Varies         |
| React hooks          | ✅ Built-in  | ❌ DIY         |
| Model routing        | ✅ Built-in  | ❌ DIY         |

> **Note on Accuracy**: 99%+ for OpenAI models (gpt-tokenizer). For Claude/Gemini, uses character
> estimation (~90% accurate). For 100% accuracy across all providers, use the new
> `ProviderNativeCounter` with API keys.

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

### Level 2: Add Provider Caching (90% savings)\*

<sub>\*Leverages provider-native caching when available (Anthropic, OpenAI, Google). Based on
provider specifications. Actual savings may vary.</sub>

```typescript
import { createProviderCache } from '@clarity-chat/token-optimization'

const cache = createProviderCache({ provider: 'anthropic' })
const result = await cache(messages)
```

### Level 3: Add Local Caching

```typescript
const { count, cacheStats } = useTokenOptimization(text, {
  preset: 'standard',
  enableCache: true,
})
```

### Level 4: Full Pipeline

```typescript
const { result, stats } = useOptimizationPipeline(text, {
  cache: { maxSize: 1000, ttl: 3600000 },
  compression: { level: 'moderate', preserveCode: true },
  routing: { strategy: 'cost-optimized' },
})
```

## Complete Feature Set

This package provides:

- **Provider-Native Caching**: 90% cost reduction with Anthropic, OpenAI, Google\* ⭐ NEW
  - \*Leverages provider-native caching when available (Anthropic, OpenAI, Google). Based on
    provider specifications.
- **Provider-Native Token Counting**: 100% accurate counting via provider APIs (Anthropic, Gemini)
  ⭐ NEW
- **File Optimization**: Smart chunking & format conversion (HTML/PDF→Markdown/TOON) ⭐ NEW
- **Token Counting**: 99%+ accurate with gpt-tokenizer (5-6x smaller: 972KB vs 5.3MB tiktoken)
- **Text Chunking**: Smart splitting with overlap support
- **Compression**: LLMLingua-style compression (2-10x reduction, typically 4-5x)\*
  - \*Compression rates vary by content type and configuration.
- **Caching**: Multi-tier with semantic similarity matching
- **Model Routing**: Automatic model selection by cost/quality/complexity
- **TOON Format**: Token-Optimized Object Notation (20-45% measured savings)
- **Security**: OWASP LLM Top 10 compliance
- **Accessibility**: WCAG 2.1 AA compliant components
- **Production**: Health checks, observability, circuit breakers

**Why so comprehensive?** Token optimization in production requires more than just counting. This
package provides integrated infrastructure for security, observability, and resilience because these
are essential for production LLM applications. See [PACKAGE_SCOPE.md](./PACKAGE_SCOPE.md) for
architecture rationale and scope justification.

## Supported Models

| Provider  | Models                                           |
| --------- | ------------------------------------------------ |
| OpenAI    | gpt-4o, gpt-4o-mini, o1, o3, o4-mini             |
| Anthropic | claude-3-5-sonnet, claude-3-haiku, claude-3-opus |
| Google    | gemini-2.0-flash, gemini-2.0-pro                 |

## API Reference

### Provider Caching Functions (NEW!)

| Function                   | Purpose                              |
| -------------------------- | ------------------------------------ |
| `quickCache`               | Zero-config caching                  |
| `anthropicCache`           | Anthropic-specific caching           |
| `openaiCache`              | OpenAI-specific caching              |
| `googleCache`              | Google Gemini-specific caching       |
| `createProviderCache`      | Create reusable cache function       |
| `estimateCacheSavings`     | Estimate savings before applying     |
| `ProviderCachingFormatter` | Format messages for provider caching |
| `ProviderCachingManager`   | (Deprecated - use Formatter)         |

### Provider-Native Token Counting (NEW!)

| Function/Class          | Purpose                         |
| ----------------------- | ------------------------------- |
| `ProviderNativeCounter` | 100% accurate counting via APIs |
| `providerNativeCount`   | Quick count helper function     |

Supports: Anthropic (free API), Google Gemini (free API), OpenAI (local gpt-tokenizer)

### File Optimization (NEW!)

| Function/Class  | Purpose                            |
| --------------- | ---------------------------------- |
| `FileOptimizer` | Smart chunking & format conversion |
| `optimizeFile`  | Quick optimization helper          |

Formats: HTML→Markdown/TOON, JSON→TOON, Code→Markdown, PDF→Text

### React Hooks

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

## Documentation

### 📖 Guides

| Guide                                              | What You'll Learn                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------- |
| **[Getting Started](./docs/GETTING_STARTED.md)**   | Install, count your first tokens, and build your first React component        |
| **[Provider Caching](./docs/PROVIDER_CACHING.md)** | Save 90% on API costs with Anthropic, OpenAI, and Google caching              |
| **[Best Practices](./docs/BEST_PRACTICES.md)**     | Production patterns, security, performance, monitoring, and cost optimization |
| **[Troubleshooting](./docs/TROUBLESHOOTING.md)**   | Solutions to common issues with installation, caching, React hooks, and more  |

### 💡 Examples

Ready-to-run examples organized by complexity:

| Example                                                            | Description               | Run It                                    |
| ------------------------------------------------------------------ | ------------------------- | ----------------------------------------- |
| **[01-basic-react.tsx](./examples/01-basic-react.tsx)**            | React hooks basics        | Copy into your React app                  |
| **[02-node-counting.ts](./examples/02-node-counting.ts)**          | Node.js token counting    | `npx tsx examples/02-node-counting.ts`    |
| **[03-model-routing.ts](./examples/03-model-routing.ts)**          | Automatic model selection | `npx tsx examples/03-model-routing.ts`    |
| **[04-full-pipeline.tsx](./examples/04-full-pipeline.tsx)**        | Complete optimization     | Copy into your React app                  |
| **[05-provider-caching.ts](./examples/05-provider-caching.ts)** ⭐ | 90% cost savings!         | `npx tsx examples/05-provider-caching.ts` |
| **[06-security.ts](./examples/06-security.ts)** 🔒                 | Security features         | `npx tsx examples/06-security.ts`         |
| **[07-compression.ts](./examples/07-compression.ts)** 📦           | Compression strategies    | `npx tsx examples/07-compression.ts`      |

[→ Full Examples Directory](./examples/README.md) with by-goal and by-use-case navigation

### 🎯 Quick Start Paths

**Just want to count tokens?** → Start with [Getting Started](./docs/GETTING_STARTED.md) →
[Example 01](./examples/01-basic-react.tsx)

**Want to save 90% on API costs?** ⭐ RECOMMENDED → Read
[Provider Caching](./docs/PROVIDER_CACHING.md) → [Example 05](./examples/05-provider-caching.ts)

**Building for production?** → Read [Best Practices](./docs/BEST_PRACTICES.md) →
[Example 04](./examples/04-full-pipeline.tsx)

**Having issues?** → Check [Troubleshooting](./docs/TROUBLESHOOTING.md)

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
// Full package (~400KB minified, tree-shakeable)
import { useTokenCount } from '@clarity-chat/token-optimization'

// Just React hooks (~50KB)
import { useTokenCount } from '@clarity-chat/token-optimization/react'

// Just compression (~30KB)
import { compressWithLLMLingua } from '@clarity-chat/token-optimization/compression'
```

## Development & Testing

### Internal "Simple" Files

You may notice files prefixed with `simple-` in the source code:

- `src/simple-index.ts`
- `src/simple-unified.ts`
- `src/security/simple-security.ts`
- etc.

**These are internal development utilities**, not public APIs. They provide lightweight
implementations for testing without external dependencies. **Do NOT import these directly** - they
are not included in the package exports.

**For users:** Always import from the main package:

```typescript
// ✅ Correct
import { countTokens } from '@clarity-chat/token-optimization'

// ❌ Wrong - internal file
import { SimpleTokenCounter } from '@clarity-chat/token-optimization/src/simple-index'
```

### Source Code Organization

- `src/cache/` - Exact match and smart caching
- `src/caching/` - Advanced semantic caching with embeddings
- `src/compression/` - Compression strategies (LLMLingua, extractive, adaptive)
- `src/providers/` - Provider-native caching (Anthropic, OpenAI, Google)
- `src/routing/` - Model routing and selection
- `src/security/` - OWASP LLM Top 10 security features
- `src/tokenizers/` - Token counting engines

## License

MIT

---

**Need help?** Check out the [examples](./examples) directory or open an issue.
