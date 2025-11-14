# Prompt & Token Optimization Layer - Implementation Summary

## Overview

Successfully implemented a comprehensive prompt and token optimization layer for Clarity AI Chat Components, built around the **toon** prompt DSL. This is an optional addon layer that provides advanced control over prompt composition and token management without breaking existing APIs.

## What Was Built

### 1. Toon Prompt DSL (`packages/react/src/prompt/core/toon.ts`)

A composable, type-safe DSL for building prompts:

- **ToonNode types**: `ToonText`, `ToonVariable`, `ToonSection`, `ToonRole`, `ToonSequence`, `ToonConditional`
- **ToonBuilder**: Fluent API for building prompts
- **renderToon()**: Render toon nodes to strings
- **toonToMessages()**: Convert toon nodes to CoreMessage arrays

### 2. Core Utilities (`packages/react/src/prompt/core/`)

#### Tokenizer (`tokenizer.ts`)
- `Tokenizer` interface for pluggable tokenizers
- `ApproximateTokenizer` (4 chars per token)
- `MODEL_PRESETS` with token limits and pricing for common models
- `estimatePromptTokens()` - Estimate tokens for toon nodes
- `estimateMessageTokens()` - Estimate tokens for messages
- `estimateCost()` - Calculate cost estimates

#### Recipe System (`recipe.ts`)
- `createPromptRecipe()` - Create reusable prompt recipes
- `buildMessagesFromRecipe()` - Build messages from recipes
- `BUILT_IN_RECIPES` - Pre-built recipes (chatbot, QA, tool agent, summarizer)

#### Optimizer (`optimizer.ts`)
- `optimizeMessagesForBudget()` - Optimize messages to fit token budget
- Strategies: `sliding-window`, `summarize-old`, `drop-low-priority`, `hybrid`
- `summarizeHistoryForCompression()` - Summarize message history

#### Builder (`builder.ts`)
- `buildModelPrompt()` - Build final, model-ready prompts
- Integrates recipes, memory, user input, and optimization
- Returns token stats and cost estimates

### 3. React Hooks (`packages/react/src/prompt/hooks/`)

#### `usePromptRecipe`
- Build prompts from recipes
- Estimate tokens
- Debug view of composed prompts

#### `useTokenBudget`
- Track token usage
- Calculate remaining budget
- Optimize messages on demand

#### `useOptimizedChatContext`
- Automatically optimize chat context
- Integrates with memory and user input
- Returns optimization diagnostics

#### `usePromptInspector` (Dev Tool)
- Inspect prompt composition
- Token breakdown by role
- Formatted view for debugging

### 4. Integration with useClarityChat

Added optional `promptOptimization` config to `useClarityChat`:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'hybrid',
    model: 'gpt-4',
  },
})

// Access token stats
chat.tokenStats?.inputTokens
chat.tokenStats?.remainingBudget
chat.tokenStats?.wasOptimized
```

## File Structure

```
packages/react/src/prompt/
├── core/
│   ├── toon.ts          # Toon DSL types and builders
│   ├── tokenizer.ts     # Token estimation utilities
│   ├── recipe.ts        # Prompt recipe system
│   ├── optimizer.ts     # Message optimization strategies
│   ├── builder.ts       # Model prompt builder
│   └── index.ts         # Core exports
├── hooks/
│   ├── use-prompt-recipe.ts
│   ├── use-token-budget.ts
│   ├── use-optimized-chat-context.ts
│   ├── use-prompt-inspector.ts
│   └── index.ts
├── index.ts             # Main exports
└── README.md            # Documentation
```

## Key Features

### ✅ Model-Agnostic
- Works with OpenAI, Anthropic, and other models
- Pluggable tokenizers
- Model presets with token limits and pricing

### ✅ Framework-Agnostic Core
- Core utilities are pure TypeScript
- No React dependencies in core layer
- Can be used in any JavaScript/TypeScript project

### ✅ React-Friendly
- Hooks for easy integration
- Composable with existing hooks
- Type-safe with full TypeScript support

### ✅ Opt-in Design
- No breaking changes to existing APIs
- Default behavior unchanged when not enabled
- Can be enabled with a few lines of code

### ✅ Token-Aware
- Real-time token counting
- Budget management
- Automatic optimization strategies
- Cost estimation

## Usage Examples

### Basic Usage (useClarityChat)

```tsx
import { useClarityChat } from '@clarity-chat/react'

const chat = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'hybrid',
  },
})
```

### Advanced Usage (Standalone Hooks)

```tsx
import { useTokenBudget, usePromptInspector } from '@clarity-chat/react'

const budget = useTokenBudget({
  messages,
  modelMetadata: 'gpt-4',
  targetBudget: 4000,
})

const inspector = usePromptInspector({
  messages,
  modelMetadata: 'gpt-4',
})
```

### Toon DSL Usage

```tsx
import { toon } from '@clarity-chat/react/prompt'

const prompt = toon()
  .role('system', (b) => b.text('You are a helpful assistant.'))
  .role('user', (b) => b.variable('input', { required: true }))
  .build()
```

## Exports

### Core Exports (from `@clarity-chat/react/prompt`)

- `toon()` - Create toon builder
- `createPromptRecipe()` - Create prompt recipe
- `BUILT_IN_RECIPES` - Built-in recipes
- `estimatePromptTokens()` - Estimate tokens
- `optimizeMessagesForBudget()` - Optimize messages
- `buildModelPrompt()` - Build model prompt
- `MODEL_PRESETS` - Model presets
- Types: `ToonNode`, `PromptRecipe`, `ModelMetadata`, etc.

### Hook Exports (from `@clarity-chat/react/prompt`)

- `usePromptRecipe()` - Build prompts from recipes
- `useTokenBudget()` - Manage token budgets
- `useOptimizedChatContext()` - Auto-optimize context
- `usePromptInspector()` - Inspect prompts (dev tool)

### useClarityChat Integration

- `promptOptimization` option in `UseClarityChatOptions`
- `tokenStats` in `UseClarityChatReturn`

## Testing

All code is strongly typed with TypeScript. No linter errors.

## Documentation

- `packages/react/src/prompt/README.md` - Comprehensive documentation
- `apps/examples/prompt-optimization-example.tsx` - Complete examples

## Next Steps

1. Add unit tests for core utilities
2. Add integration tests for hooks
3. Consider adding tiktoken integration for accurate token counting
4. Add more built-in recipes
5. Add more optimization strategies

## Success Criteria Met

✅ Developer can turn on prompt & token optimization in under 10 lines  
✅ Clear token stats available  
✅ Smart, model-aware trimming and summarization  
✅ No breaking changes to existing APIs  
✅ Strongly typed with TypeScript  
✅ Clean, idiomatic toon DSL usage  
✅ Good developer experience with sensible defaults  
✅ Clear naming and JSDoc comments  
✅ Realistic examples  
