# Advanced Prompt Optimization

This document covers the advanced prompt optimization features in Clarity AI Chat Components, including dynamic compression, semantic prioritization, contextual pruning, model-specific routing, cost optimization, and multi-turn prompt shaping.

## Overview

The advanced prompt optimization layer transforms Clarity into a state-of-the-art prompt optimization subsystem that intelligently shapes prompts, compresses state, prioritizes context, routes models, and maintains token budgets in real time.

## Features

### 1. Weighted Semantic Prioritization

Prioritize messages based on multiple signals:

- **Message recency**: More recent messages are weighted higher
- **Semantic relevance**: Messages similar to the current query score higher
- **Role priority**: System > Tool > User > Assistant
- **Importance tags**: Custom priority scores from the DSL
- **Memory retrieval relevance**: Integration with memory/retrieval systems

```typescript
import { prioritizeContext } from '@clarity-chat/react/prompt'

const prioritized = prioritizeContext(messages, {
  weights: {
    recency: 0.3,
    semanticRelevance: 0.4,
    rolePriority: 0.2,
    importanceTags: 0.05,
    memoryRelevance: 0.05,
  },
  queryText: 'What is React?',
})
```

### 2. Contextual Compression Chain

Multi-stage compression pipeline:

1. **Semantic grouping**: Cluster messages into topics
2. **Tool-output condensation**: Compress verbose tool responses
3. **Intent-preserving summarization**: Produce compact conversation summaries

```typescript
import { compressContext } from '@clarity-chat/react/prompt'

const compressed = compressContext(messages, {
  strategies: [
    'semantic-grouping',
    'tool-output-condensing',
    'intent-preserving-summarization',
  ],
  targetRatio: 0.5,
  preserveSystem: true,
})
```

### 3. Adaptive Token Strategy Routing

Intelligently choose optimization strategies based on:

- Current token count vs target
- Model capabilities
- Cost constraints

```typescript
import { chooseOptimizationStrategy } from '@clarity-chat/react/prompt'

const route = chooseOptimizationStrategy({
  currentTokens: 5000,
  targetTokens: 4000,
  model: { id: 'gpt-4', maxTokens: 8192 },
  costBudget: 0.10,
})

// Returns:
// {
//   strategy: 'moderate-compression',
//   actions: ['semantic-grouping', 'drop-low-priority'],
//   estimatedSavings: 1500,
//   estimatedSavingsPercent: 30,
//   aggressiveness: 3
// }
```

### 4. Model-Aware Optimization

#### Model Capability Profiles

Pre-defined profiles for major models:

- GPT-4 family (gpt-4, gpt-4-turbo, gpt-4o, gpt-4o-mini)
- Claude 3.x family (opus, sonnet, haiku)
- Gemini 1.5 family (pro, flash)
- Mistral family (large, small)

```typescript
import { getModelProfile, MODEL_PROFILES } from '@clarity-chat/react/prompt'

const profile = getModelProfile('gpt-4')
// Returns model capabilities, costs, optimal prompt style, etc.
```

#### Prompt Style Transformations

Transform prompts based on model preferences:

- **Concise**: Remove verbose phrases, shorten sentences
- **Dense**: Merge related sentences, remove filler
- **Structured**: Ensure consistent formatting
- **Verbose**: Keep as-is, add context markers

```typescript
import { applyPromptStyle, transformMessagesForModel } from '@clarity-chat/react/prompt'

const concise = applyPromptStyle(prompt, 'concise')
const transformed = transformMessagesForModel(messages, profile)
```

### 5. Prompt Optimization Engine

The core engine that orchestrates all optimization stages:

```typescript
import { optimizePrompt } from '@clarity-chat/react/prompt'

const result = await optimizePrompt({
  toonDefinition: myRecipe,
  messages: chatMessages,
  memoryContext: memoryMessages,
  modelProfile: { id: 'gpt-4', maxTokens: 8192 },
  targetTokens: 4000,
  strategies: ['hybrid'],
  debug: true,
})

// Returns:
// {
//   messages: CoreMessage[],
//   tokenStats: { originalTokens, optimizedTokens, savings, ... },
//   costEstimate: { originalCost, optimizedCost, savings },
//   diagnostics: { stages, compressionStats, ... },
//   strategy: 'moderate-compression'
// }
```

## React Hooks

### usePromptOptimizer

Wrap the full optimization engine:

```typescript
import { usePromptOptimizer } from '@clarity-chat/react/prompt'

const {
  optimizedMessages,
  tokenStats,
  costEstimate,
  diagnostics,
  strategy,
  isOptimizing,
  optimize,
} = usePromptOptimizer({
  toon: myRecipe,
  messages: chatMessages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetTokens: 4000,
  autoOptimize: true,
  costBudget: 0.10,
})
```

### useDynamicModelRouting

Intelligently route to different models:

```typescript
import { useDynamicModelRouting } from '@clarity-chat/react/prompt'

const { decision, getBestModel } = useDynamicModelRouting({
  messages: chatMessages,
  currentModel: { id: 'gpt-4', maxTokens: 8192 },
  availableModels: [
    { model: { id: 'gpt-4', maxTokens: 8192 } },
    { model: { id: 'gpt-4o-mini', maxTokens: 128000 } },
  ],
  targetTokens: 4000,
  costBudget: 0.10,
})

if (decision.shouldSwitch) {
  // Switch to decision.recommendedModel
}
```

### usePromptDebugger

Step-by-step optimization history:

```typescript
import { usePromptDebugger } from '@clarity-chat/react/prompt'

const { debugInfo, exportDebugInfo } = usePromptDebugger({
  result: optimizationResult,
  originalMessages: messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  enabled: true,
})

// debugInfo contains:
// - stages: OptimizationStage[]
// - messageBreakdown: MessageTokenBreakdown[]
// - compressionLogs: string[]
// - routingDecisions: string[]
// - dslTransformations: string[]
```

## DSL Extensions (toon)

### Metadata Tags

Add importance and priority to sections:

```typescript
import { system, user, assistant } from '@clarity-chat/react/prompt'

const recipe = createPromptRecipe({
  id: 'chatbot',
  system: system('You are helpful.', {
    importance: 5,
    priority: 'critical',
  }),
  user: user('{{message}}', {
    importance: 3,
    priority: 'high',
  }),
})
```

### Scoped Blocks

Group related sections:

```typescript
import { scopedBlock } from '@clarity-chat/react/prompt'

const searchBlock = scopedBlock('SearchResults', {
  importance: 1,
  compression: { strategy: 'semantic' },
  sections: [
    user('Search query: {{query}}'),
    assistant('Results: {{results}}'),
  ],
})
```

### Compression Rules

Inline compression rules:

```typescript
import { longResponse, compressionRule } from '@clarity-chat/react/prompt'

const long = longResponse('Very long response...', 'semantic')
```

## Examples

### Basic Optimization

```typescript
import { usePromptOptimizer } from '@clarity-chat/react/prompt'

function ChatComponent() {
  const { optimizedMessages, tokenStats } = usePromptOptimizer({
    messages: chatMessages,
    model: { id: 'gpt-4', maxTokens: 8192 },
    targetTokens: 4000,
    autoOptimize: true,
  })

  return <ChatWindow messages={optimizedMessages} />
}
```

### Model Routing

```typescript
import { useDynamicModelRouting } from '@clarity-chat/react/prompt'

function AdaptiveChat() {
  const { decision } = useDynamicModelRouting({
    messages: chatMessages,
    currentModel: currentModel,
    availableModels: availableModels,
    targetTokens: 4000,
  })

  if (decision.shouldSwitch) {
    // Automatically switch to decision.recommendedModel
  }
}
```

### Full Pipeline

```typescript
import {
  usePromptOptimizer,
  useDynamicModelRouting,
  usePromptDebugger,
} from '@clarity-chat/react/prompt'

function AdvancedChat() {
  // Optimize prompts
  const optimizer = usePromptOptimizer({
    messages: chatMessages,
    model: currentModel,
    targetTokens: 4000,
  })

  // Route models
  const routing = useDynamicModelRouting({
    messages: optimizer.optimizedMessages,
    currentModel: currentModel,
    availableModels: availableModels,
  })

  // Debug
  const debugger = usePromptDebugger({
    result: optimizer.result,
    enabled: true,
  })

  return (
    <div>
      <ChatWindow messages={optimizer.optimizedMessages} />
      <DebugPanel info={debugger.debugInfo} />
    </div>
  )
}
```

## Best Practices

1. **Start with auto-optimize**: Enable `autoOptimize: true` for automatic optimization
2. **Set realistic budgets**: Use 80% of model's max tokens as target
3. **Monitor costs**: Set `costBudget` to prevent unexpected charges
4. **Use model routing**: Let the system choose the best model automatically
5. **Enable debugging**: Use `usePromptDebugger` during development
6. **Tag important messages**: Use metadata tags to preserve critical context
7. **Test strategies**: Compare different strategies to find what works best

## Performance Considerations

- Token estimation is fast (approximate, not exact)
- Compression is synchronous for small message sets
- Large message sets may benefit from async compression
- Model routing is lightweight (no API calls)
- Debugging adds minimal overhead when disabled

## Limitations

- Token estimation is approximate (not exact)
- Semantic similarity uses simple word overlap (not embeddings)
- Compression may lose some context nuance
- Model routing doesn't account for latency/availability
- Cost estimates are approximate (actual costs may vary)

## Future Enhancements

- Integration with actual embedding models for semantic similarity
- Real-time cost tracking and alerts
- Advanced compression strategies (LLM-based summarization)
- Model availability and latency tracking
- Custom optimization strategies
