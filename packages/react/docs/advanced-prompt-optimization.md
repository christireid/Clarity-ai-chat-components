# Advanced Prompt Optimization

This document describes the advanced prompt optimization features available in Clarity AI Chat Components.

## Overview

The advanced optimization layer provides:

- **Semantic Prioritization** - Rank messages by relevance and importance
- **Contextual Compression** - Multi-stage compression pipeline
- **Adaptive Strategy Routing** - Intelligent strategy selection
- **Model-Aware Optimization** - Model-specific prompt shaping
- **Dynamic Model Routing** - Automatic model selection
- **Comprehensive Debugging** - Full visibility into optimization pipeline

## Quick Start

### Basic Usage

```tsx
import { usePromptOptimizer, getModelProfile } from '@clarity-chat/react'

const optimizer = usePromptOptimizer({
  messages: chatMessages,
  model: getModelProfile('gpt-4')!,
  targetTokens: 4000,
  autoOptimize: true,
})

// Use optimized messages
const optimizedMessages = optimizer.optimizedMessages
```

### With Dynamic Model Routing

```tsx
import { useDynamicModelRouting } from '@clarity-chat/react'

const routing = useDynamicModelRouting({
  messages: chatMessages,
  currentModel: 'gpt-4',
  criteria: {
    tokenBudget: 4000,
    costBudget: 0.1,
    complexity: 0.5,
  },
})

// Switch to recommended model
if (routing.recommendedModel) {
  setModel(routing.recommendedModel)
}
```

## Core Concepts

### Semantic Prioritization

Messages are scored using multiple signals:

- **Recency** - More recent messages score higher
- **Semantic Relevance** - Similarity to current query (via embeddings)
- **Role Priority** - System > Tool > User > Assistant
- **Importance Tags** - Explicit importance markers
- **Memory Relevance** - Relevance to retrieved memory

```tsx
import { prioritizeContext } from '@clarity-chat/react'

const result = prioritizeContext(messages, {
  weights: {
    recency: 0.3,
    semanticRelevance: 0.4,
    rolePriority: 0.2,
    importanceTags: 0.05,
    memoryRelevance: 0.05,
  },
  queryEmbedding: queryVector,
})
```

### Compression Strategies

Three compression strategies work together:

1. **Semantic Grouping** - Cluster similar messages
2. **Tool Output Condensing** - Compress verbose tool responses
3. **Intent-Preserving Summarization** - Create compact summaries

```tsx
import { compressContext } from '@clarity-chat/react'

const result = await compressContext(messages, {
  strategies: [
    { name: 'semantic-grouping', enabled: true },
    { name: 'tool-output-condensing', enabled: true },
    { name: 'intent-preserving-summarization', enabled: true },
  ],
  model: modelProfile,
  summarizeFn: async (msgs) => {
    // Your summarization function
    return summarize(msgs)
  },
})
```

### Adaptive Strategy Routing

The system automatically chooses optimization strategies based on:

- Token budget ratio
- Model capabilities
- Cost constraints

```tsx
import { chooseOptimizationStrategy } from '@clarity-chat/react'

const routing = chooseOptimizationStrategy({
  messages,
  currentTokens: 5000,
  targetTokens: 4000,
  model: modelProfile,
})

// routing.strategy: 'aggressive-compression' | 'moderate-optimization' | 'normalization-only'
// routing.actions: Array of recommended actions
// routing.estimatedSavings: Expected token savings
```

### Model Profiles

Pre-configured profiles for common models:

- GPT-4, GPT-4 Turbo, GPT-4 Mini
- Claude 3 Opus, Sonnet, Haiku
- Gemini 1.5 Pro, Flash
- Mistral Large, Small

Each profile includes:

- Token limits
- Pricing
- Optimal prompt style
- Preferred structure
- Model-specific optimizations

```tsx
import { getModelProfile, MODEL_PROFILES } from '@clarity-chat/react'

const gpt4 = getModelProfile('gpt-4')
// {
//   model: 'gpt-4',
//   maxTokens: 8192,
//   optimalPromptStyle: 'structured',
//   preferredStructure: { ... },
//   optimizations: { ... }
// }
```

### Prompt Style Transformations

Transform prompts to match model preferences:

- **Concise** - Remove verbose parts, truncate if needed
- **Dense** - Merge related messages
- **Structured** - Add consistent formatting

```tsx
import { applyPromptStyle } from '@clarity-chat/react'

const transformed = applyPromptStyle(messages, {
  style: 'concise',
  modelProfile: modelProfile,
  aggressiveness: 0.5,
})
```

## DSL Extensions

### Message Metadata

Add importance and compression hints:

```tsx
import { system, user, assistant, tool } from '@clarity-chat/react/prompt'

const messages = [
  system('You are a helpful assistant.', {
    importance: 1.0,
    tags: ['critical'],
  }),
  user('Hello', {
    importance: 0.6,
    compressStrategy: 'semantic',
  }),
  tool('Large tool output...', {
    compressStrategy: 'truncate',
    maxTokens: 500,
  }),
]
```

### Scoped Blocks

Group messages with shared compression rules:

```tsx
import { createScopedBlock } from '@clarity-chat/react/prompt'

const searchResults = createScopedBlock('SearchResults', searchMessages, {
  importance: 0.3,
  compression: {
    enabled: true,
    strategy: 'semantic',
    threshold: 0.5,
  },
})
```

## Advanced Hooks

### usePromptOptimizer

Full-featured optimization hook:

```tsx
const optimizer = usePromptOptimizer({
  messages,
  model: modelProfile,
  targetTokens: 4000,
  autoOptimize: true,
  options: {
    enableSemanticPrioritization: true,
    enableCompression: true,
    prioritizationWeights: { ... },
    strategies: [ ... ],
    summarizeFn: async (msgs) => summarize(msgs),
  },
})

// Access results
optimizer.optimizedMessages
optimizer.tokenStats
optimizer.costEstimate
optimizer.diagnostics
```

### useDynamicModelRouting

Intelligent model selection:

```tsx
const routing = useDynamicModelRouting({
  messages,
  currentModel: 'gpt-4',
  criteria: {
    tokenBudget: 4000,
    costBudget: 0.1,
    complexity: 0.5,
    latencyRequirement: 'fast',
    memoryDepth: 'medium',
  },
})

// Check recommendations
if (routing.recommendedModel) {
  // Switch to recommended model
}
```

### usePromptDebugger

Development tool for optimization pipeline:

```tsx
const debugger = usePromptDebugger({
  messages,
  model: modelProfile,
  targetTokens: 4000,
  enabled: true,
})

// Access debug info
debugger.debugInfo.history
debugger.debugInfo.tokenCounts
debugger.debugInfo.compressionLogs
debugger.debugInfo.routingDecisions
```

## Optimization Engine

The core engine orchestrates all strategies:

```tsx
import { optimizePrompt } from '@clarity-chat/react'

const result = await optimizePrompt({
  messages,
  modelProfile: modelProfile,
  targetTokens: 4000,
  enableSemanticPrioritization: true,
  enableCompression: true,
  strategies: [ ... ],
  prioritizationWeights: { ... },
  summarizeFn: async (msgs) => summarize(msgs),
  embeddingProvider: {
    embedText: async (text) => generateEmbedding(text),
  },
  debug: true,
})

// Result includes:
// - messages: Optimized message array
// - tokenStats: Token statistics
// - costEstimate: Cost breakdown
// - diagnostics: Full optimization details
// - debug: Intermediate states (if enabled)
```

## Pipeline Stages

The engine follows a compiler-like pipeline:

1. **Lexing** - Parse messages into semantic format
2. **Structuring** - Apply prompt recipe/toon DSL
3. **Analysis** - Semantic scoring and prioritization
4. **Optimization** - Compression and pruning
5. **Emission** - Style transformation and final output

Each stage is instrumented and available in diagnostics.

## Best Practices

1. **Start with defaults** - The engine has sensible defaults
2. **Enable semantic prioritization** - Provides best results
3. **Provide summarization function** - For best compression
4. **Use model profiles** - Ensures model-aware optimization
5. **Monitor diagnostics** - Understand optimization impact
6. **Use debugger in development** - Visualize optimization pipeline

## Performance Considerations

- Semantic prioritization requires embeddings (async)
- Compression strategies are applied sequentially
- Summarization is the slowest operation
- Consider caching embeddings for repeated messages

## Limitations

- Token estimation is approximate (consider `tiktoken` for production)
- Summarization requires external function
- Semantic operations require embedding provider
- Some strategies are model-specific

## Examples

See:
- [Advanced Example Component](../src/prompt/examples/advanced-optimization-example.tsx)
- [Basic Optimization Guide](./prompt-optimization.md)

## API Reference

### Core Functions

- `optimizePrompt(options)` - Full optimization engine
- `prioritizeContext(messages, options)` - Semantic prioritization
- `compressContext(messages, options)` - Compression pipeline
- `chooseOptimizationStrategy(options)` - Strategy routing
- `applyPromptStyle(messages, options)` - Style transformation
- `chooseModel(criteria, models)` - Model routing

### React Hooks

- `usePromptOptimizer(options)` - Full optimization hook
- `useDynamicModelRouting(options)` - Model routing hook
- `usePromptDebugger(options)` - Debugging hook

### Model Profiles

- `getModelProfile(name)` - Get profile by name
- `MODEL_PROFILES` - All pre-configured profiles

### DSL Extensions

- `system(content, options)` - System message with metadata
- `user(content, options)` - User message with metadata
- `assistant(content, options)` - Assistant message with metadata
- `tool(content, options)` - Tool message with compression
- `createScopedBlock(name, messages, options)` - Scoped block

## See Also

- [Basic Prompt Optimization](./prompt-optimization.md)
- [Prompt Recipes](../src/prompt/README.md)
- [Model Profiles](../src/prompt/core/model-profiles.ts)
