# Token Optimization System

Comprehensive token management utilities for LLM applications, providing accurate counting, cost
estimation, and budget monitoring.

## Quick Start

```typescript
import {
  // Token counting
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
} from '@clarity-chat/react'
```

## Features

### 1. Token Counting

#### Accurate Counting (with tiktoken)

```typescript
const count = await countTokens('Hello, world!', { model: 'gpt-4o' })
// { total: 4, model: 'gpt-4o', method: 'accurate' }
```

#### Fast Estimation (no dependencies)

```typescript
const tokens = estimateTokens('Hello, world!', 'gpt-4o')
// 4 (estimated)
```

#### CJK-Aware Estimation

The estimator automatically adjusts for CJK characters which typically use more tokens:

```typescript
const tokens = estimateTokens('你好世界', 'gpt-4o')
// Higher count due to CJK character handling
```

### 2. Budget Monitoring Hook

```typescript
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
// Quick setup for common models
const config = createModelBudgetMonitor('gpt-4o')
const { usage } = useTokenBudgetMonitor(config)

// With custom overrides
const config = createModelBudgetMonitor('claude-sonnet-4', {
  warningThreshold: 0.7,
  autoTrim: true,
})
```

### 4. Cost Estimation

```typescript
import { calculateCost, estimateTokenCost } from '@clarity-chat/react'

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

### 5. Visual Components

```typescript
import { TokenBudgetBar, TokenBudgetIndicator } from '@clarity-chat/react'

// Full progress bar with labels
<TokenBudgetBar
  usage={usage}
  isCalculating={isCalculating}
  model="gpt-4o"
  showCost
  showTooltip
  size="md"
/>

// Compact inline indicator
<TokenBudgetIndicator usage={usage} />
```

## Model Registry

The `MODEL_REGISTRY` provides a single source of truth for all model configurations:

```typescript
import { MODEL_REGISTRY, getModelsByProvider, isValidModelId } from '@clarity-chat/react'

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

```
tokenization/
├── accurate-counter.ts    # Tiktoken-based accurate counting with LRU cache
├── estimator.ts           # Fast estimation without dependencies
├── model-pricing.ts       # Cost calculation and pricing data
├── model-registry.ts      # Single source of truth for model configs
└── index.ts              # Public exports

hooks/
└── use-token-budget-monitor.tsx  # React hook for budget tracking

components/
└── token-budget-bar.tsx   # Visual components
```

## Performance

### Token Cache

- LRU cache with 1000 entry limit
- Automatic hit/miss tracking
- ~95%+ hit rate for repeated content

```typescript
import { getTokenizerStats, clearTokenCache } from '@clarity-chat/react'

const stats = getTokenizerStats()
console.log(`Hit rate: ${stats.cacheHitRate}`)
// "Hit rate: 95.2%"
```

### Debounced Updates

The budget monitor debounces token calculations (default 300ms) to prevent excessive recalculation
during rapid typing.

### Parallel Processing

Token counts for multiple messages are calculated in parallel using `Promise.all()`.

### Abort Controller

In-flight calculations are automatically aborted when new updates arrive, preventing stale state
updates.

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
