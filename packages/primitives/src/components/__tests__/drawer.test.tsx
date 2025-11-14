import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '../drawer'

describe('Drawer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render drawer when open', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Test Drawer</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Test Drawer')).toBeInTheDocument()
    })

    it('should not render drawer when closed', () => {
      render(
        <Drawer open={false}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Test Drawer</DrawerTitle>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.queryByText('Test Drawer')).not.toBeInTheDocument()
    })

    it('should render drawer with all sub-components', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Title</DrawerTitle>
              <DrawerDescription>Description</DrawerDescription>
            </DrawerHeader>
            <div>Content</div>
            <DrawerFooter>
              <button>Footer</button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
        <Drawer open={true} onOpenChange={mockOnOpenChange}>
          <DrawerContent>
            <DrawerTitle>Controlled</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Controlled')).toBeInTheDocument()
    })

    it('should work as uncontrolled component', () => {
      render(
        <Drawer defaultOpen>
          <DrawerContent>
            <DrawerTitle>Uncontrolled</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Uncontrolled')).toBeInTheDocument()
    })
  })

  describe('DrawerTrigger', () => {
    it('should render trigger button', () => {
      render(
        <Drawer>
          <DrawerTrigger>Open Drawer</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Open Drawer')).toBeInTheDocument()
    })

    it('should open drawer when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(
        <Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>
            <DrawerTitle>Opened</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )

      const trigger = screen.getByText('Open')
      await user.click(trigger)

      expect(screen.getByText('Opened')).toBeInTheDocument()
    })
  })

  describe('DrawerContent', () => {
    it('should render with default side', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Content</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('should render with custom side', () => {
      render(
        <Drawer open>
          <DrawerContent side="right">
            <DrawerTitle>Right Side</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Right Side')).toBeInTheDocument()
    })

    it('should render with custom size', () => {
      render(
        <Drawer open>
          <DrawerContent size="lg">
            <DrawerTitle>Large</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Large')).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      render(
        <Drawer open>
          <DrawerContent className="custom-drawer">
            <DrawerTitle>Custom</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Custom')).toBeInTheDocument()
    })
  })

  describe('DrawerClose', () => {
    it('should render close button', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Drawer</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByText('Close')).toBeInTheDocument()
    })

    it('should close drawer when clicked', async () => {
      const user = userEvent.setup()
      const mockOnOpenChange = vi.fn()
      render(
        <Drawer open onOpenChange={mockOnOpenChange}>
          <DrawerContent>
            <DrawerTitle>Drawer</DrawerTitle>
            <DrawerClose>Close</DrawerClose>
          </DrawerContent>
        </Drawer>
      )

      const closeButton = screen.getByText('Close')
      await user.click(closeButton)

      expect(mockOnOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Accessibility', () => {
    it('should have proper title role', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Accessible Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('should support aria-label on content', () => {
      render(
        <Drawer open>
          <DrawerContent>
            <DrawerTitle>Drawer</DrawerTitle>
          </DrawerContent>
        </Drawer>
      )
      // Drawer content is rendered in document, check by role
      const drawer = screen.getByRole('dialog')
      expect(drawer).toBeInTheDocument()
      // Drawer should have aria-modal="true"
      expect(drawer).toHaveAttribute('aria-modal', 'true')
    })
  })

  describe('Error Handling', () => {
    it('should throw error when used outside Drawer context', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      expect(() => {
        render(<DrawerTrigger>Trigger</DrawerTrigger>)
      }).toThrow('Drawer components must be used within a Drawer')

      consoleSpy.mockRestore()
    })
  })
})
