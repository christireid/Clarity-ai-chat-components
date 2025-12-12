/**
 * Tests for RetryCountdown component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { RetryCountdown } from '../../src/components/RetryCountdown'

// Mock matchMedia for reduced motion detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('RetryCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should display countdown seconds', () => {
    render(<RetryCountdown remainingMs={5000} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should countdown over time', () => {
    render(<RetryCountdown remainingMs={3000} />)

    expect(screen.getByText('3')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('2')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should call onComplete when countdown finishes', () => {
    const onComplete = vi.fn()
    render(<RetryCountdown remainingMs={2000} onComplete={onComplete} />)

    act(() => {
      vi.advanceTimersByTime(2100)
    })

    expect(onComplete).toHaveBeenCalled()
  })

  it('should call onRetryNow when button clicked', () => {
    const onRetryNow = vi.fn()
    render(<RetryCountdown remainingMs={5000} onRetryNow={onRetryNow} />)

    const button = screen.getByText('Retry now')
    fireEvent.click(button)

    expect(onRetryNow).toHaveBeenCalled()
  })

  it('should hide retry button when countdown at 0', () => {
    const onRetryNow = vi.fn()
    render(<RetryCountdown remainingMs={100} onRetryNow={onRetryNow} />)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(screen.queryByText('Retry now')).not.toBeInTheDocument()
  })

  it('should show progress ring when showProgress is true', () => {
    const { container } = render(
      <RetryCountdown remainingMs={5000} showProgress={true} />
    )

    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should show text only when showProgress is false', () => {
    const { container } = render(
      <RetryCountdown remainingMs={5000} showProgress={false} />
    )

    expect(container.querySelector('svg')).not.toBeInTheDocument()
    expect(screen.getByText(/Retrying in 5/)).toBeInTheDocument()
  })

  it('should apply different sizes', () => {
    const { container: sm } = render(
      <RetryCountdown remainingMs={5000} size="sm" />
    )
    const { container: lg } = render(
      <RetryCountdown remainingMs={5000} size="lg" />
    )

    // Check SVG dimensions differ
    const smSvg = sm.querySelector('svg')
    const lgSvg = lg.querySelector('svg')

    expect(smSvg?.getAttribute('width')).not.toBe(lgSvg?.getAttribute('width'))
  })

  it('should have accessible timer role', () => {
    render(<RetryCountdown remainingMs={5000} />)

    expect(screen.getByRole('timer')).toBeInTheDocument()
  })

  it('should update aria-label as countdown progresses', () => {
    render(<RetryCountdown remainingMs={5000} />)

    const timer = screen.getByRole('timer')
    expect(timer).toHaveAttribute('aria-label', expect.stringContaining('5'))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(timer).toHaveAttribute('aria-label', expect.stringContaining('4'))
  })

  it('should reset countdown when remainingMs changes', () => {
    const { rerender } = render(<RetryCountdown remainingMs={3000} />)

    expect(screen.getByText('3')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('2')).toBeInTheDocument()

    // Reset with new time
    rerender(<RetryCountdown remainingMs={5000} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should show scheduled message during countdown', () => {
    render(<RetryCountdown remainingMs={5000} />)

    expect(screen.getByText('Automatic retry scheduled')).toBeInTheDocument()
  })

  it('should show retrying message when countdown at 0', () => {
    render(<RetryCountdown remainingMs={100} />)

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(screen.getByText('Retrying now...')).toBeInTheDocument()
  })
})
