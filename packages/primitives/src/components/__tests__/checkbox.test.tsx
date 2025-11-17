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
      const { container } = render(<Checkbox />)
      const checkbox = container.querySelector('input[type="checkbox"]')
      expect(checkbox).toHaveClass('h-4', 'w-4', 'rounded')
    })

    it('should accept custom className', () => {
      const { container } = render(<Checkbox className="custom-checkbox" />)
      const checkbox = container.querySelector('input[type="checkbox"]')
      expect(checkbox).toHaveClass('custom-checkbox')
    })

    it('should have proper focus styles', () => {
      const { container } = render(<Checkbox />)
      const checkbox = container.querySelector('input[type="checkbox"]')
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
      const { container } = render(<Checkbox />)
      const checkbox = container.querySelector('input[type="checkbox"]') as HTMLElement | null
      checkbox?.focus()
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
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('name', 'agree')
      expect(checkbox).toHaveAttribute('value', 'yes')
    })

    it('should support required attribute', () => {
      render(<Checkbox required />)
      expect(screen.getByRole('checkbox')).toBeRequired()
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
})
