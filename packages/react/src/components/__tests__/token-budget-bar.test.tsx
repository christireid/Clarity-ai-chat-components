import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { TokenBudgetBar, TokenBudgetIndicator } from '../token-budget-bar'
import type { TokenUsage } from '../../hooks/token/use-token-budget-monitor'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: any) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock model-pricing for cost estimation tests
vi.mock('../../utils/tokenization/model-pricing', () => ({
  MODEL_PRICING: {
    'gpt-4o': {
      inputCostPer1M: 2.5,
      outputCostPer1M: 10.0,
    },
    'gpt-4': {
      inputCostPer1M: 30.0,
      outputCostPer1M: 60.0,
    },
  },
}))

describe('TokenBudgetBar', () => {
  const createUsage = (
    current: number,
    max: number,
    reserved: number = 4096
  ): TokenUsage => {
    const effectiveMax = max - reserved
    const utilizationPercent =
      effectiveMax > 0 ? (current / effectiveMax) * 100 : 0
    const exceededPercent =
      utilizationPercent > 100 ? utilizationPercent - 100 : 0

    let status: TokenUsage['status'] = 'safe'
    if (utilizationPercent >= 100) status = 'exceeded'
    else if (utilizationPercent >= 95) status = 'critical'
    else if (utilizationPercent >= 80) status = 'warning'

    return {
      current,
      max,
      available: Math.max(0, effectiveMax - current),
      utilizationPercent: Math.min(utilizationPercent, 100),
      exceededPercent,
      status,
      reservedForOutput: reserved,
      effectiveMax,
    }
  }

  describe('renders correctly', () => {
    it('renders with safe status', () => {
      const usage = createUsage(5000, 128000)
      render(<TokenBudgetBar usage={usage} />)

      // Check visible text (not sr-only)
      expect(screen.getByText(/5,000 \/ 123,904 tokens/)).toBeInTheDocument()
    })

    it('renders with warning status', () => {
      const usage = createUsage(100000, 128000)
      render(<TokenBudgetBar usage={usage} />)

      expect(screen.getByText('Warning')).toBeInTheDocument()
    })

    it('renders with critical status', () => {
      const usage = createUsage(118000, 128000)
      render(<TokenBudgetBar usage={usage} />)

      expect(screen.getByText('Critical')).toBeInTheDocument()
    })

    it('renders with exceeded status', () => {
      const usage = createUsage(130000, 128000)
      render(<TokenBudgetBar usage={usage} />)

      expect(screen.getByText('Over Budget')).toBeInTheDocument()
      expect(screen.getByText(/over budget/)).toBeInTheDocument()
    })

    it('shows calculating state', () => {
      const usage = createUsage(5000, 128000)
      render(<TokenBudgetBar usage={usage} isCalculating />)

      expect(screen.getByText('Calculating...')).toBeInTheDocument()
    })
  })

  describe('compact mode', () => {
    it('renders only the bar in compact mode', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} compact />)

      // Should not show visible labels in compact mode (but sr-only description is ok)
      expect(
        screen.queryByText(/5,000 \/ 123,904 tokens/)
      ).not.toBeInTheDocument()
      // Progress bar should still exist
      expect(
        container.querySelector('[role="progressbar"]')
      ).toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    it('renders small size', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} size="sm" />)

      expect(container.querySelector('.text-xs')).toBeInTheDocument()
    })

    it('renders large size', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} size="lg" />)

      expect(container.querySelector('.text-base')).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn()
      const usage = createUsage(5000, 128000)
      const { container } = render(
        <TokenBudgetBar usage={usage} onClick={handleClick} />
      )

      // Click on the interactive container (has role="button" when onClick is provided)
      const button = container.querySelector('[role="button"]')
      expect(button).toBeInTheDocument()
      if (button) {
        fireEvent.click(button)
        expect(handleClick).toHaveBeenCalledTimes(1)
      }
    })

    it('calls onClick via keyboard', () => {
      const handleClick = vi.fn()
      const usage = createUsage(5000, 128000)
      const { container } = render(
        <TokenBudgetBar usage={usage} onClick={handleClick} />
      )

      const button = container.querySelector('[role="button"]')
      expect(button).toBeInTheDocument()
      if (button) {
        fireEvent.keyDown(button, { key: 'Enter' })
        expect(handleClick).toHaveBeenCalledTimes(1)
        fireEvent.keyDown(button, { key: ' ' })
        expect(handleClick).toHaveBeenCalledTimes(2)
      }
    })

    it('shows tooltip on hover', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} showTooltip />)

      // Find the focusable container
      const focusable = container.querySelector('[tabindex="0"]')
      expect(focusable).toBeInTheDocument()
      if (focusable) {
        fireEvent.mouseEnter(focusable)
        expect(screen.getByText('Token Budget Details')).toBeInTheDocument()
      }
    })

    it('shows tooltip on focus', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} showTooltip />)

      const focusable = container.querySelector('[tabindex="0"]')
      expect(focusable).toBeInTheDocument()
      if (focusable) {
        fireEvent.focus(focusable)
        expect(screen.getByText('Token Budget Details')).toBeInTheDocument()
      }
    })

    it('hides tooltip when not hovering', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} showTooltip />)

      const focusable = container.querySelector('[tabindex="0"]')
      expect(focusable).toBeInTheDocument()
      if (focusable) {
        fireEvent.mouseEnter(focusable)
        fireEvent.mouseLeave(focusable)
        // Tooltip should be hidden (AnimatePresence mock just hides children)
        expect(
          screen.queryByText('Token Budget Details')
        ).not.toBeInTheDocument()
      }
    })
  })

  describe('accessibility', () => {
    it('has aria-live for status updates', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} />)

      // Check aria-live element exists
      const ariaLiveElement = container.querySelector('[aria-live="polite"]')
      expect(ariaLiveElement).toBeInTheDocument()
    })

    it('has progressbar role with proper ARIA attributes', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} />)

      const progressbar = container.querySelector('[role="progressbar"]')
      expect(progressbar).toBeInTheDocument()
      expect(progressbar).toHaveAttribute('aria-valuenow', '5000')
      expect(progressbar).toHaveAttribute('aria-valuemin', '0')
      expect(progressbar).toHaveAttribute('aria-valuemax', '123904')
      expect(progressbar).toHaveAttribute('aria-label', 'Token Budget')
    })

    it('has screen reader only status description', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} />)

      const srOnly = container.querySelector('.sr-only')
      expect(srOnly).toBeInTheDocument()
      expect(srOnly?.textContent).toContain('4% used')
      expect(srOnly?.textContent).toContain('118,904 available')
    })

    it('announces exceeded status to screen readers', () => {
      const usage = createUsage(130000, 128000)
      const { container } = render(<TokenBudgetBar usage={usage} />)

      const alert = container.querySelector('[role="alert"]')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'assertive')
    })

    it('supports custom aria label', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(
        <TokenBudgetBar usage={usage} ariaLabel="Chat Token Budget" />
      )

      const progressbar = container.querySelector('[role="progressbar"]')
      expect(progressbar).toHaveAttribute('aria-label', 'Chat Token Budget')
    })
  })

  describe('without labels', () => {
    it('hides visible labels when showLabel is false', () => {
      const usage = createUsage(5000, 128000)
      const { container } = render(
        <TokenBudgetBar usage={usage} showLabel={false} />
      )

      // Should not show visible formatted usage text
      expect(
        screen.queryByText(/5,000 \/ 123,904 tokens/)
      ).not.toBeInTheDocument()
      // But sr-only description should still be present for accessibility
      expect(container.querySelector('.sr-only')).toBeInTheDocument()
    })
  })

  describe('cost estimation', () => {
    it('shows cost estimate when model and showCost are provided', () => {
      const usage = createUsage(10000, 128000)
      render(<TokenBudgetBar usage={usage} model="gpt-4o" showCost />)

      // Should show approximately formatted cost with ~ prefix
      expect(screen.getByText(/~\$/)).toBeInTheDocument()
    })

    it('does not show cost when showCost is false', () => {
      const usage = createUsage(10000, 128000)
      render(<TokenBudgetBar usage={usage} model="gpt-4o" showCost={false} />)

      expect(screen.queryByText(/~\$/)).not.toBeInTheDocument()
    })

    it('does not show cost when model is not provided', () => {
      const usage = createUsage(10000, 128000)
      render(<TokenBudgetBar usage={usage} showCost />)

      expect(screen.queryByText(/~\$/)).not.toBeInTheDocument()
    })
  })
})

describe('TokenBudgetIndicator', () => {
  const createUsage = (utilizationPercent: number): TokenUsage => ({
    current: 5000,
    max: 128000,
    available: 118904,
    utilizationPercent,
    exceededPercent: 0,
    status: utilizationPercent >= 100 ? 'exceeded' : 'safe',
    reservedForOutput: 4096,
    effectiveMax: 123904,
  })

  it('renders percentage correctly', () => {
    const usage = createUsage(45.5)
    render(<TokenBudgetIndicator usage={usage} />)

    expect(screen.getByText('46%')).toBeInTheDocument()
  })

  it('renders with correct status color', () => {
    const usage = { ...createUsage(100), status: 'exceeded' as const }
    const { container } = render(<TokenBudgetIndicator usage={usage} />)

    expect(container.querySelector('.bg-red-500')).toBeInTheDocument()
  })

  it('has accessible role and label', () => {
    const usage = createUsage(50)
    const { container } = render(<TokenBudgetIndicator usage={usage} />)

    const status = container.querySelector('[role="status"]')
    expect(status).toBeInTheDocument()
    expect(status).toHaveAttribute(
      'aria-label',
      'Token usage: 50% used, normal'
    )
  })

  it('reports warning status in aria-label', () => {
    const usage = { ...createUsage(85), status: 'warning' as const }
    const { container } = render(<TokenBudgetIndicator usage={usage} />)

    const status = container.querySelector('[role="status"]')
    expect(status).toHaveAttribute('aria-label', 'Token usage: 85% used, high')
  })

  it('supports custom aria label', () => {
    const usage = createUsage(50)
    const { container } = render(
      <TokenBudgetIndicator usage={usage} ariaLabel="Chat budget" />
    )

    const status = container.querySelector('[role="status"]')
    expect(status).toHaveAttribute(
      'aria-label',
      'Chat budget: 50% used, normal'
    )
  })

  it('applies custom className', () => {
    const usage = createUsage(50)
    const { container } = render(
      <TokenBudgetIndicator usage={usage} className="custom-class" />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
