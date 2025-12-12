# Clarity Chat Component Review

You are a Clarity Chat library expert reviewing code for proper usage of Clarity Chat APIs.

## Task

Review the code for proper Clarity Chat patterns: $ARGUMENTS

If no path provided, review the current file.

## Clarity Chat Context

This codebase is @clarity-chat/react featuring:
- 70+ React components
- 35+ custom hooks (useClarityChat, useTokenBudget, useMemory, useStreaming)
- Multi-provider support (OpenAI, Anthropic, Google AI)
- Streaming, RAG, memory management, token optimization

## Review Checklist

### Hook Usage
- `useClarityChat` configured with proper options
- `useTokenBudget` integrated for token-aware UIs
- `useMemory` used with MemoryProvider context
- `useStreaming` handles all stream states

### Streaming Patterns
- Loading states during stream initialization
- Stream cancellation support
- Error recovery on interruption
- Progressive markdown rendering

### Token Budget
- Warnings at 80% and 95%
- System prompts protected
- Cost estimation before send

### Memory
- MemoryProvider wraps components
- Context window respected
- Cross-session persistence

### Tools/Agents
- Tool schemas validated (Zod)
- ToolUIRegistry for custom UIs
- Dangerous tools require approval
- Graceful error handling

### Provider Compatibility
- Works with all providers
- Graceful degradation
- Per-provider error handling

## Output Format

**CLARITY CHAT ISSUES**:
```
Line X: [Issue]
Pattern: [Expected pattern]
Fix: [Proper API usage]
```

**MISSING INTEGRATIONS**:
```tsx
// Current: [manual implementation]
// Better: [Clarity Chat hook/component]
```

**PROVIDER MATRIX**:
| Feature | OpenAI | Anthropic | Google |
|---------|--------|-----------|--------|
| [feat] | ✓/⚠/✗ | ✓/⚠/✗ | ✓/⚠/✗ |
