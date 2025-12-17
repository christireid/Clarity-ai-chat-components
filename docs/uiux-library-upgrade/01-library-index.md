# Phase 2: Library Index & Surface Area Mapping

> **Created**: 2025-01-XX **Status**: Not Started **Goal**: Complete inventory of all public APIs
> and component surface area

---

## Table of Contents

1. [Public API Inventory](#public-api-inventory)
2. [Component Catalog](#component-catalog)
3. [Hooks Catalog](#hooks-catalog)
4. [Utilities Catalog](#utilities-catalog)
5. [Context Providers](#context-providers)
6. [Duplicate/Overlap Analysis](#duplicate-overlap-analysis)
7. [Styling Architecture](#styling-architecture)
8. [Storybook Coverage](#storybook-coverage)

---

## Public API Inventory

### Export Structure

From `/packages/react/package.json` exports:

```typescript
// Main exports
import { ... } from '@clarity-chat/react'

// Modular exports
import { ... } from '@clarity-chat/react/core'
import { ... } from '@clarity-chat/react/animations'
import { ... } from '@clarity-chat/react/utils'
import { ... } from '@clarity-chat/react/prompt'
import { ... } from '@clarity-chat/react/analytics'
import { ... } from '@clarity-chat/react/memory'
import { ... } from '@clarity-chat/react/adapters'
import { ... } from '@clarity-chat/react/test-utils'

// Styles
import '@clarity-chat/react/styles.css'
```

### Current Component Count

**Claimed**: 200+ components  
**Actual**: **177 component files** (excluding tests/stories) **Breakdown by Category**:

- Message components: 24
- UI utilities: 18
- AI components: 12
- Chat components: 11
- Navigation: 10
- Dashboards: 8
- Code components: 7
- Context: 7
- Media: 7
- Token: 7
- Feedback: 6
- Input: 6
- Theme components: 6
- Conversation: 5
- AB Testing: 4
- Enterprise: 4
- Prompt: 4
- AI Ops: 3
- Search: 3

**Note**: Many files contain multiple exported components, so actual component count is higher.
Needs detailed cataloging.

---

## Component Catalog

### Component Matrix Template

For each component, document:

| Component | Purpose | Required Props | Optional Props | Variants | Theming | Accessibility | Storybook | Notes  |
| --------- | ------- | -------------- | -------------- | -------- | ------- | ------------- | --------- | ------ |
| Name      | Brief   | List           | List           | Yes/No   | Yes/No  | WCAG Level    | ✅/❌     | Issues |

### Component Categories

#### 🗨️ Chat Components

_[To be cataloged]_

#### 💬 Message Components

_[To be cataloged]_

#### ⌨️ Input Components

_[To be cataloged]_

#### 🎨 Theme Components

_[To be cataloged]_

#### 🔧 Utility Components

_[To be cataloged]_

#### 🏢 Enterprise Components

_[To be cataloged]_

#### 🎯 AI-Specific Components

_[To be cataloged]_

---

## Hooks Catalog

### Hooks Matrix Template

| Hook | Purpose | Parameters | Return Value | Dependencies | Edge Cases   | Tests | Docs  |
| ---- | ------- | ---------- | ------------ | ------------ | ------------ | ----- | ----- |
| Name | Brief   | Types      | Types        | List         | Known issues | ✅/❌ | ✅/❌ |

### Current Hook Count

**Claimed**: 140+ hooks  
**Actual**: **101 hook files** (excluding tests) **Breakdown by Category**:

- Chat hooks: 20
- UI hooks: 17
- Performance: 7
- Streaming: 6
- Input: 6
- Keyboard: 6
- Resilience: 5
- Theme: 5
- Token: 5
- Dashboard: 4
- Message: 4
- Storage: 4
- ClarityChat: 4
- Context: 2
- Model: 2
- Security: 2
- Plus 1 top-level hook

**Note**: Similar to components, many files export multiple hooks. Detailed cataloging needed.

### Hook Categories

#### 🔄 Streaming Hooks

_[To be cataloged]_

#### 💾 Memory Hooks

_[To be cataloged]_

#### 🎨 Theme Hooks

_[To be cataloged]_

#### 📊 Analytics Hooks

_[To be cataloged]_

#### 🔒 Security Hooks

_[To be cataloged]_

---

## Utilities Catalog

### Utility Functions

_[To be cataloged]_

### Helper Functions

_[To be cataloged]_

### Type Utilities

_[To be cataloged]_

---

## Context Providers

### Available Contexts

_[To be mapped]_

---

## Duplicate/Overlap Analysis

### Identified Duplicates

**Chat Hooks (Potential Overlap)**:

- `use-chat.ts` (DEPRECATED - to be removed in v3.0)
- `use-chat-enhanced.ts`
- `use-chat-simple.ts`
- `use-chat-core.ts`
- `use-chat-unified.ts`
- `use-chat-composable.ts`
- `use-chat-with-operations.ts`
- `use-clarity-chat.ts` (NEW recommended)

**Analysis**: 8 different chat hooks suggest feature creep and unclear migration path. While
`use-chat.ts` is properly deprecated, the relationships between other hooks are unclear.

**Recommendation**: Consolidate or create clear documentation explaining when to use each hook.

### Overlapping Functionality

**Message Components**:

- 24 message-related component files
- Need to verify if there's overlap between message display, actions, formatting

**Code Components**:

- 7 code-related components
- Check for duplicate syntax highlighting/copy functionality

### API Consistency Analysis

**✅ CONSISTENT PATTERNS** (Good!):

1. **Event Handlers**:
   - Consistent use of `on` prefix (onClick, onChange, onSubmit)
   - Good: 625 `onClick`, 516 `onChange`, 99 `onError`

2. **Boolean Props**:
   - Consistent use of `show` prefix for visibility (showAvatar, showHeader)
   - Consistent use of `enable` prefix for features (enableLearning, enableSound)
   - Consistent use of `is` prefix for state (isLoading, isStreaming)

3. **State Props**:
   - 344 instances of `isLoading` - excellent consistency
   - 108 instances of `isStreaming` - good pattern

**⚠️ POTENTIAL INCONSISTENCIES**:

1. **Boolean Naming Variations**:
   - Some use `show*` (showAvatar: 27)
   - Some use `enable*` (enableKeyboardShortcuts: 14)
   - Some use `is*` (isEditing: 27)
   - **Question**: When to use each? Need guidelines

2. **Callback Handler Naming**:
   - Props use `on*` pattern (good: onSubmit, onError, onRetry)
   - Internal handlers use `handle*` pattern (good: handleClick, handleSubmit)
   - **Consistent** but needs documentation

3. **Multiple Chat Hooks** (as noted above):
   - Unclear which hook to use for different scenarios
   - Need "Choose Your Hook" decision tree

**🔍 NEEDS INVESTIGATION**:

1. **Prop Variations**:
   - `onChange` vs `onValueChange` - are both used?
   - `onSubmit` vs `onSendMessage` - which contexts?
   - `onDelete` vs `onRemove` - consistency?

2. **Escape Hatches**:
   - Do all components accept `className`?
   - Do components accept `style` prop?
   - Are there `asChild` patterns for polymorphism?

3. **ref Handling**:
   - React 19 uses `ref` as prop - is this consistent?
   - Are all components `forwardRef` wrapped where needed?

---

## Styling Architecture

### Current Approach

- **Base**: Tailwind CSS
- **Variants**: class-variance-authority (CVA)
- **Utilities**: tailwind-merge, clsx

### Theme System

_[To be documented]_

### CSS Architecture

_[To be analyzed]_

---

## Storybook Coverage

### Story Files Analysis

_[To be completed]_

### Missing Stories

_[To be identified]_

### Story Quality Assessment

_[To be evaluated]_

---

## Next Steps

- [ ] Run automated component counting script
- [ ] Manually review each component file
- [ ] Document all public APIs
- [ ] Identify overlaps and inconsistencies
- [ ] Move to Phase 3: Audit
