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

### 🔴 Blocker Issues

_No accessibility blockers identified_

### 🟠 High Priority Issues

#### [HIGH] Missing aria-live Announcements for Dynamic Content

**Type**: Accessibility  
**Component**: Message streaming, loading states  
**Severity**: High

**Description**: While 71 instances of `aria-live` exist, some critical dynamic content may lack
proper announcements.

**Current Status**:

- ✅ 71 `aria-live` regions identified
- ✅ 306 `aria-label` attributes (excellent)
- ✅ 28 `role="alert"` for errors
- ⚠️ Need to verify streaming messages announce properly

**Expected Behavior**: All dynamic content (streaming responses, loading states, errors) should
announce to screen readers.

**Impact**: Screen reader users miss important updates

**Proposed Fix**:

1. Audit all streaming components for aria-live
2. Add polite announcements for message updates
3. Add assertive announcements for errors
4. Test with NVDA/JAWS/VoiceOver

**Breaking Change**: No  
**Effort**: Medium

---

### 🟡 Medium Priority Issues

#### [MEDIUM] Keyboard Navigation Coverage

**Type**: Accessibility  
**Component**: Multiple  
**Severity**: Medium

**Description**: Keyboard navigation patterns exist but need verification:

- 36 `tabIndex` implementations
- 34 `onKeyDown` handlers
- 1 `onKeyPress` (deprecated pattern!)

**Issues**:

- `onKeyPress` is deprecated, should use `onKeyDown`
- Need to verify all interactive elements are keyboard accessible
- Focus trap patterns for modals/dialogs?

**Proposed Fix**:

1. Replace `onKeyPress` with `onKeyDown`
2. Audit all interactive components for keyboard access
3. Implement focus traps where needed
4. Add keyboard shortcut documentation

**Breaking Change**: No  
**Effort**: Medium

---

#### [MEDIUM] Focus Management Consistency

**Type**: Accessibility  
**Component**: Multiple  
**Severity**: Medium

**Description**: Focus management exists but needs standardization:

- 27 `.focus()` calls
- 9 `autoFocus` props
- Need to verify focus returns after modal close

**Proposed Fix**:

1. Create useFocusManagement hook for consistency
2. Ensure focus returns to trigger element after dialogs
3. Document focus management patterns

**Breaking Change**: No  
**Effort**: Medium

---

### 🟢 Low Priority Issues

#### [LOW] ARIA Attribute Coverage

**Type**: Accessibility  
**Severity**: Low

**Current Coverage** (Good overall):

- aria-label: 306 ✅
- aria-hidden: 126 ✅
- aria-live: 71 ✅
- aria-describedby: 23 ✅
- aria-checked: 19 ✅
- aria-expanded: 11 ⚠️
- aria-labelledby: 11 ⚠️
- aria-selected: 11 ⚠️

**Proposed Fix**: Increase coverage for expandable/selectable components

**Effort**: Small

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

### 🟠 High Priority Issues

#### [HIGH] Code Block UX Enhancement Needed

**Type**: AI-Specific UX  
**Component**: Code rendering in messages  
**Severity**: High

**Description**: Code blocks exist (7 code components identified) but need verification of:

- Syntax highlighting quality
- Copy button consistency
- Language badge display
- Line numbering
- Code execution/playground features

**Research Finding**: Modern AI chat libraries (Vercel AI Elements, Chatbot UI) provide:

- Native syntax highlighting with Shiki
- One-click copy with visual feedback
- Language detection and badges
- Line numbers for reference
- Code diff visualization

**Current Status**:

- ✅ Code components exist
- ✅ Copy functionality mentioned
- ⚠️ Need to verify consistency across 7 code components

**Proposed Fix**:

1. Audit all 7 code components for feature parity
2. Standardize code block component with all features
3. Add code execution sandbox (optional feature)
4. Document code block customization

**Breaking Change**: No  
**Effort**: Medium

---

#### [HIGH] Message Actions Pattern Standardization

**Type**: AI-Specific UX  
**Component**: Message actions (regenerate, retry, edit, copy)  
**Severity**: High

**Description**: Message actions exist but need pattern standardization:

- `onRetry`: 97 instances ✅
- `onCopy`: 43 instances ✅
- `onRegenerate`: mentioned in components
- `onEdit`: mentioned in components
- `onDelete`: 65 instances ✅

**Expected Pattern** (from research):

```tsx
<Message>
  <Message.Actions>
    <Message.Copy />
    <Message.Regenerate />
    <Message.Edit />
    <Message.Branch /> {/* Create conversation branch */}
    <Message.Delete />
  </Message.Actions>
</Message>
```

**Impact**: Inconsistent action availability confuses users

**Proposed Fix**:

1. Create `<MessageActions>` compound component
2. Document when each action is appropriate
3. Add keyboard shortcuts for actions
4. Add action permission system

**Breaking Change**: No (if backward compatible)  
**Effort**: Medium

---

### 🟡 Medium Priority Issues

#### [MEDIUM] Streaming Experience Polish

**Type**: AI-Specific UX  
**Component**: Streaming messages  
**Severity**: Medium

**Description**: Streaming exists (108 `isStreaming` instances) but needs polish:

- ✅ Typing indicators exist
- ✅ `aria-live` announcements (71 instances)
- ⚠️ Cursor animation quality?
- ⚠️ Stop generation button?
- ⚠️ Partial message rendering performance?

**Research Finding**: Best practices include:

- Smooth cursor animation
- Stop button always visible during streaming
- Progressive rendering without layout shift
- Word-by-word (not char-by-char) for readability

**Proposed Fix**:

1. Add prominent stop button during streaming
2. Optimize rendering performance (React.memo)
3. Add smooth cursor animation
4. Test with long responses (1000+ tokens)

**Breaking Change**: No  
**Effort**: Medium

---

#### [MEDIUM] Citation and Trust Cues

**Type**: AI-Specific UX  
**Component**: Message metadata  
**Severity**: Medium

**Description**: Modern AI applications show:

- Source citations with links
- Confidence scores
- Model information
- Token usage
- Response time

**Current Status**:

- MessageMetadata component exists
- Need to verify what's included

**Proposed Fix**:

1. Add citation component with source links
2. Add confidence score badge
3. Add model/provider info display
4. Add optional response timing

**Breaking Change**: No  
**Effort**: Small to Medium

---

#### [MEDIUM] Tool Call Visualization

**Type**: AI-Specific UX  
**Component**: Tool/function calling display  
**Severity**: Medium

**Description**: As AI models support tool calling (GPT-4, Claude), need clear visualization of:

- Tool name and description
- Parameters sent
- Results received
- Success/failure status

**Research Finding**: Vercel AI Elements provides `<ToolCall>` components

**Proposed Fix**:

1. Create `<ToolCallDisplay>` component
2. Show tool name, params, results
3. Add expand/collapse for details
4. Add status indicators

**Breaking Change**: No  
**Effort**: Medium

---

### 🟢 Low Priority Issues

#### [LOW] Conversation Branching

**Type**: AI-Specific UX  
**Severity**: Low

**Description**: Allow users to branch conversations and explore multiple responses.

**Effort**: Large

---

#### [LOW] Reasoning Panel (o1-style)

**Type**: AI-Specific UX  
**Severity**: Low

**Description**: For models that expose reasoning (like OpenAI o1), show expandable reasoning
panels.

**Effort**: Medium

---

## Audit Statistics

### Issues by Severity

- **Blocker**: 0
- **High**: 5 (2 API Ergonomics, 1 Accessibility, 2 AI UX)
- **Medium**: 8 (3 API Ergonomics, 2 Accessibility, 3 AI UX)
- **Low**: 4 (1 API Ergonomics, 1 Accessibility, 2 AI UX)
- **Total**: 17

### Issues by Type

- **API Ergonomics**: 6 (2 High, 3 Medium, 1 Low)
- **Visual Consistency**: 0
- **Interaction Behavior**: 0
- **Accessibility**: 4 (1 High, 2 Medium, 1 Low)
- **Theming**: 0
- **Documentation**: 0
- **AI UX**: 7 (2 High, 3 Medium, 2 Low)

---

## Next Steps

- [ ] Complete systematic audit
- [ ] Prioritize issues
- [ ] Create enhancement plan (Phase 4)
