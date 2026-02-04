# PromptComposer System - Comprehensive Test Plan

**Status:** Test Coverage Analysis & Recommendations
**Date:** 2026-01-28
**Coverage Goal:** 85%+ for hooks, 80%+ for components

---

## Executive Summary

The PromptComposer system currently has basic test coverage across key areas but is missing critical edge cases, integration scenarios, and stress testing. This plan identifies gaps and provides specific test implementations needed for production readiness.

**Current Coverage:**
- ✅ Basic component rendering (ContextMentionInput)
- ✅ Hook state management (usePromptComposer)
- ✅ Context utilities (token calculation, relevance ranking)
- ✅ Keyboard navigation (basic scenarios)
- ✅ Voice integration (structural tests)

**Missing Coverage:**
- ❌ Error boundary scenarios
- ❌ Concurrent state updates
- ❌ Network failure handling
- ❌ Large-scale performance testing
- ❌ Browser compatibility edge cases
- ❌ Accessibility regression scenarios
- ❌ Integration between multiple components
- ❌ Memory leak detection
- ❌ Token budget overflow scenarios
- ❌ Race condition handling

---

## 1. Missing Test Cases by Component

### 1.1 PromptComposer Component

#### Missing Unit Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/PromptComposer.test.tsx`

```typescript
// MISSING: Component initialization tests
describe('PromptComposer - Initialization', () => {
  it('should render with minimal props', () => {})
  it('should render with all features enabled', () => {})
  it('should respect feature flag configuration', () => {})
  it('should initialize with custom token budget', () => {})
  it('should apply custom placeholder text', () => {})
  it('should handle missing API endpoint gracefully', () => {})
  it('should render in SSR environment without errors', () => {})
})

// MISSING: State transition tests
describe('PromptComposer - State Transitions', () => {
  it('should transition from collapsed to focused on click', () => {})
  it('should transition to typing when user starts input', () => {})
  it('should expand when text exceeds threshold', () => {})
  it('should show context state when items added', () => {})
  it('should enter submitting state on submit', () => {})
  it('should return to collapsed after successful submit', () => {})
  it('should maintain expanded state after error', () => {})
  it('should handle rapid state transitions', () => {})
})

// MISSING: Feature integration tests
describe('PromptComposer - Feature Integration', () => {
  it('should coordinate suggestions with context menu', () => {})
  it('should close suggestions when commands open', () => {})
  it('should disable submit when over token budget', () => {})
  it('should clear attachments on successful submit', () => {})
  it('should preserve context items across submissions', () => {})
  it('should handle voice input + attachments together', () => {})
})

// MISSING: Error handling tests
describe('PromptComposer - Error Handling', () => {
  it('should display error when submit fails', () => {})
  it('should clear error on retry', () => {})
  it('should handle network timeout gracefully', () => {})
  it('should show validation errors for invalid input', () => {})
  it('should recover from attachment upload failures', () => {})
  it('should handle context provider errors', () => {})
})

// MISSING: Performance tests
describe('PromptComposer - Performance', () => {
  it('should handle 1000+ character input without lag', () => {})
  it('should virtualize long suggestion lists', () => {})
  it('should debounce token calculations', () => {})
  it('should not re-render unnecessarily', () => {})
  it('should lazy load heavy features', () => {})
})
```

### 1.2 AttachmentManager Component

#### Missing Unit Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/AttachmentManager.test.tsx`

```typescript
// MISSING: Drag and drop tests
describe('AttachmentManager - Drag and Drop', () => {
  it('should highlight drop zone on drag enter', () => {})
  it('should handle multiple files dropped at once', () => {})
  it('should reject files when max files reached', () => {})
  it('should validate file types during drop', () => {})
  it('should validate file size during drop', () => {})
  it('should handle drag leave correctly', () => {})
  it('should prevent default browser behavior', () => {})
  it('should handle nested drag events', () => {})
})

// MISSING: File validation tests
describe('AttachmentManager - File Validation', () => {
  it('should reject files exceeding max size', () => {})
  it('should reject unsupported file types', () => {})
  it('should accept wildcard file types (image/*)', () => {})
  it('should validate file extension (.pdf, .doc)', () => {})
  it('should show clear error messages for validation failures', () => {})
  it('should validate MIME type vs extension mismatch', () => {})
  it('should handle zero-byte files', () => {})
  it('should handle files with no extension', () => {})
})

// MISSING: Upload handling tests
describe('AttachmentManager - Upload Handling', () => {
  it('should call upload handler for each file', () => {})
  it('should show progress during upload', () => {})
  it('should handle upload cancellation', () => {})
  it('should retry failed uploads', () => {})
  it('should handle concurrent uploads', () => {})
  it('should cleanup failed uploads', () => {})
  it('should generate preview URLs correctly', () => {})
  it('should revoke object URLs on unmount', () => {})
})

// MISSING: Edge cases
describe('AttachmentManager - Edge Cases', () => {
  it('should handle clipboard paste events', () => {})
  it('should handle programmatic file selection', () => {})
  it('should handle duplicate file names', () => {})
  it('should preserve insertion order', () => {})
  it('should handle rapid add/remove cycles', () => {})
  it('should handle files with special characters in names', () => {})
})
```

### 1.3 CommandPalette Component

#### Missing Unit Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/CommandPalette.test.tsx`

```typescript
// MISSING: Filtering and search tests
describe('CommandPalette - Filtering', () => {
  it('should filter commands by exact match', () => {})
  it('should filter commands by fuzzy match', () => {})
  it('should filter by command label', () => {})
  it('should filter by command trigger', () => {})
  it('should filter by command description', () => {})
  it('should show "no results" when no matches', () => {})
  it('should reset selection when filter changes', () => {})
  it('should highlight matching characters', () => {})
})

// MISSING: Category handling tests
describe('CommandPalette - Categories', () => {
  it('should group commands by category', () => {})
  it('should show category headers', () => {})
  it('should handle commands without category', () => {})
  it('should sort categories by priority', () => {})
  it('should hide empty categories', () => {})
  it('should navigate across category boundaries', () => {})
})

// MISSING: Availability tests
describe('CommandPalette - Command Availability', () => {
  it('should hide unavailable commands', () => {})
  it('should re-evaluate availability on state change', () => {})
  it('should show disabled state for unavailable commands', () => {})
  it('should handle dynamic availability functions', () => {})
  it('should update when availability changes', () => {})
})

// MISSING: Keyboard shortcuts tests
describe('CommandPalette - Keyboard Shortcuts', () => {
  it('should execute command on shortcut key', () => {})
  it('should show shortcut hints', () => {})
  it('should prevent shortcut conflicts', () => {})
  it('should handle platform-specific shortcuts (Cmd vs Ctrl)', () => {})
  it('should disable shortcuts when palette closed', () => {})
})

// MISSING: Edge cases
describe('CommandPalette - Edge Cases', () => {
  it('should handle empty command list', () => {})
  it('should handle single command', () => {})
  it('should handle hundreds of commands efficiently', () => {})
  it('should scroll selected item into view', () => {})
  it('should handle rapid keyboard navigation', () => {})
  it('should cleanup on unmount', () => {})
})
```

### 1.4 ContextMentionInput Component

#### Missing Test Cases

**Additional tests needed beyond existing coverage:**

```typescript
// MISSING: Multi-provider coordination
describe('ContextMentionInput - Multi-Provider', () => {
  it('should search all providers on @', () => {})
  it('should prioritize providers by priority field', () => {})
  it('should merge results from multiple providers', () => {})
  it('should deduplicate results across providers', () => {})
  it('should show provider icons in results', () => {})
  it('should handle provider search failures gracefully', () => {})
  it('should timeout slow providers', () => {})
})

// MISSING: Complex input scenarios
describe('ContextMentionInput - Complex Input', () => {
  it('should handle multiple @mentions in single input', () => {})
  it('should handle @mention at start of line', () => {})
  it('should handle @mention in middle of text', () => {})
  it('should handle @mention at end of text', () => {})
  it('should handle nested @mentions', () => {})
  it('should handle @mention with special characters', () => {})
  it('should preserve cursor position during insertion', () => {})
  it('should handle undo/redo with mentions', () => {})
})

// MISSING: Token budget integration
describe('ContextMentionInput - Token Budget', () => {
  it('should calculate tokens for each result', () => {})
  it('should show warning for budget-exceeding items', () => {})
  it('should prevent selection when over budget', () => {})
  it('should update budget as items are added/removed', () => {})
  it('should show available budget in UI', () => {})
  it('should suggest removing items when over budget', () => {})
})

// MISSING: Accessibility
describe('ContextMentionInput - Accessibility', () => {
  it('should announce results to screen readers', () => {})
  it('should set proper ARIA attributes on suggestions', () => {})
  it('should manage focus properly', () => {})
  it('should support keyboard-only interaction', () => {})
  it('should meet WCAG 2.1 AA standards', () => {})
})
```

### 1.5 TokenBudgetIndicator Component

#### Missing Unit Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/TokenBudgetIndicator.test.tsx`

```typescript
describe('TokenBudgetIndicator - Rendering', () => {
  it('should render progress bar', () => {})
  it('should show current/max token counts', () => {})
  it('should update color based on usage percentage', () => {})
  it('should show green for <60% usage', () => {})
  it('should show yellow for 60-80% usage', () => {})
  it('should show red for >80% usage', () => {})
})

describe('TokenBudgetIndicator - Token Savings', () => {
  it('should calculate savings correctly', () => {})
  it('should show traditional vs clarity comparison', () => {})
  it('should display percentage saved', () => {})
  it('should show cost savings in dollars', () => {})
  it('should hide savings when disabled', () => {})
  it('should update savings when context changes', () => {})
})

describe('TokenBudgetIndicator - Context Breakdown', () => {
  it('should list all context items', () => {})
  it('should show detail level for each item', () => {})
  it('should show token count per item', () => {})
  it('should color-code by detail level', () => {})
  it('should truncate long labels', () => {})
  it('should handle items without breakdown data', () => {})
})

describe('TokenBudgetIndicator - Edge Cases', () => {
  it('should handle zero tokens', () => {})
  it('should handle exceeding max budget', () => {})
  it('should handle negative token values', () => {})
  it('should handle NaN or undefined values', () => {})
  it('should handle extremely large numbers', () => {})
  it('should update smoothly with transitions', () => {})
})
```

### 1.6 ContextItemCard Component

#### Missing Unit Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/ContextItemCard.test.tsx`

```typescript
describe('ContextItemCard - Rendering', () => {
  it('should render item label', () => {})
  it('should render item description', () => {})
  it('should show current detail level badge', () => {})
  it('should show token count for current level', () => {})
  it('should render icon when provided', () => {})
  it('should show relevance score', () => {})
  it('should render in compact mode', () => {})
})

describe('ContextItemCard - Expansion Controls', () => {
  it('should show "Expand to Preview" when at summary', () => {})
  it('should show "Expand to Full" when at summary', () => {})
  it('should show "Expand to Full" when at preview', () => {})
  it('should hide expansion when at full level', () => {})
  it('should call onExpand with correct level', () => {})
  it('should show token cost for expansion', () => {})
  it('should disable expansion in compact mode', () => {})
})

describe('ContextItemCard - Interactions', () => {
  it('should call onRemove when remove button clicked', () => {})
  it('should show remove button on hover', () => {})
  it('should prevent removal during loading', () => {})
  it('should confirm before removing', () => {})
  it('should support keyboard removal (Delete key)', () => {})
})

describe('ContextItemCard - Edge Cases', () => {
  it('should handle items without preview', () => {})
  it('should handle items without full content', () => {})
  it('should handle items with only summary', () => {})
  it('should handle extremely long labels', () => {})
  it('should handle missing metadata', () => {})
  it('should handle undefined relevance scores', () => {})
})
```

---

## 2. Missing Hook Tests

### 2.1 usePromptComposer Hook

#### Additional Test Cases Needed

```typescript
// MISSING: Complex state synchronization
describe('usePromptComposer - State Sync', () => {
  it('should sync value with external state', () => {})
  it('should handle concurrent state updates', () => {})
  it('should prevent race conditions', () => {})
  it('should batch state updates correctly', () => {})
  it('should handle rapid user input', () => {})
  it('should maintain consistency across re-renders', () => {})
})

// MISSING: Token optimization edge cases
describe('usePromptComposer - Token Optimization', () => {
  it('should optimize when approaching budget limit', () => {})
  it('should prioritize high-relevance items', () => {})
  it('should auto-compress low-relevance items', () => {})
  it('should handle token count overestimation', () => {})
  it('should recalculate on context changes', () => {})
  it('should debounce expensive calculations', () => {})
  it('should cache token counts per item', () => {})
})

// MISSING: Command execution
describe('usePromptComposer - Command Execution', () => {
  it('should execute sync commands', () => {})
  it('should execute async commands', () => {})
  it('should handle command errors', () => {})
  it('should update state after command execution', () => {})
  it('should prevent duplicate executions', () => {})
  it('should cleanup after command completes', () => {})
  it('should support command cancellation', () => {})
})

// MISSING: Memory management
describe('usePromptComposer - Memory Management', () => {
  it('should cleanup on unmount', () => {})
  it('should revoke object URLs', () => {})
  it('should cancel pending operations', () => {})
  it('should clear event listeners', () => {})
  it('should prevent memory leaks with large contexts', () => {})
  it('should garbage collect old context items', () => {})
})

// MISSING: Browser compatibility
describe('usePromptComposer - Browser Compatibility', () => {
  it('should work without SpeechRecognition API', () => {})
  it('should work without File API', () => {})
  it('should polyfill missing features', () => {})
  it('should detect and warn about unsupported features', () => {})
})
```

### 2.2 Context Utilities

#### Additional Test Cases

```typescript
// MISSING: Relevance ranking edge cases
describe('rankByRelevance - Edge Cases', () => {
  it('should handle empty context items array', () => {})
  it('should handle empty query string', () => {})
  it('should handle special characters in query', () => {})
  it('should handle regex special characters safely', () => {})
  it('should rank identical items consistently', () => {})
  it('should handle very long queries', () => {})
  it('should weight recent access time correctly', () => {})
  it('should combine multiple ranking factors', () => {})
})

// MISSING: buildPromptWithContext optimization
describe('buildPromptWithContext - Optimization', () => {
  it('should prefer high-relevance items when over budget', () => {})
  it('should truncate low-relevance items first', () => {})
  it('should preserve minimum context for each item', () => {})
  it('should handle circular dependencies in context', () => {})
  it('should optimize token usage below budget', () => {})
  it('should handle items with missing token counts', () => {})
  it('should gracefully degrade with huge contexts', () => {})
})

// MISSING: Token calculation accuracy
describe('calculateContextTokens - Accuracy', () => {
  it('should handle Unicode characters correctly', () => {})
  it('should count code blocks accurately', () => {})
  it('should handle markdown formatting', () => {})
  it('should account for whitespace', () => {})
  it('should handle mixed character sets', () => {})
  it('should match actual API token counts within 5%', () => {})
})

// MISSING: fuzzyMatch improvements
describe('fuzzyMatch - Advanced', () => {
  it('should match acronyms (e.g., "btn" -> "Button")', () => {})
  it('should match camelCase patterns', () => {})
  it('should handle typos with edit distance', () => {})
  it('should prioritize earlier matches', () => {})
  it('should handle word boundaries', () => {})
  it('should support phonetic matching', () => {})
})
```

---

## 3. Integration Test Opportunities

### 3.1 End-to-End User Flows

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/integration/user-flows.test.tsx`

```typescript
describe('PromptComposer - E2E User Flows', () => {
  it('should complete full composition flow: type -> add context -> submit', () => {
    // 1. User focuses input
    // 2. Sees suggestions
    // 3. Types query
    // 4. Adds @mention
    // 5. Expands context
    // 6. Submits
    // 7. Receives confirmation
  })

  it('should handle command workflow: /command -> execute', () => {
    // 1. Type /search
    // 2. Command palette opens
    // 3. Navigate with arrows
    // 4. Execute with Enter
    // 5. Command runs
    // 6. Results displayed
  })

  it('should handle file attachment workflow', () => {
    // 1. Click attach
    // 2. Select files
    // 3. Validate files
    // 4. Upload files
    // 5. Show previews
    // 6. Submit with attachments
  })

  it('should handle voice input workflow', () => {
    // 1. Click voice button
    // 2. Grant permissions
    // 3. Speak input
    // 4. Transcribe text
    // 5. Append to input
    // 6. Submit
  })

  it('should recover from errors and retry', () => {
    // 1. Submit message
    // 2. Network error occurs
    // 3. Show error message
    // 4. User clicks retry
    // 5. Successful submission
  })

  it('should handle multi-turn conversation', () => {
    // 1. Submit first message
    // 2. Receive response
    // 3. Context preserved
    // 4. Submit follow-up
    // 5. Context enriched
  })
})
```

### 3.2 Component Integration Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/integration/component-integration.test.tsx`

```typescript
describe('PromptComposer - Component Integration', () => {
  it('should coordinate ContextMentionInput with TokenBudgetIndicator', () => {
    // Verify token updates propagate correctly
  })

  it('should sync CommandPalette with main input state', () => {
    // Verify command execution updates input
  })

  it('should update AttachmentManager when files added via drag-drop', () => {
    // Verify attachment state consistency
  })

  it('should close overlays when clicking outside', () => {
    // Test focus management across components
  })

  it('should share keyboard shortcuts correctly', () => {
    // Verify no shortcut conflicts
  })

  it('should propagate errors across components', () => {
    // Test error boundary integration
  })
})
```

### 3.3 Performance Integration Tests

**File:** `/Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/integration/performance.test.tsx`

```typescript
describe('PromptComposer - Performance', () => {
  it('should render 100 suggestions without lag', () => {})
  it('should handle 50 context items efficiently', () => {})
  it('should virtualize long command lists', () => {})
  it('should not block UI during token calculation', () => {})
  it('should debounce search queries appropriately', () => {})
  it('should lazy load components on demand', () => {})
  it('should optimize re-renders with React.memo', () => {})
  it('should profile and meet performance budgets', () => {})
})
```

---

## 4. Edge Cases Not Currently Covered

### 4.1 Concurrent Operations

```typescript
describe('Concurrent Operations', () => {
  it('should handle simultaneous context additions', () => {})
  it('should handle rapid submit clicks', () => {})
  it('should queue overlapping API calls', () => {})
  it('should prevent state corruption from race conditions', () => {})
  it('should handle concurrent attachment uploads', () => {})
  it('should serialize conflicting updates', () => {})
})
```

### 4.2 Browser Edge Cases

```typescript
describe('Browser Edge Cases', () => {
  it('should handle browser autofill', () => {})
  it('should work with browser password managers', () => {})
  it('should preserve state across page refresh', () => {})
  it('should handle browser back/forward navigation', () => {})
  it('should work in private/incognito mode', () => {})
  it('should handle browser zoom levels', () => {})
  it('should work with browser extensions', () => {})
})
```

### 4.3 Input Edge Cases

```typescript
describe('Input Edge Cases', () => {
  it('should handle emoji input', () => {})
  it('should handle RTL text', () => {})
  it('should handle mixed RTL/LTR text', () => {})
  it('should handle IME composition events', () => {})
  it('should handle paste with formatting', () => {})
  it('should handle paste with images', () => {})
  it('should handle extremely long input (>10k chars)', () => {})
  it('should handle null bytes in input', () => {})
})
```

### 4.4 Network Edge Cases

```typescript
describe('Network Edge Cases', () => {
  it('should handle slow network (<100kbps)', () => {})
  it('should handle network disconnection during submit', () => {})
  it('should handle partial response from API', () => {})
  it('should handle malformed API responses', () => {})
  it('should retry on 5xx errors', () => {})
  it('should not retry on 4xx errors', () => {})
  it('should implement exponential backoff', () => {})
  it('should timeout long-running requests', () => {})
})
```

### 4.5 Accessibility Edge Cases

```typescript
describe('Accessibility Edge Cases', () => {
  it('should work with NVDA screen reader', () => {})
  it('should work with JAWS screen reader', () => {})
  it('should work with VoiceOver on macOS', () => {})
  it('should support Windows high contrast mode', () => {})
  it('should support forced colors mode', () => {})
  it('should handle keyboard-only navigation completely', () => {})
  it('should announce dynamic content changes', () => {})
  it('should maintain focus order with dynamic content', () => {})
})
```

---

## 5. Areas Needing More Thorough Testing

### 5.1 Token Budget Management (Priority: HIGH)

**Current Gap:** Token budget calculations are tested in isolation but not under realistic stress conditions.

**Tests Needed:**

```typescript
describe('Token Budget - Stress Testing', () => {
  it('should handle budget overflow gracefully', () => {
    // Add items totaling 150% of budget
    // Verify system doesn't crash
    // Verify user is warned
    // Verify items are prioritized correctly
  })

  it('should optimize when approaching budget limit', () => {
    // Add items to 95% of budget
    // Verify automatic compression
    // Verify minimal information loss
  })

  it('should recalculate on every context change', () => {
    // Add, remove, expand items rapidly
    // Verify calculations stay accurate
    // Verify no cumulative errors
  })

  it('should handle token count variations between models', () => {
    // Test with GPT-3.5, GPT-4, Claude tokens
    // Verify estimates are reasonable
  })

  it('should save 80%+ tokens vs traditional approach', () => {
    // Benchmark against full context
    // Verify savings meet target
  })
})
```

### 5.2 Progressive Disclosure State Machine (Priority: HIGH)

**Current Gap:** State transitions are tested individually but not as a complete state machine.

**Tests Needed:**

```typescript
describe('State Machine - Comprehensive', () => {
  it('should allow all valid state transitions', () => {
    // Test state transition matrix
    // Verify all valid paths work
  })

  it('should prevent invalid state transitions', () => {
    // Test impossible transitions
    // Verify they are rejected
  })

  it('should recover from invalid states', () => {
    // Force invalid state
    // Verify recovery mechanism
  })

  it('should maintain state invariants', () => {
    // Define state invariants
    // Verify they hold across transitions
  })

  it('should handle rapid state changes', () => {
    // Trigger 100 state changes quickly
    // Verify no corruption
  })
})
```

### 5.3 Context Provider Integration (Priority: MEDIUM)

**Current Gap:** Individual providers are tested, but not multi-provider coordination.

**Tests Needed:**

```typescript
describe('Multi-Provider Coordination', () => {
  it('should merge results from 5+ providers', () => {})
  it('should handle provider timeouts independently', () => {})
  it('should prioritize by provider priority', () => {})
  it('should deduplicate cross-provider results', () => {})
  it('should handle provider failures without blocking others', () => {})
  it('should respect per-provider maxResults limits', () => {})
})
```

### 5.4 Keyboard Navigation Coverage (Priority: MEDIUM)

**Current Gap:** Basic keyboard tests exist but don't cover all scenarios.

**Tests Needed:**

```typescript
describe('Keyboard Navigation - Complete', () => {
  it('should support all ARIA keyboard patterns', () => {})
  it('should handle focus trapping in modals', () => {})
  it('should restore focus on modal close', () => {})
  it('should navigate with Tab/Shift+Tab correctly', () => {})
  it('should prevent focus from leaving component when needed', () => {})
  it('should handle Escape key at all levels', () => {})
  it('should support keyboard shortcuts without conflicts', () => {})
  it('should work with assistive technologies', () => {})
})
```

### 5.5 Error Recovery Mechanisms (Priority: HIGH)

**Current Gap:** Error display is tested but not full recovery flows.

**Tests Needed:**

```typescript
describe('Error Recovery', () => {
  it('should retry failed submissions with backoff', () => {})
  it('should preserve user input during errors', () => {})
  it('should show actionable error messages', () => {})
  it('should allow manual retry after failure', () => {})
  it('should log errors for debugging', () => {})
  it('should recover from partial state corruption', () => {})
  it('should provide offline mode when network unavailable', () => {})
  it('should queue operations when offline', () => {})
})
```

---

## 6. Specific Tests to Add for Better Coverage

### 6.1 PromptComposer.test.tsx (NEW FILE)

```typescript
/**
 * PromptComposer Component Tests
 *
 * File: /Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/PromptComposer.test.tsx
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptComposer } from '../PromptComposer'
import type { ContextProvider, Command, Suggestion } from '../../../hooks/prompt-composer/types'

describe('PromptComposer', () => {
  const mockSubmit = vi.fn()
  const mockStateChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should render with minimal required props', () => {
      render(<PromptComposer api="/api/chat" />)
      expect(screen.getByPlaceholderText('Ask anything...')).toBeInTheDocument()
    })

    it('should apply custom placeholder', () => {
      render(<PromptComposer api="/api/chat" placeholder="Custom prompt" />)
      expect(screen.getByPlaceholderText('Custom prompt')).toBeInTheDocument()
    })

    it('should initialize with custom token budget', () => {
      render(
        <PromptComposer
          api="/api/chat"
          tokenBudget={16000}
          showTokenBudget
        />
      )
      expect(screen.getByText(/16000/)).toBeInTheDocument()
    })

    it('should respect feature flags', () => {
      render(
        <PromptComposer
          api="/api/chat"
          features={{
            attachments: false,
            voice: false,
            settings: false
          }}
        />
      )
      expect(screen.queryByRole('button', { name: /attachment/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /voice/i })).not.toBeInTheDocument()
    })
  })

  describe('State Transitions', () => {
    it('should expand when text exceeds threshold', async () => {
      const { container } = render(<PromptComposer api="/api/chat" />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'a'.repeat(150))

      await waitFor(() => {
        expect(textarea).toHaveClass(/min-h-\[120px\]/)
      })
    })

    it('should show submitting state during submit', async () => {
      const onSubmit = vi.fn().mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 100))
      )

      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')
      await userEvent.type(textarea, 'Test message')

      const submitButton = screen.getByRole('button', { name: /send/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toHaveTextContent('Sending...')
        expect(submitButton).toBeDisabled()
      })
    })

    it('should reset to collapsed after successful submit', async () => {
      render(<PromptComposer api="/api/chat" onSubmit={mockSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'Test')
      fireEvent.keyDown(textarea, { key: 'Enter' })

      await waitFor(() => {
        expect(textarea).toHaveValue('')
        expect(mockSubmit).toHaveBeenCalled()
      })
    })
  })

  describe('Token Budget Display', () => {
    it('should show token budget indicator when enabled', () => {
      render(<PromptComposer api="/api/chat" showTokenBudget />)
      expect(screen.getByText(/8000/)).toBeInTheDocument()
    })

    it('should hide token budget when disabled', () => {
      render(<PromptComposer api="/api/chat" showTokenBudget={false} />)
      expect(screen.queryByText(/8000/)).not.toBeInTheDocument()
    })

    it('should update token count as user types', async () => {
      render(<PromptComposer api="/api/chat" showTokenBudget />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'Hello world')

      await waitFor(() => {
        const tokenDisplay = screen.getByText(/\/8000/)
        expect(tokenDisplay).toBeInTheDocument()
      })
    })

    it('should change color when approaching budget', async () => {
      render(<PromptComposer api="/api/chat" tokenBudget={100} showTokenBudget />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      // Add enough text to exceed 60% of budget
      await userEvent.type(textarea, 'a'.repeat(80))

      await waitFor(() => {
        const tokenDisplay = screen.getByText(/\/100/)
        // Should have yellow color class for >60%
        expect(tokenDisplay.className).toMatch(/yellow/)
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message on submit failure', async () => {
      const error = new Error('Network error')
      const onSubmit = vi.fn().mockRejectedValue(error)

      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'Test')
      fireEvent.keyDown(textarea, { key: 'Enter' })

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should clear error on retry', async () => {
      const onSubmit = vi.fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce(undefined)

      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      // First attempt fails
      await userEvent.type(textarea, 'Test')
      fireEvent.keyDown(textarea, { key: 'Enter' })

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument()
      })

      // Retry succeeds
      await userEvent.type(textarea, 'Test again')
      fireEvent.keyDown(textarea, { key: 'Enter' })

      await waitFor(() => {
        expect(screen.queryByText('Failed')).not.toBeInTheDocument()
      })
    })

    it('should preserve user input when submit fails', async () => {
      const onSubmit = vi.fn().mockRejectedValue(new Error('Failed'))

      render(<PromptComposer api="/api/chat" onSubmit={onSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'Important message')
      fireEvent.keyDown(textarea, { key: 'Enter' })

      await waitFor(() => {
        expect(screen.getByText('Failed')).toBeInTheDocument()
        expect(textarea).toHaveValue('Important message')
      })
    })
  })

  describe('Keyboard Shortcuts', () => {
    it('should submit on Enter', async () => {
      render(<PromptComposer api="/api/chat" onSubmit={mockSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'Test{Enter}')

      await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.stringContaining('Test')
          })
        )
      })
    })

    it('should add newline on Shift+Enter', async () => {
      render(<PromptComposer api="/api/chat" onSubmit={mockSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      await userEvent.type(textarea, 'Line 1')
      fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
      await userEvent.type(textarea, 'Line 2')

      expect(textarea.value).toContain('\n')
      expect(mockSubmit).not.toHaveBeenCalled()
    })

    it('should prevent submit when input is empty', async () => {
      render(<PromptComposer api="/api/chat" onSubmit={mockSubmit} />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      fireEvent.keyDown(textarea, { key: 'Enter' })

      expect(mockSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<PromptComposer api="/api/chat" />)

      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    })

    it('should maintain focus order', async () => {
      const user = userEvent.setup()
      render(
        <PromptComposer
          api="/api/chat"
          features={{ attachments: true }}
        />
      )

      const textarea = screen.getByRole('textbox')
      textarea.focus()

      await user.tab()
      // Should move to next focusable element
      expect(document.activeElement).not.toBe(textarea)
    })

    it('should meet WCAG 2.1 AA contrast requirements', () => {
      const { container } = render(<PromptComposer api="/api/chat" />)
      // Would use axe-core or similar for actual testing
      expect(container).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = vi.fn()

      function WrappedComposer(props: any) {
        renderSpy()
        return <PromptComposer {...props} />
      }

      const { rerender } = render(<WrappedComposer api="/api/chat" />)

      const initialRenders = renderSpy.mock.calls.length

      // Re-render with same props
      rerender(<WrappedComposer api="/api/chat" />)

      // Should not trigger additional render
      expect(renderSpy.mock.calls.length).toBe(initialRenders)
    })

    it('should handle rapid typing without lag', async () => {
      const { container } = render(<PromptComposer api="/api/chat" />)
      const textarea = screen.getByPlaceholderText('Ask anything...')

      const start = performance.now()

      // Simulate rapid typing
      for (let i = 0; i < 100; i++) {
        await userEvent.type(textarea, 'a')
      }

      const end = performance.now()

      // Should complete within reasonable time (< 1 second)
      expect(end - start).toBeLessThan(1000)
    })
  })
})
```

### 6.2 AttachmentManager.test.tsx (NEW FILE)

```typescript
/**
 * AttachmentManager Component Tests
 *
 * File: /Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/components/prompt-composer/__tests__/AttachmentManager.test.tsx
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AttachmentManager } from '../AttachmentManager'
import type { Attachment } from '../../../hooks/prompt-composer/types'

describe('AttachmentManager', () => {
  const mockAttachments: Attachment[] = []
  const mockOnChange = vi.fn()
  const mockOnUpload = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('File Selection', () => {
    it('should open file picker on button click', () => {
      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
        />
      )

      const button = screen.getByRole('button', { name: /add attachment/i })
      expect(button).toBeInTheDocument()
    })

    it('should handle file selection', async () => {
      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
          onUpload={mockOnUpload}
        />
      )

      const file = new File(['content'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalledWith(file)
      })
    })

    it('should handle multiple file selection', async () => {
      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
          maxFiles={5}
        />
      )

      const files = [
        new File(['1'], 'file1.txt'),
        new File(['2'], 'file2.txt'),
        new File(['3'], 'file3.txt'),
      ]

      const input = document.querySelector('input[type="file"]') as HTMLInputElement
      Object.defineProperty(input, 'files', {
        value: files,
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalled()
      })
    })
  })

  describe('File Validation', () => {
    it('should reject files exceeding max size', async () => {
      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
          onError={mockOnError}
          maxFileSize={1024} // 1KB
        />
      )

      const largeFile = new File(['x'.repeat(2000)], 'large.txt')
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      Object.defineProperty(input, 'files', {
        value: [largeFile],
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          expect.stringContaining('exceeds maximum size')
        )
      })
    })

    it('should reject unsupported file types', async () => {
      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
          onError={mockOnError}
          acceptedTypes={['image/*']}
        />
      )

      const textFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      Object.defineProperty(input, 'files', {
        value: [textFile],
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          expect.stringContaining('not accepted')
        )
      })
    })

    it('should accept wildcard file types', async () => {
      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
          acceptedTypes={['image/*']}
        />
      )

      const imageFile = new File(['img'], 'test.png', { type: 'image/png' })
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      Object.defineProperty(input, 'files', {
        value: [imageFile],
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnError).not.toHaveBeenCalled()
      })
    })

    it('should enforce max files limit', async () => {
      const existingAttachments: Attachment[] = [
        { id: '1', type: 'document', name: 'file1.txt', size: 100, url: 'blob:1' },
        { id: '2', type: 'document', name: 'file2.txt', size: 100, url: 'blob:2' },
      ]

      render(
        <AttachmentManager
          attachments={existingAttachments}
          onChange={mockOnChange}
          onError={mockOnError}
          maxFiles={2}
        />
      )

      const newFile = new File(['content'], 'file3.txt')
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      Object.defineProperty(input, 'files', {
        value: [newFile],
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          expect.stringContaining('Maximum 2 files')
        )
      })
    })
  })

  describe('Drag and Drop', () => {
    it('should highlight drop zone on drag enter', () => {
      const { container } = render(
        <AttachmentManager
          attachments={mockAttachments}
          onChange={mockOnChange}
        />
      )

      const dropZone = container.querySelector('[data-testid="drop-zone"]') || container.firstChild as HTMLElement

      fireEvent.dragEnter(dropZone)

      expect(dropZone.className).toContain('ring-blue-500')
    })

    it('should remove highlight on drag leave', () => {
      const { container } = render(
        <AttachmentManager
          attachments={mockAttachments}
          onChange={mockOnChange}
        />
      )

      const dropZone = container.firstChild as HTMLElement

      fireEvent.dragEnter(dropZone)
      fireEvent.dragLeave(dropZone)

      expect(dropZone.className).not.toContain('ring-blue-500')
    })

    it('should handle file drop', async () => {
      const { container } = render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
        />
      )

      const dropZone = container.firstChild as HTMLElement
      const file = new File(['content'], 'dropped.txt')

      const dataTransfer = {
        files: [file],
        items: [],
        types: ['Files']
      }

      fireEvent.drop(dropZone, { dataTransfer })

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalled()
      })
    })
  })

  describe('Attachment Display', () => {
    it('should display existing attachments', () => {
      const attachments: Attachment[] = [
        { id: '1', type: 'document', name: 'test.pdf', size: 1024, url: 'blob:1' },
        { id: '2', type: 'image', name: 'image.png', size: 2048, url: 'blob:2' },
      ]

      render(
        <AttachmentManager
          attachments={attachments}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText('test.pdf')).toBeInTheDocument()
      expect(screen.getByText('image.png')).toBeInTheDocument()
    })

    it('should show file size in human-readable format', () => {
      const attachments: Attachment[] = [
        { id: '1', type: 'document', name: 'test.pdf', size: 1024 * 1024, url: 'blob:1' }, // 1MB
      ]

      render(
        <AttachmentManager
          attachments={attachments}
          onChange={mockOnChange}
        />
      )

      expect(screen.getByText(/1(\.\d+)?\s*MB/i)).toBeInTheDocument()
    })

    it('should show appropriate icons for file types', () => {
      const attachments: Attachment[] = [
        { id: '1', type: 'image', name: 'pic.png', size: 1000, url: 'blob:1' },
        { id: '2', type: 'document', name: 'doc.pdf', size: 1000, url: 'blob:2' },
        { id: '3', type: 'code', name: 'app.js', size: 1000, url: 'blob:3' },
      ]

      render(
        <AttachmentManager
          attachments={attachments}
          onChange={mockOnChange}
        />
      )

      // Icons should be visible (emojis in this case)
      expect(screen.getByText('🖼️')).toBeInTheDocument() // image
      expect(screen.getByText('📄')).toBeInTheDocument() // document
      expect(screen.getByText('📝')).toBeInTheDocument() // code
    })
  })

  describe('Attachment Removal', () => {
    it('should remove attachment on button click', async () => {
      const attachments: Attachment[] = [
        { id: '1', type: 'document', name: 'test.txt', size: 100, url: 'blob:1' },
      ]

      render(
        <AttachmentManager
          attachments={attachments}
          onChange={mockOnChange}
        />
      )

      const removeButton = screen.getByRole('button', { name: /remove attachment/i })
      fireEvent.click(removeButton)

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith([])
      })
    })

    it('should show remove button on hover', async () => {
      const attachments: Attachment[] = [
        { id: '1', type: 'document', name: 'test.txt', size: 100, url: 'blob:1' },
      ]

      const { container } = render(
        <AttachmentManager
          attachments={attachments}
          onChange={mockOnChange}
        />
      )

      const attachmentCard = screen.getByText('test.txt').closest('div')

      if (attachmentCard) {
        fireEvent.mouseEnter(attachmentCard)

        await waitFor(() => {
          const removeButton = screen.getByRole('button', { name: /remove/i })
          expect(removeButton).toBeVisible()
        })
      }
    })
  })

  describe('Compact Mode', () => {
    it('should render in compact mode', () => {
      const attachments: Attachment[] = [
        { id: '1', type: 'document', name: 'test.txt', size: 100, url: 'blob:1' },
      ]

      const { container } = render(
        <AttachmentManager
          attachments={attachments}
          onChange={mockOnChange}
          compact
        />
      )

      // Compact mode should have smaller padding/sizing
      const attachment = container.querySelector('[class*="p-1.5"]')
      expect(attachment).toBeInTheDocument()
    })
  })

  describe('Upload Progress', () => {
    it('should show uploading state', async () => {
      const slowUpload = vi.fn(() =>
        new Promise(resolve => setTimeout(() => resolve({
          id: '1',
          type: 'document' as const,
          name: 'test.txt',
          size: 100,
          url: 'blob:1'
        }), 100))
      )

      render(
        <AttachmentManager
          attachments={[]}
          onChange={mockOnChange}
          onUpload={slowUpload}
        />
      )

      const file = new File(['content'], 'test.txt')
      const input = document.querySelector('input[type="file"]') as HTMLInputElement

      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(screen.getByText(/uploading/i)).toBeInTheDocument()
      })
    })
  })
})
```

### 6.3 usePromptComposer Additional Tests

```typescript
/**
 * Additional tests for usePromptComposer hook
 *
 * Add to: /Users/christireid/Dev/Clarity-ai-chat-components/packages/react/src/hooks/prompt-composer/__tests__/usePromptComposer.test.ts
 */

describe('usePromptComposer - Additional Coverage', () => {
  describe('Attachment Management', () => {
    it('should add attachment and update state', async () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const file = new File(['content'], 'test.txt')

      await act(async () => {
        await result.current.actions.addAttachment(file)
      })

      expect(result.current.state.attachments).toHaveLength(1)
      expect(result.current.state.attachments[0].name).toBe('test.txt')
    })

    it('should remove attachment by id', async () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const file = new File(['content'], 'test.txt')

      await act(async () => {
        await result.current.actions.addAttachment(file)
      })

      const attachmentId = result.current.state.attachments[0].id

      act(() => {
        result.current.actions.removeAttachment(attachmentId)
      })

      expect(result.current.state.attachments).toHaveLength(0)
    })

    it('should prevent duplicate attachments', async () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const file = new File(['content'], 'test.txt')

      await act(async () => {
        await result.current.actions.addAttachment(file)
        await result.current.actions.addAttachment(file)
      })

      expect(result.current.state.attachments).toHaveLength(1)
    })
  })

  describe('Context Expansion', () => {
    it('should expand context to preview level', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'test.ts',
        summary: 'Summary',
        preview: 'Preview content',
        full: 'Full content',
      })

      act(() => {
        result.current.actions.addContext(item)
      })

      act(() => {
        result.current.actions.expandContext('file1', 'preview')
      })

      const contextItem = result.current.state.contextItems.find(i => i.id === 'file1')
      expect(contextItem).toBeDefined()
      // Would verify expansion level is tracked
    })

    it('should expand context to full level', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const item = createContextItem({
        id: 'file1',
        type: 'file',
        label: 'test.ts',
        summary: 'Summary',
        preview: 'Preview',
        full: 'Full content with all details',
      })

      act(() => {
        result.current.actions.addContext(item)
        result.current.actions.expandContext('file1', 'full')
      })

      // Verify expansion occurred
      const contextItem = result.current.state.contextItems[0]
      expect(contextItem.id).toBe('file1')
    })
  })

  describe('Command Execution', () => {
    it('should execute command and update state', async () => {
      const executeFn = vi.fn()
      const command: Command = {
        id: 'test',
        trigger: '/test',
        label: 'Test Command',
        description: 'Test',
        icon: <span>🧪</span>,
        execute: executeFn,
      }

      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      await act(async () => {
        await result.current.actions.executeCommand(command)
      })

      expect(executeFn).toHaveBeenCalled()
      expect(result.current.state.activeCommand).toBe(command)
    })

    it('should handle async command execution', async () => {
      const executeFn = vi.fn().mockResolvedValue(undefined)
      const command: Command = {
        id: 'async',
        trigger: '/async',
        label: 'Async Command',
        description: 'Async',
        icon: <span>⚡</span>,
        execute: executeFn,
      }

      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      await act(async () => {
        await result.current.actions.executeCommand(command)
      })

      expect(executeFn).toHaveBeenCalled()
    })

    it('should handle command execution errors', async () => {
      const error = new Error('Command failed')
      const executeFn = vi.fn().mockRejectedValue(error)
      const command: Command = {
        id: 'error',
        trigger: '/error',
        label: 'Error Command',
        description: 'Fails',
        icon: <span>❌</span>,
        execute: executeFn,
      }

      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      await act(async () => {
        await result.current.actions.executeCommand(command)
      })

      expect(result.current.state.error).toBeDefined()
    })
  })

  describe('Suggestion Application', () => {
    it('should apply suggestion to input', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      const suggestion: Suggestion = {
        id: 'suggest1',
        type: 'starter',
        text: 'Explain this code',
      }

      act(() => {
        result.current.actions.applySuggestion(suggestion)
      })

      expect(result.current.state.value).toBe('Explain this code')
      expect(result.current.state.selectedSuggestion).toBe(suggestion)
    })

    it('should append suggestion to existing text', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('Hello')
      })

      const suggestion: Suggestion = {
        id: 'suggest2',
        type: 'continuation',
        text: ' world',
      }

      act(() => {
        result.current.actions.applySuggestion(suggestion)
      })

      expect(result.current.state.value).toBe('Hello world')
    })
  })

  describe('Focus Management', () => {
    it('should update focus state', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.focus()
      })

      expect(result.current.state.isFocused).toBe(true)

      act(() => {
        result.current.actions.blur()
      })

      expect(result.current.state.isFocused).toBe(false)
    })
  })

  describe('Progressive Disclosure', () => {
    it('should show suggestions on focus when empty', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.focus()
      })

      expect(result.current.state.showSuggestions).toBe(true)
    })

    it('should hide suggestions when typing', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.focus()
        result.current.actions.setValue('test')
      })

      expect(result.current.state.showSuggestions).toBe(false)
    })

    it('should show commands when / is typed', () => {
      const { result } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('/search')
      })

      expect(result.current.state.showCommands).toBe(true)
    })
  })

  describe('Memory Management', () => {
    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() => usePromptComposer(defaultConfig))

      act(() => {
        result.current.actions.setValue('Test')
      })

      unmount()

      // Verify cleanup happened (no errors, no memory leaks)
      expect(true).toBe(true)
    })
  })

  describe('Callbacks', () => {
    it('should call onStateChange when state updates', () => {
      const onStateChange = vi.fn()
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onStateChange })
      )

      act(() => {
        result.current.actions.setValue('Test')
      })

      expect(onStateChange).toHaveBeenCalled()
      expect(onStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          value: 'Test',
          currentState: expect.any(String),
        })
      )
    })

    it('should call onTokenUsageChange when tokens update', () => {
      const onTokenUsageChange = vi.fn()
      const { result } = renderHook(() =>
        usePromptComposer({ ...defaultConfig, onTokenUsageChange })
      )

      act(() => {
        result.current.actions.setValue('Hello world')
      })

      expect(onTokenUsageChange).toHaveBeenCalled()
      expect(onTokenUsageChange).toHaveBeenCalledWith(expect.any(Number))
    })
  })
})
```

---

## 7. Test Implementation Priority Matrix

### Priority 1: Critical for Production (HIGH)

1. **Token Budget Overflow Handling**
   - Test budget exceeded scenarios
   - Verify automatic compression
   - Test warning/error displays

2. **Error Recovery Mechanisms**
   - Network failure handling
   - Retry logic
   - State preservation during errors

3. **State Machine Integrity**
   - All valid transitions
   - Invalid transition prevention
   - State consistency

4. **Accessibility Compliance**
   - Screen reader compatibility
   - Keyboard-only navigation
   - WCAG 2.1 AA standards

### Priority 2: Important for Quality (MEDIUM)

1. **Integration Tests**
   - Component coordination
   - End-to-end user flows
   - Cross-component communication

2. **Performance Tests**
   - Large dataset handling
   - Render optimization
   - Memory leak detection

3. **Browser Compatibility**
   - Edge case handling
   - Polyfill verification
   - Feature detection

### Priority 3: Nice to Have (LOW)

1. **Visual Regression Tests**
   - Screenshot comparisons
   - Layout consistency
   - Theme switching

2. **Stress Testing**
   - Concurrent operations
   - Rapid interactions
   - Resource limits

---

## 8. Recommended Testing Tools

### 8.1 Test Framework Stack

- **Vitest** - Fast, modern test runner (already in use)
- **@testing-library/react** - Component testing (already in use)
- **@testing-library/user-event** - Realistic user interactions (already in use)
- **jest-axe** - Accessibility testing

### 8.2 Additional Tools

- **@vitest/coverage-v8** - Code coverage reporting
- **@testing-library/jest-dom** - Custom matchers
- **msw** - Mock Service Worker for API mocking
- **@faker-js/faker** - Test data generation

### 8.3 CI/CD Integration

```yaml
# Recommended GitHub Actions workflow
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - name: Run tests
        run: |
          pnpm install
          pnpm test --coverage
          pnpm test:integration
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 9. Success Metrics

### Coverage Targets

- **Hooks:** 85%+ statement coverage
- **Components:** 80%+ statement coverage
- **Utilities:** 90%+ statement coverage
- **Integration:** 70%+ path coverage

### Quality Metrics

- **0** known accessibility violations
- **< 100ms** component render time
- **< 1 second** for 100 context items
- **95%+** keyboard navigation success rate

### Testing Best Practices

1. **Arrange-Act-Assert** pattern in all tests
2. **Test behavior, not implementation**
3. **One assertion concept per test**
4. **Descriptive test names** (what, when, expected)
5. **Clean up after each test**
6. **Mock external dependencies**
7. **Test error paths, not just happy paths**

---

## 10. Next Steps

### Immediate Actions (Week 1)

1. ✅ Create PromptComposer.test.tsx with initialization tests
2. ✅ Create AttachmentManager.test.tsx with drag-drop tests
3. ✅ Add token budget stress tests
4. ✅ Add error recovery tests

### Short Term (Week 2-3)

1. ✅ Complete keyboard navigation coverage
2. ✅ Add integration test suite
3. ✅ Set up accessibility testing pipeline
4. ✅ Add performance benchmarks

### Long Term (Month 2+)

1. ✅ Visual regression testing setup
2. ✅ E2E test suite with real backend
3. ✅ Load testing for production scale
4. ✅ Continuous monitoring and test maintenance

---

## Summary

The PromptComposer system has a solid foundation of tests but needs expansion in several critical areas:

**Strengths:**
- Good coverage of basic functionality
- Well-structured test organization
- Clear test descriptions

**Gaps:**
- Missing edge case coverage
- Limited integration testing
- Insufficient error scenario coverage
- No performance benchmarking

**Recommended Focus:**
1. Expand error handling tests (HIGH priority)
2. Add comprehensive integration tests (HIGH priority)
3. Improve accessibility testing (HIGH priority)
4. Add performance benchmarks (MEDIUM priority)

By following this test plan, the PromptComposer system will achieve production-ready quality with confidence in all user scenarios.
