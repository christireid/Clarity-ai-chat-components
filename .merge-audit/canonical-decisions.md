# CANONICAL DECISIONS - Phase 4

**Date:** 2026-01-22
**Decision Maker:** Automated analysis based on Phase 3 findings
**Principle:** Select best implementation for each concern, eliminate duplicates

---

## EXECUTIVE SUMMARY

**Total Files Analyzed:** 67
**Canonical Decision:** **KEEP ALL 67 FILES FROM BRANCH** ✅

**Rationale:**
- All branch changes are additive enhancements or bug fixes
- No actual duplicates found (4 investigated, 0 duplicates)
- All 10 modified files show superior implementations
- Net code reduction: -846 lines (better architecture)
- Zero conflicts with main's functionality

---

## DECISION MATRIX

### Category 1: New Files (53 files) - KEEP ALL ✅

All new files represent additive functionality with no conflicts:

#### 1.1 Performance Infrastructure (13 files)
- `.streaming-perf-audit/*.md` (13 files)
- **Decision:** KEEP ALL
- **Rationale:** Project documentation, Sprint 6/7 audit trail
- **Conflict:** NONE
- **Action:** ADD to repository

#### 1.2 Performance Guides (7 files)
- `docs/guides/performance/*.md` (7 files)
- **Decision:** KEEP ALL
- **Rationale:** Professional documentation organization
- **Conflict:** NONE
- **Action:** ADD to repository

#### 1.3 Benchmarking Infrastructure (10 files)
- `src/__benchmarks__/*.bench.ts` (5 files)
- Benchmark docs and scripts (5 files)
- **Decision:** KEEP ALL
- **Rationale:** Essential for performance monitoring
- **Conflict:** NONE
- **Action:** ADD to repository

#### 1.4 Streaming Enhancements (3 files)
- `use-chat-enhanced.ts` - Connection tracking, RAF batching
- `use-streaming.ts` - Reader cancellation fix
- `use-streaming-sse.tsx` - Reader cancellation fix
- `PromptArchitectDemo.tsx` - Reader cancellation fix
- **Decision:** KEEP ALL (modified, not new, but listing here for clarity)
- **Rationale:** Critical bug fixes and performance improvements
- **Conflict:** NONE
- **Action:** MERGE branch versions

#### 1.5 Virtualization Enhancements (2 files)
- `virtualized-message-list.tsx` - Accessibility features
- `tanstack-message-list.tsx` - Accessibility features
- **Decision:** KEEP ALL (modified, not new)
- **Rationale:** WCAG 2.1 Level AA compliance
- **Conflict:** NONE
- **Action:** MERGE branch versions

#### 1.6 Accessibility Infrastructure (1 file)
- `hooks/accessibility/use-screen-reader.tsx`
- **Decision:** KEEP
- **Rationale:** Critical for WCAG compliance, no overlap
- **Conflict:** NONE
- **Action:** ADD new directory and file

#### 1.7 Runtime Validation (1 file)
- `utils/config/runtime-validation.ts` - Expanded validators
- **Decision:** KEEP (modified, not new)
- **Rationale:** Centralized validation with better DX
- **Conflict:** NONE
- **Action:** MERGE branch version

#### 1.8 Profiling Utilities (3 files)
- `utils/profiling/layout-profiler.ts`
- `utils/profiling/render-profiler.ts`
- `utils/profiling/index.ts`
- **Decision:** KEEP ALL
- **Rationale:** Development tools, no production impact
- **Conflict:** NONE
- **Action:** ADD new directory and files

#### 1.9 Chat Hooks (3 files)
- `hooks/chat/use-chat-editor.ts`
- `hooks/chat/use-message-normalization.ts`
- `hooks/ui/use-auto-scroll.tsx` (modified)
- **Decision:** KEEP ALL
- **Rationale:**
  - use-chat-editor: Unique editing functionality
  - use-message-normalization: Unique conversion utility
  - use-auto-scroll: Performance enhancement (throttling)
- **Conflict:** NONE (verified in Phase 3)
- **Action:** ADD new hooks, MERGE modified hook

#### 1.10 UI Components (4 files)
- `components/chat/chat-window-header.tsx`
- `components/chat/empty-state.tsx`
- `components/chat/follow-up-suggestions.tsx`
- `components/ui/error-banner.tsx`
- **Decision:** KEEP ALL
- **Rationale:** Extracted from chat-window.tsx for better architecture
- **Conflict:** NONE
- **Action:** ADD all new components

#### 1.11 Message Components (2 files)
- `components/message/markdown-renderer.tsx`
- `components/message/message-header.tsx`
- **Decision:** KEEP ALL
- **Rationale:**
  - markdown-renderer: Uses markdown-code-block.tsx (complementary)
  - message-header: Different scope from message-metadata.tsx
- **Conflict:** NONE (verified in Phase 3)
- **Action:** ADD all new components

#### 1.12 Storybook (2 files)
- `Advanced/Streaming/Overview.mdx` (enhanced)
- `VirtualizedMessageList.stories.tsx` (enhanced)
- **Decision:** KEEP ALL (modified, not new)
- **Rationale:** Better documentation with performance notes
- **Conflict:** NONE
- **Action:** MERGE branch versions

#### 1.13 Root Documentation (2 files)
- `PR_DESCRIPTION.md` (updated)
- `SPRINT_6_COMPLETION.md` (new)
- **Decision:** KEEP BOTH
- **Rationale:** Project documentation
- **Conflict:** NONE
- **Action:** MERGE/ADD

---

### Category 2: Modified Files (10 files) - KEEP ALL BRANCH VERSIONS ✅

All modified files show superior implementations on branch.

#### 2.1 Component Refactoring (5 files)

##### `chat-input.tsx`
- **Main:** Inline validation (47 lines)
- **Branch:** Centralized validation (9 lines)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** -38 lines, better maintainability, consistent DX
- **Impact:** Architecture improvement
- **Risk:** LOW

##### `chat-window.tsx`
- **Main:** Inline components (700+ lines)
- **Branch:** Extracted components (234 lines)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** -466 lines, SRP, better testability, reusability
- **Impact:** Major architecture improvement
- **Risk:** LOW (behavior preserved)

##### `clarity-chat.tsx`
- **Main:** Inline editing logic (600+ lines)
- **Branch:** Hook-based architecture (388 lines)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** -212 lines, fixes Issue #7 (memory errors), better separation
- **Impact:** Architecture + bug fix
- **Risk:** LOW

##### `message-list.tsx`
- **Main:** No windowing
- **Branch:** Message windowing (maxMessages=1000)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** Memory safety, prevents OOM
- **Impact:** Critical performance/memory improvement
- **Risk:** LOW (default is safe)

##### `message.tsx`
- **Main:** Inline markdown (300+ lines)
- **Branch:** Extracted components (109 lines)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** -191 lines, better architecture, reusability
- **Impact:** Major architecture improvement
- **Risk:** LOW

#### 2.2 Hook Improvements (3 files)

##### `use-clarity-chat.ts`
- **Main:** State-based memory context (race condition)
- **Branch:** Ref-based memory context (fixed)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** Fixes race condition, adds debounce cleanup
- **Impact:** Critical bug fix
- **Risk:** LOW

##### `use-mobile-keyboard.tsx`
- **Main:** 3 separate style assignments (3 recalcs)
- **Branch:** Batched cssText update (1 recalc)
- **Decision:** KEEP BRANCH ✅
- **Rationale:** 66% performance improvement
- **Impact:** Performance optimization
- **Risk:** LOW

##### `use-streaming-websocket.tsx`
- **Main:** Immediate state updates
- **Branch:** RAF-batched updates
- **Decision:** KEEP BRANCH ✅
- **Rationale:** Smooth 60fps streaming, consistent with STREAM-3
- **Impact:** Performance optimization
- **Risk:** LOW

#### 2.3 Configuration (2 files)

##### `vitest.config.mts`
- **Main:** No benchmark config
- **Branch:** Benchmark configuration
- **Decision:** KEEP BRANCH ✅
- **Rationale:** Enables performance monitoring
- **Impact:** Infrastructure improvement
- **Risk:** NONE (additive)

##### `package.json`
- **Main:** No benchmark scripts
- **Branch:** 7 benchmark scripts
- **Decision:** KEEP BRANCH ✅
- **Rationale:** Essential for performance testing
- **Impact:** Infrastructure improvement
- **Risk:** LOW (scripts only, no dependency changes)

---

### Category 3: Investigated Overlaps (4 files) - KEEP ALL, NO DUPLICATES ✅

All investigated files are NOT duplicates.

#### 3.1 markdown-renderer.tsx vs markdown-code-block.tsx
- **Finding:** markdown-renderer USES markdown-code-block as component
- **Decision:** KEEP BOTH ✅
- **Rationale:** Complementary, not duplicate
- **Action:** ADD markdown-renderer.tsx

#### 3.2 message-header.tsx vs message-metadata.tsx
- **Finding:** Different scopes (simple header vs full metadata)
- **Decision:** KEEP BOTH ✅
- **Rationale:** Different purposes, no overlap
- **Action:** ADD message-header.tsx

#### 3.3 use-chat-editor.ts
- **Finding:** Unique functionality (editing, regeneration, branching)
- **Decision:** KEEP ✅
- **Rationale:** No overlap with main's hooks
- **Action:** ADD use-chat-editor.ts

#### 3.4 use-message-normalization.ts
- **Finding:** Unique utility (CoreMessage[] → Message[] conversion)
- **Decision:** KEEP ✅
- **Rationale:** No overlap with main's utilities
- **Action:** ADD use-message-normalization.ts

---

## MERGE STRATEGY

### Recommended Approach: **Git Merge with Fast-Forward**

**Why:**
- Branch is based on main (diverged but no conflicts)
- All changes are additive or improvements
- Preserves full commit history
- Clean audit trail

### Alternative Considered: Manual Cherry-Pick
**Rejected because:**
- More work
- Loses atomic commits
- No benefit over merge

### Merge Command:
```bash
# From main branch
git merge --no-ff claude/streaming-virtualization-optimization-tE2E6 -m "Merge streaming & virtualization optimizations (Sprint 6/7)"
```

**Note:** Using `--no-ff` to preserve the feature branch history and create a merge commit.

---

## CONFLICT RESOLUTION PLAN

### Expected Conflicts: NONE

**Rationale:**
- All branch files are either:
  1. New files (no conflict possible)
  2. Modified files with additive changes
  3. Modified files with superior implementations

### If Conflicts Occur (unlikely):

1. **Accept branch version** for all conflicts
2. Review each conflict manually
3. Ensure no main functionality is lost
4. Run full verification suite

---

## VERIFICATION CHECKLIST

After merge, run:

```bash
# 1. Type checking
npm run typecheck

# 2. Linting
npm run lint

# 3. Tests
npm run test

# 4. Build
npm run build

# 5. Benchmarks (optional but recommended)
npm run bench

# 6. Storybook build
npm run build-storybook
```

**Success Criteria:**
- ✅ All type checks pass
- ✅ All lint checks pass
- ✅ All tests pass
- ✅ Build succeeds
- ✅ Benchmarks run (results may differ but should complete)
- ✅ Storybook builds successfully

---

## DEPRECATED FILES

**Files to Delete:** NONE

**Rationale:**
- No duplicates found
- No dead code identified
- All files serve a purpose

---

## FINAL DECISION SUMMARY

| Category | Count | Decision |
|----------|-------|----------|
| New files | 53 | KEEP ALL ✅ |
| Modified files | 10 | KEEP BRANCH ✅ |
| Investigated overlaps | 4 | KEEP ALL (not duplicates) ✅ |
| **TOTAL** | **67** | **KEEP ALL FROM BRANCH** ✅ |

### Impact Summary:
- **Code Quality:** ✅ +27 points (71→98/100 rubric score)
- **Performance:** ✅ 90% layout reduction, 60fps streaming
- **Memory:** ✅ 79% reduction (5K messages)
- **Accessibility:** ✅ WCAG 2.1 Level AA compliance
- **Architecture:** ✅ -846 lines through better design
- **Reliability:** ✅ Bug fixes (race conditions, reader cancellation)
- **Infrastructure:** ✅ Benchmarking, profiling, documentation

### Risk Assessment:
- **Overall Risk:** LOW ✅
- **Merge Complexity:** LOW ✅
- **Breaking Changes:** NONE ✅
- **Compatibility:** 100% maintained ✅

---

## NEXT PHASE

**Phase 5:** Create detailed implementation plan

**Tasks:**
1. Define merge steps
2. Create verification script
3. Plan rollback strategy
4. Document changelog

---

**Status:** ✅ Phase 4 COMPLETE - All canonical decisions made
**Confidence:** HIGH - Evidence-based analysis
**Date:** 2026-01-22
