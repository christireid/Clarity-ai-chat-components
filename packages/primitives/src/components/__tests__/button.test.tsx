import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {
  const mockOnClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should render button with default variant', () => {
      const { container } = render(<Button>Default</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-primary')
    })

    it('should render button with destructive variant', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-destructive')
    })

    it('should render button with outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('border')
    })

    it('should render button with ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('should render button with link variant', () => {
      const { container } = render(<Button variant="link">Link</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('underline-offset-4')
    })

    it('should render button with small size', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('h-8')
    })

    it('should render button with large size', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('h-12')
    })

    it('should render button with icon size', () => {
      const { container } = render(<Button size="icon">Icon</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup()
      render(<Button onClick={mockOnClick}>Click me</Button>)

      const button = screen.getByRole('button')
      await user.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup()
      render(
        <Button onClick={mockOnClick} disabled>
          Disabled
        </Button>
      )

      const button = screen.getByRole('button')
      await user.click(button)

      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should show loading state', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      // Check for loading icon (if rendered)
    })
  })

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<Button>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<Button onClick={mockOnClick}>Keyboard</Button>)

      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument()
    })

    it('should support aria-disabled when disabled', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })
  })

  describe('Custom Props', () => {
    it('should accept custom className', () => {
      const { container } = render(<Button className="custom-class">Custom</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should accept custom data attributes', () => {
      render(<Button data-testid="custom-button">Custom</Button>)
      expect(screen.getByTestId('custom-button')).toBeInTheDocument()
    })

    it('should accept type prop', () => {
      render(<Button type="submit">Submit</Button>)
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    })
  })

  describe('State Management', () => {
    it('should handle loading state', () => {
      render(<Button loading>Loading</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should handle success state', () => {
      render(<Button state="success">Success</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('should handle error state', () => {
      render(<Button state="error">Error</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })
})
