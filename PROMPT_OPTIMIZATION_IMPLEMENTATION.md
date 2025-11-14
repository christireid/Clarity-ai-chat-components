# Prompt & Token Optimization Layer - Implementation Summary

## Overview

Successfully implemented a comprehensive prompt and token optimization layer for Clarity AI Chat Components. This is an **optional addon layer** that provides advanced control over prompt composition and token management without breaking existing functionality.

## New Exports

### Core Utilities (Framework-Agnostic)

Located in `packages/react/src/prompt/core/`:

#### Prompt DSL (toon)
- `createPromptRecipe(template)` - Create composable prompt recipes
- `createSimpleRecipe(system, user, variables?)` - Create simple recipes
- `composeRecipes(recipes)` - Compose multiple recipes

#### Token Estimation
- `estimatePromptTokens(prompt, options?)` - Estimate tokens for resolved prompts
- `estimateMessageArrayTokens(messages, options?)` - Estimate tokens for message arrays
- `estimateMessageTokens(message, options?)` - Estimate tokens for single messages
- `estimatePromptCost(prompt, model)` - Estimate cost in USD
- `estimateMessageArrayCost(messages, model)` - Estimate cost for message arrays
- `getModelMetadata(modelId)` - Get built-in model metadata (GPT-4, Claude, Gemini, etc.)

#### Message Optimization
- `optimizeMessagesForBudget(messages, targetTokens, options?)` - Optimize messages to fit budget
- `summarizeHistoryForCompression(messages, targetTokens, summarizeFn?)` - Summarize conversation history

#### Build Model Prompt
- `buildModelPrompt(options)` - Build complete model-ready prompts from components

### React Hooks

Located in `packages/react/src/prompt/hooks/`:

- `usePromptRecipe(options)` - Build prompts from recipes with variables
- `useTokenBudget(options)` - Track token usage and budget management
- `useOptimizedChatContext(options)` - Auto-optimize chat context for token budgets
- `usePromptInspector(options)` - Dev tool for inspecting prompt composition and token usage

### useClarityChat Integration

Enhanced `useClarityChat` hook with optional `promptOptimization` config:

```tsx
const { messages, tokenStats } = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
    model: {
      id: 'gpt-4',
      maxTokens: 8192,
      inputPricePer1K: 0.03,
    },
  },
})
```

Returns `tokenStats` with:
- `currentTokens` - Current token count
- `targetTokens` - Target budget
- `remainingTokens` - Remaining budget
- `isExceeded` - Budget exceeded flag
- `usagePercent` - Percentage of budget used
- `lastOptimizationReason` - Human-readable optimization reason

## File Structure

```
packages/react/src/prompt/
├── core/
│   ├── types.ts              # Type definitions
│   ├── dsl.ts                # Prompt DSL (toon) implementation
│   ├── token-estimation.ts   # Token counting and estimation
│   ├── message-optimization.ts # Message optimization strategies
│   ├── build-prompt.ts       # Build model-ready prompts
│   └── index.ts              # Core exports
├── hooks/
│   ├── use-prompt-recipe.ts
│   ├── use-token-budget.ts
│   ├── use-optimized-chat-context.ts
│   ├── use-prompt-inspector.ts
│   └── index.ts
├── examples/
│   └── optimized-chat-example.tsx
├── index.ts                  # Main exports
└── README.md
```

## Key Features

### 1. Prompt DSL (toon)

Lightweight prompt composition system with:
- Variable substitution (`{{variable}}`)
- Role-based sections (system, user, assistant)
- Composable recipes
- Type-safe variable definitions

**Example:**
```tsx
const recipe = createPromptRecipe({
  id: 'chatbot',
  system: 'You are {{name}}, a helpful assistant.',
  user: '{{message}}',
  variables: [
    { name: 'name', required: true },
    { name: 'message', required: true },
  ],
})

const prompt = recipe.build({ name: 'Clarity', message: 'Hello!' })
```

### 2. Token Estimation

Model-aware token counting with:
- Built-in support for GPT-4, Claude, Gemini
- Pluggable tokenizers
- Cost estimation
- Character-based approximation (fallback)

**Example:**
```tsx
const tokens = estimateMessageArrayTokens(messages, { model: 'gpt-4' })
const cost = estimateMessageArrayCost(messages, modelMetadata)
```

### 3. Message Optimization

Four optimization strategies:

1. **sliding-window**: Keep most recent N messages
2. **summarize-old**: Summarize older messages, keep recent
3. **drop-low-priority**: Drop low-priority messages
4. **hybrid**: Combine multiple strategies

**Example:**
```tsx
const { messages, diagnostics } = await optimizeMessagesForBudget(
  messages,
  4000,
  {
    strategy: 'hybrid',
    model: { id: 'gpt-4', maxTokens: 8192 },
  }
)
```

### 4. React Integration

Hooks for easy React integration:

```tsx
// Track budget
const { currentTokens, remainingBudget, optimize } = useTokenBudget({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetBudget: 4000,
})

// Auto-optimize
const { optimizedMessages, tokenStats } = useOptimizedChatContext({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetTokens: 4000,
  strategy: 'hybrid',
})

// Inspect (dev tool)
const { inspection } = usePromptInspector({
  messages,
  model: 'gpt-4',
  enabled: process.env.NODE_ENV === 'development',
})
```

## Integration with useClarityChat

The optimization layer integrates seamlessly with `useClarityChat`:

1. **Opt-in**: Only enabled when `promptOptimization.enabled` is `true`
2. **Non-breaking**: Default behavior unchanged when not enabled
3. **Synchronous optimization**: Basic sliding window in transform function
4. **Token stats**: Exposed via `tokenStats` return value

## Model Support

Built-in metadata for:
- GPT-4, GPT-4 Turbo, GPT-3.5 Turbo
- Claude 3 Opus, Sonnet, Haiku
- Claude 2
- Gemini Pro, Ultra

Custom models can be provided via model metadata object.

## Documentation

- **Main Documentation**: `docs/prompt-optimization.md`
- **Package README**: `packages/react/src/prompt/README.md`
- **Example Component**: `packages/react/src/prompt/examples/optimized-chat-example.tsx`

## Usage Examples

### Basic: Enable in useClarityChat

```tsx
const { messages, tokenStats } = useClarityChat({
  api: '/api/chat',
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
  },
})
```

### Advanced: Custom Optimization

```tsx
import {
  useOptimizedChatContext,
  usePromptInspector,
} from '@clarity-chat/react/prompt'

const { optimizedMessages, tokenStats } = useOptimizedChatContext({
  messages,
  model: { id: 'gpt-4', maxTokens: 8192 },
  targetTokens: 4000,
  strategy: 'hybrid',
})
```

### Debug: Inspect Prompts

```tsx
const { inspection } = usePromptInspector({
  messages,
  model: 'gpt-4',
  enabled: true,
})

// Render debug panel
{inspection && (
  <div>
    <div>Total: {inspection.totalTokens} tokens</div>
    {inspection.messageBreakdown.map(msg => (
      <div key={msg.message.id}>
        {msg.role}: {msg.tokens} tokens
      </div>
    ))}
  </div>
)}
```

## Dependencies

- Uses existing `TokenCounter` from `packages/react/src/memory/token-optimizer.ts`
- Integrates with `useClarityChat` hook
- No external dependencies (uses built-in token estimation)

## Testing Considerations

- Token estimation is approximate (character-based)
- For production, integrate with `tiktoken` or model-specific tokenizers
- Optimization strategies should be tested with real conversations
- Monitor token stats to verify optimization effectiveness

## Future Enhancements

Potential improvements:
1. Integrate with `tiktoken` for accurate tokenization
2. Add more sophisticated summarization (LLM-based)
3. Support for streaming optimization
4. Caching of optimized messages
5. Custom optimization strategies via plugins

## Success Criteria Met

✅ **React-friendly**: Hooks for app developers  
✅ **Framework-agnostic core**: Pure TypeScript utilities  
✅ **Model-agnostic**: Works with OpenAI, Anthropic, etc.  
✅ **Safe to opt into**: No breaking changes  
✅ **Under 10 lines to enable**: Simple config in `useClarityChat`  
✅ **Clear token stats**: Exposed via `tokenStats`  
✅ **Smart optimization**: Multiple strategies available  
✅ **Model-aware**: Built-in support for common models  

## Summary

The prompt and token optimization layer is now fully implemented and ready for use. It provides:

- **5 core utilities** for prompt composition and optimization
- **4 React hooks** for easy integration
- **Seamless integration** with `useClarityChat`
- **Comprehensive documentation** and examples
- **Zero breaking changes** to existing APIs

Users can enable optimization in under 10 lines of code and get immediate visibility into token usage and optimization results.
