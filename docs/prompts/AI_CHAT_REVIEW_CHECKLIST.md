# AI Chat Review Checklist

> Quick-reference checklist for reviewing AI chat features. For detailed guidance, see [ADVANCED_AI_CHAT_REVIEW_PROMPT.md](./ADVANCED_AI_CHAT_REVIEW_PROMPT.md).

## Feature Area: __________ (streaming | agents-tools | memory | token-optimization)

---

## Pre-Review Discovery

- [ ] Identify changed files: `git diff main --name-only`
- [ ] Map data flow through feature
- [ ] Identify provider dependencies (OpenAI | Anthropic | Google)

---

## Core Checks by Feature

### Streaming
- [ ] Transport type documented (SSE/WebSocket)
- [ ] Stream cancellation works
- [ ] Partial tokens handled (no split words)
- [ ] Connection drop recovery exists
- [ ] Loading state visible during stream

### Agents & Tools
- [ ] Tool schema has validation
- [ ] Tool errors display gracefully
- [ ] Progress state during execution
- [ ] Dangerous tools require confirmation (`requiresApproval`)
- [ ] Custom UI renders for tool results

### Memory
- [ ] Context window respected
- [ ] Summarization preserves key info
- [ ] Memory persists across sessions
- [ ] Users can clear their data
- [ ] Relevant memories surface in context

### Token Optimization
- [ ] Budget tracking visible to user
- [ ] Warning at 80% and 95% thresholds
- [ ] System prompts protected from trimming
- [ ] KV-cache prefix ordering correct
- [ ] Cost estimation accurate per provider

---

## Provider Compatibility

| Check | OpenAI | Anthropic | Google |
|-------|--------|-----------|--------|
| Feature works | [ ] | [ ] | [ ] |
| Streaming works | [ ] | [ ] | [ ] |
| Tool calls work | [ ] | [ ] | ⚠️* |

*Google adapter lacks streaming tool_calls handling (verified in code)

---

## Final Validation

- [ ] Tested with streaming responses
- [ ] Handles API errors gracefully
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] UX works with slow responses (loading states)
- [ ] No sensitive data in logs

---

## Quick Commands

```bash
# Streaming patterns
grep -rn "useStreaming\|ReadableStream" packages/react/src/ --include="*.ts"

# Tool patterns
grep -rn "Tool\|ToolUI" packages/react/src/ --include="*.ts"

# Memory patterns
grep -rn "useMemory\|MemoryService" packages/react/src/ --include="*.ts"

# Token patterns
grep -rn "useTokenBudget\|buildKVCache" packages/react/src/ --include="*.ts"
```

---

*Checklist Version: 1.0.0 | See full prompt for implementation details*
