# Code Reuse & Consistency Audit Report

**Date:** December 17, 2025 **Branch:** `claude/reorganize-public-apis-sQdqL` **Scope:**
packages/react/src

---

## Executive Summary

This audit examined 182 modified files for code reuse opportunities and consistency issues. The
analysis identified **23 duplication instances** across hooks, utilities, components, and type
definitions that can be consolidated to improve developer experience and maintainability.

### Key Findings

| Category                | Duplications Found      | Priority | Estimated Savings |
| ----------------------- | ----------------------- | -------- | ----------------- |
| Chat Hooks              | 9 files → 3 recommended | HIGH     | ~60% reduction    |
| Accessibility Utilities | 4 files → 2 recommended | HIGH     | ~50% reduction    |
| Message Utilities       | 5 files → 2 recommended | HIGH     | ~60% reduction    |
| Core Entry Points       | 3 files → 1 recommended | MEDIUM   | ~67% reduction    |
| Token Utilities         | 5 files → 2 recommended | MEDIUM   | ~60% reduction    |
| Input Components        | 2 overlapping files     | MEDIUM   | Feature merge     |

---

## Detailed Findings

### 1. Chat Hook Proliferation (CRITICAL)

**Current State:** 9 chat-related hooks with overlapping functionality

| File                          | Purpose                       | Recommendation            |
| ----------------------------- | ----------------------------- | ------------------------- |
| `use-chat.ts`                 | Legacy, deprecated            | REMOVE in v3              |
| `use-chat-unified.ts`         | Wrapper around useClarityChat | KEEP as simplified API    |
| `use-chat-enhanced.ts`        | Vercel AI SDK compatibility   | MERGE into useClarityChat |
| `use-chat-core.ts`            | Auto message conversion       | MERGE into unified        |
| `use-chat-simple.ts`          | Basic functionality           | MERGE into unified        |
| `use-chat-composable.ts`      | Composable blocks             | KEEP for advanced users   |
| `use-chat-with-operations.ts` | Enhanced operations           | MERGE into useClarityChat |
| `use-chat-handlers.ts`        | Handler utilities             | KEEP as utility           |
| `use-chat-history.ts`         | History management            | KEEP (separate concern)   |

**Recommended Structure:**

```
hooks/chat/
├── use-clarity-chat.ts      # Top-level (primary API)
├── use-chat-unified.ts      # Simplified wrapper
├── use-chat-composable.ts   # Advanced/granular
├── use-chat-handlers.ts     # Utilities
└── use-chat-history.ts      # History concern
```

---

### 2. Accessibility Utilities Duplication (CRITICAL)

**Current State:** 4 overlapping files

| File                           | Lines | Purpose             | Status                            |
| ------------------------------ | ----- | ------------------- | --------------------------------- |
| `a11y-utils.ts`                | ~230  | Basic utilities     | Overlaps with accessibility-utils |
| `accessibility-utils.ts`       | ~275  | Similar utilities   | Primary candidate                 |
| `accessibility-utils-fixed.ts` | ~400  | WCAG 2.1 compliance | Contains fixes                    |
| `accessibility-automation.ts`  | ~600  | Testing/automation  | Unique purpose                    |

**Overlapping Functions:**

- `getContrastRatio()` / `checkContrastRatio()` - in 3 files
- `announceToScreenReader()` - in 2 files
- `createLiveRegion()` - in 2 files
- `srOnlyStyles` constant - in 2 files

**Recommendation:** Consolidate to 2 files:

```
accessibility/
├── core-utilities.ts        # Merged from a11y-utils + accessibility-utils
├── wcag-validator.ts        # WCAG compliance (from accessibility-utils-fixed)
├── accessibility-automation.ts  # Keep (testing specific)
├── focus-management.ts      # Keep (unique concern)
└── index.ts                 # Re-exports
```

---

### 3. Message Conversion Utilities (HIGH)

**Current State:** 5 files with overlapping message functions

| File                      | Status                | Action                |
| ------------------------- | --------------------- | --------------------- |
| `message-conversion.ts`   | Canonical             | KEEP as primary       |
| `message-converter.ts`    | Deprecated re-exports | REMOVE                |
| `chat-helpers.ts`         | Overlapping functions | MERGE into conversion |
| `clarity-chat-helpers.ts` | Config helpers        | KEEP separate         |
| `message-grouping.ts`     | Grouping utilities    | KEEP (unique)         |

**Duplicate Functions Found:**

```typescript
// In message-conversion.ts
extractTextContent()
convertCoreMessageToMessage()

// In chat-helpers.ts (duplicated)
messageToText() // Same as extractTextContent
extractTextContent()
```

---

### 4. Core Entry Point Files (MEDIUM)

**Current State:** 3 nearly identical entry points

| File                    | Purpose        | Recommendation            |
| ----------------------- | -------------- | ------------------------- |
| `core.ts`               | Primary entry  | KEEP                      |
| `core-minimal.ts`       | Minimal bundle | REMOVE (use tree-shaking) |
| `core-minimal-fixed.ts` | Fixed variant  | REMOVE                    |

**Rationale:** Modern bundlers with tree-shaking eliminate the need for separate minimal entry
points. The tsup configuration already handles this.

---

### 5. Token Optimization Utilities (MEDIUM)

**Current State:** 5 files for token optimization

| File                                  | Location           | Recommendation          |
| ------------------------------------- | ------------------ | ----------------------- |
| `use-token-optimization.tsx`          | hooks/token        | KEEP as primary hook    |
| `use-token-optimization-enhanced.tsx` | hooks/token        | MERGE into primary      |
| `token-optimization.ts`               | utils/optimization | KEEP as utility         |
| `adaptive-optimizer.ts`               | utils/tokenization | MERGE into optimization |
| `dynamic-optimization.ts`             | utils/tokenization | MERGE into optimization |

---

### 6. Pattern Inconsistencies

#### 6.1 Error Handling

| Pattern                     | Files Using | Recommendation         |
| --------------------------- | ----------- | ---------------------- |
| `error: Error \| null`      | 12 hooks    | Convert to undefined   |
| `error: Error \| undefined` | 8 hooks     | STANDARDIZE on this    |
| Custom error types          | 3 hooks     | Use ClarityError class |

#### 6.2 Loading State Naming

| Pattern     | Files Using | Recommendation         |
| ----------- | ----------- | ---------------------- |
| `isLoading` | 18 hooks    | STANDARDIZE on this    |
| `loading`   | 5 hooks     | Rename to isLoading    |
| `isPending` | 3 hooks     | Keep where appropriate |

#### 6.3 Options Interface Naming

| Pattern            | Files Using | Recommendation    |
| ------------------ | ----------- | ----------------- |
| `Use[Hook]Options` | 22 hooks    | STANDARDIZE       |
| `[Hook]Config`     | 5 hooks     | Rename to Options |
| `[Hook]Settings`   | 2 hooks     | Rename to Options |

---

## Consolidation Priority Matrix

| Priority | Item                                       | Files Affected | Effort | Impact    |
| -------- | ------------------------------------------ | -------------- | ------ | --------- |
| 1        | Remove deprecated core-minimal files       | 2              | Low    | Medium    |
| 2        | Consolidate message-converter (deprecated) | 1              | Low    | Low       |
| 3        | Merge accessibility utilities              | 3              | Medium | High      |
| 4        | Consolidate chat hooks                     | 4              | High   | Very High |
| 5        | Standardize error handling                 | 15+            | Medium | Medium    |
| 6        | Merge token optimization files             | 3              | Medium | Medium    |

---

## Quick Wins (Immediate Actions)

### Action 1: Remove Deprecated Files

```bash
# Files safe to remove immediately
rm packages/react/src/core-minimal.ts
rm packages/react/src/core-minimal-fixed.ts
rm packages/react/src/utils/message/message-converter.ts
```

### Action 2: Update Re-exports

Update `accessibility/index.ts` to consolidate exports from fewer files.

### Action 3: Standardize Loading State

Search and replace `loading:` with `isLoading:` in hook return types.

---

## Strategic Recommendations

### Short Term (This PR)

1. Remove the 3 deprecated/redundant files identified above
2. Add deprecation notices to files scheduled for removal in v3
3. Standardize error handling pattern across modified hooks

### Medium Term (Next Sprint)

1. Consolidate accessibility utilities into 2 files
2. Merge overlapping chat hooks (use-chat-core, use-chat-simple)
3. Unify token optimization utilities

### Long Term (v3.0)

1. Remove all deprecated use-chat.ts hooks
2. Complete hook architecture simplification
3. Full accessibility module refactor with proper WCAG compliance

---

## Files Modified in This Audit

This report analyzes the following key file groups:

- `hooks/chat/use-chat*.ts` (9 files)
- `accessibility/*.ts` (6 files)
- `utils/message/*.ts` (5 files)
- `core*.ts` (3 files)
- `hooks/token/*.tsx` (4 files)
- `utils/optimization/*.ts` (5 files)

---

## Conclusion

The codebase shows signs of organic growth with multiple contributors implementing similar
solutions. By consolidating the identified duplications, we can:

1. **Reduce cognitive load** - Fewer files to understand
2. **Improve maintainability** - Single source of truth
3. **Better DX** - Clearer API choices for developers
4. **Smaller bundles** - Less duplicate code to ship

The highest impact changes are consolidating the chat hooks and accessibility utilities, which
represent the most significant duplication.
