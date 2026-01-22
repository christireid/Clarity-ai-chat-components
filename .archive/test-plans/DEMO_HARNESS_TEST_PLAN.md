# Demo Harness Test Plan

## Overview

This test plan defines the manual testing matrix for validating all Clarity Chat components and
hooks.

---

## Test Environment

- **Demo**: `apps/examples/component-demo`
- **Browser**: Chrome (primary), Firefox, Safari (cross-check)
- **Viewports**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)

---

## Component Test Matrix

### For Each Component, Verify:

1. **Renders without crash** - Component mounts successfully
2. **No console errors** - No React errors, warnings, or exceptions
3. **Props work as expected** - All documented props function correctly
4. **States display correctly**:
   - Default state
   - Loading state (if applicable)
   - Empty state (if applicable)
   - Error state (if applicable)
   - Disabled state (if applicable)
5. **Keyboard navigation** - Tab order, focus visible, key handlers
6. **Accessibility** - ARIA labels, roles, screen reader friendly
7. **Responsive behavior** - Layout adapts to viewport changes

---

## Component Checklist

### Core Components

- [ ] **ClarityChat**
  - [ ] Renders with minimal props (api only)
  - [ ] Renders with full configuration
  - [ ] Loading state shows correctly
  - [ ] Error state displays error boundary
  - [ ] Messages display properly
  - [ ] Input submission works
  - [ ] Streaming response renders

- [ ] **ClarityChatPresets**
  - [ ] MINIMAL preset works
  - [ ] STANDARD preset works
  - [ ] FULL preset works
  - [ ] ENTERPRISE preset works

- [ ] **ChatComplete**
  - [ ] Renders all features together
  - [ ] Analytics integration works
  - [ ] Memory integration works

- [ ] **ChatWithMemory**
  - [ ] Memory provider context accessible
  - [ ] Memory persists across messages

- [ ] **ChatWithAnalytics**
  - [ ] Analytics events fire
  - [ ] Token tracking works

- [ ] **ChatWithPreset**
  - [ ] Preset configuration applies

### AI Components

- [ ] **Citation**
  - [ ] Renders with source data
  - [ ] Click handler works
  - [ ] Shows confidence score when provided
  - [ ] Truncates long text properly

- [ ] **MarkdownRendererEnhanced**
  - [ ] Renders basic markdown
  - [ ] Renders code blocks with syntax highlighting
  - [ ] Renders tables
  - [ ] Renders math (KaTeX)
  - [ ] Renders GFM (strikethrough, task lists)
  - [ ] XSS protection works

- [ ] **EnhancedMarkdownRenderer**
  - [ ] All features of MarkdownRendererEnhanced
  - [ ] Enhanced streaming support

- [ ] **CodeBlock**
  - [ ] Syntax highlighting works
  - [ ] Copy button works
  - [ ] Language label displays
  - [ ] Line numbers show (when enabled)

- [ ] **StreamingCodeBlock**
  - [ ] Partial code renders progressively
  - [ ] No flicker during streaming
  - [ ] Highlighting updates correctly

- [ ] **EnhancedCodeBlock**
  - [ ] All CodeBlock features
  - [ ] Enhanced copy feedback
  - [ ] Collapse/expand works

### Composable UI Components

- [ ] **ChatWindow**
  - [ ] Messages render
  - [ ] Input area works
  - [ ] Auto-scroll behavior
  - [ ] Loading indicator shows

- [ ] **FloatingChatWidget**
  - [ ] Fab button renders
  - [ ] Opens/closes on click
  - [ ] Position is correct
  - [ ] Backdrop works (if enabled)
  - [ ] Keyboard dismissal (Escape)

- [ ] **ChatInput**
  - [ ] Text input works
  - [ ] Submit on Enter
  - [ ] Submit button works
  - [ ] Disabled state
  - [ ] Placeholder text shows
  - [ ] Multiline support (if enabled)

- [ ] **MessageList (Virtualized)**
  - [ ] Renders large message lists (100+)
  - [ ] Scroll performance is smooth
  - [ ] Items render correctly
  - [ ] Auto-scroll works

- [ ] **StreamingMessage**
  - [ ] Renders partial content
  - [ ] Updates smoothly
  - [ ] Cursor animation works
  - [ ] Completes gracefully

- [ ] **ThinkingIndicator**
  - [ ] Animation plays
  - [ ] Text displays
  - [ ] Variants work (dots, pulse, etc.)

- [ ] **TypingIndicator**
  - [ ] Animation plays
  - [ ] Customizable text

### Provider Components

- [ ] **MemoryProvider**
  - [ ] Context provides memory functions
  - [ ] Children render
  - [ ] Error on missing adapter handled

- [ ] **TokenBudgetProvider**
  - [ ] Context provides budget functions
  - [ ] Children render
  - [ ] Budget tracking works

- [ ] **ThemeProvider**
  - [ ] Theme context available
  - [ ] Theme switching works
  - [ ] CSS variables applied

- [ ] **LicenseProvider**
  - [ ] License validation works
  - [ ] Context provides license info
  - [ ] Invalid license handled

- [ ] **LicenseGate**
  - [ ] Shows content when licensed
  - [ ] Shows fallback when unlicensed
  - [ ] Plan-based gating works

- [ ] **Watermark**
  - [ ] Renders watermark when unlicensed
  - [ ] Hidden when licensed
  - [ ] Position is correct

### Feedback Components

- [ ] **ErrorBoundary**
  - [ ] Catches errors in children
  - [ ] Renders fallback UI
  - [ ] Reset button works (if provided)
  - [ ] Error info passed to fallback

- [ ] **NetworkStatus**
  - [ ] Shows online status
  - [ ] Shows offline status
  - [ ] Updates on network change

### Token & Export

- [ ] **TokenCounter**
  - [ ] Displays token count
  - [ ] Shows cost (when enabled)
  - [ ] Warning at threshold
  - [ ] Different sizes work

- [ ] **ExportDialog**
  - [ ] Opens/closes properly
  - [ ] Format selection works
  - [ ] Export button triggers callback
  - [ ] Cancel button works

### Search & Prompts

- [ ] **MessageSearch**
  - [ ] Search input works
  - [ ] Results filter correctly
  - [ ] Clear button works
  - [ ] Empty results message

- [ ] **MessageSearchWithSuspense**
  - [ ] Loading state shows
  - [ ] Results display
  - [ ] Error boundary works

- [ ] **FollowUpSuggestions**
  - [ ] Suggestions display
  - [ ] Click triggers callback
  - [ ] Empty state handled

- [ ] **PromptSuggestions**
  - [ ] Suggestions render
  - [ ] Selection works
  - [ ] Custom suggestions work

### Message & Input

- [ ] **CitationCard**
  - [ ] Renders citation info
  - [ ] Click handler works
  - [ ] Confidence display
  - [ ] Expandable content

- [ ] **VoiceInput**
  - [ ] Microphone button renders
  - [ ] Permission request works
  - [ ] Recording indicator shows
  - [ ] Transcription callback fires

- [ ] **EmptyChatState**
  - [ ] Icon renders
  - [ ] Title displays
  - [ ] Description shows
  - [ ] CTA button works (if provided)

### Toast System

- [ ] **ToastProvider**
  - [ ] Context provides toast functions
  - [ ] Children render

- [ ] **ToastContainer**
  - [ ] Toasts appear
  - [ ] Toasts dismiss (auto and manual)
  - [ ] Position variants work
  - [ ] Stacking works

---

## Hook Test Matrix

### For Each Hook, Verify:

1. **Returns expected shape** - All documented return values present
2. **State updates correctly** - Callbacks modify state as expected
3. **Side effects work** - Effects trigger appropriately
4. **Cleanup works** - No memory leaks on unmount
5. **Error handling** - Errors are caught and reported

---

## Hook Checklist

### Core Chat Hooks

- [ ] **useClarityChat**
  - [ ] Returns messages array
  - [ ] sendMessage adds message
  - [ ] isLoading state updates
  - [ ] Error state captures failures
  - [ ] Abort works

- [ ] **useHeadlessChat**
  - [ ] Complete control over state
  - [ ] No UI dependencies
  - [ ] All callbacks work

- [ ] **useClarityObject**
  - [ ] Structured output works
  - [ ] Schema validation applies
  - [ ] Partial updates work

- [ ] **useClarityChatWithTools**
  - [ ] Tool definitions work
  - [ ] Tool execution triggers
  - [ ] Results integrate

### Context Hooks

- [ ] **useMemoryContext**
  - [ ] Provides memory functions
  - [ ] Error outside provider

- [ ] **useTokenBudget**
  - [ ] Provides budget info
  - [ ] Error outside provider

- [ ] **useTheme**
  - [ ] Provides theme info
  - [ ] setTheme works
  - [ ] Error outside provider

### License Hooks

- [ ] **useLicenseStatus**
  - [ ] Returns status object
  - [ ] Updates on license change

- [ ] **useIsLicensed**
  - [ ] Returns boolean
  - [ ] Accurate for valid/invalid

- [ ] **useHasPlan**
  - [ ] Plan check works
  - [ ] Multiple plans work

- [ ] **useLicenseInfo**
  - [ ] Full license info returned

### UI Hooks

- [ ] **useToast**
  - [ ] success, error, warning, info work
  - [ ] dismiss works
  - [ ] Error outside provider

- [ ] **useKeyboardShortcuts**
  - [ ] Shortcuts register
  - [ ] Callbacks fire
  - [ ] Cleanup works

- [ ] **useCommandPalette**
  - [ ] Open/close works
  - [ ] Command search works
  - [ ] Selection works

- [ ] **useClipboard**
  - [ ] copy works
  - [ ] copied state updates
  - [ ] Error handling

- [ ] **useLocalStorage**
  - [ ] Read/write works
  - [ ] Default value works
  - [ ] Sync across tabs

- [ ] **useThrottledCallback**
  - [ ] Throttles correctly
  - [ ] Final value captured

- [ ] **useAutoScroll**
  - [ ] Scroll ref works
  - [ ] Auto-scrolls on dependency change
  - [ ] Manual scroll pauses auto

### Input & Streaming

- [ ] **useVoiceInput**
  - [ ] Returns recording state
  - [ ] start/stop work
  - [ ] Transcript callback fires
  - [ ] Error handling

- [ ] **useStreaming**
  - [ ] Handles SSE streams
  - [ ] Partial updates work
  - [ ] Completion detected
  - [ ] Error handling

- [ ] **useTokenTracker**
  - [ ] Token counting works
  - [ ] Cost estimation works
  - [ ] Reset works

### Resilience & Accessibility

- [ ] **useRetryWithBackoff**
  - [ ] Retry logic works
  - [ ] Backoff timing correct
  - [ ] Max retries respected
  - [ ] Success breaks retry

- [ ] **useReducedMotion**
  - [ ] Detects system preference
  - [ ] Updates on change

- [ ] **useFocusTrap**
  - [ ] Traps focus within element
  - [ ] Escape releases (if configured)
  - [ ] Cleanup restores focus

- [ ] **useFocusRestoration**
  - [ ] Saves focus on mount
  - [ ] Restores focus on unmount

---

## Cross-Cutting Tests

- [ ] **Hot reload stability** - State preserved after code changes
- [ ] **Route navigation** - Components survive route changes
- [ ] **Memory leaks** - No listeners/timers after unmount
- [ ] **Theme consistency** - All components respect theme
- [ ] **Error propagation** - Errors bubble to ErrorBoundary

---

## Regression Checklist

After all fixes applied:

- [ ] All component tests pass
- [ ] All hook tests pass
- [ ] No console errors in production build
- [ ] Bundle size unchanged or reduced
- [ ] All existing unit tests pass
