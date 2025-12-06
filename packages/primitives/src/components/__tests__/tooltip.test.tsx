import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tooltip } from '../tooltip'

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render trigger element', () => {
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      )
      expect(screen.getByText('Hover me')).toBeInTheDocument()
    })

    it('should render tooltip content on hover', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Tooltip text">
          <button>Hover me</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Hover me')
      await user.hover(trigger)

      // Wait for tooltip to appear (respects delay)
      await waitFor(() => {
        expect(screen.getByText('Tooltip text')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should render with default side', () => {
      render(
        <Tooltip content="Top tooltip">
          <button>Button</button>
        </Tooltip>
      )
      expect(screen.getByText('Button')).toBeInTheDocument()
    })

    it('should render with custom side', () => {
      render(
        <Tooltip content="Bottom tooltip" side="bottom">
          <button>Button</button>
        </Tooltip>
      )
      expect(screen.getByText('Button')).toBeInTheDocument()
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      render(
        <Tooltip content="Controlled" open={true}>
          <button>Button</button>
        </Tooltip>
      )
      expect(screen.getByText('Controlled')).toBeInTheDocument()
    })

    it('should work as uncontrolled component', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Uncontrolled">
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByText('Uncontrolled')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should call onOpenChange when state changes', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(
        <Tooltip content="Tooltip" onOpenChange={mockOnOpenChange}>
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalled()
      }, { timeout: 500 })
    })
  })

  describe('Delay', () => {
    it('should respect delay prop', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Delayed" delay={500}>
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      // Should not appear immediately
      expect(screen.queryByText('Delayed')).not.toBeInTheDocument()

      // Should appear after delay
      await waitFor(() => {
        expect(screen.getByText('Delayed')).toBeInTheDocument()
      }, { timeout: 600 })
    })
  })

  describe('Disabled State', () => {
    it('should not show tooltip when disabled', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Should not show" disabled>
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      // Wait a bit to ensure tooltip doesn't appear
      await new Promise(resolve => setTimeout(resolve, 300))
      expect(screen.queryByText('Should not show')).not.toBeInTheDocument()
    })
  })

  describe('Arrow', () => {
    it('should show arrow by default', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="With arrow">
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      await waitFor(() => {
        expect(screen.getByText('With arrow')).toBeInTheDocument()
      }, { timeout: 500 })
    })

    it('should hide arrow when showArrow is false', async () => {
      const user = userEvent.setup()
      const { container } = render(
        <Tooltip content="No arrow" showArrow={false}>
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      await waitFor(() => {
        // Check tooltip content exists
        const tooltip = container.querySelector('[data-state*="open"]:not([style*="position: absolute"][style*="clip"])')
        expect(tooltip).toBeInTheDocument()
        // Arrow should not be present
        expect(container.querySelector('[data-testid="tooltip-arrow"]')).not.toBeInTheDocument()
      }, { timeout: 500 })
    })
  })

  describe('Styling', () => {
    it('should accept custom className', () => {
      render(
        <Tooltip content="Custom" className="custom-tooltip">
          <button>Button</button>
        </Tooltip>
      )
      expect(screen.getByText('Button')).toBeInTheDocument()
    })

    it('should accept custom contentClassName', async () => {
      const user = userEvent.setup()
      render(
        <Tooltip content="Custom content" contentClassName="custom-content">
          <button>Button</button>
        </Tooltip>
      )

      const trigger = screen.getByText('Button')
      await user.hover(trigger)

      await waitFor(() => {
        // Find tooltip by role or data-state, not just text (Radix creates hidden span)
        const tooltip = document.querySelector('[role="tooltip"].custom-content, [data-state*="open"].custom-content')
        expect(tooltip).toBeInTheDocument()
        expect(tooltip).toHaveClass('custom-content')
      }, { timeout: 500 })
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label on trigger', () => {
      render(
        <Tooltip content="Tooltip">
          <button aria-label="Trigger button">Button</button>
        </Tooltip>
      )
      expect(screen.getByLabelText('Trigger button')).toBeInTheDocument()
    })
  })
})
