---
name: Token Budget Bar Component
about: Implement the TokenBudgetBar visual component for token usage display
title: '[AI-CHAT] Implement TokenBudgetBar Component'
labels: enhancement, ai-chat, quick-win, token-optimization
assignees: ''
---

## Feature Enhancement

**Category:** token-optimization

**Enhancement Name:** Token Budget Progress Bar

**Priority:** Quick Win (High Impact, Low Effort)

**Report Reference:** See [AI_CHAT_FEATURE_ENHANCEMENT_REPORT.md](../../docs/AI_CHAT_FEATURE_ENHANCEMENT_REPORT.md#enhancement-1-token-budget-progress-component)

---

## Description

Create a visual progress bar component that displays token budget utilization with color-coded thresholds and optional cost estimation.

**Impact Score:** 4/5 | **Effort Score:** 1/5

---

## Provider Compatibility

| Provider | Status | Notes |
|----------|--------|-------|
| OpenAI | [x] Supported | Client-side, provider-agnostic |
| Anthropic | [x] Supported | Client-side, provider-agnostic |
| Google | [x] Supported | Client-side, provider-agnostic |

---

## Acceptance Criteria

- [ ] Visual bar shows 0-100% utilization
- [ ] Color changes at 80% (warning) and 95% (critical)
- [ ] Cost display shows estimated price
- [ ] Accessible with `role="progressbar"` and ARIA labels
- [ ] Works with all three providers' token counts
- [ ] TypeScript types complete
- [ ] Tests written and passing

---

## Implementation Details

**Entry Point:** New component in `packages/react/src/components/token-budget/`

**Files to Create:**
- [ ] Component: `packages/react/src/components/token-budget/TokenBudgetBar.tsx`
- [ ] Tests: `packages/react/src/components/token-budget/__tests__/TokenBudgetBar.test.tsx`
- [ ] Types: `packages/react/src/components/token-budget/types.ts`
- [ ] Index: `packages/react/src/components/token-budget/index.ts`
- [ ] Exports: Update `packages/react/src/index.ts`

**Target API:**
```typescript
import { TokenBudgetBar } from '@clarity-chat/react'

<TokenBudgetBar
  currentTokens={currentTokens}
  maxTokens={8000}
  warningThreshold={0.8}
  criticalThreshold={0.95}
  showCost={true}
  costPer1K={0.03}
  className="my-4"
/>
```

---

## Test Cases

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TokenBudgetBar } from './TokenBudgetBar'

describe('TokenBudgetBar', () => {
  it('should render progress bar with correct utilization', () => {
    render(<TokenBudgetBar currentTokens={4000} maxTokens={8000} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '50')
  })

  it('should apply warning class at threshold', () => {
    render(<TokenBudgetBar currentTokens={6400} maxTokens={8000} warningThreshold={0.8} />)
    expect(screen.getByRole('progressbar')).toHaveClass('warning')
  })

  it('should display formatted cost estimate', () => {
    render(<TokenBudgetBar currentTokens={1000} maxTokens={8000} showCost costPer1K={0.03} />)
    expect(screen.getByText(/\$0\.03/)).toBeInTheDocument()
  })
})
```

---

## Related

- Hook: `packages/react/src/prompt/hooks/use-token-budget.ts`
- Enhancement Report: [docs/AI_CHAT_FEATURE_ENHANCEMENT_REPORT.md](../../docs/AI_CHAT_FEATURE_ENHANCEMENT_REPORT.md)
