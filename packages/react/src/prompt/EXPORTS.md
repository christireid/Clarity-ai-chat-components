# Prompt & Token Optimization - Exports Reference

Complete list of exports from `@clarity-chat/react/prompt`.

## Core Utilities

### Toon DSL

```tsx
import {
  toon,
  ToonBuilder,
  ToonNode,
  ToonText,
  ToonVariable,
  ToonSection,
  ToonRole,
  ToonSequence,
  ToonConditional,
  renderToon,
  toonToMessages,
} from '@clarity-chat/react/prompt'
```

### Token Estimation

```tsx
import {
  Tokenizer,
  ApproximateTokenizer,
  ModelMetadata,
  MODEL_PRESETS,
  estimatePromptTokens,
  estimateMessageTokens,
  getTokenizerForModel,
  estimateCost,
} from '@clarity-chat/react/prompt'
```

### Prompt Recipes

```tsx
import {
  PromptRecipe,
  RecipeBuilderOptions,
  createPromptRecipe,
  buildMessagesFromRecipe,
  BUILT_IN_RECIPES,
} from '@clarity-chat/react/prompt'
```

### Message Optimization

```tsx
import {
  OptimizationStrategy,
  MessagePriority,
  OptimizationDiagnostics,
  OptimizeMessagesOptions,
  optimizeMessagesForBudget,
  summarizeHistoryForCompression,
} from '@clarity-chat/react/prompt'
```

### Model Prompt Builder

```tsx
import {
  BuildModelPromptOptions,
  BuildModelPromptResult,
  buildModelPrompt,
} from '@clarity-chat/react/prompt'
```

## React Hooks

```tsx
import {
  usePromptRecipe,
  UsePromptRecipeOptions,
  UsePromptRecipeReturn,
  useTokenBudget,
  UseTokenBudgetOptions,
  UseTokenBudgetReturn,
  useOptimizedChatContext,
  UseOptimizedChatContextOptions,
  UseOptimizedChatContextReturn,
  usePromptInspector,
  UsePromptInspectorOptions,
  UsePromptInspectorReturn,
} from '@clarity-chat/react/prompt'
```

## Utility Functions

### Formatting & Display
```tsx
import {
  formatTokenCount,
  formatCost,
  calculateUtilization,
  getUtilizationColor,
} from '@clarity-chat/react/prompt'
```

### Token Analysis
```tsx
import {
  estimateConversationTokens,
  exceedsTokenBudget,
  getTokenBreakdownByRole,
} from '@clarity-chat/react/prompt'
```

### Recommendations & Summarization
```tsx
import {
  getOptimizationRecommendation,
  createSimpleSummarizer,
} from '@clarity-chat/react/prompt'
```

## useClarityChat Integration

```tsx
import {
  useClarityChat,
  ClarityPromptOptimizationOptions,
  ClarityChatTokenStats,
} from '@clarity-chat/react'

// ClarityPromptOptimizationOptions is part of UseClarityChatOptions
// ClarityChatTokenStats is part of UseClarityChatReturn
```

## Type Exports

All types are exported and can be imported directly:

```tsx
import type {
  // Toon DSL
  ToonNode,
  ToonText,
  ToonVariable,
  ToonSection,
  ToonRole,
  ToonSequence,
  ToonConditional,
  
  // Token estimation
  Tokenizer,
  ModelMetadata,
  
  // Recipes
  PromptRecipe,
  
  // Optimization
  OptimizationStrategy,
  MessagePriority,
  OptimizationDiagnostics,
  OptimizeMessagesOptions,
  
  // Builder
  BuildModelPromptOptions,
  BuildModelPromptResult,
  
  // Hooks
  UsePromptRecipeOptions,
  UsePromptRecipeReturn,
  UseTokenBudgetOptions,
  UseTokenBudgetReturn,
  UseOptimizedChatContextOptions,
  UseOptimizedChatContextReturn,
  UsePromptInspectorOptions,
  UsePromptInspectorReturn,
} from '@clarity-chat/react/prompt'
```
