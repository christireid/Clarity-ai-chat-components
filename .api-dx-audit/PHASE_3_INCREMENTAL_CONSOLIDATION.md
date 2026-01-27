# Phase 3: Incremental Consolidation 🔄

**Date**: 2026-01-27 **Status**: IN PROGRESS **Goal**: Consolidate P0 duplicates one at a time,
maintaining green build

---

## Overview

Following CTO's "one at a time" principle:

- Fix ONE duplicate → Build → Test → Commit → Repeat
- Prioritize by customer impact (P0 > P1 > P2)
- Never break the build

---

## Prioritization

### P0: Customer-Facing (CURRENT FOCUS)

1. **useClarityChat Import Paths** ⏳ IN PROGRESS
   - Issue: Two import paths for same hook
   - Impact: Developer confusion, inconsistent API
   - Files: 18+ files importing from wrong path
   - Strategy: Standardize on `hooks/use-clarity-chat/`

2. **Markdown Renderers** (NEXT)
   - Issue: Multiple markdown rendering implementations
   - Impact: Inconsistent rendering, bundle bloat
   - Strategy: Consolidate to single renderer

3. **Chat Components** (PLANNED)
   - Issue: Similar chat UI components with overlap
   - Strategy: Identify canonical versions

### P1: Internal Duplicates

4. **Retry Logic** (PLANNED)
   - Issue: Multiple retry implementations
   - Impact: Maintenance burden
   - Strategy: Extract shared retry utility

5. **Validation Logic** (PLANNED)
   - Issue: Duplicate validation patterns
   - Strategy: Create validation utility library

### P2: Nice-to-Have

6. **Directory Restructuring** (DEFERRED)
   - Issue: Inconsistent folder organization
   - Strategy: Wait until after P0/P1 consolidation

---

## Current Consolidation: useClarityChat Import Paths

### Problem

Two ways to import the same hook:

```typescript
// Path 1: Direct import (used by public-api.ts)
import { useClarityChat } from './hooks/use-clarity-chat'

// Path 2: Via wrapper (used by 18+ internal files)
import { useClarityChat } from './hooks/chat/use-clarity-chat'
```

### Files Affected

Files importing from `hooks/chat/use-clarity-chat`:

- `src/core-minimal.ts`
- `src/core.ts`
- `src/hooks.ts`
- `src/slim.ts`
- `src/types.ts`
- `src/namespaced.ts`
- `src/_internal-exports.ts`
- `src/components/chat/ClarityChat.tsx`
- `src/components/__tests__/clarity-chat.test.tsx`
- `src/test-utils/use-clarity-chat-test-utils.tsx`
- `src/types/clarity-chat-types.ts`
- `src/domains/chat/index.ts`
- `src/presets/chat-presets.ts`
- `src/prompt/architect/hooks/use-architect-chat.ts`
- `src/utils/message/clarity-chat-helpers.ts`
- And more...

### Solution

**Decision**: Standardize on `hooks/use-clarity-chat/` (the actual implementation)

**Reasoning**:

- It's the canonical path used by `public-api.ts`
- Removing the wrapper eliminates indirection
- More explicit (shows it's a modular hook folder)

**Steps**:

1. Update all imports to use `hooks/use-clarity-chat/`
2. Remove wrapper file `hooks/chat/use-clarity-chat.ts`
3. Build to verify no breakage
4. Run tests to verify functionality
5. Commit with clear message

### Implementation Plan

```bash
# 1. Update imports (do in batches if needed)
# 2. Build
pnpm --filter "@clarity-chat/react" build

# 3. Test
pnpm --filter "@clarity-chat/react" test

# 4. Commit
git add -A
git commit -m "refactor: standardize useClarityChat import path"
```

---

## Metrics

| Metric                     | Before Phase 3 | Current | Target |
| -------------------------- | -------------- | ------- | ------ |
| **Duplicate Patterns**     | 716            | TBD     | <500   |
| **Import Path Variations** | 2              | TBD     | 1      |
| **Audit Score**            | 65/100         | TBD     | 75/100 |

---

## Next Steps

After completing useClarityChat consolidation:

1. ✅ Commit changes
2. ✅ Verify build still passes
3. 🔄 Move to next P0: Markdown renderers
4. 🔄 Repeat process

---

**Status**: 🚀 PHASE 3 IN PROGRESS **Current Task**: Consolidating useClarityChat import paths
**Confidence**: HIGH (clear path forward, low risk) **Timeline**: 1 hour per P0 item (estimated)
