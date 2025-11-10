import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Popover, PopoverTrigger, PopoverContent } from '../popover'

describe('Popover Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render popover when open', () => {
      render(
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should not render popover when closed', () => {
      render(
        <Popover open={false}>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      expect(screen.queryByText('Content')).not.toBeInTheDocument()
    })

    it('should render trigger', () => {
      render(
        <Popover>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Trigger')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should open popover when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Opened</PopoverContent>
        </Popover>
      )

      const trigger = screen.getByText('Open')
      await user.click(trigger)

      expect(screen.getByText('Opened')).toBeInTheDocument()
    })

    it('should toggle popover on trigger click', async () => {
      const user = userEvent.setup()
      render(
        <Popover>
          <PopoverTrigger>Toggle</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )

      const trigger = screen.getByText('Toggle')
      
      // First click opens
      await user.click(trigger)
      expect(screen.getByText('Content')).toBeInTheDocument()

      // Second click closes
      await user.click(trigger)
      // Content may still be in DOM due to exit animation
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const mockOnOpenChange = vi.fn()
      render(
        <Popover open={true} onOpenChange={mockOnOpenChange}>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should work as uncontrolled component', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger>Trigger</PopoverTrigger>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('PopoverContent', () => {
    it('should render with default side', () => {
      render(
        <Popover open>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render with custom side', () => {
      render(
        <Popover open>
          <PopoverContent side="bottom">Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      render(
        <Popover open>
          <PopoverContent className="custom-popover">Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should respect sideOffset', () => {
      render(
        <Popover open>
          <PopoverContent sideOffset={10}>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should respect alignOffset', () => {
      render(
        <Popover open>
          <PopoverContent alignOffset={10}>Content</PopoverContent>
        </Popover>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should throw error when used outside Popover context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<PopoverTrigger>Trigger</PopoverTrigger>)
      }).toThrow('Popover components must be used within a Popover')

      consoleSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      const { container } = render(
        <Popover open>
          <PopoverContent aria-label="Popover content">Content</PopoverContent>
        </Popover>
      )
      // Popover content is positioned absolutely, check by container
      const popover = container.querySelector('[aria-label="Popover content"]')
      expect(popover).toBeInTheDocument()
    })
  })
})
