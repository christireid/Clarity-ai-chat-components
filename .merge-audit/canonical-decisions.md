# Canonical Decisions: API Cohesion (POST-MERGE)

**Date**: 2026-01-22 **Branch**: `claude/merge-consolidate-dedup-3P0qa` **Status**: ✅ COMPLETE -
After merging origin/main

---

## Executive Summary

After merging `origin/main` into this branch, the analysis identified some areas with overlapping
implementations that could benefit from consolidation for 100% API cohesion. However, most
identified "duplicates" are actually:

- Proper architectural layering (utilities vs core vs app)
- Backward compatibility wrappers (explicitly intended)
- Specialized implementations for different contexts

### Actionable Items

| Area                           | Type               | Action Required                               |
| ------------------------------ | ------------------ | --------------------------------------------- |
| Security: enhanced-security.ts | True duplicate     | **CONSOLIDATE** - Import from sanitization.ts |
| Token Counter: react wrapper   | Cache redundancy   | **KEEP** - Provides LRU cache at app layer    |
| Tool System: tool-execution.ts | Different purpose  | **KEEP** - Utility patterns vs core execution |
| Streaming: multiple hooks      | Proper layering    | **KEEP** - Core → Protocol → App layers       |
| Message helpers: two files     | Different purposes | **KEEP** - Message ops vs config              |

---

## Decision 1: Security Sanitization

### Status: **CONSOLIDATE**

#### Canonical: `packages/react/src/utils/security/sanitization.ts`

**Duplicate in**: `packages/token-optimization/src/security/enhanced-security.ts`

**Overlap**:

- Lines 677-681: SQL keyword removal duplicates `sanitization.ts`
- Script tag removal duplicates `sanitization.ts`

**Decision**: Update `enhanced-security.ts` to import and use `sanitization.ts` functions for
SQL/script sanitization

**Implementation**:

```typescript
// In enhanced-security.ts, replace:
sanitized = sanitized.replace(
  /\b(union|select|insert|update|delete|drop)\s+/gi,
  '[SQL_KEYWORD_REMOVED]'
)

// With import from sanitization.ts:
import { sanitizeSQL } from '@clarity-chat/react/utils/security/sanitization'
// Then use sanitizeSQL() instead of inline regex
```

**Risk**: Low - Internal refactor only

---

## Decision 2: Token Counting

### Status: **KEEP CURRENT STRUCTURE**

#### Canonical: `@clarity-chat/token-optimization`

**Wrappers**:

1. `packages/memory/src/utils/token-counter.ts` - Backward compatibility wrapper
2. `packages/react/src/utils/tokenization/accurate-counter.ts` - App-level wrapper with caching

**Analysis**:

- Memory wrapper is explicitly for backward compatibility (documented)
- React wrapper adds LRU cache layer for app-level optimization
- Both delegate to `@clarity-chat/token-optimization`

**Decision**: KEEP current structure - this is proper layering:

- Package level: Core implementation
- Memory level: API compatibility
- React level: App-level caching

**Note**: Model configs in react wrapper could be removed if they're duplicated in
token-optimization, but this is low priority.

---

## Decision 3: Tool Calling System

### Status: **KEEP - PROPER LAYERING**

#### Layer Architecture:

1. **Core**: `tool-executor.ts` - Low-level execution engine
2. **Orchestration**: `tool-orchestrator.ts` - Manages execution flow
3. **State**: `tools-engine.ts` - State management and approval flow
4. **Utilities**: `tool-execution.ts` - Helper patterns (retry, fallback)
5. **UI**: `tool-ui-registry.ts` - Component registry

**Analysis**:

- `tool-execution.ts` provides utility functions that work WITH the orchestrator
- It's not a duplicate of `tool-executor.ts` - different abstraction level
- Proper separation of concerns

**Decision**: KEEP all files - this is correct architectural layering

**Note**: Ensure `tools-engine.ts` properly delegates to `tool-executor.ts` for actual execution
(verify this works correctly)

---

## Decision 4: Streaming

### Status: **KEEP - PROPER LAYERING**

#### Layer Architecture:

1. **Core**: `use-streaming.ts` - Low-level primitive
2. **Utilities**: `streaming-helpers.ts` - Shared parsing/format handling
3. **Protocol-specific**: `use-streaming-sse.tsx`, `use-streaming-websocket.tsx`
4. **App-specific**: `use-streaming-chat.ts`

**Analysis**: This is textbook architectural layering:

- Core primitives → Protocol handlers → App-level hooks

**Decision**: KEEP all files - correct architecture

**Minor improvement**: Verify SSE parsing in hooks uses `streaming-helpers.ts` utilities (not
duplicated)

---

## Decision 5: Message Handling

### Status: **KEEP - DIFFERENT PURPOSES**

#### Files:

1. `chat-helpers.ts` - Message creation, transformation, validation
2. `clarity-chat-helpers.ts` - Configuration factory functions

**Analysis**: These serve completely different purposes and should remain separate.

**Decision**: KEEP both files - correct separation

---

## Summary of Required Changes

### High Priority (Security)

1. **Update `enhanced-security.ts`**:
   - Import sanitization functions from `sanitization.ts`
   - Remove duplicate SQL/script sanitization code
   - Keep ML threat detection and zero-trust features

### Low Priority (Cleanup)

2. **Verify streaming hooks use shared utilities**:
   - Check if SSE parsing is centralized in `streaming-helpers.ts`
   - If duplicated, refactor to use shared implementation

3. **Remove duplicate model configs** (if exists):
   - Check if MODEL_CONFIGS in `react/tokenization/accurate-counter.ts` duplicates
     token-optimization package
   - If so, import from canonical source

### No Action Required

- Token counter wrappers (intentional layering)
- Tool system files (proper architecture)
- Message helpers (different purposes)

---

## Final API Surface

### Security Module

- **Canonical**: `@clarity-chat/react/utils/security/sanitization` (comprehensive)
- **HTML-specific**: `@clarity-chat/react/utils/security/sanitize-html`
- **Code evaluation**: `@clarity-chat/react/utils/security/safe-evaluate`
- **Enhanced ML**: `@clarity-chat/token-optimization/security/enhanced-security` (imports from
  sanitization)

### Token Counting

- **Canonical**: `@clarity-chat/token-optimization`
- **Memory compat**: `@clarity-chat/memory/utils/token-counter` (wrapper)
- **React compat**: `@clarity-chat/react/utils/tokenization/accurate-counter` (cached wrapper)

### Tool System

- **Executor**: `@clarity-chat/react/core/tool-executor`
- **Orchestrator**: `@clarity-chat/react/core/tool-orchestrator`
- **State engine**: `@clarity-chat/react/app-api/tools-engine`
- **Utilities**: `@clarity-chat/react/utils/tool-execution`
- **UI**: `@clarity-chat/react/agents/tool-ui-registry`

### Streaming

- **Core**: `@clarity-chat/react/hooks/streaming/use-streaming`
- **Helpers**: `@clarity-chat/react/utils/streaming/streaming-helpers`
- **SSE**: `@clarity-chat/react/hooks/streaming/use-streaming-sse`
- **WebSocket**: `@clarity-chat/react/hooks/streaming/use-streaming-websocket`
- **Chat**: `@clarity-chat/react/hooks/streaming/use-streaming-chat`

---

## Verification Checklist

After implementing changes:

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Security module has single source of truth for sanitization
- [ ] No dead code or unused exports
- [ ] Documentation matches implementation

---

## Conclusion

**API Cohesion Status**: ~95% (one consolidation needed)

**Required action**: Update `enhanced-security.ts` to import from `sanitization.ts`

**Everything else**: Proper architectural layering - no changes needed
