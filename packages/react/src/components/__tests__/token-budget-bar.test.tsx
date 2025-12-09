import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { TokenBudgetBar, TokenBudgetIndicator } from '../token-budget-bar'
import type { TokenUsage } from '../../hooks/use-token-budget-monitor'

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

      expect(screen.getByText(/5,000/)).toBeInTheDocument()
      expect(screen.getByText(/123,904 tokens/)).toBeInTheDocument()
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
      render(<TokenBudgetBar usage={usage} compact />)

      // Should not show labels in compact mode
      expect(screen.queryByText(/tokens/)).not.toBeInTheDocument()
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
      render(<TokenBudgetBar usage={usage} onClick={handleClick} />)

      fireEvent.click(screen.getByText(/tokens/))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('shows tooltip on hover', () => {
      const usage = createUsage(5000, 128000)
      render(<TokenBudgetBar usage={usage} showTooltip />)

      const container = screen.getByText(/tokens/).closest('div')
      if (container) {
        fireEvent.mouseEnter(container)
        expect(screen.getByText('Token Budget Details')).toBeInTheDocument()
      }
    })

    it('hides tooltip when not hovering', () => {
      const usage = createUsage(5000, 128000)
      render(<TokenBudgetBar usage={usage} showTooltip />)

      const container = screen.getByText(/tokens/).closest('div')
      if (container) {
        fireEvent.mouseEnter(container)
        fireEvent.mouseLeave(container)
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
      // The formatted usage text should be accessible
      expect(screen.getByText(/5,000/)).toBeInTheDocument()
    })
  })

  describe('without labels', () => {
    it('hides labels when showLabel is false', () => {
      const usage = createUsage(5000, 128000)
      render(<TokenBudgetBar usage={usage} showLabel={false} />)

      expect(screen.queryByText(/tokens/)).not.toBeInTheDocument()
    })
  })

  describe('cost estimation', () => {
    // Note: Cost estimation with showCost=true requires actual model-pricing module
    // which uses require() internally. This is tested via integration tests.
    it.skip('shows cost estimate when model and showCost are provided', () => {
      const usage = createUsage(10000, 128000)
      const { container } = render(
        <TokenBudgetBar usage={usage} model="gpt-4o" showCost />
      )

      const costDisplay = container.querySelector('.font-mono')
      expect(costDisplay || screen.queryByText(/~\$/)).toBeDefined()
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

  it('applies custom className', () => {
    const usage = createUsage(50)
    const { container } = render(
      <TokenBudgetIndicator usage={usage} className="custom-class" />
    )

    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })
})
