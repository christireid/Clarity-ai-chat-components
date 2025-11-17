# Prompt & Token Optimization - Phase 2 Complete

## Overview

Phase 2 extends the basic prompt optimization layer with advanced features for intelligent, model-aware, cost-aware prompt shaping.

## Quick Start

```tsx
import { usePromptOptimizer } from '@clarity-chat/react/prompt'

function MyChat() {
  const optimizer = usePromptOptimizer({
    messages: myMessages,
    model: 'gpt-4',
    targetTokens: 4000,
    autoOptimize: true,
  })

  return (
    <div>
      {optimizer.optimizedMessages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <div>Tokens: {optimizer.tokenStats.inputTokens}</div>
    </div>
  )
}
```

## Key Features

### 1. Model-Aware Optimization
- 12+ model profiles (GPT, Claude, Gemini, Mistral)
- Optimal prompt styles per model
- Cost-aware routing

### 2. Semantic Prioritization
- Multi-signal message ranking
- Embedding-based relevance
- Importance tags from DSL

### 3. Multi-Pass Compression
- Semantic grouping
- Tool output condensing
- Intent-preserving summarization

### 4. Adaptive Strategy Routing
- Automatic strategy selection
- Budget-aware decisions
- Model switching recommendations

### 5. Compiler-Like Pipeline
- Lexing → Structuring → Analysis → Optimization → Emission
- Stage-by-stage diagnostics
- Full transparency

## Documentation

- **[ADVANCED.md](./ADVANCED.md)** - Complete Phase 2 documentation
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide
- **[README.md](./README.md)** - Phase 1 documentation
- **[PHASE2_COMPLETE.md](./PHASE2_COMPLETE.md)** - Implementation summary

## Examples

See `apps/examples/advanced-prompt-optimization-example.tsx` for:
- Chat with real-time optimization
- Toon DSL with advanced features
- Model switching visualization

## API Reference

### Hooks

- `usePromptOptimizer` - Main optimization hook
- `useDynamicModelRouting` - Model routing hook
- `usePromptDebugger` - Debug visualization hook

### Core Utilities

- `optimizePrompt` - Optimization engine
- `prioritizeContext` - Semantic prioritization
- `compressContext` - Compression pipeline
- `chooseOptimizationStrategy` - Strategy routing
- `applyPromptStyleToMessages` - Style transformations

### Model Profiles

- `MODEL_PROFILES` - Model registry
- `getModelProfile` - Get profile by name
- `getModelProfileOrDefault` - Get with fallback

## Status

✅ Phase 2 Complete  
✅ All features implemented  
✅ Documentation complete  
✅ Examples provided  
✅ Zero breaking changes  
