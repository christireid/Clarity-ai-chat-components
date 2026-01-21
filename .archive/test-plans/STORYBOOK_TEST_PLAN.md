# Storybook Battle Test Plan

**Last Updated:** 2025-12-19 **Storybook Version:** 10.1.4 **Framework:** React-Vite **Total
Stories:** 993 **Total Docs:** 188

---

## Test Scope Overview

| Category   | Stories | Priority | Status      |
| ---------- | ------- | -------- | ----------- |
| Components | 488     | P0       | In Progress |
| Advanced   | 280     | P1       | Pending     |
| Hooks      | 79      | P0       | Pending     |
| Examples   | 76      | P0       | Pending     |
| Foundation | 51      | P1       | Pending     |
| Primitives | 13      | P0       | Pending     |
| Patterns   | 5       | P1       | Pending     |
| Welcome    | 1       | P1       | Pending     |

---

## Phase 1: Story-by-Story Battle Test Checklist

### For EVERY story, verify:

#### 1. Visual Integrity

- [ ] Layout renders correctly
- [ ] No overflow or clipping
- [ ] Responsive behavior (test mobile/tablet/desktop viewports)
- [ ] Dark/light mode correct (if applicable)
- [ ] Typography consistent

#### 2. Interaction

- [ ] Buttons are clickable
- [ ] Inputs are editable
- [ ] Hover states display
- [ ] Focus states display
- [ ] Loading states work
- [ ] Empty states display
- [ ] Error states display

#### 3. Controls

- [ ] Storybook controls update component correctly
- [ ] Edge-case props tested
- [ ] Invalid props handled gracefully
- [ ] Default values sensible

#### 4. Console

- [ ] No errors in browser console
- [ ] No warnings in browser console
- [ ] No act() warnings
- [ ] No React key warnings

#### 5. Accessibility

- [ ] Keyboard navigation works
- [ ] Focus visibility clear
- [ ] ARIA labels present
- [ ] Contrast sanity check
- [ ] Screen reader compatibility

#### 6. Documentation

- [ ] Story description accurate
- [ ] Args documented
- [ ] Code snippets correct
- [ ] Examples realistic

---

## Priority Story Groups

### P0 - Critical Path (Must Pass)

1. **Core Components**
   - ChatWindow, ChatInput, MessageList
   - StreamingMessage, ThinkingIndicator
   - Button, Input, Card, Dialog

2. **Primary Hooks**
   - useClarityChat
   - useClarityObject
   - useAutoScroll

3. **Primitives**
   - Button variants
   - Avatar
   - Input
   - Textarea

### P1 - Important Features

1. **Advanced Components**
   - Analytics dashboards
   - Enterprise features
   - Memory/Context

2. **Foundation**
   - Themes
   - Colors
   - Motion

### P2 - Nice to Have

1. **Examples**
   - Complete applications
   - Integration demos

2. **Patterns**
   - Form patterns
   - AI patterns

---

## Test Execution Commands

```bash
# Run Storybook locally
pnpm storybook

# Access at
http://localhost:6006

# Run accessibility tests (if available)
pnpm test-storybook --url http://localhost:6006
```

---

## Known Issues to Watch For

1. **storybook-dark-mode** - Incompatible with Storybook 10 (warning only, non-blocking)
2. **Internal imports** - Stories should import from `@clarity-chat/react/internal` for internal
   components
3. **Token optimization** - Package resolved via Vite alias

---

## Component Categories Detail

### Components (488 stories)

- Inputs: Button, ChatInput, Input, Textarea, etc.
- DataDisplay: Message, MessageList, Avatar, Badge, etc.
- Feedback: Toast, ThinkingIndicator, Progress, etc.
- Layout: ChatWindow, Dialog, Drawer, etc.
- Navigation: CommandPalette, ContextMenu, etc.

### Advanced (280 stories)

- AI: PromptPlayground, ToolInvocation, etc.
- Analytics: Dashboards, Token optimization
- Enterprise: Audit, SSO, Tenancy
- Memory: Context, Documents
- Streaming: StreamBlock, Cancellation

### Hooks (79 stories)

- Chat: useClarityChat, useChat, useCompletion
- Performance: useAutoScroll, useDebounce, useThrottle
- State: useLocalStorage, usePrevious
- Streaming: useStreaming, useStreamingSSE
- Utilities: useClipboard, useVoiceInput

### Foundation (51 stories)

- Colors & Themes
- Spacing & Layout
- Motion & Animation
- Iconography
- Theme tools

### Primitives (13 stories)

- Button essentials
- Avatar essentials

---

## Success Criteria

- [ ] Zero P0 blocking issues
- [ ] All stories render without console errors
- [ ] Controls work as expected
- [ ] Accessibility baseline met
- [ ] Documentation accurate
