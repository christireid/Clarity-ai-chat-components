import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../badge'

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render badge with text', () => {
      render(<Badge>New</Badge>)
      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should render with default variant', () => {
      const { container } = render(<Badge>Default</Badge>)
      const badge = container.querySelector('.inline-flex')
      expect(badge).toBeInTheDocument()
    })

    it('should render with secondary variant', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>)
      const badge = container.querySelector('.bg-secondary')
      expect(badge).toBeInTheDocument()
    })

    it('should render with destructive variant', () => {
      const { container } = render(<Badge variant="destructive">Error</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-destructive')
    })

    it('should render with outline variant', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-background')
    })

    it('should render with success variant', () => {
      const { container } = render(<Badge variant="success">Success</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-success')
    })

    it('should render with warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-warning')
    })

    it('should render with info variant', () => {
      const { container } = render(<Badge variant="info">Info</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('bg-info')
    })

    it('should render with small size', () => {
      const { container } = render(<Badge size="sm">Small</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('text-[10px]')
    })

    it('should render with large size', () => {
      const { container } = render(<Badge size="lg">Large</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('text-sm')
    })
  })

  describe('Styling', () => {
    it('should apply default styles', () => {
      const { container } = render(<Badge>Badge</Badge>)
      const badge = container.querySelector('.inline-flex')
      expect(badge).toHaveClass('items-center', 'rounded-full')
    })

    it('should accept custom className', () => {
      const { container } = render(<Badge className="custom-badge">Custom</Badge>)
      const badge = container.querySelector('.custom-badge')
      expect(badge).toBeInTheDocument()
    })

    it('should have proper padding', () => {
      const { container } = render(<Badge>Badge</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
      expect(badge).toHaveClass('px-3')
    })
  })

  describe('Accessibility', () => {
    it('should render as div element', () => {
      const { container } = render(<Badge>Badge</Badge>)
      const badge = container.querySelector('div')
      expect(badge).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Badge aria-label="Status badge">New</Badge>)
      expect(screen.getByLabelText('Status badge')).toBeInTheDocument()
    })

    it('should support role attribute', () => {
      render(<Badge role="status">Active</Badge>)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should render with number', () => {
      render(<Badge>42</Badge>)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should render with icon', () => {
      const Icon = () => <span data-testid="icon">✓</span>
      render(
        <Badge>
          <Icon />
          Active
        </Badge>
      )
      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('Active')).toBeInTheDocument()
    })

    it('should render with complex content', () => {
      render(
        <Badge>
          <span>Count:</span> 5
        </Badge>
      )
      expect(screen.getByText(/Count:/)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })
})
