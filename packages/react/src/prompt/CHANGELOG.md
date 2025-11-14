# Prompt & Token Optimization Layer - Changelog

## Initial Implementation

### Core Features

- **Prompt DSL (toon)**: Lightweight prompt composition system with variable substitution
- **Token Estimation**: Model-aware token counting with support for GPT-4, Claude, Gemini
- **Message Optimization**: Four strategies (sliding-window, summarize-old, drop-low-priority, hybrid)
- **React Hooks**: Four hooks for easy React integration
- **useClarityChat Integration**: Optional prompt optimization via hook config

### Core Utilities

- `createPromptRecipe()` - Create composable prompt recipes
- `createSimpleRecipe()` - Create simple recipes
- `composeRecipes()` - Compose multiple recipes
- `estimatePromptTokens()` - Estimate tokens for prompts
- `estimateMessageArrayTokens()` - Estimate tokens for message arrays
- `optimizeMessagesForBudget()` - Optimize messages to fit token budget
- `summarizeHistoryForCompression()` - Summarize conversation history
- `buildModelPrompt()` - Build model-ready prompts

### React Hooks

- `usePromptRecipe()` - Build prompts from recipes
- `useTokenBudget()` - Track token usage and budget
- `useOptimizedChatContext()` - Auto-optimize chat context
- `usePromptInspector()` - Dev tool for prompt inspection

### Pre-built Recipes

- `createChatbotRecipe()` - Chatbot assistant
- `createQARecipe()` - Q&A assistant
- `createCodeAssistantRecipe()` - Code assistant
- `createToolAgentRecipe()` - Tool-using agent
- `createSummarizationRecipe()` - Text summarization
- `createTranslationRecipe()` - Translation assistant

### Utilities

- `exceedsTokenBudget()` - Check if messages exceed budget
- `getTokenUsagePercent()` - Get usage percentage
- `formatTokenCount()` - Format token count for display
- `formatCost()` - Format cost for display
- `getTokenBudgetStatus()` - Get budget status (safe/warning/exceeded)
- `estimateTotalCost()` - Estimate total cost (input + output)

### useClarityChat Integration

Added optional `promptOptimization` config:

```tsx
const { messages, tokenStats } = useClarityChat({
  promptOptimization: {
    enabled: true,
    targetTokens: 4000,
    strategy: 'sliding-window',
    model: { id: 'gpt-4', maxTokens: 8192 },
  },
})
```

Returns `tokenStats` with:
- `currentTokens` - Current token count
- `targetTokens` - Target budget
- `remainingTokens` - Remaining budget
- `isExceeded` - Budget exceeded flag
- `usagePercent` - Usage percentage
- `lastOptimizationReason` - Optimization reason

### Examples

- `optimized-chat-example.tsx` - Complete chat with optimization and debug panel
- `prompt-recipe-example.tsx` - Examples of using prompt recipes

### Documentation

- `docs/prompt-optimization.md` - Complete user guide
- `packages/react/src/prompt/README.md` - Package documentation
- `PROMPT_OPTIMIZATION_IMPLEMENTATION.md` - Implementation summary
