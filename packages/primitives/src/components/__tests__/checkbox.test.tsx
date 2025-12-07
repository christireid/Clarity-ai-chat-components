import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '../checkbox'

describe('Checkbox Component', () => {
  const mockOnChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render checkbox input', () => {
      render(<Checkbox />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should render unchecked by default', () => {
      render(<Checkbox />)
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should render checked when checked prop is true', () => {
      render(<Checkbox checked onChange={mockOnChange} />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('should render checked when defaultChecked is true', () => {
      render(<Checkbox defaultChecked />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })

    it('should render disabled checkbox', () => {
      render(<Checkbox disabled />)
      expect(screen.getByRole('checkbox')).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('should call onChange when clicked', async () => {
      const user = userEvent.setup()
      render(<Checkbox checked={false} onChange={mockOnChange} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(mockOnChange).toHaveBeenCalledTimes(1)
    })

    it('should toggle checked state', async () => {
      const user = userEvent.setup()
      const { rerender } = render(<Checkbox checked={false} onChange={mockOnChange} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      rerender(<Checkbox checked={true} onChange={mockOnChange} />)
      expect(checkbox).toBeChecked()
    })

    it('should not call onChange when disabled', async () => {
      const user = userEvent.setup()
      render(<Checkbox disabled onChange={mockOnChange} />)

      const checkbox = screen.getByRole('checkbox')
      await user.click(checkbox)

      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Checkbox checked={false} onChange={mockOnChange} />)

      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      await user.keyboard(' ')

      expect(mockOnChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Styling', () => {
    it('should apply default styles', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('h-4', 'w-4', 'rounded')
    })

    it('should accept custom className', () => {
      render(<Checkbox className="custom-checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('custom-checkbox')
    })

    it('should have proper focus styles', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('focus-visible:ring-[3px]')
    })
  })

  describe('Accessibility', () => {
    it('should have proper checkbox role', () => {
      render(<Checkbox />)
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Checkbox aria-label="Accept terms" />)
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
    })

    it('should support aria-checked', () => {
      render(<Checkbox checked aria-checked="true" onChange={mockOnChange} />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-checked', 'true')
    })

    it('should support aria-disabled when disabled', () => {
      render(<Checkbox disabled />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    it('should be focusable', () => {
      render(<Checkbox />)
      const checkbox = screen.getByRole('checkbox')
      checkbox.focus()
      expect(document.activeElement).toBe(checkbox)
    })
  })

  describe('Form Integration', () => {
    it('should work in a form', () => {
      render(
        <form>
          <Checkbox name="agree" value="yes" />
        </form>
      )
      const hiddenInput = document.querySelector(
        'input[data-checkbox-hidden-input]'
      ) as HTMLInputElement | null
      expect(hiddenInput).not.toBeNull()
      expect(hiddenInput!).toHaveAttribute('name', 'agree')
      expect(hiddenInput!).toHaveAttribute('value', 'yes')
    })

    it('should support required attribute', () => {
      render(<Checkbox required />)
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Controlled vs Uncontrolled', () => {
    it('should work as controlled component', () => {
      const { rerender } = render(<Checkbox checked={true} onChange={mockOnChange} />)
      expect(screen.getByRole('checkbox')).toBeChecked()

      rerender(<Checkbox checked={false} onChange={mockOnChange} />)
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should work as uncontrolled component', () => {
      render(<Checkbox defaultChecked />)
      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('Label Support', () => {
    it('should render label when provided', () => {
      render(<Checkbox label="Accept terms" />)
      expect(screen.getByText('Accept terms')).toBeInTheDocument()
    })

    it('should associate label with checkbox via htmlFor', () => {
      render(<Checkbox label="Accept terms" id="terms" />)
      const label = screen.getByText('Accept terms')
      expect(label).toHaveAttribute('for', 'terms')
    })

    it('should generate id if not provided for label association', () => {
      render(<Checkbox label="Accept terms" />)
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('Accept terms')
      expect(checkbox.id).toBeTruthy()
      expect(label).toHaveAttribute('for', checkbox.id)
    })

    it('should render required indicator when required', () => {
      render(<Checkbox label="Accept terms" required />)
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('should position label on left when labelPosition is left', () => {
      const { container } = render(<Checkbox label="Accept terms" labelPosition="left" />)
      const wrapper = container.querySelector('.flex-row-reverse')
      expect(wrapper).toBeInTheDocument()
    })

    it('should position label on right by default', () => {
      const { container } = render(<Checkbox label="Accept terms" />)
      const wrapper = container.querySelector('.flex-row-reverse')
      expect(wrapper).not.toBeInTheDocument()
    })

    it('should make label clickable to toggle checkbox', async () => {
      const user = userEvent.setup()
      render(<Checkbox label="Accept terms" onChange={mockOnChange} />)

      await user.click(screen.getByText('Accept terms'))
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should display error message when error prop is provided', () => {
      render(<Checkbox error="This field is required" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('should set aria-invalid when error is present', () => {
      render(<Checkbox error="Error" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    })

    it('should link error message via aria-describedby', () => {
      render(<Checkbox error="Error message" id="my-checkbox" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-describedby', 'my-checkbox-error')
    })

    it('should apply error styling to checkbox border', () => {
      render(<Checkbox error="Error" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('border-destructive')
    })

    it('should display error with label', () => {
      render(<Checkbox label="Terms" error="Required" />)
      expect(screen.getByText('Terms')).toBeInTheDocument()
      expect(screen.getByText('Required')).toBeInTheDocument()
    })
  })

  describe('ARIA Attributes', () => {
    it('should set aria-required when required', () => {
      render(<Checkbox required />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-required', 'true')
    })

    it('should not set aria-label when label is present', () => {
      render(<Checkbox label="Terms" aria-label="Alt label" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).not.toHaveAttribute('aria-label')
    })

    it('should set aria-label when no visible label', () => {
      render(<Checkbox aria-label="Hidden label" />)
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('aria-label', 'Hidden label')
    })
  })
})
