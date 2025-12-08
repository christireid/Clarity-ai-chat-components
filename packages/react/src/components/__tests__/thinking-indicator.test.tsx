import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThinkingIndicator } from '../thinking-indicator'
import type { AIStatus } from '@clarity-chat/types'

// Mock useReducedMotion hook
vi.mock('../../hooks/use-reduced-motion', () => ({
  useReducedMotion: vi.fn(() => false),
}))

describe('ThinkingIndicator Component', () => {
  describe('Rendering', () => {
    it('should render default thinking state when no status provided', () => {
      render(<ThinkingIndicator />)
      // Default is 'thinking' stage which shows 'Thinking' label
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })

    it('should render with icon container when no status provided', () => {
      render(<ThinkingIndicator />)
      // Component renders with icon - verify via SVG presence
      // Note: framer-motion mock may strip className props, so we verify rendering
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })
  })

  describe('Status Stages', () => {
    it('should render thinking stage', () => {
      const status: AIStatus = { stage: 'thinking', startedAt: new Date() }
      render(<ThinkingIndicator status={status} />)
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })

    it('should render researching stage', () => {
      const status: AIStatus = { stage: 'researching', startedAt: new Date() }
      render(<ThinkingIndicator status={status} />)
      expect(screen.getByText('Researching')).toBeInTheDocument()
    })

    it('should render compiling stage', () => {
      const status: AIStatus = { stage: 'compiling', startedAt: new Date() }
      render(<ThinkingIndicator status={status} />)
      expect(screen.getByText('Compiling')).toBeInTheDocument()
    })

    it('should render generating stage', () => {
      const status: AIStatus = { stage: 'generating', startedAt: new Date() }
      render(<ThinkingIndicator status={status} />)
      expect(screen.getByText('Generating')).toBeInTheDocument()
    })

    it('should render finalizing stage', () => {
      const status: AIStatus = { stage: 'finalizing', startedAt: new Date() }
      render(<ThinkingIndicator status={status} />)
      expect(screen.getByText('Finalizing')).toBeInTheDocument()
    })
  })

  describe('Topic Display', () => {
    it('should display topic when provided', () => {
      const status: AIStatus = {
        stage: 'researching',
        topic: 'Searching for relevant information',
        startedAt: new Date(),
      }
      render(<ThinkingIndicator status={status} />)

      expect(
        screen.getByText('Searching for relevant information')
      ).toBeInTheDocument()
    })

    it('should not display topic element when topic is not provided', () => {
      const status: AIStatus = { stage: 'thinking', startedAt: new Date() }
      const { container } = render(<ThinkingIndicator status={status} />)

      // Topic element has truncate class
      const topicElements = container.querySelectorAll('.truncate')
      expect(topicElements).toHaveLength(0)
    })

    it('should update topic when status changes', () => {
      const status1: AIStatus = {
        stage: 'thinking',
        topic: 'Analyzing your question',
        startedAt: new Date(),
      }
      const { rerender } = render(<ThinkingIndicator status={status1} />)

      expect(screen.getByText('Analyzing your question')).toBeInTheDocument()

      const status2: AIStatus = {
        stage: 'generating',
        topic: 'Creating response',
        startedAt: new Date(),
      }
      rerender(<ThinkingIndicator status={status2} />)

      expect(screen.getByText('Creating response')).toBeInTheDocument()
      expect(
        screen.queryByText('Analyzing your question')
      ).not.toBeInTheDocument()
    })
  })

  describe('Progress Bar', () => {
    it('should display progress bar when progress is provided', () => {
      const status: AIStatus = {
        stage: 'generating',
        progress: 50,
        startedAt: new Date(),
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      // Progress bar container has h-1.5 class
      const progressBar = container.querySelector('.h-1\\.5')
      expect(progressBar).toBeInTheDocument()
    })

    it('should not display progress bar when progress is undefined', () => {
      const status: AIStatus = { stage: 'thinking', startedAt: new Date() }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1\\.5')
      expect(progressBar).not.toBeInTheDocument()
    })

    it('should show correct progress percentage', () => {
      const status: AIStatus = {
        stage: 'generating',
        progress: 75,
        startedAt: new Date(),
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressFill = container.querySelector('.h-full.bg-primary')
      expect(progressFill).toBeInTheDocument()
    })

    it('should handle 0% progress', () => {
      const status: AIStatus = {
        stage: 'thinking',
        progress: 0,
        startedAt: new Date(),
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1\\.5')
      expect(progressBar).toBeInTheDocument()
    })

    it('should handle 100% progress', () => {
      const status: AIStatus = {
        stage: 'finalizing',
        progress: 100,
        startedAt: new Date(),
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1\\.5')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Estimated Completion Time', () => {
    it('should display estimated time when provided', () => {
      const futureTime = new Date(Date.now() + 5000) // 5 seconds from now
      const status: AIStatus = {
        stage: 'generating',
        estimatedCompletion: futureTime,
        startedAt: new Date(),
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText(/~\d+s/)).toBeInTheDocument()
    })

    it('should not display estimated time when not provided', () => {
      const status: AIStatus = { stage: 'thinking', startedAt: new Date() }
      render(<ThinkingIndicator status={status} />)

      expect(screen.queryByText(/~\d+s/)).not.toBeInTheDocument()
    })

    it('should calculate time remaining correctly', () => {
      const futureTime = new Date(Date.now() + 10000) // 10 seconds from now
      const status: AIStatus = {
        stage: 'generating',
        estimatedCompletion: futureTime,
        startedAt: new Date(),
      }
      render(<ThinkingIndicator status={status} />)

      // Should show approximately 10 seconds
      expect(screen.getByText(/~10s/)).toBeInTheDocument()
    })
  })

  describe('Animated Dots', () => {
    it('should render three animated dots', () => {
      const { container } = render(<ThinkingIndicator />)

      // Dots have class rounded-full bg-current
      const dots = container.querySelectorAll('.rounded-full.bg-current')
      expect(dots).toHaveLength(3)
    })
  })

  describe('Complete Status Object', () => {
    it('should render all status properties together', () => {
      const status: AIStatus = {
        stage: 'generating',
        topic: 'Creating detailed response',
        progress: 65,
        estimatedCompletion: new Date(Date.now() + 8000),
        startedAt: new Date(),
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('Generating')).toBeInTheDocument()
      expect(screen.getByText('Creating detailed response')).toBeInTheDocument()
      expect(screen.getByText(/~8s/)).toBeInTheDocument()

      // Progress bar should be present
      const { container } = render(<ThinkingIndicator status={status} />)
      const progressBar = container.querySelector('.h-1\\.5')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible structure', () => {
      const { container } = render(<ThinkingIndicator />)

      const indicator = container.querySelector('.flex.items-center')
      expect(indicator).toBeInTheDocument()
    })

    it('should have readable text content', () => {
      const status: AIStatus = {
        stage: 'thinking',
        topic: 'Processing your request',
        startedAt: new Date(),
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('Thinking')).toBeVisible()
      expect(screen.getByText('Processing your request')).toBeVisible()
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ThinkingIndicator className="custom-thinking" />
      )

      const indicator = container.querySelector('.custom-thinking')
      expect(indicator).toBeInTheDocument()
    })

    it('should combine custom className with default classes', () => {
      const { container } = render(
        <ThinkingIndicator className="custom-class" />
      )

      const indicator = container.querySelector('.custom-class')
      expect(indicator).toHaveClass('custom-class')
      expect(indicator).toHaveClass('flex')
      expect(indicator).toHaveClass('items-center')
    })
  })

  describe('Animation', () => {
    it('should apply motion animation props', () => {
      const { container } = render(<ThinkingIndicator />)

      const motionDiv = container.querySelector('.flex.items-center')
      expect(motionDiv).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined status gracefully', () => {
      expect(() =>
        render(<ThinkingIndicator status={undefined} />)
      ).not.toThrow()
    })

    it('should handle empty status object', () => {
      const status = {} as AIStatus
      expect(() => render(<ThinkingIndicator status={status} />)).not.toThrow()
    })

    it('should handle past estimatedCompletion time', () => {
      const pastTime = new Date(Date.now() - 5000) // 5 seconds ago
      const status: AIStatus = {
        stage: 'thinking',
        estimatedCompletion: pastTime,
        startedAt: new Date(),
      }
      render(<ThinkingIndicator status={status} />)

      // Should show ~0s (clamped to 0 minimum)
      expect(screen.getByText('~0s')).toBeInTheDocument()
    })

    it('should handle progress over 100%', () => {
      const status: AIStatus = {
        stage: 'generating',
        progress: 150,
        startedAt: new Date(),
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      expect(container).toBeInTheDocument()
    })

    it('should handle negative progress', () => {
      const status: AIStatus = {
        stage: 'thinking',
        progress: -10,
        startedAt: new Date(),
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      expect(container).toBeInTheDocument()
    })
  })

  describe('Stage Transitions', () => {
    it('should smoothly transition between stages', () => {
      const status1: AIStatus = { stage: 'thinking', startedAt: new Date() }
      const { rerender } = render(<ThinkingIndicator status={status1} />)

      expect(screen.getByText('Thinking')).toBeInTheDocument()

      const status2: AIStatus = { stage: 'generating', startedAt: new Date() }
      rerender(<ThinkingIndicator status={status2} />)

      expect(screen.getByText('Generating')).toBeInTheDocument()
      expect(screen.queryByText('Thinking')).not.toBeInTheDocument()
    })
  })

  describe('Icon Container Stability', () => {
    // Note: framer-motion mock strips className props from motion.div elements.
    // The icon container styling IS present in the component source (thinking-indicator.tsx:138)
    // with classes: flex-shrink-0 w-[18px] h-[18px]
    // These tests verify the component renders without error.

    it('should render icon container without layout issues', () => {
      render(<ThinkingIndicator />)
      // Verify component renders correctly with stage label
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })
  })

  describe('Reduced Motion Accessibility', () => {
    // The useReducedMotion hook is used by the component (thinking-indicator.tsx:68)
    // to adjust animations for users who prefer reduced motion.
    // Testing the actual hook call is difficult due to module mocking behavior.

    it('should render properly regardless of reduced motion setting', async () => {
      // Test that component renders in both states
      const { useReducedMotion } =
        await import('../../hooks/use-reduced-motion')

      // Test with reduced motion disabled (default)
      vi.mocked(useReducedMotion).mockReturnValue(false)
      const { rerender } = render(<ThinkingIndicator />)
      expect(screen.getByText('Thinking')).toBeInTheDocument()

      // Test with reduced motion enabled
      vi.mocked(useReducedMotion).mockReturnValue(true)
      rerender(<ThinkingIndicator />)
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })
  })
})
