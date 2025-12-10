import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ToastContainer, Toast } from '../Toast'

describe('Toast Component', () => {
  describe('ToastContainer', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <ToastContainer toasts={[]} onDismiss={vi.fn()} />
      )
      expect(container).toBeInTheDocument()
    })

    it('renders toast message correctly', () => {
      const toast: Toast = {
        id: '1',
        message: 'Test message',
        type: 'success',
      }
      const onDismiss = vi.fn()

      render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)
      expect(screen.getByText('Test message')).toBeInTheDocument()
    })

    it('renders multiple toasts', () => {
      const toasts: Toast[] = [
        { id: '1', message: 'First toast', type: 'success' },
        { id: '2', message: 'Second toast', type: 'info' },
        { id: '3', message: 'Third toast', type: 'error' },
      ]

      render(<ToastContainer toasts={toasts} onDismiss={vi.fn()} />)
      expect(screen.getByText('First toast')).toBeInTheDocument()
      expect(screen.getByText('Second toast')).toBeInTheDocument()
      expect(screen.getByText('Third toast')).toBeInTheDocument()
    })

    it('renders with correct position classes', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      const { container } = render(
        <ToastContainer
          toasts={[toast]}
          onDismiss={vi.fn()}
          position="top-right"
        />
      )

      const toastContainer = container.querySelector(
        '[aria-label="Notifications"]'
      )
      expect(toastContainer).toHaveClass('top-0', 'right-0')
    })

    it('renders with bottom-left position', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      const { container } = render(
        <ToastContainer
          toasts={[toast]}
          onDismiss={vi.fn()}
          position="bottom-left"
        />
      )

      const toastContainer = container.querySelector(
        '[aria-label="Notifications"]'
      )
      expect(toastContainer).toHaveClass('bottom-0', 'left-0')
    })
  })

  describe('Toast Types', () => {
    it('renders success toast with correct styling', () => {
      const toast: Toast = {
        id: '1',
        message: 'Success message',
        type: 'success',
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-success/10', 'border-success/50')
    })

    it('renders error toast with correct styling', () => {
      const toast: Toast = {
        id: '1',
        message: 'Error message',
        type: 'error',
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-error/10', 'border-error/50')
    })

    it('renders warning toast with correct styling', () => {
      const toast: Toast = {
        id: '1',
        message: 'Warning message',
        type: 'warning',
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-warning/10', 'border-warning/50')
    })

    it('renders info toast with correct styling', () => {
      const toast: Toast = {
        id: '1',
        message: 'Info message',
        type: 'info',
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('bg-brand-500/10', 'border-brand-500/50')
    })
  })

  describe('Toast Dismissal', () => {
    it('calls onDismiss when close button clicked', async () => {
      const user = userEvent.setup()
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      const onDismiss = vi.fn()

      render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)
      const closeButton = screen.getByLabelText('Dismiss notification')

      await user.click(closeButton)
      expect(onDismiss).toHaveBeenCalledWith('1')
    })

    it('auto-dismisses after specified duration', async () => {
      vi.useFakeTimers()

      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'success',
        duration: 1000, // 1 second
      }
      const onDismiss = vi.fn()

      render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)

      // Progress bar animation should complete and call onDismiss
      act(() => {
        vi.advanceTimersByTime(1100) // Slightly more than duration
      })

      await waitFor(
        () => {
          expect(onDismiss).toHaveBeenCalledWith('1')
        },
        { timeout: 2000 }
      )

      vi.useRealTimers()
    })

    it('does not auto-dismiss persistent toasts', async () => {
      vi.useFakeTimers()

      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'info',
        persistent: true,
      }
      const onDismiss = vi.fn()

      render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)

      act(() => {
        vi.advanceTimersByTime(5000) // Wait 5 seconds
      })

      expect(onDismiss).not.toHaveBeenCalled()

      vi.useRealTimers()
    })
  })

  describe('Toast Action Button', () => {
    it('renders action button when provided', () => {
      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'error',
        action: {
          label: 'Retry',
          onClick: vi.fn(),
        },
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      expect(screen.getByText('Retry')).toBeInTheDocument()
    })

    it('calls action onClick and dismisses toast', async () => {
      const user = userEvent.setup()
      const actionOnClick = vi.fn()
      const onDismiss = vi.fn()

      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'error',
        action: {
          label: 'Retry',
          onClick: actionOnClick,
        },
      }

      render(<ToastContainer toasts={[toast]} onDismiss={onDismiss} />)
      const actionButton = screen.getByText('Retry')

      await user.click(actionButton)

      expect(actionOnClick).toHaveBeenCalledTimes(1)
      expect(onDismiss).toHaveBeenCalledWith('1')
    })

    it('does not render action button when not provided', () => {
      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'success',
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      expect(
        screen.queryByRole('button', { name: /retry/i })
      ).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has correct ARIA role', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('has aria-live region', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      const { container } = render(
        <ToastContainer toasts={[toast]} onDismiss={vi.fn()} />
      )

      const alert = container.querySelector('[aria-live="assertive"]')
      expect(alert).toBeInTheDocument()
    })

    it('has aria-atomic attribute', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      const { container } = render(
        <ToastContainer toasts={[toast]} onDismiss={vi.fn()} />
      )

      const alert = container.querySelector('[aria-atomic="true"]')
      expect(alert).toBeInTheDocument()
    })

    it('close button has accessible label', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)

      expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument()
    })

    it('container has accessible label', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'info' }
      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)

      expect(screen.getByLabelText('Notifications')).toBeInTheDocument()
    })
  })

  describe('Custom Icons', () => {
    it('renders custom icon when provided', () => {
      const CustomIcon = () => <span data-testid="custom-icon">★</span>
      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'success',
        icon: <CustomIcon />,
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('uses default icon when custom icon not provided', () => {
      const toast: Toast = { id: '1', message: 'Test', type: 'success' }
      const { container } = render(
        <ToastContainer toasts={[toast]} onDismiss={vi.fn()} />
      )

      // Check for lucide-react icon (CheckCircle2 for success)
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Progress Bar', () => {
    it('renders progress bar for non-persistent toasts', () => {
      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'success',
        duration: 3000,
      }
      const { container } = render(
        <ToastContainer toasts={[toast]} onDismiss={vi.fn()} />
      )

      // Progress bar should be rendered (motion.div with animated width)
      const progressBar = container.querySelector(
        '.absolute.bottom-0.left-0.h-1'
      )
      expect(progressBar).toBeInTheDocument()
    })

    it('does not render progress bar for persistent toasts', () => {
      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'success',
        persistent: true,
      }
      const { container } = render(
        <ToastContainer toasts={[toast]} onDismiss={vi.fn()} />
      )

      const progressBar = container.querySelector(
        '.absolute.bottom-0.left-0.h-1'
      )
      expect(progressBar).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles empty toast array', () => {
      const { container } = render(
        <ToastContainer toasts={[]} onDismiss={vi.fn()} />
      )
      expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument()
    })

    it('handles very long messages', () => {
      const longMessage = 'A'.repeat(500)
      const toast: Toast = { id: '1', message: longMessage, type: 'info' }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      expect(screen.getByText(longMessage)).toBeInTheDocument()
    })

    it('handles special characters in message', () => {
      const specialMessage = '<script>alert("XSS")</script>'
      const toast: Toast = { id: '1', message: specialMessage, type: 'info' }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      // Should render as text, not execute script
      expect(screen.getByText(specialMessage)).toBeInTheDocument()
    })

    it('handles very short duration', () => {
      const toast: Toast = {
        id: '1',
        message: 'Test',
        type: 'success',
        duration: 100, // Very short
      }

      render(<ToastContainer toasts={[toast]} onDismiss={vi.fn()} />)
      // Should still render without errors
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
})
