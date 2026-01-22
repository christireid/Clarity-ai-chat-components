/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import {
  TokenBudgetBar,
  useTokenBudget,
} from '../../components/token-budget-bar'

describe('TokenBudgetBar', () => {
  describe('rendering', () => {
    it('renders with basic props', () => {
      render(<TokenBudgetBar current={500} max={1000} />)

      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('displays label when showLabels is true', () => {
      render(
        <TokenBudgetBar
          current={500}
          max={1000}
          showLabels
          label="Token usage"
        />
      )

      expect(screen.getByText('Token usage')).toBeInTheDocument()
    })

    it('displays formatted numbers', () => {
      render(<TokenBudgetBar current={3500} max={4000} showLabels />)

      expect(screen.getByText(/3,500/)).toBeInTheDocument()
      expect(screen.getByText(/4,000/)).toBeInTheDocument()
    })

    it('displays percentage when showPercentage is true', () => {
      render(
        <TokenBudgetBar current={500} max={1000} showLabels showPercentage />
      )

      // Multiple elements contain 50% (label and status), so use getAllByText
      const percentElements = screen.getAllByText(/(50%)/)
      expect(percentElements.length).toBeGreaterThan(0)
    })

    it('hides labels when showLabels is false', () => {
      render(
        <TokenBudgetBar
          current={500}
          max={1000}
          showLabels={false}
          label="Token usage"
        />
      )

      expect(screen.queryByText('Token usage')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<TokenBudgetBar current={500} max={1000} label="Token usage" />)

      const progressbar = screen.getByRole('progressbar')

      expect(progressbar).toHaveAttribute('aria-valuenow', '500')
      expect(progressbar).toHaveAttribute('aria-valuemin', '0')
      expect(progressbar).toHaveAttribute('aria-valuemax', '1000')
      expect(progressbar).toHaveAttribute('aria-valuetext')
    })

    it('is focusable for keyboard users', () => {
      render(<TokenBudgetBar current={500} max={1000} />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('tabIndex', '0')
    })

    it('has screen reader status announcement', () => {
      render(<TokenBudgetBar current={500} max={1000} />)

      const status = screen.getByRole('status')
      expect(status).toBeInTheDocument()
      expect(status).toHaveAttribute('aria-live', 'polite')
    })

    it('provides appropriate status message for safe usage', () => {
      render(<TokenBudgetBar current={500} max={1000} />)

      expect(screen.getByText(/Token usage at 50%/)).toBeInTheDocument()
    })

    it('provides appropriate status message for warning', () => {
      render(<TokenBudgetBar current={750} max={1000} warningThreshold={70} />)

      expect(screen.getByText(/Token usage warning at 75%/)).toBeInTheDocument()
    })

    it('provides appropriate status message for critical', () => {
      render(<TokenBudgetBar current={950} max={1000} criticalThreshold={90} />)

      expect(
        screen.getByText(/Token usage critical at 95%/)
      ).toBeInTheDocument()
    })

    it('provides appropriate status message for exceeded', () => {
      render(<TokenBudgetBar current={1100} max={1000} />)

      expect(
        screen.getByText(/Token budget exceeded at 110%/)
      ).toBeInTheDocument()
    })
  })

  describe('status transitions', () => {
    it('calls onStatusChange when status changes', () => {
      const onStatusChange = vi.fn()
      const { rerender } = render(
        <TokenBudgetBar
          current={500}
          max={1000}
          onStatusChange={onStatusChange}
        />
      )

      // First render doesn't trigger callback (no previous status)
      expect(onStatusChange).not.toHaveBeenCalled()

      // Rerender with warning level
      rerender(
        <TokenBudgetBar
          current={750}
          max={1000}
          onStatusChange={onStatusChange}
          warningThreshold={70}
        />
      )

      expect(onStatusChange).toHaveBeenCalledWith('warning', 75)
    })
  })

  describe('thresholds', () => {
    it('uses custom warning threshold', () => {
      render(
        <TokenBudgetBar
          current={600}
          max={1000}
          warningThreshold={50}
          criticalThreshold={90}
        />
      )

      expect(screen.getByText(/warning/)).toBeInTheDocument()
    })

    it('uses custom critical threshold', () => {
      render(
        <TokenBudgetBar
          current={850}
          max={1000}
          warningThreshold={70}
          criticalThreshold={80}
        />
      )

      expect(screen.getByText(/critical/)).toBeInTheDocument()
    })
  })

  describe('styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <TokenBudgetBar current={500} max={1000} className="custom-class" />
      )

      expect(container.querySelector('.custom-class')).toBeInTheDocument()
    })

    it('applies custom height', () => {
      render(<TokenBudgetBar current={500} max={1000} height={32} />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveStyle({ height: '32px' })
    })
  })

  describe('edge cases', () => {
    it('handles zero max', () => {
      render(<TokenBudgetBar current={0} max={0} />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('aria-valuenow', '0')
    })

    it('handles negative current', () => {
      render(<TokenBudgetBar current={-100} max={1000} />)

      const progressbar = screen.getByRole('progressbar')
      expect(progressbar).toHaveAttribute('aria-valuenow', '-100')
    })

    it('handles current exceeding max', () => {
      render(<TokenBudgetBar current={1500} max={1000} />)

      expect(screen.getByText(/exceeded/)).toBeInTheDocument()
    })
  })
})

describe('useTokenBudget', () => {
  const defaultConfig = {
    maxTokens: 1000,
    initialTokens: 0,
    warningThreshold: 70,
    criticalThreshold: 90,
  }

  describe('initialization', () => {
    it('initializes with default values', () => {
      const { result } = renderHook(() => useTokenBudget(defaultConfig))

      expect(result.current.current).toBe(0)
      expect(result.current.max).toBe(1000)
      expect(result.current.status).toBe('safe')
      expect(result.current.percentage).toBe(0)
    })

    it('initializes with custom initial tokens', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 500 })
      )

      expect(result.current.current).toBe(500)
      expect(result.current.percentage).toBe(50)
    })
  })

  describe('addTokens', () => {
    it('adds tokens to current count', () => {
      const { result } = renderHook(() => useTokenBudget(defaultConfig))

      act(() => {
        result.current.addTokens(100)
      })

      expect(result.current.current).toBe(100)
    })

    it('allows exceeding max', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 900 })
      )

      act(() => {
        result.current.addTokens(200)
      })

      expect(result.current.current).toBe(1100)
      expect(result.current.status).toBe('exceeded')
    })
  })

  describe('subtractTokens', () => {
    it('subtracts tokens from current count', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 500 })
      )

      act(() => {
        result.current.subtractTokens(100)
      })

      expect(result.current.current).toBe(400)
    })

    it('does not go below zero', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 50 })
      )

      act(() => {
        result.current.subtractTokens(100)
      })

      expect(result.current.current).toBe(0)
    })
  })

  describe('setTokens', () => {
    it('sets tokens to specific value', () => {
      const { result } = renderHook(() => useTokenBudget(defaultConfig))

      act(() => {
        result.current.setTokens(500)
      })

      expect(result.current.current).toBe(500)
    })

    it('does not go below zero', () => {
      const { result } = renderHook(() => useTokenBudget(defaultConfig))

      act(() => {
        result.current.setTokens(-100)
      })

      expect(result.current.current).toBe(0)
    })
  })

  describe('resetBudget', () => {
    it('resets to initial value', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 100 })
      )

      act(() => {
        result.current.addTokens(500)
      })

      expect(result.current.current).toBe(600)

      act(() => {
        result.current.resetBudget()
      })

      expect(result.current.current).toBe(100)
    })
  })

  describe('wouldExceed', () => {
    it('returns true if adding would exceed', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 900 })
      )

      expect(result.current.wouldExceed(200)).toBe(true)
    })

    it('returns false if adding would not exceed', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 500 })
      )

      expect(result.current.wouldExceed(200)).toBe(false)
    })
  })

  describe('remaining', () => {
    it('calculates remaining tokens', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 300 })
      )

      expect(result.current.remaining).toBe(700)
    })

    it('returns zero when exceeded', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 1200 })
      )

      expect(result.current.remaining).toBe(0)
    })
  })

  describe('status calculation', () => {
    it('returns safe for low usage', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 500 })
      )

      expect(result.current.status).toBe('safe')
    })

    it('returns warning when threshold reached', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 750 })
      )

      expect(result.current.status).toBe('warning')
    })

    it('returns critical when threshold reached', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 950 })
      )

      expect(result.current.status).toBe('critical')
    })

    it('returns exceeded when over max', () => {
      const { result } = renderHook(() =>
        useTokenBudget({ ...defaultConfig, initialTokens: 1100 })
      )

      expect(result.current.status).toBe('exceeded')
    })
  })
})
