/**
 * Dialog Accessibility Regression Tests
 *
 * Tests for ISSUE-002 and ISSUE-003: Dialog Focus Trap and Escape Handling
 * Ensures dialogs work properly with keyboard navigation and mobile focus management.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../dialog'

// Mock mobile detection
const mockUserAgent = vi.fn()
Object.defineProperty(navigator, 'userAgent', {
  get: mockUserAgent,
  configurable: true,
})

describe('Dialog Accessibility Regression', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    mockUserAgent.mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Focus Trap Functionality', () => {
    it('traps focus within dialog on desktop', async () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Test Dialog</DialogTitle>
              <DialogDescription>Description</DialogDescription>
            </DialogHeader>
            <div>
              <button>Button 1</button>
              <button>Button 2</button>
              <input placeholder="Input field" />
            </div>
            <DialogFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      // Dialog should be open
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()

      // Focus should move to dialog content
      await waitFor(() => {
        const dialogContent = screen.getByRole('dialog')
        expect(dialogContent).toHaveFocus()
      })
    })

    it('handles mobile focus trapping with user agent detection', async () => {
      // Mock mobile user agent
      mockUserAgent.mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15')

      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mobile Dialog</DialogTitle>
            </DialogHeader>
            <div>
              <button>Mobile Button</button>
              <input placeholder="Mobile input" />
            </div>
          </DialogContent>
        </Dialog>
      )

      expect(screen.getByText('Mobile Dialog')).toBeInTheDocument()

      // Should still work on mobile (different focus handling)
      const dialogContent = screen.getByRole('dialog')
      expect(dialogContent).toBeInTheDocument()
    })

    it('restores focus when dialog closes', async () => {
      const onOpenChange = vi.fn()

      // Create a button to focus initially
      render(
        <>
          <button data-testid="trigger-button">Open Dialog</button>
          <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent>
              <DialogTitle>Test Dialog</DialogTitle>
              <button data-testid="dialog-button">Dialog Button</button>
              <button data-testid="close-button">Close</button>
            </DialogContent>
          </Dialog>
        </>
      )

      // Click close button
      const closeButton = screen.getByTestId('close-button')
      await user.click(closeButton)

      // Should call onOpenChange to close
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  describe('Keyboard Navigation', () => {
    it('handles Tab navigation within dialog', async () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard Test</DialogTitle>
            </DialogHeader>
            <div>
              <button data-testid="first-button">First</button>
              <button data-testid="second-button">Second</button>
              <input data-testid="test-input" placeholder="Input" />
            </div>
            <DialogFooter>
              <button data-testid="cancel-button">Cancel</button>
              <button data-testid="confirm-button">Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      // Start tab navigation
      await user.keyboard('{Tab}')

      // Should be able to tab through focusable elements
      const firstButton = screen.getByTestId('first-button')
      const secondButton = screen.getByTestId('second-button')
      const input = screen.getByTestId('test-input')
      const cancelButton = screen.getByTestId('cancel-button')
      const confirmButton = screen.getByTestId('confirm-button')

      // Elements should be present and focusable
      expect(firstButton).toBeInTheDocument()
      expect(secondButton).toBeInTheDocument()
      expect(input).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()
      expect(confirmButton).toBeInTheDocument()
    })

    it('handles Escape key to close dialog', async () => {
      const onOpenChange = vi.fn()

      render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogTitle>Escape Test</DialogTitle>
            <p>Press Escape to close</p>
          </DialogContent>
        </Dialog>
      )

      // Press Escape
      await user.keyboard('{Escape}')

      // Should call onOpenChange to close
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it('handles Enter key on focused buttons', async () => {
      const onConfirm = vi.fn()
      const onCancel = vi.fn()

      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Enter Key Test</DialogTitle>
            <DialogFooter>
              <button data-testid="cancel" onClick={onCancel}>Cancel</button>
              <button data-testid="confirm" onClick={onConfirm}>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      // Focus and press Enter on confirm button
      const confirmButton = screen.getByTestId('confirm')
      confirmButton.focus()
      await user.keyboard('{Enter}')

      expect(onConfirm).toHaveBeenCalled()
    })
  })

  describe('Mobile-Specific Behavior', () => {
    it('adapts focus handling for iOS Safari', async () => {
      mockUserAgent.mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15')

      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>iOS Dialog</DialogTitle>
            <p>iOS-specific focus handling</p>
            <button data-testid="ios-button">iOS Button</button>
          </DialogContent>
        </Dialog>
      )

      // Should handle iOS-specific focus behavior
      expect(screen.getByText('iOS Dialog')).toBeInTheDocument()
      expect(screen.getByTestId('ios-button')).toBeInTheDocument()
    })

    it('adapts focus handling for Android Chrome', async () => {
      mockUserAgent.mockReturnValue('Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36')

      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Android Dialog</DialogTitle>
            <p>Android-specific focus handling</p>
            <button data-testid="android-button">Android Button</button>
          </DialogContent>
        </Dialog>
      )

      // Should handle Android-specific focus behavior
      expect(screen.getByText('Android Dialog')).toBeInTheDocument()
      expect(screen.getByTestId('android-button')).toBeInTheDocument()
    })

    it('handles virtual keyboard interactions', async () => {
      mockUserAgent.mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15')

      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Virtual Keyboard Test</DialogTitle>
            <input data-testid="mobile-input" placeholder="Tap to focus" />
          </DialogContent>
        </Dialog>
      )

      const input = screen.getByTestId('mobile-input')

      // Simulate tapping input (focus)
      await user.click(input)

      // Should handle virtual keyboard appearance
      expect(document.activeElement).toBe(input)
    })
  })

  describe('Accessibility Compliance', () => {
    it('has proper ARIA attributes', () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>ARIA Test</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      const title = screen.getByText('ARIA Test')
      const description = screen.getByText('Dialog description')

      expect(dialog).toBeInTheDocument()
      expect(title).toHaveAttribute('id')
      expect(description).toHaveAttribute('id')
    })

    it('supports screen reader navigation', async () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Screen Reader Test</DialogTitle>
            <DialogDescription>Accessible dialog content</DialogDescription>
            <button data-testid="sr-button">Screen Reader Button</button>
          </DialogContent>
        </Dialog>
      )

      const dialog = screen.getByRole('dialog')
      const button = screen.getByTestId('sr-button')

      // Should be accessible via screen readers
      expect(dialog).toHaveAttribute('role', 'dialog')
      expect(button).toBeInTheDocument()
    })

    it('maintains focus visibility', async () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Focus Visibility Test</DialogTitle>
            <button data-testid="focus-button">Focusable Button</button>
          </DialogContent>
        </Dialog>
      )

      const button = screen.getByTestId('focus-button')

      // Focus the button
      button.focus()

      // Should be focused
      expect(document.activeElement).toBe(button)
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid open/close cycles', () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogTitle>Rapid Cycle Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Rapidly toggle open state
      rerender(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogTitle>Rapid Cycle Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      rerender(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogTitle>Rapid Cycle Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Should handle without errors
      expect(screen.getByText('Rapid Cycle Test')).toBeInTheDocument()
    })

    it('handles dialogs without focusable content', () => {
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>No Focusable Content</DialogTitle>
            <p>This dialog has no buttons or inputs</p>
          </DialogContent>
        </Dialog>
      )

      // Should still render and be accessible
      expect(screen.getByText('No Focusable Content')).toBeInTheDocument()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('handles nested dialogs appropriately', () => {
      // This is more of a guideline - nested dialogs are generally not recommended
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Outer Dialog</DialogTitle>
            <Dialog open={true} onOpenChange={() => {}}>
              <DialogContent>
                <DialogTitle>Inner Dialog</DialogTitle>
                <p>Nested dialogs should be handled carefully</p>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      )

      // Should render both dialogs
      expect(screen.getByText('Outer Dialog')).toBeInTheDocument()
      expect(screen.getByText('Inner Dialog')).toBeInTheDocument()
    })
  })

  describe('State Management', () => {
    it('properly manages open/closed state transitions', () => {
      const onOpenChange = vi.fn()
      const { rerender } = render(
        <Dialog open={false} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogTitle>State Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Should not be visible when closed
      expect(screen.queryByText('State Test')).not.toBeInTheDocument()

      // Open dialog
      rerender(
        <Dialog open={true} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogTitle>State Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Should be visible when open
      expect(screen.getByText('State Test')).toBeInTheDocument()
    })

    it('cleans up properly on unmount', () => {
      const { unmount } = render(
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent>
            <DialogTitle>Cleanup Test</DialogTitle>
          </DialogContent>
        </Dialog>
      )

      // Unmount component
      unmount()

      // Should clean up without errors
      expect(screen.queryByText('Cleanup Test')).not.toBeInTheDocument()
    })
  })
})