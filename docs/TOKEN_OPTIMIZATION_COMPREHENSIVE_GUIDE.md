# Token Optimization Comprehensive Guide

**Clarity Chat Components - Token Optimization System**

This document provides a complete technical reference for the token optimization functionality in Clarity Chat, covering what exists, why it exists, how to use it, and when to use each feature.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Core Systems](#3-core-systems)
   - [3.1 Token Estimation](#31-token-estimation)
   - [3.2 Accurate Token Counting](#32-accurate-token-counting)
   - [3.3 Model Pricing & Cost Calculation](#33-model-pricing--cost-calculation)
4. [Optimization Strategies](#4-optimization-strategies)
   - [4.1 TOON Encoding](#41-toon-encoding)
   - [4.2 Prompt Compression](#42-prompt-compression)
   - [4.3 Prompt Caching](#43-prompt-caching)
   - [4.4 Response Prefilling](#44-response-prefilling)
   - [4.5 Prompt Structure Optimization](#45-prompt-structure-optimization)
   - [4.6 Smart Semantic Caching](#46-smart-semantic-caching)
   - [4.7 Context Management](#47-context-management)
5. [React Hooks](#5-react-hooks)
   - [5.1 useTokenOptimizationEnhanced](#51-usetokenoptimizationenhanced)
   - [5.2 Legacy Hook Migration](#52-legacy-hook-migration)
6. [Best Practices](#6-best-practices)
7. [Performance Benchmarks](#7-performance-benchmarks)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Overview

### What Is Token Optimization?

Token optimization is a collection of techniques to reduce the number of tokens sent to and received from LLM APIs. This directly impacts:

- **Cost**: Fewer tokens = lower API bills (often 30-60% savings)
- **Latency**: Smaller payloads = faster responses
- **Context efficiency**: Better use of limited context windows
- **User experience**: More responsive applications

### Why Does It Exist?

LLM APIs charge per token. A typical enterprise chat application can generate millions of tokens daily. Without optimization:

| Scenario | Daily Tokens | Monthly Cost (GPT-4o) |
|----------|-------------|----------------------|
| 1K users, 20 msgs/day | 4M tokens | ~$10 |
| 10K users, 20 msgs/day | 40M tokens | ~$100 |
| 100K users, 20 msgs/day | 400M tokens | ~$1,000 |

With 40-50% optimization, these costs drop proportionally. At scale, this represents significant savings.

### Optimization Categories

| Category | Savings | Technique |
|----------|---------|-----------|
| Input Optimization | 30-60% | TOON, compression, caching |
| Output Optimization | 10-30% | Prefilling, output limits |
| API-Level | 50-90% | Prompt caching, batching |
| Smart Routing | 50%+ | Model selection based on complexity |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Token Optimization System                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │   Estimation     │  │   Optimization   │  │    Caching    │  │
│  │   & Counting     │  │   Strategies     │  │    Systems    │  │
│  ├──────────────────┤  ├──────────────────┤  ├───────────────┤  │
│  │ • estimator.ts   │  │ • TOON encoder   │  │ • Prompt cache│  │
│  │ • accurate-      │  │ • Compression    │  │ • Smart cache │  │
│  │   counter.ts     │  │ • Prefilling     │  │ • Semantic    │  │
│  │ • model-         │  │ • Structure      │  │   matching    │  │
│  │   pricing.ts     │  │                  │  │               │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                useTokenOptimizationEnhanced                 │ │
│  │         (Unified React Hook - combines all features)        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### File Structure

```
packages/react/src/utils/
├── tokenization/
│   ├── estimator.ts          # Centralized token estimation (SINGLE SOURCE OF TRUTH)
│   ├── accurate-counter.ts   # Tiktoken-based accurate counting
│   ├── model-pricing.ts      # Cost calculation for all models
│   └── index.ts              # Public exports
├── toon/
│   ├── encoder.ts            # JSON → TOON conversion
│   ├── decoder.ts            # TOON → JSON parsing
│   ├── optimizer.ts          # Auto-optimization decisions
│   └── types.ts              # TypeScript definitions
├── prompt-caching/
│   └── cache-manager.ts      # Anthropic/OpenAI cache management
├── prompt-compression.ts     # Text compression utilities
├── response-prefilling.ts    # Output prefilling templates
├── prompt-structure.ts       # Attention-optimized structuring
├── smart-cache.ts            # Semantic similarity caching
└── token-optimization.ts     # History limiting, routing, batching
```

---

## 3. Core Systems

### 3.1 Token Estimation

**Location**: `packages/react/src/utils/tokenization/estimator.ts`

**What It Does**: Provides fast, accurate token count estimates without requiring external tokenizer libraries.

**Why It Exists**: Real tokenization requires loading large encoding files. For real-time UI feedback, estimates are sufficient and much faster.

#### Key Features

1. **Model-Specific Ratios**: Different models have different tokenization efficiency
   - Claude models: ~3.8 characters per token
   - GPT models: ~4 characters per token

2. **CJK-Aware Counting**: Asian characters consume more tokens
   - Latin: ~4 characters per token
   - CJK: ~2.5 characters per token (handled automatically)

3. **Provider Inference**: Automatically detects provider from model name

#### Usage

```typescript
import { estimateTokens, estimateTokensByProvider, estimateMessagesTokens } from '@clarity-chat/react'

// Basic estimation
const tokens = estimateTokens("Hello, world!")
// => 4

// Model-specific estimation (uses Claude's 3.8 ratio)
const claudeTokens = estimateTokens(text, 'claude-3-5-sonnet')

// CJK text (automatically detected)
const cjkTokens = estimateTokens("你好世界")
// => 4 (accounts for higher token density)

// Provider-based estimation
const anthropicTokens = estimateTokensByProvider(text, 'anthropic')

// Message array estimation (includes formatting overhead)
const conversationTokens = estimateMessagesTokens([
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' }
], 'gpt-4o')
```

#### When to Use

- **Real-time token counters**: Show users live token counts as they type
- **Pre-flight checks**: Ensure messages fit within context windows
- **Cost estimation**: Quick cost previews before API calls
- **History trimming**: Decide which messages to keep

### 3.2 Accurate Token Counting

**Location**: `packages/react/src/utils/tokenization/accurate-counter.ts`

**What It Does**: Provides exact token counts using the js-tiktoken library when precision is required.

**Why It Exists**: Some operations (billing, strict context limits) require exact counts, not estimates.

#### Usage

```typescript
import { countTokens, countConversationTokens, truncateToTokenBudget } from '@clarity-chat/react'

// Accurate count (async, uses tiktoken if available)
const count = await countTokens("Hello, world!", { model: 'gpt-4' })
console.log(count.total)   // 4
console.log(count.method)  // 'accurate' or 'estimated'

// Conversation counting (includes message formatting overhead)
const convCount = await countConversationTokens([
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi!' }
], { model: 'gpt-4' })

// Truncate to fit budget
const { truncated, tokens, wasTruncated } = await truncateToTokenBudget(
  longText,
  1000,  // max tokens
  { model: 'gpt-4' }
)
```

#### When to Use

- **Billing calculations**: When exact cost matters
- **Context limit enforcement**: Hard limits that cannot be exceeded
- **Chunk splitting**: Dividing documents for embedding

### 3.3 Model Pricing & Cost Calculation

**Location**: `packages/react/src/utils/tokenization/model-pricing.ts`

**What It Does**: Maintains up-to-date pricing for all major LLM providers and calculates costs.

**Why It Exists**: Different models have vastly different prices. Cost-aware routing can save 50%+.

#### Supported Models (as of November 2025)

| Provider | Models | Input Cost/1M | Output Cost/1M |
|----------|--------|---------------|----------------|
| OpenAI | gpt-4o | $2.50 | $10.00 |
| OpenAI | gpt-4o-mini | $0.15 | $0.60 |
| OpenAI | o1 | $15.00 | $60.00 |
| Anthropic | claude-3-5-sonnet | $3.00 | $15.00 |
| Anthropic | claude-3-5-haiku | $0.80 | $4.00 |
| Google | gemini-1.5-flash | $0.075 | $0.30 |
| DeepSeek | deepseek-chat | $0.14 | $0.28 |

#### Usage

```typescript
import {
  calculateCost,
  calculateCacheSavings,
  estimateConversationCost,
  compareModelCosts,
  recommendModel
} from '@clarity-chat/react'

// Calculate cost for a request
const cost = calculateCost({
  model: 'gpt-4o',
  inputTokens: 1000,
  outputTokens: 500
})
console.log(cost.totalCost)  // $0.0075

// With cached tokens (Anthropic/OpenAI)
const cachedCost = calculateCost({
  model: 'claude-3-5-sonnet',
  inputTokens: 500,
  outputTokens: 500,
  cachedInputTokens: 500  // 90% discount on these
})

// Compare models for same workload
const comparison = compareModelCosts({
  models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-5-sonnet'],
  inputTokens: 2000,
  outputTokens: 1000
})
// Returns sorted by cost with savings percentages

// Get recommendation based on budget
const recommendation = recommendModel({
  inputTokens: 5000,
  outputTokens: 2000,
  maxCostPerRequest: 0.01,
  providers: ['openai', 'anthropic']
})
```

---

## 4. Optimization Strategies

### 4.1 TOON Encoding

**Location**: `packages/react/src/utils/toon/`

**What It Does**: Converts JSON to Token-Oriented Object Notation, a compact format that uses 30-60% fewer tokens for structured data.

**Why It Exists**: JSON is verbose. For arrays of objects, TOON eliminates repetitive keys and braces.

#### How TOON Works

```javascript
// Original JSON (23 tokens)
[
  {"name": "Alice", "age": 30, "city": "NYC"},
  {"name": "Bob", "age": 25, "city": "SF"}
]

// TOON format (10 tokens - 57% savings)
name, age, city
Alice, 30, NYC
Bob, 25, SF
```

#### Usage

```typescript
import {
  jsonToToon,
  toonToJson,
  autoOptimize,
  estimateToonSavings,
  isSuitableForToon
} from '@clarity-chat/react'

// Basic conversion
const toon = jsonToToon(userData)

// Parse TOON back to JSON
const json = toonToJson(toonString)

// Let the system decide (use if savings > threshold)
const { data, format, tokensSaved, savingsPercent } = autoOptimize(userData, {
  minSavingsPercent: 20
})
// format = 'toon' or 'json'

// Check if data is suitable
if (isSuitableForToon(data)) {
  // Use TOON
}

// Preview savings before conversion
const { jsonTokens, toonTokens, savingsPercent } = estimateToonSavings(data)
```

#### When to Use

- **Arrays of uniform objects**: User lists, product catalogs, search results
- **Tabular data**: Analytics, reports, logs
- **API responses**: When sending structured data to LLM

#### When NOT to Use

- Deeply nested objects
- Objects with unique keys per item
- Very small data (overhead not worth it)

### 4.2 Prompt Compression

**Location**: `packages/react/src/utils/prompt-compression.ts`

**What It Does**: Reduces prompt length by removing filler words, applying abbreviations, and trimming whitespace.

**Why It Exists**: Natural language prompts often contain redundant words that don't affect LLM understanding.

#### Compression Strategies

| Strategy | Description | Savings |
|----------|-------------|---------|
| `trimWhitespace` | Remove extra spaces | 5-10% |
| `removeFillers` | Remove "actually", "basically", etc. | 10-15% |
| `useAbbreviations` | "information" → "info" | 5-10% |
| `reducePunctuation` | Remove excessive punctuation | 2-5% |

#### Usage

```typescript
import {
  compressPrompt,
  aggressiveCompress,
  balancedCompress,
  conservativeCompress
} from '@clarity-chat/react'

// Custom compression
const result = compressPrompt(
  "I really, really want to know, um, you know, what the weather is like today",
  {
    removeFillers: true,
    trimWhitespace: true,
    preserveCode: true,
    preserveMarkdown: true
  }
)
// result.compressed = "I want to know what weather is like today"
// result.savingsPercent = 35

// Preset: Aggressive (maximum savings)
const aggressive = aggressiveCompress(longPrompt)

// Preset: Balanced (recommended for most cases)
const balanced = balancedCompress(prompt)

// Preset: Conservative (minimal changes)
const conservative = conservativeCompress(prompt)
```

#### Presets

| Preset | removeFillers | useAbbreviations | reducePunctuation |
|--------|--------------|------------------|-------------------|
| Conservative | No | No | Yes |
| Balanced | Yes | No | Yes |
| Aggressive | Yes | Yes | Yes |

### 4.3 Prompt Caching

**Location**: `packages/react/src/utils/prompt-caching/cache-manager.ts`

**What It Does**: Leverages provider-specific prompt caching to reduce costs on repeated context.

**Why It Exists**: Anthropic and OpenAI offer 50-90% discounts on cached input tokens.

#### How It Works

**Anthropic Claude**:
- Cache up to 4 breakpoints in a conversation
- Cached tokens cost 90% less ($0.30/1M vs $3.00/1M for Sonnet)
- 5-minute TTL that extends on each use

**OpenAI**:
- Automatic caching for long system prompts
- Cached tokens cost 50% less

#### Usage

```typescript
import {
  PromptCacheManager,
  createAnthropicCachedMessages,
  calculateCacheBreakpoints,
  estimateCacheSavings
} from '@clarity-chat/react'

// Create cache manager
const cacheManager = new PromptCacheManager({
  provider: 'anthropic',
  model: 'claude-3-5-sonnet',
  defaultMinLength: 1024  // Minimum tokens to cache
})

// Prepare messages with cache control
const cachedMessages = createAnthropicCachedMessages(
  systemPrompt,      // Gets cache_control if long enough
  conversationMessages
)

// Calculate optimal breakpoints for multi-turn conversations
const breakpoints = calculateCacheBreakpoints(allMessages, {
  maxBreakpoints: 4,  // Anthropic supports up to 4
  minTokensBetweenBreakpoints: 1024
})

// Estimate potential savings
const savings = estimateCacheSavings({
  systemPromptTokens: 5000,
  contextTokens: 2000,
  conversationsPerDay: 1000,
  provider: 'anthropic',
  model: 'claude-3-5-sonnet'
})
console.log(`Monthly savings: $${savings.monthlySavings}`)
```

#### 4-Breakpoint Strategy

Anthropic allows 4 cache breakpoints. Optimal placement:

1. **System prompt** (critical - 90% savings on every request)
2. **Long context/documents** (high - cached across conversation)
3. **Conversation turn boundaries** (medium - cached for follow-ups)
4. **Fill gaps** (low - coverage for edge cases)

### 4.4 Response Prefilling

**Location**: `packages/react/src/utils/response-prefilling.ts`

**What It Does**: Pre-starts the assistant's response to skip preambles and force specific output formats.

**Why It Exists**: LLMs often start with "Sure, I'd be happy to help..." which wastes 10-25 output tokens.

#### How It Works

Claude supports assistant prefilling:
```json
{
  "messages": [
    { "role": "user", "content": "List 5 fruits as JSON" },
    { "role": "assistant", "content": "[" }  // LLM continues from here
  ]
}
```

The LLM must continue from `[`, so it outputs valid JSON immediately.

#### Built-in Templates

| Template | Prefill | Use Case |
|----------|---------|----------|
| `json` | `{` | Object responses |
| `jsonArray` | `[` | Array responses |
| `typescript` | ` ```typescript\n` | TypeScript code |
| `python` | ` ```python\n` | Python code |
| `analysis` | `## Analysis\n\n` | Document analysis |
| `summary` | `## Summary\n\n` | Text summarization |

#### Usage

```typescript
import {
  createAnthropicPrefill,
  PREFILL_TEMPLATES,
  choosePrefillTemplate,
  validatePrefill
} from '@clarity-chat/react'

// Apply JSON prefill
const messages = createAnthropicPrefill(
  [{ role: 'user', content: 'List 5 colors as JSON array' }],
  PREFILL_TEMPLATES.jsonArray.config
)

// Auto-detect best prefill from query
const template = choosePrefillTemplate('Give me a Python function that...')
// Returns PREFILL_TEMPLATES.python

// Validate response used prefill correctly
const validation = validatePrefill(response, config)
if (validation.preambleDetected) {
  console.log(`Wasted ${validation.preambleTokens} tokens on preamble`)
}
```

### 4.5 Prompt Structure Optimization

**Location**: `packages/react/src/utils/prompt-structure.ts`

**What It Does**: Restructures prompts based on LLM attention patterns ("lost in the middle" phenomenon).

**Why It Exists**: Research shows LLMs pay 40% attention to the beginning, 20% to the middle, and 40% to the end. Critical information should be at edges.

#### Attention Distribution

```
┌──────────────────────────────────────────────────────────┐
│                      Prompt Structure                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  BEGINNING (40% attention)                                │
│  ├── System context                                       │
│  ├── Critical constraints                                 │
│  └── Few-shot examples                                    │
│                                                           │
│  MIDDLE (20% attention)                                   │
│  ├── Reference documents                                  │
│  └── Supporting material                                  │
│                                                           │
│  END (40% attention)                                      │
│  ├── Instructions                                         │
│  ├── Constraints                                          │
│  └── THE QUESTION ← Most important placement!             │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

#### Usage

```typescript
import {
  buildStructuredPrompt,
  restructurePrompt,
  createRAGPrompt,
  createFewShotPrompt
} from '@clarity-chat/react'

// Build from sections
const prompt = buildStructuredPrompt([
  { content: 'You are a helpful assistant.', type: 'context', priority: 'critical' },
  { content: longDocument, type: 'reference', priority: 'medium' },
  { content: 'Summarize the key points.', type: 'question', priority: 'critical' }
])
// Automatically places question at end

// Auto-restructure existing prompt
const optimized = restructurePrompt(
  "Here's the document: [content] What are the main themes?"
)

// RAG-optimized structure
const ragPrompt = createRAGPrompt({
  systemContext: 'You are a research assistant.',
  retrievedDocuments: [doc1, doc2, doc3],
  userQuestion: 'What is the relationship between X and Y?'
})

// Few-shot with examples at beginning
const fewShotPrompt = createFewShotPrompt({
  instruction: 'Classify sentiment',
  examples: [
    { input: 'I love this!', output: 'positive' },
    { input: 'This is terrible', output: 'negative' }
  ],
  query: 'Not bad at all'
})
```

### 4.6 Smart Semantic Caching

**Location**: `packages/react/src/utils/smart-cache.ts`

**What It Does**: Caches LLM responses and matches similar (not just identical) queries.

**Why It Exists**: Users often ask the same question in different words. Semantic caching catches these near-duplicates.

#### How It Works

1. When a response is cached, generate embedding for the query
2. On new queries, compare embeddings with cosine similarity
3. If similarity > threshold (e.g., 85%), return cached response

#### Usage

```typescript
import { SmartCache, SimpleCache } from '@clarity-chat/react'

// With semantic matching
const cache = new SmartCache<string>({
  maxSize: 100,
  enableSemanticMatching: true,
  similarityThreshold: 0.85,
  embedFunction: async (text) => await getEmbedding(text)  // Your embedding function
})

// Cache a response
await cache.set('What is React?', 'React is a JavaScript library...')

// This will match even with different wording
const response = await cache.get('Can you explain React?')
// Returns the cached response!

// Track statistics
const stats = cache.getStats()
console.log(`Hit rate: ${stats.hitRate}%`)
console.log(`Tokens saved: ${stats.tokensSaved}`)

// Simple cache (exact matching only - no embeddings needed)
const simpleCache = new SimpleCache<string>(100, 3600000) // 100 entries, 1hr TTL
simpleCache.set('key', 'value')
```

### 4.7 Context Management

**Location**: `packages/react/src/utils/token-optimization.ts` & `memory/` utilities

**What It Does**: Manages conversation history to stay within token limits.

**Why It Exists**: Long conversations exceed context windows. Smart trimming keeps important messages.

#### Strategies

| Strategy | Description |
|----------|-------------|
| `sliding-window` | Keep last N messages |
| `fifo` | Remove oldest until under limit |
| `smart` | Keep user/assistant pairs together |
| `summarize` | Summarize old messages |

#### Usage

```typescript
import { limitHistory } from '@clarity-chat/react'
import { buildContextBundle, compressContext } from '@clarity-chat/react'

// Limit history
const limited = limitHistory(messages, {
  strategy: 'smart',
  maxTokens: 4000,
  maxMessages: 10,
  keepSystemMessage: true,
  keepLast: 2
})

// Build context bundle with memories
const bundle = buildContextBundle(messages, memories, {
  maxTokens: 8000,
  includeSystem: true,
  memoryThreshold: 0.7
})
console.log(bundle.tokenCount)

// Compress context
const compressed = compressContext(messages, {
  targetTokens: 4000,
  strategy: 'truncate',
  keepRecent: 2
})
```

---

## 5. React Hooks

### 5.1 useTokenOptimizationEnhanced

**Location**: `packages/react/src/hooks/use-token-optimization-enhanced.tsx`

This is the **unified hook** that combines all token optimization features. It's the recommended way to use token optimization in React applications.

#### Quick Start with Presets

```typescript
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'

function ChatApp() {
  // Use a preset for quick setup
  const optimizer = useTokenOptimizationEnhanced({
    preset: 'balanced'  // 'aggressive' | 'balanced' | 'conservative' | 'realtime'
  })

  // All methods available
  const {
    optimizeData,      // TOON optimization for structured data
    optimizePrompt,    // Prompt compression
    prepareMessages,   // Add cache control
    parseResponse,     // Parse TOON/JSON responses
    countTokens,       // Accurate token counting
    calculateCost,     // Cost calculation
    optimizeHistory,   // History limiting
    canMakeRequest,    // Throttling check
    recordRequest,     // Record request for throttling
    routeQuery,        // Model routing
    createDataReference, // Reference system for large data
    limitOutput,       // Output truncation
    batchRequest,      // Request batching
    getPrefill,        // Response prefilling
    restructurePrompt, // Prompt structure optimization
    stats,             // Statistics
    resetStats         // Reset stats
  } = optimizer
}
```

#### Presets

| Preset | Features Enabled | Best For |
|--------|-----------------|----------|
| `aggressive` | All optimizations, max savings | Cost-sensitive apps |
| `balanced` | Key optimizations, good UX | General use |
| `conservative` | Safe optimizations only | Quality-critical apps |
| `realtime` | Low-latency optimizations | Interactive/streaming |

#### Full Configuration

```typescript
const optimizer = useTokenOptimizationEnhanced({
  model: 'claude-3-5-sonnet',

  // TOON
  enableToon: true,
  toonMinSavings: 20,  // Only use if 20%+ savings

  // Tokenization
  enableAccurateTokenization: true,

  // Prompt Caching
  enablePromptCaching: true,
  cachingProvider: 'anthropic',  // 'anthropic' | 'openai' | 'auto'

  // Semantic Caching
  enableSemanticCaching: true,
  similarityThreshold: 0.85,

  // Compression
  enablePromptCompression: true,
  compressionLevel: 'balanced',  // 'conservative' | 'balanced' | 'aggressive'

  // Cost Tracking
  enableCostTracking: true,
  enableStats: true,

  // History Management
  enableHistoryLimiting: true,
  historyLimiting: {
    strategy: 'smart',
    maxTokens: 4000,
    maxMessages: 20,
    keepSystemMessage: true,
    keepLast: 2
  },

  // Throttling
  enableThrottling: true,
  throttling: {
    minDelay: 500,
    maxRequests: 10,
    timeWindow: 60000
  },

  // Model Routing
  enableModelRouting: true,
  modelRouting: {
    complexityThreshold: 100,
    simpleModel: 'gpt-4o-mini',
    complexModel: 'gpt-4o'
  },

  // Prefilling
  enablePrefilling: true,

  // Prompt Structure
  enablePromptStructure: true
})
```

#### Complete Usage Example

```typescript
function ChatApp() {
  const optimizer = useTokenOptimizationEnhanced({
    model: 'claude-3-5-sonnet',
    preset: 'balanced',
    enablePromptCaching: true
  })

  const handleSend = async (userMessage: string, context?: any) => {
    // 1. Optimize structured context data
    let contextString = ''
    if (context) {
      const { content, format } = await optimizer.optimizeData(context)
      contextString = content
    }

    // 2. Optimize the prompt text
    const { content: optimizedPrompt } = await optimizer.optimizePrompt(userMessage)

    // 3. Restructure for optimal attention
    const { restructured } = optimizer.restructurePrompt(optimizedPrompt, contextString)

    // 4. Check throttling
    if (!optimizer.canMakeRequest()) {
      throw new Error('Rate limited')
    }
    optimizer.recordRequest()

    // 5. Route to appropriate model
    const model = optimizer.routeQuery(restructured)

    // 6. Limit history
    const limitedHistory = optimizer.optimizeHistory(messages)

    // 7. Prepare with cache control
    const cachedMessages = optimizer.prepareMessages([
      ...limitedHistory,
      { role: 'user', content: restructured }
    ])

    // 8. Get prefill for JSON response
    const prefill = optimizer.getPrefill('json')

    // 9. Make API call
    const response = await callLLM({
      model,
      messages: cachedMessages,
      prefill
    })

    // 10. Parse response
    const parsed = optimizer.parseResponse(response)

    // 11. Track stats
    console.log('Tokens saved:', optimizer.stats.overall.totalTokensSaved)
    console.log('Cost saved:', optimizer.stats.overall.totalCostSaved)
  }
}
```

### 5.2 Legacy Hook Migration

The old `useTokenOptimization` hook is **deprecated**. Migrate to `useTokenOptimizationEnhanced`:

```typescript
// OLD (deprecated)
import { useTokenOptimization } from '@clarity-chat/react'
const { optimizePrompt, stats } = useTokenOptimization({...})

// NEW (recommended)
import { useTokenOptimizationEnhanced } from '@clarity-chat/react'
const { optimizePrompt, stats } = useTokenOptimizationEnhanced({...})
```

The new hook has all features from the old hook plus:
- TOON support
- Prompt caching
- Response prefilling
- Prompt structure optimization
- Improved statistics

---

## 6. Best Practices

### Start Simple, Add Complexity

```typescript
// Phase 1: Basic optimizations (quick wins)
const optimizer = useTokenOptimizationEnhanced({
  enablePromptCompression: true,      // 20-35% savings
  enableHistoryLimiting: true,        // 20-40% savings
})

// Phase 2: Add caching
const optimizer = useTokenOptimizationEnhanced({
  ...phase1,
  enablePromptCaching: true,          // 50-90% on repeated context
  enableSemanticCaching: true,        // 20-40% on similar queries
})

// Phase 3: Advanced optimizations
const optimizer = useTokenOptimizationEnhanced({
  ...phase2,
  enableToon: true,                   // 30-60% on structured data
  enableModelRouting: true,           // 50%+ on simple queries
  enablePrefilling: true,             // 10-30% on output
})
```

### Monitor Statistics

```typescript
const { stats } = useTokenOptimizationEnhanced({...})

// Log periodically
useEffect(() => {
  const interval = setInterval(() => {
    console.log('Optimization Stats:', {
      tokenssSaved: stats.overall.totalTokensSaved,
      costSaved: `$${stats.overall.totalCostSaved.toFixed(4)}`,
      cacheHitRate: `${stats.semanticCache.hitRate.toFixed(1)}%`,
      compressionRate: `${stats.compression.averageSavingsPercent.toFixed(1)}%`
    })
  }, 60000)
  return () => clearInterval(interval)
}, [stats])
```

### Tune Thresholds

| Setting | Lower Value | Higher Value |
|---------|-------------|--------------|
| `similarityThreshold` | More cache hits, less accuracy | Fewer hits, higher quality |
| `toonMinSavings` | More TOON usage | Only use when significant |
| `complexityThreshold` | More simple model usage | More complex model usage |
| `maxTokens` | Stricter limits, more truncation | Longer context, higher cost |

---

## 7. Performance Benchmarks

### Token Savings by Strategy

| Strategy | Typical Savings | Latency Impact |
|----------|----------------|----------------|
| TOON Encoding | 30-60% | < 1ms |
| Prompt Compression | 20-35% | < 1ms |
| Prompt Caching (API) | 50-90% | None |
| Semantic Caching | 20-40% | < 10ms |
| Response Prefilling | 10-30% output | None |
| Model Routing | 50%+ cost | None |

### Combined Savings Example

Starting with 10,000 input tokens + 2,000 output tokens:

| Step | Input Tokens | Output Tokens | Cost (GPT-4o) |
|------|-------------|---------------|---------------|
| Baseline | 10,000 | 2,000 | $0.045 |
| + TOON (40% on 3K) | 8,800 | 2,000 | $0.042 |
| + Compression (25%) | 6,600 | 2,000 | $0.037 |
| + Cache (50% cached) | 3,300 | 2,000 | $0.028 |
| + Prefilling | 3,300 | 1,700 | $0.025 |
| **Total Savings** | **67%** | **15%** | **44%** |

---

## 8. Troubleshooting

### Token Counts Don't Match API

The estimator provides approximations. For exact counts:
```typescript
const { total, method } = await countTokens(text, {
  preferAccurate: true,
  model: 'gpt-4o'
})
// method === 'accurate' if tiktoken loaded successfully
```

### TOON Not Being Used

Check if data is suitable and savings exceed threshold:
```typescript
const suitable = isSuitableForToon(data)
const { savingsPercent } = estimateToonSavings(data)
console.log(`Suitable: ${suitable}, Savings: ${savingsPercent}%`)
```

### Cache Hits Too Low

Lower similarity threshold or check embedding function:
```typescript
const cache = new SmartCache({
  similarityThreshold: 0.75,  // Lower = more matches
  embedFunction: myEmbedFunction
})
```

### Prompt Caching Not Working

Ensure content exceeds minimum length (typically 1024 tokens):
```typescript
const cacheManager = new PromptCacheManager({
  defaultMinLength: 500  // Lower threshold
})
```

---

## Summary

The token optimization system provides a comprehensive toolkit for reducing LLM costs:

| What | Why | When | How Much |
|------|-----|------|----------|
| Token Estimation | Fast counts for UI | Always | N/A |
| TOON | Compact structured data | Arrays of objects | 30-60% |
| Compression | Remove filler | User prompts | 20-35% |
| Prompt Caching | Reuse context | Static system prompts | 50-90% |
| Prefilling | Skip preambles | Structured outputs | 10-30% |
| Structure | Better attention | Long contexts | Quality improvement |
| Semantic Cache | Match similar queries | High-volume apps | 20-40% |
| Model Routing | Use cheaper models | Simple queries | 50%+ |

Use `useTokenOptimizationEnhanced` with the `balanced` preset as a starting point, then customize based on your application's needs.
