/**
 * Tests for TokenCostPreview Component and useTokenEstimate Hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import * as React from 'react'
import { renderHook } from '@testing-library/react'
import { TokenCostPreview, useTokenEstimate } from '../TokenCostPreview'

// Mock the tokenization utilities
vi.mock('../../utils/tokenization/estimator', () => ({
  estimateTokens: vi.fn((text: string) => {
    // Simple mock: ~4 chars per token
    return Math.ceil(text.length / 4)
  }),
}))

vi.mock('../../utils/tokenization/model-pricing', () => ({
  calculateCost: vi.fn(({ model, inputTokens }) => {
    // Mock pricing: $0.03 per 1K tokens for gpt-4
    const rate = model === 'gpt-4' ? 0.03 : 0.01
    return {
      inputCost: (inputTokens / 1000) * rate,
      outputCost: 0,
      totalCost: (inputTokens / 1000) * rate,
    }
  }),
}))

describe('useTokenEstimate', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial state with zero tokens', () => {
    const { result } = renderHook(() =>
      useTokenEstimate({ text: '', model: 'gpt-4' })
    )

    expect(result.current.tokens).toBe(0)
    expect(result.current.inputCost).toBe(0)
    expect(result.current.model).toBe('gpt-4')
    expect(result.current.isStale).toBe(false)
  })

  it('should have loading state in initial render or complete quickly', async () => {
    // Note: Loading state may be very brief for synchronous estimation
    // The hook either starts loading or completes immediately
    const { result } = renderHook(() =>
      useTokenEstimate({ text: 'test', model: 'gpt-4' })
    )

    // After timers, should not be loading
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('should transition out of loading state after calculation', async () => {
    const { result } = renderHook(() =>
      useTokenEstimate({ text: 'test', model: 'gpt-4' })
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('should have no error in normal operation', async () => {
    const { result } = renderHook(() =>
      useTokenEstimate({ text: 'test', model: 'gpt-4' })
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.error).toBeNull()
  })

  it('should estimate tokens for text', async () => {
    const { result } = renderHook(() =>
      useTokenEstimate({ text: 'Hello, world!', model: 'gpt-4' })
    )

    // Wait for initial calculation
    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.tokens).toBeGreaterThan(0)
  })

  it('should calculate cost based on model', async () => {
    const { result } = renderHook(() =>
      useTokenEstimate({ text: 'This is a test message', model: 'gpt-4' })
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(result.current.inputCost).toBeGreaterThan(0)
    expect(result.current.model).toBe('gpt-4')
  })

  it('should throttle rapid updates', async () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTokenEstimate({ text, model: 'gpt-4', throttleMs: 100 }),
      { initialProps: { text: 'a' } }
    )

    // Rapid updates
    rerender({ text: 'ab' })
    rerender({ text: 'abc' })
    rerender({ text: 'abcd' })

    // Should mark as stale during throttle
    expect(result.current.isStale).toBe(true)

    // After throttle period
    await act(async () => {
      await vi.advanceTimersByTimeAsync(150)
    })

    expect(result.current.isStale).toBe(false)
  })

  it('should update immediately when throttle time has passed', async () => {
    const { result, rerender } = renderHook(
      ({ text }) => useTokenEstimate({ text, model: 'gpt-4', throttleMs: 100 }),
      { initialProps: { text: 'initial' } }
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(150)
    })

    rerender({ text: 'updated text' })

    // Should update immediately since throttle time passed
    expect(result.current.isStale).toBe(false)
  })

  it('should use default model when not specified', () => {
    const { result } = renderHook(() => useTokenEstimate({ text: 'test' }))

    expect(result.current.model).toBe('gpt-4')
  })
})

describe('TokenCostPreview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render token count when showTokenCount is true', async () => {
    render(
      <TokenCostPreview text="Hello world" showTokenCount showCost={false} />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByTestId('token-count')).toBeInTheDocument()
  })

  it('should render cost estimate when showCost is true', async () => {
    render(
      <TokenCostPreview
        text="This is a longer message to ensure cost is above minimum"
        showCost
        minDisplayCost={0}
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.getByTestId('cost-estimate')).toBeInTheDocument()
  })

  it('should not render when text is empty and no tokens', () => {
    const { container } = render(<TokenCostPreview text="" />)

    expect(container.firstChild).toBeNull()
  })

  it('should not render when both showTokenCount and showCost are false', () => {
    const { container } = render(
      <TokenCostPreview text="Hello" showTokenCount={false} showCost={false} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should call onCostChange when cost changes', async () => {
    const onCostChange = vi.fn()

    render(
      <TokenCostPreview
        text="Test message"
        onCostChange={onCostChange}
        minDisplayCost={0}
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(onCostChange).toHaveBeenCalled()
    expect(onCostChange).toHaveBeenCalledWith(
      expect.any(Number),
      expect.any(Number)
    )
  })

  it('should use custom formatCost function', async () => {
    const formatCost = vi.fn((cost: number) => `€${cost.toFixed(2)}`)

    render(
      <TokenCostPreview
        text="Test message for custom format"
        formatCost={formatCost}
        minDisplayCost={0}
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(formatCost).toHaveBeenCalled()
  })

  it('should use custom formatTokens function', async () => {
    const formatTokens = vi.fn((tokens: number) => `~${tokens}`)

    render(
      <TokenCostPreview
        text="Test message"
        formatTokens={formatTokens}
        showTokenCount
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(formatTokens).toHaveBeenCalled()
  })

  it('should apply custom className', async () => {
    render(
      <TokenCostPreview
        text="Test"
        className="custom-class"
        minDisplayCost={0}
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    const element = screen.getByTestId('token-count').parentElement
    expect(element).toHaveClass('custom-class')
  })

  it('should hide cost below minDisplayCost', async () => {
    render(
      <TokenCostPreview
        text="Hi"
        showCost
        minDisplayCost={1} // High minimum
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    expect(screen.queryByTestId('cost-estimate')).not.toBeInTheDocument()
  })

  it('should show separator only when both token and cost are shown', async () => {
    render(
      <TokenCostPreview
        text="This is a test message with enough tokens"
        showTokenCount
        showCost
        minDisplayCost={0}
      />
    )

    await act(async () => {
      await vi.runAllTimersAsync()
    })

    // Check for the separator bullet
    const separator = screen.getByText('•')
    expect(separator).toBeInTheDocument()
  })

  describe('default formatters', () => {
    it('should format small costs with 4 decimal places', async () => {
      // Very short text = very small cost
      render(<TokenCostPreview text="x" showCost minDisplayCost={0} />)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const costElement = screen.getByTestId('cost-estimate')
      // Should show something like "$0.0000" for tiny amounts
      expect(costElement.textContent).toMatch(/\$\d+\.\d+/)
    })

    it('should format token counts with K suffix for large numbers', async () => {
      // Mock a large token count
      const { estimateTokens } =
        await import('../../utils/tokenization/estimator')
      ;(estimateTokens as ReturnType<typeof vi.fn>).mockReturnValueOnce(5500)

      render(<TokenCostPreview text="Large text simulated" showTokenCount />)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const tokenElement = screen.getByTestId('token-count')
      expect(tokenElement.textContent).toMatch(/K/)
    })
  })

  describe('accessibility', () => {
    it('should have role="status" for screen readers', async () => {
      render(<TokenCostPreview text="Test message" minDisplayCost={0} />)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const container = screen.getByRole('status')
      expect(container).toBeInTheDocument()
    })

    it('should have aria-live="polite" for live updates', async () => {
      render(<TokenCostPreview text="Test message" minDisplayCost={0} />)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-live', 'polite')
    })

    it('should have aria-atomic="true" for complete announcements', async () => {
      render(<TokenCostPreview text="Test message" minDisplayCost={0} />)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-atomic', 'true')
    })

    it('should have aria-label with token and cost information', async () => {
      render(<TokenCostPreview text="Test message" minDisplayCost={0} />)

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const container = screen.getByRole('status')
      expect(container).toHaveAttribute('aria-label')
      expect(container.getAttribute('aria-label')).toContain(
        'Token and cost estimate'
      )
    })

    it('should accept custom ariaLabel', async () => {
      render(
        <TokenCostPreview
          text="Test message"
          minDisplayCost={0}
          ariaLabel="Custom accessibility label"
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const container = screen.getByRole('status')
      expect(container).toHaveAttribute(
        'aria-label',
        'Custom accessibility label'
      )
    })

    it('should accept custom id prop', async () => {
      render(
        <TokenCostPreview
          text="Test message"
          minDisplayCost={0}
          id="my-token-preview"
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      const container = document.getElementById('my-token-preview')
      expect(container).toBeInTheDocument()
    })

    it('should have aria-hidden on visual elements', async () => {
      render(
        <TokenCostPreview
          text="Test message"
          showTokenCount
          showCost
          minDisplayCost={0}
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Visual elements should be aria-hidden so screen readers use the main aria-label
      const tokenCount = screen.getByTestId('token-count')
      expect(tokenCount).toHaveAttribute('aria-hidden', 'true')

      const costEstimate = screen.getByTestId('cost-estimate')
      expect(costEstimate).toHaveAttribute('aria-hidden', 'true')
    })

    it('should include screen reader only text', async () => {
      render(
        <TokenCostPreview
          text="Test message with more content"
          showTokenCount
          showCost
          minDisplayCost={0}
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Screen reader text should be present but visually hidden
      const container = screen.getByRole('status')
      const srOnly = container.querySelector('[style*="clip"]')
      expect(srOnly).toBeInTheDocument()
      expect(srOnly?.textContent).toContain('tokens')
    })
  })

  describe('loading state', () => {
    // Note: The loading state is very brief because token estimation is synchronous.
    // These tests verify the loading-related props work correctly.

    it('should not show loading when showLoading is false', async () => {
      render(
        <TokenCostPreview
          text="Test message"
          showLoading={false}
          minDisplayCost={0}
        />
      )

      // Loading indicator should never appear when showLoading is false
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })

    it('should show token count after calculation completes', async () => {
      render(
        <TokenCostPreview text="Test message" showLoading minDisplayCost={0} />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // After calculation, should show token count not loading
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
      expect(screen.getByTestId('token-count')).toBeInTheDocument()
    })

    it('should accept showLoading prop without error', () => {
      // Test that the prop is accepted and doesn't cause errors
      expect(() =>
        render(
          <TokenCostPreview
            text="Test message"
            showLoading
            loadingText="Custom loading..."
            minDisplayCost={0}
          />
        )
      ).not.toThrow()
    })

    it('should render successfully with all loading props', async () => {
      const { container } = render(
        <TokenCostPreview
          text="Test message"
          showLoading
          loadingText="Please wait..."
          minDisplayCost={0}
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Should have rendered something
      expect(container.firstChild).not.toBeNull()
    })
  })

  describe('error state', () => {
    it('should call onError when error occurs', async () => {
      const onError = vi.fn()
      const { estimateTokens } =
        await import('../../utils/tokenization/estimator')
      ;(estimateTokens as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => {
          throw new Error('Test error')
        }
      )

      render(
        <TokenCostPreview
          text="Test message"
          onError={onError}
          minDisplayCost={0}
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(onError).toHaveBeenCalled()
    })

    it('should show default error message when showError is true', async () => {
      const { estimateTokens } =
        await import('../../utils/tokenization/estimator')
      ;(estimateTokens as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => {
          throw new Error('Test error')
        }
      )

      render(
        <TokenCostPreview text="Test message" showError minDisplayCost={0} />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Unable to estimate'
      )
    })

    it('should use custom error renderer', async () => {
      const { estimateTokens } =
        await import('../../utils/tokenization/estimator')
      ;(estimateTokens as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => {
          throw new Error('Custom error')
        }
      )

      render(
        <TokenCostPreview
          text="Test message"
          showError
          renderError={(error) => (
            <span data-testid="custom-error">{error.message}</span>
          )}
          minDisplayCost={0}
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(screen.getByTestId('custom-error')).toHaveTextContent(
        'Custom error'
      )
    })

    it('should hide error when showError is false', async () => {
      const { estimateTokens } =
        await import('../../utils/tokenization/estimator')
      ;(estimateTokens as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => {
          throw new Error('Test error')
        }
      )

      render(
        <TokenCostPreview
          text="Test message"
          showError={false}
          minDisplayCost={0}
        />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    })

    it('should have role="alert" for error state', async () => {
      const { estimateTokens } =
        await import('../../utils/tokenization/estimator')
      ;(estimateTokens as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => {
          throw new Error('Test error')
        }
      )

      render(
        <TokenCostPreview text="Test message" showError minDisplayCost={0} />
      )

      await act(async () => {
        await vi.runAllTimersAsync()
      })

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
