# Inventory: Main Branch (7ed57c479)

**Date**: 2026-01-22
**Branch**: main
**HEAD SHA**: 7ed57c47937508b9ea52ffb5661819d362692e56

---

## 1. Security Utilities

### Location: `packages/react/src/utils/security/`

**Files Present:**
- `index.ts` (340 bytes)
- `safe-evaluate.ts` (5,294 bytes, 218 lines)
- `sanitize-html.ts` (7,383 bytes)

**API Surface:**

```typescript
// index.ts exports
export {
  safeEvaluate,
  detectDangerousPatterns,
  formatEvaluateResult,
  type SafeEvaluateResult,
} from './safe-evaluate'

export {
  sanitizeCodeHtml,
  escapeHtmlEntities,
  createSafeCodeHtml,
  detectDangerousHtml,
} from './sanitize-html'
```

**Key Characteristics:**
- `safeEvaluate()` is ENABLED by default (security risk!)
- No deprecation warnings
- No `SafeEvaluateOptions` interface
- No parameter sanitization utilities (SQL, shell, path, etc.)
- Basic pattern blocking exists but bypassable

**Missing:**
- `sanitization.ts` module (doesn't exist)
- Disabled-by-default for unsafe eval
- Comprehensive parameter sanitization
- Security warnings and documentation

---

## 2. Tool Calling System

### Location: `packages/react/src/core/`

**Files Present:**
- `tool-executor.ts` (649 lines)
- `tool-registry.ts` (486 lines)
- `tool-orchestrator.ts` (527 lines)
- `tool-lifecycle.ts`

**Tests:**
- `__tests__/tool-executor.test.ts`
- `__tests__/tool-lifecycle.test.ts`
- `__tests__/tool-orchestrator.test.ts`
- `__tests__/tool-registry.test.ts`
- `__tests__/tool-system-e2e.test.ts`

**API Surface (tool-executor.ts):**
- Basic schema validation
- Format validation (limited)
- No oneOf/anyOf/allOf support
- Basic error handling
- No idempotency support
- Simple caching without collision protection

**API Surface (tool-registry.ts):**
- `register()`, `unregister()`, `get()`, `has()`, `getAll()`
- Event listener system
- NO max listener limits (memory leak risk)
- NO `registerOrUpdate()` method

**API Surface (tool-orchestrator.ts):**
- Tool approval workflow
- Execution orchestration
- Basic error handling
- Approval race condition vulnerability exists

**Patterns:**
- Standard tool execution flow
- Approval-based security
- Event-driven architecture

---

## 3. Streaming System

### Location: `packages/react/src/hooks/streaming/`

**Files Present:**
- `use-streaming-sse.tsx`
- `use-streaming.ts`
- `use-streamable-ui.ts`
- `use-streaming-chat.ts`
- `use-streaming-websocket.tsx`
- `use-smoothed-text.ts`
- `use-stream-status.ts`

**Tests:**
- `__tests__/streaming-comprehensive.test.tsx`

**Key Characteristics (use-streaming-sse.tsx):**
- Reconnection logic exists
- NO explicit heartbeat reset guards
- NO explicit buffer overflow protection
- Basic cleanup but potential resource leaks
- Timeout handling present

**Key Characteristics (use-streaming.ts):**
- ReadableStream processing
- Basic timeout support
- NO explicit reader cancellation on timeout

**Key Characteristics (use-streamable-ui.ts):**
- AsyncIterable support
- Basic cancellation
- NO explicit iterator.return() call

**Patterns:**
- SSE and WebSocket support
- Event-driven streaming
- Backpressure handling

---

## 4. Chat Components

### Location: `packages/react/src/components/chat/` and `.../message/`

**Files Present:**
- `chat/clarity-chat.tsx`
- `message/clarity-tool-result.tsx`
- `message/streaming-message.tsx`

**Key Characteristics (clarity-chat.tsx):**
- Edit operations present
- NO mutex lock for edit race conditions
- Silent returns on errors (no throws)
- Basic message handling

**Key Characteristics (clarity-tool-result.tsx):**
- Tool result rendering
- NO XSS escaping with DOMPurify
- Basic HTML rendering (vulnerable)

**Key Characteristics (streaming-message.tsx):**
- Streaming message display
- NO error boundary protection

---

## 5. Message Operations

### Location: `packages/react/src/hooks/message/`

**File**: `use-message-operations.ts`

**Key Characteristics:**
- Basic add/edit/delete/undo/redo
- NO empty message validation
- Incomplete undo/redo (missing edit/regenerate cases)
- NO undo history validation

---

## 6. Memory Service

### Location: `packages/memory/src/`

**File**: `memory-service.ts`

**Key Characteristics:**
- Buffer management
- Flush operations
- Race condition vulnerability in flushBuffer (async gap)

---

## 7. Chat Hooks

### Location: `packages/react/src/hooks/use-clarity-chat/` and `.../internal/hooks/`

**Files Present:**
- `use-clarity-chat.ts`
- `internal/hooks/use-chat-enhanced.ts`

**Key Characteristics:**
- Memory query integration
- NO explicit finally cleanup for queries
- Silent failures on empty messages
- NO credential validation warnings

---

## 8. Internal APIs

### Location: `packages/react/src/internal.ts`

**Key Characteristics:**
- Exports internal APIs
- NO runtime warnings about instability

---

## 9. Documentation

### Files Present:**
- `CHANGELOG.md` (starts with v1.0.0 on 2026-01-21)
  - Focuses on API consolidation and cleanup
  - No security audit documentation
  - No v1.1.0 entry

**Missing:**
- `docs/TOOL_SECURITY.md` (doesn't exist)
- Sprint completion reports
- Audit documentation
- Security guide for tool developers

---

## 10. Dependencies

**package.json:**
- NO DOMPurify dependency
- NO @types/dompurify

---

## 11. Audit Documentation

**Status**: `.ai-chat-audit/` directory does NOT exist on main

---

## Summary of Main Branch State

**Strengths:**
- Well-structured codebase with good architecture
- Comprehensive tool calling system
- Multiple streaming implementations
- Good test coverage baseline

**Vulnerabilities:**
- Unsafe code evaluation enabled by default
- XSS vulnerabilities in tool results
- Race conditions in concurrent operations
- Buffer overflow risks
- Memory leaks possible
- No parameter sanitization utilities
- Missing security documentation

**Missing Features:**
- Parameter sanitization (SQL, shell, path, LDAP, XML, URL)
- Security-first defaults
- Comprehensive audit documentation
- Tool security guide
- DOMPurify for XSS protection

**Overall Assessment:**
Main branch is functional but has critical security vulnerabilities and missing enterprise-grade hardening that the audit branch addresses.
