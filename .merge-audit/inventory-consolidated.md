# Consolidated Inventory: Main vs Branch

**Purpose**: Efficient side-by-side comparison of high-risk areas to enable fast duplicate detection
and canonical decisions.

---

## AREA 1: Tool Calling ✅ FULLY INVENTORIED

See `inventory-main.md` and `inventory-branch.md` for complete details.

**Summary**:

- **Main**: Basic tool system, no timeout cleanup, simple validation, autoApprove boolean only
- **Branch**: +412 lines, AbortSignal cleanup, JSON Schema validation, approval modes, risk levels,
  audit logging, PII sanitization, +46 tests
- **Overlap**: None - branch is pure enhancement
- **Conflicts**: None - backward compatible (AbortSignal optional, autoApprove preserved)
- **Decision**: **Branch is canonical** (superset of main)

---

## AREA 2: Message Operations

### Main Branch

**Files**:

- `use-message-operations.ts` (~700 lines)
- `use-message-history.ts`
- `use-optimistic-message.ts`
- Tests: Basic coverage

**Exports from use-message-operations**:

- `regenerateMessage(messageId)` - Part of operations return
- Basic undo/redo
- Edit/delete operations
- Branch conversation

**Known Issues on Main**:

- Potential race conditions (not explicitly fixed)
- No dedicated regenerate hook
- Limited test coverage for edge cases

### Branch

**Files** (Same as main + NEW):

- `use-message-operations.ts` - **ENHANCED** with race condition fixes
- `use-message-history.ts`
- `use-optimistic-message.ts`
- **NEW**: `use-regenerate-message.ts` (~262 lines)
- **NEW Tests** (25+ tests):
  - `use-regenerate-message.test.tsx` (12 tests)
  - `use-message-operations-branch.test.tsx` (branch conversation fixes)
  - `use-message-operations-rollback.test.tsx` (edit rollback)
  - `use-message-operations-race.test.tsx` (undo/redo races)
  - `use-message-operations-production-race.test.tsx`
  - `queue-debug.test.tsx`
  - `reducer-debug.test.tsx`

**Exports from use-message-operations** (Enhanced):

- `regenerateMessage(messageId)` - **STILL EXISTS** (backward compatible)
- **FIXED**: Undo/redo race conditions (CRIT-001)
- **FIXED**: Branch conversation self-references (HIGH-001)
- **ADDED**: Edit rollback support (HIGH-002)

**NEW Export from use-regenerate-message**:

```typescript
export function useRegenerateMessage<T>(options): {
  regenerateLast: () => Promise<void>
  regenerateFrom: (messageId: string) => Promise<void>
  isRegenerating: boolean
  regeneratingMessageId: string | null
}
```

**Features**:

- Stale closure prevention with useRef pattern
- Lifecycle callbacks (start/complete/error)
- Support for custom message types
- 12 comprehensive tests

**Overlap Analysis**:

- ✅ `regenerateMessage` exists in BOTH (backward compatible)
- ✅ `useRegenerateMessage` is ADDITIONAL (not replacement)
- ✅ No conflicts - complementary APIs

**Decision Preview**: **Branch canonical** - provides both simple (`regenerateMessage`) and advanced
(`useRegenerateMessage`) APIs

---

## AREA 3: Streaming

### Main Branch

**Files**:

- `use-streaming-sse.tsx` (~400 lines, estimated)
- Basic SSE streaming
- Standard connection management

**Known Issues on Main**:

- Potential memory leaks in reconnection
- Race conditions on disconnect
- No state machine validation

### Branch

**Files** (Same + ENHANCED):

- `use-streaming-sse.tsx` - **ENHANCED** with race condition fixes, memory leak fixes
- **NEW Tests** (10+ tests):
  - `use-streaming-sse-disconnect-race.test.tsx`
  - `use-streaming-sse-memory-leak.test.tsx`
  - `use-streaming-sse-state-machine.test.tsx`

**Fixes**:

- ✅ Disconnect race condition (CRIT-003)
- ✅ State machine validation (CRIT-004)
- ✅ Memory leak in SSE reconnection (CRIT-002)

**Overlap**: None - pure fixes to existing code **Conflicts**: None - fixes bugs, doesn't change API
**Decision**: **Branch canonical** (fixes critical bugs)

---

## AREA 4: Accessibility

### Main Branch

**Files**:

- `accessibility-helpers.tsx` (~300 lines, estimated)
- Basic ARIA utilities
- Screen reader support

**Exports**:

- `createAccessibleButtonProps`
- `createAccessibleDialogProps`
- `announceToScreenReader`
- `useScreenReaderAnnouncements`
- Standard keyboard navigation helpers

### Branch

**Files** (Same + ENHANCED):

- `accessibility-helpers.tsx` - **ENHANCED** with streaming features (~500+ lines)
- `accessibility-testing.tsx` - Enhanced
- **NEW Tests**:
  - `accessibility-streaming.test.tsx` (12 tests)

**NEW Exports**:

```typescript
export function useDebouncedStreamingAnnouncements(delay = 500): {
  announce: (message: string, priority: 'polite' | 'assertive') => void
  clear: () => void
}

export function useStreamingFocusPreservation(isStreaming: boolean): {
  shouldPreserveFocus: boolean
  focusedElementRef: React.MutableRefObject<HTMLElement | null>
}
```

**Features**:

- 500ms debounce for streaming announcements (MED-030)
- Only announces >10% content changes
- Focus preservation during streaming
- Respects user focus changes
- Proper cleanup on unmount
- 12 comprehensive tests

**Overlap**: None - pure additions **Conflicts**: None - new hooks, existing APIs unchanged
**Decision**: **Branch canonical** (adds streaming-specific accessibility)

---

## AREA 5: Token Optimization Components (LOW PRIORITY)

**Status**: Modified on branch, likely minor enhancements **Risk**: Low - UI components, unlikely
conflicts **Strategy**: Accept branch changes (likely improvements)

---

## AREA 6: Theme & Styling (MEDIUM PRIORITY)

**Key Changes on Branch**:

- Contrast validation fixes (HIGH-008)
- WCAG AA compliance improvements
- Gradient contrast fixes

**Risk**: Medium - may have design system changes on main **Needs**: Quick diff to check for
conflicts

---

## AREA 7-9: UI, Security, Performance (LOW PRIORITY)

**Status**: Minor enhancements on branch **Risk**: Low **Strategy**: Accept branch changes unless
main has major refactors

---

## AREA 10: Public API Surface (CRITICAL - HIGH RISK)

**Status**: **MUST REVIEW CAREFULLY** **Risk**: **VERY HIGH** - main likely has different export
changes **Strategy**: Manual merge required - inventory both sides completely

---

## AREA 11: Documentation Audit Artifacts

**Status**: New on branch only **Risk**: None - doesn't exist on main **Decision**: **Keep all** -
quality audit documentation

---

## PHASE 2 COMPLETION SUMMARY

**Fully Inventoried**: Areas 1, 2, 3, 4 (highest risk) **Partially Inventoried**: Areas 5-10 **No
Conflicts Detected**: Areas 1-4 (branch is superset/fixes) **Requires Manual Merge**: Area 10
(Public API)

**Next**: Phase 3 - Create detailed diff-map and duplicates analysis
