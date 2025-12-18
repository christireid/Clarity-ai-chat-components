import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyButton } from '../copy-button'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    span: ({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span className={className} {...props}>
        {children}
      </span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock useReducedMotion hook
vi.mock('@clarity-chat/primitives', async () => {
  const actual = await vi.importActual('@clarity-chat/primitives')
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
    Button: ({ children, onClick, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button onClick={onClick} className={className} {...props}>
        {children}
      </button>
    ),
    Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  }
})

// Mock toast
vi.mock('../ui/toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

// Mock icons
vi.mock('../../ui/icons', () => ({
  CopyIcon: () => <span data-testid="copy-icon">Copy</span>,
  CheckIcon: () => <span data-testid="check-icon">Check</span>,
}))

// Mock clipboard hook
const mockCopy = vi.fn()
const mockCopied = { current: false }

vi.mock('../../../hooks/ui/use-clipboard', () => ({
  useClipboard: ({ onSuccess, onError }: { onSuccess?: () => void; onError?: (error: Error) => void }) => ({
    copy: async (text: string) => {
      try {
        await mockCopy(text)
        mockCopied.current = true
        onSuccess?.()
      } catch (error) {
        onError?.(error as Error)
        throw error
      }
    },
    copied: mockCopied.current,
  }),
}))

// Mock spring presets
vi.mock('../../../animations/spring-presets', () => ({
  getSpring: () => ({ type: 'spring' }),
}))

// Mock animation constants
vi.mock('../../../animations/constants', () => ({
  DURATION_SECONDS: { moderate: 0.3 },
}))

describe('CopyButton', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCopied.current = false
    mockCopy.mockResolvedValue(undefined)
  })

  describe('rendering', () => {
    it('renders with copy icon by default', () => {
      render(<CopyButton text="Hello world" />)
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
    })

    it('renders with text label by default', () => {
      render(<CopyButton text="Hello world" />)
      expect(screen.getByText('Copy')).toBeInTheDocument()
    })

    it('renders icon-only mode without text label', () => {
      render(<CopyButton text="Hello world" iconOnly />)
      expect(screen.getByTestId('copy-icon')).toBeInTheDocument()
      expect(screen.queryByText('Copy')).not.toBeInTheDocument()
    })

    it('uses custom copy text', () => {
      render(<CopyButton text="Hello world" copyText="Copy code" />)
      expect(screen.getByText('Copy code')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has accessible aria-label', () => {
      render(<CopyButton text="Hello world" />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy')
    })

    it('has screen reader status region', () => {
      render(<CopyButton text="Hello world" />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('screen reader region has aria-live="polite"', () => {
      render(<CopyButton text="Hello world" />)
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('copy functionality', () => {
    it('calls copy function when clicked', async () => {
      render(<CopyButton text="Hello world" />)
      await user.click(screen.getByRole('button'))
      expect(mockCopy).toHaveBeenCalledWith('Hello world')
    })

    it('calls onCopy callback on successful copy', async () => {
      const onCopy = vi.fn()
      render(<CopyButton text="Hello world" onCopy={onCopy} />)
      await user.click(screen.getByRole('button'))
      await waitFor(() => {
        expect(onCopy).toHaveBeenCalled()
      })
    })

    it('calls onError callback on copy failure', async () => {
      const onError = vi.fn()
      const error = new Error('Copy failed')
      mockCopy.mockRejectedValueOnce(error)

      render(<CopyButton text="Hello world" onError={onError} />)
      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error)
      })
    })
  })

  describe('custom props', () => {
    it('applies custom className', () => {
      render(<CopyButton text="Hello world" className="custom-button" />)
      expect(screen.getByRole('button')).toHaveClass('custom-button')
    })

    it('passes through other button props', () => {
      render(<CopyButton text="Hello world" disabled />)
      expect(screen.getByRole('button')).toBeDisabled()
    })
  })
})
