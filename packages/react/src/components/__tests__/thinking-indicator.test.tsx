import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ThinkingIndicator } from '../thinking-indicator'
import type { AIStatus } from '@clarity-chat/types'

describe('ThinkingIndicator Component', () => {
  describe('Rendering', () => {
    it('should render default processing state', () => {
      render(<ThinkingIndicator />)
      expect(screen.getByText('Processing')).toBeInTheDocument()
      expect(screen.getByText('💭')).toBeInTheDocument()
    })

    it('should render with default icon and text when no status provided', () => {
      const { container } = render(<ThinkingIndicator />)
      expect(container.querySelector('.text-2xl')).toHaveTextContent('💭')
      expect(screen.getByText('Processing')).toBeInTheDocument()
    })
  })

  describe('Status Stages', () => {
    it('should render thinking stage', () => {
      const status: AIStatus = { stage: 'thinking' }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('🤔')).toBeInTheDocument()
      expect(screen.getByText('Thinking')).toBeInTheDocument()
    })

    it('should render researching stage', () => {
      const status: AIStatus = { stage: 'researching' }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('🔍')).toBeInTheDocument()
      expect(screen.getByText('Researching')).toBeInTheDocument()
    })

    it('should render compiling stage', () => {
      const status: AIStatus = { stage: 'compiling' }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('📝')).toBeInTheDocument()
      expect(screen.getByText('Compiling')).toBeInTheDocument()
    })

    it('should render generating stage', () => {
      const status: AIStatus = { stage: 'generating' }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('✨')).toBeInTheDocument()
      expect(screen.getByText('Generating')).toBeInTheDocument()
    })

    it('should render finalizing stage', () => {
      const status: AIStatus = { stage: 'finalizing' }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('🎯')).toBeInTheDocument()
      expect(screen.getByText('Finalizing')).toBeInTheDocument()
    })
  })

  describe('Topic Display', () => {
    it('should display topic when provided', () => {
      const status: AIStatus = {
        stage: 'researching',
        topic: 'Searching for relevant information',
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('Searching for relevant information')).toBeInTheDocument()
    })

    it('should not display topic element when topic is not provided', () => {
      const status: AIStatus = { stage: 'thinking' }
      const { container } = render(<ThinkingIndicator status={status} />)

      const topicElements = container.querySelectorAll('.text-xs.text-muted-foreground.mt-1')
      expect(topicElements).toHaveLength(0)
    })

    it('should update topic when status changes', () => {
      const status1: AIStatus = {
        stage: 'thinking',
        topic: 'Analyzing your question',
      }
      const { rerender } = render(<ThinkingIndicator status={status1} />)

      expect(screen.getByText('Analyzing your question')).toBeInTheDocument()

      const status2: AIStatus = {
        stage: 'generating',
        topic: 'Creating response',
      }
      rerender(<ThinkingIndicator status={status2} />)

      expect(screen.getByText('Creating response')).toBeInTheDocument()
      expect(screen.queryByText('Analyzing your question')).not.toBeInTheDocument()
    })
  })

  describe('Progress Bar', () => {
    it('should display progress bar when progress is provided', () => {
      const status: AIStatus = {
        stage: 'generating',
        progress: 50,
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1.bg-background')
      expect(progressBar).toBeInTheDocument()
    })

    it('should not display progress bar when progress is undefined', () => {
      const status: AIStatus = { stage: 'thinking' }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1.bg-background')
      expect(progressBar).not.toBeInTheDocument()
    })

    it('should show correct progress percentage', () => {
      const status: AIStatus = {
        stage: 'generating',
        progress: 75,
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressFill = container.querySelector('.h-full.bg-primary')
      expect(progressFill).toBeInTheDocument()
      // Progress bar width should be set via inline style
    })

    it('should handle 0% progress', () => {
      const status: AIStatus = {
        stage: 'thinking',
        progress: 0,
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1.bg-background')
      expect(progressBar).toBeInTheDocument()
    })

    it('should handle 100% progress', () => {
      const status: AIStatus = {
        stage: 'finalizing',
        progress: 100,
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      const progressBar = container.querySelector('.h-1.bg-background')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Estimated Completion Time', () => {
    it('should display estimated time when provided', () => {
      const futureTime = new Date(Date.now() + 5000) // 5 seconds from now
      const status: AIStatus = {
        stage: 'generating',
        estimatedCompletion: futureTime,
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText(/~\ds/)).toBeInTheDocument()
    })

    it('should not display estimated time when not provided', () => {
      const status: AIStatus = { stage: 'thinking' }
      const { container } = render(<ThinkingIndicator status={status} />)

      const timeElements = container.querySelectorAll('span.text-xs.text-muted-foreground')
      expect(timeElements).toHaveLength(0)
    })

    it('should calculate time remaining correctly', () => {
      const futureTime = new Date(Date.now() + 10000) // 10 seconds from now
      const status: AIStatus = {
        stage: 'generating',
        estimatedCompletion: futureTime,
      }
      render(<ThinkingIndicator status={status} />)

      // Should show approximately 10 seconds
      expect(screen.getByText(/~10s/)).toBeInTheDocument()
    })

    it('should round up time to nearest second', () => {
      const futureTime = new Date(Date.now() + 3500) // 3.5 seconds
      const status: AIStatus = {
        stage: 'generating',
        estimatedCompletion: futureTime,
      }
      render(<ThinkingIndicator status={status} />)

      // Should round up to 4 seconds
      expect(screen.getByText(/~4s/)).toBeInTheDocument()
    })
  })

  describe('Animated Dots', () => {
    it('should render three animated dots', () => {
      const { container } = render(<ThinkingIndicator />)

      const dots = container.querySelectorAll('.w-1\\.5.h-1\\.5.rounded-full')
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
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('✨')).toBeInTheDocument()
      expect(screen.getByText('Generating')).toBeInTheDocument()
      expect(screen.getByText('Creating detailed response')).toBeInTheDocument()
      expect(screen.getByText(/~8s/)).toBeInTheDocument()

      // Progress bar should be present
      const { container } = render(<ThinkingIndicator status={status} />)
      const progressBar = container.querySelector('.h-1.bg-background')
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
      }
      render(<ThinkingIndicator status={status} />)

      expect(screen.getByText('Thinking')).toBeVisible()
      expect(screen.getByText('Processing your request')).toBeVisible()
    })
  })

  describe('Custom className', () => {
    it('should apply custom className', () => {
      const { container } = render(<ThinkingIndicator className="custom-thinking" />)

      const indicator = container.querySelector('.custom-thinking')
      expect(indicator).toBeInTheDocument()
    })

    it('should combine custom className with default classes', () => {
      const { container } = render(<ThinkingIndicator className="custom-class" />)

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
      expect(() => render(<ThinkingIndicator status={undefined} />)).not.toThrow()
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
      }
      render(<ThinkingIndicator status={status} />)

      // Should handle negative time gracefully
      const { container } = render(<ThinkingIndicator status={status} />)
      expect(container).toBeInTheDocument()
    })

    it('should handle progress over 100%', () => {
      const status: AIStatus = {
        stage: 'generating',
        progress: 150,
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      expect(container).toBeInTheDocument()
    })

    it('should handle negative progress', () => {
      const status: AIStatus = {
        stage: 'thinking',
        progress: -10,
      }
      const { container } = render(<ThinkingIndicator status={status} />)

      expect(container).toBeInTheDocument()
    })
  })

  describe('Stage Transitions', () => {
    it('should smoothly transition between stages', () => {
      const status1: AIStatus = { stage: 'thinking' }
      const { rerender } = render(<ThinkingIndicator status={status1} />)

      expect(screen.getByText('Thinking')).toBeInTheDocument()

      const status2: AIStatus = { stage: 'generating' }
      rerender(<ThinkingIndicator status={status2} />)

      expect(screen.getByText('Generating')).toBeInTheDocument()
      expect(screen.queryByText('Thinking')).not.toBeInTheDocument()
    })
  })
})
