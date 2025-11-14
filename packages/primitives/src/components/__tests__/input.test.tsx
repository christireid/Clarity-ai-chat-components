import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../input'

describe('Input Component', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text..." />)
      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
    })

    it('should render with value', () => {
      render(<Input value="Test value" onChange={mockOnChange} />)
      expect(screen.getByDisplayValue('Test value')).toBeInTheDocument()
    })

    it('should render with default variant', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
    })

    it('should render with error variant', () => {
      const { container } = render(<Input variant="error" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('ring-destructive')
    })

    it('should render with success variant', () => {
      const { container } = render(<Input variant="success" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('ring-green-500')
    })

    it('should render with small size', () => {
      const { container } = render(<Input inputSize="sm" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('h-8')
    })

    it('should render with large size', () => {
      const { container } = render(<Input inputSize="lg" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('h-12')
    })

    it('should render with icon on left', () => {
      const Icon = () => <span data-testid="icon">🔍</span>
      render(<Input icon={<Icon />} iconPosition="left" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })

    it('should render with icon on right', () => {
      const Icon = () => <span data-testid="icon">✓</span>
      render(<Input icon={<Icon />} iconPosition="right" />)
      expect(screen.getByTestId('icon')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onChange when typing', async () => {
      const user = userEvent.setup()
      render(<Input value="" onChange={mockOnChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')

      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should update value on change', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<Input value="" onChange={mockOnChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Test')

      rerender(<Input value="Test" onChange={mockOnChange} />)
      expect(screen.getByDisplayValue('Test')).toBeInTheDocument()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup()
      render(<Input disabled value="" onChange={mockOnChange} />)

      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')

      expect(mockOnChange).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should display error message', () => {
      render(<Input error="This field is required" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('should apply error variant when error prop is provided', () => {
      const { container } = render(<Input error="Error message" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('ring-destructive')
    })

    it('should show error message with ErrorMessage component', () => {
      render(<Input error="Validation failed" />)
      const errorMessage = screen.getByText('Validation failed')
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveClass('text-destructive')
    })
  })

  describe('Accessibility', () => {
    it('should have proper input role', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Input aria-label="Email address" />)
      expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    })

    it('should support aria-describedby for error messages', () => {
      render(<Input error="Error message" aria-describedby="error-id" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby')
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Input value="" onChange={mockOnChange} />)

      const input = screen.getByRole('textbox')
      input.focus()
      await user.keyboard('Hello')

      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Input Types', () => {
    it('should render email input type', () => {
      render(<Input type="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
    })

    it('should render password input type', () => {
      const { container } = render(<Input type="password" />)
      const input = container.querySelector('input[type="password"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should render number input type', () => {
      render(<Input type="number" />)
      const input = screen.getByRole('spinbutton') || screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Input className="custom-class" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('custom-class')
    })

    it('should accept custom data attributes', () => {
      render(<Input data-testid="custom-input" />)
      expect(screen.getByTestId('custom-input')).toBeInTheDocument()
    })

    it('should accept name attribute', () => {
      render(<Input name="email" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'email')
    })

    it('should accept required attribute', () => {
      render(<Input required />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })
  })
})
