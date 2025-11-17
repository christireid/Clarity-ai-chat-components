# Changelog - Prompt & Token Optimization Layer

## [1.0.0] - Initial Release

### Added

#### Core Layer
- **Toon DSL** - Composable prompt DSL with support for:
  - Text nodes
  - Variables with defaults and validation
  - Sections and roles
  - Sequences with separators
  - Conditional rendering
  
- **Token Estimation** - Model-aware token counting:
  - Pluggable tokenizer interface
  - Approximate tokenizer (4 chars per token)
  - Model presets for GPT-4, GPT-3.5, Claude 3 (Opus, Sonnet, Haiku)
  - Cost estimation utilities

- **Prompt Recipes** - Reusable prompt patterns:
  - `createPromptRecipe()` - Create custom recipes
  - `BUILT_IN_RECIPES` - Pre-built recipes:
    - `chatbot` - Simple conversational chatbot
    - `qaOverDocs` - QA over documents
    - `toolAgent` - Tool-using agent
    - `summarizer` - Text summarization

- **Message Optimization** - Multiple strategies:
  - `sliding-window` - Keep N most recent messages
  - `summarize-old` - Summarize older messages
  - `drop-low-priority` - Drop messages by priority score
  - `hybrid` - Combines multiple strategies

- **Model Prompt Builder** - Build final prompts:
  - Integrates recipes, memory, and user input
  - Applies optimization automatically
  - Returns token stats and cost estimates

#### React Hooks
- `usePromptRecipe` - Build prompts from recipes
- `useTokenBudget` - Manage token budgets
- `useOptimizedChatContext` - Auto-optimize chat context
- `usePromptInspector` - Dev tool for prompt inspection

#### Utilities
- `formatTokenCount()` - Format token counts for display
- `formatCost()` - Format costs for display
- `calculateUtilization()` - Calculate token utilization
- `getUtilizationColor()` - Get color for utilization (UI)
- `estimateConversationTokens()` - Estimate total tokens
- `exceedsTokenBudget()` - Check if budget exceeded
- `getTokenBreakdownByRole()` - Get breakdown by role
- `getOptimizationRecommendation()` - Get optimization recommendations
- `createSimpleSummarizer()` - Create summarization function

#### Integration
- Added `promptOptimization` option to `useClarityChat`
- Added `tokenStats` to `UseClarityChatReturn`
- No breaking changes to existing APIs

### Documentation
- Comprehensive README with examples
- Quick start guide
- Complete exports reference
- Implementation summary
- Complete status document

### Examples
- Complete example file with 5 different use cases
- Integration examples with useClarityChat
- Standalone hook examples
- Dev tool examples

## Future Enhancements (Planned)

- [ ] Unit tests for core utilities
- [ ] Integration tests for hooks
- [ ] tiktoken integration for accurate token counting
- [ ] More built-in recipes
- [ ] More optimization strategies
- [ ] Performance benchmarks
- [ ] React DevTools integration
- [ ] Visual prompt builder UI
