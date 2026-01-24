# Token Optimization System

> **Important:** This documentation describes the canonical token optimization APIs located in `@clarity-chat/token-optimization`. The React package re-exports these for convenience, but the source of truth is the token-optimization package.

Comprehensive token management utilities for LLM applications, providing accurate counting, cost estimation, and budget monitoring.

## Quick Start

### Recommended: Import from Token Optimization Package

```typescript
import {
  // Token counting (canonical implementation)
  AccurateTokenCounter,

  // Convenience functions
  countTokens,
  estimateTokens,

  // Budget monitoring
  useTokenBudgetMonitor,
  createModelBudgetMonitor,

  // Cost estimation
  calculateCost,
  estimateTokenCost,

  // Model registry
  MODEL_REGISTRY,
  isValidModelId,

  // Compression
  LLMLinguaCompressor,
  AdaptiveCompressor,
  compressAdaptively,
} from '@clarity-chat/token-optimization'
```

### Alternative: Import from React Package (Re-exports)

```typescript
import {
  // Re-exported from @clarity-chat/token-optimization
  AccurateTokenCounter,
  useTokenBudgetMonitor,
  calculateCost,
} from '@clarity-chat/react'
```

> **Note:** Importing from `@clarity-chat/token-optimization` is recommended for better tree-shaking and explicit dependency management.

## Features

### 1. Token Counting

#### Canonical Implementation: AccurateTokenCounter

The `AccurateTokenCounter` is the canonical implementation for token counting:

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  enableCaching: true,
})

// Count tokens
const count = counter.count('Hello, world!')
// 4

// Count message tokens (includes message formatting overhead)
const messageTokens = counter.countMessages([
  { role: 'user', content: 'Hello, world!' }
])
```

#### Convenience Functions

For simpler use cases:

```typescript
import { countTokens, estimateTokens } from '@clarity-chat/token-optimization'

// Accurate counting (uses tiktoken)
const count = await countTokens('Hello, world!', { model: 'gpt-4o' })
// { total: 4, model: 'gpt-4o', method: 'accurate' }

// Fast estimation (no dependencies)
const tokens = estimateTokens('Hello, world!', 'gpt-4o')
// 4 (estimated)

// CJK-aware estimation
const tokens = estimateTokens('你好世界', 'gpt-4o')
// Higher count due to CJK character handling
```

### 2. Budget Monitoring Hook

```typescript
import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function ChatInput() {
  const {
    usage,
    isWarning,
    isCritical,
    isExceeded,
    updateMessages,
    calculateTokens,
    wouldExceed,
    trimToCritical,
  } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    reservedForOutput: 4096,
    warningThreshold: 0.8,   // 80%
    criticalThreshold: 0.95, // 95%
    autoTrim: true,
    onWarning: (usage) => console.log('Warning:', usage.utilizationPercent),
    onCritical: (usage) => console.log('Critical!'),
  })

  useEffect(() => {
    updateMessages(messages.map(m => ({
      role: m.role,
      content: m.content,
    })))
  }, [messages])

  return (
    <div>
      <TokenBudgetBar usage={usage} model="gpt-4o" showCost />
      {isWarning && <Alert>Context at {usage.utilizationPercent}%</Alert>}
    </div>
  )
}
```

### 3. Pre-configured Model Monitors

```typescript
import { createModelBudgetMonitor, useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

// Quick setup for common models
const config = createModelBudgetMonitor('gpt-4o')
const { usage } = useTokenBudgetMonitor(config)

// With custom overrides
const config = createModelBudgetMonitor('claude-sonnet-4', {
  warningThreshold: 0.7,
  autoTrim: true,
})
```

### 4. TokenBudgetProvider (Context)

Share budget state across components without prop drilling:

```typescript
import { TokenBudgetProvider, useTokenBudget } from '@clarity-chat/token-optimization'

// Wrap your app with the provider
function App() {
  return (
    <TokenBudgetProvider model="gpt-4o" configOverrides={{ autoTrim: true }}>
      <ChatInterface />
    </TokenBudgetProvider>
  )
}

// Access budget state anywhere in the tree
function TokenDisplay() {
  const { usage, isWarning, model, setModel } = useTokenBudget()

  return (
    <div>
      <TokenBudgetBar usage={usage} />
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="gpt-4o">GPT-4o</option>
        <option value="claude-sonnet-4">Claude Sonnet 4</option>
      </select>
    </div>
  )
}

// Optional hook that doesn't throw outside provider
function OptionalDisplay() {
  const budget = useTokenBudgetOptional()
  if (!budget) return null
  return <TokenBudgetIndicator usage={budget.usage} />
}
```

### 5. Cost Estimation

```typescript
import { calculateCost, estimateTokenCost } from '@clarity-chat/token-optimization'

// Calculate actual cost
const cost = calculateCost({
  model: 'gpt-4o',
  inputTokens: 10000,
  outputTokens: 2000,
})
// { inputCost: 0.025, outputCost: 0.02, totalCost: 0.045, ... }

// Estimate from usage
const estimate = estimateTokenCost(usage, 'gpt-4o')
// { formattedCost: "$0.0450", inputCost: 0.025, ... }
```

### 6. Visual Components

```typescript
import { TokenBudgetBar, TokenBudgetIndicator } from '@clarity-chat/token-optimization'

// Full progress bar with labels and accessibility features
<TokenBudgetBar
  usage={usage}
  isCalculating={isCalculating}
  model="gpt-4o"
  showCost
  showTooltip
  size="md"
  ariaLabel="Chat Token Budget" // Custom accessible label
  onClick={() => handleTrim()}  // Keyboard accessible (Enter/Space)
/>

// Compact inline indicator with accessibility
<TokenBudgetIndicator usage={usage} ariaLabel="Token usage" />
```

#### Accessibility Features

- **ARIA attributes**: Progress bar has `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
- **Screen reader support**: Status descriptions are announced via `aria-live` regions
- **Keyboard navigation**: Focusable with Tab, activatable with Enter/Space, dismissible with Escape
- **Focus indicators**: Visible focus rings for keyboard users
- **Status alerts**: Exceeded status announced with `role="alert"` for immediate notification

## Model Registry

The `MODEL_REGISTRY` provides a single source of truth for all model configurations:

```typescript
import { MODEL_REGISTRY, getModelsByProvider, isValidModelId } from '@clarity-chat/token-optimization'

// Get model config
const config = MODEL_REGISTRY['gpt-4o']
// {
//   displayName: 'GPT-4o',
//   provider: 'openai',
//   contextWindow: 128000,
//   inputCostPer1M: 2.5,
//   outputCostPer1M: 10.0,
//   capabilities: { vision: true, functionCalling: true, ... }
// }

// Filter by provider
const anthropicModels = getModelsByProvider('anthropic')
// ['claude-3-opus', 'claude-sonnet-4', ...]

// Validate model ID
if (isValidModelId(userInput)) {
  const config = createModelBudgetMonitor(userInput)
}
```

## Supported Models

| Provider  | Models                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| OpenAI    | gpt-4, gpt-4-turbo, gpt-4o, gpt-4o-mini, gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, gpt-3.5-turbo, o1, o1-mini, o3-mini   |
| Anthropic | claude-3-opus, claude-3-sonnet, claude-3-haiku, claude-3-5-sonnet, claude-3-5-haiku, claude-sonnet-4, claude-opus-4 |
| Google    | gemini-pro, gemini-1.5-pro, gemini-1.5-flash, gemini-2.0-flash, gemini-2.0-pro                                      |
| DeepSeek  | deepseek-chat, deepseek-coder, deepseek-r1                                                                          |
| Meta      | llama-3, llama-3.1, llama-3.2, llama-3.3                                                                            |
| Mistral   | mistral-large, mistral-medium, mistral-small                                                                        |

## Architecture

### Canonical Location: @clarity-chat/token-optimization

All token optimization functionality is now located in the `@clarity-chat/token-optimization` package:

```
@clarity-chat/token-optimization/
├── tokenizers/
│   ├── accurate-counter.ts           # AccurateTokenCounter (CANONICAL)
│   └── provider-native-counter.ts    # Provider-specific counting
├── models/
│   ├── model-registry.ts             # Single source of truth for model configs
│   └── model-pricing.ts              # Cost calculation
├── compression/
│   ├── strategies/
│   │   ├── llmlingua.ts              # LLMLingua compression
│   │   ├── extractive.ts             # Extractive summarization
│   │   └── adaptive.ts               # Adaptive compression
│   └── index.ts
├── hooks/
│   ├── use-token-count.ts            # Simple token counting hook
│   ├── use-token-budget-monitor.ts   # Budget tracking hook
│   └── use-token-optimization.ts     # Full optimization pipeline
├── cache/
│   ├── exact-cache.ts                # Exact match caching
│   ├── smart-cache.ts                # Semantic similarity caching
│   └── tiered-cache.ts               # Multi-tier caching strategy
└── index.ts                          # Public exports
```

### React Package Integration

The React package provides thin wrappers and re-exports for convenience:

```
@clarity-chat/react/
├── src/utils/tokenization/
│   ├── index.ts                      # Re-exports from token-optimization
│   └── README.md                     # This file (usage guide)
└── src/hooks/token/
    └── index.ts                      # Re-exports token hooks
```

> **Migration Note:** If you're importing from `@clarity-chat/react/utils/tokenization`, consider updating to import directly from `@clarity-chat/token-optimization` for better tree-shaking and clarity of dependencies.

## Performance

### Token Cache

- LRU cache with 1000 entry limit
- Automatic hit/miss tracking
- ~95%+ hit rate for repeated content

```typescript
import { getTokenizerStats, clearTokenCache } from '@clarity-chat/token-optimization'

const stats = getTokenizerStats()
console.log(`Hit rate: ${stats.cacheHitRate}`)
// "Hit rate: 95.2%"
```

### Debounced Updates

The budget monitor debounces token calculations (default 300ms) to prevent excessive recalculation during rapid typing.

### Parallel Processing

Token counts for multiple messages are calculated in parallel using `Promise.all()`.

### Abort Controller

In-flight calculations are automatically aborted when new updates arrive, preventing stale state updates.

## Best Practices

1. **Use pre-configured monitors** for common models instead of manually specifying token limits

2. **Reserve output tokens** appropriately - reasoning models (o1, deepseek-r1) need larger reserves

3. **Enable autoTrim** for long-running conversations to automatically manage context

4. **Cache pre-computed tokens** in message objects for frequently-used content:

   ```typescript
   const message = {
     role: 'user',
     content: longContent,
     tokens: await calculateTokens(longContent), // Cache this
   }
   ```

5. **Validate model IDs** at runtime when accepting user input:
   ```typescript
   if (isValidBudgetMonitorModel(userSelectedModel)) {
     const config = createModelBudgetMonitor(userSelectedModel)
   }
   ```

6. **Import from canonical package** for better tree-shaking:
   ```typescript
   // ✅ Recommended
   import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

   // ⚠️ Works but adds bundle weight
   import { AccurateTokenCounter } from '@clarity-chat/react'
   ```

## Migration from Deprecated APIs

If you're using deprecated patterns, update them as follows:

### TokenCounter → AccurateTokenCounter

```typescript
// ❌ Old (deprecated)
import { TokenCounter } from '@clarity-chat/react'
const counter = new TokenCounter()

// ✅ New (canonical)
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
const counter = new AccurateTokenCounter({ model: 'gpt-4o' })
```

### Text Compression APIs

```typescript
// ❌ Old (removed)
import { compressText } from '@clarity-chat/react/utils/tokenization'

// ✅ New (canonical)
import { compressAdaptively, LLMLinguaCompressor } from '@clarity-chat/token-optimization'

// Simple compression
const result = await compressAdaptively(text, { targetTokens: 1000 })

// Advanced compression
const compressor = new LLMLinguaCompressor()
const result = await compressor.compress(text, { targetRatio: 0.5 })
```

## Types Reference

```typescript
interface TokenUsage {
  current: number // Current tokens used
  max: number // Maximum input tokens
  available: number // Remaining tokens
  utilizationPercent: number // 0-100 (capped)
  exceededPercent: number // Amount over budget
  status: 'safe' | 'warning' | 'critical' | 'exceeded'
  reservedForOutput: number
  effectiveMax: number // max - reserved
}

interface TokenBudgetConfig {
  maxInputTokens: number
  warningThreshold?: number // 0-1, default 0.8
  criticalThreshold?: number // 0-1, default 0.95
  reservedForOutput?: number // default 4096
  model?: ModelName
  autoTrim?: boolean
  debounceMs?: number // default 300
  onWarning?: (usage: TokenUsage) => void
  onCritical?: (usage: TokenUsage) => void
  onExceeded?: (usage: TokenUsage) => void
}
```

## See Also

- [@clarity-chat/token-optimization package documentation](../../../../token-optimization/README.md)
- [Model Registry documentation](../../../../token-optimization/docs/MODEL_REGISTRY.md)
- [Compression strategies documentation](../../../../token-optimization/docs/COMPRESSION.md)
- [Main API reference](../../../../../docs/api-reference.md)
