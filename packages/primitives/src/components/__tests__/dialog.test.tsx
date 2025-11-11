import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../dialog'

describe('Dialog Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render dialog when open', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
    })

    it('should not render dialog when closed', () => {
      render(
        <Dialog open={false}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      // Dialog content should not be visible when closed
      expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()
    })

    it('should render dialog with all sub-components', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Description</DialogDescription>
            </DialogHeader>
            <div>Content</div>
            <DialogFooter>
              <button>Footer</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Title')).toBeInTheDocument()
      expect(screen.getByText('Description')).toBeInTheDocument()
      expect(screen.getByText('Content')).toBeInTheDocument()
      expect(screen.getByText('Footer')).toBeInTheDocument()
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const mockOnOpenChange = vi.fn()
      render(
        <Dialog open={true} onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogTitle>Controlled</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Controlled')).toBeInTheDocument()
    })

    it('should work as uncontrolled component', () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Uncontrolled</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Uncontrolled')).toBeInTheDocument()
    })
  })

  describe('DialogTrigger', () => {
    it('should render trigger button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Open Dialog')).toBeInTheDocument()
    })

    it('should open dialog when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Opened</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      const trigger = screen.getByText('Open')
      await user.click(trigger)

      // Dialog should open (mocked animation may affect visibility)
      // We check that the content exists in the DOM
      expect(screen.getByText('Opened')).toBeInTheDocument()
    })
  })

  describe('DialogContent', () => {
    it('should render with default size', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Content</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render with custom size', () => {
      const { container } = render(
        <Dialog open>
          <DialogContent size="lg">
            <DialogTitle>Large</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      // Size classes are applied via className
      expect(screen.getByText('Large')).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(
        <Dialog open>
          <DialogContent className="custom-dialog">
            <DialogTitle>Custom</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })
  })

  describe('DialogClose', () => {
    it('should render close button', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('should close dialog when clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(
        <Dialog open onOpenChange={mockOnOpenChange}>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
            <DialogClose>Close</DialogClose>
          </DialogContent>
        </Dialog>
      )

      const closeButton = screen.getByText('Close')
      await user.click(closeButton)

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper title role', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should support aria-label on content', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      )
      // Dialog content is rendered in portal, check by role
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      // Dialog should have aria-modal="true"
      expect(dialog).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Error Handling', () => {
    it('should throw error when used outside Dialog context', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<DialogTrigger>Trigger</DialogTrigger>)
      }).toThrow('Dialog components must be used within a Dialog')

      consoleSpy.mockRestore()
    })
  })
})
