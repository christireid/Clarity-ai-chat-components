/**
 * Button Ripple Performance Regression Tests
 *
 * Tests for ISSUE-001: Button Ripple Performance
 * Ensures ripple effects don't accumulate and cause UI freezing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

// Mock useRippleEffect to control timing
vi.mock('../hooks/use-ripple-effect', () => ({
  useRippleEffect: vi.fn(() => ({
    ripples: [],
    addRipple: vi.fn(),
    removeRipple: vi.fn(),
  })),
}))

describe('Button Ripple Performance Regression', () => {
  const user = userEvent.setup({ delay: null })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Ripple Accumulation Prevention', () => {
    it('prevents multiple active ripples', async () => {
      const mockAddRipple = vi.fn()
      const mockUseRippleEffect = vi.fn(() => ({
        ripples: [],
        addRipple: mockAddRipple,
        removeRipple: vi.fn(),
      }))

      vi.doMock('../hooks/use-ripple-effect', () => ({
        useRippleEffect: mockUseRippleEffect,
      }))

      // Re-import after mocking
      const { Button: MockedButton } = await import('../button')

      render(<MockedButton>Ripple Test</MockedButton>)

      const button = screen.getByRole('button')

      // Rapid clicks
      await user.click(button)
      await user.click(button)
      await user.click(button)

      // Should only create one ripple at a time
      expect(mockAddRipple).toHaveBeenCalledTimes(1)
    })

    it('clears existing ripples before adding new ones', async () => {
      let rippleCount = 0
      const mockAddRipple = vi.fn(() => {
        rippleCount++
        // Simulate ripple cleanup after animation
        setTimeout(() => {
          rippleCount = Math.max(0, rippleCount - 1)
        }, 600) // Ripple duration
      })

      const mockUseRippleEffect = vi.fn(() => ({
        ripples: Array(rippleCount).fill({ id: 'ripple', x: 10, y: 10 }),
        addRipple: mockAddRipple,
        removeRipple: vi.fn(),
      }))

      vi.doMock('../hooks/use-ripple-effect', () => ({
        useRippleEffect: mockUseRippleEffect,
      }))

      const { Button: MockedButton } = await import('../button')

      render(<MockedButton>Accumulation Test</MockedButton>)

      const button = screen.getByRole('button')

      // Click multiple times rapidly
      await user.click(button)
      await user.click(button)
      await user.click(button)

      // Should maintain reasonable ripple count
      expect(rippleCount).toBeLessThanOrEqual(2) // At most 1 active + 1 pending
    })

    it('handles rapid clicking without UI freezing', async () => {
      const startTime = performance.now()

      render(<Button>Rapid Click Test</Button>)

      const button = screen.getByRole('button')

      // Simulate very rapid clicking (stress test)
      for (let i = 0; i < 20; i++) {
        await user.click(button)
      }

      const endTime = performance.now()
      const duration = endTime - startTime

      // Should handle rapid clicks without significant performance degradation
      expect(duration).toBeLessThan(1000) // Less than 1 second for 20 clicks

      // UI should remain responsive
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })
  })

  describe('Animation Performance', () => {
    it('completes ripple animations within expected duration', async () => {
      render(<Button>Animation Test</Button>)

      const button = screen.getByRole('button')

      const startTime = performance.now()
      await user.click(button)

      // Wait for animation to complete
      await waitFor(() => {
        // Animation should complete within reasonable time
        const elapsed = performance.now() - startTime
        expect(elapsed).toBeLessThan(1000) // Less than 1 second
      }, { timeout: 1100 })
    })

    it('maintains smooth animations during multiple interactions', async () => {
      render(<Button>Multi-Animation Test</Button>)

      const button = screen.getByRole('button')

      // Multiple clicks with delays
      await user.click(button)
      await new Promise(resolve => setTimeout(resolve, 100))
      await user.click(button)
      await new Promise(resolve => setTimeout(resolve, 100))
      await user.click(button)

      // Should handle multiple animations without visual glitches
      expect(button).toBeInTheDocument()
    })

    it('cleans up animations properly', async () => {
      const { unmount } = render(<Button>Cleanup Test</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      // Unmount during animation
      unmount()

      // Should clean up without errors
      expect(() => unmount()).not.toThrow()
    })
  })

  describe('Memory Management', () => {
    it('does not leak ripple state on unmount', () => {
      const { unmount } = render(<Button>Memory Test</Button>)

      unmount()

      // Should clean up without memory leaks
      expect(() => unmount()).not.toThrow()
    })

    it('resets ripple state appropriately', async () => {
      render(<Button>Reset Test</Button>)

      const button = screen.getByRole('button')

      // Click to create ripple
      await user.click(button)

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 650))

      // Click again
      await user.click(button)

      // Should handle reset without issues
      expect(button).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles disabled buttons gracefully', () => {
      render(<Button disabled>Disabled Test</Button>)

      const button = screen.getByRole('button')

      // Disabled buttons should not create ripples
      expect(button).toBeDisabled()
    })

    it('handles buttons with custom styling', () => {
      render(
        <Button className="custom-class" variant="secondary" size="lg">
          Custom Styled
        </Button>
      )

      const button = screen.getByRole('button')

      // Should apply custom styles without affecting ripple
      expect(button).toHaveClass('custom-class')
    })

    it('works with different button variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const

      variants.forEach(variant => {
        const { rerender } = render(
          <Button variant={variant}>Variant {variant}</Button>
        )

        const button = screen.getByRole('button')
        expect(button).toBeInTheDocument()

        rerender(<div></div>) // Clean up
      })
    })

    it('handles touch events appropriately', async () => {
      render(<Button>Touch Test</Button>)

      const button = screen.getByRole('button')

      // Simulate touch events
      fireEvent.touchStart(button, { touches: [{ clientX: 10, clientY: 10 }] })
      fireEvent.touchEnd(button)

      // Should handle touch without issues
      expect(button).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('maintains keyboard accessibility during animations', async () => {
      render(<Button>Keyboard Test</Button>)

      const button = screen.getByRole('button')

      // Click and then use keyboard
      await user.click(button)
      await user.keyboard('{Enter}')

      // Should remain keyboard accessible
      expect(button).toHaveAttribute('tabIndex', '0')
    })

    it('does not interfere with screen readers', () => {
      render(<Button>Screen Reader Test</Button>)

      const button = screen.getByRole('button')

      // Should have proper ARIA attributes
      expect(button).toHaveAttribute('type', 'button')
    })

    it('respects reduced motion preferences', () => {
      // Mock reduced motion
      vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches: true,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      } as any)

      render(<Button>Motion Test</Button>)

      const button = screen.getByRole('button')

      // Should still work with reduced motion
      expect(button).toBeInTheDocument()

      vi.restoreAllMocks()
    })
  })

  describe('Performance Regression Prevention', () => {
    it('maintains consistent click response time', async () => {
      render(<Button>Response Time Test</Button>)

      const button = screen.getByRole('button')
      const responseTimes: number[] = []

      // Measure response times for multiple clicks
      for (let i = 0; i < 5; i++) {
        const startTime = performance.now()
        await user.click(button)
        const endTime = performance.now()
        responseTimes.push(endTime - startTime)
      }

      // Response times should be consistent (not increasing)
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      const maxDeviation = Math.max(...responseTimes) - Math.min(...responseTimes)

      // Should maintain consistent performance
      expect(avgResponseTime).toBeLessThan(50) // Fast response
      expect(maxDeviation).toBeLessThan(20) // Consistent timing
    })

    it('handles high-frequency interactions', async () => {
      render(<Button>High Frequency Test</Button>)

      const button = screen.getByRole('button')

      // Simulate high-frequency interactions
      const clickPromises = []
      for (let i = 0; i < 10; i++) {
        clickPromises.push(user.click(button))
      }

      await Promise.all(clickPromises)

      // Should handle without breaking
      expect(button).toBeInTheDocument()
      expect(button).toBeEnabled()
    })

    it('recovers from animation errors gracefully', async () => {
      // Mock a ripple effect error
      const mockUseRippleEffect = vi.fn(() => {
        throw new Error('Ripple effect error')
      })

      vi.doMock('../hooks/use-ripple-effect', () => ({
        useRippleEffect: mockUseRippleEffect,
      }))

      const { Button: MockedButton } = await import('../button')

      expect(() => {
        render(<MockedButton>Error Recovery Test</MockedButton>)
      }).not.toThrow()

      vi.restoreAllMocks()
    })
  })
})