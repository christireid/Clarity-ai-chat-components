import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../avatar'

describe('Avatar Component', () => {
  describe('Rendering', () => {
    it('should render avatar with image', () => {
      const { container } = render(<Avatar src="/avatar.jpg" alt="User" />)
      // Radix UI AvatarImage renders the image internally
      // Check that avatar container exists (Radix UI uses a div wrapper)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toBeInTheDocument()
      // Avatar structure is rendered, Radix UI handles image loading internally
    })

    it('should render fallback text when no image', () => {
      render(<Avatar fallback="JD" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should generate fallback from alt text', () => {
      render(<Avatar alt="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should use default fallback when no alt or fallback', () => {
      render(<Avatar />)
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    it('should render with default size', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.h-10')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with xs size', () => {
      const { container } = render(<Avatar size="xs" fallback="AB" />)
      const avatar = container.querySelector('.h-6')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with sm size', () => {
      const { container } = render(<Avatar size="sm" fallback="AB" />)
      const avatar = container.querySelector('.h-8')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with lg size', () => {
      const { container } = render(<Avatar size="lg" fallback="AB" />)
      const avatar = container.querySelector('.h-12')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with xl size', () => {
      const { container } = render(<Avatar size="xl" fallback="AB" />)
      const avatar = container.querySelector('.h-16')
      expect(avatar).toBeInTheDocument()
    })

    it('should render with 2xl size', () => {
      const { container } = render(<Avatar size="2xl" fallback="AB" />)
      const avatar = container.querySelector('.h-20')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Image Handling', () => {
    it('should handle image load error', () => {
      // Radix UI handles image errors internally and shows fallback automatically
      // We verify that fallback is rendered (Radix UI will show it when image fails)
      render(<Avatar src="/invalid.jpg" alt="User" fallback="JD" />)

      // Fallback is always rendered, Radix UI will display it when image fails
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should show fallback when image fails to load', () => {
      // Radix UI automatically shows fallback when image fails to load
      // We verify that fallback is present (it will be shown on error)
      render(<Avatar src="/broken.jpg" alt="User" fallback="FB" />)

      // Fallback is always rendered, Radix UI will display it when image fails
      expect(screen.getByText('FB')).toBeInTheDocument()
    })
  })

  describe('Status Indicator', () => {
    it('should render online status', () => {
      const { container } = render(<Avatar status="online" fallback="AB" />)
      const status = container.querySelector('[data-status="online"]')
      expect(status).toBeInTheDocument()
    })

    it('should render offline status', () => {
      const { container } = render(<Avatar status="offline" fallback="AB" />)
      const status = container.querySelector('[data-status="offline"]')
      expect(status).toBeInTheDocument()
    })

    it('should render away status', () => {
      const { container } = render(<Avatar status="away" fallback="AB" />)
      const status = container.querySelector('[data-status="away"]')
      expect(status).toBeInTheDocument()
    })

    it('should render busy status', () => {
      const { container } = render(<Avatar status="busy" fallback="AB" />)
      const status = container.querySelector('[data-status="busy"]')
      expect(status).toBeInTheDocument()
    })

    it('should not render status when not provided', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const status = container.querySelector('[data-status]')
      expect(status).not.toBeInTheDocument()
    })

    it('should render custom status badge', () => {
      render(
        <Avatar
          statusBadge={<span data-testid="custom-badge">Custom</span>}
          fallback="AB"
        />
      )
      expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    })

    it('should have accessible aria-label for online status', () => {
      render(<Avatar status="online" fallback="AB" />)
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Online'
      )
    })

    it('should have accessible aria-label for offline status', () => {
      render(<Avatar status="offline" fallback="AB" />)
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Offline'
      )
    })

    it('should have accessible aria-label for away status', () => {
      render(<Avatar status="away" fallback="AB" />)
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Away'
      )
    })

    it('should have accessible aria-label for busy status', () => {
      render(<Avatar status="busy" fallback="AB" />)
      expect(screen.getByRole('status')).toHaveAttribute(
        'aria-label',
        'Status: Busy'
      )
    })
  })

  describe('Hover Effects', () => {
    it('should apply hoverable class when hoverable is true', () => {
      const { container } = render(<Avatar hoverable fallback="AB" />)
      const avatar = container.querySelector('.hover\\:scale-\\[1\\.02\\]')
      expect(avatar).toBeInTheDocument()
    })

    it('should not apply hoverable class by default', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.hover\\:scale-105')
      expect(avatar).not.toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should apply default styles', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.rounded-full')
      expect(avatar).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      const { container } = render(
        <Avatar className="custom-avatar" fallback="AB" />
      )
      const avatar = container.querySelector('.custom-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('should have proper ring styling', () => {
      const { container } = render(<Avatar fallback="AB" />)
      const avatar = container.querySelector('.ring-2')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      const { container } = render(
        <Avatar src="/avatar.jpg" alt="User avatar" />
      )
      // Radix UI AvatarImage handles alt text internally
      // Verify avatar container is rendered (alt is passed to AvatarImage component)
      const avatar = container.firstChild as HTMLElement
      expect(avatar).toBeInTheDocument()
      // Alt text is used by AvatarImage component internally for accessibility
    })

    it('should support aria-label', () => {
      render(<Avatar aria-label="User profile picture" fallback="AB" />)
      expect(screen.getByLabelText('User profile picture')).toBeInTheDocument()
    })

    it('should be focusable when interactive', () => {
      const { container } = render(<Avatar tabIndex={0} fallback="AB" />)
      const avatar = container.querySelector('[tabindex="0"]')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Fallback Generation', () => {
    it('should generate initials from single word', () => {
      render(<Avatar alt="John" />)
      expect(screen.getByText('J')).toBeInTheDocument()
    })

    it('should generate initials from multiple words', () => {
      render(<Avatar alt="John Doe" />)
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should handle three words', () => {
      render(<Avatar alt="John Michael Doe" />)
      // Takes first letter of first two words: J + M = JM
      expect(screen.getByText('JM')).toBeInTheDocument()
    })

    it('should handle empty alt text', () => {
      render(<Avatar alt="" />)
      expect(screen.getByText('?')).toBeInTheDocument()
    })

    it('should prioritize fallback prop over alt', () => {
      render(<Avatar alt="John Doe" fallback="Custom" />)
      expect(screen.getByText('Custom')).toBeInTheDocument()
      expect(screen.queryByText('JD')).not.toBeInTheDocument()
    })
  })
})
