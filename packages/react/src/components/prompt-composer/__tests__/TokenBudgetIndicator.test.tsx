/**
 * TokenBudgetIndicator Component Tests
 *
 * Tests for token budget visualization and savings display.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TokenBudgetIndicator } from '../TokenBudgetIndicator'
import { createContextItem } from '../../../hooks/prompt-composer/context-utils'
import type { ContextItem } from '../../../hooks/prompt-composer/types'

describe('TokenBudgetIndicator', () => {
  const mockContextItems: ContextItem[] = [
    createContextItem({
      id: 'file1',
      type: 'file',
      label: 'Button.tsx',
      summary: 'Button component - 250 lines',
      preview: 'export function Button(props: ButtonProps) {...}',
      full: '// Full file contents...',
    }),
    createContextItem({
      id: 'doc1',
      type: 'doc',
      label: 'API Reference',
      summary: 'API documentation',
    }),
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ==========================================================================
  // Rendering Tests
  // ==========================================================================

  describe('Rendering', () => {
    it('renders with token count', () => {
      render(<TokenBudgetIndicator current={100} max={8000} contextItems={[]} />)

      expect(screen.getByText(/100/)).toBeInTheDocument()
      expect(screen.getByText(/8000/)).toBeInTheDocument()
    })

    it('displays percentage', () => {
      render(<TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />)

      // 4000/8000 = 50%
      expect(screen.getByText(/50%/)).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={[]}
          className="custom-class"
        />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('renders progress bar', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Color Coding Tests
  // ==========================================================================

  describe('Color Coding', () => {
    it('shows green for low usage (<60%)', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveClass(/green/)
    })

    it('shows yellow for medium usage (60-80%)', () => {
      const { container } = render(
        <TokenBudgetIndicator current={6000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveClass(/yellow/)
    })

    it('shows red for high usage (>80%)', () => {
      const { container } = render(
        <TokenBudgetIndicator current={7000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveClass(/red/)
    })

    it('handles 0% usage', () => {
      const { container } = render(
        <TokenBudgetIndicator current={0} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })

    it('handles 100% usage', () => {
      const { container } = render(
        <TokenBudgetIndicator current={8000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
    })
  })

  // ==========================================================================
  // Savings Display Tests
  // ==========================================================================

  describe('Savings Display', () => {
    it('shows savings when enabled', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showSavings
        />
      )

      expect(screen.getByText(/saved/i)).toBeInTheDocument()
    })

    it('hides savings when disabled', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showSavings={false}
        />
      )

      expect(screen.queryByText(/saved/i)).not.toBeInTheDocument()
    })

    it('calculates savings percentage', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showSavings
        />
      )

      // Should show percentage saved
      expect(screen.getByText(/%/)).toBeInTheDocument()
    })

    it('displays cost savings in dollars', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showSavings
        />
      )

      // Should show dollar amount
      expect(screen.getByText(/\$/)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Context Breakdown Tests
  // ==========================================================================

  describe('Context Breakdown', () => {
    it('shows breakdown when enabled', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showBreakdown
        />
      )

      expect(screen.getByText('Button.tsx')).toBeInTheDocument()
      expect(screen.getByText('API Reference')).toBeInTheDocument()
    })

    it('hides breakdown when disabled', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showBreakdown={false}
        />
      )

      expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument()
    })

    it('displays token count for each item', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showBreakdown
        />
      )

      // Should show token counts for each context item
      const tokenCounts = screen.getAllByText(/tokens?/)
      expect(tokenCounts.length).toBeGreaterThan(0)
    })

    it('groups items by type', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={mockContextItems}
          showBreakdown
        />
      )

      // Should have sections for files and docs
      expect(screen.getByText(/files?/i)).toBeInTheDocument()
      expect(screen.getByText(/docs?/i)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Empty State Tests
  // ==========================================================================

  describe('Empty States', () => {
    it('handles no context items', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={[]}
          showBreakdown
        />
      )

      expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument()
    })

    it('shows message when no context items', () => {
      render(
        <TokenBudgetIndicator
          current={100}
          max={8000}
          contextItems={[]}
          showBreakdown
        />
      )

      expect(screen.getByText(/no context items/i)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Accessibility Tests
  // ==========================================================================

  describe('Accessibility', () => {
    it('has progress bar role', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toBeInTheDocument()
    })

    it('has aria-valuenow', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuenow')
    })

    it('has aria-valuemin', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
    })

    it('has aria-valuemax', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
    })

    it('has descriptive label', () => {
      const { container } = render(
        <TokenBudgetIndicator current={4000} max={8000} contextItems={[]} />
      )

      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-label')
    })
  })

  // ==========================================================================
  // Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    it('handles exceeding max tokens', () => {
      render(<TokenBudgetIndicator current={10000} max={8000} contextItems={[]} />)

      expect(screen.getByText(/10000/)).toBeInTheDocument()
      // Percentage should cap at 100% or show over-budget indicator
    })

    it('handles negative current value', () => {
      render(<TokenBudgetIndicator current={-100} max={8000} contextItems={[]} />)

      // Should not crash, treat as 0
      const { container } = render(
        <TokenBudgetIndicator current={-100} max={8000} contextItems={[]} />
      )
      const progressBar = container.querySelector('[role="progressbar"]')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    })

    it('handles zero max tokens', () => {
      render(<TokenBudgetIndicator current={100} max={0} contextItems={[]} />)

      // Should not crash or divide by zero
      expect(screen.getByText(/100/)).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Format Tests
  // ==========================================================================

  describe('Format', () => {
    it('formats large numbers with commas', () => {
      render(
        <TokenBudgetIndicator current={1000} max={10000} contextItems={[]} />
      )

      expect(screen.getByText(/1,000/)).toBeInTheDocument()
      expect(screen.getByText(/10,000/)).toBeInTheDocument()
    })

    it('rounds percentages to whole numbers', () => {
      render(
        <TokenBudgetIndicator current={333} max={1000} contextItems={[]} />
      )

      // 333/1000 = 33.3%, should round to 33%
      expect(screen.getByText(/33%/)).toBeInTheDocument()
    })
  })
})
