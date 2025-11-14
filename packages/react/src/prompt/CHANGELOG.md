# Prompt & Token Optimization Layer - Changelog

## [Unreleased]

### Added

#### Core Utilities
- **`createPromptRecipe`** - Composable prompt builder using template system
- **`estimatePromptTokens`** - Model-aware token estimation with pluggable tokenizers
- **`optimizeMessagesForBudget`** - Asynchronous message optimization with multiple strategies
- **`optimizeMessagesForBudgetSync`** - Synchronous message optimization for React transforms
- **`buildModelPrompt`** - High-level API for building and optimizing prompts
- **`getModelMetadata`** - Pre-configured metadata for common models (GPT-4, Claude, etc.)
- **Utility functions** - `formatTokenCount`, `formatCost`, `needsOptimization`, etc.

#### React Hooks
- **`usePromptRecipe`** - React hook for building prompts from recipes
- **`useTokenBudget`** - React hook for managing token budgets and optimization
- **`useOptimizedChatContext`** - React hook for automatic context optimization (async support)
- **`usePromptInspector`** - Dev tool hook for inspecting prompt composition and token usage

#### Integration
- **`useClarityChat` enhancement** - Added optional `promptOptimization` prop for easy opt-in
- **Token stats** - Real-time token statistics exposed via `useClarityChat` return value

#### Optimization Strategies
- **`sliding-window`** - Keep most recent N messages (synchronous)
- **`summarize-old`** - Summarize older messages (asynchronous, requires `summarizeFn`)
- **`drop-low-priority`** - Drop low-priority messages (synchronous)
- **`hybrid`** - Combine multiple strategies (asynchronous)

#### Built-in Recipes
- **`chatbot`** - Standard chatbot conversation recipe
- **`qa`** - Question-answering over documents recipe
- **`agent`** - Tool-using agent recipe

### Features

- **Model-aware optimization** - Different strategies per model class
- **Token estimation** - Approximate counting for OpenAI, Anthropic, and generic models
- **Cost estimation** - Calculate estimated costs based on model pricing
- **Diagnostics** - Detailed information about optimization operations
- **Opt-in design** - Zero breaking changes, fully optional
- **TypeScript support** - Fully typed with comprehensive JSDoc

### Documentation

- **`prompt-optimization.md`** - Comprehensive guide with examples
- **`README.md`** - Quick reference and API overview
- **Example component** - Full-featured example with inspector panel
- **Test suite** - Unit tests for core utilities

### Known Limitations

- Transform functions are synchronous - Async strategies fall back in `useClarityChat`
- Token estimation is approximate - Consider `tiktoken` for production accuracy
- Summarization requires external function - Provide `summarizeFn` for best results
