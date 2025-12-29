/**
 * Feedback Animation Tests
 *
 * Tests for reduced-motion accessibility compliance (WCAG 2.3.3)
 * and proper component behavior.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import * as React from 'react'
import {
  FeedbackAnimation,
  SuccessCheckmark,
  ErrorShake,
  PulseAttention,
  RippleEffect,
  ConfettiEffect,
  GlowEffect,
  BounceIn,
  SlideNotification,
} from '../feedback-animation'

// Mock framer-motion to avoid animation complexity in tests
// Note: Using function components with ref prop (React 19 pattern)
vi.mock('framer-motion', () => ({
  motion: {
    div: function MockMotionDiv({
      children,
      className,
      animate,
      initial,
      ref,
      ...props
    }: React.HTMLAttributes<HTMLDivElement> & {
      animate?: object
      initial?: object
      ref?: React.Ref<HTMLDivElement>
    }) {
      return (
        <div
          ref={ref}
          className={className}
          data-motion="true"
          data-animate={JSON.stringify(animate)}
          data-initial={JSON.stringify(initial)}
          {...props}
        >
          {children}
        </div>
      )
    },
    p: function MockMotionP({
      children,
      className,
      ref,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement> & {
      ref?: React.Ref<HTMLParagraphElement>
    }) {
      return (
        <p ref={ref} className={className} {...props}>
          {children}
        </p>
      )
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

// Helper to get the first motion div (outer container)
const getMotionContainer = (container: HTMLElement) => {
  const motionDivs = container.querySelectorAll('[data-motion="true"]')
  return motionDivs[0] as HTMLElement
}

// Helper to check if any motion div exists
const hasMotionDiv = (container: HTMLElement) => {
  return container.querySelectorAll('[data-motion="true"]').length > 0
}

// Track the mock value for useReducedMotion
let mockReducedMotion = false

// Mock useReducedMotion hook
vi.mock('@clarity-chat/primitives', async () => {
  const actual = await vi.importActual('@clarity-chat/primitives')
  return {
    ...actual,
    useReducedMotion: () => mockReducedMotion,
  }
})

describe('FeedbackAnimation', () => {
  beforeEach(() => {
    mockReducedMotion = false
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders when show is true', () => {
      const { container } = render(
        <FeedbackAnimation type="success" show={true} />
      )
      expect(hasMotionDiv(container)).toBe(true)
    })

    it('does not render when show is false', () => {
      const { container } = render(
        <FeedbackAnimation type="success" show={false} />
      )
      expect(hasMotionDiv(container)).toBe(false)
    })

    it('renders message when provided', () => {
      render(
        <FeedbackAnimation type="success" show={true} message="Success!" />
      )
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })

    it('applies correct color classes for each type', () => {
      const { rerender, container } = render(
        <FeedbackAnimation type="success" show={true} />
      )
      expect(getMotionContainer(container)).toHaveClass('bg-success')

      rerender(<FeedbackAnimation type="error" show={true} />)
      expect(getMotionContainer(container)).toHaveClass('bg-destructive')

      rerender(<FeedbackAnimation type="warning" show={true} />)
      expect(getMotionContainer(container)).toHaveClass('bg-warning')

      rerender(<FeedbackAnimation type="info" show={true} />)
      expect(getMotionContainer(container)).toHaveClass('bg-info')
    })

    it('applies custom className', () => {
      const { container } = render(
        <FeedbackAnimation
          type="success"
          show={true}
          className="custom-class"
        />
      )
      expect(getMotionContainer(container)).toHaveClass('custom-class')
    })
  })

  describe('reduced motion accessibility', () => {
    it('uses opacity-only animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <FeedbackAnimation type="success" show={true} />
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      // Should only have opacity, no scale
      expect(initial).toEqual({ opacity: 0 })
      expect(animate).toEqual({ opacity: 1 })
    })

    it('uses full animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <FeedbackAnimation type="success" show={true} />
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      // Should have both opacity and scale
      expect(initial).toEqual({ opacity: 0, scale: 0.5 })
      expect(animate).toEqual({ opacity: 1, scale: 1 })
    })
  })

  describe('auto-hide behavior', () => {
    it('calls onComplete after duration', () => {
      const onComplete = vi.fn()
      render(
        <FeedbackAnimation
          type="success"
          show={true}
          duration={2000}
          onComplete={onComplete}
        />
      )

      expect(onComplete).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(2000)
      })

      expect(onComplete).toHaveBeenCalledTimes(1)
    })

    it('does not auto-hide when duration is 0', () => {
      const onComplete = vi.fn()
      render(
        <FeedbackAnimation
          type="success"
          show={true}
          duration={0}
          onComplete={onComplete}
        />
      )

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onComplete).not.toHaveBeenCalled()
    })

    it('clears timeout on unmount', () => {
      const onComplete = vi.fn()
      const { unmount } = render(
        <FeedbackAnimation
          type="success"
          show={true}
          duration={2000}
          onComplete={onComplete}
        />
      )

      unmount()

      act(() => {
        vi.advanceTimersByTime(3000)
      })

      expect(onComplete).not.toHaveBeenCalled()
    })
  })
})

describe('SuccessCheckmark', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders when show is true', () => {
    const { container } = render(<SuccessCheckmark show={true} />)
    expect(hasMotionDiv(container)).toBe(true)
  })

  it('does not render when show is false', () => {
    const { container } = render(<SuccessCheckmark show={false} />)
    expect(hasMotionDiv(container)).toBe(false)
  })

  describe('reduced motion accessibility', () => {
    it('uses opacity-only animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(<SuccessCheckmark show={true} />)

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(initial).toEqual({ opacity: 0 })
      expect(animate).toEqual({ opacity: 1 })
    })

    it('uses scale+rotate animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(<SuccessCheckmark show={true} />)

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(initial).toEqual({ scale: 0, rotate: -45 })
      expect(animate).toEqual({ scale: 1, rotate: 0 })
    })
  })
})

describe('ErrorShake', () => {
  beforeEach(() => {
    mockReducedMotion = false
    vi.clearAllMocks()
  })

  it('renders children', () => {
    render(
      <ErrorShake trigger={false}>
        <span data-testid="child">Content</span>
      </ErrorShake>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('does not apply shake animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <ErrorShake trigger={true}>
          <span>Content</span>
        </ErrorShake>
      )

      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      // Should be empty object (no shake)
      expect(animate).toEqual({})
    })

    it('applies shake animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <ErrorShake trigger={true}>
          <span>Content</span>
        </ErrorShake>
      )

      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      // Should have x animation for shake
      expect(animate).toHaveProperty('x')
      expect(animate.x).toEqual([-10, 10, -10, 10, -5, 5, 0])
    })
  })
})

describe('PulseAttention', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <PulseAttention active={false}>
        <span data-testid="child">Content</span>
      </PulseAttention>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('does not apply pulse animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <PulseAttention active={true}>
          <span>Content</span>
        </PulseAttention>
      )

      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(animate).toEqual({})
    })

    it('applies pulse animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <PulseAttention active={true}>
          <span>Content</span>
        </PulseAttention>
      )

      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(animate).toHaveProperty('scale')
      expect(animate).toHaveProperty('opacity')
    })
  })
})

describe('RippleEffect', () => {
  beforeEach(() => {
    mockReducedMotion = false
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('reduced motion accessibility', () => {
    it('uses opacity-only animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(<RippleEffect trigger={true} />)

      // Find all motion divs and get the ripple one
      const motionDivs = container.querySelectorAll('[data-motion="true"]')
      const rippleDiv = Array.from(motionDivs).find((div) =>
        div.classList.contains('rounded-full')
      )

      if (rippleDiv) {
        const initial = JSON.parse(
          rippleDiv.getAttribute('data-initial') || '{}'
        )
        const animate = JSON.parse(
          rippleDiv.getAttribute('data-animate') || '{}'
        )

        // Should only use opacity, no scale
        expect(initial).toEqual({ opacity: 0.6 })
        expect(animate).toEqual({ opacity: 0 })
      }
    })

    it('uses scale animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(<RippleEffect trigger={true} />)

      const motionDivs = container.querySelectorAll('[data-motion="true"]')
      const rippleDiv = Array.from(motionDivs).find((div) =>
        div.classList.contains('rounded-full')
      )

      if (rippleDiv) {
        const initial = JSON.parse(
          rippleDiv.getAttribute('data-initial') || '{}'
        )
        const animate = JSON.parse(
          rippleDiv.getAttribute('data-animate') || '{}'
        )

        expect(initial).toHaveProperty('scale', 0)
        expect(animate).toHaveProperty('scale', 2.5)
      }
    })
  })
})

describe('ConfettiEffect', () => {
  beforeEach(() => {
    mockReducedMotion = false
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('reduced motion accessibility', () => {
    it('does not render confetti when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(<ConfettiEffect trigger={true} count={20} />)

      // Should not render any particle divs
      const particles = container.querySelectorAll('.w-2.h-2.rounded-full')
      expect(particles.length).toBe(0)
    })

    it('renders confetti particles when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(<ConfettiEffect trigger={true} count={5} />)

      // Find particle motion divs
      const motionDivs = container.querySelectorAll('[data-motion="true"]')
      const particles = Array.from(motionDivs).filter((div) =>
        div.classList.contains('rounded-full')
      )

      expect(particles.length).toBeGreaterThan(0)
    })

    it('returns null entirely when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(<ConfettiEffect trigger={true} />)

      // Container should be empty (component returns null)
      expect(container.firstChild).toBeNull()
    })
  })
})

describe('GlowEffect', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders children', () => {
    render(
      <GlowEffect active={false}>
        <span data-testid="child">Content</span>
      </GlowEffect>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('does not apply glow animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <GlowEffect active={true}>
          <span>Content</span>
        </GlowEffect>
      )

      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(animate).toEqual({})
    })

    it('applies glow animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <GlowEffect active={true}>
          <span>Content</span>
        </GlowEffect>
      )

      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(animate).toHaveProperty('boxShadow')
    })
  })
})

describe('BounceIn', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders when show is true', () => {
    render(
      <BounceIn show={true}>
        <span data-testid="child">Content</span>
      </BounceIn>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('does not render when show is false', () => {
    render(
      <BounceIn show={false}>
        <span data-testid="child">Content</span>
      </BounceIn>
    )
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  describe('reduced motion accessibility', () => {
    it('uses opacity-only animation when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <BounceIn show={true}>
          <span>Content</span>
        </BounceIn>
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(initial).toEqual({ opacity: 0 })
      expect(animate).toEqual({ opacity: 1 })
    })

    it('uses bounce scale animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <BounceIn show={true}>
          <span>Content</span>
        </BounceIn>
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')

      expect(initial).toEqual({ scale: 0 })
      expect(animate).toHaveProperty('scale')
      // Bounce animation has multiple keyframes
      expect(animate.scale).toEqual([0, 1.2, 0.9, 1.05, 1])
    })
  })
})

describe('SlideNotification', () => {
  beforeEach(() => {
    mockReducedMotion = false
  })

  it('renders when show is true', () => {
    render(<SlideNotification show={true} message="Notification" />)
    expect(screen.getByText('Notification')).toBeInTheDocument()
  })

  it('does not render when show is false', () => {
    render(<SlideNotification show={false} message="Notification" />)
    expect(screen.queryByText('Notification')).not.toBeInTheDocument()
  })

  it('applies correct color classes for each type', () => {
    const { rerender, container } = render(
      <SlideNotification show={true} message="Test" type="success" />
    )
    expect(getMotionContainer(container)).toHaveClass('bg-success/10')

    rerender(<SlideNotification show={true} message="Test" type="error" />)
    expect(getMotionContainer(container)).toHaveClass('bg-destructive/10')

    rerender(<SlideNotification show={true} message="Test" type="warning" />)
    expect(getMotionContainer(container)).toHaveClass('bg-warning/10')

    rerender(<SlideNotification show={true} message="Test" type="info" />)
    expect(getMotionContainer(container)).toHaveClass('bg-info/10')
  })

  describe('reduced motion accessibility', () => {
    it('uses y=0 (no slide) when reduced motion is preferred', () => {
      mockReducedMotion = true
      const { container } = render(
        <SlideNotification show={true} message="Test" position="top" />
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')

      // Should have y: 0 (no slide movement)
      expect(initial.y).toBe(0)
    })

    it('uses slide animation when motion is allowed', () => {
      mockReducedMotion = false
      const { container } = render(
        <SlideNotification show={true} message="Test" position="top" />
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')

      // Should slide from top (negative y)
      expect(initial.y).toBe(-20)
    })

    it('respects position prop for slide direction', () => {
      mockReducedMotion = false
      const { container } = render(
        <SlideNotification show={true} message="Test" position="bottom" />
      )

      const motionDiv = getMotionContainer(container)
      const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}')

      // Should slide from bottom (positive y)
      expect(initial.y).toBe(20)
    })
  })
})

describe('Edge Cases', () => {
  beforeEach(() => {
    mockReducedMotion = false
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('rapid state changes', () => {
    it('FeedbackAnimation handles rapid show/hide toggling', () => {
      const { rerender } = render(
        <FeedbackAnimation type="success" show={true} />
      )

      rerender(<FeedbackAnimation type="success" show={false} />)
      rerender(<FeedbackAnimation type="success" show={true} />)
      rerender(<FeedbackAnimation type="success" show={false} />)
      rerender(<FeedbackAnimation type="success" show={true} />)

      // Component should handle rapid toggling without errors
      expect(true).toBe(true)
    })

    it('FeedbackAnimation handles type changes while visible', () => {
      const { rerender, container } = render(
        <FeedbackAnimation type="success" show={true} />
      )
      expect(getMotionContainer(container)).toHaveClass('bg-success')

      rerender(<FeedbackAnimation type="error" show={true} />)
      expect(getMotionContainer(container)).toHaveClass('bg-destructive')

      rerender(<FeedbackAnimation type="warning" show={true} />)
      expect(getMotionContainer(container)).toHaveClass('bg-warning')

      rerender(<FeedbackAnimation type="info" show={true} />)
      expect(getMotionContainer(container)).toHaveClass('bg-info')
    })

    it('SuccessCheckmark handles rapid show/hide', () => {
      const { rerender, container } = render(<SuccessCheckmark show={true} />)
      expect(hasMotionDiv(container)).toBe(true)

      rerender(<SuccessCheckmark show={false} />)
      rerender(<SuccessCheckmark show={true} />)
      rerender(<SuccessCheckmark show={false} />)

      expect(hasMotionDiv(container)).toBe(false)
    })

    it('ErrorShake handles rapid trigger changes', () => {
      const { rerender, container } = render(
        <ErrorShake trigger={true}>
          <span>Content</span>
        </ErrorShake>
      )

      rerender(
        <ErrorShake trigger={false}>
          <span>Content</span>
        </ErrorShake>
      )
      rerender(
        <ErrorShake trigger={true}>
          <span>Content</span>
        </ErrorShake>
      )

      // Should be shaking after final trigger=true
      const motionDiv = getMotionContainer(container)
      const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}')
      expect(animate).toHaveProperty('x')
    })
  })

  describe('callback handling', () => {
    it('FeedbackAnimation clears timeout when show changes before completion', () => {
      const onComplete = vi.fn()
      const { rerender } = render(
        <FeedbackAnimation
          type="success"
          show={true}
          duration={3000}
          onComplete={onComplete}
        />
      )

      // Advance partially
      vi.advanceTimersByTime(1000)

      // Hide before timeout
      rerender(
        <FeedbackAnimation
          type="success"
          show={false}
          duration={3000}
          onComplete={onComplete}
        />
      )

      // Advance past original timeout
      vi.advanceTimersByTime(3000)

      // Callback should not have been called
      expect(onComplete).not.toHaveBeenCalled()
    })

    it('FeedbackAnimation calls onComplete after duration', () => {
      const onComplete = vi.fn()
      render(
        <FeedbackAnimation
          type="success"
          show={true}
          duration={2000}
          onComplete={onComplete}
        />
      )

      vi.advanceTimersByTime(2000)
      expect(onComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('unmount behavior', () => {
    it('FeedbackAnimation unmounts cleanly during animation', () => {
      const { unmount, container } = render(
        <FeedbackAnimation type="success" show={true} />
      )

      expect(hasMotionDiv(container)).toBe(true)
      unmount()
      // Should not throw
    })

    it('ConfettiEffect unmounts cleanly when particles are rendering', () => {
      mockReducedMotion = false
      const { unmount, container } = render(
        <ConfettiEffect trigger={true} count={10} />
      )

      expect(container).toBeInTheDocument()
      unmount()
      // Should not throw
    })

    it('RippleEffect unmounts cleanly during ripple', () => {
      const { unmount, container } = render(<RippleEffect trigger={true} />)

      expect(container).toBeInTheDocument()
      unmount()
      // Should not throw
    })
  })

  describe('empty message handling', () => {
    it('FeedbackAnimation renders without message', () => {
      const { container } = render(
        <FeedbackAnimation type="success" show={true} />
      )
      expect(hasMotionDiv(container)).toBe(true)
    })

    it('FeedbackAnimation handles empty string message', () => {
      const { container } = render(
        <FeedbackAnimation type="success" show={true} message="" />
      )
      // Should render the component without crashing
      expect(hasMotionDiv(container)).toBe(true)
    })

    it('SlideNotification renders with empty message', () => {
      render(<SlideNotification show={true} message="" />)
      // Should render but with empty message
      expect(true).toBe(true)
    })
  })

  describe('children handling', () => {
    it('ErrorShake renders null children', () => {
      const { container } = render(
        <ErrorShake trigger={true}>{null}</ErrorShake>
      )
      expect(container).toBeInTheDocument()
    })

    it('PulseAttention renders undefined children', () => {
      const { container } = render(
        <PulseAttention active={true}>{undefined}</PulseAttention>
      )
      expect(container).toBeInTheDocument()
    })

    it('GlowEffect renders with multiple children', () => {
      render(
        <GlowEffect active={true}>
          <span data-testid="child-1">Child 1</span>
          <span data-testid="child-2">Child 2</span>
        </GlowEffect>
      )

      expect(screen.getByTestId('child-1')).toBeInTheDocument()
      expect(screen.getByTestId('child-2')).toBeInTheDocument()
    })

    it('BounceIn renders nested elements correctly', () => {
      render(
        <BounceIn show={true}>
          <div data-testid="outer">
            <div data-testid="inner">
              <span data-testid="deep">Deeply nested</span>
            </div>
          </div>
        </BounceIn>
      )

      expect(screen.getByTestId('outer')).toBeInTheDocument()
      expect(screen.getByTestId('inner')).toBeInTheDocument()
      expect(screen.getByTestId('deep')).toBeInTheDocument()
    })
  })
})
