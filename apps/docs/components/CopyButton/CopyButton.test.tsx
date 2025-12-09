/**
 * CopyButton Component Tests
 *
 * @vitest-environment happy-dom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyButton } from './CopyButton'

// Mock clipboard API
const mockWriteText = vi.fn()

describe('CopyButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers({ shouldAdvanceTime: true })

    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText.mockResolvedValue(undefined),
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CopyButton text="test code" />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('shows copy icon initially', () => {
      render(<CopyButton text="test code" />)
      expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument()
    })

    it('renders with custom label', () => {
      render(<CopyButton text="test code" label="Copy code" />)
      expect(screen.getByText('Copy code')).toBeInTheDocument()
    })

    it('renders with small size', () => {
      render(<CopyButton text="test code" size="sm" />)
      const button = screen.getByRole('button')
      expect(button.className).toContain('p-1')
    })

    it('renders with medium size', () => {
      render(<CopyButton text="test code" size="md" />)
      const button = screen.getByRole('button')
      expect(button.className).toContain('p-1.5')
    })

    it('applies custom className', () => {
      render(<CopyButton text="test code" className="custom-class" />)
      const button = screen.getByRole('button')
      expect(button.className).toContain('custom-class')
    })
  })

  describe('Copy Functionality', () => {
    it('copies text to clipboard when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<CopyButton text="test code to copy" />)

      await user.click(screen.getByRole('button'))

      expect(mockWriteText).toHaveBeenCalledWith('test code to copy')
    })

    it('shows check icon after successful copy', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<CopyButton text="test code" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
      })
    })

    it('reverts to copy icon after timeout', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<CopyButton text="test code" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
      })

      // Advance timers past the 2000ms timeout
      vi.advanceTimersByTime(2500)

      await waitFor(() => {
        expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument()
      })
    })

    it('calls onCopy callback with success=true on successful copy', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      const onCopy = vi.fn()
      render(<CopyButton text="test code" onCopy={onCopy} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onCopy).toHaveBeenCalledWith(true)
      })
    })

    it('calls onCopy callback with success=false on failed copy', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      mockWriteText.mockRejectedValueOnce(new Error('Copy failed'))

      const onCopy = vi.fn()
      render(<CopyButton text="test code" onCopy={onCopy} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onCopy).toHaveBeenCalledWith(false)
      })
    })
  })

  describe('Fallback Copy', () => {
    it('uses execCommand fallback when clipboard API is unavailable', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })

      // Remove clipboard API
      Object.assign(navigator, { clipboard: undefined })

      // Mock document.execCommand
      const mockExecCommand = vi.fn().mockReturnValue(true)
      document.execCommand = mockExecCommand

      render(<CopyButton text="test code" />)

      await user.click(screen.getByRole('button'))

      expect(mockExecCommand).toHaveBeenCalledWith('copy')
    })
  })

  describe('Accessibility', () => {
    it('has accessible button role', () => {
      render(<CopyButton text="test code" />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has aria-label when no visible label', () => {
      render(<CopyButton text="test code" />)
      expect(screen.getByLabelText('Copy to clipboard')).toBeInTheDocument()
    })

    it('updates aria-label after copy', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<CopyButton text="test code" />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByLabelText('Copied!')).toBeInTheDocument()
      })
    })
  })
})
