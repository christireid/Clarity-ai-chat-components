# Duplicate Implementation Analysis (POST-MERGE)

Date: 2026-01-22 Branch: claude/merge-consolidate-dedup-3P0qa Status: **AFTER merging
origin/main** - comprehensive analysis of combined codebase

---

## Executive Summary

After merging origin/main into this branch and analyzing the combined codebase, we have identified
the following duplicate implementations requiring consolidation:

| Area                  | Duplicate Count | Severity | Action Required         |
| --------------------- | --------------- | -------- | ----------------------- |
| Security/Sanitization | 4 files         | Critical | Yes - Consolidate       |
| Tool Calling System   | 3+ files        | High     | Yes - Clarify roles     |
| Token Counting        | 3 files         | Medium   | Yes - Single source     |
| Streaming             | 5+ files        | Low      | No - Proper layering    |
| Message Handling      | 2 files         | Low      | No - Different purposes |

---

## 1. Security/Sanitization (CRITICAL DUPLICATES)

### Files with Overlapping Functionality

| File                                                            | Purpose                                                       | Lines | Status             |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ----- | ------------------ |
| `packages/react/src/utils/security/sanitization.ts`             | Comprehensive sanitization (SQL, Shell, Path, LDAP, XML, URL) | ~600  | **CANONICAL**      |
| `packages/react/src/utils/security/sanitize-html.ts`            | HTML-specific for code highlighting                           | ~200  | Keep (specialized) |
| `packages/cli/src/utils/security.ts`                            | CLI-specific path/credential validation                       | ~150  | Keep (CLI context) |
| `packages/token-optimization/src/security/enhanced-security.ts` | Multi-layer security with ML threat detection                 | ~700  | **REVIEW**         |

### Specific Overlaps

1. **SQL Keyword Detection**
   - `sanitization.ts`: Lines 23-45 - SQL keyword removal
   - `enhanced-security.ts`: Lines 677-681 - Duplicates SQL keyword removal

2. **Script Removal**
   - `sanitization.ts`: `removeScriptTags()` function
   - `enhanced-security.ts`: Script tag removal in `enhancedSanitization()`

3. **Path Sanitization**
   - `sanitization.ts`: `sanitizePath()`, `sanitizeFilename()`
   - `cli/security.ts`: `validatePath()`, `validateProjectPath()`

### Decision

- **Canonical**: `packages/react/src/utils/security/sanitization.ts`
- **Action**: `enhanced-security.ts` should import from `sanitization.ts` for core sanitization,
  keeping only ML/threat detection logic

---

## 2. Tool Calling System (HIGH PRIORITY)

### Files with Overlapping Functionality

| File                                            | Purpose                                            | Lines | Status                 |
| ----------------------------------------------- | -------------------------------------------------- | ----- | ---------------------- |
| `packages/react/src/core/tool-executor.ts`      | Core execution with validation, caching, lifecycle | ~1050 | **CANONICAL EXECUTOR** |
| `packages/react/src/app-api/tools-engine.ts`    | State management, approval flow                    | ~850  | Keep (state layer)     |
| `packages/react/src/utils/tool-execution.ts`    | Utility patterns (retry, fallback, batch)          | ~800  | **REVIEW**             |
| `packages/react/src/agents/tool-ui-registry.ts` | UI component registry                              | ~150  | Keep (UI layer)        |

### Specific Overlaps

1. **Retry Logic**
   - `tool-executor.ts`: `executeWithRetry()` method
   - `tool-execution.ts`: `executeWithRetry()` function
   - `tools-engine.ts`: Implicit retry in execution

2. **Parameter Validation**
   - `tool-executor.ts`: `validateParameters()` with JSON Schema
   - `tools-engine.ts`: `validateParameters()` function

3. **Batch Execution**
   - `tool-execution.ts`: `executeBatch()`, `executeBatchSimple()`
   - `tools-engine.ts`: Handles batches differently

### Decision

- **Canonical Executor**: `packages/react/src/core/tool-executor.ts`
- **State Manager**: `packages/react/src/app-api/tools-engine.ts` - should delegate to tool-executor
- **Utilities**: `tool-execution.ts` - Review for consolidation or keep as standalone utilities

---

## 3. Token Counting (MEDIUM - TRIPLE INDIRECTION)

### Files

| File                                                             | Purpose                                   | Status         |
| ---------------------------------------------------------------- | ----------------------------------------- | -------------- |
| `packages/token-optimization/src/tokenizers/accurate-counter.ts` | Primary implementation with gpt-tokenizer | **CANONICAL**  |
| `packages/memory/src/utils/token-counter.ts`                     | Wrapper for backward compatibility        | **DEPRECATED** |
| `packages/react/src/utils/tokenization/accurate-counter.ts`      | React wrapper with LRU cache              | **REVIEW**     |

### Issue

Three layers of abstraction for the same functionality:

1. `token-optimization` has the real implementation
2. `memory` wraps it for "backward compatibility"
3. `react` wraps it again with additional caching

### Decision

- **Canonical**: `@clarity-chat/token-optimization` package
- **Action**: Update `memory` and `react` packages to import directly from
  `@clarity-chat/token-optimization`
- **Caching**: Move caching to the canonical implementation if needed

---

## 4. Streaming (LOW - PROPER LAYERING)

### Files

| File                          | Purpose                       | Status             |
| ----------------------------- | ----------------------------- | ------------------ |
| `use-streaming.ts`            | Low-level streaming primitive | Keep (core)        |
| `streaming-helpers.ts`        | Shared utilities              | Keep (utils)       |
| `use-streaming-sse.tsx`       | SSE-specific                  | Keep (specialized) |
| `use-streaming-websocket.tsx` | WebSocket-specific            | Keep (specialized) |
| `use-streaming-chat.ts`       | Chat-specific                 | Keep (app layer)   |

### Analysis

These represent proper architectural layering:

- Core primitives → Protocol-specific → App-specific

### Minor Overlap

SSE parsing logic exists in both `use-streaming.ts` and `streaming-helpers.ts`

### Decision

- **No consolidation needed** - proper layering
- **Minor fix**: Ensure hooks use `streaming-helpers.ts` for SSE parsing

---

## 5. Message Handling (LOW - DIFFERENT PURPOSES)

### Files

| File                                    | Purpose                  | Status |
| --------------------------------------- | ------------------------ | ------ |
| `utils/message/chat-helpers.ts`         | CoreMessage manipulation | Keep   |
| `utils/message/clarity-chat-helpers.ts` | Config helpers           | Keep   |

### Analysis

These serve different purposes:

- `chat-helpers.ts`: Message creation, transformation, validation
- `clarity-chat-helpers.ts`: Configuration factory functions

### Decision

- **No consolidation needed** - different responsibilities

---

## Dead Code Identified

| File/Export                              | Reason                        | Action                |
| ---------------------------------------- | ----------------------------- | --------------------- |
| `utils/theme-helpers.ts`                 | Planned but never implemented | Already deleted       |
| Legacy type aliases in `agents/types.ts` | Backward compatibility        | Keep with deprecation |
| Commented exports in `public-api.ts`     | Cleanup remnants              | Review and clean      |

---

## Consolidation Priority

### Priority 1: Security

- [ ] Update `enhanced-security.ts` to import from `sanitization.ts`
- [ ] Remove duplicate SQL/script sanitization logic

### Priority 2: Tool System

- [ ] Ensure `tools-engine.ts` delegates to `tool-executor.ts`
- [ ] Review `tool-execution.ts` utilities for consolidation

### Priority 3: Token Counting

- [ ] Update `memory` package imports to use `@clarity-chat/token-optimization`
- [ ] Review `react` package wrapper necessity

### Priority 4: Minor Cleanup

- [ ] Remove dead code and unused exports
- [ ] Ensure streaming hooks use shared utilities

---

## Next Steps

1. Create canonical-decisions.md with final decisions
2. Create implementation plan
3. Execute consolidation
4. Verify with tests and builds
