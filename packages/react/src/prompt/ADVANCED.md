# Advanced Prompt Optimization

This document covers Phase 2 features: advanced token optimization, semantic prioritization, compression chains, model-aware routing, and the prompt optimization engine.

## Overview

Phase 2 extends the basic prompt optimization layer with:

- **Weighted Semantic Prioritization** - Prioritize messages by recency, semantic relevance, role, importance tags, and memory relevance
- **Contextual Compression Chain** - Multi-pass compression (semantic grouping, tool-output condensing, intent-preserving summarization)
- **Adaptive Strategy Routing** - Intelligently choose optimization strategies based on token usage and model capabilities
- **Model-Aware Optimization** - Model-specific prompt style transformations and capability profiles
- **Prompt Optimization Engine** - Compiler-like pipeline (lexing → structuring → analysis → optimization → emission)
- **Dynamic Model Routing** - Route to different models based on token budget, cost budget, and request complexity
- **Advanced Debugging** - Step-by-step optimization history, compression logs, and visualization

## Quick Start

### Basic Usage

```tsx
import { usePromptOptimizer } from '@clarity-chat/react/prompt'

function MyComponent() {
  const optimizer = usePromptOptimizer({
    messages: myMessages,
    model: 'gpt-4',
    targetTokens: 4000,
    autoOptimize: true,
  })

  return (
    <div>
      <div>Tokens: {optimizer.tokenStats.inputTokens}</div>
      <div>Remaining: {optimizer.tokenStats.remainingBudget}</div>
      {optimizer.optimizedMessages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
```

### With Toon DSL

```tsx
import { usePromptOptimizer, toon } from '@clarity-chat/react/prompt'

const prompt = toon()
  .roleWithMetadata('system', (b) => 
    b.text('You are helpful.')
      .importantText('Always be concise.', 8),
    { importance: 9 }
  )
  .scopedSection('Context', 'user-context', (b) => 
    b.variable('userInput'),
    { importance: 5, compressible: true }
  )
  .build()

const optimizer = usePromptOptimizer({
  toon: prompt,
  variables: { userInput: 'Hello!' },
  model: 'gpt-4',
  targetTokens: 2000,
})
```

## Core Concepts

### 1. Semantic Prioritization

Messages are scored and ranked by multiple signals:

- **Recency** (30% weight) - More recent messages score higher
- **Semantic Relevance** (40% weight) - Similarity to user intent (via embeddings)
- **Role Priority** (20% weight) - system > tool > user > assistant
- **Importance Tags** (5% weight) - From toon DSL metadata
- **Memory Relevance** (5% weight) - From memory retrieval scores

```tsx
import { prioritizeContext } from '@clarity-chat/react/prompt'

const prioritized = await prioritizeContext({
  messages: myMessages,
  userIntent: 'What is the weather?',
  importanceTags: { 'msg-1': 0.9, 'msg-2': 0.3 },
  getEmbedding: async (text) => {
    // Your embedding function
    return await fetch('/api/embed', { body: text }).then(r => r.json())
  },
})
```

### 2. Compression Chain

Multi-pass compression pipeline:

1. **Semantic Grouping** - Cluster consecutive messages by role/topic
2. **Tool Output Condensing** - Compress verbose tool responses (>500 tokens)
3. **Intent-Preserving Summarization** - Summarize old messages (keep last 3)

```tsx
import { compressContext } from '@clarity-chat/react/prompt'

const result = await compressContext({
  messages: myMessages,
  strategies: ['semantic-grouping', 'tool-output-condensing', 'intent-preserving-summarization'],
  summarizeFn: async (messages) => {
    // Your summarization function
    return await summarize(messages)
  },
})
```

### 3. Strategy Routing

Automatically chooses optimization strategy:

- **> 130% budget** → Aggressive compression (intent-preserving-summarization)
- **100-130% budget** → Hybrid (semantic grouping + drop low-value)
- **85-100% budget** → Light compression (semantic grouping)
- **< 85% budget** → No compression

```tsx
import { chooseOptimizationStrategy } from '@clarity-chat/react/prompt'

const decision = chooseOptimizationStrategy({
  currentTokens: 5000,
  targetTokens: 4000,
  model: 'gpt-4',
})

console.log(decision.strategy) // 'intent-preserving-summarization'
console.log(decision.estimatedSavings) // 2000
console.log(decision.reasoning) // 'Budget exceeded by 25%...'
```

### 4. Model Profiles

Model-specific capabilities and preferences:

```tsx
import { MODEL_PROFILES, getModelProfile } from '@clarity-chat/react/prompt'

const profile = getModelProfile('gpt-4')
// {
//   name: 'gpt-4',
//   maxTokens: 8192,
//   optimalPromptStyle: 'structured',
//   costPer1K: 0.03,
//   compressionThreshold: 0.80,
//   prefersStructured: true,
// }
```

Supported models:
- GPT-4.1, GPT-4.1-mini, GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- Claude 3 Opus, Sonnet, Haiku
- Gemini 1.5 Pro, Gemini 1.5 Flash
- Mistral Large, Mistral Small

### 5. Prompt Style Transformations

Transform prompts for model preferences:

- **Concise** - Shorten verbose messages, extract key points
- **Dense** - Merge related messages
- **Structured** - Format with clear sections
- **Verbose** - No transformation

```tsx
import { applyPromptStyleToMessages } from '@clarity-chat/react/prompt'

const transformed = applyPromptStyleToMessages(messages, {
  modelProfile: getModelProfile('gpt-3.5-turbo'), // Prefers 'concise'
  mergeRelated: true,
})
```

### 6. Optimization Engine

Compiler-like pipeline:

1. **Lexing** - Convert inputs to messages
2. **Structuring** - Apply prompt style transformation
3. **Analysis** - Semantic prioritization
4. **Optimization** - Compression and pruning
5. **Emission** - Final optimized prompt

```tsx
import { optimizePrompt } from '@clarity-chat/react/prompt'

const result = await optimizePrompt({
  toonDefinition: myToon,
  messages: myMessages,
  memoryContext: myMemory,
  modelProfile: 'gpt-4',
  targetTokens: 4000,
  debug: true,
})

console.log(result.diagnostics.stages)
// [
//   { name: 'lexing', tokensBefore: 0, tokensAfter: 5000, ... },
//   { name: 'structuring', tokensBefore: 5000, tokensAfter: 4800, ... },
//   { name: 'analysis', tokensBefore: 4800, tokensAfter: 4800, ... },
//   { name: 'optimization', tokensBefore: 4800, tokensAfter: 3800, ... },
//   { name: 'emission', tokensBefore: 3800, tokensAfter: 3800, ... },
// ]
```

## React Hooks

### usePromptOptimizer

Main hook for prompt optimization:

```tsx
const optimizer = usePromptOptimizer({
  toon: myToon,
  messages: myMessages,
  model: 'gpt-4',
  targetTokens: 4000,
  autoOptimize: true,
  applyStyleTransformation: true,
})

// optimizer.optimizedMessages
// optimizer.tokenStats
// optimizer.costEstimate
// optimizer.diagnostics
// optimizer.optimize() // Manual trigger
// optimizer.isOptimizing
// optimizer.error
```

### useDynamicModelRouting

Intelligent model routing:

```tsx
const routing = useDynamicModelRouting({
  currentModel: 'gpt-4',
  targetTokens: 4000,
  costBudget: 0.1,
  messages: myMessages,
})

// routing.currentModelProfile
// routing.routingDecision
// routing.chooseModel(input, contextStats)
// routing.getAvailableModels()
// routing.getModelsWithinBudget(costBudget, estimatedTokens)
```

### usePromptDebugger

Debug visualization:

```tsx
const debugger = usePromptDebugger({
  diagnostics: optimizer.diagnostics,
  routingDecision: routing.routingDecision,
  messagesBefore: messages,
  messagesAfter: optimizer.optimizedMessages,
  detailed: true,
})

// debugger.optimizationHistory
// debugger.compressionLogs
// debugger.dslTransformations
// debugger.modelRoutingLog
// debugger.tokenGraph
// debugger.summary
// debugger.formattedView
```

## Toon DSL Extensions

### Importance Tags

```tsx
toon()
  .roleWithMetadata('system', (b) => b.text('...'), { importance: 9 })
  .importantText('Critical instruction', 8)
  .scopedSection('Context', 'scope', (b) => b.text('...'), { importance: 5 })
```

### Scoped Blocks

```tsx
toon()
  .scopedSection('SearchResults', 'search-results', (b) => 
    b.text('Results...'),
    { importance: 1, compressible: true }
  )
```

### Compression Hints

```tsx
toon()
  .longResponse('assistant', (b) => b.text('Long response...'), 'semantic')
  .roleWithMetadata('user', (b) => b.text('...'), { 
    compressStrategy: 'aggressive' 
  })
```

### Semantic Annotation

```tsx
toon()
  .text('Content', { 
    semanticSignature: [0.1, 0.2, 0.3], // Embedding vector
    importance: 7 
  })
```

## Examples

See `apps/examples/advanced-prompt-optimization-example.tsx` for complete examples:

1. **AdvancedOptimizedChat** - Chat with real-time optimization visualization
2. **ToonDSLAdvancedExample** - Using toon DSL with importance tags
3. **ModelSwitchingExample** - Dynamic model routing visualization

## Best Practices

1. **Enable auto-optimize** for real-time optimization
2. **Set appropriate targetTokens** based on your model's context window
3. **Use importance tags** for critical instructions
4. **Provide summarization function** for best compression results
5. **Monitor diagnostics** to understand optimization behavior
6. **Use model routing** for cost optimization
7. **Enable debug mode** during development

## Performance

- Optimization runs asynchronously
- Stages are cached when inputs don't change
- Token estimation is fast (approximate, ~4 chars per token)
- Semantic prioritization can be slow with embeddings (consider caching)
- Compression is async (depends on summarization function)

## Limitations

- Token estimation is approximate (use tiktoken for accuracy)
- Semantic prioritization requires embeddings (placeholder provided)
- Summarization requires external function (placeholder provided)
- Model switching is recommendation-only (you must implement switching)

## Next Steps

- Integrate with actual embedding APIs
- Add tiktoken for accurate token counting
- Implement model switching in your chat flow
- Add more compression strategies
- Create custom model profiles
