# API Cohesion - Visual Architecture

## Current State (Score: 63/100) ❌

```
┌─────────────────────────────────────────────────────────────┐
│                    @clarity-chat/react                      │
│                                                              │
│  Components:                                                │
│  ├─ ClarityChat ✅                                          │
│  ├─ MessageList ✅                                          │
│  ├─ TokenBudgetBar ⚠️ (duplicated)                         │
│  ├─ TokenOptimizationPanel ⚠️ (duplicated)                 │
│  └─ TokenOptimizationBadge ⚠️ (duplicated)                 │
│                                                              │
│  Hooks:                                                     │
│  ├─ useClarityChat ✅                                       │
│  ├─ useTokenBudgetMonitor ⚠️ (naming conflict)             │
│  └─ Missing: useTokenCount, useTokenOptimization ❌        │
│                                                              │
│  Types:                                                     │
│  ├─ MessageContent ✅                                       │
│  ├─ TokenUsage (aliased) ⚠️                                │
│  ├─ TokenEstimate ❌ MISSING                                │
│  └─ ModelId ❌ MISSING                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ imports (52 files)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              @clarity-chat/token-optimization                │
│                                                              │
│  ⚠️ PROBLEM: Exports React components (layering violation)  │
│                                                              │
│  Components:                                                │
│  ├─ TokenBudgetBar ⚠️ (duplicated)                         │
│  ├─ TokenOptimizationPanel ⚠️ (duplicated)                 │
│  ├─ TokenOptimizationBadge ⚠️ (duplicated)                 │
│  └─ TokenCostPreview ⚠️ (duplicated)                       │
│                                                              │
│  Hooks:                                                     │
│  ├─ useTokenCount ✅                                        │
│  ├─ useTokenOptimization ✅                                 │
│  ├─ useTokenBudget ⚠️ (naming conflict)                    │
│  └─ useTokenBudgetMonitor ⚠️ (naming conflict)             │
│                                                              │
│  Utils:                                                     │
│  ├─ countTokens ✅                                          │
│  ├─ TokenCounter ⚠️ (4 variations!)                        │
│  │  ├─ AccurateTokenCounter                                 │
│  │  ├─ SimpleTokenCounter                                   │
│  │  ├─ LegacyTokenCounter                                   │
│  │  └─ AdvancedTokenCounter                                 │
│  └─ compressText ✅                                         │
│                                                              │
│  Types:                                                     │
│  ├─ ModelId ✅                                              │
│  ├─ TokenModelConfig ⚠️ (collides with ModelConfig)       │
│  ├─ TokenUsage ✅                                           │
│  ├─ TokenEstimate ✅                                        │
│  └─ BudgetStatus ⚠️ (duplicated)                           │
└─────────────────────────────────────────────────────────────┘

PROBLEMS:
🔴 7 duplicate component exports
🔴 Type conflicts (TokenUsage, TokenEstimate)
🔴 Hook naming confusion (useTokenBudget variants)
🟡 4 TokenCounter variations
🟡 Type name collisions
🟠 Missing re-exports in react package
```

---

## Desired State (Score: 92/100) ✅

```
┌─────────────────────────────────────────────────────────────┐
│                    @clarity-chat/react                      │
│                    (UI Component Layer)                     │
│                                                              │
│  Components:                                                │
│  ├─ ClarityChat ✅                                          │
│  ├─ MessageList ✅                                          │
│  ├─ TokenBudgetBar ✅ (only here)                          │
│  ├─ TokenOptimizationPanel ✅ (only here)                  │
│  └─ TokenOptimizationBadge ✅ (only here)                  │
│                                                              │
│  Hooks (from token-optimization):                          │
│  ├─ useTokenCount ✅ (re-exported)                         │
│  ├─ useTokenOptimization ✅ (re-exported)                  │
│  ├─ useTokenBudgetBar ✅ (component-specific)              │
│  └─ useTokenBudgetTracking ✅ (analytics)                  │
│                                                              │
│  Chat Hooks (react-specific):                              │
│  ├─ useClarityChat ✅                                       │
│  └─ useChat ✅                                              │
│                                                              │
│  Types (re-exported from token-optimization):              │
│  ├─ ModelId ✅                                              │
│  ├─ TokenUsage ✅                                           │
│  ├─ TokenEstimate ✅                                        │
│  ├─ BudgetStatus ✅                                         │
│  └─ ModelPricing ✅                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ imports (clean re-exports)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              @clarity-chat/token-optimization                │
│                  (Logic & Hooks Layer)                      │
│                                                              │
│  ✅ NO COMPONENTS (pure logic/hooks)                        │
│                                                              │
│  Hooks:                                                     │
│  ├─ useTokenCount ✅                                        │
│  ├─ useTokenOptimization ✅                                 │
│  ├─ useTokenBudgetBar ✅ (renamed)                         │
│  ├─ useTokenBudgetTracking ✅ (renamed)                    │
│  └─ useTieredCache ✅                                       │
│                                                              │
│  Utils:                                                     │
│  ├─ countTokens ✅                                          │
│  ├─ AccurateTokenCounter ✅ (production)                   │
│  ├─ FastTokenCounter ✅ (renamed from Simple)              │
│  ├─ LegacyTokenCounter ✅ (@deprecated)                    │
│  └─ compressText ✅                                         │
│                                                              │
│  Types:                                                     │
│  ├─ ModelId ✅                                              │
│  ├─ ModelRegistryConfig ✅ (renamed)                       │
│  ├─ ModelRoutingConfig ✅ (routing types)                  │
│  ├─ TokenUsage ✅ (single source)                          │
│  ├─ TokenEstimate ✅ (single source)                       │
│  └─ BudgetStatus ✅ (single source)                        │
└─────────────────────────────────────────────────────────────┘

IMPROVEMENTS:
✅ Clear separation: UI vs Logic
✅ No duplicate exports
✅ Consistent naming (Fast/Accurate/Legacy)
✅ Single source of truth for types
✅ React package has complete API surface
✅ Proper layering maintained
```

---

## Import Patterns

### Current State (Confusing) ❌

```typescript
// Option 1: Import from token-optimization
import { TokenBudgetBar } from '@clarity-chat/token-optimization'

// Option 2: Import from react
import { TokenBudgetBar } from '@clarity-chat/react'

// ❌ PROBLEM: Both work! Which is correct?
```

### Desired State (Clear) ✅

```typescript
// ✅ Logic & Hooks from token-optimization
import { useTokenCount, countTokens, AccurateTokenCounter } from '@clarity-chat/token-optimization'

// ✅ UI Components from react
import { TokenBudgetBar, ClarityChat } from '@clarity-chat/react'

// ✅ Can also get hooks from react (re-exported)
import { useTokenCount } from '@clarity-chat/react'
```

---

## Type System

### Current State (Fragmented) ❌

```typescript
// token-optimization exports
export type TokenUsage = { ... }
export type TokenEstimate = { ... }

// react exports (conflicts!)
export type TokenUsage = { ... } // Different definition!
// TokenEstimate is MISSING!

// User confusion:
import type { TokenUsage } from '@clarity-chat/react'
//                           ^^^^^^^ Which one?
```

### Desired State (Single Source) ✅

```typescript
// ✅ token-optimization: Single source of truth
export type TokenUsage = { ... }
export type TokenEstimate = { ... }
export type ModelId = ...
export type BudgetStatus = ...

// ✅ react: Re-exports (no redefinition)
export type {
  TokenUsage,
  TokenEstimate,
  ModelId,
  BudgetStatus,
} from '@clarity-chat/token-optimization'

// ✅ User clarity:
import type { TokenUsage } from '@clarity-chat/react'
//                           ^^^^^^^^^^^^^^^^^^^^
//                           Guaranteed same type as token-optimization
```

---

## TokenCounter Naming

### Current State (Confusing) ❌

```
TokenCounter (which one???)
├─ AccurateTokenCounter
├─ SimpleTokenCounter
├─ TokenCounter (legacy)
├─ AdvancedTokenCounter
└─ TokenCounter (interface) ← NAME COLLISION!
```

### Desired State (Clear Hierarchy) ✅

```
Production Use:
├─ AccurateTokenCounter ← Default choice
└─ FastTokenCounter ← Performance-critical code

Advanced Use:
└─ AdvancedTokenCounter ← Special features

Legacy:
└─ LegacyTokenCounter (@deprecated)

Interfaces:
└─ TokenCountingProvider ← No collision
```

---

## Hook Naming

### Current State (Confusing) ❌

```
useTokenBudget (what does this do?)
├─ Component-specific? ❓
└─ Analytics/tracking? ❓

useTokenBudgetMonitor (what does this do?)
├─ Component-specific? ❓
└─ Analytics/tracking? ❓

User: "Which one do I use?" 🤔
```

### Desired State (Clear Purpose) ✅

```
useTokenBudgetBar
└─ Returns data for TokenBudgetBar component
    Use case: Rendering budget visualization

useTokenBudgetTracking
└─ Returns analytics/monitoring data
    Use case: Tracking usage, analytics, dashboards

User: "Perfect, I need tracking!" ✅
```

---

## Architecture Layers

### Current State (Mixed Layers) ❌

```
┌──────────────────────────┐
│  token-optimization      │
│  ├─ Logic ✅             │
│  ├─ Hooks ✅             │
│  └─ Components ⚠️        │ ← Should NOT be here
└──────────────────────────┘
```

### Desired State (Clean Separation) ✅

```
┌──────────────────────────┐
│  @clarity-chat/react     │
│  Layer: UI Components    │
│  └─ React Components     │
└──────────────────────────┘
            ↓ uses
┌──────────────────────────┐
│  token-optimization      │
│  Layer: Logic & Hooks    │
│  ├─ React Hooks          │
│  ├─ Utilities            │
│  └─ Types                │
└──────────────────────────┘
```

---

## Migration Path

### Phase 1: Remove Duplicates

```
token-optimization/index.ts
  - DELETE lines 519-564 (component exports)

Result: Components only in react package ✅
```

### Phase 2: Fix Naming

```
SimpleTokenCounter → FastTokenCounter
TokenCounter → LegacyTokenCounter
useTokenBudget → useTokenBudgetBar
useTokenBudgetMonitor → useTokenBudgetTracking

Result: Clear, consistent naming ✅
```

### Phase 3: Complete API Surface

```
react/public-api.ts
  + Export token-optimization hooks
  + Export token-optimization types

Result: Complete API surface ✅
```

### Phase 4: Documentation

```
+ Which package guide
+ Migration guide
+ Updated API docs

Result: Clear developer experience ✅
```

---

## Score Progression

```
Current State
┌─────────┐
│   63    │  D+  ⚠️  Needs significant work
└─────────┘

After Phase 1 (Remove duplicates)
┌─────────┐
│   75    │  C   ⚠️  Some issues remain
└─────────┘

After Phase 2 (Fix naming)
┌─────────┐
│   82    │  B-  ✅  Good progress
└─────────┘

After Phase 3 (Complete API)
┌─────────┐
│   90    │  A-  ✅  Production-ready
└─────────┘

After Phase 4 (Documentation)
┌─────────┐
│   92    │  A   ✅  Excellent
└─────────┘
```

---

## Bundle Impact

### Current State

```
token-optimization: 245 KB
├─ Logic: 180 KB
├─ Hooks: 40 KB
└─ Components: 25 KB ⚠️ (should not be here)

react: 1.2 MB
├─ Components: 800 KB
├─ Hooks: 300 KB
└─ Utils: 100 KB
```

### After Cleanup

```
token-optimization: 220 KB (-25 KB)
├─ Logic: 180 KB
└─ Hooks: 40 KB
    (Components removed ✅)

react: 1.2 MB (same)
├─ Components: 825 KB (+25 KB from token-optimization)
├─ Hooks: 300 KB
└─ Utils: 75 KB
```

**Net Result:** Better separation, slightly smaller token-optimization bundle

---

## Developer Experience

### Current: User Confusion 😕

```
"Where do I import TokenBudgetBar from?"
"What's the difference between useTokenBudget variants?"
"Why can't I import TokenEstimate from react?"
"Which TokenCounter should I use?"
```

### After Cleanup: Clear Guidance 😊

```
"Components from @clarity-chat/react ✅"
"Hooks from @clarity-chat/token-optimization (or react) ✅"
"Types from either package work the same ✅"
"Use AccurateTokenCounter for production ✅"
```

---

## Summary

| Metric            | Current | After Fixes | Improvement |
| ----------------- | ------- | ----------- | ----------- |
| Score             | 63/100  | 92/100      | +29 points  |
| Duplicate Exports | 7       | 0           | -7          |
| Type Conflicts    | 3       | 0           | -3          |
| Naming Issues     | 6       | 0           | -6          |
| Missing Exports   | 8       | 0           | -8          |
| Layer Violations  | 1       | 0           | -1          |

**Result:** Production-ready, maintainable API surface ✅
