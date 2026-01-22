# Merge Audit - Scope & Initial State

**Date**: 2026-01-22 **Branch**: `ultimate-token-opt` **Target**: `main`

---

## Phase 0: Sync & Safety ✅

### Repository State

**Current Branch**: `ultimate-token-opt`

- HEAD SHA: `29d1e8a0c` (after committing 100/100 score work)
- Original HEAD: `0efd098ff91d4b2a7eb38b0903c3f366d2f6d927`

**Main Branch**: `main`

- HEAD SHA: `7ed57c479` (origin/main)
- Update: Fast-forwarded 103 commits, 42,506 files updated

**Safety Branch**: `backup-ultimate-token-opt-20260122-145802`

- Backup of ultimate-token-opt before any merge operations

### Recent Work on Branch (Latest Commit)

```
feat: Complete 100/100 score - accessibility streaming, tool validation, regenerate hook

Changes:
- useDebouncedStreamingAnnouncements hook (500ms debounce)
- useStreamingFocusPreservation hook
- AbortSignal timeout cleanup in tools-engine
- JSON Schema validation (string/number/array constraints)
- useRegenerateMessage hook
- 46 new tests (all passing)
- Rubric updated to 100/100
```

---

## Phase 1: Determine Worked On Areas ✅

### Total Changed Files: 4,023

**Source Code Changes**: 78 files (Modified: 56, Added: 22) **Docs Restructuring**: ~3,900+ files
(mostly moved to .archive/v1-legacy/) **Build Artifacts Cleaned**: ~50 files (removed .js, .map
files from src/)

### Logical Areas (Grouped by Feature/Module)

#### 1. **Tool Calling & Approval System** (HIGH PRIORITY)

**Files (7)**:

- `M` packages/react/src/app-api/tools-engine.ts
- `M` packages/react/src/app-api/types.ts
- `A` packages/react/src/app-api/**tests**/tools-engine.test.ts
- `A` packages/react/src/app-api/**tests**/tools-engine-abort.test.ts
- `A` packages/react/src/app-api/**tests**/tools-engine-approval.test.ts
- `A` packages/react/src/app-api/**tests**/tools-engine-validation.test.ts

**Purpose**: Enhanced tool execution with AbortSignal cleanup, comprehensive JSON Schema validation,
and capability-based approval system.

**Key Features**:

- AbortSignal timeout cleanup (HIGH-005)
- JSON Schema validation (string/number/array constraints)
- Tool approval modes (auto/manual/allowlist/blocklist)
- Risk classification & audit logging
- 26+ comprehensive tests

**Suspected Overlaps**: None identified yet - need to check main for competing implementations.

---

#### 2. **Message Operations & State Management** (HIGH PRIORITY)

**Files (14)**:

- `M` packages/react/src/hooks/message/use-message-operations.ts
- `M` packages/react/src/hooks/message/index.ts
- `A` packages/react/src/hooks/message/use-regenerate-message.ts
- `A` packages/react/src/hooks/message/**tests**/use-regenerate-message.test.tsx
- `A` packages/react/src/hooks/message/**tests**/use-message-operations-branch.test.tsx
- `A` packages/react/src/hooks/message/**tests**/use-message-operations-rollback.test.tsx
- `A` packages/react/src/hooks/message/**tests**/use-message-operations-race.test.tsx
- `A` packages/react/src/hooks/message/**tests**/use-message-operations-production-race.test.tsx
- `A` packages/react/src/hooks/message/**tests**/queue-debug.test.tsx
- `A` packages/react/src/hooks/message/**tests**/reducer-debug.test.tsx
- `M` packages/react/src/components/context/history-manager.tsx
- `M` packages/react/src/components/**tests**/history-manager.test.tsx
- `M` packages/react/src/hooks/chat/use-chat.ts
- `M` packages/react/src/internal/hooks/use-chat-enhanced.ts

**Purpose**: Fixed critical race conditions in undo/redo, branch conversation, edit rollback, and
regenerate operations.

**Key Features**:

- Undo/redo race condition fixes (CRIT-001)
- Branch conversation self-reference fixes (HIGH-001)
- Message edit rollback (HIGH-002)
- Regenerate stale closure fix (HIGH-006)
- useRegenerateMessage hook with 12 tests
- 25+ comprehensive tests

**Suspected Overlaps**: CHECK - May overlap with message handling improvements on main.

---

#### 3. **Streaming Robustness** (HIGH PRIORITY)

**Files (4)**:

- `M` packages/react/src/hooks/streaming/use-streaming-sse.tsx
- `A` packages/react/src/hooks/streaming/**tests**/use-streaming-sse-disconnect-race.test.tsx
- `A` packages/react/src/hooks/streaming/**tests**/use-streaming-sse-memory-leak.test.tsx
- `A` packages/react/src/hooks/streaming/**tests**/use-streaming-sse-state-machine.test.tsx

**Purpose**: Fixed memory leaks and race conditions in SSE streaming.

**Key Features**:

- Disconnect race condition fix (CRIT-003)
- State machine validation (CRIT-004)
- Memory leak fix in SSE reconnection (CRIT-002)
- 10+ streaming tests

**Suspected Overlaps**: CHECK - Streaming may have been improved on main.

---

#### 4. **Accessibility - Streaming Features** (HIGH PRIORITY)

**Files (3)**:

- `M` packages/react/src/utils/accessibility-helpers.tsx
- `M` packages/react/src/utils/accessibility-testing.tsx
- `A` packages/react/src/utils/**tests**/accessibility-streaming.test.tsx

**Purpose**: Screen reader-friendly streaming with debounced announcements and focus preservation.

**Key Features**:

- `useDebouncedStreamingAnnouncements` hook (500ms debounce, MED-030)
- `useStreamingFocusPreservation` hook
- Only announces >10% content changes
- 12 accessibility streaming tests

**Suspected Overlaps**: CHECK - Main may have different accessibility implementations.

---

#### 5. **Token Optimization Components** (MEDIUM PRIORITY)

**Files (10)**:

- `M` packages/react/src/components/token/TokenCostPreview.tsx
- `M` packages/react/src/components/token/TokenOptimizationBadge.tsx
- `M` packages/react/src/components/token/TokenOptimizationDashboard.tsx
- `M` packages/react/src/components/token/TokenOptimizationPanel.tsx
- `M` packages/react/src/components/token/token-usage-meter.tsx
- `M` packages/react/src/hooks/token/use-token-budget-monitor.tsx
- `M` packages/react/src/utils/tokenization/estimator.ts
- `M` packages/react/src/utils/tokenization/model-pricing.ts
- `M` packages/react/src/utils/tokenization/model-registry.ts
- `M` packages/react/src/utils/tokenization/robust-error-handling.ts

**Purpose**: Token budget monitoring and optimization UI components.

**Suspected Overlaps**: CHECK - Token features may have evolved on main.

---

#### 6. **Theme & Styling** (MEDIUM PRIORITY)

**Files (10)**:

- `M` packages/react/src/theme/ThemeProvider.tsx
- `M` packages/react/src/theme/create-theme.ts
- `M` packages/react/src/theme/color-utils.ts
- `M` packages/react/src/theme/theme-validator.ts
- `M` packages/react/src/theme/**tests**/create-theme.test.ts
- `M` packages/react/src/theme/**tests**/theme-validator.test.ts
- `M` packages/react/src/styles/index.css
- `A` packages/react/src/styles/**tests**/contrast.test.ts
- `A` packages/react/src/styles/**tests**/contrast-calculate.test.ts
- `M` packages/react/src/hooks/theme/use-theme-analytics.ts

**Purpose**: Theme system improvements, contrast validation, WCAG AA compliance.

**Key Features**:

- Message gradient contrast fixes (HIGH-008)
- Theme validation enhancements
- Contrast calculation tests

**Suspected Overlaps**: CHECK - Theme system may have been refactored on main.

---

#### 7. **UI Components & Error Handling** (LOW PRIORITY)

**Files (7)**:

- `M` packages/react/src/components/ui/skeleton-enhanced.tsx
- `M` packages/react/src/components/ui/error-boundary.tsx
- `M` packages/react/src/components/ui/**tests**/skeleton.test.tsx
- `M` packages/react/src/components/ai/enhanced-markdown-renderer.tsx
- `M` packages/react/src/components/chat/chat-input.tsx
- `M` packages/react/src/components/code/CodeBlock.tsx
- `M` packages/react/src/error/ErrorReporter.tsx

**Purpose**: UI polish, skeleton shimmer fixes (HIGH-009), error boundary improvements.

**Suspected Overlaps**: CHECK - Component refactoring may exist on main.

---

#### 8. **Security & Logging** (MEDIUM PRIORITY)

**Files (8)**:

- `M` packages/react/src/utils/security.tsx
- `M` packages/react/src/utils/logger.ts
- `M` packages/react/src/utils/analytics.tsx
- `M` packages/react/src/internal/debug.ts
- `M` packages/react/src/internal/dev-warnings.ts
- `M` packages/react/src/error/index.ts
- `M` packages/react/src/utils/config/env-validation.ts
- `M` packages/react/src/typescript/typescript-declaration-validator.ts

**Purpose**: PII sanitization in logs (TODO-008), security hardening, enhanced debugging.

**Suspected Overlaps**: CHECK - Security implementations may differ.

---

#### 9. **Performance & Testing Infrastructure** (LOW PRIORITY)

**Files (6)**:

- `M` packages/react/src/utils/performance-monitoring.tsx
- `M` packages/react/src/utils/testing-helpers.tsx
- `M` packages/react/src/utils/lazy-loading.tsx
- `M` packages/react/src/utils/sync-manager.ts
- `M` packages/react/src/hooks/ui/use-merged-ref.ts
- `M` packages/react/src/internal/hooks/**tests**/use-chat-enhanced-reload.test.tsx

**Purpose**: Performance monitoring, testing utilities, optimization helpers.

**Suspected Overlaps**: CHECK - Performance tooling may have been added to main.

---

#### 10. **Public API Surface** (CRITICAL)

**Files (1)**:

- `M` packages/react/src/public-api.ts

**Purpose**: Updated public API exports for new hooks and utilities.

**Suspected Overlaps**: HIGH RISK - Main likely has different public API changes.

---

#### 11. **Documentation Audit Artifacts** (NEW)

**Files (8)**:

- `A` .clarity-audit/AUDIT-SUMMARY.md
- `A` .clarity-audit/TOOL-APPROVAL-DESIGN.md
- `A` .clarity-audit/TYPESCRIPT-IMPROVEMENTS.md
- `A` .clarity-audit/inventory.md
- `A` .clarity-audit/issues.md
- `A` .clarity-audit/plan.md
- `A` .clarity-audit/rubric.md
- `A` .clarity-audit/todos.md

**Purpose**: Quality audit documentation, 100/100 score tracking.

**Suspected Overlaps**: None - this is new audit documentation.

---

### HIGH-RISK OVERLAP AREAS (To Investigate in Phase 2)

1. **Public API Surface** - Critical path, merge conflicts likely
2. **Message Operations** - Core functionality, may have parallel improvements
3. **Tool System** - May have been refactored independently
4. **Streaming** - High activity area, race condition fixes may overlap
5. **Accessibility** - Core requirement, may have different implementations
6. **Theme System** - Design system updates may conflict

---

### Next: Phase 2 - Full Inventory of Main vs Branch

Will inventory each area on both main and branch to detect:

- Duplicate implementations
- Conflicting APIs
- Divergent patterns
- Missing features
- Redundant code
