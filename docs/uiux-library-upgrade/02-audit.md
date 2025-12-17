# Phase 3: UX + DX Audit (Library-Focused)

> **Created**: 2025-01-XX **Status**: Not Started **Goal**: Comprehensive audit of library
> ergonomics, consistency, and quality

---

## Audit Categories

1. [API Ergonomics](#api-ergonomics)
2. [Visual Consistency](#visual-consistency)
3. [Interaction Behavior](#interaction-behavior)
4. [Accessibility](#accessibility)
5. [Theming & Extensibility](#theming-extensibility)
6. [Documentation Clarity](#documentation-clarity)
7. [AI-Specific UX Gaps](#ai-specific-ux-gaps)

---

## Issue Tracking Format

### Issue Template

```markdown
#### [SEVERITY] Issue Title

**Type**: API Ergonomics | Visual | Interaction | A11y | Theming | Docs | AI UX **Component/Hook**:
Name **Severity**: Blocker | High | Medium | Low

**Description**: [What's wrong]

**Current Behavior**: [How it works now]

**Expected Behavior**: [How it should work]

**Impact**: [Who/what is affected]

**Proposed Fix**: [Suggested solution]

**Breaking Change**: Yes | No **Effort**: Small | Medium | Large
```

---

## API Ergonomics

### 🔴 Blocker Issues

_No blockers identified - library is functional_

### 🟠 High Priority Issues

#### [HIGH] Multiple Chat Hook Confusion

**Type**: API Ergonomics  
**Component/Hook**: Chat hooks (8 variations)  
**Severity**: High

**Description**: 8 different chat hooks exist with unclear relationships and no decision tree:

- `use-chat.ts` (deprecated, will be removed in v3.0)
- `use-chat-enhanced.ts`
- `use-chat-simple.ts`
- `use-chat-core.ts`
- `use-chat-unified.ts`
- `use-chat-composable.ts`
- `use-chat-with-operations.ts`
- `use-clarity-chat.ts` (new recommended)

**Current Behavior**: Developers must read through all 8 hooks to figure out which one to use.

**Expected Behavior**: Clear "Choose Your Hook" guide with decision tree based on use case.

**Impact**:

- New developers confused about which hook to use
- Increased time to first integration
- Potential for wrong hook selection
- Documentation burden

**Proposed Fix**:

1. Create decision tree diagram in docs
2. Add "When to use" section to each hook's JSDoc
3. Consider consolidating hooks in v3.0
4. Add migration guides for deprecated hooks

**Breaking Change**: No (for documentation), Yes (for consolidation)  
**Effort**: Medium (documentation), Large (consolidation)

---

#### [HIGH] Component Prop Count Explosion

**Type**: API Ergonomics  
**Component**: ClarityChat (and similar)  
**Severity**: High

**Description**: Top-level components have 20+ props, making them hard to configure and document.

**Example**:

```typescript
// ClarityChat has 25+ props
<ClarityChat
  api="/api/chat"
  chatId="..."
  className="..."
  emptyState={...}
  showHeader={...}
  sessionTitle="..."
  sessionSubtitle="..."
  headerActions={...}
  showMessageCount={...}
  onExport={...}
  onClear={...}
  autoScroll={...}
  onMessageCopy={...}
  onMessageFeedback={...}
  onEditMessage={...}
  // ... 10 more props
/>
```

**Expected Behavior**: Use compound component pattern or config object:

```typescript
// Option 1: Compound components
<ClarityChat api="/api/chat">
  <ClarityChat.Header title="..." subtitle="..." />
  <ClarityChat.Messages />
  <ClarityChat.Input />
</ClarityChat>

// Option 2: Config object
<ClarityChat
  api="/api/chat"
  config={{
    ui: { showHeader: true, showTimestamp: true },
    callbacks: { onCopy, onFeedback },
    features: { messageOperations: true }
  }}
/>
```

**Impact**:

- Overwhelming for new users
- Hard to remember which props are available
- TypeScript autocomplete noise
- Documentation becomes lengthy

**Proposed Fix**:

1. Introduce compound component pattern for complex components
2. Group related props into config objects
3. Maintain backward compatibility with prop spreading

**Breaking Change**: No (if backward compatible)  
**Effort**: Large

---

### 🟡 Medium Priority Issues

#### [MEDIUM] Inconsistent Callback Prop Naming

**Type**: API Ergonomics  
**Component**: Multiple  
**Severity**: Medium

**Description**: Callback props use inconsistent patterns:

- `onChange` (516 instances)
- `onValueChange` (needs verification if used)
- `onSubmit` (96 instances)
- `onSendMessage` (81 instances)
- `onDelete` (65 instances)
- `onRemove` (needs verification if used)

**Current Behavior**: Developers need to remember which variant each component uses.

**Expected Behavior**: Consistent naming convention across library:

- Form inputs: `onChange` + `onSubmit`
- Actions: `on<Action>` (onDelete, onCopy, onRetry)
- Never mix `onChange`/`onValueChange` or `onDelete`/`onRemove`

**Impact**: Cognitive load, harder to guess correct prop name

**Proposed Fix**:

1. Audit all components for prop name consistency
2. Establish naming convention in docs
3. Add ESLint rule to enforce convention
4. Provide deprecation warnings for non-standard names

**Breaking Change**: Yes (for renaming)  
**Effort**: Medium

---

#### [MEDIUM] Limited Escape Hatches for Customization

**Type**: API Ergonomics  
**Component**: Multiple  
**Severity**: Medium

**Description**: Escape hatch coverage is inconsistent:

- **className**: 196/177 files (~110% - some duplicates)
- **style**: 86/177 files (~49%)
- **asChild**: 3/177 files (~1.7%)
- **forwardRef**: 3/177 files (~1.7%)
- **ref prop**: 1/177 files (~0.6%)

**Impact**:

- ~50% of components don't accept `style` prop
- Almost no `asChild` pattern for polymorphism (Radix-style)
- Minimal ref forwarding for focus management
- Hard to customize components deeply

**Proposed Fix**:

1. Add `className` and `style` to ALL public components
2. Implement `asChild` pattern for components that render specific elements
3. Add ref forwarding to all interactive components
4. Document customization patterns

**Breaking Change**: No  
**Effort**: Large

---

### 🟢 Low Priority Issues

#### [LOW] Missing `data-testid` Attributes

**Type**: API Ergonomics  
**Component**: Multiple  
**Severity**: Low

**Description**: Not all components include `data-testid` for easy testing.

**Proposed Fix**: Add optional `data-testid` prop to all components, auto-generate if not provided.

**Effort**: Medium

---

## Visual Consistency

### Color System Issues

_[Inconsistencies in color usage]_

### Typography Issues

_[Font size, weight, line-height inconsistencies]_

### Spacing Issues

_[Padding, margin, gap inconsistencies]_

### Component Visual Drift

_[Components that don't look cohesive together]_

---

## Interaction Behavior

### Keyboard Navigation Issues

_[Tab order, shortcuts, focus management]_

### Mouse/Touch Interaction Issues

_[Click targets, hover states, gestures]_

### Loading State Issues

_[Inconsistent or missing loading indicators]_

### Error State Issues

_[Poor error messaging, no recovery options]_

### Empty State Issues

_[Missing or unhelpful empty states]_

---

## Accessibility

### ARIA Issues

_[Missing or incorrect ARIA attributes]_

### Semantic HTML Issues

_[Non-semantic markup]_

### Screen Reader Issues

_[Poor screen reader experience]_

### Keyboard Navigation Issues

_[Elements not keyboard accessible]_

### Color Contrast Issues

_[WCAG contrast failures]_

### Focus Management Issues

_[Missing or incorrect focus indicators]_

---

## Theming & Extensibility

### Theme System Issues

_[Inflexible or incomplete theming]_

### CSS Override Issues

_[Hard to customize styles]_

### Missing Escape Hatches

_[No way to access internal components]_

### Variant System Issues

_[Inconsistent or missing variants]_

---

## Documentation Clarity

### Missing Documentation

_[Undocumented components/hooks]_

### Unclear Examples

_[Examples that don't help]_

### Missing Real-World Scenarios

_[Only trivial examples provided]_

### Storybook Quality Issues

_[Poor or missing stories]_

### API Reference Issues

_[Incomplete or inaccurate API docs]_

---

## AI-Specific UX Gaps

### Streaming Issues

_[Poor streaming UX]_

### Message Affordance Issues

_[Missing regenerate, copy, edit actions]_

### Code Block Issues

_[Poor code rendering or interaction]_

### Error Recovery Issues

_[No retry mechanisms]_

### Long Content Issues

_[No virtualization or pagination]_

### Trust Cue Issues

_[No source citations, confidence indicators]_

---

## Audit Statistics

### Issues by Severity

- **Blocker**: 0
- **High**: 0
- **Medium**: 0
- **Low**: 0
- **Total**: 0

### Issues by Type

- **API Ergonomics**: 0
- **Visual Consistency**: 0
- **Interaction Behavior**: 0
- **Accessibility**: 0
- **Theming**: 0
- **Documentation**: 0
- **AI UX**: 0

---

## Next Steps

- [ ] Complete systematic audit
- [ ] Prioritize issues
- [ ] Create enhancement plan (Phase 4)
