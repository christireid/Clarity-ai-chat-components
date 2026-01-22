# Diff Map: Main vs Branch Detailed Comparison

**Date**: 2026-01-22
**Purpose**: Identify duplicates, conflicts, divergences, and missing elements

---

## Area 1: Security Utilities

### File: `packages/react/src/utils/security/index.ts`

**Status**: DIVERGED (enhancements in branch)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Exports | Basic (safe-evaluate, sanitize-html) | Enhanced + sanitization module | Branch adds 12 new exports |
| Documentation | Minimal | Comprehensive security focus | Branch has better docs |
| **Decision** | ❌ | ✅ | Use branch version - superset of main |

### File: `packages/react/src/utils/security/safe-evaluate.ts`

**Status**: CONFLICT (major security fix in branch)

| Aspect | Main (218 lines) | Branch (281 lines) | Analysis |
|--------|------------------|---------------------|----------|
| Default behavior | Enabled by default | **Disabled by default** | Branch fixes TOOL-021 |
| Security | ❌ Vulnerable | ✅ Secure | Branch requires explicit opt-in |
| Options interface | Basic | `SafeEvaluateOptions` with acknowledgment | Branch more explicit |
| Warnings | None | Comprehensive deprecation warnings | Branch has security awareness |
| Documentation | Basic | Extensive with alternatives | Branch guides developers |
| **Decision** | ❌ UNSAFE | ✅ SECURE | **MUST use branch version** |

**Impact**: Breaking change - users must opt-in explicitly if using code evaluation

### File: `packages/react/src/utils/security/sanitization.ts`

**Status**: NEW in branch (doesn't exist in main)

| Aspect | Main | Branch |Analysis |
|--------|------|--------|---------|
| Exists | ❌ No | ✅ Yes (602 lines) | Critical security addition |
| SQL sanitization | ❌ None | ✅ 2 functions | TOOL-022 fix |
| Command sanitization | ❌ None | ✅ 2 functions | TOOL-022 fix |
| Path sanitization | ❌ None | ✅ 2 functions | TOOL-022 fix |
| Other sanitization | ❌ None | ✅ 3 functions (LDAP, XML, URL) | TOOL-022 fix |
| Utilities | ❌ None | ✅ 2 functions | TOOL-022 fix |
| **Decision** | N/A | ✅ | **MUST add from branch** |

**Impact**: New capability - no conflict, pure addition

---

## Area 2: Tool Calling System

### File: `packages/react/src/core/tool-executor.ts`

**Status**: DIVERGED (major enhancements in branch)

| Aspect | Main (649 lines) | Branch (843 lines) | Analysis |
|--------|------------------|---------------------|----------|
| Schema validation | Basic | Enhanced (oneOf, anyOf, format) | Branch has TOOL-001 fix |
| Regex safety | None | 10k limit + try-catch | Branch has TOOL-003 fix |
| Cache keys | Simple | Stable stringify | Branch has TOOL-010 fix |
| Error classification | Basic | Structured classes | Branch has TOOL-014 fix |
| Idempotency | ❌ None | ✅ Support | Branch has TOOL-017 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

**Impact**: No breaking changes, pure enhancements

### File: `packages/react/src/core/tool-registry.ts`

**Status**: DIVERGED (enhancements in branch)

| Aspect | Main (486 lines) | Branch (574 lines) | Analysis |
|--------|------------------|---------------------|----------|
| Listener limits | ❌ None (leak risk) | ✅ Max 100 with warnings | Branch has TOOL-004 fix |
| Overwrite handling | Silent | Warnings | Branch has TOOL-005 fix |
| `registerOrUpdate()` | ❌ None | ✅ New method | Branch addition |
| `setMaxListeners()` | ❌ None | ✅ New method | Branch addition |
| `getListenerCount()` | ❌ None | ✅ New method | Branch addition |
| **Decision** | ❌ | ✅ | **Use branch version** |

**Impact**: No breaking changes, pure enhancements

### File: `packages/react/src/core/tool-orchestrator.ts`

**Status**: MINOR DIVERGENCE (small fix in branch)

| Aspect | Main (527 lines) | Branch (538 lines) | Analysis |
|--------|------------------|---------------------|----------|
| Approval validation | Basic | Atomic re-validation | Branch has TOOL-018 fix |
| Race condition | ❌ Vulnerable | ✅ Protected | Branch prevents TOCTOU |
| **Decision** | ❌ | ✅ | **Use branch version** |

**Impact**: Security fix, no API changes

### File: `packages/react/src/core/__tests__/tool-executor-enhanced.test.ts`

**Status**: NEW in branch

**Decision**: ✅ Add from branch (154 new test cases)

---

## Area 3: Streaming System

### File: `packages/react/src/hooks/streaming/use-streaming-sse.tsx`

**Status**: DIVERGED (critical fixes in branch)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Reconnection guards | Basic | Enhanced with flag resets | Branch has Issue #5, #10 fixes |
| Buffer limits | ❌ None | ✅ 10MB hard limit | Branch has Issue #4, SEC-006 fix |
| Cleanup | Basic | Comprehensive | Branch prevents cascades |
| Heartbeat reset | No explicit | Explicit reset | Branch more robust |
| **Decision** | ❌ | ✅ | **Use branch version** |

**Impact**: Security and stability fixes, no API changes

### File: `packages/react/src/hooks/streaming/use-streaming.ts`

**Status**: MINOR DIVERGENCE

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Timeout handling | Basic | Reader cancellation | Branch has Issue #15 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

### File: `packages/react/src/hooks/streaming/use-streamable-ui.ts`

**Status**: MINOR DIVERGENCE

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Iterator cleanup | Basic | Explicit `iterator.return()` | Branch has Issue #8 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

### File: `packages/react/src/utils/streaming/streaming-helpers.ts`

**Status**: DIVERGED

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Error handling | Basic | Comprehensive try-catch | Branch has Issue #9 fix |
| Final flush | Implicit | Explicit SSE done marking | Branch has Issue #17 fix |
| Debug logging | Minimal | Enhanced | Branch better debugging |
| **Decision** | ❌ | ✅ | **Use branch version** |

---

## Area 4: Chat Components

### File: `packages/react/src/components/chat/clarity-chat.tsx`

**Status**: CONFLICT (critical fixes in branch)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Edit race protection | ❌ None | ✅ Mutex lock | Branch has Issue #1, SEC-002 fix |
| Error handling | Silent returns | Throws errors | Branch has Issue #6 fix |
| Message validation | None | User-only edit assertion | Branch has Issue #7 fix |
| **Decision** | ❌ UNSAFE | ✅ SAFE | **MUST use branch version** |

**Impact**: Critical security fixes, no API changes

### File: `packages/react/src/components/message/clarity-tool-result.tsx`

**Status**: CONFLICT (XSS fix in branch)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| XSS protection | ❌ None | ✅ DOMPurify | Branch has SEC-004, TOOL-011 fix |
| HTML escaping | None | `escapeHtml()` for names | Branch secure |
| Result sanitization | None | `sanitize()` for content | Branch secure |
| **Decision** | ❌ VULNERABLE | ✅ PROTECTED | **MUST use branch version** |

**Impact**: Critical security fix, requires DOMPurify dependency

### File: `packages/react/src/components/message/streaming-message.tsx`

**Status**: DIVERGED

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Error boundary | ❌ None | ✅ Try-catch in useMemo | Branch has Issue #19 fix |
| Crash protection | No | Yes | Branch more resilient |
| **Decision** | ❌ | ✅ | **Use branch version** |

---

## Area 5: Message Operations

### File: `packages/react/src/hooks/message/use-message-operations.ts`

**Status**: DIVERGED (multiple fixes in branch)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Empty validation | ❌ None | ✅ Content check | Branch has Issue #2 fix |
| Undo/redo completeness | Incomplete | Complete (edit/regenerate) | Branch has Issue #3 fix |
| History validation | None | Message existence check | Branch has Issue #16 fix |
| Orphan cleanup | Basic | Enhanced | Branch has Issue #18 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

---

## Area 6: Memory Service

### File: `packages/memory/src/memory-service.ts`

**Status**: DIVERGED (race condition fix)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| flushBuffer race | ❌ Vulnerable | ✅ Synchronous clear | Branch has MEM-001 fix |
| Data loss prevention | No | Yes | Branch more reliable |
| **Decision** | ❌ | ✅ | **Use branch version** |

---

## Area 7: Chat Hooks

### File: `packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts`

**Status**: MINOR DIVERGENCE

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Query cleanup | Basic try-catch | Finally block | Branch has Issue #11 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

### File: `packages/react/src/internal/hooks/use-chat-enhanced.ts`

**Status**: DIVERGED

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Empty message feedback | Silent | onError callbacks | Branch has Issue #13 fix |
| Abort handling | Basic | Cleanup partial messages | Branch has Issue #14 fix |
| CORS warnings | None | Development warnings | Branch has Issue #21 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

---

## Area 8: Internal APIs

### File: `packages/react/src/internal.ts`

**Status**: DIVERGED (warning added)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Instability warning | None | Runtime console.warn | Branch has API-003 fix |
| **Decision** | ❌ | ✅ | **Use branch version** |

---

## Area 9: Documentation

### File: `CHANGELOG.md`

**Status**: CONFLICT (different versions)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| Latest version | v1.0.0 (2026-01-21) | v1.0.0 + v1.1.0 (2026-01-22) | Branch adds new version |
| v1.0.0 content | API consolidation | Same | No conflict |
| v1.1.0 content | ❌ Doesn't exist | ✅ Security hardening (387 lines) | Branch addition |
| Audit documentation | None | Complete | Branch comprehensive |
| **Decision** | Partial | ✅ Complete | **Merge branch v1.1.0 into main** |

**Impact**: Additive change, v1.0.0 preserved, v1.1.0 added

### File: `docs/TOOL_SECURITY.md`

**Status**: NEW in branch (711 lines)

**Decision**: ✅ Add from branch - critical security documentation

### Files: Sprint Reports

**Status**: NEW in branch
- `SPRINT_3_FINAL_COMPLETION.md`
- `.ai-chat-audit/SPRINT_5_SANITIZATION.md`

**Decision**: ✅ Add from branch - audit documentation

---

## Area 10: Audit Documentation

### Directory: `.ai-chat-audit/`

**Status**: NEW in branch (11 files, 3,886 lines)

**Decision**: ✅ Add entire directory from branch - complete audit trail

---

## Area 11: Dependencies

### File: `package.json`

**Status**: DIVERGED (additions in branch)

| Aspect | Main | Branch | Analysis |
|--------|------|--------|----------|
| dompurify | ❌ Missing | ✅ ^3.3.1 | Required for XSS protection |
| @types/dompurify | ❌ Missing | ✅ ^3.0.5 | TypeScript types |
| **Decision** | ❌ | ✅ | **Merge dependencies from branch** |

**Impact**: Two new dependencies, required for security

---

## Summary of Conflicts and Decisions

### Critical Conflicts (Must Use Branch):
1. ✅ `safe-evaluate.ts` - Security fix (disabled by default)
2. ✅ `clarity-tool-result.tsx` - XSS fix (DOMPurify)
3. ✅ `clarity-chat.tsx` - Race condition fix (mutex)

### Major Enhancements (Use Branch):
4. ✅ `sanitization.ts` - NEW file (TOOL-022)
5. ✅ `tool-executor.ts` - Enhanced validation
6. ✅ `tool-registry.ts` - Memory leak prevention
7. ✅ All streaming files - Stability fixes

### Documentation (Merge from Branch):
8. ✅ CHANGELOG.md - Add v1.1.0
9. ✅ `docs/TOOL_SECURITY.md` - NEW
10. ✅ `.ai-chat-audit/` - NEW directory

### No Conflicts (Pure Additions):
- All branch enhancements are supersets of main
- No competing implementations
- No API breaking changes (except safe-evaluate security fix)

### Verdict:
**ZERO DUPLICATES DETECTED**

All branch changes are enhancements, fixes, or additions to main. There are NO competing implementations to reconcile. The merge strategy is straightforward: **accept all changes from branch**.
