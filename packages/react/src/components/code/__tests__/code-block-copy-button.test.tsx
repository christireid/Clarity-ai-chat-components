import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CodeBlockCopyButton } from '../CodeBlockCopyButton'

// Mock the CopyButton component to isolate testing
vi.mock('../../message/copy-button', () => ({
  CopyButton: vi.fn(({ text, onCopy, onError, iconOnly, className, ...props }) => (
    <button
      data-testid="mock-copy-button"
      data-text={text}
      data-icon-only={iconOnly}
      className={className}
      onClick={() => {
        if (text) {
          onCopy?.()
        } else {
          onError?.(new Error('No text'))
        }
      }}
      {...props}
    >
      Copy
    </button>
  )),
}))

describe('CodeBlockCopyButton', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders as a thin wrapper around CopyButton', () => {
      render(<CodeBlockCopyButton content="const x = 1" />)
      expect(screen.getByTestId('mock-copy-button')).toBeInTheDocument()
    })

    it('passes content as text prop to CopyButton', () => {
      render(<CodeBlockCopyButton content="const x = 1" />)
      expect(screen.getByTestId('mock-copy-button')).toHaveAttribute(
        'data-text',
        'const x = 1'
      )
    })

    it('enables iconOnly mode by default', () => {
      render(<CodeBlockCopyButton content="const x = 1" />)
      expect(screen.getByTestId('mock-copy-button')).toHaveAttribute(
        'data-icon-only',
        'true'
      )
    })
  })

  describe('callbacks', () => {
    it('forwards onCopy callback', async () => {
      const onCopy = vi.fn()
      render(<CodeBlockCopyButton content="const x = 1" onCopy={onCopy} />)
      await user.click(screen.getByTestId('mock-copy-button'))
      expect(onCopy).toHaveBeenCalled()
    })

    it('forwards onError callback', async () => {
      const onError = vi.fn()
      render(<CodeBlockCopyButton content="" onError={onError} />)
      await user.click(screen.getByTestId('mock-copy-button'))
      expect(onError).toHaveBeenCalled()
    })
  })

  describe('styling', () => {
    it('applies default styling classes', () => {
      render(<CodeBlockCopyButton content="const x = 1" />)
      const button = screen.getByTestId('mock-copy-button')
      expect(button.className).toContain('p-2')
      expect(button.className).toContain('rounded-md')
    })

    it('merges custom className with defaults', () => {
      render(
        <CodeBlockCopyButton content="const x = 1" className="custom-class" />
      )
      const button = screen.getByTestId('mock-copy-button')
      expect(button.className).toContain('custom-class')
      expect(button.className).toContain('p-2')
    })
  })

  describe('accessibility', () => {
    it('uses default aria-label "Copy code to clipboard"', () => {
      render(<CodeBlockCopyButton content="const x = 1" />)
      expect(screen.getByTestId('mock-copy-button')).toHaveAttribute(
        'aria-label',
        'Copy code to clipboard'
      )
    })

    it('accepts custom aria-label', () => {
      render(
        <CodeBlockCopyButton
          content="const x = 1"
          aria-label="Copy snippet"
        />
      )
      expect(screen.getByTestId('mock-copy-button')).toHaveAttribute(
        'aria-label',
        'Copy snippet'
      )
    })

    it('supports disabled state', () => {
      render(<CodeBlockCopyButton content="const x = 1" disabled />)
      expect(screen.getByTestId('mock-copy-button')).toBeDisabled()
    })
  })
})
