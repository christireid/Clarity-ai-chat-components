# Token Optimization API Reference

Complete API documentation for the `@clarity-chat/token-optimization` package - the simplest way to
count and optimize LLM tokens with 60-90% cost savings possible.

**Package Size**: 5-6x smaller than alternatives (972KB vs 5.3MB tiktoken)

---

## Quick Start

### React (Recommended)

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function MyComponent() {
  const { count, isLoading, error } = useTokenCount(text)
  return <span>{count} tokens</span>
}
```

### Node.js

```typescript
import { countTokens, DEFAULTS } from '@clarity-chat/token-optimization'

const count = countTokens('Hello world') // Uses gpt-4o by default
console.log(`${count} tokens using ${DEFAULTS.model}`)
```

---

## Token Counting

### Primary API

#### `countTokens(text, options?)`

Simple function to count tokens synchronously.

**Parameters:**

- `text` (string): Text to count
- `options` (object, optional):
  - `model` (ModelId): Model to use (default: 'gpt-4o')
  - `cache` (boolean): Enable caching (default: true)

**Returns:** `number` - Token count

**Example:**

```typescript
import { countTokens } from '@clarity-chat/token-optimization'

const count = countTokens('Hello world', { model: 'gpt-4o' })
console.log(`${count} tokens`)
```

#### `useTokenCount(text, options?)`

React hook for token counting with caching.

**Parameters:**

- `text` (string): Text to count
- `options` (object, optional):
  - `model` (ModelId): Model to use
  - `enabled` (boolean): Enable counting (default: true)
  - `debounce` (number): Debounce delay in ms (default: 300)

**Returns:**

```typescript
{
  count: number
  isLoading: boolean
  error: Error | null
}
```

**Example:**

```tsx
import { useTokenCount } from '@clarity-chat/token-optimization'

function TokenCounter({ text }: { text: string }) {
  const { count, isLoading, error } = useTokenCount(text, {
    model: 'gpt-4o',
    debounce: 500,
  })

  if (error) return <span>Error: {error.message}</span>
  if (isLoading) return <span>Counting...</span>
  return <span>{count} tokens</span>
}
```

---

### Advanced Token Counters

#### `AccurateTokenCounter`

High-performance token counter with caching (uses gpt-tokenizer).

**Constructor:**

```typescript
new AccurateTokenCounter(options?: {
  model?: ModelId
  cacheSize?: number
  cacheTTL?: number
})
```

**Methods:**

- `count(text: string): number` - Count tokens
- `countMessages(messages: Message[]): number` - Count conversation tokens
- `clearCache(): void` - Clear cache

**Example:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({
  model: 'gpt-4o',
  cacheSize: 10000,
})

const count = counter.count('Hello world')
const messageCount = counter.countMessages([
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
])
```

#### `ProviderNativeCounter`

100% accurate counting via provider APIs (OpenAI, Anthropic, Google).

**Constructor:**

```typescript
new ProviderNativeCounter(options: {
  provider: 'openai' | 'anthropic' | 'google'
  apiKey: string
  model?: ModelId
})
```

**Methods:**

- `async count(text: string): Promise<number>` - Count via API
- `async countMessages(messages: Message[]): Promise<number>` - Count conversation

**Example:**

```typescript
import { ProviderNativeCounter } from '@clarity-chat/token-optimization'

const counter = new ProviderNativeCounter({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
})

const count = await counter.count('Hello world')
```

---

## Model Registry & Pricing

### Single Source of Truth

#### `MODEL_REGISTRY`

Central registry for all 50+ supported models.

**Supported Models:**

- **OpenAI**: GPT-4o, GPT-4o-mini, GPT-4, GPT-3.5-turbo, o1, o3
- **Anthropic**: Claude 3/3.5/4 (Opus, Sonnet, Haiku)
- **Google**: Gemini 1.5/2.0 (Pro, Flash)
- **DeepSeek**: deepseek-chat, deepseek-coder, deepseek-r1
- **Meta**: Llama 3.0, 3.1, 3.2, 3.3
- **Mistral**: mistral-large, mistral-medium, mistral-small

**Query Functions:**

```typescript
import {
  MODEL_REGISTRY,
  getAllModelIds,
  getModelsByProvider,
  getModelsWithCapability,
  getModelsWithMinContextWindow,
} from '@clarity-chat/token-optimization'

// Get all model IDs
const allIds = getAllModelIds()
// ["gpt-4o", "gpt-4o-mini", "claude-3-opus", ...]

// Filter by provider
const openaiModels = getModelsByProvider('openai')

// Filter by capability
const visionModels = getModelsWithCapability('vision')

// Filter by context window
const largeContextModels = getModelsWithMinContextWindow(100000)
```

#### `MODEL_PRICING`

Pricing data for all models.

**Example Pricing (GPT-4o):**

- Input: $2.50 / 1M tokens
- Output: $10.00 / 1M tokens
- Cached Input: $1.25 / 1M tokens (50% discount)
- Context Window: 128K tokens

**Cost Calculation Functions:**

```typescript
import {
  calculateCost,
  calculateCacheSavings,
  estimateConversationCost,
  compareModelCosts,
  recommendModel,
} from '@clarity-chat/token-optimization'

// Calculate cost for a single request
const cost = calculateCost({
  model: 'gpt-4o',
  inputTokens: 1000,
  outputTokens: 500,
  cachedInputTokens: 500,
})
console.log(`Total: $${cost.total.toFixed(4)}`)

// Calculate cache savings
const savings = calculateCacheSavings({
  model: 'gpt-4o',
  totalInputTokens: 10000,
  cachedRatio: 0.8,
})
console.log(`Save $${savings.amountSaved.toFixed(2)} (${savings.percentSaved}%)`)

// Estimate conversation cost
const conversationCost = estimateConversationCost({
  model: 'gpt-4o',
  messages: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi!' },
  ],
  responseLengthEstimate: 200,
})

// Compare models
const comparison = compareModelCosts({
  models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-haiku'],
  inputTokens: 1000,
  outputTokens: 500,
})

// Recommend cheapest model
const recommendation = recommendModel({
  maxBudget: 0.01,
  minContextWindow: 32000,
  requiredCapabilities: ['vision'],
})
```

---

## Compression Strategies

### Recommended Compressors (Real Compression)

#### `LLMLinguaCompressor`

Statistical token-level compression achieving 2-20x compression.

**Features:**

- TF-IDF based importance scoring
- Preserves semantic meaning
- Best for prose text (articles, docs, instructions)
- Quality metrics: semantic similarity, key term retention

**Constructor:**

```typescript
new LLMLinguaCompressor(defaultOptions?: {
  preserveFirst?: number
  preserveLast?: number
  preserveInstructions?: boolean
  preserveCode?: boolean
  minQuality?: number
  maxRecursionDepth?: number
})
```

**Methods:**

```typescript
async compress(
  text: string,
  targetRatio: number,
  options?: LLMLinguaOptions
): Promise<LLMLinguaResult>
```

**Example:**

```typescript
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'

const compressor = new LLMLinguaCompressor()

// Keep 30% of tokens (3.3x compression)
const result = await compressor.compress(longPrompt, 0.3, {
  preserveCode: true,
  preserveInstructions: true,
  minQuality: 0.7,
})

console.log(`Original: ${result.originalTokens} tokens`)
console.log(`Compressed: ${result.compressedTokens} tokens`)
console.log(`Quality: ${result.quality.overallQuality.toFixed(2)}`)
console.log(`Semantic similarity: ${result.quality.semanticSimilarity.toFixed(2)}`)
```

**Helper Function:**

```typescript
import { compressWithLLMLingua } from '@clarity-chat/token-optimization'

const compressed = await compressWithLLMLingua(text, 0.3)
```

---

#### `ExtractiveCompressor`

Sentence-level extraction achieving 2-5x compression.

**Features:**

- Extracts most important sentences
- Preserves grammatical coherence
- Best for long documents (reports, papers)
- Position-aware scoring

**Constructor:**

```typescript
new ExtractiveCompressor(defaultOptions?: {
  minSentences?: number
  maxSentences?: number
  preserveFirst?: boolean
  preserveLast?: boolean
  boostQuestions?: boolean
  boostInstructions?: boolean
  keyPhrases?: string[]
})
```

**Methods:**

```typescript
compress(
  text: string,
  targetRatio: number,
  options?: ExtractiveOptions
): ExtractiveResult
```

**Example:**

```typescript
import { ExtractiveCompressor } from '@clarity-chat/token-optimization'

const compressor = new ExtractiveCompressor()

// Keep 50% of sentences
const result = compressor.compress(longDocument, 0.5, {
  preserveFirst: true,
  boostQuestions: true,
  minSentences: 3,
})

console.log(`Original: ${result.originalSentences} sentences`)
console.log(`Kept: ${result.keptSentences} sentences`)
console.log(`Compression: ${(result.compressionRatio * 100).toFixed(1)}%`)
```

**Helper Function:**

```typescript
import { compressExtractively } from '@clarity-chat/token-optimization'

const compressed = compressExtractively(text, 0.5)
```

---

#### `AdaptiveCompressor` (RECOMMENDED)

Auto-selects best strategy based on content analysis.

**Features:**

- Analyzes content type (prose, code, mixed, structured)
- Chooses optimal strategy automatically
- Supports LLMLingua, Extractive, Hybrid, and Minimal strategies
- Provides detailed reasoning for selection

**Constructor:**

```typescript
new AdaptiveCompressor(defaultOptions?: {
  targetRatio?: number
  minQuality?: number
  maxProcessingTime?: number
  preferredStrategy?: 'llmlingua' | 'extractive' | 'hybrid' | 'minimal'
  forceStrategy?: 'llmlingua' | 'extractive' | 'hybrid' | 'minimal'
  llmlinguaOptions?: LLMLinguaOptions
  extractiveOptions?: ExtractiveOptions
})
```

**Methods:**

```typescript
async compress(
  text: string,
  options?: AdaptiveOptions
): Promise<AdaptiveResult>
```

**Example:**

```typescript
import { AdaptiveCompressor } from '@clarity-chat/token-optimization'

const compressor = new AdaptiveCompressor()

// Let it choose the best strategy
const result = await compressor.compress(text, {
  targetRatio: 0.3,
  minQuality: 0.8,
})

console.log(`Strategy: ${result.strategyUsed}`)
console.log(`Reason: ${result.strategyReason}`)
console.log(`Content type: ${result.contentAnalysis.contentType}`)
console.log(`Compression: ${(result.compressionRatio * 100).toFixed(1)}%`)
console.log(`Quality: ${result.quality.overallQuality.toFixed(2)}`)
```

**Helper Function (RECOMMENDED):**

```typescript
import { compressAdaptively } from '@clarity-chat/token-optimization'

// Simplest way to compress
const compressed = await compressAdaptively(text, 0.3)
```

---

## Provider-Native Caching

### 90% Cost Reduction on Cached Tokens

Leverage provider-specific prompt caching APIs for massive savings.

#### `quickCache(messages)`

Auto-detects provider and applies caching.

**Example:**

```typescript
import { quickCache } from '@clarity-chat/token-optimization'

const messages = [
  { role: 'system', content: 'You are a helpful assistant...' },
  { role: 'user', content: 'Hello' },
]

const cached = quickCache(messages)
// Automatically adds cache_control for Anthropic, etc.
```

#### Provider-Specific Functions

```typescript
import {
  anthropicCache,
  openaiCache,
  googleCache,
  estimateCacheSavings,
} from '@clarity-chat/token-optimization'

// Anthropic (explicit cache points)
const anthropicMessages = anthropicCache(messages)

// OpenAI (automatic ephemeral caching)
const openaiMessages = openaiCache(messages)

// Google (context caching)
const googleMessages = googleCache(messages)

// Estimate savings
const savings = estimateCacheSavings(messages, 'gpt-4o')
console.log(`Potential savings: $${savings.amountSaved.toFixed(4)}`)
```

---

## Model Routing

### Intelligent Model Selection

#### `ModelRouter`

Routes queries to cost-optimal models based on complexity.

**Static Factory:**

```typescript
import { ModelRouter } from '@clarity-chat/token-optimization'

// Default router with sensible defaults
const router = ModelRouter.default()

// Builder pattern
const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .withMaxCost(0.01)
  .build()
```

**Routing Strategies:**

- `'cost-optimized'` - Cheapest model that meets requirements
- `'speed-optimized'` - Fastest model
- `'quality-optimized'` - Best reasoning capabilities

**Methods:**

```typescript
route(
  query: string,
  options?: RoutingOptions
): RoutingDecision

getStats(): RoutingStats
```

**Example:**

```typescript
import { ModelRouter } from '@clarity-chat/token-optimization'

const router = ModelRouter.builder()
  .useOpenAIModels()
  .withStrategy('cost-optimized')
  .withMaxCost(0.01)
  .build()

const decision = router.route('Explain quantum computing')

console.log(`Model: ${decision.model}`)
console.log(`Reason: ${decision.reasoning}`)
console.log(`Est. cost: $${decision.estimatedCost.toFixed(4)}`)

// Use the selected model
const response = await openai.chat.completions.create({
  model: decision.model,
  messages: [{ role: 'user', content: 'Explain quantum computing' }],
})
```

---

## React Hooks

### `useTokenCount(text, options?)`

Simple token counting hook (see above).

### `useTokenBudgetTracking(config)`

Track token usage against a budget.

**Example:**

```tsx
import { useTokenBudgetTracking } from '@clarity-chat/token-optimization'

function BudgetMonitor() {
  const { usage, isWarning, isExceeded, percentUsed, reset } = useTokenBudgetTracking({
    maxTokens: 10000,
    warningThreshold: 0.8,
  })

  return (
    <div>
      <span>
        {usage} / {10000} tokens ({percentUsed}%)
      </span>
      {isWarning && <Warning>Approaching limit</Warning>}
      {isExceeded && <Error>Budget exceeded!</Error>}
      <button onClick={reset}>Reset</button>
    </div>
  )
}
```

### `useTokenOptimization(config)`

Full optimization pipeline with compression, caching, and routing.

**Example:**

```tsx
import { useTokenOptimization } from '@clarity-chat/token-optimization'

function OptimizedChat() {
  const { count, compress, cache, route, optimize } = useTokenOptimization({
    model: 'gpt-4o',
    enableCompression: true,
    enableCaching: true,
    enableRouting: true,
  })

  const handleSend = async (message: string) => {
    // Full optimization pipeline
    const optimized = await optimize(message)

    // Or individual steps
    const compressed = await compress(message)
    const cached = cache([...previousMessages, compressed])
    const decision = route(message)
  }

  return <ChatInterface onSend={handleSend} />
}
```

---

## React Components

### `TokenCostPreview`

Show estimated costs before sending.

**Props:**

```typescript
{
  text: string
  model?: ModelId
  showBreakdown?: boolean
  onCostUpdate?: (cost: CostCalculation) => void
}
```

**Example:**

```tsx
import { TokenCostPreview } from '@clarity-chat/token-optimization'

;<TokenCostPreview text={userInput} model="gpt-4o" showBreakdown={true} />
```

---

### `TokenUsageMeter`

Animated progress meter for token usage.

**Props:**

```typescript
{
  current: number
  max: number
  showPercentage?: boolean
  animate?: boolean
  color?: 'green' | 'yellow' | 'red'
}
```

**Example:**

```tsx
import { TokenUsageMeter } from '@clarity-chat/token-optimization'

;<TokenUsageMeter current={5000} max={10000} showPercentage={true} animate={true} />
```

---

### `TokenOptimizationDashboard`

Full analytics dashboard with savings breakdown.

**Props:**

```typescript
{
  metrics: {
    totalTokens: number
    tokensSaved: number
    costSaved: number
    breakdown: {
      compression?: { tokens: number; percent: number }
      caching?: { hits: number; savings: number }
      routing?: { savings: number; percent: number }
    }
  }
  showBreakdown?: boolean
  realTime?: boolean
  refreshInterval?: number
}
```

**Example:**

```tsx
import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization'

;<TokenOptimizationDashboard
  metrics={{
    totalTokens: 50000,
    tokensSaved: 30000,
    costSaved: 0.45,
    breakdown: {
      compression: { tokens: 15000, percent: 30 },
      caching: { hits: 120, savings: 10000 },
      routing: { savings: 5000, percent: 40 },
    },
  }}
  showBreakdown={true}
  realTime={true}
/>
```

---

## Subpath Exports

### Main Export

```typescript
import {} from /* everything */ '@clarity-chat/token-optimization'
```

All features: token counting, compression, caching, routing, hooks, components.

### React-Only

```typescript
import {} from /* React components & hooks */ '@clarity-chat/token-optimization/react'
```

### Compression-Only

```typescript
import {
  LLMLinguaCompressor,
  ExtractiveCompressor,
  AdaptiveCompressor,
} from '@clarity-chat/token-optimization/compression'
```

### Cache-Only

```typescript
import { quickCache, anthropicCache, openaiCache } from '@clarity-chat/token-optimization/cache'
```

---

## Performance Characteristics

### Token Counting

- **Speed**: <1ms for typical prompts
- **Accuracy**: 99.5%+ with gpt-tokenizer, 100% with provider APIs
- **Cache**: 10,000 entries default

### Compression

- **LLMLingua**: 2-20x, 150-500ms
- **Extractive**: 2-5x, 50-200ms
- **Adaptive**: 50-500ms (auto-select)

### Cost Reduction

- **Compression**: 20-80% token reduction
- **Provider Caching**: 90% cost reduction on cached tokens
- **Routing**: 30-50% cost optimization
- **Combined**: 60-95% potential savings

---

## Types Reference

### `LLMLinguaResult`

```typescript
interface LLMLinguaResult {
  original: string
  compressed: string
  compressionRatio: number
  originalTokens: number
  compressedTokens: number
  tokenReductionRatio: number
  quality: {
    semanticSimilarity: number
    keyTermRetention: number
    instructionRetention: number
    overallQuality: number
  }
  warning?: string
  debug?: LLMLinguaDebugInfo
}
```

### `ExtractiveResult`

```typescript
interface ExtractiveResult {
  original: string
  compressed: string
  compressionRatio: number
  originalSentences: number
  keptSentences: number
  sentenceRetentionRatio: number
  quality: {
    keyTermRetention: number
    sentenceRetention: number
    topicCoverage: number
    overallQuality: number
  }
  debug?: ExtractiveDebugInfo
}
```

### `AdaptiveResult`

```typescript
interface AdaptiveResult {
  original: string
  compressed: string
  compressionRatio: number
  strategyUsed: 'llmlingua' | 'extractive' | 'hybrid' | 'minimal'
  strategyReason: string
  quality: {
    semanticSimilarity?: number
    keyTermRetention: number
    sentenceRetention?: number
    overallQuality: number
  }
  contentAnalysis: {
    contentType: 'prose' | 'code' | 'mixed' | 'structured' | 'conversational' | 'technical' | 'list'
    typeConfidence: number
    length: number
    estimatedTokens: number
    sentenceCount: number
    avgSentenceLength: number
    codePercentage: number
    complexity: number
    hasStructuredData: boolean
  }
  processingTimeMs: number
  debug?: AdaptiveDebugInfo
}
```

### `ModelId`

```typescript
type ModelId =
  // OpenAI
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-3.5-turbo'
  | 'o1'
  | 'o1-mini'
  | 'o3-mini'
  // Anthropic
  | 'claude-3-opus'
  | 'claude-3-sonnet'
  | 'claude-3-haiku'
  | 'claude-3-5-sonnet'
  | 'claude-3-5-haiku'
  | 'claude-sonnet-4'
  | 'claude-opus-4'
  // Google
  | 'gemini-pro'
  | 'gemini-1.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-2.0-flash'
  | 'gemini-2.0-pro'
  // DeepSeek
  | 'deepseek-chat'
  | 'deepseek-coder'
  | 'deepseek-r1'
  // Llama
  | 'llama-3'
  | 'llama-3.1'
  | 'llama-3.2'
  | 'llama-3.3'
  // Mistral
  | 'mistral-large'
  | 'mistral-medium'
  | 'mistral-small'
  // Custom models (any string)
  | (string & Record<never, never>)
```

---

## Custom Model Registration

Register your own models:

```typescript
import { registerModel } from '@clarity-chat/token-optimization'

registerModel('my-custom-model', {
  provider: 'openai',
  encoding: 'cl100k_base',
  contextWindow: 128000,
  pricing: {
    input: 0.001, // $0.001 per 1K tokens
    output: 0.002, // $0.002 per 1K tokens
    cachedInput: 0.0005,
  },
  capabilities: ['chat', 'completion'],
})

// Use it
const count = countTokens(text, { model: 'my-custom-model' })
```

---

## See Also

- [Token Optimization Guide](/guides/token-optimization)
- [Compression Best Practices](/guides/compression-best-practices)
- [Provider Caching Guide](/guides/provider-caching)
- [Cost Optimization Strategies](/guides/cost-optimization)
- [Example Application](/examples/token-optimization-demo)
