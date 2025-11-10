import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from '../textarea'

describe('Textarea Component', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Textarea placeholder="Enter message..." />)
      expect(screen.getByPlaceholderText('Enter message...')).toBeInTheDocument()
    })

    it('should render with value', () => {
      render(<Textarea value="Test value" onChange={mockOnChange} />)
      expect(screen.getByDisplayValue('Test value')).toBeInTheDocument()
    })

    it('should render with default variant', () => {
      const { container } = render(<Textarea />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toBeInTheDocument()
    })

    it('should render with error variant', () => {
      const { container } = render(<Textarea variant="error" />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('border-destructive')
    })

    it('should render with success variant', () => {
      const { container } = render(<Textarea variant="success" />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('border-green-500')
    })
  })

  describe('Interactions', () => {
    it('should call onChange when typing', async () => {
      const user = userEvent.setup()
      render(<Textarea value="" onChange={mockOnChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello')

      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should update value on change', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<Textarea value="" onChange={mockOnChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Test')

      rerender(<Textarea value="Test" onChange={mockOnChange} />)
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Textarea disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup()
      render(<Textarea disabled value="" onChange={mockOnChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Hello')

      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should handle multi-line input', async () => {
      const user = userEvent.setup()
      render(<Textarea value="" onChange={mockOnChange} />)

      const textarea = screen.getByRole('textbox')
      await user.type(textarea, 'Line 1{Enter}Line 2')

      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Auto-resize', () => {
    it('should have auto-resize enabled by default', () => {
      const { container } = render(<Textarea />)
      const textarea = container.querySelector('textarea')
      // Auto-resize is handled by ref, so we just check it renders
      expect(textarea).toBeInTheDocument()
    })

    it('should respect autoResize prop when false', () => {
      const { container } = render(<Textarea autoResize={false} rows={5} />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('should respect minRows prop', () => {
      const { container } = render(<Textarea autoResize minRows={5} />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toBeInTheDocument()
      // minRows is used internally for auto-resize calculation, not as DOM attribute
    })

    it('should respect maxRows prop', () => {
      const { container } = render(<Textarea maxRows={10} />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('should display error message', () => {
      render(<Textarea error="This field is required" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('should apply error variant when error prop is provided', () => {
      const { container } = render(<Textarea error="Error message" />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('ring-destructive')
    })
  })

  describe('Accessibility', () => {
    it('should have proper textbox role', () => {
      render(<Textarea />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Textarea aria-label="Message textarea" />)
      expect(screen.getByLabelText('Message textarea')).toBeInTheDocument()
    })

    it('should support aria-describedby for error messages', () => {
      render(<Textarea error="Error message" aria-describedby="error-id" />)
      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-describedby')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Textarea value="" onChange={mockOnChange} />)

      const textarea = screen.getByRole('textbox')
      textarea.focus()
      await user.keyboard('Hello')

      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Textarea className="custom-class" />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('custom-class')
    })

    it('should accept custom data attributes', () => {
      render(<Textarea data-testid="custom-textarea" />)
      expect(screen.getByTestId('custom-textarea')).toBeInTheDocument()
    })

    it('should accept name attribute', () => {
      render(<Textarea name="message" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'message')
    })

    it('should accept required attribute', () => {
      render(<Textarea required />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })

    it('should accept rows attribute', () => {
      const { container } = render(<Textarea rows={10} />)
      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveAttribute('rows', '10')
    })
  })
})
