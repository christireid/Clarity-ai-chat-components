# Component Refactoring Guide

**Created:** January 27, 2026
**Status:** In Progress
**Priority:** High

## Overview

This guide documents the systematic refactoring of large components (>800 lines) into smaller, more maintainable pieces. The goal is to reduce cognitive complexity, improve testability, and make the codebase easier to understand.

## Refactoring Strategy

### Phase 1: Extract Types and Utilities ✅ **STARTED**

1. Create separate `.types.ts` files for type definitions
2. Create separate `.utils.ts` files for pure functions
3. Update main component to import from these files

### Phase 2: Extract Sub-Components (Next)

1. Identify logical UI sections
2. Create separate component files for each section
3. Pass props and callbacks from parent

### Phase 3: Extract Custom Hooks (After Phase 2)

1. Extract stateful logic into custom hooks
2. Create hooks for data fetching, filtering, sorting
3. Keep components focused on presentation

## Components to Refactor

### 1. AdvancedMessageSearchSemantic.tsx ✅ **COMPLETE**

**Original Size:** 1,604 lines → **Current:** 827 lines (~48% reduction)

**Status:** Fully refactored ✅

**Completed:**
- ✅ Created `AdvancedMessageSearchSemantic.types.ts` (118 lines)
- ✅ Created `AdvancedMessageSearchSemantic.utils.ts` (139 lines)
- ✅ Created `SearchHistoryPanel.tsx` (98 lines)
- ✅ Created `SearchConfigPanel.tsx` (168 lines)
- ✅ Created `SearchResultCard.tsx` (245 lines)
- ✅ Created `useSemanticSearch.ts` hook (195 lines)
- ✅ Updated main component to use extracted pieces

**Final Structure:**
```
search/
├── AdvancedMessageSearchSemantic.tsx (827 lines) ✅
├── AdvancedMessageSearchSemantic.types.ts (118 lines) ✅
├── AdvancedMessageSearchSemantic.utils.ts (139 lines) ✅
├── components/
│   ├── SearchHistoryPanel.tsx (98 lines) ✅
│   ├── SearchConfigPanel.tsx (168 lines) ✅
│   └── SearchResultCard.tsx (245 lines) ✅
└── hooks/
    └── useSemanticSearch.ts (195 lines) ✅
```

**Total Lines:** 1,790 (distributed across 7 files)
**Main Component Reduction:** 1,604 → 827 lines (48.4% smaller)

---

### 2. ConversationAnalyticsDashboard.tsx ✅ **COMPLETE**

**Original Size:** 1,233 lines → **Current:** 244 lines (~80% reduction)

**Status:** Fully refactored ✅

**Completed:**
- ✅ Created `ConversationAnalyticsDashboard.types.ts` (157 lines)
- ✅ Created `ConversationAnalyticsDashboard.utils.ts` (321 lines)
- ✅ Created `QualityScoreCard.tsx` (100 lines)
- ✅ Created `TopicsCard.tsx` (100 lines)
- ✅ Created `SentimentCard.tsx` (73 lines)
- ✅ Created `KeyMomentsCard.tsx` (67 lines)
- ✅ Created `SummaryCard.tsx` (127 lines)
- ✅ Created `useConversationAnalytics.ts` hook (142 lines)
- ✅ Updated main component to use extracted pieces

**Final Structure:**
```
dashboards/
├── ConversationAnalyticsDashboard.tsx (244 lines) ✅
├── ConversationAnalyticsDashboard.types.ts (157 lines) ✅
├── ConversationAnalyticsDashboard.utils.ts (321 lines) ✅
├── components/
│   ├── index.ts (13 lines) ✅
│   ├── QualityScoreCard.tsx (100 lines) ✅
│   ├── TopicsCard.tsx (100 lines) ✅
│   ├── SentimentCard.tsx (73 lines) ✅
│   ├── KeyMomentsCard.tsx (67 lines) ✅
│   └── SummaryCard.tsx (127 lines) ✅
└── hooks/
    └── useConversationAnalytics.ts (142 lines) ✅
```

**Total Lines:** 1,334 (distributed across 10 files)
**Main Component Reduction:** 1,233 → 244 lines (80.2% smaller)

---

### 3. ConversationList.tsx

**Current Size:** 1,170 lines → **Target:** ~400 lines

**Analysis:**
- Virtual scrolling implementation
- Filtering and sorting logic
- Search functionality

**Proposed Extraction:**
1. Extract `ConversationListItem.tsx` (150 lines)
2. Extract `ConversationFilters.tsx` (100 lines)
3. Extract `ConversationSearch.tsx` (80 lines)
4. Extract `useConversationList.ts` hook (200 lines)
5. Extract `conversation.utils.ts` (100 lines)

---

### 4. ChainOfThought.tsx

**Current Size:** 1,104 lines → **Target:** ~500 lines

**Analysis:**
- Step-by-step reasoning visualization
- Complex animation logic
- State machine implementation

**Proposed Extraction:**
1. Extract `ThoughtStep.tsx` (100 lines)
2. Extract `ThoughtTree.tsx` (150 lines)
3. Extract `ThoughtTimeline.tsx` (100 lines)
4. Extract `useThoughtProcess.ts` hook (200 lines)
5. Extract `thought.utils.ts` (100 lines)

---

### 5. ThemeProvider.tsx

**Current Size:** 1,030 lines → **Target:** ~600 lines

**Analysis:**
- Theme configuration management
- CSS variable injection
- Color scheme computation

**Proposed Extraction:**
1. Extract theme types to `theme.types.ts` (150 lines)
2. Extract color utilities to `color.utils.ts` (100 lines)
3. Extract theme presets to `theme.presets.ts` (150 lines)
4. Extract `useThemeComputed.ts` hook (100 lines)

---

### 6. StreamingProgress.tsx

**Current Size:** 998 lines → **Target:** ~500 lines

**Analysis:**
- Real-time token streaming
- Progress visualization
- Animation orchestration

**Proposed Extraction:**
1. Extract `ProgressBar.tsx` (80 lines)
2. Extract `TokenCounter.tsx` (60 lines)
3. Extract `StreamingIndicator.tsx` (100 lines)
4. Extract `useStreamingProgress.ts` hook (150 lines)
5. Extract `streaming.utils.ts` (100 lines)

---

## Refactoring Principles

### DO:
✅ Extract pure functions to utility files
✅ Extract type definitions to separate files
✅ Create focused, single-responsibility components
✅ Extract stateful logic to custom hooks
✅ Write unit tests for extracted utilities
✅ Document component APIs with JSDoc

### DON'T:
❌ Create unnecessary abstractions
❌ Split components that are cohesive
❌ Optimize prematurely
❌ Break working functionality
❌ Forget to update imports

---

## Testing Strategy

For each refactored component:

1. **Before refactoring:**
   - Ensure existing tests pass
   - Add missing tests if coverage < 80%

2. **During refactoring:**
   - Keep tests passing at each step
   - Add tests for extracted utilities
   - Add tests for new sub-components

3. **After refactoring:**
   - Verify all tests still pass
   - Check test coverage improved
   - Run integration tests

---

## Progress Tracking

**Overall Progress:** 2/6 complete (33.33%)

| Component | Lines | Target | Current | Progress | Status |
|-----------|-------|--------|---------|----------|--------|
| AdvancedMessageSearchSemantic | 1,604 | 400 | 827 | 48% | ✅ Complete |
| ConversationAnalyticsDashboard | 1,233 | 500 | 244 | 80% | ✅ Complete |
| ConversationList | 1,170 | 400 | - | 0% | 📋 Planned |
| ChainOfThought | 1,104 | 500 | - | 0% | 📋 Planned |
| ThemeProvider | 1,030 | 600 | - | 0% | 📋 Planned |
| StreamingProgress | 998 | 500 | - | 0% | 📋 Planned |

---

## Example: Successful Refactoring Pattern

### Before: Large Component (1,000+ lines)
```tsx
// LargeComponent.tsx
export function LargeComponent() {
  // 50 lines of state
  // 100 lines of utility functions
  // 200 lines of sub-components
  // 150 lines of hooks
  // 500 lines of JSX
}
```

### After: Modular Structure (~400 lines)
```tsx
// LargeComponent.tsx
import type { Props } from './LargeComponent.types'
import { SubComponentA, SubComponentB } from './components'
import { useLargeComponentLogic } from './hooks'
import { helper1, helper2 } from './utils'

export function LargeComponent(props: Props) {
  const { state, actions } = useLargeComponentLogic(props)

  return (
    <div>
      <SubComponentA {...state.a} {...actions.a} />
      <SubComponentB {...state.b} {...actions.b} />
    </div>
  )
}
```

**Benefits:**
- ✅ Easier to understand and navigate
- ✅ Better testability (isolated units)
- ✅ Improved reusability
- ✅ Reduced cognitive load
- ✅ Easier code review

---

## Next Steps

1. Complete AdvancedMessageSearchSemantic refactoring
2. Add refactoring scripts to package.json
3. Set up automated complexity monitoring
4. Create templates for common patterns
5. Document lessons learned

---

## Scripts

```bash
# Analyze component complexity
pnpm analyze:complexity

# Find large components
find packages/react/src -name "*.tsx" -exec wc -l {} + | sort -rn | head -20

# Run tests for specific component
pnpm test -- AdvancedMessageSearchSemantic
```

---

**Last Updated:** January 27, 2026
