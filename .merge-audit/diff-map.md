# Diff Map - Main vs Branch

**Date:** 2026-01-22

---

## Area 1: Streaming Infrastructure

### Modified Files

#### `use-chat-enhanced.ts`
**Main:** Basic streaming, NO connection tracking
**Branch:** + connectionIdRef, readerRef, rafRef, validation
**Type:** ENHANCEMENT (additive)
**Conflict:** NONE - Clean enhancement
**Action:** MERGE branch version (superior)

#### `use-streaming.ts`
**Main:** reader.cancel() WITHOUT error handling
**Branch:** + .catch() error handling
**Type:** BUG FIX
**Conflict:** NONE
**Action:** MERGE branch version (fixes bug)

#### `use-streaming-sse.tsx`
**Main:** reader.cancel() WITHOUT error handling
**Branch:** + .catch() error handling
**Type:** BUG FIX
**Conflict:** NONE
**Action:** MERGE branch version (fixes bug)

#### `use-streaming-websocket.tsx`
**Main:** Exists
**Branch:** Modified (need to check specifics)
**Type:** MODIFICATION
**Conflict:** UNKNOWN
**Action:** REVIEW modifications

#### `PromptArchitectDemo.tsx`
**Main:** reader.cancel() WITHOUT error handling
**Branch:** + .catch() error handling
**Type:** BUG FIX
**Conflict:** NONE
**Action:** MERGE branch version

---

## Area 2: Virtualization

### Modified Files

#### `virtualized-message-list.tsx`
**Main:** Basic virtualization, NO accessibility
**Branch:** + keyboard nav, screen reader mode, validation, documented defaults
**Type:** MAJOR ENHANCEMENT
**Conflict:** NONE - Additive improvements
**Action:** MERGE branch version (WCAG Level AA)

#### `tanstack-message-list.tsx`
**Main:** Basic virtualization, NO accessibility
**Branch:** + keyboard nav, screen reader mode, validation, documented defaults
**Type:** MAJOR ENHANCEMENT
**Conflict:** NONE - Additive improvements
**Action:** MERGE branch version (WCAG Level AA)

---

## Area 3: Runtime Validation

### Modified Files

#### `runtime-validation.ts`
**Main:** Basic validators only
**Branch:** + 5 new validators (+241 lines)
**Type:** EXPANSION
**Conflict:** NONE - Pure addition
**Action:** MERGE branch version (expanded functionality)

---

## Area 4: Chat Components

### Modified Files

#### `chat-input.tsx`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

#### `chat-window.tsx`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

#### `clarity-chat.tsx`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

#### `mobile-chat-optimized.tsx`
**Main:** Exists without style batching
**Branch:** + CSS text batching (66% improvement)
**Type:** PERFORMANCE ENHANCEMENT
**Conflict:** NONE
**Action:** MERGE branch version

### New Files (Branch Only)

#### `chat-window-header.tsx`
**Main:** DOES NOT EXIST
**Branch:** NEW component
**Type:** NEW
**Conflict:** NONE
**Action:** ADD from branch
**Investigation:** Check if functionality exists elsewhere

#### `empty-state.tsx`
**Main:** DOES NOT EXIST
**Branch:** NEW component
**Type:** NEW
**Conflict:** NONE
**Action:** ADD from branch
**Investigation:** Check if functionality exists elsewhere

#### `follow-up-suggestions.tsx`
**Main:** DOES NOT EXIST
**Branch:** NEW component
**Type:** NEW
**Conflict:** NONE
**Action:** ADD from branch
**Investigation:** Check if main has similar feature

---

## Area 5: Message Components

### Modified Files

#### `message-list.tsx`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

#### `message.tsx`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

### New Files (Branch Only)

#### `markdown-renderer.tsx`
**Main:** DOES NOT EXIST (but has markdown-code-block.tsx)
**Branch:** NEW component
**Type:** NEW
**Conflict:** POTENTIAL - Functional overlap with markdown-code-block.tsx
**Action:** INVESTIGATE overlap, may consolidate
**Risk:** MEDIUM - Potential duplication

#### `message-header.tsx`
**Main:** DOES NOT EXIST (but has message-metadata.tsx)
**Branch:** NEW component
**Type:** NEW
**Conflict:** POTENTIAL - Functional overlap with message-metadata.tsx
**Action:** INVESTIGATE overlap, may consolidate
**Risk:** MEDIUM - Potential duplication

---

## Area 6: Hooks

### Modified Files

#### `use-clarity-chat.ts`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

#### `use-auto-scroll.tsx`
**Main:** Exists without throttling
**Branch:** + Throttling (60fps cap)
**Type:** PERFORMANCE ENHANCEMENT
**Conflict:** NONE
**Action:** MERGE branch version

#### `use-mobile-keyboard.tsx`
**Main:** Exists
**Branch:** Modified (need specifics)
**Type:** MODIFICATION
**Conflict:** POTENTIAL
**Action:** DIFF and analyze

### New Files (Branch Only)

#### `use-screen-reader.tsx` (NEW DIRECTORY: hooks/accessibility/)
**Main:** DOES NOT EXIST
**Branch:** NEW hook in NEW directory
**Type:** NEW
**Conflict:** NONE
**Action:** ADD from branch (critical for WCAG)

#### `use-chat-editor.ts`
**Main:** DOES NOT EXIST
**Branch:** NEW hook
**Type:** NEW
**Conflict:** POTENTIAL - May overlap with existing chat hooks
**Action:** INVESTIGATE overlap with main's chat hooks
**Risk:** LOW-MEDIUM

#### `use-message-normalization.ts`
**Main:** DOES NOT EXIST
**Branch:** NEW hook
**Type:** NEW
**Conflict:** POTENTIAL - May overlap with existing utilities
**Action:** INVESTIGATE overlap with main's utilities
**Risk:** LOW

---

## Area 7: UI Components

### New Files (Branch Only)

#### `error-banner.tsx`
**Main:** DOES NOT EXIST
**Branch:** NEW component
**Type:** NEW
**Conflict:** NONE (main has extensive UI but no error-banner)
**Action:** ADD from branch

---

## Area 8: Profiling Utilities

### New Directory & Files (Branch Only)

#### `utils/profiling/` (entire directory)
**Main:** DOES NOT EXIST
**Branch:** NEW directory with 3 files (643 + 455 + export lines)
**Type:** NEW INFRASTRUCTURE
**Conflict:** NONE
**Action:** ADD entire directory from branch

---

## Area 9: Benchmarking Infrastructure

### New Directory & Files (Branch Only)

#### `__benchmarks__/` (entire directory)
**Main:** DOES NOT EXIST
**Branch:** NEW directory with 5 benchmarks + docs
**Type:** NEW INFRASTRUCTURE
**Conflict:** NONE
**Action:** ADD entire directory from branch

#### Supporting Files
- `BENCHMARK_QUICKSTART.md`
- `PERFORMANCE_BENCHMARKS_SUMMARY.md`
- `benchmarks.md`
- `baseline-benchmark-results.json`
- `scripts/compare-benchmarks.mjs`

**Main:** NONE of these exist
**Branch:** All new
**Type:** NEW INFRASTRUCTURE
**Conflict:** NONE
**Action:** ADD all from branch

#### `vitest.config.mts`
**Main:** Exists
**Branch:** Modified (added benchmark configuration)
**Type:** CONFIGURATION UPDATE
**Conflict:** POTENTIAL (config merge required)
**Action:** MERGE configurations

---

## Area 10: Performance Documentation

### New Directory & Files (Branch Only)

#### `docs/guides/performance/` (entire directory)
**Main:** DOES NOT EXIST
**Branch:** NEW directory with 7 audit reports
**Type:** NEW DOCUMENTATION
**Conflict:** NONE
**Action:** ADD entire directory from branch

---

## Area 11: Audit Documentation

### New Directory & Files (Branch Only)

#### `.streaming-perf-audit/` (entire directory)
**Main:** DOES NOT EXIST
**Branch:** NEW directory with 13 audit files
**Type:** PROJECT DOCUMENTATION
**Conflict:** NONE
**Action:** ADD entire directory from branch (or move to docs/)

---

## Area 12: Storybook

### Modified Files

#### `Advanced/Streaming/Overview.mdx`
**Main:** Exists
**Branch:** + Performance characteristics, metrics, best practices
**Type:** DOCUMENTATION ENHANCEMENT
**Conflict:** NONE
**Action:** MERGE branch version

#### `VirtualizedMessageList.stories.tsx`
**Main:** Exists
**Branch:** + Performance metrics, accessibility notes
**Type:** DOCUMENTATION ENHANCEMENT
**Conflict:** NONE
**Action:** MERGE branch version

---

## Area 13: Root Documentation

### Files

#### `PR_DESCRIPTION.md`
**Main:** Exists (may be outdated)
**Branch:** Updated
**Type:** PROJECT DOCUMENTATION
**Conflict:** LOW (can overwrite)
**Action:** Use branch version or remove after PR

#### `SPRINT_6_COMPLETION.md`
**Main:** DOES NOT EXIST
**Branch:** NEW
**Type:** PROJECT DOCUMENTATION
**Conflict:** NONE
**Action:** ADD from branch (or move to docs/)

---

## Area 14: Package Configuration

### Modified Files

#### `packages/react/package.json`
**Main:** Exists
**Branch:** Modified (dependency or script changes)
**Type:** CONFIGURATION
**Conflict:** HIGH RISK - Package changes need careful merge
**Action:** CAREFUL DIFF, merge dependencies/scripts

---

## Summary by Type

### ✅ CLEAN MERGES (No Conflicts)
1. Streaming enhancements (connection tracking, reader cleanup)
2. Virtualization accessibility (keyboard nav, screen reader)
3. Runtime validation expansion
4. Mobile optimizations (style batching)
5. Auto-scroll throttling
6. New infrastructure (benchmarks, profiling)
7. New documentation (performance guides, audits)
8. Storybook enhancements
9. New accessibility hook
10. New UI components (error-banner)

**Count:** ~50 files - Clean additions or enhancements

### ✅ INVESTIGATED (Potential Overlap - RESOLVED)
1. **markdown-renderer.tsx** vs markdown-code-block.tsx
   - **Result:** NOT duplicate - markdown-renderer USES markdown-code-block as component
   - **Decision:** KEEP BOTH (complementary)

2. **message-header.tsx** vs message-metadata.tsx
   - **Result:** NOT duplicate - Different scopes (simple header vs full metadata)
   - **Decision:** KEEP BOTH (different purposes)

3. **use-chat-editor.ts**
   - **Result:** Unique functionality - inline editing, regeneration, branching
   - **Decision:** KEEP (no overlap with main)

4. **use-message-normalization.ts**
   - **Result:** Unique utility - converts CoreMessage[] to Message[]
   - **Decision:** KEEP (no overlap with main)

**Count:** 4 files - ✅ All investigated, no duplicates found

### ✅ DIFFED (Modified Files - COMPLETE)
1. **chat-input.tsx** - Centralized runtime validation (-38 lines)
2. **chat-window.tsx** - Component extraction (-466 lines)
3. **clarity-chat.tsx** - Hook integration + Issue #7 fix (-212 lines)
4. **message-list.tsx** - Memory windowing (+11 lines)
5. **message.tsx** - Component extraction (-191 lines)
6. **use-clarity-chat.ts** - Race condition fix (+4 lines)
7. **use-mobile-keyboard.tsx** - 66% layout optimization (-3 lines)
8. **use-streaming-websocket.tsx** - RAF batching (+34 lines)
9. **vitest.config.mts** - Benchmark config (+8 lines)
10. **package.json** - Benchmark scripts (+7 lines)

**Count:** 10 files - ✅ All diffed
**Net Impact:** -846 lines (excluding configs)
**Detailed Analysis:** See `modified-files-diff-summary.md`

---

## Risk Assessment

**LOW RISK (57 files):**
- Pure additions (new directories, new files)
- Additive enhancements (no conflicts)
- Documentation updates

**MEDIUM RISK (4 files):**
- Potential functional overlap
- Need consolidation decisions

**HIGH RISK (10 files):**
- Modified existing files (need careful merge)
- Configuration files (package.json, vitest.config.mts)

**TOTAL FILES:** 71 (67 changed + 4 .merge-audit files)

---

## Phase 3 Status: ✅ COMPLETE

1. ✅ Inventory complete
2. ✅ Diff map complete
3. ✅ Investigated potential overlaps (4 files - NO duplicates found)
4. ✅ Diffed all modified files (10 files - detailed analysis in modified-files-diff-summary.md)
5. ⏭️ **NEXT:** Phase 4 - Make canonical decisions for ALL 67 files
6. ⏭️ **THEN:** Phase 5 - Create implementation plan
